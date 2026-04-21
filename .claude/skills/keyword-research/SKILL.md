---
name: keyword-research
description: Build a keyword cluster for a Get Drivers Ed page — primary keyword + 5 secondary + 6 LSI + 4–5 PAA questions following the NP|accel methodology. Use when the user wants keyword research only (without full page optimization), or when prepping a cluster before writing a new page. Output lives in pages/_in-progress/[slug]/keyword-cluster.md.
---

# Skill: Keyword Research Only

Use this when the user says things like "research keywords for X", "build me a cluster for Y", or "what should I target for the Nevada teen drivers ed page."

## Before You Start

Read `references/keyword-formulas.md` and `references/competitors.md`.

## Inputs You Need

- Seed keyword OR page URL
- State (if applicable)
- Page type
- Intent (commercial / informational / transactional)

## Workflow

### Step 1: SERP Analysis
Search the seed in Google. Capture:
- Top 10 URLs and their page types
- PAA questions (screenshot or list)
- SERP features (Featured Snippet, AI Overview, Shopping, Local Pack)
- What format wins the Featured Snippet (list/para/table)

### Step 2: Build the 1 + 5 + 6 + 4–5 Cluster

**Primary keyword** — exact match to page's commercial intent.
- Volume: `[ESTIMATE — validate in Ahrefs/SEMRush]`
- KD: `[ESTIMATE]`
- Intent: [tag]
- Methodology: [Top Traffic Driving / Striking Distance / Competitor / Wishlist]

**Secondary keywords (5)** — generate using these techniques:
- Rearrange word order
- State nickname/abbreviation swap (New York → NYC, NY)
- Agency acronym injection (DMV / BMV / DOL / MVD depending on state)
- Qualifier drop (remove "online", "course", etc.)
- Class/course/program swap

**LSI / Additional keywords (6)** — topical nouns drawn from this standard pool, customized to the state:
- `final exam`, `driver license`, `safe driving`, `traffic laws`, `defensive driving`
- `road test`, `schedule your road test`, `learner's permit`, `permit test`, `practice hours`
- `DMV requirements` (match state's actual agency)
- `state-approved`, `certificate of completion`
- State-specific credential IDs (MV-278 for NY, TIPIC for OH, DE-964 for DE)

**PAA questions (4–5)** — directly from the SERP. Keep only commercial-adjacent or objection-handling Qs. Reject pure-news or tangential Qs.

### Step 3: Tag Every Keyword

For each entry, fill in:
- Methodology
- Intent
- Volume estimate (flagged)
- KD estimate (flagged)
- Current ranking URL on getdriversed.com (run `site:getdriversed.com "[kw]"` logic)
- Cannibalization risk: YES/NO

### Step 4: Cannibalization Check

For each keyword, check if another URL on getdriversed.com already ranks. If yes, flag it and suggest: consolidate, differentiate, or leave alone.

### Step 5: Competitor Gap

Per `references/competitors.md`, pick 2 competitors and fetch their equivalent page. Extract phrases they target that yours doesn't. Add these to the cluster with the `Competitor` methodology tag.

### Step 6: Priority Score

Use the formula from `references/sop-playbook.md` Section A.5:
```
Priority = (Volume × 0.3) + (Intent × 0.3) + (DifficultyInverse × 0.2) + (BusinessValue × 0.2)
```

Output the top 5 keywords ranked by priority.

### Step 7: Write the Deliverable

Create or update `pages/_in-progress/[slug]/keyword-cluster.md` using `templates/page-briefs/keyword-cluster.md` as the structure.

### Step 8: Summarize

Chat response:
- The primary keyword recommendation + why
- Top 3 halo keywords with highest priority
- Biggest cannibalization risk (if any)
- Biggest competitor gap opportunity
- Pointer to the full file
