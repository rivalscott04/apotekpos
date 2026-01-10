# 05_FLOW_MANAGER.md

## Flow Role: Supervisor / Manager Cabang

### Tujuan
Role **Manager Cabang** bertanggung jawab atas:
- Kontrol operasional cabang
- Pengambilan keputusan harian
- Approval aktivitas berisiko
- Monitoring performa tim & stok
- Penghubung antara operasional dan owner

---

## A. Menu yang Bisa Diakses (Manager Cabang)

- Dashboard (Cabang)
- POS (monitoring & override terbatas)
- Produk & Master
  - Harga & Margin (cabang)
- Inventory
- Pembelian
- Promo & Loyalty
- Analitik (cabang)
- Laporan (cabang)
- Approval Center

Manager **tidak bisa mengakses**:
- Data keuangan global
- Cabang lain (kecuali diberi izin)
- RBAC global
- Sistem setting global

---

## B. Hak & Kewenangan Manager

- Approve:
  - Diskon di atas limit kasir
  - Void transaksi
  - Retur khusus
  - Penyesuaian stok
- Edit harga jual cabang
- Buat & approve PO cabang
- Monitoring performa kasir & gudang
- Lihat margin & shrinkage cabang

---

## C. Alur Kerja Manager Cabang (End-to-End)

### 1) Login & Dashboard Cabang
Dashboard menampilkan:
- Omzet hari ini
- Target vs realisasi
- Stok kritis & near-expired
- Approval pending
- KPI kasir & gudang

---

### 2) Approval Center
Manager membuka daftar approval:
- Diskon besar
- Void transaksi
- Retur sensitif
- Adjustment stok

Flow:
1. Buka request
2. Review detail & histori
3. Approve / Reject
4. Wajib isi catatan

Sistem:
- Eksekusi aksi setelah approval
- Simpan audit log

---

### 3) Kontrol Harga & Margin
Manager dapat:
- Ubah harga jual produk (cabang)
- Atur margin minimum
- Lihat histori perubahan harga

Validasi:
- Harga di bawah HPP → butuh approval owner
- Perubahan harga massal → audit log

---

### 4) Kontrol Stok & Inventory
Manager memonitor:
- Stok kritis
- Near-expired
- Slow moving

Aksi:
- Buat PO
- Approve adjustment stok
- Request transfer antar cabang

---

### 5) Pembelian (Cabang)
Flow:
1. Buat PO ke supplier
2. Review & submit
3. Monitor status penerimaan
4. Review invoice supplier

Catatan:
- PO di atas limit nominal → approval owner (opsional)

---

### 6) Monitoring POS & Kasir
Manager dapat:
- Melihat transaksi real-time
- Review void & retur
- Review selisih kas per shift
- Evaluasi performa kasir

---

### 7) Analitik Cabang
Manager melihat:
- Penjualan per produk/kategori
- Margin per produk
- Jam ramai
- Perputaran stok
- Shrinkage

Tujuan:
- Optimasi stok
- Optimasi promo
- Penjadwalan staf

---

### 8) Laporan Cabang
Manager bisa generate:
- Laporan penjualan
- Laporan stok
- Laporan pembelian
- Laporan shift kasir
- Laporan margin

Export:
- PDF
- Excel

---

## D. Batasan Manager Cabang

- Tidak bisa ubah HPP global
- Tidak bisa lihat data semua cabang (default)
- Tidak bisa akses RBAC global
- Tidak bisa approve transaksi owner-level

---

## E. Audit & Kepatuhan

Semua aksi berikut wajib tercatat:
- Approval & rejection
- Perubahan harga
- Approval adjustment stok
- Override kebijakan kasir

Audit log:
- user_id
- cabang_id
- aksi
- waktu
- catatan

---

## F. KPI Manager Cabang (Opsional)
- Omzet cabang
- Margin cabang
- Shrinkage rate
- Stockout rate
- Approval frequency
- Pertumbuhan bulanan

---
