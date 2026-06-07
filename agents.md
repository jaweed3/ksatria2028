# KSATRIA 2028 — Agent Execution Guide

## Agent Identity & Mission

Kamu adalah seorang **Senior Frontend Developer + UI/UX Designer** yang berspesialisasi dalam website kebangsaan, political campaigns, dan national-scale events. Kamu bekerja untuk Panitia Nasional KSATRIA 2028.

**Misimu:** Buat `index.html` — satu file lengkap, production-ready, zero-dependency static landing page untuk KSATRIA 2028 yang layak menjadi wajah digital dari kongres bersejarah ini.

**Standar Kualitas:** Jika dilihat oleh Ketua Panitia Nasional dan Dewan Pelindung, mereka harus bangga dan langsung approve.

---

## Pre-Execution Checklist

Sebelum mulai menulis kode, baca dan konfirmasi:

- [ ] `context.md` — sudah dibaca lengkap, memahami semua 13 section
- [ ] `design.md` — sudah dibaca lengkap, akan implementasikan design system
- [ ] `animation.md` — sudah dibaca lengkap, akan implementasikan animation system
- [ ] `agents.md` (ini) — sudah dibaca lengkap

Jika ada yang belum dibaca, baca dulu sebelum menulis satu baris kode pun.

---

## Output Specification

```
File output: index.html
Location: output/index.html (atau di mana agent menyimpan output)
Size estimate: ~1500–3000 baris HTML (single file dengan inline CSS + JS)
```

**File Structure:**
```html
<!DOCTYPE html>
<html lang="id">
<head>
  <!-- Meta tags (SEO, OG, viewport) -->
  <!-- Google Fonts import -->
  <!-- Inline <style> — SEMUA CSS di sini -->
</head>
<body>
  <!-- Scroll progress bar -->
  <!-- Navbar -->
  <header>...</header>
  
  <main>
    <!-- Section 1: Hero -->
    <!-- Section 2: Tentang -->
    <!-- Section 3: Nilai Dasar -->
    <!-- Section 4: Rangkaian Kegiatan -->
    <!-- Section 5: Komisi Strategis -->
    <!-- Section 6: Output Kongres -->
    <!-- Section 7: Representasi Nasional -->
    <!-- Section 8: Festival Peradaban -->
    <!-- Section 9: Konser Kebangsaan -->
    <!-- Section 10: Kepanitiaan -->
    <!-- Section 11: Rundown Hari Puncak -->
    <!-- Section 12: Registrasi / CTA -->
  </main>
  
  <footer>...</footer>
  
  <!-- Inline <script> — SEMUA JS di sini -->
  <!-- - Intersection Observer -->
  <!-- - Countdown Timer -->
  <!-- - Navbar scroll effect -->
  <!-- - Scroll progress -->
  <!-- - Parallax (optional) -->
  <!-- - Mobile nav toggle -->
</body>
</html>
```

---

## Section-by-Section Build Instructions

### SECTION 1: META & HEAD

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>KSATRIA 2028 — Kongres Satu Abad Sumpah Pemuda Republik Indonesia</title>
  <meta name="description" content="KSATRIA 2028 adalah forum nasional pemuda Indonesia memperingati 100 tahun Sumpah Pemuda. 28 Oktober 2028, Gedung MPR RI & GBK Jakarta. 1928: Melahirkan Indonesia — 2028: Menentukan Indonesia.">
  <meta name="keywords" content="KSATRIA 2028, Sumpah Pemuda, Kongres Pemuda, Deklarasi Pemuda Indonesia, Indonesia Emas 2045">
  <meta name="author" content="Panitia Nasional KSATRIA 2028">
  
  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="KSATRIA 2028 — Kongres Satu Abad Sumpah Pemuda Republik Indonesia">
  <meta property="og:description" content="1928: Melahirkan Indonesia — 2028: Menentukan Indonesia. 28 Oktober 2028, Jakarta.">
  <meta property="og:site_name" content="KSATRIA 2028">
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="KSATRIA 2028">
  <meta name="twitter:description" content="Kongres Satu Abad Sumpah Pemuda Republik Indonesia">
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  
  <style>
    /* === SEMUA CSS DI SINI === */
    /* Ikuti design.md dan animation.md untuk implementasi */
  </style>
