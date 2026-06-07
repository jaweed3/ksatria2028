# KSATRIA 2028 — Design System

## Design Philosophy

**Aesthetic Direction:** *Kebangsaan Agung* — grand, presidential, timeless Indonesian national identity  
**Mood:** Berat tapi mengangkat. Sejarah bertemu masa depan. Seperti Sumpah Pemuda itu sendiri.  
**Anti-Pattern:** Jangan seperti website startup. Jangan seperti event music biasa. Ini adalah kongres nasional bersejarah.

**One Sentence:** *Seperti cover majalah Tempo tahun 1998 bertemu dengan visual book pelantikan presiden — bold, bertenaga, bersejarah, tapi relevan untuk 2028.*

---

## Color System

```css
:root {
  /* Primary Palette — Merah Kebangsaan */
  --color-crimson:        #8B1A1A;   /* Primary — merah tua proposal */
  --color-crimson-dark:   #5C0F0F;   /* Hover states, dark sections */
  --color-crimson-light:  #B02020;   /* Lighter accent */

  /* Gold — Kejayaan */
  --color-gold:           #C9A84C;   /* Accent utama — emas proposal */
  --color-gold-light:     #E8C96A;   /* Hover gold */
  --color-gold-dark:      #9A7A30;   /* Dark gold */

  /* Neutrals */
  --color-ivory:          #F5F0E8;   /* Background terang utama */
  --color-ivory-dark:     #EDE5D5;   /* Secondary background */
  --color-paper:          #FAF7F2;   /* Card backgrounds */
  --color-deep-black:     #0D0D0D;   /* Hero background, dark sections */
  --color-charcoal:       #1A1A1A;   /* Dark text on dark bg */
  --color-ash:            #2C2C2C;   /* Secondary dark */

  /* Text */
  --color-text-primary:   #1A0A0A;   /* Body text on light bg */
  --color-text-secondary: #4A3030;   /* Secondary text */
  --color-text-muted:     #7A6060;   /* Muted / metadata */
  --color-text-on-dark:   #F5F0E8;   /* Text on dark backgrounds */
  --color-text-gold:      #C9A84C;   /* Gold text */

  /* Functional */
  --color-border:         rgba(139, 26, 26, 0.15);
  --color-border-gold:    rgba(201, 168, 76, 0.3);
  --color-overlay:        rgba(13, 13, 13, 0.85);
  --color-overlay-light:  rgba(13, 13, 13, 0.5);
}
```

**Dark Sections** (Hero, Konser): `--color-deep-black` background + `--color-text-on-dark`  
**Light Sections** (Tentang, Komisi, Footer): `--color-ivory` background + `--color-text-primary`  
**Accent Sections** (Nilai Dasar, Output): `--color-crimson` background + `--color-text-on-dark`

---

## Typography System

```css
/* Import di <head> */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');

:root {
  /* Display / Hero */
  --font-display:   'Playfair Display', 'Times New Roman', serif;
  
  /* Body / Reading */
  --font-body:      'Crimson Pro', 'Georgia', serif;
  
  /* Mono / Label / Accent */
  --font-mono:      'Space Mono', 'Courier New', monospace;
}
```

**Font Usage Rules:**
- `--font-display`: Semua judul besar (H1, H2), nama event, tagline besar, quote blockquote
- `--font-body`: Body text, deskripsi, paragraph, section intro
- `--font-mono`: Label / badge / tag (misal: "KOMISI 01"), countdown numbers, metadata kecil, tanggal

**Scale (Mobile-first, clamp untuk fluid):**
```css
--text-xs:    0.75rem;      /* 12px — label/badge */
--text-sm:    0.875rem;     /* 14px — caption, metadata */
--text-base:  1rem;         /* 16px — body */
--text-md:    1.125rem;     /* 18px — lead text */
--text-lg:    1.25rem;      /* 20px — sub-heading */
--text-xl:    1.5rem;       /* 24px — H3 */
--text-2xl:   2rem;         /* 32px — H2 kecil */
--text-3xl:   clamp(2rem, 4vw, 3rem);     /* H2 besar */
--text-4xl:   clamp(2.5rem, 5vw, 4rem);   /* H1 section */
--text-5xl:   clamp(3rem, 7vw, 6rem);     /* Hero tagline */
--text-hero:  clamp(3.5rem, 10vw, 9rem);  /* KSATRIA 2028 wordmark */
```

