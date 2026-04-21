---
name: tech-audit
description: Run the technical SEO checklist on a Get Drivers Ed page — crawlability, indexability, canonical, robots, breadcrumbs, schema, image optimization, CWV flags, mobile-first, hreflang. Use when the user wants a tech audit only (no content work), or before shipping to catch technical blockers. Output lives in pages/_in-progress/[slug]/tech-audit.md.
---

# Skill: Technical SEO Audit Only

Use this when the user wants just the tech side — no keyword research, no content rewrite.

## Before You Start

Read `references/sop-playbook.md` Section D (Technical SEO Checklist).

## Inputs Required

- URL to audit

## Workflow

### Step 1: Fetch the Page

Use `WebFetch` and inspect:
- Response status code
- `<title>` tag
- `<meta name="description">`
- `<meta name="robots">`
- `<link rel="canonical">`
- Open Graph / Twitter tags
- All `<script type="application/ld+json">` blocks
- `<img>` tags (count, % with alt)
- Breadcrumb HTML
- Visible internal links (count and quality of anchors)
- Mobile viewport meta
- Hreflang tags (if multi-lang)

### Step 2: Run `scripts/extract-meta.py`

If the script exists. If not, extract manually.

### Step 3: Check Each Section of the Checklist

Per Section D of the SOP, tick off each item with ✅ pass / ❌ fail / ⚠️ warning / 🔍 needs validation:

**D.1 Crawlability & Indexing**
- robots.txt allows the URL (check `/robots.txt`)
- `index, follow` on meta robots
- In XML sitemap (check `/sitemap.xml`)
- Canonical → self, absolute HTTPS URL
- Status 200
- No `X-Robots-Tag: noindex` header

**D.2 Internal Linking**
- ≥ 2 outbound internal links
- 0 outbound external links (commercial pages)
- Descriptive anchors (no "click here")

**D.3 URL Structure**
- Uses `/courses-details/[state]-[course]/en` namespace
- No duplicate-pattern variants live (⚠️ check for `/course/[course]/[state]` duplicates)
- Kebab-case, under 60 chars

**D.4 Breadcrumbs**
- Present and visible
- Format: Home > Courses > [State Courses] > [Course Name]
- `BreadcrumbList` JSON-LD matches visible breadcrumbs

**D.5 Schema Stack**
- Required schemas for this page type present
- All valid (note: real validation happens in Google's Rich Results Test)
- `name`/`headline` contains exact primary KW
- `Organization` NOT present if this is not the homepage

**D.6 Image Optimization**
- 100% of content images have non-empty alts
- Alt formula: `[Descriptor] [Subject] representing [Primary KW]`
- Above-fold image has primary KW in alt
- WebP format preferred
- `loading="lazy"` below fold

**D.7 Core Web Vitals** 🔍
- LCP < 2.5s — `[VALIDATE in PSI]`
- INP < 200ms — `[VALIDATE]`
- CLS < 0.1 — `[VALIDATE]`

**D.8 Mobile-First** 🔍
- Viewport meta tag present
- All content visible on mobile — `[VALIDATE in Mobile-Friendly Test]`
- Tap targets ≥ 48x48
- Font ≥ 16px body

**D.9 Hreflang** (if `/en` suffix present)
- Hreflang tags present for all language variants
- Self-reference + x-default
- Complete pairing

### Step 4: Severity Triage

Tag every issue:
- 🔴 **Critical** — fix today (blocks indexing, breaks UX, duplicate-content risk)
- 🟡 **Important** — fix this week (schema missing, thin linking, missing alts)
- 🟢 **Nice-to-have** — fix this month (minor alt text improvements, CWV tuning)

### Step 5: Write the Deliverable

Create `pages/_in-progress/[slug]/tech-audit.md`:
1. Summary paragraph (pass/fail count, top 3 issues)
2. Full checklist with ✅/❌/⚠️/🔍 for each item
3. Severity-tagged action list
4. Implementation notes (what's a dev fix vs CMS edit)

### Step 6: Summarize

Chat response:
- Pass count: X/40
- Top 3 🔴 Critical issues
- Estimated effort (dev-hours)
