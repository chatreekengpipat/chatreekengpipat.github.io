---
name: portfolio-exhibit-conventions
description: How Cee wants ERP-portfolio frontend work done — NDA-labeled reconstructions, no fabricated numbers, verify-then-build, propose-diff-first
metadata:
  type: feedback
---

When adding "exhibits" / detail to the ERP portfolio (project1–5.html), the real source data (XeerSoft/SAP screenshots, FSD, defect logs, P&L, award cert) is **Internal Confidential / NDA** and cannot be shown.

**Why:** credibility rests on real ERP specifics, but the artifacts can't be published.

**How to apply:**
- Every recreated artifact gets a visible NDA ribbon, e.g. "🔒 Illustrative reconstruction · original system data under NDA" / "Representative recreation · figures per author" / "Worked example · inputs reconstructed to match achieved outcomes". Award = text + "certificate withheld (confidential)", never a fake cert.
- **Never fabricate numbers/dates.** Use only what Cee gives. He may authorize reconstructing *inputs* to match real *outcomes* (labeled approx); unknown values → `[CONFIRM: …]` or "TBC", then ask.
- When he gives an **answer key**, compute and verify it matches before building; if off, stop and ask.
- For big sections: **propose layout + diff first, wait for confirm, then implement.** He often wants a restore-point commit before, and **separate commits per logical change** (revertable).
- **Headless screenshots don't work in this env** (Chrome/Edge wedge); state what you couldn't visually test and ask him to open the page. Verify instead via structure counts + the slop detector ([[impeccable-design-skill]]).
