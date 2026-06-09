async function loadDokumen() {
  const list = document.getElementById('dokumenList');
  list.innerHTML = '<div class="loading">Memuat dokumen...</div>';
  document.getElementById('editDokumenForm').classList.add('hidden');
  try {
    const r = await authFetch(API + '/dokumen');
    const d = await r.json();
    if (!d.ok) { list.innerHTML = '<div class="post-item">Gagal memuat</div>'; return; }
    if (!d.items?.length) { list.innerHTML = '<div class="post-item">Belum ada dokumen. Klik "+ Baru" untuk menambah.</div>'; return; }
    list.innerHTML = '';
    d.items.forEach(p => {
      const cat = p.category ? '<span class="cat-badge">' + esc(p.category) + '</span>' : '';
      const item = document.createElement('div');
      item.className = 'post-item';
      item.innerHTML = '<div><div class="title">' + esc(p.title) + cat + '</div><div class="meta">' + esc(p.name) + (p.fileSize ? ' · ' + esc(p.fileSize) : '') + '</div></div><div class="actions"><button class="btn btn-s btn-o" onclick="editDokumen(\'' + esc(p.name) + '\')">Edit</button><button class="btn btn-s btn-d" onclick="deleteDokumen(\'' + esc(p.name) + '\')">Hapus</button></div>';
      list.appendChild(item);
    });
  } catch (e) { list.innerHTML = '<div class="post-item">Error: ' + esc(e.message) + '</div>'; }
}

async function editDokumen(name) {
  try {
    const r = await authFetch(API + '/dokumen?file=' + encodeURIComponent(name));
    const d = await r.json();
    if (!d.ok) { toast('Gagal memuat'); return; }
    document.getElementById('dokumenTitle').value = d.title || '';
    document.getElementById('dokumenSlug').value = name.replace('.md', '');
    document.getElementById('dokumenCategory').value = d.category || '';
    document.getElementById('dokumenFile').value = d.file || '';
    document.getElementById('dokumenFileSize').value = d.fileSize || '';
    document.getElementById('editDokumenForm').dataset.sha = d.sha || '';
    document.getElementById('editDokumenForm').dataset.name = name;
    showUpload();
    document.getElementById('editDokumenForm').classList.remove('hidden');
  } catch (e) { toast('Error: ' + e.message); }
}

function newDokumen() {
  ['dokumenTitle','dokumenSlug','dokumenCategory','dokumenFile','dokumenFileSize'].forEach(id => document.getElementById(id).value = '');
  delete document.getElementById('editDokumenForm').dataset.sha;
  delete document.getElementById('editDokumenForm').dataset.name;
  showUpload();
  document.getElementById('editDokumenForm').classList.remove('hidden');
}

async function saveDokumen() {
  const title = document.getElementById('dokumenTitle').value.trim();
  const slug = document.getElementById('dokumenSlug').value.trim();
  const category = document.getElementById('dokumenCategory').value.trim();
  const file = document.getElementById('dokumenFile').value.trim();
  const fileSize = document.getElementById('dokumenFileSize').value.trim();
  if (!title || !slug || !file) { toast('Judul, slug, dan URL file harus diisi'); return; }
  if (!/^[a-z0-9-]+$/.test(slug)) { toast('Slug: huruf kecil dan tanda hubung saja'); return; }
  const sha = document.getElementById('editDokumenForm').dataset.sha || '';
  const btn = document.getElementById('saveDokumenBtn');
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  try {
    const r = await authFetch(API + '/dokumen', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug, title, category, file, fileSize, sha}) });
    const d = await r.json();
    if (d.ok) { toast('Tersimpan!'); cancelEdit(); loadDokumen(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
  btn.disabled = false; btn.textContent = 'Simpan';
}

async function deleteDokumen(name) {
  if (!confirm('Hapus ' + name + '?')) return;
  try {
    const r = await authFetch(API + '/dokumen?file=' + encodeURIComponent(name), { method:'DELETE' });
    const d = await r.json();
    if (d.ok) { toast('Terhapus!'); loadDokumen(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
}
