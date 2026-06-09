async function loadGaleri() {
  const list = document.getElementById('galeriList');
  list.innerHTML = '<div class="loading">Memuat galeri...</div>';
  document.getElementById('editGaleriForm').classList.add('hidden');
  try {
    const r = await authFetch(API + '/galeri');
    const d = await r.json();
    if (!d.ok) { list.innerHTML = '<div class="post-item">Gagal memuat</div>'; return; }
    if (!d.items?.length) { list.innerHTML = '<div class="post-item">Belum ada foto. Klik "+ Baru" untuk menambah.</div>'; return; }
    list.innerHTML = '';
    d.items.forEach(p => {
      const cat = p.category ? '<span class="cat-badge">' + esc(p.category) + '</span>' : '';
      const item = document.createElement('div');
      item.className = 'post-item';
      item.innerHTML = '<div><div class="title">' + esc(p.title) + cat + '</div><div class="meta">' + esc(p.name) + (p.caption ? ' · ' + esc(p.caption.slice(0,60)) : '') + '</div></div><div class="actions"><button class="btn btn-s btn-o" onclick="editGaleri(\'' + esc(p.name) + '\')">Edit</button><button class="btn btn-s btn-d" onclick="deleteGaleri(\'' + esc(p.name) + '\')">Hapus</button></div>';
      list.appendChild(item);
    });
  } catch (e) { list.innerHTML = '<div class="post-item">Error: ' + esc(e.message) + '</div>'; }
}

async function editGaleri(name) {
  try {
    const r = await authFetch(API + '/galeri?file=' + encodeURIComponent(name));
    const d = await r.json();
    if (!d.ok) { toast('Gagal memuat'); return; }
    document.getElementById('galeriTitle').value = d.title || '';
    document.getElementById('galeriSlug').value = name.replace('.md', '');
    document.getElementById('galeriCaption').value = d.caption || '';
    document.getElementById('galeriImage').value = d.image || '';
    document.getElementById('galeriCategory').value = d.category || '';
    document.getElementById('editGaleriForm').dataset.sha = d.sha || '';
    document.getElementById('editGaleriForm').dataset.name = name;
    showUpload();
    document.getElementById('editGaleriForm').classList.remove('hidden');
  } catch (e) { toast('Error: ' + e.message); }
}

function newGaleri() {
  ['galeriTitle','galeriSlug','galeriCaption','galeriImage','galeriCategory'].forEach(id => document.getElementById(id).value = '');
  delete document.getElementById('editGaleriForm').dataset.sha;
  delete document.getElementById('editGaleriForm').dataset.name;
  showUpload();
  document.getElementById('editGaleriForm').classList.remove('hidden');
}

async function saveGaleri() {
  const title = document.getElementById('galeriTitle').value.trim();
  const slug = document.getElementById('galeriSlug').value.trim();
  const caption = document.getElementById('galeriCaption').value.trim();
  const image = document.getElementById('galeriImage').value.trim();
  const category = document.getElementById('galeriCategory').value.trim();
  if (!title || !slug || !image) { toast('Judul, slug, dan URL gambar harus diisi'); return; }
  if (!/^[a-z0-9-]+$/.test(slug)) { toast('Slug: huruf kecil dan tanda hubung saja'); return; }
  const sha = document.getElementById('editGaleriForm').dataset.sha || '';
  const btn = document.getElementById('saveGaleriBtn');
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  try {
    const r = await authFetch(API + '/galeri', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug, title, caption, image, category, sha}) });
    const d = await r.json();
    if (d.ok) { toast('Tersimpan!'); cancelEdit(); loadGaleri(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
  btn.disabled = false; btn.textContent = 'Simpan';
}

async function deleteGaleri(name) {
  if (!confirm('Hapus ' + name + '?')) return;
  try {
    const r = await authFetch(API + '/galeri?file=' + encodeURIComponent(name), { method:'DELETE' });
    const d = await r.json();
    if (d.ok) { toast('Terhapus!'); loadGaleri(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
}
