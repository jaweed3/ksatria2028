export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ ok: false });
    return;
  }

  try {
    const { password } = req.body || {};
    const ADMIN_PW = (process.env.ADMIN_PASSWORD || '').trim();

    if (!ADMIN_PW) {
      res.status(500).json({ ok: false, error: 'not configured' });
      return;
    }

    if (password && password.trim() === ADMIN_PW) {
      res.status(200).json({ ok: true });
      return;
    }

    res.status(401).json({ ok: false });
  } catch (e) {
    res.status(400).json({ ok: false, error: String(e) });
  }
}
