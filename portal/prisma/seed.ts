import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { parse } from 'csv-parse/sync'
import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

// Auto-detect SQLite vs PostgreSQL and use the right adapter
const RAW_URL = process.env.DATABASE_URL ?? 'file:./prisma/dev.db'
const isSQLite = RAW_URL.startsWith('file:')
// Resolve relative file: paths to absolute
const DATABASE_URL = isSQLite
  ? `file:${path.resolve(__dirname, '..', RAW_URL.replace(/^file:\.?\/?/, ''))}`
  : RAW_URL

function createPrisma() {
  if (isSQLite) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaLibSql } = require('@prisma/adapter-libsql')
    const adapter = new PrismaLibSql({ url: DATABASE_URL })
    return new PrismaClient({ adapter })
  } else {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaPg } = require('@prisma/adapter-pg')
    const adapter = new PrismaPg({ connectionString: DATABASE_URL })
    return new PrismaClient({ adapter })
  }
}

const prisma = createPrisma()

type PageStatus = 'QUEUED' | 'IN_PROGRESS' | 'READY_FOR_DEV' | 'IMPLEMENTED' | 'COMPLETED' | 'ARCHIVED'
const REPO_ROOT = path.resolve(__dirname, '../../')

// ── Admin user ────────────────────────────────────────────────────────────────
async function seedAdmin() {
  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@getdriversed.com'
  const name  = process.env.SEED_ADMIN_NAME  ?? 'GDE Admin'
  const envPassword = process.env.SEED_ADMIN_PASSWORD

  const existing = await prisma.user.findUnique({ where: { email } })

  if (existing) {
    if (envPassword) {
      const passwordHash = await bcrypt.hash(envPassword, 12)
      await prisma.user.update({ where: { email }, data: { passwordHash } })
      console.log(`✅ Admin password updated: ${email}`)
    } else {
      console.log(`✅ Admin already exists: ${email}`)
    }
    return
  }

  const rawPassword = envPassword ?? crypto.randomBytes(10).toString('base64url')
  const passwordHash = await bcrypt.hash(rawPassword, 12)

  await prisma.user.create({
    data: { email, name, passwordHash, role: 'ADMIN' },
  })

  console.log(`\n✅ Admin user created`)
  console.log(`   Email:    ${email}`)
  console.log(`   Password: ${rawPassword}   ← SAVE THIS, shown once\n`)
}

// ── Pages from tracker CSV ────────────────────────────────────────────────────
async function seedPages() {
  const csvPath = path.join(REPO_ROOT, 'tracker/master-log.csv')
  if (!fs.existsSync(csvPath)) {
    console.log('⚠ tracker/master-log.csv not found — skipping pages seed')
    return
  }

  const raw = fs.readFileSync(csvPath, 'utf-8')
  const rows = parse(raw, { columns: true, skip_empty_lines: true }) as Record<string, string>[]

  const statusMap: Record<string, string> = {
    'in-progress': 'IN_PROGRESS',
    'ready-for-dev': 'READY_FOR_DEV',
    'implemented': 'IMPLEMENTED',
    'completed': 'COMPLETED',
    'queued': 'QUEUED',
    'archived': 'ARCHIVED',
  }

  let created = 0, skipped = 0
  for (const row of rows) {
    const url = row.url?.trim()
    if (!url) continue

    const slug = url.replace(/^https?:\/\/[^/]+\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '-') || 'unknown'

    const existing = await prisma.page.findUnique({ where: { url } })
    if (existing) { skipped++; continue }

    const status = statusMap[row.status?.toLowerCase()] ?? 'QUEUED'
    const completedSlug = `pages/_completed/${url.split('/').pop() ?? slug}`
    const inProgressSlug = `pages/_in-progress/${url.split('/').pop() ?? slug}`
    const folderPath = fs.existsSync(path.join(REPO_ROOT, completedSlug))
      ? completedSlug
      : inProgressSlug

    await prisma.page.create({
      data: {
        url,
        slug,
        primaryKeyword: row.primary_kw ?? '',
        pageType: row.page_type ?? 'state-course-page',
        state: row.state ?? null,
        status,
        scoreBefore: row.score_before ? parseInt(row.score_before) : null,
        scoreAfter: row.score_after ? parseInt(row.score_after) : null,
        dateOptimized: row.date_optimized ? new Date(row.date_optimized) : null,
        implementationDate: row.implementation_date ? new Date(row.implementation_date) : null,
        notes: row.notes ?? null,
        folderPath,
      },
    })
    created++
  }

  console.log(`✅ Pages: ${created} created, ${skipped} already existed`)
}

