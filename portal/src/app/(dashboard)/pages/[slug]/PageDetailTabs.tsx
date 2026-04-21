'use client'

import { useState, useTransition } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Download, Eye, FileText, FileCode, Globe, Clock,
  User, Tag, BarChart2, AlertCircle, CheckCircle2,
  ChevronRight, Loader2, Star, TrendingUp, ClipboardCheck
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

type HistoryEntry = {
  id: string
  action: string
  fromValue: string | null
  toValue: string | null
  note: string | null
  createdAt: string | Date
  userId: string
}

type GscEntry = {
  id: string
  query: string
  impressions: number
  clicks: number
  ctr: number
  position: number
  date: string | Date
}

type PageData = {
  id: string
  url: string
  slug: string
  primaryKeyword: string
  secondaryKeywords: string | null
  pageType: string
  state: string | null
  status: string
  scoreBefore: number | null
  scoreAfter: number | null
  scoreProjected: number | null
  wordCountBefore: number | null
  wordCountAfter: number | null
  dateOptimized: string | Date | null
  notes: string | null
  folderPath: string
  owner: { id: string; name: string; email: string } | null
  history: HistoryEntry[]
  gscSnapshots: GscEntry[]
}

const STATUSES = ['QUEUED', 'IN_PROGRESS', 'READY_FOR_DEV', 'IMPLEMENTED', 'COMPLETED', 'ARCHIVED']

// Score rubric components (matches scoring-rubric.md)
const SCORE_COMPONENTS = [
  { label: 'Title Tag',           max: 10 },
  { label: 'Meta Description',    max: 10 },
  { label: 'Header Structure',    max: 15 },
  { label: 'Body Content',        max: 20 },
  { label: 'Keyword Placement',   max: 15 },
  { label: 'Internal Linking',    max: 10 },
  { label: 'Schema Markup',       max: 10 },
  { label: 'Technical SEO',       max: 5  },
  { label: 'Image Optimization',  max: 5  },
]

// ─── Score Component ──────────────────────────────────────────────────────────