---

## Spacing System

```css
:root {
  --space-1:   0.25rem;   /* 4px */
  --space-2:   0.5rem;    /* 8px */
  --space-3:   0.75rem;   /* 12px */
  --space-4:   1rem;      /* 16px */
  --space-6:   1.5rem;    /* 24px */
  --space-8:   2rem;      /* 32px */
  --space-12:  3rem;      /* 48px */
  --space-16:  4rem;      /* 64px */
  --space-24:  6rem;      /* 96px */
  --space-32:  8rem;      /* 128px */

  --section-padding-y: clamp(4rem, 8vw, 8rem);
  --section-padding-x: clamp(1.5rem, 5vw, 4rem);
  --container-max:     1280px;
  --container-narrow:  840px;
}
```

---

## Layout System

```css
/* Container utama */
.container {
  max-width: var(--container-max);
  margin: 0 auto;
  padding: 0 var(--section-padding-x);
}

.container--narrow {
  max-width: var(--container-narrow);
  margin: 0 auto;
  padding: 0 var(--section-padding-x);
}

/* Section wrapper */
.section {
  padding: var(--section-padding-y) 0;
}
```

**Grid Patterns:**
- Nilai Dasar: 4 kolom desktop, 2 tablet, 1 mobile
- Komisi: 3 kolom desktop, 2 tablet, 1 mobile  
- Timeline: single column dengan garis vertikal di tengah (alternating left/right desktop, all-left mobile)
- Output: 2 kolom desktop, 1 mobile

---

## Component Specifications

### Navbar
```
Position: fixed top
Height: 70px
Background: transparent → rgba(13,13,13,0.95) on scroll (glassmorphism)
Backdrop-filter: blur(12px)
Border-bottom: 1px solid rgba(201,168,76,0.2) on scroll
Logo: "KSATRIA 2028" in --font-mono, gold color
Nav links: Bahasa Indonesia, uppercase, letter-spacing: 0.1em, --font-mono, size: 0.75rem
CTA button: "Daftar Sekarang" — crimson background, ivory text
Mobile: hamburger menu, full-screen overlay nav
```

### Hero Section
```
Height: 100vh minimum
Background: --color-deep-black
Texture: subtle noise grain overlay (via CSS filter atau SVG feTurbulence)
Background pattern: batik-inspired geometric pattern di opacity 0.05–0.08 (CSS-generated)
Layout: centered, vertically middle-aligned

Content stack (top to bottom):
1. Kecil label: "28 OKTOBER 2028 · GEDUNG MPR RI & GBK · JAKARTA"
   Style: --font-mono, --text-xs, gold color, letter-spacing 0.2em, uppercase
2. Wordmark besar: "KSATRIA 2028"
   Style: --font-display, --text-hero, ivory, font-weight 900
3. Sub-title: "KONGRES SATU ABAD SUMPAH PEMUDA REPUBLIK INDONESIA"
   Style: --font-mono, --text-sm, gold, letter-spacing 0.15em, uppercase
4. Divider: thin gold horizontal line, 80px wide
5. Tagline: "1928: Melahirkan Indonesia"
             "2028: Menentukan Indonesia"
   Style: --font-display, italic, --text-3xl, ivory, line-height 1.2
6. Countdown timer (see Countdown spec below)
7. CTA buttons: 2 buttons side by side
   - Primary: "Daftarkan Delegasi" — crimson fill, ivory text, --font-mono
   - Secondary: "Pelajari Lebih Lanjut" — transparent, gold border, gold text
   
Scroll indicator: animated chevron down, gold color, bottom center
```

