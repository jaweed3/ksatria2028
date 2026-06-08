const prerender = false;
async function GET({ url }) {
  const GITHUB_CLIENT = process.env.GITHUB_CLIENT_ID || undefined                                 || "";
  const GITHUB_SECRET = process.env.GITHUB_CLIENT_SECRET || undefined                                     || "";
  const code = url.searchParams.get("code") || "";
  let data = {};
  try {
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ client_id: GITHUB_CLIENT, client_secret: GITHUB_SECRET, code })
    });
    data = await tokenRes.json();
  } catch (e) {
    data = { error: "fetch_failed", error_description: String(e) };
  }
  const json = JSON.stringify(data).replace(/<\//g, "<\\/");
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><title>Authorizing...</title></head>
<body style="background:#050505;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;color:#C9A84C;font-family:sans-serif">
<p>Authorized! Please wait...</p>
<script>
  var data = JSON.parse('${json}');
  var msg = 'authorization:github:success:' + JSON.stringify(data);
  // Retry postMessage with delays to ensure Decap CMS is ready
  function send() {
    try { if (window.opener && !window.opener.closed) window.opener.postMessage(msg, '*'); } catch(e) {}
    try { if (window.parent && window.parent !== window) window.parent.postMessage(msg, '*'); } catch(e) {}
  }
  send();
  setTimeout(send, 500);
  setTimeout(send, 1500);
  setTimeout(send, 3000);
  setTimeout(function() { window.close(); }, 3500);
</script></body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
