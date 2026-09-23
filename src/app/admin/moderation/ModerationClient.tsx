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
  Upload
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { approveResource, rejectResource } from '../actions'

interface PendingResource {
  id: string
  file_path: string
  file_type: string
  original_filename: string
  exam_year: number
  status: string
  created_at: string
  previewUrl?: string | null
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

const COMMON_REJECTION_REASONS = [
  'Blurry or unreadable paper scan',
  'Incomplete question paper (pages missing)',
  'Incorrect course code or subject assignment',
  'Duplicate submission already in vault',
  'Internal assessment / assignment instead of university question paper',
  'Copyright or inappropriate content'
]

export default function ModerationClient({ initialResources }: ModerationClientProps) {
  const [resources, setResources] = useState<PendingResource[]>(initialResources)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Edit fields
  const [editSubjectName, setEditSubjectName] = useState('')
  const [editSubjectCode, setEditSubjectCode] = useState('')
  const [editExamType, setEditExamType] = useState('MST1')
  const [editExamYear, setEditExamYear] = useState<number>(2026)
  const [editSemester, setEditSemester] = useState<number>(1)

  // Rejection modal
  const [rejectingItem, setRejectingItem] = useState<PendingResource | null>(null)
  const [customReason, setCustomReason] = useState('')
  const [selectedQuickReason, setSelectedQuickReason] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  const handleStartEdit = (resource: PendingResource) => {
    setEditingId(resource.id)
    setEditSubjectName(resource.subjects?.name || '')
    setEditSubjectCode(resource.subjects?.code || '')
    setEditExamType(resource.exam_types?.name || 'MST1')
    setEditExamYear(resource.exam_year || 2026)
    setEditSemester(resource.subjects?.semester || 1)
  }

  const handleApprove = async (resource: PendingResource) => {
    setActionLoading(true)
    const isEditing = editingId === resource.id
    const res = await approveResource(
      resource.id,
      isEditing
        ? {
            subject_name: editSubjectName,
            subject_code: editSubjectCode,
            exam_type: editExamType,
            exam_year: Number(editExamYear),
            semester: Number(editSemester)
          }
        : undefined
    )

    if (res.success) {
      setResources(prev => prev.filter(r => r.id !== resource.id))
      setEditingId(null)
    } else {
      alert(res.error || 'Failed to approve paper')
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
      alert(res.error || 'Failed to reject paper')
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
              Paper Moderation Queue
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              {resources.length} Pending
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Review student uploads, verify course code patterns, correct metadata, and approve or reject submissions.
          </p>
        </div>

        <Button size="sm" className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm" asChild>
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
              All student paper submissions have been reviewed and published to the live repository. New uploads will appear here immediately.
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

            return (
              <div
                key={resource.id}
                className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/80 p-5 shadow-xl space-y-4 flex flex-col justify-between hover:border-purple-500/30 transition-all duration-200"
              >
                {/* Top Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Under Review
                    </span>

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
                    /* Inline Editing Mode */
                    <div className="space-y-3 p-3 rounded-xl bg-prevu-bg/90 border border-purple-500/30 text-xs">
                      <div className="font-semibold text-purple-300 text-[11px]">
                        Correcting Metadata:
                      </div>

                      <div>
                        <label className="text-[10px] text-prevu-text-muted block mb-1">Subject Name</label>
                        <input
                          type="text"
                          value={editSubjectName}
                          onChange={e => setEditSubjectName(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-prevu-text"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">Course Code</label>
                          <input
                            type="text"
                            value={editSubjectCode}
                            onChange={e => setEditSubjectCode(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs font-mono text-prevu-text"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">Exam Type</label>
                          <select
                            value={editExamType}
                            onChange={e => setEditExamType(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-prevu-text"
                          >
                            <option value="MST1">MST1</option>
                            <option value="MST2">MST2</option>
                            <option value="EST">EST</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">Semester</label>
                          <select
                            value={editSemester}
                            onChange={e => setEditSemester(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-prevu-text"
                          >
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                              <option key={s} value={s}>Sem {s}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] text-prevu-text-muted block mb-1">Exam Year</label>
                          <input
                            type="number"
                            value={editExamYear}
                            onChange={e => setEditExamYear(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs font-mono text-prevu-text"
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setEditingId(null)}
                        className="text-[11px] text-prevu-text-muted hover:text-prevu-text underline"
                      >
                        Cancel Edits
                      </button>
                    </div>
                  ) : (
                    /* Display Mode */
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-bold text-prevu-text">
                            {resource.subjects?.name || 'Untitled Subject'}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-mono font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                              {resource.subjects?.code || 'CSE'}
                            </span>
                            <span className="text-xs font-mono text-prevu-text-muted">
                              Sem {resource.subjects?.semester || 1} • {resource.exam_types?.name || 'MST'} • {resource.exam_year}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleStartEdit(resource)}
                          className="p-1.5 rounded-lg text-prevu-text-muted hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                          title="Edit metadata before approving"
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
                      {resource.original_filename}
                    </span>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="pt-3 border-t border-prevu-surface-light flex items-center justify-between gap-2">
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
                      Approve & Publish
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
                Reject Question Paper Submission
              </h3>
              <p className="text-xs text-prevu-text-muted mt-1">
                Provide feedback to the student explaining why this paper cannot be published.
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
