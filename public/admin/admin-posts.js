async function loadPosts() {
  const list = document.getElementById('postList');
  list.innerHTML = '<div class="loading">Memuat daftar artikel...</div>';
  document.getElementById('editPostForm').classList.add('hidden');
  try {
    const r = await authFetch(API + '/posts');
    const d = await r.json();
    if (!d.ok) { list.innerHTML = '<div class="post-item">Gagal memuat</div>'; return; }
    if (!d.posts.length) { list.innerHTML = '<div class="post-item">Belum ada artikel. Klik "+ Baru" untuk membuat.</div>'; return; }
    list.innerHTML = '';
    d.posts.forEach(p => {
      const cat = p.category ? '<span class="cat-badge">' + esc(p.category) + '</span>' : '';
      const item = document.createElement('div');
      item.className = 'post-item';
      item.innerHTML = '<div><div class="title">' + esc(p.title) + cat + '</div><div class="meta">' + esc(p.date) + ' · ' + esc(p.name) + '</div></div><div class="actions"><button class="btn btn-s btn-o" onclick="editPost(\'' + esc(p.name) + '\')">Edit</button><button class="btn btn-s btn-d" onclick="deletePost(\'' + esc(p.name) + '\')">Hapus</button></div>';
      list.appendChild(item);
    });
  } catch (e) { list.innerHTML = '<div class="post-item">Error: ' + esc(e.message) + '</div>'; }
}

async function editPost(name) {
  try {
    const r = await authFetch(API + '/posts?file=' + encodeURIComponent(name));
    const d = await r.json();
    if (!d.ok) { toast('Gagal memuat artikel'); return; }
    document.getElementById('postTitle').value = d.title || '';
    document.getElementById('postBody').value = d.content.replace(/^---[\s\S]*?---\n*/, '');
    document.getElementById('postSlug').value = name.replace('.md', '');
    document.getElementById('postImage').value = d.image || '';
    document.getElementById('postTags').value = d.tags ? d.tags.join(', ') : '';
    document.getElementById('postCategory').value = d.category || '';
    document.getElementById('editPostForm').dataset.sha = d.sha || '';
    document.getElementById('editPostForm').dataset.name = name;
    showUpload();
    document.getElementById('editPostForm').classList.remove('hidden');
  } catch (e) { toast('Error: ' + e.message); }
}

function newPost() {
  ['postTitle','postBody','postSlug','postImage','postTags'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('postCategory').value = '';
  delete document.getElementById('editPostForm').dataset.sha;
  delete document.getElementById('editPostForm').dataset.name;
  showUpload();
  document.getElementById('editPostForm').classList.remove('hidden');
}

async function savePost() {
  const title = document.getElementById('postTitle').value.trim();
  const body = document.getElementById('postBody').value;
  const slug = document.getElementById('postSlug').value.trim();
  if (!title || !body || !slug) { toast('Judul, slug, dan konten harus diisi'); return; }
  if (!/^[a-z0-9-]+$/.test(slug)) { toast('Slug: huruf kecil dan tanda hubung saja'); return; }
  const image = document.getElementById('postImage').value.trim();
  const tagsRaw = document.getElementById('postTags').value.trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const category = document.getElementById('postCategory').value;
  const sha = document.getElementById('editPostForm').dataset.sha || '';
  const btn = document.getElementById('savePostBtn');
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  try {
    const r = await authFetch(API + '/posts', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug, title, body, image, tags, category, sha}) });
    const d = await r.json();
    if (d.ok) { toast('Tersimpan!'); cancelEdit(); loadPosts(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
  btn.disabled = false; btn.textContent = 'Simpan';
}

async function deletePost(name) {
  if (!confirm('Hapus ' + name + '?')) return;
  try {
    const r = await authFetch(API + '/posts?file=' + encodeURIComponent(name), { method:'DELETE' });
    const d = await r.json();
    if (d.ok) { toast('Terhapus!'); loadPosts(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
}
