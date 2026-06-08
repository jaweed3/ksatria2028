import crypto from 'node:crypto';

export const prerender = false;

const RATE_WINDOW = 900000; // 15 min
const RATE_MAX = 5;
const SESSION_TTL = 86400000; // 24h

const rateMap = new Map();

function getSecret() {
  return process.env.TOKEN_SECRET || crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || 'fallback').digest('hex');
}

export function signToken(username, secret) {
  const ts = Date.now().toString(36);
  const raw = `${username}:${ts}`;
  const hmac = crypto.createHmac('sha256', secret || getSecret()).update(raw).digest('hex');
  const token = Buffer.from(`${raw}:${hmac}`).toString('base64url');
  return { token, expiresAt: Date.now() + SESSION_TTL };
}

export function verifyToken(token) {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length < 3) return null;
    const [username, ts] = parts;
    const hmac = parts.slice(2).join(':');
    const secret = getSecret();
    const expected = crypto.createHmac('sha256', secret).update(`${username}:${ts}`).digest('hex');
    if (hmac !== expected) return null;
    const age = Date.now() - parseInt(ts, 36);
    if (age > SESSION_TTL || age < 0) return null;
    return { username };
  } catch {
    return null;
  }
}

export function extractToken(request) {
  const auth = request.headers.get('authorization') || '';
  const bearer = auth.replace(/^Bearer\s+/i, '').trim();
  if (bearer) return bearer;

  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)ksatria_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : '';
}

export function setTokenCookie(response, token) {
  const cookie = `ksatria_token=${encodeURIComponent(token)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL / 1000}; Priority=High`;
  response.headers.set('Set-Cookie', cookie);
  return response;
}

export function clearTokenCookie(response) {
  const cookie = 'ksatria_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';
  response.headers.set('Set-Cookie', cookie);
  return response;
}

export function checkOrigin(request) {
  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  const source = origin || referer;
  if (source && !source.includes('ksatria') && !source.includes('localhost') && !source.includes('.vercel.app')) {
    return false;
  }
  return true;
}

export function checkRateLimit(clientAddress) {
  const ip = clientAddress || 'unknown';
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    rateMap.set(ip, { windowStart: now, count: 1, fails: 0 });
    return { allowed: true, remaining: RATE_MAX - 1 };
  }
  return { allowed: entry.fails < RATE_MAX, remaining: Math.max(0, RATE_MAX - entry.fails), locked: entry.fails >= RATE_MAX };
}

export function recordFailedAttempt(clientAddress) {
  const ip = clientAddress || 'unknown';
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW) {
    rateMap.set(ip, { windowStart: now, count: 1, fails: 1 });
  } else {
    entry.fails = (entry.fails || 0) + 1;
    entry.count = (entry.count || 0) + 1;
  }
}

export function resetRateLimit(clientAddress) {
  const ip = clientAddress || 'unknown';
  rateMap.delete(ip);
}

export function auditLog(request, action, status) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const ua = request.headers.get('user-agent') || 'unknown';
  const ts = new Date().toISOString();
  console.log(`[ADMIN] ${ts} ${ip} ${action} ${status} "${ua}"`);
}
