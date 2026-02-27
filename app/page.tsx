import Link from "next/link";
import { products as hardcodeProducts, testimonials, formatPrice } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/data";

// Server component — fetch produk dari API saat build/request
async function getProducts(): Promise<Product[]> {
  try {
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/products`, {
      next: { revalidate: 120 }, // revalidate tiap 2 menit
    });

    if (!res.ok) throw new Error();
    const data = await res.json();
    return data.products?.length > 0 ? data.products : hardcodeProducts;
  } catch {
    return hardcodeProducts;
  }
}

export default async function Home() {
  const products = await getProducts();
  const featuredProducts = products.filter((p) => p.popular);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-light/20">
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-primary-100/50 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-6 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Parcel & Hampers Lebaran Premium
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-neutral-900 mb-6 leading-tight animate-fade-up">
            Hadirkan <span className="text-gradient">Kebahagiaan</span>
            <br />di Setiap Momen
          </h1>

          <p className="text-neutral-600 text-lg md:text-xl mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "100ms" }}>
            Parcel dan hampers pilihan terbaik untuk keluarga, kolega, dan orang-orang tersayang.
            Berkualitas premium dengan harga yang terjangkau.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up" style={{ animationDelay: "200ms" }}>
            <Link href="/catalog" className="btn-primary text-base px-8 py-3.5">
              Lihat Katalog →
            </Link>
            <Link href="/order" className="btn-outline text-base px-8 py-3.5">
              Pesan Sekarang
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto animate-fade-up" style={{ animationDelay: "300ms" }}>
            {[
              { value: "500+", label: "Pelanggan" },
              { value: `${products.length}`, label: "Pilihan Paket" },
              { value: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-semibold text-accent">{stat.value}</div>
                <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🎁", title: "Kemasan Cantik", desc: "Dikemas dengan rapi dan elegan" },
              { icon: "🚚", title: "Pengiriman Aman", desc: "Diantar langsung ke tujuan" },
              { icon: "✨", title: "Produk Premium", desc: "Pilihan merek-merek terbaik" },
              { icon: "💌", title: "Kartu Ucapan", desc: "Sertakan pesan spesialmu" },
            ].map((f, i) => (
              <div key={i} className="text-center p-5 rounded-2xl hover:bg-primary-50 transition-colors">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-sm text-neutral-900 mb-1">{f.title}</h3>
                <p className="text-xs text-neutral-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20 bg-neutral-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Terlaris</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">Paket Pilihan</h2>
              <p className="section-subtitle">Paket-paket yang paling banyak dipilih pelanggan kami</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {featuredProducts.slice(0, 3).map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
            <div className="text-center">
              <Link href="/catalog" className="btn-outline px-8">
                Lihat Semua {products.length} Paket →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Price Range */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Harga Terjangkau</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">Sesuai Budget Kamu</h2>
          <p className="section-subtitle mb-10">Tersedia berbagai pilihan mulai dari paket ekonomis hingga premium</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Standard", range: "Rp 100rb – 300rb", desc: "Cocok untuk hadiah personal", color: "from-blue-50 to-blue-100/50", badge: "bg-blue-100 text-blue-700" },
              { label: "Premium", range: "Rp 300rb – 700rb", desc: "Untuk momen yang lebih istimewa", color: "from-amber-50 to-amber-100/50", badge: "bg-amber-100 text-amber-700" },
              { label: "Custom", range: "Sesuai kebutuhan", desc: "Hubungi kami untuk paket custom", color: "from-purple-50 to-purple-100/50", badge: "bg-purple-100 text-purple-700" },
            ].map((tier) => (
              <div key={tier.label} className={`bg-gradient-to-br ${tier.color} rounded-2xl p-6 text-left border border-neutral-100`}>
                <span className={`badge ${tier.badge} text-xs mb-3`}>{tier.label}</span>
                <div className="font-display text-xl font-semibold text-neutral-900 mb-1">{tier.range}</div>
                <p className="text-sm text-neutral-500">{tier.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Ulasan</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">Kata Pelanggan Kami</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {featuredTestimonials.map((t, i) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 border border-neutral-100 hover:shadow-md transition-shadow" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={`text-sm ${j < t.rating ? "text-amber-400" : "text-neutral-200"}`}>★</span>
                  ))}
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-neutral-900">{t.name}</div>
                    <div className="text-xs text-neutral-400">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <Link href="/testimonials" className="btn-outline px-8">Lihat Semua Ulasan →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-neutral-900">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-white mb-4">
            Siap Pesan Parcel Impianmu?
          </h2>
          <p className="text-neutral-400 mb-8">
            Hubungi kami sekarang dan dapatkan parcel terbaik untuk orang-orang tersayang
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/order" className="btn-primary text-base px-8 py-3.5">
              Pesan Sekarang
            </Link>
            <a
              href="https://wa.me/6208551234202"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors text-base"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
