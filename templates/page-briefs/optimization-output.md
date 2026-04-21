# Optimization Output — [PRIMARY KEYWORD]

> This is the format Claude MUST follow when producing the main deliverable (`pages/_in-progress/[slug]/optimization.md`).
> Every section below is mandatory. Do NOT shorten. Do NOT skip sections.

---

## Metadata

- **URL:** 
- **Page type:** state-course-page / license-info / blog-commercial / blog-informational / hub
- **State:** 
- **Primary keyword:** 
- **Status:** existing / new
- **Date optimized:** 
- **NP|accel pattern source:** cite which file(s) the template came from

---

## 1. Keyword Strategy

### Primary Keyword
| Field | Value |
|---|---|
| Keyword | |
| Volume | `[ESTIMATE — validate]` |
| KD | `[ESTIMATE — validate]` |
| Current position | `[ESTIMATE — validate via GSC]` |
| Methodology | Top Traffic / Striking Distance / Competitor / Wishlist |
| Intent | |
| Priority score | /100 |
| Cannibalization risk | YES (with URL) / NO |

### Secondary Keywords (5)
| # | Keyword | Vol `[EST]` | KD `[EST]` | Methodology | Intent |
|---|---|---|---|---|---|

### LSI / Additional Keywords (6)

### PAA Questions (4–5)

### Competitor Gap Keywords

---

## 2. Title Tag (3 variants)

| Version | Title | Chars | Notes |
|---|---|---|---|
| V1 (Primary-match, default) | | | |
| V2 (Benefit-led) | | | |
| V3 (Authority-led) | | | |

**Recommended: V_**
**Rationale:** 

---

## 3. Meta Description (3 variants)

| Version | Meta | Chars | Notes |
|---|---|---|---|
| V1 (NP|accel pattern) | | | |
| V2 (Benefit-led) | | | |
| V3 (Question-led) | | | |

**Recommended: V_**

---

## 4. URL Slug

- **Current:** 
- **Recommended:** 
- **Change needed?** YES (plan 301) / NO

---

## 5. Full Header Structure

```
H1: 

  <p> See What Our Students Are Saying!
  <p> Bundle & Save: Enhance Your Learning Experience!

  H3: Overview
  H3: Outcomes
      H4: 
      H4: 
      H4: 
      H4: 
      H4: 
      H4: 
  H3: Eligibility

H2: 

H2: 

H2: 

H2: 
    H3: 1. 
    H3: 2. 
    H3: 3. 
    H3: 4. 

H2: 

H2: Frequently Asked Questions
    H3: 
    H3: 
    H3: 
    H3: 
    H3: 
```

---

## 6. Body Content (Rewritten)

For each section below, mark status and provide the final copy:

### Overview [KEEP / REWRITE / NEW]
[Final prose]

### Outcomes [KEEP / REWRITE / NEW]
[Final prose]

### Eligibility [KEEP / REWRITE / NEW]
[Final prose]

### Who Can Take the [Course]? [KEEP / REWRITE / NEW]
[Final prose]

### Shedding More Light on This Course [KEEP / REWRITE / NEW]
[Final prose — 3–4 paragraphs with LSI + halo keywords]

### Recommended Courses to Enhance Your Learning [KEEP / REWRITE / NEW]
[Internal link grid content]

### Your Step-By-Step Guide to Getting Licensed [KEEP / REWRITE / NEW]
[All 4 steps]

### Why Should You Opt for This Course? [KEEP / REWRITE / NEW]
[2-paragraph trust block]

### FAQ [KEEP / REWRITE / NEW]
[5–10 Qs + As, each A 40–80 words]

**Final word count:** ___ / target 1,200–1,800

---

## 7. Keyword Placement Map

| # | Location | Primary | Halos | LSI |
|---|---|---|---|---|
| 1 | Title tag | ✅ | | |
| 2 | Meta description | ✅ | | |
| 3 | URL slug | ✅ | | |
| 4 | H1 | ✅ | | |
| 5 | First 100 words | | | |
| 6 | H2 #1 "Who Can Take…" | | | |
| 7 | H2 "Shedding Light…" | | | |
| 8 | "Step-By-Step" H3s | | | |
| 9 | H2 "Why Should You…" | | | |
| 10 | FAQ H3s | | | |
| 11 | FAQ answers | | | |
| 12 | Image alts | | | |
| 13 | Schema | | | |

**Primary density:** ___% (target 1.2–1.8%)
**Halo coverage:** __/5 hit (target 5/5)
**LSI coverage:** __/6 hit (target 6/6)

---

## 8. Internal Linking Plan (minimum 5)

| # | Anchor text | Destination URL | Reason |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |
| 4 | | | |
| 5 | | | |

---

## 9. Image Recommendations

| # | File name | Alt text | Position | Notes |
|---|---|---|---|---|
| 1 | | | Above-fold | Contains primary KW |
| 2 | | | Body | |
| 3 | | | FAQ/footer | |

---

## 10. FAQ Section

### Q1: [Question]
**A:** [40–80 word answer, leads with direct answer]

### Q2: 
### Q3: 
### Q4: 
### Q5: 
### (optionally Q6–Q10)

---

## 11. Technical SEO Recommendations

- **Canonical:** `<link rel="canonical" href="[URL]">`
- **Meta robots:** `<meta name="robots" content="index, follow">`
- **Breadcrumb:** `Home > Courses > [State] Courses > [Course Name]`
- **Sitemap inclusion:** [YES/NO]
- **CWV:** `[VALIDATE LCP/INP/CLS in PageSpeed Insights]`
- **Mobile-friendly:** `[VALIDATE in Mobile-Friendly Test]`
- **URL namespace consistency:** [FLAG if duplicate pattern exists]

---

## 12. Schema Stack

See `schema.json` for the ready-to-paste JSON-LD `@graph` block.

Contains:
- [ ] `BreadcrumbList`
- [ ] `Course`
- [ ] `FAQPage`
- [ ] `AggregateRating` (if reviews available)
- [ ] `Offer` (if pricing shown)

**Organization removed** (lives on homepage only): ✅

---

## 13. Implementation Notes (for dev)

- CMS fields that change: [list]
- Hardcoded HTML that changes: [list]
- Schema needs dev implementation: [describe]
- URL change needs 301: [YES/NO]
- Sitemap regen needed: [YES/NO]
- Deploy complexity: S / M / L

---

## 14. Open Validations

- [ ] `[ESTIMATE]` Volume for primary KW
- [ ] `[ESTIMATE]` KD for primary KW
- [ ] `[VALIDATE]` CWV scores (LCP/INP/CLS)
- [ ] `[VALIDATE]` Mobile-Friendly Test
- [ ] `[VALIDATE]` Schema in Google's Rich Results Test
- [ ] `[VALIDATE]` Inbound internal link count (GSC or Ahrefs)

See `score.md` for the complete SEO score + gap-closing actions.
