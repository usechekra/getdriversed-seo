# Scripts

Utility scripts for the SEO workflow. Claude Code should use these when they're faster than doing the same check manually.

## Available

### `fetch-page.sh`
Pulls a page's HTML with a realistic user-agent (bypasses basic bot-blocks).

```bash
./scripts/fetch-page.sh https://getdriversed.com/courses-details/ohio-drivers-ed/en page.html
```

Saves HTML to the given file. Use before running `extract-meta.py`.

### `extract-meta.py`
Parses an HTML file and prints:
- Title + length (flags if outside 50–60)
- Meta description + length (flags if outside 140–155)
- Canonical
- Full header structure (H1–H6)
- Schema types present (JSON-LD)
- Image count + alt coverage %
- Internal vs external link count
- Visible word count estimate

```bash
python3 scripts/extract-meta.py page.html
```

### `keyword-density.py`
Checks primary + halo keyword density against body text.

```bash
python3 scripts/keyword-density.py body.txt \
  "new york 5-hour online pre-licensing course" \
  "5 hour course online new york" \
  "nyc pre licensing course online"
```

Flags primary if outside 1.2–1.8%. Flags halos if 0 (missing) or >3 (overused).

### `validate-schema.py`
Validates a JSON-LD schema block against Get Drivers Ed rules (required fields, HTTPS URLs, FAQ structure, Breadcrumb positions, Organization placement).

```bash
python3 scripts/validate-schema.py pages/_in-progress/texas-drivers-ed/schema.json
```

Doesn't replace Google's Rich Results Test — always run that too before shipping.

## Dependencies

Python 3 standard library only. No `pip install` needed.

## Creating New Scripts

If you find yourself doing the same manual check more than twice, create a script for it. Add it here with usage instructions. Keep them small and composable — one check per script.
