# Redline Production — Website Hampers & Parcel Lebaran

Website mini marketplace untuk Hampers & Parcel Lebaran milik **Redline Production**, Jember.

---

## 🚀 Cara Deploy ke Vercel

### Step 1 — Upload ke GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/redline-production.git
git push -u origin main
```

### Step 2 — Connect ke Vercel
1. Buka [vercel.com](https://vercel.com) → Login
2. Klik **"Add New Project"** → Import dari GitHub
3. Klik **"Deploy"** — selesai! 🎉

### Step 3 — Setup Environment Variable (untuk testimoni)
1. Di Vercel → **Settings → Environment Variables**
2. Tambah: `GOOGLE_SHEETS_WEBAPP_URL` = URL dari Apps Script
3. Lihat panduan lengkap di **`GOOGLE_SHEETS_SETUP.md`**

---

## 🖼️ Cara Upload Foto Produk

Simpan foto paket di folder `public/images/` dengan nama:
```
public/images/paket-1.jpg
public/images/paket-2.jpg
public/images/paket-3.jpg
... sampai ...
public/images/paket-10.jpg
```

Format yang didukung: `.jpg`, `.jpeg`, `.png`, `.webp`

---

## 🏷️ Cara Upload Logo

Simpan file logo di:
```
public/logo.png
```

---

## 💻 Cara Jalankan Lokal

```bash
npm install
npm run dev
# Buka http://localhost:3000
```

---

## 📁 Struktur Proyek

```
redline-production/
├── app/
│   ├── page.tsx              # Beranda
│   ├── catalog/page.tsx      # Katalog + filter
│   ├── order/page.tsx        # Keranjang + form order
│   ├── testimonials/page.tsx # Testimoni
│   ├── api/testimonials/     # API endpoint Google Sheets
│   └── globals.css
├── components/
│   ├── Navbar.tsx            # Navbar + cart badge + logo
│   ├── Footer.tsx
│   └── ProductCard.tsx       # Kartu produk + tombol keranjang
├── context/
│   └── CartContext.tsx       # Global cart state
├── lib/
│   └── data.ts               # Data produk & testimoni
├── public/
│   ├── logo.png              # ← Upload logo kamu di sini
│   └── images/
│       ├── paket-1.jpg       # ← Upload foto paket di sini
│       └── ... paket-10.jpg
├── GOOGLE_SHEETS_SETUP.md    # Panduan setup testimoni
└── .env.example
```

---

## ✏️ Cara Update Produk / Harga

Edit file `lib/data.ts`:
- Ubah `products` array untuk harga, nama, isi paket
- Ubah `testimonials` array untuk testimoni statis

---

## 📞 Kontak

- **WhatsApp:** 0855 1234 202  
- **Alamat:** Jl. Anggrek No. 2, Jember Lor, Patrang, Jember, Jawa Timur
