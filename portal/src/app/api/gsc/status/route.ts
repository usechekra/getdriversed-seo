import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const setting = await prisma.systemSettings.findUnique({ where: { key: 'gsc_last_sync' } })
  return NextResponse.json({ lastSync: setting?.value ?? null })
}
