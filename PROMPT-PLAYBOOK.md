# PROMPT-PLAYBOOK.md — Agent Task Prompts (P0–P12)

How to use: one task = one new session. Set the model named in each task (Claude Haiku 4.5 or
GPT-4.1/Codex), paste the prompt, run, review the diff, then merge. Set the GLOBAL RULES below
once in the app's **Instructions** so every session inherits them.

Legend: ✅ done · ▶ ready now · ⛓ blocked until a dependency finishes

---

## GLOBAL RULES — paste once into "Instructions"

```
You are working on Chatree Kengpipat's professional portfolio (chatreekengpipat.github.io),
an ERP consultant's portfolio aimed at SAP functional consulting roles. Follow these in EVERY session:

HONESTY (highest priority):
- Never invent, inflate, or strengthen any number, metric, or claim.
- METRIC-AUDIT.md is the single source of truth for figures. If a number is not in it, it has no
  source — flag it, do not use it.
- This portfolio describes XeerSoft Cloud ERP work, NOT SAP. Never add SAP T-codes, ABAP, or
  SAP-specific config as if used. You MAY note methodology aligns with SAP Activate / fit-to-standard
  as transferable thinking — never as SAP project experience.
- Mark anything unconfirmed as [TODO: Chatree to confirm]. Never guess.

SCOPE & SAFETY:
- Do NOT touch .claude/, .impeccable/, *.local.js, or the MMTh photo folders.
- Preserve the design system: DM Sans (body), JetBrains Mono (code/figures), bento-grid layout,
  neural-network canvas background, existing color tokens in styles.css.
- One task per session. Open a branch + diff. Never force-push or rewrite history.
- If anything is ambiguous, STOP and ask. Content must be visible if JS fails; honor prefers-reduced-motion.
```

---

## Run order

1. ✅ P0 (cleanup) · ✅ P1 (metric audit)
2. ▶ Content (Claude): P2 → P3 → P4  *(recommend: let Chatree/Claude-chat draft P2 & P4 prose for fidelity)*
3. ▶ Code (Codex), can run in parallel now: **P6, P8 (done), P11, P12**
4. ⛓ Code needing content first: P5 (after P2), P7 (after P4)
5. ▶ Finishing: P9 (needs a YouTube URL), P10 (after P0 consolidation merged)

---

## ✅ P0 — Repo hygiene — Codex *(done)*
Already run on Claude Haiku. Reconciliation of folders complete. No re-run needed.

---

## ✅ P1 — Metric audit — Claude *(done)*
METRIC-AUDIT.md produced. Run this reconciliation prompt against the HTML to finish:

```
Using METRIC-AUDIT.md as the single source of truth, reconcile the HTML. Do NOT invent, improve,
or strengthen any number.
1. Read METRIC-AUDIT.md fully.
2. Scan index.html and project1.html–project4.html for every number, percentage, and currency figure.
3. Apply ONLY these fixes: (a) change any "฿2.13M"/"2.13M" revenue to "฿2.14M" (source ฿2,136,000);
   (b) make any number that disagrees with the audit match the audit exactly.
4. For any number in the HTML NOT present in METRIC-AUDIT.md: DO NOT delete or change it. List it in
   a report (file + exact text + value) for manual review. These are "no source" claims.
5. Do not touch design, layout, or copy beyond number reconciliation.
6. Output: the diff of number fixes + a "NO SOURCE — needs review" list. Open a branch + diff.
```

---

## ▶ P2 — FSD deepening — Claude  *(run ONE page per session)*

```
Task: Deepen the Functional Specification content for [PAGE: project1.html | project2.html |
project3.html | project4.html]. ONE page per session.

Make the page read like a real consultant deliverable, grounded only in verified data. Ensure these
sections exist and are substantive (XeerSoft-native terms, no SAP T-codes):
1. Business Context — the problem, who was affected, why it mattered.
2. As-Is Process — current-state pain points.
3. To-Be Process — the redesigned flow and the configuration/logic that enabled it.
4. Functional Requirements — numbered, testable requirement statements.
5. Solution Logic — key decision rules / configuration parameters (describe logic, not fake code).
6. Acceptance Criteria — how success was verified.
7. Outcome — ONLY the KPIs in METRIC-AUDIT.md for this project, with exact verified values.

Hard rules: use METRIC-AUDIT.md for every number; add no KPI not listed there. Do not change layout
structure; expand within existing sections. Precise consultant voice, no marketing fluff. Insert
[TODO: Chatree to confirm] where a real detail is missing. Open a branch + diff.
```

