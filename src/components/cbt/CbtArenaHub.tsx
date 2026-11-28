'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence, animate, useMotionValue, useMotionTemplate } from 'framer-motion'
import { generateTestQuestions, mergeSubjectsWithOverrides } from '@/lib/cbt/cbtRegistry'
import { CbtSubject, CbtExamConfig, CbtLeaderboardEntry, CbtSubjectOverride, CbtQuestionOverride } from '@/lib/cbt/types'
import {
  Sparkles,
  Play,
  PlusCircle,
  Clock,
  Layers,
  Search,
  ArrowRight,
  ShieldCheck,
  Zap,
  Trophy,
  Crown,
  CheckCircle2,
  Compass,
  GraduationCap,
  X,
  FileText,
  Share2,
  ChevronRight,
  Activity,
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import CbtExamConfigModal from './CbtExamConfigModal'
import CbtExamRunner from './CbtExamRunner'
import CbtFrontLeaderboard from './CbtFrontLeaderboard'
import CbtShareModal from './CbtShareModal'
import Link from 'next/link'

interface CbtArenaHubProps {
  isAuthenticated?: boolean
  initialLeaderboards?: Record<string, CbtLeaderboardEntry[]>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  approvedQuestions?: any[]
  subjectOverrides?: CbtSubjectOverride[]
  questionOverrides?: CbtQuestionOverride[]
}

function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.25,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest))
    })
    return () => controls.stop()
  }, [value])

  return <>{display}</>
}

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  delay?: number
  cardKey?: string
}

function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(56, 189, 248, 0.14)',
  delay = 0,
  cardKey
}: SpotlightCardProps) {
  const mouseX = useMotionValue(-999)
  const mouseY = useMotionValue(-999)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  function handleMouseLeave() {
    mouseX.set(-999)
    mouseY.set(-999)
  }

  const background = useMotionTemplate`radial-gradient(380px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 78%)`

  return (
    <motion.div
      layout
      key={cardKey}
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.93 }}
      transition={{
        type: 'spring',
        stiffness: 280,
        damping: 26,
        delay
      }}
      whileHover={{ y: -7, scale: 1.012 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
        style={{ background }}
      />
      {children}
    </motion.div>
  )
}

