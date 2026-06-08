# AGENTS.md — Master Brief for AI Agents

Read this before any task. It defines the rules, the work, and how to run it. Detailed per-task
prompts live in **PROMPT-PLAYBOOK.md**; verified numbers live in **METRIC-AUDIT.md**.

## What this is
Chatree Kengpipat's professional portfolio (chatreekengpipat.github.io). Audience: SAP functional
consulting recruiters (FI/CO and S/4HANA Sourcing & Procurement). Goal: present real ERP-consulting
work with depth and craft so it reads as genuinely skilled — never inflated.

## Non-negotiable rules

**Honesty (highest priority)**
- Never invent, inflate, or strengthen any number or claim.
- `METRIC-AUDIT.md` is the single source of truth for figures. A number not in it has NO source — flag
  it, never use it.
- This is **XeerSoft Cloud ERP** work, **NOT SAP**. Never add SAP T-codes, ABAP, or SAP-specific config
  as if used. You may note methodology aligns with SAP Activate / fit-to-standard as *transferable
  thinking* — never as SAP project experience.
- Mark anything unconfirmed `[TODO: Chatree to confirm]`. Never guess.

**Scope & safety**
- Do NOT touch `.claude/`, `.impeccable/`, `*.local.js`, or the MMTh photo folders.
- Preserve the design system: DM Sans (body), JetBrains Mono (code/figures), bento-grid layout,
  neural-network canvas background, existing color tokens in `styles.css`.
- One task per session. Open a branch + diff for review. Never force-push or rewrite history.
- Content must be visible if JS fails; honor `prefers-reduced-motion`; keyboard accessible.
- If anything is ambiguous, STOP and ask. Do not proceed on a guess.

## Status snapshot
- ✅ P0 repo hygiene — done
- ✅ P1 metric audit — METRIC-AUDIT.md produced; HTML reconciliation may still run
- ▶ everything else — see task list

## Task list (detail in PROMPT-PLAYBOOK.md)

| P | Task | Model | Owns file(s) |
|---|---|---|---|
| P0 | Repo hygiene | Codex/Claude | ✅ done |
| P1 | Metric audit + HTML reconciliation | Claude | METRIC-AUDIT.md, all pages (numbers only) |
| P2 | FSD deepening (one page per session) | Claude | project1–4.html |
| P3 | Methodology & accountability narrative | Claude | index.html |
| P4 | MUVMI page content | Claude | muvmi.html |
| P5 | Interactive FSD & module-flow components | Codex | project pages (after P2) |
| P6 | Simulation catalog + EOQ tag fix | Codex | project1.html |
| P7 | MUVMI visualizations | Codex | muvmi.html (after P4) |
| P8 | Smart technical effects | Codex | styles.css, animation.js, theme.js |
| P9 | Video → YouTube embeds | Codex | muvmi.html + media (needs YouTube URL) |
| P10 | Social/SEO meta pass | Codex | all pages `<head>` (after P0 merged) |
| P11 | As-Is → To-Be process flow | Codex | one project page |
| P12 | UAT burn-down + traceability | Codex | project3.html |

## How to run in parallel (avoid wasted work)

The real bottleneck is human review, not agent speed. So:
1. **One owner per file.** Two parallel branches must never edit the same file. Assign each agent a
   single page.
2. **`styles.css` is the shared landmine.** Components must put their CSS scoped inside their own page,
   not append to `styles.css`, unless that task explicitly owns `styles.css` (only P8 does). Run
   `styles.css`-owning tasks solo.
3. **Respect dependencies:** P5 after P2; P7 after P4; P10 after P0 merged.
4. **Cap at 2–3 sessions at once**, and **merge each branch as soon as it's reviewed** — don't let
   diffs pile up.
5. Prefer **Claude Haiku 4.5** for parallel runs (GPT-4.1 is currently unstable / throws CAPIError 400).

### Wave 1 — run now, files disjoint
- **P6** → owns `project1.html`
- **P11** → owns `project2.html` (Pricing/AR process flow)
- **P12** → owns `project3.html` (UAT burn-down; data ready in METRIC-AUDIT.md)

Run **P8 solo** (it owns global `styles.css` / `animation.js`) — not alongside Wave 1.

### After Wave 1 is merged
- Content: **P2** (per page), **P3** (index), **P4** (muvmi) — these are honesty-sensitive; Chatree
  drafts the prose, agent only places it.
- Then dependent code: **P5** (after P2), **P7** (after P4).
- Finishing: **P9** (needs YouTube URL), **P10** (meta/SEO, after P0 consolidation merged).

## Definition of done for any task
- Only verified data used; unconfirmed items marked `[TODO]`.
- No SAP T-codes on XeerSoft work.
- Design system preserved; accessible; degrades gracefully.
- A clean branch + diff opened for Chatree to review before merge.
