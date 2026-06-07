export default async function handler(req, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  });

  if (req.method === 'OPTIONS') { res.end(); return; }
  if (req.method !== 'POST') { res.end(JSON.stringify({ ok: false })); return; }

  try {
    const data = req.body || {};
    const url = process.env.SHEET_URL || '';
    if (url) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
    }
    res.end(JSON.stringify({ ok: true }));
  } catch (e) {
    res.end(JSON.stringify({ ok: false, error: String(e) }));
  }
}
