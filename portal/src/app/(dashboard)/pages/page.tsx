import { prisma } from '@/lib/db'
import { auth } from '@/lib/auth'
import { PagesTable } from './PagesTable'

export const metadata = { title: 'Pages' }

export default async function PagesPage() {
  await auth()

  const [pages, states, pageTypes] = await Promise.all([
    prisma.page.findMany({
      include: { owner: { select: { name: true } } },
      orderBy: { updatedAt: 'desc' },
    }),
    prisma.page.findMany({ select: { state: true }, distinct: ['state'], where: { state: { not: null } } }),
    prisma.page.findMany({ select: { pageType: true }, distinct: ['pageType'] }),
  ])

  const stateList = states.map(s => s.state).filter(Boolean) as string[]
  const typeList  = pageTypes.map(p => p.pageType)

  // Serialize dates to strings for the client component
  const serialized = pages.map(p => ({
    id: p.id,
    url: p.url,
    slug: p.slug,
    primaryKeyword: p.primaryKeyword,
    pageType: p.pageType,
    state: p.state,
    status: p.status as string,
    scoreBefore: p.scoreBefore,
    scoreAfter: p.scoreAfter,
    dateOptimized: p.dateOptimized?.toISOString() ?? null,
    updatedAt: p.updatedAt.toISOString(),
    owner: p.owner,
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Pages</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{pages.length} pages tracked</p>
        </div>
      </div>
      <PagesTable initialPages={serialized} states={stateList} pageTypes={typeList} />
    </div>
  )
}
