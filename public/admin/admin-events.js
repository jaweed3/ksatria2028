async function loadEvents() {
  const list = document.getElementById('eventList');
  list.innerHTML = '<div class="loading">Memuat daftar acara...</div>';
  document.getElementById('editEventForm').classList.add('hidden');
  try {
    const r = await authFetch(API + '/events');
    const d = await r.json();
    if (!d.ok) { list.innerHTML = '<div class="post-item">Gagal memuat</div>'; return; }
    if (!d.events.length) { list.innerHTML = '<div class="post-item">Belum ada acara. Klik "+ Baru" untuk membuat.</div>'; return; }
    list.innerHTML = '';
    d.events.forEach(e => {
      const typeBadge = e.type ? '<span class="cat-badge">' + esc(e.type) + '</span>' : '';
      const featuredStar = e.featured ? ' ★' : '';
      const item = document.createElement('div');
      item.className = 'post-item';
      item.innerHTML = '<div><div class="title">' + esc(e.title) + featuredStar + typeBadge + '</div><div class="meta">' + esc(e.date) + (e.location ? ' · ' + esc(e.location) : '') + ' · ' + esc(e.name) + '</div></div><div class="actions"><button class="btn btn-s btn-o" onclick="editEvent(\'' + esc(e.name) + '\')">Edit</button><button class="btn btn-s btn-d" onclick="deleteEvent(\'' + esc(e.name) + '\')">Hapus</button></div>';
      list.appendChild(item);
    });
  } catch (e) { list.innerHTML = '<div class="post-item">Error: ' + esc(e.message) + '</div>'; }
}

async function editEvent(name) {
  try {
    const r = await authFetch(API + '/events?file=' + encodeURIComponent(name));
    const d = await r.json();
    if (!d.ok) { toast('Gagal memuat acara'); return; }
    document.getElementById('eventTitle').value = d.title || '';
    document.getElementById('eventBody').value = d.content.replace(/^---[\s\S]*?---\n*/, '');
    document.getElementById('eventSlug').value = name.replace('.md', '');
    document.getElementById('eventDate').value = d.date || '';
    document.getElementById('eventTimeStart').value = d.timeStart || '';
    document.getElementById('eventTimeEnd').value = d.timeEnd || '';
    document.getElementById('eventLocation').value = d.location || '';
    document.getElementById('eventImage').value = d.image || '';
    document.getElementById('eventType').value = d.type || '';
    document.getElementById('eventTags').value = d.tags ? d.tags.join(', ') : '';
    document.getElementById('eventFeatured').checked = !!d.featured;
    document.getElementById('editEventForm').dataset.sha = d.sha || '';
    document.getElementById('editEventForm').dataset.name = name;
    showUpload();
    document.getElementById('editEventForm').classList.remove('hidden');
  } catch (e) { toast('Error: ' + e.message); }
}

function newEvent() {
  ['eventTitle','eventBody','eventSlug','eventDate','eventTimeStart','eventTimeEnd','eventLocation','eventImage','eventType','eventTags'].forEach(id => document.getElementById(id).value = '');
  document.getElementById('eventFeatured').checked = false;
  delete document.getElementById('editEventForm').dataset.sha;
  delete document.getElementById('editEventForm').dataset.name;
  showUpload();
  document.getElementById('editEventForm').classList.remove('hidden');
}

async function saveEvent() {
  const title = document.getElementById('eventTitle').value.trim();
  const body = document.getElementById('eventBody').value;
  const slug = document.getElementById('eventSlug').value.trim();
  const date = document.getElementById('eventDate').value;
  if (!title || !slug || !date) { toast('Judul, slug, dan tanggal harus diisi'); return; }
  if (!/^[a-z0-9-]+$/.test(slug)) { toast('Slug: huruf kecil dan tanda hubung saja'); return; }
  const timeStart = document.getElementById('eventTimeStart').value.trim();
  const timeEnd = document.getElementById('eventTimeEnd').value.trim();
  const location = document.getElementById('eventLocation').value.trim();
  const image = document.getElementById('eventImage').value.trim();
  const type = document.getElementById('eventType').value;
  const tagsRaw = document.getElementById('eventTags').value.trim();
  const tags = tagsRaw ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean) : [];
  const featured = document.getElementById('eventFeatured').checked;
  const sha = document.getElementById('editEventForm').dataset.sha || '';
  const btn = document.getElementById('saveEventBtn');
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  try {
    const r = await authFetch(API + '/events', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug, title, body, date, timeStart, timeEnd, location, image, type, tags, featured, sha}) });
    const d = await r.json();
    if (d.ok) { toast('Tersimpan!'); cancelEdit(); loadEvents(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
  btn.disabled = false; btn.textContent = 'Simpan';
}

async function deleteEvent(name) {
  if (!confirm('Hapus ' + name + '?')) return;
  try {
    const r = await authFetch(API + '/events?file=' + encodeURIComponent(name), { method:'DELETE' });
    const d = await r.json();
    if (d.ok) { toast('Terhapus!'); loadEvents(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
}
