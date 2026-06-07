export default function handler(req, res) {
  const has = !!process.env.ADMIN_PASSWORD;
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    ok: true,
    env_set: has,
    env_len: process.env.ADMIN_PASSWORD?.length || 0,
  }));
}
