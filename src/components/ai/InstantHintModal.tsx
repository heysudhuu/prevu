'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Sparkles, X, Loader2, ArrowRight, AlertTriangle, BookOpen, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getInstantQuestionHint, InstantHintResult } from '@/app/api/ai/actions'

interface InstantHintModalProps {
  isOpen: boolean
  onClose: () => void
  subjectName: string
  questionText: string
}

export default function InstantHintModal({
  isOpen,
  onClose,
  subjectName,
  questionText
}: InstantHintModalProps) {
  const [loading, setLoading] = useState(false)
  const [hintData, setHintData] = useState<InstantHintResult['hint'] | null>(null)
  const [revealedLevel, setRevealedLevel] = useState<number>(1) // Level 1 (Intuition), Level 2 (Formula), Level 3 (First Step)

  useEffect(() => {
    if (isOpen && questionText) {
      setLoading(true)
      setRevealedLevel(1)
      getInstantQuestionHint(subjectName || 'Computer Science', questionText)
        .then((res) => {
          if (res.success && res.hint) {
            setHintData(res.hint)
          }
        })
        .finally(() => setLoading(false))
    }
  }, [isOpen, subjectName, questionText])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg p-6 rounded-3xl bg-[#11111a] border border-amber-500/40 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 blur-2xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-black shadow-md shadow-amber-500/30 shrink-0">
              <Lightbulb className="w-5 h-5 fill-black" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Instant AI Question Hint</span>
                <span className="text-[10px] font-mono text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded border border-amber-500/30">
                  Spoiler-Free Coach
                </span>
              </h3>
              <p className="text-xs text-prevu-text-muted mt-0.5">
                {subjectName} • Progressive guided hints to trigger your thinking
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-prevu-text-muted hover:text-white rounded-xl hover:bg-prevu-surface-light transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Question Text */}
        <div className="p-3.5 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light text-xs text-white leading-relaxed">
          <span className="text-[10px] font-mono text-amber-400 uppercase font-bold block mb-1">
            Selected Question:
          </span>
          &ldquo;{questionText}&rdquo;
        </div>

        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
            <p className="text-xs text-prevu-text-muted">Generating guided hint without spoilers...</p>
          </div>
        ) : hintData ? (
          <div className="space-y-3.5">
            
            {/* Level 1: Conceptual Intuition */}
            <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-amber-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Hint Level 1: Conceptual Intuition</span>
                </span>
                <span className="text-[10px] font-mono text-amber-400/80">Active</span>
              </div>
              <p className="text-xs text-prevu-text leading-relaxed">
                {hintData.intuition}
              </p>
            </div>

            {/* Level 2: Core Theorem / Formula */}
            {revealedLevel >= 2 ? (
              <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-purple-300">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Hint Level 2: Core Principle & Formula</span>
                  </span>
                  <span className="text-[10px] font-mono text-purple-400/80">Active</span>
                </div>
                <p className="text-xs text-purple-200/90 font-mono leading-relaxed bg-purple-950/40 p-2 rounded-xl border border-purple-500/20">
                  {hintData.coreFormulaOrTheorem}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setRevealedLevel(2)}
                className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-prevu-surface-light hover:border-purple-500/50 text-xs font-semibold text-prevu-text-muted hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Still stuck? Reveal Level 2 (Formula & Theorem)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Level 3: First Step Guidance */}
            {revealedLevel >= 3 ? (
              <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 space-y-1.5 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Hint Level 3: First Step Guidance</span>
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400/80">Active</span>
                </div>
                <p className="text-xs text-cyan-100/90 leading-relaxed">
                  {hintData.firstStepGuidance}
                </p>
              </div>
            ) : revealedLevel >= 2 ? (
              <button
                onClick={() => setRevealedLevel(3)}
                className="w-full py-2.5 px-3 rounded-2xl border border-dashed border-prevu-surface-light hover:border-cyan-500/50 text-xs font-semibold text-prevu-text-muted hover:text-white flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Need starting help? Reveal Level 3 (First Step Guidance)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}

            {/* Common Mistake Trap Warning */}
            {hintData.commonMistakeToAvoid && (
              <div className="p-3 rounded-xl bg-red-950/20 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">
                  <strong>Examiner Warning:</strong> {hintData.commonMistakeToAvoid}
                </span>
              </div>
            )}

          </div>
        ) : (
          <div className="text-center py-6 text-xs text-prevu-text-muted">
            Could not generate hint at this time.
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-prevu-surface-light">
          <Button size="sm" onClick={onClose} className="text-xs">
            I Understand, Let Me Solve It!
          </Button>
        </div>

      </div>
    </div>
  )
}
