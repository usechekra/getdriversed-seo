import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const url = searchParams.get('url')
  if (!url) return NextResponse.json({ error: 'url parameter required' }, { status: 400 })

  try {
    const { inspectUrl } = await import('@/lib/gsc')
    const siteUrl = process.env.GSC_SITE_URL ?? 'https://www.getdriversed.com/'
    const data = await inspectUrl(siteUrl, url)
    return NextResponse.json(data)
  } catch (err) {
    console.error('GSC inspect error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
