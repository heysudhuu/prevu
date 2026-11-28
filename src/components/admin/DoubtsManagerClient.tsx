'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  CheckCircle2,
  Pin,
  PinOff,
  EyeOff,
  Eye,
  Trash2,
  Send,
  Search,
  ExternalLink,
  AlertTriangle,
  CornerDownRight,
  Clock,
  CheckCheck,
  RotateCcw,
  Loader2,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { AdminDoubtThread, AdminDoubtsPayload } from '@/app/admin/doubts/actions'
import {
  replyToStudentDoubt,
  updateDoubtStatus,
  togglePinDoubt,
  deleteDoubtThread
} from '@/app/admin/doubts/actions'
import type { DoubtStatus } from '@/app/api/comments/actions'

type FilterTab = 'all' | 'open' | 'answered' | 'resolved' | 'pinned' | 'hidden'

interface DoubtsManagerClientProps {
  initialData: AdminDoubtsPayload
  adminName?: string
  adminEmail?: string
}

export default function DoubtsManagerClient({
  initialData,
  adminEmail = 'admin@prevu.app'
}: DoubtsManagerClientProps) {
  const [threads, setThreads] = useState<AdminDoubtThread[]>(initialData.threads)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all')
  const [semesterFilter, setSemesterFilter] = useState<number | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})
  const [busyId, setBusyId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4500)
  }

  // Metrics summary
  const stats = useMemo(() => {
    const total = threads.length
    const open = threads.filter(t => t.status === 'open').length
    const resolved = threads.filter(t => t.status === 'resolved' || t.status === 'answered').length
    const pinned = threads.filter(t => t.is_pinned).length
    return { total, open, resolved, pinned }
  }, [threads])

  // Filtered list
  const filteredThreads = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return threads.filter((t) => {
      if (activeFilter === 'open' && t.status !== 'open') return false
      if (activeFilter === 'answered' && t.status !== 'answered') return false
      if (activeFilter === 'resolved' && t.status !== 'resolved') return false
      if (activeFilter === 'pinned' && !t.is_pinned) return false
      if (activeFilter === 'hidden' && t.status !== 'hidden') return false

      if (semesterFilter !== 'ALL' && t.resource.semester !== semesterFilter) return false

      if (!q) return true
      const inComment = t.comment.toLowerCase().includes(q)
      const inReplies = t.replies.some(r => r.comment.toLowerCase().includes(q))
      const inUser = (t.user.username || '').toLowerCase().includes(q) || (t.user.name || '').toLowerCase().includes(q)
      const inResource =
        (t.resource.subject_name || '').toLowerCase().includes(q) ||
        (t.resource.subject_code || '').toLowerCase().includes(q) ||
        (t.resource.title || '').toLowerCase().includes(q)

      return inComment || inReplies || inUser || inResource
    })
  }, [threads, activeFilter, semesterFilter, searchQuery])

  const handleSendReply = async (thread: AdminDoubtThread, markResolved: boolean) => {
    const draft = (replyDrafts[thread.id] || '').trim()
    if (draft.length < 2) {
      showToast('error', 'Please enter a reply of at least 2 characters.')
      return
    }

    setBusyId(thread.id)
    const res = await replyToStudentDoubt({
      parentId: thread.id,
      resourceId: thread.resource_id,
      replyText: draft,
      markResolved
    })
    setBusyId(null)

    if (res.error) {
      showToast('error', res.error)
      return
    }

    if (res.reply) {
      setThreads(prev =>
        prev.map(t =>
          t.id === thread.id
            ? {
                ...t,
                status: res.status || (markResolved ? 'resolved' : 'answered'),
                replies: [
                  ...t.replies,
                  {
                    id: res.reply!.id,
                    resource_id: res.reply!.resource_id,
                    user_id: res.reply!.user_id,
                    comment: res.reply!.comment,
                    parent_id: thread.id,
                    created_at: res.reply!.created_at,
                    user: {
                      id: res.reply!.user_id,
                      name: 'Prevu Admin',
                      username: adminEmail.split('@')[0],
                      cu_verified: true,
                      role: 'admin'
                    }
                  }
                ]
              }
            : t
        )
      )
      setReplyDrafts(prev => ({ ...prev, [thread.id]: '' }))
      showToast('success', markResolved ? 'Official answer posted & doubt marked resolved.' : 'Official reply posted.')
    }
  }

  const handleStatusChange = async (commentId: string, status: DoubtStatus) => {
    setBusyId(commentId)
    const res = await updateDoubtStatus({ commentId, status })
    setBusyId(null)

    if (res.error) {
      showToast('error', res.error)
      return
    }

    setThreads(prev => prev.map(t => (t.id === commentId ? { ...t, status } : t)))
    showToast('success', `Doubt marked as ${status}.`)
  }

  const handleTogglePin = async (thread: AdminDoubtThread) => {
    const nextPin = !thread.is_pinned
    setBusyId(thread.id)
    const res = await togglePinDoubt({ commentId: thread.id, isPinned: nextPin })
    setBusyId(null)

    if (res.error) {
      showToast('error', res.error)
      return
    }

    setThreads(prev =>
      prev
        .map(t => (t.id === thread.id ? { ...t, is_pinned: nextPin } : t))
        .sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned))
    )
    showToast('success', nextPin ? 'Doubt pinned to top of paper thread.' : 'Doubt unpinned.')
  }

  const handleDelete = async (commentId: string, isReply = false, parentId?: string) => {
    setBusyId(commentId)
    const res = await deleteDoubtThread(commentId)
    setBusyId(null)

    if (res.error) {
      showToast('error', res.error)
      return
    }

    if (isReply && parentId) {
      setThreads(prev =>
        prev.map(t =>
          t.id === parentId
            ? { ...t, replies: t.replies.filter(r => r.id !== commentId) }
            : t
        )
      )
      showToast('success', 'Reply deleted.')
    } else {
      setThreads(prev => prev.filter(t => t.id !== commentId))
      showToast('success', 'Doubt thread deleted.')
    }
  }

  const getStatusBadge = (status: DoubtStatus) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
      case 'answered':
        return 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
      case 'hidden':
        return 'bg-zinc-700/40 text-zinc-300 border-zinc-600/50'
      default:
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 mb-2">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Academic Doubt Resolution Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Student Doubts &amp; Discussions
          </h1>
          <p className="text-xs text-prevu-text-muted mt-1">
            Monitor per-document student questions, post verified admin solutions, pin top answers, and moderate threads.
          </p>
        </div>
      </div>

      {/* Migration Notice Banner (only if extended SQL hasn't been run yet) */}
      {(initialData.migrationPending || initialData.tableMissing) && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/35 flex items-start gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold text-amber-300">
              {initialData.tableMissing
                ? 'paper_comments table not initialized yet'
                : 'Optional Doubt Moderation columns pending'}
            </p>
            <p className="text-amber-200/80 leading-relaxed">
              Run <code className="px-1.5 py-0.5 rounded bg-black/40 font-mono text-amber-300">supabase_paper_doubts_migration.sql</code> in your Supabase SQL Editor to enable Resolve, Pin, and Hide controls. Replying and viewing doubts work right away.
            </p>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`p-3.5 rounded-2xl border text-xs font-medium flex items-center justify-between ${
            toast.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300'
              : 'bg-red-500/15 border-red-500/35 text-red-300'
          }`}
        >
          <span>{toast.message}</span>
          <button type="button" onClick={() => setToast(null)} className="text-[11px] opacity-80 hover:opacity-100 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Summary Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-prevu-surface border border-prevu-surface-light">
          <div className="text-xs text-prevu-text-muted">Total Doubts</div>
          <div className="text-2xl font-black font-mono text-white mt-1">{stats.total}</div>
          <div className="text-[11px] text-prevu-text-muted mt-0.5">Across all papers</div>
        </div>
        <div className="p-4 rounded-2xl bg-prevu-surface border border-amber-500/25">
          <div className="text-xs text-amber-300/90">Needs Answer</div>
          <div className="text-2xl font-black font-mono text-amber-400 mt-1">{stats.open}</div>
          <div className="text-[11px] text-amber-400/70 mt-0.5">Open student questions</div>
        </div>
        <div className="p-4 rounded-2xl bg-prevu-surface border border-emerald-500/25">
          <div className="text-xs text-emerald-300/90">Answered / Resolved</div>
          <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{stats.resolved}</div>
          <div className="text-[11px] text-emerald-400/70 mt-0.5">Completed threads</div>
        </div>
        <div className="p-4 rounded-2xl bg-prevu-surface border border-purple-500/25">
          <div className="text-xs text-purple-300/90">Pinned Top Answers</div>
          <div className="text-2xl font-black font-mono text-purple-300 mt-1">{stats.pinned}</div>
          <div className="text-[11px] text-purple-300/70 mt-0.5">Highlighted on papers</div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-prevu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search doubts by question text, @username, subject name, or code..."
              className="w-full pl-10 pr-4 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-purple-500"
            />
          </div>

          <select
            value={semesterFilter}
            onChange={e => setSemesterFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
            className="px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
              <option key={s} value={s}>Semester {s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-prevu-surface-light/60">
          {(
            [
              { id: 'all', label: `All (${threads.length})` },
              { id: 'open', label: `Needs Answer (${stats.open})` },
              { id: 'answered', label: 'Answered' },
              { id: 'resolved', label: 'Resolved' },
              { id: 'pinned', label: `Pinned (${stats.pinned})` },
              { id: 'hidden', label: 'Hidden' }
            ] as { id: FilterTab; label: string }[]
          ).map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/25'
                  : 'bg-prevu-bg text-prevu-text-muted hover:text-white border border-prevu-surface-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Doubt Threads Feed */}
      {filteredThreads.length === 0 ? (
        <div className="p-12 rounded-3xl bg-prevu-surface border border-prevu-surface-light text-center space-y-2">
          <MessageSquare className="w-10 h-10 text-prevu-text-muted mx-auto" />
          <h3 className="text-base font-bold text-white">No student doubts match this filter</h3>
          <p className="text-xs text-prevu-text-muted max-w-md mx-auto">
            {threads.length === 0
              ? 'Once students ask doubts inside any paper modal, every real question will appear here for you to answer and moderate.'
              : 'Try switching filter tabs or clearing your search query.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredThreads.map((thread) => {
            const isBusy = busyId === thread.id
            const draft = replyDrafts[thread.id] || ''

            return (
              <div
                key={thread.id}
                className={`p-5 rounded-3xl bg-prevu-surface border space-y-4 shadow-xl transition-all ${
                  thread.is_pinned
                    ? 'border-amber-500/40'
                    : thread.status === 'open'
                      ? 'border-prevu-surface-light'
                      : 'border-prevu-surface-light/70'
                }`}
              >
                {/* Linked Document Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-prevu-surface-light/60">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-prevu-bg border border-prevu-surface-light text-cyan-300">
                      <FileText className="w-3 h-3" />
                      {thread.resource.subject_code || 'PAPER'}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {thread.resource.subject_name || thread.resource.title}
                    </span>
                    {thread.resource.exam_type && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/25">
                        {thread.resource.exam_type}
                      </span>
                    )}
                    {thread.resource.semester && (
                      <span className="text-[11px] font-mono text-prevu-text-muted">
                        Sem {thread.resource.semester}
                      </span>
                    )}
                    {thread.resource.exam_year && (
                      <span className="text-[11px] font-mono text-prevu-text-muted">
                        • {thread.resource.exam_year}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {thread.is_pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        <Pin className="w-3 h-3" /> PINNED
                      </span>
                    )}
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getStatusBadge(thread.status)}`}>
                      {thread.status}
                    </span>
                    <Link
                      href={`/paper/${thread.resource_id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-prevu-bg hover:bg-prevu-surface-light border border-prevu-surface-light text-cyan-300 transition-colors"
                    >
                      <span>View Paper</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Student Question Body */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{thread.user.name}</span>
                      <span className="font-mono text-prevu-accent">@{thread.user.username || 'student'}</span>
                      {thread.user.cu_verified && (
                        <span className="text-emerald-400 flex items-center gap-0.5 text-[10px] font-mono">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-prevu-text-muted flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(thread.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-prevu-bg/80 border border-prevu-surface-light text-xs sm:text-sm text-prevu-text leading-relaxed whitespace-pre-wrap">
                    {thread.comment}
                  </div>
                </div>

                {/* Replies Thread */}
                {thread.replies.length > 0 && (
                  <div className="pl-4 border-l-2 border-purple-500/35 space-y-2">
                    {thread.replies.map(reply => (
                      <div
                        key={reply.id}
                        className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light/70 space-y-1.5"
                      >
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <div className="flex items-center gap-1.5">
                            <CornerDownRight className="w-3.5 h-3.5 text-purple-400" />
                            <span className="font-bold text-white">{reply.user.name}</span>
                            <span className="font-mono text-prevu-text-muted">@{reply.user.username || 'user'}</span>
                            {(reply.user.role === 'admin' || reply.user.role === 'super_admin') && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                Official Admin
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 font-mono text-[10px] text-prevu-text-muted">
                            <span>{new Date(reply.created_at).toLocaleString()}</span>
                            <button
                              type="button"
                              disabled={busyId === reply.id}
                              onClick={() => handleDelete(reply.id, true, thread.id)}
                              className="text-prevu-text-muted hover:text-red-400 p-1 cursor-pointer"
                              title="Delete reply"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <p className="text-xs text-prevu-text leading-relaxed whitespace-pre-wrap pl-5">
                          {reply.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Inline Admin Reply Box & Moderation Toolbar */}
                <div className="pt-2 space-y-3 border-t border-prevu-surface-light/60">
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={draft}
                      onChange={e => setReplyDrafts(prev => ({ ...prev, [thread.id]: e.target.value }))}
                      placeholder="Write an official admin solution or clarification..."
                      className="flex-1 px-3.5 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-purple-500"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        type="button"
                        size="sm"
                        disabled={isBusy || !draft.trim()}
                        onClick={() => handleSendReply(thread, true)}
                        className="h-9 px-3 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                      >
                        {isBusy ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : <CheckCheck className="w-3.5 h-3.5 mr-1" />}
                        <span>Reply &amp; Resolve</span>
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isBusy || !draft.trim()}
                        onClick={() => handleSendReply(thread, false)}
                        className="h-9 px-3 text-xs font-semibold border-prevu-surface-light hover:border-purple-500/40 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 mr-1" />
                        <span>Reply</span>
                      </Button>
                    </div>
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleTogglePin(thread)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-prevu-bg hover:bg-prevu-surface-light border border-prevu-surface-light text-[11px] font-semibold text-amber-300 cursor-pointer"
                      >
                        {thread.is_pinned ? <PinOff className="w-3 h-3" /> : <Pin className="w-3 h-3" />}
                        <span>{thread.is_pinned ? 'Unpin' : 'Pin Answer'}</span>
                      </button>

                      {thread.status !== 'resolved' ? (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusChange(thread.id, 'resolved')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-prevu-bg hover:bg-prevu-surface-light border border-prevu-surface-light text-[11px] font-semibold text-emerald-300 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Resolved</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusChange(thread.id, 'open')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-prevu-bg hover:bg-prevu-surface-light border border-prevu-surface-light text-[11px] font-semibold text-cyan-300 cursor-pointer"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Reopen</span>
                        </button>
                      )}

                      {thread.status !== 'hidden' ? (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusChange(thread.id, 'hidden')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-prevu-bg hover:bg-prevu-surface-light border border-prevu-surface-light text-[11px] font-semibold text-prevu-text-muted hover:text-white cursor-pointer"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>Hide</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleStatusChange(thread.id, 'open')}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-prevu-bg hover:bg-prevu-surface-light border border-prevu-surface-light text-[11px] font-semibold text-cyan-300 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Unhide</span>
                        </button>
                      )}
                    </div>

                    <button
                      type="button"
                      disabled={isBusy}
                      onClick={() => handleDelete(thread.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-[11px] font-semibold text-red-300 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Thread</span>
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
