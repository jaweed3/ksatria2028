export const prerender = false;
export async function POST({ request }) {
  try {
    const data = await request.json();
    const url = process.env.SHEET_URL || import.meta.env.SHEET_URL || '';
    if (url) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).catch(() => {});
    }
    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}
