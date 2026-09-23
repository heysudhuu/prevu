'use client'

import React from 'react'
import Link from 'next/link'
import {
  Users,
  FileText,
  CheckCircle2,
  Inbox,
  AlertTriangle,
  Upload,
  ArrowRight,
  Database,
  HardDrive,
  KeyRound,
  Server,
  Layers,
  Sparkles
} from 'lucide-react'
import { StatCard } from '@/components/admin/ui/StatCard'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { Button } from '@/components/ui/Button'

interface DashboardClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  systemHealth: any
}

export default function DashboardClient({ initialData, systemHealth }: DashboardClientProps) {
  const stats = initialData?.stats || {}
  const recentUploads = initialData?.recentUploads || []
  const recentAudit = initialData?.recentAudit || []
  const semesterDistribution = initialData?.semesterDistribution || {}

  const pendingCount = stats.pendingCount ?? 0
  const approvedCount = stats.approvedCount ?? 0
  const totalPapers = pendingCount + approvedCount + (stats.rejectedCount ?? 0)
  const usersCount = stats.usersCount ?? 0
  const openReportsCount = stats.openReportsCount ?? 0
  const openRequestsCount = stats.openRequestsCount ?? 0
  const subjectsCount = stats.subjectsCount ?? 0

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-950/40 via-prevu-surface to-prevu-surface border border-purple-500/20 p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wide">
                Studio Command Center
              </span>
              <span className="text-xs text-prevu-text-muted">Prevu Vault v2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-prevu-text tracking-tight">
              Prevu Admin Platform
            </h1>
            <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
              University question paper repository moderation, academic curriculum CMS, student directory, and system oversight.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {pendingCount > 0 && (
              <Button
                size="sm"
                className="bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs h-9 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-1.5"
                asChild
              >
                <Link href="/admin/moderation">
                  <Inbox className="w-3.5 h-3.5" />
                  <span>Review {pendingCount} Pending</span>
                </Link>
              </Button>
            )}

            <Button
              size="sm"
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs h-9 px-4 rounded-xl shadow-md shadow-purple-600/25 flex items-center gap-1.5"
              asChild
            >
              <Link href="/upload">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Paper</span>
              </Link>
            </Button>

            <Button
              size="sm"
              variant="outline"
              className="h-9 px-3.5 text-xs font-semibold border-prevu-surface-light text-prevu-text hover:text-white rounded-xl bg-prevu-surface/80"
              asChild
            >
              <Link href="/browse">
                <span>Browse Vault</span>
                <ArrowRight className="w-3 h-3 ml-1 text-purple-400" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 8 Primary KPI Tiles */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider font-mono text-prevu-text-muted">
            Platform Metrics
          </h2>
          <span className="text-[11px] text-prevu-text-muted">Live Database Sync</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <StatCard
            title="Total Users"
            value={usersCount}
            icon={Users}
            description="Registered student & staff accounts"
            href="/admin/users"
          />

          <StatCard
            title="Total Papers"
            value={totalPapers}
            icon={FileText}
            description="Total question papers recorded"
            href="/admin/papers"
          />

          <StatCard
            title="Verified Papers"
            value={approvedCount}
            icon={CheckCircle2}
            badge={{ label: 'Live', variant: 'success' }}
            description="Published to student browse"
            href="/admin/papers?status=APPROVED"
          />

          <StatCard
            title="Pending Review"
            value={pendingCount}
            icon={Inbox}
            badge={{
              label: pendingCount > 0 ? 'Action Needed' : 'All Clear',
              variant: pendingCount > 0 ? 'warning' : 'success'
            }}
            description="Submissions awaiting moderation"
            href="/admin/moderation"
          />

          <StatCard
            title="Open Reports"
            value={openReportsCount}
            icon={AlertTriangle}
            badge={{
              label: openReportsCount > 0 ? 'Investigate' : 'Clean',
              variant: openReportsCount > 0 ? 'danger' : 'success'
            }}
            description="Student problem reports"
            href="/admin/reports"
          />

          <StatCard
            title="Community Requests"
            value={openRequestsCount}
            icon={Layers}
            description="Active missing paper requests"
            href="/admin/requests"
          />

          <StatCard
            title="Curriculum Subjects"
            value={subjectsCount}
            icon={Sparkles}
            description="BE-CSE categorized subjects"
            href="/admin/academic"
          />

          <StatCard
            title="Database Health"
            value="100%"
            icon={Database}
            badge={{ label: 'Operational', variant: 'success' }}
            description="All services running normal"
            href="/admin/system"
          />
        </div>
      </div>

      {/* Two Column Layout: Activity Overview & Recent Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Semester Distribution & Curricular Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-prevu-text">Curricular Coverage by Semester</h3>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  Verified papers distributed across BE-CSE academic semesters
                </p>
              </div>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-purple-400 hover:text-purple-300" asChild>
                <Link href="/admin/academic">Manage Curriculum →</Link>
              </Button>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                const count = semesterDistribution[sem] || 0
                return (
                  <div
                    key={sem}
                    className="p-3 rounded-xl bg-prevu-bg/80 border border-prevu-surface-light text-center space-y-1 hover:border-purple-500/30 transition-colors"
                  >
                    <div className="text-[10px] font-mono uppercase text-prevu-text-muted">
                      Sem {sem}
                    </div>
                    <div className="text-lg font-bold font-mono text-prevu-text">
                      {count}
                    </div>
                    <div className="text-[9px] text-prevu-text-muted/80">
                      {count === 1 ? 'Paper' : 'Papers'}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent Submissions Feed */}
          <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-xl">
            <div className="p-4 sm:p-5 border-b border-prevu-surface-light/80 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-prevu-text">Recent Upload Submissions</h3>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  Latest question papers submitted to the vault
                </p>
              </div>
              <Button size="sm" variant="ghost" className="h-7 text-xs text-purple-400 hover:text-purple-300" asChild>
                <Link href="/admin/papers">View All Papers →</Link>
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
                  <tr>
                    <th className="p-3.5 font-semibold">Subject & Code</th>
                    <th className="p-3.5 font-semibold">Pattern</th>
                    <th className="p-3.5 font-semibold">Uploader</th>
                    <th className="p-3.5 font-semibold">Status</th>
                    <th className="p-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-prevu-surface-light/60 text-prevu-text">
                  {recentUploads.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-prevu-text-muted">
                        No submissions recorded yet.
                      </td>
                    </tr>
                  ) : (
                    recentUploads.map((r: { id: string; status: string; subjects?: { name?: string; code?: string } | null; exam_types?: { name?: string } | null; users?: { name?: string; username?: string } | null }) => (
                      <tr key={r.id} className="hover:bg-prevu-surface-light/30 transition-colors">
                        <td className="p-3.5">
                          <div className="font-semibold text-prevu-text">{r.subjects?.name || 'Untitled'}</div>
                          <div className="text-[11px] font-mono text-purple-400">{r.subjects?.code || 'CSE'}</div>
                        </td>
                        <td className="p-3.5 font-mono">
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/20">
                            {r.exam_types?.name || 'MST'}
                          </span>
                        </td>
                        <td className="p-3.5 text-prevu-text-muted">
                          @{r.users?.username || r.users?.name || 'student'}
                        </td>
                        <td className="p-3.5">
                          <StatusBadge status={r.status} />
                        </td>
                        <td className="p-3.5 text-right">
                          <Link
                            href={`/api/preview/${r.id}`}
                            target="_blank"
                            className="text-xs text-purple-400 hover:text-purple-300 hover:underline"
                          >
                            Preview
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right (1 col): System Health & Quick Actions */}
        <div className="space-y-6">
          {/* System Health Card */}
          <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-prevu-text">System Health Diagnostics</h3>
              <StatusBadge status="operational" label="Healthy" />
            </div>

            <div className="space-y-3">
              {systemHealth?.services?.map((svc: { name: string; message: string; latencyMs: number; status: 'operational' | 'warning' | 'error' }) => {
                const getIcon = () => {
                  if (svc.name.includes('Database')) return Database
                  if (svc.name.includes('Storage')) return HardDrive
                  if (svc.name.includes('Auth')) return KeyRound
                  return Server
                }
                const SvcIcon = getIcon()

                return (
                  <div
                    key={svc.name}
                    className="p-3 rounded-xl bg-prevu-bg/70 border border-prevu-surface-light flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <SvcIcon className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-prevu-text truncate">{svc.name}</div>
                        <div className="text-[10px] text-prevu-text-muted truncate">{svc.message}</div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-emerald-400 font-semibold">
                        {svc.latencyMs}ms
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <Button size="sm" variant="outline" className="w-full text-xs h-8 rounded-xl border-prevu-surface-light" asChild>
              <Link href="/admin/system">View Full System Diagnostics →</Link>
            </Button>
          </div>

          {/* Recent Audit Actions Card */}
          <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-prevu-text">Recent Administrative Audit</h3>
              <Link href="/admin/audit-log" className="text-xs text-purple-400 hover:underline">
                View All
              </Link>
            </div>

            {recentAudit.length === 0 ? (
              <p className="text-xs text-prevu-text-muted py-4 text-center">
                No recent administrative actions recorded.
              </p>
            ) : (
              <div className="space-y-2.5">
                {recentAudit.slice(0, 5).map((log: { id: string; action: string; created_at: string; admin_email: string }) => (
                  <div
                    key={log.id}
                    className="p-2.5 rounded-xl bg-prevu-bg/60 border border-prevu-surface-light text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-prevu-text-muted font-mono">
                      <span>{log.action}</span>
                      <span>
                        {new Date(log.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="text-[11px] text-prevu-text font-medium truncate">
                      By {log.admin_email}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
