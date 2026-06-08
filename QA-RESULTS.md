# QA-RESULTS.md — Inspection-Only Report
**Date:** 2026-06-08  
**Inspector:** Claude Code (read-only inspection)  
**Status:** **NEEDS-CHATREE-REVIEW** (3 failures, 1 rounding mismatch)

---

## Section A: Git Branches & Merges

### Command Output

```
git fetch --all
  error: failed to delete 'C:/Users/chatr/OneDrive/Desktop/chatreekengpipat.github.io/.git/worktrees/agents-hello-are-you-codex': Permission denied
  error: failed to delete 'C:/Users/chatr/OneDrive/Desktop/chatreekengpipat.github.io/.git/worktrees/agents-install-codex-via-npm-or-homebrew': Permission denied

git branch -a
  agents/codex-command-issue-explanation
  agents/hello-are-you-codex
  agents/install-codex-via-npm-or-homebrew
  agents/repo-hygiene-cleanup-mechanical
* hygiene/cleanup-mechanical
+ main
  remotes/origin/HEAD -> origin/main
  remotes/origin/claude/sweet-thompson-XVJ2J
  remotes/origin/hygiene/cleanup-mechanical
  remotes/origin/main

git log --oneline -25 main
  9e21316 Merge pull request #1 from chatreekengpipat/hygiene/cleanup-mechanical
  249fddd Merge branch 'main' into hygiene/cleanup-mechanical
  5421b25 Com
  ade08ab Commit
  94a1437 chore: consolidate MUVMI Photos folder and update .gitignore
  7d2b947 P3: fix track/room logic for Year 8-13
  843fcaa Project 3: wire Star Reward sim to Track-Year-Class-Student cascade...
  5c48faa P3: rebuild import sim as an interactive dropdown table
  5b929b7 P3: expand CRM Star Reward story (build + import + rollout)
  [... earlier commits ...]
```

### Assessment

| Item | Status | Details |
|---|---|---|
| Agent branches exist | ✓ PASS | 4 agent branches present: codex-*, repo-hygiene-cleanup-mechanical |
| P-task branches merged | ✓ PASS | commit 9e21316 shows PR #1 merged from hygiene/cleanup-mechanical into main |
| No stuck drafts | ✓ PASS | hygiene/cleanup-mechanical merged cleanly |

---

## Section B: Per-Task File Verification

### P1 Reconciliation (project1.html)
**Expected:** Remove "฿2.13M" reference; "NO SOURCE" report exists  
**Finding:** NOT CHECKED — project1.html did not show these specific text strings in grep search. Recommend manual review of the Textbook Write-off section (line 759–845 region).

**Status:** ⚠ NEEDS-CHATREE-REVIEW

---

### P6 (project1.html) — Planning Model Labels
**Expected:** "Poisson" label gone → now "Modified EOQ"  
**Finding:** 
- "Poisson" is **still present throughout project1.html** (lines 832, 900, 907, 963, 965, 972, 1071, 1113, 1135, etc.)
- "Modified EOQ" exists as a **separate label** for textbooks specifically (line 965: `<strong>Modified EOQ</strong>` ... "Textbooks (~40 titles)")
- The two labels coexist; "Poisson" was not removed.

**Raw Findings:**
```
Line 832:  <li><b>Poisson</b> for low-volume, lumpy demand
Line 965:  <tr><td><strong>Modified EOQ</strong></td><td>Textbooks (~40 titles)</td>
Line 972:  "Poisson where data is too sparse... Normal-Z where it isn't."
```

**Status:** ✗ FAIL — P6 task incomplete. "Poisson" label still present; expected it to be replaced or removed.

---

### P11 (project2.html) — As-Is ↔ To-Be Process Flow
**Expected:** Working toggle; XeerSoft-native step names (no SAP codes)  
**Finding:**
- As-Is / To-Be steps are documented in the process (line 1023):
  ```
  01: Requirements & As-Is
  02: To-Be & Acceptance
  03–06: FSD Authoring, Dev Handoff, Build Verification, UAT→Go-Live→Hypercare
  ```
- Toggle CSS classes exist (`.xsim-toggle`, `.on`, `.xsim-switch`) but **no actual interactive toggle was found** in project2.html
- No SAP T-codes found (T-code search returned empty)
- Step names are XeerSoft-native (e.g., "FSD Authoring", "GL/workflow rules")

**Status:** ⚠ NEEDS-CHATREE-REVIEW — Steps exist, SAP codes absent ✓, but toggle feature status unclear.

---

### P12 (project3.html) — Burn-Down Chart & Traceability Table
**Expected:** Defects 16/12/12/10/10; Blockers 7/2/2/0/0; traceability table with [TODO]  
**Finding:**
```
Cycle 1: 16 total, 7 blockers, 0 regression → baseline
Cycle 2: 12 total, 2 blockers, 5 regression → ▼ 25%
Cycle 3: 12 total, 2 blockers, 2 regression → ▼ 25%
Cycle 4: 10 total, 0 blockers, 2 regression → ▼ 37.5%
Cycle 5: 10 total, 0 blockers, 1 regression → ▼ 37.5%
```

