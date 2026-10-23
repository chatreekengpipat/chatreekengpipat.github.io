/* ============================================================
   shell.js · SAP FI Tax Lab — app shell + command palette (T43)
   Loaded async by theme.js on every page. Pure progressive enhancement:
   the pages stay complete, printable documents without it.

   T43  App bar (brand · group / page / live section trail · search · theme)
        Reading progress (CSS scroll-driven animation, JS fallback)
        Drawer: every page grouped + "on this page" (native <dialog>)
        On-this-page rail with scroll-spy + sliding indicator (wide screens)
        Reading time (Intl.Segmenter — real Thai word breaks)
        Section deep-link anchors · prev/next pager · back-to-top ring
        Visit history (hub "continue reading") — skipped while prerendering
        Speculation Rules prerender on hover → near-instant page changes
        Deep links open closed <details> and skip the fade-in
   T43  Command palette Ctrl/⌘K or "/" : pages · sections of every page ·
        all glossary terms · full text · commands · scopes  > # :
        Live preview pane · Text-fragment links · CSS Custom Highlight
        Glossary peek: hover/tap a table or T-code chip for its definition
        Keyboard shortcuts (? for the list)
   State: memory + localStorage "kit:v1:hist" (visits) + sessionStorage
   (search index cache). Nothing leaves the browser.
   ============================================================ */
