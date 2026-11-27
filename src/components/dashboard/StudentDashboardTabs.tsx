'use client'

import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import SpotlightCard from '@/components/ui/kinetic/SpotlightCard'
import BorderBeam from '@/components/ui/kinetic/BorderBeam'
import LottieBadge from '@/components/ui/kinetic/LottieBadge'
import {
  BookOpen,
  Bookmark,
  HelpCircle,
  Upload,
  Search,
  X,
  FileQuestion,
  MessageSquarePlus,
  ArrowRight,
  Target,
  GraduationCap,
  Sparkles,
  Zap
} from 'lucide-react'
import Link from 'next/link'
import { ResourceCard } from '@/components/ResourceCard'
import DashboardSideRail, { DashboardTabType } from './DashboardSideRail'
import ExamCountdownWidget from './ExamCountdownWidget'
import AcademicCalendarModal from './AcademicCalendarModal'
import ExamBlueprintModal from './ExamBlueprintModal'
import RecentlyViewedBar from './RecentlyViewedBar'
import SavedPapersList from './SavedPapersList'
import PaperRequestsBoard from './PaperRequestsBoard'
import StudentCbtHistoryTab from './StudentCbtHistoryTab'
import { UserCbtHistoryItem } from '@/lib/cbt/actions'

interface StudentDashboardTabsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userProfile: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  myResources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  savedResources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paperRequests: any[]
  cbtAttempts?: UserCbtHistoryItem[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  liveResources?: any[]
  initialTab?: string
  initialAction?: string
}

const gridStagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.045,
      delayChildren: 0.05
    }
  }
}

const gridCardItem = {
  hidden: { opacity: 0, y: 14, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 24 }
  }
}

