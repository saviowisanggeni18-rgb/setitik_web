# Integrasi Google Sheets Pendaftaran Mbatik

Website mengirim pendaftaran ke API internal, mengurangi sisa kuota di Supabase,
lalu meneruskan data ke Google Sheets melalui Apps Script Web App.

Saat owner membuat jadwal Mbatik baru di admin, Apps Script otomatis membuat tab khusus
untuk jadwal tersebut, misalnya `Mbatik 2026-08-20`. Peserta yang memilih tanggal itu akan
masuk ke tab tersebut.

## Environment

Isi variable berikut di `.env.local` dan hosting:

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/xxxxx/exec
GOOGLE_SHEETS_WEBHOOK_SECRET=secret-bebas-yang-sama-dengan-apps-script
GOOGLE_SHEETS_REPORT_URL=https://docs.google.com/spreadsheets/d/xxxxx/edit
```

## Apps Script

1. Buka Google Sheet laporan.
2. Klik `Extensions` > `Apps Script`.
3. Tempel kode ini.
4. Ganti `SECRET`.
5. Deploy sebagai `Web app`.
6. Set akses ke `Anyone with the link`.
7. Copy URL `/exec` ke `GOOGLE_SHEETS_WEBHOOK_URL`.

```js
const SECRET = 'secret-bebas-yang-sama-dengan-env';

const HEADERS = [
  'Waktu daftar',
  'Tanggal kegiatan',
  'Label tanggal',
  'Jam',
  'Lokasi',
  'Nama',
  'WhatsApp',
  'Email',
  'Jumlah peserta',
  'Catatan',
];

function getOrCreateSheet(name) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const safeName = String(name || 'Pendaftaran')
    .replace(/[\\\/?*:\[\]]/g, '-')
    .slice(0, 90);
  const sheet = spreadsheet.getSheetByName(safeName) || spreadsheet.insertSheet(safeName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }

  return sheet;
}

function createEventSheet(payload) {
  const sheet = getOrCreateSheet(payload.sheetName);

  sheet.getRange('L1').setValue('Tanggal');
  sheet.getRange('M1').setValue(payload.eventLabel || payload.eventDate || '');
  sheet.getRange('L2').setValue('Jam');
  sheet.getRange('M2').setValue(payload.eventTime || '');
  sheet.getRange('L3').setValue('Lokasi');
  sheet.getRange('M3').setValue(payload.eventLocation || '');
  sheet.getRange('L4').setValue('Kuota');
  sheet.getRange('M4').setValue(payload.totalSlots || '');
  sheet.getRange('L5').setValue('Sisa awal');
  sheet.getRange('M5').setValue(payload.availableSlots || '');

  return { ok: true, sheetName: sheet.getName() };
}

function appendRegistration(payload) {
  const sheet = getOrCreateSheet(payload.sheetName);

  sheet.appendRow([
    payload.submittedAt,
    payload.eventDate,
    payload.eventLabel,
    payload.eventTime,
    payload.eventLocation,
    payload.name,
    payload.whatsapp,
    payload.email,
    payload.participants,
    payload.notes,
  ]);

  return { ok: true, sheetName: sheet.getName() };
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents || '{}');

  if (payload.secret !== SECRET) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, message: 'Unauthorized' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const result = payload.action === 'createEventSheet'
    ? createEventSheet(payload)
    : appendRegistration(payload);

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
```
