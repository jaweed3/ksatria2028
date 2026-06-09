let currentTab = 'post';
const API = '/api/admin';

function getCookie(name) {
  const m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
  return m ? decodeURIComponent(m[1]) : '';
}
function hasToken() { return !!getCookie('ksatria_token'); }

function switchTab(tab) {
  currentTab = tab;
  const tabs = ['post','event','galeri','quotes','people','dokumen'];
  tabs.forEach(t => {
    document.getElementById('tab' + t.charAt(0).toUpperCase() + t.slice(1)).classList.toggle('active', t === tab);
    document.getElementById(t + 'Section').classList.toggle('hidden', t !== tab);
  });
  const labels = { post:'Kelola Artikel Blog', event:'Kelola Acara', galeri:'Kelola Galeri', quotes:'Kelola Kutipan', people:'Kelola Tokoh & Panitia', dokumen:'Kelola Dokumen' };
  const btns   = { post:'+ Artikel Baru',   event:'+ Acara Baru',   galeri:'+ Foto Baru',  quotes:'+ Kutipan Baru',  people:'+ Tokoh Baru',  dokumen:'+ Dokumen Baru' };
  document.getElementById('adminSub').textContent = labels[tab] || '';
  document.getElementById('newBtn').textContent = btns[tab] || '+ Baru';
  cancelEdit();
  const loaders = { post:loadPosts, event:loadEvents, galeri:loadGaleri, quotes:loadQuotes, people:loadPeople, dokumen:loadDokumen };
  if (loaders[tab]) loaders[tab]();
}

function handleNew() {
  const creators = { post:newPost, event:newEvent, galeri:newGaleri, quotes:newQuotes, people:newPeople, dokumen:newDokumen };
  if (creators[currentTab]) creators[currentTab]();
}

function handleRefresh() {
  const loaders = { post:loadPosts, event:loadEvents, galeri:loadGaleri, quotes:loadQuotes, people:loadPeople, dokumen:loadDokumen };
  if (loaders[currentTab]) loaders[currentTab]();
}

async function login() {
  const pw = document.getElementById('pwInput').value;
  const btn = document.getElementById('loginBtn');
  btn.disabled = true; btn.textContent = 'Memeriksa...';
  document.getElementById('pwErr').style.display = 'none';
  try {
    const r = await fetch(API + '/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({password:pw}), credentials:'same-origin' });
    const d = await r.json();
    if (d.ok) {
      document.getElementById('pwPage').classList.add('hidden');
      document.getElementById('adminPage').classList.remove('hidden');
      document.getElementById('statusBadge').textContent = 'Terautentikasi';
      document.getElementById('statusBadge').className = 'status ok';
      switchTab('post');
    } else { document.getElementById('pwErr').style.display = 'block'; }
  } catch { document.getElementById('pwErr').textContent = 'Gagal menghubungi server'; document.getElementById('pwErr').style.display = 'block'; }
  btn.disabled = false; btn.textContent = 'Masuk';
}

async function checkSession() {
  try { const r = await fetch(API + '/verify', {credentials:'same-origin'}); const d = await r.json(); if (d.ok) { switchTab('post'); return true; } } catch {}
  return false;
}

function logout() {
  fetch(API + '/logout', {method:'POST', credentials:'same-origin'}).catch(()=>{});
  document.getElementById('adminPage').classList.add('hidden');
  document.getElementById('pwPage').classList.remove('hidden');
  document.getElementById('pwInput').value = '';
  document.getElementById('pwErr').style.display = 'none';
  document.getElementById('statusBadge').textContent = 'Belum terautentikasi';
  document.getElementById('statusBadge').className = 'status';
}

async function authFetch(url, opts = {}) {
  if (!opts.credentials) opts.credentials = 'same-origin';
  const r = await fetch(url, opts);
  if (r.status === 401) {
    if (document.getElementById('adminPage').classList.contains('hidden') === false) { alert('Sesi habis. Silakan login ulang.'); logout(); }
    throw new Error('Sesi habis');
  }
  return r;
}

function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

let toastTimer;
function toast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  document.body.appendChild(t);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.remove(), 2500);
}

document.getElementById('pwInput').addEventListener('keydown', e => { if (e.key === 'Enter') login(); });
document.getElementById('loginBtn').addEventListener('click', login);

(function() {
  if (hasToken()) {
    document.getElementById('pwPage').classList.add('hidden');
    document.getElementById('adminPage').classList.remove('hidden');
    document.getElementById('statusBadge').textContent = 'Memeriksa sesi...';
    document.getElementById('statusBadge').className = 'status';
    checkSession().then(ok => { if (ok) { document.getElementById('statusBadge').textContent = 'Terautentikasi'; document.getElementById('statusBadge').className = 'status ok'; } else { logout(); } });
  }
})();
