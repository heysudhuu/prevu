'use client'

import React, { useState, useTransition } from 'react'
import { CbtLeaderboardEntry, CbtSubject } from '@/lib/cbt/types'
import { CBT_SUBJECTS } from '@/lib/cbt/cbtRegistry'
import { 
  Trophy, 
  Crown, 
  Medal, 
  Clock, 
  Flame, 
  Sparkles, 
  RefreshCw, 
  Play, 
  Layers, 
  CheckCircle2, 
  ChevronRight,
  UserCheck,
  TrendingUp,
  Award,
  Zap,
  Star
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CollaboratorBadge } from '@/components/ui/CollaboratorBadge'
import { getCbtLeaderboard } from '@/lib/cbt/actions'

interface CbtFrontLeaderboardProps {
  initialLeaderboards: Record<string, CbtLeaderboardEntry[]>
  onSelectSubjectExam?: (subject: CbtSubject) => void
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

export default function CbtFrontLeaderboard({
  initialLeaderboards,
  onSelectSubjectExam
}: CbtFrontLeaderboardProps) {
  const [leaderboards, setLeaderboards] = useState<Record<string, CbtLeaderboardEntry[]>>(initialLeaderboards)
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('FSO-307')
  const [isRefreshing, startTransition] = useTransition()

  // Only include subjects that are ready with questions
  const readySubjects = CBT_SUBJECTS.filter(s => s.isReady)

  // Find all subjects that have leaderboard entries or ready status
  const subjectsWithEntries = readySubjects.map(subj => {
    const entries = leaderboards[subj.code] || []
    return {
      subject: subj,
      entries,
      leader: entries[0] || null
    }
  })

  // Subjects that currently have active leaders
  const activeLeadingSubjects = subjectsWithEntries.filter(s => s.leader !== null)

  // Current active subject data
  const currentSubjectObj = readySubjects.find(s => s.code === selectedSubjectCode) || readySubjects[0]
  const currentLeaderboard = leaderboards[selectedSubjectCode] || []

  // Top 3 Podium
  const topThree = currentLeaderboard.slice(0, 3)
  const remainingEntries = currentLeaderboard.slice(3)

  const handleRefresh = (subjectCode: string) => {
    startTransition(async () => {
      try {
        const updated = await getCbtLeaderboard(subjectCode)
        setLeaderboards(prev => ({
          ...prev,
          [subjectCode]: updated
        }))
      } catch (err) {
        console.warn('Failed to refresh leaderboard:', err)
      }
    })
  }

  return (
    <section id="cbt-leaderboard-section" className="space-y-8 scroll-mt-28">
      
      {/* ========================================================================= */}
      {/* SECTION HEADER */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-prevu-surface-light pb-6">
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25 shadow-sm">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="tracking-wider uppercase text-[11px] font-mono">Campus Leaderboard & Hall of Fame</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Who is Leading the CBT Arena Right Now</span>
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-prevu-text-muted max-w-2xl leading-relaxed">
            Live rankings update in real-time with each student&apos;s latest attempt. Reattempt any exam to beat the high score and claim Rank #1 across the university!
          </p>
        </div>

        {/* Refresh Action */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isRefreshing}
          onClick={() => handleRefresh(selectedSubjectCode)}
          className="h-10 px-4 text-xs font-bold border-prevu-surface-light bg-prevu-surface/80 text-prevu-text-muted hover:text-white hover:border-amber-500/40 rounded-xl cursor-pointer self-start sm:self-auto shrink-0 shadow-sm transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-amber-400'}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh Standings'}</span>
        </Button>
      </div>

      {/* ========================================================================= */}
      {/* 1. CURRENT LEADERS SPOTLIGHT DECK (Cards per subject) */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase tracking-wider text-prevu-text-muted font-bold flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span>Current Subject Champions</span>
          </h3>
          <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
            {activeLeadingSubjects.length} Active CBT Suite{activeLeadingSubjects.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeLeadingSubjects.map(({ subject, leader }) => {
            if (!leader) return null
            const isSelected = selectedSubjectCode === subject.code

            return (
              <div
                key={`leader-${subject.code}`}
                onClick={() => setSelectedSubjectCode(subject.code)}
                className={`p-5 rounded-3xl border transition-all duration-300 cursor-pointer relative overflow-hidden flex flex-col justify-between space-y-4 card-hover-lift shadow-xl ${
                  isSelected
                    ? 'bg-gradient-to-b from-amber-500/10 via-prevu-surface to-prevu-bg border-amber-500/60 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/40'
                    : 'bg-prevu-surface/80 border-prevu-surface-light hover:border-amber-500/40 hover:bg-prevu-surface shadow-md'
                }`}
              >
                {/* Subtle top amber highlight glow */}
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-60" />

                {/* Top Corner Pill */}
                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
                    <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>Rank #1 Leader</span>
                  </span>

                  <span className="text-xs font-mono text-cyan-400 font-bold bg-cyan-500/10 px-2 py-0.5 rounded-lg border border-cyan-500/20">
                    {subject.code}
                  </span>
                </div>

                {/* Subject Name */}
                <div>
                  <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-amber-200 transition-colors">
                    {subject.name}
                  </h4>
                  <p className="text-[11px] text-prevu-text-muted mt-0.5 line-clamp-1">
                    {subject.categoryLabel} • Sem {subject.semester}
                  </p>
                </div>

                {/* Leader Student Profile Box */}
                <div className="p-3.5 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light flex items-center justify-between gap-3 shadow-inner">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-extrabold flex items-center justify-center text-sm shadow-md shrink-0">
                      🥇
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                        <span>{leader.userName}</span>
                        {leader.cuVerified && (
                          <CollaboratorBadge karma={30} size="sm" showKarma={false} />
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-prevu-text-muted truncate">
                        @{leader.username}
                      </div>
                    </div>
                  </div>

                  {/* Leader Score */}
                  <div className="text-right shrink-0">
                    <div className="text-base font-black font-mono text-emerald-400">
                      {leader.percentage}%
                    </div>
                    <div className="text-[10px] font-mono text-prevu-text-muted">
                      {leader.score}/{leader.totalQuestions} • {formatDuration(leader.timeSpentSeconds)}
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="flex items-center justify-between pt-1 border-t border-prevu-surface-light/40">
                  <span className="text-[10px] font-mono text-prevu-text-muted">
                    {leader.attemptsCount} attempt{leader.attemptsCount > 1 ? 's' : ''} • {formatRelativeTime(leader.updatedAt)}
                  </span>

                  {subject.isReady && onSelectSubjectExam && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSelectSubjectExam(subject)
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    >
                      <span>Challenge Score</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            )
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DETAILED LEADERBOARD HUB WITH SUBJECT SWITCHER */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0f0f1a]/95 border border-prevu-surface-light shadow-2xl backdrop-blur-2xl space-y-7">
        
        {/* Subject Filter Tabs Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-prevu-surface-light/80 pb-5">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Full Subject Rankings Table</span>
            </h3>
            <p className="text-xs text-prevu-text-muted">
              Select an exam suite to view verified peers, completion speed, and accuracy curves.
            </p>
          </div>

          {/* Subject Pills */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 scrollbar-none">
            {readySubjects.map(subj => {
              const count = (leaderboards[subj.code] || []).length
              const isActive = selectedSubjectCode === subj.code

              return (
                <button
                  key={subj.code}
                  type="button"
                  onClick={() => setSelectedSubjectCode(subj.code)}
                  className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-prevu-accent text-white border-prevu-accent shadow-md shadow-prevu-accent/25'
                      : 'bg-prevu-bg/80 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-accent/40'
                  }`}
                >
                  <span>{subj.code}</span>
                  {count > 0 && (
                    <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-prevu-surface-light text-prevu-text-muted'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Selected Subject Title & Quick Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-prevu-bg/70 border border-prevu-surface-light shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
              <span>{currentSubjectObj.code}</span>
              <span className="text-prevu-text-muted">•</span>
              <span className="text-prevu-text-muted font-normal">{currentSubjectObj.categoryLabel}</span>
            </div>
            <h4 className="text-base font-bold text-white mt-0.5">
              {currentSubjectObj.name}
            </h4>
          </div>

          {currentSubjectObj.isReady && onSelectSubjectExam && (
            <Button
              size="sm"
              onClick={() => onSelectSubjectExam(currentSubjectObj)}
              className="h-10 px-5 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-md shadow-prevu-accent/25 rounded-xl flex items-center gap-2 shrink-0 cursor-pointer transform hover:scale-[1.02] transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Take This Mock Test</span>
            </Button>
          )}
        </div>

        {/* TOP 3 PODIUM DISPLAY */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            
            {/* Rank 1 - Champion */}
            {topThree[0] && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/15 via-prevu-bg/90 to-prevu-bg border border-amber-500/50 relative overflow-hidden flex flex-col justify-between space-y-4 shadow-xl shadow-amber-500/10">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-amber-500 text-black font-black flex items-center justify-center text-xs shadow-md">
                    🥇 #1
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-400 flex items-center gap-1.5 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Crown className="w-3 h-3" /> Gold Leader
                  </span>
                </div>

                <div>
                  <div className="font-bold text-white text-base flex items-center gap-1.5">
                    <span className="truncate">{topThree[0].userName}</span>
                    {topThree[0].cuVerified && (
                      <CollaboratorBadge karma={30} size="sm" showKarma={false} />
                    )}
                  </div>
                  <div className="text-xs text-prevu-text-muted font-mono mt-0.5">
                    @{topThree[0].username}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-2xl font-black text-emerald-400">{topThree[0].percentage}%</span>
                    <span className="text-[10px] text-prevu-text-muted ml-1.5 font-normal">({topThree[0].score}/{topThree[0].totalQuestions})</span>
                  </div>
                  <div className="text-right text-prevu-text-muted text-[11px] flex items-center gap-1.5 bg-prevu-surface/60 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-white font-medium">{formatDuration(topThree[0].timeSpentSeconds)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 2 - Silver */}
            {topThree[1] && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-400/15 via-prevu-bg/90 to-prevu-bg border border-slate-400/40 flex flex-col justify-between space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-zinc-300 text-black font-black flex items-center justify-center text-xs shadow-md">
                    🥈 #2
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold text-zinc-300 bg-zinc-400/10 px-2 py-0.5 rounded-full border border-zinc-400/20">
                    Silver Medalist
                  </span>
                </div>

                <div>
                  <div className="font-bold text-white text-base flex items-center gap-1.5">
                    <span className="truncate">{topThree[1].userName}</span>
                    {topThree[1].cuVerified && (
                      <CollaboratorBadge karma={20} size="sm" showKarma={false} />
                    )}
                  </div>
                  <div className="text-xs text-prevu-text-muted font-mono mt-0.5">
                    @{topThree[1].username}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-500/20 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-xl font-bold text-cyan-300">{topThree[1].percentage}%</span>
                    <span className="text-[10px] text-prevu-text-muted ml-1.5 font-normal">({topThree[1].score}/{topThree[1].totalQuestions})</span>
                  </div>
                  <div className="text-right text-prevu-text-muted text-[11px] flex items-center gap-1.5 bg-prevu-surface/60 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-white font-medium">{formatDuration(topThree[1].timeSpentSeconds)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 3 - Bronze */}
            {topThree[2] && (
              <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-700/15 via-prevu-bg/90 to-prevu-bg border border-amber-700/40 flex flex-col justify-between space-y-4 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="w-8 h-8 rounded-xl bg-amber-700 text-white font-black flex items-center justify-center text-xs shadow-md">
                    🥉 #3
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold text-amber-500 bg-amber-700/10 px-2 py-0.5 rounded-full border border-amber-700/20">
                    Bronze Medalist
                  </span>
                </div>

                <div>
                  <div className="font-bold text-white text-base flex items-center gap-1.5">
                    <span className="truncate">{topThree[2].userName}</span>
                    {topThree[2].cuVerified && (
                      <CollaboratorBadge karma={15} size="sm" showKarma={false} />
                    )}
                  </div>
                  <div className="text-xs text-prevu-text-muted font-mono mt-0.5">
                    @{topThree[2].username}
                  </div>
                </div>

                <div className="pt-3 border-t border-amber-700/20 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-xl font-bold text-amber-300">{topThree[2].percentage}%</span>
                    <span className="text-[10px] text-prevu-text-muted ml-1.5 font-normal">({topThree[2].score}/{topThree[2].totalQuestions})</span>
                  </div>
                  <div className="text-right text-prevu-text-muted text-[11px] flex items-center gap-1.5 bg-prevu-surface/60 px-2.5 py-1 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-white font-medium">{formatDuration(topThree[2].timeSpentSeconds)}</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* FULL LEADERBOARD TABLE / LIST */}
        {currentLeaderboard.length > 0 ? (
          <div className="overflow-x-auto rounded-2xl border border-prevu-surface-light bg-prevu-bg/60">
            <table className="w-full text-left text-xs">
              <thead className="bg-prevu-surface/90 text-prevu-text-muted uppercase text-[10px] font-mono border-b border-prevu-surface-light">
                <tr>
                  <th className="py-3.5 px-4 w-16">Rank</th>
                  <th className="py-3.5 px-4">Student Scholar</th>
                  <th className="py-3.5 px-4 text-center">Score</th>
                  <th className="py-3.5 px-4">Accuracy Rate</th>
                  <th className="py-3.5 px-4 text-right">Time Spent</th>
                  <th className="py-3.5 px-4 text-right">Attempts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-prevu-surface-light/40">
                {currentLeaderboard.map((entry, idx) => {
                  const rank = idx + 1
                  const isGold = rank === 1
                  const isSilver = rank === 2
                  const isBronze = rank === 3

                  return (
                    <tr
                      key={`${entry.userId}-${entry.subjectCode}-${idx}`}
                      className={`hover:bg-prevu-surface/70 transition-colors ${
                        isGold ? 'bg-amber-500/5' : ''
                      }`}
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 font-mono font-bold">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-mono font-bold ${
                          isGold ? 'bg-amber-500 text-black font-extrabold shadow-sm' :
                          isSilver ? 'bg-zinc-300 text-black font-bold' :
                          isBronze ? 'bg-amber-700 text-white font-bold' :
                          'bg-prevu-surface border border-prevu-surface-light text-prevu-text-muted'
                        }`}>
                          #{rank}
                        </span>
                      </td>

                      {/* Student Scholar */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500/20 to-prevu-accent/20 border border-prevu-accent/30 flex items-center justify-center text-xs font-bold text-white shrink-0">
                            {entry.userName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-1.5 text-xs sm:text-sm">
                              <span>{entry.userName}</span>
                              {entry.cuVerified && (
                                <CollaboratorBadge karma={25} size="sm" showKarma={false} />
                              )}
                            </div>
                            <div className="text-[11px] font-mono text-prevu-text-muted">
                              @{entry.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Score */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-white">
                        <span className="text-sm">{entry.score}</span>
                        <span className="text-prevu-text-muted text-[11px]"> / {entry.totalQuestions}</span>
                      </td>

                      {/* Accuracy Rate with Progress Bar */}
                      <td className="py-4 px-4 min-w-[150px]">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between font-mono text-[11px]">
                            <span className={`font-bold ${
                              entry.percentage >= 80 ? 'text-emerald-400' :
                              entry.percentage >= 60 ? 'text-cyan-400' :
                              'text-amber-400'
                            }`}>
                              {entry.percentage}%
                            </span>
                            <span className="text-[10px] text-prevu-text-muted font-sans font-medium">
                              {entry.percentage >= 80 ? 'Distinction' : entry.percentage >= 60 ? 'Cleared' : 'Practice'}
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-prevu-surface overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                entry.percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                                entry.percentage >= 60 ? 'bg-gradient-to-r from-cyan-500 to-blue-400' :
                                'bg-gradient-to-r from-amber-500 to-orange-400'
                              }`}
                              style={{ width: `${Math.min(100, entry.percentage)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Time Spent */}
                      <td className="py-4 px-4 text-right font-mono text-xs text-prevu-text-muted">
                        <span className="text-white font-semibold">{formatDuration(entry.timeSpentSeconds)}</span>
                      </td>

                      {/* Attempts & Relative Date */}
                      <td className="py-4 px-4 text-right font-mono text-[11px] text-prevu-text-muted">
                        <div>
                          <span className="font-semibold text-white">{entry.attemptsCount}</span> {entry.attemptsCount === 1 ? 'try' : 'tries'}
                        </div>
                        <div className="text-[10px] text-prevu-text-muted/70">
                          {formatRelativeTime(entry.updatedAt)}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 rounded-2xl bg-prevu-bg/50 border border-prevu-surface-light text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mx-auto shadow-inner">
              <Trophy className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-bold text-white">
                No Leaderboard Scores for {currentSubjectObj.code} Yet
              </h4>
              <p className="text-xs text-prevu-text-muted max-w-md mx-auto leading-relaxed">
                Be the very first campus scholar to take the CBT mock test for this subject and claim the #1 spot on the leaderboard!
              </p>
            </div>
            {currentSubjectObj.isReady && onSelectSubjectExam && (
              <Button
                size="sm"
                onClick={() => onSelectSubjectExam(currentSubjectObj)}
                className="h-10 px-5 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-md rounded-xl cursor-pointer"
              >
                <span>Take Mock Test & Claim Rank #1</span>
              </Button>
            )}
          </div>
        )}

      </div>

    </section>
  )
}

