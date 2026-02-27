import { NextRequest, NextResponse } from "next/server";

const SHEET_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL || "";

function isAuthenticated(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  return !!session;
}

// GET — ambil semua produk dari Sheets
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    if (!SHEET_URL) {
      // Fallback ke data statis jika Sheets belum disetup
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

// POST — tambah produk baru
export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!SHEET_URL) {
      return NextResponse.json({ success: true, message: "Demo mode — setup Google Sheets untuk menyimpan data" });
    }

    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "addProduct", ...body }),
    });

    if (!res.ok) throw new Error("Sheets error");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menambah produk" }, { status: 500 });
  }
}

// PUT — edit produk
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

    if (!res.ok) throw new Error("Sheets error");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal mengupdate produk" }, { status: 500 });
  }
}

// DELETE — hapus produk
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

    if (!res.ok) throw new Error("Sheets error");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}
