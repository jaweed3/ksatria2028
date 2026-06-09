async function loadQuotes() {
  const list = document.getElementById('quotesList');
  list.innerHTML = '<div class="loading">Memuat kutipan...</div>';
  document.getElementById('editQuotesForm').classList.add('hidden');
  try {
    const r = await authFetch(API + '/quotes');
    const d = await r.json();
    if (!d.ok) { list.innerHTML = '<div class="post-item">Gagal memuat</div>'; return; }
    if (!d.items?.length) { list.innerHTML = '<div class="post-item">Belum ada kutipan.</div>'; return; }
    list.innerHTML = '';
    d.items.forEach(p => {
      const item = document.createElement('div');
      item.className = 'post-item';
      item.innerHTML = '<div><div class="title">' + esc(p.title) + '</div><div class="meta">' + esc(p.role || '') + ' · ' + esc(p.name) + '</div></div><div class="actions"><button class="btn btn-s btn-o" onclick="editQuotes(\'' + esc(p.name) + '\')">Edit</button><button class="btn btn-s btn-d" onclick="deleteQuotes(\'' + esc(p.name) + '\')">Hapus</button></div>';
      list.appendChild(item);
    });
  } catch (e) { list.innerHTML = '<div class="post-item">Error: ' + esc(e.message) + '</div>'; }
}

async function editQuotes(name) {
  try {
    const r = await authFetch(API + '/quotes?file=' + encodeURIComponent(name));
    const d = await r.json();
    if (!d.ok) { toast('Gagal memuat'); return; }
    document.getElementById('quotesName').value = d.title || '';
    document.getElementById('quotesSlug').value = name.replace('.md', '');
    document.getElementById('quotesQuote').value = d.quote || '';
    document.getElementById('quotesRole').value = d.role || '';
    document.getElementById('quotesPhoto').value = d.photo || '';
    document.getElementById('quotesOrder').value = d.order || '';
    document.getElementById('editQuotesForm').dataset.sha = d.sha || '';
    document.getElementById('editQuotesForm').dataset.name = name;
    showUpload();
    document.getElementById('editQuotesForm').classList.remove('hidden');
  } catch (e) { toast('Error: ' + e.message); }
}

function newQuotes() {
  ['quotesName','quotesSlug','quotesQuote','quotesRole','quotesPhoto','quotesOrder'].forEach(id => document.getElementById(id).value = '');
  delete document.getElementById('editQuotesForm').dataset.sha;
  delete document.getElementById('editQuotesForm').dataset.name;
  showUpload();
  document.getElementById('editQuotesForm').classList.remove('hidden');
}

async function saveQuotes() {
  const name = document.getElementById('quotesName').value.trim();
  const slug = document.getElementById('quotesSlug').value.trim();
  const quote = document.getElementById('quotesQuote').value.trim();
  const role = document.getElementById('quotesRole').value.trim();
  const photo = document.getElementById('quotesPhoto').value.trim();
  const order = parseInt(document.getElementById('quotesOrder').value) || 0;
  if (!name || !slug || !quote) { toast('Nama, slug, dan kutipan harus diisi'); return; }
  if (!/^[a-z0-9-]+$/.test(slug)) { toast('Slug: huruf kecil dan tanda hubung saja'); return; }
  const sha = document.getElementById('editQuotesForm').dataset.sha || '';
  const btn = document.getElementById('saveQuotesBtn');
  btn.disabled = true; btn.textContent = 'Menyimpan...';
  try {
    const r = await authFetch(API + '/quotes', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({slug, name, quote, role, photo, order, sha}) });
    const d = await r.json();
    if (d.ok) { toast('Tersimpan!'); cancelEdit(); loadQuotes(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
  btn.disabled = false; btn.textContent = 'Simpan';
}

async function deleteQuotes(name) {
  if (!confirm('Hapus ' + name + '?')) return;
  try {
    const r = await authFetch(API + '/quotes?file=' + encodeURIComponent(name), { method:'DELETE' });
    const d = await r.json();
    if (d.ok) { toast('Terhapus!'); loadQuotes(); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
}
