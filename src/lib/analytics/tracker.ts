import { getSupabaseAdmin } from '@/utils/supabase/admin'

export interface AnalyticsEvent {
  visitorId: string
  path: string
  referrer?: string
  deviceType?: string
  action: 'pageview' | 'heartbeat' | 'leave'
}

export interface LiveAnalyticsSummary {
  liveVisitorsCount: number
  todayTotalViews: number
  todayUniqueVisitors: number
  avgViewsPerVisitor: number
  dailyHistory: Array<{
    date: string
    label: string
    views: number
    uniqueVisitors: number
  }>
  topPagesToday: Array<{
    path: string
    views: number
    percentage: number
  }>
  activeSessions: Array<{
    visitorIdMasked: string
    lastPath: string
    secondsAgo: number
    deviceType?: string
  }>
  isFallback: boolean
  lastUpdated: string
}

// In-memory fallback cache to ensure real-time tracking operates seamlessly
// even if database migrations are pending or during development.
interface MemoryVisitor {
  visitorId: string
  lastPath: string
  referrer?: string
  deviceType?: string
  lastSeenAt: number
}

interface MemoryView {
  visitorId: string
  path: string
  timestamp: number
}

const memoryStore = {
  activeVisitors: new Map<string, MemoryVisitor>(),
  pageViews: [] as MemoryView[],
  tableCheckTested: false,
  tablesExist: false
}

// Clean up stale memory views older than 14 days
function pruneMemoryStore() {
  const now = Date.now()
  const cutoff = now - 14 * 24 * 60 * 60 * 1000
  if (memoryStore.pageViews.length > 50000) {
    memoryStore.pageViews = memoryStore.pageViews.filter(v => v.timestamp > cutoff)
  }
  // Prune memory visitors inactive for > 10 minutes
  const visitorCutoff = now - 10 * 60 * 1000
  for (const [id, v] of memoryStore.activeVisitors.entries()) {
    if (v.lastSeenAt < visitorCutoff) {
      memoryStore.activeVisitors.delete(id)
    }
  }
}

/**
 * Checks whether Supabase analytics tables exist in the schema cache.
 */
async function checkTablesExist(): Promise<boolean> {
  if (memoryStore.tableCheckTested && memoryStore.tablesExist) {
    return true
  }

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('active_visitors').select('visitor_id').limit(1)
    if (!error) {
      memoryStore.tablesExist = true
      memoryStore.tableCheckTested = true
      return true
    }
    // If error indicates table doesn't exist
    memoryStore.tablesExist = false
    memoryStore.tableCheckTested = true
    return false
  } catch {
    memoryStore.tablesExist = false
    return false
  }
}

/**
 * Record a visitor pageview, heartbeat, or leave event.
 */
export async function recordVisitorEvent(event: AnalyticsEvent): Promise<{ success: boolean }> {
  const now = Date.now()
  const sanitizedPath = (event.path || '/').split('?')[0].slice(0, 150)
  const sanitizedVisitorId = (event.visitorId || 'anon').slice(0, 64)
  const deviceType = event.deviceType || 'desktop'

  // Update memory store immediately
  if (event.action === 'leave') {
    memoryStore.activeVisitors.delete(sanitizedVisitorId)
  } else {
    memoryStore.activeVisitors.set(sanitizedVisitorId, {
      visitorId: sanitizedVisitorId,
      lastPath: sanitizedPath,
      referrer: event.referrer?.slice(0, 200),
      deviceType,
      lastSeenAt: now
    })

    if (event.action === 'pageview') {
      memoryStore.pageViews.push({
        visitorId: sanitizedVisitorId,
        path: sanitizedPath,
        timestamp: now
      })
      pruneMemoryStore()
    }
  }

  // Attempt Supabase synchronization
  try {
    const hasTables = await checkTablesExist()
    if (!hasTables) {
      return { success: true }
    }

    const supabase = getSupabaseAdmin()

    if (event.action === 'leave') {
      await supabase.from('active_visitors').delete().eq('visitor_id', sanitizedVisitorId)
      return { success: true }
    }

    // Upsert active visitor heartbeat
    await supabase.from('active_visitors').upsert({
      visitor_id: sanitizedVisitorId,
      last_path: sanitizedPath,
      referrer: event.referrer?.slice(0, 200) || null,
      deviceType,
      last_seen_at: new Date().toISOString()
    })

    if (event.action === 'pageview') {
      await supabase.from('site_page_views').insert({
        visitor_id: sanitizedVisitorId,
        path: sanitizedPath,
        referrer: event.referrer?.slice(0, 200) || null,
        device_type: deviceType,
        created_at: new Date().toISOString()
      })
    }
  } catch (err) {
    console.warn('Analytics database sync warning (using memory tracking fallback):', err)
  }

  return { success: true }
}

/**
 * Fetches Live Traffic and View Statistics (Admin Only).
 */
