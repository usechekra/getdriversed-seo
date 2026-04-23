---
name: optimize-page
description: Full end-to-end SEO optimization for a Get Drivers Ed page. Use this skill whenever the user provides a URL, a keyword+page-type combo, or paste content that needs to be optimized. Produces keyword cluster, title/meta variants, header skeleton, rewritten body, FAQ, internal linking plan, image alt recommendations, technical audit, JSON-LD schema stack, HTML implementation block, and a 100-point SEO score with prioritized gap-closing actions. Always use this skill for page-level SEO work — do not improvise away from the NP|accel system captured in references/.
---

# Skill: Optimize a Single Page (End-to-End)

This is the primary workflow. 80% of the time the user gives you a URL, you execute this.

## Before You Start — Read These Files

**Mandatory reads** (use the Read tool):
1. `references/np-accel-system.md` — The extracted NP|accel system
2. `references/sop-playbook.md` — Full SOP
3. `references/header-skeleton.md` — 6-H2 template
4. `references/keyword-formulas.md` — Placement rules
5. `references/scoring-rubric.md` — 100-point rubric

**Conditional reads** (read if relevant to the task):
- `references/schema-reference.md` if generating schema
- `references/competitors.md` if running gap analysis

## Inputs You Need From the User

If the user gave you a URL:
- [ ] URL confirmed
- [ ] (Optional) GSC export pasted
- [ ] (Optional) Target primary keyword — otherwise infer from the page

If the user gave you a keyword + page type:
- [ ] Primary keyword
- [ ] Page type (state-course-page / license-info / blog-commercial / blog-informational / hub)
- [ ] State (if applicable)
- [ ] Intent (commercial / informational / transactional / mixed)

If any required input is missing, ask ONCE, concisely.

## Workflow — Execute in Order

### Step 1: Set Up the Workspace

Create a folder: `pages/_in-progress/[slug]/`

Where `[slug]` = URL path's last segment, or a kebab-case version of the primary keyword if no URL.

Inside that folder, you'll produce these files over the course of the workflow:

**Tier 2 (your reference — research + rationale):**
- `brief.md` — captured inputs + context
- `current-state.md` — what the live page looks like today (skip if new page)
- `competitor-gap.md` — gap analysis vs 2–3 competitors
- `keyword-cluster.md` — primary + halo + LSI + PAA
- `optimization.md` — detailed brief with all rationale (title/meta/headers/body/FAQ)
- `score.md` — current + projected + action list

**Tier 1 (dev hand-off — implementation-ready):**
- `dev-handoff.md` — ⭐ the ONE file devs get, CMS-field-labeled
- `schema.json` — JSON-LD to paste
- `implementation.html` — HTML reference (fallback)

### Step 2: Fetch the Live Page (skip if new page)

Use `WebFetch` on the URL. Extract into `current-state.md`:
- Current `<title>` and its length
- Current `<meta name="description">` and its length
- Current canonical
- Current meta robots
- Full H1 through H3 structure (as a nested list)
- Current schema types present (FAQPage, Organization, BreadcrumbList, Course, etc.)
- Current image count and how many have alt text filled
- Visible word count estimate
- Current internal links (count inbound references via search operators)
- Any obvious technical issues (broken links, missing canonical, duplicate content signals)

If `WebFetch` fails or returns stripped content, note it in `current-state.md` and ask the user to paste the page HTML.

### Step 3: Fetch 2–3 Competitor Pages

From `references/competitors.md`, pick the 2–3 most-relevant competitors for this state+course combo. Fetch their equivalent page and extract into `competitor-gap.md`:

For each competitor:
- Their H1
- Their H2s (as a list)
- Their FAQ questions (verbatim)
- Their word count estimate
- Unique content sections they have that you don't
- Specific credential IDs, agency names, or phrases they use that you don't

Then synthesize:
- **Content gaps:** what sections THEY have that you DON'T
- **Keyword gaps:** phrases and nouns they use you could adopt
- **Structural wins:** what they do well we should steal
- **Structural losses:** what they do poorly we can beat

### Step 4: SERP Analysis

Without paid tools, use the SERP itself as data:
- Search the primary KW in `WebSearch` or the user's browser
- Capture:
  - Top 10 ranking URLs
  - What page types dominate (product / blog / DMV site / hybrid)
  - Which SERP features appear (PAA, AI Overview, Featured Snippet, Shopping, Local Pack)
  - PAA questions (at least 4–5)
  - Featured Snippet content (if present) — what format wins it (list / paragraph / table)

