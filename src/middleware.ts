import { defineMiddleware } from 'astro/middleware';
import { checkOrigin, extractToken, verifyToken, auditLog } from './pages/api/admin/_auth';

const ADMIN_API = '/api/admin/';
const SKIP_AUTH = ['/api/admin/login', '/api/admin/logout'];

export const onRequest = defineMiddleware(async ({ request, locals }, next) => {
  const url = new URL(request.url);
  if (!url.pathname.startsWith(ADMIN_API)) {
    return next();
  }

  const path = url.pathname;
  const method = request.method;

  // Allow CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  if (!checkOrigin(request)) {
    auditLog(request, method + ' ' + path, 'REJECTED_ORIGIN');
    return new Response(JSON.stringify({ ok: false, error: 'forbidden' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!SKIP_AUTH.some(p => path === p)) {
    const token = extractToken(request);
    const user = verifyToken(token);
    if (!user) {
      auditLog(request, method + ' ' + path, 'UNAUTHORIZED');
      return new Response(JSON.stringify({ ok: false, error: 'unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    locals.user = user;
  }

  const response = await next();
  auditLog(request, method + ' ' + path, response.status.toString());
  return response;
});
