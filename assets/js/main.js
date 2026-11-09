(function () {
  'use strict';

  const STORAGE_THEME = 'vertex-theme';
  const STORAGE_RTL = 'vertex-rtl';

  const MOON_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  const SUN_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
  const RTL_ICON_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><path d="M4 8h16M16 4l4 4-4 4"/><path d="M20 16H4M8 12l-4 4 4 4"/></svg>';

  function initTheme() {
    const saved = localStorage.getItem(STORAGE_THEME);
    if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon();
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(STORAGE_THEME, 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem(STORAGE_THEME, 'dark');
    }
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.querySelectorAll('[data-theme-icon]').forEach((el) => {
      el.innerHTML = isDark ? SUN_ICON_SVG : MOON_ICON_SVG;
    });
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('title', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      btn.setAttribute('aria-label', isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme');
      btn.classList.toggle('active', isDark);
    });
  }

  function initRtl() {
    if (localStorage.getItem(STORAGE_RTL) === 'true') {
      document.documentElement.setAttribute('dir', 'rtl');
    }
    updateRtlLabel();
  }

  function toggleRtl() {
    const rtl = document.documentElement.getAttribute('dir') === 'rtl';
    document.documentElement.setAttribute('dir', rtl ? 'ltr' : 'rtl');
    localStorage.setItem(STORAGE_RTL, rtl ? 'false' : 'true');
    updateRtlLabel();
  }

  function updateRtlLabel() {
    const rtl = document.documentElement.getAttribute('dir') === 'rtl';
    document.querySelectorAll('[data-rtl-icon]').forEach((el) => {
      el.innerHTML = RTL_ICON_SVG;
    });
    document.querySelectorAll('[data-rtl-label]').forEach((el) => {
      el.textContent = rtl ? 'LTR Mode' : 'RTL Mode';
    });
    document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => {
      btn.setAttribute('title', rtl ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
      btn.setAttribute('aria-label', rtl ? 'Switch to Left-to-Right (LTR)' : 'Switch to Right-to-Left (RTL)');
      btn.classList.toggle('active', rtl);
    });
  }

  function initNav() {
    const header = document.querySelector('.site-header');
    const hamburger = document.querySelector('.hamburger');
    const drawer = document.querySelector('.mobile-drawer');
    const backdrop = document.querySelector('.drawer-backdrop');

    const setScroll = () => {
      if (header) header.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', setScroll, { passive: true });
    setScroll();

    const closeDrawer = () => {
      drawer?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    hamburger?.addEventListener('click', () => {
      const open = drawer?.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    backdrop?.addEventListener('click', closeDrawer);
    drawer?.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeDrawer));

    const path = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-desktop a, .drawer-panel a[data-nav]').forEach((link) => {
      const href = link.getAttribute('href');
      if (href === path || (path === '' && href === 'index.html')) link.classList.add('active');
    });
    if (path === 'index.html' || path === 'index-2.html' || path === '') {
      document.querySelector('.nav-dropdown-btn')?.classList.add('active');
    }
  }

  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach((el) => io.observe(el));
  }

  function initCounters() {
    document.querySelectorAll('[data-counter]').forEach((el) => {
      const target = parseInt(el.dataset.counter, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1800;
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      const io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            requestAnimationFrame(step);
            io.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      io.observe(el);
    });
  }

  function openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = modal.querySelector('input, select, textarea, button');
    first?.focus();
  }

  function closeModal(modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function initModals() {
    document.querySelectorAll('[data-modal-open]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal(btn.getAttribute('data-modal-open'));
      });
    });

    document.querySelectorAll('.modal').forEach((modal) => {
      modal.querySelector('.modal-backdrop')?.addEventListener('click', () => closeModal(modal));
      modal.querySelector('.modal-close')?.addEventListener('click', () => closeModal(modal));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal.open').forEach(closeModal);
        document.querySelector('.lightbox.open')?.classList.remove('open');
      }
    });
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validatePhone(phone) {
    return /^[\d\s+\-()]{8,}$/.test(phone.trim());
  }

  function showFieldError(group, message) {
    group.classList.add('error');
    let err = group.querySelector('.field-error');
    if (!err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.setAttribute('role', 'alert');
      group.appendChild(err);
    }
    err.textContent = message;
  }

  function clearFieldError(group) {
    group.classList.remove('error');
    group.querySelector('.field-error')?.remove();
  }

  function initForms() {
    document.querySelectorAll('form[data-validate]').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        let valid = true;
        form.querySelectorAll('.form-group').forEach(clearFieldError);

        form.querySelectorAll('[required]').forEach((input) => {
          const group = input.closest('.form-group');
          if (!group) return;
          const val = input.value.trim();
          if (!val) {
            showFieldError(group, 'This field is required.');
            valid = false;
          } else if (input.type === 'email' && !validateEmail(val)) {
            showFieldError(group, 'Enter a valid email address.');
            valid = false;
          } else if (input.type === 'tel' && !validatePhone(val)) {
            showFieldError(group, 'Enter a valid phone number.');
            valid = false;
          }
        });

        if (!valid) return;

        const success = form.querySelector('.form-success');
        if (success) {
          success.classList.add('show');
          success.textContent =
            form.dataset.successMessage ||
            'Thank you — we will respond within 24 hours with a curated estimate.';
        }
        form.reset();
        setTimeout(() => success?.classList.remove('show'), 8000);
      });
    });

    document.querySelectorAll('.newsletter-form').forEach((form) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = form.querySelector('input[type="email"]');
        if (!input || !validateEmail(input.value.trim())) {
          input?.focus();
          return;
        }
        const msg = form.querySelector('.newsletter-msg');
        if (msg) {
          msg.textContent = 'Subscribed — stay tuned for design inspiration.';
          msg.style.color = 'var(--accent)';
        }
        input.value = '';
      });
    });
  }

  function initGalleryFilter() {
    const filters = document.querySelectorAll('.gallery-filters .filter-btn');
    const items = document.querySelectorAll('.gallery-item');
    if (!filters.length) return;

    filters.forEach((btn) => {
      btn.addEventListener('click', () => {
        filters.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filter;
        items.forEach((item) => {
          const match = cat === 'all' || item.dataset.category === cat;
          item.style.display = match ? '' : 'none';
        });
      });
    });
  }

  function initLightbox() {
    const lb = document.querySelector('.lightbox');
    if (!lb) return;
    const img = lb.querySelector('img');
    document.querySelectorAll('.gallery-item[data-full]').forEach((item) => {
      item.addEventListener('click', () => {
        img.src = item.dataset.full;
        img.alt = item.querySelector('img')?.alt || '';
        lb.classList.add('open');
      });
    });
    lb.querySelector('.lightbox-close')?.addEventListener('click', () => lb.classList.remove('open'));
    lb.addEventListener('click', (e) => {
      if (e.target === lb) lb.classList.remove('open');
    });
  }

  function initGoalSelector() {
    const options = document.querySelectorAll('.goal-btn[data-goal]');
    const panel = document.querySelector('[data-goal-panel]');
    if (!options.length || !panel) return;

    const recommendations = {
      living: 'Layered gypsum tray ceiling with perimeter cove lighting',
      bedroom: 'Soft recessed profile with acoustic gypsum board',
      office: 'Grid-aligned modular ceiling with integrated LED panels',
      retail: 'Statement POP moulding with brand-aligned lighting',
      banquet: 'Multi-tier designer ceiling with crystal-ready centre',
      corridor: 'Linear cove runs with tapered gypsum frames',
    };

    options.forEach((opt) => {
      opt.addEventListener('click', () => {
        options.forEach((o) => o.classList.remove('active'));
        opt.classList.add('active');
        const key = opt.dataset.goal;
        panel.innerHTML = `<strong>Recommended approach:</strong> ${recommendations[key] || recommendations.living}`;
      });
    });
  }

  function initFaqAccordion() {
    document.querySelectorAll('.faq-item .faq-question').forEach((btn) => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('active'));
        if (!isOpen) item.classList.add('active');
      });
    });
  }

  function initCostEstimator() {
    const calcCard = document.querySelector('[data-calculator]');
    if (!calcCard) return;

    const areaSlider = calcCard.querySelector('#calc-area-range');
    const areaDisplay = calcCard.querySelector('#calc-area-val');
    const priceDisplay = calcCard.querySelector('#calc-total-price');
    const timeDisplay = calcCard.querySelector('#calc-time-val');
    const matDisplay = calcCard.querySelector('#calc-mat-val');
    const labDisplay = calcCard.querySelector('#calc-lab-val');
    const chipBtns = calcCard.querySelectorAll('.calc-chip-btn[data-rate]');
    const addOnChecks = calcCard.querySelectorAll('input[type="checkbox"][data-addon-rate]');

    let baseRate = 145; // Default designer false ceiling

    function calculate() {
      const area = parseInt(areaSlider?.value || 350, 10);
      if (areaDisplay) areaDisplay.textContent = `${area} sq.ft.`;

      let totalRate = baseRate;
      addOnChecks.forEach((chk) => {
        if (chk.checked) totalRate += parseInt(chk.dataset.addonRate, 10);
      });

      const total = area * totalRate;
      const matCost = Math.round(total * 0.62);
      const labCost = total - matCost;

      // Estimate working days
      let days = Math.ceil(area / 120) + 2;
      if (days < 4) days = 4;

      if (priceDisplay) priceDisplay.textContent = `₹${total.toLocaleString('en-IN')}`;
      if (timeDisplay) timeDisplay.textContent = `${days}–${days + 3} Days`;
      if (matDisplay) matDisplay.textContent = `₹${matCost.toLocaleString('en-IN')}`;
      if (labDisplay) labDisplay.textContent = `₹${labCost.toLocaleString('en-IN')}`;
    }

    chipBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        chipBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        baseRate = parseInt(btn.dataset.rate, 10);
        calculate();
      });
    });

    areaSlider?.addEventListener('input', calculate);
    addOnChecks.forEach((chk) => chk.addEventListener('change', calculate));

    calculate();
  }

  function initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;
    const toggleBtn = () => {
      if (window.scrollY > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };
    window.addEventListener('scroll', toggleBtn, { passive: true });
    toggleBtn();
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => btn.addEventListener('click', toggleTheme));
  document.querySelectorAll('[data-rtl-toggle]').forEach((btn) => btn.addEventListener('click', toggleRtl));

  initTheme();
  initRtl();
  initNav();
  initReveal();
  initCounters();
  initModals();
  initForms();
  initGalleryFilter();
  initLightbox();
  initGoalSelector();
  initFaqAccordion();
  initCostEstimator();
  initBackToTop();
})();
