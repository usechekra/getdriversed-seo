# SEO Scoring Rubric (100-point system)

A proxy for the SEMRush Aggregate Score NP|accel uses. Score every page before and after optimization.

## Rubric

| Component | Max Points | Measurement |
|---|---|---|
| On-page keyword coverage | 25 | (pass count / 13 placement slots) × 25 |
| Title + Meta optimization | 10 | 5 pts each — primary KW present AND char count in range |
| Header structure | 15 | 5 pts H1 exact match + 5 pts H2 count is 6–7 with spread + 5 pts FAQ H3s ≥ 5 |
| Content depth | 15 | (actual word count / target) × 15, capped at 15 |
| Internal linking | 10 | 5 pts ≥ 2 outbound internal + 5 pts ≥ 2 inbound internal |
| Schema stack | 10 | 2.5 pts per required schema type present & valid |
| Image optimization | 5 | (% images with proper alts) × 5 |
| Technical foundation | 5 | 1 pt each: canonical, robots, sitemap, breadcrumb, HTTPS |
| Readability | 5 | 5 if Flesch 60–70; 2 if 50–59 or 71–80; 0 otherwise |
| **TOTAL** | **100** | |

## Shippable Threshold

**≥ 85 = ship.** Below that, iterate.

## Scoring Template (use for every page)

```markdown
## SEO Score

### Current Score: X/100

| Component | Score | Max | Notes |
|---|---|---|---|
| On-page KW coverage | __ | 25 | __ of 13 placement slots hit |
| Title + Meta | __ | 10 | Title: __ chars / Meta: __ chars |
| Header structure | __ | 15 | H1 match: [Y/N] / H2 count: __ / FAQ H3s: __ |
| Content depth | __ | 15 | Word count: __ / target __ |
| Internal linking | __ | 10 | __ outbound / __ inbound |
| Schema stack | __ | 10 | Present: [list] / Missing: [list] |
| Image optimization | __ | 5 | __% alts filled |
| Technical foundation | __ | 5 | [list of fails] |
| Readability | __ | 5 | Flesch: __ |
| **TOTAL** | **__** | **100** | |

### Projected Score After Implementation: Y/100

[Same table, projected scores]

### Delta: +Z points

### Top 5 Gap-Closing Actions

| # | Action | Impact | Effort | Tag |
|---|---|---|---|---|
| 1 | __ | __ pts | __ hrs | 🔴 / 🟡 / 🟢 |
| 2 | __ | __ pts | __ hrs | __ |
| 3 | __ | __ pts | __ hrs | __ |
| 4 | __ | __ pts | __ hrs | __ |
| 5 | __ | __ pts | __ hrs | __ |

### Open Validations

- [ ] [ESTIMATE] Volume for primary KW — validate in Ahrefs/SEMRush
- [ ] [ESTIMATE] KD for primary KW — validate
- [ ] [VALIDATE] LCP score — run PageSpeed Insights
- [ ] [VALIDATE] INP score — run PageSpeed Insights
- [ ] [VALIDATE] CLS score — run PageSpeed Insights
- [ ] [VALIDATE] Mobile-Friendly Test
- [ ] [VALIDATE] Inbound internal link count — use GSC links report or Ahrefs
```

## Impact/Effort Rules for Priority Tagging

**🔴 Critical (do today):**
- Anything breaking indexing (noindex, canonical loop, 404)
- Primary KW missing from title/H1
- Word count below 500 on a course page
- Missing schema on a page that could earn rich results

**🟡 Important (this week):**
- Title/meta out of char range
- < 2 internal links
- Thin FAQ (< 5 Qs)
- Image alt coverage below 80%
- Content below target word count by > 30%

**🟢 Nice-to-have (this month):**
- Minor alt text improvements
- CWV tuning
- Secondary schema additions (AggregateRating if reviews become available)
- Readability fine-tuning
- Internal link anchor optimization

## Scoring Worked Example (NY Pre-Licensing Page — current state per NP|accel audit)

- On-page KW coverage: 18/25 (title ✗ current, H1 ✓, intro ✓, H2 ✓, FAQ ✓, schema name ✓, body ✓, alts ✗)
- Title + Meta: 7/10 (title 64 chars > 60 = fail; meta 160 chars barely over = partial)
- Header structure: 12/15 (H1 ✓ after change, 6 H2s ✓, 5 FAQ H3s ✓, but two H2s were promo strips = pattern fail)
- Content depth: 14/15 (~1,400 words / 1,400 target)
- Internal linking: 10/10 (present per audit)
- Schema stack: 5/10 (FAQ ✓, Organization present but should be removed = -2.5, Breadcrumb missing = -2.5)
- Image optimization: 0/5 (alt text N/A per audit)
- Technical foundation: 5/5 (all present)
- Readability: 5/5 (assume passes)

**Total: 76/100** → below shippable → the NP|accel optimizations push it to projected **92/100**.
