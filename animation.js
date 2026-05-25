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

  // ===== Canvas-based Neural Network Background =====
  function initNeuralBg() {
    const canvas = document.getElementById('neuralBg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width, height;
    let mouseX = -1000, mouseY = -1000;

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    // Track mouse for interactive particle effect
    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouseX = -1000; mouseY = -1000;
    });

    const particleCount = window.innerWidth < 768 ? 22 : 50;
    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: 1.2 + Math.random() * 1.8
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const rgb = isDark ? '96, 165, 250' : '37, 99, 235';
      const lineAlpha = isDark ? 0.22 : 0.16;
      const dotAlpha = isDark ? 0.7 : 0.55;

      // Update positions
      particles.forEach(p => {
        // Mouse repulsion (subtle)
        const dxM = p.x - mouseX;
        const dyM = p.y - mouseY;
        const dM = Math.sqrt(dxM * dxM + dyM * dyM);
        if (dM < 120 && dM > 0) {
          const force = (120 - dM) / 120 * 0.04;
          p.vx += (dxM / dM) * force;
          p.vy += (dyM / dM) * force;
        }

        // Friction
        p.vx *= 0.99;
        p.vy *= 0.99;

        p.x += p.vx;
        p.y += p.vy;

        // Bounce off edges
        if (p.x < 0) { p.x = 0; p.vx *= -1; }
        if (p.x > width) { p.x = width; p.vx *= -1; }
        if (p.y < 0) { p.y = 0; p.vy *= -1; }
        if (p.y > height) { p.y = height; p.vy *= -1; }

        // Min velocity to keep moving
        if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.05;
        if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.05;
      });

      // Draw connections
      const maxDist = 150;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * lineAlpha;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles with glow
      particles.forEach(p => {
        // Outer glow
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        gradient.addColorStop(0, `rgba(${rgb}, ${dotAlpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Inner dot
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb}, ${dotAlpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===== Init when DOM ready =====
  function init() {
    initScrollReveal();
    initNavScroll();
    initSmoothScroll();
    initHeroParallax();
    initCounters();
    initNeuralBg();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
