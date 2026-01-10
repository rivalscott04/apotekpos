# 01_MENU_TREE_GLOBAL.md

## A. Struktur Menu Global Aplikasi Farmasi

Struktur menu ini dirancang untuk:
- POS farmasi multicabang
- Kepatuhan farmasi (batch, expired, resep)
- Analitik & forecasting berbasis data
- RBAC ketat (kasir → owner)

---

## 1. Dashboard
Ringkasan real-time sesuai role.

- Omzet hari ini
- Jumlah transaksi
- Stok kritis & near-expired
- Notifikasi approval
- Insight singkat (top produk, jam ramai)

---

## 2. POS (Point of Sale)
Modul transaksi harian.

- Transaksi Penjualan
- Scan Barcode / Search Produk
- Hold / Recall Transaksi
- Retur / Refund
- Void Transaksi (approval required)
- Shift Kasir
  - Open Shift
  - Cash In / Out
  - Close Shift
- Riwayat Transaksi
- Cetak / Kirim Struk (print / WA / email)

---

## 3. Resep & Pelayanan Farmasi
Khusus layanan berbasis resep.

- Input Resep
  - Data pasien
  - Data dokter
- Racikan
  - Komponen
  - Biaya jasa
- Non-Racikan
- Validasi Apoteker
- Etiket / Label Obat
- Arsip Resep (digital)

---

## 4. Produk & Master Data
Data inti sistem.

- Master Obat & Non-Obat
  - Nama dagang & generik
  - Bentuk sediaan
  - Kekuatan
  - Klasifikasi obat
- Kategori Produk
- Satuan & Konversi
- Harga & Margin
- Supplier
- Pelanggan / Member
- Barcode Management

---

## 5. Inventory & Stok
Kontrol persediaan farmasi.

- Stok per Cabang
- Batch & Expired Date
- Kartu Stok
- Stok Opname
  - Parsial
  - Full
- Penyesuaian Stok (approval)
- Transfer Antar Cabang
- Minimum Stock & Reorder Point

---

## 6. Pembelian
Pengadaan barang.

- Purchase Order (PO)
- Penerimaan Barang (GRN)
  - Input batch
  - Input expired
  - Harga beli
- Retur Pembelian
- Faktur & Hutang Supplier

---

## 7. Promo & Loyalty
Strategi penjualan.

- Promo & Diskon
- Bundling Produk
- Voucher / Kupon
- Member & Poin
- Aturan Diskon (role-based)

---

## 8. Analitik & AI
Data intelligence & forecasting.

### Analitik
- Penjualan per cabang
- Penjualan per produk
- Margin & profit
- Perputaran stok
- Slow moving & dead stock

### Forecasting
- Prediksi demand produk
- Prediksi stockout
- Rekomendasi reorder
- Risiko overstock & expired

---

## 9. Laporan
Output formal & audit.

- Laporan Penjualan
- Laporan Stok
- Laporan Pembelian
- Laporan Shift Kasir
- Laporan Keuangan Ringkas
- Executive Report (Owner only)

---

## 10. Multi Cabang
Manajemen skala bisnis.

- Data Cabang
- Gudang Cabang
- Konsolidasi Data
- Harga per Cabang
- Kebijakan Operasional Cabang

---

## 11. User, RBAC & Audit
Keamanan & kontrol.

- User Management
- Role Management
- Permission per Menu & Action
- Approval Matrix
- Audit Log Aktivitas

---

## 12. Settings
Konfigurasi sistem.

- Identitas Toko
- Printer & Template Struk
- Pajak & Pembulatan
- Integrasi Pembayaran
- Backup & Export Data

---

## Catatan Desain
- Semua data wajib memiliki `cabang_id`
- Menu tampil dinamis berdasarkan role
- Action sensitif wajib tercatat di audit log
- Siap dikembangkan modular (enable/disable)
