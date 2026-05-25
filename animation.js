// =========================================
// CHATREE PORTFOLIO · Premium Animations v9 (FULL MERGE)
// =========================================

(function() {
  'use strict';

  // ===== 1. Scroll Reveal with Intersection Observer =====
  function initScrollReveal() {
    const reveals = document.querySelectorAll('section');

    const observerOpts = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.08
    };

    reveals.forEach((section, idx) => {
      if (idx === 0) return; 
      section.classList.add('reveal');
    });

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

  // ===== 2. Nav scroll effect =====
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

  // ===== 3. Magnetic hover effect on key cards =====
  function initMagneticEffect() {
    const magneticTargets = document.querySelectorAll(
      '.award-feature, .academic-feature, .hero-card, .impact-cell'
    );

    magneticTargets.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

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

  // ===== 4. Smooth anchor scrolling =====
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

  // ===== 5. Mouse parallax on hero =====
  function initHeroParallax() {
    const hero = document.querySelector('.hero, .hero-v7');
    if (!hero) return;

    const heroVisual = hero.querySelector('.hero-visual, .hero-v7-right, .hero-v7-photo-container');
    if (!heroVisual) return;

    let rafId = null;

    hero.addEventListener('mousemove', (e) => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        heroVisual.style.transform = `translate(${x * -15}px, ${y * -15}px)`;
        rafId = null;
      });
    });

    hero.addEventListener('mouseleave', () => {
      heroVisual.style.transform = 'translate(0px, 0px)';
    });
  }

  // ===== 6. Number counter animation =====
  function initCounters() {
    const counters = document.querySelectorAll('.impact-num, .hero-card-num, .academic-metric-val, .result-val, .workplace-stat-val');

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

        const duration = 1500; 
        const start = performance.now();
        const decimals = (numStr.split('.')[1] || '').length;

        function frame(now) {
          const progress = Math.min((now - start) / duration, 1);
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
            el.textContent = text; 
          }
        }

        window.requestAnimationFrame(frame);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    counters.forEach(el => counterObserver.observe(el));
  }

  // ===== 7. WORLD-CLASS NEURAL NETWORK BACKGROUND (Original) =====
  function initNeuralBg() {
    const canvas = document.getElementById('neuralBg') || document.getElementById('techCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let width, height;
    let mouse = { x: -1000, y: -1000, radius: 180 };

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

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000; 
      mouse.y = -1000;
    });
    window.addEventListener('scroll', () => {
       mouse.y = mouse.y; 
    }, { passive: true });

    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const particles = [];
    const connectionDistance = window.innerWidth < 768 ? 100 : 160;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.r = Math.random() * 1.5 + 1;
      }

      update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          this.vx -= forceDirectionX * force * 2.5 * 0.05;
          this.vy -= forceDirectionY * force * 2.5 * 0.05;
        }

        this.vx *= 0.98;
        this.vy *= 0.98;
        this.x += this.vx + ((Math.random() - 0.5) * 0.2);
        this.y += this.vy + ((Math.random() - 0.5) * 0.2);

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const rgb = isDark ? '96, 165, 250' : '37, 99, 235';
      const lineAlphaBase = isDark ? 0.3 : 0.2;
      const dotAlpha = isDark ? 0.8 : 0.6;

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < connectionDistance) {
            const opacity = (1 - dist / connectionDistance) * lineAlphaBase;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        gradient.addColorStop(0, `rgba(${rgb}, ${dotAlpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb}, ${dotAlpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      particles.forEach(p => {
        let dx = mouse.x - p.x;
        let dy = mouse.y - p.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < mouse.radius) {
            ctx.beginPath();
            const opacity = (1 - dist / mouse.radius) * lineAlphaBase * 1.5;
            ctx.strokeStyle = `rgba(${rgb}, ${opacity})`;
            ctx.lineWidth = 1.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
      });

      requestAnimationFrame(animate);
    }
    animate();
  }

  // ===== 8. FLOW FIELD BACKGROUND (NEW - Energy Waves) =====
  function initFlowField() {
    const canvas = document.getElementById('flowFieldCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const particles = [];
    const particleCount = Math.min(width < 768 ? 40 : 100, 150);

    class FlowParticle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = 0;
            this.vy = 0;
            this.acceleration = 0.1;
            this.speedMax = Math.random() * 0.5 + 0.3;
            this.color = `rgba(96, 165, 250, ${Math.random() * 0.2 + 0.1})`;
        }

        update() {
            const angle = (this.x * 0.005) + (this.y * 0.005) + (Date.now() * 0.0005);
            this.vx += Math.cos(angle) * this.acceleration;
            this.vy += Math.sin(angle) * this.acceleration;

            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > this.speedMax) {
                this.vx = (this.vx / speed) * this.speedMax;
                this.vy = (this.vy / speed) * this.speedMax;
            }

            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new FlowParticle());
    }

    function animateFlowField() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateFlowField);
    }
    animateFlowField();
  }

  // ===== 9. GIGANTIC TITLE STAGGER REVEAL (NEW) =====
  function initTitleReveal() {
    const maskText = document.querySelector('.mask-text');
    if (maskText) {
        setTimeout(() => {
            maskText.style.transition = 'opacity 1s ease, transform 1s ease';
            maskText.style.opacity = '1';
            maskText.style.transform = 'translateY(0)';
        }, 300);
    }
  }

  // ===== INIT ALL SCRIPTS =====
  function init() {
    initScrollReveal();
    initNavScroll();
    initMagneticEffect();
    initSmoothScroll();
    initHeroParallax();
    initCounters();
    initNeuralBg();       // ของเดิม
    initFlowField();      // ของใหม่
    initTitleReveal();    // ของใหม่
  }

  // ป้องกันปัญหาโหลดซ้อนทับกัน
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();