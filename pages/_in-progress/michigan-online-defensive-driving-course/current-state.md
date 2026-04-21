# Current State — Michigan Online Defensive Driving Course

**URL:** https://getdriversed.com/courses-details/michigan-online-defensive-driving-course
**Date fetched:** 2026-04-21
**Note:** Page is client-side rendered (Next.js). HTML source reflects only server-shell; actual course content loads via JS. Word count and heading visibility are limited to what the crawler sees.

---

## Title Tag

**Current:** `Get Drivers Ed - Michigan Online Defensive Driving Course`
**Length:** 57 characters
**Issues:**
- Uses dash separator (`-`) instead of pipe (`|`) — violates formula (SITEWIDE-BACKLOG.md #1)
- Brand name leads instead of state keyword (wrong formula order)
- No duration modifier present
- Formula should be: `Michigan Online Defensive Driving Course | Get Drivers Ed`

---

## Meta Description

**Current:** `Get Drivers Ed - Texas Online Driver Education TLDR Approved Courses`
**Length:** 68 characters
**Issues:**
- 🔴 CRITICAL: Says "Texas" on a Michigan page — wrong state hardcoded
- Only 68 characters (far below 140–155 target)
- No CTA ("Enroll", "Start", "Get")
- No benefit statement
- This is a sitewide template bug (SITEWIDE-BACKLOG.md #2)

---

## Canonical

**Current:** `https://getdriversed.com/courses-details/michigan-online-defensive-driving-course`
**Assessment:** Correct. No `/en` suffix on this page (unlike California pattern). Consistent with this page's URL.

---

## Meta Robots

**Current:** `index, follow`
**Assessment:** Correct.

---

## Heading Structure (visible in server-rendered HTML)

Note: Full heading tree may exist in client-rendered JS. Only H2s detected in server HTML:

```
(No H1 detected in server-rendered HTML)
H2: Recommended Courses to Enhance Your Learning
H2: Your Step-By-Step Guide to Getting Licensed
H2: Frequently Asked Questions
```

**Issues:**
- No H1 visible in crawlable HTML — this is a critical SEO issue if H1 is only rendered client-side
- Missing core content H2s (eligibility, who is this for, why GDE, etc.)
- No H3s or H4s visible at all
- Only 3 H2s vs the 6-H2 template target

---

## Schema Types Present

**None detected.**

**Issues:**
- Missing Course schema (SITEWIDE-BACKLOG.md #6)
- Missing FAQPage schema
- Missing BreadcrumbList schema (SITEWIDE-BACKLOG.md #5)
- Missing Offer schema
- No AggregateRating

---

## Visible Word Count

**Estimated:** ~73 words (server-rendered shell only)
**Note:** The full content loads client-side. Actual page content is likely 300–600 words based on similar GDE course pages. Either way, well below the 1,200–1,800 word target.

---

## Images

**Visible in source:** Not extractable from server-rendered HTML. Content is loaded via JavaScript.
**Alt text:** Unknown — [VALIDATE by viewing rendered page]

---

## Internal Links (server-rendered)

**Visible nav links only:**
- About
- Contact
- Help Center
- Blogs
- Become a Partner
- Referral Program
- Locations
- Privacy Policy
- Terms of Service

**Course content links:** None visible in server HTML (loaded client-side)

---

## Technical Issues Summary

| Issue | Severity | Backlog Ref |
|-------|----------|------------|
| Meta description says "Texas" on Michigan page | 🔴 Critical | SITEWIDE-BACKLOG.md #2 |
| Title uses dash not pipe separator | 🟡 Medium | SITEWIDE-BACKLOG.md #1 |
| No schema whatsoever | 🔴 Critical | SITEWIDE-BACKLOG.md #5, #6 |
| H1 not visible to crawler (client-rendered) | 🔴 Critical | Per-page fix needed |
| Only 3 H2s (needs 6) | 🔴 Critical | Per-page fix needed |
| Content appears thin to crawlers | 🔴 Critical | SITEWIDE-BACKLOG.md #10 |
| Meta description only 68 chars | 🔴 Critical | Per-page fix needed |
| No breadcrumb | 🟡 Medium | SITEWIDE-BACKLOG.md #5 |
