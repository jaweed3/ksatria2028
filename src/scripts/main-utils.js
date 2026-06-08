    // COUNTDOWN TIMER
    // ============================================================
    function updateCountdown() {
      const target = new Date('2028-10-28T19:00:00+07:00');
      const diff = target - new Date();
      if (diff <= 0) {
        document.querySelectorAll('.cd-number').forEach(el => el.textContent = '00');
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      document.getElementById('cd-days').textContent = String(d).padStart(3, '0');
      document.getElementById('cd-hours').textContent = String(h).padStart(2, '0');
      document.getElementById('cd-minutes').textContent = String(m).padStart(2, '0');
      document.getElementById('cd-seconds').textContent = String(s).padStart(2, '0');
    }
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ============================================================
    // COUNTER-UP — Hero stats (38, 7, 2000+, 100)
    // ============================================================
    function animateCounter(el, target, suffix) {
      const dur = 1200;
      const start = performance.now();
      function tick(now) {
        const t = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        const current = Math.round(eased * target);
        el.textContent = current + suffix;
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    const statNums = document.querySelectorAll('.hero-stat-num');
    if (statNums.length) {
      const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          statObserver.unobserve(el);
          const raw = el.textContent.trim();
          const suffix = raw.replace(/[\d]/g, '');
          const target = parseInt(raw) || 0;
          if (target > 0) animateCounter(el, target, suffix);
        });
      }, { threshold: 0.3 });
      statNums.forEach(el => statObserver.observe(el));
    }

    // ============================================================
    // SCROLL SPY — Active nav link
    // ============================================================
    const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
    const sections = Array.from(navAnchors).map(a => {
      const id = a.getAttribute('href').slice(1);
      return { el: document.getElementById(id), link: a };
    }).filter(s => s.el);

    const spyObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        sections.forEach(s => s.link.classList.remove('active'));
        const active = sections.find(s => s.el === entry.target);
        if (active) active.link.classList.add('active');
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });

    sections.forEach(s => spyObserver.observe(s.el));

    // ============================================================
    // BACK TO TOP
    // ============================================================
    const backBtn = document.getElementById('backToTop');
    if (backBtn) {
      window.addEventListener('scroll', () => {
        backBtn.classList.toggle('visible', window.scrollY > 600);
      });
      backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // ============================================================
    // MOBILE NAV TOGGLE
    // ============================================================
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
      navLinks.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => navLinks.classList.remove('open'));
      });
    }

    // ============================================================
    // FORM SUBMIT HANDLER — POST to API
    // ============================================================
    const form = document.getElementById('registrasiForm');
    const thanks = document.getElementById('formThanks');
    if (form && thanks) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const data = Object.fromEntries(fd.entries());
        try {
          await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
        } catch (_) {}
        form.style.display = 'none';
        thanks.style.display = 'block';
      });
    }