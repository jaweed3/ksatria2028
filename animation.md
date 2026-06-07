# KSATRIA 2028 — Animation System

## Animation Philosophy

**Prinsip Utama:** *Berat, Bermartabat, Bertenaga*  
Animasi harus terasa seperti sebuah proklamasi — tidak tergesa-gesa, tidak murahan, tapi punya impact yang kuat. Setiap elemen hadir dengan tujuan.

**Hindari:**
- Animasi yang terlalu cepat dan frantic (< 200ms untuk hal penting)
- Bounce yang playful atau springy yang childish
- Terlalu banyak animasi bersamaan yang bikin pusing
- Animasi yang tidak punya makna / hanya dekoratif kosong

**Gunakan:**
- Ease curves yang smooth dan confident
- Staggered reveals yang terasa disengaja
- Kinetic typography yang powerful di hero
- Parallax subtle yang menambah kedalaman

---

## CSS Custom Properties — Timing

```css
:root {
  /* Duration */
  --dur-instant:    80ms;
  --dur-fast:       200ms;
  --dur-normal:     400ms;
  --dur-slow:       700ms;
  --dur-deliberate: 1000ms;
  --dur-grand:      1400ms;
  --dur-epic:       2000ms;

  /* Easing */
  --ease-out:        cubic-bezier(0.0, 0.0, 0.2, 1);
  --ease-in:         cubic-bezier(0.4, 0.0, 1.0, 1);
  --ease-in-out:     cubic-bezier(0.4, 0.0, 0.2, 1);
  --ease-spring:     cubic-bezier(0.34, 1.56, 0.64, 1);   /* Sedikit overshoot */
  --ease-power:      cubic-bezier(0.16, 1, 0.3, 1);        /* Strong deceleration */
  --ease-snap:       cubic-bezier(0.87, 0, 0.13, 1);       /* Sharp snap */

  /* Stagger Delays */
  --stagger-1: 0ms;
  --stagger-2: 80ms;
  --stagger-3: 160ms;
  --stagger-4: 240ms;
  --stagger-5: 320ms;
  --stagger-6: 400ms;
  --stagger-7: 480ms;
  --stagger-8: 560ms;
}
```

---

## Keyframe Definitions

```css
/* === ENTRANCE ANIMATIONS === */

/* Fade Up — elemen dari bawah ke posisi normal */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade Down — dari atas (untuk navbar items) */
@keyframes fadeDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Fade In — simple opacity */
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* Slide In Left */
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Slide In Right */
@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(60px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Scale Up — cards, badges */
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.88);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Reveal Up — teks individual dari clip */
@keyframes revealUp {
  from {
    opacity: 0;
    transform: translateY(100%);
    clip-path: inset(0 0 100% 0);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    clip-path: inset(0 0 0% 0);
  }
}

/* Line Draw — untuk garis dekoratif horizontal */
@keyframes drawLine {
  from { width: 0; opacity: 0; }
  to   { width: 60px; opacity: 1; }
}

/* Draw Line Vertical — untuk timeline node connections */
@keyframes drawLineVertical {
  from { height: 0; opacity: 0; }
  to   { height: 100%; opacity: 1; }
}

/* === HERO SPECIFIC === */

/* Wordmark KSATRIA 2028 — grand entrance */
@keyframes heroWordmark {
  0% {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
    letter-spacing: 0.3em;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    letter-spacing: normal;
  }
}

/* Hero tagline line reveal */
@keyframes taglineReveal {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* === COUNTDOWN === */

/* Flip number animation */
@keyframes countFlip {
  0%   { transform: rotateX(0deg); }
  50%  { transform: rotateX(-90deg); }
  100% { transform: rotateX(0deg); }
}

/* Pulse untuk separator ":" */
@keyframes colonPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}

/* === CONTINUOUS / AMBIENT === */

/* Float — untuk elemen dekoratif */
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-12px); }
}

/* Slow rotate — untuk pattern/ornament background */
@keyframes slowRotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* Shimmer — untuk gold accent elements */
@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

/* Glow pulse — untuk CTA button atau penting element */
@keyframes glowPulse {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(201, 168, 76, 0);
  }
  50% {
    box-shadow: 0 0 20px 4px rgba(201, 168, 76, 0.3);
  }
}

/* Scroll indicator bounce */
@keyframes scrollBounce {
  0%, 100% { transform: translateY(0); opacity: 1; }
  50%       { transform: translateY(8px); opacity: 0.6; }
}

/* === NAVBAR === */

@keyframes navbarSlideDown {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* Mobile nav overlay */
@keyframes navOverlayOpen {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* === CARD HOVER STATES (CSS transitions, bukan keyframes) === */
/* Implementasi via transition property, bukan animation */
```

