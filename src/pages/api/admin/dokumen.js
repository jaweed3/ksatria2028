export const prerender = false;

const GH_REPO = 'jaweed3/ksatria2028';
const GH_BRANCH = 'main';
const PATH = 'src/content/dokumen';

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
  if (!res.ok) { const e = await res.text(); throw new Error(`GitHub API ${res.status}: ${e}`); }
  return res.json();
}

function fm(c, k) { const m = c.match(new RegExp(`^${k}:\\s*(.+)`, 'm')); return m ? m[1].trim() : ''; }

export async function GET({ request }) {
  const url = new URL(request.url);
  const file = url.searchParams.get('file');
  if (file) {
    const d = await gh(`/contents/${encodeURIComponent(PATH + '/' + file)}`);
    if (!d) return Response.json({ ok: false, error: 'not found' }, { status: 404 });
    const c = Buffer.from(d.content, 'base64').toString('utf-8');
    return Response.json({ ok: true, name: d.name, sha: d.sha, content: c, title: fm(c, 'title'), category: fm(c, 'category'), file: fm(c, 'file'), fileSize: fm(c, 'fileSize') });
  }
  const contents = await gh(`/contents/${PATH}`);
  if (!contents) return Response.json({ ok: true, items: [] });
  const items = await Promise.all((Array.isArray(contents) ? contents : [contents]).filter(f => f.name.endsWith('.md')).map(async f => {
    const d = await gh(`/contents/${encodeURIComponent(PATH + '/' + f.name)}`);
    if (!d) return null;
    const c = Buffer.from(d.content, 'base64').toString('utf-8');
    return { name: f.name, sha: d.sha, title: fm(c, 'title') || f.name.replace('.md', ''), category: fm(c, 'category'), file: fm(c, 'file'), fileSize: fm(c, 'fileSize'), date: fm(c, 'date') || '' };
  }));
  return Response.json({ ok: true, items: items.filter(Boolean) });
}

export async function POST({ request }) {
  try {
    const { slug, title, category, file, fileSize, sha } = await request.json();
    if (!slug || !title || !file) return Response.json({ ok: false, error: 'slug, title, and file required' }, { status: 400 });
    const safeTitle = title.replace(/[-\\]/g, '');
    let fmStr = `---\ntitle: ${safeTitle}`;
    if (category) fmStr += `\ncategory: ${category}`;
    if (file) fmStr += `\nfile: ${file}`;
    if (fileSize) fmStr += `\nfileSize: ${fileSize}`;
    fmStr += '\n---\n\n';
    const content = fmStr;
    const encoded = Buffer.from(content, 'utf-8').toString('base64');
    const payload = { message: `Update ${slug}.md via admin`, content: encoded, branch: GH_BRANCH };
    if (sha) payload.sha = sha;
    const result = await gh(`/contents/${encodeURIComponent(PATH + '/' + slug + '.md')}`, { method: 'PUT', body: JSON.stringify(payload) });
    return Response.json({ ok: true, sha: result?.sha });
  } catch (e) { return Response.json({ ok: false, error: e.message }, { status: 500 }); }
}

export async function DELETE({ request }) {
  const url = new URL(request.url);
  const file = url.searchParams.get('file');
  if (!file) return Response.json({ ok: false, error: 'file required' }, { status: 400 });
  const d = await gh(`/contents/${encodeURIComponent(PATH + '/' + file)}`);
  if (!d) return Response.json({ ok: false, error: 'not found' }, { status: 404 });
  await gh(`/contents/${encodeURIComponent(PATH + '/' + file)}`, { method: 'DELETE', body: JSON.stringify({ message: `Delete ${file} via admin`, sha: d.sha, branch: GH_BRANCH }) });
  return Response.json({ ok: true });
}
