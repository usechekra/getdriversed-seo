import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = req.nextUrl
  const status    = searchParams.get('status') || undefined
  const state     = searchParams.get('state') || undefined
  const pageType  = searchParams.get('pageType') || undefined
  const search    = searchParams.get('search') || undefined
  const page      = parseInt(searchParams.get('page') || '1')
  const perPage   = parseInt(searchParams.get('perPage') || '25')

  const where = {
    ...(status   ? { status: status as never }   : {}),
    ...(state    ? { state }    : {}),
    ...(pageType ? { pageType } : {}),
    ...(search   ? {
      OR: [
        { url: { contains: search, mode: 'insensitive' as const } },
        { primaryKeyword: { contains: search, mode: 'insensitive' as const } },
      ],
    } : {}),
  }

  const [total, pages] = await Promise.all([
    prisma.page.count({ where }),
    prisma.page.findMany({
      where,
      include: { owner: { select: { name: true, email: true } } },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
  ])

  return NextResponse.json({ pages, total, page, perPage, totalPages: Math.ceil(total / perPage) })
}
