# 🚀 BUILD PROMPT — Get Drivers Ed SEO Operations Portal

> **Save this as `portal/BUILD-PROMPT.md` in your SEO repo, then paste it into Claude Code to start the build.**

---

## CONTEXT

You are building a production-grade web portal for Get Drivers Ed's SEO operations team. This portal is the central hub for 5–10 team members to manage SEO optimizations, track performance via Google Search Console, download dev hand-off files, and submit new URLs for optimization.

The portal will be deployed publicly (e.g., `seo.getdriversed.com`) so the team can access it from anywhere. It integrates with the existing SEO system already built in this repo.

## BEFORE WRITING ANY CODE — READ THESE FILES

1. `CLAUDE.md` — understand the business context and folder structure
2. `MEMORY.md` — understand the request router and 3-tier system
3. `tracker/master-log.csv` — this is the data that seeds the portal
4. `templates/dev-handoff.md` — the file format for dev downloads
5. `SITEWIDE-BACKLOG.md` — the 12 sitewide issues that appear in the portal
6. `references/scoring-rubric.md` — the 100-point scoring that displays in the UI

After reading, confirm you understand the system before starting.

## TECH STACK (use exactly this — no substitutions)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Next.js 15 App Router + TypeScript** | SSR + React Server Components for fast page loads |
| Styling | **Tailwind CSS v4 + shadcn/ui** | Professional look, zero custom CSS needed |
| Database | **PostgreSQL** (Neon or Railway-hosted) | Production-ready, scales, works on serverless |
| ORM | **Prisma** | Type-safe queries, migrations, easy seeding |
| Auth | **NextAuth v5 (Auth.js)** with credentials provider | Username+password, bcrypt, RBAC |
| Charts | **Recharts** | React-native, looks clean, easy deltas |
| Icons | **Lucide React** | Matches shadcn aesthetic |
| Tables | **@tanstack/react-table** | Sortable/filterable/paginated |
| Forms | **react-hook-form + zod** | Type-safe validation |
| GSC API | **googleapis** npm package | Already connected in Claude Code — reuse credentials |
| File downloads | Stream from `pages/` folders | Don't duplicate files in DB |
| Deployment | **Railway** | One-click Postgres + app hosting |
| PDF export (reports) | **Puppeteer** via serverless function | Professional PDF output |
| Dark mode | **next-themes** | SaaS expectation in 2026 |

Create everything in a new folder: `portal/` inside the existing repo root. Do NOT modify anything outside `portal/` except:
- Reading from `tracker/master-log.csv`, `SITEWIDE-BACKLOG.md`, and `pages/` folders
- Writing updates back to `tracker/master-log.csv` when status changes
- Writing new submission briefs to `pages/_inbox/`

## DESIGN SYSTEM

Make it look like Linear, Vercel, or Stripe Dashboard — clean, dense, professional.

**Color scheme:** Neutral slate + a single accent color for primary actions. Use `slate` as the neutral palette and `emerald` as accent (evokes "passing score" and matches education vertical without being garish).

**Dark mode:** Required. Default to system preference.

**Typography:** Inter for UI, JetBrains Mono for code/numbers.

**Layout:**
- Persistent left sidebar with nav
- Topbar with search + user menu + theme toggle
- Content area with breadcrumbs
- Max width 1400px on desktop, full-width on mobile

**Components to use from shadcn/ui:**
- Card, Button, Input, Select, Table (via tanstack)
- Dialog, Sheet (for modals)
- Badge, Progress (for status + backlog progress)
- Tabs (for page detail view)
- Form (with react-hook-form integration)
- Toast (for success/error feedback)
- Skeleton (loading states)
- DropdownMenu, Avatar, Separator

