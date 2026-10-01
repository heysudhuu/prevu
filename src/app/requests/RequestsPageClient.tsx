'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  ThumbsUp, 
  Search, 
  Upload, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  HelpCircle,
  Users,
  Zap,
  Award,
  Flame,
  FileText,
  BookOpen,
  ExternalLink,
  ShieldCheck,
  Lock,
  ArrowRight,
  MessageCircle,
  FileCheck,
  Check,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toggleRequestUpvote, createCommunityRequest, submitBatchmateHelp, CommunityResponseItem } from './actions'
import StudyBuddyModal from '@/components/community/StudyBuddyModal'

export interface CommunityRequestItem {
  id: number
  subject_name: string
  request_type?: 'pyq' | 'study_material' | 'doubt' | string
  title?: string
  exam_type: string
  exam_year: number
  semester: number
  note?: string
  status: string
  created_at: string
  upvotes: number
  hasUpvoted?: boolean
  pendingResponsesCount?: number
  isMyRequest?: boolean
  approvedResponses?: CommunityResponseItem[]
  users?: {
    id: string
    name: string
    username?: string
    cu_verified?: boolean
  }
}

interface CurrentUserSession {
  uid: string
  email?: string
  name?: string
  username?: string
  cu_verified?: boolean
  role?: string
}

interface RequestsPageClientProps {
  initialRequests: CommunityRequestItem[]
  currentUser?: CurrentUserSession | null
  prefillSubject?: string
  prefillExamType?: string
  prefillRequestType?: string
  openNewModal?: boolean
}

