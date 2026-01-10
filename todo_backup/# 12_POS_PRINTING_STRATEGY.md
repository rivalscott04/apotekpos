# 12_POS_PRINTING_STRATEGY.md

## Strategi Printing POS (Thermal 80mm) untuk Aplikasi Farmasi
Terhubung ke:
- 10_DB_SCHEMA_MVP.md (sales_orders, payments, refunds)
- 11_LOYALTY_MEMBERSHIP_SPEC.md (points earned/redeemed)
- 07_APPROVAL_MATRIX.md (void/refund/discount approval)
- 08_RBAC_PERMISSION_TABLE.md (permission printing & void)

Tujuan:
- Struk tercetak konsisten di printer thermal (80mm)
- Mendukung multi-metode bayar + points
- Mendukung cash drawer (opsional)
- Minim gangguan operasional

---

# A) Opsi Printing (Pilih Strategi Utama)

## Opsi 1 — Browser Print (Paling Mudah)
### Cara kerja
Frontend render struk sebagai halaman HTML 80mm → panggil `window.print()` → user memilih printer thermal.

### Kelebihan
- Implementasi cepat
- Tidak perlu install agent
- Kompatibel di semua OS

### Kekurangan
- Format kadang berubah tergantung driver/printer setting
- Auto-cut / buka cash drawer tidak selalu bisa
- Popup/print dialog bisa ganggu “seamless”

### Cocok untuk
- MVP
- Cabang kecil
- Printer thermal yang sudah stabil dengan driver OS

---

## Opsi 2 — QZ Tray (Paling Stabil & Profesional untuk Thermal)
### Cara kerja
Frontend kirim raw ESC/POS atau template print ke **QZ Tray** (agent kecil di PC) → QZ Tray print langsung ke printer.

### Kelebihan
- Output struk konsisten (font, cut, drawer)
- Bisa silent print (tanpa dialog)
- Bisa auto cut, beep, open cash drawer
- Cocok untuk POS yang “seamless modern”

### Kekurangan
- Perlu install QZ Tray di PC kasir
- Setup awal: trust certificates & pairing

### Cocok untuk
- Produksi POS serius
- Banyak transaksi per hari
- Butuh cutting/drawer otomatis

---

## Opsi 3 — Server-Side PDF (Cukup Rapi, Tapi Tidak Sepenuhnya Seamless)
### Cara kerja
Laravel generate PDF struk → frontend buka/print PDF.

Kelebihan:
- Layout lebih konsisten dibanding HTML
Kekurangan:
- PDF rendering/print bisa lebih lambat
- Masih pakai print dialog

---

# B) Rekomendasi Praktis (Seimbang MVP → Scale)

## Tahap 1 (MVP)
- Gunakan **Browser Print HTML 80mm**
- Pastikan template struk sudah “printer-friendly”
- Simpan setting printer di OS (paper size 80mm, margin 0)

## Tahap 2 (Produksi POS Sejajar Minim Gangguan)
- Upgrade cabang ramai ke **QZ Tray**
- Mode silent print untuk kasir
- Aktifkan auto-cut & cash drawer

---

# C) Data Wajib yang Harus Ada di Struk

Sumber data utama:
- `sales_orders` (header)
- `sales_order_items` (detail)
- `payments` (metode bayar)
- `customers` + points (opsional)
- `refunds` jika struk retur

## Header
- Nama apotek / cabang (`branches.name`)
- Alamat & kontak cabang
- Tanggal & jam transaksi
- No transaksi (`sales_orders.order_no`)
- Nama kasir
- (opsional) No shift (`pos_shifts.id` / shift code)

## Item lines (per `sales_order_items`)
- Nama produk (ringkas)
- Batch no (opsional tampil, tapi bagus untuk farmasi)
- Expired (opsional tampil)
- Qty x harga
- Diskon item (jika ada)
- Subtotal line

## Totals
- Subtotal
- Diskon total
- Pajak (jika ada)
- Grand total

