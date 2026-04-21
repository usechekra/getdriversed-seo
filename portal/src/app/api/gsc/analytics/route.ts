import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') ?? '28')
  const since = new Date()
  since.setDate(since.getDate() - days)

  // Trend chart: use GSCDailySummary (accurate sitewide daily totals, supports 7/28/90d)
  const dailySummaries = await prisma.gSCDailySummary.findMany({
    where: { date: { gte: since } },
    orderBy: { date: 'asc' },
  })

  const byDate = dailySummaries.map(s => ({
    date: s.date.toISOString().split('T')[0],
    clicks: s.clicks,
    impressions: s.impressions,
  }))

  // Summary totals from daily summaries
  const totalClicks = dailySummaries.reduce((s, r) => s + r.clicks, 0)
  const totalImpressions = dailySummaries.reduce((s, r) => s + r.impressions, 0)
  const avgCtr = dailySummaries.length > 0 ? dailySummaries.reduce((s, r) => s + r.ctr, 0) / dailySummaries.length : 0
  const avgPosition = dailySummaries.length > 0 ? dailySummaries.reduce((s, r) => s + r.position, 0) / dailySummaries.length : 0

  // Top queries and pages: from GSCSnapshot (last 7 days, most recent data)
  const snapshotSince = new Date()
  snapshotSince.setDate(snapshotSince.getDate() - 7)

  const snapshots = await prisma.gSCSnapshot.findMany({
    where: { date: { gte: snapshotSince } },
    select: { pageUrl: true, query: true, impressions: true, clicks: true, ctr: true, position: true },
  })

  const queryMap = new Map<string, { clicks: number; impressions: number; ctrSum: number; posSum: number; count: number }>()
  for (const s of snapshots) {
    const ex = queryMap.get(s.query) ?? { clicks: 0, impressions: 0, ctrSum: 0, posSum: 0, count: 0 }
    queryMap.set(s.query, { clicks: ex.clicks + s.clicks, impressions: ex.impressions + s.impressions, ctrSum: ex.ctrSum + s.ctr, posSum: ex.posSum + s.position, count: ex.count + 1 })
  }
  const topQueries = Array.from(queryMap.entries())
    .map(([query, v]) => ({ query, clicks: v.clicks, impressions: v.impressions, ctr: v.count > 0 ? v.ctrSum / v.count : 0, position: v.count > 0 ? v.posSum / v.count : 0 }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 25)

  const pageMap = new Map<string, { clicks: number; impressions: number }>()
  for (const s of snapshots) {
    const ex = pageMap.get(s.pageUrl) ?? { clicks: 0, impressions: 0 }
    pageMap.set(s.pageUrl, { clicks: ex.clicks + s.clicks, impressions: ex.impressions + s.impressions })
  }
  const topPages = Array.from(pageMap.entries())
    .map(([pageUrl, v]) => ({ pageUrl, ...v }))
    .sort((a, b) => b.clicks - a.clicks)
    .slice(0, 25)

  return NextResponse.json({ summary: { totalClicks, totalImpressions, avgCtr, avgPosition }, byDate, topQueries, topPages })
}
