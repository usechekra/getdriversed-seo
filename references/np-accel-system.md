# The NP|accel SEO System (Reverse-Engineered from Neil Patel Deliverables)

This is the condensed system extracted from every Neil Patel deliverable for Get Drivers Ed. Read this at the start of any optimization session.

## Source Documents

- `neil-patel-docs/Get Drivers Ed.pdf` — master strategy deck (keyword methodology, competitor analysis, technical framework, onsite/offsite processes)
- `neil-patel-docs/Get Drivers Ed_Feb 2026 Onsite Recommendations.pdf` — per-page onsite template (NY Pre-Licensing)
- `neil-patel-docs/Get Drivers Ed_Web Copy Refresh_New York.pdf` — content refresh template with full body copy rewrite
- `neil-patel-docs/Get Drivers Ed_Web Copy Refresh_Ohio Drivers Ed Online Course.pdf` — second instance proving the pattern
- `neil-patel-docs/JAN 2026 SEO Monthly Performance Deck.pdf` — KPI tracking and keyword position wins
- Screenshots from SEMRush content restructuring + PA teen drivers ed cluster

## The Core System

### 1. Keyword Methodology (Three Buckets)

From `Get Drivers Ed.pdf`, Keyword Methodology slide:

| Bucket | Definition | How It's Picked |
|---|---|---|
| **FOCUS ON NOW — Striking Distance** | KWs ranking positions 11–30 where small moves push to page 1 | GSC / SEMRush for positions 11–30 with non-zero impressions |
| **NEAR FUTURE — Competitors Rank For** | KWs competitors rank for that you don't | SEMRush Keyword Gap report |
| **FAR FUTURE — Wishlist** | High-volume dream KWs earned via 12–18 months of topical authority | Volume-first, intent-matched, saved for link-building phase |

### 2. Per-Page Keyword Formula (1 + 5 + 6 + 4–5 = ~17 signals)

- **1 Primary** (Main Target Keyword) — exact match to page's service
- **5 Secondary** — word-order variants, state nickname swaps, agency acronym variants
- **6 LSI / Additional** — topical nouns/phrases (final exam, driver license, safe driving, traffic laws, schedule your road test)
- **4–5 PAA Questions** — from SERP People Also Ask, used as FAQ H3s

Each halo KW gets tagged:
- **Methodology:** Top Traffic Driving | Striking Distance | Competitor | Wishlist
- **Intent:** Informational | Commercial | Transactional | Commercial-Investigation

### 3. Title Tag Formula

```
[State] [Duration/Qualifier] [Course Type Keyword] | Get Drivers Ed
```

Examples (from docs):
- NY: `New York 5-Hour Online Pre-Licensing Course | Get Drivers Ed` (60 chars)
- OH: `Ohio Drivers Ed Online Course | Get Drivers Ed` (47 chars)

**Rules:**
- 50–60 characters
- State name always first (never abbreviated)
- Primary KW verbatim as lead phrase
- Pipe separator `|` to brand (never `–`, `-`, `—`, `/`, `:`)
- No dates, emojis, ALL CAPS, or superlatives
- Remove redundant modifiers (NY removed "DMV-Approved Class" because "Pre-Licensing" already implies approval)

### 4. Meta Description Formula

```
Get Drivers Ed offers [primary KW naturally phrased], designed for [benefit 1] 
and [benefit 2] to meet [authority anchor: DMV/BMV requirements]. [CTA].
```

Example (NY, 151 chars):
> Get Drivers Ed offers a New York 5-Hour online pre-licensing course, designed for convenient, self-paced learning to meet DMV requirements. Enroll now!

**Rules:**
- 140–155 characters
- Brand leads (establishes seller for commercial intent)
- Primary KW in first 12 words
- Two benefit phrases
- Authority anchor required
- End with 2–4 word CTA (`Enroll now!` / `Get started today!` / `Sign up today!`)
- No emojis, no ALL CAPS, one exclamation max (on the CTA)

### 5. Header Skeleton (6-H2 Template for State Course Pages)

```
H1: [Primary Keyword — exact match]

  (Above-fold trust strip — NOT H2s, plain <p>):
    "See What Our Students Are Saying!"
    "Bundle & Save: Enhance Your Learning Experience!"

  H3: Overview                     [8–10 benefit bullets]
  H3: Outcomes
      H4: Complete the [Course Name]
      H4: Practice with Your Learner's Permit
      H4: Schedule and Pass the Road Test
      H4: Submit Required Documentation
      H4: Pay the License Fees
      H4: Receive Your License
  H3: Eligibility

H2: Who Can Take the [Primary KW or Secondary KW variant]?
      [3-bullet eligibility list]

H2: Shedding More Light on This Course
      [3–4 paragraphs expanding with LSI terms]

H2: Recommended Courses to Enhance Your Learning
      [internal link grid, 3–6 course cards]

H2: Your Step-By-Step Guide to Getting Licensed
      H3: 1. Sign Up
      H3: 2. Get Your Learner's Permit
      H3: 3. Complete Practice Hours & Road Test Prep
      H3: 4. Earn Your [State] Driver's License

H2: Why Should You Opt for This Course?
      [2-paragraph trust-build block with DMV/BMV approval mention]

H2: Frequently Asked Questions
      H3: [5 Qs, each using primary or secondary KW, phrased as questions]
```

**Critical move from NP|accel:** Promo/UI strips ("See What Our Students Are Saying!", "Bundle & Save") were demoted from `<h2>` to `<p>` — headers are reserved for topical content sections, not banners.

