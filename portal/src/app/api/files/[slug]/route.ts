import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/db'
import * as fs from 'fs'
import * as path from 'path'

// Locally: repo root is parent of portal/ → folderPath "pages/_completed/..." resolves correctly
// On Railway: SEO_REPO_ROOT=/app, seo-pages/ is the pages dir → rewrite "pages/" → "seo-pages/"
const REPO_ROOT = process.env.SEO_REPO_ROOT ?? path.resolve(process.cwd(), '..')

function resolveFolderPath(folderPath: string): string {
  if (process.env.SEO_REPO_ROOT) {
    return folderPath.replace(/^pages\//, 'seo-pages/')
  }
  return folderPath
}

const DEV_FILE_NAMES = new Set(['dev-handoff.md', 'schema.json', 'implementation.html'])
function isDevFile(name: string) {
  return DEV_FILE_NAMES.has(name) || /\.pdf$/i.test(name)
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { slug } = await params
  const filename = req.nextUrl.searchParams.get('file')

  const page = await prisma.page.findUnique({ where: { slug }, select: { folderPath: true } })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const folderAbs = path.join(REPO_ROOT, resolveFolderPath(page.folderPath))

  // List files
  if (!filename) {
    if (!fs.existsSync(folderAbs)) return NextResponse.json({ files: [] })
    const files = fs.readdirSync(folderAbs)
      .filter(f => !f.startsWith('.'))
      .map(f => {
        const stat = fs.statSync(path.join(folderAbs, f))
        return {
          name: f,
          size: stat.size,
          modified: stat.mtime.toISOString(),
          isDevFile: isDevFile(f),
        }
      })
      .sort((a, b) => (b.isDevFile ? 1 : 0) - (a.isDevFile ? 1 : 0))
    return NextResponse.json({ files })
  }

  // Stream a specific file
  const safeName = path.basename(filename)
  const filePath = path.join(folderAbs, safeName)

  if (!filePath.startsWith(folderAbs) || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  const content = fs.readFileSync(filePath)
  const ext = path.extname(safeName).toLowerCase()
  const contentType =
    ext === '.pdf'  ? 'application/pdf' :
    ext === '.json' ? 'application/json' :
    ext === '.html' ? 'text/html' :
    'text/plain; charset=utf-8'

  return new NextResponse(content, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${safeName}"`,
    },
  })
}
