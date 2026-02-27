import { NextRequest, NextResponse } from "next/server";

const SHEET_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "";

function isAuthenticated(req: NextRequest) {
  return !!req.cookies.get("admin_session")?.value;
}

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

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    // body: { rowIndex, action: "approve" | "reject" }

    if (!SHEET_URL) {
      return NextResponse.json({ success: true, message: "Demo mode" });
    }

    // FIXED: kirim action_type (bukan action) ke Apps Script
    // karena "action" sudah dipakai untuk "moderateTestimonial"
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "moderateTestimonial",
        rowIndex: body.rowIndex,
        action_type: body.action, // "approve" atau "reject"
      }),
    });

    const responseText = await res.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      return NextResponse.json({ error: "Response tidak valid dari Google Sheets" }, { status: 500 });
    }

    if (!responseData.success) {
      return NextResponse.json({ error: responseData.error || "Gagal moderasi" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Moderate testimonial error:", err);
    return NextResponse.json({ error: "Gagal moderasi testimoni" }, { status: 500 });
  }
}
