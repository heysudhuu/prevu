'use client'

import React, { useState, useMemo } from 'react'
import { CBT_SUBJECTS, generateTestQuestions } from '@/lib/cbt/cbtRegistry'
import { CbtSubject, CbtExamConfig, CbtLeaderboardEntry } from '@/lib/cbt/types'
import { 
  Sparkles, 
  Play, 
  PlusCircle, 
  Clock, 
  Layers, 
  Search, 
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Trophy,
  Crown,
  CheckCircle2,
  Filter,
  BarChart3,
  Compass,
  GraduationCap,
  X,
  ChevronRight,
  FileText
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import CbtExamConfigModal from './CbtExamConfigModal'
import CbtExamRunner from './CbtExamRunner'
import CbtFrontLeaderboard from './CbtFrontLeaderboard'
import Link from 'next/link'

interface CbtArenaHubProps {
  isAuthenticated?: boolean
  initialLeaderboards?: Record<string, CbtLeaderboardEntry[]>
  approvedQuestions?: any[]
}

export default function CbtArenaHub({ 
  isAuthenticated = false,
  initialLeaderboards = {},
  approvedQuestions = []
}: CbtArenaHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Auth Gate modal state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

  // Active Exam state
  const [activeSubject, setActiveSubject] = useState<CbtSubject | null>(null)
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all')
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false)
  const [runningExam, setRunningExam] = useState<{
    subject: CbtSubject
    config: CbtExamConfig
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    questions: any[]
  } | null>(null)

  const subjects = useMemo(() => {
    return CBT_SUBJECTS.map(subj => {
      const code = subj.code.toUpperCase()
      const extraCount = (approvedQuestions || []).filter((q: any) => {
        const qCode = (q.subject_code || q.subjectCode || '').toUpperCase()
        return qCode === code || qCode.replace(/-/g, '') === code.replace(/-/g, '')
      }).length
      return {
        ...subj,
        totalQuestions: subj.totalQuestions + extraCount
      }
    })
  }, [approvedQuestions])

  // Total verified questions across all subjects
  const totalVerifiedQuestions = useMemo(() => {
    return subjects.reduce((sum, s) => sum + (s.totalQuestions || 0), 0)
  }, [subjects])

  const categories = useMemo(() => [
    { id: 'all', label: 'All Suites', count: subjects.length, icon: Layers },
    { 
      id: 'aptitude', 
      label: 'Aptitude & Placements', 
      count: `${subjects.find(s => s.category === 'aptitude')?.totalQuestions || 290} MCQs`,
      icon: Zap 
    },
    { 
      id: 'open-elective', 
      label: 'Open Electives (7th Sem)', 
      count: `${subjects.find(s => s.category === 'open-elective')?.totalQuestions || 51} MCQs`,
      icon: Compass 
    },
    { id: 'uhv', label: 'UHV (Ethics)', count: 'Mandatory', icon: ShieldCheck },
    { id: 'core', label: 'Core Technical MSTs', count: 'Coming Soon', icon: GraduationCap }
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

  const handleOpenConfig = (subject: CbtSubject, topicId: string = 'all') => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setActiveSubject(subject)
    setSelectedTopicId(topicId)
    setIsConfigOpen(true)
  }

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
      approvedQuestions
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
            approvedQuestions
          )
          setRunningExam({
            ...runningExam,
            questions: generated.questions
          })
        }}
      />
    )
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* ========================================================================= */}
      {/* 1. PROFESSIONAL COMMAND HERO SECTION */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0f0f1a]/90 border border-purple-500/20 p-6 sm:p-10 lg:p-12 shadow-2xl backdrop-blur-2xl">
        {/* Glow ambient meshes */}
        <div 
          className="absolute -top-24 right-1/4 w-[500px] h-[500px] pointer-events-none rounded-full blur-[130px] opacity-40" 
          style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.45), transparent 70%)' }}
        />
        <div 
          className="absolute -bottom-24 left-10 w-[450px] h-[450px] pointer-events-none rounded-full blur-[110px] opacity-25" 
          style={{ background: 'radial-gradient(circle, rgba(6, 182, 212, 0.4), transparent 70%)' }}
        />
        <div 
          className="absolute top-1/2 right-4 w-72 h-72 pointer-events-none rounded-full blur-[90px] opacity-20" 
          style={{ background: 'radial-gradient(circle, rgba(245, 158, 11, 0.35), transparent 70%)' }}
        />

        <div className="relative max-w-4xl space-y-7">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/25 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wider uppercase text-[11px] font-mono">Chandigarh University CBT Mock Exam Arena</span>
          </div>

          {/* Heading */}
          <div className="space-y-3.5">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Master Real Exams with <br />
              <span className="text-gradient-aurora">
                Timed Precision & Live Rankings
              </span>
            </h1>

            <p className="text-sm sm:text-base text-prevu-text-muted leading-relaxed max-w-2xl">
              Authentic computer-based test simulator mapped to Chandigarh University curricula. Practice <strong className="text-white">Campus Placements</strong>, <strong className="text-white">Open Electives</strong>, and <strong className="text-white">Mandatory UHV</strong> with official test timers, customizable question counts, and instant percentile analytics.
            </p>
          </div>

          {/* CTA Button Actions */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <Button
              size="lg"
              asChild
              className="h-12 px-7 text-sm font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-xl shadow-prevu-accent/30 rounded-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <a href="#cbt-subjects" className="flex items-center gap-2">
                <Play className="w-4 h-4 fill-current" />
                <span>Explore Exam Suites</span>
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 px-6 text-sm font-bold border-amber-500/35 bg-amber-500/10 text-amber-300 hover:text-white hover:bg-amber-500/25 rounded-2xl shadow-sm transition-all cursor-pointer"
            >
              <a href="#cbt-leaderboard-section" className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Campus Hall of Fame</span>
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              asChild
              className="h-12 px-5 text-sm font-semibold border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-purple-500/30 rounded-2xl transition-all cursor-pointer hidden sm:inline-flex"
            >
              <Link href="/cbt/contribute" className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-purple-400" />
                <span>Contribute Questions</span>
              </Link>
            </Button>
          </div>

          {/* Professional Metric Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-3">
            
            <div className="p-4 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light/80 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-prevu-text-muted text-[11px] font-mono uppercase tracking-wider mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Question Bank</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-white">
                {totalVerifiedQuestions}+
              </div>
              <div className="text-[11px] text-emerald-400/90 font-medium mt-0.5">
                Verified MCQs
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light/80 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-prevu-text-muted text-[11px] font-mono uppercase tracking-wider mb-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Timer Pacing</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-cyan-300">
                1.5 – 2m
              </div>
              <div className="text-[11px] text-prevu-text-muted mt-0.5">
                Official Exam Pacing
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light/80 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-1.5 text-prevu-text-muted text-[11px] font-mono uppercase tracking-wider mb-1.5">
                <Layers className="w-3.5 h-3.5 text-purple-400" />
                <span>Curriculum Depth</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-purple-300">
                23+
              </div>
              <div className="text-[11px] text-prevu-text-muted mt-0.5">
                Topic-Wise Modules
              </div>
            </div>

            <a 
              href="#cbt-leaderboard-section" 
              className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-prevu-surface/60 to-prevu-surface/80 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-md group cursor-pointer block backdrop-blur-md"
            >
              <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-mono uppercase tracking-wider mb-1.5">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Leaderboard</span>
              </div>
              <div className="text-xl sm:text-2xl font-black font-mono text-amber-300 group-hover:text-amber-200 flex items-center justify-between">
                <span>Rank #1</span>
                <ArrowRight className="w-4 h-4 text-amber-400 transform group-hover:translate-x-1.5 transition-transform" />
              </div>
              <div className="text-[11px] text-amber-400/80 mt-0.5">
                Live Peer Standings
              </div>
            </a>

          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. REFINED FILTER & SEARCH BAR */}
      {/* ========================================================================= */}
      <section className="space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => {
              const isSelected = selectedCategory === cat.id
              const Icon = cat.icon
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer border flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-prevu-accent text-white border-prevu-accent shadow-lg shadow-prevu-accent/25'
                      : 'bg-prevu-surface/80 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-purple-500/40 hover:bg-prevu-surface'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-prevu-text-muted'}`} />
                  <span>{cat.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted'
                  }`}>
                    {cat.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Quick Search */}
          <div className="relative w-full lg:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search code, subject, topic..."
              className="w-full pl-10 pr-9 py-2.5 bg-prevu-surface/90 border border-prevu-surface-light rounded-2xl text-xs text-white placeholder:text-prevu-text-muted/60 focus:border-prevu-accent focus:outline-none focus:ring-1 focus:ring-prevu-accent/40 shadow-sm transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        {/* Results Counter / Filter Indicator */}
        <div className="flex items-center justify-between text-xs text-prevu-text-muted px-1">
          <div>
            Showing <span className="font-semibold text-white">{filteredSubjects.length}</span> of {CBT_SUBJECTS.length} test suites
          </div>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all')
                setSearchQuery('')
              }}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. PROFESSIONAL UNIFORM SUBJECT CARDS GRID */}
      {/* ========================================================================= */}
      <section id="cbt-subjects" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 scroll-mt-28">
        {filteredSubjects.map(subject => {
          const isLive = subject.isReady
          const subjectEntries = initialLeaderboards[subject.code] || []
          const subjectLeader = isLive && subjectEntries.length > 0 ? subjectEntries[0] : null
          const hasTopicList = Boolean(subject.topicsList && subject.topicsList.length > 0)

          // Custom category theme
          const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
            'open-elective': { bg: 'bg-cyan-500/10', text: 'text-cyan-300', border: 'border-cyan-500/25' },
            'aptitude': { bg: 'bg-amber-500/10', text: 'text-amber-300', border: 'border-amber-500/25' },
            'uhv': { bg: 'bg-purple-500/10', text: 'text-purple-300', border: 'border-purple-500/25' },
            'core': { bg: 'bg-indigo-500/10', text: 'text-indigo-300', border: 'border-indigo-500/25' }
          }
          const theme = categoryColors[subject.category] || categoryColors['open-elective']

          return (
            <div
              key={subject.code}
              className={`rounded-3xl border transition-all duration-300 flex flex-col justify-between relative overflow-hidden group card-hover-lift shadow-xl ${
                isLive
                  ? 'bg-prevu-surface/75 backdrop-blur-xl border-prevu-surface-light hover:border-prevu-accent/50 hover:shadow-2xl hover:shadow-prevu-accent/10'
                  : 'bg-prevu-surface/40 border-prevu-surface-light/40 opacity-85'
              }`}
            >
              {/* Top Accent Gradient Border Glow */}
              <div className={`h-1 w-full bg-gradient-to-r transition-all ${
                isLive ? 'from-purple-500 via-cyan-400 to-emerald-400 group-hover:h-1.5' : 'from-slate-700 to-slate-800'
              }`} />

              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                
                <div className="space-y-3.5">
                  {/* Category Pill & Live Indicator */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wide border ${theme.bg} ${theme.text} ${theme.border}`}>
                      {subject.categoryLabel}
                    </span>

                    {isLive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
                        </span>
                        <span>Live CBT</span>
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-prevu-text-muted bg-prevu-bg border border-prevu-surface-light">
                        Bank Open
                      </span>
                    )}
                  </div>

                  {/* Title & Subject Code */}
                  <div>
                    <div className="inline-flex items-center gap-1.5 text-xs font-mono font-black text-cyan-400 tracking-wider">
                      <span>{subject.code}</span>
                      <span className="text-prevu-text-muted">•</span>
                      <span className="text-prevu-text-muted text-[11px] font-normal">Sem {subject.semester}, Yr {subject.year}</span>
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-200 transition-colors mt-1 leading-snug">
                      {subject.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-prevu-text-muted leading-relaxed line-clamp-2">
                    {subject.description}
                  </p>

                  {/* High-Level Module Counters */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
                    <div className="px-3 py-1 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light text-white font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span><strong className="text-emerald-400">{subject.totalQuestions}</strong> MCQs</span>
                    </div>
                    {hasTopicList && (
                      <div className="px-3 py-1 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light text-white font-semibold flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-300" />
                        <span><strong className="text-cyan-300">{subject.topicsList?.length ? subject.topicsList.length - 1 : 0}</strong> Topics</span>
                      </div>
                    )}
                    {subject.credits && (
                      <div className="px-2.5 py-1 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light text-prevu-text-muted text-[10px]">
                        {subject.credits} Credits
                      </div>
                    )}
                  </div>
                </div>

                {/* Structured Topic Launcher or Topic Tags */}
                <div className="pt-3 border-t border-prevu-surface-light/50 space-y-2.5">
                  {hasTopicList ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-cyan-300 font-bold flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-cyan-400" />
                          <span>Topic Launcher:</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleOpenConfig(subject, 'all')}
                          className="text-[10px] text-purple-400 hover:text-purple-300 hover:underline font-bold cursor-pointer"
                        >
                          Customize exam →
                        </button>
                      </div>

                      {/* Dropdown Topic Quick Selector */}
                      <div className="relative">
                        <select
                          aria-label={`Select topic for ${subject.code}`}
                          onChange={(e) => {
                            if (e.target.value) {
                              handleOpenConfig(subject, e.target.value)
                            }
                          }}
                          defaultValue=""
                          className="w-full text-xs bg-prevu-bg/90 border border-purple-500/30 hover:border-purple-500/60 rounded-xl px-3 py-2.5 text-white font-medium cursor-pointer focus:outline-none focus:border-cyan-400 transition-colors shadow-inner"
                        >
                          <option value="" disabled>🎯 Practice Specific Topic...</option>
                          <option value="all">🔀 Mix All Topics ({subject.totalQuestions} Questions)</option>
                          {subject.topicsList?.filter(t => t.id !== 'all').map(t => (
                            <option key={t.id} value={t.id}>
                              {t.name} ({t.count} MCQs)
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    /* Default topics pill preview for subjects without sub-modules */
                    <div className="flex flex-wrap gap-1.5">
                      {subject.topics.slice(0, 3).map(topic => (
                        <span 
                          key={topic} 
                          className="text-[10px] bg-prevu-bg/90 border border-prevu-surface-light text-prevu-text-muted px-2.5 py-1 rounded-lg"
                        >
                          {topic}
                        </span>
                      ))}
                      {subject.topics.length > 3 && (
                        <span className="text-[10px] text-prevu-text-muted px-1.5 py-1">
                          +{subject.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Leaderboard Champion Ribbon on Card */}
                  {subjectLeader && (
                    <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="text-[11px] font-bold text-white truncate">
                          {subjectLeader.userName}
                        </span>
                        <span className="text-[10px] font-mono text-prevu-text-muted truncate">
                          ({subjectLeader.percentage}%)
                        </span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-amber-400 shrink-0">
                        Rank #1
                      </span>
                    </div>
                  )}
                </div>

              </div>

              {/* Card Footer Action Bar */}
              <div className="p-4 bg-prevu-bg/90 border-t border-prevu-surface-light flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isLive ? `${subject.totalQuestions} Ready` : 'Community Open'}</span>
                </span>

                {isLive ? (
                  <Button
                    size="sm"
                    onClick={() => handleOpenConfig(subject, 'all')}
                    className="h-9 px-4 text-xs font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-md shadow-prevu-accent/25 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer transform hover:scale-[1.02]"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Mock CBT</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-9 px-3.5 text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white rounded-xl cursor-pointer"
                  >
                    <Link href={`/cbt/contribute?subject=${encodeURIComponent(subject.code)}`}>
                      <PlusCircle className="w-3 h-3 mr-1" />
                      <span>Add Questions</span>
                    </Link>
                  </Button>
                )}
              </div>

            </div>
          )
        })}
      </section>

      {/* ========================================================================= */}
      {/* 4. LIVE CAMPUS LEADERBOARD SECTION */}
      {/* ========================================================================= */}
      <CbtFrontLeaderboard 
        initialLeaderboards={initialLeaderboards}
        onSelectSubjectExam={handleOpenConfig}
      />

      {/* ========================================================================= */}
      {/* 5. COMMUNITY CONTRIBUTION BANNER */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-purple-950/60 via-prevu-surface to-[#120e24] border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl backdrop-blur-xl">
        <div 
          className="absolute -top-16 -right-16 w-80 h-80 pointer-events-none rounded-full blur-[100px] opacity-25" 
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

        <Button
          size="lg"
          asChild
          className="h-12 px-7 text-xs sm:text-sm font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-xl shadow-prevu-accent/25 shrink-0 rounded-2xl relative z-10 cursor-pointer transform hover:scale-[1.02] transition-all"
        >
          <Link href="/cbt/contribute" className="flex items-center gap-2">
            <span>Contribute MCQ Questions</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </section>

      {/* ========================================================================= */}
      {/* 6. MODALS */}
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

      {/* Mandatory Registration / Sign-In Gate Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-2xl text-center space-y-5 overflow-hidden">
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
                <Link href="/auth/register" className="flex items-center justify-center gap-2">
                  <span>Create Free Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full h-11 text-xs font-bold border-prevu-surface-light text-prevu-text-muted hover:text-white rounded-2xl cursor-pointer"
              >
                <Link href="/auth/login">
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

          </div>
        </div>
      )}

    </div>
  )
}

