'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Edit3
} from 'lucide-react'
import { DataTable, Column } from '@/components/admin/ui/DataTable'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { DetailDrawer } from '@/components/admin/ui/DetailDrawer'
import { Button } from '@/components/ui/Button'
import {
  approveResource,
  rejectResource,
  archiveResource,
  deleteResource,
  bulkApprovePapers,
  bulkArchivePapers,
  bulkDeletePapers
} from '../actions'

export interface PaperItem {
  id: string
  file_path: string
  file_type: string
  original_filename: string
  exam_year: number
  status: string
  download_count: number
  created_at: string
  subjects?: {
    id?: number
    name?: string
    code?: string
    semester?: number
    year?: number
  } | null
  exam_types?: {
    id?: number
    name?: string
  } | null
  users?: {
    id?: string
    name?: string
    username?: string
    email?: string
    cu_verified?: boolean
  } | null
}

interface PapersManagementClientProps {
  initialPapers: PaperItem[]
}

export default function PapersManagementClient({
  initialPapers
}: PapersManagementClientProps) {
  const [papers, setPapers] = useState<PaperItem[]>(initialPapers)
  const [searchQuery, setSearchQuery] = useState('')
  const [semFilter, setSemFilter] = useState<string>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal / Drawer state
  const [editingPaper, setEditingPaper] = useState<PaperItem | null>(null)
  const [editSubjectName, setEditSubjectName] = useState('')
  const [editSubjectCode, setEditSubjectCode] = useState('')
  const [editExamType, setEditExamType] = useState('MST1')
  const [editExamYear, setEditExamYear] = useState<number>(2026)
  const [editSemester, setEditSemester] = useState<number>(1)
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Confirmation state
  const [confirmDeletePaper, setConfirmDeletePaper] = useState<PaperItem | null>(null)
  const [isBulkDeleting, setIsBulkDeleting] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  // Filtered dataset
  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      const term = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !term ||
        p.subjects?.name?.toLowerCase().includes(term) ||
        p.subjects?.code?.toLowerCase().includes(term) ||
        p.users?.name?.toLowerCase().includes(term) ||
        p.users?.username?.toLowerCase().includes(term) ||
        String(p.exam_year || '').includes(term)

      const matchesSem = semFilter === 'ALL' || String(p.subjects?.semester) === semFilter
      const matchesType = typeFilter === 'ALL' || p.exam_types?.name === typeFilter
      const matchesStatus = statusFilter === 'ALL' || p.status?.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesSem && matchesType && matchesStatus
    })
  }, [papers, searchQuery, semFilter, typeFilter, statusFilter])

  // Handlers
  const handleVerify = async (paperId: string) => {
    setActionLoading(true)
    const res = await approveResource(paperId)
    if (res.success) {
      setPapers(prev => prev.map(p => (p.id === paperId ? { ...p, status: 'approved' } : p)))
    }
    setActionLoading(false)
  }

  const handleReject = async (paperId: string) => {
    const reason = prompt('Please enter the reason for rejection:')
    if (!reason) return
    setActionLoading(true)
    const res = await rejectResource(paperId, reason)
    if (res.success) {
      setPapers(prev => prev.map(p => (p.id === paperId ? { ...p, status: 'rejected' } : p)))
    }
    setActionLoading(false)
  }

  const handleArchive = async (paperId: string) => {
    setActionLoading(true)
    const res = await archiveResource(paperId)
    if (res.success) {
      setPapers(prev => prev.map(p => (p.id === paperId ? { ...p, status: 'archived' } : p)))
    }
    setActionLoading(false)
  }

  const handleDeleteConfirmed = async () => {
    if (!confirmDeletePaper) return
    setActionLoading(true)
    const res = await deleteResource(confirmDeletePaper.id, confirmDeletePaper.file_path)
    if (res.success) {
      setPapers(prev => prev.filter(p => p.id !== confirmDeletePaper.id))
      setSelectedIds(prev => prev.filter(id => id !== confirmDeletePaper.id))
    }
    setConfirmDeletePaper(null)
    setActionLoading(false)
  }

  // Bulk Actions
  const handleBulkVerify = async () => {
    if (selectedIds.length === 0) return
    setActionLoading(true)
    const res = await bulkApprovePapers(selectedIds)
    if (res.success) {
      setPapers(prev => prev.map(p => (selectedIds.includes(p.id) ? { ...p, status: 'approved' } : p)))
      setSelectedIds([])
    }
    setActionLoading(false)
  }

  const handleBulkArchive = async () => {
    if (selectedIds.length === 0) return
    setActionLoading(true)
    const res = await bulkArchivePapers(selectedIds)
    if (res.success) {
      setPapers(prev => prev.map(p => (selectedIds.includes(p.id) ? { ...p, status: 'archived' } : p)))
      setSelectedIds([])
    }
    setActionLoading(false)
  }

  const handleBulkDeleteConfirmed = async () => {
    if (selectedIds.length === 0) return
    setActionLoading(true)
    const res = await bulkDeletePapers(selectedIds)
    if (res.success) {
      setPapers(prev => prev.filter(p => !selectedIds.includes(p.id)))
      setSelectedIds([])
    }
    setIsBulkDeleting(false)
    setActionLoading(false)
  }

  // Open Edit Drawer
  const openEditDrawer = (paper: PaperItem) => {
    setEditingPaper(paper)
    setEditSubjectName(paper.subjects?.name || '')
    setEditSubjectCode(paper.subjects?.code || '')
    setEditExamType(paper.exam_types?.name || 'MST1')
    setEditExamYear(paper.exam_year || 2026)
    setEditSemester(paper.subjects?.semester || 1)
  }

  const handleSaveEdit = async () => {
    if (!editingPaper) return
    setIsSavingEdit(true)
    const res = await approveResource(editingPaper.id, {
      subject_name: editSubjectName,
      subject_code: editSubjectCode,
      exam_type: editExamType,
      exam_year: Number(editExamYear),
      semester: Number(editSemester)
    })

    if (res.success) {
      setPapers(prev =>
        prev.map(p =>
          p.id === editingPaper.id
            ? {
                ...p,
                exam_year: Number(editExamYear),
                status: 'approved',
                subjects: {
                  id: p.subjects?.id || 1,
                  name: editSubjectName,
                  code: editSubjectCode,
                  semester: Number(editSemester),
                  year: Math.ceil(Number(editSemester) / 2)
                },
                exam_types: {
                  id: p.exam_types?.id || 1,
                  name: editExamType
                }
              }
            : p
        )
      )
      setEditingPaper(null)
    } else {
      alert(res.error || 'Failed to update paper')
    }
    setIsSavingEdit(false)
  }

  // Columns definition
  const columns: Column<PaperItem>[] = [
    {
      key: 'subject',
      header: 'Subject & Code',
      sortable: true,
      render: p => (
        <div>
          <div className="font-bold text-prevu-text">{p.subjects?.name || 'Untitled Subject'}</div>
          <div className="text-[11px] font-mono text-purple-400">{p.subjects?.code || 'CSE'}</div>
        </div>
      )
    },
    {
      key: 'exam_type',
      header: 'Exam Type',
      sortable: true,
      render: p => (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
          {p.exam_types?.name || 'MST'}
        </span>
      )
    },
    {
      key: 'semester',
      header: 'Sem & Year',
      sortable: true,
      render: p => (
        <span className="font-mono text-prevu-text-muted">
          Sem {p.subjects?.semester || 1} • {p.exam_year}
        </span>
      )
    },
    {
      key: 'uploaded_by',
      header: 'Uploaded By',
      render: p => (
        <span className="text-prevu-text-muted truncate max-w-[120px] block">
          @{p.users?.username || p.users?.name || 'student'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: p => <StatusBadge status={p.status} />
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: p => (
        <span className="font-mono text-prevu-text-muted text-[11px]">
          {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      header: <span className="text-right block">Actions</span>,
      className: 'text-right',
      render: p => (
        <div className="flex items-center justify-end gap-1">
          {/* Preview */}
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light rounded-lg"
            title="Preview PDF"
            asChild
          >
            <a href={`/api/preview/${p.id}`} target="_blank" rel="noopener noreferrer">
              <Eye className="w-3.5 h-3.5" />
            </a>
          </Button>

          {/* Quick Edit */}
          <button
            onClick={() => openEditDrawer(p)}
            className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-purple-300 hover:bg-purple-500/10 flex items-center justify-center transition-colors"
            title="Edit Metadata"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          {/* Verify (if not already approved) */}
          {p.status !== 'approved' && (
            <button
              onClick={() => handleVerify(p.id)}
              disabled={actionLoading}
              className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center transition-colors"
              title="Verify Paper"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Reject (if pending) */}
          {p.status === 'pending' && (
            <button
              onClick={() => handleReject(p.id)}
              disabled={actionLoading}
              className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-amber-400 hover:bg-amber-500/10 flex items-center justify-center transition-colors"
              title="Reject Paper"
            >
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Archive */}
          {p.status !== 'archived' && (
            <button
              onClick={() => handleArchive(p.id)}
              disabled={actionLoading}
              className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-zinc-300 hover:bg-zinc-700/30 flex items-center justify-center transition-colors"
              title="Archive Paper"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Delete */}
          <button
            onClick={() => setConfirmDeletePaper(p)}
            disabled={actionLoading}
            className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
            title="Delete Paper"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
            Question Papers Repository
          </h1>
          <p className="text-xs text-prevu-text-muted mt-1">
            Data table management for university exam archives, status verification, and bulk actions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm" asChild>
            <a href="/upload">Upload New Paper</a>
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by subject name, course code (e.g. 23CST), uploader, or year..."
              className="w-full pl-10 pr-4 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Semester Filter */}
            <select
              value={semFilter}
              onChange={e => setSemFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={String(s)}>Semester {s}</option>
              ))}
            </select>

            {/* Exam Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="ALL">All Exam Formats</option>
              <option value="MST1">MST 1</option>
              <option value="MST2">MST 2</option>
              <option value="EST">EST</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved / Live</option>
              <option value="rejected">Rejected</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Data Table */}
      <DataTable
        data={filteredPapers}
        columns={columns}
        keyExtractor={item => item.id}
        selectable={true}
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        pageSize={15}
        emptyTitle="No papers found"
        emptyDescription="No question papers match your current search query or active filter settings."
        bulkActions={
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              onClick={handleBulkVerify}
              disabled={actionLoading}
              className="h-7 px-2.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verify Selected</span>
            </Button>

            <Button
              size="sm"
              onClick={handleBulkArchive}
              disabled={actionLoading}
              className="h-7 px-2.5 text-xs font-semibold bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg flex items-center gap-1"
            >
              <Archive className="w-3.5 h-3.5" />
              <span>Archive Selected</span>
            </Button>

            <Button
              size="sm"
              onClick={() => setIsBulkDeleting(true)}
              disabled={actionLoading}
              className="h-7 px-2.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </Button>
          </div>
        }
      />

      {/* Edit Paper Detail Drawer */}
      <DetailDrawer
        isOpen={!!editingPaper}
        title="Edit Paper Metadata"
        subtitle={`ID: ${editingPaper?.id}`}
        onClose={() => setEditingPaper(null)}
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditingPaper(null)}
              className="border-prevu-surface-light text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSaveEdit}
              disabled={isSavingEdit}
              className="bg-purple-600 hover:bg-purple-500 text-white text-xs"
            >
              {isSavingEdit ? 'Saving...' : 'Save & Publish'}
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-prevu-text-muted font-medium mb-1.5">
              Subject Name
            </label>
            <input
              type="text"
              value={editSubjectName}
              onChange={e => setEditSubjectName(e.target.value)}
              className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-prevu-text-muted font-medium mb-1.5">
                Course Code
              </label>
              <input
                type="text"
                value={editSubjectCode}
                onChange={e => setEditSubjectCode(e.target.value)}
                placeholder="23CST-302"
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text font-mono focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-prevu-text-muted font-medium mb-1.5">
                Exam Format
              </label>
              <select
                value={editExamType}
                onChange={e => setEditExamType(e.target.value)}
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
              >
                <option value="MST1">MST 1</option>
                <option value="MST2">MST 2</option>
                <option value="EST">EST</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-prevu-text-muted font-medium mb-1.5">
                Semester
              </label>
              <select
                value={editSemester}
                onChange={e => setEditSemester(Number(e.target.value))}
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-prevu-text-muted font-medium mb-1.5">
                Exam Year
              </label>
              <input
                type="number"
                value={editExamYear}
                onChange={e => setEditExamYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {editingPaper && (
            <div className="pt-4 border-t border-prevu-surface-light space-y-2">
              <span className="font-semibold text-prevu-text block">File Reference</span>
              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light text-[11px] text-prevu-text-muted font-mono truncate">
                {editingPaper.file_path}
              </div>
              <Button size="sm" variant="outline" className="w-full text-xs border-prevu-surface-light" asChild>
                <a href={`/api/preview/${editingPaper.id}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-3.5 h-3.5 mr-1.5" /> Open Preview
                </a>
              </Button>
            </div>
          )}
        </div>
      </DetailDrawer>

      {/* Delete Single Paper Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDeletePaper}
        title="Permanently Delete Question Paper?"
        description={`Are you sure you want to permanently delete "${confirmDeletePaper?.subjects?.name || 'this paper'}"? This action removes the file from Supabase storage and cannot be undone.`}
        confirmText="Delete Paper"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDeletePaper(null)}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        title={`Permanently Delete ${selectedIds.length} Selected Papers?`}
        description={`This will permanently remove ${selectedIds.length} question paper files and their database records from Prevu. This action cannot be reversed.`}
        confirmText="Confirm Bulk Deletion"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleBulkDeleteConfirmed}
        onCancel={() => setIsBulkDeleting(false)}
      />
    </div>
  )
}
