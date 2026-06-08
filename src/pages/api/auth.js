export const prerender = false;
export async function POST({ request }) {
  try {
    const { password } = await request.json();
    const ADMIN_PW = (process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || '').trim();

    if (!ADMIN_PW) {
      return new Response(JSON.stringify({ ok: false, error: 'not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    const match = password && password.trim() === ADMIN_PW;
    return new Response(JSON.stringify({ ok: !!match }), {
      status: match ? 200 : 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }
}