---

## Scroll-Triggered Animation System

Gunakan **Intersection Observer API** (Vanilla JS, no library needed):

```javascript
// Implementasi di dalam <script> di index.html

const observerOptions = {
  threshold: 0.15,        // Trigger saat 15% elemen visible
  rootMargin: '0px 0px -50px 0px'  // Trigger sedikit sebelum fully visible
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      // Unobserve setelah animated — animasi hanya sekali
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe semua elemen dengan class animate-*
document.querySelectorAll('[data-animate]').forEach(el => {
  observer.observe(el);
});
```

**Data Attributes untuk Animation:**
```html
<!-- Penggunaan pada HTML elements -->
<div data-animate="fade-up">...</div>
<div data-animate="fade-up" data-delay="200">...</div>
<div data-animate="slide-left">...</div>
<div data-animate="slide-right">...</div>
<div data-animate="scale-up">...</div>
<div data-animate="fade-in">...</div>
```

**CSS untuk data-animate states:**
```css
/* Default state — sebelum visible */
[data-animate] {
  opacity: 0;
  transition-property: opacity, transform;
  transition-duration: var(--dur-slow);
  transition-timing-function: var(--ease-power);
}

[data-animate="fade-up"]    { transform: translateY(40px); }
[data-animate="fade-down"]  { transform: translateY(-30px); }
[data-animate="slide-left"] { transform: translateX(-60px); }
[data-animate="slide-right"]{ transform: translateX(60px); }
[data-animate="scale-up"]   { transform: scale(0.88); }
[data-animate="fade-in"]    { transform: none; }

/* Visible state */
[data-animate].is-visible {
  opacity: 1;
  transform: none;
}

/* Delay support via CSS var */
[data-delay="100"] { transition-delay: 100ms; }
[data-delay="200"] { transition-delay: 200ms; }
[data-delay="300"] { transition-delay: 300ms; }
[data-delay="400"] { transition-delay: 400ms; }
[data-delay="500"] { transition-delay: 500ms; }
[data-delay="600"] { transition-delay: 600ms; }
[data-delay="700"] { transition-delay: 700ms; }
[data-delay="800"] { transition-delay: 800ms; }
```

---

## Hero Animation Sequence

Hero adalah yang paling penting. Semua berjalan saat page load, tanpa Intersection Observer.

```
Sequence Timeline:
0ms    → Background gradient/pattern fade in (2000ms, ease-in)
0ms    → Label kecil tanggal/venue (fadeDown, 700ms, delay 300ms)
400ms  → Wordmark "KSATRIA 2028" (heroWordmark, 1000ms, ease-power)
900ms  → Sub-title kongres (fadeUp, 700ms)
1100ms → Divider gold line (drawLine, 600ms)
1300ms → Tagline baris 1 (taglineReveal, 700ms)
1500ms → Tagline baris 2 (taglineReveal, 700ms)
1800ms → Countdown timer (scaleUp, 500ms)
2100ms → Buttons (fadeUp + stagger: btn 1 = 2100ms, btn 2 = 2250ms)
2400ms → Scroll indicator (fadeIn + scrollBounce continuous)
```

