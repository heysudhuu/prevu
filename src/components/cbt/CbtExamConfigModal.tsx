'use client'

import React, { useState, useMemo } from 'react'
import { CbtSubject } from '@/lib/cbt/types'
import { Sparkles, Clock, HelpCircle, AlertCircle, ArrowRight, X, ShieldAlert, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface CbtExamConfigModalProps {
  subject: CbtSubject
  isOpen: boolean
  onClose: () => void
  onStartExam: (config: {
    questionCount: number
    timeLimitMinutes: number
    shuffleQuestions: boolean
  }) => void
}

export default function CbtExamConfigModal({
  subject,
  isOpen,
  onClose,
  onStartExam
}: CbtExamConfigModalProps) {
  const maxAvailable = subject.totalQuestions || 51

  // Default: 25 questions or all available if fewer
  const [questionCount, setQuestionCount] = useState<number>(Math.min(25, maxAvailable))
  const [customInput, setCustomInput] = useState<string>('')
  const [shuffleQuestions, setShuffleQuestions] = useState<boolean>(true)

  // Maximum allowed time: Exactly 2 minutes per selected question
  const maxAllowedMinutes = useMemo(() => Math.max(5, questionCount * 2), [questionCount])
  
  // Default time: 1.5 minutes per question
  const defaultMinutes = useMemo(() => Math.round(questionCount * 1.5), [questionCount])
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number>(defaultMinutes)

  // Track if user attempted to input more than available
  const [exceededNotice, setExceededNotice] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSelectCount = (count: number) => {
    setExceededNotice(null)
    setCustomInput('')
    const target = Math.min(count, maxAvailable)
    setQuestionCount(target)
    setTimeLimitMinutes(Math.round(target * 1.5))
  }

  const handleCustomCountChange = (val: string) => {
    setCustomInput(val)
    const num = parseInt(val)
    if (isNaN(num) || num <= 0) return

    if (num > maxAvailable) {
      setQuestionCount(maxAvailable)
      setTimeLimitMinutes(Math.round(maxAvailable * 1.5))
      setExceededNotice(`We currently have ${maxAvailable} verified questions for this subject. We have capped your test to all ${maxAvailable} questions!`)
    } else {
      setExceededNotice(null)
      setQuestionCount(num)
      setTimeLimitMinutes(Math.round(num * 1.5))
    }
  }

  const handleTimeChange = (mins: number) => {
    // Clamp to max 2 mins / question
    const clamped = Math.min(Math.max(5, mins), maxAllowedMinutes)
    setTimeLimitMinutes(clamped)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onStartExam({
      questionCount,
      timeLimitMinutes,
      shuffleQuestions
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-prevu-surface border border-prevu-surface-light rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-prevu-text overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-prevu-accent/15 blur-3xl pointer-events-none rounded-full" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-prevu-surface-light/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 mb-1.5">
              <Sparkles className="w-3 h-3" />
              <span>{subject.categoryLabel}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {subject.name}
            </h2>
            <div className="text-xs text-prevu-text-muted mt-0.5 font-mono">
              Course Code: <strong className="text-cyan-300">{subject.code}</strong> • Sem {subject.semester} • {maxAvailable} Questions in Bank
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-prevu-surface-light/50 hover:bg-prevu-surface-light text-prevu-text-muted hover:text-white transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: Question Count Selector */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-white flex items-center gap-1.5">
                <span>1. Select Number of Questions</span>
              </label>
              <span className="text-prevu-text-muted font-mono">
                Bank Capacity: <strong className="text-white">{maxAvailable}</strong>
              </span>
            </div>

            {/* Quick preset buttons */}
            <div className="grid grid-cols-4 gap-2">
              {[15, 25, 50, maxAvailable].map((count, idx) => {
                const label = idx === 0 ? '15 (Quick)' : idx === 1 ? '25 (Std)' : idx === 2 ? '50 (Full)' : `All (${count})`
                const isSelected = questionCount === count && !customInput

                return (
                  <button
                    key={`${count}-${idx}`}
                    type="button"
                    onClick={() => handleSelectCount(count)}
                    className={`py-2 px-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border text-center ${
                      isSelected
                        ? 'bg-prevu-accent text-white border-prevu-accent shadow-md shadow-prevu-accent/30 scale-[1.02]'
                        : 'bg-prevu-bg/60 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-accent/40'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>

            {/* Custom Input */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-prevu-text-muted">Or custom count:</span>
              <input
                type="number"
                min={5}
                max={maxAvailable}
                value={customInput}
                onChange={(e) => handleCustomCountChange(e.target.value)}
                placeholder={`5 to ${maxAvailable}`}
                className="w-28 px-3 py-1.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-prevu-accent focus:outline-none"
              />
              <span className="text-xs text-prevu-text-muted">questions</span>
            </div>

            {/* Exceeded Notification if student wants more than available */}
            {exceededNotice && (
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>{exceededNotice}</span>
              </div>
            )}
          </div>

          {/* STEP 2: Time Limit Selector (Max 2 mins / question ceiling) */}
          <div className="space-y-3 pt-2 border-t border-prevu-surface-light/40">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-white flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>2. Exam Time Limit (Max 2 min/question)</span>
              </label>
              <span className="font-mono text-cyan-300 font-bold text-sm">
                {timeLimitMinutes} minutes
              </span>
            </div>

            {/* Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min={Math.max(5, Math.round(questionCount * 0.5))}
                max={maxAllowedMinutes}
                step={1}
                value={timeLimitMinutes}
                onChange={(e) => handleTimeChange(parseInt(e.target.value))}
                className="w-full h-2 bg-prevu-bg rounded-lg appearance-none cursor-pointer accent-prevu-accent"
              />
              <div className="flex justify-between text-[10px] text-prevu-text-muted font-mono">
                <span>Fast Pace ({Math.round(questionCount * 0.5)}m)</span>
                <span>Standard ({Math.round(questionCount * 1.5)}m)</span>
                <span>Max Ceiling ({maxAllowedMinutes}m)</span>
              </div>
            </div>

            {/* Quick Speed Presets */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-prevu-text-muted font-mono">Presets:</span>
              <button
                type="button"
                onClick={() => setTimeLimitMinutes(Math.round(questionCount * 1))}
                className="px-2.5 py-1 rounded-xl text-[11px] bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-white"
              >
                ⚡ 1 min/q ({questionCount}m)
              </button>
              <button
                type="button"
                onClick={() => setTimeLimitMinutes(Math.round(questionCount * 1.5))}
                className="px-2.5 py-1 rounded-xl text-[11px] bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-white"
              >
                🎯 1.5 min/q ({Math.round(questionCount * 1.5)}m)
              </button>
              <button
                type="button"
                onClick={() => setTimeLimitMinutes(maxAllowedMinutes)}
                className="px-2.5 py-1 rounded-xl text-[11px] bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-white"
              >
                🛡️ Max 2 min/q ({maxAllowedMinutes}m)
              </button>
            </div>
          </div>

          {/* STEP 3: Options (Shuffle) */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-prevu-bg/40 border border-prevu-surface-light text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-prevu-accent" />
              <span className="text-prevu-text-muted">Randomize Question Order for Retakes</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-prevu-surface-light peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-prevu-accent"></div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-prevu-surface-light/60">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs h-10 px-4 border-prevu-surface-light"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="text-xs h-10 px-6 font-bold bg-gradient-to-r from-prevu-accent to-purple-600 text-white hover:opacity-95 shadow-lg shadow-prevu-accent/25 flex items-center gap-2"
            >
              <span>Launch Mock Test</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>

        </form>
      </div>
    </div>
  )
}