## Payments (split payment)
Dari tabel `payments`:
- Cash: RpX
- QRIS: RpY (opsional tampil reference)
- Card/Transfer: RpZ
- Points: X pts (RpN)  <-- dari 11_LOYALTY_MEMBERSHIP_SPEC.md

## Membership / Points
- Points used: `sales_orders.points_redeemed` + `sales_orders.points_value`
- Points earned: `sales_orders.points_earned`
- Balance after: `customers.points_balance` (setelah posting) atau dihitung

## Footer
- Terima kasih / disclaimer
- Kebijakan retur (ringkas)
- (opsional) QR untuk membership / web order link

---

# D) Template Struk 80mm (Struktur Layout)

Lebar efektif:
- 80mm biasanya 48–56 karakter tergantung font.
Rekomendasi:
- gunakan font monospace.

Struktur:
1) Header center
2) Separator line
3) Item list
4) Separator line
5) Totals
6) Payment breakdown
7) Points summary
8) Footer

---

# E) Printing Untuk Refund / Retur

## Struk refund harus memuat:
- Refund no (`refunds.refund_no`)
- Reference transaksi asli (order_no)
- Item yang diretur + qty
- Total refund
- Metode refund
- Points reversal / return (jika berlaku)
  - points reversed (earning dibatalkan)
  - points returned (redeem dikembalikan)

Sumber:
- `refunds`, `refund_items`
- `loyalty_point_ledger` (ringkas summary untuk ditampilkan)

---

# F) Flow Teknis (Browser Print)

1) Frontend request data struk:
- GET `/api/pos/sales-orders/{id}/receipt`
2) Frontend render HTML receipt 80mm
3) Trigger print:
- `window.print()`
4) Setelah print:
- tandai `sales_orders.printed_at` (opsional)
- log `audit_logs` action: `pos.receipt.print`

Catatan:
- Jangan query item satu-satu; gunakan eager load.
- Pastikan endpoint receipt terproteksi `branch_id`.

---

# G) Flow Teknis (QZ Tray)

## 1) Setup
- Install QZ Tray di PC kasir
- Setup certificate/trust (sekali)

## 2) Print Flow
1) Frontend build payload ESC/POS atau HTML-to-raw
2) Frontend kirim ke QZ:
- pilih printer name
- print raw + cut + drawer command
3) Server tetap log:
- printed_at
- audit log

## 3) Command ESC/POS yang umum
- Initialize
- Print text lines
- Cut paper
- Open cash drawer

Catatan:
- Implementasi ESC/POS perlu mapping per brand printer.
- Disarankan buat “printer profile” per cabang.

---

# H) Settings yang Perlu Ditambahkan (Terhubung ke Settings Menu)

Tambahan konfigurasi cabang:
- printing_mode: `browser` | `qz`
- printer_name (untuk qz)
- paper_width: 58mm/80mm
- auto_cut (bool)
- open_drawer_on_cash (bool)
- receipt_footer_text
- show_batch_on_receipt (bool)
- show_expired_on_receipt (bool)

Simpan di tabel baru (opsional) `branch_settings`:
- branch_id
- key
- value (json/text)

---

# I) RBAC & Audit (Terhubung 08 & 07)

Permission keys:
- `pos.receipt.print`
- `pos.refund.receipt.print`
- `pos.reprint.execute` (reprint butuh approval/limit)

Aturan:
- Reprint berlebihan bisa jadi red flag → tampil di audit report owner
- Reprint setelah void/refund harus jelas labelnya

Audit actions:
- `pos.receipt.print`
- `pos.receipt.reprint`
- `pos.refund.print`

---

# J) Rekomendasi Implementasi (Seamless Modern)
Jika target kamu “seamless”:
- POS (PC) gunakan **QZ Tray** untuk cabang ramai
- Web order & admin tetap browser-based
- Fallback: browser print tetap tersedia

---

## Output Checklist
- Struk 80mm konsisten
- Mendukung split payment + points
- Mendukung refund printing
- Semua print/reprint tercatat di audit log
- Bisa scale per cabang dengan mode printing berbeda

---
