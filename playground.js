/* ============================================================
   playground.js · Interactive playground (index.html#playground)
   + playable defect board in "How I work".
   Standard SAP S/4HANA behaviour and Thai tax rules with SAMPLE
   amounts — no client data, nothing leaves the browser.
   Progressive enhancement: without JS the section still shows
   what each simulator does, and the defect board stays static.
   ============================================================ */
(function () {
  'use strict';
  var d = document;
  var reduce = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  var NF2 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  function rnd(n, dp) { var f = Math.pow(10, dp == null ? 2 : dp); return (n < 0 ? -1 : 1) * Math.round(Math.abs(n) * f + 1e-9) / f; }
  function fmt(n) { var v = rnd(n); return NF2.format(v === 0 ? 0 : v); }
  function num(v) { var x = parseFloat(String(v).replace(/,/g, '')); return isFinite(x) ? x : 0; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function seg(name, opts, cur) {
    return '<div class="pg-seg" data-seg="' + name + '" role="group">' + opts.map(function (o) {
      return '<button type="button" data-v="' + o[0] + '" aria-pressed="' + (o[0] === cur) + '"' + (o[2] ? ' disabled' : '') + '>' + o[1] + '</button>';
    }).join('') + '</div>';
  }
  function wireSeg(el, S, onChange) {
    el.addEventListener('click', function (e) {
      var b = e.target.closest('.pg-seg button');
      if (!b || b.disabled || !el.contains(b)) return;
      var g = b.parentNode.getAttribute('data-seg');
      S[g] = b.getAttribute('data-v');
      Array.prototype.forEach.call(b.parentNode.querySelectorAll('button'), function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      onChange(g);
    });
  }
  function postTable(lines, caption) {
    var dr = 0, cr = 0;
    var rows = lines.map(function (l) {
      dr += l[2]; cr += l[3];
      return '<tr><td>' + esc(l[0]) + '</td><td>' + esc(l[1]) + '</td><td class="n pg-dr">' + (l[2] ? fmt(l[2]) : '') + '</td><td class="n pg-cr">' + (l[3] ? fmt(l[3]) : '') + '</td></tr>';
    }).join('');
    var ok = Math.abs(rnd(dr) - rnd(cr)) < 0.005;
    return (caption ? '<h4>' + caption + '</h4>' : '') + '<div class="pg-scroll"><table class="pg-tbl"><thead><tr><th>Key</th><th>Account</th><th class="n">Debit</th><th class="n">Credit</th></tr></thead><tbody>' + rows +
      '<tr class="tot"><td colspan="2">Balanced ' + (ok ? '<span class="pg-ok">✓</span>' : '<span class="pg-bad">✗</span>') + '</td><td class="n pg-dr">' + fmt(dr) + '</td><td class="n pg-cr">' + fmt(cr) + '</td></tr></tbody></table></div>';
  }

  /* =========================================================
     01 · SAP FLOW PLAYER
     line = [account-determination key, account, debit, credit]
     ========================================================= */
  var FLOWS = {
    p2p: { label: 'Procure-to-Pay', note: 'Stock material · input VAT 7% · no withholding on goods', steps: function (A) {
      var V = rnd(A * 0.07);
      return [
        { t: 'Purchase requisition', who: 'Requester', tc: 'ME51N', tb: ['EBAN'], say: 'A need is recorded. There is no accounting yet — no FI document.', p: [] },
        { t: 'Purchase order', who: 'Buyer', tc: 'ME21N', tb: ['EKKO', 'EKPO'], say: 'A commitment to the vendor. Still no FI document.', p: [] },
        { t: 'Goods receipt', who: 'Warehouse', tc: 'MIGO · mvt 101', tb: ['MATDOC', 'ACDOCA'], say: 'Stock rises at the PO price. The liability waits on GR/IR until the invoice arrives.', p: [['BSX', 'Inventory', A, 0], ['WRX', 'GR/IR clearing', 0, A]] },
        { t: 'Invoice receipt', who: 'Accounts payable', tc: 'MIRO', tb: ['RBKP', 'RSEG', 'ACDOCA', 'BSET'], say: 'Three-way match: GR/IR is cleared, input VAT is recorded and the vendor is owed the gross amount.', p: [['WRX', 'GR/IR clearing', A, 0], ['VST', 'Input VAT', V, 0], ['K', 'Vendor', 0, A + V]] },
        { t: 'Payment', who: 'Treasury', tc: 'F110', tb: ['REGUH', 'PAYR', 'ACDOCA'], say: 'The payment run clears the open item. GR/IR and the vendor both end at zero.', p: [['K', 'Vendor', A + V, 0], ['—', 'Bank', 0, A + V]] }
      ];
    } },
    o2c: { label: 'Order-to-Cash', note: 'Goods sale · output VAT 7% · standard cost 60% of price (sample)', steps: function (A) {
      var C = rnd(A * 0.6), V = rnd(A * 0.07);
      return [
        { t: 'Sales order', who: 'Sales', tc: 'VA01', tb: ['VBAK', 'VBAP'], say: 'The customer order is captured with price and tax code. No FI document.', p: [] },
        { t: 'Delivery & goods issue', who: 'Warehouse', tc: 'VL01N · PGI 601', tb: ['LIKP', 'LIPS', 'MATDOC', 'ACDOCA'], say: 'Goods leave stock at standard cost and cost of goods sold is recognised.', p: [['GBB', 'Cost of goods sold', C, 0], ['BSX', 'Inventory', 0, C]] },
        { t: 'Billing', who: 'Billing', tc: 'VF01', tb: ['VBRK', 'VBRP', 'ACDOCA', 'BSET'], say: 'The invoice posts revenue and output VAT and opens a receivable.', p: [['D', 'Customer', A + V, 0], ['ERL', 'Revenue', 0, A], ['MWS', 'Output VAT', 0, V]] },
        { t: 'Incoming payment', who: 'Treasury', tc: 'F-28', tb: ['ACDOCA', 'BSAD'], say: 'Cash arrives and clears the customer item.', p: [['—', 'Bank', A + V, 0], ['D', 'Customer', 0, A + V]] }
      ];
    } },
    wht: { label: 'Thai WHT at payment', note: 'Thai company providing a service · VAT 7% · WHT 3% on the base excluding VAT · PND53', steps: function (A) {
      var V = rnd(A * 0.07), W = rnd(A * 0.03);
      return [
        { t: 'Vendor invoice', who: 'Accounts payable', tc: 'FB60', tb: ['ACDOCA', 'BSET'], say: 'Expense and input VAT are booked; the vendor is owed the gross amount.', p: [['—', 'Service expense', A, 0], ['VST', 'Input VAT', V, 0], ['K', 'Vendor', 0, A + V]] },
        { t: 'Payment with WHT', who: 'Treasury', tc: 'F110 · extended WHT', tb: ['ACDOCA', 'WITH_ITEM'], say: 'At payment SAP withholds 3% of the base (VAT excluded): the vendor item clears, the bank pays the net and WHT payable is created.', p: [['K', 'Vendor', A + V, 0], ['—', 'Bank', 0, A + V - W], ['WIT', 'WHT payable', 0, W]] },
        { t: '50 Tawi certificate', who: 'Tax', tc: 'Certificate print', tb: ['WITH_ITEM'], say: 'The certificate goes to the vendor. Its base and tax must equal the PND53 attachment line.', p: [] },
        { t: 'File PND53 & remit', who: 'Tax', tc: 'Remittance', tb: ['ACDOCA'], say: 'File and pay by the 7th of the next month (e-filing: the 15th). WHT payable clears.', p: [['WIT', 'WHT payable', W, 0], ['—', 'Bank', 0, W]] }
      ];
    } },
    fsv: { label: 'Foreign service · PND54 + VAT36', note: 'Overseas company · WHT 15% (a tax treaty may reduce it) · VAT self-assessed 7% on PP36', steps: function (A) {
      var W = rnd(A * 0.15), V = rnd(A * 0.07);
      return [
        { t: 'Foreign invoice', who: 'Accounts payable', tc: 'FB60', tb: ['ACDOCA'], say: 'An overseas vendor charges no Thai VAT — the invoice carries the expense and the payable only.', p: [['—', 'Service expense', A, 0], ['K', 'Vendor', 0, A]] },
        { t: 'Payment with WHT', who: 'Treasury', tc: 'F110 · extended WHT', tb: ['ACDOCA', 'WITH_ITEM'], say: '15% income tax is withheld for PND54; the vendor receives the net.', p: [['K', 'Vendor', A, 0], ['—', 'Bank', 0, A - W], ['WIT', 'WHT payable', 0, W]] },
        { t: 'Self-assess VAT (PP36)', who: 'Tax', tc: 'Reverse charge', tb: ['ACDOCA', 'BSET'], say: 'The payer self-assesses 7% VAT on the service and records the same amount as input VAT to claim later.', p: [['VST', 'Input VAT (PP36)', V, 0], ['—', 'VAT payable (PP36)', 0, V]] },
        { t: 'File PND54 + PP36', who: 'Tax', tc: 'Remittance', tb: ['ACDOCA'], say: 'Both returns are filed and paid by the 7th of the next month (e-filing: the 15th). The PP36 VAT then becomes input VAT in a later PP30 return.', p: [['WIT', 'WHT payable', W, 0], ['—', 'VAT payable (PP36)', V, 0], ['—', 'Bank', 0, W + V]] }
      ];
    } }
  };

  function flowApp(el) {
    var S = { f: 'p2p', A: 100000, i: 0, sp: '1', playing: false, t: 0 };
    el.innerHTML =
      '<div class="pg-row">' +
        '<div class="pg-f"><span class="pg-l">Process</span>' + seg('f', Object.keys(FLOWS).map(function (k) { return [k, FLOWS[k].label]; }), S.f) + '</div>' +
        '<div class="pg-f"><label class="pg-l" for="pgfA">Amount · THB before VAT</label><input id="pgfA" type="number" min="1000" step="1000" value="' + S.A + '"></div>' +
      '</div>' +
      '<div class="pg-note pg-fnote" style="margin:-.4rem 0 .2rem"></div>' +
      '<div class="pg-scroll"><div class="pg-track"><span class="pg-fill"></span><span class="pg-token" aria-hidden="true"></span></div></div>' +
      '<div class="pg-2col">' +
        '<div class="pg-box pg-step" aria-live="polite"></div>' +
        '<div class="pg-box"><h4>T-account ledger · cumulative</h4><div class="pg-scroll"><table class="pg-tbl pg-led"></table></div><div class="pg-note pg-ledn"></div></div>' +
      '</div>' +
      '<div class="pg-ctrl">' +
        '<button type="button" class="pg-btn ghost" data-a="first" aria-label="First step">⏮</button>' +
        '<button type="button" class="pg-btn ghost" data-a="prev" aria-label="Previous step">◀</button>' +
        '<button type="button" class="pg-btn" data-a="play">▶ Play</button>' +
        '<button type="button" class="pg-btn ghost" data-a="next" aria-label="Next step">▶</button>' +
        '<span class="sp pg-l">Speed</span>' + seg('sp', [['0.5', '0.5×'], ['1', '1×'], ['2', '2×']], S.sp) +
      '</div>';
    var track = el.querySelector('.pg-track'), fill = el.querySelector('.pg-fill'), token = el.querySelector('.pg-token');
    var box = el.querySelector('.pg-step'), led = el.querySelector('.pg-led'), ledn = el.querySelector('.pg-ledn'), note = el.querySelector('.pg-fnote');
    var playBtn = el.querySelector('[data-a="play"]');
    var steps = [];

    function build() {
      steps = FLOWS[S.f].steps(S.A);
      Array.prototype.forEach.call(track.querySelectorAll('.pg-node'), function (n) { n.remove(); });
      steps.forEach(function (s, k) {
        var b = d.createElement('button');
        b.type = 'button'; b.className = 'pg-node'; b.setAttribute('data-k', k);
        b.setAttribute('aria-label', 'Step ' + (k + 1) + ': ' + s.t);
        b.innerHTML = '<span class="dot">' + (k + 1) + '</span><span>' + esc(s.t) + '</span>';
        track.appendChild(b);
      });
      note.textContent = FLOWS[S.f].note;
      if (S.i > steps.length - 1) S.i = steps.length - 1;
      render(true);
    }
    function place() {
      var nodes = track.querySelectorAll('.pg-node');
      if (!nodes.length || !track.offsetWidth) return;
      var tr = track.getBoundingClientRect();
      var dot = function (k) { var r = nodes[k].querySelector('.dot').getBoundingClientRect(); return r.left + r.width / 2 - tr.left; };
      var x0 = dot(0), x = dot(S.i), xN = dot(nodes.length - 1);
      token.style.transform = 'translateX(' + x + 'px)';
      fill.style.left = x0 + 'px'; fill.style.width = Math.max(0, x - x0) + 'px';
      track.style.setProperty('--x0', x0 + 'px'); track.style.setProperty('--xn', xN + 'px');
    }
    function render(quiet) {
      var nodes = track.querySelectorAll('.pg-node');
      Array.prototype.forEach.call(nodes, function (n, k) {
        n.classList.toggle('done', k < S.i); n.classList.toggle('cur', k === S.i);
        if (k === S.i) n.setAttribute('aria-current', 'step'); else n.removeAttribute('aria-current');
      });
      place();
      var s = steps[S.i];
      box.innerHTML = '<div class="who">Step ' + (S.i + 1) + ' of ' + steps.length + ' · ' + esc(s.who) + '</div><h3>' + esc(s.t) + '</h3>' +
        '<div><span class="pg-chip amb">' + esc(s.tc) + '</span>' + s.tb.map(function (t) { return '<span class="pg-chip">' + t + '</span>'; }).join('') + '</div>' +
        '<p>' + esc(s.say) + '</p>' + (s.p.length ? postTable(s.p) : '<div class="pg-note">No FI posting at this step.</div>');
      /* cumulative T-accounts */
      var acc = [], byName = {};
      steps.forEach(function (st, k) {
        st.p.forEach(function (l) {
          if (!byName[l[1]]) { byName[l[1]] = { key: l[0], name: l[1], dr: 0, cr: 0, seen: false, now: false }; acc.push(byName[l[1]]); }
          if (k <= S.i) { var a = byName[l[1]]; a.dr += l[2]; a.cr += l[3]; a.seen = true; if (k === S.i) a.now = true; }
        });
      });
      var tdr = 0, tcr = 0, cleared = [];
      var rows = acc.map(function (a) {
        tdr += a.dr; tcr += a.cr;
        var bal = rnd(a.dr - a.cr), st;
        if (!a.seen) st = '<span class="pg-mut">—</span>';
        else if (Math.abs(bal) < 0.005) { st = '<span class="pg-ok">cleared ✓</span>'; cleared.push(a.name); }
        else st = bal > 0 ? '<span class="pg-dr">' + fmt(bal) + ' Dr</span>' : '<span class="pg-cr">' + fmt(-bal) + ' Cr</span>';
        return '<tr' + (a.now && !quiet ? ' class="flash"' : '') + '><td>' + esc(a.key) + '</td><td>' + esc(a.name) + '</td><td class="n">' + st + '</td></tr>';
      }).join('');
      led.innerHTML = '<thead><tr><th>Key</th><th>Account</th><th class="n">Balance</th></tr></thead><tbody>' + (rows || '<tr><td colspan="3" class="pg-mut">No postings yet</td></tr>') +
        '<tr class="tot"><td colspan="2">Σ debit = Σ credit</td><td class="n">' + (Math.abs(rnd(tdr) - rnd(tcr)) < 0.005 ? '<span class="pg-ok">' + fmt(tdr) + ' ✓</span>' : '<span class="pg-bad">✗</span>') + '</td></tr></tbody>';
      ledn.textContent = cleared.length ? cleared.join(' · ') + ' back to zero — the documents matched.' : (S.i === 0 ? 'Press play — balances appear as documents post.' : '');
      el.querySelector('[data-a="prev"]').disabled = S.i === 0;
      el.querySelector('[data-a="first"]').disabled = S.i === 0;
      el.querySelector('[data-a="next"]').disabled = S.i === steps.length - 1;
    }
    function go(i) { S.i = Math.max(0, Math.min(steps.length - 1, i)); render(false); }
    function stop() { S.playing = false; clearInterval(S.t); playBtn.textContent = '▶ Play'; }
    function play() {
      if (S.i === steps.length - 1) go(0);
      S.playing = true; playBtn.textContent = '⏸ Pause';
      clearInterval(S.t);
      S.t = setInterval(function () {
        if (el.closest('.pg-panel').hidden) { stop(); return; }
        if (S.i >= steps.length - 1) { stop(); return; }
        go(S.i + 1);
      }, 2300 / num(S.sp));
    }
    el.addEventListener('click', function (e) {
      var n = e.target.closest('.pg-node'); if (n) { stop(); go(+n.getAttribute('data-k')); return; }
      var b = e.target.closest('[data-a]'); if (!b) return;
      var a = b.getAttribute('data-a');
      if (a === 'play') { S.playing ? stop() : play(); }
      else { stop(); go(a === 'first' ? 0 : a === 'prev' ? S.i - 1 : S.i + 1); }
    });
    wireSeg(el, S, function (g) { if (g === 'f') { stop(); S.i = 0; build(); } else if (S.playing) play(); });
    el.querySelector('#pgfA').addEventListener('input', function () { var v = num(this.value); if (v > 0) { S.A = v; steps = FLOWS[S.f].steps(S.A); render(true); } });
    window.addEventListener('resize', place, { passive: true });
    el.closest('.pg-panel').addEventListener('pg:show', function () { requestAnimationFrame(place); });
    build();
  }

  /* =========================================================
     02 · THAI WHT & VAT
     ========================================================= */
  var PAYEE = {
    co: { label: 'Thai company', form: 'PND53', types: [['svc', 'Service fee', 3], ['prof', 'Professional fee', 3], ['rent', 'Rent', 5], ['adv', 'Advertising', 2], ['trn', 'Transport', 1]] },
    ind: { label: 'Thai individual', form: 'PND3', types: [['svc', 'Service fee', 3], ['prof', 'Professional fee', 3], ['rent', 'Rent', 5]] },
    frn: { label: 'Foreign company', form: 'PND54', types: [['svc', 'Service fee', 15], ['roy', 'Royalty', 15]] }
  };
  function taxApp(el) {
    var S = { pay: 'co', ty: 'svc', A: 100000, vat: 'y', bear: 'payee' };
    function typeSeg() { return seg('ty', PAYEE[S.pay].types.map(function (t) { return [t[0], t[1] + ' · ' + t[2] + '%']; }), S.ty); }
    el.innerHTML =
      '<div class="pg-row">' +
        '<div class="pg-f"><span class="pg-l">Who you pay</span>' + seg('pay', Object.keys(PAYEE).map(function (k) { return [k, PAYEE[k].label]; }), S.pay) + '</div>' +
        '<div class="pg-f"><span class="pg-l">For what</span><div class="pg-ty">' + typeSeg() + '</div></div>' +
      '</div><div class="pg-row">' +
        '<div class="pg-f"><label class="pg-l" for="pgtA">Amount · THB before VAT</label><input id="pgtA" type="number" min="100" step="100" value="' + S.A + '"></div>' +
        '<div class="pg-f"><span class="pg-l">VAT on the invoice</span><div class="pg-vat"></div></div>' +
        '<div class="pg-f"><span class="pg-l">Who bears the WHT</span>' + seg('bear', [['payee', 'Payee (deducted)'], ['payer', 'We do (gross-up)']], S.bear) + '</div>' +
      '</div>' +
      '<div class="pg-kpis" aria-live="polite"></div>' +
      '<div class="pg-2col"><div class="pg-box"><h4>Cash and tax · waterfall</h4><div class="pg-wf"></div><div class="pg-note pg-wfn"></div></div>' +
      '<div class="pg-box pg-form"></div></div>' +
      '<div class="pg-2col" style="margin-top:1rem"><div class="pg-box pg-inv"></div><div class="pg-box pg-paym"></div></div>' +
      '<div class="pg-note">Common statutory rates; a tax treaty can lower PND54. VAT is computed on the contract price. When the payer bears the tax, the base is grossed up to A ÷ (1 − rate). For VAT36 the model uses the amount paid including withheld tax as the base.</div>';
    var kpis = el.querySelector('.pg-kpis'), wf = el.querySelector('.pg-wf'), wfn = el.querySelector('.pg-wfn');
    function vatSeg() {
      el.querySelector('.pg-vat').innerHTML = S.pay === 'frn'
        ? seg('vat', [['y', 'No Thai VAT · self-assess PP36']], 'y')
        : seg('vat', [['y', 'VAT 7%'], ['n', 'No VAT']], S.vat);
    }
    function render() {
      var P = PAYEE[S.pay], t = P.types.filter(function (x) { return x[0] === S.ty; })[0] || P.types[0];
      S.ty = t[0];
      var r = t[2] / 100, A = S.A;
      var base = S.bear === 'payer' ? A / (1 - r) : A;
      var W = rnd(base * r);
      var V = (S.pay !== 'frn' && S.vat === 'y') ? rnd(A * 0.07) : 0;
      var inv = rnd(A + V);
      var toVendor = S.bear === 'payer' ? inv : rnd(inv - W);
      var borne = S.bear === 'payer' ? W : 0;
      var V36 = S.pay === 'frn' ? rnd((A + borne) * 0.07) : 0;
      var remit = rnd(W + V36);
      kpis.innerHTML =
        '<div class="pg-kpi"><div class="k">Invoice total</div><div class="v">' + fmt(inv) + '</div><div class="s">' + (V ? 'incl. VAT ' + fmt(V) : 'no VAT on invoice') + '</div></div>' +
        '<div class="pg-kpi"><div class="k">WHT · ' + P.form + '</div><div class="v pg-cr">' + fmt(W) + '</div><div class="s">' + t[2] + '% of ' + fmt(base) + (S.bear === 'payer' ? ' (grossed up)' : '') + '</div></div>' +
        '<div class="pg-kpi"><div class="k">Paid to the vendor</div><div class="v pg-ok">' + fmt(toVendor) + '</div><div class="s">' + (S.bear === 'payer' ? 'full invoice — we bear the tax' : 'invoice − WHT') + '</div></div>' +
        '<div class="pg-kpi"><div class="k">Remit to Revenue Dept</div><div class="v">' + fmt(remit) + '</div><div class="s">' + (V36 ? 'WHT + PP36 VAT ' + fmt(V36) : 'WHT') + '</div></div>';
      /* waterfall */
      var bars = [['Base', A, ''], ['+ VAT', V, 'vat'], [S.bear === 'payer' ? '+ WHT borne' : '− WHT', W, S.bear === 'payer' ? 'gu' : 'wht'], ['Paid to vendor', toVendor, 'net']];
      if (V36) bars.splice(3, 0, ['PP36 VAT', V36, 'vat']);
      var mx = Math.max.apply(null, bars.map(function (b) { return b[1]; })) || 1;
      wf.innerHTML = bars.map(function (b) {
        return '<div class="b"><span class="val">' + fmt(b[1]) + '</span><span class="bar ' + b[2] + '" style="height:' + Math.max(2, b[1] / mx * 100) + '%"></span><span class="lab">' + b[0] + '</span></div>';
      }).join('');
      wfn.textContent = S.bear === 'payer'
        ? 'Gross-up: the vendor gets the full invoice, and the tax we pay on its behalf (' + fmt(W) + ') is our own expense.'
        : 'The vendor receives the invoice less ' + fmt(W) + ', which we hold and remit to the Revenue Department.';
      el.querySelector('.pg-form').innerHTML = '<h4>Forms &amp; deadlines</h4>' +
        '<div><span class="pg-chip amb">' + P.form + '</span><span class="pg-chip">50 Tawi certificate</span>' + (V36 ? '<span class="pg-chip amb">PP36</span>' : '') + '</div>' +
        '<p class="pg-note" style="font-size:.86rem">' + (P.form === 'PND54' ? 'Withholding on payments abroad goes on PND54.' : P.form === 'PND53' ? 'Payments to Thai juristic persons go on PND53 with an attachment line per payee.' : 'Payments to individuals go on PND3 with an attachment line per payee.') +
        ' The payee gets a 50 Tawi certificate whose base and tax must equal the attachment.' + (V36 ? ' The service VAT is self-assessed on PP36.' : '') +
        '<br><b style="color:#e2e8f0">File and pay by the 7th of the next month</b> (e-filing: the 15th).</p>';
      var invLines = [['—', t[1] + ' expense', A, 0]];
      if (V) invLines.push(['VST', 'Input VAT', V, 0]);
      invLines.push(['K', 'Vendor', 0, inv]);
      el.querySelector('.pg-inv').innerHTML = postTable(invLines, 'Invoice posting');
      var pay = [['K', 'Vendor', inv, 0]];
      if (borne) pay.push(['—', 'WHT borne (expense)', borne, 0]);
      pay.push(['—', 'Bank', 0, toVendor], ['WIT', 'WHT payable', 0, W]);
      if (V36) pay.push(['VST', 'Input VAT (PP36)', V36, 0], ['—', 'VAT payable (PP36)', 0, V36]);
      el.querySelector('.pg-paym').innerHTML = postTable(pay, 'Payment posting');
    }
    wireSeg(el, S, function (g) {
      if (g === 'pay') { S.ty = PAYEE[S.pay].types[0][0]; el.querySelector('.pg-ty').innerHTML = typeSeg(); vatSeg(); }
      render();
    });
    el.querySelector('#pgtA').addEventListener('input', function () { var v = num(this.value); if (v > 0) { S.A = v; render(); } });
    vatSeg(); render();
  }

  /* =========================================================
     03 · REALIZED FX
     ========================================================= */
  function fxApp(el) {
    var S = { side: 'ap', usd: 10000, r0: 33.6, r1: 33.9, path: null, anim: 0 };
    el.innerHTML =
      '<div class="pg-row">' +
        '<div class="pg-f"><span class="pg-l">Open item</span>' + seg('side', [['ap', 'We owe (AP)'], ['ar', 'We are owed (AR)']], S.side) + '</div>' +
        '<div class="pg-f"><label class="pg-l" for="pgxU">Amount · USD</label><input id="pgxU" type="number" min="1" step="100" value="' + S.usd + '"></div>' +
      '</div>' +
      '<div class="pg-2col"><div class="pg-box">' +
        '<div class="pg-f"><label class="pg-l" for="pgx0">Rate when booked · THB per USD <b class="pg-mono pg-r0" style="color:#e2e8f0"></b></label><input id="pgx0" type="range" min="30" max="40" step="0.01" value="' + S.r0 + '"></div>' +
        '<div class="pg-f" style="margin-top:.6rem"><label class="pg-l" for="pgx1">Rate when settled · THB per USD <b class="pg-mono pg-r1" style="color:#e2e8f0"></b></label><input id="pgx1" type="range" min="30" max="40" step="0.01" value="' + S.r1 + '"></div>' +
        '<div class="pg-ctrl"><button type="button" class="pg-btn" data-a="walk">↯ Let the market move 30 days</button><button type="button" class="pg-btn ghost" data-a="reset">Reset</button></div>' +
        '<svg class="pg-spark" viewBox="0 0 300 70" preserveAspectRatio="none" aria-hidden="true"></svg>' +
      '</div><div class="pg-box" aria-live="polite">' +
        '<h4>Realized exchange difference</h4><div class="pg-big pg-res"></div><div class="pg-note pg-why" style="margin-top:.2rem"></div>' +
        '<div class="pg-hbar"><span class="pg-hb0"></span><i class="pg-hl0"></i></div><div class="pg-hbar"><span class="pg-hb1" style="background:#fbbf24"></span><i class="pg-hl1"></i></div>' +
      '</div></div>' +
      '<div class="pg-box pg-je" style="margin-top:1rem"></div>' +
      '<div class="pg-note">Single local currency for clarity. SAP posts this difference automatically when the payment clears the item (account determination for exchange differences); the SAP Model Lab extends it to three local currencies.</div>';
    var spark = el.querySelector('.pg-spark');
    function render() {
      var booked = rnd(S.usd * S.r0), settled = rnd(S.usd * S.r1), diff = rnd(settled - booked);
      var gain = S.side === 'ap' ? diff < 0 : diff > 0;
      el.querySelector('.pg-r0').textContent = S.r0.toFixed(2);
      el.querySelector('.pg-r1').textContent = S.r1.toFixed(2);
      var res = el.querySelector('.pg-res');
      res.textContent = diff === 0 ? '0.00 THB' : fmt(Math.abs(diff)) + ' THB ' + (gain ? 'gain' : 'loss');
      res.style.color = diff === 0 ? '#e2e8f0' : gain ? '#34d399' : '#f87171';
      el.querySelector('.pg-why').textContent = S.side === 'ap'
        ? 'Booked at ' + fmt(booked) + ', paid ' + fmt(settled) + ' — ' + (diff > 0 ? 'the baht weakened, so settling costs more.' : diff < 0 ? 'the baht strengthened, so settling costs less.' : 'no rate change.')
        : 'Booked at ' + fmt(booked) + ', received ' + fmt(settled) + ' — ' + (diff > 0 ? 'the baht weakened, so the dollars are worth more.' : diff < 0 ? 'the baht strengthened, so the dollars are worth less.' : 'no rate change.');
      var mx = Math.max(booked, settled) || 1;
      el.querySelector('.pg-hb0').style.width = (booked / mx * 100) + '%'; el.querySelector('.pg-hl0').textContent = 'Booked  ' + fmt(booked);
      el.querySelector('.pg-hb1').style.width = (settled / mx * 100) + '%'; el.querySelector('.pg-hl1').textContent = (S.side === 'ap' ? 'Paid  ' : 'Received  ') + fmt(settled);
      var L = S.side === 'ap'
        ? [['K', 'Vendor (cleared at booked value)', booked, 0], ['—', 'Bank', 0, settled]]
        : [['—', 'Bank', settled, 0], ['D', 'Customer (cleared at booked value)', 0, booked]];
      if (diff !== 0) {
        var loss = !gain, amt = Math.abs(diff);
        L.push(['KDF', loss ? 'Realized FX loss' : 'Realized FX gain', loss ? amt : 0, loss ? 0 : amt]);
      }
      el.querySelector('.pg-je').innerHTML = postTable(L, (S.side === 'ap' ? 'Payment' : 'Incoming payment') + ' posting · local currency THB');
      drawSpark();
    }
    function drawSpark() {
      var p = S.path && S.path.length > 1 ? S.path : [S.r0, S.path ? S.path[0] : S.r1];
      var lo = Math.min.apply(null, p) - 0.05, hi = Math.max.apply(null, p) + 0.05;
      var pts = p.map(function (v, k) { return (k / (p.length - 1) * 300).toFixed(1) + ',' + (66 - (v - lo) / (hi - lo) * 62).toFixed(1); }).join(' ');
      var y0 = (66 - (S.r0 - lo) / (hi - lo) * 62).toFixed(1);
      spark.innerHTML = '<line x1="0" x2="300" y1="' + y0 + '" y2="' + y0 + '" stroke="#26344f" stroke-dasharray="4 4"/><polyline points="' + pts + '" fill="none" stroke="#60a5fa" stroke-width="2" vector-effect="non-scaling-stroke"/>';
    }
    function walk() {
      cancelAnimationFrame(S.anim);
      var path = [S.r0], v = S.r0;
      for (var k = 0; k < 30; k++) { v = Math.min(40, Math.max(30, v + (Math.random() - 0.5) * 0.36)); path.push(rnd(v, 2)); }
      S.path = path;
      var r1 = el.querySelector('#pgx1');
      if (reduce()) { S.r1 = path[30]; r1.value = S.r1; render(); return; }
      var t0 = null;
      (function frame(t) {
        if (t0 === null) t0 = t;
        var k = Math.min(30, Math.floor((t - t0) / 80));
        S.path = path.slice(0, k + 1); S.r1 = path[k]; r1.value = S.r1; render();
        if (k < 30) S.anim = requestAnimationFrame(frame); else S.path = path;
      })(performance.now());
    }
    wireSeg(el, S, render);
    el.querySelector('#pgxU').addEventListener('input', function () { var v = num(this.value); if (v > 0) { S.usd = v; render(); } });
    el.querySelector('#pgx0').addEventListener('input', function () { S.r0 = num(this.value); S.path = null; render(); });
    el.querySelector('#pgx1').addEventListener('input', function () { S.r1 = num(this.value); S.path = null; render(); });
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-a]'); if (!b) return;
      if (b.getAttribute('data-a') === 'walk') walk();
      else { cancelAnimationFrame(S.anim); S.r0 = 33.6; S.r1 = 33.9; S.path = null; el.querySelector('#pgx0').value = S.r0; el.querySelector('#pgx1').value = S.r1; render(); }
    });
    render();
  }

  /* =========================================================
     04 · SPLIT LINES (multi profit center)
     ========================================================= */
  function splitApp(el) {
    var S = { base: 100000, rate: '3', view: 'after', pcs: [['PC-North', 50], ['PC-South', 30], ['PC-Corporate', 20]] };
    el.innerHTML =
      '<div class="pg-row">' +
        '<div class="pg-f"><label class="pg-l" for="pgsB">WHT base · THB</label><input id="pgsB" type="number" min="1" step="0.01" value="' + S.base + '"></div>' +
        '<div class="pg-f"><span class="pg-l">WHT rate</span>' + seg('rate', [['1', '1%'], ['3', '3%'], ['5', '5%'], ['15', '15%']], S.rate) + '</div>' +
        '<div class="pg-f"><span class="pg-l">Report logic</span>' + seg('view', [['after', 'One row per WHT line'], ['before', 'One row · first line wins']], S.view) + '</div>' +
      '</div>' +
      '<div class="pg-2col"><div class="pg-box"><h4>Expense split by profit center (document splitting)</h4><div class="pg-pcs"></div>' +
        '<button type="button" class="pg-btn ghost" data-a="add" style="margin-top:.5rem">+ Profit center</button><div class="pg-stack"></div></div>' +
      '<div class="pg-box" aria-live="polite"><h4>Tax report rows</h4><div class="pg-scroll"><table class="pg-tbl pg-rep"></table></div><div class="pg-chk pg-note" style="font-size:.84rem"></div></div></div>' +
      '<div class="pg-note">Document splitting gives each profit center its own WHT line. A row per line keeps the tax report, the PND attachment and the text file in agreement per profit center; the base is prorated by each line’s share of the tax and the last row takes the rounding remainder so totals tie to what was filed. Lines with zero tax are skipped.</div>';
    var pcsBox = el.querySelector('.pg-pcs');
    function drawPcs() {
      pcsBox.innerHTML = S.pcs.map(function (p, k) {
        return '<div class="pg-row" style="margin-bottom:.4rem;align-items:center;flex-wrap:nowrap">' +
          '<input type="text" value="' + esc(p[0]) + '" data-k="' + k + '" data-f="n" aria-label="Profit center ' + (k + 1) + ' name" style="width:130px">' +
          '<input type="range" min="0" max="100" step="1" value="' + p[1] + '" data-k="' + k + '" data-f="s" aria-label="Share of profit center ' + (k + 1) + '">' +
          '<span class="pg-mono pg-sh" data-k="' + k + '" style="min-width:3.2em;text-align:right">' + p[1] + '</span>' +
          '<button type="button" class="pg-btn ghost" data-del="' + k + '" aria-label="Remove profit center ' + (k + 1) + '"' + (S.pcs.length < 2 ? ' disabled' : '') + '>✕</button></div>';
      }).join('');
      el.querySelector('[data-a="add"]').disabled = S.pcs.length >= 5;
    }
    function render() {
      var T = rnd(S.base * num(S.rate) / 100), sum = 0;
      S.pcs.forEach(function (p) { sum += p[1]; });
      var lines = [], acc = 0, nz = S.pcs.map(function (p, k) { return k; }).filter(function (k) { return S.pcs[k][1] > 0; });
      S.pcs.forEach(function (p, k) {
        var w = 0;
        if (p[1] > 0 && sum > 0) { w = k === nz[nz.length - 1] ? rnd(T - acc) : rnd(T * p[1] / sum); acc = rnd(acc + w); }
        lines.push({ pc: p[0], w: w, k: k });
      });
      el.querySelector('.pg-stack').innerHTML = S.pcs.map(function (p, k) { return '<span class="pg-c' + k + '" style="flex-grow:' + (p[1] || 0.0001) + '">' + (sum && p[1] / sum > 0.12 ? esc(p[0]) : '') + '</span>'; }).join('');
      Array.prototype.forEach.call(el.querySelectorAll('.pg-sh'), function (s) { var p = S.pcs[+s.getAttribute('data-k')]; s.textContent = sum ? Math.round(p[1] / sum * 100) + '%' : '0%'; });
      var rows = [], chk = [];
      if (S.view === 'after') {
        var live = lines.filter(function (l) { return l.w !== 0; }), bacc = 0;
        live.forEach(function (l, i) { var b = i === live.length - 1 ? rnd(S.base - bacc) : rnd(S.base * l.w / T); bacc = rnd(bacc + b); rows.push({ pc: l.pc, b: b, w: l.w, last: i === live.length - 1 && live.length > 1, k: l.k }); });
        var skipped = lines.length - live.length;
        if (skipped) chk.push('<span class="pg-mut">' + skipped + ' zero-tax line(s) skipped</span>');
      } else {
        rows.push({ pc: lines[0].pc + ' (first line)', b: S.base, w: T, bad: true, k: 0 });
        chk.push('<span class="pg-bad">✗ only one of ' + lines.filter(function (l) { return l.w; }).length + ' profit centers is visible — per-PC totals in the attachment and the text file will not match</span>');
      }
      var tb = 0, tw = 0;
      el.querySelector('.pg-rep').innerHTML = '<thead><tr><th>Profit center</th><th class="n">WHT base</th><th class="n">WHT</th></tr></thead><tbody>' +
        rows.map(function (r) { tb += r.b; tw += r.w; return '<tr><td><span class="pg-chip" style="background:transparent;border-color:transparent;padding:0"><span class="pg-c' + r.k + '" style="display:inline-block;width:.6em;height:.6em;border-radius:2px;margin-right:.35em"></span></span>' + esc(r.pc) + '</td><td class="n">' + fmt(r.b) + (r.last ? ' <span class="pg-cr" title="takes the rounding remainder">◂</span>' : '') + '</td><td class="n">' + fmt(r.w) + '</td></tr>'; }).join('') +
        '<tr class="tot"><td>Σ</td><td class="n">' + fmt(tb) + '</td><td class="n">' + fmt(tw) + '</td></tr></tbody>';
      chk.unshift((Math.abs(rnd(tb) - rnd(S.base)) < 0.005 ? '<span class="pg-ok">✓ Σ base = ' + fmt(S.base) + '</span>' : '<span class="pg-bad">✗ Σ base ≠ ' + fmt(S.base) + '</span>') + ' · ' +
        (Math.abs(rnd(tw) - T) < 0.005 ? '<span class="pg-ok">✓ Σ WHT = ' + fmt(T) + ' filed</span>' : '<span class="pg-bad">✗ Σ WHT ≠ ' + fmt(T) + '</span>'));
      el.querySelector('.pg-chk').innerHTML = chk.join('<br>');
    }
    wireSeg(el, S, render);
    el.querySelector('#pgsB').addEventListener('input', function () { var v = num(this.value); if (v > 0) { S.base = v; render(); } });
    pcsBox.addEventListener('input', function (e) {
      var t = e.target, k = t.getAttribute('data-k'); if (k == null) return;
      if (t.getAttribute('data-f') === 's') S.pcs[k][1] = num(t.value); else S.pcs[k][0] = t.value || ('PC-' + (+k + 1));
      render();
    });
    el.addEventListener('click', function (e) {
      var del = e.target.closest('[data-del]');
      if (del && !del.disabled) { S.pcs.splice(+del.getAttribute('data-del'), 1); drawPcs(); render(); return; }
      var add = e.target.closest('[data-a="add"]');
      if (add && S.pcs.length < 5) {
        var names = ['PC-North', 'PC-South', 'PC-Corporate', 'PC-East', 'PC-West'], used = S.pcs.map(function (p) { return p[0]; });
        var nm = names.filter(function (n) { return used.indexOf(n) < 0; })[0] || ('PC-' + (S.pcs.length + 1));
        S.pcs.push([nm, 10]); drawPcs(); render();
      }
    });
    drawPcs(); render();
  }

  /* =========================================================
     TABS
     ========================================================= */
  function initPlayground() {
    var root = d.getElementById('playground'); if (!root) return;
    var apps = { flow: flowApp, tax: taxApp, fx: fxApp, split: splitApp };
    Array.prototype.forEach.call(root.querySelectorAll('.pg-app'), function (el) {
      try { apps[el.getAttribute('data-app')](el); } catch (e) { if (window.console) console.warn('[playground]', e); }
    });
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role=tab]'));
    function show(t, focus) {
      tabs.forEach(function (x) {
        var on = x === t;
        x.setAttribute('aria-selected', on ? 'true' : 'false'); x.tabIndex = on ? 0 : -1;
        d.getElementById(x.getAttribute('aria-controls')).hidden = !on;
      });
      if (focus) t.focus();
      var p = d.getElementById(t.getAttribute('aria-controls'));
      try { p.dispatchEvent(new CustomEvent('pg:show')); } catch (e) {}
    }
    tabs.forEach(function (t) { t.addEventListener('click', function () { show(t); }); });
    root.querySelector('[role=tablist]').addEventListener('keydown', function (e) {
      var i = tabs.indexOf(d.activeElement); if (i < 0) return;
      var j = e.key === 'ArrowRight' ? (i + 1) % tabs.length : e.key === 'ArrowLeft' ? (i - 1 + tabs.length) % tabs.length : e.key === 'Home' ? 0 : e.key === 'End' ? tabs.length - 1 : -1;
      if (j >= 0) { e.preventDefault(); show(tabs[j], true); }
    });
    show(tabs[0]);
  }

  /* =========================================================
     PLAYABLE DEFECT BOARD (How I work)
     ========================================================= */
  function initBoard() {
    var board = d.querySelector('#methodology .kanban-board'); if (!board) return;
    var cols = Array.prototype.slice.call(board.querySelectorAll('.kanban-col'));
    if (cols.length < 2) return;
    var avatar = cols.map(function (c) { var a = c.querySelector('.kanban-avatar'); return a ? a.textContent : ''; });
    var cards = Array.prototype.slice.call(board.querySelectorAll('.kanban-card'));
    var home = cards.map(function (c) { return c.parentNode; });
    var filter = 'all';
    var tools = d.createElement('div');
    tools.className = 'kb-tools';
    tools.innerHTML = '<span class="kb-gate" aria-live="polite"></span>' +
      '<span role="group" aria-label="Filter by priority">' + ['all', 'P1', 'P2', 'P3'].map(function (p) { return '<button type="button" data-p="' + p + '" aria-pressed="' + (p === 'all') + '">' + (p === 'all' ? 'All' : p) + '</button>'; }).join(' ') + '</span>' +
      '<button type="button" data-reset>Reset board</button>' +
      '<span style="font-size:.78rem;color:var(--text-muted)">Move cards with ◀ ▶ or drag them</span>';
    board.parentNode.insertBefore(tools, board);
    function colOf(card) { return cols.indexOf(card.parentNode); }
    function prio(card) { var p = card.querySelector('.priority'); return p ? p.textContent.trim() : ''; }
    function sync() {
      cols.forEach(function (c) { var n = c.querySelectorAll('.kanban-card').length, cnt = c.querySelector('.kanban-col-count'); if (cnt) cnt.textContent = n; });
      cards.forEach(function (c) {
        var i = colOf(c), mv = c.querySelectorAll('.kb-mv');
        mv[0].disabled = i <= 0; mv[1].disabled = i >= cols.length - 1;
        var av = c.querySelector('.kanban-avatar'); if (av && avatar[i]) av.textContent = avatar[i];
        c.classList.toggle('kb-dim', filter !== 'all' && prio(c) !== filter);
      });
      var openP1 = cards.filter(function (c) { return prio(c) === 'P1' && colOf(c) < cols.length - 1; }).length;
      var g = tools.querySelector('.kb-gate');
      g.className = 'kb-gate ' + (openP1 ? 'no' : 'ok');
      g.textContent = openP1 ? 'UAT exit gate · blocked — ' + openP1 + ' open P1' : 'UAT exit gate · passed — no open P1';
    }
    function move(card, dir) {
      var i = colOf(card) + dir; if (i < 0 || i >= cols.length) return;
      cols[i].appendChild(card); sync();
      var b = card.querySelector('.kb-mv[data-dir="' + dir + '"]'); if (b && !b.disabled) b.focus(); else card.querySelector('.kb-mv:not([disabled])') && card.querySelector('.kb-mv:not([disabled])').focus();
    }
    cards.forEach(function (c) {
      var meta = c.querySelector('.kanban-card-meta') || c;
      var wrap = d.createElement('span');
      var id = (c.querySelector('.kanban-card-id') || {}).textContent || 'card';
      wrap.innerHTML = '<button type="button" class="kb-mv" data-dir="-1" aria-label="Move ' + id + ' left">◀</button><button type="button" class="kb-mv" data-dir="1" aria-label="Move ' + id + ' right">▶</button>';
      meta.appendChild(wrap);
      c.setAttribute('draggable', 'true');
      c.addEventListener('dragstart', function (e) { e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', id); board._drag = c; });
    });
    board.addEventListener('click', function (e) {
      var b = e.target.closest('.kb-mv'); if (!b || b.disabled) return;
      move(b.closest('.kanban-card'), +b.getAttribute('data-dir'));
    });
    cols.forEach(function (col, i) {
      col.addEventListener('dragover', function (e) { if (board._drag) { e.preventDefault(); col.classList.add('kb-over'); } });
      col.addEventListener('dragleave', function () { col.classList.remove('kb-over'); });
      col.addEventListener('drop', function (e) { e.preventDefault(); col.classList.remove('kb-over'); if (board._drag) { col.appendChild(board._drag); board._drag = null; sync(); } });
    });
    tools.addEventListener('click', function (e) {
      var p = e.target.closest('[data-p]');
      if (p) { filter = p.getAttribute('data-p'); Array.prototype.forEach.call(tools.querySelectorAll('[data-p]'), function (x) { x.setAttribute('aria-pressed', x === p ? 'true' : 'false'); }); sync(); return; }
      if (e.target.closest('[data-reset]')) { cards.forEach(function (c, k) { home[k].appendChild(c); }); sync(); }
    });
    sync();
  }

  function boot() {
    try { initPlayground(); } catch (e) { if (window.console) console.warn('[playground]', e); }
    try { initBoard(); } catch (e) { if (window.console) console.warn('[board]', e); }
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', boot); else boot();
})();
