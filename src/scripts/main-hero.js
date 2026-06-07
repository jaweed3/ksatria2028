    import gsap from 'gsap';
    import { ScrollTrigger } from 'gsap/ScrollTrigger';

    gsap.registerPlugin(ScrollTrigger);

    // ============================================================
    // HERO — Cinematic Timeline (3-4s)
    // ============================================================
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // 1. Background slowly scales
    heroTl.to('.hero-garuda', {
      scale: 1, duration: 2.5, ease: 'power1.out',
    }, 0);

    // 2. Label fades in
    heroTl.to('.hero-label', { opacity: 1, y: 0, duration: 0.5 }, 0.4);

    // 3. Massive title word reveal
    heroTl.to('.hero-title-word', {
      opacity: 1, y: 0, scale: 1, duration: 1.0, ease: 'power2.out',
    }, 0.6);

    // 4. Subtitle
    heroTl.to('.hero-title-sub', { opacity: 1, y: 0, duration: 0.5 }, 1.2);

    // 5. Tagline
    heroTl.to('.hero-tagline', { opacity: 1, y: 0, duration: 0.6 }, 1.5);

    // 6. Stat cards reveal one by one
    heroTl.to('.hero-stat', {
      opacity: 1, y: 0, duration: 0.4, stagger: 0.12,
    }, 1.8);

    // 7. Countdown appears
    heroTl.to('.hero-countdown', {
      opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.4)',
    }, 2.3);

    // 8. CTA buttons
    heroTl.to('.hero-btn-1', { opacity: 1, y: 0, duration: 0.4 }, 2.7);
    heroTl.to('.hero-btn-2', { opacity: 1, y: 0, duration: 0.4 }, 2.85);

    // 9. Scroll indicator
    heroTl.to('.scroll-indicator', { opacity: 1, duration: 0.4 }, 3.1);

    // Refresh after layout settles
    function refreshST() { ScrollTrigger.refresh(); }
    document.fonts.ready.then(refreshST);
    window.addEventListener('load', refreshST);
    setTimeout(refreshST, 500);
    setTimeout(refreshST, 1500);