// ── Sitewide issues ───────────────────────────────────────────────────────────
async function seedSitewideIssues() {
  const existing = await prisma.sitewideIssue.count()
  if (existing > 0) {
    console.log(`✅ Sitewide issues already seeded (${existing} records)`)
    return
  }

  const issues = [
    { id: 1, title: 'Fix duplicate title tags (5,460 pages)', sprint: 1, severity: 'CRITICAL', effort: 'M', description: 'Template-level fix: apply formula [State] [Course Type] | Get Drivers Ed across all /courses-details/* pages.' },
    { id: 2, title: 'Fix duplicate meta descriptions (5,455 pages)', sprint: 1, severity: 'CRITICAL', effort: 'M', description: 'Template formula: Get Drivers Ed offers [primary_kw], designed for [benefit] to meet [agency] requirements. [CTA].' },
    { id: 3, title: 'Consolidate URL namespace (/course/ → /courses-details/)', sprint: 1, severity: 'CRITICAL', effort: 'M', description: '301 redirect all /course/* URLs to /courses-details/* equivalents. Update sitemap.' },
    { id: 4, title: 'Remove Organization schema from non-homepage pages', sprint: 1, severity: 'CRITICAL', effort: 'S', description: 'Organization schema belongs on / and /about only. Remove from all course/product pages.' },
    { id: 5, title: 'Add Breadcrumb schema sitewide', sprint: 2, severity: 'IMPORTANT', effort: 'S', description: 'Add BreadcrumbList JSON-LD + matching visible HTML to all page templates.' },
    { id: 6, title: 'Add Course + Offer + AggregateRating schema to course pages', sprint: 2, severity: 'IMPORTANT', effort: 'M', description: 'Full schema stack on state course pages: Course, Offer, AggregateRating (if real reviews exist).' },
    { id: 7, title: 'Batch-fix missing image alt text', sprint: 2, severity: 'IMPORTANT', effort: 'M', description: 'Crawl site, find all images with empty/broken alts, generate using formula: [Descriptor] [Subject] representing [Primary KW].' },
    { id: 8, title: 'Fix 51 broken links', sprint: 2, severity: 'IMPORTANT', effort: 'S', description: 'Update or remove 51 broken internal links found in NP|accel crawl.' },
    { id: 9, title: 'Collapse 279 redirect chains', sprint: 2, severity: 'IMPORTANT', effort: 'S', description: 'Collapse A→B→C chains to single-hop A→C redirects.' },
    { id: 10, title: 'Expand 137 thin-content pages (<500 words)', sprint: 3, severity: 'NICE-TO-HAVE', effort: 'L', description: 'Batch content-refresh on 137 thin pages. Prioritize course pages first.' },
    { id: 11, title: 'Core Web Vitals tune', sprint: 3, severity: 'NICE-TO-HAVE', effort: 'M', description: 'Run PSI on 10 sample pages, identify and fix LCP/INP/CLS issues at template level.' },
    { id: 12, title: 'Unblock 2 accidentally-blocked pages', sprint: 3, severity: 'NICE-TO-HAVE', effort: 'XS', description: 'Check robots.txt + meta robots. Unblock if accidental.' },
  ]

  await prisma.sitewideIssue.createMany({ data: issues })
  console.log(`✅ Sitewide issues seeded (${issues.length} records)`)
}

// ── California Traffic School page ───────────────────────────────────────────
async function seedCaliforniaPage() {
  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, email: true },
  })

  if (!admin) {
    console.log('⚠ No admin user found — skipping California Traffic School page seed')
    return
  }

  const page = await prisma.page.upsert({
    where: { url: 'https://getdriversed.com/courses-details/california-traffic-school/en' },
    update: {
      slug: 'california-traffic-school',
      primaryKeyword: 'California Traffic School Online',
      secondaryKeywords: 'california traffic school, online traffic school california, CA traffic school, DMV approved traffic school california',
      pageType: 'state-course-page',
      state: 'California',
      status: 'IN_PROGRESS',
      scoreBefore: 9,
      scoreAfter: null,
      scoreProjected: 93,
      wordCountBefore: 77,
      dateOptimized: new Date('2026-04-18'),
      folderPath: 'pages/_completed/california-traffic-school',
      ownerId: admin.id,
      notes: 'Dev handoff complete. Awaiting implementation. Fill CA DMV TVS license # and pricing in schema before deploying.',
    },
    create: {
      url: 'https://getdriversed.com/courses-details/california-traffic-school/en',
      slug: 'california-traffic-school',
      primaryKeyword: 'California Traffic School Online',
      secondaryKeywords: 'california traffic school, online traffic school california, CA traffic school, DMV approved traffic school california',
      pageType: 'state-course-page',
      state: 'California',
      status: 'IN_PROGRESS',
      scoreBefore: 9,
      scoreAfter: null,
      scoreProjected: 93,
      wordCountBefore: 77,
      dateOptimized: new Date('2026-04-18'),
      folderPath: 'pages/_completed/california-traffic-school',
      ownerId: admin.id,
      notes: 'Dev handoff complete. Awaiting implementation. Fill CA DMV TVS license # and pricing in schema before deploying.',
    },
  })

  console.log(`✅ California Traffic School page upserted: ${page.id}`)
  console.log(`   Owner: ${admin.email}`)
  console.log(`   Score: ${page.scoreBefore} → projected ${page.scoreProjected}`)
}

// ── Run ───────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Seeding GDE SEO Portal database…\n')
  await seedAdmin()
  await seedPages()
  await seedSitewideIssues()
  await seedCaliforniaPage()
  console.log('\n✅ Seed complete.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
