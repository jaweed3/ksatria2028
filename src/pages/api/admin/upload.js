import crypto from 'node:crypto';

export const prerender = false;

const GH_REPO = 'jaweed3/ksatria2028';
const GH_BRANCH = 'main';
const UPLOADS_PATH = 'public/uploads';

function verifyToken(authHeader) {
  const token = (authHeader || '').replace(/^Bearer\s+/i, '').trim();
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const [username, ts, hmac] = decoded.split(':');
    const secret = process.env.TOKEN_SECRET || crypto.createHash('sha256').update(process.env.ADMIN_PASSWORD || 'fallback').digest('hex');
    const expected = crypto.createHmac('sha256', secret).update(`${username}:${ts}`).digest('hex');
    if (hmac !== expected) return null;
    const age = Date.now() - parseInt(ts, 36);
    if (age > 86400000 || age < 0) return null;
    return { username };
  } catch {
    return null;
  }
}

async function gh(path, opts = {}) {
  const pat = process.env.GITHUB_PAT;
  if (!pat) throw new Error('GITHUB_PAT not configured');
  const headers = {
    Authorization: `Bearer ${pat}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'ksatria-admin/1.0',
    ...(opts.headers || {}),
  };
  const url = `https://api.github.com/repos/${GH_REPO}${path}`;
  const res = await fetch(url, { ...opts, headers });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API ${res.status}: ${err}`);
  }
  return res.json();
}

export async function POST({ request }) {
  const user = verifyToken(request.headers.get('authorization'));
  if (!user) return Response.json({ ok: false }, { status: 401 });

  try {
    const form = await request.formData();
    const file = form.get('file');
    if (!file || !file.name) {
      return Response.json({ ok: false, error: 'no file' }, { status: 400 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'png';
    const allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
    if (!allowed.includes(ext)) {
      return Response.json({ ok: false, error: 'file type not allowed: ' + ext }, { status: 400 });
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return Response.json({ ok: false, error: 'file too large (max 5MB)' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const b64 = buffer.toString('base64');
    const slug = Date.now().toString(36) + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
    const ghPath = `${UPLOADS_PATH}/${slug}`;

    const existing = await gh(`/contents/${encodeURIComponent(ghPath)}`);

    const payload = {
      message: `Upload ${slug} via admin`,
      content: b64,
      branch: GH_BRANCH,
    };
    if (existing) payload.sha = existing.sha;

    await gh(`/contents/${encodeURIComponent(ghPath)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    const rawUrl = `https://raw.githubusercontent.com/${GH_REPO}/${GH_BRANCH}/${ghPath}`;

    return Response.json({ ok: true, url: rawUrl, slug });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}
