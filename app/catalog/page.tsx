"use client";
import { useState, useEffect } from "react";
import { products as hardcodeProducts, formatPrice } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/lib/data";

type FilterCategory = "all" | "standard" | "premium";
type FilterPrice = "all" | "under200" | "200to400" | "above400";

export default function CatalogPage() {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [priceFilter, setPriceFilter] = useState<FilterPrice>("all");
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>(hardcodeProducts);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<string>("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (data.products?.length > 0) {
          setProducts(data.products);
          setSource(data.source);
        }
      })
      .catch(() => {/* tetap pakai hardcode */})
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchPrice =
      priceFilter === "all" ||
      (priceFilter === "under200" && p.price < 200000) ||
      (priceFilter === "200to400" && p.price >= 200000 && p.price <= 400000) ||
      (priceFilter === "above400" && p.price > 400000);
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.items.some((item) => item.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchPrice && matchSearch;
  });

  const filterCategories: { value: FilterCategory; label: string }[] = [
    { value: "all", label: "Semua" },
    { value: "standard", label: "Standard" },
    { value: "premium", label: "Premium 👑" },
  ];

  const filterPrices: { value: FilterPrice; label: string }[] = [
    { value: "all", label: "Semua Harga" },
    { value: "under200", label: "< Rp 200rb" },
    { value: "200to400", label: "Rp 200–400rb" },
    { value: "above400", label: "> Rp 400rb" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Pilihan Terbaik</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">Katalog Parcel</h1>
          <p className="section-subtitle">
            {loading ? "Memuat katalog..." : `${products.length} paket tersedia${source === "sheets" ? " · diperbarui realtime" : ""}`}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari paket atau isi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
            />
          </div>

          {/* Category Filter */}
          <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl">
            {filterCategories.map((f) => (
              <button
                key={f.value}
                onClick={() => setCategory(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  category === f.value ? "bg-white text-accent shadow-sm" : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Price Filter */}
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as FilterPrice)}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 text-sm text-neutral-600 focus:outline-none focus:border-accent bg-white"
          >
            {filterPrices.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-neutral-100 overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-neutral-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  <div className="h-8 bg-neutral-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Product Grid */}
        {!loading && (
          <>
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filtered.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-neutral-100">
                <div className="text-4xl mb-3">🔍</div>
                <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">Tidak ditemukan</h3>
                <p className="text-neutral-500 text-sm mb-4">Coba ubah filter atau kata kunci pencarian</p>
                <button
                  onClick={() => { setCategory("all"); setPriceFilter("all"); setSearch(""); }}
                  className="btn-outline text-sm"
                >
                  Reset Filter
                </button>
              </div>
            )}

            {/* Summary Table */}
            <div className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-neutral-100">
                <h3 className="font-semibold text-neutral-900">Perbandingan Harga</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-neutral-50">
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Paket</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">Isi</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-neutral-500 uppercase tracking-wide">Harga</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-neutral-900">{p.emoji} {p.name}</td>
                        <td className="px-6 py-3">
                          <span className={`badge text-xs ${p.category === "premium" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                            {p.category}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-neutral-500 max-w-xs truncate">{p.items.join(", ")}</td>
                        <td className="px-6 py-3 text-right font-semibold text-accent">{formatPrice(p.price)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
