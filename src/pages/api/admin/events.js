export const prerender = false;

const GH_REPO = 'jaweed3/ksatria2028';
const GH_BRANCH = 'main';
const EVENTS_PATH = 'src/content/events';

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

function extractFm(content, key) {
  const m = content.match(new RegExp(`^${key}:\\s*(.+)`, 'm'));
  return m ? m[1].trim() : '';
}

function extractTags(content) {
  const m = content.match(/^tags:\s*\[([^\]]*)\]/m);
  return m ? m[1].split(',').map(t => t.trim().replace(/['"]/g, '')).filter(Boolean) : [];
}

export async function GET({ request }) {
  const url = new URL(request.url);
  const file = url.searchParams.get('file');

  if (file) {
    const data = await gh(`/contents/${encodeURIComponent(EVENTS_PATH + '/' + file)}`);
    if (!data) return Response.json({ ok: false, error: 'not found' }, { status: 404 });
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    return Response.json({
      ok: true,
      name: data.name,
      sha: data.sha,
      content,
      title: extractFm(content, 'title'),
      date: extractFm(content, 'date'),
      timeStart: extractFm(content, 'timeStart'),
      timeEnd: extractFm(content, 'timeEnd'),
      location: extractFm(content, 'location'),
      image: extractFm(content, 'image'),
      type: extractFm(content, 'type'),
      tags: extractTags(content),
      featured: extractFm(content, 'featured') === 'true',
    });
  }

  const contents = await gh(`/contents/${EVENTS_PATH}`);
  if (!contents) return Response.json({ ok: true, events: [] });

  const events = await Promise.all(
    (Array.isArray(contents) ? contents : [contents])
      .filter(f => f.name.endsWith('.md'))
      .map(async f => {
        const data = await gh(`/contents/${encodeURIComponent(EVENTS_PATH + '/' + f.name)}`);
        if (!data) return null;
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
          name: f.name,
          sha: data.sha,
          title: extractFm(content, 'title') || f.name.replace('.md', ''),
          date: extractFm(content, 'date') || '',
          timeStart: extractFm(content, 'timeStart'),
          timeEnd: extractFm(content, 'timeEnd'),
          location: extractFm(content, 'location'),
          image: extractFm(content, 'image'),
          type: extractFm(content, 'type'),
          tags: extractTags(content),
          featured: extractFm(content, 'featured') === 'true',
          excerpt: content.replace(/^---[\s\S]*?---\n*/, '').slice(0, 200).replace(/\n/g, ' ') + '...',
        };
      })
  );

  return Response.json({ ok: true, events: events.filter(Boolean) });
}

export async function POST({ request }) {
  try {
    const { slug, title, body, date, timeStart, timeEnd, location, image, type, tags, featured, sha } = await request.json();
    if (!slug || !title || !date) {
      return Response.json({ ok: false, error: 'slug, title, and date required' }, { status: 400 });
    }
    if (slug.length > 100 || title.length > 200 || (body || '').length > 100000) {
      return Response.json({ ok: false, error: 'content too large' }, { status: 400 });
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return Response.json({ ok: false, error: 'slug must be lowercase alphanumeric and hyphens only' }, { status: 400 });
    }

    const safeTitle = title.replace(/[-\\]/g, '');
    let frontmatter = `---\ntitle: ${safeTitle}\ndate: ${date}`;
    if (timeStart) frontmatter += `\ntimeStart: ${timeStart}`;
    if (timeEnd) frontmatter += `\ntimeEnd: ${timeEnd}`;
    if (location) frontmatter += `\nlocation: ${location}`;
    if (image) frontmatter += `\nimage: ${image}`;
    if (type) frontmatter += `\ntype: ${type}`;
    if (tags && Array.isArray(tags) && tags.length > 0) {
      frontmatter += `\ntags: [${tags.map(t => `"${t.replace(/"/g, '')}"`).join(', ')}]`;
    }
    if (featured) frontmatter += '\nfeatured: true';
    frontmatter += '\n---\n\n';
    const content = frontmatter + (body || '');
    const encoded = Buffer.from(content, 'utf-8').toString('base64');
    const path = `${EVENTS_PATH}/${slug}.md`;

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
  const url = new URL(request.url);
  const file = url.searchParams.get('file');
  if (!file) return Response.json({ ok: false, error: 'file required' }, { status: 400 });

  const data = await gh(`/contents/${encodeURIComponent(EVENTS_PATH + '/' + file)}`);
  if (!data) return Response.json({ ok: false, error: 'not found' }, { status: 404 });

  await gh(`/contents/${encodeURIComponent(EVENTS_PATH + '/' + file)}`, {
    method: 'DELETE',
    body: JSON.stringify({ message: `Delete ${file} via admin`, sha: data.sha, branch: GH_BRANCH }),
  });

  return Response.json({ ok: true });
}
