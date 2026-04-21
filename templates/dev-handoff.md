# Dev Handoff — [Page Name]

> This is the ONE document your developers get per page. Everything here is implementation-ready.
> Background research (keyword cluster, competitor gap, SEO score) lives in the `_in-progress/[slug]/` folder for YOUR reference, not theirs.

---

## Page Info

| Field | Value |
|---|---|
| **Page URL** | {{URL}} |
| **Page type** | state-course-page / blog / hub |
| **State** | {{State}} |
| **Status** | Existing Page — REFRESH / NEW PAGE |
| **Primary keyword** | {{Primary KW}} |
| **Ticket ID** | {{if tracking in Jira/Linear}} |
| **Prepared by** | SEO (via Claude Code) |
| **Date** | {{YYYY-MM-DD}} |

---

## ⚙️ 1. Meta Tags (replace in CMS / template)

### `<title>`
```html
<title>{{OPTIMIZED_TITLE}}</title>
```
**Character count:** {{COUNT}}  (target 50–60 ✅)

### `<meta name="description">`
```html
<meta name="description" content="{{OPTIMIZED_META}}">
```
**Character count:** {{COUNT}}  (target 140–155 ✅)

### `<link rel="canonical">`
```html
<link rel="canonical" href="{{URL}}">
```

### `<meta name="robots">`
```html
<meta name="robots" content="index, follow">
```

### Open Graph + Twitter (if not already template-driven)
```html
<meta property="og:title" content="{{TITLE}}">
<meta property="og:description" content="{{META}}">
<meta property="og:url" content="{{URL}}">
<meta property="og:type" content="website">
<meta property="og:image" content="{{HERO_IMAGE_URL}}">

<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{TITLE}}">
<meta name="twitter:description" content="{{META}}">
<meta name="twitter:image" content="{{HERO_IMAGE_URL}}">
```

---

## 🔗 2. URL (only if changing)

**Current:** {{CURRENT_URL}}
**New:** {{NEW_URL}}
**301 Redirect needed:** YES / NO

If YES, add to redirect config:
```
{{CURRENT_URL}}  →  {{NEW_URL}}  (301)
```

---

## 📐 3. Page Structure (H1 / H2 / H3 / H4)

The complete header skeleton to rebuild in the CMS. Copy each `<h_>` and `<p>` tag into the appropriate CMS field.

```html
<h1>{{H1 — EXACT PRIMARY KEYWORD}}</h1>

<!-- NOTE: these two lines are <p>, NOT <h2>. Do not promote to headers. -->
<p class="trust-strip">See What Our Students Are Saying!</p>
<p class="promo-strip">Bundle & Save: Enhance Your Learning Experience!</p>

<section>
  <h3>Overview</h3>
  <!-- Body: see section 4 -->

  <h3>Outcomes</h3>
    <h4>Complete the {{Course Name}} with Get Drivers Ed</h4>
    <h4>Practice with Your Learner's Permit</h4>
    <h4>Schedule and Pass the Road Test</h4>
    <h4>Submit Required Documentation</h4>
    <h4>Pay the License Fees</h4>
    <h4>Receive Your License</h4>

  <h3>Eligibility</h3>
</section>

<h2>Who Can Take the {{Secondary KW variant}}?</h2>
<h2>Shedding More Light on This Course</h2>
<h2>Recommended Courses to Enhance Your Learning</h2>
<h2>Your Step-By-Step Guide to Getting Licensed</h2>
  <h3>1. Sign Up</h3>
  <h3>2. Get Your Learner's Permit</h3>
  <h3>3. Complete Practice Hours & Road Test Prep</h3>
  <h3>4. Earn Your {{State}} Driver's License</h3>
<h2>Why Should You Opt for This Course?</h2>
<h2>Frequently Asked Questions</h2>
  <h3>{{FAQ Q1 — contains primary KW}}</h3>
  <h3>{{FAQ Q2 — contains secondary KW}}</h3>
  <h3>{{FAQ Q3}}</h3>
  <h3>{{FAQ Q4}}</h3>
  <h3>{{FAQ Q5}}</h3>
```

---

## ✍️ 4. Body Copy (Content Team Task)

