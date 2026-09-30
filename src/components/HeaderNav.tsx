'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import SignOutButton from '@/components/auth/SignOutButton'
import { 
  ShieldCheck, 
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
  ChevronDown
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'
import SmartExamAlertsModal from '@/components/notifications/SmartExamAlertsModal'

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

  const exploreRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreMenuOpen(false)
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdowns on route change
  useEffect(() => {
    setExploreMenuOpen(false)
    setUserMenuOpen(false)
    setMobileMenuOpen(false)
  }, [pathname])

  // Core primary links
  const primaryLinks = [
    { href: '/browse', label: 'Papers', icon: <FileText className="w-3.5 h-3.5 text-prevu-accent" /> },
    { href: '/vault', label: 'Vault', icon: <WifiOff className="w-3.5 h-3.5 text-cyan-400" /> },
    { href: '/study-planner', label: 'Planner', icon: <Brain className="w-3.5 h-3.5 text-purple-400" /> },
    { href: '/exam-prep', label: 'Exam Prep', icon: <Target className="w-3.5 h-3.5 text-amber-400" /> },
  ]

  // Explore sub-links
  const exploreLinks = [
    { 
      href: '/study-material', 
      label: 'Study Material', 
      desc: 'Topper notes, formulas & blueprints',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" /> 
    },
    { 
      href: '/subjects', 
      label: 'Subjects Directory', 
      desc: 'All 8 semesters curriculum papers',
      icon: <GraduationCap className="w-4 h-4 text-cyan-400" /> 
    },
    { 
      href: '/requests', 
      label: 'Bounty Requests', 
      desc: 'Ask for missing papers & claim XP',
      icon: <MessageSquare className="w-4 h-4 text-purple-400" /> 
    },
    { 
      href: '/leaderboard', 
      label: 'Hall of Fame', 
      desc: 'Top student contributors & ranks',
      icon: <Trophy className="w-4 h-4 text-amber-400" /> 
    },
    { 
      href: '/faculty', 
      label: 'Faculty Portal', 
      desc: 'Professor paper certifications',
      icon: <GraduationCap className="w-4 h-4 text-emerald-400" /> 
    }
  ]

  const isExploreActive = exploreLinks.some(l => pathname.startsWith(l.href))

  const userDisplayName = user?.displayName || user?.name || user?.email?.split('@')[0] || 'Student'
  const userInitial = userDisplayName.charAt(0).toUpperCase()

  return (
    <div className="flex items-center justify-between gap-3 flex-1 ml-4 lg:ml-8 min-w-0">
      
      {/* ============================================================ */}
      {/* DESKTOP CENTER NAVIGATION LINKS */}
      {/* ============================================================ */}
      <nav className="hidden lg:flex items-center gap-1 shrink-0">
        {primaryLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1.5 whitespace-nowrap ${
                isActive
                  ? 'bg-prevu-surface-light text-white shadow-sm font-bold border border-prevu-surface-light/80'
                  : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/50'
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          )
        })}

        {/* Explore Dropdown */}
        <div ref={exploreRef} className="relative">
          <button
            onClick={() => setExploreMenuOpen(!exploreMenuOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${
              isExploreActive || exploreMenuOpen
                ? 'bg-prevu-surface-light text-white font-bold'
                : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/50'
            }`}
          >
            <span>Explore</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${exploreMenuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Explore Dropdown Card */}
          <AnimatePresence>
            {exploreMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute top-full left-0 mt-2 w-72 p-2 rounded-2xl bg-[#11111a]/95 backdrop-blur-2xl border border-prevu-surface-light shadow-2xl shadow-black/80 z-50 space-y-1"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-prevu-text-muted font-bold">
                  Campus Resources & Social
                </div>

                {exploreLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setExploreMenuOpen(false)}
                    className={`p-2.5 rounded-xl flex items-start gap-3 transition-colors ${
                      pathname.startsWith(item.href)
                        ? 'bg-prevu-surface text-white'
                        : 'hover:bg-prevu-surface/60 text-prevu-text-muted hover:text-white'
                    }`}
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
      {/* UTILITIES & ACTION BUTTONS */}
      {/* ============================================================ */}
      <div className="flex items-center gap-1.5 lg:gap-2 shrink-0 ml-auto">
        
        {/* Compact Exam Countdown Ticker */}
        <div className="hidden xl:flex items-center shrink-0 mr-1">
          <ExamCountdownTicker />
        </div>
        
        {/* Smart Exam Alerts Bell */}
        <button
          onClick={() => setAlertsModalOpen(true)}
          className="w-8 h-8 rounded-xl border border-prevu-surface-light bg-prevu-surface/60 hover:bg-prevu-surface hover:border-purple-500/40 text-prevu-text-muted hover:text-white transition-all flex items-center justify-center cursor-pointer relative"
          title="Smart Exam Alerts & Notifications"
        >
          <Bell className="w-3.5 h-3.5 text-purple-400" />
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 absolute top-2 right-2 animate-ping" />
        </button>

        {/* Admin Console Badge Button (if Admin) */}
        {isAdmin && (
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="h-8 px-3 text-xs border-purple-500/40 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:text-white shadow-sm shadow-purple-500/20 font-bold shrink-0 hidden sm:inline-flex"
          >
            <Link href="/admin" className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Admin</span>
            </Link>
          </Button>
        )}

        {/* Upload Contribution Button */}
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

        {/* User Profile Dropdown / Log In Button */}
        {user ? (
          <div ref={userRef} className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-1.5 p-1 pl-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/80 hover:bg-prevu-surface text-prevu-text hover:text-white transition-all cursor-pointer"
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
                  className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl bg-[#11111a]/95 backdrop-blur-2xl border border-prevu-surface-light shadow-2xl shadow-black/80 z-50 space-y-1 text-xs"
                >
                  <div className="p-2.5 border-b border-prevu-surface-light/60">
                    <p className="font-bold text-white truncate">{userDisplayName}</p>
                    <p className="text-[10px] font-mono text-prevu-text-muted truncate mt-0.5">{user.email || 'CU Student'}</p>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserMenuOpen(false)}
                    className="p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2 font-medium transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-prevu-accent" />
                    <span>Student Dashboard</span>
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface flex items-center gap-2 font-medium transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    <span>My Profile</span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserMenuOpen(false)}
                      className="p-2 rounded-xl text-purple-300 hover:text-white hover:bg-purple-500/20 flex items-center gap-2 font-medium transition-colors sm:hidden"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                      <span>Admin Console</span>
                    </Link>
                  )}

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
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Navigation Menu"
          className="p-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/90 text-prevu-text hover:text-prevu-accent transition-colors md:hidden"
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
            className="absolute top-16 left-0 right-0 p-4 bg-[#09090d]/98 backdrop-blur-2xl border-b border-prevu-surface-light shadow-2xl z-50 md:hidden space-y-4 max-h-[85vh] overflow-y-auto"
          >
            {/* Mobile Ticker */}
            <div className="pb-3 border-b border-prevu-surface-light flex items-center justify-between">
              <ExamCountdownTicker />
            </div>

            {/* Mobile Primary Section */}
            <div className="space-y-1">
              <div className="text-[10px] font-mono uppercase tracking-wider text-prevu-text-muted px-2 font-bold">
                Main Vault & Planner
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
      />

    </div>
  )
}
