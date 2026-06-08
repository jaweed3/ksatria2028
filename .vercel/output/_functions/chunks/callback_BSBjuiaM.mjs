const prerender = false;
async function GET({ url }) {
  const GITHUB_CLIENT = process.env.GITHUB_CLIENT_ID || undefined                                 || "";
  const GITHUB_SECRET = process.env.GITHUB_CLIENT_SECRET || undefined                                     || "";
  const code = url.searchParams.get("code") || "";
  url.searchParams.get("state") || "";
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
<html lang="en">
<head><meta charset="utf-8"><title>Authorizing...</title></head>
<body style="background:#050505;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;color:#C9A84C;font-family:sans-serif">
<p>Authorizing...</p>
<script>
  (function() {
    var data = JSON.parse('${json}');
    var msg = 'authorization:github:success:' + JSON.stringify(data);
    if (window.opener) {
      window.opener.postMessage(msg, '*');
      setTimeout(function() { window.close(); }, 1000);
    } else if (window.parent) {
      window.parent.postMessage(msg, '*');
      setTimeout(function() { window.close(); }, 1000);
    }
  })();
</script>
</body></html>`;
  return new Response(html, { headers: { "Content-Type": "text/html;charset=utf-8" } });
}

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
