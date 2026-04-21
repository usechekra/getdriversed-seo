# Tracked Competitors

Six competitors to run gap analysis against. NP|accel tracks the first three; we added the category leaders.

## NP|accel Tracked Set (from `Get Drivers Ed.pdf` Competitive Keyword Analysis slide)

| Competitor | Domain | Est. Monthly Organic | Page-1 Keywords | Total Keywords | Referring Domains | Total Links | Domain Authority |
|---|---|---|---|---|---|---|---|
| Get Drivers Ed (you) | getdriversed.com | 40.5K | 542 | 10.7K | 166 | 985 | 20 |
| DriveSafe Online | drivesafeonline.org | 88.8K | 2,900 | 31K | 2,800 | 22,800 | 34 |
| Texas Driving School | texasdrivingschool.com | 73.3K | 87 | 704 | 624 | 5,400 | 26 |
| CDL Online | cdl-online.com | 28.1K | 103 | 1,100 | 56 | 219 | 12 |

## Category Leaders (add to the tracked set per user request)

| Competitor | Domain | Strengths | Known URL Patterns |
|---|---|---|---|
| Aceable | aceable.com | Clean design, strong schema, heavy conversion optimization, video-heavy | `aceable.com/drivers-ed/[state]/` |
| DriversEd.com | driversed.com | Massive topical authority, state-specific depth, long-running brand | `driversed.com/[state]/` or `driversed.com/states/[state]/` |
| IDriveSafely | idrivesafely.com | SEO-mature, all-state coverage, adult drivers ed focus | `idrivesafely.com/[state]/drivers-ed/` |

## Gap-Analysis Quick Reference

When running `competitor-gap` skill, fetch these URLs for the equivalent course + state:

```
# Example for "online drivers ed Texas":
https://www.aceable.com/drivers-ed/texas/
https://driversed.com/states/texas/drivers-education
https://www.idrivesafely.com/texas/drivers-ed/
https://www.drivesafeonline.org/texas-drivers-ed-online
https://www.texasdrivingschool.com/
```

## Strength Profile per Competitor

**DriveSafe Online** — 5.4× your page-1 KW count. Edge: broader catalog, stronger backlink profile. Weakness: slower tech SEO evolution, dated design.

**Texas Driving School** — High traffic but weak KW depth (only 87 page-1 KWs). Strong on TX head terms, weak everywhere else. **Beatable in non-TX states.**

**CDL Online** — Smaller, CDL-focused. Not a direct threat on consumer drivers ed. Only run gap analysis against them for CDL-adjacent content.

**Aceable** — Strongest on schema, conversion optimization, and video content. Their pages are a gold standard for structure. **Steal their patterns.**

**DriversEd.com** — Strongest topical authority in the category. Their state hub pages are a masterclass in hub-and-spoke architecture. **Steal their internal linking patterns.**

**IDriveSafely** — Heavy on adult drivers ed. Good comparison target for adult-focused pages. Weak on teen content.

## What to Look For Per Competitor

When extracting gaps, always check for:

1. **H2 sections you don't have** (especially unique ones like "Frequently Asked Questions", "Course Pricing", "State Requirements", "Why Choose Us", "Student Testimonials")
2. **FAQ Qs you don't cover** — their FAQs reveal objections they've learned about
3. **Credential IDs they mention** (MV-278, TIPIC, DE-964, etc.)
4. **Agency acronyms used** (validate yours matches the state's real agency)
5. **Pricing transparency** (do they show prices above the fold? Featured in schema?)
6. **Trust signals** (testimonial count, years in business, DMV approval badges)
7. **Comparison tables** — vs in-person / vs DMV-direct / vs alternative courses
8. **Video content** (video demos boost dwell time significantly)
9. **Schema diversity** (do they have AggregateRating, Offer, Course beyond basic FAQPage)
10. **Internal link depth** (how many sibling course pages do they link to?)

## Running a Gap Analysis (quick version)

```
1. site:aceable.com "[primary keyword]"   → find equivalent page
2. Fetch that page
3. Extract H1, H2s, FAQ Qs
4. Diff against your page
5. Tag gaps as 🔴🟡🟢
```
