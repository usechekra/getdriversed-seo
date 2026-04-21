# GDE SEO Operations Portal

Internal portal for the Get Drivers Ed SEO team. Built with Next.js 15, Prisma 7, PostgreSQL, and NextAuth v5.

## Quick Start

### 1. Install dependencies
```bash
cd portal && npm install
```

### 2. Set up environment
```bash
cp .env.example .env.local
# Edit .env.local — fill in DATABASE_URL
```

### 3. Get a Postgres database
**Railway (recommended):** New Project → Add PostgreSQL → copy DATABASE_URL from Variables tab → paste into .env.local

### 4. Migrate + seed
```bash
npm run setup
# Runs: prisma generate → prisma db push → seed
# Prints a one-time admin password — save it
```

### 5. Run dev server
```bash
npm run dev  # → http://localhost:3000
```

## Commands
| Command | What it does |
|---|---|
| `npm run dev` | Start dev server |
| `npm run setup` | First-time DB setup + seed |
| `npm run db:push` | Push schema changes (no migration file) |
| `npm run db:seed` | Re-run seed script |
| `npm run db:studio` | Open Prisma Studio GUI |

## Brand Colors
- Primary: `#385FF6` · Gradient end: `#9EAAFF`
- CSS utilities: `gde-gradient` · `gde-gradient-text`

## Deploy → Railway
See `DEPLOY.md` for full deployment instructions.
