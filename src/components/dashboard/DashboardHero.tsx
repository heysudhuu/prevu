'use client'

import React, { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion
} from 'framer-motion'
import BorderBeam from '@/components/ui/kinetic/BorderBeam'
import {
  Upload,
  Search,
  User,
  ShieldCheck,
  CheckCircle,
  GraduationCap,
  FileText,
  Bookmark,
  Zap,
  HelpCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { DashboardTabType } from './DashboardSideRail'

// ─── Animated Number Counter ───────────────────────────────────────
function AnimatedCounter({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const mv = useMotionValue(0)
  const spring = useSpring(mv, { stiffness: 90, damping: 20 })
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(value)
      return
    }
    mv.set(value)
  }, [value, mv, prefersReduced])

  useEffect(() => {
    if (prefersReduced) return
    const unsub = spring.on('change', v => setDisplay(Math.round(v)))
    return unsub
  }, [spring, prefersReduced])

  return <span>{display}</span>
}

// ─── Stagger Variants ──────────────────────────────────────────────
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.14 } }
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, stiffness: 320, damping: 24 }
  }
}

// ─── Types ─────────────────────────────────────────────────────────
interface DashboardHeroProps {
  userProfile: {
    name?: string
    username?: string
    avatar_url?: string
    cu_verified?: boolean
    student_uid?: string
    branch?: string
    current_semester?: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  } | null
  isAdmin: boolean
  stats: {
    contributions: number
    saved: number
    cbtMocks: number
    requests: number
    approved: number
  }
}