**Delta indicator component** (you'll build this):
```
<DeltaBadge value={+23.5} label="impressions" />
// Renders: ↑ +23.5% (green) — impressions
```
Green for positive, red for negative, slate for zero/neutral.

## FEATURE SCOPE — PHASED BUILD

### PHASE 1 — Foundation (build and demo before moving on)

**Set up:**
- Next.js 15 app with TypeScript strict mode
- Tailwind + shadcn/ui initialized
- Prisma + PostgreSQL (start local with Docker Compose, will switch to Railway Postgres in deploy)
- Environment variables in `.env.local` with `.env.example` checked in
- Basic layout with sidebar nav + topbar + content area
- Theme toggle (light/dark/system)

**Auth:**
- Login page at `/login` with email + password
- NextAuth v5 credentials provider, bcrypt password hashing
- Middleware protecting all routes except `/login`
- Session includes user role for RBAC
- Logout functionality

**RBAC roles:**
- `ADMIN` — full access, user management, settings
- `MANAGER` — create/edit pages, approve submissions, view reports
- `CONTRIBUTOR` — submit URLs, view pages, download files
- `VIEWER` — read-only everywhere

**Database seed:**
- Script that reads `tracker/master-log.csv` and populates `pages` table
- Script that reads `SITEWIDE-BACKLOG.md` and populates `sitewide_issues` table
- Creates initial admin user (prompt for email/password at seed time)

**Demo checkpoint:** I log in as admin, see empty dashboard, can log out. Sidebar navigation visible but routes are placeholders.

### PHASE 2 — Pages Management

**Dashboard (`/`):**
- 5 metric cards: Total Optimized, In Progress, Queued, Avg Score, Sitewide Progress
- Recent activity feed (last 15 actions)
- Mini chart: pages optimized per week (last 8 weeks)
- Mini chart: average score trend (last 90 days)

**Pages table (`/pages`):**
- Pull from `pages` table (seeded from tracker.csv)
- Columns: URL (truncated + copy button), Primary KW, Page Type badge, State, Status badge (colored), Score Before → Score After (with delta badge), Date Optimized, Owner
- Sortable on every column
- Filterable by: Status, Page Type, State, Owner, Score range
- Search box (matches URL or primary KW)
- Pagination (25/50/100 per page)
- Row click → page detail
- Export filtered results as CSV button

**Page detail (`/pages/[slug]`):**
- Header: URL, primary KW, status badge, "Open Live Page" external link
- Tabs: Overview | Files | GSC Performance | History | Actions
- **Overview tab:**
  - Score breakdown card (9 components with progress bars for each)
  - Delta summary: "Score improved +23 points" with visual
  - Key stats: word count before/after, primary KW density, H2 count, internal link count
  - Keyword cluster preview (primary + top 5 halos)
- **Files tab:**
  - List of files in the page's folder (`pages/_in-progress/[slug]/` or `_completed/`)
  - Grouped into "⭐ Dev Hand-off" (dev-handoff.md, schema.json, implementation.html) and "🔒 Internal" (everything else)
  - Each file: name, size, last modified, "Preview" button (opens markdown in modal), "Download" button
  - Bulk download as .zip option
- **GSC Performance tab:** (detailed in Phase 4)
- **History tab:**
  - Timeline of all actions on this page: created, optimized, status changes, comments, implementations
- **Actions tab:**
  - "Mark Status" dropdown (admin/manager): Queued → In Progress → Ready for Dev → Implemented → Completed
  - "Move to Completed" button (only when status = Implemented)
  - "Trigger Re-optimization" button (admin only) — POSTs to an API route that logs the request (doesn't actually run Claude Code from the web, just flags it)
  - "Add Note" form — notes stored in history

### PHASE 3 — Submissions & Team Management

**Submit URL (`/submit`):**
- Form: URL (validated: must be getdriversed.com), Primary KW (optional), Priority (High/Medium/Low), Business Context (textarea), Why This Page Matters (textarea)
- On submit:
  - Creates a markdown file in `pages/_inbox/[slug]-brief.md` using the brief template, pre-filled with submitted values
  - Creates a `Submission` row in the DB
  - Sends email to admin (if SMTP configured — stub for now)
  - Shows success screen with next steps

**Inbox (`/inbox`):**
- Table of pending submissions
- Columns: URL, Primary KW, Priority, Submitted By, Submitted At, Status
- Admin/Manager can: Approve (creates `pages/_in-progress/` folder, moves inbox file), Reject (adds rejection reason), Reassign
- Approving triggers a creation of a `Page` row with status = IN_PROGRESS

**My Work (`/my-work`):**
- For any logged-in user, show pages assigned to them
- Filter: all mine / in progress / waiting my review / recently completed

**Team management (`/settings/team`)** — admin only:
- Table of all users
- Add user form (email, name, role, initial password — or "send email invite" if SMTP set up)
- Deactivate/reactivate users
- Reset password flow
- View user activity log

### PHASE 4 — GSC Integration (you already have credentials)

**GSC settings (`/settings/gsc`):**
- Display connected GSC property (getdriversed.com)
- Credentials status (connected ✅ or "Needs reconnect")
- Last sync timestamp
- "Sync Now" button (triggers the sync job)
- Sync schedule: daily at 2am UTC by default, configurable

**GSC data model:**
```prisma
model GSCSnapshot {
  id           String   @id @default(cuid())
  pageUrl      String
  date         DateTime
  query        String
  impressions  Int
  clicks       Int
  ctr          Float
  position     Float
  @@unique([pageUrl, date, query])
  @@index([pageUrl, date])
}
```

**Sync job (`scripts/sync-gsc.ts`):**
- Runs daily via cron (Railway's cron feature)
- For each URL in `pages` table, pulls last 1 day of GSC Search Analytics data
- Stores in `gsc_snapshots` table
- Logs sync to `activity_log`
- Handles API rate limits gracefully

**GSC Performance tab on Page Detail:**
- Top query table: Query, Impressions, Clicks, CTR, Position
- For each metric, show 4 deltas:
  - vs 7 days ago
  - vs 14 days ago
  - vs 30 days ago
  - vs 90 days ago
- Deltas rendered as DeltaBadge (↑ green / ↓ red / — slate)
- 4 line charts (impressions, clicks, CTR, position) for the last 90 days
- "Export GSC data as CSV" button

**Dashboard GSC additions:**
- Total organic clicks (last 30 days) with WoW delta
- Total impressions with delta
- Top 5 queries driving clicks (with position)
- Top 5 most-improved queries (biggest position gain last 30 days)

### PHASE 5 — Sitewide Backlog & Reports

**Sitewide (`/sitewide`):**
- Kanban-style board: 3 columns (Not Started, In Progress, Complete)
- Cards for each of the 12 sitewide issues from SITEWIDE-BACKLOG.md
- Drag to change status (admin/manager only)
- Click card → modal with full spec from the markdown
- Sprint grouping toggle
- Progress summary at top: "Sprint 1: 2/4 complete (50%)", etc.
- "Export as dev ticket" button on each card → downloads a markdown ticket

**Reports (`/reports`):**
- **Monthly Performance Report** — automatic, aggregated
  - Pages optimized this month
  - Score deltas
  - GSC totals (impressions, clicks, top queries)
  - Top 10 wins (biggest position improvements)
  - Top 5 losses (pages that dropped in rankings)
  - Export as PDF
- **Implementation Tracker** — pages by implementation date, time-to-implement stats
- **Score Leaderboard** — top 20 pages by score delta
- **Keyword Wins Report** — queries that moved into top 10 this month
- **Sitewide Progress Report** — backlog completion status

### PHASE 6 — Polish

- Loading skeletons on every data-dependent view
- Error boundaries with helpful error messages
- Empty states with CTAs ("No pages yet — submit your first URL")
- Keyboard shortcuts (`cmd+k` for quick search, `cmd+j` to submit URL)
- Toast notifications for all mutations
- Breadcrumb navigation on every page
- Mobile responsive (test on 375px width minimum)
- Accessibility: keyboard nav, focus states, ARIA labels
- Print styles for reports

## DATABASE SCHEMA (Prisma — complete)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String     @id @default(cuid())
  email        String     @unique
  name         String
  passwordHash String
  role         Role       @default(VIEWER)
  active       Boolean    @default(true)
  lastLogin    DateTime?
  createdAt    DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
  submissions  Submission[]
  activities   Activity[]
  assignedPages Page[] @relation("PageOwner")
}

enum Role {
  ADMIN
  MANAGER
  CONTRIBUTOR
  VIEWER
}

model Page {
  id                 String       @id @default(cuid())
  url                String       @unique
  slug               String       @unique
  primaryKeyword     String
  secondaryKeywords  String?      // JSON array
  pageType           String
  state              String?
  status             PageStatus   @default(QUEUED)
  scoreBefore        Int?
  scoreAfter         Int?
  scoreProjected     Int?
  wordCountBefore    Int?
  wordCountAfter     Int?
  dateOptimized      DateTime?
  implementationDate DateTime?
  position30d        Int?
  position90d        Int?
  notes              String?
  folderPath         String       // e.g., "pages/_in-progress/texas-drivers-ed"
  ownerId            String?
  owner              User?        @relation("PageOwner", fields: [ownerId], references: [id])
  createdAt          DateTime     @default(now())
  updatedAt          DateTime     @updatedAt
  gscSnapshots       GSCSnapshot[]
  history            PageHistory[]
  @@index([status])
  @@index([state])
  @@index([ownerId])
}

enum PageStatus {
  QUEUED
  IN_PROGRESS
  READY_FOR_DEV
  IMPLEMENTED
  COMPLETED
  ARCHIVED
}

model PageHistory {
  id        String   @id @default(cuid())
  pageId    String
  page      Page     @relation(fields: [pageId], references: [id], onDelete: Cascade)
  userId    String
  action    String
  fromValue String?
  toValue   String?
  note      String?
  createdAt DateTime @default(now())
  @@index([pageId, createdAt])
}

model GSCSnapshot {
  id          String   @id @default(cuid())
  pageId      String?
  page        Page?    @relation(fields: [pageId], references: [id])
  pageUrl     String
  date        DateTime @db.Date
  query       String
  impressions Int
  clicks      Int
  ctr         Float
  position    Float
  createdAt   DateTime @default(now())
  @@unique([pageUrl, date, query])
  @@index([pageUrl, date])
  @@index([date])
}

model Submission {
  id              String    @id @default(cuid())
  url             String
  primaryKeyword  String?
  priority        Priority  @default(MEDIUM)
  businessContext String?
  whyThisMatters  String?
  submittedById   String
  submittedBy     User      @relation(fields: [submittedById], references: [id])
  status          SubStatus @default(PENDING)
  rejectionReason String?
  createdAt       DateTime  @default(now())
  processedAt     DateTime?
  @@index([status])
  @@index([submittedById])
}

enum Priority { HIGH MEDIUM LOW }
enum SubStatus { PENDING APPROVED REJECTED IN_PROGRESS }

model SitewideIssue {
  id            Int         @id
  title         String
  description   String
  sprint        Int
  severity      String
  effort        String
  status        IssueStatus @default(NOT_STARTED)
  owner         String?
  dateStarted   DateTime?
  dateCompleted DateTime?
  notes         String?
  updatedAt     DateTime    @updatedAt
}

enum IssueStatus { NOT_STARTED IN_PROGRESS COMPLETE }

model Activity {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  action    String
  target    String?
  metadata  String?
  createdAt DateTime @default(now())
  @@index([createdAt])
  @@index([userId])
}

model SystemSettings {
  key       String   @id
  value     String
  updatedAt DateTime @updatedAt
  updatedBy String?
}
```

## GSC INTEGRATION DETAILS

Since Google Search Console is already connected in Claude Code, locate the existing GSC credentials (likely in `~/.config/claude-code/` or in an env var in this repo). Reuse them.

**Service account approach:**
1. Store GSC service account JSON in `portal/credentials/gsc-sa.json` (gitignored)
2. Path referenced via env var `GSC_CREDENTIALS_PATH`
3. On app start, load + validate credentials
4. Daily sync job authenticates + pulls data

**Files to create:**

```typescript
// portal/src/lib/gsc.ts
import { google } from 'googleapis'
import { readFileSync } from 'fs'

export async function getGSCClient() {
  const credentials = JSON.parse(
    readFileSync(process.env.GSC_CREDENTIALS_PATH!, 'utf-8')
  )
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  })
  return google.searchconsole({ version: 'v1', auth })
}

