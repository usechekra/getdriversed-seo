# Page Brief — State Course Page

> Copy this file to `pages/_inbox/[slug]-brief.md`, fill in the fields, and ask Claude to optimize.
> Minimum required: URL or (Primary KW + State + Page Type). Everything else improves output quality.

## Required Fields

**URL** (if existing page):
`https://getdriversed.com/courses-details/[slug]/en`

**OR Keyword + Page Type** (if new page):
- Primary keyword:
- State:
- Page type: state-course-page / license-info / blog-commercial / blog-informational / hub
- Intent: commercial / informational / transactional / mixed

## Optional Fields (improve output quality)

**Current GSC data (paste top 10 queries with position):**
```
query,impressions,clicks,ctr,position
```

**Current page performance:**
- Monthly organic sessions: 
- Current avg position for primary KW: 
- Top 3 ranking queries:

**Competitive context:**
- Known competitor pages for this KW:
- Which competitor do you want to beat first:

**Business context:**
- Specific angle to emphasize (teen / adult / price leadership / state authority): 
- Upsells to cross-link: 
- Known user objections from support team: 

**Technical context:**
- PageSpeed LCP/INP/CLS (if known): 
- Known tech issues: 

**Anything specific to flag/avoid:**
- 

## Workflow

Once this brief is saved, tell Claude:

> "Use the optimize-page skill on pages/_inbox/[this-file].md"

Or simpler:

> "Optimize this page: [paste URL]"

Claude will read this brief, fetch the live page, run the 10-step workflow, and deliver to `pages/_in-progress/[slug]/`.