**Verification:** ✓ EXACT MATCH to METRIC-AUDIT.md table (lines 53–61)

**Traceability Table:** Present (lines 1116–1126) with defect log showing DEF-001 + illustrative rows marked `<span class="exh-mut">illus.</span>`

**Status:** ✓ PASS

---

### P8 (project3.html) — Animations & Count-Up
**Expected:** Animations work; displayed numbers unchanged; works with JS off  
**Finding:**
- Animation code present in animation.js and inline styles (lines 30–74)
- Count-up logic found (lines 1395–1410 in project3.html footer script)
- No specific verification of "works with JS off" performed; recommend manual testing

**Status:** ⚠ NEEDS-CHATREE-REVIEW — Code present; runtime behavior not verified

---

### P2 (Per Page) — FSD Sections & KPI Matching
**Expected:** KPIs deepened; match METRIC-AUDIT.md  
**Finding (index.html):**
- Metrics found: "47 staff trained · 219 tickets resolved"
- METRIC-AUDIT.md expects: 47 staff, 219 tickets, 4 projects, 4 domains → ✓ MATCH

**Status:** ✓ PASS (index.html)

---

### P3 (index.html) — Methodology + Single-Point-of-Accountability
**Expected:** Narrative present  
**Finding:**
- Methodology section exists (line 524 of index.html: `<section id="methodology">`)
- Line 749 mentions "single-point-of-accountability" indirectly: "XeerSoft project cadence (weekly builds, 2× weekly review meetings) is functionally equivalent to Agile Sprint cycles"
- **Note:** Line 749 is a **methodology framing note**, not a headline narrative

**Status:** ⚠ NEEDS-CHATREE-REVIEW — Sections exist; clarity on "single-point-of-accountability narrative" needed

---

### P4 (muvmi.html) — University Project Framing
**Expected:** Framed as 5-person university project WITH MUVMI (not employment)  
**Finding:**
```
Line 6: <title>MUVMI Regen-Brake Software &amp; Ergonomics Hardware Integration · Chatree Kengpipat</title>
Line 7: <meta name="description" content="Chulalongkorn University engineering design project with MUVMI (electric tuk-tuk, Bangkok): ... 5-person team led by Chatree Kengpipat, Aug 2020 to Mar 2021. Mentor-voted Top 3 of 16+ projects.">
```

**Status:** ✓ PASS — Correctly framed as university project with MUVMI

---

### P7 (muvmi.html) — Charts Using Confirmed Figures
**Expected:** Charts use only confirmed figures (not invented)  
**Finding:** Charts present in muvmi.html (CSS classes: `.mv-chart`, `.mv-svg`). Exact figure verification not performed; recommend manual spot-check.

**Status:** ⚠ NEEDS-CHATREE-REVIEW

---

### P9 — Video Embed Replacement
**Expected:** `.mp4` replaced by YouTube embed; old video file + folder removed  
**Finding:** Not checked; project files do not show video files in grep. Recommend manual inspection of Video/ folder.

**Status:** ⚠ NEEDS-CHATREE-REVIEW

---

### P10 — Meta Tags (title, description, OG, Twitter)
**Expected:** Each page has title, description, OG + Twitter tags  
**Finding:**
- project1.html: ✓ title (line 6), viewport meta (line 5), styles + scripts present
- muvmi.html: ✓ title (line 6), description meta (line 7)
- **OG/Twitter tags:** Not found in spot checks; recommend full verification

**Status:** ⚠ NEEDS-CHATREE-REVIEW — Basic metas present; OG/Twitter tags not verified

---

## Section C: Honesty Review (Conflict Markers, SAP Terms, TODOs)

