import { NextRequest, NextResponse } from "next/server";

function isAuthenticated(req: NextRequest) {
  return !!req.cookies.get("admin_session")?.value;
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const productId = formData.get("productId") as string;

    if (!file || !productId) {
      return NextResponse.json({ error: "File dan productId diperlukan" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format file harus JPG, PNG, atau WebP" }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 });
    }

    const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

    // Jika Cloudinary belum disetup, kembalikan pesan yang jelas
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      return NextResponse.json({
        success: false,
        error: "Cloudinary belum disetup. Tambahkan CLOUDINARY_CLOUD_NAME dan CLOUDINARY_UPLOAD_PRESET di environment variable Vercel.",
        setup_required: true,
      }, { status: 503 });
    }

    // Upload ke Cloudinary
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    uploadFormData.append("public_id", `redline/paket-${productId}`);
    uploadFormData.append("overwrite", "true");

    const cloudinaryRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: uploadFormData }
    );

    if (!cloudinaryRes.ok) {
      const errData = await cloudinaryRes.json();
      throw new Error(errData.error?.message || "Upload ke Cloudinary gagal");
    }

    const cloudinaryData = await cloudinaryRes.json();

    return NextResponse.json({
      success: true,
      url: cloudinaryData.secure_url,
      public_id: cloudinaryData.public_id,
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : "Gagal upload foto"
    }, { status: 500 });
  }
}
