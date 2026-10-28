/* ============================================================
   taxflow.js · SAP FI Tax, upstream to downstream (index.html#sap-tax)
   An animated dependency map of the Thai / overseas tax chain:
   set-up → posting → adjustment programs → reporting engine →
   outputs → filing. Five threads can be played step by step;
   any box can be clicked to see what feeds it, what it feeds and
   what breaks if it fails.
   Object codes are the neutral codes of the FI-Tax Knowledge Lab
   (anonymized); SAP standard objects keep their real names.
   No data leaves the browser. Without JS a static outline shows.
   ============================================================ */
(function () {
  'use strict';
  var d = document;
  var root = d.getElementById('taxflow');
  if (!root) return;
  var reduce = function () { return !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches); };
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  var LAB = 'fi-tax-lab/';
  var LANES = [
    { n: '01', t: 'Set up', s: 'once, before go-live' },
    { n: '02', t: 'Post', s: 'every day' },
    { n: '03', t: 'Adjust', s: '10:00 batch · month-end' },
    { n: '04', t: 'Report', s: 'month-end' },
    { n: '05', t: 'Output', s: 'forms · files · controls' },
    { n: '06', t: 'File & hand over', s: 'by the 7th · 15th · 23rd' }
  ];
  /* kind: cfg = configuration / master data · std = standard SAP · wricef = custom object · tool = SAP tool · file = statutory deadline */
  var NODES = [
    /* 01 set up */
    { id: 'cfg-bp', lane: 0, kind: 'cfg', code: 'MASTER DATA', t: 'Business partner: WHT, tax ID, payee', when: 'Set up once',
      does: 'The vendor carries its WHT types and codes and its tax ID. When someone else is paid, the payee travels on the document itself.',
      rw: 'BP · LFBW · DFKKBPTAXNUM · BSEC', risk: 'No WHT code on the vendor → no WHT at payment. Payee read from the wrong place → the certificate and the filed return name different people.', href: LAB + 'frm1-wht-attachment.html' },
    { id: 'cfg-wht', lane: 0, kind: 'cfg', code: 'CONFIG', t: 'Extended WHT types & codes', when: 'Set up once',
      does: 'The WHT type decides when tax is taken (invoice or payment) and on what base; the WHT code carries the rate, the recipient type (PND3 / 53 / 54) and the income type.',
      rw: 'T059P (types) · T059Z (codes)', risk: 'A missing recipient type or a wrong rate flows into every WHT report, attachment, text file and certificate.', href: LAB + 'wht.html#codes' },
    { id: 'cfg-lc', lane: 0, kind: 'wricef', code: 'GL-ENH-1', t: 'Three local currencies LC1 · LC2 · LC3', when: 'Set up once · runs on every posting',
      does: 'Every Thai document is valued in THB, USD and a third currency whose rate depends on the segment. The line type decides the rate and the date (input VAT: rate B of the day before).',
      rw: 'ACDOCA · HSL / KSL / OSL', risk: 'Rate rule wrong → the three currencies do not balance and realized-FX lines appear where they should not.', href: LAB + 'doc-verification.html#lc' },
    { id: 'cfg-seg', lane: 0, kind: 'wricef', code: 'TAX-ENH-4', t: 'Segment derivation (= tax regime)', when: 'Set up once · runs on every posting',
      does: 'A substitution derives the segment on every line from G/L, cost center and profit center. The segment is the tax regime and decides the LC3 rate.',
      rw: 'Substitution rules → ACDOCA-SEGMENT', risk: 'Wrong segment → wrong LC3 amount, and the line lands in the wrong regime’s tax report.', href: LAB + 'doc-verification.html#segment' },
    { id: 'cfg-proc', lane: 0, kind: 'cfg', code: 'CONFIG', t: 'Tax procedure, tax codes & accounts', when: 'Set up once',
      does: 'The country tax procedure holds the tax codes; each code has a rate and an account key, and the key points at a G/L account. A Thai purchase code can park VAT in a deferred (not yet claimable) account.',
      rw: 'FTXP · OB40 · T007A', risk: 'Wrong rate or account → every invoice posts the wrong VAT and the VAT report inherits it.', href: LAB + 'indirect-tax.html#codes' },
    /* 02 post */
    { id: 'tx-pay', lane: 1, kind: 'std', code: 'F110 · F-53', t: 'Payment with WHT', when: 'Payment day',
      does: 'The payment clears the invoice and withholds tax: the bank pays the net, WHT payable is created and WITH_ITEM stores base, tax and recipient type.',
      rw: 'writes ACDOCA (WIT line) · WITH_ITEM · BSAK', risk: 'WITH_ITEM not updated with the G/L amount → every WHT output reads the wrong figure.', href: 'fi-document-simulator.html' },
    { id: 'tx-inv', lane: 1, kind: 'std', code: 'FB60 · MIRO', t: 'Vendor invoice', when: 'Invoice day',
      does: 'Expense, VAT and the vendor line post as one document; business place, tax code and segment sit on every line.',
      rw: 'writes BKPF · ACDOCA · BSET', risk: 'Missing business place or tax code → the line never reaches the VAT report or PP36.', href: 'fi-document-simulator.html' },
    { id: 'tx-ar', lane: 1, kind: 'std', code: 'VF01 · F-28', t: 'Customer billing & receipt', when: 'Billing / receipt day',
      does: 'Billing posts revenue and output VAT. For services VAT is due when the customer pays, so it waits in a deferred output-VAT account.',
      rw: 'writes ACDOCA · BSET', risk: 'Receipt split wrong → deferred VAT released in the wrong month.', href: 'fi-document-simulator.html' },
    { id: 'tx-jv', lane: 1, kind: 'wricef', code: 'JVA-ENH-1', t: 'Joint-venture cash call', when: 'Monthly',
      does: 'Partners are billed by an uploaded cash call. The document has partner lines but no tax line, so a substitution adds the tax code the Oman VAT report needs.',
      rw: 'writes BSEG · ACDOCA (no BSET)', risk: 'Tax code not substituted → the cash call is missing from the Oman return; the clearing document must NOT get it.', href: LAB + 'rpt2-oman-vat.html#jva' },
    /* 03 adjust */
    { id: 'en-whtfx', lane: 2, kind: 'wricef', code: 'TAX-ENH-2', t: 'WHT FX adjustment', when: 'Next day · 10:00 batch',
      does: 'G/L books WHT at the posting-date rate; the Revenue Department wants the Bank of Thailand rate of the previous business day (T-1 paper, T-2 e-WHT). The batch re-rates WHT on foreign-currency payments.',
      rw: 'reads WITH_ITEM · posts doc type SW', risk: 'Not run yet → the reconciliation’s FX-adjustment column is empty. Run order, not a bug.', href: LAB + 'wht.html#fx' },
    { id: 'en-defin', lane: 2, kind: 'wricef', code: 'TAX-ENH-8', t: 'Deferred input VAT → input VAT', when: 'Daily',
      does: 'Once the vendor is paid and the tax invoice is in, the deferred input VAT moves to claimable input VAT.',
      rw: 'posts doc type ST', risk: 'ST in the wrong period → input VAT claimed in the wrong PP30 month.', href: LAB + 'indirect-tax.html#deferred' },
    { id: 'en-v36', lane: 2, kind: 'wricef', code: 'TAX-ENH-3', t: 'VAT36 liability (self-assessment)', when: 'After month-end',
      does: 'Self-assesses 7% VAT on services bought from abroad for PP36, and records the same amount as input VAT to claim in a later PP30.',
      rw: 'reads paid foreign invoices · posts doc type SA', risk: 'Not run yet → the VAT36 document number in the reconciliation is empty and PP36 has nothing to file.', href: LAB + 'indirect-tax.html#vat36' },
    { id: 'en-defout', lane: 2, kind: 'wricef', code: 'AR-ENH-1', t: 'Deferred output VAT → output VAT', when: 'Batch, on receipt',
      does: 'When the customer pays, deferred output VAT becomes due.',
      rw: 'posts doc type D2', risk: 'Not run → output VAT is short in the month’s VAT report.', href: LAB + 'indirect-tax.html#deferred' },
    /* 04 report */
    { id: 'rp-wht', lane: 3, kind: 'wricef', code: 'WHT ENGINE', t: 'One WHT reporting engine', when: 'Month-end',
      does: 'An enhanced copy of the standard generic WHT report (RFIDYYWT). One selection screen serves every WHT output; the output group decides whether you get a certificate, an attachment, a text file or the reconciliation.',
      rw: 'reads WITH_ITEM · ACDOCA · BSAK · BKPF', risk: 'A selection or profit-center filter bug here shows up in every output to its right at once — test them together.', href: LAB + 'wht-engine-xray.html' },
    { id: 'rp-mm', lane: 3, kind: 'wricef', code: 'TAX-RPT-8', t: 'Myanmar WHT report', when: 'Monthly',
      does: 'The country WHT report the Myanmar certificate reads from (document, LC1 and LC2 amounts).',
      rw: 'reads WITH_ITEM', risk: 'A change here ripples straight into the certificate.', href: LAB + 'frm2-mm-wht-certificate.html' },
    { id: 'rp-vat', lane: 3, kind: 'wricef', code: 'TAX-RPT-6', t: 'VAT report + net VAT clearing', when: 'Month-end',
      does: 'Lists output and input VAT for PP30 (including the ST and D2 documents) and clears them against each other into net VAT payable.',
      rw: 'reads BSET · posts doc type SO', risk: 'Run before ST / D2 are complete → PP30 is short.', href: LAB + 'indirect-tax.html#objects' },
    { id: 'rp-oman', lane: 3, kind: 'wricef', own: 1, code: 'TAX-RPT-2', t: 'Oman VAT report incl. cash calls', when: 'Monthly',
      does: 'A custom copy of the standard VAT report (RFUMSV00) with two data paths: standard documents through BSET, JV cash calls through BSEG + ACDOCA. Profit-center and recovery-indicator filters on top.',
      rw: 'reads BKPF ⋈ BSET · BSEG ⋈ ACDOCA', risk: 'A fix on one data path misses the other; with a profit-center filter, the total must still equal the lines shown.', href: 'oman-vat-report-case-study.html' },
    /* 05 output */
    { id: 'out-50', lane: 4, kind: 'wricef', code: 'TAX-FRM-3', t: '50 Tawi certificate + PND54 form', when: 'With payment / month-end',
      does: 'Output group AP1 of the engine: the certificate the payee receives, and the PND54 form.',
      rw: 'reads WITH_ITEM', risk: 'Base or payee different from the attachment → the payee’s certificate does not match the filed return.', href: LAB + 'wht.html#outputs' },
    { id: 'out-att', lane: 4, kind: 'wricef', own: 1, code: 'TAX-FRM-1', t: 'PND3 / 53 / 54 attachment (PDF)', when: 'Month-end',
      does: 'Output group R03: one line per payee; one attachment per profit center when none is selected; payee tax ID from the business partner.',
      rw: 'reads ACDOCA (WIT) → WITH_ITEM', risk: 'Alternative payee printed from the BP instead of the document → name differs from the 50 Tawi.', href: LAB + 'frm1-wht-attachment.html' },
    { id: 'out-txt', lane: 4, kind: 'wricef', own: 1, code: 'TAX-ENH-1', t: 'RD e-filing text files', when: 'Month-end',
      does: 'Output groups E01–E04: DMEE format trees build the Revenue Department upload files for PND1 / 2 / 3 / 53, split by business place.',
      rw: 'reads WITH_ITEM · ADRC (address)', risk: 'Missing sub-district in the address → the RD rejects the file.', href: LAB + 'enh1-rd-text-files.html' },
    { id: 'out-recon', lane: 4, kind: 'wricef', own: 1, code: 'TAX-RPT-1', t: 'PND54 ↔ VAT36 reconciliation', when: 'Month-end',
      does: 'One row per WHT line: the PND54 side next to the matching VAT36 side in THB, with profit center and recovery indicator, so Tax can reconcile both returns before filing.',
      rw: 'reads WITH_ITEM · BSAK · BSET · ENH-2 + ENH-3 documents', risk: 'Empty FX or VAT36 columns until ENH-2 and ENH-3 have run; split lines and one-payment-many-invoices need one row per line.', href: LAB + 'rpt1-wht-vat-recon.html' },
    { id: 'out-pp36', lane: 4, kind: 'wricef', code: 'TAX-RPT-12', t: 'PP36 report', when: 'Month-end',
      does: 'Lists the month’s self-assessed VAT for the PP36 return.',
      rw: 'reads the ENH-3 documents', risk: 'Empty until ENH-3 has run.', href: LAB + 'indirect-tax.html#vat36' },
    { id: 'out-mm', lane: 4, kind: 'wricef', own: 2, code: 'TAX-FRM-2', t: 'Myanmar WHT certificate', when: 'Monthly',
      does: 'Certificate in MMK, USD or document currency, with a tax-treaty remark.',
      rw: 'reads the Myanmar WHT report', risk: 'Currency column taken from the wrong amount field → certificate total differs from the report.', href: LAB + 'frm2-mm-wht-certificate.html' },
    { id: 'out-drc', lane: 4, kind: 'tool', code: 'SAP DRC', t: 'PP30 e-filing text file', when: 'Month-end',
      does: 'Document & Reporting Compliance builds the PP30 upload file (used for this file only).',
      rw: 'reads the VAT return data', risk: 'VAT report not final → the file carries last week’s numbers.', href: LAB + 'statutory.html#drcmap' },
    /* 06 file */
    { id: 'fl-payee', lane: 5, kind: 'file', code: 'HAND OVER', t: 'Certificates to the payee', when: 'With payment · monthly',
      does: '50 Tawi (Thailand) and the Myanmar certificate go to the payee. Base and tax must equal the filed attachment.',
      rw: '—', risk: 'A mismatch is visible to the vendor and to the Revenue Department.', href: LAB + 'statutory.html' },
    { id: 'fl-pnd', lane: 5, kind: 'file', code: 'BY THE 7TH', t: 'PND3 · PND53 · PND54', when: 'By the 7th · e-filing 15th',
      does: 'Monthly WHT returns with the attachment. Control before filing: return total = G/L = Σ certificates.',
      rw: '—', risk: 'Late or wrong → surcharge and a re-filed return.', href: LAB + 'statutory.html' },
    { id: 'fl-pp36', lane: 5, kind: 'file', code: 'BY THE 7TH', t: 'PP36', when: 'By the 7th · e-filing 15th',
      does: 'Self-assessed VAT on foreign services; it becomes input VAT in a later PP30.',
      rw: '—', risk: 'Not filed → the input VAT cannot be claimed.', href: LAB + 'statutory.html' },
    { id: 'fl-pp30', lane: 5, kind: 'file', code: 'BY THE 15TH', t: 'PP30', when: 'By the 15th · e-filing 23rd',
      does: 'Monthly VAT return: output VAT minus input VAT.',
      rw: '—', risk: 'Short output or input VAT → additional tax or a lost claim.', href: LAB + 'statutory.html' },
    { id: 'fl-om', lane: 5, kind: 'file', code: 'OMAN', t: 'Oman VAT return', when: 'Oman tax calendar',
      does: 'Prepared from the Oman VAT report, including the JV cash calls.',
      rw: '—', risk: 'Cash calls missing → under-declared VAT.', href: 'oman-vat-report-case-study.html' }
  ];
  var EDGES = [
    ['cfg-bp', 'tx-inv'], ['cfg-bp', 'tx-pay'], ['cfg-wht', 'tx-pay'], ['cfg-lc', 'tx-inv'], ['cfg-lc', 'tx-pay'],
    ['cfg-seg', 'tx-inv'], ['cfg-seg', 'tx-pay'], ['cfg-seg', 'tx-ar'], ['cfg-proc', 'tx-inv'], ['cfg-proc', 'tx-ar'], ['cfg-proc', 'tx-jv'],
    ['tx-pay', 'en-whtfx'], ['tx-pay', 'en-defin'], ['tx-inv', 'en-defin'], ['tx-inv', 'en-v36'], ['tx-ar', 'en-defout'],
    ['tx-pay', 'rp-wht'], ['en-whtfx', 'rp-wht'], ['tx-pay', 'rp-mm'], ['en-defin', 'rp-vat'], ['en-defout', 'rp-vat'], ['tx-inv', 'rp-vat'],
    ['tx-inv', 'rp-oman'], ['tx-ar', 'rp-oman'], ['tx-jv', 'rp-oman'],
    ['rp-wht', 'out-50'], ['rp-wht', 'out-att'], ['rp-wht', 'out-txt'], ['rp-wht', 'out-recon'], ['en-v36', 'out-recon'], ['en-v36', 'out-pp36'],
    ['rp-mm', 'out-mm'], ['rp-vat', 'out-drc'],
    ['out-50', 'fl-payee'], ['out-mm', 'fl-payee'], ['out-att', 'fl-pnd'], ['out-txt', 'fl-pnd'], ['out-recon', 'fl-pnd'], ['out-recon', 'fl-pp36'],
    ['out-pp36', 'fl-pp36'], ['out-drc', 'fl-pp30'], ['rp-oman', 'fl-om']
  ];
  var THREADS = [
    { id: 'A', label: 'A · Thai vendor · WHT 3%', steps: [
      { when: 'Set up once', n: ['cfg-bp', 'cfg-wht', 'cfg-seg', 'cfg-proc'], say: 'Before the first invoice: the vendor’s business partner carries WHT type + code (PND53, 3%, deducted at payment) and its tax ID; the purchase tax code parks VAT in a deferred input-VAT account; the segment substitution is active.' },
      { when: 'Day 1 · invoice', n: ['tx-inv'], say: 'Invoice 100,000 + VAT 7,000 → Dr expense 100,000 · Dr deferred input VAT 7,000 / Cr vendor 107,000. Business place, tax code and segment land on every line.' },
      { when: 'Day 15 · payment run', n: ['tx-pay'], say: 'Dr vendor 107,000 / Cr bank 104,000 · Cr WHT payable 3,000. WITH_ITEM stores base 100,000, tax 3,000 and recipient type 53.' },
      { when: 'Day 15', n: ['en-defin'], say: 'Paid, tax invoice in hand → the VAT becomes claimable: Dr input VAT 7,000 / Cr deferred input VAT 7,000 (doc ST).' },
      { when: 'Month-end', n: ['rp-wht', 'out-att', 'out-txt', 'out-50'], say: 'One engine, three outputs from the same rows: the PND53 attachment, the RD text file and the 50 Tawi. They agree by construction — and a selection bug breaks all three together.' },
      { when: 'Month-end', n: ['rp-vat', 'out-drc'], say: 'The VAT report picks up the ST document as input VAT and clears output against input into net VAT payable (doc SO); DRC builds the PP30 file.' },
      { when: 'By the 7th · 15th', n: ['fl-payee', 'fl-pnd', 'fl-pp30'], say: 'PND53 by the 7th (e-filing 15th), PP30 by the 15th (e-filing 23rd), 50 Tawi to the vendor. Control: PND53 total = G/L = Σ 50 Tawi.' }
    ] },
    { id: 'B', label: 'B · Foreign service · PND54 + VAT36', steps: [
      { when: 'Set up once', n: ['cfg-bp', 'cfg-wht', 'cfg-lc'], say: 'Overseas vendor: WHT code for PND54 (15%; a tax treaty may lower it), paid in USD. Every line is valued in THB, USD and LC3.' },
      { when: 'Day 1 · invoice', n: ['tx-inv'], say: 'USD invoice with no Thai VAT on it: Dr service expense / Cr vendor, in three currencies.' },
      { when: 'Day 20 · payment', n: ['tx-pay'], say: 'WHT 15% withheld; G/L books it at the posting-date rate.' },
      { when: 'Day 21 · 10:00', n: ['en-whtfx'], say: 'The Revenue Department wants the Bank of Thailand rate of the previous business day (T-1; T-2 for e-WHT). The batch re-rates the WHT in THB and posts doc SW.' },
      { when: 'After month-end', n: ['en-v36'], say: 'Self-assess 7% VAT on the service for PP36 (doc SA) — the same amount becomes input VAT for a later PP30.' },
      { when: 'Month-end', n: ['rp-wht', 'out-50', 'out-recon', 'out-pp36'], say: 'Engine → PND54 form and 50 Tawi. The reconciliation puts PND54 and VAT36 side by side in THB; its FX and VAT36 columns are filled only because ENH-2 and ENH-3 ran first.' },
      { when: 'By the 7th · 15th', n: ['fl-payee', 'fl-pnd', 'fl-pp36'], say: 'PND54 and PP36 filed by the 7th (e-filing 15th); the certificate goes to the overseas vendor.' }
    ] },
    { id: 'C', label: 'C · Sales & purchases · PP30', steps: [
      { when: 'Set up once', n: ['cfg-seg', 'cfg-proc'], say: 'Output tax codes; service VAT is due on receipt, so billing posts it to deferred output VAT first.' },
      { when: 'Day 1 · billing', n: ['tx-ar'], say: 'Billing: Dr customer / Cr revenue · Cr deferred output VAT.' },
      { when: 'On receipt', n: ['en-defout'], say: 'The customer pays → deferred output VAT becomes due (doc D2).' },
      { when: 'During the month', n: ['tx-inv', 'en-defin'], say: 'Purchases: input VAT becomes claimable through ST once paid (thread A), or posts directly.' },
      { when: 'Month-end', n: ['rp-vat'], say: 'VAT report: output VAT (incl. D2) against input VAT (incl. ST), cleared into net VAT payable (doc SO). It must run after ST and D2 are complete.' },
      { when: 'Month-end', n: ['out-drc'], say: 'DRC builds the PP30 e-filing text file.' },
      { when: 'By the 15th · 23rd', n: ['fl-pp30'], say: 'PP30 filed and net VAT paid by the 15th (e-filing 23rd).' }
    ] },
    { id: 'D', label: 'D · Oman VAT · JV cash calls', steps: [
      { when: 'Set up once', n: ['cfg-proc'], say: 'Oman tax codes; JV cash calls get a tax code by substitution because they have no tax line of their own.' },
      { when: 'During the month', n: ['tx-inv', 'tx-ar'], say: 'Standard purchase and sales documents carry tax lines (BSET).' },
      { when: 'Monthly', n: ['tx-jv'], say: 'Cash calls are uploaded: partner lines only, no tax line — the substitution adds the tax code. The clearing document must not get it.' },
      { when: 'Month-end', n: ['rp-oman'], say: 'Two data paths: standard documents via BSET, cash calls via BSEG + ACDOCA. With a profit-center filter the total must equal the lines shown.' },
      { when: 'Filing', n: ['fl-om'], say: 'The Oman VAT return is prepared from the report.' }
    ] },
    { id: 'E', label: 'E · Myanmar WHT certificate', steps: [
      { when: 'Set up once', n: ['cfg-bp', 'cfg-wht'], say: 'Myanmar WHT codes on the vendor.' },
      { when: 'Payment day', n: ['tx-pay'], say: 'Payment with WHT; WITH_ITEM holds document, LC1 and LC2 amounts.' },
      { when: 'Monthly', n: ['rp-mm'], say: 'The country WHT report.' },
      { when: 'Monthly', n: ['out-mm'], say: 'Certificate in MMK, USD or document currency, with a tax-treaty remark.' },
      { when: 'Monthly', n: ['fl-payee'], say: 'Certificate handed to the payee.' }
    ] }
  ];

  var byId = {};
  NODES.forEach(function (n) { byId[n.id] = n; n.up = []; n.dn = []; });
  EDGES.forEach(function (e) { byId[e[0]].dn.push(e[1]); byId[e[1]].up.push(e[0]); });
  function closure(id, dir) { var seen = {}, st = [id]; while (st.length) { byId[st.pop()][dir].forEach(function (x) { if (!seen[x]) { seen[x] = 1; st.push(x); } }); } return seen; }
  var KIND = { cfg: 'Configuration · master data', std: 'Standard SAP posting', wricef: 'Custom object (WRICEF)', tool: 'SAP standard tool', file: 'Statutory deadline' };

  /* ---------- build (lazily — see the trigger at the end) ---------- */
  function init() {
  if (root.classList.contains('tf-on')) return;
  root.classList.add('tf-on');
  var S = { th: 'A', i: -1, playing: false, t: 0, sp: 1, sel: null, fail: false, seen: false };
  var app = d.createElement('div');
  app.className = 'tf-app';
  app.innerHTML =
    '<div class="tf-bar">' +
      '<div class="pg-seg tf-th" role="group" aria-label="Thread">' + THREADS.map(function (t) { return '<button type="button" data-th="' + t.id + '" aria-pressed="' + (t.id === S.th) + '">' + esc(t.label) + '</button>'; }).join('') + '</div>' +
    '</div>' +
    '<div class="tf-bar tf-bar2">' +
      '<div class="tf-ctrl"><button type="button" class="pg-btn" data-a="play">▶ Play</button><button type="button" class="pg-btn ghost" data-a="prev" aria-label="Previous step">◀</button><button type="button" class="pg-btn ghost" data-a="next" aria-label="Next step">▶</button><button type="button" class="pg-btn ghost" data-a="reset" aria-label="Back to the start">↺</button></div>' +
      '<div class="tf-dots" role="group" aria-label="Steps"></div>' +
      '<span class="tf-clock" aria-live="polite"></span>' +
      '<div class="pg-seg tf-sp" role="group" aria-label="Speed"><button type="button" data-sp="0.6" aria-pressed="false">0.5×</button><button type="button" data-sp="1" aria-pressed="true">1×</button><button type="button" data-sp="1.7" aria-pressed="false">2×</button></div>' +
    '</div>' +
    '<div class="tf-scroll"><div class="tf-map">' +
      '<svg class="tf-edges" aria-hidden="true"></svg>' +
      '<div class="tf-lanes">' + LANES.map(function (L, k) {
        return '<div class="tf-lane"><div class="tf-lh"><span class="tf-ln">' + L.n + '</span><b>' + L.t + '</b><span>' + L.s + '</span></div><div class="tf-nodes">' +
          NODES.filter(function (n) { return n.lane === k; }).map(function (n) {
            return '<button type="button" class="tf-node k-' + n.kind + '" data-id="' + n.id + '" aria-label="' + esc(n.code + ' — ' + n.t) + '">' +
              '<span class="tf-code">' + esc(n.code) + '</span><span class="tf-t">' + esc(n.t) + '</span>' + (n.own ? '<span class="tf-own" title="' + (n.own === 2 ? 'Object I own (scope to be confirmed)' : 'Object I own') + '">★</span>' : '') + '</button>';
          }).join('') + '</div></div>';
      }).join('') + '</div>' +
      '<svg class="tf-pulses" aria-hidden="true"></svg>' +
    '</div></div>' +
    '<div class="tf-panel" aria-live="polite"></div>' +
    '<div class="tf-legend"><span><i class="lg-cfg"></i>Set-up</span><span><i class="lg-std"></i>Standard SAP</span><span><i class="lg-wricef"></i>Custom WRICEF</span><span><i class="lg-file"></i>Deadline</span><span><b>★</b> objects I owned</span><span class="tf-legend-hint">Click any box · its inputs light amber, its consumers blue</span></div>';
  root.appendChild(app);
  var $ = function (s) { return app.querySelector(s); };
  var map = $('.tf-map'), svgE = $('.tf-edges'), svgP = $('.tf-pulses'), panel = $('.tf-panel'), clock = $('.tf-clock'), dots = $('.tf-dots'), playBtn = $('[data-a="play"]');
  var nodeEl = {};
  Array.prototype.forEach.call(app.querySelectorAll('.tf-node'), function (b) { nodeEl[b.getAttribute('data-id')] = b; });
  var NS = 'http://www.w3.org/2000/svg';
  var edgeEl = EDGES.map(function (e) {
    var p = d.createElementNS(NS, 'path'); p.setAttribute('class', 'tf-edge'); svgE.appendChild(p);
    return { f: e[0], t: e[1], el: p };
  });
  function edge(f, t) { for (var i = 0; i < edgeEl.length; i++) if (edgeEl[i].f === f && edgeEl[i].t === t) return edgeEl[i]; return null; }

  /* ---------- geometry ---------- */
  function layout() {
    /* read everything first … */
    var m = map.getBoundingClientRect(), w = map.offsetWidth, h = map.offsetHeight, R = {};
    NODES.forEach(function (n) { var r = nodeEl[n.id].getBoundingClientRect(), l = r.left - m.left, t = r.top - m.top; R[n.id] = { l: l, t: t, r: l + r.width, b: t + r.height, cx: l + r.width / 2, cy: t + r.height / 2 }; });
    var rect = function (id) { return R[id]; };
    /* … then write */
    [svgE, svgP].forEach(function (s) { s.setAttribute('width', w); s.setAttribute('height', h); s.setAttribute('viewBox', '0 0 ' + w + ' ' + h); });
    edgeEl.forEach(function (e) {
      var a = rect(e.f), b = rect(e.t), p;
      if (b.l >= a.r - 2) {
        var dx = Math.max(18, (b.l - a.r) * 0.55);
        p = 'M' + a.r + ' ' + a.cy + ' C' + (a.r + dx) + ' ' + a.cy + ' ' + (b.l - dx) + ' ' + b.cy + ' ' + b.l + ' ' + b.cy;
      } else {
        var dy = Math.max(16, (b.t - a.b) * 0.5);
        p = 'M' + a.cx + ' ' + a.b + ' C' + a.cx + ' ' + (a.b + dy) + ' ' + b.cx + ' ' + (b.t - dy) + ' ' + b.cx + ' ' + b.t;
      }
      e.el.setAttribute('d', p);
    });
  }

  /* ---------- pulses (a glowing dot travels the active edges) ---------- */
  function pulse(e, delay, dur) {
    if (reduce()) return;
    var c = d.createElementNS(NS, 'circle');
    c.setAttribute('r', '4.5'); c.setAttribute('class', 'tf-dot'); c.style.opacity = '0';
    svgP.appendChild(c);
    var len = e.el.getTotalLength(), t0 = null;
    setTimeout(function () {
      function f(ts) {
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur), ease = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        var pt = e.el.getPointAtLength(len * ease);
        c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.style.opacity = '1';
        if (k < 1) requestAnimationFrame(f);
        else { c.remove(); var n = nodeEl[e.t]; n.classList.remove('flash'); void n.offsetWidth; n.classList.add('flash'); }
      }
      requestAnimationFrame(f);
    }, delay);
  }

  /* ---------- scenario state → classes ---------- */
  function thread() { for (var i = 0; i < THREADS.length; i++) if (THREADS[i].id === S.th) return THREADS[i]; return THREADS[0]; }
  function clearMarks() {
    NODES.forEach(function (n) { nodeEl[n.id].classList.remove('lit', 'cur', 'dim', 'sel', 'up', 'dn', 'fail', 'hit', 'pick'); nodeEl[n.id].removeAttribute('aria-pressed'); });
    edgeEl.forEach(function (e) { e.el.setAttribute('class', 'tf-edge'); });
    svgP.innerHTML = '';
  }
  function drawDots() {
    var T = thread();
    dots.innerHTML = T.steps.map(function (s, k) { return '<button type="button" data-k="' + k + '" aria-label="Step ' + (k + 1) + ': ' + esc(s.when) + '"' + (k === S.i ? ' aria-current="step"' : '') + ' class="' + (k < S.i ? 'done' : k === S.i ? 'cur' : '') + '">' + (k + 1) + '</button>'; }).join('');
  }
  function renderStep(animate) {
    S.sel = null; S.fail = false;
    clearMarks();
    var T = thread(), lit = {}, inThread = {};
    T.steps.forEach(function (s) { s.n.forEach(function (id) { inThread[id] = 1; }); });
    NODES.forEach(function (n) { if (!inThread[n.id]) nodeEl[n.id].classList.add('dim'); else nodeEl[n.id].classList.add('pick'); });
    edgeEl.forEach(function (e) { if (!(inThread[e.f] && inThread[e.t])) e.el.classList.add('dim'); });
    for (var k = 0; k <= S.i; k++) {
      var step = T.steps[k];
      var order = step.n.slice().sort(function (a, b) { return byId[a].lane - byId[b].lane; });
      var lane0 = byId[order[0]].lane;
      order.forEach(function (id) {
        if (k === S.i) {
          edgeEl.forEach(function (e) {
            if (e.t === id && lit[e.f]) { e.el.classList.add('cur'); if (animate) pulse(e, (byId[id].lane - lane0) * 520 / S.sp, 900 / S.sp); }
          });
          nodeEl[id].classList.add('cur');
        }
        lit[id] = 1;
        nodeEl[id].classList.add('lit');
      });
    }
    edgeEl.forEach(function (e) { if (lit[e.f] && lit[e.t] && !e.el.classList.contains('cur')) e.el.classList.add('on'); });
    drawDots();
    if (S.i < 0) {
      clock.textContent = '◷ ready';
      panel.innerHTML = '<div class="tf-k">Thread ' + T.id + ' · ' + T.steps.length + ' steps</div><h3>' + esc(T.label.replace(/^[A-E] · /, '')) + '</h3><p>The highlighted boxes are the ones this thread touches. Press <b>▶ Play</b> to follow one document from set-up to filing, or click any box to see what feeds it and what it feeds.</p>';
    } else {
      var st = T.steps[S.i];
      clock.textContent = '◷ ' + st.when;
      panel.innerHTML = '<div class="tf-k">Thread ' + T.id + ' · step ' + (S.i + 1) + ' of ' + T.steps.length + ' · ' + esc(st.when) + '</div>' +
        '<p class="tf-say">' + esc(st.say) + '</p><div class="tf-chips">' + st.n.map(function (id) { var n = byId[id]; return '<button type="button" class="tf-chip" data-pick="' + id + '">' + esc(n.code) + ' · ' + esc(n.t) + ' →</button>'; }).join('') + '</div>';
    }
    $('[data-a="prev"]').disabled = S.i < 0;
    $('[data-a="next"]').disabled = S.i >= T.steps.length - 1;
  }
  function go(i, animate) { var T = thread(); S.i = Math.max(-1, Math.min(T.steps.length - 1, i)); renderStep(animate); }
  function stop() { S.playing = false; clearTimeout(S.t); playBtn.textContent = '▶ Play'; }
  function tick() {
    var T = thread();
    if (S.i >= T.steps.length - 1) { stop(); return; }
    go(S.i + 1, true);
    S.t = setTimeout(tick, (3600 + 300 * T.steps[S.i].n.length) / S.sp);
  }
  function play() {
    var T = thread();
    if (S.i >= T.steps.length - 1) go(-1, false);
    S.playing = true; playBtn.textContent = '⏸ Pause';
    clearTimeout(S.t); S.t = setTimeout(tick, S.i < 0 ? 250 : 400);
  }

  /* ---------- explore a node ---------- */
  function select(id) {
    stop();
    S.sel = id;
    clearMarks();
    var up = closure(id, 'up'), dn = closure(id, 'dn'), n = byId[id];
    NODES.forEach(function (x) {
      var el = nodeEl[x.id];
      if (x.id === id) { el.classList.add('sel'); el.setAttribute('aria-pressed', 'true'); }
      else if (up[x.id]) el.classList.add('up');
      else if (dn[x.id]) el.classList.add(S.fail ? 'hit' : 'dn');
      else el.classList.add('dim');
    });
    if (S.fail) nodeEl[id].classList.add('fail');
    edgeEl.forEach(function (e) {
      if ((up[e.f] || e.f === id) && (up[e.t] || e.t === id)) e.el.classList.add('up');
      else if ((dn[e.f] || e.f === id) && dn[e.t]) e.el.classList.add(S.fail ? 'fx' : 'dn');
      else e.el.classList.add('dim');
    });
    var chips = function (list, cls) { return list.length ? list.map(function (x) { return '<button type="button" class="tf-chip ' + cls + '" data-pick="' + x + '">' + esc(byId[x].code) + ' · ' + esc(byId[x].t) + '</button>'; }).join('') : '<span class="tf-none">— nothing; this is where the chain ' + (cls === 'u' ? 'starts' : 'ends') + '</span>'; };
    var dnList = Object.keys(dn);
    panel.innerHTML =
      '<div class="tf-k">' + esc(KIND[n.kind]) + (n.own ? ' · <span class="tf-ownk">★ object I owned' + (n.own === 2 ? ' (scope to be confirmed)' : '') + '</span>' : '') + ' · ' + esc(n.when) + '</div>' +
      '<h3><span class="tf-code2">' + esc(n.code) + '</span> ' + esc(n.t) + '</h3>' +
      '<div class="tf-cols"><div><b>What it does</b><p>' + esc(n.does) + '</p></div><div><b>Reads / writes</b><p class="pg-mono">' + esc(n.rw) + '</p></div><div><b>If it is missing or wrong</b><p>' + esc(n.risk) + '</p></div></div>' +
      '<div class="tf-rel"><div><b class="u">⬅ Fed by (upstream)</b><div class="tf-chips">' + chips(n.up, 'u') + '</div></div><div><b class="dd">Feeds (downstream) ➡</b><div class="tf-chips">' + chips(n.dn, 'dd') + '</div></div></div>' +
      (S.fail ? '<p class="tf-failnote">⚡ If <b>' + esc(n.code) + '</b> fails, <b>' + dnList.length + '</b> downstream object' + (dnList.length === 1 ? '' : 's') + ' inherit the error' + (dnList.length ? ': ' + dnList.map(function (x) { return esc(byId[x].kind === 'file' ? byId[x].t : byId[x].code); }).join(' · ') : '') + '.</p>' : '') +
      '<div class="tf-act"><button type="button" class="pg-btn' + (S.fail ? '' : ' ghost') + '" data-a="fail" aria-pressed="' + S.fail + '">⚡ What breaks if this fails?</button>' +
      (n.href ? '<a class="pg-btn ghost" href="' + esc(n.href) + '">Open the detail →</a>' : '') +
      '<button type="button" class="pg-btn ghost" data-a="back">↩ Back to thread ' + S.th + '</button></div>';
  }

  /* ---------- events ---------- */
  app.addEventListener('click', function (e) {
    var th = e.target.closest('[data-th]');
    if (th) { stop(); S.th = th.getAttribute('data-th'); Array.prototype.forEach.call(app.querySelectorAll('[data-th]'), function (b) { b.setAttribute('aria-pressed', b === th ? 'true' : 'false'); }); go(-1, false); play(); return; }
    var sp = e.target.closest('[data-sp]');
    if (sp) { S.sp = parseFloat(sp.getAttribute('data-sp')); Array.prototype.forEach.call(app.querySelectorAll('[data-sp]'), function (b) { b.setAttribute('aria-pressed', b === sp ? 'true' : 'false'); }); return; }
    var node = e.target.closest('.tf-node');
    if (node) { var id = node.getAttribute('data-id'); if (S.sel === id) { S.fail = false; go(S.i, false); } else { S.fail = false; select(id); } return; }
    var pick = e.target.closest('[data-pick]');
    if (pick) { S.fail = false; select(pick.getAttribute('data-pick')); nodeEl[S.sel].focus({ preventScroll: true }); return; }
    var dot = e.target.closest('.tf-dots [data-k]');
    if (dot) { stop(); go(+dot.getAttribute('data-k'), true); return; }
    var a = e.target.closest('[data-a]'); if (!a) return;
    var act = a.getAttribute('data-a');
    if (act === 'play') { S.playing ? stop() : play(); }
    else if (act === 'prev') { stop(); go(S.i - 1, true); }
    else if (act === 'next') { stop(); go(S.i + 1, true); }
    else if (act === 'reset') { stop(); go(-1, false); }
    else if (act === 'fail') { S.fail = !S.fail; select(S.sel); }
    else if (act === 'back') { S.fail = false; go(S.i, false); }
  });
  app.addEventListener('keydown', function (e) { if (e.key === 'Escape' && S.sel) { S.fail = false; go(S.i, false); } });

  /* ---------- boot ---------- */
  layout();
  go(-1, false);
  if (window.ResizeObserver) new ResizeObserver(function () { layout(); }).observe(map);
  else window.addEventListener('resize', layout, { passive: true });
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(layout);
  /* auto-play thread A once, the first time the map scrolls into view */
  if ('IntersectionObserver' in window && !reduce()) {
    var io = new IntersectionObserver(function (ents) {
      if (ents.some(function (en) { return en.isIntersecting; }) && !S.seen) { S.seen = true; io.disconnect(); if (S.i < 0 && !S.sel) play(); }
    }, { threshold: 0.35 });
    io.observe(map);
  }
  window.KitTaxFlow = { nodes: NODES, edges: EDGES, threads: THREADS, go: go, select: select, state: S };
  }

  /* the map sits below the fold: build it when it is about a screen away, or when the browser is idle after load —
     keeps the first paint on phones light; the static outline shows until then */
  var started = false;
  function start() { if (started) return; started = true; init(); }
  if ('IntersectionObserver' in window) {
    var near = new IntersectionObserver(function (es) { if (es.some(function (e) { return e.isIntersecting; })) { near.disconnect(); start(); } }, { rootMargin: '900px 0px' });
    near.observe(root);
  } else start();
  var idle = window.requestIdleCallback || function (f) { return setTimeout(f, 1200); };
  if (d.readyState === 'complete') idle(start, { timeout: 3000 }); else window.addEventListener('load', function () { idle(start, { timeout: 3000 }); });
})();
