    import gsap from "gsap";

    // ============================================================
    // STAGGER REVEALS — IntersectionObserver + CSS transitions
    // ============================================================
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        observer.unobserve(el);

        if (el.classList.contains('section-tentang')) {
          el.querySelector('.narrative-col')?.classList.add('is-visible');
          el.querySelector('.narrative-col .section-divider')?.classList.add('is-visible');
          el.querySelector('.tentang-quote')?.classList.add('is-visible');
          el.querySelectorAll('.pillar-card').forEach((p, i) => {
            p.style.setProperty('--stagger', i * 0.15 + 's');
            p.classList.add('is-visible');
          });
          return;
        }

        if (el.matches('.rep-node, .rep-center')) {
          el.classList.add('is-visible');
          el.style.setProperty('--stagger', '0s');
          return;
        }

        el.classList.add('is-visible');
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    document.querySelectorAll('.nilai-card, .komisi-card').forEach((el, i) => {
      el.style.setProperty('--stagger', i * 0.05 + 's');
      observer.observe(el);
    });
    const tentang = document.querySelector('.section-tentang');
    if (tentang) observer.observe(tentang);
    document.querySelectorAll('.rep-node, .rep-center').forEach(el => observer.observe(el));

    // ============================================================
    // REPRESENTASI ORBIT — Positions + threads
    // ============================================================
    const repOrbit = document.getElementById('repOrbit');
    const repCenter = document.getElementById('repCenter');
    const repNodes = document.querySelectorAll('.rep-node');

    const threads = new Map();
    if (repOrbit && repNodes.length) {
      repNodes.forEach((node) => {
        const thread = document.createElement('span');
        thread.className = 'rep-thread';
        thread.setAttribute('aria-hidden', 'true');
        repOrbit.insertBefore(thread, repOrbit.firstChild);
        threads.set(node, thread);
      });
    }

    function positionOrbit() {
      if (!repOrbit || !repCenter) return;
      const rect = repOrbit.getBoundingClientRect();
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const radii = { '1': Math.min(cx, cy) * 0.48, '2': Math.min(cx, cy) * 0.80 };

      repCenter.style.top = cy + 'px';
      repCenter.style.left = cx + 'px';

      repNodes.forEach(node => {
        const ring = node.getAttribute('data-ring');
        const angleDeg = parseInt(node.getAttribute('data-angle'));
        const angleRad = (angleDeg * Math.PI) / 180;
        const r = radii[ring] || radii['2'];
        const nx = cx + r * Math.cos(angleRad);
        const ny = cy + r * Math.sin(angleRad);
        const ox = parseInt(node.getAttribute('data-ox')) || 0;
        const oy = parseInt(node.getAttribute('data-oy')) || 0;
        node.style.top = (ny + oy) + 'px';
        node.style.left = (nx + ox) + 'px';

        const thread = threads.get(node);
        if (thread) {
          const tnx = nx + ox;
          const tny = ny + oy;
          const dx = tnx - cx;
          const dy = tny - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const tAngle = Math.atan2(dy, dx) * 180 / Math.PI;
          const nodeWidth = node.offsetWidth || 120;
          const threadLen = dist - 60 - nodeWidth / 2;
          thread.style.top = tny + 'px';
          thread.style.left = tnx + 'px';
          thread.style.width = Math.max(threadLen, 0) + 'px';
          thread.style.transform = `rotate(${tAngle}deg) scaleX(0)`;
        }
      });
    }
    positionOrbit();
    window.addEventListener('resize', positionOrbit);

    // Orbit center pulse + ring (continuous, no scroll)
    if (repCenter) {
      gsap.to(repCenter, {
        scale: 1.04, duration: 2.0, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2,
      });
    }
    const pulseRing = document.querySelector('.rep-pulse-ring');
    if (pulseRing) {
      gsap.to(pulseRing, {
        scale: 1.4, opacity: 0, duration: 2.5, repeat: -1, ease: 'none', delay: 2,
      });
    }

    // Orbit hover threads (GSAP hover only)
    if (repNodes.length) {
      repNodes.forEach(node => {
        const thread = threads.get(node);
        let hoverTween;
        node.addEventListener('mouseenter', () => {
          hoverTween = gsap.to(node, { scale: 1.2, duration: 0.35, ease: 'back.out(2)' });
          if (thread) gsap.to(thread, { scaleX: 1, opacity: 0.5, duration: 0.5, ease: 'power3.out' });
          if (repCenter) gsap.to(repCenter, {
            boxShadow: '0 0 80px rgba(201,168,76,0.5), 0 0 160px rgba(201,168,76,0.2)', duration: 0.4,
          });
        });
        node.addEventListener('mouseleave', () => {
          if (hoverTween) hoverTween.kill();
          gsap.to(node, { scale: 1, duration: 0.3, ease: 'power2.out' });
          if (thread) gsap.to(thread, { scaleX: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
          if (repCenter) gsap.to(repCenter, {
            boxShadow: '0 0 60px rgba(201,168,76,0.3)', duration: 0.4,
          });
        });
      });
    }

    // ============================================================
    // MAGNETIC BUTTON — cursor-follow on CTAs
    // ============================================================
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta, .btn-submit');
    magneticBtns.forEach(btn => {
      let magTween;
      btn.addEventListener('mouseenter', () => {
        if (magTween) magTween.kill();
      });
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const dist = Math.sqrt(x * x + y * y);
        const maxDist = Math.min(rect.width, rect.height) * 0.5;
        const strength = Math.min(1, dist / maxDist);
        const pullX = x * 0.2 * strength;
        const pullY = y * 0.2 * strength;
        if (magTween) magTween.kill();
        magTween = gsap.to(btn, {
          x: pullX, y: pullY, duration: 0.3, ease: 'power2.out', overwrite: 'auto',
        });
      });
      btn.addEventListener('mouseleave', () => {
        if (magTween) magTween.kill();
        magTween = gsap.to(btn, {
          x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.3)', overwrite: 'auto',
        });
      });
    });

    // ============================================================
    // CARD GLOW — GSAP hover (keep — no scroll dependency)
    // ============================================================
    const cardSelectors = [
      '.output-card', '.nilai-card', '.komisi-card',
      '.hscroll-card', '.konser-card', '.tl-body',
      '.day-card', '.pillar-card', '.panitia-level',
    ];
    cardSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(card => {
        let hoverTl;
        card.addEventListener('mouseenter', () => {
          if (hoverTl) hoverTl.kill();
          hoverTl = gsap.timeline();
          hoverTl.to(card, {
            scale: 1.015, y: -4,
            boxShadow: '0 0 28px rgba(201,168,76,0.15)',
            borderColor: 'rgba(201,168,76,0.5)',
            duration: 0.35, ease: 'power2.out',
          }, 0);
        });
        card.addEventListener('mouseleave', () => {
          if (hoverTl) hoverTl.kill();
          hoverTl = gsap.to(card, {
            scale: 1, y: 0,
            boxShadow: 'none', borderColor: '',
            duration: 0.3, ease: 'power2.in',
            clearProps: 'borderColor,boxShadow',
          });
        });
      });
    });