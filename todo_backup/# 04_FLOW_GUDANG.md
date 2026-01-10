# 04_FLOW_GUDANG.md

## Flow Role: Staff Gudang

### Tujuan
Role **Staff Gudang** bertanggung jawab atas:
- Penerimaan barang
- Akurasi stok
- Batch & expired management
- Transfer antar cabang
- Stok opname

Role ini **tidak terlibat penjualan** dan **tidak mengakses keuangan**.

---

## A. Menu yang Bisa Diakses (Staff Gudang)

- Dashboard
- Inventory
  - Stok per Cabang
  - Batch & Expired
  - Kartu Stok
  - Stok Opname
  - Penyesuaian Stok (request)
  - Transfer Antar Cabang
- Pembelian
  - Purchase Order (PO)
  - Penerimaan Barang (GRN)
  - Retur Pembelian

Staff gudang **tidak bisa mengakses**:
- POS
- Resep & Pelayanan Farmasi
- Promo & Loyalty
- Analitik & AI
- Laporan keuangan
- User & RBAC

---

## B. Hak & Batasan Staff Gudang

Hak:
- Input penerimaan barang
- Input batch & expired
- Ajukan penyesuaian stok
- Melakukan stok opname
- Proses transfer stok

Batasan:
- Tidak bisa approve adjustment
- Tidak bisa edit harga/HPP
- Tidak bisa menghapus data stok final
- Tidak bisa akses data cabang lain tanpa izin

---

## C. Alur Kerja Staff Gudang (End-to-End)

### 1) Login & Dashboard
Dashboard menampilkan:
- PO menunggu penerimaan
- Stok kritis
- Near-expired alert
- Transfer pending

---

### 2) Proses Purchase Order (PO)
PO biasanya dibuat oleh:
- Manager cabang
- Owner
- (opsional) otomatis dari AI reorder

Staff gudang:
- Melihat PO (read-only)
- Menyiapkan penerimaan

Status PO:
- `OPEN`
- `PARTIAL`
- `CLOSED`

---

### 3) Penerimaan Barang (GRN)
Flow:
1. Pilih PO
2. Input data penerimaan:
   - Tanggal terima
   - Supplier
3. Untuk setiap item:
   - Qty diterima
   - Nomor batch
   - Expired date
   - Harga beli
4. Simpan GRN

Validasi sistem:
- Qty diterima ≤ qty PO (kecuali diizinkan)
- Expired date wajib
- Batch tidak boleh kosong
- Produk expired langsung ditolak

Output:
- Stok bertambah
- Kartu stok tercatat
- Status PO update

---

### 4) Batch & Expired Management
Staff gudang bisa:
- Melihat daftar batch aktif
- Menandai batch:
  - Rusak
  - Salah kirim
- Ajukan lock batch (approval apoteker/manager)

Sistem:
- Batch bermasalah tidak bisa dijual
- Notifikasi ke apoteker & manager

---

### 5) Transfer Antar Cabang
Flow:
1. Buat request transfer
   - Cabang asal
   - Cabang tujuan
   - Produk + batch + qty
2. Submit request

Status transfer:
- `REQUESTED`
- `APPROVED`
- `SHIPPED`
- `RECEIVED`

Validasi:
- Stok batch cukup
- Cabang tujuan aktif

---

### 6) Terima Transfer Masuk
Cabang tujuan:
1. Terima transfer
2. Verifikasi qty & batch
3. Konfirmasi penerimaan

Sistem:
- Menambah stok cabang tujuan
- Mengurangi stok cabang asal
- Mencatat kartu stok dua sisi

---

### 7) Stok Opname
Jenis:
- Parsial
- Full

Flow:
1. Pilih lokasi/rak (opsional)
2. Input stok fisik
3. Sistem bandingkan stok sistem vs fisik
4. Selisih ditandai

Output:
- Draft selisih
- Request penyesuaian stok

---

### 8) Penyesuaian Stok (Adjustment)
Staff gudang:
- Mengajukan adjustment
- Wajib isi alasan

Status adjustment:
- `PENDING_APPROVAL`
- `APPROVED`
- `REJECTED`

Approval oleh:
- Manager cabang
- Owner (jika nominal besar)

---

### 9) Retur Pembelian ke Supplier
Flow:
1. Pilih penerimaan (GRN)
2. Pilih item & batch
3. Input qty retur
4. Input alasan

Sistem:
- Mengurangi stok
- Mencatat retur pembelian
- Update hutang supplier (jika ada)

---

## D. Validasi Sistem Wajib (Gudang)

- Stok tidak boleh minus
- Batch & expired wajib di semua mutasi
- Semua adjustment wajib approval
- Semua mutasi tercatat di kartu stok
- Transfer antar cabang selalu double-entry

---

## E. Audit Log (Gudang)

Wajib dicatat:
- Penerimaan barang
- Edit batch & expired
- Transfer stok
- Stok opname
- Adjustment request

Field audit:
- user_id
- cabang_id
- aksi
- waktu
- referensi dokumen

---

## F. KPI Staff Gudang (Opsional)
- Akurasi stok (% selisih opname)
- Jumlah batch near-expired
- Lead time penerimaan PO
- Jumlah adjustment request
- Transfer delay rate

---