### Countdown Timer
```
4 units: HARI · JAM · MENIT · DETIK
Target date: October 28, 2028 19:00:00 WIB (UTC+7)

Visual: 
- Each unit: large number in --font-mono, --text-5xl, crimson or gold
- Label below: --font-mono, --text-xs, muted gold, uppercase, letter-spacing 0.2em
- Separator: ":" in gold
- Container: glass card, border: 1px solid rgba(201,168,76,0.2), backdrop-filter: blur

Layout: 4 blocks in a row, gap between them
```

### Section Header Pattern
```
Untuk setiap section, gunakan pola konsisten:
1. Label kecil: --font-mono, --text-xs, gold/crimson, uppercase, letter-spacing 0.2em
   Example: "— TENTANG KSATRIA 2028 —"
2. Heading: --font-display, --text-4xl, color sesuai background
3. Divider: thin line, 60px, gold atau crimson
4. Lead paragraph: --font-body, --text-md, max-width 640px, centered or left

Alignment: centered untuk sections yang lebar, left untuk sections dengan sidebar
```

### Cards — Nilai Dasar
```
Background: crimson section → ivory cards
OR ivory section → dark cards with crimson accent

Each card:
- Nomor: --font-mono, very large (4xl), semi-transparent crimson/gold, positioned absolute
- Icon: symbolic unicode atau inline SVG (30px)
- Judul: --font-display, --text-xl
- Divider: 40px gold line
- Deskripsi: --font-body, --text-base, 2-3 baris

Hover: translateY(-8px), gold border, subtle shadow glow
```

### Cards — Komisi Strategis
```
Style: dark card (--color-charcoal bg) dengan crimson top border (4px)
Header: komisi number di --font-mono (e.g. "KOMISI 01"), small, gold
Title: --font-display, --text-xl, ivory
Body: --font-body, --text-sm, muted (rgba(245,240,232,0.7))
Footer: tag-style items untuk isu yang dibahas
Hover: crimson glow border, scale 1.02
```

### Timeline — Rangkaian Acara
```
Style: vertical timeline dengan garis vertikal merah di tengah
Desktop: alternating left-right
Mobile: all on right side of line

Node: circle di garis, fill crimson, border gold
Hari label: --font-mono, large, crimson
Waktu: --font-mono, small, gold
Event name: --font-display
Deskripsi: --font-body, --text-sm
Card: background ivory-dark, border-left 3px crimson
```

### Buttons
```css
/* Primary */
.btn-primary {
  background: var(--color-crimson);
  color: var(--color-ivory);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.875rem 2rem;
  border: 2px solid var(--color-crimson);
  transition: all 0.3s ease;
}
.btn-primary:hover {
  background: var(--color-crimson-dark);
  border-color: var(--color-gold);
  color: var(--color-gold);
}

/* Secondary / Ghost */
.btn-secondary {
  background: transparent;
  color: var(--color-gold);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 0.875rem 2rem;
  border: 2px solid var(--color-gold);
  transition: all 0.3s ease;
}
.btn-secondary:hover {
  background: var(--color-gold);
  color: var(--color-deep-black);
}
```

### Blockquote / Quote Besar
```
Untuk tagline / quote utama:
- Font: --font-display, italic, --text-4xl atau lebih besar
- Color: ivory on dark bg, crimson on light bg
- Quotation marks: decorative, gold, size 5–6rem, font-display
- Max-width: 800px, centered
- Border: none (gunakan decorative marks saja)
- Margin: generous vertical space (--space-16 minimum)
```

### Section Dividers
```
Antara sections, gunakan salah satu dari:
1. Diagonal clip-path: clip-path: polygon(0 0, 100% 0, 100% 85%, 0 100%)
2. Wave SVG separator (inline, sesuaikan warna)
3. Double horizontal line dengan diamond di tengah (CSS-generated)

Hindari: simple <hr> polos
```

---

## Visual Motifs (Indonesian Identity)

