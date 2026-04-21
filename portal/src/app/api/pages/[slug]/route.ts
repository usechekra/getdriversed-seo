import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasRole } from '@/lib/permissions'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      owner: { select: { id: true, name: true, email: true } },
      history: { orderBy: { createdAt: 'desc' }, take: 50 },
      gscSnapshots: { orderBy: { date: 'desc' }, take: 90 },
    },
  })

  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(page)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'MANAGER')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { slug } = await params
  const body = await req.json()
  const { status, notes } = body

  const page = await prisma.page.update({
    where: { slug },
    data: {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  })

  // Log history
  if (status) {
    await prisma.pageHistory.create({
      data: {
        pageId: page.id,
        userId: session.user.id,
        action: 'status_change',
        toValue: status,
      },
    })
  }

  return NextResponse.json(page)
}
