// Theme toggle with persistence
(function() {
  const root = document.documentElement;

  // Initialize theme
  function getInitialTheme() {
    try {
      const saved = localStorage.getItem('theme');
      if (saved) return saved;
    } catch (e) {}
    // Default to light mode for professional first impression
    return 'light';
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
