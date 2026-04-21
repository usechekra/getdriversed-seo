# Current State — California Traffic School

**Fetched:** 2026-04-18  
**Method:** curl with realistic browser headers + Python parser  
**Source:** https://getdriversed.com/courses-details/california-traffic-school

---

## Meta Tags

| Element | Current Value | Length | Status |
|---|---|---|---|
| `<title>` | `Get Drivers Ed - California Traffic School` | 42 chars | ❌ Too short (target 50–60), wrong separator (dash not pipe), state missing from lead position |
| `<meta description>` | `Get Drivers Ed - Texas Online Driver Education TLDR Approved Courses` | 68 chars | 🔴 CRITICAL — says **Texas** on a California page. Template copy error. Only 68 chars (target 140–155) |
| `<link rel="canonical">` | `https://getdriversed.com/courses-details/california-traffic-school` | — | ⚠️ Missing `/en` suffix — but GSC indexes `/en` variant. Canonical conflict. See sitewide backlog #3 |
| `<meta name="robots">` | `index, follow` | — | ✅ Correct |

---

## Header Structure

| Tag | Text | Status |
|---|---|---|
| H1 | **MISSING** | 🔴 No H1 on page |
| H2 | Recommended Courses to Enhance Your Learning | ✅ Present but it's the only "content" H2 |
| H2 | Your Step-By-Step Guide to Getting Licensed | ✅ Present |
| H2 | Frequently Asked Questions | ✅ Present (but no FAQ content visible) |

**Missing H2s:** "Who Can Take…", "Shedding More Light on This Course", "Why Should You Opt for This Course?"  
**H3s:** None detected  
**H4s:** None detected  

---

## Schema

| Type | Present | Notes |
|---|---|---|
| BreadcrumbList | ❌ | Missing entirely |
| Course | ❌ | Missing entirely |
| FAQPage | ❌ | Missing entirely |
| Organization | ❌ | Not present (correct — should only be on homepage) |

**Total schema: NONE**

---

## Images

| Item | Value | Status |
|---|---|---|
| Total images | 2 | — |
| Images with alt text | 2 | ⚠️ Alt text exists but is broken |
| Alt text #1 | `Graphic of person pointing to board representing undefined` | 🔴 Template variable `undefined` — broken |
| Alt text #2 | `Get Drivers Ed Logo` | ✅ Acceptable for logo |

---

## Content

| Metric | Current | Target | Status |
|---|---|---|---|
| Visible word count | ~77 words | 1,200–1,800 | 🔴 CRITICAL — 94% below minimum |
| Intro paragraph | Missing | Required | ❌ |
| Overview bullets | Missing | 8–10 | ❌ |
| Outcomes H4 sections | Missing | 6 H4s | ❌ |
| Eligibility section | Missing | Required | ❌ |
| "Shedding More Light" section | Missing | 300–400 words | ❌ |
| Why Should You | Missing | 2 paragraphs | ❌ |
| FAQ questions | 0 visible | 5–10 | ❌ |

The page is essentially a shell — header nav + footer + 3 H2 section shells with no body content rendered. The course content appears to be either missing from the CMS or not rendering due to a data binding error.

---

## Internal Links

| Type | Count | Status |
|---|---|---|
| Nav/footer internal links | 9 | ✅ (About, Contact, Help, Blogs, etc.) |
| Course-specific internal links | 0 | 🔴 No contextual links |
| External links | 0 | ✅ Correct for commercial page |

---

## Technical Issues Found

1. 🔴 **Meta description says "Texas"** — critical wrong-state copy error
2. 🔴 **No H1** — major on-page SEO failure
3. 🔴 **77 word count** — page is effectively empty
4. 🔴 **Zero schema** — no Course, no FAQPage, no BreadcrumbList
5. 🔴 **Alt text says "undefined"** — broken template variable
6. ⚠️ **Title uses dash instead of pipe** — against NP|accel formula
7. ⚠️ **Canonical missing /en suffix** — while GSC indexes /en variant (sitewide backlog #3)
8. ⚠️ **No breadcrumb HTML** — missing visible breadcrumb (sitewide backlog #5)
9. ⚠️ **No course-specific internal links** — only nav/footer links

---

## Current SEO Score: 9/100

| Component | Score | Max | Notes |
|---|---|---|---|
| On-page KW coverage | 2 | 25 | Only canonical URL and robots pass |
| Title + Meta | 1 | 10 | Title undersized, wrong separator; meta says wrong state |
| Header structure | 0 | 15 | No H1, only 3 H2s, no FAQ H3s |
| Content depth | 0 | 15 | 77 words vs 1,200 target |
| Internal linking | 2 | 10 | Nav links only — no course contextual links |
| Schema stack | 0 | 10 | Nothing present |
| Image optimization | 1 | 5 | Alt exists but "undefined" — partial credit |
| Technical foundation | 3 | 5 | Canonical ✅ robots ✅ HTTPS ✅ — no breadcrumb, sitemap unconfirmed |
| Readability | 0 | 5 | No content to evaluate |
| **TOTAL** | **9** | **100** | Far below 85 shippable threshold |