</head>
```

---

### SECTION 2: NAVBAR

**Requirement:**
- Fixed position
- Logo kiri: "KSATRIA 2028" (text, font-mono, gold)
- Nav links tengah/kanan: Tentang · Kegiatan · Komisi · Festival · Daftar
- Semua links: anchor href ke section ID (smooth scroll)
- CTA button kanan: "Daftar Sekarang" → anchor ke #registrasi
- Mobile: hamburger (☰) → full-screen overlay
- Scroll effect: tambah class `.scrolled` saat scrollY > 80

**HTML IDs yang harus dipakai untuk nav links:**
- `#tentang` - Section Tentang KSATRIA
- `#kegiatan` - Section Rangkaian Kegiatan
- `#komisi` - Section Komisi Strategis
- `#festival` - Section Festival
- `#kepanitiaan` - Section Kepanitiaan
- `#registrasi` - Section Registrasi

---

### SECTION 3: HERO

**Content (exact text yang harus dipakai):**
```
Label atas: "28 OKTOBER 2028  ·  GEDUNG MPR RI & GBK  ·  JAKARTA"

Wordmark: "KSATRIA 2028"

Sub-title: "KONGRES SATU ABAD SUMPAH PEMUDA REPUBLIK INDONESIA"

Tagline line 1: "1928: Melahirkan Indonesia"
Tagline line 2: "2028: Menentukan Indonesia"

[Countdown timer]

Buttons: "Daftarkan Delegasi"  |  "Pelajari Lebih Lanjut"

Scroll indicator: ↓
```

**Technical:**
- Background: `#0D0D0D` dengan subtle repeating pattern (CSS-generated)
- Countdown target: `new Date('2028-10-28T19:00:00+07:00')`
- Countdown units: HARI / JAM / MENIT / DETIK
- All text animations: sesuai hero sequence di animation.md
- Height: `min-height: 100vh`

---

### SECTION 4: TENTANG KSATRIA 2028

**Content:**
- Label: "— TENTANG KSATRIA 2028 —"
- Heading: "Simulasi Masa Depan Indonesia"
- Lead: Penjelasan konsep (2-3 paragraf dari proposal section 2.2)
- Blockquote besar: *"1928: Melahirkan Indonesia — 2028: Menentukan Indonesia"*
- 3 value props (cards kecil horizontal):
  - **Bersatu** — Menghadirkan representasi 38 provinsi dalam satu forum kebangsaan
  - **Beraksi** — Menghasilkan rekomendasi strategis nasional yang konkret dan berdampak
  - **Berdampak** — Melahirkan Deklarasi Pemuda Indonesia 2028 sebagai komitmen kolektif

**Background:** `--color-ivory`

---

### SECTION 5: NILAI DASAR

**Content — 8 Nilai (gunakan semua):**

| No | Nama | Deskripsi singkat |
|---|---|---|
| 01 | Persatuan Nasional | Menjaga keutuhan bangsa di atas perbedaan daerah, budaya, dan identitas |
| 02 | Kebhinekaan | Menghormati dan merayakan keberagaman sebagai kekuatan utama Indonesia |
| 03 | Netralitas Politik | Berdiri di atas kepentingan partai, bebas dari politik praktis |
| 04 | Inklusivitas | Membuka ruang yang setara bagi seluruh elemen pemuda Indonesia |
| 05 | Demokrasi Sehat | Mendorong budaya dialog yang beretika, kritis, dan berkeadaban |
| 06 | Keadilan Sosial | Memperjuangkan pemerataan dan keadilan bagi seluruh rakyat Indonesia |
| 07 | Gotong Royong | Membangun kolaborasi dan solidaritas lintas identitas dan daerah |
| 08 | Nasionalisme | Menjunjung cinta tanah air dan tanggung jawab historis sebagai pemuda |

