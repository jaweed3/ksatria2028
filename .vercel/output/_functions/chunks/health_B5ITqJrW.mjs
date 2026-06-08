const prerender = false;
async function GET() {
  const has = !!(process.env.ADMIN_PASSWORD || undefined                              );
  const pw = process.env.ADMIN_PASSWORD || undefined                               || "";
  return new Response(JSON.stringify({ ok: true, env_set: has, env_len: pw.length }), {
    headers: { "Content-Type": "application/json" }
  });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
