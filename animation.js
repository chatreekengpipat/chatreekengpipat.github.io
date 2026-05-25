// =========================================
// CHATREE PORTFOLIO · Premium Animations
// =========================================

(function() {
  'use strict';

  // ===== Scroll Reveal with Intersection Observer =====
  function initScrollReveal() {
    const reveals = document.querySelectorAll('section');

    const observerOpts = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.08
    };

    // Auto-tag sections as reveals
    reveals.forEach((section, idx) => {
      if (idx === 0) return; // Skip hero (has its own animation)
      section.classList.add('reveal');
    });

    // Auto-tag grid containers as stagger
    const staggerTargets = document.querySelectorAll(
      '.impact-strip, .methodology-grid, .focus-grid, .projects-grid, ' +
      '.tools-grid, .process-flow, .photo-grid, .ideas-grid, ' +
      '.coaches-grid, .subjects-grid, .hyperparam-grid, .skill-cat-grid, ' +
      '.contact-grid, .results-banner'
    );
    staggerTargets.forEach(el => el.classList.add('stagger'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOpts);

    document.querySelectorAll('.reveal, .reveal-scale, .reveal-left, .reveal-right, .stagger').forEach(el => {
      observer.observe(el);
    });
  }

  // ===== Nav scroll effect =====
  function initNavScroll() {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let lastScroll = 0;
    let ticking = false;

    function update() {
      const scrolled = window.scrollY;

      if (scrolled > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = scrolled;
      ticking = false;
    }

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  // ===== Magnetic hover effect on key cards =====
  function initMagneticEffect() {
    const magneticTargets = document.querySelectorAll(
      '.award-feature, .academic-feature, .hero-card, .impact-cell'
    );

    magneticTargets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Subtle magnetic pull (max 8px in any direction)
        const maxOffset = 6;
        const offsetX = (x / rect.width) * maxOffset;
        const offsetY = (y / rect.height) * maxOffset;

        el.style.setProperty('--magnetic-x', `${offsetX}px`);
        el.style.setProperty('--magnetic-y', `${offsetY}px`);
        el.style.transform = `translate(${offsetX}px, ${offsetY - 4}px) scale(1.02)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // ===== Smooth anchor scrolling =====
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();
        const top = target.offsetTop - 80;
        window.scrollTo({
          top: top,
          behavior: 'smooth'
        });
      });
    });
  }

  // ===== Mouse parallax on hero =====
  function initHeroParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const heroVisual = hero.querySelector('.hero-visual');
    if (!heroVisual) return;

    let rafId = null;

    hero.addEventListener('mousemove', (e) => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle parallax (max 10px)
        heroVisual.style.transform = `translate(${x * 10}px, ${y * 10}px)`;
        rafId = null;
      });
    });

    hero.addEventListener('mouseleave', () => {
      heroVisual.style.transform = '';
    });
  }

  // ===== Number counter animation =====
  function initCounters() {
    const counters = document.querySelectorAll('.impact-num, .hero-card-num, .academic-metric-val, .result-val');

    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        if (el.dataset.counted) return;
        el.dataset.counted = 'true';

        const text = el.textContent.trim();
        const match = text.match(/^([▲▼↑↓\s]*)([\d.,]+)(.*)$/);

        if (!match) return;

        const prefix = match[1] || '';
        const numStr = match[2];
        const suffix = match[3] || '';
        const num = parseFloat(numStr.replace(/,/g, ''));

        if (isNaN(num) || num === 0) return;

        const duration = 1200;
        const start = performance.now();
        const decimals = (numStr.split('.')[1] || '').length;

        function frame(now) {
          const progress = Math.min((now - start) / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = num * eased;

          let formatted;
          if (decimals > 0) {
            formatted = current.toFixed(decimals);
          } else {
            formatted = Math.round(current).toLocaleString('en-US');
          }

          el.textContent = prefix + formatted + suffix;

          if (progress < 1) {
            window.requestAnimationFrame(frame);
          } else {
            el.textContent = text; // Final exact value
          }
        }

        window.requestAnimationFrame(frame);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // ===== Generate floating tech particles =====
  function initTechParticles() {
    const container = document.getElementById('techParticles');
    if (!container) return;

    const numParticles = window.innerWidth < 768 ? 15 : 30;
    for (let i = 0; i < numParticles; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = -Math.random() * 8 + 's';
      particle.style.animationDuration = (6 + Math.random() * 6) + 's';
      const size = 2 + Math.random() * 4;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.opacity = 0.3 + Math.random() * 0.4;
      container.appendChild(particle);
    }
  }

  // ===== Init when DOM ready =====
  function init() {
    initScrollReveal();
    initNavScroll();
    initSmoothScroll();
    initHeroParallax();
    initCounters();
    initTechParticles();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
