import { NextRequest, NextResponse } from "next/server";

const SHEET_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "";

function isAuthenticated(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return !!session;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    if (!SHEET_URL) {
      const { products } = await import("@/lib/data");
      return NextResponse.json({ products });
    }
    const res = await fetch(`${SHEET_URL}?action=getProducts`, { cache: "no-store" });
    const data = await res.json();
    return NextResponse.json({ products: data.products || [] });
  } catch {
    const { products } = await import("@/lib/data");
    return NextResponse.json({ products });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!SHEET_URL) {
      return NextResponse.json({ success: true, message: "Demo mode" });
    }
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addProduct", ...body }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return NextResponse.json({ success: true, id: data.id });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    if (!SHEET_URL) {
      return NextResponse.json({ success: true, message: "Demo mode" });
    }
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "updateProduct", ...body }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await req.json();
    if (!SHEET_URL) {
      return NextResponse.json({ success: true, message: "Demo mode" });
    }
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "deleteProduct", id }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.error);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
