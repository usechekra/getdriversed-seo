# 🧠 SEO REQUEST ROUTER — PROJECT MEMORY

> **How to save this as memory in Claude Code:**
> 1. Open Claude Code in this repo
> 2. Type: `Read MEMORY.md and save it as project-level memory. Append it to CLAUDE.md so it persists across every session in this repo.`
> 3. Claude will confirm and the router activates.
>
> After that, you just talk normally. Claude routes the request to the right tier and delivers exactly what you asked for — nothing more, nothing less.

---

## THE CORE IDEA

You don't pick a workflow. You describe what you want. I route it.

Every SEO request falls into one of three **tiers** based on scope:

| Tier | Scope | Output |
|---|---|---|
| 🟢 **Tier 1 — Per Page (Dev Hand-off)** | A specific page or URL, to be implemented by devs | CMS-ready `dev-handoff.md` + schema.json + HTML |
| 🟡 **Tier 2 — Per Page (Research & Strategy)** | Background work on a specific page (for your decisions) | `brief.md`, `cluster.md`, `gap.md`, `score.md`, `optimization.md` |
| 🔵 **Tier 3 — Sitewide / Periodic** | Template fixes, monthly reports, quarterly audits | References to `SITEWIDE-BACKLOG.md` or generates reports |

Most requests are combinations. I figure out the mix from how you phrase it.

---

## 🔑 KEYWORD RESEARCH IS A UNIVERSAL INPUT (not a tier)

**Critical clarification:** Keyword research is not something that belongs only to Tier 2. It's an INPUT that informs almost every SEO deliverable:

- A **title tag** needs the primary keyword to rank for the right thing
- A **meta description** needs the primary + 1 secondary
- **H1 / H2 / H3** need primary + halo keywords distributed across them
- **Body copy** needs halo keywords + LSI terms woven in
- **FAQ questions** come from PAA research
- **Internal linking anchors** use keyword variations
- **Schema `name`/`headline`** uses the exact primary keyword

So when you paste a URL, keyword research happens AUTOMATICALLY as step 5 of the 10-step workflow — regardless of whether you're getting Tier 1 (dev hand-off), Tier 2 (research), or both. You don't need to ask for it separately.

The ONLY time you'd explicitly request keyword research alone is when you want the cluster **without** the downstream copywriting/schema/dev work. That's what "just research keywords for X" means — stop after step 5, don't continue to steps 6–10.

**Rule of thumb:** if you give me a URL and ask for anything that involves copy, meta, or schema, I've already done keyword research to produce it. It's baked in.

---

## 🚦 REQUEST ROUTING TABLE

When you say something like the left column, I deliver what's in the right column. I don't ask — I route and execute.

**Every row below that involves copy/title/meta/schema/dev-handoff includes keyword research as an input step.** Keyword research is only a standalone deliverable in the "Research only" section.

### Full-scope per-page work (Tier 1 + Tier 2) — KW research INCLUDED

| You say | I deliver |
|---|---|
| "Optimize this URL: {url}" | Full package — all 8 files in `pages/_in-progress/[slug]/` |
| "/optimize {url}" | Same |
| "Optimize the Texas drivers ed page" | Same (I infer URL from NP docs + site structure) |
| "Let's work on {page}" | Same |
| "Full optimization for {url}" | Same |
| "Run the complete workflow on {url}" | Same |

### Dev hand-off only (Tier 1 only — you already have the strategy)

⚠️ Note: even "dev hand-off only" requires keyword research as an input, because the dev hand-off contains title/meta/H1/body that depend on the keyword cluster. The difference is I skip producing the separate `keyword-cluster.md` file — I just USE the cluster to write the dev files. If research was already done (file exists in the folder), I read it; if not, I do the research but don't write a standalone research file.

| You say | I deliver |
|---|---|
| "Give me the dev hand-off for {url}" | Only `dev-handoff.md` + `schema.json` + `implementation.html` (KW research done internally, not saved as separate file) |
| "Write the dev ticket for {url}" | Same |
| "Create implementation-ready files for {url}" | Same |
| "What does my dev need to implement {url}?" | Same |

### Research only (Tier 2 only — no dev files yet)

This is where keyword research is the **final output**, not an input.

| You say | I deliver |
|---|---|
| "Research the keyword for {url or topic}" | `keyword-cluster.md` only |
| "Build me a keyword cluster for {seed}" | Same |
| "What should I target for {page}?" | Same |
| "Competitor gap for {url}" | `competitor-gap.md` only |
| "What are Aceable/DriversEd doing on {url}?" | Same |
| "Audit this page: {url}" | `score.md` + tech notes, no rewrite |
| "Score this page" | Same |
| "Just research, don't write copy yet" | Tier 2 files only, no `dev-handoff.md` or `implementation.html` |