**Layout:** 4 kolom desktop, 2 tablet, 1 mobile  
**Background:** `--color-crimson` (dark red)  
**Cards:** ivory/paper background dengan crimson+gold accents  
**Animation:** stagger 80ms setiap card

---

### SECTION 6: RANGKAIAN KEGIATAN

**Content — Timeline 3 Hari:**

**HARI PERTAMA — H-2 (Kongres)**
- 08.00 — Registrasi dan Persiapan
- 09.00 — Opening Ceremony dan Pembukaan Nasional
- 10.00–12.00 — Sidang Komisi Nasional (Pembabakan 1)
- 12.00–13.00 — ISHOMA
- 13.00–17.00 — Sidang Komisi Nasional (Pembabakan 2)
- 17.00–20.00 — Istirahat dan Ibadah
- 20.00–22.00 — Sidang Komisi Nasional Malam (Finalisasi)

**HARI KEDUA — H-1 (Komisi & Expo)**
- 10.00–12.00 — Sidang Komisi + Presentasi Paper
- 12.00–13.00 — ISHOMA
- 13.00–17.00 — Penyelesaian Sidang & Penyusunan Hasil
- 17.00 — Penutupan Sidang Komisi & Final Hasil Kongres

**HARI KETIGA — 28 Oktober 2028 (Puncak)**
- 16.00 — Open Gate: Festival UMKM + Pameran Budaya
- 18.00 — Pre-Show: Band Pemuda + Video Mapping
- 19.00 — Opening Ceremony Resmi
- 21.30 — Pembacaan Deklarasi Pemuda Indonesia 2028
- 21.45 — Konser Kebangsaan KSATRIA 2028

**Layout:** Vertical timeline dengan CSS  
**Background:** `--color-ivory-dark`

---

### SECTION 7: KOMISI STRATEGIS NASIONAL

**ID section:** `id="komisi"`

**Content — 7 Komisi:**

```
KOMISI 01 — Politik dan Demokrasi
Fokus: Polarisasi politik, money politics, etika demokrasi, kualitas pemilu, literasi politik digital
Output: Rekomendasi demokrasi sehat, gerakan anti-politik uang, kode etik politik pemuda

KOMISI 02 — Pendidikan dan SDM  
Fokus: Kualitas pendidikan nasional, AI dan masa depan pekerjaan, ketimpangan pendidikan antarwilayah, riset nasional
Output: Roadmap SDM Indonesia 2045, rekomendasi transformasi pendidikan nasional

KOMISI 03 — Ekonomi dan Hilirisasi
Fokus: Lapangan kerja, UMKM, ekonomi kreatif, startup digital, green economy, hilirisasi industri
Output: Rekomendasi ekonomi pemuda nasional, model pembangunan berbasis daerah

KOMISI 04 — Pertahanan dan Ketahanan Nasional
Fokus: Ancaman siber, disinformasi digital, geopolitik global, ketahanan pangan & energi
Output: Strategi ketahanan nasional generasi muda, rekomendasi keamanan digital

KOMISI 05 — Lingkungan dan Iklim
Fokus: Perubahan iklim, pertambangan, deforestasi, transisi energi, energi terbarukan
Output: Deklarasi Pemuda Hijau Indonesia, rekomendasi transisi energi berkeadilan

KOMISI 06 — Persatuan Bangsa
Fokus: Intoleransi, konflik identitas, integrasi Papua, kebinekaan, rekonsiliasi sosial
Output: Piagam Persatuan Pemuda Indonesia, gerakan toleransi nasional

KOMISI 07 — Pemuda dan Masa Depan Indonesia
Fokus: Indonesia Emas 2045, regenerasi kepemimpinan, masa depan demokrasi, visi abad kedua
Output: Manifesto Pemuda Indonesia 2045, arah strategis generasi muda Indonesia
```

