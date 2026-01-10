# 06_FLOW_OWNER.md

## Flow Role: Owner / Pemilik Usaha

### Tujuan
Role **Owner** berfokus pada:
- Pengambilan keputusan strategis
- Monitoring performa seluruh cabang
- Kontrol risiko bisnis
- Audit & kepatuhan
- Arah pengembangan bisnis (pricing, ekspansi, efisiensi)

Owner **tidak terlibat operasional harian** (kasir, gudang, resep).

---

## A. Menu yang Bisa Diakses (Owner)

- Executive Dashboard
- Analitik & AI
- Laporan (All Cabang)
- Audit & Compliance
- User & RBAC (High Level)
- Multi Cabang
- Settings Strategis

Owner **tidak menggunakan**:
- POS transaksi harian
- Input resep
- Input stok operasional

---

## B. Hak & Kewenangan Owner

- Akses data **semua cabang**
- Lihat laporan keuangan ringkas & konsolidasi
- Approve transaksi high-risk (opsional)
- Set kebijakan harga & margin global
- Set approval limit per role
- Set role & permission tingkat tinggi
- Akses penuh audit log

---

## C. Alur Kerja Owner (End-to-End)

### 1) Login & Executive Dashboard
Dashboard owner menampilkan ringkasan lintas cabang:

- Omzet total (harian, mingguan, bulanan)
- Pertumbuhan per cabang
- Margin rata-rata
- Top & bottom performing cabang
- Stok kritis lintas cabang
- Risiko expired & shrinkage
- Notifikasi penting (anomali, approval besar)

Dashboard **read-only**.

---

### 2) Analitik & AI (Strategic View)

#### Analitik
Owner dapat melihat:
- Perbandingan penjualan antar cabang
- Margin per cabang & produk
- Perputaran stok
- Rasio stok mati (dead stock)
- Efektivitas promo

#### Forecasting & AI
- Prediksi demand per cabang
- Rekomendasi reorder global
- Prediksi stockout
- Risiko overstock & expired
- Insight musiman

Catatan:
- Output AI bersifat rekomendasi
- Keputusan tetap manual (owner/manager)

---

### 3) Laporan Konsolidasi
Owner dapat generate laporan:
- Laporan penjualan semua cabang
- Laporan stok konsolidasi
- Laporan pembelian & supplier
- Laporan margin & profit
- Laporan performa cabang

Fitur:
- Filter periode
- Filter cabang
- Export PDF / Excel
- Scheduled report (email / WA)

---

### 4) Approval High-Risk (Opsional)
Owner dapat ikut approval:
- Diskon ekstrem
- Void transaksi besar
- Adjustment stok besar
- Harga jual di bawah HPP

Flow:
1. Review request
2. Lihat histori & audit trail
3. Approve / Reject
4. Catatan wajib

---

### 5) Audit & Compliance
Owner mengakses:
- Audit log seluruh sistem
- Aktivitas sensitif:
  - perubahan harga
  - adjustment stok
  - void transaksi
  - perubahan role

Filter:
- User
- Cabang
- Tanggal
- Jenis aksi

Tujuan:
- Deteksi fraud
- Evaluasi SOP
- Kepatuhan internal

---

### 6) Manajemen User & RBAC (High Level)
Owner dapat:
- Buat role global
- Set permission global
- Atur approval matrix
- Assign manager ke cabang

Catatan:
- Operasional user harian bisa didelegasikan ke admin/manager

---

### 7) Multi Cabang & Kebijakan Global
Owner mengatur:
- Tambah / nonaktifkan cabang
- Kebijakan harga global
- Margin minimum
- Kebijakan stok minimum
- Threshold approval

---

### 8) Notifikasi & Alert Strategis
Owner menerima alert otomatis:
- Omzet turun signifikan
- Stok kritis berulang
- Shrinkage tinggi
- Banyak void / retur di cabang tertentu
- Forecast risiko expired tinggi

Channel:
- Dashboard
- Email
- WhatsApp (opsional)

---

## D. Batasan Owner (Best Practice)

- Tidak input transaksi harian
- Tidak edit stok manual
- Tidak override tanpa jejak audit
- Semua aksi tercatat (audit trail)

---

## E. Audit Log (Owner)

Aksi owner yang wajib dicatat:
- Approval besar
- Perubahan kebijakan global
- Perubahan role & permission
- Akses laporan sensitif

Audit field:
- user_id
- role
- waktu
- aksi
- catatan

---

## F. KPI Strategis Owner
- Growth omzet total
- Margin rata-rata
- Performa antar cabang
- Stockout rate
- Expired loss rate
- Shrinkage rate
- ROI promo

---
    