import { NextRequest, NextResponse } from "next/server";

// Google Sheets Web App URL — isi setelah setup di README
const SHEET_WEBAPP_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, location, packageName, rating, text } = body;

    if (!name || !text) {
      return NextResponse.json({ error: "Name and text are required" }, { status: 400 });
    }

    if (!SHEET_WEBAPP_URL) {
      // Jika belum setup, simpan saja dan return success (untuk development)
      console.log("Testimoni diterima (SHEET_WEBAPP_URL belum diset):", body);
      return NextResponse.json({ success: true, message: "Testimoni diterima" });
    }

    // Kirim ke Google Sheets via Apps Script Web App
    const response = await fetch(SHEET_WEBAPP_URL, {
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
        approved: false,
      }),
    });

    if (!response.ok) throw new Error("Failed to submit to Google Sheets");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Testimonial API error:", error);
    return NextResponse.json({ error: "Gagal mengirim testimoni" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!SHEET_WEBAPP_URL) {
      return NextResponse.json({ testimonials: [] });
    }

    const response = await fetch(`${SHEET_WEBAPP_URL}?action=getApproved`, {
      next: { revalidate: 300 }, // cache 5 menit
    });

    if (!response.ok) throw new Error("Failed to fetch testimonials");

    const data = await response.json();
    return NextResponse.json({ testimonials: data.testimonials || [] });
  } catch (error) {
    console.error("Testimonial GET error:", error);
    return NextResponse.json({ testimonials: [] });
  }
}
