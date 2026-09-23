'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Upload
} from 'lucide-react'
import { DataTable, Column } from '@/components/admin/ui/DataTable'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { updatePaperRequestStatus } from '../actions'

interface PaperRequestItem {
  id: number
  requested_by?: string
  subject_name: string
  exam_type: string
  exam_year: number
  semester: number
  note?: string
  status: string
  created_at: string
  users?: {
    id: string
    name: string
    username?: string
    email?: string
  }
}

interface RequestsClientProps {
  initialRequests: PaperRequestItem[]
}

export default function RequestsClient({ initialRequests }: RequestsClientProps) {
  const [requests, setRequests] = useState<PaperRequestItem[]>(initialRequests)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [actionLoading, setActionLoading] = useState(false)

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'ALL') return requests
    return requests.filter(r => r.status?.toLowerCase() === statusFilter.toLowerCase())
  }, [requests, statusFilter])

  const handleStatusChange = async (requestId: number, newStatus: string) => {
    setActionLoading(true)
    const res = await updatePaperRequestStatus(requestId, newStatus)
    if (res.success) {
      setRequests(prev =>
        prev.map(r => (r.id === requestId ? { ...r, status: newStatus } : r))
      )
    } else {
      alert(res.error || 'Failed to update request status')
    }
    setActionLoading(false)
  }

  const columns: Column<PaperRequestItem>[] = [
    {
      key: 'subject_name',
      header: 'Requested Subject',
      sortable: true,
      render: r => (
        <div>
          <div className="font-bold text-prevu-text">{r.subject_name}</div>
          {r.note && (
            <div className="text-[11px] text-prevu-text-muted italic line-clamp-1">
              &ldquo;{r.note}&rdquo;
            </div>
          )}
        </div>
      )
    },
    {
      key: 'pattern',
      header: 'Exam Format & Year',
      render: r => (
        <span className="font-mono text-xs text-purple-300">
          {r.exam_type} • {r.exam_year}
        </span>
      )
    },
    {
      key: 'semester',
      header: 'Semester',
      sortable: true,
      render: r => (
        <span className="font-mono text-xs text-prevu-text-muted">
          Semester {r.semester}
        </span>
      )
    },
    {
      key: 'requested_by',
      header: 'Requested By',
      render: r => (
        <span className="text-prevu-text-muted text-xs">
          @{r.users?.username || r.users?.name || 'student'}
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
          {r.created_at ? new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      header: <span className="text-right block">Update Status</span>,
      className: 'text-right',
      render: r => (
        <div className="flex items-center justify-end gap-1.5">
          <select
            value={r.status}
            onChange={e => handleStatusChange(r.id, e.target.value)}
            disabled={actionLoading}
            className="px-2 py-1 bg-prevu-bg border border-prevu-surface-light rounded-lg text-xs text-prevu-text focus:outline-none focus:border-purple-500"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="closed">Closed</option>
          </select>

          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-purple-400 hover:text-purple-300" asChild>
            <Link href={`/upload?subject=${encodeURIComponent(r.subject_name)}&sem=${r.semester}`}>
              <Upload className="w-3.5 h-3.5 mr-1" />
              Fulfill
            </Link>
          </Button>
        </div>
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
              Community Missing Paper Requests
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {requests.filter(r => r.status === 'open').length} Open
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Student bounty requests for missing PYQs, MSTs, and semester exam papers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            <option value="ALL">All Requests</option>
            <option value="open">Open Requests</option>
            <option value="in_progress">In Progress</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <DataTable
        data={filteredRequests}
        columns={columns}
        keyExtractor={r => String(r.id)}
        pageSize={15}
        emptyTitle="No paper requests found"
        emptyDescription="There are currently no community requests matching your criteria."
      />
    </div>
  )
}
