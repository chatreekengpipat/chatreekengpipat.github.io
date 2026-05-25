// =========================================
// CHATREE PORTFOLIO · Premium Animations v8
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

        // Subtle magnetic pull
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

    const heroVisual = hero.querySelector('.hero-visual, .hero-v7-right');
    if (!heroVisual) return;

    let rafId = null;

    hero.addEventListener('mousemove', (e) => {
      if (rafId) return;

      rafId = window.requestAnimationFrame(() => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle parallax
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

        const duration = 1500; // ทำให้วิ่งช้าลงนิดนึงเพื่อความหรูหรา
        const start = performance.now();
        const decimals = (numStr.split('.')[1] || '').length;

        function frame(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
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

  // ===== 7. WORLD-CLASS NEURAL NETWORK BACKGROUND (UPGRADED) =====
  function initNeuralBg() {
    // รองรับทั้ง id="neuralBg" (เดิม) และ "techCanvas" (ใหม่)
    const canvas = document.getElementById('neuralBg') || document.getElementById('techCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1; // ทำให้เส้นคมกริบบนจอ Retina/4K
    let width, height;
    
    // ตั้งค่าเมาส์
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

    // ตรวจจับเมาส์แบบ Smooth
    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    window.addEventListener('mouseleave', () => {
      mouse.x = -1000; 
      mouse.y = -1000;
    });
    window.addEventListener('scroll', () => {
       // อัปเดตตำแหน่งเมาส์ตอน Scroll เพื่อไม่ให้จุดค้าง
       mouse.y = mouse.y; 
    }, { passive: true });

    // คำนวณจุดตามขนาดจอ ไม่ให้รกเกินไปและไม่กินสเปค
    const particleCount = window.innerWidth < 768 ? 40 : 80;
    const particles = [];
    const connectionDistance = window.innerWidth < 768 ? 100 : 160;

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6; // ความเร็วเริ่มต้น (สมูทขึ้น)
        this.vy = (Math.random() - 0.5) * 0.6;
        this.baseX = this.x;
        this.baseY = this.y;
        this.r = Math.random() * 1.5 + 1; // ขนาดจุด
      }

      update() {
        // คำนวณฟิสิกส์หลบเมาส์ (Interactive Repel)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const force = (mouse.radius - distance) / mouse.radius;
          const directionX = forceDirectionX * force * 2.5; // ความแรงในการผลัก
          const directionY = forceDirectionY * force * 2.5;
          
          this.vx -= directionX * 0.05;
          this.vy -= directionY * 0.05;
        }

        // เพิ่มแรงเสียดทาน (Friction) ให้การเคลื่อนไหวดูเป็นธรรมชาติ
        this.vx *= 0.98;
        this.vy *= 0.98;

        // บวกความเร็วปกติเข้าไปเลี้ยงไว้ไม่ให้หยุดนิ่ง
        this.x += this.vx + ((Math.random() - 0.5) * 0.2);
        this.y += this.vy + ((Math.random() - 0.5) * 0.2);

        // ชนขอบเด้งกลับแบบเนียนๆ
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // กันจุดวิ่งหายออกนอกจอ
        this.x = Math.max(0, Math.min(width, this.x));
        this.y = Math.max(0, Math.min(height, this.y));
      }
    }

    // สร้าง Particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // ดึงสีตาม Theme ปัจจุบัน (เชื่อมกับไฟล์ theme.js ของคุณ)
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const rgb = isDark ? '96, 165, 250' : '37, 99, 235'; // ฟ้าสว่าง / น้ำเงิน
      const lineAlphaBase = isDark ? 0.3 : 0.2;
      const dotAlpha = isDark ? 0.8 : 0.6;

      // วนลูปวาดการเชื่อมต่อ
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          // ตีเส้นถ้าอยู่ใกล้กัน
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

      // วาดจุด (Particles)
      particles.forEach(p => {
        // สร้างรัศมีแสงเรืองรอง (Outer Glow)
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        gradient.addColorStop(0, `rgba(${rgb}, ${dotAlpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${rgb}, 0)`);
        
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, p.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // จุดแกนกลาง (Inner Dot)
        ctx.beginPath();
        ctx.fillStyle = `rgba(${rgb}, ${dotAlpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Interactive Mouse Connection (ลากเส้นจากเมาส์ไปยังจุดที่อยู่ใกล้)
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

  // ===== Init when DOM ready =====
  function init() {
    initScrollReveal();
    initNavScroll();
    initMagneticEffect(); // เพิ่มกลับเข้ามาให้สมบูรณ์
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
/* ====================================
   ADVANCED ANIMATIONS v8
   ==================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* --- 1. FLOW FIELD BACKGROUND (Canvas) --- */
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
            // สร้างคลื่นพลังงาน
            const angle = (this.x * 0.005) + (this.y * 0.005) + (Date.now() * 0.0005);
            this.vx += Math.cos(angle) * this.acceleration;
            this.vy += Math.sin(angle) * this.acceleration;

            // ล็อกความเร็วสูงสุด
            const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
            if (speed > this.speedMax) {
                this.vx = (this.vx / speed) * this.speedMax;
                this.vy = (this.vy / speed) * this.speedMax;
            }

            this.x += this.vx;
            this.y += this.vy;

            // กลับมาอีกฝั่งถ้าหลุดจอ
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

    /* --- 2. GIGANTIC TITLE STAGGER (Reveal) --- */
    // เราจะใช้ CSS Keyframes แทน GSAP เพื่อความประหยัด (เนื่องจากไฟล์เดิมไม่ได้รวม GSAP ไว้)
    const megaTitle = document.querySelector('.mega-title');
    const maskText = document.querySelector('.mask-text');
    
    // ค่อยๆ เปิดชื่อ "KENGPIPAT" ออกมาอย่างนุ่มนวล
    if (maskText) {
        // ใช้ setTimeout เพื่อให้เกิด Stagger หลังโหลดหน้าเว็บ
        setTimeout(() => {
            maskText.style.transition = 'opacity 1s ease, transform 1s ease';
            maskText.style.opacity = '1';
            maskText.style.transform = 'translateY(0)';
        }, 300); // ดีเลย์นิดนึง
    }

    // Animation อื่นๆ ที่มีอยู่แล้ว (Parallax, Reveal) ยังคงทำงานตามปกติครับ
});
// =====================================================
// CLEAN REFLECTION HEADLINE FX
// Paste at the end of animation.js
// =====================================================

(function () {
  function wrapHeadline(el) {
    if (!el || el.dataset.reflectReady === 'true') return;
    el.dataset.reflectReady = 'true';
    el.classList.add('reflect-headline');

    const oldSpans = el.querySelectorAll('.fx-headline-word, .lux-word');
    if (oldSpans.length) {
      oldSpans.forEach((span, i) => {
        span.className = 'reflect-word';
        span.dataset.word = span.textContent;
        span.style.setProperty('--i', i);
      });
      return;
    }

    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
      if (walker.currentNode.nodeValue.trim()) nodes.push(walker.currentNode);
    }

    let i = 0;

    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();

      node.nodeValue.split(/(\s+)/).forEach((part) => {
        if (!part) return;

        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          return;
        }

        const span = document.createElement('span');
        span.className = 'reflect-word';
        span.textContent = part;
        span.dataset.word = part;
        span.style.setProperty('--i', i);
        span.style.animationDelay = `${i * 80}ms`;
        i += 1;

        frag.appendChild(span);
      });

      node.parentNode.replaceChild(frag, node);
    });
  }

  function initReflectHeadlines() {
    const targets = document.querySelectorAll(
      '.hero-v7 h1, .mega-title, .project-hero h1, .section-title, .contact-text h2'
    );

    targets.forEach((el) => {
      wrapHeadline(el);

      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        el.style.setProperty('--ry', `${x * 7}deg`);
        el.style.setProperty('--rx', `${y * -5}deg`);
      });

      el.addEventListener('mouseleave', () => {
        el.style.setProperty('--ry', '0deg');
        el.style.setProperty('--rx', '0deg');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initReflectHeadlines);
  } else {
    initReflectHeadlines();
  }
})();