**Implementasi:**
```css
.hero-label      { animation: fadeDown var(--dur-slow) var(--ease-power) 300ms both; }
.hero-wordmark   { animation: heroWordmark 1000ms var(--ease-power) 400ms both; }
.hero-subtitle   { animation: fadeUp var(--dur-slow) var(--ease-power) 900ms both; }
.hero-divider    { animation: drawLine 600ms var(--ease-out) 1100ms both; }
.hero-tagline-1  { animation: taglineReveal 700ms var(--ease-power) 1300ms both; }
.hero-tagline-2  { animation: taglineReveal 700ms var(--ease-power) 1500ms both; }
.hero-countdown  { animation: scaleUp 500ms var(--ease-spring) 1800ms both; }
.hero-btn-1      { animation: fadeUp var(--dur-slow) var(--ease-power) 2100ms both; }
.hero-btn-2      { animation: fadeUp var(--dur-slow) var(--ease-power) 2250ms both; }
.scroll-indicator{ animation: fadeIn 500ms ease 2400ms both, scrollBounce 2s ease-in-out 2900ms infinite; }
```

---

## Section-Specific Animations

### Navbar
```css
/* Masuk saat page load */
nav { animation: navbarSlideDown 700ms var(--ease-power) 100ms both; }

/* Scroll effect: JavaScript menambah class .scrolled */
nav.scrolled {
  background: rgba(13, 13, 13, 0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(201, 168, 76, 0.2);
  /* transition smooth */
  transition: all 400ms var(--ease-in-out);
}
```

### Section Headings
```css
/* Semua section heading: stagger label → heading → divider → paragraph */
.section-label  { /* data-animate="fade-up", delay 0 */ }
.section-title  { /* data-animate="fade-up", delay 100 */ }
.section-divider{ /* animation: drawLine 600ms, delay 200 */ }
.section-lead   { /* data-animate="fade-up", delay 300 */ }
```

### Cards — Nilai Dasar (8 Cards)
```
Stagger: 80ms antara setiap card
Animation: scaleUp 500ms ease-spring
Cards group: trigger saat container 15% visible
```

### Cards — Komisi Strategis (7 Cards)
```
Stagger: 100ms antara setiap card
Animation: fadeUp 600ms ease-power
Mobile: stagger tetap, tapi hanya 1 per "group" visible at a time
```

### Timeline Items
```
Setiap item muncul satu per satu saat masuk viewport (masing-masing di-observe)
Node: scaleUp 400ms
Content: slideInLeft atau slideInRight (alternating)
Connector line: drawLineVertical, continuous dari atas ke bawah saat parent visible
```

### Stats / Numbers (jika ada)
```javascript
// Animated number counter
function animateNumber(el, target, duration = 2000) {
  const start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(start + (target - start) * eased).toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(update);
  }
  
  requestAnimationFrame(update);
}
```

### Countdown Timer
```javascript
function updateCountdown() {
  const target = new Date('2028-10-28T19:00:00+07:00').getTime();
  const now = Date.now();
  const diff = target - now;
  
  if (diff <= 0) {
    // Event sudah berlangsung
    document.querySelector('.countdown').innerHTML = '<span class="countdown-over">KSATRIA 2028 Sedang Berlangsung!</span>';
    return;
  }
  
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  // Update DOM dengan padding 0
  document.getElementById('cd-days').textContent    = String(days).padStart(3, '0');
  document.getElementById('cd-hours').textContent   = String(hours).padStart(2, '0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
}

// Update setiap detik
updateCountdown();
setInterval(updateCountdown, 1000);
```

**Detik visual:** Tambahkan class `.changing` saat detik berganti → trigger brief scale/color flash.

---

## Hover Micro-Interactions

