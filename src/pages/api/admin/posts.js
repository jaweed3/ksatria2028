import crypto from 'node:crypto';

export const prerender = false;

const GH_REPO = 'jaweed3/ksatria2028';
const GH_BRANCH = 'main';
const POSTS_PATH = 'src/content/posts';

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

export async function GET({ request }) {
  const user = verifyToken(request.headers.get('authorization'));
  if (!user) return Response.json({ ok: false }, { status: 401 });

  const url = new URL(request.url);
  const file = url.searchParams.get('file');

  if (file) {
    const data = await gh(`/contents/${encodeURIComponent(POSTS_PATH + '/' + file)}`);
    if (!data) return Response.json({ ok: false, error: 'not found' }, { status: 404 });
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return Response.json({
      ok: true,
      name: data.name,
      sha: data.sha,
      content,
      html_url: data.html_url,
    });
  }

  const contents = await gh(`/contents/${POSTS_PATH}`);
  if (!contents) return Response.json({ ok: true, posts: [] });

  const posts = await Promise.all(
    (Array.isArray(contents) ? contents : [contents])
      .filter(f => f.name.endsWith('.md'))
      .map(async f => {
        const data = await gh(`/contents/${encodeURIComponent(POSTS_PATH + '/' + f.name)}`);
        if (!data) return null;
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
          name: f.name,
          sha: data.sha,
          title: content.match(/^title:\s*(.+)/m)?.[1] || f.name.replace('.md', ''),
          date: content.match(/^date:\s*(.+)/m)?.[1] || '',
          excerpt: content.replace(/^---[\s\S]*?---\n*/, '').slice(0, 200).replace(/\n/g, ' ') + '...',
        };
      })
  );

  return Response.json({ ok: true, posts: posts.filter(Boolean) });
}

export async function POST({ request }) {
  const user = verifyToken(request.headers.get('authorization'));
  if (!user) return Response.json({ ok: false }, { status: 401 });

  try {
    const { slug, title, body, sha } = await request.json();
    if (!slug || !title || !body) {
      return Response.json({ ok: false, error: 'slug, title, and body required' }, { status: 400 });
    }

    if (slug.length > 100 || title.length > 200 || body.length > 100000) {
      return Response.json({ ok: false, error: 'content too large' }, { status: 400 });
    }

    if (!/^[a-z0-9-]+$/.test(slug)) {
      return Response.json({ ok: false, error: 'slug must be lowercase alphanumeric and hyphens only' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const content = `---\ntitle: ${title.replace(/[-\\]/g, '')}\ndate: ${today}\n---\n\n${body}`;
    const encoded = Buffer.from(content, 'utf-8').toString('base64');
    const path = `${POSTS_PATH}/${slug}.md`;

    const payload = {
      message: `Update ${slug}.md via admin`,
      content: encoded,
      branch: GH_BRANCH,
    };
    if (sha) payload.sha = sha;

    const result = await gh(`/contents/${encodeURIComponent(path)}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });

    return Response.json({ ok: true, sha: result?.sha, commit: result?.commit?.sha });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE({ request }) {
  const user = verifyToken(request.headers.get('authorization'));
  if (!user) return Response.json({ ok: false }, { status: 401 });

  const url = new URL(request.url);
  const file = url.searchParams.get('file');
  if (!file) return Response.json({ ok: false, error: 'file required' }, { status: 400 });

  const data = await gh(`/contents/${encodeURIComponent(POSTS_PATH + '/' + file)}`);
  if (!data) return Response.json({ ok: false, error: 'not found' }, { status: 404 });

  await gh(`/contents/${encodeURIComponent(POSTS_PATH + '/' + file)}`, {
    method: 'DELETE',
    body: JSON.stringify({
      message: `Delete ${file} via admin`,
      sha: data.sha,
      branch: GH_BRANCH,
    }),
  });

  return Response.json({ ok: true });
}