Each section below is marked with a status. The content team pastes the final text into the corresponding CMS field/block.

**Status legend:**
- `[KEEP]` — no change, leave as is
- `[REWRITE]` — replace existing content with text below
- `[NEW]` — section doesn't exist yet, add with text below

---

### Overview paragraph + bullets  [{{STATUS}}]
**CMS field:** Overview / Hero Description

{{Opening paragraph — contains primary KW in first sentence}}

- {{Benefit bullet 1}}
- {{Benefit bullet 2}}
- {{Benefit bullet 3}}
- {{Benefit bullet 4}}
- {{Benefit bullet 5}}
- {{Benefit bullet 6}}
- {{Benefit bullet 7}}
- {{Benefit bullet 8}}

---

### Outcomes section  [{{STATUS}}]

**H4: Complete the {{Course Name}} with Get Drivers Ed**
{{2–3 sentence description}}

**H4: Practice with Your Learner's Permit**
{{2–3 sentence description}}

**H4: Schedule and Pass the Road Test**
{{2–3 sentence description}}

**H4: Submit Required Documentation**
{{2–3 sentence description}}

**H4: Pay the License Fees**
{{2–3 sentence description}}

**H4: Receive Your License**
{{2–3 sentence description}}

---

### Who Can Take the {{Secondary KW}}?  [{{STATUS}}]

{{Lead paragraph}}

- {{Eligibility criterion 1}}
- {{Eligibility criterion 2}}
- {{Eligibility criterion 3}}

---

### Shedding More Light on This Course  [{{STATUS}}]

{{Paragraph 1 — contains 1–2 halo KWs + LSI terms}}

{{Paragraph 2 — contains 1 halo KW + LSI terms}}

{{Paragraph 3 — contains 1 halo KW + LSI terms}}

{{Paragraph 4 — closing context}}

---

### Your Step-By-Step Guide to Getting Licensed  [{{STATUS}}]

**1. Sign Up**
{{2-sentence description}}

**2. Get Your Learner's Permit**
{{2-sentence description}}

**3. Complete Practice Hours & Road Test Prep**
{{2-sentence description}}

**4. Earn Your {{State}} Driver's License**
{{2-sentence description}}

**CTA button:** [Review the {{State}} Course] → links to `{{STATE_COURSE_HUB_URL}}`

---

### Why Should You Opt for This Course?  [{{STATUS}}]

{{Paragraph 1 — DMV/BMV/DOL approval mention + value prop}}

{{Paragraph 2 — completion certificate mechanics + flexibility}}

---

### FAQ Section  [{{STATUS}}]

**Q1: {{Question containing primary KW}}**
{{40–80 word answer, leading with direct answer, mirroring question phrasing}}

**Q2: {{Question containing secondary KW — format/online}}**
{{40–80 word answer}}

**Q3: {{Question — duration}}**
{{40–80 word answer}}

**Q4: {{Question — coverage/topics}}**
{{40–80 word answer}}

**Q5: {{Question — legitimacy/approval}}**
{{40–80 word answer}}

{{Q6–Q10 if included}}

---

## 🖼️ 5. Image Recommendations (Design / Media Team Task)

| # | Position | File name | Alt text | Notes |
|---|---|---|---|---|
| 1 | Above-fold hero | `{{state-slug}}-{{course-slug}}-hero.webp` | {{Alt with primary KW}} | WebP format, eager load |
| 2 | Mid-body | `{{descriptor}}.webp` | {{Alt}} | Lazy load |
| 3 | FAQ section | `{{descriptor}}.webp` | {{Alt}} | Lazy load |

**Alt text formula used:** `[Descriptor: "Graphic of" / "Photo of"] [Subject] representing [Primary Keyword]`

**Technical image rules:**
- Format: WebP preferred, PNG/JPG acceptable
- Above-fold: `loading="eager"`, set explicit `width` + `height` (prevents CLS)
- Below-fold: `loading="lazy"`
- Above-fold max file size: 150 KB
- Below-fold max file size: 80 KB

Example HTML:
```html
<img
  src="/images/{{state-slug}}-{{course-slug}}-hero.webp"
  alt="{{ALT_TEXT}}"
  width="1200"
  height="600"
  loading="eager"
>
```