Write this into `keyword-cluster.md` under a "SERP Intent" section.

### Step 5: Build the Keyword Cluster (1 + 5 + 6 + 4–5 = ~17 signals)

Per `references/keyword-formulas.md`:

**Primary keyword** — 1 keyword, exact match to the page's commercial intent. Flag volume/KD as `[ESTIMATE]` without paid tools.

**Secondary keywords (5)** — word-order variants, state nickname swaps, agency-acronym variants.

**LSI / Additional keywords (6)** — topical nouns/phrases (final exam, driver license, safe driving, traffic laws, schedule your road test, etc.).

**PAA questions (4–5)** — from the SERP's People Also Ask box.

For each keyword, tag:
- **Methodology:** Top Traffic Driving | Striking Distance | Competitor | Wishlist
- **Intent:** Informational | Commercial | Transactional | Commercial-Investigation
- **Volume:** `[ESTIMATE — validate]`
- **KD:** `[ESTIMATE — validate]`

Calculate the priority score using the formula in `references/sop-playbook.md` Section A.5.

### Step 6: Generate On-Page Deliverables

Write `optimization.md` with EVERY section below. Do NOT shorten or skip.

#### 6a. Title Tag — 3 variants
Follow the formula in `references/keyword-formulas.md`:
- **V1 — Primary-match:** `[State] [Duration] [Course Type] | Get Drivers Ed`
- **V2 — Benefit-led:** Different angle
- **V3 — Authority-led:** Authority modifier angle

Show character count for each. Under 60.

#### 6b. Meta Description — 3 variants
- **V1 — NP|accel pattern:** Brand-led, authority-anchored, CTA-closed
- **V2 — Benefit-led:**
- **V3 — Question-led:**

Show character count for each. 140–155.

#### 6c. URL Slug
Recommended slug. Flag whether a change is needed (and if so, plan the 301).

#### 6d. Full H1 / H2 / H3 / H4 skeleton
Use the 6-H2 template from `references/header-skeleton.md`. Deliver the exact text the user can paste.

#### 6e. Rewritten body content
For each section (Overview, Outcomes, Eligibility, Who Can Take, Shedding Light, Recommended Courses, Steps, Why, FAQ):
- Mark as `[KEEP]`, `[REWRITE]`, or `[NEW]`
- Write the actual prose
- Hit the word count target (1,200–1,800 for state course pages)

Per NP|accel: write for humans first, but with structure and clarity that makes AI models (Google AI Overviews, ChatGPT) cite you. Short paragraphs. Direct answers. Clear headers.

#### 6f. Keyword Placement Map
Table: each primary/halo/LSI KW → locations it appears (title, meta, H1, H2, body, alt, schema).

Verify density: primary 1.2–1.8%, halos 1–2× each.

#### 6g. Internal Linking Plan — minimum 5 links
Table: anchor text | destination URL | reason. Never generic anchors. Never external on commercial pages.

#### 6h. Image Recommendations
How many images, suggested alt text for each (follow formula), suggested file names (kebab-case with primary KW).

#### 6i. FAQ Section — 5–10 Qs
Each Q contains primary or secondary KW. Each A is 40–80 words, leads with direct answer, mirrors Q phrasing. Sourced from PAA + competitor FAQs + obvious objections.

### Step 7: Technical SEO Audit

Per `references/sop-playbook.md` Section D. Write into `optimization.md`:
- Canonical tag recommendation
- Meta robots recommendation
- Breadcrumb structure
- Internal link count check (inbound + outbound)
- Sitemap inclusion note
- CWV flag `[VALIDATE in PSI]`
- Mobile-first check `[VALIDATE]`
- URL namespace consistency (flag if duplicate pattern exists)

### Step 8: Schema Stack

Write ready-to-paste JSON-LD to `schema.json` as a single `@graph` block containing the schemas required for this page type (per `references/schema-reference.md`):

- State Course Page: `BreadcrumbList` + `Course` + `FAQPage` + `AggregateRating` (if reviews) + `Offer`
- Remove `Organization` if currently present on a non-homepage

