# 10_DB_SCHEMA_MVP.md

## DB Schema MVP (Farmasi POS Multicabang + Batch/Expired + RBAC + Approval + Audit)

### Prinsip Desain
- Semua data operasional wajib punya `branch_id`
- Stok berbasis **batch + expired** (FEFO)
- Perubahan stok hanya lewat **stock_movements** (append-only)
- Transaksi POS hanya valid jika ada **shift aktif**
- Aksi sensitif wajib masuk **approval_requests** + **audit_logs**

Catatan tipe data di bawah bersifat umum (PostgreSQL/MySQL). Silakan sesuaikan.

---

# A) CORE ORG

## 1) branches
**Tujuan:** master cabang

Fields:
- id (PK)
- code (unique)
- name
- address (text, nullable)
- phone (nullable)
- is_active (bool, default true)
- created_at, updated_at

Indexes:
- unique(code)
- index(is_active)

---

## 2) warehouses (opsional, jika 1 cabang bisa multi gudang)
Fields:
- id (PK)
- branch_id (FK -> branches.id)
- name
- is_default (bool)
- created_at, updated_at

Indexes:
- index(branch_id)
- unique(branch_id, is_default) (opsional: hanya 1 default)

---

# B) USERS & RBAC

## 3) users
Fields:
- id (PK)
- branch_id (FK -> branches.id, nullable untuk owner/global)
- name
- email (unique, nullable)
- phone (nullable)
- password_hash
- status (enum: active, disabled)
- last_login_at (nullable)
- created_at, updated_at

Indexes:
- unique(email)
- index(branch_id, status)

---

## 4) roles
Fields:
- id (PK)
- code (unique)  // kasir, apoteker, gudang, manager, owner
- name
- scope (enum: branch, global) // owner/global
- created_at, updated_at

Indexes:
- unique(code)

---

## 5) permissions
Fields:
- id (PK)
- key (unique) // contoh: pos.transaction.create
- description (nullable)
- created_at, updated_at

Indexes:
- unique(key)

---

## 6) user_roles
Fields:
- id (PK)
- user_id (FK -> users.id)
- role_id (FK -> roles.id)
- branch_id (FK -> branches.id, nullable) // jika role per cabang
- created_at

Indexes:
- unique(user_id, role_id, branch_id)
- index(user_id)
- index(role_id)

---

## 7) role_permissions
Fields:
- id (PK)
- role_id (FK -> roles.id)
- permission_id (FK -> permissions.id)
- created_at

Indexes:
- unique(role_id, permission_id)
- index(role_id)

---

# C) MASTER DATA PRODUK

## 8) product_categories
Fields:
- id (PK)
- name
- created_at, updated_at

Indexes:
- unique(name)

---

## 9) units
Fields:
- id (PK)
- name (unique) // tablet, strip, box
- created_at, updated_at

---

## 10) products
Fields:
- id (PK)
- sku (unique, nullable)
- name
- generic_name (nullable)
- category_id (FK -> product_categories.id)
- base_unit_id (FK -> units.id)
- is_prescription_required (bool, default false)
- is_active (bool, default true)
- created_at, updated_at

Indexes:
- unique(sku)
- index(category_id)
- index(is_active)

---

## 11) product_barcodes
Fields:
- id (PK)
- product_id (FK -> products.id)
- barcode (unique)
- created_at

Indexes:
- unique(barcode)
- index(product_id)

---

# D) INVENTORY (BATCH/EXPIRED + MOVEMENTS)

## 12) product_batches
**Tujuan:** identitas batch per cabang (dan gudang opsional)

Fields:
- id (PK)
- branch_id (FK -> branches.id)
- warehouse_id (FK -> warehouses.id, nullable)
- product_id (FK -> products.id)
- batch_no (string)
- expired_at (date)
- status (enum: active, locked, recalled, expired, damaged)
- notes (nullable)
- created_at, updated_at

Constraints:
- unique(branch_id, product_id, batch_no, expired_at)

Indexes:
- index(branch_id, product_id, status)
- index(product_id, expired_at)
- index(expired_at)

---

## 13) stock_balances
**Tujuan:** cache stok cepat per produk per cabang (bukan sumber kebenaran)

Fields:
- id (PK)
- branch_id (FK)
- warehouse_id (FK, nullable)
- product_id (FK)
- on_hand_qty (decimal/int)
- reserved_qty (decimal/int, default 0) // opsional, jika hold/reservation
- updated_at

Constraints:
- unique(branch_id, warehouse_id, product_id)

Indexes:
- index(branch_id, product_id)

Catatan:
- on_hand_qty dihitung dari akumulasi stock_movements (sinkron via trigger/job)

---

## 14) stock_movements
**Tujuan:** kartu stok append-only (sumber kebenaran)

Fields:
- id (PK)
- branch_id (FK)
- warehouse_id (FK, nullable)
- product_id (FK)
- batch_id (FK -> product_batches.id, nullable untuk non-batch item; tapi farmasi idealnya wajib)
- ref_type (enum: sale, purchase, transfer_out, transfer_in, adjustment, refund, void_reversal)
- ref_id (bigint) // id dokumen referensi (sales_order_id, grn_id, dst)
- direction (enum: in, out)
- qty (decimal/int) // selalu positif, arah ditentukan oleh direction
- unit_id (FK -> units.id, nullable) // jika butuh
- happened_at (datetime)
- created_by (FK -> users.id)
- notes (nullable)

