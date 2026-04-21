import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import * as fs from 'fs'
import * as path from 'path'

export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cwd = process.cwd()
  const repoRoot = process.env.SEO_REPO_ROOT ?? path.resolve(cwd, '..')
  const seoPagesPath = path.join(repoRoot, 'seo-pages')
  const rawPagesPath = path.join(repoRoot, 'pages')

  const check = (p: string) => ({
    path: p,
    exists: fs.existsSync(p),
    contents: fs.existsSync(p) ? fs.readdirSync(p).slice(0, 10) : null,
  })

  return NextResponse.json({
    cwd,
    SEO_REPO_ROOT: process.env.SEO_REPO_ROOT,
    repoRoot,
    seoPagesDir: check(seoPagesPath),
    pagesDir: check(rawPagesPath),
    caSlug: check(path.join(seoPagesPath, '_completed/california-traffic-school')),
    caSlugAlt: check(path.join(rawPagesPath, '_completed/california-traffic-school')),
  })
}
