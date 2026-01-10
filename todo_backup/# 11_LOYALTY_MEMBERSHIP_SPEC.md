# 11_LOYALTY_MEMBERSHIP_SPEC.md

## Membership & Loyalty Points (Terhubung ke Schema MVP: 10_DB_SCHEMA_MVP.md)

Dokumen ini menambahkan modul **Membership + Points** yang:
- Terintegrasi dengan POS (`sales_orders`, `payments`, `refunds`)
- Aman untuk audit (ledger-based, append-only)
- Mendukung multicabang
- Mendukung “points sebagai alat bayar” (split payment)

---

# A) Konsep & Prinsip

## 1) Model yang dipakai: Loyalty Points (non-cash) + Ledger
Points diperlakukan seperti “nilai internal” yang bisa dipakai untuk mengurangi total bayar.
Agar aman dan bisa diaudit:
- **Sumber kebenaran** = `loyalty_point_ledger` (append-only)
- `customers.points_balance` hanya **cache** untuk performa

## 2) Multi-cabang
Default rekomendasi: **Points global** (bisa dipakai di cabang manapun)
- Semua transaksi tetap menyimpan `branch_id` untuk analitik
- Member hanya punya 1 saldo points untuk seluruh cabang

---

# B) Aturan Bisnis (Default Best Practice)

## 1) Earning (mendapat poin)
- Points dihitung saat `sales_orders.status = paid`
- Formula default:
  - `points_earned = floor(eligible_amount / 1000)`
  - `eligible_amount` = grand_total - tax_total (opsional) atau subtotal setelah diskon
- Points tidak diberikan untuk transaksi `voided` atau `refunded`

## 2) Redemption (pakai poin untuk bayar)
- Points bisa dipakai untuk:
  - potong total belanja (sebagai “payment method” points)
- Default aturan:
  - Min redeem: 100 points
  - Max redeem: 30% dari `grand_total` (configurable)
  - Rate default: `1 point = Rp 1` (configurable)
- Points redemption hanya bisa dilakukan pada transaksi `paid` (saat checkout)

## 3) Expiry (kadaluarsa)
- Points hasil earning punya masa berlaku (default 12 bulan)
- Expiry diproses via scheduler job harian:
  - points credit yang melewati `expires_at` → dibuat entry debit “expiry”

## 4) Refund & Reversal
A. Jika transaksi yang menghasilkan poin direfund:
- points yang pernah diberikan harus dikurangi:
  - buat ledger entry debit sebesar `points_earned` (atau proporsional jika refund parsial)

B. Jika transaksi dibayar pakai poin lalu direfund:
- points yang dipakai harus dikembalikan:
  - buat ledger entry credit sebesar `points_redeemed` (atau proporsional)

## 5) Anti-fraud & Approval
- Redeem di atas batas (% max) → blok atau butuh approval manager
- Manual adjustment points (tambah/kurang) → hanya manager/owner + wajib alasan + audit log
- Semua redemption/adjustment wajib tercatat di `audit_logs`

---

# C) Flow POS: Membership + Points Payment (Terhubung Modul POS)

## 1) Di layar POS (Kasir)
1. Kasir pilih member (input phone / scan QR member)
2. Sistem tampilkan:
   - `points_balance` saat ini
   - `max_points_redeemable` untuk transaksi ini
3. Kasir input `points_to_use` (default auto max)
4. Sistem hitung:
   - `points_value = points_to_use * points_rate`
   - `remaining_total = grand_total - points_value`
5. Kasir pilih metode bayar sisa:
   - cash / qris / card / transfer
6. Checkout → jika sukses:
   - create payment row method `points` (amount = points_value)
   - create payment row metode lain untuk sisa
   - create ledger debit untuk redemption
   - create ledger credit untuk earning (jika eligible)

## 2) Status & Idempotency
- Points hanya dibukukan ketika:
  - pembayaran final sukses dan order menjadi `paid`
- Gunakan idempotency check:
  - per `sales_order_id` hanya boleh 1 kali posting points ledger untuk earning/redeem

---

# D) RBAC & Approval (Terhubung 08_RBAC_PERMISSION_TABLE.md & 07_APPROVAL_MATRIX.md)

## Permission Key yang disarankan
- `customer.read`
- `customer.create`
- `loyalty.points.redeem.execute`
- `loyalty.points.adjust.request`
- `loyalty.points.adjust.approve`
- `loyalty.points.export`

## Default akses role
- Kasir:
  - customer.read (R)
  - loyalty.points.redeem.execute (X) (dengan limit)
