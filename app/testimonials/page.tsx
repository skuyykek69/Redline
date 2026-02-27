"use client";
import { useState, useEffect } from "react";
import { testimonials as staticTestimonials } from "@/lib/data";

interface Testimonial {
  id: number;
  name: string;
  location: string;
  package: string;
  rating: number;
  text: string;
  date?: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(staticTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", packageName: "", text: "", rating: 5 });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Fetch gabungan: hardcode + approved dari Sheets
  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => {
        if (data.testimonials?.length > 0) {
          setTestimonials(data.testimonials);
        }
      })
      .catch(() => {/* tetap pakai hardcode */});
  }, []);

  const avgRating = testimonials.length > 0
    ? (testimonials.reduce((s, t) => s + t.rating, 0) / testimonials.length).toFixed(1)
    : "5.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setShowForm(false);
      setForm({ name: "", location: "", packageName: "", text: "", rating: 5 });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Kata Mereka</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">Testimoni Pelanggan</h1>
          <p className="section-subtitle mb-8">Ribuan pelanggan telah mempercayakan momen spesial mereka kepada kami.</p>
          <div className="flex justify-center gap-8">
            {[
              { value: avgRating, label: "Rating Rata-rata", sub: "★★★★★" },
              { value: "500+", label: "Pelanggan Puas", sub: null },
              { value: "3+", label: "Tahun Pengalaman", sub: null },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-display text-3xl font-semibold text-accent">{s.value}</div>
                {s.sub && <div className="text-amber-400 text-sm my-1">{s.sub}</div>}
                <div className="text-xs text-neutral-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Success notification */}
        {status === "success" && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-green-800">Terima kasih atas ulasanmu!</p>
              <p className="text-sm text-green-600">Testimonimu sedang menunggu verifikasi dan akan segera ditampilkan.</p>
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {testimonials.map((t, i) => (
            <div key={`${t.id}-${i}`} className="bg-white rounded-2xl p-6 border border-neutral-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={`text-base ${j < t.rating ? "text-amber-400" : "text-neutral-200"}`}>★</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="badge bg-primary-50 text-primary-700 text-xs">{t.package}</span>
                  <span className="text-xs text-neutral-400">{t.date}</span>
                </div>
              </div>
              <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                <span className="text-accent font-display text-xl leading-none">"</span>
                {t.text}
                <span className="text-accent font-display text-xl leading-none">"</span>
              </p>
              <div className="flex items-center gap-3 pt-3 border-t border-neutral-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-light to-accent/30 flex items-center justify-center text-accent font-bold font-display">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm text-neutral-900">{t.name}</div>
                  <div className="text-xs text-neutral-400">📍 {t.location}</div>
                </div>
                <span className="ml-auto text-green-500 text-xs font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />Terverifikasi
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Review CTA */}
        {!showForm && status !== "success" && (
          <div className="text-center bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">Pernah Order di Sini?</h3>
            <p className="text-neutral-500 text-sm mb-4">Bagikan pengalamanmu untuk membantu calon pembeli lain</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">Tulis Ulasan</button>
          </div>
        )}

        {/* Review Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center">
              <h3 className="font-semibold text-neutral-900">Tulis Ulasanmu</h3>
              <button onClick={() => setShowForm(false)} className="text-neutral-400 hover:text-neutral-600 transition-colors">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nama <span className="text-red-400">*</span></label>
                  <input type="text" required value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Nama kamu"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kota</label>
                  <input type="text" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Kota kamu"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Paket yang Dibeli</label>
                <select value={form.packageName} onChange={(e) => setForm((p) => ({ ...p, packageName: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 bg-white">
                  <option value="">-- Pilih paket --</option>
                  {Array.from({ length: 10 }, (_, i) => <option key={i} value={`Paket ${i + 1}`}>Paket {i + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button"
                      onClick={() => setForm((p) => ({ ...p, rating: star }))}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= form.rating ? "text-amber-400" : "text-neutral-200"}`}>★</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ulasan <span className="text-red-400">*</span></label>
                <textarea required value={form.text} onChange={(e) => setForm((p) => ({ ...p, text: e.target.value }))}
                  placeholder="Ceritakan pengalaman kamu..." rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none" />
              </div>
              {status === "error" && (
                <p className="text-red-500 text-sm">Gagal mengirim. Coba lagi atau hubungi kami via WA.</p>
              )}
              <button type="submit" disabled={status === "loading"}
                className="w-full btn-primary justify-center py-3 disabled:opacity-60">
                {status === "loading" ? "Mengirim..." : "Kirim Ulasan ✨"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
