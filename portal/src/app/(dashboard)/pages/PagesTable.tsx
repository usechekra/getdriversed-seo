'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/StatusBadge'
import { ScoreDelta } from '@/components/DeltaBadge'
import { Search, ExternalLink, ChevronUp, ChevronDown, Copy, Check } from 'lucide-react'

type Page = {
  id: string; url: string; slug: string; primaryKeyword: string
  pageType: string; state: string | null; status: string
  scoreBefore: number | null; scoreAfter: number | null
  dateOptimized: string | null; updatedAt: string
  owner: { name: string } | null
}

const STATUSES = ['QUEUED','IN_PROGRESS','READY_FOR_DEV','IMPLEMENTED','COMPLETED','ARCHIVED']

export function PagesTable({ initialPages, states, pageTypes }: {
  initialPages: Page[]; states: string[]; pageTypes: string[]
}) {
  const [search, setSearch]       = useState('')
  const [status, setStatus]       = useState('')
  const [state, setState]         = useState('')
  const [type, setType]           = useState('')
  const [sortCol, setSortCol]     = useState<keyof Page>('updatedAt')
  const [sortDir, setSortDir]     = useState<'asc'|'desc'>('desc')
  const [page, setPage]           = useState(1)
  const [perPage]                 = useState(25)
  const [copied, setCopied]       = useState<string | null>(null)

  const filtered = useMemo(() => {
    let rows = initialPages
    if (search)  rows = rows.filter(r => r.url.toLowerCase().includes(search.toLowerCase()) || r.primaryKeyword.toLowerCase().includes(search.toLowerCase()))
    if (status)  rows = rows.filter(r => r.status === status)
    if (state)   rows = rows.filter(r => r.state === state)
    if (type)    rows = rows.filter(r => r.pageType === type)
    rows = [...rows].sort((a, b) => {
      const av = a[sortCol] ?? ''; const bv = b[sortCol] ?? ''
      return sortDir === 'asc' ? (av < bv ? -1 : 1) : (av > bv ? -1 : 1)
    })
    return rows
  }, [initialPages, search, status, state, type, sortCol, sortDir])

  const totalPages = Math.ceil(filtered.length / perPage)
  const rows = filtered.slice((page - 1) * perPage, page * perPage)

  function sort(col: keyof Page) {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortCol(col); setSortDir('asc') }
  }

  function SortIcon({ col }: { col: keyof Page }) {
    if (sortCol !== col) return null
    return sortDir === 'asc' ? <ChevronUp className="h-3 w-3 inline ml-1" /> : <ChevronDown className="h-3 w-3 inline ml-1" />
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="space-y-3">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search URL or keyword…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-9 h-9"
          />
        </div>
        <select
          className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground"
          value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}
        >
          <option value="">All statuses</option>
          {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
        </select>
        <select
          className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground"
          value={state} onChange={e => { setState(e.target.value); setPage(1) }}
        >
          <option value="">All states</option>
          {states.sort().map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select
          className="h-9 px-3 rounded-md border border-input bg-background text-sm text-foreground"
          value={type} onChange={e => { setType(e.target.value); setPage(1) }}
        >
          <option value="">All types</option>
          {pageTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <span className="ml-auto text-xs text-muted-foreground self-center">
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {[
                { label: 'URL / Keyword', col: 'url' as keyof Page },
                { label: 'Status',        col: 'status' as keyof Page },
                { label: 'Type',          col: 'pageType' as keyof Page },
                { label: 'State',         col: 'state' as keyof Page },
                { label: 'Score',         col: 'scoreBefore' as keyof Page },
                { label: 'Optimized',     col: 'dateOptimized' as keyof Page },
                { label: 'Owner',         col: null as unknown as keyof Page },
              ].map(({ label, col }) => (
                <th
                  key={label}
                  className={`px-3 py-2.5 text-left text-xs font-medium text-muted-foreground ${col ? 'cursor-pointer hover:text-foreground' : ''}`}
                  onClick={() => col && sort(col)}
                >
                  {label}<SortIcon col={col} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">No pages found</td></tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                <td className="px-3 py-2.5 max-w-[280px]">
                  <div className="flex items-start gap-1.5">
                    <div className="min-w-0">
                      <Link href={`/pages/${row.slug}`} className="font-medium hover:text-[#385FF6] transition-colors truncate block">
                        {row.primaryKeyword}
                      </Link>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {row.url.replace('https://getdriversed.com', '')}
                        </span>
                        <button
                          onClick={() => copyUrl(row.url)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                        >
                          {copied === row.url ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                        </button>
                        <a href={row.url} target="_blank" rel="noreferrer"
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5"><StatusBadge status={row.status} /></td>
                <td className="px-3 py-2.5">
                  <Badge variant="outline" className="text-[11px] font-normal">{row.pageType}</Badge>
                </td>
                <td className="px-3 py-2.5 text-sm text-muted-foreground">{row.state ?? '—'}</td>
                <td className="px-3 py-2.5"><ScoreDelta before={row.scoreBefore} after={row.scoreAfter} /></td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                  {row.dateOptimized ? new Date(row.dateOptimized).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }) : '—'}
                </td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{row.owner?.name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground text-xs">
            Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>Next</Button>
          </div>
        </div>
      )}
    </div>
  )
}
