'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid
} from 'recharts'
import { TrendingUp, TrendingDown, Award, Calendar, BarChart2, CheckCircle2 } from 'lucide-react'

type LeaderboardEntry = {
  id: string; slug: string; primaryKeyword: string
  scoreBefore: number | null; scoreAfter: number | null; delta: number
  dateOptimized: string | null
}
type RecentEntry = {
  id: string; slug: string; primaryKeyword: string
  scoreBefore: number | null; scoreAfter: number | null
  implementationDate: string | null
}

type Props = {
  leaderboard: LeaderboardEntry[]
  recentlyImplemented: RecentEntry[]
  statusCounts: Record<string, number>
  monthlyOptimized: Record<string, number>
  avgScore: number
  scoreDistribution: Record<string, number>
  sitewideProgress: number
  sitewideComplete: number
  sitewideTotal: number
  totalPages: number
}

const STATUS_COLOR: Record<string, string> = {
  COMPLETED:     '#10b981',
  IMPLEMENTED:   '#385FF6',
  READY_FOR_DEV: '#9EAAFF',
  IN_PROGRESS:   '#f59e0b',
  QUEUED:        '#64748b',
  ARCHIVED:      '#334155',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs shadow-lg">
      <p className="font-medium mb-1">{label}</p>
      {payload.map((p: { name: string; value: number; color: string }) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</p>
      ))}
    </div>
  )
}

export function ReportsDashboard({
  leaderboard, recentlyImplemented, statusCounts, monthlyOptimized,
  avgScore, scoreDistribution, sitewideProgress, sitewideComplete, sitewideTotal, totalPages,
}: Props) {

  const monthlyData = Object.entries(monthlyOptimized).map(([month, count]) => ({
    month: month.slice(5), // "04" → April
    count,
  }))

  const distData = Object.entries(scoreDistribution).map(([range, count]) => ({ range, count }))

  const statusData = Object.entries(statusCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([status, count]) => ({ status: status.replace(/_/g, ' '), count, color: STATUS_COLOR[status] ?? '#64748b' }))

  return (
    <div className="space-y-4">

      {/* Top stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Pages',   value: totalPages,                       icon: BarChart2,    color: 'text-[#385FF6]' },
          { label: 'Avg Score',     value: `${avgScore}/100`,                icon: TrendingUp,   color: 'text-emerald-500' },
          { label: 'Sitewide Done', value: `${sitewideComplete}/${sitewideTotal}`, icon: CheckCircle2, color: 'text-[#9EAAFF]' },
          { label: 'Implemented',  value: statusCounts['IMPLEMENTED'] ?? 0, icon: Award,        color: 'text-amber-400' },
        ].map(({ label, value, icon: Icon, color }) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Monthly optimized chart */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Pages Optimized (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={monthlyData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Pages" fill="#385FF6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score distribution */}
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={distData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Pages" fill="#9EAAFF" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Score Leaderboard */}
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />Top Score Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-2 text-left text-xs text-muted-foreground font-medium">#</th>
                    <th className="px-4 py-2 text-left text-xs text-muted-foreground font-medium">Page</th>
                    <th className="px-4 py-2 text-right text-xs text-muted-foreground font-medium">Before</th>
                    <th className="px-4 py-2 text-right text-xs text-muted-foreground font-medium">After</th>
                    <th className="px-4 py-2 text-right text-xs text-muted-foreground font-medium">Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 && (
                    <tr><td colSpan={5} className="text-center py-8 text-sm text-muted-foreground">No scored pages yet</td></tr>
                  )}
                  {leaderboard.map((p, i) => (
                    <tr key={p.id} className="border-b border-border/40 hover:bg-muted/20">
                      <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{i + 1}</td>
                      <td className="px-4 py-2.5 max-w-[200px]">
                        <Link href={`/pages/${p.slug}`} className="text-xs font-medium hover:text-[#385FF6] transition-colors truncate block">
                          {p.primaryKeyword}
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 text-right text-xs font-mono text-muted-foreground">{p.scoreBefore ?? '—'}</td>
                      <td className="px-4 py-2.5 text-right text-xs font-mono font-semibold">{p.scoreAfter ?? '—'}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`text-xs font-mono font-bold ${p.delta > 0 ? 'text-emerald-500' : p.delta < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>
                          {p.delta > 0 ? '+' : ''}{p.delta}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Status breakdown + Sitewide */}
        <div className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {statusData.map(({ status, count, color }) => (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{status.toLowerCase()}</span>
                    <span className="font-mono">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${(count / totalPages) * 100}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                Sitewide Backlog
                <span className="text-xs font-normal text-muted-foreground">{sitewideProgress}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Progress value={sitewideProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {sitewideComplete} of {sitewideTotal} issues complete
              </p>
              <Link href="/sitewide" className="text-xs text-[#385FF6] hover:underline block">
                View board →
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recently implemented */}
      {recentlyImplemented.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />Recently Implemented (Last 30 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-4 py-2 text-left text-xs text-muted-foreground font-medium">Page</th>
                    <th className="px-4 py-2 text-right text-xs text-muted-foreground font-medium">Score Δ</th>
                    <th className="px-4 py-2 text-right text-xs text-muted-foreground font-medium">Implemented</th>
                  </tr>
                </thead>
                <tbody>
                  {recentlyImplemented.map(p => {
                    const delta = p.scoreAfter != null && p.scoreBefore != null ? p.scoreAfter - p.scoreBefore : null
                    return (
                      <tr key={p.id} className="border-b border-border/40 hover:bg-muted/20">
                        <td className="px-4 py-2.5 max-w-[260px]">
                          <Link href={`/pages/${p.slug}`} className="text-xs font-medium hover:text-[#385FF6] transition-colors truncate block">
                            {p.primaryKeyword}
                          </Link>
                        </td>
                        <td className="px-4 py-2.5 text-right">
                          {delta != null
                            ? <span className={`text-xs font-mono font-bold ${delta > 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>{delta > 0 ? '+' : ''}{delta}</span>
                            : <span className="text-xs text-muted-foreground">—</span>
                          }
                        </td>
                        <td className="px-4 py-2.5 text-right text-xs text-muted-foreground whitespace-nowrap">
                          {p.implementationDate
                            ? new Date(p.implementationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : '—'}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
