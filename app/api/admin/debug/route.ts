import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = req.cookies.get("admin_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const SHEET_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
  const UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env_check: {
      GOOGLE_SHEETS_WEBAPP_URL: SHEET_URL
        ? `✅ Set (${SHEET_URL.slice(0, 60)}...)`
        : "❌ TIDAK ADA",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "✅ Set" : "⚠️ Menggunakan default",
      CLOUDINARY_CLOUD_NAME: CLOUD_NAME
        ? `✅ Set → "${CLOUD_NAME}"`
        : "❌ TIDAK ADA — upload foto tidak akan berfungsi",
      CLOUDINARY_UPLOAD_PRESET: UPLOAD_PRESET
        ? `✅ Set → "${UPLOAD_PRESET}"`
        : "❌ TIDAK ADA — upload foto tidak akan berfungsi",
    },
  };

  // ── Test Cloudinary ──
  if (CLOUD_NAME && UPLOAD_PRESET) {
    try {
      // Buat gambar 1x1 pixel PNG sebagai test upload
      const pixel = Buffer.from(
        "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        "base64"
      );
      const testBlob = new Blob([pixel], { type: "image/png" });

      const uploadFd = new FormData();
      uploadFd.append("file", testBlob, "test.png");
      uploadFd.append("upload_preset", UPLOAD_PRESET);
      uploadFd.append("public_id", "debug-test");
      uploadFd.append("folder", "redline");

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: uploadFd }
      );

      const cloudText = await cloudRes.text();
      let cloudData: Record<string, unknown> = {};
      try { cloudData = JSON.parse(cloudText); } catch { /**/ }

      if (cloudRes.ok && cloudData.secure_url) {
        results.cloudinary_test = {
          status: "✅ BERHASIL",
          test_url: cloudData.secure_url,
          message: "Upload ke Cloudinary berhasil! Foto produk seharusnya bisa diupload.",
        };
      } else {
        const errMsg = (cloudData.error as Record<string,string>)?.message || cloudText.slice(0, 200);
        results.cloudinary_test = {
          status: "❌ GAGAL",
          http_status: cloudRes.status,
          error: errMsg,
          diagnosis:
            cloudRes.status === 400
              ? `Upload preset "${UPLOAD_PRESET}" tidak ditemukan atau mode bukan Unsigned. Pastikan preset ada dan mode = Unsigned di Cloudinary Settings → Upload.`
              : cloudRes.status === 401
              ? `Cloud name "${CLOUD_NAME}" salah atau tidak valid.`
              : `Error tidak dikenal (HTTP ${cloudRes.status})`,
        };
      }
    } catch (err) {
      results.cloudinary_test = { status: "❌ Exception", error: String(err) };
    }
  } else {
    results.cloudinary_test = {
      status: "⚠️ Tidak ditest",
      reason: "CLOUDINARY_CLOUD_NAME atau CLOUDINARY_UPLOAD_PRESET belum diset",
    };
  }

  // ── Test Google Sheets ──
  if (SHEET_URL) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const getRes = await fetch(`${SHEET_URL}?action=getApproved`, { signal: controller.signal, cache: "no-store" });
      clearTimeout(timeout);

      results.sheets_get_test = { status: getRes.status, ok: getRes.ok };
      const body = await getRes.text();
      try { results.sheets_get_response = JSON.parse(body); }
      catch { results.sheets_get_raw = body.slice(0, 300); }
    } catch (err) {
      results.sheets_get_error = String(err);
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const postRes = await fetch(SHEET_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addTestimonial", name: "DEBUG TEST", location: "Debug",
          package: "Test", rating: 5, text: "Debug test — boleh dihapus", timestamp: new Date().toISOString() }),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      results.sheets_post_test = { status: postRes.status, ok: postRes.ok };
      const body = await postRes.text();
      try { results.sheets_post_response = JSON.parse(body); }
      catch { results.sheets_post_raw = body.slice(0, 300); }
    } catch (err) {
      results.sheets_post_error = String(err);
    }
  }

  return NextResponse.json(results, { status: 200 });
}
