(() => {
  const nav = document.getElementById('nav');
  const burger = document.querySelector('.nav__burger');
  const links = document.querySelector('.nav__links');
  const navLinks = document.querySelectorAll('.nav__links a');
  const yearEl = document.getElementById('year');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sticky nav state
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Active section highlighting for nav links
  const sections = Array.from(navLinks)
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          navLinks.forEach(a => a.classList.remove('is-active'));
          const match = document.querySelector(`.nav__links a[href="#${e.target.id}"]`);
          if (match) match.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => sectionObserver.observe(s));
  }

  // Mobile nav
  if (burger && links) {
    const closeMenu = () => {
      links.classList.remove('is-open');
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    };
    const openMenu = () => {
      links.classList.add('is-open');
      nav.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
    };
    burger.addEventListener('click', () => {
      if (links.classList.contains('is-open')) closeMenu();
      else openMenu();
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
    const desktopMq = window.matchMedia('(min-width: 1025px)');
    const handleMq = (e) => { if (e.matches) closeMenu(); };
    if (desktopMq.addEventListener) desktopMq.addEventListener('change', handleMq);
    else desktopMq.addListener(handleMq);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // Scroll reveals
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-in'));
  }

  // Completed-work carousel
  document.querySelectorAll('[data-carousel]').forEach(carousel => {
    const track = carousel.querySelector('[data-carousel-track]');
    const prev = carousel.querySelector('.carousel__nav--prev');
    const next = carousel.querySelector('.carousel__nav--next');
    const dotsHost = carousel.querySelector('[data-carousel-dots]');
    if (!track) return;
    const slides = Array.from(track.children);
    if (!slides.length) return;

    const slideWidth = () => {
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return slides[0].getBoundingClientRect().width + gap;
    };

    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'carousel__dot';
      b.setAttribute('aria-label', `Go to project ${i + 1}`);
      b.addEventListener('click', () => track.scrollTo({ left: i * slideWidth(), behavior: 'smooth' }));
      dotsHost && dotsHost.appendChild(b);
      return b;
    });

    const update = () => {
      const idx = Math.round(track.scrollLeft / Math.max(slideWidth(), 1));
      dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
      if (prev) prev.disabled = track.scrollLeft <= 4;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };

    if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -slideWidth(), behavior: 'smooth' }));
    if (next) next.addEventListener('click', () => track.scrollBy({ left: slideWidth(), behavior: 'smooth' }));
    track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  // Parallax on hero media
  const heroImg = document.querySelector('.hero__media img');
  if (heroImg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const y = Math.min(window.scrollY, 800);
          heroImg.style.transform = `translate3d(0, ${y * 0.2}px, 0) scale(1.05)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
})();
