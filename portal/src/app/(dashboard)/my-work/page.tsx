import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { StatusBadge } from '@/components/StatusBadge'
import { ScoreDelta } from '@/components/DeltaBadge'
import { Badge } from '@/components/ui/badge'
import { Briefcase } from 'lucide-react'

export const metadata = { title: 'My Work' }

export default async function MyWorkPage() {
  const session = await auth()
  if (!session) return null

  const pages = await prisma.page.findMany({
    where: { owner: { email: session.user.email ?? '' } },
    orderBy: { updatedAt: 'desc' },
    include: { owner: { select: { name: true } } },
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold tracking-tight">My Work</h1>
        <p className="text-muted-foreground text-sm mt-0.5">{pages.length} page{pages.length !== 1 ? 's' : ''} assigned to you</p>
      </div>

      {pages.length === 0 && (
        <div className="text-center py-16">
          <Briefcase className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No pages assigned to you yet</p>
          <p className="text-xs text-muted-foreground mt-1">A manager can assign pages to you from the Pages table</p>
        </div>
      )}

      {pages.length > 0 && (
        <div className="rounded-lg border border-border overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {['Page', 'Status', 'Type', 'Score', 'Optimized'].map(h => (
                  <th key={h} className="px-3 py-2.5 text-left text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pages.map(p => (
                <tr key={p.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                  <td className="px-3 py-2.5 max-w-[260px]">
                    <Link href={`/pages/${p.slug}`} className="font-medium hover:text-[#385FF6] transition-colors truncate block">
                      {p.primaryKeyword}
                    </Link>
                    <span className="text-xs text-muted-foreground truncate block max-w-[200px]">
                      {p.url.replace('https://getdriversed.com', '')}
                    </span>
                  </td>
                  <td className="px-3 py-2.5"><StatusBadge status={p.status} /></td>
                  <td className="px-3 py-2.5">
                    <Badge variant="outline" className="text-[11px] font-normal">{p.pageType}</Badge>
                  </td>
                  <td className="px-3 py-2.5"><ScoreDelta before={p.scoreBefore} after={p.scoreAfter} /></td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground whitespace-nowrap">
                    {p.dateOptimized
                      ? new Date(p.dateOptimized).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' })
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
