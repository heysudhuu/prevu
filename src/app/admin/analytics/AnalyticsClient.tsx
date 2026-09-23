'use client'

import React, { useMemo } from 'react'
import {
  BarChart3,
  Download,
  Users,
  FileText,
  TrendingUp,
  Info
} from 'lucide-react'
import { StatCard } from '@/components/admin/ui/StatCard'

interface AnalyticsClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[]
}

export default function AnalyticsClient({
  stats,
  resources,
  users
}: AnalyticsClientProps) {
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
            Curriculum & Usage Analytics
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            Real Database Metrics
          </span>
        </div>
        <p className="text-xs text-prevu-text-muted mt-1">
          Exam format distributions, semester repository density, top student downloads, and platform health.
        </p>
      </div>

      {/* Top Stat Cards */}
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

      {/* Charts Grid */}
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

        {/* Exam Format Distribution */}
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

      {/* Honest Data Notice for uncollected telemetry */}
      <div className="p-4 rounded-2xl bg-prevu-surface/40 border border-prevu-surface-light flex items-start gap-3 text-xs text-prevu-text-muted">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-prevu-text block">Data Transparency Notice</span>
          Historical time-series tracking (such as daily search volume and per-minute edge bandwidth) requires client event telemetry not currently stored in the database. Metrics above are strictly computed from actual PostgreSQL records.
        </div>
      </div>
    </div>
  )
}
