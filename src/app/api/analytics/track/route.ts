import { NextRequest, NextResponse } from 'next/server'
import { recordVisitorEvent } from '@/lib/analytics/tracker'

export async function POST(request: NextRequest) {
  try {
    let body
    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('application/json')) {
      body = await request.json()
    } else {
      // Handles sendBeacon text/plain or blob payloads
      const text = await request.text()
      try {
        body = JSON.parse(text)
      } catch {
        body = {}
      }
    }

    const { visitorId, path, referrer, deviceType, action } = body || {}

    if (!visitorId || typeof visitorId !== 'string') {
      return NextResponse.json({ ok: false }, { status: 400 })
    }

    const validAction = action === 'heartbeat' || action === 'leave' ? action : 'pageview'

    // Fire and record asynchronously
    await recordVisitorEvent({
      visitorId,
      path: typeof path === 'string' ? path : '/',
      referrer: typeof referrer === 'string' ? referrer : undefined,
      deviceType: typeof deviceType === 'string' ? deviceType : 'desktop',
      action: validAction
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error tracking analytics event:', error)
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
