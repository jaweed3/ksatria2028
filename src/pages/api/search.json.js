export const prerender = false;

const GH_REPO = 'jaweed3/ksatria2028';
const GH_BRANCH = 'main';
const COLLECTIONS = [
  { path: 'src/content/posts', type: 'Blog', urlPrefix: '/blog/' },
  { path: 'src/content/events', type: 'Acara', urlPrefix: '/event/' },
  { path: 'src/content/galeri', type: 'Galeri', urlPrefix: '/galeri/' },
  { path: 'src/content/dokumen', type: 'Dokumen', urlPrefix: '/dokumen/' },
];

async function gh(path) {
  const pat = process.env.GITHUB_PAT;
  if (!pat) throw new Error('GITHUB_PAT not configured');
  const url = `https://api.github.com/repos/${GH_REPO}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${pat}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'ksatria-search/1.0',
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub API ${res.status}: ${err}`);
  }
  return res.json();
}

function parseFrontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  const data = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (kv) {
      let val = kv[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
      }
      data[kv[1]] = val;
    }
  }
  return { data, body: m[2] };
}

export async function GET() {
  try {
    const items = [];

    for (const col of COLLECTIONS) {
      const tree = await gh(`/git/trees/${GH_BRANCH}?recursive=1`);
      if (!tree || !tree.tree) continue;

      const files = tree.tree.filter(f =>
        f.path.startsWith(col.path + '/') && f.path.endsWith('.md') && f.type === 'blob'
      );

      for (const file of files) {
        const content = await gh(`/contents/${encodeURIComponent(file.path)}`);
        if (!content || !content.content) continue;
        const decoded = Buffer.from(content.content, 'base64').toString('utf-8');
        const { data, body } = parseFrontmatter(decoded);
        const slug = file.path.split('/').pop().replace('.md', '');
        items.push({
          title: data.title || slug,
          excerpt: (data.description || data.caption || data.category || body || '').replace(/[#*\[\]]/g, '').slice(0, 200),
          url: col.urlPrefix + slug,
          type: col.type,
          date: data.date || '',
          tags: Array.isArray(data.tags) ? data.tags : [],
        });
      }
    }

    return new Response(JSON.stringify(items), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message, items: [] }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
