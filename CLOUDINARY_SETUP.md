# 📸 Panduan Setup Cloudinary (Upload Foto Produk)

Cloudinary adalah layanan hosting gambar gratis yang digunakan untuk menyimpan
foto produk yang diupload dari admin panel. Vercel tidak mengizinkan menyimpan
file permanen, jadi Cloudinary digunakan sebagai solusi.

## Kenapa Cloudinary?
- ✅ Gratis (25GB storage, 25GB bandwidth/bulan)
- ✅ URL permanen yang tidak hilang saat redeploy
- ✅ Otomatis optimasi gambar
- ✅ Tidak perlu server sendiri

---

## Langkah 1 — Daftar Cloudinary

1. Buka [cloudinary.com](https://cloudinary.com)
2. Klik **Sign Up For Free**
3. Isi form registrasi (bisa login dengan Google)
4. Setelah masuk, kamu akan melihat **Dashboard**
5. Catat nilai **Cloud name** (ada di bagian atas dashboard)

---

## Langkah 2 — Buat Upload Preset

Upload Preset memungkinkan upload tanpa API key (unsigned upload).

1. Di Cloudinary Dashboard, klik ikon ⚙️ **Settings**
2. Pilih tab **Upload**
3. Scroll ke bawah ke bagian **Upload presets**
4. Klik **Add upload preset**
5. Isi form:
   - **Upload preset name**: `redline_products` (atau nama lain bebas)
   - **Signing mode**: Ubah ke **Unsigned** ← PENTING!
   - **Folder**: `redline` (opsional, untuk organisasi)
6. Klik **Save**
7. **Catat nama preset** yang kamu buat

---

## Langkah 3 — Tambahkan ke Vercel Environment Variables

Di Vercel → Settings → Environment Variables, tambahkan:

| Name | Value |
|------|-------|
| `CLOUDINARY_CLOUD_NAME` | Cloud name dari dashboard Cloudinary |
| `CLOUDINARY_UPLOAD_PRESET` | Nama preset yang dibuat di Langkah 2 |

Contoh:
```
CLOUDINARY_CLOUD_NAME = my-cloud-123
CLOUDINARY_UPLOAD_PRESET = redline_products
```

---

## Langkah 4 — Redeploy

Setelah menambahkan env variable, klik **Redeploy** di Vercel.

---

## Cara Kerja

1. Admin upload foto dari `/redline-admin`
2. Foto dikirim ke Cloudinary → mendapat URL permanen
3. URL disimpan di Google Sheets (kolom I sheet "Produk")
4. Website menggunakan URL tersebut untuk menampilkan foto

---

## Catatan

- Jika Cloudinary belum disetup, produk tetap bisa ditambah/diedit — hanya tanpa foto
- Foto lama (paket-1.jpg dst di /public/images/) tetap berfungsi sebagai fallback
- Batas upload gratis: 25GB storage — lebih dari cukup untuk ratusan foto produk