**Layout:** 3 kolom desktop (7 cards: 3-2-2 atau 3-3-1), 2 tablet, 1 mobile  
**Background section:** `--color-deep-black`  
**Cards:** dark charcoal dengan crimson top border 4px

---

### SECTION 8: OUTPUT KONGRES

**Content — 6 Dokumen Output:**

```
01 — Deklarasi Pemuda Indonesia 2028
Dokumen moral dan kebangsaan. Komitmen bersama terhadap persatuan nasional, demokrasi sehat, keadilan sosial, dan masa depan Indonesia yang inklusif.

02 — Policy Paper Nasional
Rekomendasi kebijakan dari 7 Komisi Strategis. Kontribusi intelektual generasi muda bagi arah pembangunan Indonesia.

03 — Manifesto Pemuda Indonesia 2045
Visi, nilai, dan arah gerakan generasi muda menuju Indonesia Emas 2045. Landasan moral dan intelektual kepemimpinan muda.

04 — Piagam Persatuan Pemuda Indonesia
Komitmen generasi muda terhadap persatuan, perdamaian, dan kebinekaan Indonesia lintas daerah dan identitas.

05 — Deklarasi Pemuda Hijau Indonesia
Komitmen terhadap keberlanjutan lingkungan dan transisi energi berkeadilan untuk masa depan bumi Indonesia.

06 — Jaringan Nasional Pemuda Indonesia
Platform kolaborasi jangka panjang menghubungkan komunitas, organisasi, kampus, dan gerakan pemuda seluruh Indonesia.
```

**Background:** `--color-ivory`

---

### SECTION 9: REPRESENTASI "MINIATUR INDONESIA"

**Content:**
- Heading: "Miniatur Indonesia dalam Satu Forum"
- Sub: "38 Provinsi · 800–2000 Delegasi Nasional"
- Visual peta Indonesia (SVG sederhana) ATAU grid 38 provinsi
- Kategori delegasi (icon + label):
  - Mahasiswa
  - Santri  
  - Pemuda Adat
  - Aktivis Sosial
  - Pemuda Desa
  - Komunitas Agama
  - Komunitas Budaya
  - Startup Youth
  - Pelaku UMKM Muda
  - Pemuda Papua
  - Diaspora Indonesia
  - Pemuda Disabilitas
  - Komunitas Perempuan

**Background:** `--color-crimson`

---

### SECTION 10: FESTIVAL PERADABAN PEMUDA INDONESIA

**ID section:** `id="festival"`

**Content — 4 Sub-Events:**

```
🏛 Budaya Nusantara
Parade adat, tari daerah, musik tradisional, festival kuliner, pameran budaya dari seluruh provinsi Indonesia.

💡 Inovasi Pemuda  
Startup expo, pameran AI & teknologi digital, riset mahasiswa, inovasi pembangunan desa, UMKM muda.

🗣 Forum Kebangsaan
Debat kebangsaan, pidato pemuda, simulasi parlemen muda, forum lintas agama dan budaya.

🌙 Malam Kebhinekaan Indonesia
Doa lintas agama, pembacaan puisi Indonesia, renungan nasional, Sumpah Pemuda Abad Kedua.
```

**Background:** `--color-deep-black`

---

### SECTION 11: KONSER KEBANGSAAN

**Content:**
- Heading: "Konser Kebangsaan KSATRIA 2028"
- Sub: "28 Oktober 2028 · Gelora Bung Karno · Jakarta"
- Artist cards (5):
  - Reality Club / The Panturas (Opening)
  - Feast
  - Hindia
  - Bernadya / Nadin Amizah
  - Iwan Fals — Legend Performance ⭐
- Closing: Dipha Barus / Weird Genius / DJ Winky / Tenxi
- Note kecil: "Line-up dapat berubah sewaktu-waktu"

**Background:** `--color-deep-black` dengan gold accents  
**Layout:** Artist cards horizontal row atau grid

---

### SECTION 12: KEPANITIAAN

**ID section:** `id="kepanitiaan"`

**Content (hierarchical):**

