export default async function handler(req, res) {
  const GITHUB_CLIENT = process.env.GITHUB_CLIENT_ID || '';
  const GITHUB_SECRET = process.env.GITHUB_CLIENT_SECRET || '';
  const code = req.query?.code || '';

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT,
      client_secret: GITHUB_SECRET,
      code,
    }),
  });
  const data = await tokenRes.json();

  const html = `<!doctype html><html><body><script>
    const msg = 'authorization:github:success:${JSON.stringify(data)}';
    window.opener.postMessage(msg, '*');
    window.addEventListener('message', function() { window.close(); });
  <\/script></body></html>`;

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(html);
}
