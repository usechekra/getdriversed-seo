import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { ExternalLink, ChevronRight } from 'lucide-react'
import { StatusBadge } from '@/components/StatusBadge'
import { ScoreDelta } from '@/components/DeltaBadge'
import { PageDetailTabs } from './PageDetailTabs'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = await prisma.page.findUnique({ where: { slug }, select: { primaryKeyword: true } })
  return { title: page?.primaryKeyword ?? 'Page Detail' }
}

export default async function PageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const session = await auth()

  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      history: {
        orderBy: { createdAt: 'desc' },
        take: 50,
      },
      gscSnapshots: { orderBy: { date: 'desc' }, take: 90 },
    },
  })

  if (!page) notFound()

  const userRole = session?.user?.role ?? 'VIEWER'

  return (
    <div className="space-y-4">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link href="/pages" className="hover:text-foreground transition-colors">Pages</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{page.primaryKeyword}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight">{page.primaryKeyword}</h1>
            <StatusBadge status={page.status} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground font-mono truncate max-w-[400px]">
              {page.url.replace('https://getdriversed.com', '')}
            </span>
            <a
              href={page.url}
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <ScoreDelta before={page.scoreBefore} after={page.scoreAfter} />
      </div>

      {/* Tabs */}
      <PageDetailTabs page={page} userRole={userRole} />
    </div>
  )
}
