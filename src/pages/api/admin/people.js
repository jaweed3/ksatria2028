export const prerender = false;

const GH_REPO = 'jaweed3/ksatria2028';
const GH_BRANCH = 'main';
const PEOPLE_PATH = 'src/content/people';

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
  const url = new URL(request.url);
  const file = url.searchParams.get('file');

  if (file) {
    const data = await gh(`/contents/${encodeURIComponent(PEOPLE_PATH + '/' + file)}`);
    if (!data) return Response.json({ ok: false, error: 'not found' }, { status: 404 });
    const content = Buffer.from(data.content, 'base64').toString('utf-8');
    const nameMatch = content.match(/^name:\s*(.+)/m);
    const roleMatch = content.match(/^role:\s*(.+)/m);
    const photoMatch = content.match(/^photo:\s*(.+)/m);
    const bioMatch = content.match(/^bio:\s*(.+)/m);
    const categoryMatch = content.match(/^category:\s*(.+)/m);
    const orderMatch = content.match(/^order:\s*(\d+)/m);
    return Response.json({
      ok: true,
      name: data.name,
      sha: data.sha,
      title: nameMatch?.[1] || '',
      role: roleMatch?.[1] || '',
      photo: photoMatch?.[1] || '',
      bio: bioMatch?.[1] || '',
      category: categoryMatch?.[1] || '',
      order: orderMatch ? parseInt(orderMatch[1]) : 0,
      content,
    });
  }

  const contents = await gh(`/contents/${PEOPLE_PATH}`);
  if (!contents) return Response.json({ ok: true, items: [] });

  const items = await Promise.all(
    (Array.isArray(contents) ? contents : [contents])
      .filter(f => f.name.endsWith('.md'))
      .map(async f => {
        const data = await gh(`/contents/${encodeURIComponent(PEOPLE_PATH + '/' + f.name)}`);
        if (!data) return null;
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
          name: f.name,
          sha: data.sha,
          title: content.match(/^name:\s*(.+)/m)?.[1] || f.name.replace('.md', ''),
          role: content.match(/^role:\s*(.+)/m)?.[1] || '',
          photo: content.match(/^photo:\s*(.+)/m)?.[1] || '',
          category: content.match(/^category:\s*(.+)/m)?.[1] || '',
          order: parseInt(content.match(/^order:\s*(\d+)/m)?.[1] || '0'),
        };
      })
  );

  return Response.json({ ok: true, items: items.filter(Boolean) });
}

export async function POST({ request }) {
  try {
    const { slug, name, role, photo, bio, category, order, sha } = await request.json();
    if (!slug || !name || !role) {
      return Response.json({ ok: false, error: 'slug, name, and role required' }, { status: 400 });
    }
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return Response.json({ ok: false, error: 'slug must be lowercase alphanumeric and hyphens' }, { status: 400 });
    }

    const safeName = name.replace(/[-\\]/g, '');
    let content = `---\nname: ${safeName}\nrole: ${role.replace(/[-\\]/g, '')}`;
    if (photo) content += `\nphoto: ${photo}`;
    if (bio) content += `\nbio: ${bio.replace(/[-\\]/g, '')}`;
    if (category) content += `\ncategory: ${category}`;
    if (typeof order === 'number') content += `\norder: ${order}`;
    content += '\n---\n';
    const encoded = Buffer.from(content, 'utf-8').toString('base64');
    const path = `${PEOPLE_PATH}/${slug}.md`;

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

    return Response.json({ ok: true, sha: result?.sha });
  } catch (e) {
    return Response.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE({ request }) {
  const url = new URL(request.url);
  const file = url.searchParams.get('file');
  if (!file) return Response.json({ ok: false, error: 'file required' }, { status: 400 });

  const data = await gh(`/contents/${encodeURIComponent(PEOPLE_PATH + '/' + file)}`);
  if (!data) return Response.json({ ok: false, error: 'not found' }, { status: 404 });

  await gh(`/contents/${encodeURIComponent(PEOPLE_PATH + '/' + file)}`, {
    method: 'DELETE',
    body: JSON.stringify({ message: `Delete ${file} via admin`, sha: data.sha, branch: GH_BRANCH }),
  });

  return Response.json({ ok: true });
}
