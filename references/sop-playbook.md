# SOP Playbook — The Get Drivers Ed SEO System

This is the operational playbook. Every skill references it. Read it top to bottom once; skim the relevant section during execution.

## Section A — Keyword Research Process

### A.1 Identify Primary Keyword

The test: describes the page in one phrase, matches user intent, reachable given DA 20.

**Steps:**
1. Compress the page's commercial purpose into one sentence. Extract the KW from it.
2. Check URL slug. Slug should telegraph primary KW.
3. SERP sanity check (Incognito):
   - Top 10 page type match ours? (service/product vs blog)
   - SERP features present? (PAA, AI Overview, Featured Snippet)
4. Cannibalization check: `site:getdriversed.com [candidate KW]`
5. Volume/KD thresholds:
   - Primary KD ≤ 30 for near-term [ESTIMATE]
   - Volume floor 10/month (state+course long-tails convert 3–8%)

**Checklist:**
- [ ] Matches page's commercial intent
- [ ] Matches SERP intent
- [ ] No cannibalization
- [ ] KD ≤ 30 OR cluster plan exists
- [ ] Volume ≥ 10
- [ ] Fits in 60-char title alongside brand

### A.2 Halo Cluster (5 secondary + 6 LSI + 4–5 PAA)

**Secondary (5) — "word-order siblings":**
- Rearrange word order
- State nickname/city swap (NY → NYC, ny; California → CA, socal, bay area)
- Agency acronym injection (DMV / BMV / DOL / MVD)
- Qualifier drop
- Class/course/program swap

Each must (a) be a real query (Google autosuggest test), (b) same commercial intent as primary.

**LSI (6) — topical signals:**
Drivers-ed standard pool: `final exam`, `driver license`, `safe driving`, `traffic laws`, `defensive driving`, `road test`, `schedule your road test`, `learner's permit`, `permit test`, `practice hours`, `DMV/BMV requirements`, `state-approved`, `certificate of completion`, state-specific credential IDs (MV-278, TIPIC, DE-964).

**PAA (4–5) — objection handlers:**
Pull from the SERP PAA box. Keep only commercial-adjacent or objection-handling Qs. Reject pure-info/news.

### A.3 Competitor Keyword Extraction (manual, no paid tools)

For each of the 6 tracked competitors, fetch their equivalent page. Extract:
- Their H1
- Their H2s
- Their FAQ Qs
- Unique phrases, credential IDs, agency acronyms

Tag each gap KW with `Competitor` methodology.

### A.4 Validate Search Intent

NP|accel's intent-vs-intent check:
- Page's Intent Per Google (from SEMRush KW Magic, or inferred from SERP top 10)
- Page's Intended Intent (your call)
- Restructure Needed? YES if they disagree

### A.5 Priority Score Formula

```
Priority = (Volume × 0.3) + (Intent × 0.3) + (DifficultyInverse × 0.2) + (BusinessValue × 0.2)

Where:
- Volume: raw volume capped at 1000/mo → normalized 0–100
- Intent: Transactional=100, Commercial=80, Commercial-Investigation=60, Informational=30
- DifficultyInverse: 100 - KD
- BusinessValue: Course pages=100, supporting pages=60, blog=40
```

Thresholds:
- 70+ → 🔴 This week
- 50–69 → 🟡 This month
- 30–49 → 🟢 This quarter
- <30 → Park

## Section B — On-Page SEO Optimization

See `references/keyword-formulas.md` for title, meta, URL, and keyword placement details.
See `references/header-skeleton.md` for H1/H2/H3/H4 templates.

### B.5 Content Length by Page Type

| Page Type | Words | Rationale |
|---|---|---|
| State Course Page | 1,200–1,800 | Matches NY/OH refreshes |
| State License Info | 1,500–2,200 | More info depth needed |
| Commercial Blog | 1,200–1,800 | SERP leader match |
| Informational Blog | 1,800–2,500 | Depth wins info SERPs |
| FAQ Hub | 800–1,200 | Value is in structured data |
| State Hub / Category | 600–900 | Intro + directory |

Minimum-viable sections: H1, intro para, benefits (8 bullets), 4-step process, FAQ (5 Qs), internal link module, CTA.

Paragraph length: 2–4 sentences. Longer → break.

### B.7 FAQ Section Rules

- 5–10 Qs (sweet spot 7)
- Sources: PAA (4–5) + competitor FAQs (2–3) + support team themes (1–2)
- Each Q contains primary or secondary KW
- Answers 40–80 words
- Lead with direct answer ("Yes," / "No," / "The course takes 5 hours")
- Mirror Q phrasing in A
- Max 1 internal link per answer
- ALL FAQ wrapped in FAQPage JSON-LD

## Section C — Content Refresh Framework

### C.1 Pre-Refresh Scorecard (10 checks)

