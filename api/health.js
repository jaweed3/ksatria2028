export async function GET() {
  const has = !!process.env.ADMIN_PASSWORD;
  return new Response(JSON.stringify({
    ok: true,
    env_set: has,
    env_len: process.env.ADMIN_PASSWORD?.length || 0,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
