---
name: content-refresh
description: Refresh existing underperforming Get Drivers Ed pages — expand thin content, inject missing halo keywords, fix readability, add FAQ, improve keyword coverage. Use when the user says "refresh this URL" or a page already ranks but is slipping, has thin content, or missed target keywords. Output lives in pages/_in-progress/[slug]/.
---

# Skill: Content Refresh Only

Use this when the page already exists and just needs content depth/keyword coverage improvements — not a full rewrite.

## Before You Start

Read `references/sop-playbook.md` Section C (Content Refresh Framework), `references/keyword-formulas.md`, and `references/header-skeleton.md`.

## Inputs Required

- URL of the page to refresh
- (Optional) GSC query data for the page
- (Optional) Known issues (e.g., "it ranks #15 for X and we want page 1")

## Workflow

### Step 1: Fetch & Audit

Fetch the live page. Score it against the 10-point Pre-Refresh Scorecard (Section C.1):

| # | Check | Pass | Fail |
|---|---|---|---|
| 1 | Word count ≥ 1,200 | | |
| 2 | Primary KW in title | | |
| 3 | Primary KW in H1 | | |
| 4 | Primary KW in first 100 words | | |
| 5 | Primary KW density 1.2–1.8% | | |
| 6 | 5/5 secondary KWs present | | |
| 7 | FAQ section ≥ 5 Qs with schema | | |
| 8 | ≥ 2 internal links | | |
| 9 | 100% alt text filled | | |
| 10 | FAQ + Breadcrumb + Course schema | | |

Write scorecard to `pages/_in-progress/[slug]/audit.md`.

### Step 2: Identify the Gap

For every failed check, describe exactly what's missing and the fix.

### Step 3: Expand

Apply in priority order (from Section C.2):
1. Add "Shedding More Light on This Course" H2 (300–400 words)
2. Expand Overview to 8–10 benefit bullets
3. Expand Outcomes H4s — each gets 2–3 sentences
4. Expand FAQ to 7+ Qs
5. Add a comparison block (your course vs in-person / vs DMV-direct)
6. Add credential-specific detail (state cert IDs, eligibility ages, retake rules)

### Step 4: Inject Missing Halo Keywords

For each missing secondary KW, find a natural spot in the body. Never force. Never cluster three into one paragraph. Use `scripts/keyword-density.py` after to verify.

### Step 5: Fix Readability

Target Flesch 60–70. If failing:
1. Split paragraphs > 4 sentences
2. Split sentences > 25 words
3. Replace Latinate words with Anglo-Saxon (utilize→use, facilitate→help)
4. Convert passive to active
5. Add bullets where prose is dense
6. Add subheaders every 250–300 words

### Step 6: Cannibalization Check for Added KWs

Before any new KW goes in, run `site:getdriversed.com "[kw]"`. If another URL already ranks, either leave it alone and link from there, or consolidate.

### Step 7: Re-Score

Use the 100-point scoring rubric in `references/scoring-rubric.md`. Write:
- Score before refresh
- Score after refresh (projected)
- Delta explanation

### Step 8: Deliver

Output to `pages/_in-progress/[slug]/`:
- `audit.md` — the 10-point scorecard
- `refresh.md` — section-by-section marked [KEEP] / [REWRITE] / [NEW]
- `score.md` — before/after with gap-closing priorities

### Step 9: Summarize

Chat response:
- Score delta
- 3 most impactful changes
- What needs a dev to implement vs what's CMS-editable