export async function getSearchAnalytics(
  siteUrl: string,
  pageUrl: string,
  startDate: string,
  endDate: string
) {
  const client = await getGSCClient()
  const response = await client.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['query'],
      dimensionFilterGroups: [{
        filters: [{
          dimension: 'page',
          operator: 'equals',
          expression: pageUrl,
        }],
      }],
      rowLimit: 500,
    },
  })
  return response.data.rows || []
}

// delta calc helper
export function calculateDelta(current: number, previous: number) {
  if (previous === 0) return { value: 0, percent: null, direction: 'flat' as const }
  const diff = current - previous
  const percent = (diff / previous) * 100
  return {
    value: diff,
    percent,
    direction: diff > 0 ? 'up' as const : diff < 0 ? 'down' as const : 'flat' as const,
  }
}
```

```typescript
// portal/src/scripts/sync-gsc.ts
// Runs daily. Pulls yesterday's GSC data for every page in the DB.
import { prisma } from '../lib/db'
import { getSearchAnalytics } from '../lib/gsc'

async function syncGSC() {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const date = yesterday.toISOString().split('T')[0]
  
  const pages = await prisma.page.findMany({ select: { id: true, url: true } })
  
  for (const page of pages) {
    try {
      const rows = await getSearchAnalytics(
        'sc-domain:getdriversed.com',
        page.url,
        date, date
      )
      for (const row of rows) {
        await prisma.gSCSnapshot.upsert({
          where: {
            pageUrl_date_query: {
              pageUrl: page.url,
              date: new Date(date),
              query: row.keys![0],
            },
          },
          update: {
            impressions: row.impressions!,
            clicks: row.clicks!,
            ctr: row.ctr!,
            position: row.position!,
          },
          create: {
            pageId: page.id,
            pageUrl: page.url,
            date: new Date(date),
            query: row.keys![0],
            impressions: row.impressions!,
            clicks: row.clicks!,
            ctr: row.ctr!,
            position: row.position!,
          },
        })
      }
      console.log(`✅ Synced ${page.url} — ${rows.length} queries`)
    } catch (err) {
      console.error(`❌ Failed ${page.url}:`, err)
    }
  }
}

