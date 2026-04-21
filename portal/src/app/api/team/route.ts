import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasRole } from '@/lib/permissions'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const createSchema = z.object({
  name:     z.string().min(1),
  email:    z.string().email(),
  role:     z.enum(['ADMIN', 'MANAGER', 'CONTRIBUTOR', 'VIEWER']),
  password: z.string().min(8),
})

export async function GET() {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, active: true, lastLogin: true, createdAt: true },
    orderBy: { createdAt: 'asc' },
  })
  return NextResponse.json(users)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = createSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { name, email, role, password } = parsed.data
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return NextResponse.json({ error: 'Email already in use' }, { status: 409 })

  const passwordHash = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { name, email, role, passwordHash },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  })

  return NextResponse.json(user, { status: 201 })
}
