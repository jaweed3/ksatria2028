export const prerender = false;
export async function GET() {
  const has = !!(process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD);
  const pw = process.env.ADMIN_PASSWORD || import.meta.env.ADMIN_PASSWORD || '';
  return new Response(JSON.stringify({ ok: true, env_set: has, env_len: pw.length }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
