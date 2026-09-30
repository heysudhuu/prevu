'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, RotateCcw, XCircle, CheckSquare, Award, ChevronDown, ChevronUp, Lightbulb } from 'lucide-react'
import { 
  getPaperProgress, 
  setQuestionStatus, 
  QuestionStatus, 
  PaperProgress 
} from '@/lib/tracker/progress'
import InstantHintModal from '@/components/ai/InstantHintModal'

interface QuestionCheckpadProps {
  paperId: string
  subjectCode?: string
  subjectName?: string
  semester?: number
  questionCount?: number
  compact?: boolean
  className?: string
}

export default function QuestionCheckpad({
  paperId,
  subjectCode = '',
  subjectName = '',
  semester = 1,
  questionCount = 8,
  compact = false,
  className = ''
}: QuestionCheckpadProps) {
  const [progress, setProgress] = useState<PaperProgress | null>(null)
  const [isExpanded, setIsExpanded] = useState(!compact)
  const [activeHintQuestion, setActiveHintQuestion] = useState<string | null>(null)

  const reloadProgress = () => {
    setProgress(getPaperProgress(paperId, questionCount))
  }

  useEffect(() => {
    reloadProgress()

    const onProgressUpdated = () => reloadProgress()
    window.addEventListener('prevu-progress-updated', onProgressUpdated)
    return () => window.removeEventListener('prevu-progress-updated', onProgressUpdated)
  }, [paperId, questionCount])

  if (!progress) return null

  const handleStatusChange = (qNum: number, status: QuestionStatus) => {
    const current = progress.questions[qNum]
    const nextStatus = current === status ? 'unattempted' : status

    setQuestionStatus(paperId, qNum, nextStatus, {
      subjectCode,
      subjectName,
      semester,
      totalQuestions: questionCount
    })
  }

  // Calculate solved & percentage
  const questionsList = Array.from({ length: questionCount }, (_, i) => i + 1)
  const solvedCount = Object.values(progress.questions).filter(s => s === 'solved').length
  const revisitCount = Object.values(progress.questions).filter(s => s === 'revisit').length
  const percentage = Math.round((solvedCount / questionCount) * 100)

  return (
    <div className={`p-4 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light shadow-xl space-y-3.5 ${className}`}>
      
      {/* Header with Progress Ring / Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Question Checkpad</span>
              <span className="text-[10px] font-mono text-purple-300 bg-purple-500/15 px-1.5 py-0.2 rounded border border-purple-500/20">
                {solvedCount}/{questionCount} Solved
              </span>
            </h4>
            <div className="text-[10px] text-prevu-text-muted mt-0.5">
              Mark questions as you practice to track syllabus coverage
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-mono font-extrabold text-white">{percentage}%</div>
            <div className="text-[9px] text-prevu-text-muted">Mastery</div>
          </div>

          {compact && (
            <button
              onClick={() => setIsExpanded(prev => !prev)}
              className="p-1.5 rounded-lg text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-prevu-surface-light rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Interactive Question Grid */}
      {isExpanded && (
        <div className="space-y-2 pt-1 animate-fade-in">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {questionsList.map((qNum) => {
              const status = progress.questions[qNum] || 'unattempted'

              return (
                <div
                  key={qNum}
                  className={`p-2 rounded-2xl border transition-all ${
                    status === 'solved'
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : status === 'revisit'
                      ? 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                      : status === 'skipped'
                      ? 'bg-rose-950/30 border-rose-500/40 text-rose-300 opacity-70'
                      : 'bg-prevu-bg/60 border-prevu-surface-light text-prevu-text-muted hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-bold text-white">Q{qNum}</span>
                      <button
                        onClick={() => setActiveHintQuestion(`Question ${qNum} on ${subjectName || 'this subject'}`)}
                        className="p-0.5 rounded text-amber-400 hover:text-amber-300 hover:bg-amber-400/15 transition-colors cursor-pointer"
                        title="Get Instant AI Hint"
                      >
                        <Lightbulb className="w-3 h-3 fill-amber-400/20" />
                      </button>
                    </div>
                    <span className="text-[10px] font-mono">
                      {status === 'solved' && '✓ Done'}
                      {status === 'revisit' && '🔁 Revisit'}
                      {status === 'skipped' && '✕ Skip'}
                      {status === 'unattempted' && '—'}
                    </span>
                  </div>

                  {/* 3 Status Toggle Buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStatusChange(qNum, 'solved')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                        status === 'solved'
                          ? 'bg-emerald-500 text-white shadow-sm'
                          : 'bg-prevu-surface-light/60 hover:bg-emerald-500/20 hover:text-emerald-300 text-prevu-text-muted'
                      }`}
                      title="Mark as Solved"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleStatusChange(qNum, 'revisit')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                        status === 'revisit'
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-prevu-surface-light/60 hover:bg-amber-500/20 hover:text-amber-300 text-prevu-text-muted'
                      }`}
                      title="Mark to Revisit Later"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>

                    <button
                      onClick={() => handleStatusChange(qNum, 'skipped')}
                      className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                        status === 'skipped'
                          ? 'bg-rose-500 text-white shadow-sm'
                          : 'bg-prevu-surface-light/60 hover:bg-rose-500/20 hover:text-rose-300 text-prevu-text-muted'
                      }`}
                      title="Mark as Skipped"
                    >
                      <XCircle className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Quick Legend / Feedback */}
          <div className="flex items-center justify-between text-[11px] text-prevu-text-muted pt-1 px-1">
            <span className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Solved ({solvedCount})</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Revisit ({revisitCount})</span>
            </span>

            {percentage === 100 && (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" /> Paper Mastered!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Instant AI Hint Modal */}
      <InstantHintModal
        isOpen={!!activeHintQuestion}
        onClose={() => setActiveHintQuestion(null)}
        subjectName={subjectName}
        questionText={activeHintQuestion || ''}
      />
    </div>
  )
}