---

## ▶ P3 — Methodology & accountability narrative — Claude

```
Task: Strengthen the methodology and accountability narrative on index.html (and any Approach/About section).

Write/refine two things:
1. Delivery methodology — a concise six-step spec-to-development process (requirements → FSD →
   configuration → UAT → go-live → hypercare), framed as aligned with SAP Activate phases
   (Discover/Prepare/Explore/Realize/Deploy/Run) as TRANSFERABLE thinking — not SAP experience.
2. Single point of accountability — Chatree as the sole ERP consultant connecting ~200 users across
   3 branches, executives, department heads, 50+ UAT participants, and a remote dev team, with every
   go-live anchored to an immovable external deadline (intake season, academic term, billing cycle).

Hard rules: factual, specific, no inflated scope; figures only from METRIC-AUDIT.md or clearly
attributable. XeerSoft, not SAP. Preserve design system. Open a branch + diff.
```

---

## ▶ P4 — MUVMI page content — Claude

```
Task: Write the content for muvmi.html (MUVMI regenerative-brake assistive-device project).

FRAMING (critical): a 5-person UNIVERSITY design project done IN COLLABORATION WITH MUVMI — NOT
employment at MUVMI. State this clearly. Do not imply Chatree worked at MUVMI.

Structure: problem/objective, design approach, engineering result, Chatree's individual contribution.

Confirmed figures (Chatree re-verifies before publishing — do not alter):
- Regenerative energy recovery improvements: +220.72% and +33.48% [confirm which metric each maps to]
- Ergonomic angles: knee 108°, ankle 86°
- Cost figure: 660 THB
For Chatree's specific individual role: insert [TODO: Chatree to confirm individual contribution] —
do NOT guess.

Hard rules: no invented results beyond the confirmed figures. Match the other project pages' design.
Open a branch + diff.
```

---

## ⛓ P5 — Interactive FSD & module-flow components — Codex  *(after P2)*

```
Task: Make the Functional Spec content interactive across project pages. Enhance presentation only —
do not change any text or number.

Build (vanilla JS, match design tokens):
1. Expandable/collapsible accordions for long FSD blocks, keyboard-accessible.
2. Module-flow paths as a clean inline styled flow (e.g., PR → Approval → PO → GR → Invoice) with
   hover states showing each step name.
3. Monospace (JetBrains Mono) styled display with subtle highlighting for existing logic/pseudocode
   blocks — present existing text only.

Hard rules: do not edit wording or numbers; presentation/interaction only. Content visible if JS fails;
honor prefers-reduced-motion. No SAP T-codes. Open a branch + diff.
```

---

## ▶ P6 — Simulation catalog + EOQ tag fix — Codex

```
Task: On project1.html (Procurement), two changes.
1. Tag fix: find the label that wrongly says "Poisson" for the reorder/inventory model and change it
   to "Modified EOQ". Verify the surrounding explanation matches a Modified EOQ approach; if it does
   not, STOP and report rather than rewriting.
2. Expand the Purchase Requisition simulation: add 2–3 additional realistic procurement scenarios
   (varying demand / lead time / stockout) into the existing simulation component, using the existing
   UI pattern. Clearly label the simulation as "illustrative" (not real transaction data).

Hard rules: do not change any verified KPI from METRIC-AUDIT.md. Keep "illustrative" label. Match
design system. Open a branch + diff.
```

---

## ⛓ P7 — MUVMI visualizations — Codex  *(after P4)*

```
Task: Add Chart.js visualizations to muvmi.html using ONLY the confirmed figures on the page. Do not
invent data points.
1. A comparison chart for regenerative energy recovery (+220.72% / +33.48%) with labeled axes + source.
2. An annotated SVG ergonomic-angle diagram (knee 108°, ankle 86°).

Hard rules: every data point traces to a confirmed figure on the page; mark gaps [TODO]. Match design
system (colors, fonts). Open a branch + diff.
```

---

## ✅ P8 — Smart technical effects — Codex *(prompt already provided / in progress)*

