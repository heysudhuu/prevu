'use client'

import React, { useState } from 'react'
import { CBT_SUBJECTS, generateTestQuestions } from '@/lib/cbt/cbtRegistry'
import { CbtSubject, CbtExamConfig } from '@/lib/cbt/types'
import { 
  Sparkles, 
  HelpCircle, 
  Play, 
  PlusCircle, 
  Clock, 
  Layers, 
  Award, 
  CheckCircle2, 
  Search, 
  Flame,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import CbtExamConfigModal from './CbtExamConfigModal'
import CbtExamRunner from './CbtExamRunner'
import Link from 'next/link'

interface CbtArenaHubProps {
  isAuthenticated?: boolean
}

export default function CbtArenaHub({ isAuthenticated = false }: CbtArenaHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  
  // Auth Gate modal state
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false)

  // Active Exam state
  const [activeSubject, setActiveSubject] = useState<CbtSubject | null>(null)
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false)
  const [runningExam, setRunningExam] = useState<{
    subject: CbtSubject
    config: CbtExamConfig
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    questions: any[]
  } | null>(null)

  const categories = [
    { id: 'all', label: 'All Exam Categories' },
    { id: 'open-elective', label: 'Open Electives (7th Sem)' },
    { id: 'aptitude', label: 'Aptitude & Placements' },
    { id: 'uhv', label: 'UHV (Universal Human Values)' },
    { id: 'core', label: 'Core Technical CBT' }
  ]

  const filteredSubjects = CBT_SUBJECTS.filter(s => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory
    const matchesQuery = !searchQuery.trim() || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCat && matchesQuery
  })

  const handleOpenConfig = (subject: CbtSubject) => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      setShowAuthModal(true)
      return
    }

    setActiveSubject(subject)
    setIsConfigOpen(true)
  }

  const handleStartExam = (config: {
    questionCount: number
    timeLimitMinutes: number
    shuffleQuestions: boolean
  }) => {
    if (!activeSubject) return
    setIsConfigOpen(false)

    const generated = generateTestQuestions(
      activeSubject.code,
      config.questionCount,
      config.shuffleQuestions
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
            runningExam.config.shuffleQuestions
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
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-prevu-surface via-prevu-surface/80 to-prevu-bg border border-prevu-surface-light p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-prevu-accent/10 blur-3xl pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-10 w-80 h-80 bg-cyan-500/10 blur-3xl pointer-events-none rounded-full" />

        <div className="relative max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prevu CBT Mock Exam Simulator</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Master Your Computer-Based Tests with Real Exam Timers
          </h1>

          <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
            Practice officially structured MCQ question banks for <strong className="text-white">Open Electives</strong>, <strong className="text-white">UHV</strong>, <strong className="text-white">Campus Aptitude</strong>, and <strong className="text-white">Core MSTs</strong>. Set custom question counts, challenge the timer, and claim your spot on the campus leaderboard.
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 font-mono text-xs">
            <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light">
              <span className="text-[10px] uppercase text-prevu-text-muted block">Questions in Bank</span>
              <span className="text-base font-bold text-white font-mono">51+ Verified</span>
            </div>
            <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light">
              <span className="text-[10px] uppercase text-prevu-text-muted block">Exam Rules</span>
              <span className="text-base font-bold text-cyan-400 font-mono">Max 2m / Question</span>
            </div>
            <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light">
              <span className="text-[10px] uppercase text-prevu-text-muted block">Leaderboard</span>
              <span className="text-base font-bold text-purple-300 font-mono">Latest Attempt</span>
            </div>
            <div className="p-3 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light">
              <span className="text-[10px] uppercase text-prevu-text-muted block">Karma Bonus</span>
              <span className="text-base font-bold text-amber-400 font-mono">+15 Pts / Test</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="space-y-4">
        
        {/* Search input + Category tabs */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-prevu-accent text-white border-prevu-accent shadow-md shadow-prevu-accent/25'
                    : 'bg-prevu-surface/60 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-accent/30'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-prevu-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by code or subject..."
              className="w-full pl-9 pr-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-2xl text-xs text-white placeholder:text-prevu-text-muted/60 focus:border-prevu-accent focus:outline-none"
            />
          </div>

        </div>

      </section>

      {/* Subject Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSubjects.map(subject => {
          const isLive = subject.isReady

          return (
            <div
              key={subject.code}
              className={`p-6 rounded-3xl border transition-all duration-200 flex flex-col justify-between space-y-4 relative overflow-hidden group ${
                isLive
                  ? 'bg-prevu-surface/90 border-prevu-surface-light hover:border-prevu-accent/50 shadow-xl hover:shadow-2xl hover:shadow-prevu-accent/10'
                  : 'bg-prevu-surface/40 border-prevu-surface-light/40 opacity-75'
              }`}
            >
              <div className="space-y-3">
                
                {/* Header Tag Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    {subject.categoryLabel}
                  </span>

                  <span className="text-[10px] font-mono font-bold text-prevu-text-muted">
                    Sem {subject.semester} • Year {subject.year}
                  </span>
                </div>

                {/* Subject Title */}
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-200 transition-colors">
                    {subject.name}
                  </h3>
                  <div className="text-xs font-mono text-cyan-400 font-bold mt-0.5">
                    {subject.code}
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-prevu-text-muted leading-relaxed line-clamp-2">
                  {subject.description}
                </p>

                {/* Topics Covered */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {subject.topics.slice(0, 3).map(topic => (
                    <span key={topic} className="text-[10px] bg-prevu-bg/80 border border-prevu-surface-light text-prevu-text-muted px-2 py-0.5 rounded-md">
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

              {/* Card Footer / Action */}
              <div className="pt-3 border-t border-prevu-surface-light/60 flex items-center justify-between gap-2">
                <div>
                  {isLive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 font-bold">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      {subject.totalQuestions} Questions Ready
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-prevu-text-muted">
                      Community Bank Open
                    </span>
                  )}
                </div>

                {isLive ? (
                  <Button
                    size="sm"
                    onClick={() => handleOpenConfig(subject)}
                    className="h-8 px-4 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-md flex items-center gap-1.5"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Mock CBT</span>
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="h-8 px-3 text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white"
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

      {/* Community Contribution Callout Banner */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/60 via-prevu-surface to-purple-950/60 border border-purple-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl backdrop-blur-md">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
            <PlusCircle className="w-3 h-3" />
            <span>Community Question Bank</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Have MCQs for an Open Elective, UHV, or Aptitude?
          </h3>
          <p className="text-xs text-prevu-text-muted max-w-xl leading-relaxed">
            Contribute questions for any semester. Once reviewed and approved by the Prevu admin team, you earn <strong>+5 Scholar Karma</strong> for each verified question!
          </p>
        </div>

        <Button
          size="sm"
          asChild
          className="h-10 px-5 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-lg shrink-0"
        >
          <Link href="/cbt/contribute">
            <span>Contribute MCQ Questions</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </Button>
      </section>

      {/* Configurator Modal */}
      {activeSubject && (
        <CbtExamConfigModal
          subject={activeSubject}
          isOpen={isConfigOpen}
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

            <div className="space-y-2.5 pt-2">
              <Button
                asChild
                className="w-full h-11 text-xs font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-lg shadow-prevu-accent/25 rounded-2xl"
              >
                <Link href="/signup?redirectTo=/cbt">
                  Register / Create Free Account
                </Link>
              </Button>

              <Button
                variant="outline"
                asChild
                className="w-full h-11 text-xs font-semibold border-prevu-surface-light text-prevu-text hover:text-white rounded-2xl"
              >
                <Link href="/login?redirectTo=/cbt">
                  Sign In with Student ID or Email
                </Link>
              </Button>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="text-[11px] text-prevu-text-muted hover:text-white underline font-mono cursor-pointer"
              >
                Cancel and return to arena
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