export default function RequestsPageClient({
  initialRequests,
  currentUser = null,
  prefillSubject = '',
  prefillExamType = 'MST1',
  prefillRequestType = 'pyq',
  openNewModal = false
}: RequestsPageClientProps) {
  const [requests, setRequests] = useState<CommunityRequestItem[]>(initialRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [semFilter, setSemFilter] = useState<number | 'ALL'>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [upvotingId, setUpvotingId] = useState<number | null>(null)

  // Modals state
  const [modalOpen, setModalOpen] = useState(false)
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalActionText, setAuthModalActionText] = useState('post requests')
  const [buddyModalOpen, setBuddyModalOpen] = useState(false)
  
  // Help Batchmate Modal State
  const [helpModalOpen, setHelpModalOpen] = useState(false)
  const [selectedReqForHelp, setSelectedReqForHelp] = useState<CommunityRequestItem | null>(null)
  const [helpResponseType, setHelpResponseType] = useState<'file' | 'link' | 'answer'>('file')
  const [helpFiles, setHelpFiles] = useState<File[]>([])
  const [helpLink, setHelpLink] = useState('')
  const [helpMessage, setHelpMessage] = useState('')
  const [helpSubmitting, setHelpSubmitting] = useState(false)
  const [helpError, setHelpError] = useState<string | null>(null)

  // Success Confirmation Popup
  const [successNotice, setSuccessNotice] = useState<{
    open: boolean
    title: string
    message: string
  } | null>(null)

  // Expandable verified responses
  const [expandedRequestId, setExpandedRequestId] = useState<number | null>(null)

  // Bounties state
  const [pledges, setPledges] = useState<Record<number, number>>({})
  const [submitting, setSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  // Create Request Form Fields
  const [formRequestType, setFormRequestType] = useState(prefillRequestType)
  const [formSubject, setFormSubject] = useState(prefillSubject)
  const [formExamType, setFormExamType] = useState(prefillExamType)
  const [formYear, setFormYear] = useState('2025')
  const [formSemester, setFormSemester] = useState('1')
  const [formNote, setFormNote] = useState('')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('prevu_bounty_pledges')
      if (saved) setPledges(JSON.parse(saved))
    } catch {}

    if (openNewModal) {
      if (!currentUser) {
        setAuthModalActionText('request study materials and PYQs')
        setAuthModalOpen(true)
      } else {
        setModalOpen(true)
      }
    }
  }, [openNewModal, currentUser])

  const handlePledgeBounty = (requestId: number) => {
    setPledges(prev => {
      const current = prev[requestId] || 0
      const updated = { ...prev, [requestId]: current + 15 }
      try {
        localStorage.setItem('prevu_bounty_pledges', JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const handleOpenCreateRequest = () => {
    if (!currentUser) {
      setAuthModalActionText('request study materials, PYQs, or ask doubts')
      setAuthModalOpen(true)
    } else {
      setModalOpen(true)
    }
  }

  const handleOpenHelpModal = (req: CommunityRequestItem) => {
    if (!currentUser) {
      setAuthModalActionText('help your batchmates and share materials')
      setAuthModalOpen(true)
    } else {
      setSelectedReqForHelp(req)
      setHelpFiles([])
      setHelpLink('')
      setHelpMessage('')
      setHelpError(null)
      setHelpModalOpen(true)
    }
  }

  const handleUpvote = async (requestId: number) => {
    if (!currentUser) {
      setAuthModalActionText('upvote requests')
      setAuthModalOpen(true)
      return
    }

    setUpvotingId(requestId)
    try {
      const res = await toggleRequestUpvote(requestId)
      if (res.success && typeof res.upvoted === 'boolean') {
        setRequests(prev =>
          prev.map(r => {
            if (r.id === requestId) {
              const delta = res.upvoted ? 1 : -1
              return {
                ...r,
                hasUpvoted: res.upvoted,
                upvotes: Math.max(0, (r.upvotes || 0) + delta)
              }
            }
            return r
          })
        )
      } else if (res.error) {
        alert(res.error)
      }
    } catch (err) {
      console.error('Failed to upvote', err)
    } finally {
      setUpvotingId(null)
    }
  }

  // Handle submitting new request (Requirement 1: Must be registered/logged in)
  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      setModalOpen(false)
      setAuthModalActionText('request materials')
      setAuthModalOpen(true)
      return
    }

    setSubmitting(true)
    setModalError(null)

    const formData = new FormData()
    formData.append('request_type', formRequestType)
    formData.append('subject_name', formSubject)
    formData.append('exam_type', formExamType)
    formData.append('exam_year', formYear)
    formData.append('semester', formSemester)
    formData.append('note', formNote)

    try {
      const res = await createCommunityRequest(formData)
      if (res.success) {
        setModalOpen(false)
        setFormSubject('')
        setFormNote('')
        setSuccessNotice({
          open: true,
          title: 'Request Published on Prevu! 🚀',
          message: 'Your request has been shared with all your batchmates on the community board. Anyone with the material can now help you. When someone responds, you will be notified, and once the admin department verifies it, it will be immediately available!'
        })
      } else if (res.error) {
        setModalError(res.error)
      }
    } catch {
      setModalError('Failed to create request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Handle submitting batchmate help (Requirement 2: Batchmate helps -> Admin verifies)
  const handleSubmitHelp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReqForHelp) return

    if (helpResponseType === 'file' && helpFiles.length === 0) {
      setHelpError('Please select at least 1 file (up to 3 files) to upload.')
      return
    }
    if (helpResponseType === 'link' && !helpLink.trim()) {
      setHelpError('Please enter a valid URL / resource link.')
      return
    }
    if (helpResponseType === 'answer' && !helpMessage.trim()) {
      setHelpError('Please type your solution or notes.')
      return
    }

    setHelpSubmitting(true)
    setHelpError(null)

    const formData = new FormData()
    formData.append('request_id', String(selectedReqForHelp.id))
    formData.append('response_type', selectedReqForHelp.request_type || 'pyq')
    formData.append('message', helpMessage)
    formData.append('external_link', helpLink)
    if (helpFiles.length > 0) {
      helpFiles.forEach(f => formData.append('files', f))
      formData.append('file', helpFiles[0]) // compatibility
    }

    try {
      const res = await submitBatchmateHelp(formData)
      if (res.success) {
        // Update local request state to show 1 pending response
        setRequests(prev =>
          prev.map(r => {
            if (r.id === selectedReqForHelp.id) {
              return {
                ...r,
                pendingResponsesCount: (r.pendingResponsesCount || 0) + 1,
                status: r.status === 'open' ? 'in_review' : r.status
              }
            }
            return r
          })
        )

        setHelpModalOpen(false)
        // Show exact feedback message required by user
        setSuccessNotice({
          open: true,
          title: 'Thank You for Sharing! 🎉',
          message: 'Thank you for sharing the data with your batchmate! Your submission is now waiting for Admin Department verification. After that, it will be visible on the dashboard and community board. Your batchmate has also been notified that help is on the way!'
        })
      } else {
        setHelpError(res.error || 'Failed to submit help. Please try again.')
      }
    } catch {
      setHelpError('Network error while submitting help. Please try again.')
    } finally {
      setHelpSubmitting(false)
    }
  }

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesCategory = categoryFilter === 'ALL' || (r.request_type || 'pyq').toLowerCase() === categoryFilter.toLowerCase()
      const matchesSem = semFilter === 'ALL' || r.semester === semFilter
      const matchesType = typeFilter === 'ALL' || r.exam_type?.toUpperCase() === typeFilter
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter
      const term = searchQuery.trim().toLowerCase()
      const matchesSearch = !term ||
        r.subject_name?.toLowerCase().includes(term) ||
        r.title?.toLowerCase().includes(term) ||
        r.note?.toLowerCase().includes(term) ||
        String(r.exam_year || '').includes(term)

      return matchesCategory && matchesSem && matchesType && matchesStatus && matchesSearch
    })
  }, [requests, categoryFilter, semFilter, typeFilter, statusFilter, searchQuery])

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Community Board' }
        ]}
        badge={{ text: 'Peer Help & Bounty Hub', variant: 'purple' }}
        title="Community Requests & Peer Study Hub"
        description="Request missing question papers, study materials, or ask academic doubts. Batchmates share resources, verified by the Admin Department before going live."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBuddyModalOpen(true)}
              className="border-sky-500/40 text-sky-300 hover:bg-sky-500/10 font-bold text-xs"
            >
              <Users className="w-3.5 h-3.5 mr-1.5" /> Find Study Buddy
            </Button>
            <Button
              size="sm"
              onClick={handleOpenCreateRequest}
              className="bg-prevu-accent hover:bg-prevu-accent-light text-white font-bold shadow-lg shadow-prevu-accent/25 text-xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" /> Raise Request
            </Button>
          </div>
        }
      />

      {/* Peer-to-Peer Help & Admin Moderation Explanation Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-prevu-surface to-indigo-950/40 border border-purple-500/30 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-bold text-white">How Batchmate Sharing Works</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Admin Verified
              </span>
            </div>
            <p className="text-xs text-prevu-text-muted mt-0.5 max-w-2xl leading-relaxed">
              1. Register your ID on Prevu → 2. Post or view requests for PYQs, notes, or doubts → 3. Help your batchmate by sharing data → 4. Admin Department reviews and verifies the content before it goes live on the dashboard!
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateRequest}
          className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light text-white shadow-lg shadow-purple-600/25 shrink-0 inline-flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 fill-current" /> Raise a Request
        </button>
      </div>

      {/* Control & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-xl space-y-4">
        {/* Top: Category Tabs & Search */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Request Type Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'ALL', label: 'All Queries', icon: null },
              { id: 'pyq', label: 'Question Papers (PYQ)', icon: <FileText className="w-3 h-3 text-purple-400" /> },
              { id: 'study_material', label: 'Study Notes & Blueprint', icon: <BookOpen className="w-3 h-3 text-emerald-400" /> },
              { id: 'doubt', label: 'Academic Doubts', icon: <HelpCircle className="w-3 h-3 text-amber-400" /> }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-all cursor-pointer ${
                  categoryFilter === cat.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-prevu-bg text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search subjects, notes, or topics..."
              className="pl-9 h-9 text-xs bg-prevu-bg border-prevu-surface-light text-white"
            />
          </div>
        </div>

        {/* Bottom Filter Chips: Status & Semester */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-prevu-surface-light/60">
          <span className="text-[11px] font-mono text-prevu-text-muted uppercase">Status:</span>
          {[
            { id: 'ALL', label: 'All Statuses' },
            { id: 'open', label: 'Open' },
            { id: 'in_review', label: 'Under Admin Review' },
            { id: 'fulfilled', label: 'Fulfilled & Verified' }
          ].map(st => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id)}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                statusFilter === st.id
                  ? 'bg-prevu-surface-light text-white font-bold border border-purple-500/50'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              {st.label}
            </button>
          ))}

          <span className="text-prevu-surface-light mx-1">|</span>

          <span className="text-[11px] font-mono text-prevu-text-muted uppercase">Semester:</span>
          {['ALL', 1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <button
              key={sem}
              onClick={() => setSemFilter(sem as number | 'ALL')}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors cursor-pointer ${
                semFilter === sem
                  ? 'bg-prevu-surface-light text-white font-bold border border-purple-500/50'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              {sem === 'ALL' ? 'All' : `Sem ${sem}`}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-prevu-text-muted px-1 font-mono">
          <span>{filteredRequests.length} community queries found</span>
          <span>Open for peer contributions</span>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map(req => {
              const isFulfilled = req.status === 'fulfilled'
              const isInReview = req.status === 'in_review' || (req.pendingResponsesCount && req.pendingResponsesCount > 0)
              const reqType = (req.request_type || 'pyq').toLowerCase()

              const formattedReqDate = req.created_at
                ? new Date(req.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })
                : ''

              return (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-lg space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: Type Badge, Year/Exam, Status */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Request Type Badge */}
                        {reqType === 'study_material' ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <BookOpen className="w-2.5 h-2.5" /> Notes
                          </span>
                        ) : reqType === 'doubt' ? (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                            <HelpCircle className="w-2.5 h-2.5" /> Doubt
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                            <FileText className="w-2.5 h-2.5" /> PYQ
                          </span>
                        )}

                        <span className="px-2 py-0.5 rounded-md text-[10px] font-mono text-white bg-prevu-bg border border-prevu-surface-light">
                          {req.exam_type} • {req.exam_year}
                        </span>
                      </div>

                      {/* Status Badges */}
                      {isFulfilled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                          <CheckCircle className="w-3 h-3" /> Fulfilled
                        </span>
                      ) : isInReview ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase" title="A batchmate has submitted help! Under Admin review.">
                          <Clock className="w-3 h-3 animate-spin" /> In Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                          <Clock className="w-3 h-3" /> Open
                        </span>
                      )}
                    </div>

                    {/* Subject & Submitter Info */}
                    <div>
                      <h4 className="text-base font-bold text-white line-clamp-2">
                        {req.subject_name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-prevu-text-muted mt-1">
                        <span>Sem {req.semester}</span>
                        <span>•</span>
                        <span>@{req.users?.username || req.users?.name || 'student'}</span>
                        {req.users?.cu_verified && (
                          <span className="text-[9px] font-bold text-cyan-400 font-mono">CU</span>
                        )}
                        {formattedReqDate && (
                          <>
                            <span>•</span>
                            <span className="font-mono">{formattedReqDate}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Specific Details / Note */}
                    {req.note && (
                      <p className="text-xs text-prevu-text-muted/90 bg-prevu-bg/60 p-2.5 rounded-xl border border-prevu-surface-light/60 italic line-clamp-3">
                        &ldquo;{req.note}&rdquo;
                      </p>
                    )}

                    {/* Verification & Help Status Notice Box */}
                    {isInReview && !isFulfilled && (
                      <div className="p-2.5 rounded-xl bg-cyan-950/25 border border-cyan-500/30 text-[11px] text-cyan-200 flex items-start gap-2">
                        <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <strong>Help Submitted!</strong> A batchmate has shared material for this query. It is currently under Admin Department verification.
                        </div>
                      </div>
                    )}

                    {/* Verified Responses Section (if fulfilled) */}
                    {isFulfilled && req.approvedResponses && req.approvedResponses.length > 0 && (
                      <div className="pt-2 border-t border-prevu-surface-light/60 space-y-2">
                        <button
                          onClick={() => setExpandedRequestId(expandedRequestId === req.id ? null : req.id)}
                          className="w-full text-left text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center justify-between py-1 cursor-pointer"
                        >
                          <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>View Verified Material ({req.approvedResponses.length})</span>
                          </span>
                          {expandedRequestId === req.id ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {expandedRequestId === req.id && (
                          <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2 text-xs animate-fade-in">
                            {req.approvedResponses.map(resp => (
                              <div key={resp.id} className="space-y-1.5">
                                <div className="flex items-center justify-between text-[11px] text-prevu-text-muted">
                                  <span>Shared by @{resp.users?.username || resp.users?.name || 'batchmate'}</span>
                                  <span className="text-emerald-400 font-bold font-mono">Verified</span>
                                </div>

                                {resp.file_path && (() => {
                                  let filesList = [{ name: resp.file_name || 'Verified Question Paper / Document', idx: 0 }]
                                  if (resp.file_path.startsWith('[')) {
                                    try {
                                      const parsed = JSON.parse(resp.file_path)
                                      filesList = parsed.map((item: any, i: number) => ({
                                        name: item.name || `File ${i + 1}`,
                                        idx: i
                                      }))
                                    } catch {}
                                  }
                                  return (
                                    <div className="space-y-1">
                                      {filesList.map((fItem, fIdx) => (
                                        <a
                                          key={fIdx}
                                          href={`/api/responses/preview/${resp.id}?fileIndex=${fItem.idx}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex items-center justify-between p-2 rounded-lg bg-prevu-bg border border-emerald-500/30 text-white hover:border-emerald-500 transition-colors"
                                        >
                                          <span className="flex items-center gap-1.5 truncate">
                                            <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                            <span className="truncate text-xs font-medium">{fItem.name}</span>
                                          </span>
                                          <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                                        </a>
                                      ))}
                                    </div>
                                  )
                                })()}

                                {resp.external_link && (
                                  <a
                                    href={resp.external_link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-between p-2 rounded-lg bg-prevu-bg border border-cyan-500/30 text-white hover:border-cyan-500 transition-colors"
                                  >
                                    <span className="flex items-center gap-1.5 truncate">
                                      <ExternalLink className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                                      <span className="truncate text-xs font-medium">External Study Resource</span>
                                    </span>
                                    <ExternalLink className="w-3 h-3 text-cyan-400 shrink-0 ml-1" />
                                  </a>
                                )}

                                {resp.message && (
                                  <p className="p-2 rounded-lg bg-prevu-bg/80 text-[11px] text-prevu-text whitespace-pre-line border border-prevu-surface-light">
                                    {resp.message}
                                  </p>
                                )}

                                {resp.admin_note && (
                                  <div className="flex items-start gap-1.5 p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] text-emerald-300">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <div>
                                      <span className="font-bold text-emerald-200">Admin Department Remark: </span>
                                      <span>{resp.admin_note}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 border-t border-prevu-surface-light/60 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      {/* Upvote Button */}
                      <button
                        onClick={() => handleUpvote(req.id)}
                        disabled={upvotingId === req.id || isFulfilled}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          req.hasUpvoted
                            ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/30'
                            : 'bg-prevu-bg hover:bg-prevu-surface-light text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                        } ${isFulfilled ? 'opacity-60 cursor-not-allowed' : ''}`}
                      >
                        <ThumbsUp className={`w-3.5 h-3.5 ${req.hasUpvoted ? 'fill-current' : ''}`} />
                        <span>{req.upvotes || 0}</span>
                      </button>

                      {/* Pledge Extra Bounty */}
                      {!isFulfilled && (
                        <button
                          onClick={() => handlePledgeBounty(req.id)}
                          title="Pledge +15 XP bounty to incentivize quick upload"
                          className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all cursor-pointer"
                        >
                          <Flame className="w-3 h-3 text-amber-400" />
                          <span>+15</span>
                        </button>
                      )}
                    </div>

                    {/* Batchmate Help Action Button */}
                    {!isFulfilled ? (
                      <Button
                        size="sm"
                        onClick={() => handleOpenHelpModal(req)}
                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs h-8 px-3 shadow-md shadow-purple-600/20"
                      >
                        <Upload className="w-3.5 h-3.5 mr-1" />
                        <span>Help Batchmate</span>
                      </Button>
                    ) : (
                      <span className="text-[11px] font-mono font-bold text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Solved
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-12 text-center rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light space-y-3 max-w-md mx-auto">
            <HelpCircle className="w-8 h-8 text-prevu-accent mx-auto" />
            <h4 className="text-sm font-bold text-white">No active requests matching filters</h4>
            <p className="text-xs text-prevu-text-muted">
              Can&apos;t find what you need? Be the first to raise a question paper or study material request for your batchmates!
            </p>
            <Button
              size="sm"
              onClick={handleOpenCreateRequest}
              className="mt-2 text-xs bg-prevu-accent text-white font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Raise Request
            </Button>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 1. AUTHENTICATION REQUIRED MODAL (Requirement #1) */}
      {/* ============================================================ */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#11111a] border border-purple-500/40 shadow-2xl space-y-5 text-center relative">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center mx-auto text-purple-300">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">
                Create Your Prevu ID to Proceed
              </h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                To {authModalActionText}, you need to make your student ID on Prevu. This keeps our Chandigarh University community authentic and trusted!
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-purple-950/30 border border-purple-500/30 text-xs text-purple-200 text-left space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-white">
                <Sparkles className="w-3.5 h-3.5 text-purple-400" /> Why create an ID?
              </div>
              <ul className="text-[11px] text-prevu-text-muted space-y-1 pl-4 list-disc">
                <li>Your batchmates can help answer your questions & PYQs</li>
                <li>Receive alerts when your materials are verified by admin</li>
                <li>Earn XP and contributor recognition on the leaderboard</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                asChild
                className="w-full bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light text-white font-bold h-10 shadow-lg shadow-purple-600/30"
              >
                <Link href={`/signup?redirect=${encodeURIComponent('/requests?action=new')}`}>
                  <span>Register Free on Prevu</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full border-prevu-surface-light text-prevu-text-muted hover:text-white h-10"
              >
                <Link href={`/login?redirect=${encodeURIComponent('/requests?action=new')}`}>
                  <span>Already have an account? Sign In</span>
                </Link>
              </Button>
            </div>

            <button
              onClick={() => setAuthModalOpen(false)}
              className="text-xs text-prevu-text-muted hover:text-white cursor-pointer mt-1"
            >
              Maybe later
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 2. CREATE REQUEST MODAL (PYQ / Study Material / Doubt) */}
      {/* ============================================================ */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-prevu-surface border border-prevu-surface-light rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Raise a Community Request
                </h3>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  Request question papers, study materials, or ask doubts to your batchmates.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-prevu-text-muted hover:text-white text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              {/* Category Selection */}
              <div>
                <label className="block text-prevu-text-muted font-medium mb-1.5">
                  What are you requesting? *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'pyq', label: 'Question Paper', desc: 'MST / EST papers', icon: <FileText className="w-3.5 h-3.5 text-purple-400" /> },
                    { id: 'study_material', label: 'Study Material', desc: 'Notes / Blueprint', icon: <BookOpen className="w-3.5 h-3.5 text-emerald-400" /> },
                    { id: 'doubt', label: 'Academic Doubt', desc: 'Problem / Question', icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" /> }
                  ].map(cat => (
                    <button
                      type="button"
                      key={cat.id}
                      onClick={() => setFormRequestType(cat.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        formRequestType === cat.id
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                          : 'bg-prevu-bg border-prevu-surface-light text-prevu-text-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        {cat.icon}
                        <span className="text-xs">{cat.label}</span>
                      </div>
                      <p className="text-[10px] text-prevu-text-muted mt-0.5">{cat.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">
                  Subject Name *
                </label>
                <Input
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  placeholder="e.g. Operating Systems / Data Structures"
                  required
                  className="bg-prevu-bg border-prevu-surface-light text-white text-xs h-9"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">
                    Semester *
                  </label>
                  <select
                    value={formSemester}
                    onChange={e => setFormSemester(e.target.value)}
                    className="w-full h-9 bg-prevu-bg border border-prevu-surface-light rounded-xl px-2.5 text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">
                    Exam / Format *
                  </label>
                  <select
                    value={formExamType}
                    onChange={e => setFormExamType(e.target.value)}
                    className="w-full h-9 bg-prevu-bg border border-prevu-surface-light rounded-xl px-2.5 text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="MST1">MST-1</option>
                    <option value="MST2">MST-2</option>
                    <option value="EST">EST</option>
                    <option value="NOTES">Topper Notes</option>
                    <option value="SYLLABUS">Blueprint/Syllabus</option>
                    <option value="DOUBT">Specific Question</option>
                  </select>
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">
                    Academic Year *
                  </label>
                  <Input
                    type="number"
                    value={formYear}
                    onChange={e => setFormYear(e.target.value)}
                    min={2018}
                    max={2026}
                    required
                    className="bg-prevu-bg border-prevu-surface-light text-white text-xs h-9"
                  />
                </div>
              </div>

              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">
                  Specific Details / Question (optional)
                </label>
                <textarea
                  value={formNote}
                  onChange={e => setFormNote(e.target.value)}
                  placeholder="e.g. Looking for Set B question paper, or Unit 3 formula notes..."
                  rows={3}
                  className="w-full bg-prevu-bg border border-prevu-surface-light rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {modalError && (
                <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300">
                  {modalError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-prevu-surface-light">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={submitting}
                  className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {submitting ? 'Posting...' : 'Post Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 3. HELP BATCHMATE MODAL (Requirement #2) */}
      {/* ============================================================ */}
      {helpModalOpen && selectedReqForHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-prevu-surface border border-purple-500/40 rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {selectedReqForHelp.request_type || 'pyq'}
                  </span>
                  <h3 className="text-base font-bold text-white">
                    Help Batchmate: {selectedReqForHelp.subject_name}
                  </h3>
                </div>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  Semester {selectedReqForHelp.semester} • {selectedReqForHelp.exam_type} ({selectedReqForHelp.exam_year})
                </p>
              </div>
              <button
                onClick={() => setHelpModalOpen(false)}
                className="text-prevu-text-muted hover:text-white text-xs p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Admin Verification Notice */}
            <div className="p-3 rounded-2xl bg-amber-950/25 border border-amber-500/30 text-xs text-amber-200 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Admin Verification Notice:</strong> Your shared material will be reviewed by the Admin Department before appearing publicly. Once verified, it will be published on the dashboard and you&apos;ll earn Karma XP!
              </div>
            </div>

            <form onSubmit={handleSubmitHelp} className="space-y-4 text-xs">
              {/* Submission Mode Selection */}
              <div>
                <label className="block text-prevu-text-muted font-medium mb-1.5">
                  How would you like to help? *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'file', label: 'Upload File', desc: 'PDF, JPG scan', icon: <Upload className="w-3.5 h-3.5" /> },
                    { id: 'link', label: 'Cloud Link', desc: 'Drive / OneDrive', icon: <ExternalLink className="w-3.5 h-3.5" /> },
                    { id: 'answer', label: 'Write Answer', desc: 'Type notes / doubt', icon: <MessageCircle className="w-3.5 h-3.5" /> }
                  ].map(opt => (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => setHelpResponseType(opt.id as any)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        helpResponseType === opt.id
                          ? 'bg-purple-600/20 border-purple-500 text-white shadow-sm'
                          : 'bg-prevu-bg border-prevu-surface-light text-prevu-text-muted hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        {opt.icon}
                        <span className="text-xs">{opt.label}</span>
                      </div>
                      <p className="text-[10px] text-prevu-text-muted mt-0.5">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mode 1: File Upload (Supports 1 to 3 files at once) */}
              {helpResponseType === 'file' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-prevu-text-muted font-medium">
                      Select Document / Scanned Papers (1 to 3 files) *
                    </label>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {helpFiles.length} / 3 Files
                    </span>
                  </div>

                  {helpFiles.length > 0 && (
                    <div className="space-y-1.5 p-2.5 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light">
                      {helpFiles.map((f, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-2 rounded-lg bg-prevu-surface/60 border border-purple-500/30 text-xs"
                        >
                          <span className="truncate max-w-[240px] text-white">
                            #{idx + 1}: {f.name} ({(f.size / (1024 * 1024)).toFixed(2)} MB)
                          </span>
                          <button
                            type="button"
                            onClick={() => setHelpFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="text-prevu-text-muted hover:text-red-400 font-bold ml-2 cursor-pointer"
                            title="Remove file"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {helpFiles.length < 3 ? (
                    <div>
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.zip"
                        onChange={e => {
                          const incoming = Array.from(e.target.files || [])
                          setHelpFiles(prev => {
                            const combined = [...prev, ...incoming]
                            return combined.slice(0, 3)
                          })
                          e.target.value = ''
                        }}
                        className="w-full text-xs text-prevu-text-muted file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500 cursor-pointer bg-prevu-bg p-2 rounded-xl border border-prevu-surface-light"
                      />
                      <p className="text-[10px] text-prevu-text-muted mt-1">
                        💡 You can select up to 3 files at once (e.g. Page 1, Page 2, Page 3).
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-purple-300 font-medium">
                      Maximum 3 files selected.
                    </p>
                  )}
                </div>
              )}

              {/* Mode 2: External Link */}
              {helpResponseType === 'link' && (
                <div className="space-y-1.5">
                  <label className="block text-prevu-text-muted font-medium">
                    Google Drive, OneDrive, or Document Link *
                  </label>
                  <Input
                    type="url"
                    value={helpLink}
                    onChange={e => setHelpLink(e.target.value)}
                    placeholder="https://drive.google.com/file/d/..."
                    required
                    className="bg-prevu-bg border-prevu-surface-light text-white text-xs h-9"
                  />
                  <p className="text-[10px] text-prevu-text-muted">
                    Make sure link sharing is set to &ldquo;Anyone with the link can view&rdquo;.
                  </p>
                </div>
              )}

              {/* Mode 3 or Note: Solution & Message */}
              <div className="space-y-1.5">
                <label className="block text-prevu-text-muted font-medium">
                  {helpResponseType === 'answer' ? 'Solution / Notes *' : 'Note to Batchmate & Admin (optional)'}
                </label>
                <textarea
                  value={helpMessage}
                  onChange={e => setHelpMessage(e.target.value)}
                  placeholder={
                    helpResponseType === 'answer'
                      ? 'Write your solution, explanation, or key formulas here...'
                      : 'e.g. Here is the 2024 MST-1 paper with answers...'
                  }
                  rows={helpResponseType === 'answer' ? 5 : 2}
                  required={helpResponseType === 'answer'}
                  className="w-full bg-prevu-bg border border-prevu-surface-light rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {helpError && (
                <div className="p-2.5 rounded-xl bg-red-950/30 border border-red-500/30 text-xs text-red-300">
                  {helpError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-prevu-surface-light">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setHelpModalOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={helpSubmitting}
                  className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold"
                >
                  {helpSubmitting ? 'Uploading & Notifying...' : 'Submit for Admin Approval'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 4. CELEBRATORY NOTIFICATION MODAL (Requirement #2 Feedback) */}
      {/* ============================================================ */}
      {successNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#11111a] border border-emerald-500/40 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-white">
                {successNotice.title}
              </h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                {successNotice.message}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>You will receive an in-app notification when the status updates!</span>
            </div>

            <Button
              onClick={() => setSuccessNotice(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 shadow-lg shadow-emerald-600/25"
            >
              Got It, Thanks!
            </Button>
          </div>
        </div>
      )}

      {/* Study Buddy Matchmaker Modal */}
      <StudyBuddyModal
        isOpen={buddyModalOpen}
        onClose={() => setBuddyModalOpen(false)}
      />
    </div>
  )
}
