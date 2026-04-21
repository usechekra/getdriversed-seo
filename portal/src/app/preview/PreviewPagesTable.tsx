'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'
import { ScoreDelta } from '@/components/DeltaBadge'
import { Search, ExternalLink, Copy, Check } from 'lucide-react'

type Page = {
  id: string; url: string; slug: string; primaryKeyword: string
  pageType: string; state: string | null; status: string
  scoreBefore: number | null; scoreAfter: number | null
  dateOptimized: string | null; updatedAt: string
  owner: { name: string } | null
}

export function PreviewPagesTable({ pages }: { pages: Page[] }) {
  const [search, setSearch] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const rows = pages.filter(p =>
    !search ||
    p.primaryKeyword.toLowerCase().includes(search.toLowerCase()) ||
    p.url.toLowerCase().includes(search.toLowerCase())
  )

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    setCopied(url)
    setTimeout(() => setCopied(null), 1500)
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search URL or keyword…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
        </div>
        <span className="ml-auto text-xs text-muted-foreground self-center">{rows.length} results</span>
      </div>

      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {['URL / Keyword','Status','Type','State','Score','Optimized','Owner'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors group">
                <td className="px-3 py-2.5 max-w-[280px]">
                  <div className="min-w-0">
                    <span className="font-medium truncate block">{row.primaryKeyword}</span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                        {row.url.replace('https://getdriversed.com', '')}
                      </span>
                      <button onClick={() => copyUrl(row.url)} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                        {copied === row.url ? <Check className="h-3 w-3 text-emerald-500" /> : <Copy className="h-3 w-3" />}
                      </button>
                      <a href={row.url} target="_blank" rel="noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5"><StatusBadge status={row.status} /></td>
                <td className="px-3 py-2.5"><Badge variant="outline" className="text-[11px] font-normal">{row.pageType}</Badge></td>
                <td className="px-3 py-2.5 text-sm text-muted-foreground">{row.state ?? '—'}</td>
                <td className="px-3 py-2.5"><ScoreDelta before={row.scoreBefore} after={row.scoreAfter} /></td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                  {row.dateOptimized ? new Date(row.dateOptimized).toLocaleDateString('en-US', { month:'short', day:'numeric', year:'2-digit' }) : '—'}
                </td>
                <td className="px-3 py-2.5 text-xs text-muted-foreground">{row.owner?.name ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
