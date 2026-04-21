import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasRole } from '@/lib/permissions'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const updateSchema = z.object({
  name:     z.string().min(1).optional(),
  role:     z.enum(['ADMIN', 'MANAGER', 'CONTRIBUTOR', 'VIEWER']).optional(),
  active:   z.boolean().optional(),
  password: z.string().min(8).optional(),
})

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  const body = await req.json()
  const parsed = updateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { name, role, active, password } = parsed.data
  const passwordHash = password ? await bcrypt.hash(password, 12) : undefined

  const user = await prisma.user.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(active !== undefined ? { active } : {}),
      ...(passwordHash ? { passwordHash } : {}),
    },
    select: { id: true, name: true, email: true, role: true, active: true, lastLogin: true, createdAt: true },
  })

  return NextResponse.json(user)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { id } = await params
  // Deactivate instead of hard delete
  const user = await prisma.user.update({
    where: { id },
    data: { active: false },
    select: { id: true },
  })
  return NextResponse.json(user)
}
