import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const dimension = searchParams.get('dimension') ?? 'query'
  const days = parseInt(searchParams.get('days') ?? '28')
  const offset = parseInt(searchParams.get('offset') ?? '0') // for previous period comparison

  try {
    const { getAnalyticsByDimension } = await import('@/lib/gsc')
    const siteUrl = process.env.GSC_SITE_URL ?? 'https://www.getdriversed.com/'

    const endDate = new Date()
    endDate.setDate(endDate.getDate() - 3 - offset)
    const startDate = new Date(endDate)
    startDate.setDate(startDate.getDate() - days + 1)

    const end = endDate.toISOString().split('T')[0]
    const start = startDate.toISOString().split('T')[0]

    const rows = await getAnalyticsByDimension(siteUrl, start, end, [dimension], 2500)

    return NextResponse.json({
      rows: rows.map(r => ({
        key: r.keys?.[0] ?? '',
        clicks: r.clicks ?? 0,
        impressions: r.impressions ?? 0,
        ctr: r.ctr ?? 0,
        position: r.position ?? 0,
      }))
    })
  } catch (err) {
    console.error('GSC performance error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
