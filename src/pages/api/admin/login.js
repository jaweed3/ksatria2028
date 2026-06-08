import { signToken, checkOrigin, checkRateLimit, recordFailedAttempt, resetRateLimit, setTokenCookie, auditLog } from './_auth';

export const prerender = false;

export async function POST({ request, clientAddress }) {
  try {
    if (!checkOrigin(request)) {
      auditLog(request, 'LOGIN', 'REJECTED_ORIGIN');
      return Response.json({ ok: false, error: 'forbidden' }, { status: 403 });
    }

    const rl = checkRateLimit(clientAddress);
    if (!rl.allowed) {
      auditLog(request, 'LOGIN', 'RATE_LIMITED');
      return Response.json({ ok: false, error: 'too many attempts' }, { status: 429 });
    }

    const { password } = await request.json();
    const adminPw = (process.env.ADMIN_PASSWORD || '').trim();
    if (!adminPw) {
      return Response.json({ ok: false, error: 'server config error' }, { status: 500 });
    }

    if (!password || password.trim() !== adminPw) {
      recordFailedAttempt(clientAddress);
      auditLog(request, 'LOGIN', 'FAIL');
      return Response.json({ ok: false, error: 'invalid password' }, { status: 401 });
    }

    resetRateLimit(clientAddress);
    const { token, expiresAt } = signToken('admin');
    auditLog(request, 'LOGIN', 'OK');

    const res = Response.json({ ok: true, expiresAt });
    setTokenCookie(res, token);
    return res;
  } catch {
    return Response.json({ ok: false, error: 'invalid request' }, { status: 400 });
  }
}
