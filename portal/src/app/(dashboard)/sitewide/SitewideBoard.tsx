'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AlertTriangle, Zap, Clock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'

type Issue = {
  id: number
  title: string
  description: string
  sprint: number
  severity: string
  effort: string
  status: string
  owner: string | null
  notes: string | null
}

type Col = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETE'

const COLS: { id: Col; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'NOT_STARTED', label: 'Not Started', icon: Clock, color: 'text-slate-400' },
  { id: 'IN_PROGRESS', label: 'In Progress',  icon: Zap, color: 'text-[#385FF6]' },
  { id: 'COMPLETE',    label: 'Complete',      icon: CheckCircle2, color: 'text-emerald-500' },
]

const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: 'text-red-400 border-red-400/30 bg-red-400/10',
  HIGH:     'text-orange-400 border-orange-400/30 bg-orange-400/10',
  MEDIUM:   'text-amber-400 border-amber-400/30 bg-amber-400/10',
  LOW:      'text-slate-400 border-slate-400/30 bg-slate-400/10',
}

function IssueCard({ issue, onMove }: { issue: Issue; onMove: (id: number, status: Col) => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="rounded-lg border border-border/60 bg-background p-3 space-y-2 hover:border-border transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs font-mono text-muted-foreground">#{issue.id}</span>
            <Badge variant="outline" className={`text-[10px] ${SEVERITY_COLOR[issue.severity] ?? ''}`}>
              {issue.severity}
            </Badge>
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Sprint {issue.sprint}
            </Badge>
          </div>
          <p className="text-sm font-medium leading-snug">{issue.title}</p>
        </div>
        <button onClick={() => setExpanded(e => !e)} className="text-muted-foreground hover:text-foreground shrink-0 mt-0.5">
          {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">{issue.description}</p>
          {issue.owner && <p className="text-xs text-muted-foreground">Owner: {issue.owner}</p>}
          {issue.notes && <p className="text-xs text-muted-foreground italic">"{issue.notes}"</p>}
          <div className="text-xs text-muted-foreground">Effort: {issue.effort}</div>
        </div>
      )}

      {/* Move buttons */}
      <div className="flex gap-1 flex-wrap pt-1">
        {COLS.filter(c => c.id !== issue.status).map(c => (
          <button
            key={c.id}
            onClick={() => onMove(issue.id, c.id)}
            className="text-[10px] text-muted-foreground hover:text-foreground border border-border/50 hover:border-border rounded px-2 py-0.5 transition-colors"
          >
            → {c.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SitewideBoard({ issues: initial }: { issues: Issue[] }) {
  const [issues, setIssues] = useState(initial)

  async function move(id: number, status: Col) {
    try {
      const res = await fetch('/api/sitewide', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (!res.ok) throw new Error()
      setIssues(prev => prev.map(i => i.id === id ? { ...i, status } : i))
      toast.success('Status updated')
    } catch {
      toast.error('Could not update issue')
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {COLS.map(col => {
        const colIssues = issues.filter(i => i.status === col.id)
        const Icon = col.icon
        return (
          <div key={col.id} className="space-y-3">
            <div className="flex items-center gap-2">
              <Icon className={`h-4 w-4 ${col.color}`} />
              <span className="text-sm font-medium">{col.label}</span>
              <span className="ml-auto text-xs text-muted-foreground font-mono">{colIssues.length}</span>
            </div>
            <div className="space-y-2 min-h-[100px]">
              {colIssues.map(issue => (
                <IssueCard key={issue.id} issue={issue} onMove={move} />
              ))}
              {colIssues.length === 0 && (
                <div className="rounded-lg border border-dashed border-border/40 h-16 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Empty</span>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
