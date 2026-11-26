import { getSupabaseAdmin } from '@/utils/supabase/admin'
import fs from 'fs'
import path from 'path'

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
  searchRadar: {
    totalQueriesToday: number
    zeroResultCount: number
    topZeroResultQueries: Array<{
      query: string
      attempts: number
      lastSearched: string
    }>
    popularQueries: Array<{
      query: string
      count: number
      avgResults: number
    }>
  }
  isFallback: boolean
  lastUpdated: string
}

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

interface MemorySearchQuery {
  query: string
  resultCount: number
  timestamp: number
}

const STORE_DIR = path.join(process.cwd(), 'src', 'lib', 'analytics', 'data')
const STORE_FILE = path.join(STORE_DIR, 'analytics_store.json')

function toLocalDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function loadPersistedFallback(): { pageViews: MemoryView[]; searchQueries: MemorySearchQuery[] } {
  try {
    if (!fs.existsSync(STORE_FILE)) {
      return { pageViews: [], searchQueries: [] }
    }
    const raw = fs.readFileSync(STORE_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return {
      pageViews: Array.isArray(parsed.pageViews) ? parsed.pageViews : [],
      searchQueries: Array.isArray(parsed.searchQueries) ? parsed.searchQueries : []
    }
  } catch {
    return { pageViews: [], searchQueries: [] }
  }
}

let lastPersistAt = 0
function persistFallbackToDisk(force = false) {
  const now = Date.now()
  if (!force && now - lastPersistAt < 3000) return
  lastPersistAt = now
  try {
    if (!fs.existsSync(STORE_DIR)) {
      fs.mkdirSync(STORE_DIR, { recursive: true })
    }
    const cutoff = now - 14 * 24 * 60 * 60 * 1000
    const cleanViews = memoryStore.pageViews.filter(v => v.timestamp > cutoff).slice(-25000)
    const cleanSearches = memoryStore.searchQueries.filter(q => q.timestamp > cutoff).slice(0, 2000)
    fs.writeFileSync(
      STORE_FILE,
      JSON.stringify({ pageViews: cleanViews, searchQueries: cleanSearches }),
      'utf-8'
    )
  } catch {
    // Serverless read-only filesystems are ignored gracefully; Supabase handles production persistence
  }
}

const initialDisk = loadPersistedFallback()

const memoryStore = {
  activeVisitors: new Map<string, MemoryVisitor>(),
  pageViews: initialDisk.pageViews as MemoryView[],
  searchQueries: initialDisk.searchQueries as MemorySearchQuery[],
  tableCheckAt: 0,
  tablesExist: false
}

export function recordSearchQueryEvent(query: string, resultCount: number = 0) {
  if (!query || query.trim().length < 2) return
  memoryStore.searchQueries.unshift({
    query: query.trim(),
    resultCount,
    timestamp: Date.now()
  })
  if (memoryStore.searchQueries.length > 5000) {
    memoryStore.searchQueries = memoryStore.searchQueries.slice(0, 5000)
  }
  persistFallbackToDisk(true)
}

function pruneMemoryStore() {
  const now = Date.now()
  const cutoff = now - 14 * 24 * 60 * 60 * 1000
  if (memoryStore.pageViews.length > 50000) {
    memoryStore.pageViews = memoryStore.pageViews.filter(v => v.timestamp > cutoff)
  }
  const visitorCutoff = now - 10 * 60 * 1000
  for (const [id, v] of memoryStore.activeVisitors.entries()) {
    if (v.lastSeenAt < visitorCutoff) {
      memoryStore.activeVisitors.delete(id)
    }
  }
}

/**
 * Checks whether Supabase analytics tables exist.
 * Re-checks every 30s if missing so executing the SQL migration takes effect immediately without restart.
 */
async function checkTablesExist(): Promise<boolean> {
  const now = Date.now()
  if (memoryStore.tablesExist) {
    return true
  }
  if (now - memoryStore.tableCheckAt < 30000) {
    return false
  }
  memoryStore.tableCheckAt = now

  try {
    const supabase = getSupabaseAdmin()
    const [activeRes, viewsRes] = await Promise.all([
      supabase.from('active_visitors').select('visitor_id').limit(1),
      supabase.from('site_page_views').select('id').limit(1)
    ])
    if (!activeRes.error && !viewsRes.error) {
      memoryStore.tablesExist = true
      return true
    }
    memoryStore.tablesExist = false
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

  // Exclude internal admin routes from student traffic telemetry
  if (sanitizedPath.startsWith('/admin')) {
    return { success: true }
  }

  const sanitizedVisitorId = (event.visitorId || 'anon').slice(0, 64)
  const deviceType = event.deviceType || 'desktop'

  // Update memory + disk backup store immediately
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
      persistFallbackToDisk()
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

    // Fixed column name: device_type (matches 00010_live_traffic_analytics.sql)
    await supabase.from('active_visitors').upsert({
      visitor_id: sanitizedVisitorId,
      last_path: sanitizedPath,
      referrer: event.referrer?.slice(0, 200) || null,
      device_type: deviceType,
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
    console.warn('Analytics database sync warning (using persistent fallback):', err)
  }

  return { success: true }
}

/**
 * Fetches Live Traffic and View Statistics (Admin Only).
 */
export async function getLiveTrafficAnalyticsData(): Promise<LiveAnalyticsSummary> {
  const now = Date.now()
  const twoMinutesAgo = now - 2 * 60 * 1000

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStartTs = today.getTime()

  function computeSearchRadar() {
    const todayQueries = memoryStore.searchQueries.filter(q => q.timestamp >= todayStartTs)
    const zeroResultQueries = todayQueries.filter(q => q.resultCount === 0)

    const zeroMap: Record<string, { count: number; lastSearchedTs: number }> = {}
    for (const q of zeroResultQueries) {
      if (!zeroMap[q.query]) {
        zeroMap[q.query] = { count: 0, lastSearchedTs: q.timestamp }
      }
      zeroMap[q.query].count++
      if (q.timestamp > zeroMap[q.query].lastSearchedTs) {
        zeroMap[q.query].lastSearchedTs = q.timestamp
      }
    }

    const topZeroResultQueries = Object.entries(zeroMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([query, data]) => {
        const diffMin = Math.round((now - data.lastSearchedTs) / 60000)
        const lastSearched = diffMin < 1 ? 'Just now' : diffMin < 60 ? `${diffMin}m ago` : `${Math.round(diffMin / 60)}h ago`
        return { query, attempts: data.count, lastSearched }
      })

    const queryMap: Record<string, { count: number; totalResults: number }> = {}
    for (const q of todayQueries) {
      if (!queryMap[q.query]) {
        queryMap[q.query] = { count: 0, totalResults: 0 }
      }
      queryMap[q.query].count++
      queryMap[q.query].totalResults += q.resultCount
    }

    const popularQueries = Object.entries(queryMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 6)
      .map(([query, data]) => ({
        query,
        count: data.count,
        avgResults: Math.round(data.totalResults / data.count)
      }))

    return {
      totalQueriesToday: todayQueries.length,
      zeroResultCount: zeroResultQueries.length,
      topZeroResultQueries,
      popularQueries
    }
  }

  const hasDbTables = await checkTablesExist()

  if (hasDbTables) {
    try {
      const supabase = getSupabaseAdmin()
      const twoMinAgoIso = new Date(twoMinutesAgo).toISOString()
      const todayStartIso = today.toISOString()

      const { data: liveData } = await supabase
        .from('active_visitors')
        .select('visitor_id, last_path, last_seen_at, device_type')
        .gte('last_seen_at', twoMinAgoIso)
        .order('last_seen_at', { ascending: false })

      const liveSessions = (liveData || []).filter(s => !s.last_path?.startsWith('/admin'))
      const liveVisitorsCount = liveSessions.length

      const { data: todayViewsData } = await supabase
        .from('site_page_views')
        .select('visitor_id, path, created_at')
        .gte('created_at', todayStartIso)

      const todayViews = (todayViewsData || []).filter(v => !v.path?.startsWith('/admin'))
      const todayTotalViews = todayViews.length
      const uniqueVisitorsSet = new Set(todayViews.map(v => v.visitor_id))
      const todayUniqueVisitors = uniqueVisitorsSet.size

      const pathCounts: Record<string, number> = {}
      for (const row of todayViews) {
        pathCounts[row.path] = (pathCounts[row.path] || 0) + 1
      }

      const topPagesToday = Object.entries(pathCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6)
        .map(([p, count]) => ({
          path: p,
          views: count,
          percentage: todayTotalViews > 0 ? Math.round((count / todayTotalViews) * 100) : 0
        }))

      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
      sevenDaysAgo.setHours(0, 0, 0, 0)

      const { data: recentViewsData } = await supabase
        .from('site_page_views')
        .select('visitor_id, path, created_at')
        .gte('created_at', sevenDaysAgo.toISOString())

      const dailyMap: Record<string, { label: string; views: number; visitors: Set<string> }> = {}

      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const key = toLocalDateKey(d)
        const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
        dailyMap[key] = { label, views: 0, visitors: new Set() }
      }

      for (const row of recentViewsData || []) {
        if (row.path?.startsWith('/admin')) continue
        const key = toLocalDateKey(new Date(row.created_at))
        if (dailyMap[key]) {
          dailyMap[key].views++
          dailyMap[key].visitors.add(row.visitor_id)
        }
      }

      const dailyHistory = Object.entries(dailyMap).map(([dateStr, data]) => ({
        date: dateStr,
        label: data.label,
        views: data.views,
        uniqueVisitors: data.visitors.size
      }))

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
        searchRadar: computeSearchRadar(),
        isFallback: false,
        lastUpdated: new Date().toISOString()
      }
    } catch (err) {
      console.warn('Falling back to persistent local analytics:', err)
    }
  }

  // Persistent fallback store calculation
  let memoryLiveCount = 0
  const activeSessions: LiveAnalyticsSummary['activeSessions'] = []

  for (const [id, v] of memoryStore.activeVisitors.entries()) {
    if (v.lastSeenAt >= twoMinutesAgo && !v.lastPath.startsWith('/admin')) {
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

  const todayViews = memoryStore.pageViews.filter(
    v => v.timestamp >= todayStartTs && !v.path.startsWith('/admin')
  )
  const todayTotalViews = todayViews.length
  const uniqueVisitorsTodaySet = new Set(todayViews.map(v => v.visitorId))
  const todayUniqueVisitors = uniqueVisitorsTodaySet.size

  const pathCounts: Record<string, number> = {}
  for (const v of todayViews) {
    pathCounts[v.path] = (pathCounts[v.path] || 0) + 1
  }

  const topPagesToday = Object.entries(pathCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([p, count]) => ({
      path: p,
      views: count,
      percentage: todayTotalViews > 0 ? Math.round((count / todayTotalViews) * 100) : 0
    }))

  const dailyHistory: LiveAnalyticsSummary['dailyHistory'] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    d.setHours(0, 0, 0, 0)
    const dayStart = d.getTime()
    const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1
    const dayViews = memoryStore.pageViews.filter(
      v => v.timestamp >= dayStart && v.timestamp <= dayEnd && !v.path.startsWith('/admin')
    )
    const dayVisitors = new Set(dayViews.map(v => v.visitorId)).size
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    const dateStr = toLocalDateKey(d)

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
    searchRadar: computeSearchRadar(),
    isFallback: true,
    lastUpdated: new Date().toISOString()
  }
}
