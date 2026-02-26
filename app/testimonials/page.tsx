"use client";
import { useState } from "react";
import { testimonials } from "@/lib/data";

export default function TestimonialsPage() {
  const [showForm, setShowForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: "", location: "", package: "", text: "", rating: 5 });
  const [submitted, setSubmitted] = useState(false);

  const avgRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 text-center">
          <p className="text-accent text-sm font-semibold uppercase tracking-widest mb-2">Kata Mereka</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-neutral-900 mb-3">
            Testimoni Pelanggan
          </h1>
          <p className="section-subtitle mb-6">
            Ribuan pelanggan telah mempercayakan momen spesial mereka kepada kami.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <div className="font-display text-3xl font-semibold text-accent">{avgRating}</div>
              <div className="flex justify-center gap-0.5 my-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-amber-400">★</span>
                ))}
              </div>
              <div className="text-xs text-neutral-500">Rating Rata-rata</div>
            </div>
            <div className="w-px bg-neutral-200" />
            <div className="text-center">
              <div className="font-display text-3xl font-semibold text-accent">500+</div>
              <div className="text-xs text-neutral-500 mt-4">Pelanggan Puas</div>
            </div>
            <div className="w-px bg-neutral-200" />
            <div className="text-center">
              <div className="font-display text-3xl font-semibold text-accent">3+</div>
              <div className="text-xs text-neutral-500 mt-4">Tahun Pengalaman</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Submitted success */}
        {submitted && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="font-medium text-green-800">Terima kasih atas ulasanmu!</p>
              <p className="text-sm text-green-600">Testimonimu akan segera ditampilkan setelah diverifikasi.</p>
            </div>
          </div>
        )}

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {testimonials.map((t, i) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-neutral-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Rating */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={`text-base ${i < t.rating ? "text-amber-400" : "text-neutral-200"}`}>★</span>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="badge bg-primary-50 text-primary-700 text-xs">{t.package}</span>
                  <span className="text-xs text-neutral-400">{t.date}</span>
                </div>
              </div>

              {/* Review Text */}
              <p className="text-neutral-600 text-sm leading-relaxed mb-4">
                <span className="text-accent font-display text-lg leading-none">"</span>
                {t.text}
                <span className="text-accent font-display text-lg leading-none">"</span>
              </p>

              {/* Avatar */}
              <div className="flex items-center gap-3 pt-3 border-t border-neutral-50">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-light to-accent/30 flex items-center justify-center text-accent font-bold font-display">
                  {t.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-sm text-neutral-900">{t.name}</div>
                  <div className="text-xs text-neutral-400">📍 {t.location}</div>
                </div>
                <div className="ml-auto">
                  <span className="text-green-500 text-xs font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Terverifikasi
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Leave Review CTA */}
        {!showForm && !submitted && (
          <div className="text-center bg-white rounded-2xl border border-neutral-100 p-8 shadow-sm">
            <div className="text-3xl mb-3">⭐</div>
            <h3 className="font-display text-xl font-semibold text-neutral-900 mb-2">Pernah Order di Sini?</h3>
            <p className="text-neutral-500 text-sm mb-4">Bagikan pengalamanmu untuk membantu calon pembeli lain</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary"
            >
              Tulis Ulasan
            </button>
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
                  <input
                    type="text"
                    required
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Nama kamu"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kota</label>
                  <input
                    type="text"
                    value={newTestimonial.location}
                    onChange={(e) => setNewTestimonial((p) => ({ ...p, location: e.target.value }))}
                    placeholder="Kota kamu"
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Paket yang Dibeli</label>
                <select
                  value={newTestimonial.package}
                  onChange={(e) => setNewTestimonial((p) => ({ ...p, package: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 bg-white"
                >
                  <option value="">-- Pilih paket --</option>
                  {["Paket 1","Paket 2","Paket 3","Paket 4","Paket 5","Paket 6","Paket 7","Paket 8","Paket 9","Paket 10"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewTestimonial((p) => ({ ...p, rating: star }))}
                      className={`text-2xl transition-transform hover:scale-110 ${star <= newTestimonial.rating ? "text-amber-400" : "text-neutral-200"}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Ulasan <span className="text-red-400">*</span></label>
                <textarea
                  required
                  value={newTestimonial.text}
                  onChange={(e) => setNewTestimonial((p) => ({ ...p, text: e.target.value }))}
                  placeholder="Ceritakan pengalaman kamu memesan di Redline Production..."
                  rows={4}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 resize-none"
                />
              </div>

              <button type="submit" className="w-full btn-primary justify-center py-3">
                Kirim Ulasan ✨
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
