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
  ClipboardList
} from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import dynamic from 'next/dynamic'
import SmartExamAlertsModal from '@/components/notifications/SmartExamAlertsModal'
import { getUnreadNotificationCountAction } from '@/app/requests/actions'

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
  const [exploreMenuOpen, setExploreMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState<number>(0)

  const shouldReduceMotion = useReducedMotion()

  const exploreRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

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
      if (exploreRef.current && !exploreRef.current.contains(target)) setExploreMenuOpen(false)
      if (userRef.current && !userRef.current.contains(target)) setUserMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close all menus on route change
  useEffect(() => {
    setExploreMenuOpen(false)
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
  }, [pathname])

  // Core primary links (Matches Image 1 with Reappear included seamlessly)
  const primaryLinks = [
    { href: '/browse', label: 'Study Hub', icon: <FileText className="w-3.5 h-3.5 text-prevu-accent" /> },
    { href: '/cbt', label: 'CBT Arena', icon: <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> },
    { 
      href: '/reappear', 
      label: 'Reappear', 
      icon: <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />,
      isReappear: true
    },
    { href: '/requests', label: 'Community', icon: <MessageSquare className="w-3.5 h-3.5 text-purple-400" /> },
    { href: '/vault', label: 'Vault', icon: <WifiOff className="w-3.5 h-3.5 text-cyan-400" />, xlOnly: true },
  ]

  // Explore sub-links
  const exploreLinks = [
    {
      href: '/study-material',
      label: 'Study Material',
      desc: 'Topper notes, formulas, high-scoring blueprints & cheat sheets',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />
    },
    {
      href: '/subjects',
      label: 'Subjects Directory',
      desc: 'All 8 semesters curriculum breakdown, modules & syllabus',
      icon: <GraduationCap className="w-4 h-4 text-cyan-400" />
    },
    {
      href: '/study-planner',
      label: 'Study Planner',
      desc: 'Exam countdown & personal revision scheduler',
      icon: <Brain className="w-4 h-4 text-purple-400" />
    },
    {
      href: '/exam-prep',
      label: 'Exam Prep Workspace',
      desc: 'Targeted MST & EST prep with syllabus weightage analysis',
      icon: <Target className="w-4 h-4 text-amber-400" />
    },
    {
      href: '/leaderboard',
      label: 'Hall of Fame & Leaderboard',
      desc: 'Top student contributors, verified peers & karma rankings',
      icon: <Trophy className="w-4 h-4 text-amber-400" />
    },
    {
      href: '/faculty',
      label: 'Faculty Portal',
      desc: 'Professor paper certifications & official department notes',
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" />
    },
    {
      href: '/vault',
      label: 'Offline PWA Vault',
      desc: 'AES-encrypted zero-network revision storage',
      icon: <WifiOff className="w-4 h-4 text-cyan-400" />
    }
  ]

  const isExploreActive = exploreLinks.some(l => pathname.startsWith(l.href))

  const userDisplayName = user?.displayName || user?.name || user?.email?.split('@')[0] || 'Student'
  const userInitial = userDisplayName.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between gap-2 lg:gap-3 flex-1 ml-2 lg:ml-6 min-w-0">

      {/* ============================================================ */}
      {/* DESKTOP PRIMARY NAVIGATION (SLEEK SINGLE ROW) */}
      {/* ============================================================ */}
      <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1 shrink-0 p-0.5 rounded-2xl bg-[#090d13]/60 border border-[#30363d]/40 backdrop-blur-md relative">
        {primaryLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-3 py-1.5 rounded-xl text-xs transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                link.xlOnly ? 'hidden xl:inline-flex' : ''
              } ${
                isActive
                  ? link.isReappear
                    ? 'bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold'
                    : 'text-white font-bold'
                  : link.isReappear
                    ? 'text-amber-400/90 hover:text-amber-300 hover:bg-amber-500/10 font-semibold'
                    : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40 font-semibold'
              }`}
            >
              {isActive && !link.isReappear && (
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
                {link.icon}
                <span>{link.label}</span>
              </span>
            </Link>
          )
        })}

        {/* Explore Sub-menu with Rich Categories */}
        <div ref={exploreRef} className="relative">
          <button
            type="button"
            onClick={() => setExploreMenuOpen(!exploreMenuOpen)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isExploreActive || exploreMenuOpen
                ? 'bg-prevu-surface-light text-white font-bold'
                : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/50'
            }`}
          >
            <span>Explore</span>
            <ChevronDown className={`w-3 h-3 text-prevu-text-muted transition-transform duration-200 ${exploreMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          <AnimatePresence>
            {exploreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-72 p-2 rounded-2xl bg-[#0d1117]/98 backdrop-blur-2xl border border-prevu-surface-light shadow-2xl shadow-black/90 z-50 space-y-1 text-xs"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-prevu-text-muted font-bold border-b border-prevu-surface-light/50 pb-1.5">
                  Academic Tools &amp; Hubs
                </div>

                {exploreLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setExploreMenuOpen(false)}
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

        {/* Live Exam Countdown Ticker */}
        <div className="hidden xl:block shrink-0">
          <ExamCountdownTicker />
        </div>

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

        {/* Admin Quick Console Pill (Matches Image 1) */}
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
          className="h-8 px-3.5 text-xs font-bold bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light text-white shadow-md shadow-purple-600/25 shrink-0"
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

            {/* Mobile Primary Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-prevu-text-muted px-2 font-bold">
                Main Academic Vaults
              </div>
              {primaryLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-colors ${
                    pathname === link.href ? 'bg-prevu-accent text-white' : 'text-prevu-text hover:bg-prevu-surface'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>

            {/* Mobile Reappear Rescue Hub */}
            <div className="space-y-1 pt-2 border-t border-prevu-surface-light">
              <div className="text-[10px] font-mono uppercase tracking-wider text-amber-400 px-2 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Reappear &amp; Remedial Hub</span>
              </div>
              <Link
                href="/reappear?tab=pyqs"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-semibold text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Reappear PYQs &amp; Solved Papers</span>
              </Link>
              <Link
                href="/reappear?tab=materials&filter=questions"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-semibold text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Important Questions Bank (Imp Ques)</span>
              </Link>
              <Link
                href="/reappear?tab=materials&filter=assignments"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-semibold text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5"
              >
                <ClipboardList className="w-4 h-4 text-cyan-400" />
                <span>Assignments &amp; Tutorials</span>
              </Link>
              <Link
                href="/reappear?tab=materials&filter=notes"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-semibold text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5"
              >
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>80/20 Reappear Crash Notes</span>
              </Link>
              <Link
                href="/reappear?tab=materials&filter=syllabus"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl text-xs font-semibold text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2.5"
              >
                <Target className="w-4 h-4 text-rose-400" />
                <span>Reappear Syllabus &amp; Passing Plan</span>
              </Link>
              <Link
                href="/upload?category=reappear"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 p-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-300"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Reappear Resource</span>
              </Link>
            </div>

            {/* Mobile Explore Section */}
            <div className="space-y-1 pt-2 border-t border-prevu-surface-light">
              <div className="text-[10px] font-mono uppercase tracking-wider text-prevu-text-muted px-2 font-bold">
                Campus Resources
              </div>
              {exploreLinks.map((link) => (
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
