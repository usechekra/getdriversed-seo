import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { hasRole } from '@/lib/permissions'

const PAGES = [
  {
    url: 'https://getdriversed.com/courses-details/california-traffic-school/en',
    slug: 'california-traffic-school',
    primaryKeyword: 'California Traffic School Online',
    secondaryKeywords: 'california traffic school, online traffic school california, CA traffic school, DMV approved traffic school california',
    pageType: 'state-course-page',
    state: 'California',
    status: 'IN_PROGRESS' as const,
    scoreBefore: 9,
    scoreAfter: null,
    scoreProjected: 93,
    wordCountBefore: 77,
    dateOptimized: new Date('2026-04-18'),
    folderPath: 'pages/_completed/california-traffic-school',
    notes: 'Dev handoff complete. Awaiting implementation. Fill CA DMV TVS license # and pricing in schema before deploying.',
  },
  {
    url: 'https://getdriversed.com/courses-details/michigan-online-defensive-driving-course',
    slug: 'michigan-online-defensive-driving-course',
    primaryKeyword: 'Michigan online defensive driving course',
    secondaryKeywords: 'Michigan BDIC online, Michigan Basic Driver Improvement Course online, online defensive driving course Michigan, Michigan SOS approved defensive driving course',
    pageType: 'state-course-page',
    state: 'Michigan',
    status: 'IN_PROGRESS' as const,
    scoreBefore: 14,
    scoreAfter: null,
    scoreProjected: 91,
    wordCountBefore: 73,
    dateOptimized: new Date('2026-04-21'),
    folderPath: 'pages/_in-progress/michigan-online-defensive-driving-course',
    notes: 'Full rewrite. Critical bug fixed: Texas meta replaced. BDIC + SOS authority added. Schema stack complete. Pending: verify GDE BDIC sponsor status + add course price.',
  },
]

export async function POST() {
  const session = await auth()
  if (!session || !hasRole(session.user.role, 'ADMIN')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const admin = await prisma.user.findFirst({
    where: { role: 'ADMIN' },
    select: { id: true, email: true },
  })

  if (!admin) {
    return NextResponse.json({ error: 'No admin user found' }, { status: 500 })
  }

  const results = []
  for (const data of PAGES) {
    const { url, ...rest } = data
    const page = await prisma.page.upsert({
      where: { url },
      update: { ...rest, ownerId: admin.id },
      create: { url, ...rest, ownerId: admin.id },
    })
    results.push({ id: page.id, primaryKeyword: page.primaryKeyword, status: page.status })
  }

  return NextResponse.json({ ok: true, pages: results })
}