| # | Check | Threshold | Fail Response |
|---|---|---|---|
| 1 | Word count | ≥ 1,200 | Expand |
| 2 | Primary KW in title | ✅ | Rewrite title |
| 3 | Primary KW in H1 | ✅ | Fix H1 |
| 4 | Primary KW in first 100 words | ✅ | Rewrite intro |
| 5 | Primary KW density | 1.2–1.8% | Add occurrences |
| 6 | Secondary KW coverage | 5/5 | Inject missing |
| 7 | FAQ section | ≥ 5 Qs with schema | Add FAQ |
| 8 | Internal links | ≥ 2 | Add links |
| 9 | Image alts | 100% filled | Fill |
| 10 | Schema present | FAQ + Breadcrumb + Course | Add missing |

Freshness: If `last-modified` > 12 mo AND rankings slipped, update dates + content.

### C.2 Expansion Priority Order

1. Add "Shedding More Light" H2 (300–400 words)
2. Expand Overview to 8–10 bullets
3. Expand Outcomes H4s (2–3 sentences each)
4. Expand FAQ to 7+ Qs
5. Add comparison block (your course vs in-person / vs DMV-direct)
6. Add credential-specific detail (IDs, ages, retake rules)

Don't: pad with fluff, repeat paragraphs, add cross-topic content.

### C.3 Cannibalization Gate (before adding any new KW)

Run `site:getdriversed.com "[new kw]"`. If another URL ranks:
- Leave it alone and link from there, OR
- Consolidate via 301

### C.4 Readability Fixes

Target Flesch 60–70. Apply in order:
1. Break paragraphs > 4 sentences
2. Break sentences > 25 words
3. Replace Latinate with Anglo-Saxon
4. Passive → active voice
5. Add bullets where dense
6. Subheaders every 250–300 words

### C.5 Re-Score

Use 100-point rubric (Section E below). Ship at ≥ 85.

## Section D — Technical SEO Checklist

### D.1 Crawlability & Indexing
- [ ] robots.txt allows URL
- [ ] meta robots = `index, follow`
- [ ] In XML sitemap
- [ ] Canonical → self, absolute HTTPS
- [ ] Status 200
- [ ] No `X-Robots-Tag: noindex` header

### D.2 Internal Linking
- [ ] ≥ 2 outbound internal
- [ ] 0 outbound external (commercial pages)
- [ ] ≥ 2 inbound internal from other pages
- [ ] Descriptive anchors only

### D.3 URL Structure
- [ ] Uses `/courses-details/[state]-[course]/en`
- [ ] No duplicate-pattern live
- [ ] Kebab-case
- [ ] < 60 chars slug portion

### D.4 Breadcrumbs
- [ ] Present and visible
- [ ] Home > Courses > [State Courses] > [Course Name]
- [ ] `BreadcrumbList` JSON-LD matches

### D.5 Schema
- [ ] Required schemas for page type present
- [ ] `Organization` NOT on non-homepage
- [ ] `name`/`headline` = exact primary KW
- [ ] Single `@graph` block

### D.6 Images
- [ ] 100% alts filled (non-decorative)
- [ ] Formula: `[Descriptor] [Subject] representing [Primary KW]`
- [ ] 10–16 words
- [ ] Above-fold has primary KW
- [ ] WebP preferred
- [ ] `loading="lazy"` below fold
- [ ] width + height set (CLS)

### D.7 Core Web Vitals 🔍
- LCP < 2.5s `[VALIDATE]`
- INP < 200ms `[VALIDATE]`
- CLS < 0.1 `[VALIDATE]`

### D.8 Mobile-First
- [ ] Viewport meta tag
- [ ] All content visible on mobile
- [ ] Tap targets ≥ 48×48
- [ ] Font ≥ 16px body

### D.9 Hreflang (if multi-lang)
- [ ] Tags present for all variants
- [ ] Self-reference + x-default
- [ ] Complete pairing

## Section E — SEO Score Calculation

| Component | Max | Measurement |
|---|---|---|
| On-page KW coverage | 25 | 13 placement slots × 25/13 |
| Title + Meta optimization | 10 | 5 each for hitting targets |
| Header structure | 15 | 5 H1 + 5 H2 + 5 FAQ |
| Content depth | 15 | (wc / target) × 15 capped |
| Internal linking | 10 | 5 outbound + 5 inbound |
| Schema stack | 10 | 2.5 per required schema |
| Image optimization | 5 | % alts × 5 |
| Technical foundation | 5 | canonical + robots + sitemap + breadcrumb + HTTPS |
| Readability | 5 | 5 if Flesch 60–70 |
| **TOTAL** | **100** | |

Shippable: ≥ 85.

Output format:
- Current: X/100 (breakdown)
- Projected: Y/100 (breakdown)
- Top 5 gap-closing actions 🔴🟡🟢
