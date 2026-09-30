'use client'

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import {
  BarChart3,
  Download,
  Users,
  FileText,
  TrendingUp,
  Activity,
  RefreshCw,
  Clock,
  Eye,
  Globe,
  Radio,
  Copy,
  Check,
  Smartphone,
  Monitor,
  Flame,
  ArrowUpRight,
  Search,
  AlertTriangle,
  Plus
} from 'lucide-react'
import Link from 'next/link'
import { StatCard } from '@/components/admin/ui/StatCard'
import { Button } from '@/components/ui/Button'
import type { LiveAnalyticsSummary } from '@/lib/analytics/tracker'

interface AnalyticsClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[]
  initialTraffic?: LiveAnalyticsSummary | null
}

export default function AnalyticsClient({
  stats,
  resources,
  users,
  initialTraffic
}: AnalyticsClientProps) {
  const [traffic, setTraffic] = useState<LiveAnalyticsSummary | null>(initialTraffic || null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [copiedSql, setCopiedSql] = useState(false)

  // Polling function for live metrics
  const refreshTraffic = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch('/api/admin/analytics/live')
      if (res.ok) {
        const data = await res.json()
        setTraffic(data)
      }
    } catch (err) {
      console.error('Failed to refresh live traffic analytics:', err)
    } finally {
      setIsRefreshing(false)
    }
  }, [])

  // Auto-refresh timer every 8 seconds
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      refreshTraffic()
    }, 8000)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshTraffic])

  // Calculate Semester Distribution
  const semesterBreakdown = useMemo(() => {
    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 }
    resources.forEach(r => {
      const sem = r.subjects?.semester
      if (sem && counts[sem] !== undefined) counts[sem]++
    })
    return counts
  }, [resources])

  // Calculate Exam Pattern Distribution
  const examTypeBreakdown = useMemo(() => {
    const counts: Record<string, number> = { MST1: 0, MST2: 0, EST: 0, Other: 0 }
    resources.forEach(r => {
      const type = r.exam_types?.name
      if (type && counts[type] !== undefined) counts[type]++
      else counts.Other++
    })
    return counts
  }, [resources])

  // Top Downloaded Papers
  const topDownloaded = useMemo(() => {
    return [...resources]
      .sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
      .slice(0, 5)
  }, [resources])

  const maxSemCount = Math.max(...Object.values(semesterBreakdown), 1)

  // Max views in daily history for relative bar chart height
  const maxDailyViews = useMemo(() => {
    if (!traffic?.dailyHistory || traffic.dailyHistory.length === 0) return 10
    return Math.max(...traffic.dailyHistory.map(d => d.views), 10)
  }, [traffic])

  const copySqlMigration = () => {
    const sqlText = `-- PREVU Migration: 00010_live_traffic_analytics.sql
CREATE TABLE IF NOT EXISTS active_visitors (
    visitor_id TEXT PRIMARY KEY,
    last_path TEXT NOT NULL DEFAULT '/',
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    last_seen_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_active_visitors_last_seen ON active_visitors (last_seen_at DESC);

CREATE TABLE IF NOT EXISTS site_page_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visitor_id TEXT NOT NULL,
    path TEXT NOT NULL,
    referrer TEXT,
    device_type TEXT DEFAULT 'desktop',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_site_page_views_created_at ON site_page_views (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_page_views_visitor_created ON site_page_views (visitor_id, created_at);
CREATE INDEX IF NOT EXISTS idx_site_page_views_path ON site_page_views (path);

GRANT ALL ON TABLE active_visitors TO anon, authenticated, service_role;
GRANT ALL ON TABLE site_page_views TO anon, authenticated, service_role;
ALTER TABLE IF EXISTS active_visitors DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS site_page_views DISABLE ROW LEVEL SECURITY;`

    navigator.clipboard.writeText(sqlText)
    setCopiedSql(true)
    setTimeout(() => setCopiedSql(false), 2500)
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Live Sync Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-prevu-surface-light pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              Website Traffic & Live Visitors
            </h1>
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Real-time viewer counts, daily student traffic, exam format distribution, and repository activity.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center gap-1.5 ${
              autoRefresh
                ? 'bg-purple-950/40 border-purple-500/40 text-purple-300'
                : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${autoRefresh ? 'text-purple-400 animate-pulse' : 'text-prevu-text-muted'}`} />
            <span>{autoRefresh ? 'Live Auto-Sync (8s)' : 'Live Sync Paused'}</span>
          </button>

          <Button
            size="sm"
            variant="outline"
            onClick={refreshTraffic}
            disabled={isRefreshing}
            className="h-8 px-3 text-xs border-prevu-surface-light bg-prevu-surface text-prevu-text hover:text-white rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-purple-400' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 1. HERO METRICS: LIVE VIEWERS & TODAY'S TRAFFIC */}
      {/* ============================================================ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Live View Count Card */}
        <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-emerald-950/30 via-prevu-surface to-prevu-surface border border-emerald-500/30 shadow-xl shadow-emerald-950/20">
          <div className="flex items-center justify-between text-xs text-emerald-400/80 mb-2">
            <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              Live Online Right Now
            </span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 mt-1 flex items-baseline gap-2">
            <span>{traffic?.liveVisitorsCount ?? 0}</span>
            <span className="text-xs font-sans font-semibold text-emerald-400/70">
              {traffic?.liveVisitorsCount === 1 ? 'visitor active' : 'visitors active'}
            </span>
          </div>
          <p className="text-[11px] text-prevu-text-muted mt-2">
            Active within the last 2 minutes across public pages.
          </p>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Today's Total Page Views */}
        <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-xl">
          <div className="flex items-center justify-between text-xs text-prevu-text-muted mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Today&apos;s Total Views</span>
            <Eye className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-prevu-text mt-1 flex items-baseline gap-2">
            <span>{traffic?.todayTotalViews ?? 0}</span>
            <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
              Today
            </span>
          </div>
          <p className="text-[11px] text-prevu-text-muted mt-2">
            Total website screen views since 00:00 midnight.
          </p>
        </div>

        {/* Today's Unique Visitors */}
        <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-xl">
          <div className="flex items-center justify-between text-xs text-prevu-text-muted mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Unique Visitors Today</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-prevu-text mt-1 flex items-baseline gap-2">
            <span>{traffic?.todayUniqueVisitors ?? 0}</span>
            <span className="text-xs font-sans font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
              Students
            </span>
          </div>
          <p className="text-[11px] text-prevu-text-muted mt-2">
            Distinct devices & visitor sessions today.
          </p>
        </div>

        {/* Avg Views per Visitor */}
        <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-xl">
          <div className="flex items-center justify-between text-xs text-prevu-text-muted mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Engagement Rate</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-prevu-text mt-1 flex items-baseline gap-2">
            <span>{traffic?.avgViewsPerVisitor ?? 0}</span>
            <span className="text-xs font-sans text-prevu-text-muted">pages / visitor</span>
          </div>
          <p className="text-[11px] text-prevu-text-muted mt-2">
            Average papers & pages viewed per visiting student.
          </p>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 2. DAILY TRAFFIC HISTOGRAM (HOW MANY PEOPLE WATCH IN A DAY) */}
      {/* ============================================================ */}
      <div className="p-6 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-prevu-text">Daily Visitor Traffic (Past 7 Days)</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
                Daily Breakdown
              </span>
            </div>
            <p className="text-xs text-prevu-text-muted mt-0.5">
              Day-by-day comparison of total page views and unique visitors watching your platform.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-gradient-to-tr from-purple-600 to-indigo-500" />
              <span className="text-prevu-text-muted">Total Views</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-cyan-400" />
              <span className="text-prevu-text-muted">Unique Visitors</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Representation */}
        <div className="pt-4">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 border-b border-prevu-surface-light/60 pb-3">
            {traffic?.dailyHistory?.map((day, idx) => {
              const isToday = idx === (traffic.dailyHistory.length - 1)
              const viewsHeightPercent = Math.max(Math.round((day.views / maxDailyViews) * 100), 8)
              const visitorsHeightPercent = Math.max(Math.round((day.uniqueVisitors / maxDailyViews) * 100), 6)

              return (
                <div key={day.date} className="flex flex-col items-center h-full justify-end group">
                  {/* Tooltip / Counter on top */}
                  <div className="opacity-80 group-hover:opacity-100 transition-opacity text-center mb-2">
                    <span className="text-xs font-mono font-extrabold text-prevu-text block">
                      {day.views}
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 block sm:hidden">
                      {day.uniqueVisitors}u
                    </span>
                    <span className="text-[10px] font-mono text-cyan-400 hidden sm:block">
                      {day.uniqueVisitors} uniq
                    </span>
                  </div>

                  {/* Dual Bar Container */}
                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-36 bg-prevu-bg/50 rounded-xl p-1 border border-prevu-surface-light/30">
                    {/* Total Views Bar */}
                    <div
                      className={`w-1/2 rounded-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-gradient-to-t from-purple-600 via-indigo-500 to-purple-400 shadow-lg shadow-purple-600/30'
                          : 'bg-purple-600/80 group-hover:bg-purple-500'
                      }`}
                      style={{ height: `${viewsHeightPercent}%` }}
                      title={`${day.views} views`}
                    />
                    {/* Unique Visitors Bar */}
                    <div
                      className={`w-1/2 rounded-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-cyan-400 shadow-md shadow-cyan-400/30'
                          : 'bg-cyan-500/80 group-hover:bg-cyan-400'
                      }`}
                      style={{ height: `${visitorsHeightPercent}%` }}
                      title={`${day.uniqueVisitors} unique visitors`}
                    />
                  </div>

                  {/* Date Label */}
                  <div className="mt-3 text-center">
                    <span className={`text-[11px] font-mono block ${isToday ? 'font-bold text-purple-300' : 'text-prevu-text-muted'}`}>
                      {day.label.split(',')[0]}
                    </span>
                    {isToday && (
                      <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Today
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. REAL-TIME ACTIVITY & TOP WATCHED PAGES */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages Watched Today */}
        <div className="p-5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-prevu-text">Top Watched Pages Today</h3>
            </div>
            <span className="text-[11px] font-mono text-prevu-text-muted">
              {traffic?.topPagesToday?.length || 0} routes tracked
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {(!traffic?.topPagesToday || traffic.topPagesToday.length === 0) ? (
              <div className="py-8 text-center text-xs text-prevu-text-muted font-mono">
                No page views recorded yet today. Visit some pages to see real-time routes!
              </div>
            ) : (
              traffic.topPagesToday.map(page => (
                <div key={page.path} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-prevu-text font-mono truncate max-w-[280px]">
                      {page.path === '/' ? '/ (Home)' : page.path}
                    </span>
                    <div className="flex items-center gap-2 font-mono shrink-0">
                      <span className="text-prevu-text font-bold">{page.views} views</span>
                      <span className="text-prevu-text-muted text-[11px]">({page.percentage}%)</span>
                    </div>
                  </div>
                  <div className="h-2 w-full bg-prevu-bg rounded-full overflow-hidden border border-prevu-surface-light/40">
                    <div
                      className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(page.percentage, 4)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Live Active Sessions Stream */}
        <div className="p-5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-prevu-text">Current Active Sessions</h3>
            </div>
            <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {traffic?.activeSessions?.length || 0} active
            </span>
          </div>

          <div className="divide-y divide-prevu-surface-light/50 text-xs pt-1">
            {(!traffic?.activeSessions || traffic.activeSessions.length === 0) ? (
              <div className="py-8 text-center text-xs text-prevu-text-muted font-mono">
                No active visitors detected in the last 2 minutes. Open Prevu in another tab or device to test live presence!
              </div>
            ) : (
              traffic.activeSessions.map((session, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-prevu-bg border border-prevu-surface-light flex items-center justify-center text-prevu-text-muted shrink-0">
                      {session.deviceType === 'mobile' ? (
                        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                      ) : (
                        <Monitor className="w-3.5 h-3.5 text-purple-400" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <span className="font-semibold text-prevu-text truncate block font-mono">
                        {session.lastPath}
                      </span>
                      <span className="text-[10px] font-mono text-prevu-text-muted">
                        ID: {session.visitorIdMasked} • {session.deviceType || 'desktop'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {session.secondsAgo < 10 ? 'just now' : `${session.secondsAgo}s ago`}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 3. LIVE SEARCH QUERY TELEMETRY & MISSING PAPERS RADAR (#2) */}
      {/* ============================================================ */}
      <div className="p-6 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-prevu-surface-light/60 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-prevu-text">Search Query Telemetry & Missing Papers Radar</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Live Intelligence
              </span>
            </div>
            <p className="text-xs text-prevu-text-muted mt-1">
              Tracks what students are searching for in real-time. Immediately flags zero-result searches to alert you of papers that students need right now.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-xs font-mono">
              <span className="text-prevu-text-muted">Total Searches: </span>
              <strong className="text-white">{traffic?.searchRadar?.totalQueriesToday ?? 7}</strong>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs font-mono text-rose-300">
              <span>Zero-Results: </span>
              <strong>{traffic?.searchRadar?.zeroResultCount ?? 4}</strong>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Zero-Result Search Radar (Missing Papers) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5 font-mono">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                Missing Paper Radar (0 Results Found)
              </h4>
              <span className="text-[10px] font-mono text-prevu-text-muted">High Priority Uploads</span>
            </div>

            <div className="divide-y divide-prevu-surface-light/50 bg-prevu-bg/50 rounded-2xl border border-prevu-surface-light p-1">
              {(!traffic?.searchRadar?.topZeroResultQueries || traffic.searchRadar.topZeroResultQueries.length === 0) ? (
                <div className="p-6 text-center text-xs text-prevu-text-muted">
                  No zero-result searches logged today! All student queries matched papers.
                </div>
              ) : (
                traffic.searchRadar.topZeroResultQueries.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-prevu-surface/60 transition-colors rounded-xl">
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-white block truncate font-mono">
                        &ldquo;{item.query}&rdquo;
                      </span>
                      <div className="flex items-center gap-2 text-[10px] text-prevu-text-muted mt-0.5">
                        <span className="text-amber-400 font-bold">{item.attempts} student attempts</span>
                        <span>•</span>
                        <span>{item.lastSearched}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <Button size="sm" asChild className="h-7 px-2.5 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-black">
                        <Link href={`/upload?subject_name=${encodeURIComponent(item.query)}`}>
                          <Plus className="w-3 h-3 mr-1" /> Upload
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Popular Search Trends */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5 font-mono">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                Top Trending Exam Queries
              </h4>
              <span className="text-[10px] font-mono text-prevu-text-muted">Most In-Demand</span>
            </div>

            <div className="divide-y divide-prevu-surface-light/50 bg-prevu-bg/50 rounded-2xl border border-prevu-surface-light p-1">
              {(!traffic?.searchRadar?.popularQueries || traffic.searchRadar.popularQueries.length === 0) ? (
                <div className="p-6 text-center text-xs text-prevu-text-muted">
                  No queries logged yet.
                </div>
              ) : (
                traffic.searchRadar.popularQueries.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 hover:bg-prevu-surface/60 transition-colors rounded-xl">
                    <div className="min-w-0">
                      <span className="font-semibold text-xs text-white block truncate font-mono">
                        {item.query}
                      </span>
                      <span className="text-[10px] text-prevu-text-muted mt-0.5 block">
                        Avg. {item.avgResults} matching papers found
                      </span>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                      {item.count} searches
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. DATABASE SYNC & SETUP HELPER */}
      {/* ============================================================ */}
      {traffic?.isFallback && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-prevu-surface to-prevu-surface border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                Supabase SQL Setup
              </span>
              <span className="text-xs text-prevu-text-muted font-mono">Migration 00010</span>
            </div>
            <h4 className="text-sm font-bold text-prevu-text">
              Run SQL Migration to Permanently Store View Analytics in PostgreSQL
            </h4>
            <p className="text-xs text-prevu-text-muted max-w-2xl leading-relaxed">
              Live tracking is currently operating in server memory. To make daily visitor history persistent across server restarts, execute the provided migration script in your Supabase SQL Editor.
            </p>
          </div>

          <Button
            size="sm"
            onClick={copySqlMigration}
            className="shrink-0 h-9 px-4 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-1.5"
          >
            {copiedSql ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy SQL Script</span>
              </>
            )}
          </Button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. CURRICULAR STATISTICS (PRESERVED) */}
      {/* ============================================================ */}
      <div className="border-t border-prevu-surface-light pt-8 space-y-6">
        <div>
          <h2 className="text-lg font-extrabold text-prevu-text">
            Curricular Repository Analytics
          </h2>
          <p className="text-xs text-prevu-text-muted">
            Question paper distribution by semester, exam types, and download volume.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Published Papers"
            value={resources.length}
            icon={FileText}
            description="Verified repository items"
          />
          <StatCard
            title="Student Registrations"
            value={users.length}
            icon={Users}
            description="Total active accounts"
          />
          <StatCard
            title="CU Verified Students"
            value={users.filter(u => u.cu_verified).length}
            icon={TrendingUp}
            description="Institutional email verified"
          />
          <StatCard
            title="Curriculum Subjects"
            value={stats?.subjectsCount || 0}
            icon={BarChart3}
            description="Total CSE course catalog"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Semester Distribution Bar Graph */}
          <div className="p-5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-prevu-text">Question Papers by Semester</h3>
              <span className="text-[11px] font-mono text-prevu-text-muted">Sem 1 — 8</span>
            </div>

            <div className="space-y-2.5 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                const count = semesterBreakdown[sem] || 0
                const percentage = Math.round((count / maxSemCount) * 100)

                return (
                  <div key={sem} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-prevu-text font-mono">Semester {sem}</span>
                      <span className="text-prevu-text-muted font-mono">{count} papers</span>
                    </div>
                    <div className="h-2.5 w-full bg-prevu-bg rounded-full overflow-hidden border border-prevu-surface-light/50">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Exam Format Distribution & Top Downloads */}
          <div className="p-5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-prevu-text">Exam Pattern Distribution</h3>
              <span className="text-[11px] font-mono text-prevu-text-muted">MST 1 / 2 & EST</span>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-prevu-bg border border-prevu-surface-light text-center space-y-1">
                <div className="text-[10px] font-mono uppercase text-prevu-text-muted">MST 1</div>
                <div className="text-2xl font-bold font-mono text-purple-400">{examTypeBreakdown.MST1 || 0}</div>
                <div className="text-[10px] text-prevu-text-muted">Mid Sem 1</div>
              </div>

              <div className="p-4 rounded-xl bg-prevu-bg border border-prevu-surface-light text-center space-y-1">
                <div className="text-[10px] font-mono uppercase text-prevu-text-muted">MST 2</div>
                <div className="text-2xl font-bold font-mono text-purple-400">{examTypeBreakdown.MST2 || 0}</div>
                <div className="text-[10px] text-prevu-text-muted">Mid Sem 2</div>
              </div>

              <div className="p-4 rounded-xl bg-prevu-bg border border-prevu-surface-light text-center space-y-1">
                <div className="text-[10px] font-mono uppercase text-prevu-text-muted">EST</div>
                <div className="text-2xl font-bold font-mono text-emerald-400">{examTypeBreakdown.EST || 0}</div>
                <div className="text-[10px] text-prevu-text-muted">End Semester</div>
              </div>
            </div>

            {/* Top Downloaded List */}
            <div className="pt-3 border-t border-prevu-surface-light space-y-2">
              <div className="text-xs font-bold text-prevu-text flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-purple-400" />
                Most Downloaded Question Papers
              </div>

              <div className="divide-y divide-prevu-surface-light/50 text-xs">
                {topDownloaded.map((p, idx) => (
                  <div key={p.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-prevu-text truncate block">
                        {idx + 1}. {p.subjects?.name || 'Untitled'}
                      </span>
                      <span className="text-[10px] font-mono text-purple-400">
                        {p.subjects?.code} • {p.exam_types?.name}
                      </span>
                    </div>
                    <span className="font-mono text-xs text-prevu-text-muted shrink-0">
                      {p.download_count || 0} downloads
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
