# Redline Production — Website Hampers & Parcel Lebaran

Website mini marketplace untuk Hampers & Parcel Lebaran milik **Redline Production**, Jember.

## 🚀 Cara Deploy ke Vercel

### Metode 1: Via GitHub (Recommended)

1. **Upload ke GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Redline Production website"
   git remote add origin https://github.com/username/redline-production.git
   git push -u origin main
   ```

2. **Connect ke Vercel**
   - Buka [vercel.com](https://vercel.com) dan login
   - Klik **"Add New Project"**
   - Import repository dari GitHub
   - Klik **"Deploy"** — selesai! 🎉

### Metode 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Di folder project
npm install
vercel

# Ikuti instruksi, pilih "Next.js"
```

---

## 💻 Cara Jalankan Lokal

```bash
# Install dependencies
npm install

# Jalankan development server
npm run dev

# Buka http://localhost:3000
```

## 📁 Struktur Proyek

```
redline-production/
├── app/
│   ├── page.tsx          # Halaman Beranda
│   ├── catalog/
│   │   └── page.tsx      # Katalog produk + filter
│   ├── order/
│   │   └── page.tsx      # Form pemesanan + WA integration
│   ├── testimonials/
│   │   └── page.tsx      # Testimoni pelanggan
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── Navbar.tsx        # Navigasi
│   ├── Footer.tsx        # Footer
│   └── ProductCard.tsx   # Kartu produk
├── lib/
│   └── data.ts           # Data produk & testimoni
├── package.json
├── tailwind.config.ts
└── vercel.json
```

## ✏️ Cara Update Data Produk

Edit file `lib/data.ts` untuk mengubah:
- Nama, harga, isi paket → array `products`
- Testimoni → array `testimonials`

## 📞 Kontak

- **WhatsApp:** 0855 1234 202
- **Alamat:** Jl. Anggrek No. 2, Jember Lor, Patrang, Jember, Jawa Timur

---

Built with ❤️ using Next.js 14 + Tailwind CSS
