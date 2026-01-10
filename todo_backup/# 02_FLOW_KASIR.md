# 02_FLOW_KASIR.md

## Flow Role: Kasir (POS)

### Tujuan
Kasir fokus pada transaksi cepat, akurat, dan minim risiko kesalahan. Akses dibatasi agar tidak bisa melakukan perubahan sensitif (harga, HPP, stok, approval).

---

## A. Menu yang Bisa Diakses (Kasir)

- Dashboard (ringkas)
- POS
  - Transaksi Penjualan
  - Hold / Recall
  - Retur / Refund (terbatas)
  - Riwayat Transaksi (cabang sendiri)
  - Shift Kasir (Open/Close, Cash In/Out)

Kasir tidak melihat modul:
- Produk & Master (edit)
- Inventory (edit)
- Pembelian
- Analitik & AI
- Laporan global / owner report
- Multi cabang
- User & RBAC

---

## B. Batasan Akses (Rules)

- Diskon maksimal: dibatasi (misalnya 5% atau nominal tertentu)
- Void transaksi: wajib approval (Manager/Owner)
- Retur tertentu: bisa butuh approval (konfigurasi)
- Tidak bisa ubah harga jual / HPP
- Tidak bisa edit stok / batch / expired
- Tidak bisa akses data cabang lain

---

## C. Alur Kerja Harian Kasir (End-to-End)

### 1) Login & Validasi Shift
1. Kasir login
2. Pilih cabang (jika user terikat multi cabang, biasanya fixed ke 1 cabang)
3. Sistem cek status shift:
   - Jika belum open shift → wajib Open Shift
   - Jika sudah open shift → lanjut POS

Output:
- Shift aktif tercatat (user_id, cabang_id, waktu buka, saldo awal)

---

### 2) Open Shift
Input:
- Saldo awal kas (cash drawer opening balance)
- Catatan awal (opsional)

Sistem:
- Membuat record shift
- Mengunci agar transaksi POS hanya bisa dilakukan saat shift aktif

---

### 3) Mulai Transaksi Penjualan
Kasir dapat menambah item dengan:
- Scan barcode
- Search nama produk
- Pilih dari kategori favorit/quick buttons (opsional)

Sistem wajib:
- Menentukan stok dari batch yang valid
- Mengambil batch sesuai FEFO (First Expired First Out)
- Menolak item expired / stok tidak cukup
- Menampilkan harga sesuai kebijakan cabang

---

### 4) Keranjang & Aturan Harga
Di keranjang, kasir bisa:
- Ubah qty (dengan validasi stok)
- Hapus item
- Input catatan transaksi (opsional)
- Terapkan promo otomatis (rules engine)
- Input diskon manual (dibatasi aturan)

Validasi diskon:
- Jika diskon <= batas kasir → allowed
- Jika diskon > batas → transaksi menjadi "Pending Approval"

---

### 5) Hold / Recall (Opsional)
Kasir bisa:
- Hold transaksi (contoh: pelanggan ambil uang dulu)
- Recall transaksi berdasarkan nomor antrian / nama pelanggan / waktu

Sistem:
- Menyimpan draft transaksi tanpa mengurangi stok final (atau reserve stok sesuai opsi)
- Mengunci agar tidak double checkout

---

### 6) Checkout & Pembayaran
Saat checkout:
1. Pilih metode pembayaran:
   - Cash
   - QRIS
   - Transfer
   - Kartu (jika ada)
   - Split payment (opsional)
2. Input nominal bayar (jika cash)
3. Sistem hitung kembalian

Sistem:
- Membuat invoice final
- Mengurangi stok berdasarkan batch yang terpilih
- Mencatat journal kas sederhana (opsional)
- Mengikat transaksi dengan shift_id

---

### 7) Cetak / Kirim Struk
Output:
- Struk print (thermal)
- E-struk via WA/email (opsional)
- Nomor transaksi yang mudah dicari di riwayat

---

### 8) Retur / Refund (Jika Terjadi)
Kasir membuka menu Retur:
1. Cari transaksi asli
2. Pilih item yang diretur + qty
3. Pilih alasan retur
4. Tentukan metode refund:
   - Cash
   - Store credit (opsional)

Validasi:
- Retur tanpa nota → biasanya diblok / butuh approval
- Retur melebihi batas waktu → butuh approval
- Produk tertentu (obat tertentu) bisa dibatasi

Sistem:
- Mengembalikan stok (dengan batch logic, sesuai kebijakan)
- Mencatat retur sebagai transaksi terhubung (link ke invoice original)

---

### 9) Void / Cancel Transaksi (High Risk)
Kasir dapat request void jika:
- Salah input fatal
- Pembayaran gagal

Flow:
1. Kasir klik Void
2. Input alasan void
3. Sistem set status: "Pending Approval"
4. Manager/Owner approve
5. Jika approved → transaksi dibatalkan, stok direstore (kalau sudah terpotong)

Catatan:
- Void setelah pembayaran harus punya aturan ketat + audit log

---

### 10) Close Shift (Wajib di akhir)
Kasir melakukan:
- Hitung kas fisik
- Input cash actual
- Sistem hitung selisih
- Input catatan selisih (wajib jika beda)

Sistem menghasilkan:
- Rekap shift:
  - total transaksi
  - total cash/QRIS/kartu
  - total retur
  - total void
  - expected cash vs actual cash
- Status shift: closed
- Kunci transaksi POS (kasir harus open shift lagi untuk transaksi berikutnya)

---

## D. Checklist Validasi Sistem (Kasir)

Wajib ada:
- POS tidak bisa digunakan tanpa shift aktif
- Produk expired tidak bisa dijual
- Stok tidak bisa minus
- Diskon melewati batas harus approval
- Semua aksi sensitif masuk audit log:
  - diskon manual
  - retur
  - void
  - cancel pembayaran
  - reopen shift (jika ada)

---

## E. KPI Khusus Kasir (Untuk Monitoring)
- Jumlah void per shift
- Jumlah retur per shift
- Persentase diskon manual
- Selisih kas saat close shift
- Kecepatan transaksi (opsional)

---
