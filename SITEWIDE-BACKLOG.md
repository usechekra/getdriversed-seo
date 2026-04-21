# Sitewide SEO Backlog (ONE-TIME Dev Handoff)

**Owner:** [assign dev lead]
**Goal:** Fix the ~10 sitewide technical SEO issues that cap per-page ROI. Complete before (or in parallel with) per-page optimization work.
**Why this exists:** Per-page optimizations work 3–4× better once the sitewide foundation is clean. Doing per-page work while duplicate metas and broken URL namespaces exist is like polishing individual bricks while the foundation sinks.

**Sprint estimate:** 2–3 sprints (3–5 weeks) depending on team capacity.

---

## 🔴 Sprint 1 — Critical foundation (blocks everything else)

### 1. Fix duplicate title tags across 5,460 pages (84% of site)

**Problem:** 5,460 pages share the same or near-identical `<title>` tags. Google can't tell pages apart.

**Source:** Jan 2026 NP|accel Technical SEO Audit — `neil-patel-docs/JAN 2026 SEO Monthly Performance Deck.pdf`.

**Fix:** Template-level change. For all state+course pages, apply the formula:

```
{{state_name}} {{duration_modifier}} {{course_type}} | Get Drivers Ed
```

Examples:
- `New York 5-Hour Online Pre-Licensing Course | Get Drivers Ed`
- `Ohio Drivers Ed Online Course | Get Drivers Ed`
- `Texas Teen Drivers Ed Online Course | Get Drivers Ed`

**Rules the template must enforce:**
- Character count 50–60 (truncate duration modifier if over)
- Full state name, never abbreviation
- Pipe separator `|` to brand (never `-`, `–`, `—`, `/`)
- No dates, no emojis, no ALL CAPS

**Implementation:**
1. Update the CMS title template logic for `/courses-details/*` URL pattern
2. Backfill: regenerate all existing page titles using the formula
3. Validate: crawl with Screaming Frog post-deploy — expect 0 duplicate titles

**Deliverable to devs:** this spec + a CSV of all 5,460 affected URLs with current title → generated title for QA review before deploy.

**Effort:** M (2–3 dev days + 1 day QA)
**Priority:** 🔴 CRITICAL

---

### 2. Fix duplicate meta descriptions across 5,455 pages (84% of site)

**Problem:** Same as #1 but for meta descriptions.

**Fix:** Template formula:

```
Get Drivers Ed offers {{primary_kw_natural}}, designed for {{benefit_1}} and {{benefit_2}} to meet {{state_agency}} requirements. {{cta}}.
```

Example:
> Get Drivers Ed offers a New York 5-Hour online pre-licensing course, designed for convenient, self-paced learning to meet DMV requirements. Enroll now!

**Rules:**
- 140–155 characters (truncate benefits if over)
- Brand leads
- Primary keyword in first 12 words
- Agency matched to state (DMV / BMV / DOL / MVD / DPS — see `references/header-skeleton.md` agency table)
- 2–4 word CTA at end

**Implementation:** Same as #1 but for meta descriptions.

**Deliverable to devs:** this spec + CSV of all 5,455 affected URLs with current meta → generated meta for QA.

