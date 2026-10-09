document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const navToggle = document.querySelector('.nav-toggle');
  const navPanel = document.querySelector('.nav-panel');
  const yearEl = document.getElementById('year');
  const reveals = document.querySelectorAll('.reveal');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-cta');

  // 1. Copyright Year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // 2. Header Scroll Effect
  const updateHeaderState = () => {
    if (!header) return;
    const scrolled = window.scrollY > 24;
    header.classList.toggle('is-scrolled', scrolled);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  // 3. Mobile Navigation Toggle
  const setMenuState = (open) => {
    if (!navToggle || !navPanel) return;

    navToggle.setAttribute('aria-expanded', String(open));
    navPanel.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (navToggle && navPanel) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      setMenuState(!isOpen);
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          setMenuState(false);
        }
      });
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      if (!navPanel.contains(target) && !navToggle.contains(target)) {
        setMenuState(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (
        event.key === 'Escape' &&
        navToggle.getAttribute('aria-expanded') === 'true'
      ) {
        setMenuState(false);
      }
    });
  }

  // 4. Live Store Status Indicator (Tue–Sun, 1:30 PM - 10:00 PM)
  const updateStoreStatus = () => {
    const statusBadge = document.getElementById('store-status');
    if (!statusBadge) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
    const hour = now.getHours() + now.getMinutes() / 60;

    // Closed Mondays (1), Open Tue-Sun 13.5 to 22.0
    if (day !== 1 && hour >= 13.5 && hour < 22) {
      statusBadge.textContent = '● OPEN NOW';
      statusBadge.className = 'status-badge open';
    } else {
      statusBadge.textContent = '● CLOSED NOW';
      statusBadge.className = 'status-badge closed';
    }
  };

  updateStoreStatus();

  // 5. Interactive Menu Category Filtering
  const filterButtons = document.querySelectorAll('.menu-tab');
  const menuGroups = document.querySelectorAll('.menu-group');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;

      filterButtons.forEach((btn) => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });

      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      menuGroups.forEach((group) => {
        if (category === 'all' || group.dataset.category === category) {
          group.style.display = 'block';
        } else {
          group.style.display = 'none';
        }
      });
    });
  });

  // 6. Scroll Reveal Observer
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -5% 0px'
      }
    );

    reveals.forEach((element) => observer.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  // 7. Smooth Internal Anchor Scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (event) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    });
  });
});