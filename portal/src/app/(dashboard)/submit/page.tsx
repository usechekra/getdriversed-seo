'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { CheckCircle2, Loader2, Send } from 'lucide-react'

export default function SubmitPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [form, setForm] = useState({
    url: '',
    primaryKeyword: '',
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    businessContext: '',
    whyThisMatters: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.url) errs.url = 'URL is required'
    else if (!form.url.startsWith('http')) errs.url = 'Must be a full URL starting with https://'
    else if (!form.url.includes('getdriversed.com')) errs.url = 'Must be a getdriversed.com URL'
    return errs
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error?.formErrors?.[0] ?? 'Submission failed')
      }
      setDone(true)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto pt-12 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto">
          <CheckCircle2 className="h-6 w-6 text-emerald-500" />
        </div>
        <h2 className="text-lg font-bold">URL Submitted!</h2>
        <p className="text-sm text-muted-foreground">
          A brief has been created in the inbox. A manager will review and prioritize it.
        </p>
        <div className="flex gap-2 justify-center pt-2">
          <Button variant="outline" size="sm" onClick={() => { setDone(false); setForm({ url: '', primaryKeyword: '', priority: 'MEDIUM', businessContext: '', whyThisMatters: '' }) }}>
            Submit Another
          </Button>
          <Button size="sm" className="gde-gradient text-white border-0" onClick={() => router.push('/inbox')}>
            View Inbox →
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Submit URL</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Request a page to be optimized</p>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Page Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="url" className="text-xs">Page URL <span className="text-red-400">*</span></Label>
              <Input
                id="url"
                placeholder="https://getdriversed.com/courses-details/…"
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                className={`h-9 ${errors.url ? 'border-red-400' : ''}`}
              />
              {errors.url && <p className="text-xs text-red-400">{errors.url}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="kw" className="text-xs">Primary Keyword <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                id="kw"
                placeholder="e.g., California traffic school online"
                value={form.primaryKeyword}
                onChange={e => setForm(f => ({ ...f, primaryKeyword: e.target.value }))}
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Priority</Label>
              <Select value={form.priority} onValueChange={v => setForm(f => ({ ...f, priority: v as 'HIGH'|'MEDIUM'|'LOW' }))}>
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIGH">🔴 High</SelectItem>
                  <SelectItem value="MEDIUM">🟡 Medium</SelectItem>
                  <SelectItem value="LOW">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="context" className="text-xs">Business Context <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea
                id="context"
                placeholder="What's the business reason for optimizing this page? Revenue impact, competitive pressure, etc."
                value={form.businessContext}
                onChange={e => setForm(f => ({ ...f, businessContext: e.target.value }))}
                rows={3}
                className="text-sm resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="why" className="text-xs">Why This Page Matters <span className="text-muted-foreground">(optional)</span></Label>
              <Textarea
                id="why"
                placeholder="Why should this page rank? What's the user intent we're capturing?"
                value={form.whyThisMatters}
                onChange={e => setForm(f => ({ ...f, whyThisMatters: e.target.value }))}
                rows={3}
                className="text-sm resize-none"
              />
            </div>

            <Button type="submit" className="w-full gde-gradient text-white border-0" disabled={loading}>
              {loading
                ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</>
                : <><Send className="h-4 w-4 mr-2" />Submit for Review</>
              }
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
