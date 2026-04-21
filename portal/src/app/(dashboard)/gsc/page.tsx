'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  MousePointerClick, Eye, TrendingUp, Hash, RefreshCw,
  ArrowUpRight, ArrowDownRight, Minus, ExternalLink, Search,
} from 'lucide-react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell,
} from 'recharts'
import { toast } from 'sonner'

type Summary = { totalClicks: number; totalImpressions: number; avgCtr: number; avgPosition: number }
type DateRow = { date: string; clicks: number; impressions: number }
type QueryRow = { query: string; clicks: number; impressions: number; ctr: number; position: number }
type PageRow = { pageUrl: string; clicks: number; impressions: number }
type PerfRow = { key: string; clicks: number; impressions: number; ctr: number; position: number }

const DAYS_OPTIONS = [7, 28, 90]
const MAIN_TABS = ['Overview', 'Performance', 'URL Inspection']
const PERF_DIMS = ['Queries', 'Pages', 'Countries', 'Devices', 'Search Appearance', 'Dates']
const BRANDED_TERMS = ['get drivers ed', 'getdriversed', "get driver's ed", 'getdriversed.com', 'get drivers education']
const isBranded = (q: string) => BRANDED_TERMS.some(t => q.toLowerCase().includes(t))

const fmt = (n: number) => n.toLocaleString()
const fmtPct = (n: number) => (n * 100).toFixed(1) + '%'
const fmtPos = (n: number) => n.toFixed(1)

