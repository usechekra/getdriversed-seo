import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { ReportsDashboard } from './ReportsDashboard'

export const metadata = { title: 'Reports' }

export default async function ReportsPage() {
  await auth()

  const now = new Date()
  const thirtyDaysAgo  = new Date(now); thirtyDaysAgo.setDate(now.getDate() - 30)
  const sixtyDaysAgo   = new Date(now); sixtyDaysAgo.setDate(now.getDate() - 60)
  const ninetyDaysAgo  = new Date(now); ninetyDaysAgo.setDate(now.getDate() - 90)

  const [
    allPages,
    recentlyImplemented,
    sitewideIssues,
  ] = await Promise.all([
    prisma.page.findMany({
      select: {
        id: true, slug: true, url: true, primaryKeyword: true,
        pageType: true, state: true, status: true,
        scoreBefore: true, scoreAfter: true,
        dateOptimized: true, implementationDate: true,
        owner: { select: { name: true } },
      },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.page.findMany({
      where: { implementationDate: { gte: thirtyDaysAgo } },
      select: { id: true, slug: true, primaryKeyword: true, scoreBefore: true, scoreAfter: true, implementationDate: true },
      orderBy: { implementationDate: 'desc' },
    }),
    prisma.sitewideIssue.findMany({ orderBy: { id: 'asc' } }),
  ])

  // Score leaderboard — pages with best delta
  const leaderboard = allPages
    .filter(p => p.scoreBefore != null && p.scoreAfter != null)
    .map(p => ({ ...p, delta: (p.scoreAfter ?? 0) - (p.scoreBefore ?? 0) }))
    .sort((a, b) => b.delta - a.delta)
    .slice(0, 20)

  // Status breakdown
  const statusCounts = allPages.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  // Pages optimized per month (last 6 months)
  const monthly: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now)
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    monthly[key] = 0
  }
  for (const p of allPages) {
    if (!p.dateOptimized) continue
    const d = new Date(p.dateOptimized)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    if (key in monthly) monthly[key]++
  }

  // Score distribution
  const scored = allPages.filter(p => p.scoreAfter != null)
  const avgScore = scored.length
    ? Math.round(scored.reduce((s, p) => s + (p.scoreAfter ?? 0), 0) / scored.length)
    : 0

  const scoreDistribution = { '<60': 0, '60-74': 0, '75-84': 0, '85-100': 0 }
  for (const p of scored) {
    const s = p.scoreAfter ?? 0
    if (s < 60)      scoreDistribution['<60']++
    else if (s < 75) scoreDistribution['60-74']++
    else if (s < 85) scoreDistribution['75-84']++
    else             scoreDistribution['85-100']++
  }

  const sitewideComplete = sitewideIssues.filter(i => i.status === 'COMPLETE').length
  const sitewideProgress = sitewideIssues.length
    ? Math.round((sitewideComplete / sitewideIssues.length) * 100)
    : 0

  // Serialize dates
  const serializedLeaderboard = leaderboard.map(p => ({
    ...p,
    dateOptimized: p.dateOptimized?.toISOString() ?? null,
    implementationDate: p.implementationDate?.toISOString() ?? null,
  }))
  const serializedRecent = recentlyImplemented.map(p => ({
    ...p,
    implementationDate: p.implementationDate?.toISOString() ?? null,
    dateOptimized: null,
  }))

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground text-sm mt-0.5">SEO performance overview</p>
      </div>

      <ReportsDashboard
        leaderboard={serializedLeaderboard}
        recentlyImplemented={serializedRecent}
        statusCounts={statusCounts}
        monthlyOptimized={monthly}
        avgScore={avgScore}
        scoreDistribution={scoreDistribution}
        sitewideProgress={sitewideProgress}
        sitewideComplete={sitewideComplete}
        sitewideTotal={sitewideIssues.length}
        totalPages={allPages.length}
      />
    </div>
  )
}
