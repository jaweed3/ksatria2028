    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

    // CARD GRID STAGGER — nilai, komisi
    // ============================================================
    const gridSelectors = ['.nilai-grid', '.komisi-grid'];
    gridSelectors.forEach(sel => {
      const grid = document.querySelector(sel);
      if (!grid) return;
      const cards = grid.children;
      if (!cards.length) return;
      gsap.fromTo(cards,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top bottom',
            toggleActions: 'play none none none',
          },
        },
      );
    });

    // ============================================================
    // TENTANG REVEAL — Narrative → Quote → Pillars
    // ============================================================
    const tentangSection = document.querySelector('.section-tentang');
    if (tentangSection) {
      const narrative = tentangSection.querySelector('.narrative-col');
      const quote = tentangSection.querySelector('.tentang-quote');
      const pillars = tentangSection.querySelectorAll('.pillar-card');

      const tentangTl = gsap.timeline({
        scrollTrigger: {
          trigger: tentangSection,
          start: 'top bottom',
          toggleActions: 'play none none none',
        }
      });

      if (narrative) {
        tentangTl.fromTo(narrative,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
        );
        tentangTl.fromTo(narrative.querySelector('.section-divider'),
          { scaleX: 0, transformOrigin: 'left' },
          { scaleX: 1, duration: 0.5, ease: 'power2.out' },
          '-=0.4'
        );
      }

      if (quote) {
        tentangTl.fromTo(quote,
          { opacity: 0, scale: 0.88 },
          { opacity: 1, scale: 1, duration: 1.0, ease: 'power3.out' },
          '-=0.3'
        );
      }

      if (pillars.length) {
        tentangTl.fromTo(pillars,
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out' },
          '-=0.2'
        );
      }
    }

    // ============================================================
    // REPRESENTASI ORBIT — Position nodes + threads + animations
    // ============================================================
    const repOrbit = document.getElementById('repOrbit');
    const repCenter = document.getElementById('repCenter');
    const repNodes = document.querySelectorAll('.rep-node');

    // Create thread elements
    const threads = new Map();
    if (repOrbit && repNodes.length) {
      repNodes.forEach((node, i) => {
        const thread = document.createElement('span');
        thread.className = 'rep-thread';
        thread.setAttribute('aria-hidden', 'true');
        repOrbit.insertBefore(thread, repOrbit.firstChild);
        threads.set(node, thread);
      });
    }

    function positionOrbit() {
      if (!repOrbit || !repCenter) return;
      const orbitRect = repOrbit.getBoundingClientRect();
      const cx = orbitRect.width / 2;
      const cy = orbitRect.height / 2;
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
        node.style.top = (ny + (parseInt(node.getAttribute('data-oy')) || 0)) + 'px';
        node.style.left = (nx + (parseInt(node.getAttribute('data-ox')) || 0)) + 'px';

        // Position thread
        const thread = threads.get(node);
        if (thread) {
          const ox = parseInt(node.getAttribute('data-ox')) || 0;
          const oy = parseInt(node.getAttribute('data-oy')) || 0;
          const tnx = nx + ox;
          const tny = ny + oy;
          const dx = tnx - cx;
          const dy = tny - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const tAngle = Math.atan2(dy, dx) * 180 / Math.PI;
          const nodeWidth = node.offsetWidth || 120;
          const centerR = 60;
          const threadLen = dist - centerR - nodeWidth / 2;

          thread.style.top = tny + 'px';
          thread.style.left = tnx + 'px';
          thread.style.width = threadLen + 'px';
          thread.style.transform = `rotate(${tAngle}deg) scaleX(0)`;
          thread.style.transformOrigin = 'right center';
          thread.setAttribute('data-angle', tAngle);
          thread.setAttribute('data-len', threadLen);
        }
      });
    }
    positionOrbit();
    window.addEventListener('resize', positionOrbit);
    window.addEventListener('load', positionOrbit);

    if (repOrbit && repNodes.length) {
      gsap.fromTo(repNodes,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.6,
          stagger: 0.08,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: repOrbit,
            start: 'top bottom',
            toggleActions: 'play none none none',
          },
        },
      );

      gsap.fromTo(repCenter,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1,
          duration: 0.8,
          ease: 'elastic.out(1, 0.6)',
          scrollTrigger: {
            trigger: repOrbit,
            start: 'top bottom',
            toggleActions: 'play none none none',
          }
        }
      );

      gsap.to(repCenter, {
        scale: 1.04,
        duration: 2.0,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5,
      });

      const pulseRing = document.querySelector('.rep-pulse-ring');
      if (pulseRing) {
        gsap.to(pulseRing, {
          scale: 1.4, opacity: 0,
          duration: 2.5,
          repeat: -1,
          ease: 'none',
          delay: 1.5,
        });
      }

      repNodes.forEach(node => {
        let hoverTween;
        const thread = threads.get(node);
        node.addEventListener('mouseenter', () => {
          hoverTween = gsap.to(node, {
            scale: 1.2,
            duration: 0.35,
            ease: 'back.out(2)',
          });
          if (thread) {
            const tAngle = thread.getAttribute('data-angle');
            const threadAnim = {};
            if (tAngle) threadAnim.rotate = tAngle;
            gsap.to(thread, {
              scaleX: 1, opacity: 0.5, duration: 0.5, ease: 'power3.out',
              ...threadAnim,
            });
          }
          if (repCenter) {
            gsap.to(repCenter, {
              boxShadow: '0 0 80px rgba(201,168,76,0.5), 0 0 160px rgba(201,168,76,0.2)',
              duration: 0.4,
            });
          }
        });
        node.addEventListener('mouseleave', () => {
          if (hoverTween) hoverTween.kill();
          gsap.to(node, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
          if (thread) {
            gsap.to(thread, {
              scaleX: 0, opacity: 0, duration: 0.3, ease: 'power2.in',
            });
          }
          if (repCenter) {
            gsap.to(repCenter, {
              boxShadow: '0 0 60px rgba(201,168,76,0.3), 0 0 120px rgba(201,168,76,0.1)',
              duration: 0.4,
            });
          }
        });
      });
    }

    // ============================================================
    // UNIVERSAL CARD GLOW — GSAP border glow + scale on hover
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
            scale: 1.015,
            y: -4,
            boxShadow: '0 0 28px rgba(201,168,76,0.15)',
            borderColor: 'rgba(201,168,76,0.5)',
            duration: 0.35,
            ease: 'power2.out',
          }, 0);
        });
        card.addEventListener('mouseleave', () => {
          if (hoverTl) hoverTl.kill();
          hoverTl = gsap.to(card, {
            scale: 1,
            y: 0,
            boxShadow: 'none',
            borderColor: '',
            duration: 0.3,
            ease: 'power2.in',
            clearProps: 'borderColor,boxShadow',
          });
        });
      });
    });

    // ============================================================
    // SCROLL REVEALS — [data-animate] elements
    // ============================================================
    const animateMap = {
      'fade-up':    { y: 50, opacity: 0 },
      'slide-left':  { x: -50, opacity: 0 },
      'slide-right': { x: 50, opacity: 0 },
      'scale-up':   { scale: 0.88, opacity: 0 },
      'fade-in':    { opacity: 0 },
    };

    gsap.utils.toArray('[data-animate]').forEach(el => {
      const type = el.getAttribute('data-animate') || 'fade-up';
      const delay = parseInt(el.getAttribute('data-delay')) || 0;
      const vars = animateMap[type] || animateMap['fade-up'];

      gsap.fromTo(el, vars, {
        ...Object.fromEntries(Object.keys(vars).map(k => [k, undefined])),
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out',
        delay: delay / 1000,
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
            toggleActions: 'play none none none',
          }
        });
    });

    // ============================================================
    // SECTION NUMBERS — scroll-driven opacity
    // ============================================================
    gsap.utils.toArray('.section-number').forEach(num => {
      gsap.fromTo(num,
        { opacity: 0 },
        {
          opacity: 0.03,
          duration: 0.6,
          scrollTrigger: {
            trigger: num.closest('.section'),
            start: 'top bottom',
          }
        }
      );
    });

    // === ScrollTrigger refresh — aggressive multi-pass ===
    const doRefresh = () => { ScrollTrigger.refresh(); ScrollTrigger.sort(); };
    requestAnimationFrame(() => requestAnimationFrame(doRefresh));
    document.fonts.ready.then(doRefresh);
    window.addEventListener('load', doRefresh);
    [200, 600, 1200, 2500, 5000].forEach(t => setTimeout(doRefresh, t));

    // Safety net: force-reveal all [data-animate] after 6s if GSAP missed
    setTimeout(() => {
      document.querySelectorAll('[data-animate]').forEach(el => {
        if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    }, 6000);