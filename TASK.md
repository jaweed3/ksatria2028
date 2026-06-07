# TASK: Build all KSATRIA 2028 Astro components + assemble index page + deploy

## Context (READ ALL FIRST)
1. `./context.md` — full project brief, content for all 13 sections
2. `./design.md` — color system, typography, component specs
3. `./animation.md` — animation keyframes, timing, hover states
4. `./agents.md` — section-by-section instructions
5. `./src/layouts/Layout.astro` — the layout with all global CSS/JS (already written)

## CRITICAL VISUAL RULES (read carefully — previous version looked jelek)

The OLD version was all dark, flat, no visual depth. Here's what MUST change:

### Color Application (MUST follow this exactly)
The layout already defines all CSS variables. Use them CONSISTENTLY:
- **Hero section**: `background: var(--color-deep-black)`, text in `var(--color-ivory)`, accents in `var(--color-gold)`
- **Tentang, Output, Kepanitiaan sections**: `background: var(--color-ivory)`, text in `var(--color-text-primary)`, headings can use `var(--color-crimson)`
- **Nilai Dasar, Representasi, Registrasi sections**: `background: var(--color-crimson)`, text in `var(--color-text-on-dark)`, cards in `var(--color-ivory)` or `var(--color-paper)`
- **Komisi, Festival, Konser sections**: `background: var(--color-deep-black)`, text in `var(--color-text-on-dark)`, cards in `var(--color-charcoal)`
- **Kegiatan, Rundown sections**: `background: var(--color-ivory-dark)`, text in `var(--color-text-primary)`

### Visual Depth (CRITICAL — this is what was missing)
- **EVERY section needs visual sections with clear background colors** — not all the same
- Cards MUST have: distinct background, subtle border, and on hover: translateY(-4px) + shadow
- Dark sections need: noise texture overlay via CSS `::after` pseudo-element with SVG feTurbulence at 0.04 opacity
- Light sections need: subtle warmth, possible batik cross-hatch pattern at 0.02 opacity
- Hero needs: dramatic background with batik pattern overlay + noise grain
- Section dividers between sections: use clip-path diagonal or double gold line

### Typography Hierarchy
- Hero wordmark: `font-size: clamp(3.5rem, 10vw, 8rem)`, `font-weight: 900`, `letter-spacing` normal
- Section titles: `font-size: clamp(2rem, 4.5vw, 3.5rem)`, `font-weight: 700`
- Card titles: `font-size: 1.25rem`, `font-weight: 700`
- Body: `font-size: 1.0625rem`, `line-height: 1.7`
- Labels/badges: `font-family: var(--font-mono)`, `font-size: 0.7rem`, `letter-spacing: 0.15em`, uppercase

### Specific Components with Visual Details

#### Navbar
- Fixed, transparent initially → dark glass on scroll
- Logo: "KSATRIA 2028" in mono, gold
- Nav links: mono, 0.7rem, uppercase, ivory, gold underline on hover
- CTA: "DAFTAR SEKARANG" in crimson pill

#### Hero
- 100vh, centered content
- Background: deep-black with batik cross-hatch pattern (CSS repeating-linear-gradient at 45deg/-45deg, gold at 0.04 opacity)
- Noise grain overlay via ::after with SVG feTurbulence
- Sequence: label → wordmark → subtitle → divider → tagline → countdown → buttons
- Gold shimmer effect on the wordmark (gradient text animation)
- Countdown: 4 glass cards with numbers in crimson/gold, labels underneath
- Two buttons: primary (crimson fill) + secondary (gold border ghost)
- Scroll indicator: animated chevron at bottom

#### Section Headers (every section)
- Label: mono, xs, gold or crimson, uppercase, letter-spacing 0.2em
- Title: display font, 700 weight
- Divider: 60px gold or crimson line
- Lead paragraph: centered, max 640px

#### Nilai Dasar Cards (8 cards)
- Background: crimson section, ivory/paper cards
- Each card: number in large mono (e.g. "01"), fading into background
- Title: display font, crimson
- Description: body text, muted
- On hover: lift + gold border glow

#### Komisi Cards (7 cards)
- Background: deep-black section, charcoal cards
- Crimson top border (3px)
- Mono label "KOMISI 01" in gold
- Output tags at bottom in muted text
- On hover: crimson glow shadow

#### Timeline (Kegiatan)
- Vertical center line in crimson
- Alternating left/right on desktop, all-left on mobile
- Circle nodes in crimson with gold border
- Cards with left crimson border accent
- Time labels in mono, gold

#### Registration Form
- Background: crimson section
- White/ivory form card, centered, max 560px
- Fields: clean, proper labels, crimson focus states
- Submit: gold button, full width, uppercase mono
- On submit: show "Terima kasih" message via JS (no backend needed)

## What to Build

### Step 1: Components
Create each section as an Astro component in `./src/components/`:
1. `Hero.astro` — hero section with countdown timer (client-side JS island)
2. `Navbar.astro` — navigation bar
3. `Tentang.astro` — about section
4. `NilaiDasar.astro` — 8 nilai cards
5. `Kegiatan.astro` — 3-day timeline
6. `Komisi.astro` — 7 komisi cards
7. `Output.astro` — 6 output documents
8. `Representasi.astro` — miniatur Indonesia
9. `Festival.astro` — festival section
10. `Konser.astro` — concert lineup
11. `Kepanitiaan.astro` — organizing committee (hierarchy)
12. `Rundown.astro` — day-of rundown timeline
13. `Registrasi.astro` — registration form (client-side JS for form submit)
14. `Footer.astro` — footer

### Step 2: Main Page
Create `./src/pages/index.astro`:
```astro
---
import Layout from '../layouts/Layout.astro';
import Navbar from '../components/Navbar.astro';
import Hero from '../components/Hero.astro';
// ... import all sections
---
<Layout>
  <Navbar />
  <main>
    <Hero />
    <Tentang />
    <NilaiDasar />
    <Kegiatan />
    <Komisi />
    <Output />
    <Representasi />
    <Festival />
    <Konser />
    <Kepanitiaan />
    <Rundown />
    <Registrasi />
    <Footer />
  </main>
</Layout>
```

### Step 3: Build and verify
```bash
cd /Users/wedjaw/project/ksatria
npm run build
```
Fix any build errors. The build MUST pass with zero errors.

### Step 4: Git + GitHub
```bash
cd /Users/wedjaw/project/ksatria
git add -A
git commit -m "KSATRIA 2028 — Astro landing page"
gh repo create ksatria2028 --public --source=. --remote=origin --push
```

### Step 5: Deploy to Vercel
```bash
cd /Users/wedjaw/project/ksatria
vercel --prod
```

### Step 6: Report the live URL

## DO NOT STOP until:
1. `npm run build` passes
2. GitHub repo pushed
3. Vercel deployment live (HTTP 200)
4. Final URL reported

## Blockers
Report immediately with exact errors. Do NOT silently stop.

## Quality Bar
The page must look PRESIDENTIAL and HISTORIC. Not a startup template. Think: cover majalah Tempo meets presidential inauguration visual book. Every section must have clear visual identity with proper background colors, not all dark.