---

## 🔗 6. Internal Linking (Content Team Task)

Add these internal links to the page body. Each link's anchor text is exact — do not paraphrase.

| # | Anchor text | Destination URL | Where in the page |
|---|---|---|---|
| 1 | {{anchor}} | {{url}} | Overview section |
| 2 | {{anchor}} | {{url}} | Shedding More Light section |
| 3 | {{anchor}} | {{url}} | Recommended Courses H2 (part of course grid) |
| 4 | {{anchor}} | {{url}} | FAQ answer #_ |
| 5 | {{anchor}} | {{url}} | Step-By-Step CTA |

**Rules:**
- NO external links on this page (commercial pages keep link equity internal)
- No generic anchors ("click here", "learn more")
- Do not add more than 1 link per FAQ answer

---

## 🧬 7. JSON-LD Schema (Dev Task — paste into `<head>`)

Paste the following into a single `<script type="application/ld+json">` block in the page's `<head>`:

```json
{{PASTE FROM schema.json HERE}}
```

**Validation required before deploy:**
- [ ] Run through [Google Rich Results Test](https://search.google.com/test/rich-results) — must pass with no errors
- [ ] Confirm breadcrumb visible HTML matches `BreadcrumbList` schema exactly
- [ ] Confirm FAQ H3 questions match `FAQPage.mainEntity.name` values exactly
- [ ] If `Organization` schema is present on this page, REMOVE IT (belongs on homepage only)

---

## 🍞 8. Breadcrumb HTML (if not already template-driven)

```html
<nav aria-label="Breadcrumb">
  <ol class="breadcrumb">
    <li><a href="https://getdriversed.com/">Home</a></li>
    <li><a href="https://getdriversed.com/courses/">Courses</a></li>
    <li><a href="https://getdriversed.com/{{state-slug}}/">{{State}} Courses</a></li>
    <li aria-current="page">{{Course Name}}</li>
  </ol>
</nav>
```

**Must match `BreadcrumbList` schema exactly** — same order, same labels.

---

## ✅ 9. Pre-Deploy Checklist (Dev verifies before merging)

- [ ] Title tag matches spec (char count 50–60)
- [ ] Meta description matches spec (char count 140–155)
- [ ] Canonical points to self, absolute HTTPS URL
- [ ] `meta robots` = `index, follow`
- [ ] OG + Twitter tags present
- [ ] H1 present exactly once, matches primary keyword
- [ ] All H2s/H3s from spec present
- [ ] NO promo strips promoted to H2 (they stay as `<p>`)
- [ ] Body copy pasted into CMS per section status
- [ ] All images have alt text matching spec
- [ ] All 5+ internal links present with exact anchor text
- [ ] NO external links on page
- [ ] JSON-LD present in `<head>`, validates in Rich Results Test
- [ ] Breadcrumb HTML matches BreadcrumbList schema
- [ ] `Organization` schema NOT present on this page
- [ ] 301 redirect configured (only if URL changed)
- [ ] Sitemap regenerated post-deploy (if new URL)

---

## 📊 10. Post-Deploy Validation (SEO verifies after deploy)

- [ ] URL returns 200 in GSC URL Inspection tool
- [ ] Schema passes Google Rich Results Test on live URL
- [ ] PageSpeed Insights: LCP < 2.5s, INP < 200ms, CLS < 0.1
- [ ] Mobile-Friendly Test passes
- [ ] GSC submitted for re-indexing
- [ ] Tracker updated: `tracker/master-log.csv` — set `status` = `implemented`, `implementation_date` = today

---

## 📎 Related Files (reference only — not needed for implementation)

For context on WHY these changes are recommended:
- Keyword strategy and competitive research: `pages/_in-progress/{{slug}}/keyword-cluster.md`
- Competitor gap analysis: `pages/_in-progress/{{slug}}/competitor-gap.md`
- SEO score and priority actions: `pages/_in-progress/{{slug}}/score.md`

These are for YOUR reference, not the dev team's.

---

## ❓ Questions / Support

If anything is unclear, contact the SEO owner before implementing. Do NOT improvise copy or structure — the exact values in this document are engineered for keyword placement and schema consistency.