```
DEWAN PELINDUNG NASIONAL
Prabowo Subianto · Gibran Rakabuming Raka · Hidayat Nur Wahid · Haedar Nashir · Yahya Cholil Staquf
+ Tokoh Nasional Lainnya

DEWAN PENASEHAT NASIONAL  
Prof. Hamid Fahmy Zarkasyi · Husnan Bey Fananie · Dino Patti Djalal · H. Noor Syahid, M.Pd.
Anies Baswedan · Komaruddin Hidayat · Rocky Gerung · Yudi Latif · Rhenald Kasali
+ Tokoh Akademisi, Cendekiawan & Profesional Lainnya

STEERING COMMITTEE
OIC Youth Indonesia

BADAN PENGURUS HARIAN
Ketua Nasional Bidang Strategi & Kebijakan: Kifah
Ketua Nasional Bidang Eksternal & Kemitraan: Roudhoh
Sekretaris Jenderal: Dias
Bendahara Nasional: Noufses
```

**Note:** Tampilkan dengan visual hierarchy yang jelas. Dewan Pelindung paling prominent.  
**Background:** `--color-ivory`

---

### SECTION 13: RUNDOWN HARI PUNCAK

**Content:** Tabel rundown 28 Oktober 2028 dari 16.00 sampai 23.00  
(Gunakan data dari context.md section 11 — Rundown Hari Puncak)

**Visual:** Bukan tabel biasa — gunakan timeline visual yang menarik  
**Background:** `--color-ivory-dark`

---

### SECTION 14: REGISTRASI / CTA

**ID section:** `id="registrasi"`

**Content:**
- Heading besar: "Bergabunglah dalam Sejarah"
- Sub: "Daftarkan diri sebagai delegasi KSATRIA 2028"
- Quote: *"1928: Melahirkan Indonesia — 2028: Menentukan Indonesia"*
- Form fields (HTML form, action="#" method="post" — placeholder only):
  - Nama Lengkap *
  - Asal Provinsi * (dropdown — isi 38 provinsi)
  - Asal Organisasi / Komunitas *
  - Kategori Delegasi * (dropdown)
  - Email *
  - Nomor HP *
  - Pesan / Motivasi (textarea, optional)
- Submit button: "Kirim Pendaftaran"
- Alt: "Atau hubungi kami via WhatsApp" dengan icon + nomor placeholder

**Catatan:** Form tidak perlu actual backend. `action="#"` atau `action="javascript:void(0)"` cukup. Tambahkan JS untuk show "Terima kasih! Kami akan menghubungi Anda segera." setelah submit.

**Background:** `--color-crimson`

---

### SECTION 15: FOOTER

**Content:**
```
[Logo KSATRIA 2028]
Kongres Satu Abad Sumpah Pemuda Republik Indonesia
28 Oktober 2028 · Gedung MPR RI & GBK · Jakarta

Navigasi:
Tentang · Kegiatan · Komisi · Festival · Kepanitiaan · Daftar

Kontak:
Email: info@ksatria2028.id (placeholder)
WhatsApp: +62 xxx xxxx xxxx (placeholder)

Sosial Media:
Instagram · Twitter/X · YouTube · TikTok (semua placeholder #)

[Horizontal divider gold]

"1928: Melahirkan Indonesia — 2028: Menentukan Indonesia"

© 2028 Panitia Nasional KSATRIA 2028
Bersatu · Beraksi · Berdampak

[Kecil]: Website ini dibuat sebagai representasi digital gerakan KSATRIA 2028
```

**Background:** `--color-deep-black`

---

## JavaScript Requirements

Implementasikan semua JS inline di `<script>` sebelum `</body>`:

```javascript
// 1. Intersection Observer (scroll animations)
// 2. Countdown Timer (target: 28 Oct 2028 19:00 WIB)
// 3. Navbar scroll effect (add .scrolled class)
// 4. Scroll progress bar
// 5. Mobile hamburger nav toggle
// 6. Form submit handler (show thank you message)
// 7. Smooth scroll untuk anchor links (jika tidak pakai CSS scroll-behavior)
// 8. Optional: parallax effect
```

