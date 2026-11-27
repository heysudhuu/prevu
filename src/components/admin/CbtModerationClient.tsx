'use client'

import React, { useMemo, useState } from 'react'
import {
  CheckCircle2,
  Sparkles,
  Check,
  X,
  ArrowLeft,
  FileQuestion,
  GraduationCap,
  BookOpen,
  Search,
  Pencil,
  Plus,
  RotateCcw,
  Archive,
  AlertTriangle,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import {
  reviewCbtQuestion,
  reviewCbtSubject,
  saveAdminSubjectOverride,
  resetAdminSubjectOverride,
  saveAdminQuestionOverride,
  resetAdminQuestionOverride
} from '@/lib/cbt/actions'
import { mergeQuestionsWithOverrides, mergeSubjectsWithOverrides } from '@/lib/cbt/cbtRegistry'
import { CbtQuestionOverride, CbtQuestionReport, CbtSubjectOverride } from '@/lib/cbt/types'
import Link from 'next/link'

interface PendingCbtQuestion {
  id: number
  subject_code: string
  subject_name: string
  semester: number
  category: string
  question: string
  question_type: string
  options_json: { id: string; text: string }[]
  correct_answers: string[]
  explanation?: string
  unit_tag?: string
  created_at: string
  users?: {
    id: string
    name: string
    username: string
    cu_verified: boolean
  }
}

interface PendingCbtSubject {
  id: number
  code: string
  name: string
  semester: number
  category: string
  description?: string
  created_at: string
  users?: {
    id: string
    name: string
    username: string
    cu_verified: boolean
  }
}

interface CbtModerationClientProps {
  defaultTab?: 'manage-subjects' | 'manage-mcqs' | 'questions' | 'subjects'
  initialQuestions: PendingCbtQuestion[]
  initialSubjects?: PendingCbtSubject[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  approvedQuestions?: any[]
  initialSubjectOverrides?: CbtSubjectOverride[]
  initialQuestionOverrides?: CbtQuestionOverride[]
  questionReports?: CbtQuestionReport[]
}

const PAGE_SIZE = 25

export default function CbtModerationClient({
  defaultTab = 'manage-subjects',
  initialQuestions,
  initialSubjects = [],
  approvedQuestions = [],
  initialSubjectOverrides = [],
  initialQuestionOverrides = [],
  questionReports = []
}: CbtModerationClientProps) {
  const [activeTab, setActiveTab] = useState<'manage-subjects' | 'manage-mcqs' | 'questions' | 'subjects'>(defaultTab)
  const [questions, setQuestions] = useState<PendingCbtQuestion[]>(initialQuestions)
  const [subjects, setSubjects] = useState<PendingCbtSubject[]>(initialSubjects)

  const [subjectOverrides, setSubjectOverrides] = useState<CbtSubjectOverride[]>(initialSubjectOverrides)
  const [questionOverrides, setQuestionOverrides] = useState<CbtQuestionOverride[]>(initialQuestionOverrides)

  const [processingId, setProcessingId] = useState<number | string | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const showNotice = (msg: string) => {
    setActionError(null)
    setActionSuccess(msg)
    setTimeout(() => setActionSuccess(null), 4500)
  }

  const showErr = (msg: string) => {
    setActionSuccess(null)
    setActionError(msg)
    setTimeout(() => setActionError(null), 5000)
  }

  // Merged subjects & MCQs (non-destructive overlay)
  const mergedSubjects = useMemo(
    () => mergeSubjectsWithOverrides(subjectOverrides, questionOverrides, approvedQuestions, true),
    [subjectOverrides, questionOverrides, approvedQuestions]
  )

  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(() => mergedSubjects[0]?.code || 'ACP-101')
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'reported' | 'edited' | 'custom' | 'archived'>('all')
  const [mcqSearch, setMcqSearch] = useState<string>('')
  const [page, setPage] = useState<number>(1)

  const reportCountByQuestionId = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of questionReports || []) {
      map.set(r.questionId, (map.get(r.questionId) || 0) + 1)
    }
    return map
  }, [questionReports])

  const selectedSubjectObj = useMemo(
    () => mergedSubjects.find(s => s.code === selectedSubjectCode) || mergedSubjects[0],
    [mergedSubjects, selectedSubjectCode]
  )

  const subjectQuestions = useMemo(() => {
    if (!selectedSubjectObj) return []
    const all = mergeQuestionsWithOverrides(
      selectedSubjectObj.code,
      selectedTopicFilter === 'all' ? undefined : selectedTopicFilter,
      approvedQuestions,
      questionOverrides,
      true
    )

    const qLower = mcqSearch.trim().toLowerCase()
    return all.filter(q => {
      if (statusFilter === 'archived' && !q.isArchived) return false
      if (statusFilter === 'edited' && !q.isOverridden) return false
      if (statusFilter === 'custom' && !q.isCustom) return false
      if (statusFilter === 'reported' && !reportCountByQuestionId.has(q.id)) return false
      if (statusFilter === 'all' && q.isArchived) return false

      if (!qLower) return true
      return (
        q.id.toLowerCase().includes(qLower) ||
        q.question.toLowerCase().includes(qLower) ||
        (q.passage || '').toLowerCase().includes(qLower) ||
        (q.topicName || q.topic || '').toLowerCase().includes(qLower) ||
        q.options.some(o => o.text.toLowerCase().includes(qLower))
      )
    })
  }, [selectedSubjectObj, selectedTopicFilter, approvedQuestions, questionOverrides, statusFilter, mcqSearch, reportCountByQuestionId])

  const totalPages = Math.max(1, Math.ceil(subjectQuestions.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const pagedQuestions = useMemo(
    () => subjectQuestions.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [subjectQuestions, safePage]
  )

  // Subject Edit / Add Modal state
  const [editingSubject, setEditingSubject] = useState<{
    isNew: boolean
    subjectCode: string
    name: string
    description: string
    semester: number
    credits: number
    category: 'open-elective' | 'aptitude' | 'uhv' | 'core'
    categoryLabel: string
    isReady: boolean
    isArchived: boolean
  } | null>(null)

  // Question Edit / Add Modal state
  const [editingMcq, setEditingMcq] = useState<{
    isNew: boolean
    questionId: string
    subjectCode: string
    topic: string
    topicName: string
    passage: string
    question: string
    options: { id: string; text: string }[]
    correctAnswers: string[]
    explanation: string
    difficulty: 'easy' | 'medium' | 'hard'
    isCustom: boolean
    isArchived: boolean
  } | null>(null)

  // Pending approvals handlers (unchanged)
  const handleReviewQuestion = async (id: number, action: 'approved' | 'rejected') => {
    setProcessingId(id)
    try {
      const res = await reviewCbtQuestion(id, action)
      if (res?.success) {
        setQuestions(prev => prev.filter(q => q.id !== id))
        showNotice(`Question #${id} successfully ${action}! Student credited with +5 Karma.`)
      }
    } catch {
      showErr('Failed to review question.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReviewSubject = async (id: number, action: 'approved' | 'rejected') => {
    setProcessingId(id)
    try {
      const res = await reviewCbtSubject(id, action)
      if (res?.success) {
        setSubjects(prev => prev.filter(s => s.id !== id))
        showNotice(`Subject #${id} successfully ${action}!`)
      }
    } catch {
      showErr('Failed to review subject.')
    } finally {
      setProcessingId(null)
    }
  }

  // Save Subject Override / Create Custom Subject
  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingSubject) return
    const code = editingSubject.subjectCode.trim().toUpperCase()
    if (!code || !editingSubject.name.trim()) {
      showErr('Subject code and name are required.')
      return
    }
    setProcessingId(code)
    try {
      const payload: CbtSubjectOverride = {
        subjectCode: code,
        name: editingSubject.name.trim(),
        description: editingSubject.description.trim(),
        semester: Number(editingSubject.semester) || 1,
        year: Math.max(1, Math.ceil((Number(editingSubject.semester) || 1) / 2)),
        category: editingSubject.category,
        categoryLabel: editingSubject.categoryLabel.trim() || 'CBT Subject',
        credits: Number(editingSubject.credits) || 0,
        isReady: editingSubject.isReady,
        isCustom: editingSubject.isNew ? true : undefined,
        isArchived: editingSubject.isArchived
      }
      const res = await saveAdminSubjectOverride(payload)
      if (res?.error) {
        showErr(res.error)
      } else if (res?.override) {
        setSubjectOverrides(prev => {
          const idx = prev.findIndex(item => item.subjectCode.toUpperCase() === code)
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], ...res.override }
            return copy
          }
          return [...prev, res.override!]
        })
        setEditingSubject(null)
        showNotice(`Saved changes for ${code} without altering base data.`)
      }
    } catch {
      showErr('Failed to save subject changes.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleToggleSubjectReady = async (subj: (typeof mergedSubjects)[number]) => {
    setProcessingId(subj.code)
    try {
      const res = await saveAdminSubjectOverride({
        subjectCode: subj.code,
        isReady: !subj.isReady,
        isCustom: subj.isCustom
      })
      if (res?.error) {
        showErr(res.error)
      } else if (res?.override) {
        setSubjectOverrides(prev => {
          const idx = prev.findIndex(item => item.subjectCode.toUpperCase() === subj.code.toUpperCase())
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], ...res.override }
            return copy
          }
          return [...prev, res.override!]
        })
        showNotice(`${subj.code} is now ${!subj.isReady ? 'Live' : 'Hidden (Coming Soon)'}.`)
      }
    } finally {
      setProcessingId(null)
    }
  }

  const handleResetSubject = async (code: string) => {
    setProcessingId(code)
    try {
      const res = await resetAdminSubjectOverride(code)
      if (res?.error) {
        showErr(res.error)
      } else {
        setSubjectOverrides(prev => prev.filter(s => s.subjectCode.toUpperCase() !== code.toUpperCase()))
        showNotice(`Restored ${code} to its original default settings.`)
      }
    } finally {
      setProcessingId(null)
    }
  }

  // Save Question Override / Create Custom Question
  const handleSaveMcq = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMcq) return
    if (!editingMcq.question.trim() || editingMcq.options.some(o => !o.text.trim()) || editingMcq.correctAnswers.length === 0) {
      showErr('Question text, all 4 options, and at least 1 correct answer are required.')
      return
    }
    setProcessingId(editingMcq.questionId)
    try {
      const payload: CbtQuestionOverride = {
        questionId: editingMcq.questionId,
        subjectCode: editingMcq.subjectCode,
        subjectName: selectedSubjectObj?.name || editingMcq.subjectCode,
        semester: selectedSubjectObj?.semester || 1,
        category: selectedSubjectObj?.category || 'core',
        topic: editingMcq.topic.trim() || 'general',
        topicName: editingMcq.topicName.trim() || editingMcq.topic.trim() || 'General',
        passage: editingMcq.passage.trim() ? editingMcq.passage.trim() : null,
        question: editingMcq.question.trim(),
        type: editingMcq.correctAnswers.length > 1 ? 'multiple' : 'single',
        options: editingMcq.options.map(o => ({ id: o.id, text: o.text.trim() })),
        correctAnswers: editingMcq.correctAnswers,
        explanation: editingMcq.explanation.trim(),
        difficulty: editingMcq.difficulty,
        isCustom: editingMcq.isCustom,
        isArchived: editingMcq.isArchived
      }
      const res = await saveAdminQuestionOverride(payload)
      if (res?.error) {
        showErr(res.error)
      } else if (res?.override) {
        setQuestionOverrides(prev => {
          const idx = prev.findIndex(item => item.questionId === res.override!.questionId)
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], ...res.override }
            return copy
          }
          return [...prev, res.override!]
        })
        setEditingMcq(null)
        showNotice(`Saved MCQ ${editingMcq.questionId}. Original data remains safely preserved.`)
      }
    } catch {
      showErr('Failed to save MCQ changes.')
    } finally {
      setProcessingId(null)
    }
  }

  const handleToggleArchiveMcq = async (qId: string, subjectCode: string, nextArchived: boolean, isCustom?: boolean) => {
    setProcessingId(qId)
    try {
      const res = await saveAdminQuestionOverride({
        questionId: qId,
        subjectCode,
        isArchived: nextArchived,
        isCustom
      })
      if (res?.error) {
        showErr(res.error)
      } else if (res?.override) {
        setQuestionOverrides(prev => {
          const idx = prev.findIndex(item => item.questionId === qId)
          if (idx >= 0) {
            const copy = [...prev]
            copy[idx] = { ...copy[idx], ...res.override }
            return copy
          }
          return [...prev, res.override!]
        })
        showNotice(nextArchived ? `Archived ${qId} (hidden from students, can restore anytime).` : `Restored ${qId} to live bank.`)
      }
    } finally {
      setProcessingId(null)
    }
  }

  const handleResetMcq = async (qId: string) => {
    setProcessingId(qId)
    try {
      const res = await resetAdminQuestionOverride(qId)
      if (res?.error) {
        showErr(res.error)
      } else {
        setQuestionOverrides(prev => prev.filter(q => q.questionId !== qId))
        showNotice(`Reset ${qId} back to original version.`)
      }
    } finally {
      setProcessingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-prevu-surface-light/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Non-Destructive CBT Studio</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            CBT Arena Management &amp; Moderation
          </h1>
          <p className="text-xs text-prevu-text-muted mt-0.5">
            Modify live subjects &amp; MCQs safely via overlay (original data &amp; leaderboards stay 100% intact) or review student submissions.
          </p>
        </div>

        <Button variant="outline" size="sm" asChild className="text-xs border-prevu-surface-light">
          <Link href="/admin">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Admin Studio</span>
          </Link>
        </Button>
      </div>

      {actionSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-prevu-surface-light pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('manage-subjects')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'manage-subjects'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Manage Subjects ({mergedSubjects.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('manage-mcqs')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'manage-mcqs'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-white'
          }`}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Manage MCQs</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-white'
          }`}
        >
          <FileQuestion className="w-3.5 h-3.5" />
          <span>Pending MCQs ({questions.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('subjects')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'subjects'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Proposed Subjects ({subjects.length})</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* TAB 1: MANAGE SUBJECTS                                              */}
      {/* =================================================================== */}
      {activeTab === 'manage-subjects' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-prevu-text-muted">
              Edit subject metadata, toggle live visibility, or create a new CBT suite without touching existing data.
            </p>
            <Button
              size="sm"
              onClick={() =>
                setEditingSubject({
                  isNew: true,
                  subjectCode: '',
                  name: '',
                  description: '',
                  semester: 1,
                  credits: 2,
                  category: 'core',
                  categoryLabel: 'Career & Life Skills (CBT)',
                  isReady: true,
                  isArchived: false
                })
              }
              className="h-8 px-3.5 text-xs font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Add Subject</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mergedSubjects.map(subj => (
              <div
                key={subj.code}
                className="p-5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                        {subj.code}
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          subj.isArchived
                            ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                            : subj.isReady
                              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        {subj.isArchived ? 'Archived' : subj.isReady ? 'Live' : 'Hidden / Coming Soon'}
                      </span>
                      {subj.isOverridden && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {subj.isCustom ? 'Custom' : 'Edited'}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-emerald-400 font-bold">
                      {subj.totalQuestions} MCQs
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{subj.name}</h3>
                  <p className="text-xs text-prevu-text-muted line-clamp-2">{subj.description}</p>
                  <div className="text-[10px] font-mono text-prevu-text-muted flex flex-wrap gap-3">
                    <span>Sem {subj.semester}</span>
                    <span>•</span>
                    <span>{subj.categoryLabel}</span>
                    {Boolean(subj.credits) && (
                      <>
                        <span>•</span>
                        <span>{subj.credits} Cr</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-prevu-surface-light/60 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedSubjectCode(subj.code)
                        setSelectedTopicFilter('all')
                        setPage(1)
                        setActiveTab('manage-mcqs')
                      }}
                      className="h-7 px-2.5 text-[11px] border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <SlidersHorizontal className="w-3 h-3 mr-1" />
                      <span>Edit MCQs</span>
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setEditingSubject({
                          isNew: false,
                          subjectCode: subj.code,
                          name: subj.name,
                          description: subj.description,
                          semester: subj.semester,
                          credits: subj.credits ?? 0,
                          category: subj.category,
                          categoryLabel: subj.categoryLabel,
                          isReady: subj.isReady,
                          isArchived: Boolean(subj.isArchived)
                        })
                      }
                      className="h-7 px-2.5 text-[11px] border-prevu-surface-light text-white hover:border-purple-400/60"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      <span>Edit Info</span>
                    </Button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={processingId === subj.code}
                      onClick={() => handleToggleSubjectReady(subj)}
                      title={subj.isReady ? 'Hide from Live CBT' : 'Make Live'}
                      className="h-7 px-2.5 rounded-lg bg-prevu-bg border border-prevu-surface-light text-[11px] text-prevu-text-muted hover:text-white inline-flex items-center gap-1 cursor-pointer"
                    >
                      {subj.isReady ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      <span>{subj.isReady ? 'Hide' : 'Publish'}</span>
                    </button>

                    {subj.isOverridden && (
                      <button
                        type="button"
                        disabled={processingId === subj.code}
                        onClick={() => handleResetSubject(subj.code)}
                        title="Reset to original code defaults"
                        className="h-7 px-2 rounded-lg bg-prevu-bg border border-amber-500/30 text-[11px] text-amber-300 hover:bg-amber-500/10 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 2: MANAGE MCQS                                                  */}
      {/* =================================================================== */}
      {activeTab === 'manage-mcqs' && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block text-[10px] font-mono text-prevu-text-muted mb-1 uppercase">Subject</label>
              <select
                value={selectedSubjectObj?.code || ''}
                onChange={e => {
                  setSelectedSubjectCode(e.target.value)
                  setSelectedTopicFilter('all')
                  setPage(1)
                }}
                className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-2.5 text-xs text-white"
              >
                {mergedSubjects.map(s => (
                  <option key={s.code} value={s.code}>
                    {s.code} — {s.name} ({s.totalQuestions})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-prevu-text-muted mb-1 uppercase">Topic / Module</label>
              <select
                value={selectedTopicFilter}
                onChange={e => {
                  setSelectedTopicFilter(e.target.value)
                  setPage(1)
                }}
                className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-2.5 text-xs text-white"
              >
                <option value="all">All Topics</option>
                {(selectedSubjectObj?.topicsList || [])
                  .filter(t => t.id !== 'all')
                  .map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.count})
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-prevu-text-muted mb-1 uppercase">Filter Status</label>
              <select
                value={statusFilter}
                onChange={e => {
                  setStatusFilter(e.target.value as any)
                  setPage(1)
                }}
                className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-2.5 text-xs text-white"
              >
                <option value="all">Active MCQs</option>
                <option value="reported">Student Reported</option>
                <option value="edited">Admin Edited</option>
                <option value="custom">Admin Added</option>
                <option value="archived">Archived (Hidden)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono text-prevu-text-muted mb-1 uppercase">Search</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-prevu-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={mcqSearch}
                  onChange={e => {
                    setMcqSearch(e.target.value)
                    setPage(1)
                  }}
                  placeholder="ID, question, option..."
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light pl-8 pr-3 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <Button
              size="sm"
              onClick={() => {
                const defaultTopic = selectedSubjectObj?.topicsList?.find(t => t.id !== 'all')
                setEditingMcq({
                  isNew: true,
                  questionId: `admin-${(selectedSubjectObj?.code || 'CBT').toLowerCase()}-${Date.now()}`,
                  subjectCode: selectedSubjectObj?.code || 'ACP-101',
                  topic: defaultTopic?.id || 'general',
                  topicName: defaultTopic?.name || 'General',
                  passage: '',
                  question: '',
                  options: [
                    { id: 'A', text: '' },
                    { id: 'B', text: '' },
                    { id: 'C', text: '' },
                    { id: 'D', text: '' }
                  ],
                  correctAnswers: ['A'],
                  explanation: '',
                  difficulty: 'easy',
                  isCustom: true,
                  isArchived: false
                })
              }}
              className="h-9 px-3.5 text-xs font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              <span>Add New MCQ</span>
            </Button>
          </div>

          {/* Count + Pagination Summary */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-prevu-text-muted font-mono px-1">
            <span>
              Showing <strong className="text-white">{pagedQuestions.length}</strong> of{' '}
              <strong className="text-cyan-300">{subjectQuestions.length}</strong> matching MCQs
            </span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="p-1.5 rounded-lg bg-prevu-surface border border-prevu-surface-light disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span>
                  Page {safePage} / {totalPages}
                </span>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-lg bg-prevu-surface border border-prevu-surface-light disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {pagedQuestions.length > 0 ? (
              pagedQuestions.map(q => {
                const reportsCount = reportCountByQuestionId.get(q.id) || 0
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl bg-prevu-surface/80 border space-y-2.5 ${
                      q.isArchived ? 'border-rose-500/35 opacity-75' : 'border-prevu-surface-light'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                          {q.id}
                        </span>
                        {q.topicName && (
                          <span className="text-[10px] font-mono text-prevu-text-muted bg-prevu-bg px-2 py-0.5 rounded border border-prevu-surface-light">
                            {q.topicName}
                          </span>
                        )}
                        {q.isOverridden && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                            {q.isCustom ? 'Custom' : 'Edited'}
                          </span>
                        )}
                        {q.isArchived && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
                            Archived
                          </span>
                        )}
                        {reportsCount > 0 && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            <span>{reportsCount} Report{reportsCount > 1 ? 's' : ''}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setEditingMcq({
                              isNew: false,
                              questionId: q.id,
                              subjectCode: q.subjectCode,
                              topic: q.topic || 'general',
                              topicName: q.topicName || q.topic || 'General',
                              passage: q.passage || '',
                              question: q.question,
                              options: q.options.map(o => ({ ...o })),
                              correctAnswers: [...q.correctAnswers],
                              explanation: q.explanation || '',
                              difficulty: q.difficulty || 'easy',
                              isCustom: Boolean(q.isCustom),
                              isArchived: Boolean(q.isArchived)
                            })
                          }
                          className="h-7 px-2.5 text-[11px] border-prevu-surface-light hover:border-cyan-400/60"
                        >
                          <Pencil className="w-3 h-3 mr-1" />
                          <span>Edit</span>
                        </Button>

                        <button
                          type="button"
                          disabled={processingId === q.id}
                          onClick={() => handleToggleArchiveMcq(q.id, q.subjectCode, !q.isArchived, q.isCustom)}
                          title={q.isArchived ? 'Restore to Live' : 'Soft Archive (Hide)'}
                          className="h-7 px-2.5 rounded-lg bg-prevu-bg border border-prevu-surface-light text-[11px] text-prevu-text-muted hover:text-white inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Archive className="w-3 h-3" />
                          <span>{q.isArchived ? 'Restore' : 'Archive'}</span>
                        </button>

                        {q.isOverridden && (
                          <button
                            type="button"
                            disabled={processingId === q.id}
                            onClick={() => handleResetMcq(q.id)}
                            title={q.isCustom ? 'Delete custom MCQ' : 'Reset to original'}
                            className="h-7 px-2 rounded-lg bg-prevu-bg border border-amber-500/30 text-[11px] text-amber-300 hover:bg-amber-500/10 inline-flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>

                    {q.passage && (
                      <div className="p-2.5 rounded-xl bg-prevu-bg/80 border border-prevu-surface-light/70 text-[11px] text-prevu-text-muted line-clamp-2">
                        {q.passage}
                      </div>
                    )}

                    <p className="text-xs sm:text-sm font-semibold text-white">{q.question}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                      {q.options.map(opt => {
                        const isCorr = q.correctAnswers.includes(opt.id)
                        return (
                          <div
                            key={opt.id}
                            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${
                              isCorr
                                ? 'bg-emerald-500/10 border-emerald-500/35 text-emerald-200 font-semibold'
                                : 'bg-prevu-bg/60 border-prevu-surface-light/70 text-prevu-text-muted'
                            }`}
                          >
                            <span className="font-mono font-bold">{opt.id}.</span>
                            <span className="truncate">{opt.text}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-10 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light text-center text-xs text-prevu-text-muted">
                No MCQs match the current filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 3: PENDING MCQS (EXISTING APPROVAL QUEUE)                       */}
      {/* =================================================================== */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((q) => (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-prevu-surface-light/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                      {q.subject_code}
                    </span>
                    <span className="text-xs text-prevu-text-muted">
                      {q.subject_name} • Sem {q.semester}
                    </span>
                    {q.unit_tag && (
                      <span className="text-[11px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md">
                        {q.unit_tag}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-prevu-text-muted">
                    Contributed by: <strong className="text-purple-300">@{q.users?.username || 'student'}</strong>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white leading-relaxed">{q.question}</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {q.options_json?.map((opt) => {
                    const isCorr = q.correct_answers?.includes(opt.id)
                    return (
                      <div
                        key={opt.id}
                        className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 ${
                          isCorr
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 font-semibold'
                            : 'bg-prevu-bg border-prevu-surface-light text-prevu-text-muted'
                        }`}
                      >
                        <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                          isCorr ? 'bg-emerald-500 text-white' : 'bg-prevu-surface text-prevu-text-muted'
                        }`}>
                          {opt.id}
                        </span>
                        <span className="flex-1">{opt.text}</span>
                      </div>
                    )
                  })}
                </div>

                {q.explanation && (
                  <div className="p-3.5 rounded-xl bg-prevu-bg/80 border border-prevu-surface-light text-xs text-prevu-text-muted leading-relaxed">
                    <span className="font-bold text-cyan-300 mr-1.5">Explanation:</span>
                    {q.explanation}
                  </div>
                )}

                <div className="pt-3 border-t border-prevu-surface-light/60 flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={processingId === q.id}
                    onClick={() => handleReviewQuestion(q.id, 'rejected')}
                    className="h-8 px-4 text-xs border-rose-500/40 text-rose-300 hover:bg-rose-500/10 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    <span>Reject</span>
                  </Button>

                  <Button
                    size="sm"
                    disabled={processingId === q.id}
                    onClick={() => handleReviewQuestion(q.id, 'approved')}
                    className="h-8 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    <span>Approve &amp; Publish (+5 Karma)</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light text-center space-y-2 max-w-lg mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Pending MCQs</h3>
              <p className="text-xs text-prevu-text-muted">All student-contributed questions have been processed.</p>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* TAB 4: PROPOSED SUBJECTS (EXISTING APPROVAL QUEUE)                  */}
      {/* =================================================================== */}
      {activeTab === 'subjects' && (
        <div className="space-y-4">
          {subjects.length > 0 ? (
            subjects.map((s) => (
              <div
                key={s.id}
                className="p-6 rounded-3xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-prevu-surface-light/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-md border border-cyan-500/20">
                      {s.code}
                    </span>
                    <span className="text-sm font-bold text-white">{s.name}</span>
                  </div>

                  <span className="text-xs text-prevu-text-muted">
                    Proposed by: <strong className="text-purple-300">@{s.users?.username || 'student'}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                    <span className="text-[10px] text-prevu-text-muted block">Semester</span>
                    <span className="text-white font-bold">Sem {s.semester}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                    <span className="text-[10px] text-prevu-text-muted block">Category</span>
                    <span className="text-cyan-300 font-bold">{s.category}</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-prevu-text-muted block">Proposed Date</span>
                    <span className="text-prevu-text-muted">{new Date(s.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {s.description && <p className="text-xs text-prevu-text-muted leading-relaxed">{s.description}</p>}

                <div className="pt-3 border-t border-prevu-surface-light/60 flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={processingId === s.id}
                    onClick={() => handleReviewSubject(s.id, 'rejected')}
                    className="h-8 px-4 text-xs border-rose-500/40 text-rose-300 hover:bg-rose-500/10 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5 mr-1" />
                    <span>Reject</span>
                  </Button>

                  <Button
                    size="sm"
                    disabled={processingId === s.id}
                    onClick={() => handleReviewSubject(s.id, 'approved')}
                    className="h-8 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" />
                    <span>Approve Subject</span>
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light text-center space-y-2 max-w-lg mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Pending Subject Proposals</h3>
              <p className="text-xs text-prevu-text-muted">All proposed community subjects have been reviewed.</p>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* SUBJECT EDIT / CREATE MODAL                                         */}
      {/* =================================================================== */}
      {editingSubject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSubject}
            className="w-full max-w-lg rounded-2xl bg-prevu-surface border border-prevu-surface-light p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <h2 className="text-base font-bold text-white">
                {editingSubject.isNew ? 'Add New CBT Subject' : `Edit Subject: ${editingSubject.subjectCode}`}
              </h2>
              <button type="button" onClick={() => setEditingSubject(null)} className="text-prevu-text-muted hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Subject Code</label>
                <input
                  type="text"
                  required
                  disabled={!editingSubject.isNew}
                  value={editingSubject.subjectCode}
                  onChange={e => setEditingSubject({ ...editingSubject, subjectCode: e.target.value })}
                  placeholder="e.g. CSO-201"
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Category</label>
                <select
                  value={editingSubject.category}
                  onChange={e => setEditingSubject({ ...editingSubject, category: e.target.value as any })}
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white"
                >
                  <option value="core">core (Core &amp; Career)</option>
                  <option value="aptitude">aptitude (Aptitude &amp; Logical)</option>
                  <option value="open-elective">open-elective (Open Elective)</option>
                  <option value="uhv">uhv (UHV / Ethics)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Subject Name</label>
              <input
                type="text"
                required
                value={editingSubject.name}
                onChange={e => setEditingSubject({ ...editingSubject, name: e.target.value })}
                className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Badge Label</label>
                <input
                  type="text"
                  value={editingSubject.categoryLabel}
                  onChange={e => setEditingSubject({ ...editingSubject, categoryLabel: e.target.value })}
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Semester</label>
                <input
                  type="number"
                  min={1}
                  max={8}
                  value={editingSubject.semester}
                  onChange={e => setEditingSubject({ ...editingSubject, semester: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Credits</label>
                <input
                  type="number"
                  min={0}
                  max={6}
                  value={editingSubject.credits}
                  onChange={e => setEditingSubject({ ...editingSubject, credits: Number(e.target.value) })}
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Description</label>
              <textarea
                rows={3}
                value={editingSubject.description}
                onChange={e => setEditingSubject({ ...editingSubject, description: e.target.value })}
                className="w-full rounded-xl bg-prevu-bg border border-prevu-surface-light p-3 text-xs text-white"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <label className="inline-flex items-center gap-2 cursor-pointer text-white">
                <input
                  type="checkbox"
                  checked={editingSubject.isReady}
                  onChange={e => setEditingSubject({ ...editingSubject, isReady: e.target.checked })}
                />
                <span>Live in CBT Arena (`isReady`)</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer text-rose-300">
                <input
                  type="checkbox"
                  checked={editingSubject.isArchived}
                  onChange={e => setEditingSubject({ ...editingSubject, isArchived: e.target.checked })}
                />
                <span>Soft Archive (Hide)</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-prevu-surface-light">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingSubject(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={Boolean(processingId)} className="bg-prevu-accent hover:bg-prevu-accent-hover text-white">
                Save Subject
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* =================================================================== */}
      {/* MCQ EDIT / CREATE MODAL                                             */}
      {/* =================================================================== */}
      {editingMcq && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMcq}
            className="w-full max-w-2xl rounded-2xl bg-prevu-surface border border-prevu-surface-light p-6 space-y-4 shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <div>
                <h2 className="text-base font-bold text-white">
                  {editingMcq.isNew ? `Add New MCQ to ${editingMcq.subjectCode}` : `Edit MCQ: ${editingMcq.questionId}`}
                </h2>
                <p className="text-[11px] text-prevu-text-muted font-mono">
                  Saved as a non-destructive override — original question &amp; past attempts stay untouched.
                </p>
              </div>
              <button type="button" onClick={() => setEditingMcq(null)} className="text-prevu-text-muted hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Topic Slug</label>
                <input
                  type="text"
                  value={editingMcq.topic}
                  onChange={e => setEditingMcq({ ...editingMcq, topic: e.target.value })}
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Topic Display Name</label>
                <input
                  type="text"
                  value={editingMcq.topicName}
                  onChange={e => setEditingMcq({ ...editingMcq, topicName: e.target.value })}
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Difficulty</label>
                <select
                  value={editingMcq.difficulty}
                  onChange={e => setEditingMcq({ ...editingMcq, difficulty: e.target.value as any })}
                  className="w-full h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Case Study / Shared Passage (optional)</label>
              <textarea
                rows={2}
                value={editingMcq.passage}
                onChange={e => setEditingMcq({ ...editingMcq, passage: e.target.value })}
                placeholder="Leave empty for standalone MCQ..."
                className="w-full rounded-xl bg-prevu-bg border border-prevu-surface-light p-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Question Text</label>
              <textarea
                rows={3}
                required
                value={editingMcq.question}
                onChange={e => setEditingMcq({ ...editingMcq, question: e.target.value })}
                className="w-full rounded-xl bg-prevu-bg border border-prevu-surface-light p-2.5 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-mono text-prevu-text-muted">Options (check the correct answer)</label>
              {editingMcq.options.map((opt, idx) => {
                const isChecked = editingMcq.correctAnswers.includes(opt.id)
                return (
                  <div key={opt.id} className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMcq(prev => {
                          if (!prev) return prev
                          const exists = prev.correctAnswers.includes(opt.id)
                          const next = exists
                            ? prev.correctAnswers.filter(id => id !== opt.id)
                            : [...prev.correctAnswers, opt.id]
                          return { ...prev, correctAnswers: next.length > 0 ? next : [opt.id] }
                        })
                      }}
                      className={`w-8 h-9 rounded-xl font-mono text-xs font-bold border cursor-pointer shrink-0 ${
                        isChecked
                          ? 'bg-emerald-500 text-white border-emerald-400'
                          : 'bg-prevu-bg text-prevu-text-muted border-prevu-surface-light'
                      }`}
                      title="Toggle as correct answer"
                    >
                      {opt.id}
                    </button>
                    <input
                      type="text"
                      required
                      value={opt.text}
                      onChange={e => {
                        const val = e.target.value
                        setEditingMcq(prev => {
                          if (!prev) return prev
                          const nextOpts = [...prev.options]
                          nextOpts[idx] = { ...nextOpts[idx], text: val }
                          return { ...prev, options: nextOpts }
                        })
                      }}
                      className="flex-1 h-9 rounded-xl bg-prevu-bg border border-prevu-surface-light px-3 text-xs text-white"
                    />
                  </div>
                )
              })}
            </div>

            <div>
              <label className="block text-[11px] font-mono text-prevu-text-muted mb-1">Explanation</label>
              <textarea
                rows={2}
                value={editingMcq.explanation}
                onChange={e => setEditingMcq({ ...editingMcq, explanation: e.target.value })}
                className="w-full rounded-xl bg-prevu-bg border border-prevu-surface-light p-2.5 text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-prevu-surface-light">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingMcq(null)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={Boolean(processingId)} className="bg-prevu-accent hover:bg-prevu-accent-hover text-white">
                Save MCQ
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