### Single artifact only (narrow slice)

⚠️ These still require minimal keyword research internally to produce quality output — but the research isn't saved as a separate file. I compress steps 1–5 of the workflow into a quick inference and produce ONLY the requested artifact.

| You say | I deliver |
|---|---|
| "Just the title and meta for {url}" | Inline response, 3 variants each, no files (KW research done internally, not saved) |
| "Just the schema for {url}" | `schema.json` file only, no folder if none exists |
| "Just the FAQ for {url}" | FAQ block inline or in a small file (PAA research done internally) |
| "Write the H1/H2/H3 for {url}" | Inline header skeleton (KW placement inferred) |
| "Alt text for these images: {list}" | Alt text table inline (primary KW pulled from page or asked if ambiguous) |

### Content refresh (existing page, keep core, improve depth)

| You say | I deliver |
|---|---|
| "Refresh {url}" | Run the content-refresh skill — produces `audit.md` + `refresh.md` + updated `dev-handoff.md` |
| "This page is slipping, fix it" | Same |
| "Expand this thin content: {url}" | Same |

### Sitewide / template-level (Tier 3)

| You say | I deliver |
|---|---|
| "What sitewide issues do I have?" | Point to `SITEWIDE-BACKLOG.md`, summarize top 3 |
| "Give me the dev handoff for the duplicate meta issue" | Point to `SITEWIDE-BACKLOG.md` item #1, don't re-write it |
| "What should my devs work on first?" | Sprint 1 summary from `SITEWIDE-BACKLOG.md` |
| "Do a sitewide audit" | Run fresh audit, write `tracker/sitewide-audit-[date].md` |
| "Update the sitewide backlog" | Edit `SITEWIDE-BACKLOG.md` directly based on new info |

### Periodic reporting (Tier 3)

| You say | I deliver |
|---|---|
| "Monthly report" / "How did we do this month?" | Pull from `tracker/master-log.csv` + recent NP deliverables → write `tracker/report-[YYYY-MM].md` |
| "Quarterly SEO review" | Same but quarterly |
| "Which pages have been optimized?" | Summary from `tracker/master-log.csv` |
| "Show me progress on {state or page type}" | Filtered tracker query |

### Batch work

| You say | I deliver |
|---|---|
| "Work through the inbox" | Process each file in `pages/_inbox/` in order, move to `_in-progress/` |
| "Optimize all pages in /courses-details/arizona*" | Loop: fetch each, optimize, produce Tier 1 + Tier 2 per page |
| "Refresh these 10 pages: {list}" | Batch content-refresh |

---

## 📦 WHAT EACH TIER DELIVERS (exact file lists)

### Tier 1 — Dev Hand-off Files (what goes to devs)

Location: `pages/_in-progress/[slug]/` (create if needed)

| File | Purpose | Given to devs? |
|---|---|---|
| `dev-handoff.md` | ⭐ CMS-field-labeled spec — title, meta, URL, H1–H4, body copy by section, images, internal links, schema, breadcrumb, pre/post-deploy checklist | ✅ YES — this is THE file |
| `schema.json` | Ready-to-paste JSON-LD `@graph` block | ✅ YES |
| `implementation.html` | HTML reference / fallback | ✅ YES |

**Rule:** Never hand `optimization.md` or research files to devs. They're for YOU.

### Tier 2 — Research & Strategy Files (what you keep)

Location: same folder as Tier 1 above

| File | Purpose | Given to devs? |
|---|---|---|
| `brief.md` | Captured inputs, page type, state, intent | ❌ No |
| `current-state.md` | Snapshot of the live page (before changes) | ❌ No |
| `competitor-gap.md` | Gap analysis vs 2–3 competitors | ❌ No |
| `keyword-cluster.md` | 17 signals: primary + 5 halo + 6 LSI + 4–5 PAA | ❌ No |
| `optimization.md` | Detailed brief with full rationale, 3 title/meta variants, reasoning | ❌ No (for your reference) |
| `score.md` | Current + projected score + priority actions | ❌ No |

### Tier 3 — Sitewide & Periodic Files

Location: repo root or `tracker/`

