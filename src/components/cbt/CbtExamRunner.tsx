'use client'

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { CbtQuestion, CbtSubject, CbtExamConfig, CbtUserAnswer, CbtLeaderboardEntry } from '@/lib/cbt/types'
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Flag, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Trophy, 
  Sparkles, 
  Flame, 
  Check, 
  X, 
  ChevronRight,
  BookmarkCheck,
  ShieldAlert,
  Layers,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { recordCbtAttempt, getCbtLeaderboard } from '@/lib/cbt/actions'
import { CollaboratorBadge } from '@/components/ui/CollaboratorBadge'
import Link from 'next/link'

interface CbtExamRunnerProps {
  subject: CbtSubject
  questions: CbtQuestion[]
  config: CbtExamConfig
  onExit: () => void
  onRetake: () => void
}

export default function CbtExamRunner({
  subject,
  questions,
  config,
  onExit,
  onRetake
}: CbtExamRunnerProps) {
  const totalCount = questions.length

  // Exam Progress State
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({})
  const [markedForReview, setMarkedForReview] = useState<Record<string, boolean>>({})
  const [visitedQuestions, setVisitedQuestions] = useState<Record<string, boolean>>({
    [questions[0]?.id || '']: true
  })

  // Timer State
  const initialSeconds = config.timeLimitMinutes * 60
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds)
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false)
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false)

  // Results State
  const [activeTab, setActiveTab] = useState<'review' | 'leaderboard'>('review')
  const [leaderboard, setLeaderboard] = useState<CbtLeaderboardEntry[]>([])
  const [earnedKarma, setEarnedKarma] = useState<number | null>(null)
  const [isSavingScore, setIsSavingScore] = useState<boolean>(false)

  const currentQ = questions[currentIndex]

  // Track visited questions as user navigates
  useEffect(() => {
    if (currentQ?.id) {
      setVisitedQuestions(prev => ({ ...prev, [currentQ.id]: true }))
    }
  }, [currentQ?.id])

  // Timer Countdown Effect
  useEffect(() => {
    if (isSubmitted || secondsLeft <= 0) return

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsTimeUp(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isSubmitted, secondsLeft])

  // Format MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Answer Option Selection
  const handleToggleOption = (optionId: string) => {
    if (!currentQ || isSubmitted) return

    const currentSelected = selectedAnswers[currentQ.id] || []

    if (currentQ.type === 'single') {
      // Single choice radio
      setSelectedAnswers(prev => ({
        ...prev,
        [currentQ.id]: [optionId]
      }))
    } else {
      // Multi-select checkbox
      if (currentSelected.includes(optionId)) {
        setSelectedAnswers(prev => ({
          ...prev,
          [currentQ.id]: currentSelected.filter(id => id !== optionId)
        }))
      } else {
        setSelectedAnswers(prev => ({
          ...prev,
          [currentQ.id]: [...currentSelected, optionId]
        }))
      }
    }
  }

  const handleClearResponse = () => {
    if (!currentQ || isSubmitted) return
    setSelectedAnswers(prev => {
      const next = { ...prev }
      delete next[currentQ.id]
      return next
    })
  }

  const handleToggleReview = () => {
    if (!currentQ || isSubmitted) return
    setMarkedForReview(prev => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id]
    }))
  }

  // Question navigation
  const handleNext = () => {
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  // Calculate score and answers
  const evaluatedResults = useMemo(() => {
    let correctCount = 0

    const userAnswers: CbtUserAnswer[] = questions.map(q => {
      const chosen = (selectedAnswers[q.id] || []).sort()
      const correct = [...q.correctAnswers].sort()

      const isCorrect = chosen.length === correct.length && 
        chosen.every((val, idx) => val === correct[idx])

      if (isCorrect) correctCount++

      return {
        questionId: q.id,
        selectedOptions: chosen,
        isCorrect,
        isMarkedForReview: Boolean(markedForReview[q.id])
      }
    })

    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 1000) / 10 : 0
    const timeSpent = initialSeconds - secondsLeft

    return {
      score: correctCount,
      totalCount,
      percentage,
      timeSpentSeconds: timeSpent,
      userAnswers
    }
  }, [questions, selectedAnswers, markedForReview, totalCount, initialSeconds, secondsLeft])

  // Final Submission Handler
  const handleSubmitExam = useCallback(async () => {
    setShowConfirmModal(false)
    setIsSubmitted(true)
    setIsSavingScore(true)

    try {
      const res = await recordCbtAttempt({
        subjectCode: subject.code,
        score: evaluatedResults.score,
        totalQuestions: totalCount,
        timeSpentSeconds: evaluatedResults.timeSpentSeconds,
        allottedMinutes: config.timeLimitMinutes,
        answers: evaluatedResults.userAnswers
      })

      if (res?.earnedKarma) {
        setEarnedKarma(res.earnedKarma)
      }

      if (res?.leaderboard && res.leaderboard.length > 0) {
        setLeaderboard(res.leaderboard)
      } else {
        const lb = await getCbtLeaderboard(subject.code)
        if (lb && lb.length > 0) {
          setLeaderboard(lb)
        } else {
          // Guaranteed instant fallback
          setLeaderboard([
            {
              rank: 1,
              userId: 'current-user',
              username: 'you',
              userName: 'Your Latest Attempt',
              cuVerified: true,
              subjectCode: subject.code,
              score: evaluatedResults.score,
              totalQuestions: totalCount,
              percentage: evaluatedResults.percentage,
              timeSpentSeconds: evaluatedResults.timeSpentSeconds,
              attemptsCount: 1,
              updatedAt: new Date().toISOString()
            }
          ])
        }
      }
    } catch (err) {
      console.warn('Failed to record attempt:', err)
      // Guaranteed instant fallback
      setLeaderboard([
        {
          rank: 1,
          userId: 'current-user',
          username: 'you',
          userName: 'Your Latest Attempt',
          cuVerified: true,
          subjectCode: subject.code,
          score: evaluatedResults.score,
          totalQuestions: totalCount,
          percentage: evaluatedResults.percentage,
          timeSpentSeconds: evaluatedResults.timeSpentSeconds,
          attemptsCount: 1,
          updatedAt: new Date().toISOString()
        }
      ])
    } finally {
      setIsSavingScore(false)
    }
  }, [subject.code, evaluatedResults, totalCount, config.timeLimitMinutes])

  // Automatically refresh leaderboard when submitted or switching to leaderboard tab
  useEffect(() => {
    if (isSubmitted && activeTab === 'leaderboard') {
      getCbtLeaderboard(subject.code).then(lb => {
        if (lb && lb.length > 0) {
          setLeaderboard(lb)
        }
      }).catch(console.warn)
    }
  }, [isSubmitted, activeTab, subject.code])

  // Auto-submit on time up
  useEffect(() => {
    if (isTimeUp && !isSubmitted) {
      handleSubmitExam()
    }
  }, [isTimeUp, isSubmitted, handleSubmitExam])

  // Question count stats
  const answeredCount = Object.keys(selectedAnswers).filter(k => (selectedAnswers[k] || []).length > 0).length
  const reviewCount = Object.keys(markedForReview).filter(k => markedForReview[k]).length

  // =========================================================================
  // RENDER RESULTS & PERFORMANCE VIEW
  // =========================================================================
  if (isSubmitted) {
    const isPassing = evaluatedResults.percentage >= 50

    return (
      <div className="min-h-screen bg-prevu-bg text-prevu-text py-8 px-4">
        <div className="container mx-auto max-w-4xl space-y-8 animate-fade-in">
          
          {/* Top Return Banner */}
          <div className="flex items-center justify-between">
            <button
              onClick={onExit}
              className="inline-flex items-center gap-2 text-xs font-semibold text-prevu-text-muted hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to CBT Arena</span>
            </button>

            <Button
              onClick={onRetake}
              className="h-9 px-4 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-lg flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Mock Test</span>
            </Button>
          </div>

          {/* Hero Score Card */}
          <div className="relative overflow-hidden rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-4">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-prevu-accent/15 blur-3xl pointer-events-none rounded-full" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
              <Trophy className="w-3.5 h-3.5" />
              <span>CBT Exam Completed</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {subject.name}
            </h1>
            <p className="text-xs text-prevu-text-muted font-mono">
              Course Code: <strong className="text-cyan-300">{subject.code}</strong> • Sem {subject.semester}
            </p>

            {/* Score Ring / Pill */}
            <div className="pt-2 flex flex-col items-center justify-center">
              <div className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-prevu-accent">
                {evaluatedResults.score} <span className="text-2xl text-prevu-text-muted font-normal">/ {totalCount}</span>
              </div>
              <div className="text-sm font-bold text-cyan-400 mt-1">
                {evaluatedResults.percentage}% Accuracy
              </div>
            </div>

            {/* Metric Strip */}
            <div className="grid grid-cols-3 gap-3 pt-4 max-w-lg mx-auto">
              <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light">
                <span className="text-[10px] uppercase font-mono text-prevu-text-muted block">Time Taken</span>
                <span className="text-sm font-bold text-white font-mono">
                  {Math.floor(evaluatedResults.timeSpentSeconds / 60)}m {evaluatedResults.timeSpentSeconds % 60}s
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light">
                <span className="text-[10px] uppercase font-mono text-prevu-text-muted block">Status</span>
                <span className={`text-sm font-bold font-mono ${isPassing ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isPassing ? 'PASSED 🎯' : 'NEEDS PRACTICE'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light">
                <span className="text-[10px] uppercase font-mono text-prevu-text-muted block">Leaderboard</span>
                <span className="text-sm font-bold text-purple-300 font-mono">
                  Updated Live 🔥
                </span>
              </div>
            </div>

            {/* Karma Points Award Notification */}
            {earnedKarma && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold animate-bounce shadow-md">
                <Flame className="w-4 h-4 text-amber-400" />
                <span>Awesome! You earned <strong>+{earnedKarma} Scholar Karma</strong> for this test!</span>
              </div>
            )}
          </div>

          {/* Navigation Tabs (Solutions Review vs Leaderboard) */}
          <div className="flex items-center justify-center gap-3 border-b border-prevu-surface-light pb-2">
            <button
              onClick={() => setActiveTab('review')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'review'
                  ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              <span>Question Solutions & Explanations ({totalCount})</span>
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'leaderboard'
                  ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Subject Leaderboard</span>
            </button>
          </div>

          {/* TAB 1: SOLUTIONS & EXPLANATIONS */}
          {activeTab === 'review' && (
            <div className="space-y-4">
              {questions.map((q, idx) => {
                const ans = evaluatedResults.userAnswers[idx]
                const isCorrect = ans?.isCorrect
                const selected = ans?.selectedOptions || []

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-3xl border transition-all space-y-3 ${
                      isCorrect 
                        ? 'bg-emerald-950/20 border-emerald-500/30 shadow-md' 
                        : 'bg-prevu-surface/70 border-rose-500/30 shadow-md'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-prevu-bg border border-prevu-surface-light flex items-center justify-center text-xs font-mono font-bold text-white shrink-0">
                          {idx + 1}
                        </span>
                        <div className="text-[11px] text-prevu-text-muted font-mono">
                          {q.sectionName || q.partName}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" /> Correct (+1)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                            <XCircle className="w-3 h-3" /> Incorrect (0)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Question Text */}
                    <h4 className="text-sm font-semibold text-white leading-relaxed">
                      {q.question}
                    </h4>

                    {/* Options list */}
                    <div className="space-y-2 pt-1">
                      {q.options.map(opt => {
                        const isCorrectOption = q.correctAnswers.includes(opt.id)
                        const wasChosenByUser = selected.includes(opt.id)

                        let style = 'bg-prevu-bg/50 border-prevu-surface-light text-prevu-text-muted'
                        if (isCorrectOption) {
                          style = 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold'
                        } else if (wasChosenByUser && !isCorrectOption) {
                          style = 'bg-rose-950/40 border-rose-500/60 text-rose-300 font-semibold line-through'
                        }

                        return (
                          <div
                            key={opt.id}
                            className={`p-3 rounded-2xl border text-xs flex items-center justify-between gap-3 ${style}`}
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-5 h-5 rounded-lg bg-black/30 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                {opt.id}
                              </span>
                              <span>{opt.text}</span>
                            </div>

                            <div className="shrink-0 text-[10px] font-bold">
                              {isCorrectOption && (
                                <span className="text-emerald-400">✓ Correct Key</span>
                              )}
                              {wasChosenByUser && !isCorrectOption && (
                                <span className="text-rose-400">✗ Your Choice</span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Explanation Box from PDF */}
                    {q.explanation && (
                      <div className="p-3.5 rounded-2xl bg-prevu-bg/90 border border-cyan-500/25 text-xs text-prevu-text leading-relaxed space-y-1">
                        <div className="text-[10px] uppercase font-mono font-bold text-cyan-400 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3" /> Official CU Solution Explanation
                        </div>
                        <p className="text-prevu-text-muted text-[11px] leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* TAB 2: LIVE LEADERBOARD */}
          {activeTab === 'leaderboard' && (
            <div className="p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-prevu-surface-light/60 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>Top Scores for {subject.code}</span>
                  </h3>
                  <p className="text-xs text-prevu-text-muted mt-0.5">
                    Rankings update automatically with your latest attempt score
                  </p>
                </div>
              </div>

              {leaderboard.length > 0 ? (
                <div className="divide-y divide-prevu-surface-light/40">
                  {leaderboard.map((entry, idx) => (
                    <div key={`${entry.userId}-${idx}`} className="py-3 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                          idx === 0 ? 'bg-amber-500 text-black font-extrabold shadow-md' :
                          idx === 1 ? 'bg-zinc-300 text-black font-bold' :
                          idx === 2 ? 'bg-amber-700 text-white font-bold' :
                          'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted'
                        }`}>
                          #{idx + 1}
                        </span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>@{entry.username}</span>
                            {entry.cuVerified && (
                              <CollaboratorBadge karma={25} size="sm" showKarma={false} />
                            )}
                          </div>
                          <div className="text-[10px] text-prevu-text-muted">
                            {entry.userName} • {entry.attemptsCount} attempts
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-bold text-cyan-300 text-sm">
                          {entry.score} / {entry.totalQuestions} ({entry.percentage}%)
                        </div>
                        <div className="text-[10px] text-prevu-text-muted font-mono">
                          {Math.floor(entry.timeSpentSeconds / 60)}m {entry.timeSpentSeconds % 60}s
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-prevu-text-muted">
                  No public leaderboard entries yet. Be the first to record a top score!
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    )
  }

  // =========================================================================
  // RENDER LIVE ACTIVE CBT EXAM VIEW
  // =========================================================================
  return (
    <div className="min-h-screen bg-prevu-bg text-prevu-text flex flex-col">
      
      {/* Sticky Top CBT Header */}
      <header className="sticky top-0 z-40 bg-prevu-surface/95 border-b border-prevu-surface-light backdrop-blur-md px-4 py-3 shadow-xl">
        <div className="container mx-auto max-w-6xl flex items-center justify-between gap-3">
          
          {/* Subject & Code info */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono font-bold text-xs shrink-0">
              CBT
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate max-w-[220px] sm:max-w-md">
                {subject.name}
              </h2>
              <div className="text-[10px] text-prevu-text-muted font-mono">
                {subject.code} • Question {currentIndex + 1} of {totalCount}
              </div>
            </div>
          </div>

          {/* Center Timer Display */}
          <div className={`px-3 py-1.5 rounded-2xl border flex items-center gap-2 font-mono font-bold text-xs sm:text-sm shadow-md transition-colors ${
            secondsLeft < 120 
              ? 'bg-rose-950/60 border-rose-500 text-rose-300 animate-pulse' 
              : secondsLeft < 300 
                ? 'bg-amber-950/60 border-amber-500 text-amber-300' 
                : 'bg-prevu-bg border-prevu-surface-light text-cyan-300'
          }`}>
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(secondsLeft)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowConfirmModal(true)}
              className="text-xs font-bold border-prevu-accent/50 text-prevu-accent hover:bg-prevu-accent/10"
            >
              Submit Exam
            </Button>
          </div>

        </div>
      </header>

      {/* Main Examination Layout */}
      <main className="flex-1 container mx-auto max-w-6xl p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Active Question Workspace (Takes 3 of 4 columns) */}
        <section className="lg:col-span-3 space-y-6">
          
          {/* Question Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-prevu-surface/80 border border-prevu-surface-light shadow-2xl backdrop-blur-md space-y-6">
            
            {/* Top Question Tag Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-prevu-surface-light/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg bg-prevu-accent/15 text-prevu-accent font-mono font-bold text-xs border border-prevu-accent/25">
                  Question {currentIndex + 1}
                </span>
                <span className="text-[11px] text-prevu-text-muted font-medium">
                  {currentQ?.sectionName || currentQ?.partName}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full ${
                  currentQ?.type === 'multiple' 
                    ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30' 
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                }`}>
                  {currentQ?.type === 'multiple' ? 'Multiple Answers (Select all that apply)' : 'Single Choice'}
                </span>
              </div>
            </div>

            {/* Question Title */}
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ?.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ?.options.map(opt => {
                const isSelected = (selectedAnswers[currentQ.id] || []).includes(opt.id)

                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleOption(opt.id)}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-3.5 group ${
                      isSelected
                        ? 'bg-prevu-accent/15 border-prevu-accent text-white shadow-lg shadow-prevu-accent/15'
                        : 'bg-prevu-bg/50 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-surface-light/80 hover:bg-prevu-surface-light/30'
                    }`}
                  >
                    {/* Circle / Box Indicator */}
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 transition-all ${
                      isSelected
                        ? 'bg-prevu-accent text-white shadow-md'
                        : 'bg-black/40 border border-prevu-surface-light text-prevu-text-muted group-hover:text-white'
                    }`}>
                      {opt.id}
                    </div>

                    <span className="flex-1 leading-relaxed">{opt.text}</span>

                    {isSelected && (
                      <Check className="w-4 h-4 text-prevu-accent shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>

          </div>

          {/* Bottom Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleToggleReview}
                className={`text-xs h-9 px-3 border transition-all ${
                  markedForReview[currentQ?.id || '']
                    ? 'bg-purple-900/40 border-purple-500 text-purple-300'
                    : 'border-prevu-surface-light text-prevu-text-muted hover:text-white'
                }`}
              >
                <Flag className="w-3.5 h-3.5 mr-1" />
                <span>{markedForReview[currentQ?.id || ''] ? 'Marked for Review' : 'Mark for Review'}</span>
              </Button>

              {(selectedAnswers[currentQ?.id || ''] || []).length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClearResponse}
                  className="text-xs h-9 text-prevu-text-muted hover:text-rose-400"
                >
                  Clear Response
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={currentIndex === 0}
                onClick={handlePrev}
                className="text-xs h-9 px-3 border-prevu-surface-light disabled:opacity-40"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Previous
              </Button>

              {currentIndex < totalCount - 1 ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleNext}
                  className="text-xs h-9 px-4 bg-prevu-accent text-white font-bold hover:bg-prevu-accent-hover shadow-md"
                >
                  Next <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setShowConfirmModal(true)}
                  className="text-xs h-9 px-5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold shadow-md"
                >
                  Submit Final <Check className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          </div>

        </section>

        {/* Right Column: Question Palette (Takes 1 column) */}
        <aside className="space-y-4">
          <div className="p-5 rounded-3xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl backdrop-blur-md space-y-4">
            
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-prevu-accent" />
              <span>Question Palette ({totalCount})</span>
            </h4>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-medium text-prevu-text-muted border-b border-prevu-surface-light/60 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-emerald-500" />
                <span>Answered ({answeredCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-purple-500" />
                <span>Review ({reviewCount})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md bg-prevu-bg border border-prevu-surface-light" />
                <span>Unvisited ({totalCount - Object.keys(visitedQuestions).length})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-md border border-prevu-accent bg-prevu-accent/20" />
                <span>Current</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="grid grid-cols-5 gap-1.5 max-h-[360px] overflow-y-auto scrollbar-thin pr-1">
              {questions.map((q, idx) => {
                const isCurrent = idx === currentIndex
                const isAnswered = (selectedAnswers[q.id] || []).length > 0
                const isMarked = markedForReview[q.id]
                const isVisited = visitedQuestions[q.id]

                let badgeStyle = 'bg-prevu-bg border-prevu-surface-light text-prevu-text-muted hover:border-prevu-accent/50'

                if (isCurrent) {
                  badgeStyle = 'bg-prevu-accent text-white border-prevu-accent ring-2 ring-prevu-accent/40 font-bold scale-105'
                } else if (isMarked && isAnswered) {
                  badgeStyle = 'bg-gradient-to-r from-emerald-600 to-purple-600 text-white border-purple-400 font-bold'
                } else if (isMarked) {
                  badgeStyle = 'bg-purple-600 text-white border-purple-400 font-bold'
                } else if (isAnswered) {
                  badgeStyle = 'bg-emerald-600 text-white border-emerald-500 font-bold'
                } else if (isVisited) {
                  badgeStyle = 'bg-prevu-surface-light/40 border-prevu-surface-light text-white'
                }

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-8 rounded-xl border text-xs font-mono transition-all cursor-pointer flex items-center justify-center ${badgeStyle}`}
                  >
                    {idx + 1}
                  </button>
                )
              })}
            </div>

            {/* Quick Submit button in sidebar */}
            <div className="pt-2">
              <Button
                type="button"
                onClick={() => setShowConfirmModal(true)}
                className="w-full text-xs h-9 bg-prevu-accent text-white font-bold hover:bg-prevu-accent-hover shadow-md"
              >
                Submit Examination
              </Button>
            </div>

          </div>
        </aside>

      </main>

      {/* Confirmation Modal before Submit */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-2xl space-y-5 text-center">
            <div className="w-12 h-12 rounded-2xl bg-prevu-accent/15 border border-prevu-accent/30 flex items-center justify-center text-prevu-accent mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-white">
                Submit CBT Mock Exam?
              </h3>
              <p className="text-xs text-prevu-text-muted mt-1 leading-relaxed">
                You have answered <strong>{answeredCount} of {totalCount}</strong> questions.
                {reviewCount > 0 && ` (${reviewCount} marked for review)`}
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-prevu-bg border border-prevu-surface-light flex justify-around text-xs font-mono">
              <div>
                <span className="text-[10px] text-prevu-text-muted block">Answered</span>
                <span className="font-bold text-emerald-400">{answeredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-prevu-text-muted block">Unanswered</span>
                <span className="font-bold text-rose-400">{totalCount - answeredCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-prevu-text-muted block">Time Left</span>
                <span className="font-bold text-cyan-300">{formatTime(secondsLeft)}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfirmModal(false)}
                className="text-xs h-9 border-prevu-surface-light"
              >
                Keep Testing
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitExam}
                className="text-xs h-9 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 shadow-lg shadow-emerald-600/20"
              >
                Confirm & Submit
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
