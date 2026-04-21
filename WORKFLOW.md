# Claude Code Workflow Cheat Sheet

One-page reference for working in this repo. Pin this in your docs or print it.

## First-Time Setup (one time, 30 seconds)

```bash
cd getdriversed-seo
claude
```

Then, in Claude Code, say:
```
Read MEMORY.md and save it as project memory. Append to CLAUDE.md.
```

This activates the request router. After that, you just talk normally — Claude figures out what tier of work you want.

## Every Session After That

```bash
cd getdriversed-seo
claude
```

Claude auto-loads `CLAUDE.md` + `MEMORY.md` and is ready to route.

## Just Talk Normally — 3 Tiers

| Tier | When | Output |
|---|---|---|
| 🟢 **1 — Dev hand-off** | "optimize [url]", "dev ticket for [url]" | 3 dev files in `pages/_in-progress/[slug]/` |
| 🟡 **2 — Research** | "research [topic]", "gap for [url]", "just the keywords" | Research files for you |
| 🔵 **3 — Sitewide** | "sitewide issues", "monthly report" | References backlog + tracker |

Full optimize = Tier 1 + Tier 2 together.

## Still-Available Slash Commands (optional)

```
/optimize <url>      ← full workflow (same as just pasting URL)
/refresh <url>       ← content refresh
/keywords <seed>     ← Tier 2 only: keyword cluster
/audit <url>         ← Tier 2 only: technical audit
/gap <url>           ← Tier 2 only: competitor gap
```

Plain English works just as well. Router handles it.

## The 10-Step Full-Optimize Workflow (for reference)

When you trigger a full optimization, Claude runs:

```
1. Set up workspace → pages/_in-progress/[slug]/
2. Fetch live page → current-state.md
3. Fetch 2–3 competitors → competitor-gap.md
4. SERP analysis → extract PAA, features, intent
5. Build keyword cluster → 1 + 5 + 6 + 4–5 = 17 signals
6. On-page deliverables → optimization.md (title/meta/H1-H3/body/FAQ)
7. Technical audit → in optimization.md
8. Schema stack → schema.json
9. HTML implementation → implementation.html
9.5. ⭐ Dev hand-off → dev-handoff.md (the file for devs)
10. Score → score.md + update tracker/master-log.csv
```


## Folder Flow Per Page

```
pages/_inbox/                  ← you drop briefs here
  ↓
pages/_in-progress/[slug]/     ← Claude does the work here
  ↓ (after you implement)
pages/_completed/[slug]/       ← move it here; add IMPLEMENTED.md
```

## Per-Page Deliverables (always these 8 files)

```
pages/_in-progress/[slug]/
├── brief.md               ← captured inputs
├── current-state.md       ← live page snapshot
├── competitor-gap.md      ← gap vs 2–3 competitors
├── keyword-cluster.md     ← primary + halo + LSI + PAA
├── optimization.md        ← THE main deliverable (title/meta/H1-H3/body/FAQ)
├── schema.json            ← ready-to-paste JSON-LD
├── implementation.html    ← HTML block for dev
└── score.md               ← current + projected + 🔴🟡🟢 priorities
```

## The 3 Scripts You'll Actually Run

```bash
# Pull a page's HTML
./scripts/fetch-page.sh <URL> page.html

# Extract all SEO-relevant elements
python3 scripts/extract-meta.py page.html

# Check keyword density against body text
python3 scripts/keyword-density.py body.txt "primary kw" "halo 1" "halo 2"

# Validate a schema block
python3 scripts/validate-schema.py schema.json
```

## When to Use Which Reference File

| Reference | Read when |
|---|---|
| `references/np-accel-system.md` | Start of every session (Claude does this automatically) |
| `references/sop-playbook.md` | During any skill execution |
| `references/header-skeleton.md` | Building H1–H3 structure |
| `references/keyword-formulas.md` | Writing title/meta/placement |
| `references/schema-reference.md` | Building JSON-LD |
| `references/scoring-rubric.md` | Scoring any page |
| `references/competitors.md` | Running gap analysis |
| `references/sitewide-issues.md` | When a "page issue" is actually a template/CMS issue |

## Critical Rules (memorize these 7)

1. **Never invent data** — flag `[ESTIMATE]` or `[VALIDATE]`
2. **Cite NP|accel source docs** by filename for every pattern claim
3. **Cannibalization check mandatory** before adding any keyword
4. **Shippable score ≥ 85/100** — don't ship below that
5. **No external links on commercial pages**
6. **Organization schema on homepage only**
7. **Title 50–60 chars, meta 140–155 chars — no exceptions**

## Data Quality Ladder (quality drops if you skip)

Without these, quality drops from 100% → 75%:
- GSC Performance export (paste top 20 queries + positions)
- PageSpeed Insights LCP/INP/CLS numbers
- Ahrefs/SEMRush volume + KD for primary KW

You can work without them. Claude flags every missing input. But paste them when you have them.

## Batch Workflow (optimizing 10+ pages)

```
1. Drop 10 briefs in pages/_inbox/
2. Tell Claude: "Work through the inbox one by one, move completed ones to _completed/"
3. Claude runs 10 full optimizations in sequence
4. Review the tracker/master-log.csv for a summary
```

## Maintenance

Weekly:
- Review `tracker/master-log.csv` — are implemented pages actually moving?
- Update 30-day / 90-day position columns

Monthly:
- Add new NP|accel deliverables to `neil-patel-docs/`
- Tell Claude to update `references/np-accel-system.md` if patterns changed
- Review `references/sitewide-issues.md` — any items closed?

## Red Flags That Claude Is Going Off Track

If you see any of these in Claude's output, reset:
- Generic advice like "make sure your content is high-quality"
- Missing `[ESTIMATE]` flags on volume/KD numbers
- Skipped sections in `optimization.md`
- Title > 60 chars or meta > 155 chars
- External links on commercial course pages
- "You should also..." without a specific action
- Outputs shorter than the previous page's optimization

**Reset command:**
> "Go back to the NP|accel system in `references/np-accel-system.md` and apply it exactly. Don't improvise."
