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

    const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
    const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

    // Debug: selalu sertakan status env vars di response
    const envStatus = {
      cloud_name_set: !!CLOUD_NAME,
      upload_preset_set: !!UPLOAD_PRESET,
      cloud_name_value: CLOUD_NAME ? `${CLOUD_NAME.slice(0, 4)}...` : "TIDAK ADA",
      preset_value: UPLOAD_PRESET ? `${UPLOAD_PRESET.slice(0, 4)}...` : "TIDAK ADA",
    };

    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      return NextResponse.json({
        success: false,
        error: "Cloudinary env variable tidak ditemukan di server",
        env_status: envStatus,
        solution: "Pastikan CLOUDINARY_CLOUD_NAME dan CLOUDINARY_UPLOAD_PRESET sudah ditambahkan di Vercel Environment Variables dan sudah Redeploy",
      }, { status: 503 });
    }

    // Upload ke Cloudinary
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);
    uploadFormData.append("upload_preset", UPLOAD_PRESET);
    uploadFormData.append("public_id", `paket-${productId}`);
    uploadFormData.append("folder", "redline");

    const cloudUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const cloudRes = await fetch(cloudUrl, {
      method: "POST",
      body: uploadFormData,
    });

    const cloudText = await cloudRes.text();
    let cloudData: Record<string, unknown>;

    try {
      cloudData = JSON.parse(cloudText);
    } catch {
      return NextResponse.json({
        success: false,
        error: "Response Cloudinary bukan JSON",
        raw_response: cloudText.slice(0, 300),
        env_status: envStatus,
      }, { status: 500 });
    }

    if (!cloudRes.ok) {
      return NextResponse.json({
        success: false,
        error: `Cloudinary error: ${(cloudData.error as Record<string,string>)?.message || "Unknown error"}`,
        cloudinary_status: cloudRes.status,
        env_status: envStatus,
        hint: cloudRes.status === 400
          ? "Kemungkinan upload_preset salah atau mode bukan Unsigned"
          : cloudRes.status === 401
          ? "Kemungkinan cloud_name salah"
          : "Cek Cloudinary dashboard untuk detail error",
      }, { status: 500 });
    }

    const secureUrl = cloudData.secure_url as string;
    if (!secureUrl) {
      return NextResponse.json({
        success: false,
        error: "URL tidak ditemukan di response Cloudinary",
        cloudinary_response: cloudData,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: secureUrl,
      public_id: cloudData.public_id,
      method: "cloudinary",
    });

  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Gagal upload foto",
    }, { status: 500 });
  }
}
