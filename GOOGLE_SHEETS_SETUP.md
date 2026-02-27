# 📊 Panduan Setup Google Sheets (Lengkap v2)

Panduan ini mencakup setup untuk **Testimoni** dan **Manajemen Produk** via Google Sheets.

---

## Langkah 1 — Buat Google Spreadsheet

1. Buka [Google Sheets](https://sheets.google.com) → Buat spreadsheet baru
2. Beri nama: **"Redline Production — Database"**
3. Buat 3 sheet tab: `Produk`, `Testimoni`, `Approved`

---

## Langkah 2 — Setup Header

**Sheet "Produk"** baris 1:
```
A:ID | B:Nama | C:Harga | D:Kategori | E:Emoji | F:Popular | G:Order | H:Items (pisah dengan |)
```

**Sheet "Testimoni"** dan **"Approved"** baris 1:
```
A:Timestamp | B:Nama | C:Lokasi | D:Paket | E:Rating | F:Ulasan | G:Status | H:RowIndex
```

---

## Langkah 3 — Apps Script

Klik **Extensions → Apps Script**, paste kode ini:

```javascript
const ss = SpreadsheetApp.getActiveSpreadsheet();

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === "addTestimonial") {
      const sheet = ss.getSheetByName("Testimoni");
      const rowIndex = sheet.getLastRow() + 1;
      sheet.appendRow([data.timestamp||new Date().toISOString(), data.name, data.location||"-", data.package||"-", data.rating||5, data.text, "pending", rowIndex]);
      return ok({ message: "OK" });
    }

    if (action === "moderateTestimonial") {
      const sheet = ss.getSheetByName("Testimoni");
      const rows = sheet.getDataRange().getValues();
      const rowIdx = rows.findIndex(r => r[7] == data.rowIndex);
      if (rowIdx === -1) return err("Not found");
      if (data.action_type === "approve") {
        ss.getSheetByName("Approved").appendRow(rows[rowIdx]);
      }
      sheet.deleteRow(rowIdx + 1);
      return ok({});
    }

    if (action === "addProduct") {
      const sheet = ss.getSheetByName("Produk");
      const vals = sheet.getLastRow() > 1 ? sheet.getRange(2,1,sheet.getLastRow()-1,1).getValues().flat().map(Number) : [0];
      const lastId = Math.max(...vals);
      sheet.appendRow([lastId+1, data.name, data.price, data.category, data.emoji, data.popular?"TRUE":"FALSE", data.order||99, (data.items||[]).join("|")]);
      return ok({});
    }

    if (action === "updateProduct") {
      const sheet = ss.getSheetByName("Produk");
      const rows = sheet.getDataRange().getValues();
      const rowIdx = rows.findIndex(r => r[0] == data.id);
      if (rowIdx === -1) return err("Not found");
      const row = rowIdx + 1;
      sheet.getRange(row, 2).setValue(data.name);
      sheet.getRange(row, 3).setValue(data.price);
      sheet.getRange(row, 4).setValue(data.category);
      sheet.getRange(row, 5).setValue(data.emoji);
      sheet.getRange(row, 6).setValue(data.popular?"TRUE":"FALSE");
      sheet.getRange(row, 7).setValue(data.order||rowIdx);
      sheet.getRange(row, 8).setValue((data.items||[]).join("|"));
      return ok({});
    }

    if (action === "deleteProduct") {
      const sheet = ss.getSheetByName("Produk");
      const rows = sheet.getDataRange().getValues();
      const rowIdx = rows.findIndex(r => r[0] == data.id);
      if (rowIdx !== -1) sheet.deleteRow(rowIdx + 1);
      return ok({});
    }

    if (action === "reorder") {
      const sheet = ss.getSheetByName("Produk");
      const rows = sheet.getDataRange().getValues();
      (data.order||[]).forEach(({id, order}) => {
        const rowIdx = rows.findIndex(r => r[0] == id);
        if (rowIdx !== -1) sheet.getRange(rowIdx+1, 7).setValue(order);
      });
      return ok({});
    }

    return err("Unknown action");
  } catch(e) { return err(e.toString()); }
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === "getProducts") {
    const sheet = ss.getSheetByName("Produk");
    const rows = sheet.getDataRange().getValues().slice(1);
    const products = rows.filter(r=>r[0]).sort((a,b)=>(a[6]||99)-(b[6]||99)).map(r=>({
      id:Number(r[0]), name:String(r[1]), price:Number(r[2]),
      category:String(r[3]), emoji:String(r[4]),
      popular:String(r[5]).toUpperCase()==="TRUE",
      order:Number(r[6]),
      items:String(r[7]).split("|").map(s=>s.trim()).filter(Boolean)
    }));
    return ok({ products });
  }

  if (action === "getApproved") {
    const rows = ss.getSheetByName("Approved").getDataRange().getValues().slice(1);
    return ok({ testimonials: rows.filter(r=>r[1]).map((r,i)=>({
      id:i+100, timestamp:r[0], name:r[1], location:r[2], package:r[3], rating:Number(r[4]), text:r[5]
    }))});
  }

  if (action === "getAllTestimonials") {
    const pending = ss.getSheetByName("Testimoni").getDataRange().getValues().slice(1)
      .filter(r=>r[1]).map((r,i)=>({id:i, timestamp:r[0], name:r[1], location:r[2], package:r[3], rating:Number(r[4]), text:r[5], rowIndex:r[7]}));
    const approved = ss.getSheetByName("Approved").getDataRange().getValues().slice(1)
      .filter(r=>r[1]).map((r,i)=>({id:i+1000, timestamp:r[0], name:r[1], location:r[2], package:r[3], rating:Number(r[4]), text:r[5]}));
    return ok({ pending, approved });
  }

  return err("Unknown action");
}

function ok(data) {
  return ContentService.createTextOutput(JSON.stringify({success:true,...data})).setMimeType(ContentService.MimeType.JSON);
}
function err(msg) {
  return ContentService.createTextOutput(JSON.stringify({success:false,error:msg})).setMimeType(ContentService.MimeType.JSON);
}
```

---

## Langkah 4 — Deploy Web App

1. **Deploy → New deployment → Web app**
2. Execute as: **Me** | Who has access: **Anyone**
3. Klik Deploy → **Copy URL**

---

## Langkah 5 — Environment Variables di Vercel

| Name | Value |
|------|-------|
| `GOOGLE_SHEETS_WEBAPP_URL` | URL Apps Script kamu |
| `ADMIN_PASSWORD` | Password admin (default: `Redline@Admin2026`) |

---

## Langkah 6 — Isi Data Produk Awal

Di sheet **"Produk"**, isi setiap baris. Contoh:
```
1 | Paket 1 | 110000 | standard | 🎁 | FALSE | 1 | Gizi|Tic tic|Teh dandang|Marjan squash|Nabati ah|Minyak fitri 200 ml
```
Items dipisahkan dengan tanda **|** (pipe).

---

## Akses Admin Panel

Buka: `https://website-kamu.vercel.app/redline-admin`

Login dengan password di environment variable `ADMIN_PASSWORD`.
