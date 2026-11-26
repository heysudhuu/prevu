'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { motion, AnimatePresence, animate } from 'framer-motion'
import { CbtLeaderboardEntry, CbtSubject } from '@/lib/cbt/types'
import { CBT_SUBJECTS } from '@/lib/cbt/cbtRegistry'
import {
  Trophy,
  Crown,
  Clock,
  RefreshCw,
  Play,
  ChevronRight,
  Award,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CollaboratorBadge } from '@/components/ui/CollaboratorBadge'
import { getCbtLeaderboard } from '@/lib/cbt/actions'

interface CbtFrontLeaderboardProps {
  initialLeaderboards: Record<string, CbtLeaderboardEntry[]>
  onSelectSubjectExam?: (subject: CbtSubject) => void
}

function AnimatedPercent({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 0.75,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest * 10) / 10)
    })
    return () => controls.stop()
  }, [value])

  return <>{Number.isInteger(value) ? Math.round(display) : display.toFixed(1)}%</>
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

  // Only include subjects that are ready with questions
  const readySubjects = CBT_SUBJECTS.filter(s => s.isReady)

  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(() => readySubjects[0]?.code || 'ACP-101')
  const [isRefreshing, startTransition] = useTransition()

  // Find all subjects that have leaderboard entries or ready status
  const subjectsWithEntries = readySubjects.map(subj => {
    const entries = leaderboards[subj.code] || leaderboards[subj.code.toUpperCase()] || []
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
  const currentLeaderboard = leaderboards[selectedSubjectCode] || leaderboards[selectedSubjectCode?.toUpperCase()] || []

  // Top 3 Podium entries
  const firstPlace = currentLeaderboard[0] || null
  const secondPlace = currentLeaderboard[1] || null
  const thirdPlace = currentLeaderboard[2] || null

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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 border-b border-prevu-surface-light pb-6"
      >
        <div className="space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/25 shadow-sm">
            <motion.span
              animate={{ rotate: [-6, 6, -6] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex"
            >
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
            </motion.span>
            <span className="tracking-wider uppercase text-[11px] font-mono">Tier 2 • Olympic Hall of Fame</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight flex items-center gap-3">
            <span>Campus Leaderboard &amp; Live Standings</span>
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-prevu-text-muted max-w-2xl leading-relaxed">
            Real-time rankings across ready CBT suites. Reattempt any exam to climb the stepped Olympic Podium and claim Rank #1!
          </p>
        </div>

        {/* Refresh Action */}
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} className="self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isRefreshing}
            onClick={() => handleRefresh(selectedSubjectCode)}
            className="h-10 px-4 text-xs font-bold border-prevu-surface-light bg-prevu-surface/80 text-prevu-text-muted hover:text-white hover:border-amber-500/40 rounded-xl cursor-pointer shadow-sm transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin text-cyan-400' : 'text-amber-400'}`} />
            <span>{isRefreshing ? 'Refreshing...' : 'Refresh Standings'}</span>
          </Button>
        </motion.div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 1. CURRENT SUBJECT CHAMPIONS STRIP */}
      {/* ========================================================================= */}
      {activeLeadingSubjects.length > 0 && (
        <div className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-prevu-text-muted font-bold flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>Reigning Subject Champions (Click to Inspect Podium)</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400 font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
              {activeLeadingSubjects.length} Active Suite{activeLeadingSubjects.length === 1 ? '' : 's'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeLeadingSubjects.map(({ subject, leader }, idx) => {
              if (!leader) return null
              const isSelected = selectedSubjectCode === subject.code

              return (
                <motion.div
                  key={`leader-${subject.code}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: idx * 0.07, duration: 0.4, type: 'spring', stiffness: 280, damping: 24 }}
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedSubjectCode(subject.code)}
                  className={`p-4 rounded-2xl border transition-colors duration-200 cursor-pointer relative overflow-hidden flex items-center justify-between gap-3 shadow-lg ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/15 via-prevu-surface to-prevu-bg border-amber-500/60 ring-1 ring-amber-500/35'
                      : 'bg-prevu-surface/80 border-prevu-surface-light hover:border-amber-500/40'
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      animate={{ x: ['-120%', '240%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-300/10 to-transparent -skew-x-12 pointer-events-none"
                    />
                  )}

                  <div className="flex items-center gap-3 min-w-0 relative z-10">
                    <motion.div
                      animate={isSelected ? { scale: [1, 1.08, 1] } : {}}
                      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black flex items-center justify-center text-sm shadow-md shrink-0"
                    >
                      🥇
                    </motion.div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono">
                        <span className="text-cyan-400 font-bold">{subject.code}</span>
                        <span className="text-prevu-text-muted">•</span>
                        <span className="text-amber-300 font-semibold truncate">#1 Champion</span>
                      </div>
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1 mt-0.5">
                        <span className="truncate">{leader.userName}</span>
                        {leader.cuVerified && (
                          <CollaboratorBadge karma={30} size="sm" showKarma={false} />
                        )}
                      </div>
                      <div className="text-[10px] font-mono text-prevu-text-muted truncate">
                        {subject.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1 relative z-10">
                    <div className="text-base font-black font-mono text-emerald-400 leading-none">
                      {leader.percentage}%
                    </div>
                    <div className="text-[10px] font-mono text-prevu-text-muted">
                      {leader.score}/{leader.totalQuestions}
                    </div>
                    {subject.isReady && onSelectSubjectExam && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectSubjectExam(subject)
                        }}
                        className="inline-flex items-center gap-0.5 text-[10px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                      >
                        <span>Beat</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. STEPPED OLYMPIC PODIUM + FULL RANKINGS TABLE */}
      {/* ========================================================================= */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="p-6 sm:p-8 rounded-[2rem] bg-prevu-surface/90 border border-prevu-surface-light shadow-2xl backdrop-blur-2xl space-y-8"
      >
        {/* Subject Filter Tabs Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-prevu-surface-light/80 pb-5">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-cyan-400" />
              <span>Subject Podium &amp; Full Standings</span>
            </h3>
            <p className="text-xs text-prevu-text-muted">
              Switch suites to inspect the Top-3 Olympic Podium, speed metrics, and accuracy curves.
            </p>
          </div>

          {/* Spring-Animated Subject Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full p-1 rounded-2xl bg-prevu-bg/85 border border-prevu-surface-light scrollbar-none">
            {readySubjects.map(subj => {
              const count = (leaderboards[subj.code] || leaderboards[subj.code.toUpperCase()] || []).length
              const isActive = selectedSubjectCode === subj.code

              return (
                <motion.button
                  key={subj.code}
                  type="button"
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedSubjectCode(subj.code)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive ? 'text-white' : 'text-prevu-text-muted hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="leaderboard-subject-pill"
                      transition={{ type: 'spring', stiffness: 440, damping: 32 }}
                      className="absolute inset-0 rounded-xl bg-prevu-accent shadow-md shadow-prevu-accent/25"
                    />
                  )}
                  <span className="relative z-10">{subj.code}</span>
                  {count > 0 && (
                    <span className={`relative z-10 px-2 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-prevu-surface-light text-prevu-text-muted'
                    }`}>
                      {count}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Selected Subject Title & Challenge Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-prevu-bg/75 border border-prevu-surface-light shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
              <span>{currentSubjectObj.code}</span>
              <span className="text-prevu-text-muted">•</span>
              <span className="text-prevu-text-muted font-normal">{currentSubjectObj.categoryLabel}</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {currentSubjectObj.name}
            </h4>
          </div>

          {currentSubjectObj.isReady && onSelectSubjectExam && (
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} className="shrink-0">
              <Button
                size="sm"
                onClick={() => onSelectSubjectExam(currentSubjectObj)}
                className="relative overflow-hidden h-10 px-5 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-md shadow-prevu-accent/25 rounded-xl flex items-center gap-2 cursor-pointer transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Challenge {currentSubjectObj.code}</span>
              </Button>
            </motion.div>
          )}
        </div>

        {/* ANIMATED STEPPED PODIUM + TABLE */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedSubjectCode}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* TRUE STEPPED OLYMPIC PODIUM (#2 Left | #1 Elevated Center | #3 Right) */}
            {firstPlace && (
              <div className="grid grid-cols-1 sm:grid-cols-3 items-end gap-4 pt-3">

                {/* LEFT PEDESTAL: RANK #2 SILVER */}
                {secondPlace ? (
                  <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.12, type: 'spring', stiffness: 260, damping: 24 }}
                    whileHover={{ y: -5 }}
                    className="order-2 sm:order-1 p-5 rounded-3xl bg-gradient-to-b from-slate-400/15 via-prevu-bg/95 to-prevu-bg border border-slate-400/40 flex flex-col justify-between space-y-4 shadow-lg min-h-[195px] relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-slate-400 via-zinc-200 to-slate-500 opacity-75" />

                    <div className="flex items-center justify-between pt-1">
                      <span className="w-9 h-9 rounded-xl bg-zinc-200 text-black font-black flex items-center justify-center text-xs shadow-md">
                        🥈 #2
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold text-zinc-300 bg-zinc-400/10 px-2.5 py-0.5 rounded-full border border-zinc-400/20">
                        Silver Pedestal
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-white text-base flex items-center gap-1.5">
                        <span className="truncate">{secondPlace.userName}</span>
                        {secondPlace.cuVerified && (
                          <CollaboratorBadge karma={20} size="sm" showKarma={false} />
                        )}
                      </div>
                      <div className="text-xs text-prevu-text-muted font-mono mt-0.5">
                        @{secondPlace.username}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-500/20 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-2xl font-black text-cyan-300">
                          <AnimatedPercent value={secondPlace.percentage} />
                        </span>
                        <span className="text-[10px] text-prevu-text-muted ml-1.5 font-normal">({secondPlace.score}/{secondPlace.totalQuestions})</span>
                      </div>
                      <div className="text-prevu-text-muted text-[11px] flex items-center gap-1.5 bg-prevu-surface/60 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-white font-medium">{formatDuration(secondPlace.timeSpentSeconds)}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="hidden sm:block sm:order-1" />
                )}

                {/* CENTER PEDESTAL: RANK #1 GOLD CHAMPION (Tallest & Elevated with Shimmer) */}
                <motion.div
                  initial={{ opacity: 0, y: 34, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: 0.04, type: 'spring', stiffness: 250, damping: 22 }}
                  whileHover={{ y: -6, scale: 1.015 }}
                  className="order-1 sm:order-2 p-6 rounded-3xl bg-gradient-to-b from-amber-500/25 via-prevu-bg/95 to-prevu-bg border-2 border-amber-400/65 relative overflow-hidden flex flex-col justify-between space-y-5 shadow-2xl shadow-amber-500/15 min-h-[235px]"
                >
                  {/* Golden Shimmer Sweep */}
                  <motion.div
                    animate={{ x: ['-120%', '240%'] }}
                    transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 3.8, ease: 'easeInOut' }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent -skew-x-12 pointer-events-none"
                  />

                  {/* Golden Top Crown Rim */}
                  <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-300 to-amber-500" />
                  <motion.div
                    animate={{ scale: [1, 1.15, 1], opacity: [0.25, 0.42, 0.25] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-32 rounded-full blur-3xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle, #f59e0b, transparent 70%)' }}
                  />

                  <div className="flex items-center justify-between relative z-10 pt-1">
                    <motion.span
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-black font-black flex items-center justify-center text-sm shadow-lg shadow-amber-500/30"
                    >
                      🥇 #1
                    </motion.span>
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-300 flex items-center gap-1.5 bg-amber-500/15 px-3 py-1 rounded-full border border-amber-400/35">
                      <motion.span
                        animate={{ rotate: [-6, 6, -6] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        className="inline-flex"
                      >
                        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      </motion.span>
                      <span>Campus Champion</span>
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="font-extrabold text-white text-lg flex items-center gap-2">
                      <span className="truncate">{firstPlace.userName}</span>
                      {firstPlace.cuVerified && (
                        <CollaboratorBadge karma={30} size="sm" showKarma={false} />
                      )}
                    </div>
                    <div className="text-xs text-amber-200/75 font-mono mt-0.5 flex items-center gap-1.5">
                      <span>@{firstPlace.username}</span>
                      <span>•</span>
                      <span className="text-emerald-400 font-semibold inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Top Accuracy
                      </span>
                    </div>
                  </div>

                  <div className="pt-3.5 border-t border-amber-500/25 flex items-center justify-between text-xs font-mono relative z-10">
                    <div>
                      <span className="text-3xl font-black text-emerald-400">
                        <AnimatedPercent value={firstPlace.percentage} />
                      </span>
                      <span className="text-[11px] text-prevu-text-muted ml-1.5 font-normal">({firstPlace.score}/{firstPlace.totalQuestions})</span>
                    </div>
                    <div className="text-prevu-text-muted text-[11px] flex items-center gap-1.5 bg-prevu-surface/80 border border-amber-500/25 px-3 py-1.5 rounded-xl">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-white font-bold">{formatDuration(firstPlace.timeSpentSeconds)}</span>
                    </div>
                  </div>
                </motion.div>

                {/* RIGHT PEDESTAL: RANK #3 BRONZE */}
                {thirdPlace ? (
                  <motion.div
                    initial={{ opacity: 0, y: 28, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 24 }}
                    whileHover={{ y: -5 }}
                    className="order-3 sm:order-3 p-5 rounded-3xl bg-gradient-to-b from-amber-700/15 via-prevu-bg/95 to-prevu-bg border border-amber-700/45 flex flex-col justify-between space-y-4 shadow-lg min-h-[178px] relative overflow-hidden"
                  >
                    <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-800 via-orange-400 to-amber-700 opacity-75" />

                    <div className="flex items-center justify-between pt-1">
                      <span className="w-9 h-9 rounded-xl bg-amber-700 text-white font-black flex items-center justify-center text-xs shadow-md">
                        🥉 #3
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-400 bg-amber-700/15 px-2.5 py-0.5 rounded-full border border-amber-700/30">
                        Bronze Pedestal
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-white text-base flex items-center gap-1.5">
                        <span className="truncate">{thirdPlace.userName}</span>
                        {thirdPlace.cuVerified && (
                          <CollaboratorBadge karma={15} size="sm" showKarma={false} />
                        )}
                      </div>
                      <div className="text-xs text-prevu-text-muted font-mono mt-0.5">
                        @{thirdPlace.username}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-amber-700/20 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-xl font-black text-amber-300">
                          <AnimatedPercent value={thirdPlace.percentage} />
                        </span>
                        <span className="text-[10px] text-prevu-text-muted ml-1.5 font-normal">({thirdPlace.score}/{thirdPlace.totalQuestions})</span>
                      </div>
                      <div className="text-prevu-text-muted text-[11px] flex items-center gap-1.5 bg-prevu-surface/60 px-2.5 py-1 rounded-lg">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-white font-medium">{formatDuration(thirdPlace.timeSpentSeconds)}</span>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="hidden sm:block sm:order-3" />
                )}

              </div>
            )}

            {/* FULL LEADERBOARD TABLE */}
            {currentLeaderboard.length > 0 ? (
              <div className="overflow-x-auto rounded-2xl border border-prevu-surface-light bg-prevu-bg/65">
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
                        <motion.tr
                          key={`${entry.userId}-${entry.subjectCode}-${idx}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: Math.min(idx * 0.035, 0.35), duration: 0.25 }}
                          whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                          className={`transition-colors ${
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

                          {/* Accuracy Rate with Animated Progress Bar + Sheen */}
                          <td className="py-4 px-4 min-w-[155px]">
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
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(100, entry.percentage)}%` }}
                                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: Math.min(idx * 0.03, 0.3) }}
                                  className={`h-full rounded-full relative overflow-hidden ${
                                    entry.percentage >= 80 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' :
                                    entry.percentage >= 60 ? 'bg-gradient-to-r from-cyan-500 to-blue-400' :
                                    'bg-gradient-to-r from-amber-500 to-orange-400'
                                  }`}
                                >
                                  <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                                  />
                                </motion.div>
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
                        </motion.tr>
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
                    <span>Take Mock Test &amp; Claim Rank #1</span>
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

      </motion.div>

    </section>
  )
}
