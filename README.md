# Get Drivers Ed — SEO Operations Repo

Your full SEO system as a Claude Code project. Reverse-engineered from Neil Patel Digital deliverables, operationalized into a repeatable framework you can run across hundreds of state and course pages.

## Quick Start

### 1. Install Claude Code

```bash
# If you haven't already
npm install -g @anthropic-ai/claude-code

# Or via the macOS installer / other methods — see docs.claude.com
```

### 2. Clone or copy this repo to your machine

```bash
git clone <your-repo-url>  # or just move the folder
cd getdriversed-seo
```

### 3. Add your Neil Patel PDFs

Drop them in `neil-patel-docs/` (the audits, keyword research, content refresh docs, performance decks). Claude Code will reference them when needed.

### 4. Launch Claude Code

```bash
cd getdriversed-seo
claude
```

Claude automatically reads `CLAUDE.md` on startup — it'll know your business context, the NP|accel system, and all the rules.

### 5. ⭐ Save the request router as project memory (one-time, takes 5 seconds)

In Claude Code, say:

```
Read MEMORY.md and save it as project-level memory. Append it to CLAUDE.md so it persists across every session in this repo.
```

Claude confirms → done. Now every future request is auto-routed to the right tier of work. You don't have to pick a workflow or memorize slash commands.

### 6. Optimize your first page — just talk naturally

```
optimize https://getdriversed.com/courses-details/texas-drivers-ed/en
```

```
I just need the title and meta for the California drivers ed page
```

```
refresh the Florida pre-licensing course page
```

```
research keywords for Arizona teen drivers ed
```

```
what sitewide issues do I have?
```

Claude reads what you're asking for, routes to the right tier (dev hand-off / research / sitewide / refresh), and delivers exactly that — nothing more, nothing less. See `MEMORY.md` for the full request → output lookup table.

## Routing at a Glance

Three tiers of work. Claude picks based on your phrasing:

| Tier | When it runs | What it produces |
|---|---|---|
| 🟢 **Tier 1 — Dev hand-off** | "optimize [url]", "dev ticket for [url]" | `dev-handoff.md` + `schema.json` + `implementation.html` for devs |
| 🟡 **Tier 2 — Research & strategy** | "research keywords for X", "competitor gap for Y" | Research files (cluster, gap, score) for YOU |
| 🔵 **Tier 3 — Sitewide / periodic** | "what sitewide issues do I have?", "monthly report" | References `SITEWIDE-BACKLOG.md` or writes tracker reports |

Full "optimize" = Tier 1 + Tier 2 together. Narrow requests ("just the title") skip all file ceremony and respond inline.

## Slash Commands

| Command | What It Does |
|---|---|
| `/optimize <URL or keyword>` | Full end-to-end page optimization |
| `/refresh <URL>` | Content refresh only (no full rewrite) |
| `/keywords <seed>` | Keyword cluster build only |
| `/audit <URL>` | Technical SEO audit only |
| `/gap <URL or keyword>` | Competitor gap analysis |

Or just ask in plain English — Claude will pick the right skill.

## Repo Structure

```
getdriversed-seo/
├── CLAUDE.md                         ← auto-loaded by Claude Code every session
├── MEMORY.md                         ⭐ ← the REQUEST ROUTER (save to memory once)
├── README.md                         ← this file
├── WORKFLOW.md                       ← one-page cheat sheet (pin this)
├── SITEWIDE-BACKLOG.md               ⭐ ← ONE-TIME dev handoff for 10 sitewide issues
│
├── .claude/
│   ├── skills/                       ← workflow definitions Claude reads
│   │   ├── optimize-page/SKILL.md
│   │   ├── keyword-research/SKILL.md
│   │   ├── content-refresh/SKILL.md
│   │   ├── tech-audit/SKILL.md
│   │   └── competitor-gap/SKILL.md
│   └── commands/                     ← slash commands
│       ├── optimize.md
│       ├── refresh.md
│       ├── keywords.md
│       ├── audit.md
│       └── gap.md
│
├── references/                       ← extracted NP|accel system
│   ├── np-accel-system.md            ← the reverse-engineered system (Phase 1)
│   ├── sop-playbook.md               ← full SOP (Phase 2)
│   ├── header-skeleton.md            ← 6-H2 template for state course pages
│   ├── keyword-formulas.md           ← title/meta/URL/placement rules
│   ├── schema-reference.md           ← JSON-LD stacks per page type
│   ├── scoring-rubric.md             ← 100-point scoring system
│   ├── competitors.md                ← 6 tracked competitors + patterns
│   └── sitewide-issues.md            ← (legacy — see SITEWIDE-BACKLOG.md instead)
│
├── templates/
│   ├── dev-handoff.md                ⭐ ← the ONE file devs get per page
│   ├── page-briefs/
│   │   ├── state-course-page.md      ← brief for course page optimizations
│   │   ├── blog-post.md              ← brief for blog posts
│   │   ├── content-refresh.md        ← brief for refresh-only work
│   │   ├── keyword-cluster.md        ← blank cluster template
│   │   └── optimization-output.md    ← format for detailed brief (your reference)
│   ├── schema/
│   │   ├── state-course-page.json    ← Course + FAQ + Breadcrumb
│   │   ├── homepage.json             ← Organization + WebSite
│   │   ├── blog-post.json            ← Article + FAQ + Breadcrumb
│   │   └── hub-page.json             ← CollectionPage + Breadcrumb
│   └── html/
│       └── implementation-block.html ← full HTML block template
│
├── neil-patel-docs/                  ← drop your original PDFs here
│   └── README.md
│
├── pages/                            ← work-in-progress + completed pages
│   ├── _inbox/                       ← briefs waiting to be optimized
│   ├── _in-progress/[slug]/          ← active optimizations
│   └── _completed/[slug]/            ← shipped pages
│
├── scripts/
│   ├── fetch-page.sh                 ← curl wrapper with realistic UA
│   ├── extract-meta.py               ← parse title/meta/H1-H3/schema/alts
│   ├── keyword-density.py            ← check KW density vs targets
│   ├── validate-schema.py            ← validate JSON-LD against rules
│   └── README.md
│
└── tracker/
    └── master-log.csv                ← one row per optimized page
```

