import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasRole } from '@/lib/permissions'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const issues = await prisma.sitewideIssue.findMany({ orderBy: { id: 'asc' } })
  return NextResponse.json(issues)
}

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'MANAGER')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id, status, owner, notes } = await req.json()
  const issue = await prisma.sitewideIssue.update({
    where: { id },
    data: {
      ...(status ? { status, ...(status === 'IN_PROGRESS' ? { dateStarted: new Date() } : {}), ...(status === 'COMPLETE' ? { dateCompleted: new Date() } : {}) } : {}),
      ...(owner !== undefined ? { owner } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
  })
  return NextResponse.json(issue)
}
