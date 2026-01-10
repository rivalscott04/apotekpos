# 03_FLOW_APOTEKER.md

## Flow Role: Apoteker

### Tujuan
Role **Apoteker** berfokus pada:
- Validasi resep
- Kepatuhan farmasi
- Pengelolaan obat berbasis batch & expired
- Pengamanan obat resep dan obat tertentu

Apoteker **tidak berperan sebagai kasir**, tapi menjadi gatekeeper klinis & regulasi.

---

## A. Menu yang Bisa Diakses (Apoteker)

- Dashboard
- Resep & Pelayanan Farmasi
  - Input Resep
  - Racikan
  - Non-Racikan
  - Validasi Resep
  - Arsip Resep
- Produk & Master (read + edit terbatas)
- Inventory
  - Batch & Expired
  - Stok per Cabang (read only)
- Laporan Resep

Apoteker **tidak bisa mengakses**:
- POS (transaksi pembayaran)
- Promo & Loyalty
- Pembelian & PO
- Analitik global
- Laporan keuangan
- Multi cabang (kecuali cabang sendiri)
- User & RBAC

---

## B. Hak Khusus Apoteker

- Validasi resep sebelum dispensing
- Menolak resep tidak valid
- Mengunci obat expired / rusak
- Menandai obat bermasalah (recall, rusak)
- Edit data klinis obat (catatan farmasi)
- Melihat histori resep pasien (cabang sendiri)

---

## C. Alur Kerja Apoteker (End-to-End)

### 1) Login & Dashboard
Dashboard menampilkan:
- Antrian resep hari ini
- Resep pending validasi
- Obat near-expired
- Notifikasi masalah batch / recall

---

### 2) Terima & Input Resep
Resep masuk dari:
- Input manual oleh apoteker
- Entry awal oleh kasir (jika sistem mendukung)

Data yang diinput:
- Tanggal resep
- Nama pasien
- Umur / jenis kelamin (opsional)
- Nama dokter
- Nomor resep
- Catatan dokter

Status awal resep:
- `DRAFT` atau `PENDING_VALIDATION`

---

### 3) Pilih Jenis Resep
Apoteker memilih:
- **Non-Racikan**
- **Racikan**

Sistem akan mengarahkan flow berbeda.

---

### 4A) Flow Resep Non-Racikan
1. Pilih obat
2. Sistem tampilkan:
   - Stok tersedia
   - Batch & expired
3. Sistem auto pilih batch FEFO
4. Apoteker verifikasi:
   - Dosis
   - Jumlah
   - Aturan pakai

Validasi:
- Tidak boleh pilih batch expired
- Tidak boleh melebihi stok
- Produk tertentu bisa butuh otorisasi tambahan

---

### 4B) Flow Resep Racikan
1. Tambah komponen obat
2. Tentukan:
   - Jumlah masing-masing bahan
   - Bentuk sediaan
   - Aturan pakai
3. Sistem:
   - Hitung total komponen
   - Hitung biaya jasa racik
4. Batch & expired dicek per komponen

Output:
- Draft racikan siap divalidasi

---

### 5) Validasi Resep
Apoteker melakukan final check:
- Kelengkapan resep
- Kesesuaian obat
- Potensi kesalahan dosis (opsional rule engine)
- Ketersediaan stok

Aksi:
- Approve resep
- Reject resep (wajib alasan)
- Edit resep sebelum approve

Status berubah:
- `APPROVED`
- `REJECTED`

Semua aksi masuk audit log.

---

### 6) Dispensing & Serah ke Kasir
Setelah approved:
- Sistem generate item penjualan
- Mengunci batch yang akan digunakan
- Resep siap dibayar di POS

Catatan:
- Apoteker **tidak melakukan pembayaran**
- Kasir hanya bisa menjual resep yang sudah approved

---

### 7) Cetak Etiket / Label Obat
Apoteker dapat:
- Cetak etiket obat
- Cetak label racikan

Isi label:
- Nama pasien
- Nama obat / racikan
- Aturan pakai
- Tanggal
- Nama apotek

---

### 8) Arsip Resep
Setelah transaksi selesai:
- Resep tersimpan sebagai arsip digital
- Bisa dicari berdasarkan:
  - Pasien
  - Dokter
  - Tanggal
  - Obat

Data arsip:
- Immutable (tidak bisa diedit)
- Hanya bisa dibatalkan via proses resmi (jika diperlukan)

---

## D. Pengelolaan Batch & Expired (Peran Apoteker)

Apoteker dapat:
- Menandai batch rusak
- Menandai batch recall
- Mengunci batch agar tidak bisa dijual
- Memberi catatan farmasi pada batch

Sistem:
- Otomatis menolak penjualan batch locked
- Memberi notifikasi ke manager & owner

---

## E. Batasan & Proteksi Sistem

- Apoteker tidak bisa ubah harga jual
- Apoteker tidak bisa override stok
- Tidak bisa approve transaksi finansial
- Tidak bisa akses data cabang lain (default)

---

## F. Audit & Kepatuhan

Wajib tercatat:
- Approve / reject resep
- Edit resep
- Lock / unlock batch
- Cetak etiket
- Catatan farmasi

Data audit:
- user_id
- waktu
- cabang_id
- aksi
- keterangan

---

## G. KPI Apoteker (Opsional)
- Jumlah resep per hari
- Waktu rata-rata validasi
- Jumlah resep ditolak
- Jumlah batch dikunci
- Near-expired handling rate

---
