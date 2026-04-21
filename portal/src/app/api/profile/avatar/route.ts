import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { avatarUrl } = await req.json()
  if (!avatarUrl) return NextResponse.json({ error: 'Missing avatar' }, { status: 400 })

  // Limit to 2MB base64
  if (avatarUrl.length > 2_800_000) {
    return NextResponse.json({ error: 'Image too large (max 2MB)' }, { status: 400 })
  }

  await prisma.user.update({ where: { id: session.user.id }, data: { avatarUrl } })
  return NextResponse.json({ ok: true })
}
