// Google Apps Script — Paste di Extensions → Apps Script → Deploy as Web App
// 1. Buat Google Sheet baru
// 2. Extensions → Apps Script
// 3. Paste script ini
// 4. Deploy → New deployment → Web app
// 5. Copy URL → set sebagai SHEET_URL di Vercel

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const data = JSON.parse(e.postData.contents);

  // Header baris pertama
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(Object.keys(data));
  }

  sheet.appendRow(Object.values(data));
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