Every schema must be valid (test in Google's Rich Results Test later). Use exact primary KW in `name`/`headline` fields.

### Step 9: HTML Implementation Block

Write `implementation.html` — a single file with:
- `<title>` tag
- `<meta name="description">`
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical">`
- Open Graph + Twitter Card tags
- Full H1–H3 skeleton with optimized text
- Example `<img>` tags with alts and filenames
- Example internal link `<a>` tags with anchor text
- Breadcrumb HTML + `BreadcrumbList` schema
- All JSON-LD blocks in `<script type="application/ld+json">` tags

Format it as a copy-pasteable block a developer can drop into the page.

### Step 9.5: ⭐ Dev Hand-off Document (KEY OUTPUT)

Write `dev-handoff.md` using `templates/dev-handoff.md` as the exact format.

**This is the single file your developers actually need.** It's CMS-field-labeled, broken down by implementation task (meta tags / URL / structure / body copy / images / internal linking / schema / breadcrumb / pre-deploy checklist / post-deploy validation).

The dev-handoff.md is DIFFERENT from optimization.md:
- `optimization.md` has the research rationale, keyword strategy reasoning, 3 variants of title/meta for comparison, competitor context, etc. — it's YOUR reference.
- `dev-handoff.md` has only the final implementation-ready deliverables — title (not 3 variants), final meta, final H1–H4 skeleton, final body copy marked by CMS field, final schema block, pre/post deploy checklists. It's what ships to the dev team.

Do NOT skip this step. Do NOT replace optimization.md with dev-handoff.md — produce BOTH.

### Step 10: Score + Tracker

Write `score.md`:
- **Current score: X/100** with per-component breakdown using `references/scoring-rubric.md`
- **Projected score after implementation: Y/100** with breakdown
- **Top 5 gap-closing actions** ranked by impact/effort, tagged 🔴 (do today) / 🟡 (this week) / 🟢 (this month)
- **Sitewide blockers affecting this page** — check `SITEWIDE-BACKLOG.md`. If any item there would affect this page's performance (duplicate metas, Organization schema cleanup, URL namespace, etc.), reference it by number (e.g., "Sitewide blocker: see SITEWIDE-BACKLOG.md item #3"). Do NOT re-audit or re-prescribe sitewide fixes per page.
- **Open validations** — list every `[ESTIMATE]` and `[VALIDATE]` flag so the user knows what to verify

### Step 10.5: ⭐ Automated QA — MANDATORY BEFORE DELIVERY

Run the full QA checklist on your own output before handing anything to the user. Write results to `qa-report.md`. Do NOT skip this step. Do NOT mark the optimization complete if any 🔴 item fails.

#### Technical QA (check every item)

| Check | Pass criteria | Result |
|-------|--------------|--------|
| Title tag length | ≤ 60 characters | PASS / FAIL |
| Title contains primary KW | Exact or close variant present | PASS / FAIL |
| Title unique | No other GDE page uses same title (check tracker/master-log.csv) | PASS / FAIL |
| Meta description length | 140–155 characters | PASS / FAIL |
| Meta contains CTA | "Enroll", "Start", "Get", etc. | PASS / FAIL |
| Meta unique | Not a duplicate of another page | PASS / FAIL |
| H1 count | Exactly one H1 | PASS / FAIL |
| H1 contains primary KW | Exact or close variant | PASS / FAIL |
| H2 count | 5–7 H2s present (6-H2 skeleton) | PASS / FAIL |
| Word count | 1,200–1,800 words for state course pages | PASS / FAIL |
| Keyword density | Primary KW at 1.2–1.8% (run keyword-density.py) | PASS / FAIL [value] |
| Internal links | ≥ 5 links, no generic anchors ("click here", "learn more") | PASS / FAIL |
| No external links | Zero external links on commercial pages | PASS / FAIL |
| FAQ count | ≥ 5 questions | PASS / FAIL |
| FAQ KW presence | Each question contains primary or secondary KW | PASS / FAIL |
| FAQ answer length | Each answer 40–80 words | PASS / FAIL |
| Schema type | Correct stack for page type (Course + FAQPage + BreadcrumbList + Offer) | PASS / FAIL |
| No Organization schema | Not present on non-homepage | PASS / FAIL |
| Schema valid JSON | JSON parses without error | PASS / FAIL |
| Canonical correct | Points to the canonical URL of this page | PASS / FAIL |
| No placeholder data | No "INSERT PRICE", "YOUR LICENSE #", "TBD" left unfilled — flag if must stay | PASS / FLAG |
| Cannibalization clear | No other GDE page already targets this primary KW | PASS / RISK |
| All ESTIMATEs listed | Every [ESTIMATE] and [VALIDATE] flag inventoried in score.md | PASS / FAIL |

#### Content QA (check every item)

| Check | Pass criteria | Result |
|-------|--------------|--------|
| Search intent match | Body copy answers what the user searching this KW actually wants | PASS / FAIL |
| Competitor gaps addressed | Each gap from competitor-gap.md is covered in a section or FAQ | PASS / PARTIAL / FAIL |
| PAA questions answered | Each PAA question from SERP is answered in FAQ or body | PASS / PARTIAL / FAIL |
| No fabricated data | No invented DMV license numbers, prices, phone numbers, statistics | PASS / FAIL |
| NP\|accel patterns applied | Intro paragraph leads with primary KW + authority signal | PASS / FAIL |
| CTA present | At least one clear call-to-action in the body | PASS / FAIL |
| Reading level | Plain language, short paragraphs (≤4 lines), no jargon without explanation | PASS / FAIL |

#### QA Output format for `qa-report.md`

```
# QA Report — [Primary Keyword]
Date: [today]
Performed by: Claude (automated pre-delivery QA)

## Result: PASS / PASS WITH FLAGS / FAIL

### 🔴 Failures (must fix before delivery)
- [list any FAIL items]

### 🟡 Flags (flagged for user review, not blocking)
- [list any FLAG/PARTIAL/RISK items + why]

### ✅ Passed
- [count] of [total] checks passed

### Open Validations Required by User
- [list every [ESTIMATE] and [VALIDATE] flag with what tool to use]
```

**If any 🔴 item FAILS:** fix it, re-run the check, update qa-report.md before proceeding.
**If only 🟡 flags exist:** proceed to delivery but call them out explicitly in the chat summary.
**Overall PASS or PASS WITH FLAGS:** proceed to Step 11.

### Step 11: Update the Master Tracker

Append a row to `tracker/master-log.csv`:
```
URL,primary_kw,page_type,date_optimized,score_before,score_after,status,notes
https://getdriversed.com/...,<primary>,state-course-page,2026-04-18,52,92,in-progress,
```

### Step 11.5: ⭐ Generate PDFs — MANDATORY, ALWAYS

Run the PDF generator immediately after updating the tracker. This is not optional.

```bash
python3 scripts/generate-pdf.py --slug [slug]
```

Where `[slug]` matches the folder name under `pages/_in-progress/` or `pages/_completed/`.

This produces two PDFs in the page folder automatically:
- `[slug]-SEO-REFERENCE.pdf` — score + keywords + competitor gap + optimization brief (your copy)
- `[slug]-DEV-HANDOFF.pdf` — dev-handoff.md + schema.json formatted for print/sharing (send to devs)

**Rules:**
- Run this EVERY time, for EVERY optimization — do not skip, do not wait for the user to ask
- If the script errors, diagnose and fix before proceeding (check reportlab is installed: `pip3 install reportlab`)
- Both PDFs must exist in the folder before delivering the Step 12 summary
- If stage is `_completed`, pass `--stage _completed` to the script

### Step 11.75: ⭐ Publish to Portal — MANDATORY, ALWAYS

After generating PDFs, publish the page to the Railway portal so it appears in "My Work" automatically. This is not optional — every optimization must be live in the portal after delivery. Also run this step in full whenever ANY change is made to an existing page (e.g. price updated, CTA fixed, content revised).

**Sub-step A: Determine stage and create/update `meta.json`**

- New optimization → stage is `_in-progress`, status is `"IN_PROGRESS"`
- When the user says "mark as completed" or "it's done" or "move to completed" → stage is `_completed`, status is `"COMPLETED"`, and move the folder: `mv pages/_in-progress/[slug] pages/_completed/[slug]`
- Any update to an existing page → keep current stage and status, but always update `lastUpdated` to today's date

Write `pages/[stage]/[slug]/meta.json`:

```json
{
  "url": "https://getdriversed.com/courses-details/[slug-or-path]",
  "slug": "[slug]",
  "primaryKeyword": "[primary keyword from keyword-cluster.md]",
  "secondaryKeywords": "[comma-separated list from keyword-cluster.md]",
  "pageType": "state-course-page",
  "state": "[State name or null]",
  "status": "IN_PROGRESS | COMPLETED | QUEUED",
  "scoreBefore": [number from score.md],
  "scoreProjected": [number from score.md],
  "wordCountBefore": [number from current-state.md],
  "dateOptimized": "[YYYY-MM-DD]",
  "lastUpdated": "[YYYY-MM-DD today — always set to today on every change]",
  "folderPath": "pages/[stage]/[slug]",
  "notes": "[one-line summary of what was done or changed]"
}
```

**Sub-step B: Sync ALL files to `portal/seo-pages/`**

If status changed from IN_PROGRESS → COMPLETED, first remove the old in-progress folder from portal:
```bash
rm -rf portal/seo-pages/_in-progress/[slug]
```

Then copy the full folder (including PDFs, all .md files, schema.json, implementation.html, meta.json):
```bash
mkdir -p portal/seo-pages/[stage]/[slug]
cp -r pages/[stage]/[slug]/. portal/seo-pages/[stage]/[slug]/
```

Every file must be in `portal/seo-pages/` — the portal's Files tab, Reports tab, and SEO Reference all read from here. Missing files = empty tabs in the portal.

**Sub-step C: Deploy to Railway**

```bash
cd portal && railway up --detach && cd ..
```

On startup, `autoSeedPages()` in `instrumentation.node.ts` reads `meta.json` and upserts the page into the database with the current status, lastUpdated, and all fields. The portal's "My Work" list and page detail will reflect the changes automatically.

**Rules:**
- Run this EVERY time, for EVERY optimization AND every update — do not skip
- Run in full even for small changes (price fix, copy tweak, status change) — the portal only reflects what's deployed
- If `railway` CLI is not found, tell the user to run `railway up --detach` from the `portal/` directory manually
- Confirm deploy command succeeded (exit 0) before proceeding to Step 11.9

### Step 11.9: ⭐ Commit and Push to GitHub — MANDATORY, ALWAYS

After deploying to Railway, commit everything to GitHub so the work is permanently backed up.

```bash
cd "/Users/elyas/Desktop/SEO Specialist/getdriversed-seo"
git add .
git commit -m "Optimize [slug] — [primary keyword] (score: [before] → [projected])"
git push origin main
```

Replace `[slug]`, `[primary keyword]`, `[before]`, `[projected]` with the actual values from this optimization.

**Rules:**
- Run this EVERY time, for EVERY optimization — do not skip
- If push fails, diagnose (check `git status`, `git remote -v`) and fix before proceeding
- This is the permanent backup — without this step, work exists only locally

### Step 12: Summarize for the User

In the chat response, give the user:
1. **QA result first** — PASS / PASS WITH FLAGS / and any 🟡 flags they need to know about
2. A one-paragraph executive summary of what changed and why
3. Score delta (current → projected)
4. Top 3 🔴 Critical actions
5. Pointer to the folder with the ⭐ `dev-handoff.md` and both PDFs called out:
   ```
   📁 Deliverables: pages/_in-progress/[slug]/
      ├── [slug]-DEV-HANDOFF.pdf  ⭐ SEND TO DEVS (PDF)
      ├── [slug]-SEO-REFERENCE.pdf   (your reference PDF)
      ├── dev-handoff.md          (dev handoff source)
      ├── schema.json             (JSON-LD to paste)
      ├── implementation.html     (HTML reference)
      ├── optimization.md         (your detailed reference)
      ├── score.md                (your tracking)
      └── ...research files...
   ```
5. Note any sitewide blockers by referencing `SITEWIDE-BACKLOG.md` item numbers
6. Ask if they want to move it to `_completed/` after implementation

## Critical Rules Specific to This Skill

- **Never shorten outputs to save tokens.** The user is paying for depth.
- **Never skip sections.** Every file listed above gets written.
- **Every claim needs a source:** either an NP|accel doc (cite by filename) or flagged as `[ESTIMATE]` / `[VALIDATE]`.
- **Run the `scripts/keyword-density.py` script** (if it exists) after writing the body to verify KW density. Create the script if it doesn't exist yet.
- **Cannibalization check is mandatory.** Before recommending any new keyword, confirm another URL on getdriversed.com doesn't already rank for it.
- **If the user only wants part of the output** (e.g., "just give me the title and meta"), offer that but note what you're skipping and why the full delivery is better.