(function () {
  "use strict";
  if (window.KitShell) return;
  var w = window, d = document, root = d.documentElement;
  var PAGES = w.KIT_PAGES || [], GROUPS = w.KIT_GROUPS || {}, HERE = w.KIT_HERE || null;
  var BASE = w.KIT_BASE || "";
  var NS = (w.KitTheme && w.KitTheme.ns) || "kit:v1:";
  var HIST_KEY = NS + "hist";
  var IDX_KEY = NS + "idx:t43";
  var isHttp = /^https?:$/.test(location.protocol);
  var MAC = /Mac|iPhone|iPad|iPod/.test(navigator.platform || navigator.userAgent || "");
  var MOD = MAC ? "⌘" : "Ctrl";
  var api = w.KitShell = { version: "t43" };

  /* ---------- helpers ---------- */
  function $(s, c) { return (c || d).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function el(tag, cls, html) { var e = d.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function norm(s) { return String(s || "").replace(/\s+/g, " ").trim(); }
  function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function lsSet(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function reduce() { return !!(w.KitTheme && w.KitTheme.reducedMotion && w.KitTheme.reducedMotion()); }
  function smooth() { return reduce() ? "auto" : "smooth"; }
  function idle(fn, t) { if (w.requestIdleCallback) w.requestIdleCallback(fn, { timeout: t || 1500 }); else setTimeout(fn, 60); }
  function pageByKey(k) { for (var i = 0; i < PAGES.length; i++) if (PAGES[i].k === k) return PAGES[i]; return null; }
  function href(p) { return BASE + p.f; }
  function groupOf(p) { return p ? (GROUPS[p.g] || "") : ""; }
  function cssNum(name, fb) { var v = parseFloat(getComputedStyle(root).getPropertyValue(name)); return isNaN(v) ? fb : v; }

  function svg(p, s) {
    s = s || 18;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + p + "</svg>";
  }
  var IC = {
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    keys: '<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><path d="M6.5 10h.01M10 10h.01M13.5 10h.01M17 10h.01M7.5 14h9"/>',
    up: '<path d="M12 19V5M5.5 11.5 12 5l6.5 6.5"/>',
    left: '<path d="M19 12H5M11 5.5 4.5 12 11 18.5"/>',
    right: '<path d="M5 12h14M13 5.5l6.5 6.5-6.5 6.5"/>',
    link: '<path d="M9.5 14.5l5-5"/><path d="M11 6.5l1.2-1.2a4 4 0 0 1 5.6 5.6L16.5 12"/><path d="M13 17.5l-1.2 1.2a4 4 0 0 1-5.6-5.6L7.5 12"/>',
    page: '<path d="M6.5 3.5h7.5l4 4v13h-11.5z"/><path d="M14 3.5v4h4M9.5 12.5h5M9.5 16h5"/>',
    hash: '<path d="M5 9h14M5 15h14M10 4 8 20M16 4l-2 16"/>',
    book: '<path d="M5 5.5a2 2 0 0 1 2-2h11v14H7a2 2 0 0 0-2 2z"/><path d="M5 19.5a2 2 0 0 0 2 2h11v-4"/>',
    text: '<path d="M4 6h16M4 10.5h16M4 15h10M4 19.5h7"/>',
    bolt: '<path d="M13 2.5 5 13.5h6l-1 8 8-11h-6z"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    print: '<path d="M7 9V3.5h10V9"/><path d="M7 17.5H4.5V9h15v8.5H17"/><path d="M7 14h10v6.5H7z"/>',
    home: '<path d="M4 11 12 4l8 7"/><path d="M6 9.5V20h12V9.5"/>',
    contrast: '<circle cx="12" cy="12" r="8.5"/><path d="M12 3.5v17a8.5 8.5 0 0 0 0-17z" fill="currentColor" stroke="none"/>',
    copy: '<rect x="8.5" y="8.5" width="11" height="11" rx="2"/><path d="M15.5 8.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.5a2 2 0 0 0 2 2h2.5"/>',
    cards: '<rect x="3.5" y="6" width="13" height="14" rx="2"/><path d="M8 3.5h10.5a2 2 0 0 1 2 2V17"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>'
  };
  var LOGO = '<svg class="kb-logo" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" style="fill:var(--petrol)"/>' +
    '<rect x="8" y="9" width="16" height="2.8" rx="1.4" style="fill:var(--paper)"/><rect x="8" y="14.6" width="11" height="2.8" rx="1.4" style="fill:var(--paper)" opacity=".72"/>' +
    '<rect x="8" y="20.2" width="16" height="2.8" rx="1.4" style="fill:var(--brass)"/></svg>';

  /* ---------- toast ---------- */
  var toastEl = null, toastT = 0;
  function toast(msg) {
    if (!toastEl) { toastEl = el("div", "ktoast"); toastEl.setAttribute("role", "status"); toastEl.setAttribute("aria-live", "polite"); d.body.appendChild(toastEl); }
    toastEl.textContent = msg;
    toastEl.classList.add("on");
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove("on"); }, 1900);
  }
  function copy(text, msg) {
    var ok = function () { toast(msg || "คัดลอกแล้ว"); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, function () { legacyCopy(text, ok); });
    else legacyCopy(text, ok);
  }
  function legacyCopy(text, ok) {
    try {
      var ta = d.createElement("textarea"); ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.left = "-9999px"; d.body.appendChild(ta); ta.select();
      d.execCommand("copy"); d.body.removeChild(ta); ok();
    } catch (e) { toast("คัดลอกไม่สำเร็จ"); }
  }
  function urlFor(id) { return location.href.split("#")[0] + (id ? "#" + id : ""); }

  /* ---------- sections (current page or a parsed page) ---------- */
  function headText(h) {
    if (!h) return "";
    var c = h.cloneNode(true);
    $$(".ev,.st,.todo,.kanchor,.tag,sup", c).forEach(function (n) { n.parentNode.removeChild(n); });
    return norm(c.textContent);
  }
  function readSections(doc) {
    return $$("section[id]", doc).filter(function (s) {
      return !(s.parentElement && s.parentElement.closest && s.parentElement.closest("section"));
    }).map(function (s) {
      var h = s.querySelector(".sec-head h2") || s.querySelector("h2") || s.querySelector("h3");
      var n = s.querySelector(".sec-head .sec-num");
      return { id: s.id, n: n ? norm(n.textContent) : "", t: headText(h) || s.id, el: s };
    });
  }
  var SECS = [];

  /* open closed <details> around a target, skip its fade-in */
  function revealTarget(t) {
    var opened = false, p = t;
    while (p && p !== d.body) {
      if (p.tagName === "DETAILS" && !p.open) { p.open = true; opened = true; }
      if (p.classList && p.classList.contains("kit-reveal")) p.classList.add("kit-in");
      p = p.parentElement;
    }
    return opened;
  }
  function targetFromHash() {
    try { return location.hash && location.hash.length > 1 ? d.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch (e) { return null; }
  }
  function jumpTo(id) {
    var t = d.getElementById(id);
    if (!t) return;
    revealTarget(t);
    if (location.hash === "#" + id) t.scrollIntoView({ behavior: smooth(), block: "start" });
    else location.hash = id;
  }

  /* ---------- visit history (hub "continue reading") ---------- */
  function histRead() {
    try { var a = JSON.parse(lsGet(HIST_KEY) || "[]"); return Array.isArray(a) ? a.filter(function (x) { return x && x.k; }) : []; } catch (e) { return []; }
  }
  function histTouch(sec) {
    if (!HERE) return;
    var all = histRead(), prev = null;
    var rest = all.filter(function (x) { if (x.k === HERE.k) { prev = x; return false; } return true; });
    var e = { k: HERE.k, at: Date.now(), n: ((prev && prev.n) || 0) + (sec === undefined ? 1 : 0) };
    if (sec === undefined) { e.s = prev && prev.s; e.st = prev && prev.st; }
    else if (sec) { e.s = sec.id; e.st = (sec.n ? sec.n + " · " : "") + sec.t; }
    rest.unshift(e);
    lsSet(HIST_KEY, JSON.stringify(rest.slice(0, 14)));
  }
  function relTime(ts) {
    var diff = (Date.now() - ts) / 1000, rtf = null;
    try { rtf = new Intl.RelativeTimeFormat("th", { numeric: "auto" }); } catch (e) {}
    var u = diff < 60 ? ["second", -Math.round(diff)] : diff < 3600 ? ["minute", -Math.round(diff / 60)] :
      diff < 86400 ? ["hour", -Math.round(diff / 3600)] : ["day", -Math.round(diff / 86400)];
    if (u[0] === "second") return "เมื่อสักครู่";
    return rtf ? rtf.format(u[1], u[0]) : (-u[1]) + " " + u[0] + " ago";
  }
  api.history = histRead;
  api.relTime = relTime;

  /* ---------- reading time · Intl.Segmenter splits Thai into real words ---------- */
  function readingMinutes() {
    var wrap = $(".wrap");
    if (!wrap) return 0;
    var text = wrap.textContent || "", words = 0;
    try {
      if (w.Intl && Intl.Segmenter) {
        var it = new Intl.Segmenter("th", { granularity: "word" }).segment(text)[Symbol.iterator](), r;
        while (!(r = it.next()).done) if (r.value.isWordLike) words++;
      }
    } catch (e) { words = 0; }
    if (!words) words = Math.round((text.match(/\S+/g) || []).length * 1.8);
    return Math.max(1, Math.round(words / 230));
  }

  /* ============================================================
     T43 · APP BAR
     ============================================================ */
  var bar, trailSec, trailSep2;
  function buildBar() {
    bar = el("div", "kb");
    bar.setAttribute("role", "navigation");
    bar.setAttribute("aria-label", "Lab");
    var grp = HERE ? (HERE.k === "hub" ? "Knowledge Lab" : groupOf(HERE)) : "";
    var pageLabel = HERE ? HERE.s : norm(d.title).split("—")[0];
    bar.innerHTML =
      '<button type="button" class="kb-btn kb-menu" aria-label="ทุกหน้าใน Lab (M)" title="ทุกหน้า (M)" aria-haspopup="dialog">' + svg(IC.menu, 20) + "</button>" +
      '<a class="kb-brand" href="' + BASE + 'index.html" aria-label="FI·TAX Lab — Hub">' + LOGO + '<span class="kb-name"><b>FI·TAX</b> <i>Lab</i></span></a>' +
      '<button type="button" class="kb-trail" title="ข้ามไปหัวข้ออื่น (#)" aria-haspopup="dialog">' +
        (grp ? '<span class="kb-grp">' + esc(grp) + '</span><span class="kb-sep" aria-hidden="true">/</span>' : "") +
        '<span class="kb-page">' + esc(pageLabel) + "</span>" +
        '<span class="kb-sep" aria-hidden="true" hidden>/</span><span class="kb-sec" hidden></span>' +
      "</button>" +
      '<span class="kb-sp"></span><a class="kb-port" href="../index.html" title="Back to the portfolio">← Portfolio</a>' +
      '<button type="button" class="kb-search" aria-label="ค้นหา (' + MOD + ' K)" aria-haspopup="dialog">' + svg(IC.search, 16) +
        '<span class="kb-ph">ค้นหน้า · หัวข้อ · ศัพท์</span><kbd class="kk">' + MOD + " K</kbd></button>" +
      '<button type="button" class="kb-btn kb-keys" aria-label="คีย์ลัดทั้งหมด (?)" title="คีย์ลัด (?)" aria-haspopup="dialog">' + svg(IC.keys, 19) + "</button>";
    d.body.insertBefore(bar, d.body.firstChild);
    var main = $("[role=main]") || $("main");
    if (main && main.id) {
      var skip = el("a", "kskip", "ข้ามไปเนื้อหา");
      skip.href = "#" + main.id;
      skip.addEventListener("click", function (e) { e.preventDefault(); main.focus({ preventScroll: true }); main.scrollIntoView({ block: "start" }); });
      d.body.insertBefore(skip, bar);
    }
    trailSec = $(".kb-sec", bar);
    trailSep2 = trailSec.previousElementSibling;

    /* the theme toggle (theme.js) moves into the bar */
    var tt = $(".theme-toggle");
    if (!tt) {
      tt = el("button", "theme-toggle", '<span class="ti" aria-hidden="true"></span>');
      tt.type = "button";
      tt.addEventListener("click", function (e) { w.KitTheme && w.KitTheme.toggle(e); });
    }
    tt.classList.add("in-bar");
    bar.appendChild(tt);
    root.classList.remove("kb-up");

    $(".kb-menu", bar).addEventListener("click", openDrawer);
    $(".kb-search", bar).addEventListener("click", function () { openPalette(""); });
    $(".kb-keys", bar).addEventListener("click", openKeys);
    $(".kb-trail", bar).addEventListener("click", function () { openPalette(SECS.length ? "#" : ""); });
    bar.addEventListener("focusin", function () { root.classList.remove("kb-up"); });
  }
  var lastSecId = null;
  function setTrailSection(s) {
    if (!trailSec) return;
    var id = s ? s.id : null;
    if (id === lastSecId) return;
    lastSecId = id;
    if (!s) { trailSec.hidden = true; trailSep2.hidden = true; return; }
    trailSec.innerHTML = (s.n ? '<span class="n">' + esc(s.n) + "</span>" : "") + esc(s.t);
    trailSec.hidden = false; trailSep2.hidden = false;
    trailSec.classList.remove("kb-swap");
    void trailSec.offsetWidth;
    if (!reduce()) trailSec.classList.add("kb-swap");
  }

  /* ---------- progress line + back-to-top ring ---------- */
  var prog, progCSS = false, topBtn;
  function buildProgress() {
    prog = el("div", "kprog", "<i></i>");
    prog.setAttribute("aria-hidden", "true");
    d.body.appendChild(prog);
    try { progCSS = !!(w.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()")) && !reduce(); } catch (e) {}
    if (progCSS) prog.classList.add("css");
    topBtn = el("button", "ktop", '<svg class="ring" viewBox="0 0 46 46" aria-hidden="true"><circle cx="23" cy="23" r="22"/></svg>' + svg(IC.up, 18));
    topBtn.type = "button";
    topBtn.setAttribute("aria-label", "กลับด้านบน");
    topBtn.title = "กลับด้านบน (g g)";
    topBtn.addEventListener("click", toTop);
    d.body.appendChild(topBtn);
  }
  function toTop() { w.scrollTo({ top: 0, behavior: smooth() }); }

  /* ============================================================
     T43 · ON-THIS-PAGE RAIL + SCROLL-SPY
     ============================================================ */
  var rail = null, railLinks = [], railInd = null, drawerToc = [];
  function buildRail() {
    if (!HERE || HERE.r === 0 || SECS.length < 2) return;
    rail = el("aside", "kr");
    rail.setAttribute("aria-label", "ในหน้านี้");
    rail.innerHTML =
      '<div class="kr-h"><span>ในหน้านี้</span><span class="kr-rt"></span></div>' +
      '<ol class="kr-l"><li class="kr-ind" aria-hidden="true"></li>' +
      SECS.map(function (s) {
        return '<li><a href="#' + esc(s.id) + '" data-id="' + esc(s.id) + '"><span class="n">' + esc(s.n) + '</span><span class="t">' + esc(s.t) + "</span></a></li>";
      }).join("") + "</ol>" +
      '<div class="kr-f"><button type="button" data-act="top">' + svg(IC.up, 13) + 'กลับด้านบน</button>' +
      '<button type="button" data-act="copy">' + svg(IC.link, 13) + 'คัดลอกลิงก์หัวข้อนี้</button></div>';
    d.body.appendChild(rail);
    railLinks = $$(".kr-l a", rail);
    railInd = $(".kr-ind", rail);
    rail.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-id]");
      if (a) { e.preventDefault(); jumpTo(a.getAttribute("data-id")); return; }
      var b = e.target.closest("button[data-act]");
      if (!b) return;
      if (b.getAttribute("data-act") === "top") toTop();
      else copy(urlFor(lastSecId), "คัดลอกลิงก์หัวข้อแล้ว");
    });
    idle(function () { var m = readingMinutes(); if (m) $(".kr-rt", rail).textContent = "≈ " + m + " นาที"; });
    placeRail();
  }
  function placeRail() {
    if (!rail) return;
    var wrap = $(".wrap");
    if (!wrap) return;
    var r = wrap.getBoundingClientRect();
    var x = r.right + cssNum("--rail-gap", 44), rw = cssNum("--rail-w", 228);
    var fits = w.innerWidth >= 1320 && x + rw <= root.clientWidth - 8;
    if (fits) { rail.style.setProperty("--rail-x", Math.round(x) + "px"); rail.classList.add("on"); }
    else rail.classList.remove("on");
  }
  var activeIdx = -2;
  function computeActive() {
    if (!SECS.length) return -1;
    var line = cssNum("--kb-h", 52) + w.innerHeight * 0.22, idx = -1;
    for (var i = 0; i < SECS.length; i++) { if (SECS[i].el.getBoundingClientRect().top <= line) idx = i; else break; }
    if (w.innerHeight + w.scrollY >= root.scrollHeight - 4 && SECS[SECS.length - 1].el.getBoundingClientRect().top < w.innerHeight) idx = SECS.length - 1;
    return idx;
  }
  var histT = 0;
  function setActive(i) {
    if (i === activeIdx) return;
    activeIdx = i;
    var s = i >= 0 ? SECS[i] : null;
    setTrailSection(s);
    railLinks.forEach(function (a, k) { a.classList.toggle("on", k === i); if (k === i) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
    drawerToc.forEach(function (a, k) { a.classList.toggle("on", k === i); });
    if (railInd) {
      var a = railLinks[i];
      if (a) {
        railInd.style.setProperty("--y", a.offsetTop + "px");
        railInd.style.setProperty("--h", a.offsetHeight + "px");
        if (rail.scrollHeight > rail.clientHeight) {
          var base = railInd.parentNode.offsetTop;
          var top = base + a.offsetTop - 40, bottom = base + a.offsetTop + a.offsetHeight + 40;
          if (top < rail.scrollTop) rail.scrollTop = top;
          else if (bottom > rail.scrollTop + rail.clientHeight) rail.scrollTop = bottom - rail.clientHeight;
        }
      } else railInd.style.setProperty("--h", "0px");
    }
    clearTimeout(histT);
    if (!d.prerendering) histT = setTimeout(function () { histTouch(s || null); }, 900);
  }

  /* ---------- one rAF-throttled scroll loop: progress · spy · headroom · top ---------- */
  var ticking = false, lastY = w.scrollY || 0;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    w.requestAnimationFrame(function () {
      ticking = false;
      var y = w.scrollY || root.scrollTop || 0;
      var max = Math.max(1, root.scrollHeight - w.innerHeight);
      var p = Math.min(1, Math.max(0, y / max));
      if (prog && !progCSS) prog.style.setProperty("--p", p.toFixed(4));
      if (topBtn) { topBtn.style.setProperty("--p", p.toFixed(4)); topBtn.classList.toggle("on", y > 640); }
      /* headroom on small screens: hide the bar while reading down, show on the way up */
      if (w.innerWidth < 900 && !anyDialog()) {
        if (y > lastY + 6 && y > 140) root.classList.add("kb-up");
        else if (y < lastY - 6 || y < 60) root.classList.remove("kb-up");
      } else root.classList.remove("kb-up");
      lastY = y;
      setActive(computeActive());
      hidePeek();
    });
  }

  /* ============================================================
     T43 · SECTION ANCHORS · PAGER
     ============================================================ */
  function buildAnchors() {
    SECS.forEach(function (s) {
      var head = s.el.querySelector(".sec-head");
      if (!head || head.querySelector(".kanchor")) return;
      var a = el("a", "kanchor", svg(IC.link, 15));
      a.href = "#" + s.id;
      a.title = "คัดลอกลิงก์หัวข้อนี้";
      a.setAttribute("aria-label", "คัดลอกลิงก์ไปหัวข้อ " + s.t);
      a.addEventListener("click", function (e) {
        e.preventDefault();
        copy(urlFor(s.id), "คัดลอกลิงก์หัวข้อ " + (s.n ? s.n + " " : "") + "แล้ว");
        jumpTo(s.id);
      });
      head.appendChild(a);
    });
  }
  function neighbours() {
    if (!HERE) return { prev: null, next: null };
    var i = PAGES.indexOf(HERE);
    return { prev: i > 0 ? PAGES[i - 1] : null, next: i >= 0 && i < PAGES.length - 1 ? PAGES[i + 1] : null };
  }
  function buildPager() {
    if (!HERE || HERE.k === "hub") return;
    var wrap = $(".wrap");
    if (!wrap) return;
    var nb = neighbours(), nav = el("nav", "kpager"), h = "";
    nav.setAttribute("aria-label", "หน้าก่อนหน้า / ถัดไป");
    if (nb.prev) h += '<a class="kpg prev" rel="prev" href="' + href(nb.prev) + '"><span class="kpg-d">' + svg(IC.left, 13) + 'ก่อนหน้า <kbd class="kk">[</kbd></span><span class="kpg-t">' + esc(nb.prev.s) + '</span><span class="kpg-g">' + esc(groupOf(nb.prev)) + "</span></a>";
    if (nb.next) h += '<a class="kpg next" rel="next" href="' + href(nb.next) + '"><span class="kpg-d"><kbd class="kk">]</kbd> ถัดไป' + svg(IC.right, 13) + '</span><span class="kpg-t">' + esc(nb.next.s) + '</span><span class="kpg-g">' + esc(groupOf(nb.next)) + "</span></a>";
    nav.innerHTML = h;
    var foot = $(".wrap > footer");
    if (foot) wrap.insertBefore(nav, foot); else wrap.appendChild(nav);
  }

  /* ============================================================
     T43 · DRAWER (all pages + on this page)
     ============================================================ */
  var drawer = null;
  function anyDialog() { return !!$("dialog.kd[open], dialog.kp[open], dialog.kh[open]"); }
  function lockScroll(on) { root.classList.toggle("kit-lock", !!on); }
  function wireDialog(dl) {
    dl.addEventListener("keydown", function (e) { e.stopPropagation(); }); /* page shortcuts (quiz 1–4/Enter) never see dialog keys */
    dl.addEventListener("click", function (e) { if (e.target === dl) dl.close(); }); /* backdrop = light dismiss */
    dl.addEventListener("close", function () { if (!anyDialog()) lockScroll(false); });
  }
  function buildDrawer() {
    drawer = el("dialog", "kd");
    drawer.setAttribute("aria-label", "ทุกหน้าใน Lab");
    var seen = {};
    histRead().forEach(function (x) { seen[x.k] = 1; });
    var body = "", g = null;
    PAGES.forEach(function (p) {
      if (p.g !== g) { g = p.g; body += '<div class="kd-g">' + esc(GROUPS[g] || "") + "</div>"; }
      var cur = HERE && p.k === HERE.k;
      body += '<a class="kd-a" href="' + href(p) + '"' + (cur ? ' aria-current="page"' : "") + ">" +
        '<span class="kd-v' + (seen[p.k] || cur ? " seen" : "") + '" aria-hidden="true"></span><span>' + esc(p.s) + "</span>" +
        (p.o ? '<span class="kd-o" title="WRICEF ของฉัน">★ ' + esc(p.o) + "</span>" : "") + "</a>";
      if (cur && SECS.length > 1) {
        body += '<ol class="kd-toc" aria-label="ในหน้านี้">' + SECS.map(function (s) {
          return '<li><a href="#' + esc(s.id) + '" data-id="' + esc(s.id) + '"><span class="n">' + esc(s.n) + "</span><span>" + esc(s.t) + "</span></a></li>";
        }).join("") + "</ol>";
      }
    });
    drawer.innerHTML =
      '<div class="kd-h"><a class="kb-brand" href="' + BASE + 'index.html">' + LOGO + '<span class="kb-name"><b>FI·TAX</b> <i>Lab</i></span></a>' +
      '<button type="button" class="kb-btn" data-close aria-label="ปิดเมนู">' + svg(IC.close, 20) + "</button></div>" +
      '<nav class="kd-b" aria-label="ทุกหน้า">' + body + "</nav>" +
      '<div class="kd-f"><a class="kd-port" href="../index.html">← Portfolio</a><span><kbd class="kk">' + MOD + ' K</kbd> ค้นหา</span><span><kbd class="kk">?</kbd> คีย์ลัด</span><span><span class="kd-v seen" style="display:inline-block;vertical-align:1px"></span> เคยเปิดแล้ว</span></div>';
    d.body.appendChild(drawer);
    wireDialog(drawer);
    drawerToc = $$(".kd-toc a", drawer);
    drawer.addEventListener("click", function (e) {
      if (e.target.closest("[data-close]")) { drawer.close(); return; }
      var a = e.target.closest("a");
      if (!a) return;
      var id = a.getAttribute("data-id");
      drawer.close();
      if (id) { e.preventDefault(); jumpTo(id); }
    });
  }
  function openDrawer() {
    if (!drawer || drawer.open) return;
    closeAll();
    lockScroll(true);
    drawer.showModal();
    var cur = $('.kd-a[aria-current="page"]', drawer), body = $(".kd-b", drawer);
    if (cur) {
      cur.focus({ preventScroll: true });
      body.scrollTop = Math.max(0, cur.offsetTop - body.clientHeight / 2 + cur.offsetHeight / 2);
    }
  }
  function closeAll() { $$("dialog.kd[open], dialog.kp[open], dialog.kh[open]").forEach(function (x) { x.close(); }); }

  /* ============================================================
     T43 · KEYBOARD SHORTCUTS DIALOG
     ============================================================ */
  var keysDlg = null;
  function k(s) { return '<kbd class="kk">' + s + "</kbd>"; }
  function buildKeys() {
    keysDlg = el("dialog", "kh");
    keysDlg.setAttribute("aria-label", "คีย์ลัด");
    var rows = [
      ["ค้นหา / ไปที่", [[k(MOD) + k("K"), "เปิด command palette"], [k("/"), "เปิด palette (หน้า Glossary: ช่องค้นของหน้า)"], [k("&gt;") + k("#") + k(":"), "ใน palette: คำสั่ง · หัวข้อ · ศัพท์"], [k("↵"), "เปิด · " + k(MOD) + k("↵") + " แท็บใหม่"]]],
      ["อ่าน", [[k("j") + k("k"), "หัวข้อถัดไป / ก่อนหน้า"], [k("[") + k("]"), "หน้าก่อนหน้า / ถัดไป (ลำดับเดียวกับ hub)"], [k("g") + k("g"), "กลับด้านบน"], [k("g") + k("h"), "ไปหน้า Hub"]]],
      ["อื่น ๆ", [[k("m"), "เมนูทุกหน้า"], [k("t"), "สลับธีม สว่าง / มืด"], [k("?"), "หน้านี้"], [k("Esc"), "ปิดหน้าต่าง"]]]
    ];
    keysDlg.innerHTML =
      '<div class="kp-h">' + svg(IC.keys, 18) + '<b style="flex:1;color:var(--ink);font-size:15px">คีย์ลัด</b><button type="button" class="kb-btn" data-close aria-label="ปิด">' + svg(IC.close, 18) + "</button></div>" +
      '<div class="kh-b">' + rows.map(function (g) {
        return '<div class="kh-g">' + g[0] + "</div>" + g[1].map(function (r) { return '<div class="kh-r"><span>' + r[1] + '</span><span class="ks">' + r[0] + "</span></div>"; }).join("");
      }).join("") + '<p class="pv-m" style="margin-top:14px">คีย์ลัดหยุดทำงานขณะพิมพ์ในช่องค้นหา · Quiz ใช้ 1–4 / Enter และ Glossary ใช้ Space / ← → ของตัวเองเหมือนเดิม</p></div>';
    d.body.appendChild(keysDlg);
    wireDialog(keysDlg);
    keysDlg.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) keysDlg.close(); });
  }
  function openKeys() { if (!keysDlg) buildKeys(); if (keysDlg.open) return; closeAll(); lockScroll(true); keysDlg.showModal(); }

  /* ============================================================
     T43 · GLOSSARY DATA (lazy) + PEEK CARDS
     ============================================================ */
  var CAT = { tax: "Tax concept", th: "Thai statutory", table: "SAP table", config: "Config / T-code", delivery: "Delivery / WRICEF", fx: "Ledger / currency" };
  var glossWait = [], glossLoading = false;
  function loadGlossary(cb) {
    if (Array.isArray(w.KIT_GLOSSARY)) { cb && cb(); return; }
    if (cb) glossWait.push(cb);
    if (glossLoading) return;
    glossLoading = true;
    var s = d.createElement("script");
    s.src = BASE + "data/glossary.js";
    s.async = true;
    var done = function () { var q = glossWait; glossWait = []; q.forEach(function (f) { try { f(); } catch (e) {} }); };
    s.onload = done; s.onerror = function () { w.KIT_GLOSSARY = w.KIT_GLOSSARY || []; done(); };
    d.head.appendChild(s);
  }
  function glossUrl(t) { return BASE + "glossary.html?q=" + encodeURIComponent(t); }
  function todoize(s) { return s.replace(/(TODO: verify[^·)]*)/gi, '<span class="todo">$1</span>'); }

  var peek = null, peekFor = null, peekShowT = 0, peekHideT = 0, glossMap = null, lastPointer = "mouse";
  function buildGlossMap() {
    if (glossMap) return glossMap;
    glossMap = {};
    (w.KIT_GLOSSARY || []).forEach(function (e, i) {
      String(e.t).split(/\s*\/\s*/).forEach(function (part) {
        var key = part.replace(/\s*\([^)]*\)\s*/g, " ").trim().toUpperCase();
        if (key.length < 3 || glossMap[key] != null) return;
        glossMap[key] = i;
      });
    });
    return glossMap;
  }
  function initPeek() {
    if (HERE && HERE.k === "tax-glossary") return;
    if (!$(".wrap code")) return;
    loadGlossary(function () {
      var G = w.KIT_GLOSSARY || [];
      if (!G.length) return;
      var map = buildGlossMap();
      $$(".wrap code").forEach(function (c) {
        if (c.closest("a, button, pre, .kpk")) return;
        var i = map[norm(c.textContent).toUpperCase()];
        if (i == null) return;
        c.classList.add("kterm");
        c.setAttribute("data-gi", i);
      });
      peek = el("div", "kpk");
      peek.setAttribute("role", "dialog");
      peek.setAttribute("aria-label", "คำอธิบายศัพท์");
      d.body.appendChild(peek);
      peek.addEventListener("mouseenter", function () { clearTimeout(peekHideT); });
      peek.addEventListener("mouseleave", function () { schedHide(160); });
      d.addEventListener("pointerdown", function (e) { lastPointer = e.pointerType || "mouse"; if (peek && !peek.contains(e.target) && !(e.target.closest && e.target.closest("code.kterm"))) hidePeek(); }, true);
      d.addEventListener("mouseover", function (e) {
        var c = e.target.closest && e.target.closest("code.kterm");
        if (!c || lastPointer !== "mouse") return;
        clearTimeout(peekHideT);
        if (peekFor === c) return;
        clearTimeout(peekShowT);
        peekShowT = setTimeout(function () { showPeek(c); }, 260);
      });
      d.addEventListener("mouseout", function (e) {
        var c = e.target.closest && e.target.closest("code.kterm");
        if (!c) return;
        clearTimeout(peekShowT);
        if (peekFor) schedHide(180);
      });
      d.addEventListener("click", function (e) {
        var c = e.target.closest && e.target.closest("code.kterm");
        if (!c) return;
        if (peekFor === c && lastPointer !== "mouse") { hidePeek(); return; }
        showPeek(c);
      });
    });
  }
  function schedHide(ms) { clearTimeout(peekHideT); peekHideT = setTimeout(hidePeek, ms); }
  function hidePeek() { if (peek && peekFor) { peek.classList.remove("on"); peekFor = null; } }
  function showPeek(c) {
    var e = (w.KIT_GLOSSARY || [])[+c.getAttribute("data-gi")];
    if (!e || !peek) return;
    peekFor = c;
    peek.innerHTML =
      '<div class="kpk-h"><span class="kpk-t">' + esc(e.t) + "</span>" + (e.th ? '<span class="kpk-th">' + esc(e.th) + "</span>" : "") +
      '<span class="kpk-c">' + esc(CAT[e.c] || e.c || "") + "</span></div>" +
      '<div class="kpk-d">' + todoize(esc(e.d)) + "</div>" +
      '<div class="kpk-f"><a href="' + glossUrl(e.t) + '">Glossary →</a>' + (e.ln ? '<a href="' + esc(BASE + e.ln) + '">' + esc(e.lt || "หน้าที่เกี่ยวข้อง") + " →</a>" : "") + "</div>";
    var r = c.getBoundingClientRect(), pw = peek.offsetWidth, ph = peek.offsetHeight;
    var top = r.bottom + 8;
    if (top + ph > w.innerHeight - 8) top = Math.max(8, r.top - ph - 8);
    var left = Math.min(Math.max(12, r.left + r.width / 2 - pw / 2), w.innerWidth - pw - 12);
    peek.style.top = Math.round(top) + "px";
    peek.style.left = Math.round(left) + "px";
    peek.classList.add("on");
  }

  /* ============================================================
     T43 · SEARCH INDEX — every page's sections + text
     http(s) only (browsers block fetch over file://); cached per tab
     ============================================================ */
  var IDX = null, idxBusy = false, idxWait = [];
  function parsePage(p, html) {
    if (!html) return null;
    try {
      var doc = new DOMParser().parseFromString(html, "text/html");
      $$("script,style,template,noscript,.crumb,.pagenav,footer", doc).forEach(function (n) { n.parentNode && n.parentNode.removeChild(n); });
      var secs = readSections(doc).map(function (s) { return { id: s.id, n: s.n, t: s.t, x: norm(s.el.textContent) }; });
      $$("section[id]", doc).forEach(function (s) { s.parentNode && s.parentNode.removeChild(s); });
      var wrap = doc.querySelector(".wrap") || doc.body;
      return { k: p.k, head: norm(wrap ? wrap.textContent : ""), secs: secs };
    } catch (e) { return null; }
  }
  function buildIndex(cb) {
    if (IDX) { cb && cb(); return; }
    if (cb) idxWait.push(cb);
    if (idxBusy) return;
    var flush = function () { var q = idxWait; idxWait = []; q.forEach(function (f) { try { f(); } catch (e) {} }); };
    try { var c = sessionStorage.getItem(IDX_KEY); if (c) { IDX = JSON.parse(c); flush(); return; } } catch (e) {}
    if (!isHttp || !w.fetch || !w.DOMParser) { IDX = { pages: [], offline: true }; flush(); return; }
    idxBusy = true;
    var list = PAGES.filter(function (p) { return p.k !== "hub"; }), out = [], left = list.length;
    list.forEach(function (p, i) {
      fetch(href(p), { credentials: "same-origin" })
        .then(function (r) { return r.ok ? r.text() : ""; })
        .catch(function () { return ""; })
        .then(function (html) {
          out[i] = parsePage(p, html);
          if (--left === 0) {
            IDX = { pages: out.filter(Boolean) };
            idxBusy = false;
            try { sessionStorage.setItem(IDX_KEY, JSON.stringify(IDX)); } catch (e) {}
            flush();
          }
        });
    });
  }
  function idxPage(k) { if (!IDX) return null; for (var i = 0; i < IDX.pages.length; i++) if (IDX.pages[i].k === k) return IDX.pages[i]; return null; }

  /* ============================================================
     T43 · COMMAND PALETTE
     ============================================================ */
  var P = { dlg: null, input: null, list: null, prev: null, st: null, scopeEl: null, items: [], sel: 0, lastQ: null };
  var SCOPES = { ">": "คำสั่ง", "#": "หัวข้อ", ":": "ศัพท์" };

  function actions() {
    var nb = neighbours();
    var a = [
      { title: "ค้นหาศัพท์ใน Glossary", sub: "ศัพท์ทั้งหมด · พิมพ์ : ตามด้วยคำ", ic: IC.book, run: function () { setQuery(":"); }, keep: true, desc: "สลับ palette ไปโหมดศัพท์ — นิยามขึ้นในช่องขวาทันที" },
      { title: "ข้ามไปหัวข้อ", sub: "ทุกหัวข้อของหน้านี้และหน้าอื่น · พิมพ์ #", ic: IC.hash, run: function () { setQuery("#"); }, keep: true, desc: "สลับ palette ไปโหมดหัวข้อ" },
      { title: "สลับธีม สว่าง / มืด", sub: "Theme", key: "t", ic: IC.contrast, run: function () { w.KitTheme && w.KitTheme.toggle(); }, desc: "สลับโหมดสี — จำไว้ในเบราว์เซอร์นี้" },
      { title: "คัดลอกลิงก์ (หัวข้อปัจจุบัน)", sub: "Deep link", ic: IC.link, run: function () { copy(urlFor(lastSecId), "คัดลอกลิงก์แล้ว"); }, desc: "ลิงก์ตรงไปหัวข้อที่อ่านอยู่ — ส่งต่อให้ทีมได้" },
      { title: "พิมพ์ / บันทึก PDF", sub: "Print · light palette อัตโนมัติ", ic: IC.print, run: function () { setTimeout(function () { w.print(); }, 120); }, desc: "หน้าพิมพ์ใช้โทนสว่างเสมอ และซ่อน UI ทั้งหมด" },
      { title: "กลับด้านบน", sub: "Top of page", key: "g g", ic: IC.up, run: toTop },
      { title: "ไปหน้า Hub", sub: "หน้ารวมทุกเล่ม", key: "g h", ic: IC.home, href: BASE + "index.html" },
      { title: "เปิดเมนูทุกหน้า", sub: "Drawer", key: "m", ic: IC.menu, run: function () { setTimeout(openDrawer, 30); } },
      { title: "คีย์ลัดทั้งหมด", sub: "Keyboard shortcuts", key: "?", ic: IC.keys, run: function () { setTimeout(openKeys, 30); } },
      { title: "ทำ Quiz", sub: "FI-TAX Quiz · active recall", ic: IC.target, href: BASE + "quiz.html" },
      { title: "Flashcards ศัพท์", sub: "Glossary · flashcard mode", ic: IC.cards, href: BASE + "glossary.html" }
    ];
    if (nb.prev) a.push({ title: "หน้าก่อนหน้า: " + nb.prev.s, sub: groupOf(nb.prev), key: "[", ic: IC.left, href: href(nb.prev) });
    if (nb.next) a.push({ title: "หน้าถัดไป: " + nb.next.s, sub: groupOf(nb.next), key: "]", ic: IC.right, href: href(nb.next) });
    return a.map(function (x) { x.type = "act"; return x; });
  }
  function pageItems() {
    return PAGES.map(function (p) {
      return { type: "page", p: p, title: p.t, sub: groupOf(p) + " · " + (p.d || ""), kw: p.s + " " + (p.o || "") + " " + p.f, ic: IC.page, href: href(p), cur: HERE && p.k === HERE.k };
    });
  }
  function hereSecItems() {
    return SECS.map(function (s) {
      return { type: "sec", local: true, id: s.id, title: (s.n ? s.n + " · " : "") + s.t, sub: "ในหน้านี้ · " + (HERE ? HERE.s : ""), ic: IC.hash, m: "§" + (s.n || "") };
    });
  }
  function otherSecItems() {
    if (!IDX) return [];
    var out = [];
    IDX.pages.forEach(function (ip) {
      if (HERE && ip.k === HERE.k) return;
      var p = pageByKey(ip.k);
      if (!p) return;
      ip.secs.forEach(function (s) {
        out.push({ type: "sec", p: p, id: s.id, sx: s.x, title: (s.n ? s.n + " · " : "") + s.t, sub: p.s + " · " + groupOf(p), ic: IC.hash, href: href(p) + "#" + encodeURIComponent(s.id), m: "§" + (s.n || "") });
      });
    });
    return out;
  }
  function glossItems() {
    return (w.KIT_GLOSSARY || []).map(function (e) {
      return { type: "gl", e: e, title: e.t, sub: (e.th ? e.th + " · " : "") + e.d, kw: CAT[e.c] || "", ic: IC.book, href: glossUrl(e.t), m: (CAT[e.c] || "").split(" ")[0] };
    });
  }
  function recentItems() {
    return histRead().filter(function (x) { return !HERE || x.k !== HERE.k; }).slice(0, 5).map(function (x) {
      var p = pageByKey(x.k);
      if (!p) return null;
      return { type: "page", p: p, recent: x, title: p.t, sub: relTime(x.at) + (x.st ? " · " + x.st : ""), ic: IC.clock, href: href(p) + (x.s ? "#" + encodeURIComponent(x.s) : "") };
    }).filter(Boolean);
  }

  /* ---- matching: prefix > word start > substring > (latin) fuzzy subsequence ---- */
  function scoreStr(hay, q, fuzzy) {
    var i = hay.indexOf(q);
    if (i === 0) return 100;
    if (i > 0) return (/[\s\-·\/(_.,:|]/.test(hay.charAt(i - 1)) ? 82 : 58) - Math.min(i, 40) / 5;
    if (!fuzzy || q.length < 2 || !/^[a-z0-9_\-]+$/.test(q)) return -1;
    var j = 0, last = -1, gaps = 0;
    for (var x = 0; x < hay.length && j < q.length; x++) if (hay.charAt(x) === q.charAt(j)) { if (last >= 0) gaps += x - last - 1; last = x; j++; }
    if (j < q.length || gaps > q.length * 3) return -1;
    return Math.max(4, 32 - gaps * 2);
  }
  function scoreItem(it, terms) {
    var tl = it._t || (it._t = it.title.toLowerCase());
    var kl = it._k || (it._k = ((it.sub || "") + " " + (it.kw || "")).toLowerCase());
    var total = 0;
    for (var i = 0; i < terms.length; i++) {
      var a = scoreStr(tl, terms[i], true);
      var b = kl.indexOf(terms[i]) >= 0 ? 26 : -1;
      var s = Math.max(a, b);
      if (s < 0) return -1;
      total += s;
    }
    if (it.type === "gl" && tl === terms.join(" ")) total += 60;
    return total;
  }
  function rank(items, terms, max) {
    var out = [];
    items.forEach(function (it) { var s = scoreItem(it, terms); if (s >= 0) out.push({ it: it, s: s }); });
    out.sort(function (a, b) { return b.s - a.s; });
    return out.slice(0, max).map(function (x) { return x.it; });
  }
  function hl(text, terms) {
    var low = text.toLowerCase(), ranges = [];
    terms.forEach(function (t) { var i = low.indexOf(t); if (i >= 0) ranges.push([i, i + t.length]); });
    if (!ranges.length) return esc(text);
    ranges.sort(function (a, b) { return a[0] - b[0]; });
    var out = "", pos = 0;
    ranges.forEach(function (r) {
      if (r[0] < pos) return;
      out += esc(text.slice(pos, r[0])) + "<mark>" + esc(text.slice(r[0], r[1])) + "</mark>";
      pos = r[1];
    });
    return out + esc(text.slice(pos));
  }
  function snippet(text, q, span) {
    var low = text.toLowerCase(), i = low.indexOf(q);
    if (i < 0) return esc(text.slice(0, span || 180)) + (text.length > (span || 180) ? "…" : "");
    var s = Math.max(0, i - 60), e = Math.min(text.length, i + q.length + (span || 120));
    return (s > 0 ? "…" : "") + esc(text.slice(s, i)) + "<mark>" + esc(text.slice(i, i + q.length)) + "</mark>" + esc(text.slice(i + q.length, e)) + (e < text.length ? "…" : "");
  }
  function countOcc(low, q) { var n = 0, i = low.indexOf(q); while (i >= 0 && n < 999) { n++; i = low.indexOf(q, i + q.length); } return n; }
  function fullText(q, max) {
    if (!IDX || q.length < 2) return [];
    var out = [];
    IDX.pages.forEach(function (ip) {
      var p = pageByKey(ip.k);
      if (!p) return;
      var n = 0, first = null, snips = [];
      var parts = [{ id: null, x: ip.head }].concat(ip.secs);
      parts.forEach(function (s) {
        var low = s.x.toLowerCase(), c = countOcc(low, q);
        if (!c) return;
        n += c;
        if (!first) first = s;
        if (snips.length < 3) snips.push(snippet(s.x, q, 110));
      });
      if (!n) return;
      var local = HERE && p.k === HERE.k;
      var frag = (first && first.id ? encodeURIComponent(first.id) : "") + ":~:text=" + encodeURIComponent(q);
      out.push({ type: "ft", p: p, n: n, local: local, id: first && first.id, q: q, snips: snips, title: p.t, sub: snips[0] ? snips[0].replace(/<[^>]+>/g, "") : "", ic: IC.text, href: href(p) + "#" + frag, m: n + "×" });
    });
    out.sort(function (a, b) { return b.n - a.n; });
    return out.slice(0, max);
  }

  function parseQuery(raw) {
    var q = raw.replace(/^\s+/, ""), scope = null;
    if (q && SCOPES[q.charAt(0)]) { scope = q.charAt(0); q = q.slice(1); }
    q = q.trim().toLowerCase();
    return { scope: scope, q: q, terms: q ? q.split(/\s+/).filter(Boolean) : [] };
  }

  function compute(raw) {
    var Q = parseQuery(raw), groups = [], T = Q.terms;
    var wantIdx = isHttp && (!Q.scope || Q.scope === "#") && (T.length || Q.scope === "#");
    if (wantIdx && !IDX) buildIndex(function () { if (P.dlg && P.dlg.open) render(); });
    var idxNote = null;
    if (wantIdx && !IDX) idxNote = '<span class="kp-spin" aria-hidden="true"></span>กำลังสร้างดัชนีทุกหน้า…';
    else if (!isHttp && T.length && (!Q.scope || Q.scope === "#")) idxNote = "ค้นหัวข้อ / ข้อความข้ามหน้าได้เมื่อเปิดผ่าน เว็บ (http) หรือ localhost — ตอนนี้ค้นได้: ชื่อหน้า · หัวข้อในหน้านี้ · ศัพท์ · คำสั่ง";

    if (Q.scope === ">") {
      groups.push(["คำสั่ง", T.length ? rank(actions(), T, 30) : actions()]);
    } else if (Q.scope === ":") {
      if (!w.KIT_GLOSSARY) { loadGlossary(function () { if (P.dlg && P.dlg.open) render(); }); groups.push(["ศัพท์", []]); idxNote = '<span class="kp-spin" aria-hidden="true"></span>กำลังโหลดศัพท์…'; }
      else groups.push(["ศัพท์", T.length ? rank(glossItems(), T, 40) : glossItems().slice(0, 60)]);
    } else if (Q.scope === "#") {
      var hs = hereSecItems(), os = otherSecItems();
      if (T.length) { hs = rank(hs, T, 20); os = rank(os, T, 30); }
      groups.push(["ในหน้านี้", hs]);
      groups.push(["หัวข้อในหน้าอื่น", T.length ? os : os.slice(0, 80)]);
    } else if (!T.length) {
      var rec = recentItems();
      if (rec.length) groups.push(["อ่านล่าสุด", rec]);
      else groups.push(["เริ่มที่นี่", ["tax-overview", "tax-wricef", "tax-decisions", "tax-delivery"].map(pageByKey).filter(Boolean).map(function (p) {
        return { type: "page", p: p, title: p.t, sub: groupOf(p) + " · " + p.d, ic: IC.page, href: href(p) };
      })]);
      if (SECS.length) groups.push(["ในหน้านี้", hereSecItems().slice(0, 6)]);
      groups.push(["คำสั่ง", actions().slice(0, 5)]);
    } else {
      if (!w.KIT_GLOSSARY) loadGlossary(function () { if (P.dlg && P.dlg.open) render(); });
      groups.push(["หน้า", rank(pageItems(), T, 5)]);
      groups.push(["ในหน้านี้", rank(hereSecItems(), T, 5)]);
      groups.push(["หัวข้อในหน้าอื่น", rank(otherSecItems(), T, 6)]);
      groups.push(["ศัพท์", rank(glossItems(), T, 5)]);
      groups.push(["ข้อความ (full text)", fullText(Q.q, 6)]);
      groups.push(["คำสั่ง", rank(actions(), T, 3)]);
    }
    return { Q: Q, groups: groups.filter(function (g) { return g[1].length; }), note: idxNote };
  }

  function render() {
    if (!P.dlg) return;
    var raw = P.input.value, R = compute(raw), html = "", items = [], terms = R.Q.terms;
    P.scopeEl.hidden = !R.Q.scope;
    if (R.Q.scope) P.scopeEl.textContent = SCOPES[R.Q.scope];
    R.groups.forEach(function (g) {
      html += '<div class="kp-gl" role="presentation">' + esc(g[0]) + "</div>";
      g[1].forEach(function (it) {
        var i = items.length;
        items.push(it);
        html += '<div class="kp-o' + (it.type === "gl" ? " gl" : "") + '" role="option" id="kpo-' + i + '" data-i="' + i + '" aria-selected="false">' +
          '<span class="kp-ic">' + svg(it.ic || IC.page, 16) + "</span>" +
          '<span class="kp-tx"><div class="kp-t">' + hl(it.title, terms) + (it.cur ? ' <span class="kp-m">· หน้านี้</span>' : "") + "</div>" +
          (it.sub ? '<div class="kp-s">' + hl(it.sub, terms) + "</div>" : "") + "</span>" +
          (it.key ? '<span class="kp-m">' + esc(it.key) + "</span>" : it.m ? '<span class="kp-m">' + esc(it.m) + "</span>" : '<span class="kp-m"></span>') +
          "</div>";
      });
    });
    if (R.note) html += '<div class="kp-info">' + R.note + "</div>";
    if (!items.length && !R.note) {
      html = '<div class="kp-x">ไม่พบ “<b>' + esc(raw.trim()) + '</b>”<br>ลองคำอื่น · พิมพ์ <b>:</b> เพื่อค้นศัพท์ · <b>#</b> หัวข้อ · <b>&gt;</b> คำสั่ง</div>';
    }
    P.list.innerHTML = html;
    P.items = items;
    if (P.lastQ !== raw) P.sel = 0;
    P.lastQ = raw;
    select(Math.min(P.sel, Math.max(0, items.length - 1)), true);
    var gl = (w.KIT_GLOSSARY || []).length, secCount = SECS.length;
    if (IDX && IDX.pages) { secCount = 0; IDX.pages.forEach(function (ip) { secCount += ip.secs.length; }); }
    P.st.textContent = (raw.trim() ? items.length + " ผลลัพธ์ · " : "") + PAGES.length + " หน้า · " + secCount + " หัวข้อ" + (gl ? " · " + gl + " ศัพท์" : "") + (isHttp ? "" : " · offline");
  }
  function select(i, noScroll) {
    var opts = $$(".kp-o", P.list);
    if (!opts.length) { P.input.removeAttribute("aria-activedescendant"); P.prev.innerHTML = previewEmpty(); return; }
    i = (i + opts.length) % opts.length;
    P.sel = i;
    opts.forEach(function (o, k) { o.setAttribute("aria-selected", k === i ? "true" : "false"); });
    P.input.setAttribute("aria-activedescendant", "kpo-" + i);
    var o = opts[i], L = P.list;
    if (!noScroll) {
      if (o.offsetTop - 34 < L.scrollTop) L.scrollTop = Math.max(0, o.offsetTop - 34);
      else if (o.offsetTop + o.offsetHeight + 8 > L.scrollTop + L.clientHeight) L.scrollTop = o.offsetTop + o.offsetHeight + 8 - L.clientHeight;
    } else if (i === 0) L.scrollTop = 0;
    P.prev.innerHTML = preview(P.items[i]);
  }
  function previewEmpty() {
    return '<div class="pv-k">Command palette</div><div class="pv-t">ค้นทุกอย่างใน Lab</div>' +
      '<div class="pv-d">ชื่อหน้า · หัวข้อของทุกหน้า · ศัพท์ ' + ((w.KIT_GLOSSARY || []).length || "") + ' คำ · ข้อความเต็ม · คำสั่ง</div>' +
      '<div class="pv-m">' + k("&gt;") + " คำสั่ง  " + k("#") + " หัวข้อ  " + k(":") + " ศัพท์</div>";
  }
  function preview(it) {
    if (!it) return previewEmpty();
    var Q = parseQuery(P.input.value);
    if (it.type === "gl") {
      var e = it.e;
      return '<div class="pv-k">' + esc(CAT[e.c] || e.c) + '</div><div class="pv-t">' + esc(e.t) + "</div>" + (e.th ? '<div class="pv-th">' + esc(e.th) + "</div>" : "") +
        '<div class="pv-d">' + todoize(esc(e.d)) + "</div>" +
        '<div class="pv-m">↵ เปิดใน Glossary' + (e.ln ? '<br><a href="' + esc(BASE + e.ln) + '" style="color:var(--petrol)">→ ' + esc(e.lt || e.ln) + "</a>" : "") + "</div>";
    }
    if (it.type === "page") {
      var ip = idxPage(it.p.k), secs = it.cur ? SECS : ip ? ip.secs : [];
      return '<div class="pv-k">' + esc(groupOf(it.p)) + (it.p.o ? " · ★ " + esc(it.p.o) : "") + '</div><div class="pv-t">' + esc(it.p.t) + "</div>" +
        '<div class="pv-d">' + esc(it.p.d || "") + "</div>" +
        (it.recent ? '<div class="pv-m">อ่านล่าสุด ' + esc(relTime(it.recent.at)) + (it.recent.st ? "<br>ค้างไว้ที่ " + esc(it.recent.st) : "") + "</div>" : "") +
        (secs.length ? '<ul class="pv-ls">' + secs.slice(0, 14).map(function (s) { return '<li><span class="n">' + esc(s.n) + "</span><span>" + esc(s.t) + "</span></li>"; }).join("") + "</ul>" : "") +
        '<div class="pv-m">' + esc(it.p.f) + " · ↵ เปิด · " + MOD + " ↵ แท็บใหม่</div>";
    }
    if (it.type === "sec") {
      var x = it.local ? (function () { var s = d.getElementById(it.id); return s ? norm(s.textContent) : ""; })() : (it.sx || "");
      return '<div class="pv-k">' + esc(it.local ? "ในหน้านี้" : it.p.s) + '</div><div class="pv-t">' + esc(it.title) + "</div>" +
        (x ? '<div class="pv-sn">' + snippet(x, Q.terms[0] || "", 260) + "</div>" : "") +
        '<div class="pv-m">' + (it.local ? "↵ เลื่อนไปหัวข้อนี้" : esc(it.p.f) + "#" + esc(it.id) + " · ↵ เปิด") + "</div>";
    }
    if (it.type === "ft") {
      return '<div class="pv-k">Full text · ' + it.n + ' จุด</div><div class="pv-t">' + esc(it.p.t) + "</div>" +
        it.snips.map(function (s) { return '<div class="pv-sn">' + s + "</div>"; }).join("") +
        '<div class="pv-m">↵ เปิดและไฮไลต์คำในหน้า</div>';
    }
    return '<div class="pv-k">คำสั่ง</div><div class="pv-t">' + esc(it.title) + "</div>" +
      '<div class="pv-d">' + esc(it.desc || it.sub || "") + "</div>" + (it.key ? '<div class="pv-m">คีย์ลัด ' + it.key.split(" ").map(k).join("") + "</div>" : "");
  }

  function exec(it, newTab) {
    if (!it) return;
    if (it.type === "act" && it.run) {
      if (it.keep) { it.run(); return; }
      closePalette();
      it.run();
      return;
    }
    if (it.type === "sec" && it.local) { closePalette(); jumpTo(it.id); return; }
    if (it.type === "page" && it.cur && !newTab) { closePalette(); toTop(); return; }
    if (it.type === "ft" && it.local && !newTab) {
      closePalette();
      if (it.id) jumpTo(it.id);
      setTimeout(function () { flashHits(it.q); }, it.id ? 450 : 0);
      return;
    }
    var url = it.href;
    if (!url) return;
    if (newTab) { w.open(url, "_blank", "noopener"); return; }
    closePalette();
    location.href = url;
  }

  /* CSS Custom Highlight API: mark every hit on this page without touching the DOM */
  var hlT = 0;
  function flashHits(q) {
    var wrap = $(".wrap");
    if (!wrap || !q) return;
    var ql = q.toLowerCase(), ranges = [];
    var tw = d.createTreeWalker(wrap, NodeFilter.SHOW_TEXT, null), n;
    while ((n = tw.nextNode()) && ranges.length < 80) {
      var t = n.nodeValue.toLowerCase(), i = t.indexOf(ql);
      while (i >= 0 && ranges.length < 80) { var r = d.createRange(); r.setStart(n, i); r.setEnd(n, i + q.length); ranges.push(r); i = t.indexOf(ql, i + ql.length); }
    }
    if (!ranges.length) return;
    var firstEl = ranges[0].startContainer.parentElement;
    revealTarget(firstEl);
    if (firstEl && firstEl.scrollIntoView) firstEl.scrollIntoView({ behavior: smooth(), block: "center" });
    if (w.CSS && CSS.highlights && w.Highlight) {
      var h = new Highlight();
      ranges.forEach(function (r) { h.add(r); });
      CSS.highlights.set("kit-hit", h);
      clearTimeout(hlT);
      hlT = setTimeout(function () { CSS.highlights.delete("kit-hit"); }, 5000);
    }
    toast("พบ " + ranges.length + (ranges.length >= 80 ? "+" : "") + " จุดในหน้านี้");
  }

  function buildPalette() {
    var dlg = el("dialog", "kp");
    dlg.setAttribute("aria-label", "Command palette — ค้นหาและไปที่");
    dlg.innerHTML =
      '<div class="kp-h">' + svg(IC.search, 18) + '<span class="kp-scope" hidden></span>' +
      '<input type="search" role="combobox" aria-expanded="true" aria-controls="kpList" aria-autocomplete="list" aria-label="ค้นหา" autocomplete="off" spellcheck="false" enterkeyhint="go" ' +
      'placeholder="ค้นหน้า · หัวข้อ · ศัพท์ · ข้อความ…">' + k("Esc") + "</div>" +
      '<div class="kp-b"><div class="kp-l" id="kpList" role="listbox" aria-label="ผลการค้นหา"></div><div class="kp-p"></div></div>' +
      '<div class="kp-f"><span>' + k("↑") + k("↓") + ' เลือก</span><span>' + k("↵") + ' เปิด</span><span class="hide-s">' + k(MOD + " ↵") + ' แท็บใหม่</span>' +
      '<span class="hide-s">' + k("&gt;") + " คำสั่ง " + k("#") + " หัวข้อ " + k(":") + ' ศัพท์</span><span class="kp-st" aria-live="polite"></span></div>';
    d.body.appendChild(dlg);
    P.dlg = dlg;
    P.input = $("input", dlg);
    P.list = $(".kp-l", dlg);
    P.prev = $(".kp-p", dlg);
    P.st = $(".kp-st", dlg);
    P.scopeEl = $(".kp-scope", dlg);
    wireDialog(dlg);
    var t = 0;
    P.input.addEventListener("input", function () { clearTimeout(t); t = setTimeout(render, 40); });
    dlg.addEventListener("keydown", function (e) {
      var key = e.key;
      if (key === "ArrowDown" || (key === "Tab" && !e.shiftKey)) { e.preventDefault(); select(P.sel + 1); }
      else if (key === "ArrowUp" || (key === "Tab" && e.shiftKey)) { e.preventDefault(); select(P.sel - 1); }
      else if (key === "PageDown") { e.preventDefault(); select(Math.min(P.items.length - 1, P.sel + 6)); }
      else if (key === "PageUp") { e.preventDefault(); select(Math.max(0, P.sel - 6)); }
      else if (key === "Enter") { e.preventDefault(); exec(P.items[P.sel], e.ctrlKey || e.metaKey); }
      else if ((e.ctrlKey || e.metaKey) && (key === "k" || key === "K")) { e.preventDefault(); closePalette(); }
      else if (key === "Escape" && P.input.value) { e.preventDefault(); setQuery(""); }
    });
    P.list.addEventListener("mousemove", function (e) {
      var o = e.target.closest(".kp-o");
      if (o && +o.getAttribute("data-i") !== P.sel) select(+o.getAttribute("data-i"), true);
    });
    P.list.addEventListener("click", function (e) {
      var o = e.target.closest(".kp-o");
      if (o) exec(P.items[+o.getAttribute("data-i")], e.ctrlKey || e.metaKey);
    });
  }
  function setQuery(q) { P.input.value = q; P.lastQ = null; render(); P.input.focus(); }
  function openPalette(q) {
    if (!P.dlg) buildPalette();
    if (!P.dlg.open) { closeAll(); lockScroll(true); P.dlg.showModal(); }
    hidePeek();
    P.input.value = q || "";
    P.lastQ = null;
    render();
    P.input.focus();
    try { P.input.setSelectionRange(P.input.value.length, P.input.value.length); } catch (e) {}
    if (isHttp && !IDX) idle(function () { buildIndex(function () { if (P.dlg.open) render(); }); }, 400);
    if (!w.KIT_GLOSSARY) loadGlossary(function () { if (P.dlg.open) render(); });
  }
  function closePalette() { if (P.dlg && P.dlg.open) P.dlg.close(); }
  api.palette = openPalette;
  api.toast = toast;

  /* ============================================================
     T43 · GLOBAL SHORTCUTS
     ============================================================ */
  var gPending = 0;
  function stepSection(dir) {
    if (!SECS.length) return;
    var cur = computeActive(), nx = cur + dir, barH = cssNum("--kb-h", 52);
    var curTop = cur >= 0 ? SECS[cur].el.getBoundingClientRect().top : 0;
    if (dir > 0 && cur >= 0 && curTop > barH + 30) nx = cur;          /* section start still below the bar → align it first */
    if (dir < 0 && cur >= 0 && curTop < barH - 30) nx = cur;          /* mid-section → back to its start first */
    nx = Math.max(0, Math.min(SECS.length - 1, nx));
    revealTarget(SECS[nx].el);
    SECS[nx].el.scrollIntoView({ behavior: smooth(), block: "start" });
  }
  function onKey(e) {
    var key = e.key, mod = e.ctrlKey || e.metaKey;
    if (mod && !e.altKey && !e.shiftKey && (key === "k" || key === "K")) { e.preventDefault(); openPalette(""); return; }
    if (mod || e.altKey || e.defaultPrevented || anyDialog()) return;
    var t = e.target, tag = (t && t.tagName) || "";
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    if (key === "Escape") { hidePeek(); return; }
    if (gPending) {
      clearTimeout(gPending); gPending = 0;
      if (key === "h") { e.preventDefault(); location.href = BASE + "index.html"; return; }
      if (key === "g") { e.preventDefault(); toTop(); return; }
    }
    if (key === "/") { if (d.getElementById("q")) return; e.preventDefault(); openPalette(""); }
    else if (key === "?") { e.preventDefault(); openKeys(); }
    else if (key === "t" || key === "T") { if (w.KitTheme) { e.preventDefault(); w.KitTheme.toggle(); } }
    else if (key === "m" || key === "M") { e.preventDefault(); openDrawer(); }
    else if (key === "j") { e.preventDefault(); stepSection(1); }
    else if (key === "k") { e.preventDefault(); stepSection(-1); }
    else if (key === "[" || key === "]") {
      var nb = neighbours(), p = key === "[" ? nb.prev : nb.next;
      if (p) { e.preventDefault(); location.href = href(p); }
    }
    else if (key === "g") { gPending = setTimeout(function () { gPending = 0; }, 900); }
  }

  /* ============================================================
     T43 · SPEED: Speculation Rules (prerender on hover intent)
     ============================================================ */
  function speculate() {
    try {
      if (!isHttp || !w.HTMLScriptElement || !HTMLScriptElement.supports || !HTMLScriptElement.supports("speculationrules")) return;
      var s = d.createElement("script");
      s.type = "speculationrules";
      s.textContent = JSON.stringify({
        prerender: [{
          source: "document",
          where: { and: [{ href_matches: "/*" }, { not: { selector_matches: ["a[href^='#']", "[download]", "[target='_blank']"] } }] },
          eagerness: "moderate"
        }]
      });
      d.head.appendChild(s);
    } catch (e) {}
  }

  /* ---------- spotlight: pointer-tracked light on hub cards + pager ---------- */
  function initSpotlight() {
    var raf = 0, ev = null;
    d.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      ev = e;
      if (raf) return;
      raf = w.requestAnimationFrame(function () {
        raf = 0;
        var c = ev.target && ev.target.closest && ev.target.closest("a.doc, .kpg");
        if (!c) return;
        var r = c.getBoundingClientRect();
        c.style.setProperty("--mx", (ev.clientX - r.left) + "px");
        c.style.setProperty("--my", (ev.clientY - r.top) + "px");
      });
    }, { passive: true });
  }

  /* ============================================================
     BOOT
     ============================================================ */
  function boot() {
    var step = function (fn) { try { fn(); } catch (e) { if (w.console) console.warn("[Lab shell]", e); } };
    SECS = readSections(d);
    step(buildBar);
    step(buildProgress);
    step(buildAnchors);
    step(buildPager);
    step(buildRail);
    step(buildDrawer);
    step(initSpotlight);
    step(speculate);
    d.addEventListener("keydown", onKey);
    w.addEventListener("scroll", onScroll, { passive: true });
    w.addEventListener("resize", function () { placeRail(); onScroll(); hidePeek(); }, { passive: true });
    if (w.ResizeObserver && rail) { var ro = new ResizeObserver(function () { placeRail(); }); ro.observe(d.body); }
    w.addEventListener("hashchange", function () { var t = targetFromHash(); if (t) revealTarget(t); });
    d.addEventListener("toggle", function () { onScroll(); }, true);
    var t0 = targetFromHash();
    if (t0 && revealTarget(t0)) setTimeout(function () { t0.scrollIntoView({ block: "start" }); }, 30);
    onScroll();
    /* record the visit only when the page is really shown (not while prerendered) */
    var record = function () { step(function () { histTouch(); }); };
    if (d.prerendering) d.addEventListener("prerenderingchange", record, { once: true }); else record();
    idle(function () { step(initPeek); }, 2500);
    root.classList.add("kit-shell-ready");
    try { d.dispatchEvent(new CustomEvent("kit:shell")); } catch (e) {}
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot); else boot();
})();
