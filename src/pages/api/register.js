export const prerender = false;

const ALLOWED_FIELDS = ['nama', 'provinsi', 'organisasi', 'kategori', 'email', 'hp', 'pesan'];
const ALLOWED_ORIGIN_SUBSTRINGS = ['.vercel.app', 'localhost', 'ksatria'];
const RATE_LIMIT_WINDOW = 3600000;
const RATE_LIMIT_MAX = 10;

const rateMap = new Map();

function sanitizeValue(val) {
  if (typeof val === 'string') {
    return val.replace(/[<>\0]/g, '').slice(0, 5000);
  }
  return String(val).slice(0, 5000);
}

function stripProto(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  const clean = {};
  for (const key of Object.keys(obj)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    if (ALLOWED_FIELDS.includes(key)) {
      clean[key] = sanitizeValue(obj[key]);
    }
  }
  return clean;
}

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

    const raw = await request.json();
    const data = stripProto(raw);

    const required = ['nama', 'provinsi', 'email'];
    for (const field of required) {
      if (!data[field] || !String(data[field]).trim()) {
        return Response.json({ ok: false, error: `${field} wajib diisi` }, { status: 400 });
      }
    }

    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return Response.json({ ok: false, error: 'email tidak valid' }, { status: 400 });
    }

    if (data.hp && !/^[\d\s+\-()]{6,20}$/.test(data.hp)) {
      return Response.json({ ok: false, error: 'nomor HP tidak valid' }, { status: 400 });
    }

    const sheetUrl = process.env.SHEET_URL || '';
    if (sheetUrl) {
      await fetch(sheetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
    }

    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }
}
