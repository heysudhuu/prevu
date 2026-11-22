'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  XCircle,
  Eye,
  Edit3,
  User,
  AlertTriangle,
  Upload,
  FileText,
  FolderGit2,
  ExternalLink,
  Layers,
  Sparkles,
  BookOpen,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { approveResource, rejectResource, updateResourceDetails } from '../actions'

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

interface PendingResource {
  id: string
  file_path: string
  file_type: string
  original_filename: string
  exam_year: number
  status: string
  created_at: string
  previewUrl?: string | null
  unit?: string | null
  resource_format?: 'file' | 'gdrive' | 'youtube' | 'external_link' | null
  external_url?: string | null
  channel_name?: string | null
  youtube_id?: string | null
  subjects?: {
    id: number
    name: string
    code: string
    semester: number
    year: number
  }
  exam_types?: {
    id: number
    name: string
  }
  users?: {
    id: string
    name: string
    username?: string
    email?: string
    cu_verified?: boolean
  }
}

interface ModerationClientProps {
  initialResources: PendingResource[]
}

type SectionType = 'regular_pyq' | 'study_material' | 'reappear'

function getSectionMeta(examTypeName?: string | null): {
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

function getFormatMeta(format?: string | null) {
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

const COMMON_REJECTION_REASONS = [
  'Blurry or unreadable paper scan',
  'Incomplete question paper (pages missing)',
  'Incorrect course code or subject assignment',
  'Duplicate submission already in vault',
  'Broken or restricted Google Drive link (Access Denied)',
  'Irrelevant or low-quality YouTube video',
  'Copyright or inappropriate content'
]

export default function ModerationClient({ initialResources }: ModerationClientProps) {
  const [resources, setResources] = useState<PendingResource[]>(initialResources)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Edit fields
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

  // Rejection modal
  const [rejectingItem, setRejectingItem] = useState<PendingResource | null>(null)
  const [customReason, setCustomReason] = useState('')
  const [selectedQuickReason, setSelectedQuickReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleStartEdit = (resource: PendingResource) => {
    setEditingId(resource.id)
    setEditTitle(resource.original_filename || '')
    setEditSubjectName(resource.subjects?.name || '')
    setEditSubjectCode(resource.subjects?.code || '')

    const sec = getSectionMeta(resource.exam_types?.name)
    setEditSection(sec.section)
    setEditExamType(resource.exam_types?.name || 'MST1')
    setEditExamYear(resource.exam_year || 2026)
    setEditSemester(resource.subjects?.semester || 1)

    const fmt = (resource.resource_format as 'file' | 'gdrive' | 'youtube') || 'file'
    setEditFormat(fmt)
    setEditExternalUrl(resource.external_url || '')
    setEditChannelName(resource.channel_name || '')
    setEditUnit(resource.unit || '')
  }

  const handleApprove = async (resource: PendingResource) => {
    setActionLoading(true)
    const isEditing = editingId === resource.id

    let res: { success?: boolean; error?: string }

    if (isEditing) {
      const payload: Parameters<typeof updateResourceDetails>[0] = {
        id: resource.id,
        title: editTitle,
        subject_name: editSubjectName,
        subject_code: editSubjectCode,
        exam_type: editExamType,
        exam_year: Number(editExamYear),
        semester: Number(editSemester),
        year: Math.ceil(Number(editSemester) / 2),
        unit: editUnit ? editUnit : null,
        status: 'approved'
      }

      if (editFormat !== 'file') {
        payload.resource_format = editFormat
        if (editExternalUrl.trim()) payload.external_url = editExternalUrl.trim()
        if (editFormat === 'youtube' && editChannelName.trim()) {
          payload.channel_name = editChannelName.trim()
        }
      }

      res = await updateResourceDetails(payload)
    } else {
      res = await approveResource(resource.id)
    }

    if (res.success) {
      setResources(prev => prev.filter(r => r.id !== resource.id))
      setEditingId(null)
    } else {
      alert(res.error || 'Failed to approve resource')
    }
    setActionLoading(false)
  }

  const handleRejectConfirm = async () => {
    if (!rejectingItem) return
    const finalReason = customReason.trim() || selectedQuickReason
    if (!finalReason) {
      alert('Please specify a reason for rejection.')
      return
    }

    setActionLoading(true)
    const res = await rejectResource(rejectingItem.id, finalReason)
    if (res.success) {
      setResources(prev => prev.filter(r => r.id !== rejectingItem.id))
      setRejectingItem(null)
      setCustomReason('')
      setSelectedQuickReason('')
    } else {
      alert(res.error || 'Failed to reject resource')
    }
    setActionLoading(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              Submission Moderation Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {resources.length} Pending
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Review uploads across Regular PYQs, Study Materials, and Reappear Hub. Direct resources
            to the right section, verify content, and publish or reject with helpful feedback.
          </p>
        </div>

        <Button
          size="sm"
          className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm"
          asChild
        >
          <Link href="/upload">
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            Upload as Admin
          </Link>
        </Button>
      </div>

      {/* Review Queue Items */}
      {resources.length === 0 ? (
        <div className="rounded-3xl border border-prevu-surface-light bg-gradient-to-r from-prevu-surface via-prevu-surface/90 to-prevu-surface p-8 sm:p-12 text-center space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-lg font-bold text-prevu-text">Queue is 100% Up to Date</h3>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              All student submissions have been reviewed and published to the live repository. New
              uploads will appear here immediately.
            </p>
          </div>
          <div className="pt-2">
            <Button size="sm" variant="outline" className="border-prevu-surface-light text-xs" asChild>
              <Link href="/admin/papers">Browse Live Archive →</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {resources.map(resource => {
            const isEditing = editingId === resource.id
            const sec = getSectionMeta(resource.exam_types?.name)
            const fmt = getFormatMeta(resource.resource_format)
            const FormatIcon = fmt.icon
            const isExternal =
              (resource.resource_format === 'youtube' || resource.resource_format === 'gdrive') &&
              resource.external_url

            return (
              <div
                key={resource.id}
                className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/80 p-5 shadow-xl space-y-4 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-200"
              >
                {/* Top Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
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
                      {resource.unit && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {resource.unit}
                        </span>
                      )}
                    </div>

                    <span className="text-[11px] font-mono text-prevu-text-muted">
                      {resource.created_at
                        ? new Date(resource.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'Recent'}
                    </span>
                  </div>

                  {isEditing ? (
                    /* Inline Editing & Section Direction Mode */
                    <div className="space-y-3 p-3.5 rounded-xl bg-prevu-bg/95 border border-purple-500/40 text-xs">
                      <div className="font-semibold text-purple-300 text-xs flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <Edit3 className="w-3.5 h-3.5" /> Re-Route & Edit Metadata
                        </span>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-[11px] text-zinc-400 hover:text-white underline"
                        >
                          Cancel
                        </button>
                      </div>

                      {/* Direction / Target Section Selector */}
                      <div className="space-y-1">
                        <label className="text-[10px] text-prevu-text-muted uppercase font-bold block">
                          Give Perfect Direction / Section
                        </label>
                        <div className="grid grid-cols-3 gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditSection('regular_pyq')
                              if (!SECTION_CATEGORIES.regular_pyq.includes(editExamType)) {
                                setEditExamType('MST1')
                              }
                            }}
                            className={`py-1.5 px-2 rounded-lg border text-center text-[11px] font-medium transition-colors ${
                              editSection === 'regular_pyq'
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                                : 'bg-prevu-surface border-prevu-surface-light text-zinc-400'
                            }`}
                          >
                            Regular PYQ
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditSection('study_material')
                              if (!SECTION_CATEGORIES.study_material.includes(editExamType)) {
                                setEditExamType('Notes')
                              }
                            }}
                            className={`py-1.5 px-2 rounded-lg border text-center text-[11px] font-medium transition-colors ${
                              editSection === 'study_material'
                                ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                                : 'bg-prevu-surface border-prevu-surface-light text-zinc-400'
                            }`}
                          >
                            Study Material
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditSection('reappear')
                              if (!SECTION_CATEGORIES.reappear.includes(editExamType)) {
                                setEditExamType('80/20 High-Yield Notes')
                              }
                            }}
                            className={`py-1.5 px-2 rounded-lg border text-center text-[11px] font-medium transition-colors ${
                              editSection === 'reappear'
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-prevu-surface border-prevu-surface-light text-zinc-400'
                            }`}
                          >
                            Reappear Hub
                          </button>
                        </div>
                      </div>

                      {/* Resource Title */}
                      <div>
                        <label className="text-[10px] text-prevu-text-muted block mb-1">
                          Resource Title / Filename
                        </label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-prevu-text"
                        />
                      </div>

                      {/* Category Selection */}
                      <div>
                        <label className="text-[10px] text-prevu-text-muted block mb-1">
                          Category / Exam Format
                        </label>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {SECTION_CATEGORIES[editSection].map(cat => (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setEditExamType(cat)}
                              className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                                editExamType === cat
                                  ? 'bg-purple-600 text-white border-purple-500'
                                  : 'bg-prevu-surface border-prevu-surface-light text-zinc-400'
                              }`}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={editExamType}
                          onChange={e => setEditExamType(e.target.value)}
                          placeholder="Or type custom category..."
                          className="w-full px-2.5 py-1 bg-prevu-surface border border-prevu-surface-light rounded-lg text-[11px] text-prevu-text font-mono"
                        />
                      </div>

                      {/* Format, Link, Channel */}
                      <div className="p-2 rounded-lg bg-prevu-surface/60 border border-prevu-surface-light space-y-1.5">
                        <div className="flex items-center gap-1.5">
                          {(['file', 'gdrive', 'youtube'] as const).map(f => (
                            <button
                              key={f}
                              type="button"
                              onClick={() => setEditFormat(f)}
                              className={`flex-1 py-1 text-[10px] rounded border font-mono ${
                                editFormat === f
                                  ? 'bg-purple-600/30 text-purple-200 border-purple-500'
                                  : 'bg-prevu-bg border-prevu-surface-light text-zinc-400'
                              }`}
                            >
                              {f === 'file' ? 'PDF File' : f === 'gdrive' ? 'GDrive' : 'YouTube'}
                            </button>
                          ))}
                        </div>

                        {editFormat !== 'file' && (
                          <input
                            type="url"
                            value={editExternalUrl}
                            onChange={e => setEditExternalUrl(e.target.value)}
                            placeholder={
                              editFormat === 'youtube'
                                ? 'https://www.youtube.com/watch?v=...'
                                : 'https://drive.google.com/...'
                            }
                            className="w-full px-2 py-1 bg-prevu-surface border border-prevu-surface-light rounded text-[10px] font-mono text-prevu-text"
                          />
                        )}

                        {editFormat === 'youtube' && (
                          <input
                            type="text"
                            value={editChannelName}
                            onChange={e => setEditChannelName(e.target.value)}
                            placeholder="Channel Name (e.g. Gate Smashers)"
                            className="w-full px-2 py-1 bg-prevu-surface border border-prevu-surface-light rounded text-[10px] text-prevu-text"
                          />
                        )}
                      </div>

                      {/* Subject & Code */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">
                            Subject Name
                          </label>
                          <input
                            type="text"
                            value={editSubjectName}
                            onChange={e => setEditSubjectName(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-prevu-text"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">
                            Course Code
                          </label>
                          <input
                            type="text"
                            value={editSubjectCode}
                            onChange={e => setEditSubjectCode(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs font-mono text-prevu-text"
                          />
                        </div>
                      </div>

                      {/* Semester, Year, Unit */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">
                            Semester
                          </label>
                          <select
                            value={editSemester}
                            onChange={e => setEditSemester(Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-prevu-text"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                              <option key={s} value={s}>
                                Sem {s}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">
                            Exam Year
                          </label>
                          <input
                            type="number"
                            value={editExamYear}
                            onChange={e => setEditExamYear(Number(e.target.value))}
                            className="w-full px-2 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs font-mono text-prevu-text"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">Unit</label>
                          <select
                            value={editUnit}
                            onChange={e => setEditUnit(e.target.value)}
                            className="w-full px-2 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-prevu-text"
                          >
                            <option value="">None</option>
                            <option value="All Units">All Units</option>
                            <option value="Unit 1">Unit 1</option>
                            <option value="Unit 2">Unit 2</option>
                            <option value="Unit 3">Unit 3</option>
                            <option value="Unit 4">Unit 4</option>
                            <option value="Unit 5">Unit 5</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-prevu-text leading-snug">
                            {resource.original_filename || resource.subjects?.name || 'Untitled Resource'}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                              {resource.subjects?.code || 'CSE'}
                            </span>
                            <span className="text-xs font-semibold text-zinc-300">
                              {resource.subjects?.name}
                            </span>
                            <span className="text-xs font-mono text-prevu-text-muted">
                              • Sem {resource.subjects?.semester || 1} • {resource.exam_types?.name || 'MST'} • {resource.exam_year}
                            </span>
                          </div>

                          {resource.channel_name && (
                            <div className="text-xs text-red-400 font-medium flex items-center gap-1.5 mt-1">
                              <YouTubeIcon className="w-3.5 h-3.5" />
                              <span>Channel: {resource.channel_name}</span>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleStartEdit(resource)}
                          className="p-1.5 rounded-lg text-prevu-text-muted hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                          title="Edit details & re-route section before approving"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Uploader Meta */}
                  <div className="pt-2 border-t border-prevu-surface-light/80 flex items-center justify-between text-xs text-prevu-text-muted">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-purple-400" />
                      <span>@{resource.users?.username || resource.users?.name || 'student'}</span>
                      {resource.users?.cu_verified && (
                        <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          ✓ CU
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono truncate max-w-[150px]">
                      {resource.file_type || resource.resource_format || 'resource'}
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-prevu-surface-light flex items-center justify-between gap-2">
                  {isExternal ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs border-prevu-surface-light text-blue-400 hover:text-blue-300 rounded-xl flex items-center gap-1.5 bg-prevu-bg"
                      asChild
                    >
                      <a href={resource.external_url!} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open {fmt.label}</span>
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs border-prevu-surface-light text-prevu-text hover:text-white rounded-xl flex items-center gap-1.5 bg-prevu-bg"
                      asChild
                    >
                      <a href={`/api/preview/${resource.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview File</span>
                      </a>
                    </Button>
                  )}

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setRejectingItem(resource)
                        setSelectedQuickReason('')
                        setCustomReason('')
                      }}
                      disabled={actionLoading}
                      className="h-8 px-3 text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border-red-500/30 rounded-xl"
                    >
                      <XCircle className="w-3.5 h-3.5 mr-1" />
                      Reject
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleApprove(resource)}
                      disabled={actionLoading}
                      className="h-8 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-md shadow-emerald-600/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      {isEditing ? 'Save & Approve' : 'Approve & Publish'}
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setRejectingItem(null)}
          />

          <div className="relative w-full max-w-lg rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-2xl p-6 z-10 space-y-4">
            <div>
              <h3 className="text-base font-bold text-prevu-text">
                Reject Submission
              </h3>
              <p className="text-xs text-prevu-text-muted mt-1">
                Provide feedback to the student explaining why this submission cannot be approved.
              </p>
            </div>

            {/* Quick Reason Shortcuts */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-prevu-text-muted uppercase tracking-wider">
                Common Rejection Reasons
              </label>
              <div className="space-y-1.5">
                {COMMON_REJECTION_REASONS.map(reason => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => {
                      setSelectedQuickReason(reason)
                      setCustomReason('')
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors border ${
                      selectedQuickReason === reason
                        ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 font-medium'
                        : 'bg-prevu-bg border-prevu-surface-light text-prevu-text hover:bg-prevu-surface-light/40'
                    }`}
                  >
                    • {reason}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-prevu-text-muted uppercase tracking-wider">
                Custom or Additional Feedback
              </label>
              <textarea
                value={customReason}
                onChange={e => {
                  setCustomReason(e.target.value)
                  setSelectedQuickReason('')
                }}
                rows={3}
                placeholder="Write specific feedback for this submission..."
                className="w-full p-3 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRejectingItem(null)}
                className="border-prevu-surface-light text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRejectConfirm}
                disabled={actionLoading}
                className="bg-red-600 hover:bg-red-500 text-white font-semibold text-xs"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
