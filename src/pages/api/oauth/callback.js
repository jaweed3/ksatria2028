const GITHUB_CLIENT = import.meta.env.GITHUB_CLIENT_ID || '';
const GITHUB_SECRET = import.meta.env.GITHUB_CLIENT_SECRET || '';

export async function GET({ url }) {
  const code = url.searchParams.get('code') || '';
  const state = url.searchParams.get('state') || '';

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT,
      client_secret: GITHUB_SECRET,
      code,
    }),
  });
  const data = await tokenRes.json();

  // Decap CMS expects the token in the URL fragment
  const html = `<!doctype html>
<html><body>
<script>
  (function() {
    function receiveMessage(e) {
      window.opener.postMessage(
        'authorization:github:success:${JSON.stringify(data).replace(/'/g, "\\'")}',
        e.origin
      );
    }
    window.addEventListener('message', receiveMessage, false);
    window.opener.postMessage('authorizing:github', '*');
  })();
</script>
</body></html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
