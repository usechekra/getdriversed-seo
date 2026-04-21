import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/StatusBadge'
import { DeltaBadge } from '@/components/DeltaBadge'
import { FileText, Clock, CheckCircle, TrendingUp, AlertTriangle, Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()

  const [total, inProgress, queued, completed, pages, recentHistory, recentActivity, sitewideIssues] = await Promise.all([
    prisma.page.count(),
    prisma.page.count({ where: { status: 'IN_PROGRESS' } }),
    prisma.page.count({ where: { status: 'QUEUED' } }),
    prisma.page.count({ where: { status: 'COMPLETED' } }),
    prisma.page.findMany({ select: { scoreBefore: true, scoreAfter: true, createdAt: true, status: true } }),
    prisma.pageHistory.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { page: { select: { url: true, primaryKeyword: true, slug: true } } },
    }),
    prisma.activity.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true } } },
    }),
    prisma.sitewideIssue.findMany({ orderBy: { id: 'asc' } }),
  ])

  const scoredPages = pages.filter(p => p.scoreAfter != null)
  const avgScore = scoredPages.length
    ? Math.round(scoredPages.reduce((s, p) => s + (p.scoreAfter ?? 0), 0) / scoredPages.length)
    : null

  const sitewideComplete = sitewideIssues.filter(i => i.status === 'COMPLETE').length
  const sitewideProgress = sitewideIssues.length
    ? Math.round((sitewideComplete / sitewideIssues.length) * 100)
    : 0

  const metrics = [
    { label: 'Total Optimized', value: total, icon: FileText, color: 'text-[#385FF6]' },
    { label: 'In Progress',     value: inProgress, icon: Clock, color: 'text-amber-500' },
    { label: 'Queued',          value: queued, icon: AlertTriangle, color: 'text-slate-400' },
    { label: 'Completed',       value: completed, icon: CheckCircle, color: 'text-emerald-500' },
    { label: 'Avg Score',       value: avgScore != null ? `${avgScore}/100` : '—', icon: TrendingUp, color: 'text-[#9EAAFF]' },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back, <span className="text-foreground font-medium">{session?.user?.name}</span>
          </p>
        </div>
        <Link href="/submit">
          <Button className="gde-gradient text-white border-0 gap-2">
            <Plus className="h-4 w-4" />
            Submit URL
          </Button>
        </Link>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <Icon className={`h-4 w-4 mt-0.5 ${color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {recentHistory.length === 0 && recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">No activity yet</p>
            )}
            {recentHistory.map((h) => (
              <div key={h.id} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-[#385FF6] mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    <Link href={`/pages/${h.page.slug}`} className="font-medium hover:text-[#385FF6] transition-colors">
                      {h.page.primaryKeyword}
                    </Link>
                    <span className="text-muted-foreground ml-1.5">— {h.action.replace(/_/g, ' ')}</span>
                    {h.toValue && <StatusBadge status={h.toValue} />}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {recentActivity.map((a) => (
              <div key={a.id} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">
                    <span className="font-medium">{a.action.replace(/_/g, ' ')}</span>
                    {a.target && <span className="text-muted-foreground ml-1.5">— {a.target}</span>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.user.name} · {new Date(a.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Sitewide Progress */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center justify-between">
              Sitewide Backlog
              <span className="text-xs font-normal text-muted-foreground">{sitewideComplete}/{sitewideIssues.length} done</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
              <div
                className="h-full rounded-full gde-gradient transition-all duration-500"
                style={{ width: `${sitewideProgress}%` }}
              />
            </div>
            <div className="space-y-2">
              {sitewideIssues.slice(0, 6).map((issue) => (
                <div key={issue.id} className="flex items-center gap-2 text-xs">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    issue.status === 'COMPLETE'    ? 'bg-emerald-500' :
                    issue.status === 'IN_PROGRESS' ? 'bg-[#385FF6]' :
                    'bg-slate-300 dark:bg-slate-600'
                  }`} />
                  <span className={`truncate ${issue.status === 'COMPLETE' ? 'line-through text-muted-foreground' : ''}`}>
                    #{issue.id} {issue.title}
                  </span>
                </div>
              ))}
              {sitewideIssues.length > 6 && (
                <Link href="/sitewide" className="text-xs text-[#385FF6] hover:underline block mt-2">
                  View all {sitewideIssues.length} issues →
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
