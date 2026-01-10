# 09_ERD_OVERVIEW.md

## ERD Overview Aplikasi Farmasi (POS Multicabang + Batch/Expired + RBAC + Analitik)

### Tujuan
Dokumen ini berisi gambaran ERD (Entity Relationship Diagram) tingkat tinggi untuk:
- POS farmasi multicabang
- Manajemen stok dengan batch & expired (FEFO)
- Resep (racikan & non-racikan)
- Pembelian & penerimaan
- RBAC + approval + audit log
- Basis data analitik & forecasting

Catatan:
- Ini adalah **overview** (level arsitektur).
- Detail field bisa diturunkan ke schema DB (MVP) setelah ini.

---

## A. Entitas Utama (Core)

### 1) Cabang & Lokasi
- `branches` (cabang)
- `warehouses` (gudang per cabang, opsional jika 1 cabang = 1 gudang)

Relasi:
- branches 1..N warehouses

---

### 2) User & RBAC
- `users`
- `roles`
- `permissions`
- `role_permissions`
- `user_roles`
- `approval_requests`
- `audit_logs`

Relasi:
- users N..N roles (user_roles)
- roles N..N permissions (role_permissions)
- approval_requests: requester_user_id, approver_user_id
- audit_logs: actor_user_id

---

### 3) Produk & Master Data
- `products`
- `product_barcodes`
- `product_categories`
- `units`
- `product_unit_conversions`
- `suppliers`
- `customers` (opsional)

Relasi:
- products 1..N product_barcodes
- products N..1 product_categories
- products N..N units via conversions (opsional)
- suppliers 1..N purchase_orders

---

## B. Stok Berbasis Batch & Expired (Wajib Farmasi)

### 4) Batch Inventory
- `product_batches`
  - (product_id, branch_id, batch_no, expired_at, status)
- `stock_balances`
  - stok agregat per produk per cabang (cache cepat)
- `stock_movements`
  - kartu stok (append-only)

Relasi:
- products 1..N product_batches
- branches 1..N product_batches
- product_batches 1..N stock_movements
- products/branches 1..N stock_balances

Catatan:
- FEFO dilakukan dengan memilih product_batches dengan expired terdekat yang statusnya aktif.

---

## C. POS & Transaksi

### 5) Transaksi Penjualan
- `pos_shifts`
- `sales_orders` (header/invoice)
- `sales_order_items` (detail item)
- `payments`
- `refunds` (retur/refund)
- `void_requests` (atau masuk ke approval_requests)

Relasi:
- users 1..N pos_shifts
- pos_shifts 1..N sales_orders
- sales_orders 1..N sales_order_items
- sales_orders 1..N payments
- sales_orders 0..N refunds

Relasi stok:
- setiap sales_order_items mengurangi stok via stock_movements yang mengacu ke product_batches (batch yang dipakai)

---

## D. Resep & Pelayanan Farmasi

### 6) Resep
- `prescriptions` (header)
- `prescription_items` (non-racikan)
- `prescription_compounds` (racikan header)
- `prescription_compound_items` (komponen racikan)
- `prescription_validations`

Relasi:
- prescriptions 1..N prescription_items
- prescriptions 1..N prescription_compounds
- prescription_compounds 1..N prescription_compound_items
- prescriptions 0..1 linked_sales_order (setelah dibayar)

Catatan:
- Apoteker melakukan validasi → prescription_validations.

---

## E. Pembelian & Supplier

### 7) Pembelian
- `purchase_orders`
- `purchase_order_items`
- `goods_receipts` (GRN)
- `goods_receipt_items`
- `purchase_invoices` (hutang supplier, opsional)
- `purchase_returns`

Relasi:
- suppliers 1..N purchase_orders
- purchase_orders 1..N purchase_order_items
- purchase_orders 1..N goods_receipts
- goods_receipts 1..N goods_receipt_items

Relasi stok:
- goods_receipt_items menambah stok via stock_movements dan membuat/menambah product_batches.

---

## F. Multi Cabang & Transfer Stok

### 8) Transfer
- `stock_transfers` (header)
- `stock_transfer_items` (detail batch + qty)

Relasi:
- branches (asal) 1..N stock_transfers
- branches (tujuan) 1..N stock_transfers
- stock_transfers 1..N stock_transfer_items

Relasi stok:
- Saat shipped: kurangi stok cabang asal (stock_movements out)
- Saat received: tambah stok cabang tujuan (stock_movements in)

---

## G. Promo & Pricing (Opsional tapi umum)

### 9) Harga & Promo
- `price_lists` (per cabang / global)
- `product_prices`
- `promotions`
- `promotion_rules`
- `promotion_redemptions`

Relasi:
- branches 1..N price_lists
- price_lists 1..N product_prices
- promotions 1..N promotion_rules
- sales_orders 1..N promotion_redemptions (opsional)

---

## H. Analitik & Forecasting

### 10) Data Mart (Ringkas untuk AI/BI)
Untuk performa, biasanya dibuat tabel agregat/warehouse:

- `fact_sales_daily` (branch_id, product_id, date, qty, revenue, cogs, profit)
- `fact_stock_daily` (branch_id, product_id, date, on_hand, near_expired_qty)
- `forecast_demands` (branch_id, product_id, period, forecast_qty, model_version)
- `reorder_recommendations` (branch_id, product_id, recommended_qty, recommended_date, reason)

Sumber:
- Diisi dari job ETL/queue (harian/jam-an)

---

## I. Relasi Kunci (Ringkas)

branches ──< warehouses

users ──< pos_shifts ──< sales_orders ──< sales_order_items ──> product_batches
sales_orders ──< payments
sales_orders ──< refunds

products ──< product_batches ──< stock_movements
products ──< product_barcodes
products ──> categories

suppliers ──< purchase_orders ──< purchase_order_items
purchase_orders ──< goods_receipts ──< goods_receipt_items ──> product_batches

prescriptions ──< prescription_items / compounds ──< compound_items
prescriptions ──> (optional) sales_orders

stock_transfers ──< stock_transfer_items ──> product_batches

roles ──< role_permissions >── permissions
users ──< user_roles >── roles

approval_requests (requester_user_id, approver_user_id)
audit_logs (actor_user_id)


---

## J. Catatan MVP (Minimal Tabel Wajib)
Jika target MVP cepat jalan, minimal:
- branches, users, roles, permissions, user_roles, role_permissions
- products, product_barcodes, categories
- product_batches, stock_movements, stock_balances
- pos_shifts, sales_orders, sales_order_items, payments
- suppliers, purchase_orders, purchase_order_items, goods_receipts, goods_receipt_items
- approval_requests, audit_logs

Resep & promo bisa phase berikutnya.

---
