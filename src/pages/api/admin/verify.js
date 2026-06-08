import { extractToken, verifyToken } from './_auth';

export const prerender = false;

export async function GET({ request }) {
  const token = extractToken(request);
  if (!token) return Response.json({ ok: false }, { status: 401 });

  const user = verifyToken(token);
  if (!user) return Response.json({ ok: false }, { status: 401 });

  return Response.json({ ok: true, username: user.username });
}