## Two-Tier Output System (important)

The repo is organized around **two types of work**:

### 🔵 Sitewide work — do ONCE, dev handoff is `SITEWIDE-BACKLOG.md`

Template-level fixes that affect ALL pages (duplicate metas, URL namespace, Organization schema cleanup, etc.). Devs work through this ONE file over 2–3 sprints. Not per-page.

### 🟢 Per-page work — do for every URL, dev handoff is `dev-handoff.md`

For each URL you optimize, Claude produces TWO classes of files:

**Tier 1 — What devs get (3 files):**
- `dev-handoff.md` — CMS-field-labeled, implementation-ready
- `schema.json` — JSON-LD block to paste
- `implementation.html` — HTML reference

**Tier 2 — What YOU keep (research + tracking):**
- `brief.md`, `current-state.md`, `competitor-gap.md`, `keyword-cluster.md` — research
- `optimization.md` — detailed brief with full rationale
- `score.md` — scoring + prioritized actions

Devs NEVER see Tier 2. It's your reference.

## How the Workflow Runs

Every optimization produces a dedicated folder under `pages/_in-progress/[slug]/` containing:

```
[slug]/
├── brief.md              ← captured inputs
├── current-state.md      ← what the live page looks like today
├── competitor-gap.md     ← gaps vs 2-3 competitors
├── keyword-cluster.md    ← primary + halo + LSI + PAA
├── optimization.md       ← title/meta/headers/body/FAQ (the main deliverable)
├── schema.json           ← ready-to-paste JSON-LD
├── implementation.html   ← full HTML block for your dev
└── score.md              ← current + projected score + action list
```

After you implement the changes, move the folder to `pages/_completed/[slug]/` and append an `IMPLEMENTED.md` with the deploy date. The master tracker tracks all this.

## Critical Rules (non-negotiable)

1. Always cite which Neil Patel doc a pattern came from
2. Every keyword volume/KD flagged `[ESTIMATE — validate]` (we don't have paid tool access)
3. Every CWV metric flagged `[VALIDATE in PageSpeed Insights]`
4. Cannibalization check mandatory — run `site:getdriversed.com "[kw]"` before adding any new KW
5. Shippable SEO score threshold: ≥ 85/100
6. No external links on commercial pages
7. `Organization` schema on homepage only

## Known Sitewide Issues (from NP|accel audit)

- **84% duplication rate** — 5,455 duplicate meta descriptions + 5,460 duplicate titles across 6,527 pages. **Template fix needed before per-page optimization compounds.**
- **URL namespace inconsistency** — both `/courses-details/[state]-[course]/en` and `/course/[course]/[state]` exist. Consolidate via 301s.
- **137 pages with low word count** — flag for expansion.
- **51 broken links + 279 redirected pages** — technical cleanup.

These sit at the top of your action list even before individual page optimizations.

## Getting More Out of This Repo

- **Add GSC exports** — when Claude asks for current ranking data, paste your GSC Performance export. Huge accuracy boost.
- **Add PageSpeed data** — paste PSI results when asked; removes `[VALIDATE]` flags on CWV.
- **Add support team insights** — top 3 questions support gets. These become killer FAQ content.
- **Review the master tracker weekly** — it's your shipping log.

## Updating the System

If Neil Patel (or your own learnings) reveal a better pattern:

1. Update the relevant `references/*.md` file
2. Update any `templates/*` that reference the old pattern
3. Commit
4. Next Claude Code session picks up the change automatically

## Support / Questions

This system was built as a replacement for an in-house SEO specialist. If Claude Code is giving you generic output instead of following the NP|accel system, your fix is almost always:
1. Confirm `CLAUDE.md` is in the repo root
2. Ask Claude: "Read `references/np-accel-system.md` first and follow it exactly"
3. Reference the specific skill: "Use the optimize-page skill"
