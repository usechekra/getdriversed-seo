/**
 * /preview — Static UI preview, no database required.
 * Shows the dashboard, pages table, and reports with mock data.
 */
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { StatusBadge } from '@/components/StatusBadge'
import { ScoreDelta } from '@/components/DeltaBadge'
import { FileText, Clock, CheckCircle, TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react'
import { PreviewPagesTable } from './PreviewPagesTable'
import { PreviewReports } from './PreviewReports'

// ── Mock data ─────────────────────────────────────────────────────────────────

const MOCK_PAGES = [
  { id:'1', url:'https://getdriversed.com/courses-details/california-traffic-school', slug:'california-traffic-school', primaryKeyword:'California Traffic School Online', pageType:'state-course-page', state:'CA', status:'COMPLETED',   scoreBefore:52, scoreAfter:91, dateOptimized:'2026-04-18', updatedAt:'2026-04-18', owner:{ name:'Elyas' } },
  { id:'2', url:'https://getdriversed.com/courses-details/texas-drivers-ed',            slug:'texas-drivers-ed',            primaryKeyword:'Texas Drivers Ed Online',            pageType:'state-course-page', state:'TX', status:'IN_PROGRESS', scoreBefore:48, scoreAfter:null, dateOptimized:null, updatedAt:'2026-04-17', owner:{ name:'Elyas' } },
  { id:'3', url:'https://getdriversed.com/courses-details/florida-traffic-school',      slug:'florida-traffic-school',      primaryKeyword:'Florida Traffic School Online',      pageType:'state-course-page', state:'FL', status:'READY_FOR_DEV', scoreBefore:44, scoreAfter:88, dateOptimized:'2026-04-15', updatedAt:'2026-04-16', owner:{ name:'Sarah' } },
  { id:'4', url:'https://getdriversed.com/courses-details/new-york-drivers-ed',         slug:'new-york-drivers-ed',         primaryKeyword:'New York Drivers Ed Online',         pageType:'state-course-page', state:'NY', status:'QUEUED',      scoreBefore:null, scoreAfter:null, dateOptimized:null, updatedAt:'2026-04-14', owner:null },
  { id:'5', url:'https://getdriversed.com/courses-details/ohio-traffic-school',         slug:'ohio-traffic-school',         primaryKeyword:'Ohio Traffic School Online',         pageType:'state-course-page', state:'OH', status:'IMPLEMENTED', scoreBefore:55, scoreAfter:87, dateOptimized:'2026-04-10', updatedAt:'2026-04-12', owner:{ name:'Marcus' } },
  { id:'6', url:'https://getdriversed.com/blog/teen-drivers-ed-tips',                   slug:'teen-drivers-ed-tips',        primaryKeyword:'Teen Drivers Ed Tips',               pageType:'blog-informational', state:null, status:'COMPLETED',  scoreBefore:38, scoreAfter:84, dateOptimized:'2026-04-08', updatedAt:'2026-04-09', owner:{ name:'Sarah' } },
  { id:'7', url:'https://getdriversed.com/courses-details/arizona-defensive-driving',   slug:'arizona-defensive-driving',   primaryKeyword:'Arizona Defensive Driving Course',   pageType:'state-course-page', state:'AZ', status:'IN_PROGRESS', scoreBefore:41, scoreAfter:null, dateOptimized:null, updatedAt:'2026-04-07', owner:{ name:'Elyas' } },
  { id:'8', url:'https://getdriversed.com/courses-details/georgia-drivers-ed',          slug:'georgia-drivers-ed',          primaryKeyword:'Georgia Drivers Ed Online',          pageType:'state-course-page', state:'GA', status:'QUEUED',      scoreBefore:null, scoreAfter:null, dateOptimized:null, updatedAt:'2026-04-06', owner:null },
]

const MOCK_HISTORY = [
  { id:'h1', page:{ slug:'california-traffic-school', primaryKeyword:'California Traffic School Online' }, action:'STATUS_CHANGE', toValue:'COMPLETED', createdAt:'2026-04-18T14:22:00Z' },
  { id:'h2', page:{ slug:'florida-traffic-school',    primaryKeyword:'Florida Traffic School Online' },    action:'STATUS_CHANGE', toValue:'READY_FOR_DEV', createdAt:'2026-04-16T10:05:00Z' },
  { id:'h3', page:{ slug:'ohio-traffic-school',       primaryKeyword:'Ohio Traffic School Online' },       action:'STATUS_CHANGE', toValue:'IMPLEMENTED', createdAt:'2026-04-12T09:30:00Z' },
  { id:'h4', page:{ slug:'teen-drivers-ed-tips',      primaryKeyword:'Teen Drivers Ed Tips' },             action:'STATUS_CHANGE', toValue:'COMPLETED', createdAt:'2026-04-09T16:45:00Z' },
  { id:'h5', page:{ slug:'texas-drivers-ed',          primaryKeyword:'Texas Drivers Ed Online' },          action:'STATUS_CHANGE', toValue:'IN_PROGRESS', createdAt:'2026-04-07T11:20:00Z' },
]

const MOCK_SITEWIDE = [
  { id:1, title:'Fix 5,455 duplicate meta descriptions', status:'IN_PROGRESS' },
  { id:2, title:'Fix 5,460 duplicate title tags',        status:'IN_PROGRESS' },
  { id:3, title:'Remove Organization schema from non-homepage pages', status:'NOT_STARTED' },
  { id:4, title:'Add BreadcrumbList schema to all pages', status:'NOT_STARTED' },
  { id:5, title:'Consolidate /course/ → /courses-details/ URL pattern', status:'NOT_STARTED' },
  { id:6, title:'Batch fill missing image alt text', status:'COMPLETE' },
]

const sitewideComplete = MOCK_SITEWIDE.filter(i => i.status === 'COMPLETE').length
const sitewideProgress = Math.round((sitewideComplete / MOCK_SITEWIDE.length) * 100)

const metrics = [
  { label:'Total Optimized', value:8,          icon:FileText,     color:'text-[#385FF6]' },
  { label:'In Progress',     value:2,           icon:Clock,        color:'text-amber-500' },
  { label:'Queued',          value:2,           icon:AlertTriangle,color:'text-slate-400' },
  { label:'Completed',       value:3,           icon:CheckCircle,  color:'text-emerald-500' },
  { label:'Avg Score',       value:'88/100',    icon:TrendingUp,   color:'text-[#9EAAFF]' },
]

// ── Preview layout ────────────────────────────────────────────────────────────

export default function PreviewPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-56 flex flex-col bg-[#0f1117] border-r border-[#1e2332] z-40">
        <div className="h-14 flex items-center px-4 border-b border-[#1e2332] shrink-0">
          <span className="text-white font-bold text-sm tracking-tight">
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(117deg,#385FF6,#9EAAFF)' }}>GDE</span>
            <span className="text-slate-400 font-normal ml-1.5">SEO Ops</span>
          </span>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          <div className="space-y-0.5">
            {[
              ['Dashboard',  '#dash'],
              ['Pages',      '#pages'],
              ['My Work',    '#'],
              ['Submit URL', '#'],
              ['Inbox',      '#'],
              ['Sitewide',   '#'],
              ['Reports',    '#reports'],
            ].map(([label, href], i) => (
              <a key={label} href={href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors ${i === 0 ? 'bg-[#1a2040] text-white' : 'text-slate-400 hover:text-white hover:bg-[#1a1f2e]'}`}>
                <span className="h-4 w-4 shrink-0 text-slate-500">·</span>
                <span className="flex-1">{label}</span>
                {i === 0 && <ChevronRight className="h-3 w-3 text-[#9EAAFF]" />}
              </a>
            ))}
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] text-slate-600 uppercase tracking-widest px-3 mb-1.5">Settings</p>
            {['Team', 'GSC', 'Profile'].map(label => (
              <a key={label} href="#"
                className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm text-slate-400 hover:text-white hover:bg-[#1a1f2e]">
                <span className="h-4 w-4 shrink-0 text-slate-500">·</span>
                <span>{label}</span>
              </a>
            ))}
          </div>
        </nav>
        <div className="h-0.5" style={{ backgroundImage: 'linear-gradient(117deg,#385FF6,#9EAAFF)', opacity: 0.6 }} />
      </aside>

      {/* Main */}
      <div className="pl-56 flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-14 flex items-center justify-between px-6 bg-background/95 border-b border-border sticky top-0 z-30">
          <p className="text-xs text-muted-foreground">
            <span className="text-amber-400 font-medium">Preview Mode</span> — no database connected
          </p>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundImage: 'linear-gradient(117deg,#385FF6,#9EAAFF)' }}>E</div>
            <span className="text-xs font-medium">Elyas</span>
            <Badge variant="outline" className="text-[10px] text-red-400 border-red-400/30">ADMIN</Badge>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-8">

          {/* ── DASHBOARD ── */}
          <section id="dash" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span className="font-mono text-[#385FF6] font-semibold">/ dashboard</span>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground text-sm mt-0.5">Welcome back, <span className="text-foreground font-medium">Elyas</span></p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {metrics.map(({ label, value, icon: Icon, color }) => (
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 border-border/60">
                <CardHeader className="pb-3"><CardTitle className="text-sm font-semibold">Recent Activity</CardTitle></CardHeader>
                <CardContent className="space-y-0">
                  {MOCK_HISTORY.map(h => (
                    <div key={h.id} className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#385FF6] mt-2 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">
                          <span className="font-medium">{h.page.primaryKeyword}</span>
                          <span className="text-muted-foreground ml-1.5">— {h.action.replace(/_/g,' ')}</span>
                          {h.toValue && <StatusBadge status={h.toValue} />}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(h.createdAt).toLocaleDateString('en-US', { month:'short', day:'numeric', hour:'2-digit', minute:'2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/60">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold flex items-center justify-between">
                    Sitewide Backlog
                    <span className="text-xs font-normal text-muted-foreground">{sitewideComplete}/{MOCK_SITEWIDE.length} done</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-2 bg-muted rounded-full mb-4 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width:`${sitewideProgress}%`, backgroundImage:'linear-gradient(117deg,#385FF6,#9EAAFF)' }} />
                  </div>
                  <div className="space-y-2">
                    {MOCK_SITEWIDE.slice(0,6).map(issue => (
                      <div key={issue.id} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${issue.status==='COMPLETE' ? 'bg-emerald-500' : issue.status==='IN_PROGRESS' ? 'bg-[#385FF6]' : 'bg-slate-300 dark:bg-slate-600'}`} />
                        <span className={`truncate ${issue.status==='COMPLETE' ? 'line-through text-muted-foreground' : ''}`}>
                          #{issue.id} {issue.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          <div className="border-t border-border/30" />

          {/* ── PAGES TABLE ── */}
          <section id="pages" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span className="font-mono text-[#385FF6] font-semibold">/ pages</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight">Pages</h2>
                <p className="text-muted-foreground text-sm mt-0.5">{MOCK_PAGES.length} pages tracked</p>
              </div>
            </div>
            <PreviewPagesTable pages={MOCK_PAGES} />
          </section>

          <div className="border-t border-border/30" />

          {/* ── REPORTS ── */}
          <section id="reports" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span className="font-mono text-[#385FF6] font-semibold">/ reports</span>
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">Reports</h2>
              <p className="text-muted-foreground text-sm mt-0.5">SEO performance overview</p>
            </div>
            <PreviewReports pages={MOCK_PAGES} sitewideProgress={sitewideProgress} sitewideComplete={sitewideComplete} sitewideTotal={MOCK_SITEWIDE.length} />
          </section>

        </main>
      </div>
    </div>
  )
}
