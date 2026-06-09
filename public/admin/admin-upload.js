function showUpload() { document.getElementById('uploadBlock').classList.remove('hidden'); }
function hideUpload() { document.getElementById('uploadBlock').classList.add('hidden'); document.getElementById('uploadResult').style.display = 'none'; }

function cancelEdit() {
  document.getElementById('editPostForm').classList.add('hidden');
  document.getElementById('editEventForm').classList.add('hidden');
  document.getElementById('editGaleriForm').classList.add('hidden');
  document.getElementById('editPeopleForm').classList.add('hidden');
  document.getElementById('editQuotesForm').classList.add('hidden');
  document.getElementById('editDokumenForm').classList.add('hidden');
  hideUpload();
}

async function handleUpload() {
  const input = document.getElementById('uploadInput');
  const file = input.files?.[0];
  if (!file) { toast('Pilih file dulu'); return; }
  const isDokumen = currentTab === 'dokumen';
  if (isDokumen && file.size > 15 * 1024 * 1024) { toast('Maks 15MB'); return; }
  if (!isDokumen && file.size > 5 * 1024 * 1024) { toast('Maks 5MB'); return; }
  const btn = document.getElementById('uploadBtn');
  btn.disabled = true; btn.textContent = 'Upload...';
  try {
    const fd = new FormData();
    fd.append('file', file);
    if (currentTab === 'galeri' || currentTab === 'dokumen') fd.append('folder', currentTab);
    const r = await authFetch(API + '/upload', { method:'POST', body:fd });
    const d = await r.json();
    if (d.ok) { document.getElementById('uploadUrl').value = d.url; document.getElementById('uploadResult').style.display = 'block'; toast('Upload berhasil!'); }
    else { toast('Gagal: ' + (d.error || 'unknown')); }
  } catch (e) { toast('Error: ' + e.message); }
  btn.disabled = false; btn.textContent = 'Upload';
}

function copyUploadUrl() {
  const input = document.getElementById('uploadUrl');
  input.select();
  navigator.clipboard?.writeText(input.value);
  toast('URL disalin!');
}

function setUploadField() {
  const url = document.getElementById('uploadUrl').value;
  if (!url) return;
  const targets = {
    post: 'postImage', event: 'eventImage', galeri: 'galeriImage',
    people: 'peoplePhoto', quotes: 'quotesPhoto', dokumen: 'dokumenFile'
  };
  const id = targets[currentTab];
  if (id) { document.getElementById(id).value = url; toast('Diset!'); }
}

function insertUploadUrl() {
  const url = document.getElementById('uploadUrl').value;
  const bodyIds = { post: 'postBody', event: 'eventBody' };
  const taId = bodyIds[currentTab];
  if (!taId || !url) return;
  const ta = document.getElementById(taId);
  const start = ta.selectionStart || ta.value.length;
  ta.value = ta.value.slice(0, start) + `\n![gambar](${url})\n` + ta.value.slice(ta.selectionEnd || start);
  toast('Disisipkan ke editor!');
}
