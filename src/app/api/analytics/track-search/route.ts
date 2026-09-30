import { NextResponse } from 'next/server'
import { recordSearchQueryEvent } from '@/lib/analytics/tracker'

export async function POST(req: Request) {
  try {
    const { query, resultCount } = await req.json()
    if (query && typeof query === 'string') {
      recordSearchQueryEvent(query, Number(resultCount) || 0)
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 400 })
  }
}
