'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CheckCircle2, XCircle, RefreshCw, Loader2, Database } from 'lucide-react'

export default function GscSettingsPage() {
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const siteUrl = process.env.NEXT_PUBLIC_GSC_SITE_URL ?? 'sc-domain:getdriversed.com'

  useEffect(() => {
    fetch('/api/gsc/status').then(r => r.json()).then(d => setLastSync(d.lastSync ?? null)).catch(() => {})
  }, [])

  async function sync() {
    setSyncing(true)
    try {
      const res = await fetch('/api/gsc/sync', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Sync failed')
      setLastSync(new Date().toISOString())
      toast.success(`Synced ${data.synced} pages${data.failed > 0 ? ` (${data.failed} failed)` : ''}`)
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div>
        <h1 className="text-xl font-bold tracking-tight">GSC Integration</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Google Search Console connection settings</p>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center justify-between">
            Connection Status
            <Badge variant="outline" className="text-emerald-500 border-emerald-500/30 bg-emerald-500/10 text-[10px]">
              <CheckCircle2 className="h-3 w-3 mr-1" />Connected
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Property</span>
              <span className="font-mono text-xs">{siteUrl}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service Account</span>
              <span className="font-mono text-xs truncate max-w-[200px]">gde-seo-bot@…</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Last Sync</span>
              <span className="text-xs">
                {lastSync
                  ? new Date(lastSync).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'Never'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Schedule</span>
              <span className="text-xs">Daily at 2:00 AM UTC</span>
            </div>
          </div>

          <Button
            size="sm"
            className="w-full"
            variant="outline"
            onClick={sync}
            disabled={syncing}
          >
            {syncing
              ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Syncing…</>
              : <><RefreshCw className="h-4 w-4 mr-2" />Sync Now</>
            }
          </Button>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">About GSC Sync</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground space-y-2">
          <p>The GSC sync job pulls the previous day&apos;s search analytics data for every page tracked in the portal.</p>
          <p>Data includes: queries, impressions, clicks, CTR, and average position — stored per page, per query, per day.</p>
          <p>The sync runs automatically every day at 2:00 AM UTC via Railway cron. You can also trigger it manually above.</p>
          <p className="text-amber-400">Note: GSC data is typically delayed by 2–3 days. Same-day data is never available.</p>
        </CardContent>
      </Card>
    </div>
  )
}
