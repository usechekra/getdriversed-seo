'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, ExternalLink, Inbox } from 'lucide-react'

type Submission = {
  id: string
  url: string
  primaryKeyword: string | null
  priority: string
  businessContext: string | null
  whyThisMatters: string | null
  status: string
  createdAt: string
  submittedBy: { name: string; email: string }
}

const PRIORITY_COLOR: Record<string, string> = {
  HIGH: 'text-red-400 border-red-400/30 bg-red-400/10',
  MEDIUM: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  LOW: 'text-emerald-500 border-emerald-500/30 bg-emerald-500/10',
}

export default function InboxPage() {
  const [subs, setSubs] = useState<Submission[] | null>(null)
  const [tab, setTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING')
  const [acting, setActing] = useState<string | null>(null)

  useEffect(() => {
    setSubs(null)
    fetch(`/api/submissions?status=${tab}`)
      .then(r => r.json())
      .then(setSubs)
      .catch(() => setSubs([]))
  }, [tab])

  async function act(id: string, action: 'APPROVED' | 'REJECTED') {
    setActing(id)
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action }),
      })
      if (!res.ok) throw new Error()
      setSubs(prev => prev ? prev.filter(s => s.id !== id) : prev)
      toast.success(action === 'APPROVED' ? 'Submission approved' : 'Submission rejected')
    } catch {
      toast.error('Action failed')
    } finally {
      setActing(null)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Inbox</h1>
        <p className="text-muted-foreground text-sm mt-0.5">URL submissions from the team</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border">
        {(['PENDING', 'APPROVED', 'REJECTED'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-[#385FF6] text-[#385FF6]' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      {subs === null && (
        <div className="space-y-3">
          {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
        </div>
      )}

      {subs !== null && subs.length === 0 && (
        <div className="text-center py-16">
          <Inbox className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No {tab.toLowerCase()} submissions</p>
        </div>
      )}

      {subs !== null && subs.length > 0 && (
        <div className="space-y-3">
          {subs.map(s => (
            <div key={s.id} className="rounded-lg border border-border/60 p-4 space-y-3 hover:bg-muted/10 transition-colors">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href={s.url} target="_blank" rel="noreferrer"
                      className="text-sm font-medium hover:text-[#385FF6] transition-colors flex items-center gap-1">
                      {s.url.replace('https://getdriversed.com', '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    <Badge variant="outline" className={`text-[10px] ${PRIORITY_COLOR[s.priority]}`}>
                      {s.priority}
                    </Badge>
                  </div>
                  {s.primaryKeyword && (
                    <p className="text-xs text-muted-foreground">KW: {s.primaryKeyword}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    {s.submittedBy.name} · {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>

                {tab === 'PENDING' && (
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs border-red-400/30 text-red-400 hover:bg-red-400/10"
                      onClick={() => act(s.id, 'REJECTED')}
                      disabled={acting === s.id}
                    >
                      <XCircle className="h-3 w-3 mr-1" />Reject
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs gde-gradient text-white border-0"
                      onClick={() => act(s.id, 'APPROVED')}
                      disabled={acting === s.id}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />Approve
                    </Button>
                  </div>
                )}
              </div>

              {(s.businessContext || s.whyThisMatters) && (
                <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border/50">
                  {s.businessContext && <p><span className="font-medium text-foreground">Context:</span> {s.businessContext}</p>}
                  {s.whyThisMatters && <p><span className="font-medium text-foreground">Why:</span> {s.whyThisMatters}</p>}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
