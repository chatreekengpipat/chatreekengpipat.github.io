/* ============================================================
   theme.js · SAP FI Tax Lab — shared runtime (ทุกหน้าโหลดไฟล์เดียวกัน)
   วางไว้ใน <head> (ไม่ defer) เพื่อ set ธีมก่อน paint = ไม่มี flash
   ครอบคลุม:
     T1  Dark/Light toggle + localStorage + prefers-color-scheme
     T3  Checklist persistence + ปุ่ม Reset ต่อ section
     T4  Copy T-code ต่อแถว · Dr/Cr reveal ทีละบรรทัด
     T5  Scroll-reveal (fade-up) · hover lift (ผ่าน CSS) · TOC scroll-spy
         · prefers-reduced-motion (เคารพทุกจุด)
     T43 Page registry (window.KIT_PAGES) · favicon · theme-color
         · circular theme switch (View Transitions) · loads shell.js
         (app bar, drawer, on-this-page rail, pager, palette — async)
   หมายเหตุ: เขียนแบบ defensive — ถ้าส่วนไหน error หน้าเนื้อหายังอ่านได้ครบ
   ถ้า shell.js โหลดไม่ได้ หน้าจะกลับเป็นแบบเดิม (ปุ่มธีมลอยมุมขวาบน)
   ============================================================ */