Indexes:
- index(branch_id, product_id, happened_at)
- index(batch_id, happened_at)
- index(ref_type, ref_id)

Aturan:
- Tidak boleh update/delete (append-only)
- Semua perubahan stok harus lewat tabel ini

---

# E) POS (SHIFT, ORDER, PAYMENT)

## 15) pos_shifts
Fields:
- id (PK)
- branch_id (FK)
- user_id (FK -> users.id) // kasir
- opened_at (datetime)
- closed_at (datetime, nullable)
- opening_cash (decimal, default 0)
- closing_cash_expected (decimal, nullable)
- closing_cash_actual (decimal, nullable)
- cash_diff (decimal, nullable)
- status (enum: open, closed)
- notes (nullable)

Indexes:
- index(branch_id, status)
- index(user_id, opened_at)

Constraint:
- (opsional) 1 kasir hanya punya 1 shift open per cabang

---

## 16) sales_orders
Fields:
- id (PK)
- branch_id (FK)
- shift_id (FK -> pos_shifts.id)
- cashier_user_id (FK -> users.id)
- order_no (unique per cabang)
- customer_id (FK -> customers.id, nullable) // jika dipakai
- status (enum: draft, pending_approval, paid, voided, refunded)
- subtotal (decimal)
- discount_total (decimal, default 0)
- tax_total (decimal, default 0)
- grand_total (decimal)
- paid_at (datetime, nullable)
- voided_at (datetime, nullable)
- created_at, updated_at

Indexes:
- unique(branch_id, order_no)
- index(branch_id, status, created_at)
- index(shift_id)

Rules:
- status `paid` hanya jika ada payment sukses
- void/refund wajib audit + approval (sesuai matrix)

---

## 17) sales_order_items
Fields:
- id (PK)
- sales_order_id (FK -> sales_orders.id)
- product_id (FK)
- batch_id (FK -> product_batches.id, nullable tapi disarankan wajib)
- qty (decimal/int)
- unit_price (decimal)
- discount (decimal, default 0)
- line_total (decimal)
- created_at

Indexes:
- index(sales_order_id)
- index(product_id)
- index(batch_id)

Catatan:
- FEFO: batch dipilih otomatis saat item ditambahkan

---

## 18) payments
Fields:
- id (PK)
- sales_order_id (FK -> sales_orders.id)
- method (enum: cash, qris, transfer, card, split)
- amount (decimal)
- reference_no (nullable) // trx id dari gateway
- status (enum: pending, success, failed, reversed)
- paid_at (datetime, nullable)
- created_at

Indexes:
- index(sales_order_id)
- index(status, paid_at)

---

## 19) refunds (retur/refund)
Fields:
- id (PK)
- branch_id (FK)
- sales_order_id (FK -> sales_orders.id) // transaksi asli
- refund_no (unique per cabang)
- reason (text)
- status (enum: pending_approval, approved, rejected, completed)
- refund_total (decimal)
- created_by (FK -> users.id)
- approved_by (FK -> users.id, nullable)
- created_at, updated_at

Indexes:
- unique(branch_id, refund_no)
- index(branch_id, status)
- index(sales_order_id)

Catatan:
- Refund completion akan membuat stock_movements (in) sesuai item yang diretur

---

## 20) refund_items
Fields:
- id (PK)
- refund_id (FK -> refunds.id)
- product_id (FK)
- batch_id (FK -> product_batches.id, nullable)
- qty (decimal/int)
- unit_price (decimal)
- line_total (decimal)

Indexes:
- index(refund_id)
- index(product_id)
- index(batch_id)

---

# F) SUPPLIERS & PURCHASING (PO + GRN)

## 21) suppliers
Fields:
- id (PK)
- name
- phone (nullable)
- address (nullable)
- is_active (bool, default true)
- created_at, updated_at

Indexes:
- unique(name)

---

## 22) purchase_orders
Fields:
- id (PK)
- branch_id (FK)
- supplier_id (FK -> suppliers.id)
- po_no (unique per cabang)
- status (enum: open, partial, closed, cancelled)
- ordered_at (datetime)
- created_by (FK -> users.id)
- approved_by (FK -> users.id, nullable)
- notes (nullable)
- created_at, updated_at

Indexes:
- unique(branch_id, po_no)
- index(branch_id, status, ordered_at)

---

## 23) purchase_order_items
Fields:
- id (PK)
- purchase_order_id (FK -> purchase_orders.id)
- product_id (FK)
- qty_ordered (decimal/int)
- unit_cost_est (decimal, nullable)
- created_at

Indexes:
- index(purchase_order_id)
- index(product_id)

---

## 24) goods_receipts (GRN)
Fields:
- id (PK)
- branch_id (FK)
- purchase_order_id (FK -> purchase_orders.id, nullable)
- grn_no (unique per cabang)
- received_at (datetime)
- received_by (FK -> users.id)
- notes (nullable)
- created_at, updated_at

