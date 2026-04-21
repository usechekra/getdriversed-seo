---
description: Run technical SEO audit on a page (crawlability, schema, breadcrumbs, images, CWV flags)
argument-hint: <URL to audit>
---

Read `.claude/skills/tech-audit/SKILL.md` and run the full technical audit for: $ARGUMENTS

Reference files to read first:
- `references/sop-playbook.md` (Section D)
- `references/schema-reference.md`

Use `scripts/fetch-page.sh` then `scripts/extract-meta.py` to pull the page data. Tag every issue 🔴/🟡/🟢 by severity. Output to `pages/_in-progress/[slug]/tech-audit.md`.