export default function DashboardHero({ userProfile, isAdmin, stats }: DashboardHeroProps) {
  const prefersReduced = useReducedMotion()
  const heroContainerRef = useRef<HTMLElement>(null)

  // GSAP entrance timeline choreography for hero typography & action strip
  useEffect(() => {
    if (prefersReduced || !heroContainerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.gsap-hero-stagger',
        { y: 12, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.065,
          ease: 'power3.out',
          clearProps: 'transform,opacity'
        }
      )
    }, heroContainerRef)

    return () => ctx.revert()
  }, [prefersReduced])

  // Cursor spotlight tracking across the hero surface
  const mouseX = useMotionValue(-400)
  const mouseY = useMotionValue(-400)
  const spotlightBackground = useMotionTemplate`radial-gradient(520px circle at ${mouseX}px ${mouseY}px, rgba(56, 189, 248, 0.09), rgba(35, 134, 54, 0.06) 40%, transparent 75%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const handleMouseLeave = () => {
    mouseX.set(-400)
    mouseY.set(-400)
  }

  const jumpToWorkspaceTab = (tab: DashboardTabType) => {
    if (typeof window === 'undefined') return
    window.dispatchEvent(new CustomEvent('prevu-switch-tab', { detail: tab }))
    document.getElementById('workspace-zone')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const statCards: {
    label: string
    value: number
    color: string
    barColor: string
    glowBorder: string
    iconBg: string
    sub: string
    subColor: string
    targetTab: DashboardTabType
    icon: React.ComponentType<{ className?: string }>
  }[] = [
    {
      label: 'My Contributions',
      value: stats.contributions,
      color: 'text-white',
      barColor: 'bg-prevu-accent',
      glowBorder: 'hover:border-prevu-accent/50',
      iconBg: 'bg-prevu-accent/15 text-prevu-accent border-prevu-accent/25',
      sub: 'Uploaded papers',
      subColor: 'text-prevu-accent',
      targetTab: 'my-uploads',
      icon: Upload
    },
    {
      label: 'Saved Papers',
      value: stats.saved,
      color: 'text-amber-400',
      barColor: 'bg-amber-400',
      glowBorder: 'hover:border-amber-400/50',
      iconBg: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
      sub: 'Quick revision hub',
      subColor: 'text-amber-400/80',
      targetTab: 'saved',
      icon: Bookmark
    },
    {
      label: 'CBT Mock Exams',
      value: stats.cbtMocks,
      color: 'text-cyan-400',
      barColor: 'bg-cyan-400',
      glowBorder: 'hover:border-cyan-400/50',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/25',
      sub: 'Tests attempted',
      subColor: 'text-cyan-400/80',
      targetTab: 'cbt-history',
      icon: Zap
    },
    {
      label: 'Community Requests',
      value: stats.requests,
      color: 'text-purple-400',
      barColor: 'bg-purple-400',
      glowBorder: 'hover:border-purple-400/50',
      iconBg: 'bg-purple-500/15 text-purple-400 border-purple-500/25',
      sub: 'Peer study requests',
      subColor: 'text-purple-400/80',
      targetTab: 'requests',
      icon: HelpCircle
    },
    {
      label: 'Approved & Live',
      value: stats.approved,
      color: 'text-emerald-400',
      barColor: 'bg-emerald-400',
      glowBorder: 'hover:border-emerald-400/50',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
      sub: 'Helping students',
      subColor: 'text-emerald-400/80',
      targetTab: 'browse',
      icon: FileText
    }
  ]

  const maxBarRef = Math.max(10, stats.contributions, stats.saved, stats.cbtMocks, stats.requests, stats.approved)

  return (
    <motion.section
      ref={heroContainerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-prevu-surface via-prevu-surface/95 to-prevu-bg border border-prevu-surface-light/90 shadow-2xl shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] overflow-hidden group/hero"
    >
      {/* 21st.dev Animated Perimeter Light Beam */}
      {!prefersReduced && (
        <BorderBeam duration={9} colorFrom="#38bdf8" colorTo="#238636" borderWidth={1.5} />
      )}
      {/* Subtle Architectural Dot-Grid Texture */}
      <div
        className="absolute inset-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 20%, black 35%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 20%, black 35%, transparent 100%)'
        }}
      />

      {/* Interactive Cursor Spotlight */}
      {!prefersReduced && (
        <motion.div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover/hero:opacity-100 transition-opacity duration-300"
          style={{ background: spotlightBackground }}
        />
      )}

      {/* Ambient Glow Orbs */}
      <div className="absolute -top-12 -right-12 w-80 h-80 bg-prevu-accent/15 blur-[100px] rounded-full pointer-events-none animate-gradient-shift" />
      <div className="absolute -bottom-16 -left-12 w-64 h-64 bg-purple-600/12 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4 sm:gap-5">
          {/* Avatar with animated gradient ring */}
          <Link href="/profile" className="shrink-0 relative group" title="View Digital Student ID & Profile">
            <motion.div
              className="absolute -inset-1 rounded-2xl opacity-65 group-hover:opacity-100 blur-[1px] transition-opacity"
              style={{ background: 'conic-gradient(from 0deg, #238636, #8b5cf6, #06b6d4, #f59e0b, #238636)' }}
              animate={prefersReduced ? undefined : { rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            />
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-prevu-accent to-purple-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-prevu-bg shadow-xl group-hover:scale-[1.04] transition-transform">
              {userProfile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userProfile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}</span>
              )}
            </div>
            <span
              className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-prevu-bg shadow-md"
              title="Active Session"
            />
          </Link>

          <div className="space-y-1">
            <div className="gsap-hero-stagger flex items-center gap-2 mb-1.5 flex-wrap">
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                </span>
              ) : userProfile?.cu_verified ? (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-3.5 h-3.5" /> Verified CU Student
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] bg-zinc-800/80 text-prevu-text-muted border border-prevu-surface-light">
                  Student Member
                </span>
              )}
              <span className="text-xs font-mono text-prevu-accent">@{userProfile?.username || 'student'}</span>
              {userProfile?.student_uid && (
                <span className="text-[11px] font-mono text-prevu-text-muted bg-prevu-bg/90 px-2 py-0.5 rounded-md border border-prevu-surface-light">
                  UID: {userProfile.student_uid}
                </span>
              )}
            </div>

            <h1 className="gsap-hero-stagger text-2xl sm:text-3xl lg:text-[2.15rem] font-black tracking-tight leading-tight">
              <span className="text-white/90">Welcome back, </span>
              <span className="bg-gradient-to-r from-white via-emerald-200 via-cyan-300 to-white bg-clip-text text-transparent animate-text-shimmer">
                {userProfile?.name || 'Student'}
              </span>
              <span className="ml-1.5 inline-block">👋</span>
            </h1>

            <div className="gsap-hero-stagger flex flex-wrap items-center gap-2.5 text-xs text-prevu-text-muted pt-0.5">
              <span className="inline-flex items-center gap-1.5 text-prevu-text font-semibold px-2 py-0.5 rounded-lg bg-prevu-bg/60 border border-prevu-surface-light/60">
                <GraduationCap className="w-3.5 h-3.5 text-prevu-accent" />
                {userProfile?.branch || 'BE-CSE'}
              </span>
              <span className="text-prevu-surface-light">•</span>
              <span className="font-mono text-[11px] text-prevu-text">
                Semester {userProfile?.current_semester || 1}
              </span>
              <span className="text-prevu-surface-light">•</span>
              <span className="inline-flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3 h-3 text-amber-400/80" />
                Chandigarh University
              </span>
            </div>
          </div>
        </div>

        {/* Quick Primary Actions */}
        <motion.div
          className="flex flex-wrap items-center gap-2.5"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button asChild className="btn-shimmer-sweep py-2.5 px-4 shadow-lg shadow-prevu-accent/25 font-bold">
              <Link href="/upload" className="flex items-center gap-1.5 text-xs">
                <Upload className="w-4 h-4" /> Upload Paper
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" asChild className="py-2.5 px-4 bg-prevu-bg/60 border-prevu-surface-light hover:border-prevu-accent font-semibold">
              <Link href="/profile" className="flex items-center gap-1.5 text-xs">
                <User className="w-4 h-4 text-prevu-accent" /> My Profile
              </Link>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Button variant="outline" size="sm" asChild className="py-2.5 px-3.5 bg-prevu-bg/60 border-prevu-surface-light hover:border-cyan-400/50 font-semibold">
              <Link href="/browse" className="flex items-center gap-1.5 text-xs">
                <Search className="w-4 h-4 text-cyan-400" /> Browse
              </Link>
            </Button>
          </motion.div>

          {isAdmin && (
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Button variant="secondary" asChild className="py-2.5 px-4 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 font-bold">
                <Link href="/admin/dashboard" className="flex items-center gap-1.5 text-xs">
                  <ShieldCheck className="w-4 h-4" /> Admin Portal
                </Link>
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* ═══ Interactive Animated Stat Orbs ═══ */}
      <motion.div
        className="relative z-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 mt-6 pt-6 border-t border-prevu-surface-light/50"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {statCards.map((stat) => {
          const StatIcon = stat.icon
          const fillPct = stat.value > 0 ? Math.min(100, Math.max(12, Math.round((stat.value / maxBarRef) * 100))) : 0

          return (
            <motion.button
              key={stat.label}
              type="button"
              onClick={() => jumpToWorkspaceTab(stat.targetTab)}
              variants={fadeUpItem}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 420, damping: 22 } }}
              whileTap={{ scale: 0.98 }}
              className={`group/stat text-left p-4 rounded-2xl border border-prevu-surface-light/80 bg-prevu-bg/55 backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] ${stat.glowBorder} hover:bg-prevu-surface/80 transition-all cursor-pointer shadow-md hover:shadow-xl`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-prevu-text-muted group-hover/stat:text-prevu-text transition-colors">
                  {stat.label}
                </span>
                <span className={`w-6 h-6 rounded-lg border flex items-center justify-center ${stat.iconBg}`}>
                  <StatIcon className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="flex items-baseline justify-between">
                <div className={`text-2xl sm:text-[1.65rem] font-black font-mono leading-none ${stat.color}`}>
                  <AnimatedCounter value={stat.value} />
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-prevu-text-muted opacity-0 -translate-x-1 translate-y-1 group-hover/stat:opacity-100 group-hover/stat:translate-x-0 group-hover/stat:translate-y-0 transition-all" />
              </div>

              <div className={`text-[10px] ${stat.subColor} mt-1.5 font-medium`}>{stat.sub}</div>

              {/* Animated mini progress bar */}
              <div className="mt-2.5 h-1 rounded-full bg-prevu-surface-light/80 overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${stat.barColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${fillPct}%` }}
                  transition={{ delay: 0.45, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </motion.button>
          )
        })}
      </motion.div>
    </motion.section>
  )
}
