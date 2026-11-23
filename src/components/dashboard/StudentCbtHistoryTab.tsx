'use client'

import React from 'react'
import { 
  Zap, 
  Trophy, 
  Clock, 
  ArrowRight, 
  RotateCcw, 
  Award, 
  CheckCircle2, 
  Flame, 
  ExternalLink,
  BookOpen
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { UserCbtHistoryItem } from '@/lib/cbt/actions'

interface StudentCbtHistoryTabProps {
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

export default function StudentCbtHistoryTab({ attempts = [] }: StudentCbtHistoryTabProps) {
  const totalAttempts = attempts.length
  const avgPercentage = totalAttempts > 0 
    ? Math.round(attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts * 10) / 10 
    : 0
  const totalQuestionsSolved = attempts.reduce((sum, a) => sum + (a.score || 0), 0)
  const totalQuestionsAttempted = attempts.reduce((sum, a) => sum + (a.totalQuestions || 0), 0)

  if (totalAttempts === 0) {
    return (
      <div className="p-8 sm:p-12 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light text-center space-y-6 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400 shadow-xl">
          <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>

        <div className="space-y-2 max-w-lg mx-auto">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            No CBT Mock Exams Attempted Yet
          </h3>
          <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
            Test your knowledge with authentic Chandigarh University syllabus CBT exams. Features official test timers, instantaneous score percentiles, and live campus leaderboards.
          </p>
        </div>

        <Button
          size="lg"
          asChild
          className="h-11 px-6 text-xs sm:text-sm font-bold bg-gradient-to-r from-prevu-accent to-purple-600 hover:opacity-95 text-white shadow-xl shadow-prevu-accent/25 rounded-2xl cursor-pointer"
        >
          <Link href="/cbt" className="flex items-center gap-2">
            <span>Explore CBT Arena Suites</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* 1. HERO METRIC STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-1">
          <div className="text-[11px] font-mono uppercase text-prevu-text-muted flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Mocks Taken</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-white">
            {totalAttempts}
          </div>
          <div className="text-[10px] text-zinc-400">
            Official CU Suites
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-1">
          <div className="text-[11px] font-mono uppercase text-prevu-text-muted flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Avg Accuracy</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400">
            {avgPercentage}%
          </div>
          <div className="text-[10px] text-zinc-400">
            Across all attempts
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-1">
          <div className="text-[11px] font-mono uppercase text-prevu-text-muted flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Correct MCQs</span>
          </div>
          <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
            {totalQuestionsSolved} <span className="text-xs font-normal text-zinc-400">/ {totalQuestionsAttempted}</span>
          </div>
          <div className="text-[10px] text-zinc-400">
            Verified answers
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light flex flex-col justify-between space-y-1">
          <div className="text-[11px] font-mono uppercase text-prevu-text-muted flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>Hall of Fame</span>
          </div>
          <Link
            href="/cbt#cbt-leaderboard-section"
            className="text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors"
          >
            <span>Campus Rankings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <div className="text-[10px] text-zinc-400">
            Compare with peers
          </div>
        </div>
      </div>

      {/* 2. ATTEMPTS CARDS GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-prevu-text-muted px-1">
          <span className="font-bold text-white uppercase tracking-wider text-[11px] font-mono flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-prevu-accent" />
            <span>Mock Test History & Scores</span>
          </span>
          <Link 
            href="/cbt" 
            className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 text-[11px]"
          >
            <span>Explore All Test Suites</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attempts.map((attempt) => {
            const isMaster = attempt.percentage >= 85
            const isProficient = attempt.percentage >= 70 && attempt.percentage < 85
            const isPassing = attempt.percentage >= 50 && attempt.percentage < 70

            let badgeBg = 'bg-rose-500/10 text-rose-300 border-rose-500/25'
            let badgeText = 'Revision Needed'
            if (isMaster) {
              badgeBg = 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              badgeText = 'Campus Master'
            } else if (isProficient) {
              badgeBg = 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
              badgeText = 'Proficient'
            } else if (isPassing) {
              badgeBg = 'bg-amber-500/15 text-amber-300 border-amber-500/30'
              badgeText = 'Passing Pace'
            }

            return (
              <div
                key={attempt.id || `${attempt.subjectCode}-${attempt.updatedAt}`}
                className="p-5 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-accent/50 transition-all flex flex-col justify-between space-y-4 shadow-xl card-hover-lift group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-mono font-black text-cyan-300 bg-cyan-500/10 border border-cyan-500/25">
                      {attempt.subjectCode}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${badgeBg}`}>
                      {badgeText}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white group-hover:text-cyan-200 transition-colors leading-snug line-clamp-1">
                    {attempt.subjectName}
                  </h4>

                  {/* Score & Pacing Strip */}
                  <div className="p-3 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light flex items-center justify-between font-mono text-xs shadow-inner">
                    <div>
                      <span className="text-[10px] text-prevu-text-muted block">Score Accuracy</span>
                      <span className="text-base font-black text-emerald-400">
                        {attempt.percentage}%
                      </span>
                      <span className="text-[10px] text-zinc-400 ml-1">
                        ({attempt.score}/{attempt.totalQuestions})
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-prevu-text-muted block">Pacing & Duration</span>
                      <span className="font-bold text-white">
                        {formatDuration(attempt.timeSpentSeconds)}
                      </span>
                      <span className="text-[10px] text-zinc-400 block">
                        {attempt.attemptsCount} attempt{attempt.attemptsCount > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-2 border-t border-prevu-surface-light/40 flex items-center justify-between gap-3 text-xs">
                  <span className="text-[10px] font-mono text-prevu-text-muted">
                    {formatRelativeTime(attempt.updatedAt)}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/cbt?subject=${encodeURIComponent(attempt.subjectCode)}`}
                      className="px-3 py-1.5 rounded-xl bg-prevu-accent/15 hover:bg-prevu-accent/30 text-prevu-accent text-xs font-bold flex items-center gap-1.5 transition-all border border-prevu-accent/25"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Re-take Mock</span>
                    </Link>

                    <Link
                      href="/cbt#cbt-leaderboard-section"
                      title="View campus standings"
                      className="p-1.5 rounded-xl bg-prevu-bg border border-prevu-surface-light hover:border-amber-500/40 text-prevu-text-muted hover:text-amber-300 transition-all"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      </div>

    </div>
  )
}
