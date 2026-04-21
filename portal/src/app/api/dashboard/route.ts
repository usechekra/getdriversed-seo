import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [
    total, inProgress, queued, completed,
    pages, recentActivity, sitewideIssues,
  ] = await Promise.all([
    prisma.page.count(),
    prisma.page.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.page.count({ where: { status: 'QUEUED' } }),
    prisma.page.count({ where: { status: 'COMPLETED' } }),
    prisma.page.findMany({ select: { scoreBefore: true, scoreAfter: true, createdAt: true }, orderBy: { createdAt: 'asc' } }),
    prisma.pageHistory.findMany({
      take: 15,
      orderBy: { createdAt: 'desc' },
      include: { page: { select: { url: true, primaryKeyword: true, slug: true } } },
    }),
    prisma.sitewideIssue.findMany({ orderBy: { id: 'asc' } }),
  ])

  // Avg score of completed/implemented pages
  const scoredPages = pages.filter(p => p.scoreAfter != null)
  const avgScore = scoredPages.length
    ? Math.round(scoredPages.reduce((s, p) => s + (p.scoreAfter ?? 0), 0) / scoredPages.length)
    : null

  // Sitewide progress
  const sitewideComplete = sitewideIssues.filter(i => i.status === 'COMPLETE').length
  const sitewideTotal = sitewideIssues.length

  // Weekly buckets (last 8 weeks)
  const now = new Date()
  const weekBuckets = Array.from({ length: 8 }, (_, i) => {
    const weekStart = new Date(now)
    weekStart.setDate(now.getDate() - (7 - i) * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 7)
    const label = weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    const count = pages.filter(p => p.createdAt >= weekStart && p.createdAt < weekEnd).length
    return { label, count }
  })

  return NextResponse.json({
    metrics: { total, inProgress, queued, completed, avgScore, sitewideComplete, sitewideTotal },
    weeklyChart: weekBuckets,
    recentActivity,
  })
}
