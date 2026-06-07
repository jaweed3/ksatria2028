export default function handler(req, res) {
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  });

  if (req.method === 'OPTIONS') { res.end(); return; }
  if (req.method !== 'POST') { res.end(JSON.stringify({ ok: false })); return; }

  try {
    const { password } = req.body || {};
    const pw = (process.env.ADMIN_PASSWORD || '').trim();

    if (!pw) {
      res.end(JSON.stringify({ ok: false, error: 'not configured' }));
      return;
    }

    const match = password && password.trim() === pw;
    res.end(JSON.stringify({ ok: !!match }));
  } catch (e) {
    res.end(JSON.stringify({ ok: false, error: String(e) }));
  }
}
