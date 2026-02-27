import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Cek session
  const session = req.cookies.get("admin_session")?.value;
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const SHEET_URL = process.env.GOOGLE_SHEETS_WEBAPP_URL;
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env_check: {
      GOOGLE_SHEETS_WEBAPP_URL: SHEET_URL
        ? `✅ Set (${SHEET_URL.slice(0, 60)}...)`
        : "❌ TIDAK ADA — env variable belum diset",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
        ? "✅ Set"
        : "⚠️ Tidak diset (menggunakan default)",
    },
  };

  if (!SHEET_URL) {
    results.diagnosis = "❌ GOOGLE_SHEETS_WEBAPP_URL belum diset di environment variable Vercel";
    results.solution = "Tambahkan GOOGLE_SHEETS_WEBAPP_URL di Vercel → Settings → Environment Variables, lalu Redeploy";
    return NextResponse.json(results);
  }

  // Test GET request ke Sheets
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const getRes = await fetch(`${SHEET_URL}?action=getApproved`, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeout);

    results.get_test = {
      status: getRes.status,
      status_text: getRes.statusText,
      ok: getRes.ok,
      content_type: getRes.headers.get("content-type"),
    };

    const getBody = await getRes.text();
    try {
      results.get_response = JSON.parse(getBody);
    } catch {
      results.get_response_raw = getBody.slice(0, 500);
      results.get_parse_error = "Response bukan JSON valid — kemungkinan Apps Script belum di-deploy atau ada error di script";
    }
  } catch (err: unknown) {
    const error = err as Error;
    results.get_test_error = error.name === "AbortError"
      ? "❌ TIMEOUT — Apps Script tidak merespons dalam 10 detik"
      : `❌ ${error.message}`;
  }

  // Test POST request ke Sheets
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const postRes = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "addTestimonial",
        name: "DEBUG TEST",
        location: "Debug",
        package: "Paket 1",
        rating: 5,
        text: "Ini adalah pesan debug otomatis — boleh dihapus dari spreadsheet",
        timestamp: new Date().toISOString(),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    results.post_test = {
      status: postRes.status,
      ok: postRes.ok,
    };

    const postBody = await postRes.text();
    try {
      results.post_response = JSON.parse(postBody);
    } catch {
      results.post_response_raw = postBody.slice(0, 500);
      results.post_parse_error = "Response POST bukan JSON — periksa Apps Script";
    }
  } catch (err: unknown) {
    const error = err as Error;
    results.post_test_error = error.name === "AbortError"
      ? "❌ TIMEOUT pada POST request"
      : `❌ ${error.message}`;
  }

  // Diagnosis otomatis
  const getOk = (results.get_test as Record<string, unknown>)?.ok === true;
  const postOk = (results.post_test as Record<string, unknown>)?.ok === true;
  const postSuccess = (results.post_response as Record<string, unknown>)?.success === true;

  if (getOk && postOk && postSuccess) {
    results.diagnosis = "✅ Koneksi Google Sheets BERHASIL! Data debug test sudah masuk ke spreadsheet.";
  } else if (!getOk && !postOk) {
    results.diagnosis = "❌ Tidak bisa terhubung ke Google Sheets sama sekali";
    results.possible_causes = [
      "Apps Script belum di-deploy sebagai Web App",
      "URL Apps Script salah di environment variable",
      "Apps Script di-deploy dengan 'Execute as: Me' tapi akun Google bermasalah",
      "Perlu deploy ulang Apps Script (New Deployment)",
    ];
  } else if (getOk && !postSuccess) {
    results.diagnosis = "⚠️ GET berhasil tapi POST gagal — ada error di fungsi doPost() Apps Script";
    results.solution = "Cek log Apps Script: buka Apps Script → View → Executions";
  }

  return NextResponse.json(results, { status: 200 });
}
