'use client'

import React, { useState } from 'react'
import { Flag, ShieldCheck, X, AlertTriangle, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CbtQuestion } from '@/lib/cbt/types'

interface CbtReportModalProps {
  isOpen: boolean
  onClose: () => void
  question: CbtQuestion | null
  questionNumber: number
  onSubmitReport: (data: {
    questionId: string
    reason: 'wrong_key' | 'typo' | 'mismatched_options' | 'passage_missing' | 'other'
    details?: string
  }) => void
}

const REPORT_REASONS = [
  {
    id: 'wrong_key' as const,
    label: 'Wrong Answer Key',
    desc: 'The marked correct option appears incorrect or contradicted by syllabus'
  },
  {
    id: 'typo' as const,
    label: 'Typo or Truncated Text',
    desc: 'Question text, variables, or sentences are cut off or misspelled'
  },
  {
    id: 'mismatched_options' as const,
    label: 'Duplicate / Mismatched Options',
    desc: 'Options are repetitive or none match the question stem'
  },
  {
    id: 'passage_missing' as const,
    label: 'Case Study / Passage Issue',
    desc: 'The scenario context or passage is missing or misaligned'
  },
  {
    id: 'other' as const,
    label: 'Other Quality Issue',
    desc: 'Any formatting, technical, or clarification concern'
  }
]

export default function CbtReportModal({
  isOpen,
  onClose,
  question,
  questionNumber,
  onSubmitReport
}: CbtReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<'wrong_key' | 'typo' | 'mismatched_options' | 'passage_missing' | 'other'>('wrong_key')
  const [details, setDetails] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isDone, setIsDone] = useState<boolean>(false)

  if (!isOpen || !question) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    onSubmitReport({
      questionId: question.id,
      reason: selectedReason,
      details: details.trim() || undefined
    })

    setIsDone(true)
    setTimeout(() => {
      setIsSubmitting(false)
      setIsDone(false)
      onClose()
    }, 1200)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg rounded-3xl bg-[#0e0e17] border border-amber-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-48 h-16 bg-amber-500/15 blur-2xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono uppercase tracking-wide">
            <Flag className="w-3.5 h-3.5" />
            <span>Question Issue Report • Q#{questionNumber}</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Flag Question for Review
          </h3>
          <p className="text-xs text-zinc-400">
            Found a typo, bad answer key, or broken passage? Let us know.
          </p>
        </div>

        {/* Fair-Play Protection Guarantee */}
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex items-start gap-3 mb-5">
          <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-amber-200">
            <span className="font-bold text-amber-300 block mb-0.5">Fair-Play Mark Protection:</span>
            Submitting this report will <strong className="text-white">void this question from negatively affecting your grade</strong>. Your final percentage will not be penalized by flawed questions.
          </div>
        </div>

        {/* Question Snippet */}
        <div className="p-3 rounded-xl bg-black/50 border border-white/10 mb-5">
          <span className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-wide block mb-1">
            Question Snippet
          </span>
          <p className="text-xs text-zinc-200 line-clamp-2 italic">
            "{question.question}"
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Reason Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-300 block">
              What is the issue with this question?
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {REPORT_REASONS.map(r => {
                const isSelected = selectedReason === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setSelectedReason(r.id)}
                    className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-500/50 text-white'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-zinc-200 hover:bg-white/10'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'border-amber-400 bg-amber-400' : 'border-zinc-500'
                    }`}>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold leading-tight">{r.label}</div>
                      <div className="text-[11px] text-zinc-400 leading-tight mt-0.5">{r.desc}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Details Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-300 block">
              Additional Details <span className="text-zinc-500 font-normal">(Optional)</span>
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. In Unit 1 notes, the answer is stated as Option B..."
              rows={2}
              className="w-full p-3 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500/60 resize-none font-sans"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-1/3 bg-transparent border-white/15 text-zinc-400 hover:text-white rounded-xl h-11 text-xs font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl h-11 text-xs shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              {isDone ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Reported & Marks Protected!</span>
                </>
              ) : (
                <>
                  <Flag className="w-4 h-4 fill-current" />
                  <span>Report & Protect Marks</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
