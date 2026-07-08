/* ============================================================
   Global command-palette search — self-contained, loads on every
   page (both design systems). Open with Cmd/Ctrl-K or "/" or the
   nav search button. Injects its own styles + overlay + index.
   No dependencies.
   ============================================================ */
(function () {
  'use strict';
  if (window.__ckSearch) return; window.__ckSearch = true;

  /* ---- Record this page as visited (read-progress; hubs read this) ---- */
  try {
    var _vk = 'ck-visited';
    var _vv = JSON.parse(localStorage.getItem(_vk) || '{}') || {};
    var _pg = (location.pathname.split('/').pop() || '').trim();
    if (!_pg) _pg = 'index.html';
    _vv[_pg] = Date.now();
    localStorage.setItem(_vk, JSON.stringify(_vv));
  } catch (e) {}

  /* ---- Search index (curated: pages + key reference terms) ---- */
  var IDX = [
    // Primary pages
    { t: 'Home', u: 'index.html', c: 'Page', k: 'portfolio overview start' },
    { t: 'Résumé / CV', u: 'cv.html', c: 'Page', k: 'cv resume print pdf download' },
    { t: 'Contact', u: 'index.html#contact', c: 'Page', k: 'email hire available' },
    { t: 'Colophon — how this site is built', u: 'colophon.html', c: 'Page', k: 'system design tokens stack' },
    // Business Architecture
    { t: 'Business Architecture Hub', u: 'business-architecture.html', c: 'Business Arch', k: 'bizbok togaf archimate primer' },
    { t: 'Capability Map', u: 'capability-map.html', c: 'Business Arch', k: 'capability heat map maturity bizbok' },
    { t: 'Value Streams', u: 'value-streams.html', c: 'Business Arch', k: 'value stream stakeholder stage cross map' },
    { t: 'Target Operating Model', u: 'operating-model.html', c: 'Business Arch', k: 'tom operating model current future dimensions' },
    { t: 'Business Architecture Glossary', u: 'ba-glossary.html', c: 'Business Arch', k: 'bizbok togaf adm archimate glossary' },
    // SAP design cluster
    { t: 'Technical Coding & Business Flow', u: 'sap-design.html', c: 'SAP Design', k: 'abap code viewer posting simulator ricefw' },
    { t: 'Functional Specification (FSD)', u: 'functional-specification.html', c: 'SAP Design', k: 'fsd functional spec requirement traceability' },
    { t: 'Business Process Master List', u: 'business-process-map.html', c: 'SAP Design', k: 'bpml r2r o2c p2p process' },
    { t: 'Data Migration & Cutover', u: 'data-migration-cutover.html', c: 'SAP Design', k: 'migration ltmc cutover go no go runbook' },
    { t: 'Integration Architecture', u: 'integration-architecture.html', c: 'SAP Design', k: 'interface idoc bapi odata cpi integration' },
    // SAP reference
    { t: 'SAP Knowledge Hub', u: 'knowledge-hub.html', c: 'SAP Reference', k: 'sap hub map reading path' },
    { t: 'SAP Glossary & T-codes', u: 'glossary.html', c: 'SAP Reference', k: 'glossary tcode reference search' },
    { t: 'RICEFW Register', u: 'ricefw-register.html', c: 'SAP Reference', k: 'ricefw report interface conversion enhancement form workflow' },
    { t: 'Metrics, Audited', u: 'metrics.html', c: 'SAP Reference', k: 'metrics kpi reconcile transparency' },
    // FI Tax
    { t: 'Functional Module of Finance — SAP FI', u: 'finance-functional-module.html', c: 'SAP FI Tax', k: 'fi tax vat wht close pttep journal' },
    { t: 'FI Tax Consultant — Scope of Work', u: 'fi-tax-consultant-scope.html', c: 'SAP FI Tax', k: 'fi tax scope pttep petroleum hypercare readiness' },
    // Projects
    { t: 'Inventory & Procurement (P2P)', u: 'project1.html', c: 'Project', k: 'procurement inventory p2p mm' },
    { t: 'Strategic Pricing & AR', u: 'project2.html', c: 'Project', k: 'pricing ar receivables sd' },
    { t: 'CRM Star Reward Loyalty', u: 'project3.html', c: 'Project', k: 'loyalty crm uat defect' },
    { t: 'STEM Portfolio Financial Tracking', u: 'project4.html', c: 'Project', k: 'stem billing profitability copa' },
    { t: 'FPDU Assist Device (MMTh Award)', u: 'project5.html', c: 'Project', k: 'fpdu mmth mitsubishi award sap procurement' },
    { t: 'MUVMI Regen-Brake', u: 'muvmi.html', c: 'Project', k: 'muvmi ev regen brake' },
    { t: 'LiDAR Autonomous Driving (DDPG)', u: 'senior-project.html', c: 'Project', k: 'lidar ddpg reinforcement learning ai' },
    // Key SAP T-codes → glossary
    { t: 'OB40 — tax account determination', u: 'glossary.html', c: 'T-code', k: 'ob40 tax account gl' },
    { t: 'FTXP — define tax codes', u: 'glossary.html', c: 'T-code', k: 'ftxp tax code vat' },
    { t: 'OBYC — MM account determination', u: 'glossary.html', c: 'T-code', k: 'obyc bsx wrx inventory' },
    { t: 'VKOA — revenue account determination', u: 'glossary.html', c: 'T-code', k: 'vkoa sd revenue' },
    { t: 'FB60 / FB70 — post AP / AR invoice', u: 'glossary.html', c: 'T-code', k: 'fb60 fb70 invoice post' },
    { t: 'MIGO / MIRO — goods receipt / invoice', u: 'glossary.html', c: 'T-code', k: 'migo miro goods receipt' },
    { t: 'PP30 — Thai VAT filing', u: 'glossary.html', c: 'T-code', k: 'pp30 vat filing thai' },
    { t: 'OB52 — open/close posting periods', u: 'glossary.html', c: 'T-code', k: 'ob52 period close' },
    { t: 'ACDOCA — Universal Journal', u: 'glossary.html', c: 'Concept', k: 'acdoca universal journal s4hana' },
    { t: 'RICEFW — custom development types', u: 'glossary.html', c: 'Concept', k: 'ricefw report interface conversion' },
    { t: 'LTMC — S/4HANA Migration Cockpit', u: 'glossary.html', c: 'T-code', k: 'ltmc migration cockpit' },
    { t: 'Condition technique — SAP pricing', u: 'glossary.html', c: 'Concept', k: 'condition technique pricing' },
    // BA terms → ba-glossary
    { t: 'BIZBOK — Business Architecture body of knowledge', u: 'ba-glossary.html', c: 'BA term', k: 'bizbok guild framework' },
    { t: 'TOGAF ADM — architecture development method', u: 'ba-glossary.html', c: 'BA term', k: 'togaf adm phase b bdat' },
    { t: 'Business Capability', u: 'ba-glossary.html', c: 'BA term', k: 'capability what noun' },
    { t: 'Value Stream (BIZBOK)', u: 'ba-glossary.html', c: 'BA term', k: 'value stream stakeholder' },
    { t: 'Capability-Based Planning', u: 'ba-glossary.html', c: 'BA term', k: 'capability based planning' },
    { t: 'Target Operating Model (TOM)', u: 'ba-glossary.html', c: 'BA term', k: 'tom operating model' },
    { t: 'Heat Map (capability)', u: 'capability-map.html', c: 'Technique', k: 'heat map maturity assessment' },
    // Capabilities → capability-map
    { t: 'Customer Management (capability)', u: 'capability-map.html', c: 'Capability', k: 'customer management' },
    { t: 'Finance Management (capability)', u: 'capability-map.html', c: 'Capability', k: 'finance management accounting' },
    { t: 'Data & Analytics (capability)', u: 'capability-map.html', c: 'Capability', k: 'data analytics governance' },
    { t: 'Supply Chain Management (capability)', u: 'capability-map.html', c: 'Capability', k: 'supply chain' },
    { t: 'Strategy Management (capability)', u: 'capability-map.html', c: 'Capability', k: 'strategy management' },
    // Value streams
    { t: 'Order to Cash (value stream)', u: 'value-streams.html', c: 'Value stream', k: 'order to cash o2c' },
    { t: 'Acquire to Onboard (value stream)', u: 'value-streams.html', c: 'Value stream', k: 'acquire onboard customer' }
  ];

  /* ---- Styles (self-contained; readable on any page/theme) ---- */
  var css = [
    '.cks-ov{position:fixed;inset:0;z-index:3000;display:none;align-items:flex-start;justify-content:center;',
    'background:rgba(2,6,23,.6);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);padding:12vh 1rem 1rem;}',
    '.cks-ov.on{display:flex;}',
    '.cks-modal{width:100%;max-width:640px;background:#0f172a;border:1px solid #334155;border-radius:14px;',
    'box-shadow:0 30px 80px -20px rgba(0,0,0,.7);overflow:hidden;font-family:Inter,system-ui,sans-serif;',
    'animation:cksIn .16s cubic-bezier(0.16,1,0.3,1);}',
    '@keyframes cksIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}',
    '.cks-inwrap{display:flex;align-items:center;gap:.6rem;padding:.9rem 1.1rem;border-bottom:1px solid #1e293b;}',
    '.cks-inwrap svg{flex-shrink:0;color:#64748b;}',
    '.cks-in{flex:1;background:transparent;border:0;outline:none;color:#f1f5f9;font-size:1.05rem;font-family:inherit;}',
    '.cks-in::placeholder{color:#64748b;}',
    '.cks-esc{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:.62rem;color:#94a3b8;border:1px solid #334155;border-radius:5px;padding:.15rem .4rem;}',
    '.cks-list{max-height:52vh;overflow-y:auto;padding:.4rem;overscroll-behavior:contain;}',
    '.cks-cat{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:.58rem;letter-spacing:.08em;text-transform:uppercase;color:#64748b;padding:.6rem .8rem .25rem;}',
    '.cks-item{display:flex;align-items:center;gap:.7rem;padding:.55rem .8rem;border-radius:8px;cursor:pointer;color:#e2e8f0;text-decoration:none;}',
    '.cks-item .nm{flex:1;font-size:.92rem;line-height:1.3;}',
    '.cks-item .tag{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:.56rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:#93c5fd;background:rgba(59,130,246,.14);border:1px solid rgba(59,130,246,.3);border-radius:4px;padding:.1rem .38rem;flex-shrink:0;}',
    '.cks-item.sel,.cks-item:hover{background:#1e293b;}',
    '.cks-item.sel .nm{color:#fff;}',
    '.cks-item mark{background:rgba(59,130,246,.32);color:#fff;border-radius:2px;padding:0 1px;}',
    '.cks-empty{padding:1.6rem;text-align:center;color:#64748b;font-size:.9rem;}',
    '.cks-foot{display:flex;gap:1.1rem;padding:.55rem 1.1rem;border-top:1px solid #1e293b;font-family:ui-monospace,"JetBrains Mono",monospace;font-size:.62rem;color:#64748b;}',
    '.cks-foot b{color:#94a3b8;font-weight:600;}',
    '.cks-btn{appearance:none;display:inline-flex;align-items:center;gap:.4rem;background:transparent;border:1px solid currentColor;color:inherit;',
    'opacity:.7;border-radius:7px;padding:.3rem .55rem;cursor:pointer;font:inherit;font-size:.72rem;transition:opacity .2s;margin-right:.3rem;}',
    '.cks-btn:hover{opacity:1;}',
    '.cks-btn .kbd{font-family:ui-monospace,"JetBrains Mono",monospace;font-size:.6rem;opacity:.8;}',
    '@media(max-width:640px){.cks-btn .kbd{display:none;}.cks-ov{padding-top:6vh;}}',
    '@media(prefers-reduced-motion:reduce){.cks-modal{animation:none;}}',
    '.tcode{cursor:pointer;}',
    '.tcode.cks-copied{outline:2px solid var(--accent,#3b82f6);outline-offset:1px;}',
    '.cks-toast{position:fixed;left:50%;bottom:2.4rem;transform:translateX(-50%) translateY(10px);z-index:3100;background:#0f172a;color:#f1f5f9;border:1px solid #334155;border-radius:100px;padding:.5rem 1.15rem;font-family:Inter,system-ui,sans-serif;font-size:.82rem;box-shadow:0 14px 34px -12px rgba(0,0,0,.6);opacity:0;pointer-events:none;transition:opacity .2s,transform .2s;}',
    '.cks-toast.on{opacity:1;transform:translateX(-50%) translateY(0);}'
  ].join('');
  var style = document.createElement('style'); style.textContent = css; document.head.appendChild(style);

  /* ---- Overlay DOM ---- */
  var ov = document.createElement('div');
  ov.className = 'cks-ov'; ov.setAttribute('role', 'dialog'); ov.setAttribute('aria-modal', 'true'); ov.setAttribute('aria-label', 'Search the site');
  ov.innerHTML =
    '<div class="cks-modal">' +
      '<div class="cks-inwrap"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg>' +
      '<input class="cks-in" type="text" placeholder="Search pages, T-codes, capabilities…" aria-label="Search" autocomplete="off" spellcheck="false">' +
      '<span class="cks-esc">esc</span></div>' +
      '<div class="cks-list" id="cksList"></div>' +
      '<div class="cks-foot"><span><b>↑↓</b> navigate</span><span><b>↵</b> open</span><span><b>esc</b> close</span></div>' +
    '</div>';
  document.body.appendChild(ov);
  var input = ov.querySelector('.cks-in');
  var list = ov.querySelector('#cksList');
  var lastFocus = null, results = [], sel = 0;

  function esc(s) { return s.replace(/[&<>]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]; }); }
  function hl(text, q) {
    if (!q) return esc(text);
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  }
  function search(q) {
    q = q.trim().toLowerCase();
    if (!q) return IDX.slice(0, 8);
    var scored = [];
    IDX.forEach(function (it) {
      var hay = (it.t + ' ' + it.k + ' ' + it.c).toLowerCase();
      var i = hay.indexOf(q);
      if (i < 0) return;
      // rank: title match beats keyword; earlier position beats later
      var ti = it.t.toLowerCase().indexOf(q);
      scored.push({ it: it, score: (ti >= 0 ? ti : 100 + i) });
    });
    scored.sort(function (a, b) { return a.score - b.score; });
    return scored.slice(0, 30).map(function (s) { return s.it; });
  }
  function render() {
    var q = input.value;
    results = search(q);
    sel = 0;
    if (!results.length) { list.innerHTML = '<div class="cks-empty">No match for “' + esc(q.trim()) + '”.</div>'; return; }
    var html = '', lastCat = null;
    results.forEach(function (it, i) {
      if (it.c !== lastCat) { html += '<div class="cks-cat">' + esc(it.c) + '</div>'; lastCat = it.c; }
      html += '<a class="cks-item' + (i === 0 ? ' sel' : '') + '" href="' + it.u + '" data-i="' + i + '">' +
        '<span class="nm">' + hl(it.t, q.trim()) + '</span><span class="tag">' + esc(it.c) + '</span></a>';
    });
    list.innerHTML = html;
    list.querySelectorAll('.cks-item').forEach(function (el) {
      el.addEventListener('mouseenter', function () { setSel(+el.getAttribute('data-i')); });
    });
  }
  function setSel(i) {
    var items = list.querySelectorAll('.cks-item');
    if (!items.length) return;
    sel = (i + items.length) % items.length;
    items.forEach(function (el, k) { el.classList.toggle('sel', k === sel); });
    var cur = items[sel]; if (cur) cur.scrollIntoView({ block: 'nearest' });
  }
  function go() {
    var items = list.querySelectorAll('.cks-item');
    if (items[sel]) window.location.href = items[sel].getAttribute('href');
  }
  function open() {
    lastFocus = document.activeElement;
    ov.classList.add('on'); input.value = ''; render();
    setTimeout(function () { input.focus(); }, 0);
  }
  function close() {
    ov.classList.remove('on');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  input.addEventListener('input', render);
  ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel(sel + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel(sel - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(); }
    else if (e.key === 'Escape') { e.preventDefault(); close(); }
  });

  // Global shortcuts: Cmd/Ctrl-K, or "/" when not typing
  document.addEventListener('keydown', function (e) {
    var mod = e.metaKey || e.ctrlKey;
    if (mod && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); ov.classList.contains('on') ? close() : open(); return; }
    if (e.key === '/' && !ov.classList.contains('on')) {
      var t = e.target, tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (t && t.isContentEditable)) return;
      e.preventDefault(); open();
    }
  });

  // Discoverable trigger: insert a search button before the theme toggle
  function makeBtn() {
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'cks-btn'; b.setAttribute('aria-label', 'Search (Ctrl-K)'); b.title = 'Search — Ctrl/⌘ K';
    var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    b.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.3-4.3"></path></svg><span class="kbd">' + (isMac ? '⌘K' : 'Ctrl K') + '</span>';
    b.addEventListener('click', open);
    return b;
  }
  function mount() {
    var themeBtn = document.getElementById('theme-toggle') || document.getElementById('themeBtn');
    if (themeBtn && themeBtn.parentNode && !document.querySelector('.cks-btn')) {
      var host = themeBtn.closest('li') || themeBtn;
      host.parentNode.insertBefore(makeBtn(), host);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();

  /* ---- Click-to-copy on T-codes / code chips (delegated; works for dynamic ones) ---- */
  var toastEl = null, toastT = null;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'cks-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    if (toastT) clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 1100);
  }
  document.addEventListener('click', function (e) {
    var el = e.target && e.target.closest ? e.target.closest('.tcode') : null;
    if (!el || el.closest('a')) return;              // don't hijack T-codes that are links
    var txt = (el.textContent || '').trim();
    if (!txt) return;
    var ok = function () { el.classList.add('cks-copied'); setTimeout(function () { el.classList.remove('cks-copied'); }, 900); toast('Copied “' + txt + '”'); };
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(ok, function () {}); }
    else { try { var ta = document.createElement('textarea'); ta.value = txt; ta.style.position = 'fixed'; ta.style.opacity = '0'; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); ok(); } catch (_) {} }
  });
})();
