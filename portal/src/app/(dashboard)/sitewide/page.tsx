import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { SitewideBoard } from './SitewideBoard'

export const metadata = { title: 'Sitewide Backlog' }

export default async function SitewidePage() {
  await auth()

  const issues = await prisma.sitewideIssue.findMany({ orderBy: { id: 'asc' } })

  const total    = issues.length
  const complete = issues.filter(i => i.status === 'COMPLETE').length
  const progress = total ? Math.round((complete / total) * 100) : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Sitewide Backlog</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{complete}/{total} issues complete · {progress}% done</p>
        </div>
        <div className="w-32">
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full rounded-full gde-gradient transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <SitewideBoard issues={issues} />
    </div>
  )
}
