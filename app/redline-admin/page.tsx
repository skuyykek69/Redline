"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

/* ─── Types ─── */
interface Product {
  id: number;
  name: string;
  price: number;
  category: "standard" | "premium";
  items: string[];
  emoji: string;
  popular?: boolean;
  order?: number;
  imageUrl?: string;
}
interface Testimonial {
  id: number;
  name: string;
  location: string;
  package: string;
  rating: number;
  text: string;
  timestamp?: string;
  rowIndex?: number;
}

type Tab = "products" | "testimonials" | "debug";
type Modal = "add" | "edit" | null;

const EMOJIS = ["🎁","🎀","🌟","✨","🎊","💝","🏆","👑","💎","🌙","🎉","🎈","🌸","💫","🎗️"];

/* ─── Empty product template ─── */
const emptyProduct = (): Omit<Product, "id"> => ({
  name: "",
  price: 0,
  category: "standard",
  items: [],
  emoji: "🎁",
  popular: false,
  order: 99,
});

/* ═══════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════ */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        onLogin();
      } else {
        setError("Password salah. Coba lagi.");
      }
    } catch {
      setError("Koneksi gagal. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent/20 border border-accent/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">Admin Panel</h1>
          <p className="text-neutral-400 text-sm mt-1">Redline Production</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-300 mb-2">Password Admin</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan password"
              required
              autoFocus
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-neutral-500 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 text-sm"
            />
          </div>
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-dark text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Masuk..." : "Masuk ke Dashboard"}
          </button>
        </form>
        <p className="text-center text-xs text-neutral-600 mt-4">
          Akses hanya untuk admin Redline Production
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   PRODUCT FORM MODAL
═══════════════════════════════════ */
function ProductModal({
  mode, product, onSave, onClose,
}: {
  mode: "add" | "edit";
  product: Partial<Product>;
  onSave: (p: Partial<Product>, file?: File) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Partial<Product>>({ ...emptyProduct(), ...product });
  const [itemInput, setItemInput] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const setField = (k: keyof Product, v: unknown) => setForm((p) => ({ ...p, [k]: v }));

  const addItem = () => {
    const trimmed = itemInput.trim();
    if (!trimmed) return;
    setField("items", [...(form.items || []), trimmed]);
    setItemInput("");
  };

  const removeItem = (i: number) =>
    setField("items", (form.items || []).filter((_, idx) => idx !== i));

  const moveItem = (i: number, dir: -1 | 1) => {
    const arr = [...(form.items || [])];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setField("items", arr);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    setSaving(true);
    await onSave(form, photoFile || undefined);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="font-display text-lg font-semibold">
            {mode === "add" ? "➕ Tambah Produk Baru" : "✏️ Edit Produk"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-400 transition-colors">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Nama Paket <span className="text-red-400">*</span></label>
              <input type="text" value={form.name || ""} onChange={(e) => setField("name", e.target.value)}
                placeholder="Contoh: Paket 11" required
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Harga (Rp) <span className="text-red-400">*</span></label>
              <input type="number" value={form.price || ""} onChange={(e) => setField("price", Number(e.target.value))}
                placeholder="150000" required min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Kategori</label>
              <select value={form.category} onChange={(e) => setField("category", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent bg-white">
                <option value="standard">Standard</option>
                <option value="premium">Premium</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Emoji</label>
              <select value={form.emoji} onChange={(e) => setField("emoji", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent bg-white">
                {EMOJIS.map((em) => <option key={em} value={em}>{em}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">Urutan</label>
              <input type="number" value={form.order ?? 99} onChange={(e) => setField("order", Number(e.target.value))}
                min={1}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20" />
            </div>
          </div>

          {/* Popular toggle */}
          <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-neutral-50 transition-colors border border-neutral-100">
            <div
              onClick={() => setField("popular", !form.popular)}
              className={`w-10 h-6 rounded-full transition-colors relative ${form.popular ? "bg-accent" : "bg-neutral-200"}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-transform ${form.popular ? "translate-x-5" : "translate-x-1"}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-800">Tandai sebagai Populer ⭐</p>
              <p className="text-xs text-neutral-400">Akan ditampilkan di beranda</p>
            </div>
          </label>

          {/* Foto Upload */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Foto Produk</label>
            <div className="flex gap-3 items-start">
              {photoPreview ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0">
                  <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                  <button type="button" onClick={() => { setPhotoFile(null); setPhotoPreview(""); }}
                    className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                </div>
              ) : form.id ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-neutral-200 flex-shrink-0 bg-neutral-100">
                  <Image src={`/images/paket-${form.id}.jpg`} alt="Current" fill className="object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl">{form.emoji}</div>
                </div>
              ) : null}
              <div className="flex-1">
                <label className="flex flex-col items-center gap-2 p-4 border-2 border-dashed border-neutral-200 rounded-xl cursor-pointer hover:border-accent hover:bg-accent/5 transition-colors">
                  <svg className="w-6 h-6 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs text-neutral-500">Klik untuk upload foto</span>
                  <span className="text-xs text-neutral-400">JPG, PNG, WebP — max 2MB</span>
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="hidden" />
                </label>
                <p className="text-xs text-neutral-400 mt-1.5">
                  {mode === "add" ? "Opsional — bisa upload nanti via GitHub" : "Kosongkan jika tidak ingin ganti foto"}
                </p>
              </div>
            </div>
          </div>

          {/* Isi Paket */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Isi Paket ({(form.items || []).length} item)</label>
            <div className="space-y-1.5 mb-2 max-h-40 overflow-y-auto">
              {(form.items || []).map((item, i) => (
                <div key={i} className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-1.5">
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => moveItem(i, -1)} disabled={i === 0}
                      className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30 leading-none text-xs">▲</button>
                    <button type="button" onClick={() => moveItem(i, 1)} disabled={i === (form.items || []).length - 1}
                      className="text-neutral-300 hover:text-neutral-600 disabled:opacity-30 leading-none text-xs">▼</button>
                  </div>
                  <span className="text-sm text-neutral-700 flex-1">{item}</span>
                  <button type="button" onClick={() => removeItem(i)}
                    className="text-neutral-300 hover:text-red-400 transition-colors text-sm">✕</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text" value={itemInput}
                onChange={(e) => setItemInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
                placeholder="Nama item (Enter untuk tambah)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20"
              />
              <button type="button" onClick={addItem}
                className="px-4 py-2.5 bg-accent text-white rounded-xl text-sm font-medium hover:bg-accent-dark transition-colors">
                + Tambah
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 hover:bg-neutral-50 transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-3 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50">
              {saving ? "Menyimpan..." : mode === "add" ? "Simpan Produk" : "Update Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════
   DEBUG PANEL COMPONENT
═══════════════════════════════════ */
interface DebugResult {
  env_check?: Record<string, string>;
  diagnosis?: string;
  solution?: string;
  possible_causes?: string[];
  get_test?: Record<string, unknown>;
  get_response_raw?: string;
  get_test_error?: string;
  post_test?: Record<string, unknown>;
  post_response?: Record<string, unknown>;
  post_response_raw?: string;
  post_test_error?: string;
}

function DebugPanel({ loading, result, onRun }: {
  loading: boolean;
  result: Record<string, unknown> | null;
  onRun: () => void;
}) {
  const dr = result as DebugResult | null;

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-4">
        <h2 className="font-semibold text-neutral-900 mb-1">🔧 Debug Koneksi Google Sheets</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Jalankan test ini untuk mengetahui secara pasti mengapa data tidak masuk ke Google Sheets.
          Test ini akan mengirim data dummy ke spreadsheet kamu.
        </p>
        <button onClick={onRun} disabled={loading} className="btn-primary py-2.5 px-6 disabled:opacity-50">
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Sedang test koneksi...
            </span>
          ) : "▶ Jalankan Debug Test"}
        </button>
      </div>

      {dr && (
        <div className="space-y-3">
          {/* Env Check */}
          {dr.env_check && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-5">
              <h3 className="font-semibold text-sm text-neutral-700 mb-3">📋 Environment Variables</h3>
              {Object.entries(dr.env_check).map(([k, v]) => (
                <div key={k} className="flex gap-3 text-sm mb-2">
                  <code className="text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded text-xs flex-shrink-0">{k}</code>
                  <span className={v.startsWith("✅") ? "text-green-700" : v.startsWith("❌") ? "text-red-600" : "text-amber-600"}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Diagnosis */}
          {dr.diagnosis && (
            <div className={`rounded-2xl border p-5 ${
              dr.diagnosis.startsWith("✅") ? "bg-green-50 border-green-200" :
              dr.diagnosis.startsWith("❌") ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"}`}>
              <h3 className="font-semibold text-sm mb-2">🩺 Diagnosis</h3>
              <p className="text-sm font-medium">{dr.diagnosis}</p>
              {dr.solution && <p className="text-sm mt-2 text-neutral-600">💡 {dr.solution}</p>}
              {dr.possible_causes && (
                <ul className="mt-2 space-y-1">
                  {dr.possible_causes.map((c, i) => <li key={i} className="text-sm text-neutral-600">• {c}</li>)}
                </ul>
              )}
            </div>
          )}

          {/* GET Test */}
          {dr.get_test && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-5">
              <h3 className="font-semibold text-sm text-neutral-700 mb-3">🔍 Test GET</h3>
              <div className="bg-neutral-50 rounded-xl p-3 font-mono text-xs overflow-x-auto">
                <pre>{JSON.stringify(dr.get_test, null, 2)}</pre>
              </div>
              {dr.get_response_raw && (
                <div className="mt-2 bg-red-50 rounded-xl p-3 text-xs text-red-700">
                  <p className="font-semibold mb-1">⚠️ Response bukan JSON — Apps Script belum benar:</p>
                  <pre className="whitespace-pre-wrap break-all">{dr.get_response_raw}</pre>
                </div>
              )}
              {dr.get_test_error && <p className="mt-2 text-sm text-red-600">{dr.get_test_error}</p>}
            </div>
          )}

          {/* POST Test */}
          {dr.post_test && (
            <div className="bg-white rounded-2xl border border-neutral-100 p-5">
              <h3 className="font-semibold text-sm text-neutral-700 mb-3">📤 Test POST (kirim data)</h3>
              <div className="bg-neutral-50 rounded-xl p-3 font-mono text-xs overflow-x-auto">
                <pre>{JSON.stringify(dr.post_test, null, 2)}</pre>
              </div>
              {dr.post_response && (
                <div className="mt-2 bg-neutral-50 rounded-xl p-3 font-mono text-xs">
                  <pre>{JSON.stringify(dr.post_response, null, 2)}</pre>
                </div>
              )}
              {dr.post_response_raw && (
                <div className="mt-2 bg-red-50 rounded-xl p-3 text-xs text-red-700">
                  <p className="font-semibold mb-1">⚠️ Response POST bukan JSON:</p>
                  <pre className="whitespace-pre-wrap break-all">{dr.post_response_raw}</pre>
                </div>
              )}
              {dr.post_test_error && <p className="mt-2 text-sm text-red-600">{dr.post_test_error}</p>}
            </div>
          )}

          {/* Fix Guide */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="font-semibold text-sm text-blue-800 mb-3">📖 Panduan Fix Umum</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <p><strong>1.</strong> Setiap edit kode Apps Script, harus <em>Deploy → New deployment</em> (bukan edit deployment lama)</p>
              <p><strong>2.</strong> Setting: <em>Execute as: Me</em> dan <em>Who has access: Anyone</em></p>
              <p><strong>3.</strong> Saat pertama deploy, Google minta Review Permissions — klik <strong>Allow</strong></p>
              <p><strong>4.</strong> Format URL: <code className="bg-blue-100 px-1 rounded text-xs">https://script.google.com/macros/s/XXXXX/exec</code></p>
              <p><strong>5.</strong> Setelah update env variable di Vercel, wajib klik <strong>Redeploy</strong></p>
              <p><strong>6.</strong> Cek log di Apps Script: <em>View → Executions</em></p>
            </div>
          </div>

          {/* Raw output */}
          <details className="bg-white rounded-2xl border border-neutral-100 p-5">
            <summary className="text-sm font-medium text-neutral-600 cursor-pointer">📄 Raw Debug Output</summary>
            <div className="mt-3 bg-neutral-50 rounded-xl p-3 font-mono text-xs overflow-x-auto max-h-60">
              <pre>{JSON.stringify(dr, null, 2)}</pre>
            </div>
          </details>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   DASHBOARD
═══════════════════════════════════ */
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [pendingTestimonials, setPendingTestimonials] = useState<Testimonial[]>([]);
  const [approvedTestimonials, setApprovedTestimonials] = useState<Testimonial[]>([]);
  const [modal, setModal] = useState<Modal>(null);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [testimoniTab, setTestimoniTab] = useState<"pending" | "approved">("pending");
  const [debugResult, setDebugResult] = useState<Record<string, unknown> | null>(null);
  const [debugLoading, setDebugLoading] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.status === 401) { onLogout(); return; }
      const data = await res.json();
      setProducts(data.products || []);
    } catch {
      showToast("Gagal memuat produk", "error");
    }
  }, [onLogout]);

  const fetchTestimonials = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/testimonials");
      if (res.status === 401) { onLogout(); return; }
      const data = await res.json();
      setPendingTestimonials(data.pending || []);
      setApprovedTestimonials(data.approved || []);
    } catch {
      showToast("Gagal memuat testimoni", "error");
    }
  }, [onLogout]);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchProducts(), fetchTestimonials()]).finally(() => setLoading(false));
  }, [fetchProducts, fetchTestimonials]);

  /* ── Product Actions ── */
  const handleSaveProduct = async (formData: Partial<Product>, file?: File) => {
    try {
      let imageUrl = formData.imageUrl || "";

      // Upload foto ke Cloudinary jika ada file baru
      if (file) {
        const productId = formData.id || Date.now(); // gunakan timestamp sebagai ID sementara jika produk baru
        const fd = new FormData();
        fd.append("file", file);
        fd.append("productId", String(productId));

        const uploadRes = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const uploadData = await uploadRes.json();

        if (uploadData.success && uploadData.url) {
          imageUrl = uploadData.url; // URL Cloudinary
        } else if (uploadData.setup_required) {
          // Cloudinary belum disetup — simpan produk tanpa foto, beri tahu user
          showToast("Produk disimpan tanpa foto (setup Cloudinary dulu)", "error");
        } else {
          showToast(`Upload foto gagal: ${uploadData.error || "Unknown error"}`, "error");
        }
      }

      const isEdit = modal === "edit";
      const res = await fetch("/api/admin/products", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, imageUrl }),
      });

      const resData = await res.json();
      if (!resData.success && res.status !== 200) throw new Error(resData.error);

      showToast(isEdit ? "Produk berhasil diupdate!" : "Produk berhasil ditambahkan!");
      setModal(null);
      setEditProduct(null);
      await fetchProducts();
    } catch (err) {
      showToast(`Gagal menyimpan produk: ${err instanceof Error ? err.message : "Unknown"}`, "error");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error();
      showToast("Produk berhasil dihapus!");
      setDeleteConfirm(null);
      await fetchProducts();
    } catch {
      showToast("Gagal menghapus produk", "error");
    }
  };

  const handleReorder = async (id: number, dir: -1 | 1) => {
    const idx = products.findIndex((p) => p.id === id);
    if ((dir === -1 && idx === 0) || (dir === 1 && idx === products.length - 1)) return;
    const newProducts = [...products];
    [newProducts[idx], newProducts[idx + dir]] = [newProducts[idx + dir], newProducts[idx]];
    setProducts(newProducts);
    // Simpan urutan baru ke Sheets
    await fetch("/api/admin/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "reorder", order: newProducts.map((p, i) => ({ id: p.id, order: i + 1 })) }),
    });
  };

  /* ── Testimonial Actions ── */
  const handleModerate = async (rowIndex: number, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rowIndex, action }),
      });
      if (!res.ok) throw new Error();
      showToast(action === "approve" ? "Testimoni disetujui!" : "Testimoni ditolak!");
      await fetchTestimonials();
    } catch {
      showToast("Gagal moderasi testimoni", "error");
    }
  };

  const runDebug = async () => {
    setDebugLoading(true);
    setDebugResult(null);
    try {
      const res = await fetch("/api/admin/debug");
      const data = await res.json();
      setDebugResult(data);
    } catch (err) {
      setDebugResult({ error: String(err) });
    } finally {
      setDebugLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    onLogout();
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(p);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 transition-all ${
          toast.type === "success" ? "bg-green-600" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="text-3xl mb-3 text-center">🗑️</div>
            <h3 className="font-semibold text-neutral-900 text-center mb-2">Hapus Produk?</h3>
            <p className="text-sm text-neutral-500 text-center mb-5">Tindakan ini tidak bisa dibatalkan.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 rounded-xl border border-neutral-200 text-sm font-medium hover:bg-neutral-50">Batal</button>
              <button onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Topbar */}
      <header className="bg-white border-b border-neutral-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center text-white text-xs font-bold">R</div>
            <div>
              <h1 className="font-semibold text-sm text-neutral-900">Admin Panel</h1>
              <p className="text-xs text-neutral-400 hidden sm:block">Redline Production</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="text-xs text-neutral-500 hover:text-accent transition-colors hidden sm:flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Lihat Website
            </a>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 border border-red-100 hover:border-red-200 px-3 py-1.5 rounded-lg transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Produk", value: products.length, icon: "📦", color: "text-blue-600 bg-blue-50" },
            { label: "Standard", value: products.filter((p) => p.category === "standard").length, icon: "🎁", color: "text-green-600 bg-green-50" },
            { label: "Premium", value: products.filter((p) => p.category === "premium").length, icon: "👑", color: "text-purple-600 bg-purple-50" },
            { label: "Testimoni Pending", value: pendingTestimonials.length, icon: "⏳", color: "text-amber-600 bg-amber-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl border border-neutral-100 p-4">
              <div className={`w-8 h-8 rounded-xl ${s.color} flex items-center justify-center text-base mb-2`}>{s.icon}</div>
              <div className="font-display text-2xl font-semibold text-neutral-900">{s.value}</div>
              <div className="text-xs text-neutral-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-neutral-100 rounded-2xl p-1 mb-6 w-fit">
          {([
            { key: "products", label: "📦 Kelola Produk" },
            { key: "testimonials", label: `💬 Testimoni ${pendingTestimonials.length > 0 ? `(${pendingTestimonials.length})` : ""}` },
            { key: "debug", label: "🔧 Debug Koneksi" },
          ] as { key: Tab; label: string }[]).map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
                tab === t.key ? "bg-accent text-white shadow-sm" : "text-neutral-500 hover:text-neutral-800"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── PRODUCTS TAB ── */}
        {tab === "products" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-neutral-500">{products.length} produk · Drag atau klik ▲▼ untuk ubah urutan</p>
              <button
                onClick={() => { setEditProduct(null); setModal("add"); }}
                className="btn-primary text-sm py-2 px-4">
                + Tambah Produk
              </button>
            </div>

            {/* Product List */}
            <div className="space-y-3">
              {products.map((product, idx) => (
                <div key={product.id}
                  className="bg-white rounded-2xl border border-neutral-100 p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
                  {/* Reorder */}
                  <div className="flex flex-col gap-1 flex-shrink-0">
                    <button onClick={() => handleReorder(product.id, -1)} disabled={idx === 0}
                      className="w-6 h-6 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400 disabled:opacity-20 transition-colors text-xs">▲</button>
                    <button onClick={() => handleReorder(product.id, 1)} disabled={idx === products.length - 1}
                      className="w-6 h-6 rounded-lg hover:bg-neutral-100 flex items-center justify-center text-neutral-400 disabled:opacity-20 transition-colors text-xs">▼</button>
                  </div>

                  {/* Photo */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-primary-50 flex-shrink-0">
                    <Image src={`/images/paket-${product.id}.jpg`} alt={product.name} fill className="object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }} />
                    <div className="absolute inset-0 flex items-center justify-center text-xl">{product.emoji}</div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-neutral-900">{product.name}</span>
                      {product.popular && <span className="badge bg-amber-100 text-amber-700 text-xs">⭐ Populer</span>}
                      <span className={`badge text-xs ${product.category === "premium" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"}`}>
                        {product.category}
                      </span>
                    </div>
                    <p className="text-accent font-semibold text-sm mt-0.5">{formatPrice(product.price)}</p>
                    <p className="text-xs text-neutral-400 mt-0.5 truncate">
                      {product.items.slice(0, 4).join(", ")}{product.items.length > 4 ? ` +${product.items.length - 4} lainnya` : ""}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => { setEditProduct(product); setModal("edit"); }}
                      className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-medium text-neutral-600 hover:border-accent hover:text-accent transition-colors">
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(product.id)}
                      className="px-3 py-1.5 rounded-xl border border-red-100 text-xs font-medium text-red-400 hover:bg-red-50 transition-colors">
                      🗑️ Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-neutral-100">
                <div className="text-4xl mb-3">📦</div>
                <p className="text-neutral-500">Belum ada produk. Klik "Tambah Produk" untuk mulai.</p>
              </div>
            )}
          </div>
        )}

        {/* ── TESTIMONIALS TAB ── */}
        {tab === "testimonials" && (
          <div>
            {/* Sub tabs */}
            <div className="flex gap-2 mb-4">
              {([
                { key: "pending", label: `Menunggu Review (${pendingTestimonials.length})` },
                { key: "approved", label: `Disetujui (${approvedTestimonials.length})` },
              ] as { key: "pending" | "approved"; label: string }[]).map((t) => (
                <button key={t.key} onClick={() => setTestimoniTab(t.key)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    testimoniTab === t.key ? "bg-neutral-900 text-white" : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            <div className="space-y-3">
              {(testimoniTab === "pending" ? pendingTestimonials : approvedTestimonials).map((t) => (
                <div key={t.id} className="bg-white rounded-2xl border border-neutral-100 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-neutral-900">{t.name}</span>
                        <span className="text-xs text-neutral-400">📍 {t.location}</span>
                        <span className="badge bg-primary-50 text-primary-700 text-xs">{t.package}</span>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <span key={i} className={`text-xs ${i < t.rating ? "text-amber-400" : "text-neutral-200"}`}>★</span>
                          ))}
                        </div>
                      </div>
                      {t.timestamp && <p className="text-xs text-neutral-400 mb-2">{new Date(t.timestamp).toLocaleDateString("id-ID", { dateStyle: "medium" })}</p>}
                      <p className="text-sm text-neutral-600 leading-relaxed">"{t.text}"</p>
                    </div>
                    {testimoniTab === "pending" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => handleModerate(t.rowIndex!, "approve")}
                          className="px-3 py-1.5 rounded-xl bg-green-50 border border-green-200 text-green-700 text-xs font-semibold hover:bg-green-100 transition-colors">
                          ✓ Setujui
                        </button>
                        <button onClick={() => handleModerate(t.rowIndex!, "reject")}
                          className="px-3 py-1.5 rounded-xl bg-red-50 border border-red-100 text-red-500 text-xs font-semibold hover:bg-red-100 transition-colors">
                          ✕ Tolak
                        </button>
                      </div>
                    )}
                    {testimoniTab === "approved" && (
                      <span className="badge bg-green-100 text-green-700 text-xs flex-shrink-0">✓ Disetujui</span>
                    )}
                  </div>
                </div>
              ))}

              {(testimoniTab === "pending" ? pendingTestimonials : approvedTestimonials).length === 0 && (
                <div className="text-center py-12 bg-white rounded-2xl border border-neutral-100">
                  <div className="text-3xl mb-2">{testimoniTab === "pending" ? "🎉" : "💬"}</div>
                  <p className="text-neutral-500 text-sm">
                    {testimoniTab === "pending" ? "Tidak ada testimoni yang menunggu review." : "Belum ada testimoni yang disetujui."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── DEBUG TAB ── */}
        {tab === "debug" && (
          <DebugPanel
            loading={debugLoading}
            result={debugResult}
            onRun={runDebug}
          />
        )}

      </div>

      {/* Product Modal */}
      {modal && (
        <ProductModal
          mode={modal}
          product={modal === "edit" && editProduct ? editProduct : emptyProduct()}
          onSave={handleSaveProduct}
          onClose={() => { setModal(null); setEditProduct(null); }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════ */
export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    // Cek session dengan request ke API
    fetch("/api/admin/products")
      .then((r) => setIsLoggedIn(r.status !== 401))
      .catch(() => setIsLoggedIn(false));
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  return <Dashboard onLogout={() => setIsLoggedIn(false)} />;
}