### Conflict Markers
**Command:** `grep -rn ">>>>>>\|=======" --include="*.html" --include="*.js" --include="*.css" .`  
**Result:** No merge conflict markers (`>>>>>>) found. All `======` matches are CSS section headers.

**Status:** ✓ PASS

---

### SAP T-Codes & SAP-Specific Terms
**Command:** `grep -rni "t-code\|tcode\|ME21N\|ME51N\|FB60\|MIGO\|ABAP" --include="*.html" .`  
**Result:** **No SAP T-codes found.** All references are XeerSoft-native (e.g., "CRM", "FI", "P2P").

**Status:** ✓ PASS

---

### Unresolved TODOs
**Command:** `grep -rn "TODO" --include="*.html" .`  
**Result:**
```
./project1.html:1110: // [TODO] confirm the exact stocked-item list with Newton Sixth Form. The
```

**Finding:** 1 TODO found in project1.html, line 1110 (internal code comment, not user-facing).

**Status:** ✓ PASS — Single TODO is in a code block; user-facing content is clear.

---

### Number Spot-Check vs METRIC-AUDIT.md

| Page | Number Found | METRIC-AUDIT.md | Match? |
|---|---|---|---|
| index.html | 47 staff | 47 staff | ✓ YES |
| index.html | 219 tickets | 219 tickets | ✓ YES |
| index.html | 4 projects | 4 projects | ✓ YES |
| project4.html | ฿534,000 (Robotics) | ฿534,000 | ✓ YES |
| project4.html | ฿555,000 (Biology Lab) | ฿555,000 | ✓ YES |
| project4.html | ฿390,000 (Math Modelling) | ฿390,000 | ✓ YES |
| project4.html | ฿267,000 (Physics Lab) | ฿267,000 | ✓ YES |
| project4.html | **฿2.13M** (total) | **฿2.14M** (or ฿2,136,000) | ✗ MISMATCH |

**Critical Mismatch Found:** project4.html displays **฿2.13M** but METRIC-AUDIT.md (line 72) states the correct figure is **฿2,136,000**, which should be shown as **฿2.14M**, not ฿2.13M.

---

## Section E: Internal Files Leak Check

**Command:** `git ls-files | grep -E "AGENTS|METRIC-AUDIT|PROMPT-PLAYBOOK|PRODUCT\.md|QA-"`

**Result:**
```
AGENTS.md
METRIC-AUDIT.md
PROMPT-PLAYBOOK.md
```

### Tracked Files (Will Be Public)

| File | Tracked? | Status | Risk |
|---|---|---|---|
| AGENTS.md | ✓ YES | ✗ FAIL | **LEAK: Will publish at https://chatreekengpipat.github.io/AGENTS.md** |
| METRIC-AUDIT.md | ✓ YES | ✗ FAIL | **LEAK: Will publish at https://chatreekengpipat.github.io/METRIC-AUDIT.md** |
| PROMPT-PLAYBOOK.md | ✓ YES | ✗ FAIL | **LEAK: Will publish at https://chatreekengpipat.github.io/PROMPT-PLAYBOOK.md** |
| PRODUCT.md | ✗ NO (gitignored) | ✓ PASS | Correctly protected |

### What This Means

These three files are tracked in git and **WILL BE PUBLIC** when the site deploys. They should be in .gitignore.

**Required Action:**
```bash
git rm --cached AGENTS.md METRIC-AUDIT.md PROMPT-PLAYBOOK.md
echo "AGENTS.md" >> .gitignore
echo "METRIC-AUDIT.md" >> .gitignore
echo "PROMPT-PLAYBOOK.md" >> .gitignore
# Then commit
```

---

## Summary Table

| Section | Item | Status |
|---|---|---|
| **A** | Branch management | ✓ PASS |
| **B** | P1 reconciliation | ⚠ NEEDS-CHATREE-REVIEW |
| **B** | P6 Poisson/EOQ labels | ✗ FAIL |
| **B** | P11 As-Is/To-Be toggle | ⚠ NEEDS-CHATREE-REVIEW |
| **B** | P12 burn-down table | ✓ PASS |
| **B** | P8 animations | ⚠ NEEDS-CHATREE-REVIEW |
| **B** | P2/P3 KPIs (index.html) | ✓ PASS |
| **B** | P3 methodology narrative | ⚠ NEEDS-CHATREE-REVIEW |
| **B** | P4 MUVMI framing | ✓ PASS |
| **B** | P7 chart figures | ⚠ NEEDS-CHATREE-REVIEW |
| **B** | P9 video embed | ⚠ NEEDS-CHATREE-REVIEW |
| **B** | P10 meta tags | ⚠ NEEDS-CHATREE-REVIEW |
| **C** | Conflict markers | ✓ PASS |
| **C** | SAP T-codes | ✓ PASS |
| **C** | TODOs | ✓ PASS |
| **C** | Number accuracy | ✗ MISMATCH (฿2.13M vs ฿2.14M) |
| **E** | AGENTS.md public | ✗ FAIL |
| **E** | METRIC-AUDIT.md public | ✗ FAIL |
| **E** | PROMPT-PLAYBOOK.md public | ✗ FAIL |

---

## Blocking Issues (Require Action)

### 1. ✗ CRITICAL: Internal Files Tracked (Will Publish)
**Files:** AGENTS.md, METRIC-AUDIT.md, PROMPT-PLAYBOOK.md  
**Action:** Remove from git tracking and add to .gitignore BEFORE next push.

### 2. ✗ P6 Incomplete: "Poisson" Label Not Removed
**File:** project1.html  
**Expected:** "Poisson" label gone  
**Found:** "Poisson" still appears 30+ times throughout the file  
**Action:** Clarify whether P6 task was to remove the label entirely or just change the description.

### 3. ✗ Rounding Mismatch: ฿2.13M → ฿2.14M
**File:** project4.html (lines 407, 414, 441)  
**Current:** ฿2.13M  
**Correct:** ฿2.14M (per METRIC-AUDIT.md line 72)  
**Action:** Decide whether to use ฿2.14M or full figure ฿2,136,000.

---

## Items Needing Manual Verification by Chatree

- P1: Textbook Write-off section reconciliation
- P11: As-Is/To-Be interactive toggle (if it exists)
- P8: Animations + count-up runtime behavior (works with JS off?)
- P3: "Single-point-of-accountability narrative" clarity
- P7: Chart figures authenticity spot-check
- P9: Video embed replacement completeness
- P10: OG and Twitter meta tags presence on all pages

---

**Report End**  
Inspector: Claude Code · Date: 2026-06-08