const COLORS = ['#385FF6', '#34d399', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4']

function TrendBadge({ delta }: { delta: number | null }) {
  if (delta === null) return <span className="text-muted-foreground text-xs">—</span>
  if (Math.abs(delta) < 1) return <span className="text-muted-foreground text-xs flex items-center gap-0.5"><Minus className="h-3 w-3" />0%</span>
  return (
    <span className={`text-xs flex items-center gap-0.5 font-medium ${delta > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
      {delta > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(delta).toFixed(0)}%
    </span>
  )
}

export default function GscPage() {
  const [days, setDays] = useState(28)
  const [mainTab, setMainTab] = useState('Overview')
  const [perfDim, setPerfDim] = useState('Queries')
  const [syncing, setSyncing] = useState(false)

  // Overview
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary | null>(null)
  const [byDate, setByDate] = useState<DateRow[]>([])
  const [topQueries, setTopQueries] = useState<QueryRow[]>([])
  const [topPages, setTopPages] = useState<PageRow[]>([])

  // Performance
  const [perfData, setPerfData] = useState<PerfRow[]>([])
  const [prevPerfData, setPrevPerfData] = useState<PerfRow[]>([])
  const [perfLoading, setPerfLoading] = useState(false)
  const [perfFilter, setPerfFilter] = useState('')
  const [brandedFilter, setBrandedFilter] = useState<'all' | 'branded' | 'non-branded'>('all')
  const [perfLimit, setPerfLimit] = useState(25)
  const [sortBy, setSortBy] = useState<'clicks' | 'impressions' | 'ctr' | 'position'>('clicks')
  const [sortAsc, setSortAsc] = useState(false)

  // URL Inspection
  const [inspectInput, setInspectInput] = useState('')
  const [inspecting, setInspecting] = useState(false)
  const [inspectResult, setInspectResult] = useState<Record<string, unknown> | null>(null)
  const [inspectError, setInspectError] = useState('')

  async function loadOverview() {
    setLoading(true)
    try {
      // All 3 fetches in parallel for speed
      const [analyticsRes, queriesRes, pagesRes] = await Promise.all([
        fetch(`/api/gsc/analytics?days=${days}`),
        fetch(`/api/gsc/performance?dimension=query&days=7`),
        fetch(`/api/gsc/performance?dimension=page&days=7`),
      ])
      const [analytics, queries, pages] = await Promise.all([
        analyticsRes.json(), queriesRes.json(), pagesRes.json(),
      ])
      setSummary(analytics.summary)
      setByDate(analytics.byDate)
      setTopQueries((queries.rows ?? []).slice(0, 25).map((r: PerfRow) => ({
        query: r.key, clicks: r.clicks, impressions: r.impressions, ctr: r.ctr, position: r.position,
      })))
      setTopPages((pages.rows ?? []).slice(0, 25).map((r: PerfRow) => ({
        pageUrl: r.key, clicks: r.clicks, impressions: r.impressions,
      })))
    } catch {
      toast.error('Failed to load GSC data')
    } finally {
      setLoading(false)
    }
  }

  const loadPerf = useCallback(async (dim: string) => {
    setPerfLoading(true)
    setPerfLimit(25)
    setPerfFilter('')
    setBrandedFilter('all')
    try {
      const dimKey = dim === 'Search Appearance' ? 'searchAppearance' : dim === 'Dates' ? 'date' : dim.toLowerCase().replace(/s$/, '')
      const [curRes, prevRes] = await Promise.all([
        fetch(`/api/gsc/performance?dimension=${dimKey}&days=${days}`),
        fetch(`/api/gsc/performance?dimension=${dimKey}&days=${days}&offset=${days}`),
      ])
      const [cur, prev] = await Promise.all([curRes.json(), prevRes.json()])
      if (cur.error) throw new Error(cur.error)
      setPerfData(cur.rows ?? [])
      setPrevPerfData(prev.rows ?? [])
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to load data')
      setPerfData([])
    } finally {
      setPerfLoading(false)
    }
  }, [days])

  async function syncNow() {
    setSyncing(true)
    try {
      const res = await fetch('/api/gsc/sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      toast.success(`Synced ${data.synced} days of data`)
      await loadOverview()
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  async function runInspect() {
    if (!inspectInput.trim()) return
    setInspecting(true)
    setInspectResult(null)
    setInspectError('')
    try {
      const res = await fetch(`/api/gsc/inspect?url=${encodeURIComponent(inspectInput.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setInspectResult(data)
    } catch (e: unknown) {
      setInspectError(e instanceof Error ? e.message : 'Inspection failed')
    } finally {
      setInspecting(false)
    }
  }

  useEffect(() => { loadOverview() }, [days])
  useEffect(() => { if (mainTab === 'Performance') loadPerf(perfDim) }, [mainTab, perfDim, days, loadPerf])

  // Branded split for overview
  const brandedSplit = topQueries.reduce((acc, q) => {
    if (isBranded(q.query)) acc.branded += q.clicks
    else acc.nonBranded += q.clicks
    return acc
  }, { branded: 0, nonBranded: 0 })

  const brandedChartData = [
    { name: 'Branded', value: brandedSplit.branded },
    { name: 'Non-branded', value: brandedSplit.nonBranded },
  ].filter(d => d.value > 0)

  // Filtered + sorted perf data
  const prevMap = new Map(prevPerfData.map(r => [r.key, r]))
  const filteredPerf = perfData
    .filter(r => !perfFilter || r.key.toLowerCase().includes(perfFilter.toLowerCase()))
    .filter(r => {
      if (perfDim === 'Queries' && brandedFilter === 'branded') return isBranded(r.key)
      if (perfDim === 'Queries' && brandedFilter === 'non-branded') return !isBranded(r.key)
      return true
    })
    .sort((a, b) => {
      const diff = sortAsc ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
      return diff
    })

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) setSortAsc(v => !v)
    else { setSortBy(col); setSortAsc(false) }
  }

  const SortTh = ({ col, label }: { col: typeof sortBy; label: string }) => (
    <th
      className="text-right px-3 py-2.5 font-medium cursor-pointer hover:text-foreground select-none"
      onClick={() => toggleSort(col)}
    >
      {label}{sortBy === col ? (sortAsc ? ' ↑' : ' ↓') : ''}
    </th>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Search Console</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Performance data from Google Search Console</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-border overflow-hidden text-xs">
            {DAYS_OPTIONS.map(d => (
              <button key={d} type="button" onClick={() => setDays(d)}
                className={`px-3 py-1.5 transition-colors ${days === d ? 'bg-[#385FF6] text-white' : 'text-muted-foreground hover:bg-accent'}`}>
                {d}d
              </button>
            ))}
          </div>
          <Button size="sm" variant="outline" onClick={syncNow} disabled={syncing} className="h-8 text-xs gap-1.5">
            <RefreshCw className={`h-3.5 w-3.5 ${syncing ? 'animate-spin' : ''}`} />
            {syncing ? 'Syncing…' : 'Sync Now'}
          </Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Clicks', value: summary ? fmt(summary.totalClicks) : '—', icon: MousePointerClick, color: 'text-[#385FF6]' },
          { label: 'Total Impressions', value: summary ? fmt(summary.totalImpressions) : '—', icon: Eye, color: 'text-emerald-400' },
          { label: 'Avg CTR', value: summary ? fmtPct(summary.avgCtr) : '—', icon: TrendingUp, color: 'text-amber-400' },
          { label: 'Avg Position', value: summary ? fmtPos(summary.avgPosition) : '—', icon: Hash, color: 'text-slate-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="pt-4 pb-3">
              {loading ? <Skeleton className="h-8 w-24" /> : (
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className={`text-2xl font-bold mt-0.5 ${color}`}>{value}</p>
                  </div>
                  <Icon className={`h-4 w-4 mt-1 ${color} opacity-60`} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main tabs */}
      <div className="flex border-b border-border">
        {MAIN_TABS.map(tab => (
          <button key={tab} type="button" onClick={() => setMainTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${mainTab === tab ? 'border-[#385FF6] text-[#385FF6]' : 'border-transparent text-muted-foreground hover:text-foreground'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {mainTab === 'Overview' && (
        <div className="space-y-4">
          {/* Trend chart */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Clicks & Impressions Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? <Skeleton className="h-48 w-full" /> : byDate.length === 0 ? (
                <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No data — click Sync Now to populate</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={byDate} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickFormatter={d => d.slice(5)} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                    <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 6, fontSize: 11 }} labelStyle={{ color: 'hsl(var(--foreground))' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line yAxisId="left" type="monotone" dataKey="clicks" stroke="#385FF6" strokeWidth={2} dot={false} name="Clicks" />
                    <Line yAxisId="right" type="monotone" dataKey="impressions" stroke="#34d399" strokeWidth={2} dot={false} name="Impressions" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>

          {/* Top pages + branded split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Pages */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Top Pages by Clicks</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? <div className="p-4"><Skeleton className="h-48 w-full" /></div> : topPages.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">No page data yet</div>
                ) : (
                  <div className="overflow-auto max-h-72">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-border text-muted-foreground">
                          <th className="text-left px-4 py-2 font-medium">Page</th>
                          <th className="text-right px-3 py-2 font-medium">Clicks</th>
                          <th className="text-right px-4 py-2 font-medium">Impr.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {topPages.map((p, i) => {
                          const slug = p.pageUrl.replace('https://getdriversed.com', '').replace('https://www.getdriversed.com', '')
                          return (
                            <tr key={i} className="border-b border-border/40 hover:bg-accent/30">
                              <td className="px-4 py-2 max-w-[200px]">
                                <a href={p.pageUrl} target="_blank" rel="noopener noreferrer" className="truncate block text-[#385FF6] hover:underline">
                                  {slug || p.pageUrl}
                                </a>
                              </td>
                              <td className="px-3 py-2 text-right font-medium">{fmt(p.clicks)}</td>
                              <td className="px-4 py-2 text-right text-muted-foreground">{fmt(p.impressions)}</td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Branded vs Non-Branded */}
            <Card className="border-border/60">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold">Branded vs Non-Branded Traffic</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? <Skeleton className="h-48 w-full" /> : brandedChartData.length === 0 ? (
                  <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">No query data yet</div>
                ) : (
                  <div className="space-y-4">
                    <ResponsiveContainer width="100%" height={140}>
                      <BarChart data={brandedChartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                        <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} width={90} />
                        <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: 6, fontSize: 11 }} />
                        <Bar dataKey="value" name="Clicks" radius={[0, 4, 4, 0]}>
                          {brandedChartData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                    <div className="flex gap-6 text-xs">
                      <div>
                        <p className="text-muted-foreground">Branded Clicks</p>
                        <p className="font-bold text-base text-[#385FF6]">{fmt(brandedSplit.branded)}</p>
                        <p className="text-muted-foreground">{brandedSplit.branded + brandedSplit.nonBranded > 0 ? ((brandedSplit.branded / (brandedSplit.branded + brandedSplit.nonBranded)) * 100).toFixed(0) : 0}% of total</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Non-Branded Clicks</p>
                        <p className="font-bold text-base text-emerald-400">{fmt(brandedSplit.nonBranded)}</p>
                        <p className="text-muted-foreground">{brandedSplit.branded + brandedSplit.nonBranded > 0 ? ((brandedSplit.nonBranded / (brandedSplit.branded + brandedSplit.nonBranded)) * 100).toFixed(0) : 0}% of total</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Top queries */}
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold">Top Queries (last 7 days)</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? <div className="p-4"><Skeleton className="h-48 w-full" /></div> : topQueries.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground text-sm">No query data yet</div>
              ) : (
                <div className="overflow-auto max-h-80">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left px-4 py-2 font-medium">Query</th>
                        <th className="text-right px-3 py-2 font-medium">Clicks</th>
                        <th className="text-right px-3 py-2 font-medium">Impr.</th>
                        <th className="text-right px-3 py-2 font-medium">CTR</th>
                        <th className="text-right px-4 py-2 font-medium">Pos.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topQueries.map((q, i) => (
                        <tr key={i} className="border-b border-border/40 hover:bg-accent/30">
                          <td className="px-4 py-2 max-w-[220px]">
                            <div className="flex items-center gap-1.5">
                              <span className="truncate">{q.query}</span>
                              {isBranded(q.query) && <Badge variant="outline" className="text-[9px] py-0 h-4 shrink-0 border-[#385FF6]/40 text-[#385FF6]">B</Badge>}
                            </div>
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-[#385FF6]">{fmt(q.clicks)}</td>
                          <td className="px-3 py-2 text-right text-muted-foreground">{fmt(q.impressions)}</td>
                          <td className="px-3 py-2 text-right text-muted-foreground">{fmtPct(q.ctr)}</td>
                          <td className="px-4 py-2 text-right text-muted-foreground">{fmtPos(q.position)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── PERFORMANCE TAB ── */}
      {mainTab === 'Performance' && (
        <div className="space-y-3">
          {/* Dimension sub-tabs */}
          <div className="flex gap-1 flex-wrap">
            {PERF_DIMS.map(dim => (
              <button key={dim} type="button" onClick={() => setPerfDim(dim)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${perfDim === dim ? 'bg-[#385FF6] text-white' : 'bg-accent text-muted-foreground hover:text-foreground'}`}>
                {dim}
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap items-center">
            {(perfDim === 'Queries' || perfDim === 'Pages') && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder={`Filter ${perfDim.toLowerCase()}…`}
                  value={perfFilter}
                  onChange={e => setPerfFilter(e.target.value)}
                  className="h-8 text-xs pl-8 w-56"
                />
              </div>
            )}
            {perfDim === 'Queries' && (
              <div className="flex rounded-md border border-border overflow-hidden text-xs">
                {(['all', 'branded', 'non-branded'] as const).map(f => (
                  <button key={f} type="button" onClick={() => setBrandedFilter(f)}
                    className={`px-3 py-1.5 capitalize transition-colors ${brandedFilter === f ? 'bg-[#385FF6] text-white' : 'text-muted-foreground hover:bg-accent'}`}>
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Card className="border-border/60">
            <CardContent className="p-0">
              {perfLoading ? <div className="p-4"><Skeleton className="h-64 w-full" /></div> : filteredPerf.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground text-sm">No data for this dimension</div>
              ) : (
                <div className="overflow-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="text-left px-4 py-2.5 font-medium">
                          {perfDim === 'Search Appearance' ? 'Appearance' : perfDim === 'Dates' ? 'Date' : perfDim.replace(/s$/, '')}
                        </th>
                        <SortTh col="clicks" label="Clicks" />
                        {perfDim === 'Pages' && <th className="text-right px-3 py-2.5 font-medium">vs prev.</th>}
                        <SortTh col="impressions" label="Impr." />
                        <SortTh col="ctr" label="CTR" />
                        <SortTh col="position" label="Pos." />
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPerf.slice(0, perfLimit).map((row, i) => {
                        const prev = prevMap.get(row.key)
                        const delta = prev && prev.clicks > 0 ? ((row.clicks - prev.clicks) / prev.clicks) * 100 : null
                        const slug = (perfDim === 'Pages') ? row.key.replace('https://getdriversed.com', '').replace('https://www.getdriversed.com', '') : null
                        return (
                          <tr key={i} className="border-b border-border/40 hover:bg-accent/30 transition-colors">
                            <td className="px-4 py-2 max-w-[240px]">
                              {perfDim === 'Pages' ? (
                                <a href={row.key} target="_blank" rel="noopener noreferrer" className="truncate block text-[#385FF6] hover:underline">
                                  {slug || row.key}
                                </a>
                              ) : perfDim === 'Queries' ? (
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="truncate">{row.key}</span>
                                  {isBranded(row.key) && <Badge variant="outline" className="text-[9px] py-0 h-4 shrink-0 border-[#385FF6]/40 text-[#385FF6]">B</Badge>}
                                </div>
                              ) : (
                                <span className="block truncate">{row.key}</span>
                              )}
                            </td>
                            <td className="px-3 py-2 text-right font-medium text-[#385FF6]">{fmt(row.clicks)}</td>
                            {perfDim === 'Pages' && (
                              <td className="px-3 py-2 text-right">
                                <TrendBadge delta={delta} />
                              </td>
                            )}
                            <td className="px-3 py-2 text-right text-muted-foreground">{fmt(row.impressions)}</td>
                            <td className="px-3 py-2 text-right text-muted-foreground">{fmtPct(row.ctr)}</td>
                            <td className="px-4 py-2 text-right text-muted-foreground">{fmtPos(row.position)}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {filteredPerf.length > perfLimit && (
                    <div className="p-3 border-t border-border/40 text-center">
                      <Button size="sm" variant="ghost" className="text-xs" onClick={() => setPerfLimit(l => l + 50)}>
                        Show more ({filteredPerf.length - perfLimit} remaining)
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── URL INSPECTION TAB ── */}
      {mainTab === 'URL Inspection' && (
        <div className="space-y-4 max-w-2xl">
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Inspect a URL</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Input
                  placeholder="https://getdriversed.com/..."
                  value={inspectInput}
                  onChange={e => setInspectInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && runInspect()}
                  className="h-8 text-sm"
                />
                <Button size="sm" onClick={runInspect} disabled={inspecting || !inspectInput.trim()} className="h-8 text-xs shrink-0">
                  {inspecting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : 'Inspect'}
                </Button>
              </div>

              {inspectError && <p className="text-xs text-red-400">{inspectError}</p>}

              {inspectResult && (() => {
                const result = (inspectResult as Record<string, unknown>).inspectionResult as Record<string, unknown> | undefined
                const idx = result?.indexStatusResult as Record<string, unknown> | undefined
                const mob = result?.mobileUsabilityResult as Record<string, unknown> | undefined
                const rich = result?.richResultsResult as Record<string, unknown> | undefined

                const verdictColor = (v: string) =>
                  v === 'PASS' ? 'text-emerald-400 border-emerald-400/30' : v === 'FAIL' ? 'text-red-400 border-red-400/30' : 'text-amber-400 border-amber-400/30'

                return (
                  <div className="space-y-3 pt-1">
                    {idx && (
                      <div className="rounded-md border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold">Index Status</p>
                          <Badge variant="outline" className={`text-[10px] ${verdictColor(idx.verdict as string)}`}>
                            {(idx.coverageState as string) ?? (idx.verdict as string)}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
                          {(idx.robotsTxtState as string) && <><span className="text-muted-foreground">Robots.txt</span><span>{idx.robotsTxtState as string}</span></>}
                          {(idx.indexingState as string) && <><span className="text-muted-foreground">Indexing</span><span>{(idx.indexingState as string).replace(/_/g, ' ')}</span></>}
                          {(idx.pageFetchState as string) && <><span className="text-muted-foreground">Page Fetch</span><span>{(idx.pageFetchState as string).replace(/_/g, ' ')}</span></>}
                          {(idx.lastCrawlTime as string) && <><span className="text-muted-foreground">Last Crawled</span><span>{new Date(idx.lastCrawlTime as string).toLocaleDateString()}</span></>}
                          {(idx.crawledAs as string) && <><span className="text-muted-foreground">Crawled As</span><span>{idx.crawledAs as string}</span></>}
                          {(idx.googleCanonical as string) && <><span className="text-muted-foreground">Google Canonical</span><span className="truncate text-[#385FF6]">{idx.googleCanonical as string}</span></>}
                          {(idx.userCanonical as string) && <><span className="text-muted-foreground">Your Canonical</span><span className="truncate">{idx.userCanonical as string}</span></>}
                        </div>
                      </div>
                    )}

                    {mob && (
                      <div className="rounded-md border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold">Mobile Usability</p>
                          <Badge variant="outline" className={`text-[10px] ${verdictColor(mob.verdict as string)}`}>{mob.verdict as string}</Badge>
                        </div>
                        {(mob.issues as unknown[])?.length > 0 && (
                          <ul className="text-xs text-red-400 space-y-0.5">
                            {(mob.issues as Record<string, string>[]).map((issue, i) => (
                              <li key={i}>• {issue.issueType?.replace(/_/g, ' ')}</li>
                            ))}
                          </ul>
                        )}
                        {!(mob.issues as unknown[])?.length && <p className="text-xs text-emerald-400">No mobile usability issues</p>}
                      </div>
                    )}

                    {rich && (
                      <div className="rounded-md border border-border p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold">Rich Results</p>
                          <Badge variant="outline" className={`text-[10px] ${verdictColor(rich.verdict as string)}`}>{rich.verdict as string}</Badge>
                        </div>
                        {(rich.detectedItems as unknown[])?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {(rich.detectedItems as Record<string, string>[]).map((item, i) => (
                              <Badge key={i} variant="outline" className="text-[10px]">{item.richResultType}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {result && typeof result.inspectionResultLink === 'string' && (
                      <a href={result.inspectionResultLink} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#385FF6] hover:underline">
                        <ExternalLink className="h-3 w-3" />
                        View full result in Search Console
                      </a>
                    )}
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Index Coverage placeholder */}
          <Card className="border-border/60 border-dashed">
            <CardContent className="py-5">
              <p className="text-xs font-medium mb-1">Index Coverage Report</p>
              <p className="text-xs text-muted-foreground mb-3">
                Sitewide indexed vs. non-indexed URL counts are available in Google Search Console's Coverage report. Use the URL inspector above to check individual pages.
              </p>
              <a href="https://search.google.com/search-console/index" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-[#385FF6] hover:underline">
                <ExternalLink className="h-3 w-3" />
                Open Coverage Report in GSC
              </a>
            </CardContent>
          </Card>

          {/* Core Web Vitals placeholder */}
          <Card className="border-border/60 border-dashed">
            <CardContent className="py-5">
              <p className="text-xs font-medium mb-1">Core Web Vitals</p>
              <p className="text-xs text-muted-foreground mb-3">
                LCP, CLS, and INP data is available in GSC's Core Web Vitals report (desktop & mobile), or via Google PageSpeed Insights for individual pages.
              </p>
              <div className="flex gap-4">
                <a href="https://search.google.com/search-console/core-web-vitals" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#385FF6] hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  CWV Report in GSC
                </a>
                <a href="https://pagespeed.web.dev/" target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[#385FF6] hover:underline">
                  <ExternalLink className="h-3 w-3" />
                  PageSpeed Insights
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
