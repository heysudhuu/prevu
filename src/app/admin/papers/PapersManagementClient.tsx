'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Archive,
  Trash2,
  Edit3,
  RotateCcw,
  FileText,
  FolderGit2,
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen,
  GraduationCap
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
  bulkDeletePapers,
  updateResourceDetails,
  revokeResourceApproval
} from '../actions'
import { getCleanResourceCardTitle } from '@/components/ResourceCard'

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

export interface PaperItem {
  id: string
  file_path: string
  file_type: string
  original_filename: string
  exam_year: number
  status: string
  download_count: number
  created_at: string
  unit?: string | null
  resource_format?: 'file' | 'gdrive' | 'youtube' | 'external_link' | null
  external_url?: string | null
  bundle_scope?: string | null
  channel_name?: string | null
  youtube_id?: string | null
  admin_note?: string | null
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

export type SectionType = 'regular_pyq' | 'study_material' | 'reappear'

export function getSectionMeta(examTypeName?: string | null): {
  section: SectionType
  label: string
  badgeClass: string
} {
  const name = (examTypeName || '').toLowerCase()
  if (
    name.includes('80/20') ||
    name.includes('reappear') ||
    name.includes('backlog') ||
    name.includes('passing plan')
  ) {
    return {
      section: 'reappear',
      label: 'Reappear Hub',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    }
  }
  if (
    name.includes('note') ||
    name.includes('syllabus') ||
    name.includes('reference') ||
    name.includes('assignment') ||
    name.includes('bank') ||
    name.includes('manual') ||
    name.includes('book')
  ) {
    return {
      section: 'study_material',
      label: 'Study Material',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    }
  }
  return {
    section: 'regular_pyq',
    label: 'Regular PYQ',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  }
}

export function getFormatMeta(format?: string | null) {
  switch (format) {
    case 'youtube':
      return {
        label: 'YouTube',
        icon: YouTubeIcon,
        badgeClass: 'bg-red-500/15 text-red-300 border-red-500/30'
      }
    case 'gdrive':
      return {
        label: 'Google Drive',
        icon: FolderGit2,
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      }
    default:
      return {
        label: 'File / PDF',
        icon: FileText,
        badgeClass: 'bg-zinc-700/40 text-zinc-300 border-zinc-600/40'
      }
  }
}

const SECTION_CATEGORIES: Record<SectionType, string[]> = {
  regular_pyq: ['MST1', 'MST2', 'EST'],
  study_material: [
    'Notes',
    'Syllabus',
    'Reference Book',
    'Assignment Solution',
    'Question Bank',
    'Lab Manual',
    'Handwritten Notes'
  ],
  reappear: [
    '80/20 High-Yield Notes',
    'Reappear Question Bank',
    'Syllabus & Passing Plan'
  ]
}

const COMMON_CHANNELS = [
  'Gate Smashers',
  'Neso Academy',
  'Knowledge Gate',
  'Abdul Bari',
  'Jenny\'s Lectures',
  'Bhagwan Singh Vishwakarma'
]

export default function PapersManagementClient({
  initialPapers
}: PapersManagementClientProps) {
  const [papers, setPapers] = useState<PaperItem[]>(initialPapers)
  const [searchQuery, setSearchQuery] = useState('')
  const [semFilter, setSemFilter] = useState<string>('ALL')
  const [sectionFilter, setSectionFilter] = useState<string>('ALL')
  const [formatFilter, setFormatFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  // Modal / Drawer state
  const [editingPaper, setEditingPaper] = useState<PaperItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editSubjectName, setEditSubjectName] = useState('')
  const [editSubjectCode, setEditSubjectCode] = useState('')
  const [editSection, setEditSection] = useState<SectionType>('regular_pyq')
  const [editExamType, setEditExamType] = useState('MST1')
  const [editExamYear, setEditExamYear] = useState<number>(2026)
  const [editSemester, setEditSemester] = useState<number>(1)
  const [editFormat, setEditFormat] = useState<'file' | 'gdrive' | 'youtube'>('file')
  const [editExternalUrl, setEditExternalUrl] = useState('')
  const [editChannelName, setEditChannelName] = useState('')
  const [editUnit, setEditUnit] = useState<string>('')
  const [editStatus, setEditStatus] = useState<string>('approved')
  const [editAdminNote, setEditAdminNote] = useState('')
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
        p.original_filename?.toLowerCase().includes(term) ||
        p.subjects?.name?.toLowerCase().includes(term) ||
        p.subjects?.code?.toLowerCase().includes(term) ||
        p.users?.name?.toLowerCase().includes(term) ||
        p.users?.username?.toLowerCase().includes(term) ||
        p.channel_name?.toLowerCase().includes(term) ||
        String(p.exam_year || '').includes(term)

      const matchesSem = semFilter === 'ALL' || String(p.subjects?.semester) === semFilter
      const sectionInfo = getSectionMeta(p.exam_types?.name)
      const matchesSection = sectionFilter === 'ALL' || sectionInfo.section === sectionFilter

      const currentFormat = p.resource_format || 'file'
      const matchesFormat = formatFilter === 'ALL' || currentFormat === formatFilter

      const matchesStatus = statusFilter === 'ALL' || p.status?.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesSem && matchesSection && matchesFormat && matchesStatus
    })
  }, [papers, searchQuery, semFilter, sectionFilter, formatFilter, statusFilter])

  // Handlers
  const handleVerify = async (paperId: string) => {
    setActionLoading(true)
    const res = await approveResource(paperId)
    if (res.success) {
      setPapers(prev => prev.map(p => (p.id === paperId ? { ...p, status: 'approved' } : p)))
    } else {
      alert(res.error || 'Failed to approve resource')
    }
    setActionLoading(false)
  }

  const handleRevokeToPending = async (paperId: string) => {
    const reason = prompt('Optional reason for returning this resource to the pending moderation queue:')
    setActionLoading(true)
    const res = await revokeResourceApproval(paperId, reason || undefined)
    if (res.success) {
      setPapers(prev =>
        prev.map(p =>
          p.id === paperId
            ? { ...p, status: 'pending', admin_note: reason || 'Approval revoked by admin.' }
            : p
        )
      )
      if (editingPaper?.id === paperId) {
        setEditingPaper(null)
      }
    } else {
      alert(res.error || 'Failed to revoke approval')
    }
    setActionLoading(false)
  }

  const handleReject = async (paperId: string) => {
    const reason = prompt('Please enter the reason for rejection:')
    if (!reason) return
    setActionLoading(true)
    const res = await rejectResource(paperId, reason)
    if (res.success) {
      setPapers(prev => prev.map(p => (p.id === paperId ? { ...p, status: 'rejected', admin_note: reason } : p)))
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
    setEditTitle(paper.original_filename || '')
    setEditSubjectName(paper.subjects?.name || '')
    setEditSubjectCode(paper.subjects?.code || '')

    const sec = getSectionMeta(paper.exam_types?.name)
    setEditSection(sec.section)
    setEditExamType(paper.exam_types?.name || 'MST1')
    setEditExamYear(paper.exam_year || 2026)
    setEditSemester(paper.subjects?.semester || 1)

    const format = (paper.resource_format as 'file' | 'gdrive' | 'youtube') || 'file'
    setEditFormat(format)
    setEditExternalUrl(paper.external_url || '')
    setEditChannelName(paper.channel_name || '')
    setEditUnit(paper.unit || '')
    setEditStatus(paper.status || 'approved')
    setEditAdminNote(paper.admin_note || '')
  }

  const handleSaveEdit = async () => {
    if (!editingPaper) return
    setIsSavingEdit(true)

    const payload: Parameters<typeof updateResourceDetails>[0] = {
      id: editingPaper.id,
      title: editTitle,
      subject_name: editSubjectName,
      subject_code: editSubjectCode,
      exam_type: editExamType,
      exam_year: Number(editExamYear),
      semester: Number(editSemester),
      year: Math.ceil(Number(editSemester) / 2),
      unit: editUnit ? editUnit : null,
      status: editStatus as any,
      admin_note: editAdminNote ? editAdminNote : null
    }

    if (editFormat !== 'file') {
      payload.resource_format = editFormat
      if (editExternalUrl.trim()) payload.external_url = editExternalUrl.trim()
      if (editFormat === 'youtube' && editChannelName.trim()) {
        payload.channel_name = editChannelName.trim()
      }
    }

    const res = await updateResourceDetails(payload)

    if (res.success) {
      setPapers(prev =>
        prev.map(p =>
          p.id === editingPaper.id
            ? {
                ...p,
                original_filename: editTitle,
                exam_year: Number(editExamYear),
                status: editStatus,
                unit: editUnit || null,
                resource_format: editFormat,
                external_url: editFormat !== 'file' ? editExternalUrl : null,
                channel_name: editFormat === 'youtube' ? editChannelName : null,
                admin_note: editAdminNote || null,
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
      alert(res.error || 'Failed to update resource')
    }
    setIsSavingEdit(false)
  }

  // Columns definition
  const columns: Column<PaperItem>[] = [
    {
      key: 'subject',
      header: 'Resource & Subject',
      sortable: true,
      render: p => {
        const sec = getSectionMeta(p.exam_types?.name)
        const fmt = getFormatMeta(p.resource_format)
        const FormatIcon = fmt.icon

        return (
          <div className="space-y-1 py-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${sec.badgeClass}`}
              >
                {sec.label}
              </span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium border flex items-center gap-1 ${fmt.badgeClass}`}
              >
                <FormatIcon className="w-3 h-3" />
                {fmt.label}
              </span>
              {p.unit && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {p.unit}
                </span>
              )}
            </div>

            <div className="font-bold text-prevu-text text-xs leading-snug">
              {getCleanResourceCardTitle(p)}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-prevu-text-muted">
              <span className="font-semibold text-zinc-300">{p.subjects?.name || 'Subject'}</span>
              <span>•</span>
              <span className="font-mono text-purple-400 font-medium">
                {p.subjects?.code || 'CSE'}
              </span>
            </div>
          </div>
        )
      }
    },
    {
      key: 'exam_type',
      header: 'Category / Format',
      sortable: true,
      render: p => (
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20 block w-max">
            {p.exam_types?.name || 'MST'}
          </span>
          {p.channel_name && (
            <div className="text-[10px] text-red-400 font-medium truncate max-w-[140px] flex items-center gap-1">
              <YouTubeIcon className="w-3 h-3 shrink-0" />
              <span>{p.channel_name}</span>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'semester',
      header: 'Sem & Year',
      sortable: true,
      render: p => (
        <span className="font-mono text-prevu-text-muted text-xs">
          Sem {p.subjects?.semester || 1} • {p.exam_year}
        </span>
      )
    },
    {
      key: 'uploaded_by',
      header: 'Uploaded By',
      render: p => (
        <div className="space-y-0.5">
          <span className="text-prevu-text text-xs truncate max-w-[120px] block font-medium">
            @{p.users?.username || p.users?.name || 'student'}
          </span>
          {p.users?.cu_verified ? (
            <span className="text-[10px] text-emerald-400 font-medium">✓ CU Verified</span>
          ) : (
            <span className="text-[10px] text-zinc-500">Unverified</span>
          )}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: p => (
        <div className="space-y-1">
          <StatusBadge status={p.status} />
          {p.admin_note && (
            <span
              className="text-[10px] text-zinc-400 block truncate max-w-[140px]"
              title={p.admin_note}
            >
              Note: {p.admin_note}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: p => (
        <span className="font-mono text-prevu-text-muted text-[11px]">
          {p.created_at
            ? new Date(p.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              })
            : '—'}
        </span>
      )
    },
    {
      key: 'actions',
      header: <span className="text-right block">Actions</span>,
      className: 'text-right',
      render: p => {
        const isExternal =
          (p.resource_format === 'youtube' || p.resource_format === 'gdrive') && p.external_url

        return (
          <div className="flex items-center justify-end gap-1">
            {/* Preview or External Link */}
            {isExternal ? (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light rounded-lg"
                title={`Open Link (${p.resource_format})`}
                asChild
              >
                <a href={p.external_url!} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
                </a>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light rounded-lg"
                title="Preview File"
                asChild
              >
                <a href={`/api/preview/${p.id}`} target="_blank" rel="noopener noreferrer">
                  <Eye className="w-3.5 h-3.5" />
                </a>
              </Button>
            )}

            {/* Quick Edit Details */}
            <button
              onClick={() => openEditDrawer(p)}
              className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-purple-300 hover:bg-purple-500/10 flex items-center justify-center transition-colors"
              title="Edit Details & Re-route"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>

            {/* If approved: Move back to Pending (Mistaken Approval recovery) */}
            {p.status === 'approved' && (
              <button
                onClick={() => handleRevokeToPending(p.id)}
                disabled={actionLoading}
                className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-amber-400 hover:bg-amber-500/10 flex items-center justify-center transition-colors"
                title="Revoke approval & Move back to Pending"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Verify (if not approved) */}
            {p.status !== 'approved' && (
              <button
                onClick={() => handleVerify(p.id)}
                disabled={actionLoading}
                className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-emerald-400 hover:bg-emerald-500/10 flex items-center justify-center transition-colors"
                title="Approve / Publish"
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
                title="Reject Submission"
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
                title="Archive Resource"
              >
                <Archive className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Delete */}
            <button
              onClick={() => setConfirmDeletePaper(p)}
              disabled={actionLoading}
              className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
              title="Delete Resource Permanently"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      }
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight flex items-center gap-2">
            <span>Academic Vault Repository</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {papers.length} Resources
            </span>
          </h1>
          <p className="text-xs text-prevu-text-muted mt-1">
            Comprehensive repository manager for Regular PYQs, Study Material, Reappear Hub items,
            Cloud Drives, and YouTube lectures. Edit details, revoke mistaken approvals, and re-route
            submissions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm"
            asChild
          >
            <a href="/upload">+ Add Resource</a>
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
              placeholder="Search by title, subject name, course code (e.g. 23CST), uploader, or channel..."
              className="w-full pl-10 pr-4 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          {/* Filter Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Section Filter */}
            <select
              value={sectionFilter}
              onChange={e => setSectionFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer font-medium"
            >
              <option value="ALL">All Sections</option>
              <option value="regular_pyq">🟢 Regular PYQs</option>
              <option value="study_material">🔵 Study Material & Notes</option>
              <option value="reappear">🟡 Reappear Hub</option>
            </select>

            {/* Format Filter */}
            <select
              value={formatFilter}
              onChange={e => setFormatFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="ALL">All Formats</option>
              <option value="file">📄 File / PDF</option>
              <option value="gdrive">📁 Google Drive</option>
              <option value="youtube">▶️ YouTube Lecture</option>
            </select>

            {/* Semester Filter */}
            <select
              value={semFilter}
              onChange={e => setSemFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={String(s)}>
                  Semester {s}
                </option>
              ))}
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
        emptyTitle="No resources found"
        emptyDescription="No resources match your search query or active filter settings."
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

      {/* Comprehensive Edit & Direction Detail Drawer */}
      <DetailDrawer
        isOpen={!!editingPaper}
        title="Edit Resource & Route Direction"
        subtitle={`Resource ID: ${editingPaper?.id}`}
        onClose={() => setEditingPaper(null)}
        footer={
          <div className="flex items-center justify-between w-full">
            <div>
              {editingPaper?.status === 'approved' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => editingPaper && handleRevokeToPending(editingPaper.id)}
                  disabled={isSavingEdit || actionLoading}
                  className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Move Back to Pending</span>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
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
                className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold px-4"
              >
                {isSavingEdit ? 'Saving...' : 'Save & Update Details'}
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-5 text-xs">
          {/* Section Router (The Direction) */}
          <div className="p-3.5 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light space-y-2">
            <label className="block text-[11px] font-bold text-prevu-text uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Section (Give Perfect Direction)</span>
            </label>
            <p className="text-[11px] text-prevu-text-muted">
              Choose the exact section where students can access this submission:
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setEditSection('regular_pyq')
                  if (!SECTION_CATEGORIES.regular_pyq.includes(editExamType)) {
                    setEditExamType('MST1')
                  }
                }}
                className={`py-2 px-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  editSection === 'regular_pyq'
                    ? 'bg-emerald-500/15 border-emerald-500 text-emerald-300 shadow-sm'
                    : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:border-zinc-500'
                }`}
              >
                <span className="font-bold text-xs flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> Regular PYQ
                </span>
                <span className="text-[10px] text-zinc-400">Past MST/EST exam papers</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditSection('study_material')
                  if (!SECTION_CATEGORIES.study_material.includes(editExamType)) {
                    setEditExamType('Notes')
                  }
                }}
                className={`py-2 px-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  editSection === 'study_material'
                    ? 'bg-blue-500/15 border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:border-zinc-500'
                }`}
              >
                <span className="font-bold text-xs flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Study Material
                </span>
                <span className="text-[10px] text-zinc-400">Notes, Books, Question Banks</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditSection('reappear')
                  if (!SECTION_CATEGORIES.reappear.includes(editExamType)) {
                    setEditExamType('80/20 High-Yield Notes')
                  }
                }}
                className={`py-2 px-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                  editSection === 'reappear'
                    ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-sm'
                    : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:border-zinc-500'
                }`}
              >
                <span className="font-bold text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Reappear Hub
                </span>
                <span className="text-[10px] text-zinc-400">High-yield backlog rescue</span>
              </button>
            </div>
          </div>

          {/* Title / Resource Name */}
          <div>
            <label className="block text-prevu-text-muted font-medium mb-1.5">
              Resource Title / Name
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={e => setEditTitle(e.target.value)}
              placeholder="e.g. MST1 Operating Systems Question Paper 2025"
              className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Exam Type / Category Selection */}
          <div className="space-y-1.5">
            <label className="block text-prevu-text-muted font-medium">Category / Exam Type</label>
            <div className="flex flex-wrap gap-1.5">
              {SECTION_CATEGORIES[editSection].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setEditExamType(cat)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium border transition-colors ${
                    editExamType === cat
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-prevu-bg border-prevu-surface-light text-prevu-text hover:border-zinc-500'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="pt-1">
              <input
                type="text"
                value={editExamType}
                onChange={e => setEditExamType(e.target.value)}
                placeholder="Or custom category name..."
                className="w-full px-3 py-1.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Format & Links */}
          <div className="p-3.5 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light space-y-3">
            <label className="block text-[11px] font-bold text-prevu-text uppercase tracking-wider">
              Contribution Format
            </label>

            <div className="flex items-center gap-2">
              {[
                { id: 'file', label: 'File Upload', icon: FileText },
                { id: 'gdrive', label: 'Google Drive', icon: FolderGit2 },
                { id: 'youtube', label: 'YouTube Video/Playlist', icon: YouTubeIcon }
              ].map(fmt => {
                const Icon = fmt.icon
                const active = editFormat === fmt.id
                return (
                  <button
                    key={fmt.id}
                    type="button"
                    onClick={() => setEditFormat(fmt.id as any)}
                    className={`flex-1 py-1.5 px-2 rounded-xl border text-xs flex items-center justify-center gap-1.5 transition-colors ${
                      active
                        ? 'bg-purple-500/20 border-purple-500 text-purple-300 font-semibold'
                        : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{fmt.label}</span>
                  </button>
                )
              })}
            </div>

            {editFormat !== 'file' && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-prevu-text-muted font-medium text-[11px]">
                  {editFormat === 'youtube' ? 'YouTube URL' : 'Cloud Drive Share Link'}
                </label>
                <input
                  type="url"
                  value={editExternalUrl}
                  onChange={e => setEditExternalUrl(e.target.value)}
                  placeholder={
                    editFormat === 'youtube'
                      ? 'https://www.youtube.com/watch?v=... or playlist?list=...'
                      : 'https://drive.google.com/drive/folders/...'
                  }
                  className="w-full px-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-xl text-prevu-text font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {editFormat === 'youtube' && (
              <div className="space-y-1.5 pt-1">
                <label className="block text-prevu-text-muted font-medium text-[11px]">
                  Channel / Educator Name
                </label>
                <input
                  type="text"
                  value={editChannelName}
                  onChange={e => setEditChannelName(e.target.value)}
                  placeholder="e.g. Gate Smashers, Neso Academy"
                  className="w-full px-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-xl text-prevu-text text-xs focus:outline-none focus:border-purple-500"
                />
                <div className="flex flex-wrap gap-1 pt-1">
                  {COMMON_CHANNELS.map(ch => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setEditChannelName(ch)}
                      className="px-2 py-0.5 rounded text-[10px] bg-prevu-surface border border-prevu-surface-light text-zinc-400 hover:text-zinc-200"
                    >
                      {ch}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Unit Coverage */}
          <div>
            <label className="block text-prevu-text-muted font-medium mb-1.5">
              Unit Coverage (Optional)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['', 'All Units', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'].map(u => (
                <button
                  key={u || 'none'}
                  type="button"
                  onClick={() => setEditUnit(u)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-colors border ${
                    editUnit === u
                      ? 'bg-purple-600 text-white border-purple-500'
                      : 'bg-prevu-bg border-prevu-surface-light text-prevu-text hover:border-zinc-500'
                  }`}
                >
                  {u || 'None / Not Applicable'}
                </button>
              ))}
            </div>
          </div>

          {/* Subject Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-prevu-text-muted font-medium mb-1.5">Subject Name</label>
              <input
                type="text"
                value={editSubjectName}
                onChange={e => setEditSubjectName(e.target.value)}
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-prevu-text-muted font-medium mb-1.5">Course Code</label>
              <input
                type="text"
                value={editSubjectCode}
                onChange={e => setEditSubjectCode(e.target.value)}
                placeholder="23CST-302"
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Semester & Exam Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-prevu-text-muted font-medium mb-1.5">Semester</label>
              <select
                value={editSemester}
                onChange={e => setEditSemester(Number(e.target.value))}
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-prevu-text-muted font-medium mb-1.5">Exam Year</label>
              <input
                type="number"
                value={editExamYear}
                onChange={e => setEditExamYear(Number(e.target.value))}
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text font-mono focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Status & Feedback Note */}
          <div className="p-3.5 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-prevu-text uppercase tracking-wider mb-1.5">
                Publication Status
              </label>
              <select
                value={editStatus}
                onChange={e => setEditStatus(e.target.value)}
                className="w-full px-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text font-semibold focus:outline-none focus:border-purple-500"
              >
                <option value="approved">Approved & Live in Vault</option>
                <option value="pending">Pending Moderation Review</option>
                <option value="rejected">Rejected</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-prevu-text-muted font-medium text-[11px] mb-1">
                Admin Note / Audit Feedback
              </label>
              <input
                type="text"
                value={editAdminNote}
                onChange={e => setEditAdminNote(e.target.value)}
                placeholder="Reason or notes regarding this status change..."
                className="w-full px-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {editingPaper && editingPaper.file_path && (
            <div className="pt-2 space-y-2">
              <span className="font-semibold text-prevu-text block">File Reference</span>
              <div className="p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-[11px] text-prevu-text-muted font-mono truncate">
                {editingPaper.file_path}
              </div>
            </div>
          )}
        </div>
      </DetailDrawer>

      {/* Delete Single Resource Confirmation */}
      <ConfirmDialog
        isOpen={!!confirmDeletePaper}
        title="Permanently Delete Resource?"
        description={`Are you sure you want to permanently delete "${
          confirmDeletePaper?.original_filename || confirmDeletePaper?.subjects?.name || 'this resource'
        }"? If it has a file stored in Supabase, the file will be removed. This action cannot be undone.`}
        confirmText="Delete Resource"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDeletePaper(null)}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmDialog
        isOpen={isBulkDeleting}
        title={`Permanently Delete ${selectedIds.length} Selected Resources?`}
        description={`This will permanently remove ${selectedIds.length} resource files and their database records from Prevu. This action cannot be reversed.`}
        confirmText="Confirm Bulk Deletion"
        variant="danger"
        isLoading={actionLoading}
        onConfirm={handleBulkDeleteConfirmed}
        onCancel={() => setIsBulkDeleting(false)}
      />
    </div>
  )
}
