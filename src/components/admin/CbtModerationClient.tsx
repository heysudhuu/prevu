'use client'

import React, { useState } from 'react'
import { 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  BookOpen, 
  Layers, 
  Check, 
  X, 
  ArrowLeft, 
  HelpCircle,
  FileQuestion,
  GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { reviewCbtQuestion, reviewCbtSubject } from '@/lib/cbt/actions'
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
  initialQuestions: PendingCbtQuestion[]
  initialSubjects?: PendingCbtSubject[]
}

export default function CbtModerationClient({ 
  initialQuestions, 
  initialSubjects = [] 
}: CbtModerationClientProps) {
  const [activeTab, setActiveTab] = useState<'questions' | 'subjects'>('questions')
  const [questions, setQuestions] = useState<PendingCbtQuestion[]>(initialQuestions)
  const [subjects, setSubjects] = useState<PendingCbtSubject[]>(initialSubjects)
  
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  const handleReviewQuestion = async (id: number, action: 'approved' | 'rejected') => {
    setProcessingId(id)
    try {
      const res = await reviewCbtQuestion(id, action)
      if (res?.success) {
        setQuestions(prev => prev.filter(q => q.id !== id))
        setActionSuccess(`Question #${id} successfully ${action}! Student credited with +5 Karma.`)
        setTimeout(() => setActionSuccess(null), 4000)
      }
    } catch {
      console.warn('Failed to review question')
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
        setActionSuccess(`Subject #${id} successfully ${action}!`)
        setTimeout(() => setActionSuccess(null), 4000)
      }
    } catch {
      console.warn('Failed to review subject')
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
            <span>Admin Review Queue</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            CBT Arena Moderation Studio
          </h1>
          <p className="text-xs text-prevu-text-muted mt-0.5">
            Strict quality assurance for student-submitted MCQs and proposed subjects.
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
        <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in font-medium">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-prevu-surface-light pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('questions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
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
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'subjects'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
              : 'text-prevu-text-muted hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Proposed Subjects ({subjects.length})</span>
        </button>
      </div>

      {/* TAB 1: PENDING QUESTIONS */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {questions.length > 0 ? (
            questions.map((q) => (
              <div
                key={q.id}
                className="p-6 rounded-3xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-4"
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-prevu-surface-light/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      {q.subject_code}
                    </span>
                    <span className="text-xs font-bold text-white">
                      {q.subject_name}
                    </span>
                    <span className="text-[10px] text-prevu-text-muted font-mono">
                      Sem {q.semester} • {q.category}
                    </span>
                  </div>

                  <div className="text-[11px] text-prevu-text-muted">
                    Submitted by: <strong className="text-purple-300">@{q.users?.username || 'student'}</strong>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-sm sm:text-base font-semibold text-white leading-relaxed">
                  {q.question}
                </h3>

                {/* Options */}
                <div className="space-y-1.5 pt-1">
                  {q.options_json.map((opt) => {
                    const isCorrect = q.correct_answers.includes(opt.id)

                    return (
                      <div
                        key={opt.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                          isCorrect
                            ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200 font-semibold'
                            : 'bg-prevu-bg/50 border-prevu-surface-light text-prevu-text-muted'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-black/30 flex items-center justify-center font-mono font-bold text-[10px] shrink-0">
                            {opt.id}
                          </span>
                          <span>{opt.text}</span>
                        </div>
                        {isCorrect && (
                          <span className="text-[10px] text-emerald-400 font-mono font-bold shrink-0">
                            ✓ Correct Key
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div className="p-3 rounded-2xl bg-prevu-bg/80 border border-cyan-500/20 text-xs text-prevu-text-muted space-y-1">
                    <div className="text-[10px] uppercase font-mono font-bold text-cyan-400 flex items-center gap-1">
                      <HelpCircle className="w-3 h-3" /> Contributor Explanation
                    </div>
                    <p className="text-[11px] leading-relaxed">
                      {q.explanation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
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
                    <span>Approve & Publish (+5 Karma)</span>
                  </Button>
                </div>

              </div>
            ))
          ) : (
            <div className="p-12 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light text-center space-y-2 max-w-lg mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-white">No Pending MCQs</h3>
              <p className="text-xs text-prevu-text-muted">
                All student-contributed questions have been processed.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROPOSED SUBJECTS */}
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
                    <span className="text-sm font-bold text-white">
                      {s.name}
                    </span>
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

                {s.description && (
                  <p className="text-xs text-prevu-text-muted leading-relaxed">
                    {s.description}
                  </p>
                )}

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
              <p className="text-xs text-prevu-text-muted">
                All proposed community subjects have been reviewed.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  )
}
