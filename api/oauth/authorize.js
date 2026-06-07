export default function handler(req, res) {
  const GITHUB_CLIENT = process.env.GITHUB_CLIENT_ID || '';
  const redirect = `${req.headers.origin || 'https://ksatria-two.vercel.app'}/api/oauth/callback`;
  const state = req.query?.state || '';

  const authorizeUrl = `https://github.com/login/oauth/authorize?` +
    `client_id=${GITHUB_CLIENT}` +
    `&redirect_uri=${encodeURIComponent(redirect)}` +
    `&scope=repo,user` +
    `&state=${encodeURIComponent(state)}`;

  res.redirect(302, authorizeUrl);
}
