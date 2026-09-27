'use client'

import React, { useState, useEffect, useRef } from 'react'
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  Maximize2, 
  Minimize2, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  FileText,
  ShieldAlert,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface MockExamModalProps {
  isOpen: boolean
  onClose: () => void
  resource: {
    id: string
    exam_year: number
    file_path: string
    subjects?: {
      name?: string
      code?: string
      semester?: number
    }
    exam_types?: {
      name?: string
    }
  }
}

type ExamMode = 'MST' | 'EST' | 'SPRINT'

export default function MockExamModal({ isOpen, onClose, resource }: MockExamModalProps) {
  const defaultMode: ExamMode = resource.exam_types?.name === 'EST' ? 'EST' : 'MST'
  const [examMode, setExamMode] = useState<ExamMode>(defaultMode)
  const [status, setStatus] = useState<'idle' | 'running' | 'paused' | 'finished'>('idle')
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Timer in seconds
  const getInitialSeconds = (mode: ExamMode) => {
    if (mode === 'EST') return 180 * 60 // 3 hours
    if (mode === 'SPRINT') return 30 * 60 // 30 mins
    return 60 * 60 // 60 mins MST
  }

  const [totalSeconds, setTotalSeconds] = useState(getInitialSeconds(defaultMode))
  const [secondsLeft, setSecondsLeft] = useState(getInitialSeconds(defaultMode))
  const [attemptedQuestions, setAttemptedQuestions] = useState<number[]>([])

  useEffect(() => {
    const s = getInitialSeconds(examMode)
    setTotalSeconds(s)
    setSecondsLeft(s)
    setStatus('idle')
    setAttemptedQuestions([])
  }, [examMode])

  // Timer interval
  useEffect(() => {
    if (!isOpen || status !== 'running') return

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setStatus('finished')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isOpen, status])

  if (!isOpen) return null

  const formatTime = (secs: number) => {
    const hours = Math.floor(secs / 3600)
    const mins = Math.floor((secs % 3600) / 60)
    const seconds = secs % 60

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${mins.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  const progressPercent = Math.max(0, Math.min(100, Math.round(((totalSeconds - secondsLeft) / totalSeconds) * 100)))
  const isUrgent = secondsLeft > 0 && secondsLeft <= 10 * 60 // Last 10 minutes

  const startExam = () => setStatus('running')
  const pauseExam = () => setStatus('paused')
  const resumeExam = () => setStatus('running')
  const finishExam = () => setStatus('finished')
  const resetExam = () => {
    setStatus('idle')
    setSecondsLeft(totalSeconds)
    setAttemptedQuestions([])
  }

  const toggleAttempted = (num: number) => {
    setAttemptedQuestions(prev => 
      prev.includes(num) ? prev.filter(x => x !== num) : [...prev, num]
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div 
        className={`bg-prevu-surface border border-prevu-surface-light rounded-3xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'w-full h-full rounded-none' : 'w-full max-w-6xl h-[92vh]'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-3.5 border-b border-prevu-surface-light bg-prevu-bg/95 gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                  Real Exam Simulation
                </span>
                <span className="text-[11px] font-mono text-prevu-text-muted px-2 py-0.5 rounded bg-prevu-surface border border-prevu-surface-light">
                  {resource.subjects?.code}
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white truncate">
                {resource.subjects?.name} ({resource.exam_types?.name} {resource.exam_year})
              </h2>
            </div>
          </div>

          {/* Mode Selector & Window Controls */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
            {status === 'idle' && (
              <div className="flex items-center bg-prevu-surface border border-prevu-surface-light rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setExamMode('MST')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    examMode === 'MST' ? 'bg-prevu-accent text-white shadow-sm' : 'text-prevu-text-muted hover:text-white'
                  }`}
                >
                  MST (60 min)
                </button>
                <button
                  onClick={() => setExamMode('EST')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    examMode === 'EST' ? 'bg-prevu-accent text-white shadow-sm' : 'text-prevu-text-muted hover:text-white'
                  }`}
                >
                  EST (180 min)
                </button>
                <button
                  onClick={() => setExamMode('SPRINT')}
                  className={`px-3 py-1 rounded-lg font-medium transition-all ${
                    examMode === 'SPRINT' ? 'bg-prevu-accent text-white shadow-sm' : 'text-prevu-text-muted hover:text-white'
                  }`}
                >
                  Sprint (30 min)
                </button>
              </div>
            )}

            <button
              onClick={() => setIsFullscreen(prev => !prev)}
              className="p-1.5 rounded-xl hover:bg-prevu-surface-light text-prevu-text-muted hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-prevu-surface-light text-prevu-text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Countdown & Progress Bar */}
        <div className={`px-6 py-3 border-b border-prevu-surface-light flex flex-wrap items-center justify-between gap-4 transition-colors ${
          isUrgent ? 'bg-rose-950/30 border-rose-500/30' : 'bg-prevu-surface/50'
        }`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-2xl sm:text-3xl font-mono font-extrabold tracking-wider ${
                isUrgent ? 'text-rose-400 animate-pulse' : 'text-white'
              }`}>
                {formatTime(secondsLeft)}
              </span>
              <span className="text-xs text-prevu-text-muted font-mono">
                / {formatTime(totalSeconds)}
              </span>
            </div>

            {isUrgent && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-300 bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/30">
                <AlertTriangle className="w-3.5 h-3.5" /> Final 10 Minutes!
              </span>
            )}
          </div>

          {/* Controller Buttons */}
          <div className="flex items-center gap-2">
            {status === 'idle' && (
              <Button size="sm" onClick={startExam} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Start Mock Exam
              </Button>
            )}

            {status === 'running' && (
              <>
                <Button size="sm" variant="outline" onClick={pauseExam} className="text-xs border-prevu-surface-light">
                  <Pause className="w-3.5 h-3.5 mr-1.5" /> Pause
                </Button>
                <Button size="sm" onClick={finishExam} className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Submit & End
                </Button>
              </>
            )}

            {status === 'paused' && (
              <>
                <Button size="sm" onClick={resumeExam} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold">
                  <Play className="w-3.5 h-3.5 mr-1.5 fill-current" /> Resume
                </Button>
                <Button size="sm" variant="outline" onClick={resetExam} className="text-xs border-prevu-surface-light">
                  <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Reset
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Linear Time Progress Indicator */}
        <div className="w-full h-1 bg-prevu-bg overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${
              isUrgent ? 'bg-rose-500' : 'bg-prevu-accent'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Exam Workspace: Question Paper PDF Viewer + Question Checkpad */}
        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left/Main: Embedded PDF Viewer */}
          <div className="flex-1 bg-prevu-bg relative overflow-hidden flex flex-col">
            <iframe
              src={`/api/preview/${resource.id}#toolbar=0`}
              className="w-full h-full border-0"
              title="Question Paper Mock View"
            />
          </div>

          {/* Right/Side: Question Checklist & Exam Guidelines */}
          <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-prevu-surface-light bg-prevu-surface/90 flex flex-col p-4 overflow-y-auto">
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-prevu-accent" /> Questions Attempted
            </h3>
            <p className="text-[11px] text-prevu-text-muted mb-3">
              Mark questions as you complete them on your physical paper:
            </p>

            {/* Checklist of 1 to 10 */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(qNum => {
                const isChecked = attemptedQuestions.includes(qNum)
                return (
                  <button
                    key={qNum}
                    onClick={() => toggleAttempted(qNum)}
                    className={`h-9 rounded-xl font-mono text-xs font-bold transition-all border ${
                      isChecked 
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm' 
                        : 'bg-prevu-bg text-prevu-text-muted border-prevu-surface-light hover:text-white'
                    }`}
                  >
                    Q{qNum}
                  </button>
                )
              })}
            </div>

            <div className="p-3 rounded-xl bg-prevu-bg/70 border border-prevu-surface-light text-xs text-prevu-text-muted space-y-2 mb-4">
              <div className="font-semibold text-white flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> Exam Rules Reminder
              </div>
              <ul className="list-disc list-inside space-y-1 text-[11px]">
                <li>Section A (Short): 2 marks each</li>
                <li>Section B (Medium): 4-5 marks each</li>
                <li>Section C (Long): 10 marks numerical/derivation</li>
                <li>Write on real notebook pages to simulate exam conditions</li>
              </ul>
            </div>

            {status === 'finished' && (
              <div className="mt-auto p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-prevu-surface border border-emerald-500/30 text-center animate-fade-in">
                <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white mb-1">Exam Finished!</h4>
                <p className="text-xs text-prevu-text-muted mb-3">
                  You completed {attemptedQuestions.length} of 10 questions. Review model answers using AI Blueprint.
                </p>
                <Button size="sm" onClick={resetExam} className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  Practice Again
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
