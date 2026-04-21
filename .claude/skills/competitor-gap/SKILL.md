---
name: competitor-gap
description: Run a competitor gap analysis for a Get Drivers Ed page — compare against DriveSafe Online, Texas Driving School, CDL Online, Aceable, DriversEd.com, IDriveSafely to find content gaps, keyword gaps, and structural advantages. Use when the user asks "what are competitors doing for X", "find me gaps vs [competitor]", or wants ammunition before a big rewrite. Output lives in pages/_in-progress/[slug]/competitor-gap.md.
---

# Skill: Competitor Gap Analysis

Use this when the user wants to know where competitors beat them or where they can beat competitors — without running a full optimization.

## Before You Start

Read `references/competitors.md` for URL patterns.

## Inputs Required

- Either: your target URL + primary KW
- Or: primary KW alone (I'll find the equivalent competitor pages)

## Workflow

### Step 1: Identify Competitor Pages

For the given state+course combo, find the equivalent page on each of the 6 tracked competitors:

1. **DriveSafe Online** — drivesafeonline.org
2. **Texas Driving School** — texasdrivingschool.com
3. **CDL Online** — cdl-online.com
4. **Aceable** — aceable.com
5. **DriversEd.com** — driversed.com
6. **IDriveSafely** — idrivesafely.com

Use Google site search: `site:aceable.com "[primary keyword]"` to find their equivalent page.

Pick the 2–3 most-relevant (same state + same course type). Not all 6 will have an exact match.

### Step 2: Fetch Each Competitor Page

For each, extract and record:
- H1
- H2 list
- Word count estimate
- FAQ questions (verbatim)
- Schema types used
- Above-fold content focus (benefits / price / social proof / authority)
- Unique sections (like comparison tables, pricing tables, video modules)
- Specific phrases and keywords they use

### Step 3: Fetch Your Equivalent Page

Same extraction for the Get Drivers Ed page.

### Step 4: Build the Gap Matrix

Create a table:

| Feature | Get Drivers Ed | DriveSafe | Aceable | DriversEd.com | Gap? |
|---|---|---|---|---|---|
| Word count | | | | | |
| H2 count | | | | | |
| FAQ count | | | | | |
| Has pricing table | | | | | |
| Has video | | | | | |
| Has comparison block | | | | | |
| Has testimonials | | | | | |
| Has state-specific credential info | | | | | |
| Schema: Course | | | | | |
| Schema: AggregateRating | | | | | |
| Schema: FAQPage | | | | | |
| Schema: Breadcrumb | | | | | |
| Uses state agency acronym | | | | | |

### Step 5: Extract Three Gap Types

**Content gaps** — sections competitors have that you don't. Rank by frequency (if 3/3 competitors have it, priority HIGH).

**Keyword gaps** — phrases/nouns competitors use that you don't. Look especially for:
- Credential IDs (MV-278, DE-964, TIPIC)
- Specific agency names (DMV vs BMV vs DOL vs MVD)
- Age-specific framing (teen, adult, senior)
- Format-specific framing (online, virtual, self-paced, instructor-led)

**Structural wins to steal** — design/UX patterns that work (sticky CTA, pricing table above fold, video demo, progress tracker).

**Structural losses to beat** — where competitors are weak (thin FAQs, no schema, bad mobile).

### Step 6: Prioritize Fixes

For each gap, tag:
- 🔴 High impact, low effort (add this week)
- 🟡 Medium impact, medium effort (add this month)
- 🟢 Low impact or high effort (park)

### Step 7: Deliver

Write `pages/_in-progress/[slug]/competitor-gap.md`:
1. One-paragraph summary
2. Gap matrix table
3. Top 10 gap keywords with methodology tag (Competitor)
4. Top 5 content sections to add
5. Prioritized action list

### Step 8: Summarize

Chat response:
- Biggest content gap
- Biggest keyword gap
- Quickest win
- Pointer to the full file
