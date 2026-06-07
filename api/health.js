export default function handler(req, res) {
  const has = !!process.env.ADMIN_PASSWORD;
  res.json({
    ok: true,
    env_set: has,
    env_len: process.env.ADMIN_PASSWORD?.length || 0,
  });
}
