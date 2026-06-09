async function loadPeople() {
  const list = document.getElementById('peopleList');
  list.innerHTML = '<div class="loading">Memuat daftar tokoh...</div>';
  document.getElementById('editPeopleForm').classList.add('hidden');
  try {
    const r = await authFetch(API + '/people');
    const d = await r.json();
    if (!d.ok) { list.innerHTML = '<div class="post-item">Gagal memuat</div>'; return; }
    if (!d.items?.length) { list.innerHTML = '<div class="post-item">Belum ada tokoh. Klik "+ Baru" untuk menambah.</div>'; return; }
    list.innerHTML = '';
    d.items.forEach(p => {
      const cat = p.category ? '<span class="cat-badge">' + esc(p.category) + '</span>' : '';
      const item = document.createElement('div');
      item.className = 'post-item';
      item.innerHTML = '<div><div class="title">' + esc(p.title) + cat + '</div><div class="meta">' + esc(p.role) + ' · ' + esc(p.name) + '</div></div><div class="actions"><button class="btn btn-s btn-o" onclick="editPeople(\'' + esc(p.name) + '\')">Edit</button><button class="btn btn-s btn-d" onclick="deletePeople(\'' + esc(p.name) + '\')">Hapus</button></div>';
      list.appendChild(item);
    });
  } catch (e) { list.innerHTML = '<div class="post-item">Error: ' + esc(e.message) + '</div>'; }
}

async function editPeople(name) {
  try {
    const r = await authFetch(API + '/people?file=' + encodeURIComponent(name));
    const d = await r.json();
    if (!d.ok) { toast('Gagal memuat'); return; }
    document.getElementById('peopleName').value = d.title || '';
    document.getElementById('peopleSlug').value = name.replace('.md', '');
    document.getElementById('peopleRole').value = d.role || '';
    document.getElementById('peoplePhoto').value = d.photo || '';
    document.getElementById('peopleBio').value = d.bio || '';
    document.getElementById('peopleCategory').value = d.category || '';
    document.getElementById('peopleOrder').value = d.order || '';
    document.getElementById('editPeopleForm').dataset.sha = d.sha || '';
    document.getElementById('editPeopleForm').dataset.name = name;
    showUpload();
    document.getElementById('editPeopleForm').classList.remove('hidden');
  } catch (e) { toast('Error: ' + e.message); }
}

function newPeople() {
  ['peopleName','peopleSlug','peopleRole','peoplePhoto','peopleBio','peopleCategory','peopleOrder'].forEach(id => document.getElementById(id).value = '');
  delete document.getElementById('editPeopleForm').dataset.sha;
  delete document.getElementById('editPeopleForm').dataset.name;
  showUpload();
  document.getElementById('editPeopleForm').classList.remove('hidden');
}

async function savePeople() {
  const name = document.getElementById('peopleName').value.trim();
  const slug = document.getElementById('peopleSlug').value.trim();
  const role = document.getElementById('peopleRole').value.trim();
  const photo = document.getElementById('peoplePhoto').value.trim();
  const bio = document.getElementById('peopleBio').value.trim();
  const category = document.getElementById('peopleCategory').value;
  const order = parseInt(document.getElementById('peopleOrder').value) || 0;
  if (!name || !slug || !role) { toast('Nama, slug, dan role harus diisi'); return; }
  if (!/^[a-z0-9-]+$/.test(slug)) { toast('Slug: huruf kecil dan tanda hubung saja'); return; }
  const sha = document.getElementById('editPeopleForm').dataset.sha || '';
  const btn = document.getElementById('savePeopleBtn');
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  try {
    const r = await authFetch(API + '/people', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug, name, role, photo, bio, category, order, sha}) });
    const d = await r.json();
    if (d.ok) { toast('Tersimpan!'); cancelEdit(); loadPeople(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
  btn.disabled = false; btn.textContent = 'Simpan';
}

async function deletePeople(name) {
  if (!confirm('Hapus ' + name + '?')) return;
  try {
    const r = await authFetch(API + '/people?file=' + encodeURIComponent(name), { method:'DELETE' });
    const d = await r.json();
    if (d.ok) { toast('Terhapus!'); loadPeople(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
}
