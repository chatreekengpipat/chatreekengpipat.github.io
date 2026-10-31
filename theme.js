// Theme toggle with persistence
(function() {
  const root = document.documentElement;

  function syncThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f7f4ee' : '#100c0d');
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
