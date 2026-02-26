# 📊 Panduan Setup Google Sheets untuk Testimoni

Panduan ini menjelaskan cara menghubungkan form testimoni website ke Google Sheets,
sehingga kamu bisa melihat dan menyetujui ulasan pelanggan.

---

## Langkah 1 — Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com) dan buat spreadsheet baru
2. Beri nama: **"Redline Production — Testimoni"**
3. Buat 2 sheet tab:
   - Sheet 1: rename jadi `Testimoni`
   - Sheet 2: rename jadi `Approved`

4. Di sheet **Testimoni**, buat header di baris 1:
   ```
   A1: Timestamp
   B1: Nama
   C1: Lokasi
   D1: Paket
   E1: Rating
   F1: Ulasan
   G1: Status (isi: "pending" untuk default)
   ```

5. Di sheet **Approved**, buat header yang sama persis.

---

## Langkah 2 — Buat Google Apps Script

1. Di spreadsheet, klik menu **Extensions → Apps Script**
2. Hapus semua kode yang ada, lalu paste kode berikut:

```javascript
const SHEET_NAME = "Testimoni";
const APPROVED_SHEET = "Approved";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (data.action === "addTestimonial") {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      const sheet = ss.getSheetByName(SHEET_NAME);
      
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name,
        data.location || "-",
        data.package || "-",
        data.rating || 5,
        data.text,
        "pending"
      ]);
      
      return ContentService
        .createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Unknown action" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  
  if (action === "getApproved") {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(APPROVED_SHEET);
    const data = sheet.getDataRange().getValues();
    
    // Skip header row
    const testimonials = data.slice(1).map((row, index) => ({
      id: index + 100,
      timestamp: row[0],
      name: row[1],
      location: row[2],
      package: row[3],
      rating: Number(row[4]),
      text: row[5],
    })).filter(t => t.name && t.text);
    
    return ContentService
      .createTextOutput(JSON.stringify({ testimonials }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return ContentService
    .createTextOutput(JSON.stringify({ error: "Unknown action" }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Klik **Save** (Ctrl+S), beri nama project: `RedlineTestimoni`

---

## Langkah 3 — Deploy Apps Script sebagai Web App

1. Klik tombol **Deploy → New deployment**
2. Klik ikon ⚙️ di sebelah "Select type" → pilih **Web app**
3. Isi form:
   - **Description**: Redline Testimoni API
   - **Execute as**: Me (your email)
   - **Who has access**: **Anyone** ← PENTING!
4. Klik **Deploy**
5. **Copy URL** yang muncul — formatnya seperti:
   ```
   https://script.google.com/macros/s/XXXXXXXXXXXX/exec
   ```

---

## Langkah 4 — Tambahkan URL ke Environment Variable Vercel

1. Buka [vercel.com](https://vercel.com) → project kamu
2. Klik **Settings → Environment Variables**
3. Tambahkan:
   - **Name**: `GOOGLE_SHEETS_WEBAPP_URL`
   - **Value**: URL Apps Script dari langkah 3
   - **Environment**: Production, Preview, Development (centang semua)
4. Klik **Save**
5. **Redeploy** project agar perubahan diterapkan

---

## Langkah 5 — Cara Verifikasi/Approve Testimoni

Saat ada pelanggan mengirim testimoni:

1. **Buka Google Sheets** → sheet **"Testimoni"**
2. Kamu akan melihat baris baru dengan status `pending`
3. **Untuk approve**: Copy baris tersebut ke sheet **"Approved"**
4. Testimoni akan otomatis muncul di website dalam 5 menit (karena ada cache 5 menit)

> 💡 **Tips**: Kamu bisa buat Google Sheets notification agar dapat email setiap ada testimoni baru. Caranya: **Tools → Notification rules → Any changes → Email - right away**

---

## Langkah 6 — Test Integrasi

Setelah semua setup, test dengan cara:
1. Buka website kamu
2. Pergi ke halaman Testimoni
3. Isi dan kirim form testimoni
4. Cek Google Sheets — harus ada data baru di sheet "Testimoni"
5. Copy ke sheet "Approved"
6. Tunggu 5 menit atau refresh website

---

Jika ada kendala, hubungi developer atau cek log di Apps Script: **View → Executions**
