import { NextResponse } from "next/server";

const SHEET_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "";

export async function GET() {
  // Jika Google Sheets belum disetup, fallback ke data hardcode
  if (!SHEET_URL) {
    const { products } = await import("@/lib/data");
    return NextResponse.json({ products, source: "hardcode" });
  }

  try {
    const res = await fetch(`${SHEET_URL}?action=getProducts`, {
      next: { revalidate: 60 }, // cache 60 detik
    });

    if (!res.ok) throw new Error(`Sheets error: ${res.status}`);

    const data = await res.json();

    // Jika Sheets kosong atau error, fallback ke hardcode
    if (!data.success || !data.products || data.products.length === 0) {
      const { products } = await import("@/lib/data");
      return NextResponse.json({ products, source: "hardcode_fallback" });
    }

    return NextResponse.json({ products: data.products, source: "sheets" });
  } catch (err) {
    console.error("Products API error:", err);
    // Fallback ke hardcode jika Sheets gagal
    const { products } = await import("@/lib/data");
    return NextResponse.json({ products, source: "hardcode_fallback" });
  }
}
