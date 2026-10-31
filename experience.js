/* ============================================================
   experience.js · evidence-first progressive enhancements
   ------------------------------------------------------------
   Visitor lens · evidence taxonomy · focus mode · bookmarks
   · continue reading · section deep links.

   No server, account or external dependency. State stays in this browser.
   Core content remains visible and navigable when JavaScript is unavailable.
   ============================================================ */
(function () {
  'use strict';
  if (window.CKExperience) return;

  var d = document, root = d.documentElement;
  var NS = 'ck:experience:v1:';

  function read(key, fallback) {
    try { var value = JSON.parse(localStorage.getItem(NS + key)); return value == null ? fallback : value; }
    catch (e) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(NS + key, JSON.stringify(value)); } catch (e) {}
  }
  function pageName() {
    var path = (location.pathname || '').replace(/\\/g, '/');
    return path.split('/').pop() || 'index.html';
  }
  function reduced() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  var CSS = [
    '.ck-exp{--xe-bg:var(--surface,var(--deep,#fff));--xe-bg2:var(--surface-2,var(--steel,#eee));--xe-page:var(--bg,var(--abyss,#fff));--xe-text:var(--text,var(--mist,#201b1c));--xe-muted:var(--text-muted,var(--haze,#62595a));--xe-accent:var(--accent,var(--gas,#7d1f24));--xe-metal:var(--gold,#c89a55);--xe-border:var(--border,var(--steel,#ded6c8));--xe-shadow:var(--shadow-lg,0 24px 70px rgba(0,0,0,.18));font-family:Inter,"IBM Plex Sans",system-ui,sans-serif}',
    '.ck-evidence-strip{max-width:1180px;margin:1.1rem auto;padding:0 1.5rem;position:relative;z-index:3}',
    '.ck-evidence-btn{width:100%;display:grid;grid-template-columns:auto 1fr auto;gap:.75rem;align-items:center;padding:.78rem 1rem;border:1px solid var(--xe-border);border-left:3px solid var(--xe-metal);border-radius:12px;background:color-mix(in srgb,var(--xe-bg) 94%,transparent);color:var(--xe-text);text-align:left;cursor:pointer;box-shadow:0 8px 30px color-mix(in srgb,var(--xe-page) 70%,transparent);transition:border-color .18s,transform .18s,box-shadow .22s}',
    '.ck-evidence-btn:hover{transform:translateY(-1px);border-color:color-mix(in srgb,var(--xe-metal) 60%,var(--xe-border));box-shadow:var(--xe-shadow)}',
    '.ck-evidence-type{font:700 .63rem/1.2 "JetBrains Mono","IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--xe-accent);white-space:nowrap}',
    '.ck-evidence-copy{color:var(--xe-muted);font-size:.8rem;line-height:1.35}',
    '.ck-evidence-more{color:var(--xe-metal);font:600 .66rem/1 "JetBrains Mono","IBM Plex Mono",monospace}',
    '.ck-tools{position:fixed;z-index:890;right:1rem;top:50%;transform:translateY(-50%);display:grid;gap:.45rem;padding:.42rem;border:1px solid var(--xe-border);border-radius:14px;background:color-mix(in srgb,var(--xe-bg) 90%,transparent);backdrop-filter:blur(16px) saturate(1.3);box-shadow:var(--xe-shadow)}',
    '.ck-tool{width:40px;height:40px;display:grid;place-items:center;border:1px solid transparent;border-radius:10px;background:transparent;color:var(--xe-muted);font:600 .72rem/1 "JetBrains Mono","IBM Plex Mono",monospace;cursor:pointer;transition:background .16s,color .16s,border-color .16s,transform .16s}',
    '.ck-tool:hover,.ck-tool[aria-pressed="true"]{background:color-mix(in srgb,var(--xe-accent) 12%,var(--xe-bg));color:var(--xe-accent);border-color:color-mix(in srgb,var(--xe-accent) 35%,transparent);transform:translateY(-1px)}',
    '.ck-tool svg{width:17px;height:17px}',
    '.ck-link-btn{display:inline-grid;place-items:center;width:28px;height:28px;margin-left:.55rem;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--xe-muted);cursor:pointer;opacity:.18;vertical-align:middle;transition:opacity .16s,background .16s,color .16s}',
    'section:hover .ck-link-btn,.ck-link-btn:focus-visible{opacity:1}.ck-link-btn:hover{background:var(--xe-bg2);color:var(--xe-accent)}',
    '.ck-exp-toast{position:fixed;z-index:1200;left:50%;bottom:1.2rem;transform:translate(-50%,12px);padding:.65rem .9rem;border:1px solid var(--xe-border);border-radius:10px;background:var(--xe-bg);color:var(--xe-text);box-shadow:var(--xe-shadow);font-size:.8rem;opacity:0;pointer-events:none;transition:opacity .2s,transform .2s}.ck-exp-toast.on{opacity:1;transform:translate(-50%,0)}',
    '.ck-evidence-dialog{width:min(620px,calc(100vw - 2rem));max-height:min(760px,calc(100vh - 2rem));padding:0;border:1px solid var(--xe-border);border-radius:18px;background:var(--xe-bg);color:var(--xe-text);box-shadow:0 40px 110px rgba(0,0,0,.35)}',
    '.ck-evidence-dialog::backdrop{background:rgba(5,12,14,.62);backdrop-filter:blur(5px)}',
    '.ck-dialog-head{display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;padding:1.35rem 1.45rem;border-bottom:1px solid var(--xe-border)}',
    '.ck-dialog-head small{display:block;color:var(--xe-metal);font:700 .62rem/1.2 "JetBrains Mono","IBM Plex Mono",monospace;letter-spacing:.1em;text-transform:uppercase;margin-bottom:.35rem}',
    '.ck-dialog-head h2{margin:0;font-size:1.4rem;color:var(--xe-text)}',
    '.ck-dialog-close{width:34px;height:34px;border:1px solid var(--xe-border);border-radius:9px;background:var(--xe-bg2);color:var(--xe-text);cursor:pointer}',
    '.ck-dialog-body{padding:1.3rem 1.45rem 1.5rem;overflow:auto}',
    '.ck-dialog-current{padding:1rem;border-left:3px solid var(--xe-metal);border-radius:0 10px 10px 0;background:var(--xe-bg2);margin-bottom:1.2rem}.ck-dialog-current b{display:block;color:var(--xe-accent);font:700 .68rem/1.2 "JetBrains Mono","IBM Plex Mono",monospace;letter-spacing:.06em;text-transform:uppercase;margin-bottom:.35rem}.ck-dialog-current p{margin:0;color:var(--xe-muted)}',
    '.ck-proof-list{display:grid;gap:.65rem}.ck-proof-row{display:grid;grid-template-columns:9.5rem 1fr;gap:1rem;padding-top:.65rem;border-top:1px solid var(--xe-border)}.ck-proof-row b{font:650 .68rem/1.35 "JetBrains Mono","IBM Plex Mono",monospace;color:var(--xe-text)}.ck-proof-row span{font-size:.82rem;color:var(--xe-muted)}',
    '.ck-continue{display:grid;grid-template-columns:auto 1fr auto;gap:.75rem;align-items:center;margin-top:1.3rem;padding:.8rem .9rem;border:1px solid var(--xe-border);border-radius:12px;background:var(--xe-bg);color:var(--xe-text);text-decoration:none}.ck-continue:hover{border-color:var(--xe-accent)}.ck-continue-k{color:var(--xe-metal);font:700 .61rem/1.2 "JetBrains Mono","IBM Plex Mono",monospace;letter-spacing:.08em;text-transform:uppercase}.ck-continue b{font-size:.84rem}.ck-continue i{font-style:normal;color:var(--xe-accent)}',
    'body.ck-focus-mode nav,body.ck-focus-mode .sitebar,body.ck-focus-mode footer,body.ck-focus-mode .rail,body.ck-focus-mode .toc,body.ck-focus-mode #ck-progress{display:none!important}',
    'body.ck-focus-mode{--bar-h:0px}.ck-focus-mode section,.ck-focus-mode .chapter,.ck-focus-mode main{max-width:980px!important;margin-inline:auto!important}.ck-focus-mode .ck-tools{top:auto;bottom:1rem;transform:none}',
    '@media(max-width:760px){.ck-tools{right:.65rem;top:auto;bottom:.65rem;transform:none;grid-auto-flow:column}.ck-evidence-strip{padding:0 .85rem}.ck-evidence-btn{grid-template-columns:1fr auto}.ck-evidence-copy{grid-column:1/-1}.ck-proof-row{grid-template-columns:1fr}.ck-link-btn{opacity:.65}}',
    '@media print{.ck-tools,.ck-evidence-strip,.ck-link-btn,.ck-exp-toast,.ck-evidence-dialog{display:none!important}}',
    '@media(prefers-reduced-motion:reduce){.ck-evidence-btn,.ck-tool,.ck-exp-toast{transition:none!important}}'
  ].join('\n');

  function installStyles() {
    if (d.getElementById('ck-experience-styles')) return;
    var style = d.createElement('style');
    style.id = 'ck-experience-styles'; style.textContent = CSS;
    d.head.appendChild(style);
    d.body.classList.add('ck-exp');
  }

  var toastNode, toastTimer;
  function toast(message) {
    if (!toastNode) {
      toastNode = d.createElement('div'); toastNode.className = 'ck-exp-toast';
      toastNode.setAttribute('role', 'status'); d.body.appendChild(toastNode);
    }
    toastNode.textContent = message; toastNode.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastNode.classList.remove('on'); }, 1500);
  }

  var PROOF = {
    delivered: { label: 'Delivered · Production ERP', copy: 'Implemented in a live operating environment; sensitive people and records are anonymized.' },
    current: { label: 'Current role · Public-safe summary', copy: 'A bounded account of current SAP responsibilities; client-confidential design and data are excluded.' },
    tested: { label: 'Tested · Anonymized case', copy: 'The method and outcome are grounded in hands-on testing; identifying project data is removed.' },
    model: { label: 'Illustrative · Standard SAP model', copy: 'A teaching model using sample data. Exact behavior remains configuration- and release-dependent.' },
    proposed: { label: 'Proposed SAP design', copy: 'A portfolio design exercise that demonstrates functional reasoning; it is not presented as a production SAP build.' },
    method: { label: 'Methodology · Illustrative', copy: 'A professional reference model based on standard practice and clearly stated assumptions, not a client assessment.' },
    evidence: { label: 'Audited · Delivery evidence', copy: 'Metrics reconcile to the documented project sources and reporting period shown on the page.' },
    engineering: { label: 'Delivered · Engineering project', copy: 'A completed engineering project with results, role boundaries and supporting evidence stated on the page.' }
  };

  function classification(file) {
    if (/^project[1-4]\.html$/.test(file)) return PROOF.delivered;
    if (/^(project5|muvmi|senior-project)\.html$/.test(file)) return PROOF.engineering;
    if (file === 'fi-tax-consultant-scope.html') return PROOF.current;
    if (file === 'oman-vat-report-case-study.html') return PROOF.tested;
    if (/^(fi-document-simulator|fico-config-simulator|finance-functional-module)\.html$/.test(file)) return PROOF.model;
    if (/^(sap-design|functional-specification|business-process-map|data-migration-cutover|integration-architecture|ricefw-register)\.html$/.test(file)) return PROOF.proposed;
    if (/^(business-architecture|capability-map|value-streams|information-map|organization-map|operating-model|traceability|ba-glossary)\.html$/.test(file)) return PROOF.method;
    if (file === 'metrics.html') return PROOF.evidence;
    return null;
  }

  var dialog;
  function evidenceDialog(current) {
    if (dialog) {
      var type = dialog.querySelector('.ck-dialog-current b');
      var copy = dialog.querySelector('.ck-dialog-current p');
      if (type) type.textContent = current ? current.label : 'Evidence labels';
      if (copy) copy.textContent = current ? current.copy : 'This page uses the evidence taxonomy below.';
      return dialog;
    }
    dialog = d.createElement('dialog'); dialog.className = 'ck-evidence-dialog';
    dialog.innerHTML = '<div class="ck-dialog-head"><div><small>Evidence lens</small><h2>What each claim represents</h2></div><button class="ck-dialog-close" type="button" aria-label="Close">×</button></div>' +
      '<div class="ck-dialog-body"><div class="ck-dialog-current"><b>' + (current ? current.label : 'Evidence labels') + '</b><p>' + (current ? current.copy : 'This page uses the evidence taxonomy below.') + '</p></div>' +
      '<div class="ck-proof-list">' +
      '<div class="ck-proof-row"><b>Delivered / Tested</b><span>Grounded in completed work or executed testing, with sensitive data anonymized.</span></div>' +
      '<div class="ck-proof-row"><b>Current role</b><span>Public-safe scope only. No confidential client design, data or internal object details.</span></div>' +
      '<div class="ck-proof-row"><b>Proposed design</b><span>Consultant reasoning and design skill, clearly separated from production ownership.</span></div>' +
      '<div class="ck-proof-row"><b>Standard SAP</b><span>Reference behavior that can vary by release, localization and configuration.</span></div>' +
      '<div class="ck-proof-row"><b>Illustrative</b><span>Sample figures, scenarios or maturity ratings used to explain the method.</span></div>' +
      '</div></div>';
    d.body.appendChild(dialog);
    dialog.querySelector('.ck-dialog-close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) {
      var r = dialog.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
    });
    return dialog;
  }
  function openEvidence(current) {
    var el = evidenceDialog(current);
    if (el.showModal) el.showModal(); else el.setAttribute('open', '');
  }

  function mountEvidence(current) {
    if (!current) return;
    var wrap = d.createElement('div'); wrap.className = 'ck-evidence-strip';
    wrap.innerHTML = '<button class="ck-evidence-btn" type="button"><span class="ck-evidence-type"></span><span class="ck-evidence-copy"></span><span class="ck-evidence-more">Details ↗</span></button>';
    wrap.querySelector('.ck-evidence-type').textContent = current.label;
    wrap.querySelector('.ck-evidence-copy').textContent = current.copy;
    wrap.querySelector('button').addEventListener('click', function () { openEvidence(current); });

    var anchor = d.querySelector('.project-hero, .hero, .hero-v7, .cover, .intro, main > header, .chapter');
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
    else {
      var nav = d.querySelector('nav, .sitebar');
      if (nav && nav.parentNode) nav.parentNode.insertBefore(wrap, nav.nextSibling);
      else d.body.insertBefore(wrap, d.body.firstChild);
    }
  }

  function copyText(text, done) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {}); return;
    }
    try {
      var ta = d.createElement('textarea'); ta.value = text; ta.style.cssText = 'position:fixed;opacity:0';
      d.body.appendChild(ta); ta.select(); d.execCommand('copy'); ta.remove(); done();
    } catch (e) {}
  }

  function mountSectionLinks() {
    d.querySelectorAll('section[id]').forEach(function (section) {
      var heading = section.querySelector(':scope > .section-header h2, :scope > h2, :scope > .inner > h2, :scope > .chapter__in > h2');
      if (!heading) {
        var candidates = section.querySelectorAll('h2, h3');
        for (var i = 0; i < candidates.length; i++) {
          if (candidates[i].closest('section') === section) { heading = candidates[i]; break; }
        }
      }
      if (!heading || heading.querySelector('.ck-link-btn')) return;
      var b = d.createElement('button'); b.type = 'button'; b.className = 'ck-link-btn';
      b.title = 'Copy link to this section'; b.setAttribute('aria-label', 'Copy link to ' + (heading.textContent || 'section').trim());
      b.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></svg>';
      b.addEventListener('click', function () {
        var url = location.href.split('#')[0] + '#' + encodeURIComponent(section.id);
        copyText(url, function () { toast('Section link copied'); });
      });
      heading.appendChild(b);
    });
  }

  function mountStoryRouter() {
    var router = d.querySelector('[data-story-router]');
    if (!router) return;
    var tabs = Array.prototype.slice.call(router.querySelectorAll('[data-story-tab]'));
    var panels = Array.prototype.slice.call(router.querySelectorAll('[data-story-panel]'));
    function activate(key, focus) {
      tabs.forEach(function (tab) {
        var on = tab.getAttribute('data-story-tab') === key;
        tab.setAttribute('aria-selected', on ? 'true' : 'false'); tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
      panels.forEach(function (panel) { panel.hidden = panel.getAttribute('data-story-panel') !== key; });
      write('lens', key);
    }
    tabs.forEach(function (tab, index) {
      tab.addEventListener('click', function () { activate(tab.getAttribute('data-story-tab')); });
      tab.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault(); var next = (index + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
        activate(tabs[next].getAttribute('data-story-tab'), true);
      });
    });
    var saved = read('lens', 'recruiter');
    if (!tabs.some(function (tab) { return tab.getAttribute('data-story-tab') === saved; })) saved = 'recruiter';
    activate(saved);
  }

  function history() {
    var file = pageName(), items = read('history', []);
    if (file !== 'index.html') {
      items = items.filter(function (item) { return item.file !== file; });
      items.unshift({ file: file, title: d.title.replace(/\s+[\u2014\-]\s+Chatree.*$/i, ''), at: Date.now() });
      items = items.slice(0, 8); write('history', items);
    }
    return items;
  }

  function mountContinue(items) {
    if (pageName() !== 'index.html' || !items.length) return;
    var host = d.querySelector('.story-intro'); if (!host || d.querySelector('.ck-continue')) return;
    var item = items[0], link = d.createElement('a'); link.className = 'ck-continue'; link.href = item.file;
    link.innerHTML = '<span class="ck-continue-k">Continue</span><b></b><i>→</i>';
    link.querySelector('b').textContent = item.title;
    host.insertAdjacentElement('afterend', link);
  }

  function mountTools(current) {
    var file = pageName(), bookmarks = read('bookmarks', []);
    var saved = bookmarks.some(function (item) { return item.file === file; });
    var tools = d.createElement('aside'); tools.className = 'ck-tools'; tools.setAttribute('aria-label', 'Page tools');
    tools.innerHTML =
      (current ? '<button class="ck-tool" type="button" data-x="evidence" title="Evidence lens" aria-label="Open evidence lens"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg></button>' : '') +
      '<button class="ck-tool" type="button" data-x="focus" title="Focus mode (F)" aria-label="Toggle focus mode" aria-pressed="false"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg></button>' +
      '<button class="ck-tool" type="button" data-x="save" title="Save page (B)" aria-label="Save this page" aria-pressed="' + (saved ? 'true' : 'false') + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 3h12v18l-6-4-6 4V3Z"/></svg></button>';
    d.body.appendChild(tools);

    var focus = tools.querySelector('[data-x="focus"]');
    var save = tools.querySelector('[data-x="save"]');
    var evidence = tools.querySelector('[data-x="evidence"]');
    function toggleFocus() {
      var on = !d.body.classList.contains('ck-focus-mode'); d.body.classList.toggle('ck-focus-mode', on);
      focus.setAttribute('aria-pressed', on ? 'true' : 'false'); toast(on ? 'Focus mode on' : 'Focus mode off');
    }
    function toggleSave() {
      var list = read('bookmarks', []), exists = list.some(function (item) { return item.file === file; });
      if (exists) list = list.filter(function (item) { return item.file !== file; });
      else list.unshift({ file: file, title: d.title, at: Date.now() });
      write('bookmarks', list.slice(0, 20)); save.setAttribute('aria-pressed', exists ? 'false' : 'true');
      toast(exists ? 'Removed from saved pages' : 'Page saved in this browser');
    }
    focus.addEventListener('click', toggleFocus); save.addEventListener('click', toggleSave);
    if (evidence) evidence.addEventListener('click', function () { openEvidence(current); });
    d.addEventListener('keydown', function (e) {
      var target = e.target, tag = target && target.tagName;
      if (e.ctrlKey || e.metaKey || e.altKey || tag === 'INPUT' || tag === 'TEXTAREA' || (target && target.isContentEditable)) return;
      if (e.key === 'f' || e.key === 'F') toggleFocus();
      if (e.key === 'b' || e.key === 'B') toggleSave();
    });
  }

  function boot() {
    installStyles();
    var current = classification(pageName());
    mountEvidence(current);
    mountStoryRouter();
    mountSectionLinks();
    mountContinue(history());
    mountTools(current);
    window.CKExperience = { openEvidence: function () { openEvidence(current); }, reducedMotion: reduced };
  }

  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})();
