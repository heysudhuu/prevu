'use client'

import React from 'react'
import { 
  Zap, 
  Trophy, 
  Award, 
  Clock, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink,
  GraduationCap,
  Sparkles
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { UserCbtHistoryItem } from '@/lib/cbt/actions'

interface ProfileCbtTranscriptProps {
  attempts: UserCbtHistoryItem[]
}

function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '0s'
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (mins === 0) return `${secs}s`
  return `${mins}m ${secs}s`
}

function formatRelativeTime(dateStr?: string): string {
  if (!dateStr) return 'Recently'
  try {
    const diffMs = Date.now() - new Date(dateStr).getTime()
    const diffHours = Math.floor(diffMs / 3600000)
    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ago`
  } catch {
    return 'Recently'
  }
}

function getPerformanceBadge(percentage: number) {
  if (percentage >= 90) {
    return { label: 'Outstanding (O)', bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' }
  } else if (percentage >= 75) {
    return { label: 'Distinction (A+)', bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' }
  } else if (percentage >= 60) {
    return { label: 'First Class (A)', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' }
  } else if (percentage >= 40) {
    return { label: 'Passed (B)', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' }
  }
  return { label: 'Needs Practice (F)', bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30' }
}

export default function ProfileCbtTranscript({ attempts = [] }: ProfileCbtTranscriptProps) {
  const totalAttempts = attempts.length
  const bestPercentage = totalAttempts > 0 
    ? Math.max(...attempts.map(a => a.percentage)) 
    : 0
  const avgPercentage = totalAttempts > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts * 10) / 10 
    : 0
  const totalCorrect = attempts.reduce((sum, a) => sum + (a.score || 0), 0)
  const totalAttemptedQuestions = attempts.reduce((sum, a) => sum + (a.totalQuestions || 0), 0)

  return (
    <div className="space-y-5">
      {/* SECTION HEADER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-prevu-surface via-prevu-surface/90 to-prevu-surface border border-prevu-surface-light shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-xl shadow-amber-500/25 shrink-0">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                CBT Examination Academic Transcript
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase tracking-wider">
                Digital Record
              </span>
            </div>
            <p className="text-xs text-prevu-text-muted mt-0.5">
              Verified record of your computer-based mock exams, pacing speed, and syllabus mastery.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          asChild
          className="h-9 px-4 text-xs font-bold bg-prevu-accent hover:opacity-90 text-white shadow-lg shadow-prevu-accent/20 cursor-pointer self-start sm:self-auto shrink-0"
        >
          <Link href="/cbt" className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open CBT Arena</span>
            <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
          </Link>
        </Button>
      </div>

      {totalAttempts === 0 ? (
        <div className="p-8 sm:p-10 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto text-amber-400">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div className="space-y-1.5 max-w-md mx-auto">
            <h3 className="text-base font-bold text-white">No CBT Mock Attempts Recorded Yet</h3>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              When you take mock exams in the CBT Arena (e.g. ACP-101, UHV, Aptitude), your test scores, completion speed, and university rankings will permanently display here.
            </p>
          </div>
          <Button
            size="sm"
            asChild
            className="text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 cursor-pointer"
          >
            <Link href="/cbt" className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Take Your First Mock Exam
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {/* STATS STRIP */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-1">
              <div className="text-[10px] font-mono uppercase text-prevu-text-muted flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" /> Tests Taken
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {totalAttempts}
              </div>
              <div className="text-[10px] text-zinc-400">Official Exam Suites</div>
            </div>

            <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-1">
              <div className="text-[10px] font-mono uppercase text-prevu-text-muted flex items-center gap-1">
                <Trophy className="w-3 h-3 text-amber-400" /> Best Score
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-400">
                {bestPercentage}%
              </div>
              <div className="text-[10px] text-zinc-400">Peak Examination Score</div>
            </div>

            <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-1">
              <div className="text-[10px] font-mono uppercase text-prevu-text-muted flex items-center gap-1">
                <Award className="w-3 h-3 text-emerald-400" /> Avg Accuracy
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
                {avgPercentage}%
              </div>
              <div className="text-[10px] text-zinc-400">Across All Subjects</div>
            </div>

            <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-1">
              <div className="text-[10px] font-mono uppercase text-prevu-text-muted flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-cyan-400" /> MCQs Solved
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
                {totalCorrect} <span className="text-xs text-prevu-text-muted font-normal">/ {totalAttemptedQuestions}</span>
              </div>
              <div className="text-[10px] text-zinc-400">Correct Answers</div>
            </div>
          </div>

          {/* TRANSCRIPT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attempts.map((attempt) => {
              const badge = getPerformanceBadge(attempt.percentage)
              return (
                <div 
                  key={attempt.id || attempt.subjectCode}
                  className="p-5 rounded-3xl bg-prevu-surface/80 border border-prevu-surface-light hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30">
                        {attempt.subjectCode}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                        {badge.label}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
                      {attempt.subjectName}
                    </h3>

                    {/* METRICS ROW */}
                    <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-prevu-surface-light/80">
                      <div>
                        <div className="text-[10px] text-prevu-text-muted uppercase font-mono">Score</div>
                        <div className="text-sm font-black font-mono text-white mt-0.5">
                          {attempt.score} <span className="text-xs text-prevu-text-muted font-normal">/ {attempt.totalQuestions}</span>
                        </div>
                        <div className="text-[10px] font-bold text-emerald-400">
                          {attempt.percentage}%
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-prevu-text-muted uppercase font-mono">Pacing</div>
                        <div className="text-sm font-black font-mono text-zinc-200 mt-0.5 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>{formatDuration(attempt.timeSpentSeconds)}</span>
                        </div>
                        <div className="text-[10px] text-prevu-text-muted">
                          {formatRelativeTime(attempt.updatedAt)}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] text-prevu-text-muted uppercase font-mono">Attempts</div>
                        <div className="text-sm font-black font-mono text-purple-300 mt-0.5">
                          {attempt.attemptsCount || 1}x
                        </div>
                        <div className="text-[10px] text-prevu-text-muted">
                          Mock Runs
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      className="h-8 text-xs font-semibold border-prevu-surface-light hover:border-amber-500/50 hover:text-amber-300"
                    >
                      <Link href={`/cbt/exam?subject=${encodeURIComponent(attempt.subjectCode)}`} className="flex items-center gap-1.5">
                        <RotateCcw className="w-3 h-3 text-amber-400" /> Retake
                      </Link>
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                      className="h-8 text-xs font-semibold text-prevu-text-muted hover:text-white"
                    >
                      <Link href="/cbt#leaderboard" className="flex items-center gap-1">
                        <span>Leaderboard</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
