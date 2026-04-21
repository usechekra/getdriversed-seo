import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasRole } from '@/lib/permissions'

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'MANAGER')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const { status, rejectionReason } = await req.json()

  const submission = await prisma.submission.update({
    where: { id },
    data: {
      status,
      ...(rejectionReason ? { rejectionReason } : {}),
      processedAt: new Date(),
    },
  })

  // If approved, log activity
  if (status === 'APPROVED') {
    await prisma.activity.create({
      data: {
        userId: session.user.id,
        action: 'approved_submission',
        target: submission.url,
      },
    })
  }

  return NextResponse.json(submission)
}
