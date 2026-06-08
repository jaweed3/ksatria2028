export const prerender = false;
export async function GET() {
  // Decap CMS built-in key for GitHub token
  const TOKEN_KEY = 'decap-cms-github-token';

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Authorizing...</title>
<style>
body { background:#050505; display:flex; align-items:center; justify-content:center; min-height:100vh; margin:0; color:#C9A84C; font-family:sans-serif; }
p { font-size:0.9rem; }
</style>
</head>
<body>
<p id="msg">Authorizing...</p>
<script>
var hash = window.location.hash.substring(1);
var params = new URLSearchParams(hash);
var token = params.get('access_token');

if (token) {
  try { localStorage.setItem('${TOKEN_KEY}', token); } catch(e) {}
  document.getElementById('msg').textContent = 'Authorized! Redirecting...';
  window.location.href = '/admin/cms/';
} else {
  var q = new URLSearchParams(window.location.search);
  var code = q.get('code');
  if (code) {
    // Token exchange via our server
    fetch('/api/oauth/token-exchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code })
    }).then(function(r) { return r.json(); }).then(function(data) {
      if (data.access_token) {
        try { localStorage.setItem('${TOKEN_KEY}', data.access_token); } catch(e) {}
        document.getElementById('msg').textContent = 'Authorized! Redirecting...';
        window.location.href = '/admin/cms/';
      } else {
        document.getElementById('msg').textContent = 'Error: ' + (data.error || 'Unknown');
      }
    }).catch(function(e) {
      document.getElementById('msg').textContent = 'Error: ' + e.message;
    });
  } else {
    document.getElementById('msg').textContent = 'No authorization code received.';
  }
}
<\/script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html;charset=utf-8' } });
}
