/* ============================================================
   CK KNOWLEDGE — canonical SAP + Business-Architecture reference dataset.
   SINGLE SOURCE OF TRUTH. Consumed by glossary.html, ba-glossary.html and
   knowledge-data.html (which also exports it as downloadable JSON).
   Loaded via <script src="data/knowledge.js"> so it works over file:// and
   HTTP alike (no fetch, no CORS). Entry schema: [term, catKey, defHTML, [href,label]?].
   Edit terms HERE and nowhere else.
   ============================================================ */
window.CK_KNOWLEDGE = {
  version: "1.0",
  updated: "2026-07-11",
  sets: {
    sap: {
      label: "SAP FI/CO reference — T-codes, tables, keys & concepts",
      page: "glossary.html",
      cats: { cfg:'Config', post:'Posting', rep:'Reporting', md:'Master data', tax:'Tax/WHT', tbl:'Table', key:'Acct key', mig:'Migration', intg:'Integration', concept:'Concept' },
      entries: [
    // Config / IMG
    ['SPRO','cfg','The Implementation Guide (IMG) — SAP’s central customizing tree. Every configuration path lives here.'],
    ['OBBG','cfg','Assign a country to its tax calculation procedure (e.g. TH → TAXTH).'],
    ['OBYZ','cfg','Maintain the tax calculation procedure, condition types and account keys.'],
    ['OBCN','cfg','Define and adjust the tax processing (transaction) keys.'],
    ['OBCL','cfg','Assign tax codes for non-taxable transactions per company code.'],
    ['FTXP','cfg','Create and maintain <b>tax codes</b> and their rates under a calculation procedure.'],
    ['OB40','cfg','<b>Tax account determination</b> — map each tax transaction key to the GL account it posts to.',['fi-tax-consultant-scope.html','FI Tax scope']],
    ['OB52','cfg','Open and close posting periods (period control).'],
    ['OBYC','cfg','<b>Automatic account determination for MM</b> — the keys (BSX/WRX/GBB/PRD) a goods movement posts to.',['sap-design.html#cv','See it in code']],
    ['OBWW','cfg','Define the GL accounts for withholding tax to be paid over.'],
    ['FBMP','cfg','Configure the dunning procedure (levels, charges, forms).'],
    ['FD32','cfg','Maintain customer credit master (classic credit management; FSCM in S/4).'],
    ['V/08','cfg','Define and maintain the <b>SD pricing procedure</b>.'],
    ['VK11','cfg','Create condition records (prices, discounts, surcharges) for SD pricing.'],
    ['VKOA','cfg','<b>Revenue account determination</b> — map SD billing to FI GL accounts.'],
    ['TAXTH','cfg','The Thai tax calculation procedure that VAT/WHT codes hang off.'],
    // Postings
    ['FB60','post','Post a <b>vendor (AP) invoice</b> — the core P2P tax test.'],
    ['FB70','post','Post a <b>customer (AR) invoice</b> — the core O2C tax test.'],
    ['FB03','post','Display a financial document — read the posted line items to verify a posting.'],
    ['F-53','post','Post a manual outgoing payment — where extended withholding tax is realised.'],
    ['F110','post','Automatic payment run (batch vendor payments).'],
    ['F150','post','Dunning run — issue overdue reminders by dunning level.'],
    ['FBS1','post','Post an accrual / deferral document (auto-reversed the next period).'],
    ['MIGO','post','Goods movement — goods receipt (mvt 101), issues, transfers.'],
    ['MIRO','post','Logistics invoice verification — the PO-based (3-way match) invoice in MM.'],
    ['VA01 / VA02','post','Create / change a sales order.'],
    ['VF01','post','Create a billing document — releases revenue to FI.'],
    ['ME21N','post','Create a purchase order.'],
    ['ME51N','post','Create a purchase requisition.'],
    // Reporting / period-end
    ['RFUMSV00','rep','Advance return for tax on sales/purchases — the VAT report feeding PP30.'],
    ['PP30','rep','Thai VAT filing (output/input VAT return).'],
    ['S_P00_07000134','rep','Generic withholding-tax reporting — feeds the Thai WHT certificate and PND output.'],
    ['KE30','rep','Run a CO-PA profitability report (margin by segment).'],
    ['FS10N','rep','GL account balance display.'],
    ['FBL1N / FBL5N','rep','Vendor / customer line-item display (open and cleared items).'],
    ['F.01','rep','Financial statement — balance sheet / P&amp;L via the Financial Statement Version.'],
    ['F.13','rep','Automatic clearing (e.g. clearing GR/IR).'],
    ['AFAB','rep','Asset depreciation run.'],
    ['FAGL_FCV','rep','Foreign-currency valuation of open items and balances (new GL).'],
    ['FAGLGVTR','rep','GL balance carry-forward to the new fiscal year.'],
    // Master data
    ['FS00','md','GL account master — create/change, incl. the tax category flag.'],
    ['XD01 / XK01','md','Create customer / vendor master (classic; unified as Business Partner in S/4).'],
    ['AS91','md','Create a legacy asset master with take-over values (migration).'],
    ['MM01','md','Create a material master (with its MM/SD/FI views).'],
    // Tax & WHT
    ['PP36','tax','Reverse-charge VAT reporting for imported services.'],
    ['PND 3 / 53 / 54','tax','Thai withholding-tax returns: PND&nbsp;3 (individuals), 53 (companies), 54 (overseas).'],
    ['Extended WHT','tax','SAP’s withholding-tax solution: a <b>type</b> (at invoice or payment) plus a <b>code</b> (rate), assigned on the business partner. Always used over Classic WHT.'],
    ['MWS / VST','tax','Output-tax (MWS) and input-tax (VST) transaction keys resolved in OB40.'],
    ['O7 / I7 / O0','tax','Example Thai tax codes: output VAT 7% / input VAT 7% / zero-rated output.'],
    // Tables
    ['ACDOCA','tbl','The <b>Universal Journal</b> — the single line-item table for FI + CO in S/4HANA.'],
    ['BKPF / BSEG','tbl','FI document header (BKPF) and line items (BSEG).'],
    ['BSID','tbl','Customer open-item secondary index.'],
    ['EKKO / EKPO','tbl','Purchasing document header (EKKO) and items (EKPO).'],
    ['MSEG','tbl','Material document segment — goods-movement line items.'],
    ['RBKP / RSEG','tbl','Invoice-verification document header (RBKP) and items (RSEG).'],
    ['VBRK / VBRP','tbl','Billing document header (VBRK) and items (VBRP).'],
    ['PRCD_ELEMENTS','tbl','Pricing condition records on a document in S/4 (was KONV).'],
    // Account-determination keys
    ['BSX','key','OBYC key: the <b>inventory / stock</b> posting account.'],
    ['WRX','key','OBYC key: the <b>GR/IR clearing</b> account bridging receipt and invoice.'],
    ['GBB','key','OBYC key: offsetting entry for goods movements (consumption, etc.).'],
    ['PRD','key','OBYC key: price differences when PO price ≠ standard price.'],
    ['KOFI / KOFK','key','SD→FI account-determination condition types (without / with CO).'],
    // Migration
    ['LTMC','mig','SAP S/4HANA <b>Migration Cockpit</b> — loads master and transactional data.',['data-migration-cutover.html','Migration page']],
    ['LSMW','mig','Legacy System Migration Workbench — the older batch migration tool.'],
    ['MB1C','mig','Post initial stock (mvt 561) — inventory balance take-over.'],
    // Integration
    ['IDoc','intg','Intermediate Document — SAP’s asynchronous message format for interfaces.',['integration-architecture.html','Integration page']],
    ['BAPI','intg','Business API — a standard synchronous method on a business object.'],
    ['RFC','intg','Remote Function Call — SAP’s synchronous cross-system protocol.'],
    ['OData','intg','REST-style protocol behind Fiori apps and modern integrations.'],
    ['SAP CPI','intg','Cloud Platform Integration / Integration Suite — SAP’s iPaaS middleware.'],
    ['DMEE','intg','Data Medium Exchange Engine — builds bank payment files (e.g. ISO 20022).'],
    ['WE02 / BD87','intg','Monitor / reprocess IDocs when an interface message fails.'],
    // Concepts
    ['RICEFW','concept','<b>R</b>eports, <b>I</b>nterfaces, <b>C</b>onversions, <b>E</b>nhancements, <b>F</b>orms, <b>W</b>orkflows — the categories of custom development.',['ricefw-register.html','RICEFW register']],
    ['FSD','concept','Functional Specification Document — turns a business requirement into a developer-ready design.',['functional-specification.html','See a worked FSD']],
    ['Use Case / User Story','concept','Requirement artifacts describing an actor’s goal / an increment of value.'],
    ['Universal Journal','concept','S/4HANA’s single source of truth (ACDOCA) merging FI and CO — no FI-CO reconciliation.'],
    ['Condition technique','concept','SAP’s pricing rule engine: condition tables → access sequence → condition types → procedure.'],
    ['CO-PA','concept','Profitability Analysis — margin by market segment (product, region, customer).'],
    ['Fit-Gap','concept','Comparing requirements to SAP standard; the gaps become RICEFW objects.'],
    ['SAP Activate','concept','SAP’s implementation methodology: Prepare → Explore → Realize → Deploy → Run.'],
    ['Business Partner','concept','S/4HANA’s single master record carrying customer and vendor roles.'],
    ['Reconciliation account','concept','The GL account a sub-ledger (AR / AP / assets) rolls its balance up into.'],
    ['Dunning','concept','The process of reminding customers of overdue items, escalated by dunning level.'],
    ['GR/IR','concept','Goods-Receipt / Invoice-Receipt clearing — the account bridging an MM receipt and its invoice.'],
    ['3-way match','concept','Reconciling purchase order ↔ goods receipt ↔ invoice before a vendor is paid.'],
    ['Royalty / SRB / PITA','concept','Thai petroleum taxes: royalty on gross, Special Remuneratory Benefit (windfall), and Petroleum Income Tax.',['fi-tax-consultant-scope.html','PTTEP tax engine']]
  ]
    },
    ba: {
      label: "Business Architecture — BIZBOK / TOGAF terms",
      page: "ba-glossary.html",
      cats: { fw:'Framework', bp:'Blueprint', tech:'Technique', strat:'Strategy', togaf:'TOGAF', role:'Role', concept:'Concept' },
      entries: [
    ['BIZBOK','fw','The <b>Business Architecture Body of Knowledge</b> from the Business Architecture Guild — the definitive framework defining the core blueprints and techniques.',['business-architecture.html','BA Hub']],
    ['TOGAF','fw','<b>The Open Group Architecture Framework</b> — an enterprise-architecture method; business architecture is delivered in Phase B of its ADM.'],
    ['ADM','fw','TOGAF&rsquo;s <b>Architecture Development Method</b> — the cycle: Preliminary, A Vision, B Business, C Information Systems, D Technology, E Opportunities, F Migration, G Governance, H Change.'],
    ['ArchiMate','fw','The Open Group&rsquo;s modelling <b>notation</b> for enterprise architecture, layered into business, application and technology.'],
    ['Zachman Framework','fw','An enterprise-architecture <b>ontology</b>: a matrix of perspectives (rows) against interrogatives — what, how, where, who, when, why.'],
    ['Business Model Canvas','fw','A one-page strategic tool describing a business across nine blocks (value proposition, segments, channels, revenue, cost).'],
    ['Operating Model Canvas','fw','A tool for designing how an organisation delivers value operationally across a set of dimensions.',['operating-model.html','TOM page']],

    ['Business Capability','bp','What a business does, as a <b>stable noun</b> (&ldquo;Customer Management&rdquo;) — independent of process, org or technology.',['capability-map.html','Capability Map']],
    ['Capability Map','bp','The hierarchical model (L1→L3) of an enterprise&rsquo;s capabilities — the anchor artifact of business architecture.',['capability-map.html','open it']],
    ['Value Stream','bp','An end-to-end sequence of stages that delivers value to a <b>stakeholder</b>; each stage is enabled by capabilities.',['value-streams.html','Value Streams']],
    ['Value Stream Stage','bp','A discrete step in a value stream producing a value item, with entrance and exit criteria.'],
    ['Value Item','bp','The unit of value a stakeholder receives at a value-stream stage.'],
    ['Organization Map','bp','A blueprint of business units, partners and their relationships — the <i>who</i> of the enterprise.'],
    ['Information Map','bp','A blueprint of the business information <b>concepts</b> the enterprise uses — the business view of data, not a data model.'],
    ['Information Concept','bp','A business-meaningful unit of information (Customer, Order, Product) in the information map.'],
    ['Stakeholder','bp','Any party with an interest in, or that receives value from, the enterprise — customer, employee, partner, regulator.'],

    ['Capability-Based Planning','tech','Planning investment and change around <b>capabilities</b> rather than projects or org units.'],
    ['Heat Map','tech','Colouring a capability map by a dimension — maturity, performance, importance or investment — to focus the conversation.',['capability-map.html','see it live']],
    ['Cross-Mapping','tech','Relating two blueprints — e.g., mapping which capabilities enable each value-stream stage.'],
    ['Current State','tech','The <b>as-is</b> architecture — how things work today. Also called the baseline.'],
    ['Future State','tech','The <b>to-be</b> architecture — the target design. Also the target state.'],
    ['Gap Analysis','tech','The difference between current and future state, which defines what must change.'],
    ['Roadmap','tech','A sequenced set of initiatives that moves the enterprise from current to future state.'],
    ['Capability Assessment','tech','Rating capabilities (maturity, importance, performance) to prioritise where to invest.'],
    ['Capability Increment','tech','A defined improvement to a capability delivered by an initiative.'],

    ['Strategy Map','strat','A view linking objectives to the capabilities and initiatives that achieve them.'],
    ['Objective','strat','A measurable goal the strategy is trying to achieve.'],
    ['Initiative','strat','A programme or project that changes capabilities to deliver a business outcome.'],
    ['Business Outcome','strat','The measurable result an initiative is meant to produce.'],
    ['Course of Action','strat','A strategic approach chosen to reach an objective.'],
    ['Value Proposition','strat','The bundle of value an enterprise offers a stakeholder segment.'],

    ['Phase B','togaf','The <b>Business Architecture</b> phase of the TOGAF ADM — where capability, value, organisation and information views are developed.'],
    ['BDAT','togaf','The four TOGAF architecture <b>domains</b>: Business, Data, Application, Technology.'],
    ['Architecture Vision','togaf','ADM Phase A — the high-level, aspirational view that scopes the work.'],
    ['Architecture Building Block','togaf','ABB — a reusable, technology-independent architecture component.'],
    ['Solution Building Block','togaf','SBB — a specific, implementable component that realises an ABB.'],
    ['Architecture Repository','togaf','Where architecture assets, standards and reference models are stored.'],
    ['Enterprise Continuum','togaf','TOGAF&rsquo;s way of classifying architecture assets from generic to organisation-specific.'],
    ['Requirements Management','togaf','The central ADM activity that governs requirements across every phase.'],
    ['Architecture Governance','togaf','ADM Phase G — controlling the implementation so it conforms to the architecture.'],

    ['Business Architect','role','Owns the business blueprints and connects strategy to execution across the enterprise.'],
    ['Enterprise Architect','role','Owns the architecture across all domains — business, data, application and technology.'],
    ['Solution Architect','role','Designs the architecture for a specific solution or initiative.'],

    ['Enterprise Architecture','concept','The discipline of describing and governing an enterprise across business, data, application and technology to align it with strategy.'],
    ['Operating Model','concept','How an enterprise is <b>organised to deliver value</b> — its processes, structure, information, technology, partners, locations and governance.',['operating-model.html','TOM page']],
    ['Target Operating Model','concept','TOM — the designed future operating model an organisation is transforming toward.',['operating-model.html','open it']],
    ['Baseline','concept','The current-state architecture used as the starting point for change.'],
    ['Operating Model (MIT)','concept','Ross &amp; Weill&rsquo;s four models by process standardisation/integration: Coordination, Unification, Diversification, Replication.'],
    ['POLDAT','concept','An operating-model dimension set: Process, Organisation, Location, Data, Applications, Technology.'],
    ['Business Motivation Model','concept','A structure for the <i>why</i>: ends (vision, goals) and means (strategies, tactics), with influencers and assessments.'],
    ['Digital Decoupling','concept','Progressively replacing or wrapping legacy systems so the business can move faster without a big-bang replacement.'],
    ['Lean Value Stream Map','concept','A lean-manufacturing technique visualising material and information flow — related to, but distinct from, the BIZBOK value stream.']
  ]
    }
  }
};
