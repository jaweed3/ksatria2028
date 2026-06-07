const GITHUB_CLIENT = import.meta.env.GITHUB_CLIENT_ID || '';

export async function GET({ url }) {
  const redirect = `${url.origin}/api/oauth/callback`;
  const state = url.searchParams.get('state') || '';
  const authorizeUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CLIENT}` +
    `&redirect_uri=${encodeURIComponent(redirect)}` +
    `&scope=repo,user` +
    `&state=${encodeURIComponent(state)}`;

  return Response.redirect(authorizeUrl, 302);
}