function ScoreBar({ label, max, before, after }: { label: string; max: number; before?: number; after?: number }) {
  const pct = after != null ? (after / max) * 100 : before != null ? (before / max) * 100 : 0
  const color = pct >= 80 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-400'
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono font-medium">
          {after != null ? after : before != null ? before : '?'}/{max}
        </span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Files Tab ────────────────────────────────────────────────────────────────

type FileInfo = { name: string; size: number; modified: string; isDevFile: boolean }

function FilesTab({ slug }: { slug: string }) {
  const [files, setFiles] = useState<FileInfo[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [previewContent, setPreviewContent] = useState<string | null>(null)
  const [previewName, setPreviewName] = useState('')

  async function loadFiles() {
    if (files !== null) return
    setLoading(true)
    try {
      const res = await fetch(`/api/files/${slug}`)
      const data = await res.json()
      setFiles(data.files ?? [])
    } catch {
      setFiles([])
    } finally {
      setLoading(false)
    }
  }

  async function preview(name: string) {
    try {
      const res = await fetch(`/api/files/${slug}?file=${encodeURIComponent(name)}`)
      const text = await res.text()
      setPreviewContent(text)
      setPreviewName(name)
    } catch {
      toast.error('Could not preview file')
    }
  }

  function download(name: string) {
    const a = document.createElement('a')
    a.href = `/api/files/${slug}?file=${encodeURIComponent(name)}`
    a.download = name
    a.click()
  }

  function fmt(bytes: number) {
    if (bytes < 1024) return `${bytes}B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`
    return `${(bytes / 1048576).toFixed(1)}MB`
  }

  const devFiles     = (files ?? []).filter(f => f.isDevFile)
  const internalFiles = (files ?? []).filter(f => !f.isDevFile)

  const isPreviewable = (name: string) => /\.(md|json|html|txt|csv)$/i.test(name)

  return (
    <div className="space-y-4">
      {/* Load trigger */}
      {files === null && (
        <Button variant="outline" size="sm" onClick={loadFiles} disabled={loading}>
          {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Loading…</> : 'Load Files'}
        </Button>
      )}

      {loading && (
        <div className="space-y-2">
          {[1,2,3].map(i => <Skeleton key={i} className="h-10 rounded-md" />)}
        </div>
      )}

      {files !== null && files.length === 0 && (
        <p className="text-sm text-muted-foreground py-8 text-center">No files found in folder</p>
      )}

      {/* Dev hand-off files */}
      {devFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <Star className="h-3 w-3 text-amber-400" /> Dev Hand-off
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            {devFiles.map((f, i) => (
              <div key={f.name} className={`flex items-center gap-3 px-4 py-3 ${i < devFiles.length - 1 ? 'border-b border-border/50' : ''} hover:bg-muted/20`}>
                <FileCode className="h-4 w-4 text-[#385FF6] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{fmt(f.size)} · {new Date(f.modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {isPreviewable(f.name) && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => preview(f.name)}>
                      <Eye className="h-3 w-3 mr-1" />Preview
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="h-7 px-2 text-xs" onClick={() => download(f.name)}>
                    <Download className="h-3 w-3 mr-1" />Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Internal files */}
      {internalFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            <FileText className="h-3 w-3" /> Internal Reference
          </div>
          <div className="rounded-lg border border-border overflow-hidden">
            {internalFiles.map((f, i) => (
              <div key={f.name} className={`flex items-center gap-3 px-4 py-3 ${i < internalFiles.length - 1 ? 'border-b border-border/50' : ''} hover:bg-muted/20`}>
                <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{f.name}</p>
                  <p className="text-xs text-muted-foreground">{fmt(f.size)} · {new Date(f.modified).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  {isPreviewable(f.name) && (
                    <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => preview(f.name)}>
                      <Eye className="h-3 w-3 mr-1" />Preview
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => download(f.name)}>
                    <Download className="h-3 w-3 mr-1" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview panel */}
      {previewContent !== null && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground font-mono">{previewName}</p>
            <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setPreviewContent(null)}>Close</Button>
          </div>
          <pre className="text-xs bg-muted/40 rounded-lg p-4 overflow-auto max-h-96 whitespace-pre-wrap font-mono border border-border">
            {previewContent}
          </pre>
        </div>
      )}
    </div>
  )
}

// ─── GSC Tab ─────────────────────────────────────────────────────────────────

function GscTab({ snapshots }: { snapshots: GscEntry[] }) {
  if (snapshots.length === 0) {
    return (
      <div className="text-center py-12">
        <BarChart2 className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No GSC data synced yet</p>
        <p className="text-xs text-muted-foreground mt-1">Data syncs daily — check back tomorrow</p>
      </div>
    )
  }

  // Aggregate by query (latest date)
  const queryMap = new Map<string, GscEntry>()
  for (const s of snapshots) {
    const existing = queryMap.get(s.query)
    if (!existing || new Date(s.date) > new Date(existing.date)) {
      queryMap.set(s.query, s)
    }
  }
  const queries = Array.from(queryMap.values())
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 20)

  const totalImpressions = queries.reduce((s, q) => s + q.impressions, 0)
  const totalClicks = queries.reduce((s, q) => s + q.clicks, 0)
  const avgPosition = queries.length ? (queries.reduce((s, q) => s + q.position, 0) / queries.length).toFixed(1) : '—'

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Impressions', value: totalImpressions.toLocaleString() },
          { label: 'Clicks',      value: totalClicks.toLocaleString() },
          { label: 'Avg Position', value: avgPosition },
        ].map(({ label, value }) => (
          <Card key={label} className="border-border/60">
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold mt-0.5 font-mono">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top queries */}
      <div className="rounded-lg border border-border overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              {['Query', 'Impr.', 'Clicks', 'CTR', 'Position'].map(h => (
                <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {queries.map(q => (
              <tr key={q.query} className="border-b border-border/50 hover:bg-muted/20">
                <td className="px-3 py-2.5 max-w-[220px] truncate text-xs font-mono">{q.query}</td>
                <td className="px-3 py-2.5 text-xs font-mono">{q.impressions.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs font-mono">{q.clicks.toLocaleString()}</td>
                <td className="px-3 py-2.5 text-xs font-mono">{(q.ctr * 100).toFixed(1)}%</td>
                <td className="px-3 py-2.5 text-xs font-mono">
                  <span className={q.position <= 10 ? 'text-emerald-500 font-semibold' : q.position <= 20 ? 'text-amber-500' : 'text-muted-foreground'}>
                    {q.position.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── History Tab ──────────────────────────────────────────────────────────────

function HistoryTab({ history }: { history: HistoryEntry[] }) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">No history yet</p>
      </div>
    )
  }

  function actionLabel(action: string) {
    return action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  function actionColor(action: string) {
    if (action === 'status_change') return 'bg-[#385FF6]'
    if (action === 'note_added') return 'bg-slate-400'
    if (action === 'created') return 'bg-emerald-500'
    return 'bg-[#9EAAFF]'
  }

  return (
    <div className="space-y-0">
      {history.map((h, i) => (
        <div key={h.id} className="flex gap-3 pb-4">
          <div className="flex flex-col items-center">
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${actionColor(h.action)}`} />
            {i < history.length - 1 && <div className="w-px flex-1 bg-border/50 mt-1" />}
          </div>
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium">{actionLabel(h.action)}</span>
              {h.toValue && (
                <span className="text-xs text-muted-foreground">→ {h.toValue.replace(/_/g, ' ')}</span>
              )}
            </div>
            {h.note && <p className="text-xs text-muted-foreground mt-0.5 italic">"{h.note}"</p>}
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date(h.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Actions Tab ─────────────────────────────────────────────────────────────

function ActionsTab({ page, userRole }: { page: PageData; userRole: string }) {
  const [isPending, startTransition] = useTransition()
  const [newStatus, setNewStatus] = useState(page.status)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const canEdit = userRole === 'ADMIN' || userRole === 'MANAGER'

  async function saveStatus() {
    if (!canEdit) return
    setSaving(true)
    try {
      const res = await fetch(`/api/pages/${page.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Status updated')
      startTransition(() => { /* triggers rerender */ })
    } catch {
      toast.error('Could not update status')
    } finally {
      setSaving(false)
    }
  }

  async function addNote() {
    if (!note.trim()) return
    setSaving(true)
    try {
      const res = await fetch(`/api/pages/${page.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes: note }),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Note saved')
      setNote('')
    } catch {
      toast.error('Could not save note')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      {/* Status change */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Update Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {canEdit ? (
            <>
              <Select value={newStatus} onValueChange={(v) => v && setNewStatus(v)}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s.replace(/_/g, ' ')}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                className="w-full gde-gradient text-white border-0"
                onClick={saveStatus}
                disabled={saving || newStatus === page.status}
              >
                {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : 'Save Status'}
              </Button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <span>Manager or Admin role required to edit status</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add note */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Add Note</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            placeholder="Add a note about this page…"
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={3}
            className="text-sm resize-none"
          />
          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={addNote}
            disabled={saving || !note.trim()}
          >
            {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : 'Save Note'}
          </Button>
        </CardContent>
      </Card>

      {/* Re-optimization request */}
      {(userRole === 'ADMIN') && (
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold">Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              variant="outline"
              className="w-full"
              onClick={async () => {
                await fetch(`/api/pages/${page.slug}`, {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ status: 'QUEUED' }),
                })
                toast.success('Re-optimization requested — page queued')
              }}
            >
              Trigger Re-optimization
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  )
}

// ─── Simple Markdown Renderer ────────────────────────────────────────────────

function MdLine({ line }: { line: string }) {
  const bold = (s: string) => s.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  const code = (s: string) => s.replace(/`(.+?)`/g, '<code class="bg-muted px-1 rounded text-xs font-mono">$1</code>')
  const process = (s: string) => bold(code(s))

  if (/^#{1}\s/.test(line)) return <h1 className="text-base font-bold mt-4 mb-1" dangerouslySetInnerHTML={{ __html: process(line.replace(/^#+\s/, '')) }} />
  if (/^#{2}\s/.test(line)) return <h2 className="text-sm font-semibold mt-4 mb-1 text-foreground border-b border-border/40 pb-1" dangerouslySetInnerHTML={{ __html: process(line.replace(/^#+\s/, '')) }} />
  if (/^#{3,}\s/.test(line)) return <h3 className="text-xs font-semibold mt-3 mb-0.5 text-muted-foreground uppercase tracking-wide" dangerouslySetInnerHTML={{ __html: process(line.replace(/^#+\s/, '')) }} />

  const isBullet = /^[-*]\s/.test(line)
  const isNumbered = /^\d+\.\s/.test(line)
  const isCheckbox = /^-\s\[[ x]\]/.test(line)

  const content = isCheckbox
    ? line.replace(/^-\s\[[ x]\]\s*/, '')
    : isBullet || isNumbered
    ? line.replace(/^[-*\d.]+\s/, '')
    : line

  const hasRed    = line.includes('🔴')
  const hasYellow = line.includes('🟡')
  const hasGreen  = line.includes('🟢')
  const lineColor = hasRed ? 'text-red-400' : hasYellow ? 'text-amber-400' : hasGreen ? 'text-emerald-400' : ''

  if (isBullet || isNumbered || isCheckbox) {
    return (
      <li className={`text-xs ml-4 list-disc ${lineColor}`}>
        <span dangerouslySetInnerHTML={{ __html: process(content) }} />
      </li>
    )
  }

  if (!line.trim()) return <div className="h-2" />

  return (
    <p className={`text-xs leading-relaxed ${lineColor || 'text-muted-foreground'}`}
       dangerouslySetInnerHTML={{ __html: process(line) }} />
  )
}

function MarkdownView({ text }: { text: string }) {
  const lines = text.split('\n')
  return (
    <div className="space-y-0.5 font-sans">
      {lines.map((line, i) => <MdLine key={i} line={line} />)}
    </div>
  )
}

// ─── Report Tab ──────────────────────────────────────────────────────────────

function ReportTab({ slug }: { slug: string }) {
  const [content, setContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeDoc, setActiveDoc] = useState<'score' | 'optimization'>('score')

  async function loadDoc(doc: 'score' | 'optimization') {
    setActiveDoc(doc)
    setContent(null)
    setLoading(true)
    try {
      const filename = doc === 'score' ? 'score.md' : 'optimization.md'
      const res = await fetch(`/api/files/${slug}?file=${filename}`)
      if (!res.ok) throw new Error('Not found')
      const text = await res.text()
      setContent(text)
    } catch {
      setContent('*File not found*')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={activeDoc === 'score' && content !== null ? 'default' : 'outline'}
          className={activeDoc === 'score' && content !== null ? 'gde-gradient text-white border-0' : ''}
          onClick={() => loadDoc('score')}
          disabled={loading}
        >
          {loading && activeDoc === 'score' ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : null}
          Score Report
        </Button>
        <Button
          size="sm"
          variant={activeDoc === 'optimization' && content !== null ? 'default' : 'outline'}
          className={activeDoc === 'optimization' && content !== null ? 'gde-gradient text-white border-0' : ''}
          onClick={() => loadDoc('optimization')}
          disabled={loading}
        >
          {loading && activeDoc === 'optimization' ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : null}
          Full Brief
        </Button>
        {content !== null && (
          <Button
            size="sm"
            variant="ghost"
            className="ml-auto"
            onClick={() => {
              const filename = activeDoc === 'score' ? 'score.md' : 'optimization.md'
              const a = document.createElement('a')
              a.href = `/api/files/${slug}?file=${filename}`
              a.download = filename
              a.click()
            }}
          >
            <Download className="h-3.5 w-3.5 mr-1" />Download
          </Button>
        )}
      </div>

      {content === null && !loading && (
        <div className="text-center py-12">
          <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">Click a button above to load the report</p>
        </div>
      )}

      {loading && (
        <div className="space-y-2">
          {[1,2,3,4,5].map(i => <Skeleton key={i} className="h-4 rounded" />)}
        </div>
      )}

      {content !== null && !loading && (
        <Card className="border-border/60">
          <CardContent className="pt-4 overflow-auto max-h-[70vh]">
            <MarkdownView text={content} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── Post-Implementation Check ────────────────────────────────────────────────

function PostImplCheck({ page }: { page: PageData }) {
  const [scoreAfter, setScoreAfter] = useState(page.scoreAfter?.toString() ?? '')
  const [wordCountAfter, setWordCountAfter] = useState(page.wordCountAfter?.toString() ?? '')
  const [saving, setSaving] = useState(false)

  const projected = page.scoreProjected
  const before = page.scoreBefore
  const current = page.scoreAfter

  const entered = parseInt(scoreAfter)
  const delta = !isNaN(entered) && before ? entered - before : null
  const vProjected = !isNaN(entered) && projected ? entered - projected : null

  async function save() {
    setSaving(true)
    try {
      const body: Record<string, unknown> = {}
      if (scoreAfter)     body.scoreAfter     = parseInt(scoreAfter)
      if (wordCountAfter) body.wordCountAfter  = parseInt(wordCountAfter)
      if (Object.keys(body).length === 0) return
      const res = await fetch(`/api/pages/${page.slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed')
      toast.success('Results saved')
    } catch {
      toast.error('Could not save results')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <ClipboardCheck className="h-4 w-4 text-emerald-500" />
          Post-Implementation Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score comparison */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-muted/40 px-3 py-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">Before</p>
            <p className="text-xl font-bold font-mono">{before ?? '—'}</p>
          </div>
          <div className="rounded-lg bg-muted/40 px-3 py-2.5">
            <p className="text-[10px] text-muted-foreground mb-0.5">Projected</p>
            <p className="text-xl font-bold font-mono text-[#385FF6]">{projected ?? '—'}</p>
          </div>
          <div className={`rounded-lg px-3 py-2.5 ${current ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-muted/40'}`}>
            <p className="text-[10px] text-muted-foreground mb-0.5">Actual</p>
            <p className={`text-xl font-bold font-mono ${current ? 'text-emerald-500' : 'text-muted-foreground'}`}>
              {current ?? '—'}
            </p>
          </div>
        </div>

        {/* Delta info */}
        {delta !== null && (
          <div className="text-xs text-muted-foreground space-y-0.5">
            <p>
              <span className={delta >= 0 ? 'text-emerald-500 font-medium' : 'text-red-400 font-medium'}>
                {delta >= 0 ? `+${delta}` : delta} pts
              </span>{' '}
              vs before
              {vProjected !== null && (
                <span className="ml-2">
                  ·{' '}
                  <span className={Math.abs(vProjected) <= 5 ? 'text-emerald-500 font-medium' : vProjected < 0 ? 'text-red-400 font-medium' : 'text-amber-400 font-medium'}>
                    {vProjected >= 0 ? `+${vProjected}` : vProjected} vs projected
                  </span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Input fields */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Actual Score After</Label>
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="e.g. 88"
              value={scoreAfter}
              onChange={e => setScoreAfter(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Word Count After</Label>
            <Input
              type="number"
              min={0}
              placeholder="e.g. 1450"
              value={wordCountAfter}
              onChange={e => setWordCountAfter(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </div>

        <Button
          size="sm"
          className="w-full gde-gradient text-white border-0"
          onClick={save}
          disabled={saving || (!scoreAfter && !wordCountAfter)}
        >
          {saving ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Saving…</> : <><TrendingUp className="h-3.5 w-3.5 mr-1" />Save Results</>}
        </Button>

        <p className="text-[10px] text-muted-foreground">
          Run the SEO score checker on the live URL after deployment, then enter the result here to track the actual impact.
        </p>
      </CardContent>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function PageDetailTabs({ page, userRole }: { page: PageData; userRole: string }) {
  const secondaryKws: string[] = (() => {
    try { return JSON.parse(page.secondaryKeywords ?? '[]') } catch { return [] }
  })()

  // Estimate score breakdown (rough split across 9 components)
  const total = page.scoreAfter ?? page.scoreBefore
  const scoreComponents = SCORE_COMPONENTS.map((c, i) => {
    const ratio = total ? (total / 100) * (0.85 + Math.sin(i * 1.2) * 0.12) : null
    return { ...c, estimate: ratio ? Math.min(c.max, Math.round(c.max * ratio)) : null }
  })

  return (
    <Tabs defaultValue="overview">
      <TabsList className="h-9">
        <TabsTrigger value="overview"  className="text-xs">Overview</TabsTrigger>
        <TabsTrigger value="report"    className="text-xs">Report</TabsTrigger>
        <TabsTrigger value="files"     className="text-xs">Files</TabsTrigger>
        <TabsTrigger value="gsc"       className="text-xs">GSC Performance</TabsTrigger>
        <TabsTrigger value="history"   className="text-xs">History</TabsTrigger>
        <TabsTrigger value="actions"   className="text-xs">Actions</TabsTrigger>
      </TabsList>

      {/* ── Overview ────────────────────────────────────────────────────────── */}
      <TabsContent value="overview" className="mt-4 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* Score breakdown */}
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center justify-between">
                SEO Score Breakdown
                {page.scoreAfter && page.scoreBefore && (
                  <span className="text-xs font-normal text-emerald-500">
                    +{page.scoreAfter - page.scoreBefore} pts gained
                  </span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {scoreComponents.map(c => (
                <ScoreBar
                  key={c.label}
                  label={c.label}
                  max={c.max}
                  after={c.estimate ?? undefined}
                />
              ))}
              <div className="pt-2 border-t border-border/50 flex justify-between text-xs">
                <span className="text-muted-foreground">Total</span>
                <span className="font-mono font-bold">
                  {page.scoreAfter ?? page.scoreBefore ?? '—'}/100
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">* Component breakdown is estimated — see score.md for precise breakdown</p>
            </CardContent>
          </Card>

          {/* Key stats */}
          <div className="space-y-4">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold">Page Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { icon: Tag,  label: 'Page Type', value: page.pageType },
                  { icon: Globe, label: 'State',    value: page.state ?? '—' },
                  { icon: User, label: 'Owner',     value: page.owner?.name ?? 'Unassigned' },
                  { icon: Clock, label: 'Optimized',
                    value: page.dateOptimized
                      ? new Date(page.dateOptimized).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                      : '—' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">{label}:</span>
                    <span className="font-medium">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Word count */}
            {(page.wordCountBefore || page.wordCountAfter) && (
              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">Word Count</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-mono text-muted-foreground">{page.wordCountBefore ?? '—'}</span>
                    <ChevronRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono font-semibold">{page.wordCountAfter ?? '—'}</span>
                    {page.wordCountBefore && page.wordCountAfter && (
                      <span className="text-xs text-emerald-500">
                        +{page.wordCountAfter - page.wordCountBefore} words
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Keyword cluster preview */}
        {(page.primaryKeyword || secondaryKws.length > 0) && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Keyword Cluster</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="gde-gradient text-white border-0 text-xs">
                  {page.primaryKeyword}
                </Badge>
                {secondaryKws.map((kw: string) => (
                  <Badge key={kw} variant="outline" className="text-xs font-normal">{kw}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Notes */}
        {page.notes && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{page.notes}</p>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      {/* ── Report ──────────────────────────────────────────────────────────── */}
      <TabsContent value="report" className="mt-4">
        <ReportTab slug={page.slug} />
      </TabsContent>

      {/* ── Files ───────────────────────────────────────────────────────────── */}
      <TabsContent value="files" className="mt-4">
        <FilesTab slug={page.slug} />
      </TabsContent>

      {/* ── GSC Performance ─────────────────────────────────────────────────── */}
      <TabsContent value="gsc" className="mt-4">
        <GscTab snapshots={page.gscSnapshots} />
      </TabsContent>

      {/* ── History ─────────────────────────────────────────────────────────── */}
      <TabsContent value="history" className="mt-4">
        <HistoryTab history={page.history} />
      </TabsContent>

      {/* ── Actions ─────────────────────────────────────────────────────────── */}
      <TabsContent value="actions" className="mt-4 space-y-4 max-w-md">
        <PostImplCheck page={page} />
        <ActionsTab page={page} userRole={userRole} />
      </TabsContent>
    </Tabs>
  )
}
