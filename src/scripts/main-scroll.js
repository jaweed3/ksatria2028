    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    // TIMELINE — Glowing Line + Node Reveal
    // ============================================================
    const tlGlowLine = document.getElementById('tlGlowLine');
    const tlNodes = gsap.utils.toArray('.tl-node');
    if (tlGlowLine) {
      gsap.to(tlGlowLine, {
        height: '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: '.tl-path',
          start: 'top 80%',
          end: 'bottom bottom',
          scrub: 1.2,
        }
      });
    }
    if (tlNodes.length) {
      tlNodes.forEach((node, i) => {
        ScrollTrigger.create({
          trigger: node,
          start: 'top bottom',
          onEnter: () => {
            if (node.classList.contains('tl-node--visible')) return;
            node.classList.add('tl-node--visible');
            gsap.fromTo(node, { opacity: 0, x: -40 }, {
              opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1,
            });
          },
        });
      });
    }

    // ============================================================
    // HORIZONTAL SCROLL — Festival + Konser (desktop only)
    // ============================================================
    if (window.matchMedia('(min-width: 768px)').matches) {
      const hscrollSections = document.querySelectorAll('.section-hscroll');
      hscrollSections.forEach((section) => {
        const viewport = section.querySelector('.hscroll-viewport');
        const track = section.querySelector('.hscroll-track');
        if (!viewport || !track) return;

        const getTravel = () => -(track.scrollWidth - window.innerWidth + 64);

        gsap.to(track, {
          x: getTravel,
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => '+=' + Math.abs(getTravel()),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          }
        });
      });

      // ============================================================
      // KEGIATAN — Horizontal Scroll Timeline + Center Focus (desktop only)
      // ============================================================
      const kegiatanSection = document.querySelector('.section-kegiatan');
      const kegiatanViewport = kegiatanSection?.querySelector('.kegiatan-viewport');
      const kegiatanTrack = kegiatanSection?.querySelector('.kegiatan-track');
      const dayCards = gsap.utils.toArray('.day-card');

      if (kegiatanSection && kegiatanTrack && kegiatanViewport && dayCards.length) {
        const getTravel = () => -(kegiatanTrack.scrollWidth - kegiatanViewport.offsetWidth);

        const kegiatanScroll = gsap.to(kegiatanTrack, {
          x: getTravel,
          ease: 'none',
          scrollTrigger: {
            trigger: kegiatanSection,
            start: 'top top',
            end: () => '+=' + Math.abs(getTravel()),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onRefresh: () => { kegiatanScroll.vars.x = getTravel(); },
          }
        });

        dayCards.forEach((card) => {
          gsap.fromTo(card,
            { scale: 0.82, opacity: 0.3 },
            {
              scale: 1, opacity: 1,
              scrollTrigger: {
                trigger: card,
                containerAnimation: kegiatanScroll,
                start: 'left center',
                end: 'right center',
                scrub: 1,
              }
            }
          );
        });
      }

      // ============================================================
      // OUTPUT — Full-Viewport Horizontal Scroll + Center Glassmorphism
      // ============================================================
      const outputSection = document.querySelector('.section-output[data-hscroll]');
      const outputViewport = outputSection?.querySelector('.output-viewport');
      const outputTrack = outputSection?.querySelector('.output-track');
      const outputCards = outputSection ? gsap.utils.toArray('.output-card') : [];

      if (outputSection && outputTrack && outputViewport && outputCards.length) {
        const getTravel = () => -(outputTrack.scrollWidth - outputViewport.offsetWidth);

        gsap.to(outputTrack, {
          x: getTravel,
          ease: 'none',
          scrollTrigger: {
            trigger: outputSection,
            start: 'top top',
            end: () => '+=' + Math.abs(getTravel()),
            pin: true,
            scrub: 1.2,
            invalidateOnRefresh: true,
            onUpdate: self => {
              const progress = self.progress;
              const totalCards = outputCards.length;
              const rawIndex = progress * (totalCards - 1);
              const centerIdx = Math.min(Math.max(Math.round(rawIndex), 0), totalCards - 1);

              outputCards.forEach((card, i) => {
                card.classList.remove('output-card--center', 'output-card--left', 'output-card--right', 'output-card--far');

                if (i === centerIdx) {
                  card.classList.add('output-card--center');
                } else if (i < centerIdx) {
                  card.classList.add(centerIdx - i >= 2 ? 'output-card--far' : 'output-card--left');
                } else {
                  card.classList.add(i - centerIdx >= 2 ? 'output-card--far' : 'output-card--right');
                }
              });
            }
          }
        });
      }
    }

    // ============================================================
    // SCROLL PROGRESS BAR
    // ============================================================
    gsap.to('#scrollProgress', {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        scrub: 0.3,
        start: 'top top',
        end: 'bottom bottom',
      }
    });

    // ============================================================
    // NAVBAR — Scroll Effect
    // ============================================================
    const navbar = document.querySelector('.navbar');
    ScrollTrigger.create({
      start: 'top -80px',
      onToggle: self => {
        if (navbar) navbar.classList.toggle('scrolled', self.isActive);
      }
    });

    // ============================================================
    // PARALLAX — Garuda in hero
    // ============================================================
    const heroGaruda = document.querySelector('.hero-garuda');
    if (heroGaruda) {
      gsap.to(heroGaruda, {
        y: 120,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero',
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        }
      });
    }

    // ============================================================
    // SECTION TITLE REVEAL — clip-path + fade
    // ============================================================
    gsap.utils.toArray('.section-title').forEach(title => {
      gsap.fromTo(title,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)', opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: title,
            start: 'top bottom',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // ============================================================
    // GLOWING LINES — benang emas organic drift
    // ============================================================
    const glowPaths = gsap.utils.toArray('.glow-path');
    if (glowPaths.length) {
      // Path 1: horizontal drift
      gsap.to(glowPaths[0], {
        x: 30, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
      // Path 2: subtle vertical sway
      if (glowPaths[1]) {
        gsap.to(glowPaths[1], {
          y: -15, duration: 6, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      }
      // Path 3: slow diagonal pulse
      if (glowPaths[2]) {
        gsap.to(glowPaths[2], {
          opacity: 0.15, duration: 5, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      }
      // Path 4: very slow opacity shimmer
      if (glowPaths[3]) {
        gsap.to(glowPaths[3], {
          opacity: 0.1, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut',
        });
      }
    }

    // ============================================================
    // SUBTLE FLOATING — key decorative elements
    // ============================================================
    // Section numbers drift slowly
    gsap.utils.toArray('.section-number').forEach(num => {
      gsap.to(num, {
        y: -15, duration: 6 + Math.random() * 3,
        repeat: -1, yoyo: true, ease: 'sine.inOut',
      });
    });

    // Hero Garuda already has parallax, but add subtle breathing
    gsap.to('.hero-garuda', {
      scale: 1.02, duration: 5,
      repeat: -1, yoyo: true, ease: 'sine.inOut',
    });

    // Glow line on timeline pulses
    gsap.to('.tl-glow-line', {
      opacity: 0.6, duration: 3,
      repeat: -1, yoyo: true, ease: 'sine.inOut',
    });