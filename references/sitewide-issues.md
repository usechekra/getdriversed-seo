# Sitewide Issues (Repo-Level Backlog)

These are issues that affect the entire Get Drivers Ed site, not any single page. Per-page optimizations compound FASTER once these are fixed. Treat this as your parallel backlog.

Pulled from the Jan 2026 NP|accel Technical SEO Audit.

## 🔴 Critical (blocks per-page optimization ROI)

### 1. Massive duplicate-content problem
- **5,460 pages with duplicate `<title>` tags** (84% of the site's 6,527 pages)
- **5,455 pages with duplicate meta descriptions** (also 84%)

**Why this blocks everything:** If 84% of your site shares the same title/meta, Google struggles to understand what any single page uniquely covers. Your per-page optimizations work 3–4× better once this is fixed because each page gets a distinct semantic fingerprint.

**Fix approach:**
- Template-level fix, not page-by-page. Likely a CMS/codebase change to how titles + metas are generated.
- Apply the NP|accel title formula (`[State] [Duration] [Course Type] | Get Drivers Ed`) across all state+course pages.
- Apply the meta formula (`Get Drivers Ed offers [primary KW], designed for [benefit 1] and [benefit 2] to meet [authority anchor]. [CTA].`).
- Run a crawl with Screaming Frog (or similar) after fix to confirm 0 duplicates.

**Dev estimate:** M (medium) — template logic change + backfill.

### 2. URL namespace inconsistency
Two patterns coexist for the same content:
- `/courses-details/[state-kebab]-[course-kebab]/en` ← canonical per NP|accel
- `/course/[course]/[state]` ← legacy, should be 301'd

**Why this blocks:** Google may split link equity across both URLs or pick the wrong one. Keyword cannibalization risk on every state+course combo.

**Fix approach:**
- Audit all `/course/*` URLs
- Map each to its `/courses-details/*` equivalent
- 301 redirect the legacy → canonical
- Update any internal links pointing to legacy URLs

**Dev estimate:** S (small) — redirect map + config change.

## 🟡 Important (fix within the next 30 days)

### 3. 51 broken links
Surfaced in the NP|accel audit. Fix via:
- Export the broken link list
- For each: either update the target URL, remove the link, or 301 the source if the problem is a dead page

### 4. 279 redirected pages (chain risk)
Redirects are fine; redirect CHAINS are not. Audit the 279 to find any that redirect → another redirect → final. Collapse chains to single hops.

### 5. 137 pages with low word count (< 500 words)
These are the easiest per-page wins. Pull the list, prioritize by commercial value (course pages > blog > utility pages), and expand each using the Content Refresh skill.

### 6. 2 blocked pages (crawl-blocked)
2 pages show as Blocked in the NP|accel crawl. Quick check: are they intentionally blocked (login pages, cart, etc.) or accidentally? If accidental, unblock.

## 🟢 Nice-to-have (fix over 60–90 days)

### 7. Organization schema on non-homepage pages
NP|accel recommended removing `Organization` schema from the NY page because it belongs on homepage only. Likely happening across other pages too.

**Fix approach:** audit all pages. Keep `Organization` on `/` and `/about` only. Remove elsewhere. Replace with page-appropriate schema (Course, Article, CollectionPage).

### 8. Breadcrumb schema missing in many places
The NP|accel NY audit flagged that breadcrumb schema was missing and should be added. If it's missing on one course page, it's likely missing on many. Template-level addition.

### 9. Image alt text coverage
NP|accel NY audit found the hero image had N/A alt text. Check sitewide alt coverage — if < 95%, run a batch alt-text generation pass using the formula: `[Descriptor] [Subject] representing [Primary KW]`.

### 10. Schema diversity on course pages
Current course pages have `FAQPage` + (now) `BreadcrumbList`. They're MISSING:
- `Course` schema (huge for education-vertical rich results)
- `AggregateRating` (if you have real reviews — critical for CTR)
- `Offer` (if pricing is visible on page)

Adding these is a site-template change that benefits every course page at once.

## How to Use This File

When Claude runs any skill and identifies a fix that's actually a sitewide issue (not page-specific), it should:

1. Note it in the page's `score.md` as "🔴 Sitewide — see `references/sitewide-issues.md` item #_"
2. NOT re-fix the same sitewide issue on every page
3. Remind the user that per-page gains cap until sitewide issues are addressed

## Tracking

Add a status column when you start working on these:

| # | Issue | Owner | Status | Date fixed |
|---|---|---|---|---|
| 1 | Duplicate titles/metas | | Not started | |
| 2 | URL namespace | | Not started | |
| 3 | Broken links | | Not started | |
| 4 | Redirect chains | | Not started | |
| 5 | Low word count pages | | Not started | |
| 6 | Blocked pages | | Not started | |
| 7 | Organization schema cleanup | | Not started | |
| 8 | Breadcrumb schema rollout | | Not started | |
| 9 | Alt text coverage | | Not started | |
| 10 | Course/Rating/Offer schema rollout | | Not started | |
