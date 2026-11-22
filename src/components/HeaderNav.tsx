'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import SignOutButton from '@/components/auth/SignOutButton'
import ThemeSwitcherDropdown from '@/components/theme/ThemeSwitcherDropdown'
import {
  ShieldCheck,
  ShieldAlert,
  LayoutDashboard,
  Upload,
  User,
  Menu,
  X,
  BookOpen,
  Sparkles,
  LogIn,
  Trophy,
  GraduationCap,
  Target,
  MessageSquare,
  FileText,
  WifiOff,
  Bell,
  Brain,
  ChevronDown,
  Search,
  Check,
  ArrowRight,
  Plus,
  ClipboardList
} from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import SmartExamAlertsModal from '@/components/notifications/SmartExamAlertsModal'
import { getUnreadNotificationCountAction } from '@/app/requests/actions'
import { CBT_SUBJECTS } from '@/lib/cbt/cbtRegistry'

const ExamCountdownTicker = dynamic(
  () => import('@/components/exam/ExamCountdownTicker'),
  {
    ssr: false,
    loading: () => (
      <div className="h-7 w-28 rounded-xl bg-prevu-surface/60 border border-purple-500/20 animate-pulse" />
    )
  }
)

interface HeaderNavProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  isAdmin: boolean
}

export default function HeaderNav({ user, isAdmin }: HeaderNavProps) {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [alertsModalOpen, setAlertsModalOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)

  // Active Semester sync from localStorage & custom event
  const [activeSem, setActiveSem] = useState<number>(1)

  // Dropdown States
  const [studyHubOpen, setStudyHubOpen] = useState(false)
  const [cbtMenuOpen, setCbtMenuOpen] = useState(false)
  const [reappearMenuOpen, setReappearMenuOpen] = useState(false)
  const [moreMenuOpen, setMoreMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  // Search inside CBT dropdown
  const [cbtSearchQuery, setCbtSearchQuery] = useState('')

  const shouldReduceMotion = useReducedMotion()

  const studyHubRef = useRef<HTMLDivElement>(null)
  const cbtRef = useRef<HTMLDivElement>(null)
  const reappearRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // Sync active semester with SemesterSwitcherPill
  useEffect(() => {
    try {
      const stored = localStorage.getItem('prevu_active_semester')
      if (stored && !isNaN(parseInt(stored))) {
        setActiveSem(parseInt(stored))
      }
    } catch {
      // ignore
    }

    const handleSemChange = (e: Event) => {
      const custom = e as CustomEvent<{ semester: number }>
      if (custom.detail?.semester) {
        setActiveSem(custom.detail.semester)
      }
    }
    window.addEventListener('prevu_semester_change', handleSemChange)
    return () => window.removeEventListener('prevu_semester_change', handleSemChange)
  }, [])

  // Fetch unread notifications count for the authenticated student
  useEffect(() => {
    if (!user) {
      setUnreadCount(0)
      return
    }

    const fetchUnread = () => {
      getUnreadNotificationCountAction()
        .then(count => setUnreadCount(count || 0))
        .catch(() => setUnreadCount(0))
    }

    fetchUnread()
    const timer = setInterval(fetchUnread, 45000)
    return () => clearInterval(timer)
  }, [user])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (studyHubRef.current && !studyHubRef.current.contains(target)) setStudyHubOpen(false)
      if (cbtRef.current && !cbtRef.current.contains(target)) setCbtMenuOpen(false)
      if (reappearRef.current && !reappearRef.current.contains(target)) setReappearMenuOpen(false)
      if (moreRef.current && !moreRef.current.contains(target)) setMoreMenuOpen(false)
      if (userRef.current && !userRef.current.contains(target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close all menus on route change
  useEffect(() => {
    setStudyHubOpen(false)
    setCbtMenuOpen(false)
    setReappearMenuOpen(false)
    setMoreMenuOpen(false)
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
    setCbtSearchQuery('')
  }, [pathname])

  // 1. STUDY HUB DESTINATIONS
  const studyHubLinks = [
    {
      href: '/browse',
      label: 'PYQ Papers Archive',
      desc: 'MST1, MST2 & EST question papers for all branches',
      icon: <FileText className="w-4 h-4 text-prevu-accent" />
    },
    {
      href: '/study-material',
      label: 'Curated Study Material',
      desc: 'Handwritten notes, blueprints & unit guides',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />
    },
    {
      href: '/subjects',
      label: 'Subjects Directory',
      desc: 'All 8 semesters curriculum breakdown & syllabus',
      icon: <GraduationCap className="w-4 h-4 text-cyan-400" />
    },
    {
      href: '/vault',
      label: 'Offline Vault',
      desc: 'AES-encrypted zero-network revision storage',
      icon: <WifiOff className="w-4 h-4 text-amber-400" />
    }
  ]

  // 2. REAPPEAR DESTINATIONS: PYQ & STUDY MATERIAL (IMP QUES, ASSIGNMENT, NOTES, SYLLABUS)
  const reappearPyqItems = [
    {
      tab: 'pyqs' as const,
      href: '/reappear?tab=pyqs',
      label: 'Reappear PYQs & Solved Papers',
      desc: 'High-frequency remedial papers & verified derivations',
      icon: <FileText className="w-4 h-4 text-amber-400" />,
      badge: 'PYQ Archive'
    }
  ]

  const reappearMaterialItems = [
    {
      tab: 'questions' as const,
      href: '/reappear?tab=materials&filter=questions',
      label: 'Important Questions Bank (Imp Ques)',
      desc: 'High-probability 10-mark repeated prompts & solutions',
      icon: <Sparkles className="w-4 h-4 text-purple-400" />,
      badge: '10 Marks'
    },
    {
      tab: 'assignments' as const,
      href: '/reappear?tab=materials&filter=assignments',
      label: 'Assignments & Tutorials',
      desc: 'Step-by-step tutorial problem solutions & assignments',
      icon: <ClipboardList className="w-4 h-4 text-cyan-400" />,
      badge: 'Sheets'
    },
    {
      tab: 'notes' as const,
      href: '/reappear?tab=materials&filter=notes',
      label: '80/20 Reappear Crash Notes',
      desc: 'One-night essential revision & high-yield formulas',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      badge: 'One-Night'
    },
    {
      tab: 'syllabus' as const,
      href: '/reappear?tab=materials&filter=syllabus',
      label: 'Reappear Syllabus & Passing Plan',
      desc: 'Course blueprint & unit-wise 24/60 passing threshold',
      icon: <Target className="w-4 h-4 text-rose-400" />,
      badge: '24/60 Plan'
    }
  ]

  const reappearLinks = [
    ...reappearPyqItems,
    ...reappearMaterialItems
  ]

  // 3. MORE DESTINATIONS
  const moreLinks = [
    {
      href: '/study-planner',
      label: 'Smart Study Planner',
      desc: 'Targeted revision schedule & exam countdown',
      icon: <Brain className="w-4 h-4 text-purple-400" />
    },
    {
      href: '/leaderboard',
      label: 'Hall of Fame & Leaderboard',
      desc: 'Top student contributors & peer rankings',
      icon: <Trophy className="w-4 h-4 text-amber-400" />
    },
    {
      href: '/exam-prep',
      label: 'Exam Prep Workspace',
      desc: 'Subject weightage analysis & high-scoring units',
      icon: <Target className="w-4 h-4 text-cyan-400" />
    },
    {
      href: '/faculty',
      label: 'Faculty Portal',
      desc: 'Professor paper certifications & official notes',
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" />
    }
  ]

  // Filter CBT subjects by active semester and search query
  const matchingCbtSubjects = CBT_SUBJECTS.filter(s => {
    const q = cbtSearchQuery.trim().toLowerCase()
    if (!q) return true
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  })

  // Group into current semester subjects vs other subjects
  const currentSemCbtSubjects = matchingCbtSubjects.filter(s => s.semester === activeSem)
  const otherCbtSubjects = matchingCbtSubjects.filter(s => s.semester !== activeSem)

  // Active Route Checks
  const isStudyHubActive = pathname === '/browse' || pathname.startsWith('/study-material') || pathname.startsWith('/subjects') || pathname.startsWith('/vault')
  const isCbtActive = pathname.startsWith('/cbt')
  const isReappearActive = pathname.includes('reappear')
  const isCommunityActive = pathname.startsWith('/requests')
  const isMoreActive = moreLinks.some(l => pathname.startsWith(l.href))

  const userDisplayName = user?.displayName || user?.name || user?.email?.split('@')[0] || 'Student'
  const userInitial = userDisplayName.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between gap-2 lg:gap-3 flex-1 ml-2 lg:ml-6 min-w-0">

      {/* ============================================================ */}
      {/* DESKTOP PRIMARY NAVIGATION */}
      {/* ============================================================ */}
      <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 shrink-0 p-0.5 rounded-2xl bg-[#090d13]/60 border border-[#30363d]/40 backdrop-blur-md relative">
        
        {/* 1. STUDY HUB DROPDOWN */}
        <div ref={studyHubRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setStudyHubOpen(!studyHubOpen)
              setCbtMenuOpen(false)
              setReappearMenuOpen(false)
              setMoreMenuOpen(false)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isStudyHubActive || studyHubOpen
                ? 'bg-prevu-surface-light text-white font-bold'
                : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40 font-semibold'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-prevu-accent" />
            <span>Study Hub</span>
            <ChevronDown className={`w-3 h-3 text-prevu-text-muted transition-transform duration-200 ${studyHubOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {studyHubOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-80 p-2.5 rounded-2xl bg-[#0d1117]/98 backdrop-blur-2xl border border-prevu-surface-light shadow-2xl shadow-black/90 z-50 space-y-1"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-prevu-text-muted font-bold flex items-center justify-between border-b border-prevu-surface-light/50 pb-2">
                  <span>Academic Repository</span>
                  <span className="text-prevu-accent">Sem 1 - 8</span>
                </div>

                {studyHubLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setStudyHubOpen(false)}
                    className={`p-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                      pathname === item.href
                        ? 'bg-prevu-surface text-white'
                        : 'hover:bg-prevu-surface/60 text-prevu-text-muted hover:text-white'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-prevu-bg border border-prevu-surface-light flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{item.label}</span>
                      </div>
                      <div className="text-[11px] text-prevu-text-muted leading-tight mt-0.5">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. CBT ARENA DROPDOWN (SEARCHABLE FOR SELECTED SEMESTER) */}
        <div ref={cbtRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setCbtMenuOpen(!cbtMenuOpen)
              setStudyHubOpen(false)
              setReappearMenuOpen(false)
              setMoreMenuOpen(false)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isCbtActive || cbtMenuOpen
                ? 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold'
                : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40 font-semibold'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CBT Arena</span>
            <ChevronDown className={`w-3 h-3 text-prevu-text-muted transition-transform duration-200 ${cbtMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {cbtMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-84 p-3 rounded-2xl bg-[#0d1117]/98 backdrop-blur-2xl border border-cyan-500/30 shadow-2xl shadow-black/90 z-50 space-y-2.5"
              >
                <div className="flex items-center justify-between border-b border-prevu-surface-light/50 pb-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3" />
                    <span>CBT Mock Testing</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/25">
                    Sem {activeSem} Focus
                  </span>
                </div>

                {/* Instant Search Filter for CBT Subjects */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-prevu-text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cbtSearchQuery}
                    onChange={(e) => setCbtSearchQuery(e.target.value)}
                    placeholder="Search CBT subjects or codes..."
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-prevu-bg border border-prevu-surface-light text-white placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-cyan-500/60 transition-colors font-mono"
                    autoFocus
                  />
                </div>

                {/* Subject List */}
                <div className="max-h-56 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
                  {currentSemCbtSubjects.length > 0 && (
                    <div className="text-[10px] font-mono text-[#7d8590] uppercase px-1 pt-1">
                      Semester {activeSem} Available
                    </div>
                  )}

                  {currentSemCbtSubjects.map(sub => (
                    <Link
                      key={sub.code}
                      href={`/cbt?subject=${encodeURIComponent(sub.code)}`}
                      onClick={() => setCbtMenuOpen(false)}
                      className="p-2 rounded-xl flex items-center justify-between gap-2 hover:bg-prevu-surface text-prevu-text-muted hover:text-white transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {sub.name}
                        </div>
                        <div className="text-[10px] font-mono text-prevu-text-muted flex items-center gap-1.5">
                          <span className="text-cyan-400 font-bold">{sub.code}</span>
                          <span>•</span>
                          <span>{sub.totalQuestions} Questions</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-prevu-text-muted group-hover:text-cyan-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  ))}

                  {/* Other Semester Subjects */}
                  {otherCbtSubjects.length > 0 && (
                    <>
                      <div className="text-[10px] font-mono text-[#7d8590] uppercase px-1 pt-2 border-t border-prevu-surface-light/40">
                        Other CBT Tests & Electives
                      </div>
                      {otherCbtSubjects.map(sub => (
                        <Link
                          key={sub.code}
                          href={`/cbt?subject=${encodeURIComponent(sub.code)}`}
                          onClick={() => setCbtMenuOpen(false)}
                          className="p-2 rounded-xl flex items-center justify-between gap-2 hover:bg-prevu-surface text-prevu-text-muted hover:text-white transition-colors group"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {sub.name}
                            </div>
                            <div className="text-[10px] font-mono text-prevu-text-muted flex items-center gap-1.5">
                              <span className="text-purple-400 font-bold">{sub.code}</span>
                              <span>•</span>
                              <span>Sem {sub.semester} ({sub.totalQuestions} Qs)</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-prevu-text-muted group-hover:text-cyan-400 shrink-0" />
                        </Link>
                      ))}
                    </>
                  )}

                  {matchingCbtSubjects.length === 0 && (
                    <div className="text-center py-4 text-xs text-prevu-text-muted">
                      No CBT subject found matching &quot;{cbtSearchQuery}&quot;
                    </div>
                  )}
                </div>

                {/* Bottom Links */}
                <div className="pt-2 border-t border-prevu-surface-light/60 flex items-center justify-between text-xs font-semibold">
                  <Link
                    href="/cbt"
                    onClick={() => setCbtMenuOpen(false)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
                  >
                    <span>View All CBT Subjects &rarr;</span>
                  </Link>

                  <Link
                    href="/cbt/contribute"
                    onClick={() => setCbtMenuOpen(false)}
                    className="text-prevu-text-muted hover:text-white flex items-center gap-1 text-[11px]"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add MCQs</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. REAPPEAR DROPDOWN */}
        <div ref={reappearRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setReappearMenuOpen(!reappearMenuOpen)
              setStudyHubOpen(false)
              setCbtMenuOpen(false)
              setMoreMenuOpen(false)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              isReappearActive || reappearMenuOpen
                ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold'
                : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40 font-semibold'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Reappear</span>
            <ChevronDown className={`w-3 h-3 text-prevu-text-muted transition-transform duration-200 ${reappearMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {reappearMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-88 p-2.5 rounded-2xl bg-[#0d1117]/98 backdrop-blur-2xl border border-amber-500/30 shadow-2xl shadow-black/90 z-50 space-y-2"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center justify-between border-b border-prevu-surface-light/50 pb-2">
                  <div className="flex items-center gap-1.5">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Backlog Rescue Hub</span>
                  </div>
                  <span>100% Verified</span>
                </div>

                {/* Pillar 1: Reappear PYQs */}
                <div className="space-y-1">
                  <div className="px-3 pt-1 text-[9px] font-mono uppercase tracking-wider text-amber-400/80 font-bold flex items-center gap-1">
                    <FileText className="w-3 h-3 text-amber-400" />
                    <span>Reappear PYQs</span>
                  </div>
                  {reappearPyqItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setReappearMenuOpen(false)
                        if (pathname === '/' || pathname === '/reappear') {
                          const el = document.getElementById('reappear-rescue')
                          if (el) el.scrollIntoView({ behavior: 'smooth' })
                          window.dispatchEvent(new CustomEvent('prevu_reappear_tab_change', { detail: { tab: item.tab } }))
                        }
                      }}
                      className="p-2 rounded-xl flex items-center justify-between hover:bg-prevu-surface/60 text-prevu-text-muted hover:text-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors truncate">{item.label}</div>
                          <div className="text-[10px] text-prevu-text-muted leading-tight truncate">{item.desc}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shrink-0 ml-2">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Pillar 2: Reappear Study Material (Imp Ques, Assignments, Notes, Syllabus) */}
                <div className="space-y-1 pt-1.5 border-t border-prevu-surface-light/50">
                  <div className="px-3 pt-1 text-[9px] font-mono uppercase tracking-wider text-emerald-400/80 font-bold flex items-center gap-1">
                    <BookOpen className="w-3 h-3 text-emerald-400" />
                    <span>Reappear Study Material</span>
                  </div>
                  {reappearMaterialItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => {
                        setReappearMenuOpen(false)
                        if (pathname === '/' || pathname === '/reappear') {
                          const el = document.getElementById('reappear-rescue')
                          if (el) el.scrollIntoView({ behavior: 'smooth' })
                          window.dispatchEvent(new CustomEvent('prevu_reappear_tab_change', { detail: { tab: item.tab } }))
                        }
                      }}
                      className="p-2 rounded-xl flex items-center justify-between hover:bg-prevu-surface/60 text-prevu-text-muted hover:text-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-prevu-bg border border-prevu-surface-light flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors truncate">{item.label}</div>
                          <div className="text-[10px] text-prevu-text-muted leading-tight truncate">{item.desc}</div>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-prevu-bg text-prevu-text-muted border border-prevu-surface-light shrink-0 ml-2">
                        {item.badge}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Upload Reappear Resource Action Button */}
                <div className="pt-2 border-t border-prevu-surface-light/60">
                  <Link
                    href={`/upload?category=reappear&semester=${activeSem}`}
                    onClick={() => setReappearMenuOpen(false)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-black" />
                    <span>Upload Reappear Resource</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. COMMUNITY (DIRECT DESTINATION) */}
        <Link
          href="/requests"
          className={`relative px-3 py-1.5 rounded-xl text-xs transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
            isCommunityActive
              ? 'text-white font-bold'
              : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40 font-semibold'
          }`}
        >
          {isCommunityActive && (
            <motion.div
              layoutId="desktopActiveNavPill"
              className="absolute inset-0 rounded-xl bg-prevu-surface-light/95 border border-prevu-accent/35 shadow-[0_2px_12px_rgba(0,0,0,0.5)] -z-10"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: 'spring', stiffness: 380, damping: 30, mass: 0.8 }
              }
            />
          )}
          <span className="relative z-10 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
            <span>Community</span>
          </span>
        </Link>

        {/* 5. MORE DROPDOWN */}
        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMoreMenuOpen(!moreMenuOpen)
              setStudyHubOpen(false)
              setCbtMenuOpen(false)
              setReappearMenuOpen(false)
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isMoreActive || moreMenuOpen
                ? 'bg-prevu-surface-light text-white font-bold'
                : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/50'
            }`}
          >
            <span>More</span>
            <ChevronDown className={`w-3 h-3 text-prevu-text-muted transition-transform duration-200 ${moreMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {moreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl bg-[#0d1117]/98 backdrop-blur-2xl border border-prevu-surface-light shadow-2xl shadow-black/90 z-50 space-y-1 text-xs"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-prevu-text-muted font-bold border-b border-prevu-surface-light/50 pb-1.5">
                  Prevu Workspace Tools
                </div>

                {moreLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreMenuOpen(false)}
                    className="p-2.5 rounded-xl flex items-start gap-3 hover:bg-prevu-surface/60 text-prevu-text-muted hover:text-white transition-colors"
                  >
                    <div className="w-8 h-8 rounded-xl bg-prevu-bg border border-prevu-surface-light flex items-center justify-center shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{item.label}</div>
                      <div className="text-[11px] text-prevu-text-muted leading-tight mt-0.5">{item.desc}</div>
                    </div>
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </nav>

      {/* ============================================================ */}
      {/* ACTIONS & TOOLS (RIGHT) */}
      {/* ============================================================ */}
      <div className="flex items-center gap-1.5 lg:gap-2 shrink-0 ml-auto">

        {/* Global Omni-Search Command Palette Button */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] text-[#7d8590] hover:text-white text-xs font-mono transition-all cursor-pointer shadow-sm group shrink-0"
          title="Open Command Palette (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] hidden sm:inline">Search</span>
          <kbd className="px-1.5 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[10px] text-[#7d8590] group-hover:text-emerald-400 hidden sm:inline">
            ⌘K
          </kbd>
        </button>

        {/* Smart Exam Alerts & Notifications Bell */}
        <button
          type="button"
          onClick={() => setAlertsModalOpen(true)}
          className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center cursor-pointer relative ${
            unreadCount > 0
              ? 'border-purple-500/60 bg-purple-500/15 text-white shadow-sm shadow-purple-500/30'
              : 'border-prevu-surface-light bg-prevu-surface/60 hover:bg-prevu-surface hover:border-purple-500/40 text-prevu-text-muted hover:text-white'
          }`}
          title={unreadCount > 0 ? `${unreadCount} unread community alerts` : 'Smart Exam Alerts & Notifications'}
        >
          <Bell className={`w-3.5 h-3.5 ${unreadCount > 0 ? 'text-purple-300' : 'text-purple-400'}`} />
          {unreadCount > 0 ? (
            <span className="min-w-[16px] h-4 px-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white text-[9px] font-extrabold absolute -top-1 -right-1 flex items-center justify-center shadow-md shadow-rose-500/40 border border-[#0d0d14] animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400/40 absolute top-2 right-2" />
          )}
        </button>

        {/* Upload Paper Primary CTA */}
        <Button
          size="sm"
          asChild
          className="h-8 px-3.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light text-white shadow-md shadow-purple-600/25 shrink-0"
        >
          <Link href="/upload" className="flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Paper</span>
            <span className="sm:hidden">Upload</span>
          </Link>
        </Button>

        {/* User Profile Dropdown (Includes Admin Portal & Theme Switcher) */}
        {user ? (
          <div ref={userRef} className="relative">
            <button
              type="button"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 p-1 pl-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/80 hover:bg-prevu-surface text-prevu-text hover:text-white transition-all cursor-pointer"
              title="Open User Profile & Settings"
            >
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-[11px] font-bold shadow-sm">
                {userInitial}
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-prevu-text-muted transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Dropdown Menu */}
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-64 p-2.5 rounded-2xl bg-[#0d1117]/98 backdrop-blur-2xl border border-prevu-surface-light shadow-2xl shadow-black/90 z-50 space-y-1.5 text-xs"
                >
                  <div className="p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light/60">
                    <p className="font-bold text-white truncate">{userDisplayName}</p>
                    <p className="text-[10px] font-mono text-prevu-text-muted truncate mt-0.5">{user.email || 'CU Scholar'}</p>
                  </div>

                  {/* ADMIN CONSOLE (Integrated inside Profile for authorized admins) */}
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-purple-200 hover:text-white hover:bg-purple-900/50 flex items-center gap-2.5 font-bold transition-all shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      <div className="flex-1">
                        <div className="text-xs">Admin Console</div>
                        <div className="text-[10px] text-purple-300/70 font-normal">Moderate papers & analytics</div>
                      </div>
                    </Link>
                  )}

                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-prevu-accent" />
                    <span>Student Dashboard</span>
                  </Link>

                  <Link
                    href="/dashboard?tab=saved"
                    onClick={() => setUserMenuOpen(false)}
                    className="p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                    <span>Saved Bookmarks</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5 font-medium transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Profile</span>
                  </Link>

                  {/* Inline Theme Switcher in User Menu */}
                  <div className="p-2 rounded-xl bg-prevu-bg/60 border border-prevu-surface-light/50 flex items-center justify-between">
                    <span className="text-[11px] text-prevu-text-muted font-mono">Theme</span>
                    <ThemeSwitcherDropdown />
                  </div>

                  <div className="pt-1 border-t border-prevu-surface-light/60">
                    <SignOutButton />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Button size="sm" variant="outline" asChild className="h-8 px-3 text-xs font-bold border-prevu-surface-light">
            <Link href="/login" className="flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-prevu-accent" />
              <span>Log In</span>
            </Link>
          </Button>
        )}

        {/* Mobile Hamburger Menu Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/90 text-prevu-text hover:text-prevu-accent transition-colors lg:hidden"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

      </div>

      {/* ============================================================ */}
      {/* MOBILE FULL DRAWER NAVIGATION */}
      {/* ============================================================ */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-16 left-0 right-0 p-4 bg-[#09090d]/98 backdrop-blur-2xl border-b border-prevu-surface-light shadow-2xl z-50 lg:hidden space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Mobile Ticker */}
            <div className="pb-3 border-b border-prevu-surface-light flex items-center justify-between gap-2">
              <ExamCountdownTicker />
              <ThemeSwitcherDropdown />
            </div>

            {/* Mobile Study Hub */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-prevu-accent px-2 font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>Study Hub</span>
              </div>
              {studyHubLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors text-prevu-text hover:bg-prevu-surface"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile CBT Arena */}
            <div className="space-y-1 pt-2 border-t border-prevu-surface-light">
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>CBT Mock Arena</span>
                </span>
                <span className="text-[9px] text-[#7d8590]">Sem {activeSem}</span>
              </div>
              <Link
                href="/cbt"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-cyan-300 hover:bg-prevu-surface"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Open CBT Mock Tests Portal</span>
              </Link>
              <Link
                href="/cbt/contribute"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 text-prevu-text-muted hover:text-white"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Contribute Practice MCQs</span>
              </Link>
            </div>

            {/* Mobile Reappear Section */}
            <div className="space-y-1 pt-2 border-t border-prevu-surface-light">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 px-2 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Reappear &amp; Remedial Hub</span>
              </div>
              {reappearLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => {
                    setMobileMenuOpen(false)
                    if (pathname === '/' || pathname === '/reappear') {
                      const el = document.getElementById('reappear-rescue')
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' })
                      }
                      window.dispatchEvent(new CustomEvent('prevu_reappear_tab_change', { detail: { tab: link.tab } }))
                    }
                  }}
                  className="p-2.5 rounded-xl text-xs font-semibold text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
              <Link
                href={`/upload?category=reappear&semester=${activeSem}`}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500/25 to-yellow-500/20 border border-amber-500/40 text-amber-300 shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Reappear Resource</span>
              </Link>
            </div>

            {/* Mobile Community & More */}
            <div className="space-y-1 pt-2 border-t border-prevu-surface-light">
              <Link
                href="/requests"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 text-purple-300 hover:bg-prevu-surface"
              >
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>Community &amp; Doubts</span>
              </Link>

              {moreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-xs font-semibold text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5 transition-colors"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Admin & User Controls */}
            {user && (
              <div className="pt-2 border-t border-prevu-surface-light space-y-2">
                {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl text-xs font-bold text-purple-300 bg-purple-950/40 border border-purple-500/30 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span>Admin Console</span>
                  </Link>
                )}

                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-xs font-semibold text-prevu-text hover:bg-prevu-surface flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-prevu-accent" />
                  <span>Student Dashboard</span>
                </Link>

                <div className="pt-1">
                  <SignOutButton />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Exam Alerts Modal */}
      <SmartExamAlertsModal
        isOpen={alertsModalOpen}
        onClose={() => setAlertsModalOpen(false)}
        onUpdateUnreadCount={setUnreadCount}
      />

    </div>
  )
}