export async function getLiveTrafficAnalyticsData(): Promise<LiveAnalyticsSummary> {
  const now = Date.now()
  const twoMinutesAgo = now - 2 * 60 * 1000

  // Calculate start of today (local or UTC)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStartTs = today.getTime()

  const hasDbTables = await checkTablesExist()

  if (hasDbTables) {
    try {
      const supabase = getSupabaseAdmin()
      const twoMinAgoIso = new Date(twoMinutesAgo).toISOString()
      const todayStartIso = today.toISOString()

      // 1. Live visitors count from active_visitors
      const { data: liveData } = await supabase
        .from('active_visitors')
        .select('visitor_id, last_path, last_seen_at, device_type')
        .gte('last_seen_at', twoMinAgoIso)
        .order('last_seen_at', { ascending: false })

      const liveSessions = liveData || []
      const liveVisitorsCount = liveSessions.length

      // 2. Today's page views
      const { data: todayViewsData } = await supabase
        .from('site_page_views')
        .select('visitor_id, path, created_at')
        .gte('created_at', todayStartIso)

      const todayViews = todayViewsData || []
      const todayTotalViews = todayViews.length
      const uniqueVisitorsSet = new Set(todayViews.map(v => v.visitor_id))
      const todayUniqueVisitors = uniqueVisitorsSet.size

      // 3. Top pages today
      const pathCounts: Record<string, number> = {}
      for (const row of todayViews) {
        pathCounts[row.path] = (pathCounts[row.path] || 0) + 1
      }

      const topPagesToday = Object.entries(pathCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([path, count]) => ({
          path,
          views: count,
          percentage: todayTotalViews > 0 ? Math.round((count / todayTotalViews) * 100) : 0
        }))

      // 4. Past 7 days history
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      const { data: recentViewsData } = await supabase
        .from('site_page_views')
        .select('visitor_id, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())

      const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {}

      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = d.toISOString().split('T')[0]
        dailyMap[key] = { views: 0, visitors: new Set() }
      }

      for (const row of recentViewsData || []) {
        const key = row.created_at.split('T')[0]
        if (dailyMap[key]) {
          dailyMap[key].views++
          dailyMap[key].visitors.add(row.visitor_id)
        }
      }

      const dailyHistory = Object.entries(dailyMap).map(([dateStr, data]) => {
        const d = new Date(dateStr)
        const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        return {
          date: dateStr,
          label,
          views: data.views,
          uniqueVisitors: data.visitors.size
        }
      })

      const activeSessions = liveSessions.slice(0, 10).map(s => {
        const seenTs = new Date(s.last_seen_at).getTime()
        const diffSecs = Math.max(0, Math.floor((now - seenTs) / 1000))
        const masked = s.visitor_id.length > 8 ? `${s.visitor_id.slice(0, 4)}...${s.visitor_id.slice(-4)}` : s.visitor_id
        return {
          visitorIdMasked: masked,
          lastPath: s.last_path,
          secondsAgo: diffSecs,
          deviceType: s.device_type || 'desktop'
        }
      })

      return {
        liveVisitorsCount,
        todayTotalViews,
        todayUniqueVisitors,
        avgViewsPerVisitor: todayUniqueVisitors > 0 ? Number((todayTotalViews / todayUniqueVisitors).toFixed(1)) : 0,
        dailyHistory,
        topPagesToday,
        activeSessions,
        isFallback: false,
        lastUpdated: new Date().toISOString()
      }
    } catch (err) {
      console.warn('Falling back to memory analytics:', err)
    }
  }

  // Fallback to in-memory store calculation
  let memoryLiveCount = 0
  const activeSessions: LiveAnalyticsSummary['activeSessions'] = []

  for (const [id, v] of memoryStore.activeVisitors.entries()) {
    if (v.lastSeenAt >= twoMinutesAgo) {
      memoryLiveCount++
      const diffSecs = Math.max(0, Math.floor((now - v.lastSeenAt) / 1000))
      const masked = id.length > 8 ? `${id.slice(0, 4)}...${id.slice(-4)}` : id
      activeSessions.push({
        visitorIdMasked: masked,
        lastPath: v.lastPath,
        secondsAgo: diffSecs,
        deviceType: v.deviceType || 'desktop'
      })
    }
  }

  activeSessions.sort((a, b) => a.secondsAgo - b.secondsAgo)

  // Memory views today
  const todayViews = memoryStore.pageViews.filter(v => v.timestamp >= todayStartTs)
  const todayTotalViews = todayViews.length
  const uniqueVisitorsTodaySet = new Set(todayViews.map(v => v.visitorId))
  const todayUniqueVisitors = uniqueVisitorsTodaySet.size

  // Top pages today
  const pathCounts: Record<string, number> = {}
  for (const v of todayViews) {
    pathCounts[v.path] = (pathCounts[v.path] || 0) + 1
  }

  const topPagesToday = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([path, count]) => ({
      path,
      views: count,
      percentage: todayTotalViews > 0 ? Math.round((count / todayTotalViews) * 100) : 0
    }))

  // Past 7 days history from memory
  const dailyHistory: LiveAnalyticsSummary['dailyHistory'] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const dayStart = d.getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1
    const dayViews = memoryStore.pageViews.filter(v => v.timestamp >= dayStart && v.timestamp <= dayEnd)
    const dayVisitors = new Set(dayViews.map(v => v.visitorId)).size
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const dateStr = d.toISOString().split('T')[0]

    dailyHistory.push({
      date: dateStr,
      label,
      views: dayViews.length,
      uniqueVisitors: dayVisitors
    })
  }

  return {
    liveVisitorsCount: memoryLiveCount,
    todayTotalViews,
    todayUniqueVisitors,
    avgViewsPerVisitor: todayUniqueVisitors > 0 ? Number((todayTotalViews / todayUniqueVisitors).toFixed(1)) : 0,
    dailyHistory,
    topPagesToday,
    activeSessions: activeSessions.slice(0, 10),
    isFallback: true,
    lastUpdated: new Date().toISOString()
  }
}
