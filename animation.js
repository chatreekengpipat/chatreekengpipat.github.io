// =========================================
// CHATREE PORTFOLIO · Premium Animations v8
// =========================================

(function() {
  'use strict';

  // Mark JS as available (lets CSS opt into JS-only enhancements safely).
  document.documentElement.classList.add('js');

  // Single source of truth for motion preference. Honoured by every JS-driven
  // effect below so reduced-motion users get a calm, static page.
  const reduceMotionMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReducedMotion = () => reduceMotionMQ.matches;

  // ===== 1. Smart Scroll Reveal (v10) =====
  // This function ONLY tags which blocks should animate (sets [data-reveal]).
  // ALL motion + visibility is handled by a pure CSS scroll-driven animation
  // (styles.css "SMART SCROLL REVEAL"). There is deliberately NO observer and
  // NO opacity toggling here: a JS/observer reveal can get stuck and trap
  // content invisible (it did, twice). A CSS view() timeline is derived from
  // scroll position at paint, so content can never be stuck — and if the
  // browser lacks support, or this script never runs, every block is visible.
  function initScrollReveal() {
    // Reduced-motion → don't even tag; CSS keeps everything calm and visible.
    if (prefersReducedMotion()) return;

    // Card/stat grids whose CHILDREN should cascade rather than the grid block.
    var GRID = '.impact-strip, .methodology-grid, .focus-grid, .projects-grid,' +
      '.tools-grid, .process-flow, .photo-grid, .ideas-grid, .coaches-grid,' +
      '.subjects-grid, .hyperparam-grid, .skill-cat-grid, .contact-grid,' +
      '.results-banner, .module-tags';
    // Cohesive blocks that should reveal as ONE unit (never descended into).
    var MEDIA = 'img, figure, table, svg, canvas, .dashboard-section,' +
      '.diagram-container, .code-window';
    var COHESIVE = GRID + ',' + MEDIA + ', .callout, .card, [class*="card"], blockquote';

    // Walk down single-wrapper chains (e.g. <section> → .content-section) to the
    // real content container, but stop at any self-contained block.
    function scopeOf(section) {
      var n = section;
      while (n.children.length === 1) {
        var c = n.firstElementChild;
        if (c.children.length <= 1 || c.matches(COHESIVE)) break;
        n = c;
      }
      return n;
    }

    function tag(el, kind) {
      if (!el || el.hasAttribute('data-reveal') || el.closest('[data-reveal]')) return;
      el.setAttribute('data-reveal', kind || (el.matches(MEDIA) ? 'media' : 'rise'));
    }

    document.querySelectorAll('section').forEach(function (section, idx) {
      if (idx === 0) return; // hero owns its own entrance
      var scope = scopeOf(section);
      Array.prototype.forEach.call(scope.children, function (child) {
        if (child.matches(GRID)) {
          // cascade grid items (CSS staggers them by nth-child)
          Array.prototype.forEach.call(child.children, function (c) { tag(c, 'grid'); });
        } else {
          tag(child);
        }
      });
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

  // ===== 3. Card FX — cursor spotlight (+ 3D tilt on big cards) =====
  // Pointer-tracked premium hover: a soft accent spotlight follows the cursor
  // inside the card (CSS reads --mx/--my), and the large feature cards add a
  // subtle 3D tilt toward the pointer. Replaces the old magnetic pull.
  // Pointer-only + motion-aware, so touch / reduced-motion get the calm card.
  function initCardFX() {
    if (prefersReducedMotion()) return;
    if (window.matchMedia('(hover: none)').matches) return;

    // Cards that get the cursor spotlight.
    const SPOT = '.project-card, .award-feature, .academic-feature, .focus-card,' +
      '.method-card, .tool-group, .edu-card, .impact-cell, .result-cell,' +
      '.algo-card, .task-section, .arch-mod, .trk-card, .hero-card';
    // The big feature cards also tilt.
    const TILT = '.award-feature, .academic-feature, .project-card';

    document.querySelectorAll(SPOT).forEach(card => {
      // Inject the spotlight layer (a child, so it never clobbers existing
      // ::before/::after used by the card).
      const glow = document.createElement('span');
      glow.className = 'fx-glow';
      glow.setAttribute('aria-hidden', 'true');
      card.appendChild(glow);
      card.classList.add('fx-spot');

      const tilt = card.matches(TILT);
      if (tilt) card.classList.add('fx-tilt');
      let raf = null;

      card.addEventListener('pointermove', (e) => {
        if (raf) return;
        raf = window.requestAnimationFrame(() => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
          if (tilt) {
            // Inline transform wins over every CSS hover rule cleanly; includes
            // the lift so the card still rises while it tilts.
            const ry = (px - 0.5) * 6;   // rotateY from horizontal position
            const rx = (0.5 - py) * 6;   // rotateX from vertical position
            card.style.transform =
              `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
          }
          raf = null;
        });
      });

      card.addEventListener('pointerleave', () => {
        if (tilt) card.style.transform = '';
      });
    });
  }

  // ===== 3b. Slim scroll-progress bar (index only) =====
  // Project pages already ship their own #fx-progress; only add ours when none
  // exists, so a page never gets two bars.
  function initScrollProgress() {
    if (document.getElementById('fx-progress') || document.getElementById('ck-progress')) return;
    const bar = document.createElement('div');
    bar.id = 'ck-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.appendChild(bar);

    let ticking = false;
    function update() {
      const root = document.documentElement;
      const max = (root.scrollHeight - root.clientHeight) || 1;
      const p = Math.min((root.scrollTop || window.scrollY) / max, 1);
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', () => {
      if (!ticking) { window.requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
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
    if (prefersReducedMotion()) return;
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
    // The final values are already in the DOM, so reduced-motion users simply
    // keep them — no count-up needed.
    if (prefersReducedMotion()) return;
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
    // Ambient, decorative motion — skip entirely for reduced-motion users.
    if (prefersReducedMotion()) return;
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
    initCardFX();          // cursor spotlight + 3D tilt
    initScrollProgress();  // slim top progress bar (index)
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
/* NOTE: the hero signature (#ckSignature) char-split reveal and 3D pointer
   tilt are owned by theme.js — not duplicated here, to avoid two competing
   mousemove listeners on the same element. */

/* ===== Mobile nav — left off-canvas drawer ===== */
(function () {
  var toggle = document.getElementById('nav-toggle');
  var drawer = document.getElementById('primary-nav');
  // Only wire up the JS drawer; bail cleanly on pages without the button markup.
  if (!toggle || !drawer || toggle.tagName !== 'BUTTON') return;

  var closeBtn = drawer.querySelector('.nav-drawer-close');
  var overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  document.body.appendChild(overlay);

  var mq = window.matchMedia('(max-width: 768px)');
  var lastFocus = null;

  function focusable() {
    return Array.prototype.slice.call(drawer.querySelectorAll('a[href], button'));
  }
  function isOpen() { return drawer.classList.contains('open'); }

  function open() {
    if (isOpen()) return;
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    overlay.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';          // lock body scroll
    document.addEventListener('keydown', onKey, true);
    (closeBtn || drawer).focus();
  }
  function close(restoreFocus) {
    if (!isOpen()) return;
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', onKey, true);
    if (restoreFocus !== false && lastFocus && lastFocus.focus) lastFocus.focus();
  }
  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab') return;
    var f = focusable(); if (!f.length) return;       // focus trap
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  toggle.addEventListener('click', function () { isOpen() ? close() : open(); });
  if (closeBtn) closeBtn.addEventListener('click', function () { close(); });
  overlay.addEventListener('click', function () { close(); });

  // Tapping a real link navigates → close the panel (theme toggle is a <button>, so it stays open).
  drawer.addEventListener('click', function (e) {
    if (e.target.closest('a[href]')) close(false);
  });

  // If the viewport grows back to the desktop bar while open, reset everything.
  mq.addEventListener('change', function (e) { if (!e.matches) close(false); });
})();
