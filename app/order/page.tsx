"use client";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { products as hardcodeProducts, formatPrice, Product } from "@/lib/data";
import ProductThumb from "@/components/ProductThumb";
import { useEffect } from "react";

function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const handle = () => { addItem(product, 1); setAdded(true); setTimeout(() => setAdded(false), 1200); };
  return (
    <button onClick={handle}
      className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex-shrink-0 ${added ? "bg-green-500 text-white" : "text-accent border border-accent/30 hover:bg-accent hover:text-white"}`}>
      {added ? "✓" : "+ Tambah"}
    </button>
  );
}

interface FormData {
  name: string; phone: string; address: string; deliveryDate: string; notes: string;
}

export default function OrderPage() {
  const { items, updateQty, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "", deliveryDate: "", notes: "" });
  const [step, setStep] = useState<"cart" | "form" | "done">("cart");
  const [allProducts, setAllProducts] = useState<Product[]>(hardcodeProducts);

  // Fetch produk realtime untuk QuickAdd suggestions
  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => { if (data.products?.length > 0) setAllProducts(data.products); })
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const buildWAMessage = () => {
    const itemLines = items.map((i) => `  • ${i.product.name} x${i.qty} = ${formatPrice(i.product.price * i.qty)}`).join("\n");
    const lines = [
      "🎁 *PEMESANAN PARCEL LEBARAN*", "━━━━━━━━━━━━━━━━━━",
      `👤 *Nama:* ${form.name}`, `📱 *No. HP:* ${form.phone}`,
      `📍 *Alamat:* ${form.address}`,
      `📅 *Tgl Kirim:* ${form.deliveryDate || "Sesuai kesepakatan"}`,
      "", "📦 *Pesanan:*", itemLines, "",
      `💰 *Total: ${formatPrice(totalPrice)}*`,
      form.notes ? `📝 *Catatan:* ${form.notes}` : "",
      "━━━━━━━━━━━━━━━━━━",
      "Mohon konfirmasi ketersediaan dan detail pembayaran. Terima kasih! 🙏",
    ].filter(Boolean).join("\n");
    return encodeURIComponent(lines);
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setStep("done"); };
  const handleReset = () => { setStep("cart"); setForm({ name: "", phone: "", address: "", deliveryDate: "", notes: "" }); };
  const isFormValid = form.name && form.phone && form.address;

  // Ringkasan item untuk sidebar dan step done
  const OrderSummaryItem = ({ product, qty }: { product: Product; qty: number }) => (
    <div className="flex items-center gap-3">
      <ProductThumb product={product} size={40} rounded="rounded-lg" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-neutral-800 truncate">{product.name} ×{qty}</p>
        <p className="text-xs text-accent">{formatPrice(product.price * qty)}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-neutral-900">Keranjang Pesanan</h1>
              <p className="text-neutral-500 text-sm mt-1">{totalItems > 0 ? `${totalItems} item dipilih` : "Belum ada item dipilih"}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {(["cart", "form", "done"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s ? "bg-accent text-white" :
                    (step === "form" && s === "cart") || step === "done" ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-500"
                  }`}>
                    {(step === "form" && s === "cart") || (step === "done" && s !== "done") ? "✓" : i + 1}
                  </div>
                  <span className={step === s ? "text-accent font-medium" : "text-neutral-400"}>
                    {s === "cart" ? "Keranjang" : s === "form" ? "Data Diri" : "Selesai"}
                  </span>
                  {i < 2 && <span className="text-neutral-300 mx-1">›</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* STEP 1: CART */}
        {step === "cart" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center">
                  <div className="text-5xl mb-4">🛒</div>
                  <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">Keranjang Kosong</h3>
                  <p className="text-neutral-500 text-sm mb-6">Tambahkan paket dari katalog untuk mulai memesan</p>
                  <Link href="/catalog" className="btn-primary">Lihat Katalog →</Link>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div key={item.product.id} className="bg-white rounded-2xl border border-neutral-100 p-4 flex gap-4 hover:shadow-sm transition-shadow">
                      {/* Foto produk — 80px */}
                      <ProductThumb product={item.product} size={80} rounded="rounded-xl" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-neutral-900">{item.product.name}</h4>
                            <p className="text-sm text-neutral-500 mt-0.5">{formatPrice(item.product.price)}</p>
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {item.product.items.slice(0, 3).map((itm, i) => (
                                <span key={i} className="text-xs bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded-md">{itm}</span>
                              ))}
                              {item.product.items.length > 3 && (
                                <span className="text-xs text-neutral-400">+{item.product.items.length - 3}</span>
                              )}
                            </div>
                          </div>
                          <button onClick={() => removeItem(item.product.id)}
                            className="text-neutral-300 hover:text-red-400 transition-colors flex-shrink-0 mt-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1 bg-neutral-100 rounded-xl p-1">
                            <button onClick={() => updateQty(item.product.id, item.qty - 1)}
                              className="w-7 h-7 rounded-lg bg-white text-neutral-600 text-lg font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center shadow-sm">−</button>
                            <span className="w-8 text-center text-sm font-semibold text-neutral-800">{item.qty}</span>
                            <button onClick={() => updateQty(item.product.id, item.qty + 1)}
                              className="w-7 h-7 rounded-lg bg-white text-neutral-600 text-lg font-bold hover:bg-neutral-50 transition-colors flex items-center justify-center shadow-sm">+</button>
                          </div>
                          <span className="font-semibold text-accent">{formatPrice(item.product.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button onClick={clearCart} className="text-xs text-neutral-400 hover:text-red-400 transition-colors mt-1">
                    🗑 Kosongkan keranjang
                  </button>
                </>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 sticky top-20">
                <h3 className="font-semibold text-neutral-900 mb-4">Ringkasan</h3>
                <div className="space-y-3 mb-4">
                  {items.length > 0 ? items.map((i) => (
                    <OrderSummaryItem key={i.product.id} product={i.product} qty={i.qty} />
                  )) : (
                    <p className="text-sm text-neutral-400 text-center py-4">Keranjang masih kosong</p>
                  )}
                </div>
                {items.length > 0 && (
                  <>
                    <div className="border-t border-neutral-100 pt-3 flex justify-between items-center mb-4">
                      <span className="font-semibold text-sm">Total</span>
                      <span className="font-display font-semibold text-accent text-lg">{formatPrice(totalPrice)}</span>
                    </div>
                    <button onClick={() => setStep("form")} className="w-full btn-primary justify-center py-3 text-sm">
                      Lanjut Pesan →
                    </button>
                  </>
                )}
              </div>

              {/* Quick Add */}
              {items.length > 0 && (
                <div className="mt-4 bg-white rounded-2xl border border-neutral-100 p-4">
                  <p className="text-xs font-semibold text-neutral-500 mb-3">Paket Lainnya</p>
                  <div className="space-y-2">
                    {allProducts.filter((p) => !items.find((i) => i.product.id === p.id)).slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <ProductThumb product={p} size={32} rounded="rounded-lg" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-neutral-700 truncate">{p.name}</p>
                          <p className="text-xs text-accent">{formatPrice(p.price)}</p>
                        </div>
                        <QuickAddButton product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: FORM */}
        {step === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                  <button onClick={() => setStep("cart")} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="font-semibold text-neutral-900">Data Pemesan</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nama Lengkap <span className="text-red-400">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap" required
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">No. HP / WhatsApp <span className="text-red-400">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" required
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Alamat Pengiriman <span className="text-red-400">*</span></label>
                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="Alamat lengkap pengiriman" required rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tanggal Pengiriman</label>
                    <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Catatan Tambahan</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Pesan khusus, ucapan kartu, dll." rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none" />
                  </div>
                  <button type="submit" disabled={!isFormValid}
                    className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                    Lanjut ke WhatsApp →
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 sticky top-20">
                <h3 className="font-semibold text-neutral-900 mb-4">Pesanan Kamu</h3>
                <div className="space-y-3 mb-4">
                  {items.map((i) => (
                    <OrderSummaryItem key={i.product.id} product={i.product} qty={i.qty} />
                  ))}
                </div>
                <div className="border-t border-neutral-100 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="font-display font-semibold text-accent text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DONE */}
        {step === "done" && (
          <div className="max-w-lg mx-auto text-center py-8">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-10">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">Pesanan Siap!</h2>
              <p className="text-neutral-500 mb-2">Klik tombol di bawah untuk kirim detail pesanan ke WhatsApp kami.</p>
              <div className="bg-neutral-50 rounded-xl p-3 mb-6 text-left">
                <p className="text-xs text-neutral-500 font-medium mb-3">Ringkasan ({items.length} paket):</p>
                <div className="space-y-2">
                  {items.map((i) => (
                    <div key={i.product.id} className="flex items-center gap-2">
                      <ProductThumb product={i.product} size={32} rounded="rounded-md" />
                      <span className="text-xs text-neutral-600 flex-1">{i.product.name} ×{i.qty}</span>
                      <span className="text-xs font-medium text-accent">{formatPrice(i.product.price * i.qty)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-semibold text-accent mt-3 pt-2 border-t border-neutral-200">Total: {formatPrice(totalPrice)}</p>
              </div>
              <a href={`https://wa.me/6208551234202?text=${buildWAMessage()}`}
                target="_blank" rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-base mb-3">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Kirim ke WhatsApp
              </a>
              <button onClick={handleReset} className="w-full btn-outline justify-center py-3 text-sm">← Kembali / Pesan Lagi</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function QuickAddButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const handle = () => { addItem(product, 1); setAdded(true); setTimeout(() => setAdded(false), 1200); };
  return (
    <button onClick={handle}
      className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex-shrink-0 ${added ? "bg-green-500 text-white" : "text-accent border border-accent/30 hover:bg-accent hover:text-white"}`}>
      {added ? "✓" : "+ Tambah"}
    </button>
  );
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  deliveryDate: string;
  notes: string;
}

export default function OrderPage() {
  const { items, updateQty, removeItem, clearCart, totalItems, totalPrice } = useCart();
  const [form, setForm] = useState<FormData>({ name: "", phone: "", address: "", deliveryDate: "", notes: "" });
  const [step, setStep] = useState<"cart" | "form" | "done">("cart");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const buildWAMessage = () => {
    const itemLines = items.map((i) => `  • ${i.product.name} x${i.qty} = ${formatPrice(i.product.price * i.qty)}`).join("\n");
    const lines = [
      "🎁 *PEMESANAN PARCEL LEBARAN*",
      "━━━━━━━━━━━━━━━━━━",
      `👤 *Nama:* ${form.name}`,
      `📱 *No. HP:* ${form.phone}`,
      `📍 *Alamat:* ${form.address}`,
      `📅 *Tgl Kirim:* ${form.deliveryDate || "Sesuai kesepakatan"}`,
      "",
      "📦 *Pesanan:*",
      itemLines,
      "",
      `💰 *Total: ${formatPrice(totalPrice)}*`,
      form.notes ? `📝 *Catatan:* ${form.notes}` : "",
      "━━━━━━━━━━━━━━━━━━",
      "Mohon konfirmasi ketersediaan dan detail pembayaran. Terima kasih! 🙏",
    ].filter((l) => l !== undefined).join("\n");
    return encodeURIComponent(lines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("done");
  };

  const handleReset = () => {
    setStep("cart");
    setForm({ name: "", phone: "", address: "", deliveryDate: "", notes: "" });
    // Keranjang TIDAK dihapus — user bisa langsung pesan lagi atau tambah item
  };

  const isFormValid = form.name && form.phone && form.address;

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-semibold text-neutral-900">Keranjang Pesanan</h1>
              <p className="text-neutral-500 text-sm mt-1">{totalItems > 0 ? `${totalItems} item dipilih` : "Belum ada item dipilih"}</p>
            </div>
            {/* Step Indicator */}
            <div className="hidden sm:flex items-center gap-2 text-sm">
              {(["cart", "form", "done"] as const).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    step === s ? "bg-accent text-white" : 
                    (step === "form" && s === "cart") || step === "done" ? "bg-green-500 text-white" : "bg-neutral-200 text-neutral-500"
                  }`}>
                    {(step === "form" && s === "cart") || step === "done" && s !== "done" ? "✓" : i + 1}
                  </div>
                  <span className={step === s ? "text-accent font-medium" : "text-neutral-400"}>
                    {s === "cart" ? "Keranjang" : s === "form" ? "Data Diri" : "Selesai"}
                  </span>
                  {i < 2 && <span className="text-neutral-300 mx-1">›</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">

        {/* STEP 1: CART */}
        {step === "cart" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.length === 0 ? (
                <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center">
                  <div className="text-5xl mb-4">🛒</div>
                  <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">Keranjang Kosong</h3>
                  <p className="text-neutral-500 text-sm mb-6">Tambahkan paket dari katalog untuk mulai memesan</p>
                  <Link href="/catalog" className="btn-primary">Lihat Katalog →</Link>
                </div>
              ) : (
                <>
                  {items.map((item) => (
                    <div key={item.product.id} className="bg-white rounded-2xl border border-neutral-100 p-4 flex gap-4 hover:shadow-sm transition-shadow">
                      {/* Image */}
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-primary-50">
                        <Image
                          src={`/images/paket-${item.product.id}.jpg`}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">
                          {item.product.emoji}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-neutral-900">{item.product.name}</h4>
                            <p className="text-xs text-neutral-400 mt-0.5">{item.product.items.length} item · {item.product.category}</p>
                            <p className="text-accent font-semibold text-sm mt-1">{formatPrice(item.product.price)} / pcs</p>
                          </div>
                          <button
                            onClick={() => removeItem(item.product.id)}
                            className="text-neutral-300 hover:text-red-400 transition-colors p-1 flex-shrink-0"
                            aria-label="Hapus"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>

                        {/* Qty Control */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-0 border border-neutral-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => updateQty(item.product.id, item.qty - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 transition-colors text-neutral-600 font-bold"
                            >−</button>
                            <span className="w-10 text-center text-sm font-semibold">{item.qty}</span>
                            <button
                              onClick={() => updateQty(item.product.id, item.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 transition-colors text-neutral-600 font-bold"
                            >+</button>
                          </div>
                          <span className="font-semibold text-neutral-900">{formatPrice(item.product.price * item.qty)}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Add more */}
                  <Link
                    href="/catalog"
                    className="flex items-center justify-center gap-2 w-full py-3 border-2 border-dashed border-neutral-200 rounded-2xl text-sm text-neutral-400 hover:border-accent hover:text-accent transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Tambah Paket Lain
                  </Link>
                </>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 sticky top-20">
                <h3 className="font-semibold text-neutral-900 mb-4">Ringkasan</h3>
                {items.length > 0 ? (
                  <>
                    <div className="space-y-2 mb-4">
                      {items.map((i) => (
                        <div key={i.product.id} className="flex justify-between text-sm">
                          <span className="text-neutral-500">{i.product.name} ×{i.qty}</span>
                          <span className="text-neutral-700 font-medium">{formatPrice(i.product.price * i.qty)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-neutral-100 pt-3 flex justify-between items-center mb-4">
                      <span className="font-semibold">Total</span>
                      <span className="font-display font-semibold text-accent text-xl">{formatPrice(totalPrice)}</span>
                    </div>
                    <button
                      onClick={() => setStep("form")}
                      className="w-full btn-primary justify-center py-3"
                    >
                      Lanjut Isi Data →
                    </button>
                    <button
                      onClick={() => clearCart()}
                      className="w-full mt-2 text-xs text-neutral-400 hover:text-red-400 transition-colors py-2"
                    >
                      Kosongkan Keranjang
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-neutral-400 text-center py-4">Keranjang masih kosong</p>
                )}
              </div>

              {/* Quick Add Suggestions */}
              {items.length > 0 && (
                <div className="mt-4 bg-white rounded-2xl border border-neutral-100 p-4">
                  <p className="text-xs font-semibold text-neutral-500 mb-3">Paket Lainnya</p>
                  <div className="space-y-2">
                    {products.filter((p) => !items.find((i) => i.product.id === p.id)).slice(0, 3).map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-neutral-700 truncate">{p.emoji} {p.name}</p>
                          <p className="text-xs text-accent">{formatPrice(p.price)}</p>
                        </div>
                        <QuickAddButton product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: FORM */}
        {step === "form" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center gap-3">
                  <button onClick={() => setStep("cart")} className="text-neutral-400 hover:text-neutral-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="font-semibold text-neutral-900">Data Pemesan</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nama Lengkap <span className="text-red-400">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Nama lengkap" required
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">No. HP / WhatsApp <span className="text-red-400">*</span></label>
                      <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" required
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Alamat Pengiriman <span className="text-red-400">*</span></label>
                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="Alamat lengkap pengiriman" required rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tanggal Pengiriman</label>
                    <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Catatan Tambahan</label>
                    <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Pesan khusus, ucapan kartu, dll." rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none" />
                  </div>
                  <button type="submit" disabled={!isFormValid}
                    className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed">
                    Lanjut ke WhatsApp →
                  </button>
                </form>
              </div>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-100 p-5 sticky top-20">
                <h3 className="font-semibold text-neutral-900 mb-4">Pesanan Kamu</h3>
                <div className="space-y-3 mb-4">
                  {items.map((i) => (
                    <div key={i.product.id} className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-primary-50 flex-shrink-0">
                        <Image src={`/images/paket-${i.product.id}.jpg`} alt={i.product.name} fill className="object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }} />
                        <div className="absolute inset-0 flex items-center justify-center text-lg">{i.product.emoji}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">{i.product.name} ×{i.qty}</p>
                        <p className="text-xs text-accent">{formatPrice(i.product.price * i.qty)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-neutral-100 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-sm">Total</span>
                  <span className="font-display font-semibold text-accent text-lg">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DONE */}
        {step === "done" && (
          <div className="max-w-lg mx-auto text-center py-8">
            <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-10">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">Pesanan Siap!</h2>
              <p className="text-neutral-500 mb-2">Klik tombol di bawah untuk kirim detail pesanan ke WhatsApp kami.</p>
              <div className="bg-neutral-50 rounded-xl p-3 mb-6 text-left">
                <p className="text-xs text-neutral-500 font-medium mb-2">Ringkasan ({items.length} paket):</p>
                {items.map((i) => (
                  <p key={i.product.id} className="text-xs text-neutral-600">• {i.product.name} ×{i.qty} — {formatPrice(i.product.price * i.qty)}</p>
                ))}
                <p className="text-xs font-semibold text-accent mt-2 pt-2 border-t border-neutral-200">Total: {formatPrice(totalPrice)}</p>
              </div>
              <a
                href={`https://wa.me/6208551234202?text=${buildWAMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-base mb-3"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Kirim ke WhatsApp
              </a>
              <button onClick={handleReset} className="w-full btn-outline justify-center py-3 text-sm">
                ← Kembali / Pesan Lagi
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
