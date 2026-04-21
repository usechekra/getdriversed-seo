import { getAnalyticsByDimension } from '@/lib/gsc'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const INTERVAL_MS = parseInt(process.env.GSC_SYNC_INTERVAL_MS ?? '') || 24 * 60 * 60 * 1000

// ── Auto-seed pages from meta.json files ─────────────────────────────────────
async function autoSeedPages() {
  try {
    const repoRoot = process.env.SEO_REPO_ROOT ?? path.resolve(process.cwd(), '..')
    const seoPagesDir = path.join(repoRoot, 'seo-pages')
    if (!fs.existsSync(seoPagesDir)) return

    const admin = await prisma.user.findFirst({ where: { role: 'ADMIN' }, select: { id: true } })
    if (!admin) return

    const stages = ['_in-progress', '_completed', '_inbox']
    let seeded = 0

    for (const stage of stages) {
      const stageDir = path.join(seoPagesDir, stage)
      if (!fs.existsSync(stageDir)) continue

      for (const slug of fs.readdirSync(stageDir)) {
        const metaPath = path.join(stageDir, slug, 'meta.json')
        if (!fs.existsSync(metaPath)) continue

        let meta: Record<string, unknown>
        try { meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) }
        catch { continue }

        if (!meta.url || !meta.slug) continue

        const data = {
          slug: String(meta.slug),
          primaryKeyword: String(meta.primaryKeyword ?? meta.slug),
          secondaryKeywords: meta.secondaryKeywords ? String(meta.secondaryKeywords) : null,
          pageType: String(meta.pageType ?? 'state-course-page'),
          state: meta.state ? String(meta.state) : null,
          status: (['QUEUED','IN_PROGRESS','COMPLETED'].includes(String(meta.status))
            ? String(meta.status) : 'IN_PROGRESS') as 'QUEUED' | 'IN_PROGRESS' | 'COMPLETED',
          scoreBefore: meta.scoreBefore != null ? Number(meta.scoreBefore) : null,
          scoreProjected: meta.scoreProjected != null ? Number(meta.scoreProjected) : null,
          wordCountBefore: meta.wordCountBefore != null ? Number(meta.wordCountBefore) : null,
          dateOptimized: meta.dateOptimized ? new Date(String(meta.dateOptimized)) : null,
          folderPath: String(meta.folderPath ?? `pages/${stage}/${slug}`),
          notes: meta.notes ? String(meta.notes) : null,
          ownerId: admin.id,
        }

        await prisma.page.upsert({
          where: { url: String(meta.url) },
          update: data,
          create: { url: String(meta.url), ...data },
        })
        seeded++
      }
    }

    if (seeded > 0) console.log(`[auto-seed] Seeded/updated ${seeded} page(s) from meta.json`)
  } catch (err) {
    console.error('[auto-seed] Failed:', err)
  }
}

async function runAutoSync() {
  try {
    const siteUrl = process.env.GSC_SITE_URL ?? 'https://www.getdriversed.com/'

    const endDate = new Date()
    endDate.setDate(endDate.getDate() - 3)
    const end = endDate.toISOString().split('T')[0]

    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 89)
    const start = startDate.toISOString().split('T')[0]

    const rows = await getAnalyticsByDimension(siteUrl, start, end, ['date'], 90)

    if (rows.length > 0) {
      const values = rows
        .filter(r => r.keys?.[0])
        .map(r => Prisma.sql`(gen_random_uuid()::text, ${new Date(r.keys![0])}::timestamp, ${r.clicks ?? 0}, ${r.impressions ?? 0}, ${r.ctr ?? 0}, ${r.position ?? 0}, now())`)

      await prisma.$executeRaw`
        INSERT INTO "GSCDailySummary" (id, date, clicks, impressions, ctr, position, "createdAt")
        VALUES ${Prisma.join(values)}
        ON CONFLICT (date) DO UPDATE SET
          clicks = EXCLUDED.clicks,
          impressions = EXCLUDED.impressions,
          ctr = EXCLUDED.ctr,
          position = EXCLUDED.position
      `
    }

    await prisma.systemSettings.upsert({
      where: { key: 'gsc_last_sync' },
      update: { value: new Date().toISOString() },
      create: { key: 'gsc_last_sync', value: new Date().toISOString() },
    })

    console.log(`[GSC auto-sync] Synced ${rows.length} days at ${new Date().toISOString()}`)
  } catch (err) {
    console.error('[GSC auto-sync] Failed:', err)
  }
}

// Auto-seed pages immediately on startup (fast, local filesystem scan)
autoSeedPages()

// GSC sync: run 30s after startup, then on the configured interval
setTimeout(() => {
  runAutoSync()
  setInterval(runAutoSync, INTERVAL_MS)
}, 30_000)
