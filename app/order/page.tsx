"use client";
import { useState } from "react";
import { products, formatPrice } from "@/lib/data";

interface FormData {
  name: string;
  phone: string;
  address: string;
  package: string;
  quantity: string;
  deliveryDate: string;
  notes: string;
}

export default function OrderPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    address: "",
    package: "",
    quantity: "1",
    deliveryDate: "",
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const selectedProduct = products.find((p) => p.name === form.package);
  const totalPrice = selectedProduct ? selectedProduct.price * parseInt(form.quantity || "1") : 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildWAMessage = () => {
    const lines = [
      "🎁 *PEMESANAN PARCEL LEBARAN*",
      "━━━━━━━━━━━━━━━━━━",
      `👤 *Nama:* ${form.name}`,
      `📱 *No. HP:* ${form.phone}`,
      `📍 *Alamat:* ${form.address}`,
      `📦 *Paket:* ${form.package}`,
      `🔢 *Jumlah:* ${form.quantity} pcs`,
      `📅 *Tgl Kirim:* ${form.deliveryDate || "Sesuai kesepakatan"}`,
      selectedProduct ? `💰 *Total:* ${formatPrice(totalPrice)}` : "",
      form.notes ? `📝 *Catatan:* ${form.notes}` : "",
      "━━━━━━━━━━━━━━━━━━",
      "Mohon konfirmasi ketersediaan dan detail pembayaran. Terima kasih! 🙏",
    ].filter(Boolean).join("\n");
    return encodeURIComponent(lines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.package) return;
    setSubmitted(true);
  };

  const isValid = form.name && form.phone && form.package && form.address;

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Mudah & Cepat</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">
            Form Pemesanan
          </h1>
          <p className="section-subtitle max-w-lg mx-auto">
            Isi form di bawah, lalu klik tombol untuk langsung kirim ke WhatsApp kami.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {submitted ? (
          /* Success State */
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100 shadow-sm">
            <div className="text-5xl mb-4">🎉</div>
            <h2 className="font-display text-2xl font-semibold text-neutral-900 mb-2">Pesanan Siap Dikirim!</h2>
            <p className="text-neutral-500 mb-6 max-w-sm mx-auto">
              Klik tombol di bawah untuk mengirim detail pesanan ke WhatsApp kami. Tim kami akan segera membalas!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`https://wa.me/6208551234202?text=${buildWAMessage()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 rounded-2xl transition-colors text-base"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Kirim ke WhatsApp
              </a>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", address: "", package: "", quantity: "1", deliveryDate: "", notes: "" }); }}
                className="btn-outline"
              >
                Pesan Lagi
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h2 className="font-semibold text-neutral-900">Data Pemesan</h2>
                </div>
                <div className="p-6 space-y-5">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Nama Lengkap <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Nomor HP / WhatsApp <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="Contoh: 08123456789"
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                    />
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Alamat Pengiriman <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Masukkan alamat lengkap pengiriman"
                      required
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors resize-none"
                    />
                  </div>

                  {/* Package Select */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                      Pilih Paket <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="package"
                      value={form.package}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors bg-white"
                    >
                      <option value="">-- Pilih paket --</option>
                      <optgroup label="Standar">
                        {products.filter((p) => p.category === "standard").map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.emoji} {p.name} — {formatPrice(p.price)}
                          </option>
                        ))}
                      </optgroup>
                      <optgroup label="Premium 👑">
                        {products.filter((p) => p.category === "premium").map((p) => (
                          <option key={p.id} value={p.name}>
                            {p.emoji} {p.name} — {formatPrice(p.price)}
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  {/* Quantity + Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Jumlah</label>
                      <input
                        type="number"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleChange}
                        min="1"
                        max="100"
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-1.5">Tanggal Kirim</label>
                      <input
                        type="date"
                        name="deliveryDate"
                        value={form.deliveryDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1.5">Catatan Tambahan</label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="Pesan khusus, ucapan di kartu, dll."
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!isValid}
                    className="w-full btn-primary justify-center py-3.5 text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-none"
                  >
                    Lanjut ke WhatsApp →
                  </button>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden sticky top-20">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h2 className="font-semibold text-neutral-900">Ringkasan Pesanan</h2>
                </div>
                <div className="p-6">
                  {selectedProduct ? (
                    <>
                      <div className="text-center mb-4">
                        <div className="text-3xl mb-2">{selectedProduct.emoji}</div>
                        <div className="font-display font-semibold text-neutral-900">{selectedProduct.name}</div>
                        <div className="text-sm text-accent font-medium mt-1">{formatPrice(selectedProduct.price)} / pcs</div>
                      </div>
                      <div className="bg-neutral-50 rounded-xl p-3 mb-4">
                        <p className="text-xs font-medium text-neutral-500 mb-2">Isi Paket:</p>
                        <ul className="space-y-1">
                          {selectedProduct.items.slice(0, 5).map((item, i) => (
                            <li key={i} className="text-xs text-neutral-600 flex items-center gap-1.5">
                              <span className="w-1 h-1 rounded-full bg-accent" />
                              {item}
                            </li>
                          ))}
                          {selectedProduct.items.length > 5 && (
                            <li className="text-xs text-neutral-400">+{selectedProduct.items.length - 5} item lainnya</li>
                          )}
                        </ul>
                      </div>
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-neutral-500">{formatPrice(selectedProduct.price)} × {form.quantity || 1}</span>
                      </div>
                      <div className="flex justify-between items-center border-t border-neutral-100 pt-3 mt-3">
                        <span className="font-semibold">Total</span>
                        <span className="font-display font-semibold text-accent text-lg">{formatPrice(totalPrice)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-neutral-400">
                      <div className="text-3xl mb-2">📦</div>
                      <p className="text-sm">Pilih paket untuk melihat ringkasan pesanan</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Box */}
              <div className="mt-4 bg-green-50 rounded-2xl border border-green-100 p-4">
                <p className="text-sm font-medium text-green-800 mb-1">Butuh bantuan?</p>
                <p className="text-xs text-green-600 mb-3">Hubungi kami langsung via WhatsApp</p>
                <a
                  href="https://wa.me/6208551234202"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors w-full justify-center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Chat Sekarang
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
