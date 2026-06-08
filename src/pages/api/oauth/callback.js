export const prerender = false;
export async function GET({ url }) {
  const GITHUB_CLIENT = process.env.GITHUB_CLIENT_ID || import.meta.env.GITHUB_CLIENT_ID || '';
  const GITHUB_SECRET = process.env.GITHUB_CLIENT_SECRET || import.meta.env.GITHUB_CLIENT_SECRET || '';
  const code = url.searchParams.get('code') || '';

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ client_id: GITHUB_CLIENT, client_secret: GITHUB_SECRET, code }),
  });
  const data = await tokenRes.json();

  const html = `<!doctype html><html><body><script>
    window.opener.postMessage('authorization:github:success:${JSON.stringify(data)}','*');
  <\/script></body></html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}
