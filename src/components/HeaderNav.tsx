'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import SignOutButton from '@/components/auth/SignOutButton'
import {
  ShieldCheck,
  ShieldAlert,
  LayoutDashboard,
  Upload,
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
  ArrowRight,
  Plus
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
      <div className="h-7 w-28 rounded-xl bg-[#161b22] border border-purple-500/20 animate-pulse" />
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

  // Dropdown States (Sleek, individual, mutually-exclusive)
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
      label: 'Question Papers (PYQs)',
      desc: 'MST1, MST2 & EST papers',
      icon: <FileText className="w-3.5 h-3.5 text-emerald-400" />,
      badge: 'PYQs'
    },
    {
      href: '/study-material',
      label: 'Study Material',
      desc: 'Topper notes, formulas & blueprints',
      icon: <BookOpen className="w-3.5 h-3.5 text-emerald-400" />,
      badge: 'Notes'
    },
    {
      href: '/subjects',
      label: 'Subjects Directory',
      desc: 'All 8 semesters curriculum',
      icon: <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
    },
    {
      href: '/vault',
      label: 'Offline Vault',
      desc: 'Zero-network cached papers',
      icon: <WifiOff className="w-3.5 h-3.5 text-purple-400" />
    }
  ]

  // 2. REAPPEAR DESTINATIONS (Questions Bank, Syllabus, Notes, PYQs)
  const reappearLinks = [
    {
      href: '/reappear?tab=materials&filter=questions',
      label: 'Reappear Question Bank',
      desc: 'Repeated 10-mark high-yield prompts',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-400" />,
      badge: '10 Marks'
    },
    {
      href: '/reappear?tab=materials&filter=syllabus',
      label: 'Reappear Syllabus & Passing Plan',
      desc: '24/60 pass threshold blueprint',
      icon: <Target className="w-3.5 h-3.5 text-rose-400" />,
      badge: '24/60'
    },
    {
      href: '/reappear?tab=materials&filter=notes',
      label: '80/20 Reappear Notes',
      desc: 'One-night essential crash revision',
      icon: <BookOpen className="w-3.5 h-3.5 text-emerald-400" />,
      badge: 'Crash'
    },
    {
      href: '/reappear?tab=pyqs',
      label: 'Reappear PYQs & Solved Papers',
      desc: 'Past remedial question papers',
      icon: <FileText className="w-3.5 h-3.5 text-amber-400" />,
      badge: 'Remedial'
    }
  ]

  // 3. MORE TOOLS
  const moreLinks = [
    {
      href: '/study-planner',
      label: 'Study Planner',
      desc: 'Personal revision schedule',
      icon: <Brain className="w-3.5 h-3.5 text-purple-400" />
    },
    {
      href: '/leaderboard',
      label: 'Hall of Fame & Leaderboard',
      desc: 'Top student contributors & ranks',
      icon: <Trophy className="w-3.5 h-3.5 text-amber-400" />
    },
    {
      href: '/exam-prep',
      label: 'Exam Prep Workspace',
      desc: 'MST & EST weightage analysis',
      icon: <Target className="w-3.5 h-3.5 text-cyan-400" />
    },
    {
      href: '/faculty',
      label: 'Faculty Portal',
      desc: 'Professor paper certifications',
      icon: <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
    }
  ]

  // Filter CBT subjects by search query and semester
  const filteredCbtSubjects = CBT_SUBJECTS.filter(s => {
    const q = cbtSearchQuery.trim().toLowerCase()
    if (!q) return true
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q)
  })

  const currentSemCbt = filteredCbtSubjects.filter(s => s.semester === activeSem)
  const otherSemCbt = filteredCbtSubjects.filter(s => s.semester !== activeSem)

  // Active state helpers
  const isStudyHubActive = pathname === '/browse' || pathname.startsWith('/study-material') || pathname.startsWith('/subjects') || pathname.startsWith('/vault')
  const isCbtActive = pathname.startsWith('/cbt')
  const isReappearActive = pathname.startsWith('/reappear')
  const isCommunityActive = pathname.startsWith('/requests')
  const isMoreActive = moreLinks.some(l => pathname.startsWith(l.href))

  const userDisplayName = user?.displayName || user?.name || user?.email?.split('@')[0] || 'Student'
  const userInitial = userDisplayName.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between gap-1.5 lg:gap-3 flex-1 ml-1 sm:ml-3 min-w-0">

      {/* ============================================================ */}
      {/* DESKTOP PRIMARY NAVIGATION (COMPACT, PROFESSIONAL HIERARCHY) */}
      {/* ============================================================ */}
      <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-0.5 shrink-0 p-0.5 rounded-xl bg-[#090d13]/70 border border-[#30363d]/50 backdrop-blur-md relative">
        
        {/* 1. STUDY HUB (PYQs, Study Material, Subjects, Vault) */}
        <div ref={studyHubRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setStudyHubOpen(!studyHubOpen)
              setCbtMenuOpen(false)
              setReappearMenuOpen(false)
              setMoreMenuOpen(false)
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isStudyHubActive || studyHubOpen
                ? 'bg-[#161b22] text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]/60 font-semibold'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Study Hub</span>
            <ChevronDown className={`w-3 h-3 text-[#7d8590] transition-transform duration-150 ${studyHubOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {studyHubOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full left-0 mt-1.5 w-64 p-1.5 rounded-xl bg-[#161b22]/98 backdrop-blur-xl border border-[#30363d] shadow-2xl shadow-black/80 z-50 space-y-0.5"
              >
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#7d8590] font-bold border-b border-[#30363d]/60 mb-1 flex items-center justify-between">
                  <span>Academic Vault</span>
                  <span className="text-emerald-400">Sem 1 - 8</span>
                </div>

                {studyHubLinks.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setStudyHubOpen(false)}
                    className={`px-2.5 py-2 rounded-lg flex items-center justify-between gap-2 hover:bg-[#21262d] transition-colors group ${
                      pathname === item.href ? 'bg-[#21262d] text-white' : 'text-[#8b949e] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-[#0d1117] border border-[#30363d] flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-[#7d8590] truncate leading-tight">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 2. CBT ARENA (Shows All Subjects Available) */}
        <div ref={cbtRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setCbtMenuOpen(!cbtMenuOpen)
              setStudyHubOpen(false)
              setReappearMenuOpen(false)
              setMoreMenuOpen(false)
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isCbtActive || cbtMenuOpen
                ? 'bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]/60 font-semibold'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>CBT Arena</span>
            <ChevronDown className={`w-3 h-3 text-[#7d8590] transition-transform duration-150 ${cbtMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {cbtMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full left-0 mt-1.5 w-72 p-2 rounded-xl bg-[#161b22]/98 backdrop-blur-xl border border-[#30363d] shadow-2xl shadow-black/80 z-50 space-y-1.5"
              >
                <div className="flex items-center justify-between border-b border-[#30363d]/60 pb-1.5 px-1">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>CBT Subjects</span>
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                    Sem {activeSem} Focus
                  </span>
                </div>

                {/* Instant Search Box */}
                <div className="relative">
                  <Search className="w-3 h-3 text-[#7d8590] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={cbtSearchQuery}
                    onChange={e => setCbtSearchQuery(e.target.value)}
                    placeholder="Search subject or code..."
                    className="w-full pl-7 pr-2.5 py-1 text-xs rounded-lg bg-[#0d1117] border border-[#30363d] text-white placeholder:text-[#7d8590] focus:outline-none focus:border-cyan-500/60 font-mono"
                    autoFocus
                  />
                </div>

                {/* Subject List */}
                <div className="max-h-48 overflow-y-auto space-y-0.5 pr-1 scrollbar-thin">
                  {currentSemCbt.length > 0 && (
                    <div className="text-[9px] font-mono text-[#7d8590] uppercase px-1 pt-0.5">
                      Semester {activeSem}
                    </div>
                  )}

                  {currentSemCbt.map(sub => (
                    <Link
                      key={sub.code}
                      href={`/cbt?subject=${encodeURIComponent(sub.code)}`}
                      onClick={() => setCbtMenuOpen(false)}
                      className="p-1.5 rounded-lg flex items-center justify-between gap-2 hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors group"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                          {sub.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#7d8590] flex items-center gap-1">
                          <span className="text-cyan-400 font-bold">{sub.code}</span>
                          <span>•</span>
                          <span>{sub.totalQuestions} Qs</span>
                        </div>
                      </div>
                      <ArrowRight className="w-3 h-3 text-[#7d8590] group-hover:text-cyan-400 shrink-0" />
                    </Link>
                  ))}

                  {otherSemCbt.length > 0 && (
                    <>
                      <div className="text-[9px] font-mono text-[#7d8590] uppercase px-1 pt-1.5 border-t border-[#30363d]/50">
                        All Open Electives &amp; Subjects
                      </div>
                      {otherSemCbt.map(sub => (
                        <Link
                          key={sub.code}
                          href={`/cbt?subject=${encodeURIComponent(sub.code)}`}
                          onClick={() => setCbtMenuOpen(false)}
                          className="p-1.5 rounded-lg flex items-center justify-between gap-2 hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors group"
                        >
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                              {sub.name}
                            </div>
                            <div className="text-[10px] font-mono text-[#7d8590] flex items-center gap-1">
                              <span className="text-purple-400 font-bold">{sub.code}</span>
                              <span>•</span>
                              <span>Sem {sub.semester} ({sub.totalQuestions} Qs)</span>
                            </div>
                          </div>
                          <ArrowRight className="w-3 h-3 text-[#7d8590] group-hover:text-cyan-400 shrink-0" />
                        </Link>
                      ))}
                    </>
                  )}

                  {filteredCbtSubjects.length === 0 && (
                    <div className="text-center py-3 text-xs text-[#7d8590]">
                      No CBT subject found
                    </div>
                  )}
                </div>

                {/* Footer Quick Links */}
                <div className="pt-1.5 border-t border-[#30363d]/60 flex items-center justify-between text-[11px] font-semibold px-1">
                  <Link
                    href="/cbt"
                    onClick={() => setCbtMenuOpen(false)}
                    className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>View All CBT Arena &rarr;</span>
                  </Link>
                  <Link
                    href="/cbt/contribute"
                    onClick={() => setCbtMenuOpen(false)}
                    className="text-[#8b949e] hover:text-white flex items-center gap-0.5"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add MCQs</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 3. REAPPEAR SECTION (Questions, Syllabus, Notes, PYQs) */}
        <div ref={reappearRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setReappearMenuOpen(!reappearMenuOpen)
              setStudyHubOpen(false)
              setCbtMenuOpen(false)
              setMoreMenuOpen(false)
            }}
            className={`px-2.5 py-1.5 rounded-lg text-xs transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isReappearActive || reappearMenuOpen
                ? 'bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30 shadow-sm'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]/60 font-semibold'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Reappear</span>
            <ChevronDown className={`w-3 h-3 text-[#7d8590] transition-transform duration-150 ${reappearMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {reappearMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full left-0 mt-1.5 w-68 p-1.5 rounded-xl bg-[#161b22]/98 backdrop-blur-xl border border-amber-500/30 shadow-2xl shadow-black/80 z-50 space-y-0.5"
              >
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold border-b border-[#30363d]/60 mb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3 text-amber-400" />
                    <span>Backlog Rescue</span>
                  </div>
                  <span className="text-[9px] text-amber-300 font-mono">100% Pass Hub</span>
                </div>

                {reappearLinks.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setReappearMenuOpen(false)}
                    className="px-2 py-1.5 rounded-lg flex items-center justify-between gap-2 hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-6 h-6 rounded-md bg-[#0d1117] border border-[#30363d] flex items-center justify-center shrink-0">
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-white group-hover:text-amber-300 transition-colors truncate">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-[#7d8590] truncate leading-tight">
                          {item.desc}
                        </div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25 shrink-0">
                      {item.badge}
                    </span>
                  </Link>
                ))}

                {/* Upload Reappear Resource CTA inside dropdown */}
                <div className="pt-1.5 border-t border-[#30363d]/60 px-1">
                  <Link
                    href={`/upload?category=reappear&semester=${activeSem}`}
                    onClick={() => setReappearMenuOpen(false)}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Upload className="w-3 h-3 text-amber-400" />
                    <span>Upload Reappear Resource</span>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 4. COMMUNITY (Direct Link) */}
        <Link
          href="/requests"
          className={`px-2.5 py-1.5 rounded-lg text-xs transition-colors inline-flex items-center gap-1 whitespace-nowrap ${
            isCommunityActive
              ? 'bg-[#161b22] text-purple-300 font-bold border border-purple-500/30 shadow-sm'
              : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]/60 font-semibold'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span>Community</span>
        </Link>

        {/* 5. MORE (Study Planner, Leaderboard, Exam Prep, Faculty) */}
        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMoreMenuOpen(!moreMenuOpen)
              setStudyHubOpen(false)
              setCbtMenuOpen(false)
              setReappearMenuOpen(false)
            }}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isMoreActive || moreMenuOpen
                ? 'bg-[#161b22] text-white font-bold'
                : 'text-[#8b949e] hover:text-white hover:bg-[#161b22]/60'
            }`}
          >
            <span>More</span>
            <ChevronDown className={`w-3 h-3 text-[#7d8590] transition-transform duration-150 ${moreMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {moreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.98 }}
                transition={{ duration: 0.12 }}
                className="absolute top-full right-0 mt-1.5 w-64 p-1.5 rounded-xl bg-[#161b22]/98 backdrop-blur-xl border border-[#30363d] shadow-2xl shadow-black/80 z-50 space-y-0.5 text-xs"
              >
                <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-[#7d8590] font-bold border-b border-[#30363d]/60 mb-1">
                  Workspace Tools
                </div>

                {moreLinks.map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreMenuOpen(false)}
                    className="p-2 rounded-lg flex items-center gap-2.5 hover:bg-[#21262d] text-[#8b949e] hover:text-white transition-colors"
                  >
                    <div className="w-6 h-6 rounded-md bg-[#0d1117] border border-[#30363d] flex items-center justify-center shrink-0">
                      {item.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-white">{item.label}</div>
                      <div className="text-[10px] text-[#7d8590] truncate leading-tight">{item.desc}</div>
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
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">

        {/* Live Exam Countdown Ticker */}
        <div className="hidden xl:block shrink-0">
          <ExamCountdownTicker />
        </div>

        {/* Global Omni-Search Command Palette Button */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#30363d] bg-[#161b22] hover:bg-[#21262d] text-[#7d8590] hover:text-white text-xs font-mono transition-all cursor-pointer shadow-sm group shrink-0"
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
          className={`w-8 h-8 rounded-xl border transition-all flex items-center justify-center cursor-pointer relative shrink-0 ${
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

        {/* Admin Quick Console Pill */}
        {isAdmin && (
          <Link
            href="/admin/dashboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-purple-500/40 bg-purple-950/40 hover:bg-purple-900/50 text-purple-200 text-xs font-bold transition-all shadow-sm shrink-0"
            title="Administrator Moderation Console"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </Link>
        )}

        {/* Upload Paper Primary CTA */}
        <Button
          size="sm"
          asChild
          className="h-8 px-3.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light text-white shadow-md shadow-purple-600/25 shrink-0 cursor-pointer"
        >
          <Link href="/upload" className="flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Paper</span>
            <span className="sm:hidden">Upload</span>
          </Link>
        </Button>

        {/* User Profile Dropdown */}
        {user ? (
          <div ref={userRef} className="relative shrink-0">
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

                  <div className="pt-1 border-t border-prevu-surface-light/60">
                    <SignOutButton />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Button size="sm" variant="outline" asChild className="h-8 px-3 text-xs font-bold border-prevu-surface-light shrink-0">
            <Link href="/login" className="flex items-center gap-1.5">
              <LogIn className="w-3.5 h-3.5 text-prevu-accent" />
              <span>Log In</span>
            </Link>
          </Button>
        )}

        {/* Mobile Hamburger Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/90 text-prevu-text hover:text-prevu-accent transition-colors lg:hidden shrink-0"
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
            </div>

            {/* Mobile Study Hub */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 px-2 font-bold flex items-center justify-between">
                <span>Study Hub</span>
                <span className="text-[9px] text-[#7d8590]">Sem 1 - 8</span>
              </div>
              {studyHubLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-colors ${
                    pathname === link.href ? 'bg-emerald-500/20 text-emerald-300' : 'text-[#8b949e] hover:bg-prevu-surface hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </span>
                  {link.badge && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      {link.badge}
                    </span>
                  )}
                </Link>
              ))}
            </div>

            {/* Mobile CBT Arena */}
            <div className="space-y-1 pt-2 border-t border-prevu-surface-light">
              <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 font-bold flex items-center justify-between">
                <span>CBT Arena</span>
                <span className="text-[9px] text-[#7d8590]">All Subjects</span>
              </div>
              <Link
                href="/cbt"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Open All CBT Mock Tests</span>
              </Link>
              <Link
                href="/cbt/contribute"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-cyan-400" />
                <span>Contribute MCQ Questions</span>
              </Link>
            </div>

            {/* Mobile Reappear Section */}
            <div className="space-y-1 pt-2 border-t border-prevu-surface-light">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 px-2 font-bold flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Reappear Hub</span>
                </span>
                <span className="text-[9px] text-amber-300">100% Pass</span>
              </div>
              {reappearLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white hover:bg-prevu-surface flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    {link.icon}
                    <span>{link.label}</span>
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/25">
                    {link.badge}
                  </span>
                </Link>
              ))}
              <Link
                href="/upload?category=reappear"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300"
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

              {moreLinks.map(link => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl text-xs font-semibold text-[#8b949e] hover:text-white hover:bg-prevu-surface flex items-center gap-2.5"
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile User Controls */}
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
