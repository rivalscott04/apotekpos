# 07_APPROVAL_MATRIX.md

## Approval Matrix Aplikasi Farmasi

### Tujuan
Approval Matrix berfungsi untuk:
- Mengontrol aksi berisiko tinggi
- Mencegah fraud & human error
- Menjaga kepatuhan farmasi & keuangan
- Memastikan jejak audit yang jelas

Matrix ini bersifat **configurable**, namun di bawah adalah **default best practice**.

---

## A. Prinsip Umum Approval

- Semua aksi berisiko **tidak dieksekusi langsung**
- Aksi harus memiliki:
  - Requestor
  - Approver
  - Alasan
  - Timestamp
- Approval bersifat **role-based**, bukan user-based
- Semua keputusan masuk **audit log (immutable)**

---

## B. Level Approval

| Level | Role |
|------|------|
| L0 | Sistem (otomatis, rule engine) |
| L1 | Kasir |
| L2 | Apoteker |
| L3 | Manager Cabang |
| L4 | Owner |

---

## C. Approval Matrix – Transaksi POS

| Aksi | Kasir | Apoteker | Manager | Owner |
|-----|------|----------|---------|-------|
| Diskon ≤ limit kasir | ✅ | ❌ | ❌ | ❌ |
| Diskon > limit kasir | ❌ | ❌ | ✅ | ✅ |
| Diskon ekstrem (> threshold) | ❌ | ❌ | ❌ | ✅ |
| Void transaksi (belum bayar) | ❌ | ❌ | ✅ | ✅ |
| Void transaksi (sudah bayar) | ❌ | ❌ | ❌ | ✅ |
| Retur dengan nota | ⚠️ | ❌ | ✅ | ✅ |
| Retur tanpa nota | ❌ | ❌ | ❌ | ✅ |

Keterangan:
- ⚠️ = bisa request, tapi butuh approval
- ❌ = tidak bisa request langsung

---

## D. Approval Matrix – Inventory & Stok

| Aksi | Gudang | Apoteker | Manager | Owner |
|-----|--------|----------|---------|-------|
| Adjustment stok kecil | ❌ | ❌ | ✅ | ❌ |
| Adjustment stok besar | ❌ | ❌ | ❌ | ✅ |
| Lock batch expired | ❌ | ✅ | ❌ | ❌ |
| Unlock batch | ❌ | ❌ | ❌ | ✅ |
| Transfer antar cabang | ❌ | ❌ | ✅ | ❌ |
| Transfer lintas wilayah | ❌ | ❌ | ❌ | ✅ |
| Stok opname selisih besar | ❌ | ❌ | ❌ | ✅ |

---

## E. Approval Matrix – Resep & Farmasi

| Aksi | Kasir | Apoteker | Manager | Owner |
|-----|------|----------|---------|-------|
| Validasi resep | ❌ | ✅ | ❌ | ❌ |
| Reject resep | ❌ | ✅ | ❌ | ❌ |
| Override batch FEFO | ❌ | ❌ | ❌ | ✅ |
| Jual obat terkunci | ❌ | ❌ | ❌ | ❌ |
| Unlock obat khusus | ❌ | ❌ | ❌ | ✅ |

Catatan:
- Obat expired / recall **tidak bisa di-override**
- Sistem L0 wajib memblokir otomatis

---

## F. Approval Matrix – Harga & Keuangan

| Aksi | Manager | Owner |
|-----|---------|-------|
| Ubah harga jual cabang | ✅ | ❌ |
| Harga < HPP | ❌ | ✅ |
| Ubah margin minimum | ❌ | ✅ |
| Ubah HPP | ❌ | ✅ |
| Hapus histori harga | ❌ | ❌ |

---

## G. Approval Matrix – User & RBAC

| Aksi | Manager | Owner |
|-----|---------|-------|
| Assign kasir ke cabang | ✅ | ❌ |
| Assign manager ke cabang | ❌ | ✅ |
| Buat role baru | ❌ | ✅ |
| Ubah permission global | ❌ | ✅ |
| Disable user | ✅ | ✅ |

---

## H. Flow Approval (Umum)

User Request Action
→ Sistem validasi threshold
→ Status: PENDING_APPROVAL
→ Notifikasi ke Approver
→ Approver Review
→ Approve / Reject
→ Sistem eksekusi aksi
→ Audit log tercatat


---

## I. Field Wajib pada Approval Request

- request_id
- request_type
- requester_user_id
- requester_role
- cabang_id
- nilai / impact
- alasan_request
- status
- approver_user_id
- waktu_request
- waktu_approval

---

## J. Audit & Kepatuhan

Setiap approval wajib mencatat:
- Sebelum & sesudah (before-after)
- User & role
- IP / device (opsional)
- Cabang

Approval **tidak boleh dihapus**, hanya bisa ditutup.

---

## K. Best Practice Implementasi

- Approval berbasis **nominal + tipe aksi**
- Threshold configurable per cabang
- SLA approval (alert jika lama)
- Approval summary untuk owner
- Integrasi notifikasi real-time

---
