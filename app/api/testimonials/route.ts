import { NextRequest, NextResponse } from "next/server";

const SHEET_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "";

// POST — user kirim testimoni baru
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, packageName, rating, text } = body;

    if (!name || !text) {
      return NextResponse.json({ error: "Nama dan ulasan wajib diisi" }, { status: 400 });
    }

    if (!SHEET_URL) {
      console.log("Testimoni diterima (SHEET_URL belum diset):", body);
      return NextResponse.json({ success: true });
    }

    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addTestimonial",
        name,
        location: location || "-",
        package: packageName || "-",
        rating: rating || 5,
        text,
        timestamp: new Date().toISOString(),
      }),
    });

    const responseText = await res.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      throw new Error("Response tidak valid dari Google Sheets");
    }

    if (!responseData.success) {
      throw new Error(responseData.error || "Gagal simpan testimoni");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial POST error:", error);
    return NextResponse.json({ error: "Gagal mengirim testimoni" }, { status: 500 });
  }
}

// GET — ambil testimoni yang sudah approved dari Sheets
// digabung dengan hardcode dari lib/data.ts
export async function GET() {
  try {
    // Selalu sertakan testimoni hardcode sebagai base
    const { testimonials: staticTestimonials } = await import("@/lib/data");

    if (!SHEET_URL) {
      return NextResponse.json({ testimonials: staticTestimonials, source: "hardcode" });
    }

    try {
      const res = await fetch(`${SHEET_URL}?action=getApproved`, {
        next: { revalidate: 120 }, // cache 2 menit
      });

      if (!res.ok) throw new Error("Sheets tidak bisa diakses");

      const data = await res.json();
      const sheetsTestimonials = (data.testimonials || []) as Array<{
        id: number;
        name: string;
        location: string;
        package: string;
        rating: number;
        text: string;
        timestamp?: string;
        date?: string;
      }>;

      // Gabungkan: hardcode dulu, lalu dari Sheets (yang sudah diapprove)
      const combined = [
        ...staticTestimonials,
        ...sheetsTestimonials.map((t) => ({
          ...t,
          date: t.timestamp
            ? new Date(t.timestamp).toLocaleDateString("id-ID", { year: "numeric", month: "long" })
            : "Baru",
        })),
      ];

      return NextResponse.json({ testimonials: combined, source: "combined" });
    } catch {
      // Kalau Sheets gagal, tetap tampilkan data hardcode
      return NextResponse.json({ testimonials: staticTestimonials, source: "hardcode_fallback" });
    }
  } catch (err) {
    console.error("Testimonials GET error:", err);
    return NextResponse.json({ testimonials: [], source: "error" });
  }
}
