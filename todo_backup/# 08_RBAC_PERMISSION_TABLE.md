# 08_RBAC_PERMISSION_TABLE.md

## RBAC & Permission Table Aplikasi Farmasi

### Tujuan
RBAC (Role-Based Access Control) dirancang untuk:
- Memisahkan tanggung jawab tiap role
- Mengamankan aksi berisiko
- Memudahkan audit & compliance
- Mendukung scaling multicabang

Permission dibagi menjadi:
- **Menu-level access**
- **Action-level permission**

---

## A. Daftar Role Utama

| Kode | Role |
|-----|------|
| R1 | Kasir |
| R2 | Apoteker |
| R3 | Staff Gudang |
| R4 | Manager Cabang |
| R5 | Owner |

---

## B. Permission Level

| Kode | Deskripsi |
|-----|----------|
| R | Read |
| C | Create |
| U | Update |
| D | Delete |
| A | Approve |
| X | Execute (aksi khusus) |

---

## C. RBAC – POS & Transaksi

| Modul / Aksi | Kasir | Apoteker | Gudang | Manager | Owner |
|--------------|-------|----------|--------|---------|-------|
| POS Transaksi | C | ❌ | ❌ | R | ❌ |
| Diskon manual | X (limit) | ❌ | ❌ | A | A |
| Void transaksi | X (request) | ❌ | ❌ | A | A |
| Retur transaksi | X (request) | ❌ | ❌ | A | A |
| Riwayat transaksi | R | ❌ | ❌ | R | R |
| Shift kasir | X | ❌ | ❌ | R | R |

---

## D. RBAC – Resep & Farmasi

| Modul / Aksi | Kasir | Apoteker | Gudang | Manager | Owner |
|--------------|-------|----------|--------|---------|-------|
| Input resep | R | C | ❌ | R | R |
| Edit resep | ❌ | U | ❌ | ❌ | ❌ |
| Validasi resep | ❌ | A | ❌ | ❌ | ❌ |
| Reject resep | ❌ | A | ❌ | ❌ | ❌ |
| Arsip resep | ❌ | R | ❌ | R | R |
| Cetak etiket | ❌ | X | ❌ | ❌ | ❌ |

---

## E. RBAC – Produk & Master Data

| Modul / Aksi | Kasir | Apoteker | Gudang | Manager | Owner |
|--------------|-------|----------|--------|---------|-------|
| Lihat produk | R | R | R | R | R |
| Tambah produk | ❌ | ❌ | ❌ | C | A |
| Edit produk | ❌ | U (klinis) | ❌ | U | A |
| Hapus produk | ❌ | ❌ | ❌ | ❌ | A |
| Edit harga | ❌ | ❌ | ❌ | U | A |
| Edit HPP | ❌ | ❌ | ❌ | ❌ | U |

---

## F. RBAC – Inventory & Stok

| Modul / Aksi | Kasir | Apoteker | Gudang | Manager | Owner |
|--------------|-------|----------|--------|---------|-------|
| Lihat stok | R | R | R | R | R |
| Penerimaan barang | ❌ | ❌ | C | R | R |
| Batch & expired | ❌ | U (lock) | C | R | R |
| Stok opname | ❌ | ❌ | C | A | A |
| Adjustment stok | ❌ | ❌ | X (request) | A | A |
| Transfer cabang | ❌ | ❌ | X (request) | A | A |

---

## G. RBAC – Pembelian

| Modul / Aksi | Kasir | Apoteker | Gudang | Manager | Owner |
|--------------|-------|----------|--------|---------|-------|
| Buat PO | ❌ | ❌ | ❌ | C | A |
| Approve PO | ❌ | ❌ | ❌ | A | A |
| Penerimaan (GRN) | ❌ | ❌ | C | R | R |
| Retur pembelian | ❌ | ❌ | C | A | A |

---

## H. RBAC – Analitik & Laporan

| Modul / Aksi | Kasir | Apoteker | Gudang | Manager | Owner |
|--------------|-------|----------|--------|---------|-------|
| Dashboard ringkas | R | R | R | R | R |
| Analitik cabang | ❌ | ❌ | ❌ | R | R |
| Analitik global | ❌ | ❌ | ❌ | ❌ | R |
| Laporan operasional | ❌ | R | R | R | R |
| Laporan keuangan | ❌ | ❌ | ❌ | ❌ | R |
| Export data | ❌ | ❌ | ❌ | R | R |

---

## I. RBAC – User, Approval & Audit

| Modul / Aksi | Kasir | Apoteker | Gudang | Manager | Owner |
|--------------|-------|----------|--------|---------|-------|
| Approval request | ❌ | ❌ | ❌ | A | A |
| Audit log | ❌ | ❌ | ❌ | R | R |
| Buat user | ❌ | ❌ | ❌ | R | A |
| Edit role | ❌ | ❌ | ❌ | ❌ | U |
| Disable user | ❌ | ❌ | ❌ | A | A |

---

## J. Catatan Implementasi Teknis

- Permission disimpan per **role + action**
- Menu tampil jika minimal punya `READ`
- Aksi sensitif cek `EXECUTE` + `APPROVE`
- Approval matrix override permission
- Permission cache (Redis) untuk performa
- Audit log **append-only**

---

## K. Contoh Permission Key (Backend)

pos.transaction.create
pos.discount.execute
inventory.adjustment.request
inventory.adjustment.approve
recipe.validate
price.update
report.export
user.role.update