**Effort:** M (shared effort with #1)
**Priority:** 🔴 CRITICAL

---

### 3. Consolidate URL namespace (`/course/` → `/courses-details/`)

**Problem:** Two URL patterns exist for the same content:
- `/courses-details/[state-kebab]-[course-kebab]/en` ← keep (canonical)
- `/course/[course]/[state]` ← deprecate

This splits link equity and causes keyword cannibalization.

**Source:** `Get Drivers Ed_Feb 2026 Onsite Recommendations.pdf` + NP|accel keyword research showing PA keyword ranks at both patterns.

**Fix:**
1. Audit all live `/course/*` URLs — produce a mapping spreadsheet
2. 301 redirect each legacy URL → `/courses-details/` equivalent
3. Update internal links pointing to `/course/*` URLs
4. Update sitemap.xml to only include `/courses-details/*`
5. Monitor GSC Coverage report for 30 days post-deploy — flag any indexing regressions

**Deliverable to devs:** the URL audit spreadsheet (`redirect-map.csv`) with old URL → new URL + redirect type (301) + priority.

**Effort:** M (1 day audit + 1 day redirect config + 1 day QA)
**Priority:** 🔴 CRITICAL

---

### 4. Remove Organization schema from non-homepage pages

**Problem:** `Organization` schema appears on product/course pages. It belongs only on `/` and `/about`. Duplicating it dilutes the entity graph.

**Source:** `Get Drivers Ed_Feb 2026 Onsite Recommendations.pdf` — NP|accel explicitly recommended removal on the NY Pre-Licensing page.

**Fix:**
1. Audit all pages carrying `Organization` schema (likely template-injected)
2. Update template logic: `Organization` schema only renders if `page_type == "homepage" OR page_type == "about"`
3. All other pages: remove Organization, keep page-appropriate schemas (Course, Article, CollectionPage, etc.)

**Effort:** S (0.5 day template change + 0.5 day validation)
**Priority:** 🔴 CRITICAL

---

## 🟡 Sprint 2 — Important template rollouts

### 5. Add Breadcrumb schema sitewide

**Problem:** NP|accel flagged breadcrumb schema as missing on the NY page. Likely missing on many pages.

**Fix:** Update page template to output:

```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="/">Home</a></li>
    <li><a href="/courses/">Courses</a></li>
    <li><a href="/{{state-slug}}/">{{State}} Courses</a></li>
    <li aria-current="page">{{Course Name}}</li>
  </ol>
</nav>
```

Plus matching `BreadcrumbList` JSON-LD in `<head>`. The visible HTML must match the JSON-LD exactly.

**Deliverable to devs:** `templates/html/implementation-block.html` has the exact HTML + matching schema in `templates/schema/state-course-page.json`.

**Effort:** S (1 day template + 0.5 day QA)
**Priority:** 🟡 IMPORTANT

---

### 6. Add Course + Offer + AggregateRating schema to state course pages

**Problem:** Current course pages have only `FAQPage`. Missing the rich-result heavy hitters: `Course`, `Offer`, and `AggregateRating`.

**Why it matters:** Course schema unlocks rich results in education vertical SERPs. AggregateRating + Offer can add star ratings + pricing to your snippets, boosting CTR.

**Fix:** Update state-course-page template to render the full stack from `templates/schema/state-course-page.json`.

**Rules:**
- `Course.name` = exact primary keyword
- `Course.provider` references Organization via `@id` (not embedded)
- `Offer.price` and `Offer.priceCurrency` required
- `AggregateRating` ONLY if real reviews exist — never fake ratings
- All wrapped in single `@graph` block

**Deliverable to devs:** `templates/schema/state-course-page.json` as the spec.

**Effort:** M (1 day template + 1 day for data mapping — prices, ratings from CMS fields)
**Priority:** 🟡 IMPORTANT

---

### 7. Batch-fix missing image alt text

**Problem:** NP|accel flagged the NY hero image as having N/A alt text. Likely many more images sitewide.

**Fix:** Two-phase approach:

**Phase A — audit:**
```bash
# Crawl site, find all images with empty or missing alt
# Produce CSV: image_url, page_url, current_alt, page_primary_kw
```

**Phase B — generate:**
For each image, generate alt using the formula:
```
[Descriptor] [Subject] representing [Page's Primary KW]
```

Where Descriptor = "Graphic of" / "Photo of" / "Illustration of".

**Implementation options:**
- Bulk CMS update if alts are a field in the database
- Write a one-off script that backfills based on the formula
- Hand to content team for manual review of any edge cases

**Deliverable to devs:** the CSV from Phase A + the formula spec for Phase B.

**Effort:** M (1 day crawl + 2–3 days generation and QA)
**Priority:** 🟡 IMPORTANT

---

### 8. Fix 51 broken links

**Problem:** 51 pages have broken links per NP|accel audit.

**Fix:**
1. Export the broken link list from Screaming Frog or re-crawl
2. For each link:
   - If target page still exists under a new URL → update the link
   - If target page is gone → remove the link (don't leave a dead anchor)
   - If internal → 301 the dead target to a related page, then update the link

**Deliverable to devs:** `broken-links-list.csv` with source page, bad link URL, recommended action.

**Effort:** S (1 day)
**Priority:** 🟡 IMPORTANT

---

### 9. Collapse redirect chains (279 pages)

**Problem:** 279 pages redirect, but redirect chains (A → B → C) waste crawl budget and dilute link equity.

**Fix:**
1. Identify chains where `X → Y → Z` — collapse to `X → Z` (single hop)
2. Keep 301 type
3. Monitor GSC for coverage issues

**Deliverable to devs:** `redirect-chains-to-collapse.csv`.

**Effort:** S (1 day)
**Priority:** 🟡 IMPORTANT

---

## 🟢 Sprint 3 — Nice-to-have cleanup

### 10. Expand 137 thin-content pages

**Problem:** 137 pages under ~500 words.

**Why it's here (not per-page):** These 137 are cleanup candidates best done in a batch using the content-refresh workflow. It's technically per-page work, but it's a one-time backlog.

**Fix:** Use the `content-refresh` skill on each. Prioritize by:
1. Course pages first (highest commercial value)
2. State hub pages
3. Informational blog pages
4. Utility pages last

**Deliverable:** batch-refresh plan with 137 page URLs ranked by priority.

**Effort:** L (ongoing — budget 1–2 pages per day)
**Priority:** 🟢 NICE-TO-HAVE (but high-value over time)

---

### 11. Core Web Vitals tune

**Problem:** CWV scores unknown (need PageSpeed Insights validation).

**Fix:**
1. Run PSI on 10 sample pages (homepage, top 5 course pages, 3 blogs, 1 hub)
2. Identify common issues (LCP image size, render-blocking JS, CLS from ads, INP from JS)
3. Apply fixes at template level

**Effort:** M (2–3 days diagnostic + variable fix time)
**Priority:** 🟢 NICE-TO-HAVE (big SEO benefit but not blocking)

---

### 12. Unblock 2 accidentally-blocked pages

**Problem:** NP|accel crawl found 2 pages blocked from crawling.

**Fix:** Check robots.txt + meta robots. Confirm intentional (login, cart, staging) vs accidental. Unblock if accidental.

**Effort:** XS (1 hour)
**Priority:** 🟢 NICE-TO-HAVE

---

## Sprint Delivery Checklist

**End of Sprint 1 — you should have:**
- [ ] 0 duplicate titles (Screaming Frog confirms)
- [ ] 0 duplicate metas
- [ ] `/course/*` URLs 301'd to `/courses-details/*`
- [ ] Organization schema only on homepage + about

**End of Sprint 2 — you should have:**
- [ ] Breadcrumb schema on all pages
- [ ] Course + Offer + AggregateRating schema on all state course pages
- [ ] 0 images missing alt text
- [ ] 0 broken links
- [ ] 0 redirect chains

**End of Sprint 3 — you should have:**
- [ ] 137 thin pages expanded (or plan in place)
- [ ] CWV scores green on top 10 pages
- [ ] All crawl-blocked pages intentional

## Validation After Each Sprint

1. Run Screaming Frog crawl
2. Validate schemas in Google Rich Results Test
3. Check GSC Coverage report for regressions
4. Re-run `scripts/extract-meta.py` on 5 sample pages — confirm targets hit

## Expected Impact

After Sprint 1: per-page optimizations start compounding. Each new optimization adds ~15–25 percentile points of effectiveness (vs the current capped state).

After Sprint 2: rich results start appearing in SERPs for state course pages (stars, pricing, breadcrumbs, FAQ dropdowns). Expect CTR lift of 8–20% on pages with new schema.

After Sprint 3: foundation is fully clean. You can focus 100% on per-page optimization without worrying about sitewide drag.

## How This Integrates With Per-Page Work

Per-page optimizations (run via `/optimize [URL]`) will:
1. Generate title/meta following the SAME formula as the template fix (so they're consistent)
2. Skip sitewide issues (just reference this backlog item number in `score.md`)
3. Note in every `score.md`: "Sitewide blocker: see sitewide-backlog #X" if relevant
4. Not re-audit sitewide issues on every page

Once Sprint 1+2 are done, per-page work becomes lighter because the foundation is solid.
