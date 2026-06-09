export const prerender = false;

const ALLOWED_ORIGIN_SUBSTRINGS = ['.vercel.app', 'localhost', 'ksatria'];
const RATE_LIMIT_WINDOW = 3600000;
const RATE_LIMIT_MAX = 10;
const rateMap = new Map();

export async function POST({ request, clientAddress }) {
  try {
    const origin = request.headers.get('origin') || '';
    const referer = request.headers.get('referer') || '';
    const source = origin || referer;
    if (source) {
      const allowed = ALLOWED_ORIGIN_SUBSTRINGS.some(s => source.includes(s));
      if (!allowed) {
        return Response.json({ ok: false, error: 'forbidden' }, { status: 403 });
      }
    }

    const ip = clientAddress || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const now = Date.now();
    const entry = rateMap.get(ip);
    if (entry) {
      if (now - entry.windowStart > RATE_LIMIT_WINDOW) {
        rateMap.set(ip, { windowStart: now, count: 1 });
      } else if (entry.count >= RATE_LIMIT_MAX) {
        return Response.json({ ok: false, error: 'too many requests' }, { status: 429 });
      } else {
        entry.count++;
      }
    } else {
      rateMap.set(ip, { windowStart: now, count: 1 });
    }

    const data = await request.json();
    const nama = String(data.nama || '').replace(/[<>\0]/g, '').slice(0, 200);
    const email = String(data.email || '').replace(/[<>\0]/g, '').slice(0, 200);
    const subjek = String(data.subjek || '').replace(/[<>\0]/g, '').slice(0, 200);
    const pesan = String(data.pesan || '').replace(/[<>\0]/g, '').slice(0, 5000);

    if (!nama || !email || !subjek || !pesan) {
      return Response.json({ ok: false, error: 'Semua field harus diisi' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ ok: false, error: 'Email tidak valid' }, { status: 400 });
    }

    const sheetUrl = process.env.SHEET_URL || '';
    if (sheetUrl) {
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama, email, subjek, pesan, type: 'contact' }),
      }).catch(() => {});
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }
}
