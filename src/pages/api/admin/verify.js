import crypto from 'node:crypto';

export const prerender = false;

export async function GET({ request }) {
  const auth = request.headers.get('authorization') || '';
  const token = auth.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    return Response.json({ ok: false }, { status: 401 });
  }

  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length < 3) throw new Error('invalid');
    const [username, ts] = parts;
    const hmac = parts.slice(2).join(':');

    const secret = process.env.TOKEN_SECRET || crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || 'fallback').digest('hex');

    const expected = crypto.createHmac('sha256', secret).update(`${username}:${ts}`).digest('hex');
    if (hmac !== expected) {
      return Response.json({ ok: false }, { status: 401 });
    }

    const age = Date.now() - parseInt(ts, 36);
    if (age > 86400000 || age < 0) {
      return Response.json({ ok: false, error: 'expired' }, { status: 401 });
    }

    return Response.json({ ok: true, username });
  } catch {
    return Response.json({ ok: false }, { status: 401 });
  }
}
