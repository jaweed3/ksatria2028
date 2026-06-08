import crypto from 'node:crypto';

export const prerender = false;

function signToken(username, secret) {
  const ts = Date.now().toString(36);
  const raw = `${username}:${ts}`;
  const hmac = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  const token = Buffer.from(`${raw}:${hmac}`).toString('base64url');
  return { token, expiresAt: Date.now() + 86400000 };
}

export async function POST({ request }) {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const origin = request.headers.get('origin') || '';
  const host = request.headers.get('host') || '';
  if (!origin && !host) {
    return Response.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }
  if (origin && !origin.endsWith('.vercel.app') && !origin.includes('localhost') && !origin.includes('ksatria')) {
    return Response.json({ ok: false, error: 'forbidden' }, { status: 403 });
  }

  try {
    const { password } = await request.json();
    const adminPw = (process.env.ADMIN_PASSWORD || '').trim();
    if (!adminPw) {
      return Response.json({ ok: false, error: 'server config error' }, { status: 500 });
    }
    if (!password || password.trim() !== adminPw) {
      return Response.json({ ok: false, error: 'invalid password' }, { status: 401 });
    }

    const secret = process.env.TOKEN_SECRET || crypto.createHash('sha256').update(adminPw).digest('hex');
    const { token, expiresAt } = signToken('admin', secret);

    return Response.json({ ok: true, token, expiresAt });
  } catch {
    return Response.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }
}
