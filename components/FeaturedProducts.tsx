"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { products as hardcodeProducts } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/data";

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>(hardcodeProducts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        if (data.products?.length > 0) setProducts(data.products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const featured = products.filter(p => p.popular);

  // Kalau tidak ada produk populer, jangan tampilkan section ini
  if (!loading && featured.length === 0) return null;

  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Terlaris</p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">Paket Pilihan</h2>
          <p className="section-subtitle">Paket-paket yang paling banyak dipilih pelanggan kami</p>
        </div>

        {loading ? (
          // Skeleton loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-neutral-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  <div className="h-9 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {featured.slice(0, 3).map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/catalog" className="btn-outline px-8">
            Lihat Semua {products.length} Paket →
          </Link>
        </div>
      </div>
    </section>
  );
}
