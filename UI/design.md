# 00_UI_DESIGN_CONSTITUTION.md

## Tujuan
Dokumen ini adalah **sumber kebenaran UI/UX** untuk seluruh aplikasi
Farmasi POS Multicabang (POS, Admin, Owner, Web Order).

SEMUA desain & kode UI HARUS mengacu ke dokumen ini.
Tidak boleh membuat warna, komponen, atau pola baru tanpa revisi dokumen ini.

---

## 1. Brand Tone
- Modern
- Clean
- Profesional farmasi
- Cepat & fungsional (POS-first)
- Tidak dekoratif berlebihan

---

## 2. Color System (WAJIB)

### Primary
- Primary: `#1E40AF` (Navy Blue)
- Primary Hover: `#1D4ED8`
- Primary Soft: `#DBEAFE`

### Secondary
- Secondary: `#16A34A` (Green – confirm / success)
- Secondary Soft: `#DCFCE7`

### Neutral
- Background: `#F8FAFC`
- Surface/Card: `#FFFFFF`
- Border: `#E5E7EB`
- Text Primary: `#0F172A`
- Text Secondary: `#475569`

### Status
- Success: `#16A34A`
- Warning: `#F59E0B`
- Error: `#DC2626`
- Info: `#2563EB`

❗ Tidak boleh menambahkan warna lain tanpa izin.

---

## 3. Typography

- Font family: `Inter, system-ui, sans-serif`
- Base font size: 14px
- Heading:
  - H1: 20–24px, semibold
  - H2: 18px, semibold
  - H3: 16px, medium
- Body text: 14px
- Table text: 13px
- POS total amount: 20–24px, bold

---

## 4. Spacing & Layout
- Grid: 8px system
- Card padding: 16px–20px
- Gap antar komponen: 12px–16px
- Button height:
  - Default: 36px
  - POS primary action: 44px

---

## 5. Reusable Components (WAJIB)

Gunakan komponen berikut (shadcn/ui style):

### Buttons
- Primary Button
- Secondary Button
- Ghost Button
- Destructive Button

### Inputs
- Text Input
- Search Input (POS)
- Number Input
- Select
- Date Picker

### Data Display
- Card
- Table (TanStack Table)
- Badge (status, batch, expired)
- Tooltip

### Feedback
- Modal / Dialog
- Drawer / Sheet
- Toast Notification
- Confirmation Dialog (danger actions)

### POS-Specific
- Cart Item Row
- Payment Method Card
- Summary Total Card
- Shift Status Badge

❗ Jangan membuat button atau input custom tanpa reuse komponen ini.

---

## 6. Interaction Rules

- Semua aksi berisiko:
  - Void
  - Refund
  - Adjustment
  - Reprint
  harus pakai confirmation dialog.
- Error tampil via toast merah.
- Success via toast hijau.
- Loading state wajib (spinner/skeleton).

---

## 7. POS UX Rules
- Search/scan input auto-focus
- Keyboard-friendly
- Tidak ada hover-only action
- Informasi penting selalu terlihat tanpa scroll:
  - Total
  - Pay button
  - Shift status

---

## 8. Print & Receipt UI
- Receipt preview mengikuti width 80mm
- Font monospace
- Tidak menggunakan warna kecuali hitam

---

## 9. Dark Mode (Opsional)
- Dark mode mengikuti warna yang sama
- Tidak mengubah hierarchy UI

---

## 10. Larangan
- Jangan pakai emoticon
- Jangan pakai gradient berlebihan
- Jangan ubah warna primary/secondary
- Jangan bikin layout yang beda sendiri

---

## 11. Update Policy
Jika ada perubahan UI:
- Revisi dokumen ini terlebih dahulu
- Setelah itu baru desain/kode lain boleh ikut berubah
