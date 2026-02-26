"use client";
import { useState } from "react";
import { products, formatPrice } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

type FilterCategory = "all" | "standard" | "premium";
type FilterPrice = "all" | "under200" | "200to400" | "above400";

export default function CatalogPage() {
  const [category, setCategory] = useState<FilterCategory>("all");
  const [priceFilter, setPriceFilter] = useState<FilterPrice>("all");
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) => {
    const matchCat = category === "all" || p.category === category;
    const matchPrice =
      priceFilter === "all" ||
      (priceFilter === "under200" && p.price < 200000) ||
      (priceFilter === "200to400" && p.price >= 200000 && p.price <= 400000) ||
      (priceFilter === "above400" && p.price > 400000);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.items.some((item) => item.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchPrice && matchSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Hampers & Parcel Lebaran 2026</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">
            Katalog Lengkap
          </h1>
          <p className="section-subtitle max-w-lg mx-auto">
            Pilih paket yang sesuai kebutuhan dan anggaran kamu. Tersedia {products.length} pilihan paket.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-neutral-100 p-4 sm:p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Cari paket atau isi produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
              />
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {([
                { value: "all", label: "Semua" },
                { value: "standard", label: "Standar" },
                { value: "premium", label: "Premium 👑" },
              ] as { value: FilterCategory; label: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setCategory(opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    category === opt.value
                      ? "bg-accent text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Price Filter */}
            <div className="flex gap-2 flex-wrap">
              {([
                { value: "all", label: "Semua Harga" },
                { value: "under200", label: "< 200rb" },
                { value: "200to400", label: "200–400rb" },
                { value: "above400", label: "> 400rb" },
              ] as { value: FilterPrice; label: string }[]).map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setPriceFilter(opt.value)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    priceFilter === opt.value
                      ? "bg-primary-700 text-white"
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results count */}
          <p className="mt-3 text-sm text-neutral-400">
            Menampilkan <span className="font-semibold text-neutral-700">{filtered.length}</span> dari {products.length} paket
          </p>
        </div>

        {/* Products Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-neutral-500 text-lg">Tidak ada paket yang sesuai filter.</p>
            <button
              onClick={() => { setCategory("all"); setPriceFilter("all"); setSearch(""); }}
              className="mt-4 btn-outline"
            >
              Reset Filter
            </button>
          </div>
        )}

        {/* Price Summary Table */}
        <div className="mt-12 bg-white rounded-2xl border border-neutral-100 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-neutral-100">
            <h2 className="font-display text-lg font-semibold">Ringkasan Harga Semua Paket</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-6 py-3 text-neutral-500 font-medium">Paket</th>
                  <th className="text-left px-6 py-3 text-neutral-500 font-medium">Kategori</th>
                  <th className="text-left px-6 py-3 text-neutral-500 font-medium">Jumlah Item</th>
                  <th className="text-right px-6 py-3 text-neutral-500 font-medium">Harga</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, i) => (
                  <tr key={p.id} className={`border-t border-neutral-50 hover:bg-neutral-50 transition-colors ${i % 2 === 0 ? "" : "bg-neutral-50/50"}`}>
                    <td className="px-6 py-3 font-medium text-neutral-900">
                      {p.emoji} {p.name}
                      {p.popular && <span className="ml-2 badge bg-accent/10 text-accent text-xs">Populer</span>}
                    </td>
                    <td className="px-6 py-3 capitalize">
                      <span className={`badge ${p.category === "premium" ? "bg-neutral-900 text-white" : "bg-neutral-100 text-neutral-600"}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-neutral-500">{p.items.length} item</td>
                    <td className="px-6 py-3 text-right font-semibold text-accent">{formatPrice(p.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
