import Link from "next/link";
import { products, testimonials, formatPrice } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const featuredProducts = products.filter((p) => p.popular);
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-50 via-primary-50 to-accent-light/20">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-primary-100/50 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-accent-light/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center pt-20 pb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-accent/20 rounded-full px-4 py-2 text-sm text-accent font-medium mb-6 shadow-sm animate-fade-in">
            🌙 Lebaran 2026 — Tersedia 10 Paket Pilihan
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold text-neutral-900 leading-tight mb-6 animate-fade-up">
            Hampers &amp; Parcel{" "}
            <span className="text-accent italic">Lebaran</span>
            <br />
            <span className="text-3xl sm:text-4xl md:text-5xl font-normal text-neutral-500">
              yang Bermakna
            </span>
          </h1>

          <p className="section-subtitle max-w-xl mx-auto mb-8 animate-fade-up animate-delay-200">
            Parcel Lebaran berkualitas dengan kemasan elegan untuk hadiah bermakna di momen Idul Fitri. 
            Tersedia mulai dari{" "}
            <span className="text-accent font-semibold">{formatPrice(100000)}</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up animate-delay-300">
            <Link href="/catalog" className="btn-primary text-base px-8 py-3.5">
              Lihat Katalog 🎁
            </Link>
            <a
              href="https://wa.me/6208551234202?text=Halo%20Redline%20Production%2C%20saya%20ingin%20melihat%20katalog%20parcel%20lebaran."
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-base px-8 py-3.5"
            >
              Tanya via WhatsApp
            </a>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-sm mx-auto animate-fade-up animate-delay-400">
            {[
              { value: "10+", label: "Pilihan Paket" },
              { value: "500+", label: "Customer Puas" },
              { value: "4.9★", label: "Rating" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-2xl font-semibold text-accent">{stat.value}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-50">
          <span className="text-xs text-neutral-400">Scroll</span>
          <div className="w-0.5 h-6 bg-neutral-300 rounded" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🎁", title: "Kemasan Elegan", desc: "Dikemas dengan indah dan rapi untuk kesan yang berkesan" },
              { icon: "✅", title: "Produk Berkualitas", desc: "Isi paket pilihan produk terpercaya dan berkualitas" },
              { icon: "🚚", title: "Pengiriman Aman", desc: "Dijamin aman sampai ke tangan penerima dengan selamat" },
              { icon: "💬", title: "Respon Cepat", desc: "Layanan WA aktif untuk konsultasi dan pemesanan" },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6 rounded-2xl hover:bg-primary-50 transition-colors">
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-neutral-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-neutral-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 px-4 sm:px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Pilihan Terbaik</p>
            <h2 className="section-title mb-3">Paket Populer</h2>
            <div className="ornament-divider w-32 mx-auto">
              <span className="text-accent text-sm">✦</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/catalog" className="btn-outline">
              Lihat Semua Paket →
            </Link>
          </div>
        </div>
      </section>

      {/* Price Range Section */}
      <section className="py-16 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Terjangkau untuk Semua</p>
            <h2 className="section-title mb-3">Range Harga Paket</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { label: "Hemat", range: "Rp 100.000 – Rp 175.000", packs: "Paket 1–4", color: "bg-green-50 border-green-200", badge: "bg-green-100 text-green-700" },
              { label: "Standar", range: "Rp 275.000 – Rp 300.000", packs: "Paket 5–8", color: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700" },
              { label: "Premium", range: "Rp 350.000 – Rp 700.000", packs: "Paket 9–10", color: "bg-purple-50 border-purple-200", badge: "bg-purple-100 text-purple-700" },
            ].map((tier) => (
              <div key={tier.label} className={`p-6 rounded-2xl border ${tier.color} text-center`}>
                <span className={`badge ${tier.badge} mb-3`}>{tier.label}</span>
                <div className="font-display text-lg font-semibold text-neutral-900 mt-2">{tier.range}</div>
                <div className="text-sm text-neutral-500 mt-1">{tier.packs}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-16 px-4 sm:px-6 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Kata Mereka</p>
            <h2 className="section-title">Testimoni Pelanggan</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredTestimonials.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl p-6 border border-neutral-100 hover:shadow-lg transition-shadow">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-neutral-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-neutral-900">{t.name}</div>
                    <div className="text-xs text-neutral-400">{t.location} · {t.package}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/testimonials" className="btn-outline">
              Lihat Semua Testimoni →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 bg-neutral-900 text-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-4">🌙</div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
            Siap Pesan untuk <span className="text-accent">Lebaran 2026</span>?
          </h2>
          <p className="text-neutral-400 mb-8">
            Pesan sekarang sebelum kehabisan! Hubungi kami via WhatsApp atau isi form pemesanan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/6208551234202?text=Halo%20Redline%20Production%2C%20saya%20ingin%20memesan%20parcel%20lebaran."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3.5 rounded-full transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat WhatsApp
            </a>
            <Link href="/order" className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-8 py-3.5 rounded-full transition-colors">
              Form Pemesanan
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
