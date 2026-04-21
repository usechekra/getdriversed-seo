# DEV HANDOFF PDF — Finalized Format Standard

**Established:** 2026-04-18  
**Reference page:** California Traffic School Online  
**Script:** `scripts/make-dev-pdf.py` (copy and adapt per page)

This is the approved, finalized format for the Developer Implementation Guide PDF.
Every future page optimization must produce a PDF matching this standard.

---

## Visual Design

| Element | Spec |
|---|---|
| Header bar | Navy (#1a1a2e), full width, 0.62 inch tall |
| Gold accent line | #f5c518, 0.04 inch, under header bar |
| Watermark | Smiley face PNG, centered, 30% opacity, every page |
| Logo | GDE logo PNG, top right in header bar |
| Page number | Gold, Helvetica-Bold 9pt, top right |
| Footer | "Get Drivers Ed — SEO Operations | Confidential" left · "getdriversed.com" right |
| Section headers | Navy2 (#2d2d5e) background, white Helvetica-Bold |
| Cover stats | 4 tiles: Current Score · Projected Score · Score Delta · Body Words Added |

---

## Section Order (6 sections)

### 1. Keywords
- **Gray header bar** spanning full width: "Keywords"
- **4-cell orange table:** Main Target Keyword | [value] | Secondary Keywords | [stacked list]
  - Orange color: #e07b00
- **Original Keywords:** label + bullet list (all secondary keyword variants)
- **Additional Keywords:** label + bullet list (LSI/additional terms)
- Note: keywords appear **bolded** in recommended copy below

### 2. Meta Data
- Title Tag → NP-style Current / Change To two-row table (red row / green row)
- Meta Description → same format
- Note under each explaining the rule/formula

### 3. Header Structure
- Two-column table: Current (red bg) | Recommended (green bg)
- Missing items shown in gray italic: `*(missing)*`
- CMS tag shown in monospace: `` `<H1>` ``, `` `<H2>` `` etc.
- Note if any existing headers need to be demoted (H2 → p)

### 4. Images
- Table: Image File | Current Alt Text | Recommended Alt Text
- Note explaining broken CMS variable if applicable

### 5. Structured Data (Schema)
- Table: current schema types vs recommended
- Note listing fields dev must fill in before pasting (price, license #)
- Full JSON-LD block in monospace

### 6. Web Copy
- Legend: Green = ADD · Orange = CHANGE · Gray = KEEP
- Full page shown in order, every element labeled
- **ADD block** (green): new content the dev must insert
- **CHANGE block** (orange): existing content + exact replacement
- **KEEP block** (gray): existing content, no change needed
- Keywords auto-bolded in all recommended copy

---

## Keyword Bolding Rule

All target keywords (primary + secondary + LSI) are automatically bolded in recommended
copy text. This lets the dev confirm placement at a glance without hunting.

Keywords are NOT bolded in:
- Section headings (bold=True)
- Monospace/code blocks
- KEEP blocks (existing content, no edits)

---

## Before/After Table Colors

| Row | Label bg | Value bg |
|---|---|---|
| Current | #c0392b (dark red) | #fff0f0 (light red) |
| Change To | #1b6b35 (dark green) | #f0fff4 (light green) |

---

## ADD / CHANGE / KEEP Badge Colors

| State | Badge bg | Content bg | Left border |
|---|---|---|---|
| ADD | #1b6b35 (green) | #f0fff4 | green |
| CHANGE | #d35400 (orange) | #fff4ee | orange |
| KEEP | #666677 (gray) | #f8f8f8 | gray |

---

## What NOT to Include in the Dev Handoff PDF

- ❌ Neil Patel / NP references
- ❌ Canonical URL section
- ❌ Breadcrumb section
- ❌ Internal links section
- ❌ Web Copy Checklist
- ❌ 3 variants of title/meta (ship V1 only)
- ❌ Research rationale or keyword scoring
- ❌ Competitor analysis

Those belong in `optimization.md` and `score.md` (your reference files), not the dev handoff.

---

## Script

Base script: `scripts/make-dev-pdf.py`

To adapt for a new page:
1. Copy the script to `/tmp/make-[slug]-pdf.py`
2. Update `BASE`, `OUT`, and all content strings
3. Update cover stats (current score, projected score, delta, word count)
4. Update `_TARGET_KWS` list with the new page's keyword cluster
5. Run: `python3 /tmp/make-[slug]-pdf.py`
6. Output lands in the page's `_in-progress/` folder
