import { NextResponse } from 'next/server'
import { getAdminSession } from '@/app/admin/actions'
import { getLiveTrafficAnalyticsData } from '@/lib/analytics/tracker'

export const dynamic = 'force-dynamic'

export async function GET() {
  const session = await getAdminSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 401 })
  }

  const liveData = await getLiveTrafficAnalyticsData()
  return NextResponse.json(liveData)
}