export default function StudentDashboardTabs({
  userProfile,
  myResources,
  savedResources,
  paperRequests,
  cbtAttempts = [],
  liveResources = [],
  initialTab = 'browse',
  initialAction
}: StudentDashboardTabsProps) {
  const searchParams = useSearchParams()
  const validTabs: DashboardTabType[] = ['browse', 'saved', 'cbt-history', 'requests', 'my-uploads']
  const paramTab = searchParams.get('tab') as DashboardTabType
  const [userSelectedTab, setUserSelectedTab] = useState<DashboardTabType | null>(null)

  // Derive active tab from user selection, URL parameter, or initial tab fallback
  const activeTab: DashboardTabType = userSelectedTab && validTabs.includes(userSelectedTab)
    ? userSelectedTab
    : (paramTab && validTabs.includes(paramTab)
      ? paramTab
      : (validTabs.includes(initialTab as DashboardTabType) ? (initialTab as DashboardTabType) : 'browse'))

  const handleTabChange = (newTab: DashboardTabType) => {
    setUserSelectedTab(newTab)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('tab', newTab)
      url.searchParams.delete('action')
      window.history.replaceState(null, '', url.toString())
    }
  }

  // Listen for Hero Stat Card click events to jump cleanly between tabs
  useEffect(() => {
    const onSwitchTab = (e: Event) => {
      const detail = (e as CustomEvent<DashboardTabType>).detail
      if (detail && validTabs.includes(detail)) {
        handleTabChange(detail)
      }
    }
    window.addEventListener('prevu-switch-tab', onSwitchTab)
    return () => window.removeEventListener('prevu-switch-tab', onSwitchTab)
  }, [])

  // Dashboard in-page search & filter states
  const userSem = userProfile?.current_semester || 1
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSemester, setSelectedSemester] = useState<number | 'ALL'>(userSem)
  const [selectedPattern, setSelectedPattern] = useState<string>('ALL')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const paperGridRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useReducedMotion()

  // GSAP ScrollTrigger batch cascade on Verified Paper Cards
  useEffect(() => {
    if (prefersReduced || activeTab !== 'browse' || !paperGridRef.current) return
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.gsap-paper-card')
      if (cards.length === 0) return

      gsap.set(cards, { y: 18, opacity: 0 })
      ScrollTrigger.batch(cards, {
        start: 'top 92%',
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, {
            y: 0,
            opacity: 1,
            duration: 0.48,
            stagger: 0.055,
            ease: 'power3.out',
            overwrite: true,
            clearProps: 'transform,opacity'
          })
        }
      })
    }, paperGridRef)

    return () => ctx.revert()
  }, [activeTab, selectedSemester, selectedPattern, searchQuery, prefersReduced])

  // Press '/' anywhere (outside inputs) to focus paper search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || activeTab !== 'browse') return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) return
      e.preventDefault()
      searchInputRef.current?.focus()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeTab])

  const hasCustomFilters = Boolean(searchQuery) || selectedSemester !== userSem || selectedPattern !== 'ALL'
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedSemester(userSem)
    setSelectedPattern('ALL')
  }

  // Filter live resources
  const filteredLiveResources = liveResources.filter(r => {
    const term = searchQuery.toLowerCase().trim()
    const matchesSearch = !term ||
      r.subjects?.name?.toLowerCase().includes(term) ||
      r.subjects?.code?.toLowerCase().includes(term) ||
      r.exam_types?.name?.toLowerCase().includes(term) ||
      String(r.exam_year || '').includes(term)

    const matchesSem = selectedSemester === 'ALL' || r.subjects?.semester === selectedSemester
    const matchesPattern = selectedPattern === 'ALL' || r.exam_types?.name === selectedPattern

    return matchesSearch && matchesSem && matchesPattern
  })

  const savedResourceIds = savedResources.map(s => s.id)

  const tabItems: {
    id: DashboardTabType
    label: string
    icon: React.ComponentType<{ className?: string }>
    badge?: string | number
    activeGradient?: string
    iconClass?: string
  }[] = [
    {
      id: 'browse',
      label: 'Study Hub',
      icon: BookOpen,
      badge: liveResources.length > 0 ? `Sem ${userSem} (${liveResources.length})` : undefined
    },
    {
      id: 'saved',
      label: 'Saved Papers',
      icon: Bookmark,
      badge: savedResources.length > 0 ? savedResources.length : undefined
    },
    {
      id: 'cbt-history',
      label: 'CBT Mock Records',
      icon: Zap,
      badge: cbtAttempts.length > 0 ? cbtAttempts.length : undefined,
      activeGradient: 'from-amber-500 to-amber-600 shadow-amber-500/25',
      iconClass: 'text-amber-400'
    },
    {
      id: 'requests',
      label: 'Paper Requests',
      icon: HelpCircle,
      badge: paperRequests.length > 0 ? paperRequests.length : undefined
    },
    {
      id: 'my-uploads',
      label: 'My Contributions',
      icon: Upload,
      badge: myResources.length > 0 ? myResources.length : undefined
    }
  ]

  return (
    <div className="space-y-8">
      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ZONE B: SMART TWO-COLUMN LAYOUT (SIDEBAR RAIL + MAIN WORKSPACE) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div id="workspace-zone" className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Navigation & Academic Rail (Desktop 1024px+) */}
        <DashboardSideRail
          activeTab={activeTab}
          onTabChange={handleTabChange}
          userSem={userSem}
          counts={{
            browse: liveResources.length,
            saved: savedResources.length,
            cbt: cbtAttempts.length,
            requests: paperRequests.length,
            uploads: myResources.length
          }}
        />

        {/* Right Main Content Column */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Floating Pill-Style Tab Bar with Animated Indicator */}
          <div className="p-1.5 rounded-2xl bg-prevu-surface/70 border border-prevu-surface-light backdrop-blur-xl shadow-lg overflow-x-auto scrollbar-thin">
            <div className="flex items-center gap-1.5 min-w-max">
              {tabItems.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleTabChange(tab.id)}
                    className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'text-white'
                        : 'text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/40'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="top-tab-pill-indicator"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        className={`absolute inset-0 rounded-xl shadow-lg ${
                          tab.activeGradient
                            ? `bg-gradient-to-r ${tab.activeGradient}`
                            : 'bg-prevu-accent shadow-prevu-accent/25'
                        }`}
                      />
                    )}
                    <Icon
                      className={`relative z-10 w-3.5 h-3.5 ${
                        isActive ? 'text-white' : tab.iconClass || ''
                      }`}
                    />
                    <span className="relative z-10">{tab.label}</span>
                    {tab.badge !== undefined && (
                      <span className="relative z-10 px-1.5 py-0.2 rounded-full text-[10px] bg-white/15 text-white font-mono">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Animated Tab Content Area */}
          <AnimatePresence mode="wait">
            {/* ------------------------------------------------------------ */}
            {/* TAB 1: LIVE QUESTION PAPERS & IN-DASHBOARD BROWSING */}
            {/* ------------------------------------------------------------ */}
            {activeTab === 'browse' && (
              <motion.div
                key="tab-browse"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                {/* Mobile/Tablet Only: Compact Exam Countdown + Quick Tools (already in Left Rail on lg+) */}
                <div className="lg:hidden space-y-4">
                  <ExamCountdownWidget semester={userSem} compact />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-prevu-surface/70 border border-prevu-surface-light backdrop-blur-xl shadow-lg">
                    <div>
                      <h2 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-prevu-accent" />
                        <span>Quick Academic Tools</span>
                      </h2>
                      <p className="text-[11px] text-prevu-text-muted mt-0.5">
                        CU calendar, blueprints &amp; exam prep resources
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" asChild className="h-8 text-xs border-prevu-surface-light hover:border-cyan-500/40 text-cyan-300">
                        <Link href="/exam-prep">
                          <Target className="w-3.5 h-3.5 mr-1 text-cyan-400" /> Exam Prep
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild className="h-8 text-xs border-prevu-surface-light hover:border-prevu-accent/40 text-prevu-accent">
                        <Link href="/subjects">
                          <GraduationCap className="w-3.5 h-3.5 mr-1" /> Catalog
                        </Link>
                      </Button>
                      <AcademicCalendarModal semester={userSem} />
                      <ExamBlueprintModal semester={userSem} />
                    </div>
                  </div>
                </div>

                {/* Glassmorphic Search & Filter Command Bar */}
                <div className="space-y-4 p-4 sm:p-5 rounded-3xl bg-prevu-surface/70 border border-prevu-surface-light backdrop-blur-xl shadow-xl">
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="relative flex-1 group">
                      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted group-focus-within:text-prevu-accent transition-colors" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Search papers by subject name, course code (e.g. 23CST-201), or year..."
                        className="w-full pl-10 pr-14 py-2.5 bg-prevu-bg/90 border border-prevu-surface-light hover:border-prevu-accent/50 focus:border-prevu-accent focus:ring-2 focus:ring-prevu-accent/25 rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none transition-all"
                      />
                      {searchQuery ? (
                        <button
                          type="button"
                          onClick={() => setSearchQuery('')}
                          aria-label="Clear search"
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-prevu-text p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <kbd className="hidden sm:inline-flex items-center justify-center absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-prevu-text-muted bg-prevu-surface border border-prevu-surface-light rounded-md pointer-events-none group-focus-within:opacity-0 transition-opacity">
                          /
                        </kbd>
                      )}
                    </div>

                    {/* Full Archive Link */}
                    <Button variant="outline" size="sm" asChild className="h-10 text-xs border-prevu-surface-light hover:border-prevu-accent/50 shrink-0 font-semibold">
                      <Link href="/browse">
                        <span>Open Full Archive</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 text-prevu-accent" />
                      </Link>
                    </Button>
                  </div>

                  {/* Semester & Exam Pattern Filter Pills */}
                  <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 pt-3 border-t border-prevu-surface-light/60">
                    {/* Semester Switcher */}
                    <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-thin text-xs py-0.5">
                      <span className="text-[10px] font-mono font-semibold uppercase tracking-[0.15em] text-prevu-text-muted shrink-0 mr-1">
                        Sem:
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={() => setSelectedSemester('ALL')}
                        className={`relative px-3 py-1 rounded-xl text-xs font-semibold transition-colors shrink-0 cursor-pointer ${
                          selectedSemester === 'ALL'
                            ? 'text-white'
                            : 'bg-prevu-bg/80 border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
                        }`}
                      >
                        {selectedSemester === 'ALL' && (
                          <motion.div
                            layoutId="semester-filter-pill"
                            transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                            className="absolute inset-0 rounded-xl bg-prevu-accent shadow-md shadow-prevu-accent/25"
                          />
                        )}
                        <span className="relative z-10">All</span>
                      </motion.button>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          key={s}
                          type="button"
                          onClick={() => setSelectedSemester(s)}
                          className={`relative px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-colors shrink-0 cursor-pointer ${
                            selectedSemester === s
                              ? 'text-white'
                              : 'bg-prevu-bg/80 border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text hover:border-prevu-accent/30'
                          }`}
                        >
                          {selectedSemester === s && (
                            <motion.div
                              layoutId="semester-filter-pill"
                              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                              className="absolute inset-0 rounded-xl bg-prevu-accent shadow-md shadow-prevu-accent/25"
                            />
                          )}
                          <span className="relative z-10">{s} {userSem === s && '⭐'}</span>
                        </motion.button>
                      ))}
                    </div>

                    {/* Pattern Filter Pills */}
                    <div className="flex items-center gap-1.5 shrink-0 text-xs flex-wrap">
                      {['ALL', 'MST1', 'MST2', 'EST'].map((type) => (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          key={type}
                          type="button"
                          onClick={() => setSelectedPattern(type)}
                          className={`relative px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                            selectedPattern === type
                              ? 'text-white'
                              : 'bg-prevu-bg/80 border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
                          }`}
                        >
                          {selectedPattern === type && (
                            <motion.div
                              layoutId="pattern-filter-pill"
                              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                              className={`absolute inset-0 rounded-xl shadow-md ${
                                type === 'EST'
                                  ? 'bg-emerald-600 shadow-emerald-600/25'
                                  : 'bg-purple-600 shadow-purple-600/25'
                              }`}
                            />
                          )}
                          <span className="relative z-10">
                            {type === 'ALL' && 'All Types'}
                            {type === 'MST1' && '⚡ MST 1'}
                            {type === 'MST2' && '⚡ MST 2'}
                            {type === 'EST' && '🎓 EST'}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Live Papers Grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2.5">
                      <LottieBadge variant="spark" size={18} />
                      <span>Verified Question Papers</span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                        {filteredLiveResources.length} Available
                      </span>
                    </h3>

                    {hasCustomFilters && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-mono font-semibold text-prevu-text-muted hover:text-white bg-prevu-surface border border-prevu-surface-light hover:border-prevu-accent/40 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                        <span>Reset to Sem {userSem}</span>
                      </button>
                    )}
                  </div>

                  {filteredLiveResources.length > 0 ? (
                    <div
                      ref={paperGridRef}
                      key={`grid-${selectedSemester}-${selectedPattern}`}
                      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                      {filteredLiveResources.map((resource) => (
                        <div key={resource.id} className="gsap-paper-card h-full">
                          <SpotlightCard
                            className="h-full"
                            spotlightColor="rgba(56, 189, 248, 0.11)"
                          >
                            <ResourceCard
                              resource={resource}
                              isBookmarked={savedResourceIds.includes(resource.id)}
                            />
                          </SpotlightCard>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-16 border border-prevu-surface-light bg-prevu-surface/60 backdrop-blur-xl rounded-3xl p-8 space-y-3 max-w-md mx-auto shadow-xl"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                        className="w-14 h-14 rounded-2xl bg-prevu-surface border border-prevu-surface-light flex items-center justify-center mx-auto text-prevu-text-muted"
                      >
                        <FileQuestion className="w-7 h-7 text-prevu-accent" />
                      </motion.div>
                      <h4 className="text-base font-bold text-white">No papers found</h4>
                      <p className="text-xs text-prevu-text-muted leading-relaxed">
                        {searchQuery
                          ? `No papers match "${searchQuery}". You can post a paper request to your batchmates!`
                          : 'No question papers found for this semester filter.'}
                      </p>
                      <div className="pt-2">
                        <Button size="sm" onClick={() => handleTabChange('requests')} className="text-xs bg-prevu-accent text-white font-bold">
                          <MessageSquarePlus className="w-3.5 h-3.5 mr-1.5" /> Request this Paper
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB 2: SAVED PAPERS & BOOKMARKS */}
            {/* ------------------------------------------------------------ */}
            {activeTab === 'saved' && (
              <motion.div
                key="tab-saved"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <SavedPapersList resources={savedResources} />
              </motion.div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB 3: CBT MOCK EXAMS & ACCURACY HISTORY */}
            {/* ------------------------------------------------------------ */}
            {activeTab === 'cbt-history' && (
              <motion.div
                key="tab-cbt-history"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <StudentCbtHistoryTab attempts={cbtAttempts} />
              </motion.div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB 4: PAPER REQUESTS BOARD */}
            {/* ------------------------------------------------------------ */}
            {activeTab === 'requests' && (
              <motion.div
                key="tab-requests"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-4"
              >
                <PaperRequestsBoard
                  requests={paperRequests}
                  autoOpenModal={initialAction === 'new' || searchParams.get('action') === 'new'}
                />
              </motion.div>
            )}

            {/* ------------------------------------------------------------ */}
            {/* TAB 5: MY UPLOADS & CONTRIBUTIONS */}
            {/* ------------------------------------------------------------ */}
            {activeTab === 'my-uploads' && (
              <motion.div
                key="tab-my-uploads"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between pb-3 border-b border-prevu-surface-light">
                  <div>
                    <h2 className="text-base font-bold text-white">My Contributed Question Papers</h2>
                    <p className="text-xs text-prevu-text-muted">Track the approval status of question papers you uploaded to Prevu.</p>
                  </div>
                  <Button size="sm" asChild className="text-xs font-bold">
                    <Link href="/upload">
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload New Paper
                    </Link>
                  </Button>
                </div>

                {myResources.length === 0 ? (
                  <div className="text-center py-16 border border-prevu-surface-light bg-prevu-surface/60 backdrop-blur-xl rounded-3xl p-8 space-y-3 max-w-md mx-auto shadow-xl">
                    <Upload className="w-10 h-10 text-prevu-text-muted mx-auto" />
                    <h3 className="text-base font-bold text-white">You haven&apos;t uploaded any papers yet</h3>
                    <p className="text-xs text-prevu-text-muted leading-relaxed">
                      Help your juniors and classmates by sharing previous year question papers or notes from your exams!
                    </p>
                    <Button size="sm" asChild className="mt-2 text-xs font-bold">
                      <Link href="/upload">Contribute Your First Paper</Link>
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    variants={gridStagger}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
                  >
                    {myResources.map((resource) => (
                      <motion.div
                        key={resource.id}
                        variants={gridCardItem}
                        className="h-full"
                      >
                        <SpotlightCard className="h-full rounded-2xl" spotlightColor="rgba(168, 85, 247, 0.14)">
                          <Card className="border-prevu-surface-light bg-prevu-surface/80 backdrop-blur-xl shadow-lg h-full">
                          <CardHeader className="pb-3 border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-lg bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/25">
                                {resource.exam_types?.name}
                              </span>
                              <span
                                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                                  resource.status === 'approved'
                                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                                    : resource.status === 'rejected'
                                      ? 'bg-red-500/15 text-red-400 border-red-500/30'
                                      : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                                }`}
                              >
                                {resource.status === 'approved'
                                  ? '✓ Approved & Live'
                                  : resource.status === 'rejected'
                                    ? '✕ Rejected'
                                    : '⏳ Under Review'}
                              </span>
                            </div>

                            <CardTitle className="text-base font-bold text-white">
                              {resource.subjects?.name}
                            </CardTitle>
                            <p className="text-xs text-prevu-text-muted font-mono mt-0.5">
                              {resource.subjects?.code} • Sem {resource.subjects?.semester} • {resource.exam_year}
                            </p>
                          </CardHeader>
                        </Card>
                        </SpotlightCard>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ZONE C: ACTIVITY & DISCOVERY STRIP (CBT SPARK + RECENTLY VIEWED) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="space-y-6 pt-2"
      >
        {/* CBT Performance Spark Strip (if student has taken mock exams) */}
        {cbtAttempts.length > 0 && (
          <div className="relative p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-prevu-surface border border-amber-500/25 backdrop-blur-xl shadow-xl space-y-3 overflow-hidden">
            {!prefersReduced && (
              <BorderBeam duration={10} colorFrom="#f59e0b" colorTo="#a855f7" borderWidth={1.25} />
            )}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/30 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <LottieBadge variant="spark" size={15} />
                    <span className="text-[11px] font-mono font-bold uppercase tracking-[0.15em] text-amber-400">
                      CBT Arena Performance
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {cbtAttempts.length} Mock{cbtAttempts.length > 1 ? 's' : ''} Taken
                    </span>
                  </div>
                  <p className="text-xs text-white font-medium mt-0.5">
                    Latest score:{' '}
                    <span className="font-bold text-amber-300">
                      {cbtAttempts[0].score}/{cbtAttempts[0].totalQuestions} ({cbtAttempts[0].percentage}%)
                    </span>{' '}
                    in <span className="text-prevu-accent">{cbtAttempts[0].subjectName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => {
                    handleTabChange('cbt-history')
                    document.getElementById('workspace-zone')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20 cursor-pointer transition-colors"
                >
                  <span>View All Mock Results</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </div>

            {/* Spring-animated accuracy spark progress bar */}
            <div className="h-1.5 rounded-full bg-prevu-bg/80 overflow-hidden border border-amber-500/15">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400"
                initial={{ width: 0 }}
                whileInView={{ width: `${Math.min(100, Math.max(4, cbtAttempts[0].percentage))}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        )}

        {/* Recently Studied & Practiced Horizontal Strip */}
        <RecentlyViewedBar />
      </motion.section>
    </div>
  )
}
