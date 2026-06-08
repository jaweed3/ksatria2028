import { clearTokenCookie } from './_auth';

export const prerender = false;

export async function POST({ request }) {
  const res = Response.json({ ok: true });
  clearTokenCookie(res);
  return res;
}