Indexes:
- unique(branch_id, grn_no)
- index(branch_id, received_at)

---

## 25) goods_receipt_items
Fields:
- id (PK)
- goods_receipt_id (FK -> goods_receipts.id)
- product_id (FK)
- batch_no (string)
- expired_at (date)
- qty_received (decimal/int)
- unit_cost (decimal)
- created_at

Indexes:
- index(goods_receipt_id)
- index(product_id)
- index(expired_at)

Rules:
- Saat posting GRN:
  - upsert product_batches (branch+product+batch_no+expired_at)
  - create stock_movements (in) referencing batch_id

---

# G) TRANSFER ANTAR CABANG

## 26) stock_transfers
Fields:
- id (PK)
- from_branch_id (FK -> branches.id)
- to_branch_id (FK -> branches.id)
- transfer_no (unique global atau per from_branch)
- status (enum: requested, approved, shipped, received, cancelled)
- requested_by (FK -> users.id)
- approved_by (FK -> users.id, nullable)
- shipped_at (datetime, nullable)
- received_at (datetime, nullable)
- notes (nullable)
- created_at, updated_at

Indexes:
- unique(transfer_no)
- index(from_branch_id, status)
- index(to_branch_id, status)

---

## 27) stock_transfer_items
Fields:
- id (PK)
- stock_transfer_id (FK -> stock_transfers.id)
- product_id (FK)
- batch_id (FK -> product_batches.id) // batch di cabang asal
- qty (decimal/int)

Indexes:
- index(stock_transfer_id)
- index(product_id)
- index(batch_id)

Rules:
- Saat shipped: stock_movements out dari from_branch (ref transfer_id)
- Saat received: stock_movements in ke to_branch
  - batch bisa dibuat ulang di cabang tujuan (batch_no & expired_at ikut)

---

# H) APPROVAL & AUDIT

## 28) approval_requests
Fields:
- id (PK)
- branch_id (FK, nullable untuk global)
- request_type (enum: discount, void, refund, adjustment, price_below_cogs, etc)
- ref_type (string/enum)  // sales_order, refund, adjustment, product_price
- ref_id (bigint)
- requester_user_id (FK -> users.id)
- approver_user_id (FK -> users.id, nullable)
- status (enum: pending, approved, rejected, cancelled)
- risk_level (enum: low, medium, high)
- amount_impact (decimal, nullable)
- reason (text)
- decided_at (datetime, nullable)
- decision_note (text, nullable)
- created_at, updated_at

Indexes:
- index(status, created_at)
- index(branch_id, status)
- index(ref_type, ref_id)
- index(requester_user_id)

---

## 29) audit_logs
**Append-only**

Fields:
- id (PK)
- branch_id (FK, nullable)
- actor_user_id (FK -> users.id)
- action (string) // e.g. "pos.discount.request"
- entity_type (string) // "sales_order"
- entity_id (bigint)
- before_data (json, nullable)
- after_data (json, nullable)
- meta (json, nullable) // ip, device, etc
- created_at

Indexes:
- index(branch_id, created_at)
- index(actor_user_id, created_at)
- index(entity_type, entity_id)

Rules:
- Tidak boleh update/delete
- Semua aksi sensitif wajib log before/after

---

# I) OPTIONAL (TAPI SERING DIPAKAI)

## 30) customers (member)
Fields:
- id (PK)
- branch_id (FK, nullable jika global)
- name
- phone (unique, nullable)
- points (int, default 0)
- created_at, updated_at

Indexes:
- unique(phone)
- index(branch_id)

---

# J) CONSTRAINT & INDEX PENTING (Wajib Dibahas di Implementasi)

## FEFO Query (Batch selection)
Tujuan: ambil batch paling dekat expired, stok masih ada, status aktif.

Index yang membantu:
- product_batches (branch_id, product_id, status, expired_at)
- stock_movements (batch_id, happened_at)

Saran tambahan (opsional):
- buat view/materialized view stok per batch (on_hand per batch) untuk seleksi cepat

---

## Idempotency & Konsistensi
- Posting GRN/Payment/Refund/Transfer harus idempotent (hindari double movement)
- Gunakan `ref_type + ref_id` di stock_movements agar bisa dicek duplicate

---

# K) MVP WORKFLOW MAPPING (Singkat)
- Pembelian masuk (GRN) → buat batch + stock_movements IN
- POS paid → stock_movements OUT (by batch)
- Refund approved → stock_movements IN (by batch)
- Transfer shipped/received → movements OUT/IN
- Adjustment approved → movements IN/OUT sesuai direction

---

## Next Step
Jika kamu setuju schema MVP ini, dokumen berikutnya bisa:
- `11_INDEXES_CONSTRAINTS_DETAIL.md` (detail index, unique, foreign key cascade)
- `12_API_MODULES_ENDPOINTS.md` (API spec per modul)
- `13_EVENT_JOB_ETL_ANALYTICS.md` (pipeline analitik + forecasting)