### Pattern Batik (CSS-Generated)
```css
/* Background subtle pattern — gunakan di Hero dan section dark */
.pattern-batik {
  background-image: 
    repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      rgba(201, 168, 76, 0.03) 10px,
      rgba(201, 168, 76, 0.03) 11px
    ),
    repeating-linear-gradient(
      -45deg,
      transparent,
      transparent 10px,
      rgba(201, 168, 76, 0.03) 10px,
      rgba(201, 168, 76, 0.03) 11px
    );
}
```

### Garis Merah-Putih Dekoratif
```css
/* Aksen dekoratif — bisa dipakai di header section atau card borders */
.accent-stripe {
  background: linear-gradient(
    to right,
    var(--color-crimson) 50%,
    #FFFFFF 50%
  );
  height: 4px;
  width: 60px;
}
```

### Noise Grain Overlay (Texture)
```css
/* Untuk hero / dark sections — tambahkan ::after pseudo-element */
.section-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  mix-blend-mode: overlay;
  z-index: 1;
}
```

---

## Responsive Breakpoints

```css
/* Mobile first */
/* Default: 0–767px (mobile) */

@media (min-width: 768px) {
  /* Tablet */
}

@media (min-width: 1024px) {
  /* Desktop */
}

@media (min-width: 1280px) {
  /* Wide desktop */
}
```

**Critical Responsive Rules:**
- Hero: full screen pada semua device, countdown compact di mobile (2×2 grid)
- Navbar: hamburger di mobile, full links di desktop
- Cards: 1 kolom mobile, 2 tablet, 3-4 desktop
- Timeline: single-column mobile, alternating desktop
- Font hero "KSATRIA 2028": gunakan clamp() agar tidak overflow

---

## Section Color Scheme Map

| Section | Background | Text | Accent |
|---|---|---|---|
| Navbar | Transparent → Dark | Ivory | Gold |
| Hero | Deep Black | Ivory | Gold |
| Tentang | Ivory | Text Primary | Crimson |
| Nilai Dasar | Crimson | Ivory | Gold |
| Kegiatan Timeline | Ivory Dark | Text Primary | Crimson + Gold |
| Komisi | Deep Black | Ivory | Gold + Crimson |
| Output | Ivory | Text Primary | Crimson |
| Representasi | Crimson | Ivory | Gold |
| Festival | Deep Black | Ivory | Gold |
| Konser | Deep Black | Ivory | Gold |
| Kepanitiaan | Ivory | Text Primary | Crimson |
| Rundown | Ivory Dark | Text Primary | Gold |
| Registrasi / CTA | Crimson | Ivory | Gold |
| Footer | Deep Black | Ivory | Gold |

---

## Accessibility Requirements

- Color contrast ratio minimum 4.5:1 untuk body text, 3:1 untuk large text
- Focus indicators visible (tidak dihapus dengan `outline: none` tanpa pengganti)
- Heading hierarchy: H1 (hero) → H2 (section titles) → H3 (cards) → H4 (details)
- Alt text untuk semua gambar (walau gambar CSS-generated, pastikan aria-hidden)
- Animasi: tambahkan `@media (prefers-reduced-motion: reduce)` override
- Landmark elements: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`

---

## Don'ts — Design Anti-Patterns

- ❌ Jangan gunakan purple, blue, atau teal — tidak sesuai identitas kebangsaan
- ❌ Jangan gunakan card dengan border-radius lebih dari 8px — terlalu "startup-ish"
- ❌ Jangan gunakan font Inter, Roboto, Poppins, atau Nunito
- ❌ Jangan gunakan gradient yang terlalu colorful (rainbow, holographic)
- ❌ Jangan gunakan ilustrasi flat vector gaya startup
- ❌ Jangan semua section berwarna putih polos — variasikan gelap/terang
- ❌ Jangan gunakan emoji di konten utama
- ❌ Jangan buat layout yang terlalu simetris/boring — berikan variasi
