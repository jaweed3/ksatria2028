import { signToken, checkRateLimit, recordFailedAttempt, resetRateLimit, setTokenCookie } from './_auth';

export const prerender = false;

export async function POST({ request, clientAddress }) {
  try {
    const rl = checkRateLimit(clientAddress);
    if (!rl.allowed) {
      return Response.json({ ok: false, error: 'too many attempts' }, { status: 429 });
    }

    const { password } = await request.json();
    const adminPw = (process.env.ADMIN_PASSWORD || '').trim();
    if (!adminPw) {
      return Response.json({ ok: false, error: 'server config error' }, { status: 500 });
    }

    if (!password || password.trim() !== adminPw) {
      recordFailedAttempt(clientAddress);
      return Response.json({ ok: false, error: 'invalid password' }, { status: 401 });
    }

    resetRateLimit(clientAddress);
    const { token, expiresAt } = signToken('admin');

    const res = Response.json({ ok: true, expiresAt });
    setTokenCookie(res, token);
    return res;
  } catch {
    return Response.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }
}
