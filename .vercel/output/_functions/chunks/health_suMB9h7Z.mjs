const prerender = false;
async function GET() {
  return new Response(JSON.stringify({
    ok: true,
    admin_pw: !!(process.env.ADMIN_PASSWORD || undefined                              ),
    github_client: !!(process.env.GITHUB_CLIENT_ID || undefined                                ),
    github_secret: !!(process.env.GITHUB_CLIENT_SECRET || undefined                                    ),
    sheet: !!(process.env.SHEET_URL || undefined                         )
  }), { headers: { "Content-Type": "application/json" } });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
