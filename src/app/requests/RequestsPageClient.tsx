'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Plus, 
  ThumbsUp, 
  Search, 
  Upload, 
  CheckCircle, 
  Clock, 
  Sparkles, 
  HelpCircle
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toggleRequestUpvote } from './actions'
import { createPaperRequest } from '@/app/dashboard/actions'

export interface CommunityRequestItem {
  id: number
  subject_name: string
  exam_type: string
  exam_year: number
  semester: number
  note?: string
  status: string
  created_at: string
  upvotes: number
  hasUpvoted?: boolean
  users?: {
    id: string
    name: string
    username?: string
    cu_verified?: boolean
  }
}

interface RequestsPageClientProps {
  initialRequests: CommunityRequestItem[]
  prefillSubject?: string
  prefillExamType?: string
  openNewModal?: boolean
}

export default function RequestsPageClient({
  initialRequests,
  prefillSubject = '',
  prefillExamType = 'MST1',
  openNewModal = false
}: RequestsPageClientProps) {
  const [requests, setRequests] = useState<CommunityRequestItem[]>(initialRequests)
  const [searchQuery, setSearchQuery] = useState('')
  const [semFilter, setSemFilter] = useState<number | 'ALL'>('ALL')
  const [typeFilter, setTypeFilter] = useState<string>('ALL')
  const [statusFilter, setStatusFilter] = useState<string>('open')
  const [upvotingId, setUpvotingId] = useState<number | null>(null)

  // New Request Modal state
  const [modalOpen, setModalOpen] = useState(openNewModal)
  const [submitting, setSubmitting] = useState(false)
  const [modalError, setModalError] = useState<string | null>(null)

  const [formSubject, setFormSubject] = useState(prefillSubject)
  const [formExamType, setFormExamType] = useState(prefillExamType)
  const [formYear, setFormYear] = useState('2025')
  const [formSemester, setFormSemester] = useState('1')
  const [formNote, setFormNote] = useState('')

  const handleUpvote = async (requestId: number) => {
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

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setModalError(null)

    const formData = new FormData()
    formData.append('subject_name', formSubject)
    formData.append('exam_type', formExamType)
    formData.append('exam_year', formYear)
    formData.append('semester', formSemester)
    formData.append('note', formNote)

    try {
      const res = await createPaperRequest(formData)
      if (res.success) {
        setModalOpen(false)
        setFormSubject('')
        setFormNote('')
        window.location.reload()
      } else if (res.error) {
        setModalError(res.error)
      }
    } catch {
      setModalError('Failed to create request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter(r => {
      const matchesSem = semFilter === 'ALL' || r.semester === semFilter
      const matchesType = typeFilter === 'ALL' || r.exam_type?.toUpperCase() === typeFilter
      const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter
      const term = searchQuery.trim().toLowerCase()
      const matchesSearch = !term ||
        r.subject_name?.toLowerCase().includes(term) ||
        r.note?.toLowerCase().includes(term) ||
        String(r.exam_year || '').includes(term)

      return matchesSem && matchesType && matchesStatus && matchesSearch
    })
  }, [requests, semFilter, typeFilter, statusFilter, searchQuery])

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Community Requests' }
        ]}
        badge={{ text: 'Paper Bounty Board', variant: 'purple' }}
        title="Community Question Paper Requests"
        description="Can't find a paper in the vault? Post a request or upvote missing papers. When an uploader contributes the paper, it becomes instantly available."
        actions={
          <Button
            size="sm"
            onClick={() => setModalOpen(true)}
            className="bg-prevu-accent text-white font-bold shadow-lg shadow-prevu-accent/25"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Request a Paper
          </Button>
        }
      />

      {/* Control & Filter Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
            <Input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search requested subjects or years..."
              className="pl-9 h-9 text-xs bg-prevu-bg border-prevu-surface-light text-white"
            />
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1.5 shrink-0">
            {['open', 'fulfilled', 'ALL'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-prevu-accent text-white shadow-md'
                    : 'bg-prevu-bg text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                }`}
              >
                {st === 'ALL' ? 'All Statuses' : st}
              </button>
            ))}
          </div>
        </div>

        {/* Filter chips: Semester & Exam Type */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-prevu-surface-light/60">
          <span className="text-[11px] font-mono text-prevu-text-muted uppercase">Semester:</span>
          {['ALL', 1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <button
              key={sem}
              onClick={() => setSemFilter(sem as number | 'ALL')}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-mono transition-colors ${
                semFilter === sem
                  ? 'bg-prevu-surface-light text-white font-bold border border-prevu-accent/50'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              {sem === 'ALL' ? 'All' : `Sem ${sem}`}
            </button>
          ))}

          <span className="text-prevu-surface-light mx-1">|</span>

          <span className="text-[11px] font-mono text-prevu-text-muted uppercase">Type:</span>
          {['ALL', 'MST1', 'MST2', 'EST'].map(type => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-2.5 py-0.5 rounded-lg text-xs font-mono transition-colors ${
                typeFilter === type
                  ? 'bg-prevu-surface-light text-white font-bold border border-prevu-accent/50'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              {type === 'ALL' ? 'All' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-prevu-text-muted px-1 font-mono">
          <span>{filteredRequests.length} community requests found</span>
          <span>Sorted by urgency and upvotes</span>
        </div>

        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRequests.map(req => {
              const isFulfilled = req.status === 'fulfilled'
              const formattedReqDate = req.created_at
                ? new Date(req.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })
                : ''

              return (
                <div
                  key={req.id}
                  className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light hover:border-prevu-surface-light/80 transition-all flex flex-col justify-between shadow-lg space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                          {req.exam_type}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-white bg-prevu-bg border border-prevu-surface-light">
                          {req.exam_year}
                        </span>
                      </div>

                      {isFulfilled ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase">
                          <CheckCircle className="w-3 h-3" /> Fulfilled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase">
                          <Clock className="w-3 h-3" /> Open
                        </span>
                      )}
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white line-clamp-2">
                        {req.subject_name}
                      </h4>
                      <p className="text-xs font-mono text-prevu-text-muted mt-0.5">
                        Semester {req.semester} • Chandigarh University{formattedReqDate ? ` • ${formattedReqDate}` : ''}
                      </p>
                    </div>

                    {req.note && (
                      <p className="text-xs text-prevu-text-muted/90 bg-prevu-bg/60 p-2.5 rounded-xl border border-prevu-surface-light/60 italic line-clamp-3">
                        &ldquo;{req.note}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-prevu-surface-light/60 flex items-center justify-between gap-2">
                    {/* Upvote button */}
                    <button
                      onClick={() => handleUpvote(req.id)}
                      disabled={upvotingId === req.id || isFulfilled}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        req.hasUpvoted
                          ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/30'
                          : 'bg-prevu-bg hover:bg-prevu-surface-light text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                      } ${isFulfilled ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${req.hasUpvoted ? 'fill-current' : ''}`} />
                      <span>{req.upvotes || 0}</span>
                      <span className="text-[11px] font-normal hidden sm:inline">
                        {req.hasUpvoted ? 'Need this' : 'I Need This Too'}
                      </span>
                    </button>

                    {/* Upload fulfillment action */}
                    {!isFulfilled && (
                      <Link
                        href={`/upload?subject_name=${encodeURIComponent(req.subject_name)}&exam_type=${req.exam_type}&exam_year=${req.exam_year}&semester=${req.semester}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-prevu-accent/15 hover:bg-prevu-accent/25 text-prevu-accent border border-prevu-accent/30 transition-colors"
                      >
                        <Upload className="w-3.5 h-3.5" /> Upload It
                      </Link>
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
              Can&apos;t find what you need? Be the first to post a question paper request for your classmates!
            </p>
            <Button
              size="sm"
              onClick={() => setModalOpen(true)}
              className="mt-2 text-xs bg-prevu-accent text-white font-bold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" /> Post Request
            </Button>
          </div>
        )}
      </div>

      {/* Create Request Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-prevu-surface border border-prevu-surface-light rounded-3xl w-full max-w-lg p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-prevu-accent" />
                  Request Missing Question Paper
                </h3>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  Your request will appear on the community board for other students and faculty.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-prevu-text-muted hover:text-white text-xs p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">
                  Subject Name *
                </label>
                <Input
                  value={formSubject}
                  onChange={e => setFormSubject(e.target.value)}
                  placeholder="e.g. Database Management Systems"
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
                    className="w-full h-9 bg-prevu-bg border border-prevu-surface-light rounded-xl px-2.5 text-white text-xs focus:outline-none focus:border-prevu-accent"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">
                    Exam Type *
                  </label>
                  <select
                    value={formExamType}
                    onChange={e => setFormExamType(e.target.value)}
                    className="w-full h-9 bg-prevu-bg border border-prevu-surface-light rounded-xl px-2.5 text-white text-xs focus:outline-none focus:border-prevu-accent"
                  >
                    <option value="MST1">MST-1</option>
                    <option value="MST2">MST-2</option>
                    <option value="EST">EST</option>
                  </select>
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">
                    Exam Year *
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
                  Specific Details / Note (optional)
                </label>
                <textarea
                  value={formNote}
                  onChange={e => setFormNote(e.target.value)}
                  placeholder="e.g. Set A / Set B, or specific faculty question format..."
                  rows={3}
                  className="w-full bg-prevu-bg border border-prevu-surface-light rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-prevu-accent"
                />
              </div>

              {modalError && (
                <p className="text-xs text-rose-400">{modalError}</p>
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
                  className="text-xs bg-prevu-accent text-white font-bold"
                >
                  {submitting ? 'Submitting...' : 'Post Request'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
