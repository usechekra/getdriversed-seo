# Page Brief — Content Refresh

> Use this when an EXISTING page just needs a refresh (not a full rewrite). Common triggers: slipping rankings, new competitor content outranking you, thin content flags from audit, stale dates.
> Save to `pages/_inbox/[slug]-refresh.md`.

## Required Fields

**URL:** 

**Current primary keyword (already ranking for):** 

**Why does this page need a refresh?** (pick all that apply)
- [ ] Rankings slipped
- [ ] Competitor outranked us
- [ ] Thin content (< 1,200 words on course page)
- [ ] Missing halo keywords from NP research
- [ ] Missing FAQ section or < 5 Qs
- [ ] Missing schema
- [ ] Missing internal links
- [ ] Stale dates (last-modified > 12 months)
- [ ] Image alts missing
- [ ] Other: ___

## Optional Fields

**Current ranking (paste from GSC if you have it):**
- Primary KW position: 
- Top 3 queries: 
- Queries dropping in last 30d: 

**Known gaps from audit or NP recommendations:**
```
(paste any NP|accel findings specific to this page)
```

**Off-limits changes:**
- URL change: OK / NOT OK
- Product name changes: OK / NOT OK
- Pricing references: OK / NOT OK
- Legal/compliance phrases that must stay verbatim: ___

**Expansion priorities (rank):**
- [ ] Add "Shedding More Light" H2
- [ ] Expand FAQ
- [ ] Expand Outcomes
- [ ] Add comparison block
- [ ] Add credential-specific detail
- [ ] Fix readability
- [ ] Other: ___

## Workflow

```
/refresh <this-url>
```

Claude runs the 10-point pre-refresh scorecard, identifies gaps, expands content without cannibalization, re-scores. Output to `pages/_in-progress/[slug]/` with `audit.md`, `refresh.md`, `score.md`.