```css
/* Navbar links */
nav a {
  position: relative;
}
nav a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--color-gold);
  transition: width var(--dur-normal) var(--ease-out);
}
nav a:hover::after { width: 100%; }

/* Cards */
.card {
  transition: transform var(--dur-normal) var(--ease-spring),
              box-shadow var(--dur-normal) var(--ease-out),
              border-color var(--dur-normal) var(--ease-out);
}
.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(139, 26, 26, 0.2);
  border-color: var(--color-gold);
}

/* Buttons */
.btn-primary {
  transition: all var(--dur-normal) var(--ease-out);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 30px rgba(139, 26, 26, 0.4);
}

/* Gold accent divider lines */
.divider-gold {
  transition: width var(--dur-slow) var(--ease-out);
}
.divider-gold:hover { width: 120px; }

/* Komisi card number */
.komisi-number {
  transition: color var(--dur-normal) ease,
              transform var(--dur-normal) var(--ease-spring);
}
.komisi-card:hover .komisi-number {
  color: var(--color-gold);
  transform: scale(1.1);
}
```

---

## Parallax Effect (Subtle)

```javascript
// Subtle parallax untuk hero background
// Hati-hati: jangan berlebihan, bisa bikin motion sick

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const hero = document.querySelector('.hero');
  
  if (hero && scrollY < window.innerHeight) {
    // Background bergerak lebih lambat dari scroll
    hero.style.backgroundPositionY = `${scrollY * 0.4}px`;
    
    // Hero content bergerak sedikit lebih cepat keluar
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
      heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.6));
    }
  }
}, { passive: true });
```

---

## Scroll Progress Indicator

```css
/* Thin progress bar di top of page */
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 0%;
  height: 3px;
  background: linear-gradient(to right, var(--color-crimson), var(--color-gold));
  z-index: 9999;
  transition: width 100ms linear;
}
```

```javascript
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  document.querySelector('.scroll-progress').style.width = scrollPercent + '%';
}, { passive: true });
```

---

## Shimmer Effect untuk Gold Text

```css
/* Gold shimmer untuk judul penting / tagline */
.text-shimmer {
  background: linear-gradient(
    90deg,
    var(--color-gold-dark) 0%,
    var(--color-gold-light) 40%,
    var(--color-gold) 50%,
    var(--color-gold-light) 60%,
    var(--color-gold-dark) 100%
  );
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}
```

---

## Reduced Motion Override

**WAJIB** implementasikan ini:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Pastikan elemen tetap visible walau animasi di-disable */
  [data-animate] {
    opacity: 1 !important;
    transform: none !important;
  }
}
```

---

## Performance Notes

1. **CSS animasi > JS animasi** untuk yang sederhana (opacity, transform)
2. Gunakan `will-change: transform, opacity` hanya pada elemen yang animasi aktif, hapus setelah selesai
3. Gunakan `transform` dan `opacity` saja — jangan animate `width`, `height`, `top`, `left` (trigger reflow)
4. Intersection Observer: `unobserve()` setelah element visible — jangan biarkan semua elemen terus di-observe
5. Scroll event: selalu gunakan `{ passive: true }` 
6. `requestAnimationFrame` untuk JS animations — jangan `setInterval` kecuali countdown
7. Batasi simultaneous CSS animations: max 5–6 elemen concurrent

---

## Mobile-Specific Animation Adjustments

```css
@media (max-width: 767px) {
  /* Reduce translateY jarak pada mobile — layar lebih kecil */
  [data-animate="fade-up"]    { transform: translateY(25px); }
  [data-animate="slide-left"] { transform: translateX(-30px); }
  [data-animate="slide-right"]{ transform: translateX(30px); }
  
  /* Faster pada mobile — user scroll lebih cepat */
  [data-animate] {
    transition-duration: var(--dur-normal);  /* 400ms vs 700ms desktop */
  }
  
  /* Disable parallax pada mobile */
  .hero { background-attachment: scroll !important; }
}
```
