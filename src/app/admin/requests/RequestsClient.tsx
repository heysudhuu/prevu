'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Upload,
  CheckCircle,
  XCircle,
  FileText,
  ExternalLink,
  Clock,
  Sparkles,
  Users,
  ShieldCheck,
  AlertCircle,
  Edit3,
  Trash2,
  Save,
  PenLine,
  Search,
  Check,
  Lightbulb,
  Layers,
  BookOpen
} from 'lucide-react'
import { DataTable, Column } from '@/components/admin/ui/DataTable'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { Button } from '@/components/ui/Button'
import { 
  updatePaperRequestStatus, 
  approveCommunityHelpSubmission, 
  rejectCommunityHelpSubmission,
  updatePaperRequestDetails,
  deletePaperRequest,
  updateCommunityHelpSubmissionDetails
} from '../actions'
import {
  reviewCbtQuestion,
  batchApproveCbtQuestionsAdmin,
  updateCbtQuestionDetailsAdmin
} from '@/lib/cbt/actions'

interface PaperRequestItem {
  id: number
  requested_by?: string
  subject_name: string
  exam_type: string
  exam_year: number
  semester: number
  request_type?: string
  title?: string
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

export interface CommunityHelpSubmissionItem {
  id: string
  request_id: number
  user_id: string
  response_type: string
  message?: string
  file_path?: string
  file_name?: string
  file_type?: string
  external_link?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_note?: string
  created_at: string
  users?: {
    id: string
    name: string
    username?: string
    email?: string
    cu_verified?: boolean
  }
  paper_requests?: {
    id: number
    subject_name: string
    exam_type: string
    exam_year: number
    semester: number
    request_type?: string
    note?: string
    status: string
    requested_by?: string
    users?: {
      id: string
      name: string
      username?: string
      email?: string
    }
  }
}

export interface CbtQuestionItem {
  id: number
  user_id?: string
  user_name?: string
  username?: string
  subject_code: string
  subject_name: string
  semester: number
  category?: string
  unit_tag?: string
  question: string
  question_type?: 'single' | 'multiple'
  options_json: Array<{ id: string; text: string }> | Record<string, string>
  correct_answers: string[]
  explanation?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_feedback?: string | null
  created_at: string
  users?: {
    id: string
    name: string
    username?: string
    cu_verified?: boolean
  }
}

interface RequestsClientProps {
  initialRequests: PaperRequestItem[]
  initialSubmissions?: CommunityHelpSubmissionItem[]
  initialCbtQuestions?: CbtQuestionItem[]
}

export default function RequestsClient({ 
  initialRequests,
  initialSubmissions = [],
  initialCbtQuestions = []
}: RequestsClientProps) {
  const [activeTab, setActiveTab] = useState<'submissions' | 'requests' | 'cbt'>('submissions')
  const [requests, setRequests] = useState<PaperRequestItem[]>(initialRequests)
  const [submissions, setSubmissions] = useState<CommunityHelpSubmissionItem[]>(initialSubmissions)
  const [cbtQuestions, setCbtQuestions] = useState<CbtQuestionItem[]>(initialCbtQuestions)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [submissionFilter, setSubmissionFilter] = useState<'pending' | 'approved' | 'rejected' | 'ALL'>('pending')
  const [cbtStatusFilter, setCbtStatusFilter] = useState<'pending' | 'approved' | 'rejected' | 'ALL'>('pending')
  const [cbtSubjectFilter, setCbtSubjectFilter] = useState('ALL')
  const [cbtSearchQuery, setCbtSearchQuery] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // CBT Question Rejection Modal state
  const [cbtRejectModalId, setCbtRejectModalId] = useState<number | null>(null)
  const [cbtRejectReason, setCbtRejectReason] = useState('')

  // CBT Question Edit Modal state
  const [cbtEditModalItem, setCbtEditModalItem] = useState<CbtQuestionItem | null>(null)
  const [cbtEditQuestion, setCbtEditQuestion] = useState('')
  const [cbtEditExplanation, setCbtEditExplanation] = useState('')
  const [cbtEditUnitTag, setCbtEditUnitTag] = useState('')
  const [cbtEditOptions, setCbtEditOptions] = useState<Array<{ id: string; text: string }>>([])
  const [cbtEditCorrectAnswers, setCbtEditCorrectAnswers] = useState<string[]>([])

  
  // Rejection modal state
  const [rejectModalId, setRejectModalId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  // Approve modal state (with customizable admin remark)
  const [approveModalSub, setApproveModalSub] = useState<CommunityHelpSubmissionItem | null>(null)
  const [approveAdminNote, setApproveAdminNote] = useState('Verified & Approved by Admin Department')

  // Submission Edit Modal state (allows editing subject, semester, student notes, admin remark)
  const [editSubModalItem, setEditSubModalItem] = useState<CommunityHelpSubmissionItem | null>(null)
  const [editSubSubject, setEditSubSubject] = useState('')
  const [editSubSemester, setEditSubSemester] = useState(1)
  const [editSubExamType, setEditSubExamType] = useState('MST')
  const [editSubExamYear, setEditSubExamYear] = useState(2025)
  const [editSubRequestType, setEditSubRequestType] = useState('pyq')
  const [editSubMessage, setEditSubMessage] = useState('')
  const [editSubAdminNote, setEditSubAdminNote] = useState('')

  // Request Edit Modal state (for editing requests in the requests tab)
  const [editReqItem, setEditReqItem] = useState<PaperRequestItem | null>(null)
  const [editReqSubject, setEditReqSubject] = useState('')
  const [editReqSemester, setEditReqSemester] = useState(1)
  const [editReqExamType, setEditReqExamType] = useState('MST')
  const [editReqExamYear, setEditReqExamYear] = useState(2025)
  const [editReqType, setEditReqType] = useState('pyq')
  const [editReqNote, setEditReqNote] = useState('')
  const [editReqStatus, setEditReqStatus] = useState('open')

  const pendingSubmissionsCount = useMemo(() => {
    return submissions.filter(s => s.status === 'pending').length
  }, [submissions])

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'ALL') return requests
    return requests.filter(r => r.status?.toLowerCase() === statusFilter.toLowerCase())
  }, [requests, statusFilter])

  const filteredSubmissions = useMemo(() => {
    if (submissionFilter === 'ALL') return submissions
    return submissions.filter(s => s.status === submissionFilter)
  }, [submissions, submissionFilter])

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

  // Open Approve Modal
  const openApproveModal = (sub: CommunityHelpSubmissionItem) => {
    setApproveModalSub(sub)
    setApproveAdminNote(sub.admin_note || 'Verified & Approved by Admin Department')
  }

  // Confirm Approve with custom remark
  const handleConfirmApprove = async () => {
    if (!approveModalSub) return

    setActionLoading(true)
    try {
      const res = await approveCommunityHelpSubmission(approveModalSub.id, approveAdminNote.trim())
      if (res.success) {
        setSubmissions(prev =>
          prev.map(s => (s.id === approveModalSub.id ? { ...s, status: 'approved', admin_note: approveAdminNote.trim() } : s))
        )
        if (approveModalSub.request_id) {
          setRequests(prev =>
            prev.map(r => (r.id === approveModalSub.request_id ? { ...r, status: 'fulfilled' } : r))
          )
        }
        setApproveModalSub(null)
        alert('Contribution approved and published successfully! Contributor and requester have been notified.')
      } else {
        alert(res.error || 'Failed to approve contribution')
      }
    } catch {
      alert('Error approving contribution')
    } finally {
      setActionLoading(false)
    }
  }

  // Rejection handler
  const handleRejectSubmission = async () => {
    if (!rejectModalId || !rejectReason.trim()) return

    setActionLoading(true)
    try {
      const res = await rejectCommunityHelpSubmission(rejectModalId, rejectReason.trim())
      if (res.success) {
        setSubmissions(prev =>
          prev.map(s => (s.id === rejectModalId ? { ...s, status: 'rejected', admin_note: rejectReason.trim() } : s))
        )
        setRejectModalId(null)
        setRejectReason('')
        alert('Contribution rejected. Feedback has been sent to the student.')
      } else {
        alert(res.error || 'Failed to reject contribution')
      }
    } catch {
      alert('Error rejecting contribution')
    } finally {
      setActionLoading(false)
    }
  }

  // Open Edit Submission Modal
  const openEditSubmissionModal = (sub: CommunityHelpSubmissionItem) => {
    setEditSubModalItem(sub)
    setEditSubSubject(sub.paper_requests?.subject_name || '')
    setEditSubSemester(sub.paper_requests?.semester || 1)
    setEditSubExamType(sub.paper_requests?.exam_type || 'MST')
    setEditSubExamYear(sub.paper_requests?.exam_year || 2025)
    setEditSubRequestType(sub.paper_requests?.request_type || sub.response_type || 'pyq')
    setEditSubMessage(sub.message || '')
    setEditSubAdminNote(sub.admin_note || '')
  }

  // Save Submission Edits (with optional immediate approval)
  const handleSaveSubmissionEdit = async (approveImmediately = false) => {
    if (!editSubModalItem) return

    if (!editSubSubject.trim()) {
      alert('Subject name cannot be empty.')
      return
    }

    setActionLoading(true)
    try {
      const res = await updateCommunityHelpSubmissionDetails({
        responseId: editSubModalItem.id,
        requestId: editSubModalItem.request_id,
        subject_name: editSubSubject.trim(),
        semester: Number(editSubSemester),
        exam_type: editSubExamType.trim(),
        exam_year: Number(editSubExamYear),
        request_type: editSubRequestType,
        message: editSubMessage.trim(),
        adminNote: editSubAdminNote.trim(),
        approveImmediately
      })

      if (res.success) {
        // Update local submissions
        setSubmissions(prev =>
          prev.map(s => {
            if (s.id === editSubModalItem.id) {
              return {
                ...s,
                status: approveImmediately ? 'approved' : s.status,
                message: editSubMessage.trim(),
                admin_note: editSubAdminNote.trim(),
                paper_requests: s.paper_requests ? {
                  ...s.paper_requests,
                  subject_name: editSubSubject.trim(),
                  semester: Number(editSubSemester),
                  exam_type: editSubExamType.trim(),
                  exam_year: Number(editSubExamYear),
                  request_type: editSubRequestType,
                  status: approveImmediately ? 'fulfilled' : s.paper_requests.status
                } : undefined
              }
            }
            return s
          })
        )

        // Update local requests
        setRequests(prev =>
          prev.map(r => {
            if (r.id === editSubModalItem.request_id) {
              return {
                ...r,
                subject_name: editSubSubject.trim(),
                semester: Number(editSubSemester),
                exam_type: editSubExamType.trim(),
                exam_year: Number(editSubExamYear),
                request_type: editSubRequestType,
                status: approveImmediately ? 'fulfilled' : r.status
              }
            }
            return r
          })
        )

        setEditSubModalItem(null)
        alert(approveImmediately 
          ? 'Changes saved & contribution approved and published successfully!' 
          : 'Submission details updated successfully!')
      } else {
        alert(res.error || 'Failed to update submission')
      }
    } catch {
      alert('Error updating submission')
    } finally {
      setActionLoading(false)
    }
  }

  // Open Edit Request Modal
  const openEditRequestModal = (req: PaperRequestItem) => {
    setEditReqItem(req)
    setEditReqSubject(req.subject_name || '')
    setEditReqSemester(req.semester || 1)
    setEditReqExamType(req.exam_type || 'MST')
    setEditReqExamYear(req.exam_year || 2025)
    setEditReqType(req.request_type || 'pyq')
    setEditReqNote(req.note || '')
    setEditReqStatus(req.status || 'open')
  }

  // Save Request Edit
  const handleSaveRequestEdit = async () => {
    if (!editReqItem) return
    if (!editReqSubject.trim()) {
      alert('Subject name is required')
      return
    }

    setActionLoading(true)
    try {
      const res = await updatePaperRequestDetails({
        requestId: editReqItem.id,
        subject_name: editReqSubject.trim(),
        semester: Number(editReqSemester),
        exam_type: editReqExamType.trim(),
        exam_year: Number(editReqExamYear),
        request_type: editReqType,
        note: editReqNote.trim(),
        status: editReqStatus
      })

      if (res.success) {
        setRequests(prev =>
          prev.map(r => {
            if (r.id === editReqItem.id) {
              return {
                ...r,
                subject_name: editReqSubject.trim(),
                semester: Number(editReqSemester),
                exam_type: editReqExamType.trim(),
                exam_year: Number(editReqExamYear),
                request_type: editReqType,
                note: editReqNote.trim(),
                status: editReqStatus
              }
            }
            return r
          })
        )

        // Also update any matching submission's parent request info
        setSubmissions(prev =>
          prev.map(s => {
            if (s.request_id === editReqItem.id && s.paper_requests) {
              return {
                ...s,
                paper_requests: {
                  ...s.paper_requests,
                  subject_name: editReqSubject.trim(),
                  semester: Number(editReqSemester),
                  exam_type: editReqExamType.trim(),
                  exam_year: Number(editReqExamYear),
                  request_type: editReqType,
                  note: editReqNote.trim(),
                  status: editReqStatus
                }
              }
            }
            return s
          })
        )

        setEditReqItem(null)
        alert('Request updated successfully!')
      } else {
        alert(res.error || 'Failed to update request')
      }
    } catch {
      alert('Error updating request')
    } finally {
      setActionLoading(false)
    }
  }

  // Delete Request
  const handleDeleteRequest = async (requestId: number) => {
    if (!confirm('Are you sure you want to delete this community request? All associated data will be removed.')) {
      return
    }

    setActionLoading(true)
    try {
      const res = await deletePaperRequest(requestId)
      if (res.success) {
        setRequests(prev => prev.filter(r => r.id !== requestId))
        setSubmissions(prev => prev.filter(s => s.request_id !== requestId))
        alert('Request deleted successfully.')
      } else {
        alert(res.error || 'Failed to delete request')
      }
    } catch {
      alert('Error deleting request')
    } finally {
      setActionLoading(false)
    }
  }

  // Read URL tab param on mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get('tab')
      if (tabParam === 'cbt') {
        setActiveTab('cbt')
      } else if (tabParam === 'requests') {
        setActiveTab('requests')
      } else if (tabParam === 'submissions') {
        setActiveTab('submissions')
      }
    }
  }, [])

  const pendingCbtCount = useMemo(() => {
    return cbtQuestions.filter(q => q.status === 'pending').length
  }, [cbtQuestions])

  const cbtSubjectsList = useMemo(() => {
    const set = new Set<string>()
    cbtQuestions.forEach(q => {
      if (q.subject_name) set.add(q.subject_name)
    })
    return Array.from(set)
  }, [cbtQuestions])

  const filteredCbtQuestions = useMemo(() => {
    return cbtQuestions.filter(q => {
      if (cbtStatusFilter !== 'ALL' && q.status !== cbtStatusFilter) {
        return false
      }
      if (cbtSubjectFilter !== 'ALL' && q.subject_name !== cbtSubjectFilter) {
        return false
      }
      if (cbtSearchQuery.trim()) {
        const query = cbtSearchQuery.toLowerCase()
        const matchQuestion = q.question?.toLowerCase().includes(query)
        const matchSubj = q.subject_name?.toLowerCase().includes(query) || q.subject_code?.toLowerCase().includes(query)
        const matchUnit = q.unit_tag?.toLowerCase().includes(query)
        const matchStudent = q.user_name?.toLowerCase().includes(query) || q.username?.toLowerCase().includes(query) || q.users?.name?.toLowerCase().includes(query)
        return matchQuestion || matchSubj || matchUnit || matchStudent
      }
      return true
    })
  }, [cbtQuestions, cbtStatusFilter, cbtSubjectFilter, cbtSearchQuery])

  const handleReviewCbt = async (questionId: number | string, action: 'approved' | 'rejected', feedback?: string) => {
    setActionLoading(true)
    try {
      const res = await reviewCbtQuestion(questionId, action, feedback)
      if (res.success) {
        setCbtQuestions(prev =>
          prev.map(q => String(q.id) === String(questionId) ? { ...q, status: action, admin_feedback: feedback || null } : q)
        )
        if (action === 'approved') {
          alert('CBT Question approved and published to the student CBT Arena!')
        } else {
          alert('CBT Question rejected with feedback recorded.')
          setCbtRejectModalId(null)
          setCbtRejectReason('')
        }
      } else {
        alert(res.error || 'Failed to review question')
      }
    } catch (err: any) {
      alert(`Error reviewing question: ${err?.message || 'Server error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  const handleBatchApprovePendingCbt = async () => {
    const pendingIds = filteredCbtQuestions.filter(q => q.status === 'pending').map(q => q.id)
    if (pendingIds.length === 0) {
      alert('No pending questions in the current view to approve.')
      return
    }

    if (!confirm(`Approve all ${pendingIds.length} pending CBT questions in this filtered view and publish to the CBT Arena?`)) {
      return
    }

    setActionLoading(true)
    try {
      const res = await batchApproveCbtQuestionsAdmin(pendingIds)
      if (res.success) {
        const idStrings = pendingIds.map(String)
        setCbtQuestions(prev =>
          prev.map(q => idStrings.includes(String(q.id)) ? { ...q, status: 'approved' } : q)
        )
        alert(`Successfully approved ${res.count || pendingIds.length} CBT questions! They are now live for student mock practice.`)
      } else {
        alert(res.error || 'Failed to batch approve')
      }
    } catch (err: any) {
      alert(`Error batch approving questions: ${err?.message || 'Server error'}`)
    } finally {
      setActionLoading(false)
    }
  }

  const getOptionsList = (optionsJson: any): Array<{ id: string; text: string }> => {
    if (Array.isArray(optionsJson)) {
      const seenIds = new Set<string>()
      return optionsJson.map((opt, i) => {
        let optId = String(opt.id || opt.key || '').trim().toUpperCase()
        if (!optId || seenIds.has(optId)) {
          optId = String.fromCharCode(65 + i)
        }
        seenIds.add(optId)
        return {
          id: optId,
          text: String(opt.text || opt.label || '')
        }
      })
    }
    if (optionsJson && typeof optionsJson === 'object') {
      return Object.entries(optionsJson).map(([k, v]) => ({
        id: k,
        text: String(v)
      }))
    }
    return []
  }

  const openEditCbtModal = (q: CbtQuestionItem) => {
    setCbtEditModalItem(q)
    setCbtEditQuestion(q.question || '')
    setCbtEditExplanation(q.explanation || '')
    setCbtEditUnitTag(q.unit_tag || '')
    setCbtEditOptions(getOptionsList(q.options_json))
    setCbtEditCorrectAnswers(q.correct_answers || [])
  }

  const handleSaveCbtEdit = async (approveImmediately = false) => {
    if (!cbtEditModalItem) return
    if (!cbtEditQuestion.trim()) {
      alert('Question text cannot be empty')
      return
    }
    if (cbtEditCorrectAnswers.length === 0) {
      alert('Please select at least one correct answer key (e.g. A, B, C, or D).')
      return
    }

    setActionLoading(true)
    try {
      const newStatus = approveImmediately ? 'approved' : cbtEditModalItem.status
      const res = await updateCbtQuestionDetailsAdmin(cbtEditModalItem.id, {
        question: cbtEditQuestion.trim(),
        explanation: cbtEditExplanation.trim(),
        unit_tag: cbtEditUnitTag.trim() || undefined,
        options_json: cbtEditOptions,
        correct_answers: cbtEditCorrectAnswers,
        status: newStatus
      })

      if (res.success) {
        setCbtQuestions(prev =>
          prev.map(q => {
            if (q.id === cbtEditModalItem.id) {
              return {
                ...q,
                question: cbtEditQuestion.trim(),
                explanation: cbtEditExplanation.trim(),
                unit_tag: cbtEditUnitTag.trim() || undefined,
                options_json: cbtEditOptions,
                correct_answers: cbtEditCorrectAnswers,
                status: newStatus
              }
            }
            return q
          })
        )
        setCbtEditModalItem(null)
        alert(approveImmediately ? 'Question updated & published to CBT Arena!' : 'Question details updated successfully!')
      } else {
        alert(res.error || 'Failed to update question')
      }
    } catch {
      alert('Error updating question')
    } finally {
      setActionLoading(false)
    }
  }

  const requestColumns: Column<PaperRequestItem>[] = [
    {
      key: 'subject_name',
      header: 'Requested Subject & Type',
      sortable: true,
      render: r => (
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-prevu-text">{r.subject_name}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {r.request_type || 'pyq'}
            </span>
          </div>
          {r.note && (
            <div className="text-[11px] text-prevu-text-muted italic line-clamp-1 mt-0.5">
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
      header: <span className="text-right block">Actions</span>,
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
            <option value="in_review">In Review</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="closed">Closed</option>
          </select>

          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => openEditRequestModal(r)}
            disabled={actionLoading}
            className="h-7 px-2 text-xs text-amber-400 hover:text-amber-300 hover:bg-amber-500/10"
            title="Edit request details"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </Button>

          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => handleDeleteRequest(r.id)}
            disabled={actionLoading}
            className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
            title="Delete request"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>

          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-purple-400 hover:text-purple-300" asChild>
            <Link href={`/upload?subject=${encodeURIComponent(r.subject_name)}&sem=${r.semester}`}>
              <Upload className="w-3.5 h-3.5 mr-1" />
              Upload
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
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              Community Requests & Verification
            </h1>
            {pendingCbtCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-purple-300" />
                {pendingCbtCount} CBT MCQs Pending
              </span>
            )}
            {pendingSubmissionsCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {pendingSubmissionsCount} Shared Notes Pending
              </span>
            )}
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Review batchmate-shared PYQs, notes, edit solutions/remarks, and verify student-contributed CBT Arena MCQs before publishing them.
          </p>
        </div>

        {/* Tab navigation buttons */}
        <div className="flex flex-wrap items-center bg-prevu-surface border border-prevu-surface-light rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('cbt')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'cbt'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>CBT Arena MCQs</span>
            {pendingCbtCount > 0 ? (
              <span className="w-5 h-5 rounded-full bg-purple-400 text-black text-[10px] font-bold flex items-center justify-center ml-1 animate-pulse">
                {pendingCbtCount}
              </span>
            ) : (
              <span className="text-[10px] text-prevu-text-muted ml-0.5 font-mono">
                ({cbtQuestions.length})
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'submissions'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Batchmate Help</span>
            {pendingSubmissionsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-black text-[10px] font-bold flex items-center justify-center ml-1">
                {pendingSubmissionsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeTab === 'requests'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>All Requests</span>
            <span className="text-[10px] text-prevu-text-muted ml-0.5 font-mono">
              ({requests.length})
            </span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* TAB 1: BATCHMATE HELP SUBMISSIONS (PENDING VERIFICATION) */}
      {/* ============================================================ */}
      {activeTab === 'submissions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 bg-prevu-surface/60 p-3 rounded-2xl border border-prevu-surface-light">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Filter Submissions:</span>
              {(['pending', 'approved', 'rejected', 'ALL'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setSubmissionFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    submissionFilter === st
                      ? 'bg-purple-600 text-white'
                      : 'bg-prevu-bg text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                </button>
              ))}
            </div>
            <span className="text-xs font-mono text-prevu-text-muted">
              {filteredSubmissions.length} submissions found
            </span>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-prevu-surface/40 border border-prevu-surface-light space-y-3">
              <CheckCircle className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No Submissions Found</h3>
              <p className="text-xs text-prevu-text-muted max-w-md mx-auto">
                {submissionFilter === 'pending'
                  ? 'All batchmate contributions have been reviewed! New submissions will appear here for verification.'
                  : 'No contributions matching this filter.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredSubmissions.map(sub => {
                const req = sub.paper_requests
                const isPending = sub.status === 'pending'
                const isApproved = sub.status === 'approved'

                return (
                  <div
                    key={sub.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPending
                        ? 'bg-prevu-surface border-amber-500/30 shadow-lg shadow-amber-950/20'
                        : isApproved
                        ? 'bg-prevu-surface/80 border-emerald-500/20'
                        : 'bg-prevu-surface/40 border-red-500/20 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Request context & Batchmate info */}
                      <div className="space-y-3 flex-1 min-w-0">
                        {/* Target Request Info */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {req?.request_type || 'pyq'}
                          </span>
                          <span className="text-base font-bold text-white">
                            {req?.subject_name || 'Subject'}
                          </span>
                          <span className="text-xs text-prevu-text-muted font-mono">
                            • Sem {req?.semester || 1} • {req?.exam_type || 'MST'} ({req?.exam_year || 2025})
                          </span>
                        </div>

                        {/* Contributor Student Details */}
                        <div className="flex items-center gap-3 text-xs text-prevu-text-muted bg-prevu-bg/60 p-2.5 rounded-xl border border-prevu-surface-light/60">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {sub.users?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">
                                {sub.users?.name || 'Batchmate'}
                              </span>
                              <span className="font-mono text-[11px] text-purple-300">
                                @{sub.users?.username || 'student'}
                              </span>
                              {sub.users?.cu_verified && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  CU Verified
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-prevu-text-muted">
                              Shared on {new Date(sub.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        {/* Contributed Content: File / Link / Solution */}
                        <div className="space-y-2">
                          {sub.file_path && (() => {
                            let filesList = [{ name: sub.file_name || 'Attached Question Paper / Notes Document', idx: 0 }]
                            if (sub.file_path.startsWith('[')) {
                              try {
                                const parsed = JSON.parse(sub.file_path)
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                filesList = parsed.map((item: any, i: number) => ({
                                  name: item.name || `File ${i + 1}`,
                                  idx: i
                                }))
                              } catch {}
                            }
                            return (
                              <div className="space-y-1.5">
                                {filesList.map((fItem, fIdx) => (
                                  <div key={fIdx} className="flex items-center gap-3 p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
                                    <FileText className="w-5 h-5 text-purple-400 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-white truncate">
                                        {fItem.name}
                                      </p>
                                      <p className="text-[10px] font-mono text-purple-300">
                                        {filesList.length > 1 ? `Attached File ${fIdx + 1} of ${filesList.length}` : 'Uploaded File'} • Supabase Storage
                                      </p>
                                    </div>
                                    <a
                                      href={`/api/responses/preview/${sub.id}?fileIndex=${fItem.idx}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white inline-flex items-center gap-1 shadow-sm transition-colors shrink-0"
                                    >
                                      <span>Inspect File</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  </div>
                                ))}
                              </div>
                            )
                          })()}

                          {sub.external_link && (
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30">
                              <ExternalLink className="w-4 h-4 text-cyan-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">
                                  External Study Resource Link
                                </p>
                                <p className="text-[10px] font-mono text-cyan-300 truncate">
                                  {sub.external_link}
                                </p>
                              </div>
                              <a
                                href={sub.external_link}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white inline-flex items-center gap-1 transition-colors shrink-0"
                              >
                                <span>Open Link</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          )}

                          {sub.message && (
                            <div className="p-3 rounded-xl bg-prevu-bg/80 border border-prevu-surface-light text-xs text-prevu-text space-y-1">
                              <span className="text-[10px] font-mono font-bold uppercase text-prevu-text-muted block">
                                Student Notes / Solution:
                              </span>
                              <p className="whitespace-pre-line text-prevu-text/90">
                                {sub.message}
                              </p>
                            </div>
                          )}

                          {sub.admin_note && (
                            <div className="text-xs text-emerald-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/30 flex items-start gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white">Admin Department Remark:</strong> {sub.admin_note}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions and Status */}
                      <div className="lg:w-52 flex flex-col justify-between items-end gap-3 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-prevu-surface-light">
                        <div className="flex items-center gap-1.5">
                          {isPending && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <Clock className="w-3 h-3 animate-spin" /> Pending Approval
                            </span>
                          )}
                          {isApproved && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle className="w-3 h-3" /> Approved & Live
                            </span>
                          )}
                          {sub.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </div>

                        <div className="w-full space-y-2">
                          {isPending ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => openApproveModal(sub)}
                                disabled={actionLoading}
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 shadow-md"
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve & Publish
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openEditSubmissionModal(sub)}
                                disabled={actionLoading}
                                className="w-full border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-bold text-xs h-8"
                              >
                                <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Details & Notes
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setRejectModalId(sub.id)
                                  setRejectReason('')
                                }}
                                disabled={actionLoading}
                                className="w-full border-red-500/40 text-red-300 hover:bg-red-500/10 font-bold text-xs h-8"
                              >
                                <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditSubmissionModal(sub)}
                              disabled={actionLoading}
                              className="w-full border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-bold text-xs h-8"
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Details & Remarks
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 2: ALL COMMUNITY REQUESTS */}
      {/* ============================================================ */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="ALL">All Requests</option>
              <option value="open">Open Requests</option>
              <option value="in_review">In Review</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <DataTable
            data={filteredRequests}
            columns={requestColumns}
            keyExtractor={r => String(r.id)}
            pageSize={15}
            emptyTitle="No paper requests found"
            emptyDescription="There are currently no community requests matching your criteria."
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* TAB 3: CBT ARENA MCQ REQUESTS & VERIFICATION */}
      {/* ============================================================ */}
      {activeTab === 'cbt' && (
        <div className="space-y-4">
          {/* Controls Bar 1: Status Filters & Batch Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-prevu-surface/60 p-3 rounded-2xl border border-prevu-surface-light">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                Filter Status:
              </span>
              {(['pending', 'approved', 'rejected', 'ALL'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setCbtStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    cbtStatusFilter === st
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-prevu-bg text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                  {st === 'pending' && pendingCbtCount > 0 && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-black font-extrabold">
                      {pendingCbtCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Batch Approve Action */}
            {cbtStatusFilter === 'pending' && filteredCbtQuestions.length > 0 && (
              <Button
                size="sm"
                onClick={handleBatchApprovePendingCbt}
                disabled={actionLoading}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/40 shrink-0"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                Approve All ({filteredCbtQuestions.length}) Pending
              </Button>
            )}
          </div>

          {/* Controls Bar 2: Search Query & Subject Filter */}
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-prevu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={cbtSearchQuery}
                onChange={e => setCbtSearchQuery(e.target.value)}
                placeholder="Search question text, topic tag, subject code, or student..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-prevu-surface border border-prevu-surface-light text-xs text-white placeholder-prevu-text-muted focus:outline-none focus:border-purple-500/60"
              />
            </div>

            {cbtSubjectsList.length > 1 && (
              <select
                value={cbtSubjectFilter}
                onChange={e => setCbtSubjectFilter(e.target.value)}
                className="w-full md:w-auto px-3 py-2.5 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                <option value="ALL">All Subjects ({cbtSubjectsList.length})</option>
                {cbtSubjectsList.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            )}

            <div className="flex items-center gap-2 self-end md:self-center">
              <span className="text-xs font-mono text-purple-300 bg-purple-950/30 px-3 py-1.5 rounded-xl border border-purple-500/20">
                {filteredCbtQuestions.length} MCQ{filteredCbtQuestions.length !== 1 ? 's' : ''} listed
              </span>
            </div>
          </div>

          {/* Empty State */}
          {filteredCbtQuestions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-prevu-surface/40 border border-prevu-surface-light space-y-3">
              <CheckCircle className="w-10 h-10 text-purple-400 mx-auto" />
              <h3 className="text-sm font-bold text-white">No CBT Arena Questions Found</h3>
              <p className="text-xs text-prevu-text-muted max-w-md mx-auto">
                {cbtStatusFilter === 'pending'
                  ? 'All student-contributed MCQs have been reviewed! New submissions from the CBT contribute portal will appear here for verification.'
                  : 'No CBT Arena MCQs match this filter or search query.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredCbtQuestions.map((q, idx) => {
                const isPending = q.status === 'pending'
                const isApproved = q.status === 'approved'
                const isRejected = q.status === 'rejected'
                const options = getOptionsList(q.options_json)

                return (
                  <div
                    key={`cbt-q-${q.id || idx}-${idx}`}
                    className={`p-5 rounded-2xl border transition-all ${
                      isPending
                        ? 'bg-prevu-surface border-purple-500/30 shadow-lg shadow-purple-950/20'
                        : isApproved
                        ? 'bg-prevu-surface/80 border-emerald-500/20'
                        : 'bg-prevu-surface/40 border-red-500/20 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                      {/* Left: Question details & Options */}
                      <div className="space-y-3 flex-1 min-w-0">
                        {/* Subject, Topic & Status Tags */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            {q.subject_code}
                          </span>
                          <span className="text-sm sm:text-base font-bold text-white">
                            {q.subject_name}
                          </span>
                          <span className="text-xs text-prevu-text-muted font-mono">
                            • Sem {q.semester} • {q.category || 'General'}
                          </span>
                          {q.unit_tag && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {q.unit_tag}
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {q.question_type === 'multiple' ? 'Multiple Choice' : 'Single MCQ'}
                          </span>
                          {isPending && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse">
                              Pending Review
                            </span>
                          )}
                          {isApproved && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              ✓ Live in Arena
                            </span>
                          )}
                          {isRejected && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-red-500/20 text-red-300 border border-red-500/40">
                              ✕ Rejected
                            </span>
                          )}
                        </div>

                        {/* Contributor Profile */}
                        <div className="flex items-center gap-3 text-xs text-prevu-text-muted bg-prevu-bg/60 p-2.5 rounded-xl border border-prevu-surface-light/60">
                          <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                            {q.user_name?.charAt(0) || q.users?.name?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-white">
                                {q.user_name || q.users?.name || 'Student Contributor'}
                              </span>
                              <span className="font-mono text-[11px] text-purple-300">
                                @{q.username || q.users?.username || 'student'}
                              </span>
                              {(q.users?.cu_verified || true) && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                  CU Student
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-prevu-text-muted">
                              Submitted {new Date(q.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>

                        {/* Question Text */}
                        <div className="p-3.5 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light">
                          <span className="text-[10px] font-mono font-bold uppercase text-purple-300 block mb-1">
                            Question Statement:
                          </span>
                          <p className="text-sm font-medium text-white whitespace-pre-wrap leading-relaxed">
                            {q.question}
                          </p>
                        </div>

                        {/* Options List with Highlighted Correct Answer */}
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase text-prevu-text-muted block">
                            Options (Correct Answer Highlighted in Emerald):
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {options.map((opt, optIdx) => {
                              const isCorrect = q.correct_answers.includes(opt.id)
                              return (
                                <div
                                  key={`cbt-opt-${q.id || idx}-${opt.id}-${optIdx}`}
                                  className={`p-2.5 rounded-xl border text-xs flex items-center gap-2.5 transition-all ${
                                    isCorrect
                                      ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 shadow-sm'
                                      : 'bg-prevu-bg/50 border-prevu-surface-light text-prevu-text'
                                  }`}
                                >
                                  <div
                                    className={`w-6 h-6 rounded-lg font-bold font-mono text-xs flex items-center justify-center shrink-0 ${
                                      isCorrect
                                        ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                                        : 'bg-prevu-surface-light text-prevu-text-muted'
                                    }`}
                                  >
                                    {opt.id}
                                  </div>
                                  <span className="flex-1 min-w-0 font-medium">
                                    {opt.text}
                                  </span>
                                  {isCorrect && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                                      <Check className="w-2.5 h-2.5" />
                                      Answer Key
                                    </span>
                                  )}
                                </div>
                              )
                            })}
                          </div>
                        </div>

                        {/* Explanation (if provided) */}
                        {q.explanation && (
                          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200 flex items-start gap-2">
                            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-mono font-bold uppercase text-purple-300 block">
                                Solution Explanation:
                              </span>
                              <p className="whitespace-pre-wrap">{q.explanation}</p>
                            </div>
                          </div>
                        )}

                        {/* Admin Rejection Feedback */}
                        {isRejected && q.admin_feedback && (
                          <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-200 flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <div>
                              <span className="text-[10px] font-mono font-bold uppercase text-red-400 block">
                                Rejection Note:
                              </span>
                              <p>{q.admin_feedback}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Right: Moderation Actions */}
                      <div className="lg:w-48 flex lg:flex-col items-center gap-2 shrink-0 border-t lg:border-t-0 lg:border-l border-prevu-surface-light pt-3 lg:pt-0 lg:pl-4">
                        {isPending ? (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleReviewCbt(q.id, 'approved')}
                              disabled={actionLoading}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8 shadow-md"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve & Publish
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditCbtModal(q)}
                              disabled={actionLoading}
                              className="w-full border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-bold text-xs h-8"
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Question
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setCbtRejectModalId(q.id)
                                setCbtRejectReason('')
                              }}
                              disabled={actionLoading}
                              className="w-full border-red-500/40 text-red-300 hover:bg-red-500/10 font-bold text-xs h-8"
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                            </Button>
                          </>
                        ) : isApproved ? (
                          <>
                            <div className="w-full p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
                              <span className="text-[11px] font-bold text-emerald-300 flex items-center justify-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Live in CBT
                              </span>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditCbtModal(q)}
                              disabled={actionLoading}
                              className="w-full border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-bold text-xs h-8"
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit Details
                            </Button>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReviewCbt(q.id, 'rejected', 'Revoked by admin')}
                              disabled={actionLoading}
                              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs h-7"
                            >
                              Revoke
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="w-full p-2 rounded-xl bg-red-950/30 border border-red-500/30 text-center">
                              <span className="text-[11px] font-bold text-red-300">
                                ✕ Rejected
                              </span>
                            </div>

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => openEditCbtModal(q)}
                              disabled={actionLoading}
                              className="w-full border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-bold text-xs h-8"
                            >
                              <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit & Fix
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => handleReviewCbt(q.id, 'approved')}
                              disabled={actionLoading}
                              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-8"
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" /> Re-approve
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 1: EDIT SUBMISSION & REQUEST DETAILS */}
      {/* ============================================================ */}
      {editSubModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-xl my-8 p-6 rounded-3xl bg-[#12121a] border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <PenLine className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Edit Submission & Request Details</h3>
              </div>
              <button
                onClick={() => setEditSubModalItem(null)}
                className="text-prevu-text-muted hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-prevu-text-muted">
              Correct typos in the subject name, update exam format/semester, refine the student&apos;s answer/notes, or attach your official Admin Department remark before or after publishing.
            </p>

            <div className="space-y-4 text-xs">
              {/* Request Metadata */}
              <div className="space-y-1">
                <label className="font-semibold text-white">Subject Name *</label>
                <input
                  type="text"
                  value={editSubSubject}
                  onChange={e => setEditSubSubject(e.target.value)}
                  placeholder="e.g. Parallel and Distributed Computing"
                  className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-white">Semester</label>
                  <select
                    value={editSubSemester}
                    onChange={e => setEditSubSemester(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-white">Exam Format</label>
                  <select
                    value={editSubExamType}
                    onChange={e => setEditSubExamType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="MST1">MST 1</option>
                    <option value="MST2">MST 2</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Surprise Test">Surprise Test</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-white">Year</label>
                  <input
                    type="number"
                    value={editSubExamYear}
                    onChange={e => setEditSubExamYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-white">Type</label>
                  <select
                    value={editSubRequestType}
                    onChange={e => setEditSubRequestType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="pyq">PYQ</option>
                    <option value="notes">Notes</option>
                    <option value="doubt">Doubt</option>
                  </select>
                </div>
              </div>

              {/* Student Notes / Solution */}
              <div className="space-y-1">
                <label className="font-semibold text-white">Student Notes / Written Solution</label>
                <textarea
                  value={editSubMessage}
                  onChange={e => setEditSubMessage(e.target.value)}
                  placeholder="Notes, solution explanation, or formula guide..."
                  rows={3}
                  className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Admin Department Verification Note */}
              <div className="space-y-1 p-3 rounded-xl bg-purple-950/20 border border-purple-500/30">
                <label className="font-semibold text-purple-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Admin Department Verification Remark</span>
                </label>
                <p className="text-[11px] text-prevu-text-muted">
                  This note is displayed to all students next to the verified badge.
                </p>
                <textarea
                  value={editSubAdminNote}
                  onChange={e => setEditSubAdminNote(e.target.value)}
                  placeholder="e.g. Verified 2025 MST2 question paper with complete answers for CSE Sem 7."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-prevu-bg border border-purple-500/30 text-white focus:outline-none focus:border-purple-400 mt-1"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-prevu-surface-light">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditSubModalItem(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveSubmissionEdit(false)}
                disabled={actionLoading}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Changes
              </Button>
              {editSubModalItem.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleSaveSubmissionEdit(true)}
                  disabled={actionLoading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                  Save & Approve
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 2: APPROVE WITH CUSTOM ADMIN REMARK */}
      {/* ============================================================ */}
      {approveModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#12121a] border border-emerald-500/30 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Approve & Publish to Community</h3>
            </div>
            
            <div className="text-xs text-prevu-text-muted bg-prevu-bg/60 p-3 rounded-xl border border-prevu-surface-light space-y-1">
              <div>
                <span className="text-white font-semibold">Subject: </span>
                <span>{approveModalSub.paper_requests?.subject_name || 'Subject'}</span>
              </div>
              <div>
                <span className="text-white font-semibold">Contributor: </span>
                <span>@{approveModalSub.users?.username || approveModalSub.users?.name || 'student'}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="font-semibold text-white">
                Admin Verification Remark (Displayed to Students)
              </label>
              <textarea
                value={approveAdminNote}
                onChange={e => setApproveAdminNote(e.target.value)}
                placeholder="e.g. Verified by Admin Department: Approved for student community."
                rows={3}
                className="w-full p-2.5 rounded-xl bg-prevu-bg border border-emerald-500/30 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setApproveModalSub(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmApprove}
                disabled={actionLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Confirm & Publish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 3: EDIT REQUEST DETAILS (FROM ALL REQUESTS TAB) */}
      {/* ============================================================ */}
      {editReqItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg p-6 rounded-3xl bg-[#12121a] border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Edit3 className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">Edit Paper Request #{editReqItem.id}</h3>
              </div>
              <button
                onClick={() => setEditReqItem(null)}
                className="text-prevu-text-muted hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-white">Subject Name *</label>
                <input
                  type="text"
                  value={editReqSubject}
                  onChange={e => setEditReqSubject(e.target.value)}
                  placeholder="Subject Name"
                  className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-white">Semester</label>
                  <select
                    value={editReqSemester}
                    onChange={e => setEditReqSemester(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Sem {s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-white">Exam Format</label>
                  <select
                    value={editReqExamType}
                    onChange={e => setEditReqExamType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="MST1">MST 1</option>
                    <option value="MST2">MST 2</option>
                    <option value="Final Exam">Final Exam</option>
                    <option value="Surprise Test">Surprise Test</option>
                    <option value="Assignment">Assignment</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-white">Year</label>
                  <input
                    type="number"
                    value={editReqExamYear}
                    onChange={e => setEditReqExamYear(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="font-semibold text-white">Request Type</label>
                  <select
                    value={editReqType}
                    onChange={e => setEditReqType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="pyq">PYQ</option>
                    <option value="notes">Notes</option>
                    <option value="doubt">Doubt</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-white">Status</label>
                  <select
                    value={editReqStatus}
                    onChange={e => setEditReqStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="open">Open</option>
                    <option value="in_review">In Review</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-white">Student Note / Description</label>
                <textarea
                  value={editReqNote}
                  onChange={e => setEditReqNote(e.target.value)}
                  placeholder="Additional student instructions or note..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-prevu-surface-light">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditReqItem(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveRequestEdit}
                disabled={actionLoading}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 4: REJECTION FEEDBACK */}
      {/* ============================================================ */}
      {rejectModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#12121a] border border-prevu-surface-light shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Reject Contribution</h3>
            </div>
            <p className="text-xs text-prevu-text-muted">
              Please provide feedback explaining why this shared material cannot be verified (e.g., blurry photo, incorrect semester, duplicate). The student will be notified.
            </p>
            <textarea
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              placeholder="e.g. Scanned page 2 is missing, please upload a complete PDF..."
              rows={3}
              className="w-full p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light text-xs text-white placeholder-prevu-text-muted focus:outline-none focus:border-red-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectModalId(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleRejectSubmission}
                disabled={actionLoading || !rejectReason.trim()}
                className="bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 5: CBT QUESTION REJECTION */}
      {/* ============================================================ */}
      {cbtRejectModalId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#12121a] border border-prevu-surface-light shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-red-400">
              <AlertCircle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Reject CBT Arena MCQ</h3>
            </div>
            <p className="text-xs text-prevu-text-muted">
              Please provide feedback explaining why this question cannot be accepted into the CBT Arena (e.g., incorrect answer key, ambiguous wording, duplicate question).
            </p>
            <textarea
              value={cbtRejectReason}
              onChange={e => setCbtRejectReason(e.target.value)}
              placeholder="e.g. Option B was marked correct, but the standard solution indicates Option A is correct..."
              rows={3}
              className="w-full p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light text-xs text-white placeholder-prevu-text-muted focus:outline-none focus:border-red-500"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCbtRejectModalId(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={() => handleReviewCbt(cbtRejectModalId, 'rejected', cbtRejectReason.trim())}
                disabled={actionLoading || !cbtRejectReason.trim()}
                className="bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL 6: CBT QUESTION EDIT & INSPECT */}
      {/* ============================================================ */}
      {cbtEditModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="w-full max-w-2xl my-8 p-6 rounded-3xl bg-[#12121a] border border-purple-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <div className="flex items-center gap-2 text-purple-400">
                <Edit3 className="w-5 h-5" />
                <h3 className="text-base font-bold text-white">
                  Inspect & Edit CBT Question
                </h3>
              </div>
              <button
                onClick={() => setCbtEditModalItem(null)}
                className="text-prevu-text-muted hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="px-2 py-0.5 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {cbtEditModalItem.subject_code}
              </span>
              <span className="font-semibold text-white truncate">
                {cbtEditModalItem.subject_name}
              </span>
              <span className="text-prevu-text-muted font-mono">
                Sem {cbtEditModalItem.semester}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              {/* Topic / Unit Tag */}
              <div className="space-y-1">
                <label className="font-semibold text-white">Unit / Topic Tag</label>
                <input
                  type="text"
                  value={cbtEditUnitTag}
                  onChange={e => setCbtEditUnitTag(e.target.value)}
                  placeholder="e.g. Ratio & Proportion, Network Layer, Memory Management..."
                  className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <label className="font-semibold text-white">Question Statement *</label>
                <textarea
                  value={cbtEditQuestion}
                  onChange={e => setCbtEditQuestion(e.target.value)}
                  rows={4}
                  placeholder="Enter the full question text..."
                  className="w-full p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500 leading-relaxed font-sans"
                />
              </div>

              {/* Options & Correct Answer Selector */}
              <div className="space-y-2">
                <label className="font-semibold text-white flex items-center justify-between">
                  <span>Options & Answer Key</span>
                  <span className="text-[11px] text-purple-300 font-mono">
                    Click an option&apos;s key badge to toggle it as correct
                  </span>
                </label>

                <div className="space-y-2">
                  {cbtEditOptions.map((opt, i) => {
                    const isCorrect = cbtEditCorrectAnswers.includes(opt.id)
                    return (
                      <div
                        key={`cbt-edit-opt-${opt.id || i}-${i}`}
                        className={`flex items-center gap-2.5 p-2 rounded-xl border transition-all ${
                          isCorrect
                            ? 'bg-emerald-950/20 border-emerald-500/50'
                            : 'bg-prevu-bg border-prevu-surface-light'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (isCorrect) {
                              setCbtEditCorrectAnswers(prev => prev.filter(k => k !== opt.id))
                            } else {
                              setCbtEditCorrectAnswers([opt.id])
                            }
                          }}
                          className={`w-8 h-8 rounded-lg font-bold font-mono text-xs flex items-center justify-center shrink-0 transition-all ${
                            isCorrect
                              ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30'
                              : 'bg-prevu-surface-light text-prevu-text-muted hover:text-white hover:bg-prevu-surface'
                          }`}
                          title="Click to mark as correct answer"
                        >
                          {opt.id}
                        </button>

                        <input
                          type="text"
                          value={opt.text}
                          onChange={e => {
                            const newText = e.target.value
                            setCbtEditOptions(prev =>
                              prev.map((o, idx) => (idx === i ? { ...o, text: newText } : o))
                            )
                          }}
                          className="flex-1 p-2 rounded-lg bg-transparent text-white focus:outline-none text-xs"
                          placeholder={`Option ${opt.id} text...`}
                        />

                        {isCorrect && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                            ✓ Correct Key
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Explanation */}
              <div className="space-y-1">
                <label className="font-semibold text-white">Solution / Explanation</label>
                <textarea
                  value={cbtEditExplanation}
                  onChange={e => setCbtEditExplanation(e.target.value)}
                  rows={3}
                  placeholder="Detailed step-by-step reasoning or formula..."
                  className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-prevu-surface-light">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCbtEditModalItem(null)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleSaveCbtEdit(false)}
                disabled={actionLoading}
                className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 font-bold"
              >
                <Save className="w-3.5 h-3.5 mr-1" />
                Save Changes
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveCbtEdit(true)}
                disabled={actionLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                Save & Approve Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