---

## Quality Assurance Checklist

Sebelum menyatakan file selesai, cek semua ini:

### Content
- [ ] Semua 13+ sections ada (Hero sampai Footer)
- [ ] Tidak ada "Lorem ipsum" atau placeholder text yang tidak disengaja
- [ ] Semua nama tokoh kepanitiaan sudah benar sesuai context.md
- [ ] Countdown timer terpasang dan berhitung ke 28 Oktober 2028
- [ ] Semua anchor links berfungsi (#tentang, #komisi, dll)
- [ ] 38 provinsi ada di dropdown form
- [ ] 7 komisi strategis semua ada dengan konten yang benar
- [ ] 8 nilai dasar semua ada

### Design
- [ ] Color palette sesuai design.md (merah-emas-ivory-hitam)
- [ ] Font Playfair Display + Crimson Pro + Space Mono terpasang
- [ ] Dark dan light sections bergantian — tidak semua putih
- [ ] Tidak ada purple/blue yang tidak disengaja
- [ ] Tidak ada border-radius > 8px (kecuali buttons, max 4px)
- [ ] Gold accents konsisten digunakan

### Animation
- [ ] Hero entrance animation sequence berjalan saat load
- [ ] Scroll-triggered animations berjalan (Intersection Observer)
- [ ] `prefers-reduced-motion` override ada di CSS
- [ ] Navbar scroll effect berfungsi
- [ ] Countdown detik berubah setiap detik
- [ ] Mobile nav overlay berfungsi

### Responsive
- [ ] Mobile (< 768px): single column, readable
- [ ] Tablet (768–1023px): 2 column where needed
- [ ] Desktop (1024px+): full layout
- [ ] Tidak ada horizontal scroll pada mobile
- [ ] Font sizes tidak overflow pada mobile

### Technical
- [ ] Semua CSS di dalam `<style>` tag di `<head>`
- [ ] Semua JS di dalam `<script>` tag sebelum `</body>`
- [ ] Tidak ada external JS dependencies
- [ ] Google Fonts via CDN (satu-satunya external resource yang boleh)
- [ ] HTML valid: tidak ada unclosed tags
- [ ] IDs unik — tidak ada duplikasi ID
- [ ] `<html lang="id">` sudah ada

---

## Error Handling

### Jika Google Fonts tidak load (rare):
```css
/* Fallback font sudah ada di font-family stack */
--font-display: 'Playfair Display', 'Times New Roman', Georgia, serif;
--font-body:    'Crimson Pro', 'Georgia', Times, serif;
--font-mono:    'Space Mono', 'Courier New', Courier, monospace;
```

### Jika JavaScript tidak jalan:
- CSS `[data-animate]` harus visible tanpa JS (default opacity 0 akan menyembunyikan konten)
- Tambahkan `<noscript>` CSS override:
```html
<noscript>
  <style>
    [data-animate] { opacity: 1 !important; transform: none !important; }
    .scroll-progress { display: none; }
  </style>
</noscript>
```

---

## Deployment Notes

Vercel deployment untuk single HTML file:

1. File `index.html` di root folder project
2. Tidak perlu konfigurasi apapun — Vercel auto-detect
3. Atau tambahkan `vercel.json` minimal:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

4. Custom domain: `ksatria2028.id` (jika tersedia)

---

## Final Note for Agent

Kamu sedang membuat website untuk sebuah momen bersejarah — 100 tahun Sumpah Pemuda Indonesia. Ini bukan website biasa. Setiap line CSS yang kamu tulis, setiap animasi yang kamu implementasikan, harus mencerminkan kebesaran momen tersebut.

Eksekusi dengan **presisi**, **dedikasi**, dan **kebanggaan**.

*Bersatu · Beraksi · Berdampak*

---
*Generated for KSATRIA 2028 Project — Panitia Nasional KSATRIA 2028*
