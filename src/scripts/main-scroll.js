    import gsap from "gsap";
    import { ScrollTrigger } from "gsap/ScrollTrigger";

    gsap.registerPlugin(ScrollTrigger);

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
          start: 'top 70%',
          end: 'bottom bottom',
          scrub: 1.2,
        }
      });
    }
    if (tlNodes.length) {
      tlNodes.forEach((node, i) => {
        ScrollTrigger.create({
          trigger: node,
          start: 'top 85%',
          onEnter: () => {
            node.classList.add('tl-node--visible');
            gsap.fromTo(node, { opacity: 0, x: -40 }, {
              opacity: 1, x: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1,
            });
          },
          once: true,
        });
      });
    }

    // ============================================================
    // HORIZONTAL SCROLL — Festival + Konser
    // ============================================================
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
    // KEGIATAN — Horizontal Scroll Timeline + Center Focus
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
    // OUTPUT — Horizontal Scroll
    // ============================================================
    const outputSection = document.querySelector('.section-output');
    const outputTrack = document.querySelector('.output-track');
    if (outputSection && outputTrack) {
      const getTravel = () => -(outputTrack.scrollWidth - window.innerWidth + 64);

      gsap.to(outputTrack, {
        x: getTravel,
        ease: 'none',
        scrollTrigger: {
          trigger: outputSection,
          start: 'top top',
          end: () => '+=' + Math.abs(getTravel()),
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        }
      });
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
            start: 'top 82%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    // Refresh after layout settles
    function refreshST() { ScrollTrigger.refresh(); }
    document.fonts.ready.then(refreshST);
    window.addEventListener('load', refreshST);
    setTimeout(refreshST, 500);
    setTimeout(refreshST, 1500);