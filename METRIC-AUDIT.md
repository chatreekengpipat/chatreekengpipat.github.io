# METRIC-AUDIT.md — Source of Truth for Portfolio Metrics

**Purpose:** Authoritative reference for every quantitative claim on the portfolio site, traced
to the original Power BI dashboard exports. Use this to verify that the numbers shown in the
HTML match the source. If the HTML differs from this file, fix the HTML — this file is the source.

**Source documents audited:** ERP Procurement, Pricing & AR, Loyalty UAT, STEM Billing &
Profitability, and Executive Overview dashboards (Power BI exports, LearnBalance Group).

**Status legend:**
- `DOCUMENTED` = the figure appears in the source Power BI dashboard exactly as stated.
- `ROUNDING` = correct but the HTML should match the source rounding.
- `METHODOLOGY` = documented, but be ready to explain *how it was measured* in interview.

---

## P1 — Procurement (Jan 2023 – Jun 2023) → project1.html

| KPI | Before | After | Improvement | Status |
|---|---|---|---|---|
| Vendor On-Time Delivery | 68% | 87% | ▲ 27.94% | DOCUMENTED |
| Unauthorised PO Rate | 30% | 0% | ▲ 100.00% | DOCUMENTED |
| Stockout Rate XS/XXL | 22% | 3% | ▲ 86.36% | DOCUMENTED |
| Textbook Write-off | ฿45,000 | ฿8,000 | ▲ 82.2% | DOCUMENTED |
| Cost Saved vs Remain | — | ฿37K saved (82.2%) / ฿8K remain (17.8%) | — | DOCUMENTED |

---

## P2 — Pricing & AR (Jun 2023 – Jun 2024) → project2.html

| KPI | Before | After | Improvement | Status |
|---|---|---|---|---|
| Pricing Decision Time | 480 min | 15 min | ▲ 96.88% | DOCUMENTED + METHODOLOGY |
| Avg Days Overdue | 42 days | 12 days | ▲ 71.43% | DOCUMENTED |
| AR Collection Rate | 78% | 96% | ▲ 23.08% | DOCUMENTED |
| Collected vs Not Collected | — | 96% collected / 4% not | — | DOCUMENTED |

> Previously flagged `480→15 min` and `78%→96%` are CONFIRMED present in source. Not invented.

---

## P3 — Loyalty System UAT (Jun 2024 – Jan 2025) → project3.html

| Metric | Value | Status |
|---|---|---|
| Total Defects | 60 | DOCUMENTED |
| Go-Live Blockers (total) | 11 (16.2%) | DOCUMENTED |
| Defects Resolved | 83.8% | DOCUMENTED |
| Regression Count (total) | 10 | DOCUMENTED |
| Overall Defect Reduction | up to 37.5% | DOCUMENTED |
| Build Cycles | 5 | DOCUMENTED |

**Per-cycle burn-down (the 11-blocker story):**

| Cycle | Total Defects | Go-Live Blockers | Regression | Defect Reduction % |
|---|---|---|---|---|
| Cycle 1 | 16 | 7 | 0 | 0.0% |
| Cycle 2 | 12 | 2 | 5 | 25.0% |
| Cycle 3 | 12 | 2 | 2 | 25.0% |
| Cycle 4 | 10 | 0 | 2 | 37.5% |
| Cycle 5 | 10 | 0 | 1 | 37.5% |

> Blockers burned down 7 → 2 → 2 → 0 → 0 across 5 cycles. This is the strongest "on-time
> delivery under pressure" story and it is fully documented.

---

## P4 — STEM Billing & Profitability (Jan 2025 – present) → project4.html

| Metric | Value | Status |
|---|---|---|
| Total Revenue | ฿2,136,000 | DOCUMENTED (cite as ฿2.14M, not ฿2.13M) |
| Collection Rate | 82.4% | DOCUMENTED |
| Collected / Outstanding | 82.4% / 17.6% | DOCUMENTED |
| Gross Profit | ฿678,869 | DOCUMENTED |
| Outstanding AR | ฿375,000 | DOCUMENTED |

**Gross Profit & margin by subject:**

| Subject | Total Revenue | Total Collected | Gross Profit | Collection | Margin |
|---|---|---|---|---|---|
| Robotics | ฿534,000 | ฿435,000 | ฿168,020 | 81% | 31% |
| Biology Lab | ฿555,000 | ฿444,000 | ฿157,374 | 80% | 28% |
| Math Modelling | ฿390,000 | ฿337,500 | ฿132,802 | 87% | 34% |
| Physics Lab | ฿267,000 | ฿226,500 | ฿98,004 | 85% | 37% |
| Chemistry Lab | ฿264,000 | ฿211,500 | ฿87,594 | 80% | 33% |
| Engineering Design | ฿126,000 | ฿106,500 | ฿35,075 | 85% | 28% |

> Previously flagged `฿2.13M` is CONFIRMED as ฿2,136,000. Use ฿2.14M or the full figure.

---

## Executive Overview (All projects, Jan 2023 – present) → index.html

| Metric | Value | Status |
|---|---|---|
| Projects Count | 4 | DOCUMENTED |
| Staff Trained | 47 | DOCUMENTED |
| Tickets Resolved | 219 | DOCUMENTED |
| Business Domains | 4 (Procurement · Finance · Billing · UAT) | DOCUMENTED |

---

## Overall verdict

Every headline metric on the portfolio traces to a source Power BI dashboard. **Nothing here is
fabricated.** Two actions remain:

1. **Rounding fix:** ฿2,136,000 should be shown as **฿2.14M** (or the full figure), not ฿2.13M.
2. **Methodology readiness (interview, not the site):** These are figures from dashboards you
   built. The dashboard proves you did the analysis; it does not by itself prove each number is
   an audited system measurement. For each KPI — especially **Pricing Decision Time 480→15 min** —
   be ready to answer "How did you measure this?" (e.g. system timestamps, sampled cases, manager
   estimate, log extract). If a figure was an estimate, frame it as "estimated/observed", not "measured".

## Cross-check still needed (cannot be done from source alone)

This audit is built from the source dashboards only. **Compare each HTML page against the tables
above.** If any HTML page shows a number that is NOT in this file (an extra claim, a different
value, a stronger percentage), that claim has no source and must be corrected or removed.
