export const prerender = false;
export async function GET({ url }) {
  const GITHUB_CLIENT = process.env.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID || '';
  const GITHUB_SECRET = process.env.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET || '';
  const code = url.searchParams.get('code') || '';

  let data = {};
  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ client_id: GITHUB_CLIENT, client_secret: GITHUB_SECRET, code }),
    });
    data = await tokenRes.json();
  } catch (e) {
    data = { error: 'fetch_failed', error_description: String(e) };
  }

  const html = `<!doctype html><html><head><meta charset="utf-8"><title>Authorizing</title></head>
<body><script>
var data = ${JSON.stringify(data).replace(/<\//g,'<\\/')};
var msg = 'authorization:github:success:' + JSON.stringify(data);
var target = window.opener || window.parent;

// Step 1: Send handshake
target.postMessage('authorizing:github', '*');

// Step 2: Wait for response, then send token
var handler = function(e) {
  if (e.data === 'authorizing:github') {
    window.removeEventListener('message', handler);
    target.postMessage(msg, '*');
    setTimeout(function() { window.close(); }, 500);
  }
};
window.addEventListener('message', handler);

// Fallback: if no response within 2s, send token anyway
setTimeout(function() {
  window.removeEventListener('message', handler);
  target.postMessage(msg, '*');
  setTimeout(function() { window.close(); }, 500);
}, 2000);
<\/script></body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
}