| File | Purpose | Given to devs? |
|---|---|---|
| `SITEWIDE-BACKLOG.md` | ⭐ 10 template-level fixes in 3 sprints — the ONE sitewide dev handoff | ✅ YES (once, not per page) |
| `tracker/master-log.csv` | Running log of all optimized pages + status + positions | ❌ No (your tracking) |
| `tracker/report-[YYYY-MM].md` | Monthly/quarterly performance reports | 🟡 Optional (for stakeholders) |
| `tracker/sitewide-audit-[date].md` | Fresh sitewide audits when you ask for them | 🟡 Optional |

---

## 🎯 ROUTING DECISION TREE

When I receive a request, I walk this tree:

```
1. Is the request about a specific URL or page?
   ├─ YES → Go to step 2
   └─ NO  → Sitewide/periodic → go to step 5

2. Does the user want implementation-ready files? 
   (signals: "optimize", "dev hand-off", "implement", "ticket", "full workflow")
   ├─ YES → Tier 1 + Tier 2 (full package) → produce all 8 files
   └─ NO  → Go to step 3

3. Does the user want research/strategy only?
   (signals: "research", "keyword cluster", "gap", "audit", "score")
   ├─ YES → Tier 2 only → produce research files, NO dev-handoff.md
   └─ NO  → Go to step 4

4. Does the user want a single narrow artifact?
   (signals: "just the title", "just the schema", "just the FAQ")
   ├─ YES → Deliver inline or as single file, NO folder ceremony
   └─ NO  → Ask for clarification (rare)

5. Is the request about the whole site or template-level?
   (signals: "sitewide", "all pages", "template", "duplicate metas", "sprint")
   ├─ YES → Reference SITEWIDE-BACKLOG.md. Don't re-audit per page. Summarize what applies.
   └─ NO  → Go to step 6

6. Is the request about reporting/tracking?
   (signals: "this month", "quarterly", "progress", "how did we do")
   ├─ YES → Generate report from tracker/master-log.csv + recent NP docs
   └─ NO  → Ask briefly: "Is this a per-page request, sitewide, or reporting?"
```

---

## 🔒 ALWAYS-TRUE RULES (no matter which tier)

These apply to every output regardless of tier:

1. **Never invent data.** Flag `[ESTIMATE — validate in Ahrefs/SEMRush]` for every volume/KD/position number. Flag `[VALIDATE in PageSpeed Insights]` for every CWV metric.

2. **Cite Neil Patel source docs by filename** whenever you reference a pattern (e.g., "Per `Get Drivers Ed_Web Copy Refresh_New York.pdf`, the 6-H2 skeleton is…").

3. **Cannibalization check is mandatory** before recommending any new keyword (`site:getdriversed.com "[kw]"`).

4. **Never put external links on commercial pages.**

5. **`Organization` schema on homepage only.** Never on product/course pages.

6. **Title 50–60 chars, meta 140–155 chars. No exceptions.**

7. **Primary KW density 1.2–1.8%.** Run `scripts/keyword-density.py` to verify.

8. **Shippable threshold ≥ 85/100.** Flag prominently if projected score is below.

9. **Don't re-audit sitewide issues per page.** If a gap is in `SITEWIDE-BACKLOG.md`, reference it by item number. Don't write a new template fix in `optimization.md`.

10. **Keep Tier 1 and Tier 2 separate.** Dev files get only Tier 1. Research files stay internal.

---

## 📂 FOLDER CREATION RULE

Create a `pages/_in-progress/[slug]/` folder ONLY when the request actually needs persistent files:

**Create folder when:**
- Full optimization (Tier 1 + Tier 2)
- Dev hand-off only (Tier 1)
- Research only that produces multiple files (Tier 2)
- Refresh workflow

**Don't create folder when:**
- "Just the title" — respond inline
- "Just the schema" — single file, maybe in `pages/_in-progress/[slug]/` if it makes sense, or attach to conversation
- Sitewide question — reference existing files
- Quick question about the system — answer inline

Use good judgment. When in doubt, lean toward NOT creating ceremony files. Nobody wants to dig through folders with one file inside.

---

## 🗣️ ALWAYS END CHAT WITH

When you finish delivering, respond with a structured summary that matches the tier of work you did:

### For Tier 1 + Tier 2 (full optimization):

