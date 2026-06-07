export async function POST({ request }) {
  try {
    const body = await request.json();
    const { password } = body;
    const ADMIN_PW = (process.env.ADMIN_PASSWORD || '').trim();

    if (!ADMIN_PW) {
      return new Response(JSON.stringify({ ok: false, error: 'not configured' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    if (password?.trim() === ADMIN_PW) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: false }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }
}
