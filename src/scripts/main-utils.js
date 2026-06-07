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
    // FORM SUBMIT HANDLER
    // ============================================================
    const form = document.getElementById('registrasiForm');
    const thanks = document.getElementById('formThanks');
    if (form && thanks) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        form.style.display = 'none';
        thanks.style.display = 'block';
      });
    }