```
✅ Optimization complete for [PAGE NAME]

📈 Score: [X]/100 → [Y]/100  (+[delta])

🔴 Top 3 Critical Actions:
1. [action]
2. [action]
3. [action]

📁 Deliverables in pages/_in-progress/[slug]/
   ⭐ SEND TO DEVS:
   ├── dev-handoff.md
   ├── schema.json
   └── implementation.html
   
   🔒 KEEP INTERNAL:
   ├── brief.md
   ├── keyword-cluster.md
   ├── competitor-gap.md
   ├── optimization.md
   └── score.md

📌 Sitewide blockers: [list SITEWIDE-BACKLOG.md item numbers, or "none"]

❓ Ready to move to _completed/ when implemented, or iterate?
```

### For Tier 1 only (dev hand-off):

```
✅ Dev hand-off ready for [PAGE NAME]

📁 Files for your dev team:
   ├── dev-handoff.md
   ├── schema.json
   └── implementation.html

📂 Location: pages/_in-progress/[slug]/
```

### For Tier 2 only (research):

```
✅ Research complete for [PAGE NAME]

🎯 Primary keyword recommendation: [kw]
📊 Priority score: [X]/100
🔥 Top 3 halo opportunities: [list]
⚠️ Cannibalization risks: [list or "none"]

📁 Details in pages/_in-progress/[slug]/keyword-cluster.md (or other research file)
```

### For single artifacts:

Respond inline. No file ceremony. E.g.:

```
**Title variants** (pick one):

V1 (primary-match, recommended): [title] (57 chars)
V2 (benefit-led): [title] (55 chars)
V3 (authority-led): [title] (59 chars)

**Meta description variants:**

V1: [meta] (148 chars)
V2: [meta] (152 chars)
V3: [meta] (143 chars)
```

### For Tier 3 (sitewide/periodic):

```
📋 [Sitewide/Report topic]

[relevant summary from SITEWIDE-BACKLOG.md or tracker]

📁 Full detail in: SITEWIDE-BACKLOG.md (or tracker/report-[date].md)
```

---

## 🚫 DO NOT (common mistakes to avoid)

- ❌ Don't produce dev-handoff.md for a "just research" request — respect the scope
- ❌ Don't produce research files for a "just dev hand-off" request — assume strategy is already locked
- ❌ Don't re-run the whole workflow when user asks for ONE artifact
- ❌ Don't create empty folders for single inline responses
- ❌ Don't mix sitewide fixes into per-page dev hand-offs (devs should see ONE file: either `dev-handoff.md` for a page, or `SITEWIDE-BACKLOG.md` for sitewide — never both mashed together)
- ❌ Don't ask the user "which tier?" — infer from phrasing and execute
- ❌ Don't shorten outputs to save tokens when a full tier is requested — be thorough within scope, lean outside it
- ❌ Don't re-audit sitewide issues on every page optimization

---

## 📚 REQUIRED READS PER TIER

### Before any Tier 1 or Tier 2 per-page work:
- `references/np-accel-system.md`
- `references/sop-playbook.md`
- `references/header-skeleton.md`
- `references/keyword-formulas.md`
- `references/scoring-rubric.md`
- `SITEWIDE-BACKLOG.md` (to know what to NOT flag as per-page)

### Before schema work:
- `references/schema-reference.md`
- `templates/schema/*.json`

### Before competitor work:
- `references/competitors.md`

### Before dev hand-off generation:
- `templates/dev-handoff.md`

### Before sitewide/periodic work:
- `SITEWIDE-BACKLOG.md`
- `tracker/master-log.csv`
- Relevant Neil Patel docs in `neil-patel-docs/`

---

## 💬 HOW TO INVOKE (examples)

You should never need to memorize syntax. Just talk naturally:

| Natural phrasing | Tier routed | Files produced |
|---|---|---|
| "Optimize https://getdriversed.com/courses-details/texas-drivers-ed/en" | 1+2 | all 8 files |
| "I just need the title and meta for the CA drivers ed page" | narrow | inline response |
| "Give me the dev ticket for the Texas page" | 1 | 3 files, no research |
| "Research the keyword cluster for Arizona teen drivers ed" | 2 | cluster.md only |
| "What sitewide issues are blocking me?" | 3 | summary of backlog |
| "Do the full workflow on the 5 pages in my inbox" | 1+2 batch | 8 files × 5 pages |
| "Monthly report please" | 3 | report-[date].md |
| "Refresh the Florida drivers ed page" | 1+2 (refresh skill) | audit + refresh + updated dev files |
| "What's the JSON-LD for a blog post?" | narrow | inline response referencing template |
| "Write the schema for https://getdriversed.com/ohio-drivers-ed" | narrow (schema only) | schema.json only |

---

End of router. Save this to project memory and the routing is live.