syncGSC().then(() => process.exit(0))
```

## PROJECT STRUCTURE

```
portal/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # Dashboard
│   │   ├── login/page.tsx
│   │   ├── pages/
│   │   │   ├── page.tsx                # List
│   │   │   └── [slug]/page.tsx         # Detail
│   │   ├── submit/page.tsx
│   │   ├── inbox/page.tsx
│   │   ├── my-work/page.tsx
│   │   ├── sitewide/page.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   ├── monthly/page.tsx
│   │   │   ├── leaderboard/page.tsx
│   │   │   └── keywords/page.tsx
│   │   ├── settings/
│   │   │   ├── team/page.tsx
│   │   │   ├── gsc/page.tsx
│   │   │   └── profile/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── pages/route.ts
│   │       ├── submissions/route.ts
│   │       ├── gsc/sync/route.ts
│   │       ├── files/[slug]/[filename]/route.ts  # Stream files
│   │       └── reports/pdf/route.ts
│   ├── components/
│   │   ├── ui/                         # shadcn components
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── Breadcrumbs.tsx
│   │   ├── DeltaBadge.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── PageTable.tsx
│   │   ├── ScoreBreakdown.tsx
│   │   ├── GSCChart.tsx
│   │   ├── SitewideKanban.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── db.ts
│   │   ├── gsc.ts
│   │   ├── tracker-sync.ts            # Read/write tracker/master-log.csv
│   │   ├── file-reader.ts             # Stream files from pages/ folders
│   │   ├── permissions.ts             # RBAC helpers
│   │   └── utils.ts
│   └── scripts/
│       ├── sync-gsc.ts
│       ├── sync-tracker.ts            # Sync DB ↔ tracker.csv
│       └── seed-from-backlog.ts       # Seed sitewide issues from SITEWIDE-BACKLOG.md
├── public/
│   └── logo.svg                       # Use GDE branding if available, else neutral
├── .env.example
├── .env.local                         # gitignored
├── .gitignore
├── docker-compose.yml                 # Local Postgres for dev
├── railway.json                       # Railway deploy config
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json                    # shadcn config
├── README.md                          # Getting started
└── DEPLOY.md                          # Railway deployment guide
```

## DEPLOYMENT (Railway)

Include a `DEPLOY.md` with exact steps:

1. Install Railway CLI: `npm i -g @railway/cli`
2. `railway login`
3. `railway init` from the `portal/` directory
4. Add PostgreSQL: `railway add -s postgres` → Railway auto-sets `DATABASE_URL`
5. Set remaining env vars via Railway dashboard:
   - `NEXTAUTH_URL` — your portal domain
   - `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
   - `GSC_CREDENTIALS_PATH` — path to mounted secret file
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD` — for initial seed
6. Upload GSC service account JSON as a Railway secret file
7. `railway up` to deploy
8. Point `seo.getdriversed.com` CNAME to Railway's generated domain
9. Add cron job in Railway: `node dist/scripts/sync-gsc.js` daily at 2am UTC

## CRITICAL REQUIREMENTS

1. **Do NOT break the existing Claude Code CLI workflow.** The portal reads + writes to the same files (`tracker/master-log.csv`, `pages/`, `SITEWIDE-BACKLOG.md`). When portal writes happen, they should respect the file format already established.

2. **File downloads stream from disk.** When user clicks "Download dev-handoff.md," the API route reads `pages/_completed/[slug]/dev-handoff.md` from the filesystem and streams it. Do NOT duplicate files in the DB.

3. **Env vars documented in `.env.example`** — every secret and config.

4. **RBAC enforced at the API layer**, not just UI. A CONTRIBUTOR shouldn't be able to hit `/api/admin/users` even if they know the URL.

5. **All forms use zod + react-hook-form.** Type-safe end-to-end.

6. **All data fetches have loading states (skeletons) and error states (error boundaries).**

7. **Mobile responsive minimum 375px.** Test with Chrome DevTools device mode.

8. **Dark mode works properly** — no light-mode leaks in dark theme.

9. **Backup plan in DEPLOY.md** — how to dump + restore the Postgres DB.

10. **Initial load time < 2 seconds** for the dashboard.

## CLARIFYING QUESTIONS — ASK THESE BEFORE STARTING

Confirm these with me first:

1. **Brand colors:** Use Get Drivers Ed green? Or neutral slate + emerald accent? (Check `getdriversed.com` and match or stay neutral.)
2. **Initial admin credentials:** Should I prompt you for them during setup, or auto-generate and display once?
3. **Build phases in one go or checkpoint after each phase?** I recommend checkpointing after Phase 1, 2, 3 so you can test before we build more.
4. **Database location:** Railway Postgres (recommended, integrated) or Neon (free tier, external)?
5. **Cron for GSC sync:** Railway's built-in cron, or a GitHub Actions workflow? (Railway is simpler.)
6. **GSC property format:** Confirm the GSC property is `sc-domain:getdriversed.com` or a URL prefix property (affects API calls).
7. **Domain for the portal:** Do you want `seo.getdriversed.com` or a different subdomain? This affects NextAuth config.

## BUILD ORDER

Start by:
1. Reading the existing SEO repo files
2. Asking the 7 clarifying questions above
3. Waiting for my answers
4. THEN building Phase 1 (foundation + auth)
5. Stopping at the end of Phase 1 for a demo/checkpoint
6. Continue through phases only after I approve

Do NOT skip the clarifying questions. Do NOT try to build all 6 phases before I see Phase 1. Do NOT improvise away from the stack (no Supabase, no tRPC, no other frameworks — stick with what's specified).

Ready? Read the repo files first, then ask the 7 questions.
