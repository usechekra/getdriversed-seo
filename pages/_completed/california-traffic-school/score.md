# SEO Score — California Traffic School Online

**URL:** https://getdriversed.com/courses-details/california-traffic-school  
**Primary KW:** California Traffic School Online  
**Date scored:** 2026-04-18  

---

## Current Score: 9/100

| Component | Score | Max | Notes |
|---|---|---|---|
| On-page KW coverage | 2 | 25 | 1/13 slots hit (canonical URL only) — no title KW match, no H1, wrong state in meta |
| Title + Meta | 1 | 10 | Title 42 chars (too short, wrong format) = 2pts; Meta says "Texas" = 0pts → 1pt partial |
| Header structure | 0 | 15 | No H1, only 3 of 6 H2s, zero FAQ H3s |
| Content depth | 0 | 15 | 77 words vs 1,200 target — (77/1200) × 15 = 0.96 → rounds to 0 |
| Internal linking | 2 | 10 | Nav links present = 2pts; zero course-specific contextual links |
| Schema stack | 0 | 10 | Nothing present |
| Image optimization | 1 | 5 | Alt text exists but "undefined" = broken; partial credit only |
| Technical foundation | 3 | 5 | Canonical ✅ robots ✅ HTTPS ✅ — breadcrumb ❌ sitemap unconfirmed ❌ |
| Readability | 0 | 5 | Only 77 words — cannot evaluate |
| **TOTAL** | **9** | **100** | Far below 85 threshold |

---

## Projected Score After Implementation: 93/100

| Component | Projected | Max | How |
|---|---|---|---|
| On-page KW coverage | 23 | 25 | 12/13 slots hit — all major placements covered |
| Title + Meta | 10 | 10 | Title 51 chars ✅, meta 143 chars ✅, both contain primary KW |
| Header structure | 15 | 15 | H1 exact match ✅, 6 H2s ✅, 7 FAQ H3s ✅ |
| Content depth | 15 | 15 | ~1,590 words / 1,200 target = 1.32 → capped at 15 |
| Internal linking | 7 | 10 | 6 outbound contextual ✅; inbound count [VALIDATE] — 5pts if ≥2 inbound confirmed |
| Schema stack | 10 | 10 | BreadcrumbList ✅ Course ✅ FAQPage ✅ = 2.5 × 4 = 10 |
| Image optimization | 5 | 5 | 3 images, all with correct alt text |
| Technical foundation | 5 | 5 | Canonical ✅ robots ✅ HTTPS ✅ breadcrumb ✅ sitemap ✅ |
| Readability | 3 | 5 | Short paragraphs, direct answers — estimated Flesch 55–65 [VALIDATE] |
| **TOTAL** | **93** | **100** | Above 85 shippable threshold ✅ |

**Delta: +84 points**

---

## Top 5 Gap-Closing Actions

| # | Action | Impact | Effort | Tag |
|---|---|---|---|---|
| 1 | Fix meta description — remove "Texas" copy error, replace with CA meta (V1) | +9 pts | 5 min | 🔴 Do today |
| 2 | Add H1 + full body content (1,590 words per optimization.md) | +39 pts | 2–3 hrs | 🔴 Do today |
| 3 | Add JSON-LD schema block (BreadcrumbList + Course + FAQPage) from schema.json | +10 pts | 30 min | 🔴 Do today |
| 4 | Fix title tag — replace with V1 "California Traffic School Online \| Get Drivers Ed" | +9 pts | 5 min | 🔴 Do today |
| 5 | Fix hero image alt text — replace "undefined" with correct alt per optimization.md §6h | +4 pts | 5 min | 🟡 This week |

---

## Sitewide Blockers Affecting This Page

Reference `SITEWIDE-BACKLOG.md` — do not re-audit here, just flag:

- **Item #1** — Duplicate title templates: this page's title will be re-duplicated unless the template-level fix is deployed
- **Item #2** — Duplicate meta descriptions: the "Texas" error is a symptom of this broken template
- **Item #3** — URL namespace: `/en` canonical inconsistency
- **Item #4** — Organization schema cleanup: confirm Organization is not being injected on this page by template
- **Item #5** — Breadcrumb schema sitewide: the breadcrumb fix in this optimization will only apply to this page; template-level fix needed for all pages

---

## Open Validations

- [ ] [ESTIMATE] Volume for "California Traffic School Online" — validate in Ahrefs/SEMRush (estimated 2,400–4,400/mo)
- [ ] [ESTIMATE] KD for "California Traffic School Online" — validate (estimated 35–45; above DA 20 sweet spot)
- [ ] [VALIDATE] GDE's California DMV TVS license number — add to page near H1 and in schema `courseCode`
- [ ] [VALIDATE] Actual pricing — add `Offer.price` to schema.json
- [ ] [VALIDATE] Review count — add `AggregateRating` to schema if real reviews exist (do NOT add fake data)
- [ ] [VALIDATE] Inbound internal link count — check GSC Links report; need ≥ 2 pages linking here
- [ ] [VALIDATE] LCP score — run PageSpeed Insights on live URL post-deploy
- [ ] [VALIDATE] INP score — run PageSpeed Insights
- [ ] [VALIDATE] CLS score — run PageSpeed Insights
- [ ] [VALIDATE] Mobile-Friendly Test — run Google Mobile-Friendly Test post-deploy
- [ ] [VALIDATE] Flesch readability score — run body copy through Flesch calculator; target 60–70
- [ ] [VALIDATE] Sitemap inclusion — confirm `/en` URL is in sitemap.xml
- [ ] [VALIDATE] `/courses-details/california-traffic-school` (no /en) → 301 needed if external backlinks exist; check GSC Links report
