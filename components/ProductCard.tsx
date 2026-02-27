"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Product, formatPrice } from "@/lib/data";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, items } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const inCart = items.find((i) => i.product.id === product.id);

  const handleAddToCart = () => {
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Prioritas: imageUrl (base64 atau Cloudinary URL) → path lokal → emoji fallback
  const imageSrc = product.imageUrl || `/images/paket-${product.id}.jpg`;
  const isUnoptimized = !!product.imageUrl && (
    product.imageUrl.startsWith("data:") || product.imageUrl.startsWith("http")
  );

  const waMessage = encodeURIComponent(
    `Halo Redline Production, saya ingin memesan *${product.name}* (${formatPrice(product.price)}). Mohon info ketersediaan. Terima kasih! 🎁`
  );

  return (
    <div
      className="card group flex flex-col relative overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
      onMouseEnter={() => setShowDetail(true)}
      onMouseLeave={() => setShowDetail(false)}
    >
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-50 to-accent-light/30 flex items-center justify-center">
        {!imgError ? (
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setImgError(true)}
            unoptimized={isUnoptimized}
          />
        ) : (
          <span className="text-6xl select-none">{product.emoji}</span>
        )}
        {!imgError && <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />}

        {product.popular && (
          <span className="absolute top-3 right-3 badge bg-accent text-white shadow-sm">⭐ Populer</span>
        )}
        {product.category === "premium" && (
          <span className="absolute top-3 left-3 badge bg-neutral-900 text-white shadow-sm">👑 Premium</span>
        )}

        {/* Detail overlay — slide up on hover/tap */}
        <div
          className={`absolute inset-0 bg-neutral-900/92 backdrop-blur-sm flex flex-col justify-between p-4 transition-all duration-300 ${
            showDetail ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
          }`}
        >
          {/* Header overlay */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-semibold text-sm">{product.emoji} {product.name}</span>
              <span className="text-accent font-bold text-sm">{formatPrice(product.price)}</span>
            </div>
            <p className="text-neutral-400 text-xs mb-2 uppercase tracking-wide font-medium">
              {product.items.length} item dalam paket:
            </p>
            {/* Items list — scrollable jika banyak */}
            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 custom-scroll">
              {product.items.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0 mt-0.5" />
                  <span className="text-neutral-200 text-xs leading-snug">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick action from overlay */}
          <button
            onClick={(e) => { e.stopPropagation(); handleAddToCart(); }}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all mt-3 ${
              added ? "bg-green-500 text-white" : "bg-accent hover:bg-accent-dark text-white"
            }`}
          >
            {added ? "✓ Ditambahkan!" : "🛒 Tambah ke Keranjang"}
          </button>
        </div>

        {/* Hint icon — visible when not hovered */}
        <div className={`absolute bottom-2 right-2 transition-opacity duration-200 ${showDetail ? "opacity-0" : "opacity-100"}`}>
          <div className="bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-white text-xs">Detail</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="px-5 pt-4 pb-2 flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-display text-lg font-semibold text-neutral-900">{product.name}</h3>
          <span className="text-accent font-semibold text-base whitespace-nowrap">{formatPrice(product.price)}</span>
        </div>
        <p className="text-xs text-neutral-400 mb-3">{product.items.length} item · hover/tap kartu untuk lihat detail</p>

        {/* Preview items — hanya 3 item pertama */}
        <div className="flex flex-wrap gap-1 mb-1">
          {product.items.slice(0, 3).map((item, i) => (
            <span key={i} className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">{item}</span>
          ))}
          {product.items.length > 3 && (
            <button
              onClick={() => setShowDetail(true)}
              className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full hover:bg-accent/20 transition-colors"
            >
              +{product.items.length - 3} lainnya →
            </button>
          )}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="px-5 pb-5 pt-3 flex flex-col gap-2">
        <button
          onClick={handleAddToCart}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
            added
              ? "bg-green-500 text-white scale-95"
              : inCart
              ? "bg-accent/10 text-accent border border-accent/30 hover:bg-accent hover:text-white"
              : "bg-accent text-white hover:bg-accent-dark hover:shadow-md"
          }`}
        >
          {added ? "✓ Ditambahkan!" : inCart ? `🛒 Tambah Lagi (${inCart.qty})` : "🛒 Tambah ke Keranjang"}
        </button>
        <div className="flex gap-2">
          <a
            href={`https://wa.me/6208551234202?text=${waMessage}`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-medium py-2 rounded-xl transition-colors border border-green-200"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Tanya WA
          </a>
          <Link
            href="/order"
            className="flex-1 inline-flex items-center justify-center text-xs font-medium py-2 rounded-xl border border-neutral-200 text-neutral-600 hover:border-accent hover:text-accent transition-colors"
          >
            Lihat Keranjang
          </Link>
        </div>
      </div>

      {/* Mobile tap overlay toggle — visible on touch devices */}
      <button
        className="absolute top-2 left-1/2 -translate-x-1/2 md:hidden z-10 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1 text-white text-xs flex items-center gap-1"
        onClick={() => setShowDetail(v => !v)}
      >
        {showDetail ? "✕ Tutup" : "👁 Lihat Isi Paket"}
      </button>
    </div>
  );
}
