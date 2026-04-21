# SEO Score — Michigan Online Defensive Driving Course

**Date:** 2026-04-21
**URL:** https://getdriversed.com/courses-details/michigan-online-defensive-driving-course
**Primary KW:** Michigan online defensive driving course

---

## Current Score: 14/100

| Component | Score | Max | Notes |
|---|---|---|---|
| On-page KW coverage | 3 | 25 | ~2 of 13 slots hit (title partial, body near-zero — content is client-rendered, invisible to crawlers) |
| Title + Meta | 2 | 10 | Title: 57 chars ✅ BUT wrong formula (-2.5); Meta: 68 chars ❌ AND wrong state (Texas meta on Michigan page) |
| Header structure | 2 | 15 | H1: NOT in server HTML ❌; H2 count: 3 of 6 required ❌; FAQ H3s: 0 visible ❌ |
| Content depth | 0 | 15 | ~73 words visible to crawlers / 1,500 target = 4.9% — effectively zero |
| Internal linking | 3 | 10 | Outbound: ~0 course-specific ❌; Inbound: unknown [VALIDATE] — awarding 3 as partial credit |
| Schema stack | 0 | 10 | No schema of any type present (Course, FAQPage, BreadcrumbList, Offer all missing) |
| Image optimization | 0 | 5 | Not assessable from server HTML; alt text status unknown [VALIDATE] |
| Technical foundation | 4 | 5 | Canonical ✅; Robots ✅; HTTPS ✅; Sitemap [VALIDATE]; Breadcrumb ❌ |
| Readability | 0 | 5 | Insufficient content to score |
| **TOTAL** | **14** | **100** | |

> **Note on H1/content:** Page is Next.js client-rendered. Content may exist in the browser DOM but is not in the server-rendered HTML — meaning Googlebot (which runs JavaScript but may not execute it fully for all pages) likely sees the same thin shell. This is the root cause of the near-zero content and heading scores.

---

## Projected Score After Implementation: 91/100

| Component | Score | Max | Notes |
|---|---|---|---|
| On-page KW coverage | 23 | 25 | Primary KW in title, meta, H1, H2, body ×6+, alts, schema. Minor gap: inbound alts unconfirmed |
| Title + Meta | 10 | 10 | Title: 54 chars ✅; Meta: 147 chars ✅; both contain primary KW + CTA |
| Header structure | 15 | 15 | H1: exact primary KW ✅; 6 H2s ✅; 8 FAQ H3s ✅ |
| Content depth | 15 | 15 | ~1,550 words / 1,500 target = 103% ✅ |
| Internal linking | 8 | 10 | 5 outbound ✅; inbound [VALIDATE — award 3 pts pending confirmation] |
| Schema stack | 10 | 10 | BreadcrumbList ✅ + Course ✅ + FAQPage ✅ + Offer ✅ |
| Image optimization | 5 | 5 | 3 images all with descriptive keyword-rich alts ✅ |
| Technical foundation | 5 | 5 | Canonical ✅; Robots ✅; HTTPS ✅; Sitemap ✅ (confirm after deploy); Breadcrumb ✅ |
| Readability | 5 | 5 | Short paragraphs, plain language, no jargon — Flesch ~65 estimated ✅ |
| **TOTAL** | **91** | **100** | |

---

## Delta: +77 points (14 → 91)

This is an extremely high delta — primarily driven by the page's current state being effectively empty to crawlers (client-rendered JS content, wrong-state meta, no schema, no visible H1). Every component improves substantially.

---

## Top 5 Gap-Closing Actions

| # | Action | Impact | Effort | Tag |
|---|---|---|---|---|
| 1 | Fix meta description — replace Texas content with Michigan-specific meta | +4 pts | 10 min | 🔴 Do today |
| 2 | Add full body content (BDIC explainer, eligibility, steps, FAQ) — currently near-zero words visible to crawlers | +30 pts | 2–4 hrs dev | 🔴 Do today |
| 3 | Add JSON-LD schema stack (BreadcrumbList + Course + FAQPage + Offer) — currently zero schema | +10 pts | 1 hr dev | 🔴 Do today |
| 4 | Fix title to use pipe separator and proper formula | +2 pts | 5 min | 🔴 Do today |
| 5 | Add breadcrumb HTML nav + verify sitemap inclusion | +2 pts | 30 min dev | 🟡 This week |

---

## Sitewide Blockers Affecting This Page

Per `SITEWIDE-BACKLOG.md`:

- **Item #1** (Duplicate title tags): This page's title uses wrong separator (`-` vs `|`) and wrong formula order — this is part of the sitewide template fix. Per-page fix recommended NOW (high priority), but sitewide fix eliminates recurrence.
- **Item #2** (Duplicate meta descriptions): This page has Texas meta on a Michigan page — extreme version of the sitewide bug. CRITICAL to fix immediately per-page.
- **Item #5** (Breadcrumb schema sitewide): Breadcrumb missing from this page — part of sitewide fix. Included in this per-page delivery so it ships now.
- **Item #6** (Course + Offer + AggregateRating schema sitewide): All schema missing from this page — included in this per-page delivery.
- **Item #10** (Thin content): This page qualifies as thin (73 words visible) — full rewrite included in this delivery.

---

## Open Validations Required

- [ ] [ESTIMATE] Volume for "Michigan online defensive driving course" — validate in Ahrefs/SEMRush
- [ ] [ESTIMATE] Volume for "Michigan BDIC online" — validate
- [ ] [ESTIMATE] KD scores for all keywords — validate in Ahrefs/SEMRush
- [ ] [VALIDATE] Confirm GDE is indeed a licensed Michigan BDIC sponsor (check michigan.gov/sos/industry-services/bdic for approved sponsor list)
- [ ] [VALIDATE] Confirm exact course price — add to Offer schema `price` field once known
- [ ] [VALIDATE] Confirm GDE has real reviews — if yes, add AggregateRating to schema (with real ratingCount only)
- [ ] [VALIDATE] LCP, INP, CLS — run PageSpeed Insights post-deploy
- [ ] [VALIDATE] Mobile-Friendly Test — run post-deploy
- [ ] [VALIDATE] Sitemap includes this URL — check sitemap.xml
- [ ] [VALIDATE] Inbound internal link count — check GSC Links report after implementation
- [ ] [VALIDATE] Secondary URL `/course/defensive/michigan` — does it exist? If yes, 301 to canonical
- [ ] [VALIDATE] Current GSC ranking position for primary KW — establish baseline before deploy