export default function CbtArenaHub({
  isAuthenticated = false,
  initialLeaderboards = {},
  approvedQuestions = [],
  subjectOverrides = [],
  questionOverrides = []
}: CbtArenaHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // Auth Gate modal state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

  // Active Exam state
  const [activeSubject, setActiveSubject] = useState<CbtSubject | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all')
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false)
  const [sharingSubject, setSharingSubject] = useState<CbtSubject | null>(null)
  const [runningExam, setRunningExam] = useState<{
    subject: CbtSubject
    config: CbtExamConfig
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    questions: any[]
  } | null>(null)

  const subjects = useMemo(() => {
    return mergeSubjectsWithOverrides(subjectOverrides, questionOverrides, approvedQuestions, false)
  }, [subjectOverrides, questionOverrides, approvedQuestions])

  // Total verified questions across all subjects
  const totalVerifiedQuestions = useMemo(() => {
    return subjects.reduce((sum, s) => sum + (s.totalQuestions || 0), 0)
  }, [subjects])

  // Top overall leader across ready suites for the Hero Spotlight
  const featuredChampion = useMemo(() => {
    for (const s of subjects) {
      if (!s.isReady) continue
      const list = initialLeaderboards[s.code] || initialLeaderboards[s.code.toUpperCase()] || []
      if (list.length > 0) {
        return { subject: s, leader: list[0] }
      }
    }
    return null
  }, [subjects, initialLeaderboards])

  const readySubjectsList = useMemo(() => subjects.filter(s => s.isReady), [subjects])

  const categories = useMemo(() => [
    { id: 'all', label: 'All Suites', count: subjects.length, icon: Layers },
    {
      id: 'core',
      label: 'Core & Career Readiness',
      count: `${subjects.filter(s => s.category === 'core' && s.isReady).reduce((sum, s) => sum + s.totalQuestions, 0)} MCQs`,
      icon: GraduationCap
    },
    {
      id: 'aptitude',
      label: 'Aptitude & Logical',
      count: `${subjects.filter(s => s.category === 'aptitude' && s.isReady).reduce((sum, s) => sum + s.totalQuestions, 0)} MCQs`,
      icon: Zap
    },
    {
      id: 'open-elective',
      label: 'Open Electives (7th Sem)',
      count: `${subjects.filter(s => s.category === 'open-elective' && s.isReady).reduce((sum, s) => sum + s.totalQuestions, 0)} MCQs`,
      icon: Compass
    },
    {
      id: 'uhv',
      label: 'UHV (Ethics)',
      count: `${subjects.filter(s => s.category === 'uhv' && s.isReady).reduce((sum, s) => sum + s.totalQuestions, 0)} MCQs`,
      icon: ShieldCheck
    }
  ], [subjects])

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      const matchesCat = selectedCategory === 'all' || s.category === selectedCategory
      const matchesQuery = !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchesCat && matchesQuery
    })
  }, [subjects, selectedCategory, searchQuery])

  // Split filtered suites into Tier 1 (Live Simulators) & Tier 3 (Community Open Question Banks)
  const liveFilteredSubjects = useMemo(() => filteredSubjects.filter(s => s.isReady), [filteredSubjects])
  const communityFilteredSubjects = useMemo(() => filteredSubjects.filter(s => !s.isReady), [filteredSubjects])

  const handleOpenConfig = (subject: CbtSubject, topicId: string = 'all') => {
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setActiveSubject(subject)
    setSelectedTopicId(topicId)
    setIsConfigOpen(true)
  }

  // Deep-link direct subject handler (?subject=CODE)
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    const codeParam = params.get('subject')
    if (codeParam) {
      const clean = codeParam.trim().toUpperCase()
      const match = subjects.find(
        s => s.code.toUpperCase() === clean || s.code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === clean.replace(/[^a-zA-Z0-9]/g, '')
      )
      if (match) {
        handleOpenConfig(match, 'all')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects])

  const handleStartExam = (config: {
    questionCount: number
    timeLimitMinutes: number
    shuffleQuestions: boolean
    selectedTopic?: string
  }) => {
    if (!activeSubject) return
    setIsConfigOpen(false)

    const generated = generateTestQuestions(
      activeSubject.code,
      config.questionCount,
      config.shuffleQuestions,
      config.selectedTopic,
      approvedQuestions,
      questionOverrides
    )

    setRunningExam({
      subject: activeSubject,
      config: {
        ...config,
        shuffleOptions: true
      },
      questions: generated.questions
    })
  }

  // If a mock test is actively running, render the full CBT simulator
  if (runningExam) {
    return (
      <CbtExamRunner
        subject={runningExam.subject}
        questions={runningExam.questions}
        config={runningExam.config}
        onExit={() => setRunningExam(null)}
        onRetake={() => {
          const generated = generateTestQuestions(
            runningExam.subject.code,
            runningExam.config.questionCount,
            runningExam.config.shuffleQuestions,
            runningExam.config.selectedTopic,
            approvedQuestions,
            questionOverrides
          )
          setRunningExam({
            ...runningExam,
            questions: generated.questions
          })
        }}
      />
    )
  }

  const categoryColors: Record<string, { bg: string; text: string; border: string; accent: string; spotlight: string }> = {
    'open-elective': {
      bg: 'bg-cyan-500/10',
      text: 'text-cyan-300',
      border: 'border-cyan-500/25',
      accent: 'from-cyan-400 via-purple-500 to-indigo-500',
      spotlight: 'rgba(6, 182, 212, 0.16)'
    },
    'aptitude': {
      bg: 'bg-amber-500/10',
      text: 'text-amber-300',
      border: 'border-amber-500/25',
      accent: 'from-amber-400 via-orange-500 to-emerald-400',
      spotlight: 'rgba(245, 158, 11, 0.16)'
    },
    'uhv': {
      bg: 'bg-purple-500/10',
      text: 'text-purple-300',
      border: 'border-purple-500/25',
      accent: 'from-purple-400 via-fuchsia-500 to-indigo-500',
      spotlight: 'rgba(168, 85, 247, 0.16)'
    },
    'core': {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-300',
      border: 'border-emerald-500/25',
      accent: 'from-emerald-400 via-teal-400 to-cyan-400',
      spotlight: 'rgba(16, 185, 129, 0.16)'
    }
  }

  return (
    <div className="space-y-12 pb-20">

      {/* ========================================================================= */}
      {/* HERO STRIP (Cinematic Motion + Scanning Light + Telemetry Radar) */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2rem] bg-prevu-surface/85 border border-prevu-surface-light p-6 sm:p-10 shadow-2xl backdrop-blur-2xl"
      >
        {/* Subtle Architectural Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.14) 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }}
        />

        {/* Animated Kinetic Light Beam Sweeping Gently Across Hero */}
        <motion.div
          animate={{ x: ['-40%', '140%'] }}
          transition={{ duration: 7, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
          className="absolute inset-y-0 w-1/3 pointer-events-none opacity-[0.07] -skew-x-12"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(56, 189, 248, 0.8), rgba(168, 85, 247, 0.6), transparent)'
          }}
        />

        {/* Animated Ambient Blurs */}
        <motion.div
          animate={{ scale: [1, 1.16, 1], x: [0, 20, 0], opacity: [0.28, 0.45, 0.28] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-28 right-1/4 w-[480px] h-[480px] pointer-events-none rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.45), transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.12, 1], y: [0, -18, 0], opacity: [0.2, 0.34, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
          className="absolute -bottom-28 left-8 w-[420px] h-[420px] pointer-events-none rounded-full blur-[110px]"
          style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.38), transparent 70%)' }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left: Headline, CTAs & Compact KPI Bar */}
          <div className="lg:col-span-8 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.08, duration: 0.4 }}
              className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-prevu-bg/85 text-purple-300 border border-purple-500/30 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="tracking-wider uppercase text-[11px] font-mono">Chandigarh University CBT Exam Arena</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 0.14, duration: 0.5 }}
              className="space-y-3"
            >
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.07]">
                Master Real Exams with <br className="hidden sm:block" />
                <span className="text-gradient-aurora">Timed Precision &amp; Live Rankings</span>
              </h1>
              <p className="text-sm sm:text-base text-prevu-text-muted leading-relaxed max-w-2xl">
                Official CBT simulator for <strong className="text-white">Career Planning</strong>, <strong className="text-white">Digital Cyber Forensics</strong>, <strong className="text-white">Campus Placements</strong>, and <strong className="text-white">UHV</strong> with sequential case passages and real-time university rankings.
              </p>
            </motion.div>

            {/* Action CTAs with Shimmer & Spring Bounce */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, duration: 0.4 }}
              className="flex flex-wrap items-center gap-3 pt-1"
            >
              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  asChild
                  className="relative overflow-hidden h-11 px-6 text-sm font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-lg shadow-prevu-accent/30 rounded-2xl cursor-pointer group"
                >
                  <a href="#cbt-subjects" className="flex items-center gap-2">
                    <motion.span
                      animate={{ x: ['-120%', '260%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
                      className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 pointer-events-none"
                    />
                    <Play className="w-4 h-4 fill-current relative z-10" />
                    <span className="relative z-10">Launch Live Simulator</span>
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-11 px-5 text-sm font-bold border-amber-500/35 bg-amber-500/10 text-amber-300 hover:text-white hover:bg-amber-500/25 rounded-2xl cursor-pointer"
                >
                  <a href="#cbt-leaderboard-section" className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: [-6, 6, -6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="inline-flex"
                    >
                      <Trophy className="w-4 h-4 text-amber-400" />
                    </motion.span>
                    <span>Olympic Podium</span>
                  </a>
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="hidden sm:block">
                <Button
                  variant="outline"
                  size="lg"
                  asChild
                  className="h-11 px-5 text-sm font-semibold border-prevu-surface-light bg-prevu-bg/65 text-prevu-text-muted hover:text-white hover:border-purple-500/40 rounded-2xl cursor-pointer"
                >
                  <Link href="/cbt/contribute" className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-purple-400" />
                    <span>Contribute MCQs</span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* 4 Sleek Staggered Metric Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.35 }}
                whileHover={{ y: -3, borderColor: 'rgba(16, 185, 129, 0.5)' }}
                className="px-4 py-3 rounded-2xl bg-prevu-bg/75 border border-prevu-surface-light transition-colors"
              >
                <div className="text-[10px] font-mono uppercase text-prevu-text-muted flex items-center gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Question Bank
                </div>
                <div className="text-xl font-black font-mono text-white mt-0.5">
                  <AnimatedCounter value={totalVerifiedQuestions} />+ <span className="text-[11px] font-normal text-emerald-400">MCQs</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.34, duration: 0.35 }}
                whileHover={{ y: -3, borderColor: 'rgba(56, 189, 248, 0.5)' }}
                className="px-4 py-3 rounded-2xl bg-prevu-bg/75 border border-prevu-surface-light transition-colors"
              >
                <div className="text-[10px] font-mono uppercase text-prevu-text-muted flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-cyan-400" /> Timer Pacing
                </div>
                <div className="text-xl font-black font-mono text-cyan-300 mt-0.5">
                  1.5–2m <span className="text-[11px] font-normal text-prevu-text-muted">/ Q</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.35 }}
                whileHover={{ y: -3, borderColor: 'rgba(168, 85, 247, 0.5)' }}
                className="px-4 py-3 rounded-2xl bg-prevu-bg/75 border border-prevu-surface-light transition-colors"
              >
                <div className="text-[10px] font-mono uppercase text-prevu-text-muted flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-purple-400" /> Curriculum
                </div>
                <div className="text-xl font-black font-mono text-purple-300 mt-0.5">
                  <AnimatedCounter value={27} />+ <span className="text-[11px] font-normal text-prevu-text-muted">Modules</span>
                </div>
              </motion.div>

              <motion.a
                href="#cbt-leaderboard-section"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.46, duration: 0.35 }}
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 hover:border-amber-400/70 transition-colors group block"
              >
                <div className="text-[10px] font-mono uppercase text-amber-300 flex items-center gap-1.5">
                  <Crown className="w-3 h-3 text-amber-400" /> Rankings
                </div>
                <div className="text-xl font-black font-mono text-amber-300 mt-0.5 flex items-center justify-between">
                  <span>Live #1</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.a>
            </div>
          </div>

          {/* Right: Compact Floating Quick-Launch & Pacesetter Card (Desktop) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.26, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-4 hidden lg:block"
          >
            <motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              className="rounded-3xl bg-prevu-bg/90 border border-prevu-surface-light p-5 shadow-2xl space-y-4 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/80 to-transparent" />

              <div className="flex items-center justify-between border-b border-prevu-surface-light/70 pb-3">
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                    className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400"
                  >
                    <Activity className="w-3.5 h-3.5" />
                  </motion.div>
                  <span className="text-xs font-bold text-white">Quick Launch Arena</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {readySubjectsList.length} Ready
                </span>
              </div>

              <div className="space-y-2">
                {readySubjectsList.map((s, idx) => (
                  <motion.button
                    key={`hero-quick-${s.code}`}
                    type="button"
                    initial={{ opacity: 0, x: 14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + idx * 0.08 }}
                    whileHover={{ x: 4, borderColor: 'rgba(56, 189, 248, 0.5)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleOpenConfig(s, 'all')}
                    className="w-full text-left p-2.5 rounded-2xl bg-prevu-surface/85 border border-prevu-surface-light flex items-center justify-between gap-2.5 transition-colors group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-[10px] font-mono text-cyan-400 font-bold">
                        {s.code} <span className="text-emerald-400 font-normal">• {s.totalQuestions} MCQs</span>
                      </div>
                      <div className="text-xs font-bold text-white truncate group-hover:text-cyan-200">
                        {s.name}
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-xl bg-prevu-accent/20 group-hover:bg-prevu-accent text-prevu-accent-light group-hover:text-white flex items-center justify-center shrink-0 transition-colors">
                      <Play className="w-3 h-3 fill-current" />
                    </div>
                  </motion.button>
                ))}
              </div>

              {featuredChampion && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 to-purple-500/10 border border-amber-500/30 flex items-center justify-between gap-2 relative overflow-hidden"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <motion.span
                      animate={{ rotate: [-6, 6, -6] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-7 h-7 rounded-lg bg-amber-500 text-black font-black flex items-center justify-center text-xs shrink-0 shadow"
                    >
                      🏆
                    </motion.span>
                    <div className="min-w-0">
                      <div className="text-[9px] font-mono text-amber-300 uppercase font-bold">
                        Top Pacesetter ({featuredChampion.subject.code})
                      </div>
                      <div className="text-xs font-bold text-white truncate">
                        {featuredChampion.leader.userName} ({featuredChampion.leader.percentage}%)
                      </div>
                    </div>
                  </div>
                  <a
                    href="#cbt-leaderboard-section"
                    className="text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 flex items-center shrink-0"
                  >
                    <span>Podium</span>
                    <ChevronRight className="w-3 h-3" />
                  </a>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

        </div>
      </motion.section>

      {/* ========================================================================= */}
      {/* FILTER DOCK & SEARCH BAR */}
      {/* ========================================================================= */}
      <section className="space-y-3">
        <div className="p-2.5 rounded-3xl bg-prevu-surface/75 border border-prevu-surface-light backdrop-blur-xl shadow-lg flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none px-0.5">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id
              const Icon = cat.icon
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`relative px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer flex items-center gap-2 shrink-0 ${isSelected ? 'text-white' : 'text-prevu-text-muted hover:text-white'
                    }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="cbt-category-active-pill"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      className="absolute inset-0 rounded-2xl bg-prevu-accent shadow-lg shadow-prevu-accent/25"
                    />
                  )}
                  <Icon className={`w-3.5 h-3.5 relative z-10 ${isSelected ? 'text-white' : 'text-prevu-text-muted'}`} />
                  <span className="relative z-10">{cat.label}</span>
                  <span className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${isSelected
                    ? 'bg-white/20 text-white'
                    : 'bg-prevu-bg/90 border border-prevu-surface-light text-prevu-text-muted'
                    }`}>
                    {cat.count}
                  </span>
                </motion.button>
              )
            })}
          </div>

          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, subject, topic..."
              className="w-full pl-10 pr-9 py-2.5 bg-prevu-bg/90 border border-prevu-surface-light rounded-2xl text-xs text-white placeholder:text-prevu-text-muted/60 focus:border-prevu-accent focus:outline-none focus:ring-1 focus:ring-prevu-accent/40 shadow-inner transition-all"
            />
            <AnimatePresence>
              {searchQuery && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        {(selectedCategory !== 'all' || searchQuery) && (
          <div className="flex items-center justify-between text-xs text-prevu-text-muted px-2">
            <div>
              Showing <span className="font-semibold text-white font-mono">{filteredSubjects.length}</span> of {subjects.length} suites
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
              }}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset filters</span>
            </button>
          </div>
        )}
      </section>

      {/* ========================================================================= */}
      {/* TIER 1: LIVE CBT SIMULATORS (Cursor-Spotlight Cards + Spring Motion) */}
      {/* ========================================================================= */}
      {liveFilteredSubjects.length > 0 && (
        <section id="cbt-subjects" className="space-y-5 scroll-mt-28">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                Tier 1 • Live CBT Simulators
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Ready for Mock Examination
              </h2>
            </div>
            <span className="text-xs font-mono text-prevu-text-muted">
              Click any topic chip to launch immediately or customize exam size
            </span>
          </motion.div>

          <motion.div
            layout
            className={`grid grid-cols-1 gap-5 ${liveFilteredSubjects.length === 1
              ? 'max-w-2xl'
              : liveFilteredSubjects.length === 2 || liveFilteredSubjects.length === 4
                ? 'md:grid-cols-2'
                : liveFilteredSubjects.length === 5
                  ? 'md:grid-cols-2 lg:grid-cols-6'
                  : 'md:grid-cols-2 lg:grid-cols-3'
              }`}
          >
            <AnimatePresence mode="popLayout">
              {liveFilteredSubjects.map((subject, idx) => {
                const subjectEntries = initialLeaderboards[subject.code] || initialLeaderboards[subject.code.toUpperCase()] || []
                const subjectLeader = subjectEntries.length > 0 && subjectEntries[0].percentage > 0 ? subjectEntries[0] : null
                const topicsList = subject.topicsList?.filter(t => t.id !== 'all') || []
                const theme = categoryColors[subject.category] || categoryColors['open-elective']
                const spanClass =
                  liveFilteredSubjects.length === 5
                    ? idx < 3
                      ? 'lg:col-span-2'
                      : 'lg:col-span-3'
                    : ''

                return (
                  <SpotlightCard
                    key={subject.code}
                    cardKey={subject.code}
                    delay={Math.min(idx * 0.06, 0.22)}
                    spotlightColor={theme.spotlight}
                    className={`rounded-2xl border bg-prevu-surface/85 backdrop-blur-xl border-prevu-surface-light hover:border-prevu-accent/65 hover:shadow-xl hover:shadow-prevu-accent/10 transition-colors duration-300 flex flex-col justify-between relative overflow-hidden group shadow-lg min-w-0 ${spanClass}`}
                  >
                    {/* Category Accent Rim */}
                    <div className={`h-1 w-full bg-gradient-to-r ${theme.accent} relative z-10`} />

                    <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between relative z-10 min-w-0">
                      <div className="space-y-2.5 min-w-0">
                        {/* Compact Header Row */}
                        <div className="flex items-center justify-between gap-2 min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-mono font-bold uppercase tracking-wide border truncate max-w-[155px] ${theme.bg} ${theme.text} ${theme.border}`} title={subject.categoryLabel}>
                              {subject.categoryLabel}
                            </span>
                            <span className="text-[11px] font-mono font-bold text-cyan-400 shrink-0">
                              {subject.code}
                            </span>
                            <span className="text-[10px] font-mono text-prevu-text-muted hidden xl:inline shrink-0">
                              • Sem {subject.semester}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.08 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation()
                                setSharingSubject(subject)
                              }}
                              title="Share this subject to WhatsApp"
                              className="p-1.5 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/25 transition-colors cursor-pointer"
                            >
                              <Share2 className="w-3 h-3" />
                            </motion.button>

                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                              </span>
                              <span>Live</span>
                            </span>
                          </div>
                        </div>

                        {/* Title + Concise Description */}
                        <div>
                          <h3 className="text-base sm:text-[17px] font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug line-clamp-2 min-h-[2.75rem]">
                            {subject.name}
                          </h3>
                          <p className="text-[11px] text-prevu-text-muted leading-relaxed line-clamp-2 mt-1">
                            {subject.description}
                          </p>
                        </div>

                        {/* Compact Telemetry Strip + Inline Rank #1 */}
                        <div className="flex flex-wrap items-center gap-2 pt-0.5 font-mono text-[10px]">
                          <span className="px-2.5 py-1 rounded-lg bg-prevu-bg/90 border border-prevu-surface-light text-white font-semibold inline-flex items-center gap-1">
                            <FileText className="w-3 h-3 text-emerald-400" />
                            <strong className="text-emerald-400">{subject.totalQuestions}</strong> MCQs
                          </span>
                          {topicsList.length > 0 && (
                            <span className="px-2.5 py-1 rounded-lg bg-prevu-bg/90 border border-prevu-surface-light text-white font-semibold inline-flex items-center gap-1">
                              <Layers className="w-3 h-3 text-cyan-300" />
                              <strong className="text-cyan-300">{topicsList.length}</strong> Modules
                            </span>
                          )}
                          {Boolean(subject.credits && subject.credits > 0) && (
                            <span className="px-2 py-1 rounded-lg bg-prevu-bg/90 border border-prevu-surface-light text-prevu-text-muted">
                              {subject.credits} Cr
                            </span>
                          )}
                          {subjectLeader && (
                            <a
                              href="#cbt-leaderboard-section"
                              className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300 inline-flex items-center gap-1 hover:border-amber-400/60 transition-colors ml-auto"
                            >
                              <Crown className="w-3 h-3 text-amber-400" />
                              <span className="truncate max-w-[90px] font-sans font-bold text-white">{subjectLeader.userName}</span>
                              <span className="text-emerald-400 font-bold">{subjectLeader.percentage}%</span>
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Uniform Sleek Module Selector Row */}
                      <div className="pt-2.5 border-t border-prevu-surface-light/60 flex items-center gap-2 min-w-0">
                        <select
                          aria-label={`Select topic for ${subject.code}`}
                          onChange={(e) => {
                            if (e.target.value) {
                              handleOpenConfig(subject, e.target.value)
                            }
                          }}
                          defaultValue=""
                          className="flex-1 min-w-0 w-full h-9 text-[11px] bg-prevu-bg/95 border border-prevu-surface-light hover:border-cyan-400/60 rounded-xl px-2.5 text-prevu-text font-mono cursor-pointer focus:outline-none focus:border-cyan-400 transition-colors truncate"
                        >
                          <option value="" disabled>Practice Specific Topic ({topicsList.length} Modules)...</option>
                          <option value="all">Mix All Topics ({subject.totalQuestions} MCQs)</option>
                          {topicsList.map(t => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.count} MCQs)
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleOpenConfig(subject, 'all')}
                          title="Customize Exam Settings"
                          className="h-9 px-2.5 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light hover:border-purple-400/60 text-[11px] font-semibold text-purple-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0 whitespace-nowrap"
                        >
                          <SlidersHorizontal className="w-3 h-3" />
                          <span>Custom</span>
                        </button>
                      </div>
                    </div>

                    {/* Sleek Compact Footer */}
                    <div className="px-5 py-3 bg-prevu-bg/90 border-t border-prevu-surface-light flex items-center justify-between gap-3 relative z-10">
                      <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{subject.totalQuestions} Ready</span>
                      </span>

                      <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}>
                        <Button
                          size="sm"
                          onClick={() => handleOpenConfig(subject, 'all')}
                          className="relative overflow-hidden h-8 px-4 text-xs font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-md shadow-prevu-accent/25 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                          <motion.span
                            animate={{ x: ['-150%', '280%'] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 4.5, ease: 'easeInOut' }}
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
                          />
                          <Play className="w-3 h-3 fill-current relative z-10" />
                          <span className="relative z-10">Start Mock CBT</span>
                        </Button>
                      </motion.div>
                    </div>
                  </SpotlightCard>
                )
              })}
            </AnimatePresence>
          </motion.div>
        </section>
      )}

      {/* Empty Search Fallback */}
      {filteredSubjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-12 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light text-center space-y-4"
        >
          <Search className="w-8 h-8 text-prevu-text-muted mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">No Matching CBT Test Suites</h3>
            <p className="text-xs text-prevu-text-muted">
              Try clearing your search query or switching back to All Suites.
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedCategory('all')
              setSearchQuery('')
            }}
            className="text-xs font-bold border-prevu-surface-light hover:border-prevu-accent cursor-pointer"
          >
            Reset All Filters
          </Button>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* TIER 2: STEPPED OLYMPIC PODIUM & CAMPUS LEADERBOARD */}
      {/* ========================================================================= */}
      <CbtFrontLeaderboard
        initialLeaderboards={initialLeaderboards}
        onSelectSubjectExam={handleOpenConfig}
      />

      {/* ========================================================================= */}
      {/* TIER 3: COMMUNITY QUESTION BANKS (Upcoming Suites) */}
      {/* ========================================================================= */}
      {communityFilteredSubjects.length > 0 && (
        <section className="space-y-5 pt-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                Tier 3 • Community Open Banks
              </span>
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                Help Unlock Upcoming CBT Suites
              </h2>
            </div>
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="text-xs font-mono text-emerald-400 font-semibold"
            >
              +5 Scholar Karma per verified MCQ
            </motion.span>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {communityFilteredSubjects.map((subject, idx) => {
              const theme = categoryColors[subject.category] || categoryColors['uhv']
              return (
                <SpotlightCard
                  key={subject.code}
                  cardKey={subject.code}
                  delay={idx * 0.07}
                  spotlightColor="rgba(168, 85, 247, 0.14)"
                  className="rounded-3xl border border-prevu-surface-light/60 bg-prevu-surface/55 hover:bg-prevu-surface/80 hover:border-purple-500/45 transition-all flex flex-col justify-between p-5 space-y-4 shadow-lg relative overflow-hidden group"
                >
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${theme.bg} ${theme.text} ${theme.border}`}>
                        {subject.categoryLabel}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-prevu-text-muted bg-prevu-bg border border-prevu-surface-light">
                        Bank Open
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-mono font-bold text-cyan-400">
                        {subject.code} <span className="text-prevu-text-muted font-normal">• Sem {subject.semester}, Yr {subject.year}</span>
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors mt-0.5 leading-snug">
                        {subject.name}
                      </h3>
                    </div>

                    <p className="text-xs text-prevu-text-muted leading-relaxed line-clamp-2">
                      {subject.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {subject.topics.slice(0, 3).map(topic => (
                        <span
                          key={topic}
                          className="text-[10px] bg-prevu-bg/85 border border-prevu-surface-light text-prevu-text-muted px-2 py-0.5 rounded-lg"
                        >
                          {topic}
                        </span>
                      ))}
                      {subject.topics.length > 3 && (
                        <span className="text-[10px] text-prevu-text-muted px-1 py-0.5">
                          +{subject.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-prevu-surface-light/50 flex items-center justify-between gap-2 relative z-10">
                    <span className="text-[11px] font-mono text-prevu-text-muted">
                      {subject.totalQuestions} MCQs seeded
                    </span>
                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.94 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-8 px-3 text-xs font-semibold border-purple-500/35 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white rounded-xl cursor-pointer"
                      >
                        <Link href={`/cbt/contribute?subject=${encodeURIComponent(subject.code)}`}>
                          <PlusCircle className="w-3 h-3 mr-1.5" />
                          <span>Add Questions</span>
                        </Link>
                      </Button>
                    </motion.div>
                  </div>
                </SpotlightCard>
              )
            })}
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* COMMUNITY CONTRIBUTION BANNER */}
      {/* ========================================================================= */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/60 via-prevu-surface to-prevu-bg border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl backdrop-blur-xl group"
      >
        <motion.div
          animate={{ scale: [1, 1.18, 1], opacity: [0.22, 0.38, 0.22] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -top-16 -right-16 w-80 h-80 pointer-events-none rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.5), transparent)' }}
        />

        <div className="space-y-2.5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Community Question Contributor</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Have MCQs for an Open Elective, UHV, or Aptitude?
          </h3>
          <p className="text-xs sm:text-sm text-prevu-text-muted max-w-xl leading-relaxed">
            Contribute questions for your branch and semester. Once verified by the Prevu team, earn <strong className="text-emerald-400 font-bold">+5 Scholar Karma</strong> for each verified question and climb the global community ranks!
          </p>
        </div>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }} className="relative z-10 shrink-0">
          <Button
            size="lg"
            asChild
            className="relative overflow-hidden h-12 px-7 text-xs sm:text-sm font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-xl shadow-prevu-accent/25 rounded-2xl cursor-pointer transition-all"
          >
            <Link href="/cbt/contribute" className="flex items-center gap-2">
              <motion.span
                animate={{ x: ['-150%', '260%'] }}
                transition={{ duration: 2.3, repeat: Infinity, repeatDelay: 4, ease: 'easeInOut' }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 pointer-events-none"
              />
              <span className="relative z-10">Contribute MCQ Questions</span>
              <ArrowRight className="w-4 h-4 ml-1 relative z-10" />
            </Link>
          </Button>
        </motion.div>
      </motion.section>

      {/* ========================================================================= */}
      {/* MODALS */}
      {/* ========================================================================= */}
      {activeSubject && (
        <CbtExamConfigModal
          subject={activeSubject}
          isOpen={isConfigOpen}
          initialTopicId={selectedTopicId}
          onClose={() => setIsConfigOpen(false)}
          onStartExam={handleStartExam}
        />
      )}

      {/* Animated Auth Gate Modal */}
      <AnimatePresence>
        {showAuthModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 12 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-2xl text-center space-y-5 overflow-hidden"
            >
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-prevu-accent/20 blur-2xl pointer-events-none rounded-full" />

              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-prevu-accent flex items-center justify-center text-white mx-auto shadow-lg shadow-purple-600/30">
                <Sparkles className="w-7 h-7" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-extrabold text-white tracking-tight">
                  Student Account Required
                </h3>
                <p className="text-xs text-prevu-text-muted leading-relaxed">
                  To attempt CBT Mock Examinations, save your progress, challenge the official timer, and rank on the university leaderboard, please register or sign in with your student account.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <Button
                  asChild
                  className="w-full h-11 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-lg rounded-2xl cursor-pointer"
                >
                  <Link href="/signup?redirect=/cbt" className="flex items-center justify-center gap-2">
                    <span>Create Free Account</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  asChild
                  className="w-full h-11 text-xs font-bold border-prevu-surface-light text-prevu-text-muted hover:text-white rounded-2xl cursor-pointer"
                >
                  <Link href="/login?redirect=/cbt">
                    <span>Already Registered? Sign In</span>
                  </Link>
                </Button>

                <button
                  type="button"
                  onClick={() => setShowAuthModal(false)}
                  className="text-xs text-prevu-text-muted/70 hover:text-white transition-colors cursor-pointer pt-1"
                >
                  Continue Browsing
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* WhatsApp Share Modal */}
      {sharingSubject && (
        <CbtShareModal
          isOpen={!!sharingSubject}
          onClose={() => setSharingSubject(null)}
          subject={sharingSubject}
        />
      )}

    </div>
  )
}
