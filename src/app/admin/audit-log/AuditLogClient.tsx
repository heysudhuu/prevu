'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  User,
  Eye
} from 'lucide-react'
import { DataTable, Column } from '@/components/admin/ui/DataTable'
import { DetailDrawer } from '@/components/admin/ui/DetailDrawer'
import { Button } from '@/components/ui/Button'

interface AuditLogItem {
  id: string
  admin_id?: string | null
  admin_email: string
  action: string
  target_type: string
  target_id?: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  details?: Record<string, any>
  created_at: string
}

interface AuditLogClientProps {
  initialLogs: AuditLogItem[]
}

export default function AuditLogClient({ initialLogs }: AuditLogClientProps) {
  const [logs] = useState<AuditLogItem[]>(initialLogs)
  const [searchQuery, setSearchQuery] = useState('')
  const [targetTypeFilter, setTargetTypeFilter] = useState('ALL')
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null)

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const term = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !term ||
        log.admin_email?.toLowerCase().includes(term) ||
        log.action?.toLowerCase().includes(term) ||
        String(log.target_id || '').includes(term)

      const matchesTarget =
        targetTypeFilter === 'ALL' ||
        log.target_type?.toLowerCase() === targetTypeFilter.toLowerCase()

      return matchesSearch && matchesTarget
    })
  }, [logs, searchQuery, targetTypeFilter])

  const getActionColor = (action: string) => {
    if (action.includes('APPROVE') || action.includes('RESOLVE') || action.includes('ACTIVATE')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
    }
    if (action.includes('REJECT') || action.includes('DELETE') || action.includes('SUSPEND')) {
      return 'bg-red-500/10 text-red-400 border-red-500/25'
    }
    if (action.includes('EDIT') || action.includes('UPDATE')) {
      return 'bg-amber-500/10 text-amber-300 border-amber-500/25'
    }
    return 'bg-purple-500/10 text-purple-300 border-purple-500/25'
  }

  const columns: Column<AuditLogItem>[] = [
    {
      key: 'action',
      header: 'Action',
      sortable: true,
      render: l => (
        <span
          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight border ${getActionColor(
            l.action
          )}`}
        >
          {l.action}
        </span>
      )
    },
    {
      key: 'admin_email',
      header: 'Administrator',
      sortable: true,
      render: l => (
        <div className="flex items-center gap-1.5">
          <User className="w-3.5 h-3.5 text-purple-400" />
          <span className="font-medium text-prevu-text">{l.admin_email}</span>
        </div>
      )
    },
    {
      key: 'target_type',
      header: 'Target Entity',
      sortable: true,
      render: l => (
        <div className="font-mono text-xs">
          <span className="text-prevu-text font-semibold uppercase text-[10px]">
            {l.target_type}
          </span>
          {l.target_id && (
            <span className="text-prevu-text-muted text-[11px] block truncate max-w-[120px]">
              ID: {l.target_id}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Timestamp',
      sortable: true,
      render: l => (
        <span className="font-mono text-prevu-text-muted text-[11px]">
          {l.created_at
            ? new Date(l.created_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })
            : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      header: <span className="text-right block">Payload</span>,
      className: 'text-right',
      render: l => (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setSelectedLog(l)}
          className="h-7 px-2 text-xs text-prevu-text-muted hover:text-prevu-text"
        >
          <Eye className="w-3.5 h-3.5 mr-1" />
          Inspect Diff
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
              Administrative Audit Log
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              Immutable
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Chronological audit trail of all moderation actions, user modifications, and system events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={targetTypeFilter}
            onChange={e => setTargetTypeFilter(e.target.value)}
            className="px-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
          >
            <option value="ALL">All Entities</option>
            <option value="paper">Papers</option>
            <option value="user">Users</option>
            <option value="report">Reports</option>
            <option value="request">Requests</option>
            <option value="subject">Subjects</option>
            <option value="notification">Notifications</option>
            <option value="calendar">Calendar</option>
          </select>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by administrator email, action keyword, or target ID..."
            className="w-full pl-10 pr-4 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-purple-500/50"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <DataTable
        data={filteredLogs}
        columns={columns}
        keyExtractor={l => l.id}
        pageSize={20}
        emptyTitle="No audit logs recorded"
        emptyDescription="Administrative operations will be automatically appended here."
      />

      {/* Detail Drawer */}
      <DetailDrawer
        isOpen={!!selectedLog}
        title="Audit Log Payload"
        subtitle={`Event: ${selectedLog?.action} • ${selectedLog?.admin_email}`}
        onClose={() => setSelectedLog(null)}
      >
        {selectedLog && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-prevu-bg border border-prevu-surface-light space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono text-purple-400 font-bold">{selectedLog.action}</span>
                <span className="text-[10px] font-mono text-prevu-text-muted">
                  {new Date(selectedLog.created_at).toLocaleString()}
                </span>
              </div>
              <div className="text-prevu-text font-medium">By: {selectedLog.admin_email}</div>
              <div className="text-prevu-text-muted font-mono">
                Target: {selectedLog.target_type} ({selectedLog.target_id || 'N/A'})
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-prevu-text mb-2">Detailed Payload JSON:</h4>
              <pre className="p-4 rounded-xl bg-prevu-bg border border-prevu-surface-light text-[11px] font-mono text-purple-300 overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(selectedLog.details || {}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </DetailDrawer>
    </div>
  )
}
