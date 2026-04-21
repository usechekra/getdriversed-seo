# Schema Markup Reference

The JSON-LD stacks required for each Get Drivers Ed page type. Every schema block must be validated in Google's Rich Results Test before shipping.

## Golden Rules

1. **Single `@graph` block per page** — wrap all schemas in one `<script type="application/ld+json">` element.
2. **`Organization` schema lives on the homepage ONLY.** Remove it from product/course pages if present. NP|accel explicitly recommended this removal on the NY page.
3. **Exact primary KW** in `name` or `headline` fields.
4. **`@id` for each entity** using the URL + fragment (e.g., `https://getdriversed.com/#organization`).
5. **Cross-reference entities** using `@id` (e.g., `provider: { "@id": "https://getdriversed.com/#organization" }`).

## Schema Stack Per Page Type

| Page Type | Required Schemas |
|---|---|
| State Course Page | `BreadcrumbList` + `Course` + `FAQPage` + `AggregateRating` (if reviews) + `Offer` |
| Homepage | `Organization` + `WebSite` (with `SearchAction`) |
| Hub / Category Page | `BreadcrumbList` + `CollectionPage` |
| Commercial Blog | `BreadcrumbList` + `Article` + `FAQPage` (if FAQ) |
| Informational Blog | `BreadcrumbList` + `Article` + `FAQPage` (if FAQ) |
| About Us | `BreadcrumbList` + `AboutPage` + `Organization` |

## Templates

All ready-to-customize schema templates live in `templates/schema/`:
- `templates/schema/state-course-page.json` — full stack for state course pages
- `templates/schema/homepage.json` — Organization + WebSite
- `templates/schema/blog-post.json` — Article + FAQPage + Breadcrumb
- `templates/schema/hub-page.json` — CollectionPage + Breadcrumb

## Course Schema Field Reference

The `Course` schema is the most important for state course pages. Fields to fill:

```json
{
  "@type": "Course",
  "name": "[EXACT PRIMARY KEYWORD]",
  "description": "[Meta description or expanded version]",
  "provider": {
    "@type": "Organization",
    "name": "Get Drivers Ed",
    "url": "https://getdriversed.com/",
    "@id": "https://getdriversed.com/#organization"
  },
  "courseCode": "[STATE_ABBR]-[COURSE_CODE]",
  "educationalLevel": "Beginner",
  "inLanguage": "en-US",
  "teaches": "[Primary topic, e.g., 'New York driver licensing, traffic laws, safe driving practices']",
  "coursePrerequisites": "[e.g., 'Must be 18 or older; New York resident']",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "courseWorkload": "PT5H"
  },
  "offers": {
    "@type": "Offer",
    "price": "[PRICE]",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock",
    "url": "[PAGE_URL]"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "[4.7]",
    "ratingCount": "[REAL COUNT]",
    "bestRating": "5",
    "worstRating": "1"
  }
}
```

**Critical:** `aggregateRating` must be backed by real reviews. If you don't have reviews → leave the field out. Fake aggregate ratings = Google penalty.

**`courseWorkload`:** ISO 8601 duration. `PT5H` = 5 hours. `PT24H` = 24 hours.

## FAQPage Schema Pattern

```json
{
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "[Exact question as it appears in H3]",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "[Exact answer text from body, HTML stripped]"
      }
    }
    // ... 4 more
  ]
}
```

**Rules:**
- Questions MUST match visible H3 text exactly
- Answers MUST match visible answer body exactly
- Minimum 2 Qs for FAQPage, but 5+ is the standard
- HTML in answers allowed but stripped to plain text by Google; keep answers clean

## BreadcrumbList Schema Pattern

```json
{
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://getdriversed.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Courses",
      "item": "https://getdriversed.com/courses/"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "New York Courses",
      "item": "https://getdriversed.com/new-york/"
    },
    {
      "@type": "ListItem",
      "position": 4,
      "name": "New York 5-Hour Online Pre-Licensing Course"
    }
  ]
}
```

**Rule:** Last item has no `item` URL (it's the current page). Visible breadcrumb HTML must match the schema exactly.

## Validation Checklist (before shipping any schema)

- [ ] Run in Google's Rich Results Test (search.google.com/test/rich-results)
- [ ] All required fields present
- [ ] No fake/inflated ratings
- [ ] Breadcrumbs match visible HTML
- [ ] FAQ Qs match visible H3s
- [ ] `@id` references are consistent
- [ ] Single `<script type="application/ld+json">` block per page
- [ ] Valid JSON (no trailing commas)
- [ ] URLs are absolute HTTPS
