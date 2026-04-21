import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as fs from 'fs'
import * as path from 'path'
import { z } from 'zod'

const REPO_ROOT = process.env.SEO_REPO_ROOT ?? path.resolve(process.cwd(), '..')

const submitSchema = z.object({
  url: z.string().url().refine(u => u.includes('getdriversed.com'), 'Must be a getdriversed.com URL'),
  primaryKeyword: z.string().optional(),
  priority: z.enum(['HIGH', 'MEDIUM', 'LOW']).default('MEDIUM'),
  businessContext: z.string().optional(),
  whyThisMatters: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const status = req.nextUrl.searchParams.get('status') || 'PENDING'
  const submissions = await prisma.submission.findMany({
    where: { status: status as never },
    include: { submittedBy: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(submissions)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = submitSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { url, primaryKeyword, priority, businessContext, whyThisMatters } = parsed.data

  // Create brief file in _inbox
  const slug = url.replace(/^https?:\/\/[^/]+\//, '').replace(/\//g, '-').replace(/[^a-z0-9-]/gi, '-')
  const briefPath = path.join(REPO_ROOT, `pages/_inbox/${slug}-brief.md`)
  const briefContent = `# Brief: ${url}\n\n**Primary Keyword:** ${primaryKeyword ?? 'TBD'}\n**Priority:** ${priority}\n**Submitted:** ${new Date().toISOString().split('T')[0]}\n**By:** ${session.user.name} (${session.user.email})\n\n## Business Context\n${businessContext ?? 'N/A'}\n\n## Why This Page Matters\n${whyThisMatters ?? 'N/A'}\n`

  try {
    fs.mkdirSync(path.join(REPO_ROOT, 'pages/_inbox'), { recursive: true })
    fs.writeFileSync(briefPath, briefContent)
  } catch { /* non-fatal */ }

  const submission = await prisma.submission.create({
    data: { url, primaryKeyword, priority, businessContext, whyThisMatters, submittedById: session.user.id },
  })

  await prisma.activity.create({
    data: { userId: session.user.id, action: 'submitted_url', target: url },
  })

  return NextResponse.json(submission, { status: 201 })
}