```
Task: Polish the site's interactive effects WITHOUT changing content, copy, numbers, or layout.
Files: animation.js, theme.js, styles.css only.
1. Neural-canvas bg: smooth mouse-repulsion motion, cap particles on mobile, pause on tab hidden
   (visibilitychange), respect prefers-reduced-motion.
2. Scroll-reveal: lightweight IntersectionObserver fade/slide on first view (~300ms, once); respect
   prefers-reduced-motion.
3. KPI count-up: numbers animate 0 → final value once when scrolled into view; READ the existing DOM
   value — never hardcode or change a value.
4. Smooth hover transitions on cards/links consistent with design tokens.

Hard rules: never change a displayed value (animation reveals existing values only). Don't alter the
design system. Degrade gracefully; honor prefers-reduced-motion. Open a branch + diff.
```

---

## ▶ P9 — Video → YouTube embeds — Codex  *(needs a YouTube URL)*

```
Task: Replace local .mp4 video(s) with responsive YouTube embeds.
1. Find every <video>/.mp4 reference (notably the MUVMI video in muvmi-photos/Video/).
2. Replace with a responsive, lazy-loaded YouTube iframe (16:9, no layout shift). Use this URL:
   [PASTE YOUTUBE URL HERE].
3. After embeds work, remove the now-unused .mp4 and the empty Video/ folder; update .gitignore to keep
   large media out.

Hard rules: don't break any other reference; verify the page renders. Open a branch + diff (confirm the
.mp4 removal reduces repo size).
```

---

## ▶ P10 — Social/SEO meta pass — Codex  *(after P0 consolidation merged)*

```
Task: Add professional metadata + social-preview support to all HTML pages.
1. Per-page <title> and <meta name="description"> (concise, professional, ERP-consultant focused).
2. Open Graph (og:title/description/image/url/type) + Twitter Card tags so the link preview looks
   polished when shared (site is shared via Instagram bio).
3. One shared og:image — use an existing dashboard/cover image in the repo (do not generate images).
4. Lazy-load offscreen images (loading="lazy"); verify no broken paths after folder consolidation.

Hard rules: descriptions accurate per page, no inflated claims. Don't change visible content/design.
Open a branch + diff.
```

---

## ▶ P11 — Interactive As-Is → To-Be process flow — Codex  *(NEW)*

```
Task: Build an interactive As-Is → To-Be process-flow component for ONE project (recommend
project1.html Procurement, or project2.html Pricing/AR).

Requirements:
1. Render a swimlane / horizontal process flow as inline SVG or styled HTML (roles as lanes, steps as
   nodes, arrows for flow). Use XeerSoft-native step names — NO SAP T-codes.
2. A toggle switches between "As-Is" (current pain-point flow) and "To-Be" (redesigned flow); animate
   the transition subtly.
3. Hover/click a step shows a short descriptive tooltip.
4. Base the flow on the REAL process described on that page. If a step is unclear, STOP and ask — do
   not invent process steps.

Hard rules: match design system (DM Sans; JetBrains Mono for node labels; existing colors). Fully
responsive and readable on mobile; keyboard accessible; honor prefers-reduced-motion. Flow must be
accurate to documented work. Open a branch + diff.
```

---

## ▶ P12 — UAT burn-down + traceability — Codex  *(NEW — data ready)*

```
Task: On project3.html (Loyalty System UAT), build a defect burn-down chart and a traceability table.
Use ONLY data in METRIC-AUDIT.md.

Build:
1. Defect burn-down (Chart.js, line or bar): Cycle 1–5, Total Defects (16,12,12,10,10) and Go-Live
   Blockers (7,2,2,0,0). Title it to show blockers burning down to zero; label axes. Numbers MUST match
   METRIC-AUDIT.md exactly.
2. Summary strip: Total Defects 60, Defects Resolved 83.8%, Go-Live Blockers 11, Overall Defect
   Reduction up to 37.5% — exact audit values.
3. Traceability table skeleton: columns Requirement | Test Case | Defect | Resolution Status. Populate
   ONLY supportable rows; for unknown cells insert [TODO: Chatree to provide test-case IDs]. Do NOT
   invent requirement IDs, test-case IDs, or defect descriptions.

Hard rules: every number traces to METRIC-AUDIT.md; no invented traceability data. Match design system;
chart respects prefers-reduced-motion. Open a branch + diff.
```
