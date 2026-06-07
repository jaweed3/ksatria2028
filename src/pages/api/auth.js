export async function POST({ request }) {
  try {
    const { password } = await request.json();
    const ADMIN_PW = import.meta.env.ADMIN_PASSWORD || '';
    if (!ADMIN_PW || password === ADMIN_PW) {
      return new Response(JSON.stringify({ ok: true }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ ok: false }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
