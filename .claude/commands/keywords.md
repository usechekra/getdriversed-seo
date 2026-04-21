---
description: Build a keyword cluster (primary + 5 halo + 6 LSI + 4-5 PAA) for a page or topic
argument-hint: <seed keyword or URL>
---

Read `.claude/skills/keyword-research/SKILL.md` and build a full keyword cluster for: $ARGUMENTS

Reference files to read first:
- `references/keyword-formulas.md`
- `references/competitors.md`

Use the 1 + 5 + 6 + 4-5 methodology from NP|accel. Every volume/KD number must be flagged `[ESTIMATE — validate]`. Run cannibalization check via `site:getdriversed.com` logic.

Output to `pages/_in-progress/[slug]/keyword-cluster.md` using `templates/page-briefs/keyword-cluster.md` as structure.