### 6. Content Length Targets

| Page Type | Word Count | Paragraph Length | Flesch Target |
|---|---|---|---|
| State Course Page | 1,200–1,800 | 2–4 sentences | 60–70 |
| State License Info | 1,500–2,200 | 2–4 sentences | 60–70 |
| Commercial Blog | 1,200–1,800 | 2–4 sentences | 60–70 |
| Informational Blog | 1,800–2,500 | 2–4 sentences | 60–70 |
| FAQ answers | 40–80 each | 1–2 short paras | Plain English |

### 7. Keyword Placement Map

| Location | Primary KW | Halo KWs | LSI |
|---|---|---|---|
| Title | Exact | — | — |
| Meta description | Natural-prose | 1 secondary OK | — |
| URL slug | Kebab-case exact | — | — |
| H1 | Exact match | — | — |
| First 100 words | 1× | 0–1 | 1–2 |
| H2 #1 "Who Can Take…" | — | 1 secondary | — |
| H2 "Shedding Light…" | 1–2× | 2–3 secondary | 3–4 LSI |
| FAQ H3s | 1 Q | Spread | — |
| FAQ answers | 1× | 2–3 total | 2–3 LSI |
| Image alt texts | 1 image | 1–2 others | — |
| Schema `name`/`headline` | Exact | — | — |

**Density:** Primary 1.2–1.8%. Halos 1–2× each.

### 8. Internal Linking

- Minimum 2 outbound internal links per page
- 0 outbound external links on commercial pages
- Anchor text: partial-match or branded by default; exact-match sparingly (1× per target page)
- Never generic ("click here", "learn more")
- Hub-and-spoke topology: course pages → related state/course pages + parent hub + bundled upsells
- "Recommended Courses to Enhance Your Learning" H2 doubles as internal link grid

### 9. Schema Stack Per Page Type

| Page Type | Required JSON-LD |
|---|---|
| State Course Page | `BreadcrumbList` + `Course` + `FAQPage` + `AggregateRating` (if reviews) + `Offer` (if pricing) |
| Homepage | `Organization` + `WebSite` (with `SearchAction`) |
| Hub / Category | `BreadcrumbList` + `CollectionPage` |
| Blog | `BreadcrumbList` + `Article` + `FAQPage` (if FAQ present) |
| About | `BreadcrumbList` + `AboutPage` + `Organization` |

**Critical rule:** `Organization` lives on homepage ONLY. Remove from product/course pages if present (NP|accel explicitly recommended this removal on the NY page).

All schemas stacked in single `@graph` block, one `<script type="application/ld+json">` per page.

### 10. Image Alt Text Formula

```
[Descriptor: "Graphic of" / "Photo of" / "Illustration of"] [Subject] representing [Primary Keyword]
```

Example (NY):
> Graphic of person pointing to board representing New York 5-Hour Online Pre-Licensing Course

**Rules:** 10–16 words, end with primary KW, kebab-case file names, WebP preferred, lazy loading below fold.

### 11. Breadcrumb Structure

```
Home > Courses > [State Courses] > [Course Name]
```

Depth: 4 levels. Always accompanied by `BreadcrumbList` JSON-LD. Visible HTML must exactly match the schema.

### 12. URL Structure

Canonical pattern: `https://getdriversed.com/courses-details/[state-kebab]-[course-kebab]/en`

**⚠️ Current issue:** Two patterns coexist (`/courses-details/[state]-[course]/en` vs `/course/[course]/[state]`). Consolidate via 301 redirects to the `/courses-details/` pattern.

### 13. Technical SEO Priority Order

From NP|accel's audit findings:
1. Crawlability (2 blocked pages sitewide flagged)
2. Indexability
3. **Duplicate metas/titles — 84% duplication rate across 6,527 pages (5,455 dup metas, 5,460 dup titles).** #1 sitewide lever.
4. Low word count (137 pages flagged under ~500 words)
5. Schema (add where missing, remove Organization duplication)
6. Internal linking
7. Broken links / redirects (51 broken, 279 redirected)
8. Core Web Vitals

### 14. SEO Scoring System

NP|accel uses SEMRush Aggregate Score (0–10, shippable ≥ 8). We use a 100-point proxy:

| Component | Weight |
|---|---|
| On-page KW coverage | 25 |
| Title + Meta optimization | 10 |
| Header structure | 15 |
| Content depth | 15 |
| Internal linking | 10 |
| Schema stack | 10 |
| Image optimization | 5 |
| Technical foundation | 5 |
| Readability (Flesch 60–70) | 5 |
| **TOTAL** | **100** |

**Shippable threshold: ≥ 85.**

### 15. "LLMO" Principle (NP|accel's note)

> "Editing for LLMO means writing for humans first, but with a structure and clarity that makes it easy for AI models to extract and present your content."

This means:
- Short paragraphs (2–4 sentences)
- Direct answers first, explanation second (Featured Snippet + AI Overview optimization)
- Clear H2/H3 hierarchy
- FAQ answers in 40–60 word chunks
- Lists and tables where appropriate
- Bold the key phrase in a paragraph so AI scanners find it fast

### 16. Web Copy Checklist (Ship Gate)

From the NY and OH refresh docs, every page must pass before shipping:
- ☑ 2+ internal links
- ☑ 0 external links
- ☑ FAQ/HowTo schema (if FAQ present)
- ☑ SEMRush Writing Assistant run → aggregate score ≥ 8 (or our 100-point score ≥ 85)
