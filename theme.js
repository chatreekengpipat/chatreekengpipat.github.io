// Theme toggle with persistence
(function() {
  const root = document.documentElement;

  function syncThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f4ee' : '#0b1215');
  }

  function applyTheme(theme, persist) {
    root.classList.add('theme-switching');
    root.setAttribute('data-theme', theme);
    syncThemeColor(theme);
    if (persist) {
      try { localStorage.setItem('theme', theme); } catch (e) {}
    }
    try { document.dispatchEvent(new CustomEvent('ck:themechange', { detail: { theme: theme } })); } catch (e) {}
    window.setTimeout(function () { root.classList.remove('theme-switching'); }, 760);
  }

  // Initialize theme
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
    } catch (e) {}
    // Default to dark mode for the premium tech / physics vibe
    return 'dark';
  }

  const initialTheme = getInitialTheme();
  root.setAttribute('data-theme', initialTheme);
  syncThemeColor(initialTheme);

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function() {
    syncThemeColor(root.getAttribute('data-theme'));
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function() {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next, true);
    });
  });
})();
(function () {
  const headline = document.getElementById('ckSignature');
  if (!headline || headline.dataset.ckReady === 'true') return;

  headline.dataset.ckReady = 'true';

  headline.querySelectorAll('.ck-signature__line').forEach((line, lineIndex) => {
    const text = line.textContent.trim();
    line.textContent = '';
    line.style.setProperty('--ck-line-delay', `${lineIndex * 140}ms`);

    [...text].forEach((char, index) => {
      const span = document.createElement('span');

      if (char === ' ') {
        span.className = 'ck-signature__space';
        span.innerHTML = '&nbsp;';
      } else {
        span.className = 'ck-signature__char';
        span.textContent = char;
        span.style.setProperty('--ck-i', index);
      }

      line.appendChild(span);
    });
  });

  headline.addEventListener('mousemove', (event) => {
    const rect = headline.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    headline.style.setProperty('--ck-ry', `${x * 3}deg`);
    headline.style.setProperty('--ck-rx', `${y * -2}deg`);
  });

  headline.addEventListener('mouseleave', () => {
    headline.style.setProperty('--ck-ry', '0deg');
    headline.style.setProperty('--ck-rx', '0deg');
  });
})();