- Manager:
  - loyalty.points.adjust.approve (A)
  - export laporan loyalty
- Owner:
  - full reporting + kebijakan global

## Approval request type baru
Tambahkan `approval_requests.request_type`:
- `points_redeem_over_limit`
- `points_manual_adjustment`

---

# E) Perubahan Schema DB (Extension dari 10_DB_SCHEMA_MVP.md)

## 1) Update: customers (tabel opsional no 30 di MVP)
Tambahkan field:
- membership_tier (string, nullable)
- points_balance (int, default 0)  // cache
- points_updated_at (datetime, nullable)

Indexes:
- index(phone)
- index(points_balance)

Catatan:
- `points_balance` disinkron dari ledger (job/trigger)

---

## 2) New Table: loyalty_point_ledger (append-only)
Fields:
- id (PK)
- branch_id (FK -> branches.id)             // cabang transaksi
- customer_id (FK -> customers.id)
- ref_type (enum: sale, refund, manual_adjust, expiry)
- ref_id (bigint)                           // sales_order_id atau refund_id
- direction (enum: credit, debit)
- points (int)                              // selalu positif
- rate (decimal, default 1)                 // nilai rupiah per point
- value_amount (decimal)                    // points * rate
- expires_at (date, nullable)               // untuk credit earning
- created_by (FK -> users.id)
- created_at
- notes (text, nullable)

Indexes:
- index(customer_id, created_at)
- index(ref_type, ref_id)
- index(expires_at)
- index(branch_id, created_at)

Rules:
- Tidak boleh update/delete (append-only)
- points_balance dihitung dari SUM(credit) - SUM(debit)

---

## 3) Update: sales_orders
Tambahkan field:
- customer_id (FK -> customers.id, nullable)   // jika belum ada
- points_earned (int, default 0)
- points_redeemed (int, default 0)
- points_rate (decimal, default 1)
- points_value (decimal, default 0)

Indexes:
- index(customer_id, created_at)

---

## 4) Update: payments
Tambahkan enum method:
- `points`

Aturan:
- Jika points dipakai:
  - ada 1 row payments: method=points amount=points_value status=success
  - sisa bayar pakai method lain (split)

---

## 5) Update: refunds & refund_items (jika refund mempengaruhi points)
Tambahkan field:
- refunds.points_reversed (int, default 0)  // optional tracking
- refunds.points_returned (int, default 0)  // optional tracking

Catatan:
- Ledger tetap sumber kebenaran, field ini hanya untuk ringkas/report.

---

# F) Kalkulasi & Edge Cases

## 1) Max redeemable points
- `max_value = grand_total * max_redeem_percent`
- `max_points = floor(max_value / points_rate)`
- `allowed_points = min(max_points, customer.points_balance)`

## 2) Refund parsial
- Reversal points earning proporsional:
  - `reversed = floor(points_earned * (refund_total / grand_total_original))`
- Return points redeem proporsional:
  - `returned = floor(points_redeemed * (refund_total / grand_total_original))`

## 3) Void transaksi
- Jika order belum paid → tidak ada ledger
- Jika order sudah paid lalu void (high-risk) → perlakukan sebagai refund full:
  - reverse earning + return redeemed

---

# G) Laporan Loyalty (Owner/Manager)

## Report: Loyalty Summary
- points issued (credit sale)
- points redeemed (debit sale)
- points expired (debit expiry)
- points adjusted (manual +/-)
- outstanding points liability (saldo total points)

Tabel sumber:
- loyalty_point_ledger (aggregate)
- sales_orders (ringkas per transaksi)

---

# H) Jobs & Scheduler (Operasional)

## 1) Job: SyncPointsBalance
- Recalculate `customers.points_balance` dari ledger
- Bisa:
  - per customer (event-driven)
  - nightly batch (fallback)

## 2) Job: ExpirePointsDaily
- Cari ledger credit yang `expires_at < today` dan belum di-expire
- Buat ledger debit `ref_type=expiry`

Idempotency:
- gunakan ref_id = ledger_credit_id (atau kunci unik) untuk mencegah double expiry

---

# I) Audit Log (Wajib)

Aksi yang wajib masuk `audit_logs`:
- loyalty.points.redeem (sale_id, points, value)
- loyalty.points.manual_adjust (customer_id, points, reason)
- loyalty.points.expire (batch job)
- approval keputusan terkait points

---

## Output yang Diharapkan (POS)
- Kasir bisa input member cepat
- Poin bisa dipakai bayar sebagian
- Semua transparan di struk:
  - Points used: X (RpY)
  - Points earned: Z
  - Balance after: N

---
