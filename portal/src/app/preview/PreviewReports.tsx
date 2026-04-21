'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Award, BarChart2, CheckCircle2, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'

type Page = {
  id: string; slug: string; primaryKeyword: string
  pageType: string; state: string | null; status: string
  scoreBefore: number | null; scoreAfter: number | null
  dateOptimized: string | null
}

const MONTHLY = [
  { month:'11', count:1 },
  { month:'12', count:2 },
  { month:'01', count:1 },
  { month:'02', count:3 },
  { month:'03', count:2 },
  { month:'04', count:5 },
]

const DIST = [
  { range:'<60', count:0 },
  { range:'60-74', count:0 },
  { range:'75-84', count:2 },
  { range:'85-100', count:3 },
]

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

export function PreviewReports({
  pages, sitewideProgress, sitewideComplete, sitewideTotal,
}: {
  pages: Page[]
  sitewideProgress: number
  sitewideComplete: number
  sitewideTotal: number
}) {
  const leaderboard = pages
    .filter(p => p.scoreBefore != null && p.scoreAfter != null)
    .map(p => ({ ...p, delta: (p.scoreAfter ?? 0) - (p.scoreBefore ?? 0) }))
    .sort((a, b) => b.delta - a.delta)

  const avgScore = leaderboard.length
    ? Math.round(leaderboard.reduce((s, p) => s + (p.scoreAfter ?? 0), 0) / leaderboard.length)
    : 0

  const statusCounts = pages.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1
    return acc
  }, {})

  const STATUS_COLOR: Record<string, string> = {
    COMPLETED:'#10b981', IMPLEMENTED:'#385FF6', READY_FOR_DEV:'#9EAAFF',
    IN_PROGRESS:'#f59e0b', QUEUED:'#64748b', ARCHIVED:'#334155',
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Pages',    value:pages.length,                           icon:BarChart2,    color:'text-[#385FF6]' },
          { label:'Avg Score',      value:`${avgScore}/100`,                      icon:TrendingUp,   color:'text-emerald-500' },
          { label:'Sitewide Done',  value:`${sitewideComplete}/${sitewideTotal}`, icon:CheckCircle2, color:'text-[#9EAAFF]' },
          { label:'Implemented',    value:statusCounts['IMPLEMENTED'] ?? 0,       icon:Award,        color:'text-amber-400' },
        ].map(({ label, value, icon:Icon, color }) => (
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
        <Card className="border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Pages Optimized (Last 6 Months)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={MONTHLY} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize:11, fill:'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Pages" fill="#385FF6" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-semibold">Score Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={DIST} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize:11, fill:'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize:11, fill:'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Pages" fill="#9EAAFF" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Award className="h-4 w-4 text-amber-400" />Top Score Improvements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {['#','Page','Before','After','Delta'].map(h => (
                    <th key={h} className={`px-4 py-2 text-xs text-muted-foreground font-medium ${h==='#'||h==='Page'?'text-left':'text-right'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((p, i) => (
                  <tr key={p.id} className="border-b border-border/40 hover:bg-muted/20">
                    <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">{i+1}</td>
                    <td className="px-4 py-2.5 max-w-[200px]">
                      <span className="text-xs font-medium truncate block">{p.primaryKeyword}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-xs font-mono text-muted-foreground">{p.scoreBefore}</td>
                    <td className="px-4 py-2.5 text-right text-xs font-mono font-semibold">{p.scoreAfter}</td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-xs font-mono font-bold text-emerald-500">+{p.delta}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/60">
            <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Status Breakdown</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {Object.entries(statusCounts).sort((a,b)=>b[1]-a[1]).map(([status,count]) => (
                <div key={status} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{status.replace(/_/g,' ').toLowerCase()}</span>
                    <span className="font-mono">{count}</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width:`${(count/pages.length)*100}%`, backgroundColor: STATUS_COLOR[status] ?? '#64748b' }} />
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
              <p className="text-xs text-muted-foreground">{sitewideComplete} of {sitewideTotal} issues complete</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
