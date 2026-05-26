// Theme toggle with persistence
(function() {
  const root = document.documentElement;

  // Initialize theme
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
    } catch (e) {}
    // Default to dark mode for the premium tech / physics vibe
    return 'dark';
  }

  root.setAttribute('data-theme', getInitialTheme());

  // Wait for DOM
  document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', function() {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch (e) {}
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

    headline.style.setProperty('--ck-ry', `${x * 8}deg`);
    headline.style.setProperty('--ck-rx', `${y * -6}deg`);
  });

  headline.addEventListener('mouseleave', () => {
    headline.style.setProperty('--ck-ry', '0deg');
    headline.style.setProperty('--ck-rx', '0deg');
  });
})();