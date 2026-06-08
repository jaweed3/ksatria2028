const prerender = false;
async function GET({ url, request }) {
  const GITHUB_CLIENT = process.env.GITHUB_CLIENT_ID || undefined                                 || "";
  const origin = url.origin || request?.headers?.get("origin") || "https://ksatria-two.vercel.app";
  const redirect = `${origin}/api/oauth/callback`;
  const state = url.searchParams.get("state") || "";
  const authorizeUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT}&redirect_uri=${encodeURIComponent(redirect)}&scope=repo,user&state=${encodeURIComponent(state)}`;
  return Response.redirect(authorizeUrl, 302);
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