(function () {
  "use strict";
  var d = document, root = d.documentElement;
  var NS = "kit:v1:";
  var THEME_KEY = "theme";   /* shared with the portfolio, so dark mode follows the whole site */

  /* ---------- R) Page registry · one list, reading order = hub order ----------
     k = data-page key · f = file · t = title · s = short label · g = group
     o = WRICEF object I own · d = one-line scope (palette / preview)
     r = 0 → no "on this page" rail (hub, glossary, quiz have no sections)   */
  var GROUPS = {
    hub: "Hub", found: "Foundation", r1: "Role 1 · My 5 WRICEFs", r25: "Roles 2–5",
    dec: "Decisions", ref: "Reference & practice", rel: "Related · not mine"
  };
  var PAGES = [
    { k: "hub", f: "index.html", t: "Hub — SAP FI-Tax Knowledge Lab", s: "Hub", g: "hub", r: 0, d: "Snapshot · timeline · current focus · ทุกเล่มในที่เดียว" },
    { k: "tax-overview", f: "overview.html", t: "Client FI-Tax Design — ภาพใหญ่", s: "Client FI-Tax Design", g: "found", d: "FI ใน S/4 · ledgers 0L/S1/S2/T1/G1 · LC1/LC2/LC3 · segment · JVA · run order · integration matrix · golden threads" },
    { k: "tax-bpe", f: "blueprint.html", t: "Tax Blueprint + Systems (D2.1)", s: "Blueprint + Systems", g: "found", d: "System landscape · process backbone · 6 L4 · KDS map · WRICEF 52 ตัว" },
    { k: "tax-wht", f: "wht.html", t: "Withholding Tax (TAX-301)", s: "Withholding Tax", g: "found", d: "Extended WHT · types & codes · type × code builder · gross-up · output groups · e-WHT · ENH-2" },
    { k: "tax-indirect", f: "indirect-tax.html", t: "VAT / VAT36 — Indirect tax", s: "VAT / VAT36", g: "found", d: "TAXTH → FTXP → OB40 · tax code decoder · VAT36 V1/V2 · reverse charge · deferred VAT → RPT-6 → P.P.30" },
    { k: "tax-statutory", f: "statutory.html", t: "Statutory filing — แบบไหน · อัตรา · กำหนดยื่น", s: "Statutory filing", g: "found", d: "PND1/2/3/53/54 · DRC vs WRICEF map · WHT rates · PP30/36 · 50 ทวิ · CIT/PITA · MY/MM/Oman" },
    { k: "tax-wricef", f: "wricef-portfolio.html", t: "My 5 WRICEFs — portfolio", s: "My 5 WRICEFs", g: "r1", d: "สถานะ · shared engine ZTAXB_R01 · dependencies & blockers · objects ข้างเคียง" },
    { k: "tax-engine", f: "wht-engine-xray.html", t: "ZTAXA_R01 X-ray — โปรแกรมเดียว 11 WRICEFs", s: "ZTAXA_R01 X-ray", g: "r1", d: "Event flow · output-group routing ตามโค้ด · change history · blast radius ต่อ WRICEF" },
    { k: "tax-models", f: "model-lab.html", t: "SAP Model Lab — 5 interactive models", s: "SAP Model Lab", g: "r1", d: "Split lines หลาย PC · alternative payee · 1 payment หลาย invoice · realized FX ข้ามสกุล LC1/2/3 · รายงาน PC × RI" },
    { k: "tax-r074", f: "rpt1-wht-vat-recon.html", t: "TAX-RPT-1 — PND54 ↔ VAT36 (design)", s: "RPT-1 · design", g: "r1", o: "RPT-1", d: "FD v0.1 + agreed design · 2 FX columns · step 28 final · split lines · multi-invoice · 34 columns" },
    { k: "tax-r074-fut", f: "rpt1-fut-evidence.html", t: "TAX-RPT-1 — FUT evidence", s: "RPT-1 · FUT evidence", g: "r1", o: "RPT-1", d: "TKT-02 · TC-003 · GETWA dump · 9-TC doc sets · open issues · specimen registry" },
    { k: "tax-r044", f: "rpt2-oman-vat.html", t: "TAX-RPT-2 — Oman VAT + cash call", s: "RPT-2 · Oman VAT", g: "r1", o: "RPT-2", d: "ZTAXA_R04 · BSET vs BSEG · JVA lookup 3 ชั้น · multi-PC Total · ZVAR_CC / ZVAR_FULL" },
    { k: "tax-f078", f: "frm1-wht-attachment.html", t: "TAX-FRM-1 — ใบแนบ ภ.ง.ด.3/53/54", s: "FRM-1 · ใบแนบ PND3/53/54", g: "r1", o: "FRM-1", d: "R03 · 6 logic paths (PC/RI) · DFKKBPTAXNUM · 18 fields · vendor copy · alternative payee" },
    { k: "tax-e075", f: "enh1-rd-text-files.html", t: "TAX-ENH-1 — RD text files ภ.ง.ด.1/1ก/2/2ก/3/53", s: "ENH-1 · RD text files", g: "r1", o: "ENH-1", d: "DMEEX 6 trees · exits · ZTAXA_E01 · output groups E01–E04 · Tambon (ADRC) gap" },
    { k: "tax-f008", f: "frm2-mm-wht-certificate.html", t: "TAX-FRM-2 — WHT certificate Myanmar", s: "FRM-2 · Myanmar WHT cert", g: "r1", o: "FRM-2", d: "ZTAXA_F01_MM3 · IRD(IT)-05-01 · MMK/USD/doc · DTA remark · 24 fields · scope TBC" },
    { k: "tax-docverify", f: "doc-verification.html", t: "FI document verification (Role 2)", s: "FI doc verification", g: "r25", d: "11 ช่องที่ต้องถูก · กฎ LC 3 ข้อ · 5 quick checks · TAX-ENH-4 · FB03" },
    { k: "tax-kut", f: "kut.html", t: "KUT preparation & planning (Role 3)", s: "KUT prep & planning", g: "r25", d: "Tax course programme · tracker · deck template · TAX-405 slide map · TAX-402 · TAX-401-1" },
    { k: "tax-delivery", f: "delivery-fut.html", t: "Delivery & FUT (Role 4)", s: "Delivery & FUT", g: "r25", d: "Plan on a page SG1–SG12 · WRICEF lifecycle · FUT loop · diagnostics · JIRA format · backlog" },
    { k: "tax-sit", f: "sit.html", t: "SIT execution (Role 5)", s: "SIT execution", g: "r25", d: "QAS · script columns · check block · evidence standard · WRICEF test gates" },
    { k: "tax-decisions", f: "decisions.html", t: "Decisions & open points", s: "Decisions & open points", g: "dec", d: "Locked decisions · D1–D7 · gaps G1–G17 · conflict register · lessons learned" },
    { k: "tax-mastery", f: "tables-qa.html", t: "Tables & Q&A — expert reference", s: "Tables & Q&A", g: "ref", d: "Table dictionary · ACDOCA vs BSEG · Q&A drill 15 ข้อ" },
    { k: "tax-se16n", f: "se16n.html", t: "SE16N — ดึงข้อมูลให้ครบ", s: "SE16N guide", g: "ref", d: "Selection · fields · subtotal · export · 12 recipes · 10 กับดัก" },
    { k: "tax-glossary", f: "glossary.html", t: "FI-TAX Glossary", s: "Glossary", g: "ref", r: 0, d: "ศัพท์ consultant · ค้น instant · flashcards" },
    { k: "tax-quiz", f: "quiz.html", t: "FI-TAX Quiz", s: "Quiz", g: "ref", r: 0, d: "Active recall · เฉลยทันที · เกณฑ์ผ่าน 80%" },
    { k: "tax-r028", f: "rel-current-tax-th.html", t: "TAX-RPT-3 — Current Tax ไทย", s: "RPT-3 · Current Tax TH", g: "rel", d: "ZTAXA_R05 · GL/UP/CL nodes · LC1/2/3 · IBCSVCS · IBCTC · BOI" },
    { k: "tax-r020", f: "rel-current-tax-intl.html", t: "TAX-RPT-4 — Current Tax ต่างประเทศ", s: "RPT-4 · Current Tax overseas", g: "rel", d: "ZTAXB_R02 · overlay 14 ประเทศ · ZTAXB_T02 · TAX_INFO · Malaysia ACL7–16" },
    { k: "tax-r022", f: "rel-loss-carryforward.html", t: "TAX-RPT-5 — Loss Carried Forward", s: "RPT-5 · LCF", g: "rel", d: "ZTAXB_R03_LCF · Update table for LCF · ZTAXB_T03/003 · LC2 conv" }
  ];
  window.KIT_GROUPS = GROUPS;
  window.KIT_PAGES = PAGES;

  function fileStem(f) { return String(f || "").replace(/\.html?$/i, "").toLowerCase(); }
  var here = null;
  try {
    var seg = decodeURIComponent((location.pathname || "").split("/").pop() || "");
    var stem = fileStem(seg) || "index";
    for (var pi = 0; pi < PAGES.length; pi++) if (fileStem(PAGES[pi].f) === stem) { here = PAGES[pi]; break; }
  } catch (e) {}
  window.KIT_HERE = here;

  /* ---------- 0) ตั้งธีมทันที (ก่อน body paint) ---------- */
  function systemPrefersDark() {
    return !!(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
  }
  function reducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }
  function ls(get, key, val) {
    try { return get ? localStorage.getItem(key) : localStorage.setItem(key, val); }
    catch (e) { return null; }
  }
  function lsRemove(key) { try { localStorage.removeItem(key); } catch (e) {} }

  var initialTheme;
  try {
    var saved = localStorage.getItem(THEME_KEY);
    initialTheme = (saved === "dark" || saved === "light") ? saved : (systemPrefersDark() ? "dark" : "light");
  } catch (e) { initialTheme = "light"; }
  root.setAttribute("data-theme", initialTheme);
  root.classList.add("has-js");

  /* browser chrome colour (mobile address bar, PWA title bar) follows the theme */
  function syncThemeColor(t) {
    try {
      var m = d.querySelector('meta[name="theme-color"]');
      if (!m) { m = d.createElement("meta"); m.name = "theme-color"; d.head.appendChild(m); }
      m.content = (t === "dark") ? "#0F172A" : "#F8FAFC";
    } catch (e) {}
  }
  syncThemeColor(initialTheme);

  /* favicon · ledger mark (two lines + brass total) — no extra request */
  try {
    if (!d.querySelector('link[rel~="icon"]')) {
      var ic = d.createElement("link");
      ic.rel = "icon"; ic.type = "image/svg+xml";
      ic.href = "data:image/svg+xml," + encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#2563EB"/>' +
        '<rect x="8" y="9" width="16" height="2.8" rx="1.4" fill="#F8FAFC"/><rect x="8" y="14.6" width="11" height="2.8" rx="1.4" fill="#F8FAFC" opacity=".72"/>' +
        '<rect x="8" y="20.2" width="16" height="2.8" rx="1.4" fill="#F59E0B"/></svg>');
      d.head.appendChild(ic);
    }
  } catch (e) {}

  /* ---------- S) App shell (shell.js, async) ----------
     kit-shell reserves the app-bar space from the first paint (no layout shift);
     kit-rail shifts content left on wide screens to make room for "on this page".
     If shell.js never arrives, both classes come off and the page looks as before. */
  var BASE = "";
  try { var me = d.currentScript; if (me && me.src) BASE = me.src.replace(/[^\/]*$/, ""); } catch (e) {}
  window.KIT_BASE = BASE;
  root.classList.add("kit-shell");
  if (here && here.r !== 0) root.classList.add("kit-rail");
  function shellFail() { if (!window.KitShell) { root.classList.remove("kit-shell", "kit-rail"); updateToggle(currentTheme()); } }
  try {
    var sh = d.createElement("script");
    sh.src = BASE + "shell.js"; sh.async = true; sh.onerror = shellFail;
    d.head.appendChild(sh);
    setTimeout(shellFail, 6000);
  } catch (e) { shellFail(); }

  function currentTheme() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  function setTheme(t) {
    root.setAttribute("data-theme", t);
    ls(false, THEME_KEY, t);
    syncThemeColor(t);
    updateToggle(t);
  }

  /* ตามระบบเมื่อ user ยังไม่เคยเลือกเอง */
  try {
    if (window.matchMedia) {
      var mq = window.matchMedia("(prefers-color-scheme: dark)");
      var onChange = function (e) {
        var chosen = null;
        try { chosen = localStorage.getItem(THEME_KEY); } catch (err) {}
        if (chosen !== "dark" && chosen !== "light") {
          root.setAttribute("data-theme", e.matches ? "dark" : "light");
          syncThemeColor(currentTheme());
          updateToggle(currentTheme());
        }
      };
      if (mq.addEventListener) mq.addEventListener("change", onChange);
      else if (mq.addListener) mq.addListener(onChange);
    }
  } catch (e) {}

  /* ---------- helpers ---------- */
  function pageKey() {
    if (d.body && d.body.getAttribute("data-page")) return d.body.getAttribute("data-page");
    var p = (location.pathname || "").split("/").pop() || "page";
    return p.replace(/\.html?$/i, "") || "page";
  }
  function toArray(nl) { return Array.prototype.slice.call(nl); }
  function ready(fn) {
    if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", fn);
    else fn();
  }

  /* ---------- 1) Toggle button ---------- */
  var ICON_SUN = '<svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/></svg>';
  var ICON_MOON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';
  function updateToggle(t) {
    var b = d.querySelector(".theme-toggle");
    if (!b) return;
    var icon = b.querySelector(".ti");
    if (icon) icon.innerHTML = (t === "dark") ? ICON_SUN : ICON_MOON;
    var label = (t === "dark") ? "สลับเป็นโหมดสว่าง" : "สลับเป็นโหมดมืด";
    b.setAttribute("aria-label", label);
    b.setAttribute("title", label + " (T)");
  }
  /* circular reveal from the button (View Transitions); instant when unsupported / reduced motion */
  function toggleTheme(ev) {
    var next = currentTheme() === "dark" ? "light" : "dark";
    if (!d.startViewTransition || reducedMotion()) { setTheme(next); return; }
    var x = window.innerWidth - 36, y = 26;
    try {
      var src = ev && ev.currentTarget && ev.currentTarget.getBoundingClientRect ? ev.currentTarget : d.querySelector(".theme-toggle");
      if (src) { var r = src.getBoundingClientRect(); if (r.width) { x = r.left + r.width / 2; y = r.top + r.height / 2; } }
    } catch (e) {}
    var end = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    root.classList.add("kit-vt-theme");
    var done = function () { root.classList.remove("kit-vt-theme"); };
    try {
      var vt = d.startViewTransition(function () { setTheme(next); });
      vt.ready.then(function () {
        root.animate(
          { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + end + "px at " + x + "px " + y + "px)"] },
          { duration: 520, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" }
        );
      }).catch(done);
      vt.finished.then(done, done);
    } catch (e) { done(); setTheme(next); }
  }
  function injectToggle() {
    if (d.querySelector(".theme-toggle")) return;
    var b = d.createElement("button");
    b.type = "button";
    b.className = "theme-toggle";
    b.innerHTML = '<span class="ti" aria-hidden="true"></span>';
    b.addEventListener("click", toggleTheme);
    d.body.appendChild(b);
    updateToggle(currentTheme());
  }

  /* ---------- 2) Checklist persistence + summary ---------- */
  function countChecked(boxes) {
    var n = 0;
    for (var i = 0; i < boxes.length; i++) if (boxes[i].checked) n++;
    return n;
  }
  function writeSummary(pk, c, t) {
    ls(false, NS + pk + ":summary", JSON.stringify({ c: c, t: t }));
  }
  function initChecklists() {
    var boxes = toArray(d.querySelectorAll("input.box"));
    var pk = pageKey();
    if (!boxes.length) { writeSummary(pk, 0, 0); return; }
    boxes.forEach(function (box, i) {
      var key = NS + pk + ":chk:" + i;
      box.setAttribute("data-k", key);
      if (ls(true, key) === "1") box.checked = true;
      box.addEventListener("change", function () {
        if (box.checked) ls(false, key, "1"); else lsRemove(key);
        writeSummary(pk, countChecked(boxes), boxes.length);
      });
      /* a11y + touch: give the box an accessible name from its row text,
         and let a tap anywhere on the row toggle it (enlarges the target) */
      var row = box.closest ? box.closest(".qitem") : null;
      var txt = row ? row.querySelector(".qtext") : null;
      if (txt) {
        if (!txt.id) txt.id = "qt-" + pk + "-" + i;
        box.setAttribute("aria-labelledby", txt.id);
        row.classList.add("qitem-tap");
        row.addEventListener("click", function (e) {
          if (e.target === box) return;
          if (e.target.closest && e.target.closest("a,button,input,label")) return;
          box.checked = !box.checked;
          box.dispatchEvent(new Event("change", { bubbles: true }));
        });
      }
    });
    writeSummary(pk, countChecked(boxes), boxes.length);
    wireResets(pk, boxes);
  }
  function wireResets(pk, allBoxes) {
    toArray(d.querySelectorAll(".chk-reset")).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var scope = btn.closest ? (btn.closest(".qgroup") || btn.closest("section")) : null;
        scope = scope || d;
        toArray(scope.querySelectorAll("input.box")).forEach(function (b) {
          b.checked = false;
          var k = b.getAttribute("data-k");
          if (k) lsRemove(k);
        });
        writeSummary(pk, countChecked(allBoxes), allBoxes.length);
      });
    });
  }

  /* ---------- 3) Scroll-reveal (fade-up) ---------- */
  function initReveal() {
    if (reducedMotion() || !("IntersectionObserver" in window)) return;
    var sel = ".wrap > section, .grid > a.doc, .grid > .soon, .reveal-block";
    var els = toArray(d.querySelectorAll(sel));
    if (!els.length) return;
    /* deep link (#section) → reveal immediately so the jump lands on visible content */
    var target = null;
    try { target = location.hash ? d.getElementById(decodeURIComponent(location.hash.slice(1))) : null; } catch (e) {}
    els.forEach(function (el) { if (target && el.contains(target)) return; el.classList.add("kit-reveal"); });
    els = els.filter(function (el) { return el.classList.contains("kit-reveal"); });
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("kit-in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.04 });
    els.forEach(function (el) { io.observe(el); });
    /* safety net: เผยทั้งหมดแน่นอนภายใน 1.6s ไม่ว่ายังไง */
    setTimeout(function () { els.forEach(function (el) { el.classList.add("kit-in"); }); }, 1600);
  }

  /* ---------- 4) TOC scroll-spy (nav.toc) ---------- */
  function initScrollSpy() {
    var toc = d.querySelector("nav.toc");
    if (!toc || !("IntersectionObserver" in window)) return;
    var map = toArray(toc.querySelectorAll('a[href^="#"]')).map(function (a) {
      var id = a.getAttribute("href").slice(1);
      return { a: a, sec: id ? d.getElementById(id) : null };
    }).filter(function (x) { return x.sec; });
    if (!map.length) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) {
          map.forEach(function (m) { m.a.classList.toggle("toc-active", m.sec === en.target); });
        }
      });
    }, { rootMargin: "-18% 0px -72% 0px" });
    map.forEach(function (m) { io.observe(m.sec); });
  }

  /* ---------- 5) Copy buttons (T-code table) ---------- */
  function fallbackCopy(text, done) {
    try {
      var ta = d.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", "");
      ta.style.position = "absolute"; ta.style.left = "-9999px";
      d.body.appendChild(ta); ta.select();
      d.execCommand("copy"); d.body.removeChild(ta);
      done && done();
    } catch (e) {}
  }
  function copyText(text, btn) {
    var flash = function () {
      if (!btn) return;
      var orig = btn.textContent;
      btn.textContent = "✓"; btn.classList.add("copied");
      setTimeout(function () { btn.textContent = orig; btn.classList.remove("copied"); }, 1100);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(flash, function () { fallbackCopy(text, flash); });
    } else { fallbackCopy(text, flash); }
  }
  function initCopy() {
    toArray(d.querySelectorAll("table.tcode-table tbody tr")).forEach(function (tr) {
      var cell = tr.querySelector("td");
      if (!cell) return;
      var codes = toArray(cell.querySelectorAll("code")).map(function (c) { return c.textContent.trim(); });
      var text = codes.length ? codes.join(" / ") : cell.textContent.trim();
      if (!text) return;
      var btn = d.createElement("button");
      btn.type = "button"; btn.className = "copy-btn"; btn.textContent = "copy";
      btn.setAttribute("aria-label", "คัดลอก " + text);
      btn.addEventListener("click", function () { copyText(text, btn); });
      cell.appendChild(btn);
    });
  }

  /* ---------- 6) Posting Dr/Cr reveal (.post-reveal) ---------- */
  function initPostReveal() {
    var tables = toArray(d.querySelectorAll("table.post-reveal"));
    if (!tables.length) return;
    var revealAll = function () {
      tables.forEach(function (t) { toArray(t.querySelectorAll("tbody tr")).forEach(function (r) { r.classList.add("row-in"); }); });
    };
    /* no IO or reduced motion → show every row immediately (never hide content) */
    if (reducedMotion() || !("IntersectionObserver" in window)) { revealAll(); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return;
        var rows = toArray(en.target.querySelectorAll("tbody tr"));
        rows.forEach(function (r, i) { setTimeout(function () { r.classList.add("row-in"); }, 90 * i); });
        io.unobserve(en.target);
      });
    }, { threshold: 0.25 });
    tables.forEach(function (t) { io.observe(t); });
    setTimeout(revealAll, 2500);
  }

  /* ---------- 7) Landmark: the content column is the page's <main> ---------- */
  function initLandmark() {
    if (d.querySelector("main, [role=main]")) return;
    var wrap = d.querySelector(".wrap");
    if (!wrap) return;
    wrap.setAttribute("role", "main");
    if (!wrap.id) wrap.id = "main";
    wrap.setAttribute("tabindex", "-1");
  }

  /* ---------- boot ---------- */
  ready(function () {
    try { initLandmark(); } catch (e) {}
    try { injectToggle(); } catch (e) {}
    try { initChecklists(); } catch (e) {}
    try { initReveal(); } catch (e) {}
    try { initScrollSpy(); } catch (e) {}
    try { initCopy(); } catch (e) {}
    try { initPostReveal(); } catch (e) {}
  });

  /* expose เผื่อ hub (index) และ shell.js เรียกใช้ */
  window.KitTheme = {
    get: currentTheme, set: setTheme, toggle: toggleTheme, ns: NS,
    reducedMotion: reducedMotion, copy: copyText, pageKey: pageKey
  };
})();
