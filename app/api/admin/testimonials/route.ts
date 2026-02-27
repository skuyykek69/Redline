import { NextRequest, NextResponse } from "next/server";

const SHEET_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "";

function isAuthenticated(req: NextRequest) {
  return !!req.cookies.get("admin_session")?.value;
}

// GET semua testimoni (pending + approved)
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!SHEET_URL) {
      const { testimonials } = await import("@/lib/data");
      return NextResponse.json({
        pending: [],
        approved: testimonials.map((t) => ({ ...t, status: "approved" })),
      });
    }

    const res = await fetch(`${SHEET_URL}?action=getAllTestimonials`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({
      pending: data.pending || [],
      approved: data.approved || [],
    });
  } catch {
    return NextResponse.json({ pending: [], approved: [] });
  }
}

// PUT — approve atau reject testimoni
export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json(); // { rowIndex, action: "approve" | "reject" }

    if (!SHEET_URL) {
      return NextResponse.json({ success: true, message: "Demo mode" });
    }

    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "moderateTestimonial", ...body }),
    });

    if (!res.ok) throw new Error();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal moderasi testimoni" }, { status: 500 });
  }
}
