import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasRole } from '@/lib/permissions'
import { Prisma } from '@prisma/client'

export async function POST() {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'MANAGER')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  try {
    const { getAnalyticsByDimension } = await import('@/lib/gsc')
    const siteUrl = process.env.GSC_SITE_URL ?? 'https://www.getdriversed.com/'

    const endDate = new Date()
    endDate.setDate(endDate.getDate() - 3)
    const end = endDate.toISOString().split('T')[0]

    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - 89)
    const start = startDate.toISOString().split('T')[0]

    // Single GSC API call — date dimension only (90 rows max, very fast)
    const rows = await getAnalyticsByDimension(siteUrl, start, end, ['date'], 90)

    if (rows.length > 0) {
      // Bulk upsert in one SQL query instead of N individual upserts
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

    await prisma.activity.create({
      data: { userId: session.user.id, action: 'gsc_sync', target: end, metadata: JSON.stringify({ synced: rows.length }) },
    })

    return NextResponse.json({ synced: rows.length, date: end })
  } catch (err) {
    console.error('GSC sync error:', err)
    return NextResponse.json({ error: 'Sync failed', detail: String(err) }, { status: 500 })
  }
}
