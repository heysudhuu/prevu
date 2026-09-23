'use client'

import React, { useState, useMemo } from 'react'
import {
  Eye,
  Trash2
} from 'lucide-react'
import { DataTable, Column } from '@/components/admin/ui/DataTable'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { DetailDrawer } from '@/components/admin/ui/DetailDrawer'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { resolveReport, dismissReport, deleteResource } from '../actions'

interface ReportItem {
  id: string
  resource_id?: string
  reporter_id?: string
  reporter_email?: string
  category: string
  reason: string
  status: string
  assigned_admin_id?: string
  admin_notes?: string
  created_at: string
  resources?: {
    id: string
    exam_year: number
    file_path: string
    subjects?: {
      id: number
      name: string
      code: string
      semester: number
    }
    exam_types?: {
      id: number
      name: string
    }
  }
  users?: {
    id: string
    name: string
    username?: string
    email?: string
  }
}

interface ReportsClientProps {
  initialReports: ReportItem[]
}

export default function ReportsClient({ initialReports }: ReportsClientProps) {
  const [reports, setReports] = useState<ReportItem[]>(initialReports)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [confirmDeletePaper, setConfirmDeletePaper] = useState<ReportItem | null>(null)

  const filteredReports = useMemo(() => {
    if (statusFilter === 'ALL') return reports
    return reports.filter(r => r.status?.toLowerCase() === statusFilter.toLowerCase())
  }, [reports, statusFilter])

  const handleResolve = async (reportId: string) => {
    setActionLoading(true)
    const res = await resolveReport(reportId, resolutionNotes || 'Resolved by admin')
    if (res.success) {
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, status: 'resolved', admin_notes: resolutionNotes } : r))
      )
      setSelectedReport(null)
      setResolutionNotes('')
    } else {
      alert(res.error || 'Failed to resolve report')
    }
    setActionLoading(false)
  }

  const handleDismiss = async (reportId: string) => {
    setActionLoading(true)
    const res = await dismissReport(reportId, resolutionNotes || 'Dismissed by admin')
    if (res.success) {
      setReports(prev =>
        prev.map(r => (r.id === reportId ? { ...r, status: 'dismissed', admin_notes: resolutionNotes } : r))
      )
      setSelectedReport(null)
      setResolutionNotes('')
    } else {
      alert(res.error || 'Failed to dismiss report')
    }
    setActionLoading(false)
  }

  const handleDeleteReportedPaper = async () => {
    if (!confirmDeletePaper?.resources?.id) return
    setActionLoading(true)
    const paperId = confirmDeletePaper.resources.id
    const filePath = confirmDeletePaper.resources.file_path
    await deleteResource(paperId, filePath)
    await resolveReport(confirmDeletePaper.id, 'Offending resource removed permanently')
    setReports(prev =>
      prev.map(r => (r.id === confirmDeletePaper.id ? { ...r, status: 'resolved' } : r))
    )
    setConfirmDeletePaper(null)
    setSelectedReport(null)
    setActionLoading(false)
  }

  const columns: Column<ReportItem>[] = [
    {
      key: 'category',
      header: 'Category & Reason',
      sortable: true,
      render: r => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-500/10 text-red-300 border border-red-500/25">
              {r.category.replace('_', ' ')}
            </span>
          </div>
          <p className="text-xs text-prevu-text line-clamp-1 max-w-sm">{r.reason}</p>
        </div>
      )
    },
    {
      key: 'paper',
      header: 'Associated Paper',
      render: r => (
        <div>
          <div className="font-semibold text-prevu-text">
            {r.resources?.subjects?.name || 'Deleted or Missing Paper'}
          </div>
          <div className="text-[11px] font-mono text-purple-400">
            {r.resources?.subjects?.code} • {r.resources?.exam_year}
          </div>
        </div>
      )
    },
    {
      key: 'reporter',
      header: 'Reported By',
      render: r => (
        <span className="text-prevu-text-muted text-xs">
          @{r.users?.username || r.users?.name || r.reporter_email || 'student'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: r => <StatusBadge status={r.status} />
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: r => (
        <span className="font-mono text-prevu-text-muted text-[11px]">
          {r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      header: <span className="text-right block">Action</span>,
      className: 'text-right',
      render: r => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setSelectedReport(r)
            setResolutionNotes(r.admin_notes || '')
          }}
          className="h-7 px-3 text-xs border-prevu-surface-light text-prevu-text hover:text-white rounded-lg"
        >
          Inspect
        </Button>
      )
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              Content Problem Reports
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/10 text-red-300 border border-red-500/30">
              {reports.filter(r => r.status === 'open').length} Open
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Review community flags regarding incorrect subject tags, duplicate uploads, or unreadable papers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            <option value="ALL">All Statuses</option>
            <option value="open">Open Reports</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <DataTable
        data={filteredReports}
        columns={columns}
        keyExtractor={r => r.id}
        pageSize={15}
        emptyTitle="No reports logged"
        emptyDescription="There are currently no problem reports matching your selection."
      />

      {/* Report Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedReport}
        title="Report Details & Investigation"
        subtitle={`Report ID: ${selectedReport?.id}`}
        onClose={() => setSelectedReport(null)}
        footer={
          selectedReport && (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmDeletePaper(selectedReport)}
                className="text-red-400 hover:text-red-300 border-red-500/30 text-xs flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove Paper
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDismiss(selectedReport.id)}
                  disabled={actionLoading}
                  className="border-prevu-surface-light text-xs"
                >
                  Dismiss Report
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleResolve(selectedReport.id)}
                  disabled={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                >
                  Resolve Report
                </Button>
              </div>
            </div>
          )
        }
      >
        {selectedReport && (
          <div className="space-y-5 text-xs">
            {/* Reason & Category */}
            <div className="p-4 rounded-xl bg-prevu-bg border border-prevu-surface-light space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-red-500/10 text-red-300 border border-red-500/30">
                  {selectedReport.category.replace('_', ' ')}
                </span>
                <StatusBadge status={selectedReport.status} />
              </div>

              <div className="pt-2">
                <h4 className="font-semibold text-prevu-text text-sm">Report Explanation</h4>
                <p className="text-prevu-text-muted mt-1 leading-relaxed whitespace-pre-wrap">
                  {selectedReport.reason}
                </p>
              </div>
            </div>

            {/* Target Paper Info */}
            {selectedReport.resources && (
              <div className="p-4 rounded-xl bg-prevu-bg border border-prevu-surface-light space-y-3">
                <h4 className="text-[11px] font-semibold text-prevu-text-muted uppercase tracking-wider">
                  Target Question Paper
                </h4>
                <div>
                  <div className="font-bold text-sm text-prevu-text">
                    {selectedReport.resources.subjects?.name || 'Untitled Paper'}
                  </div>
                  <div className="text-xs font-mono text-purple-400 mt-0.5">
                    {selectedReport.resources.subjects?.code} • Sem {selectedReport.resources.subjects?.semester} • {selectedReport.resources.exam_year}
                  </div>
                </div>

                <Button size="sm" variant="outline" className="w-full text-xs border-prevu-surface-light" asChild>
                  <a
                    href={`/api/preview/${selectedReport.resources.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Eye className="w-3.5 h-3.5 mr-1.5" /> Open Paper Preview in New Tab
                  </a>
                </Button>
              </div>
            )}

            {/* Admin Resolution Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-prevu-text-muted uppercase tracking-wider">
                Admin Resolution Notes
              </label>
              <textarea
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                rows={3}
                placeholder="Log internal notes on how this report was handled..."
                className="w-full p-3 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Remove Paper Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDeletePaper}
        title="Remove Question Paper & Resolve Report?"
        description="This will permanently delete the offending question paper from the database and storage, and mark the report as resolved."
        confirmText="Permanently Remove Paper"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleDeleteReportedPaper}
        onCancel={() => setConfirmDeletePaper(null)}
      />
    </div>
  )
}
