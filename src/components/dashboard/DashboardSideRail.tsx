'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen,
  Bookmark,
  Zap,
  HelpCircle,
  Upload,
  Target,
  GraduationCap,
  ChevronRight,
  Compass,
  Sparkles
} from 'lucide-react'
import ExamCountdownWidget from './ExamCountdownWidget'
import AcademicCalendarModal from './AcademicCalendarModal'
import ExamBlueprintModal from './ExamBlueprintModal'
import LottieBadge from '@/components/ui/kinetic/LottieBadge'

export type DashboardTabType = 'browse' | 'saved' | 'cbt-history' | 'requests' | 'my-uploads'

interface DashboardSideRailProps {
  activeTab: DashboardTabType
  onTabChange: (tab: DashboardTabType) => void
  userSem: number
  counts: {
    browse: number
    saved: number
    cbt: number
    requests: number
    uploads: number
  }
}

export default function DashboardSideRail({
  activeTab,
  onTabChange,
  userSem,
  counts
}: DashboardSideRailProps) {
  const navItems: {
    id: DashboardTabType
    label: string
    icon: React.ComponentType<{ className?: string }>
    count: number
    accentColor: string
  }[] = [
    { id: 'browse', label: 'Study Hub', icon: BookOpen, count: counts.browse, accentColor: 'text-emerald-400' },
    { id: 'saved', label: 'Saved Papers', icon: Bookmark, count: counts.saved, accentColor: 'text-amber-400' },
    { id: 'cbt-history', label: 'CBT Mock Records', icon: Zap, count: counts.cbt, accentColor: 'text-cyan-400' },
    { id: 'requests', label: 'Paper Requests', icon: HelpCircle, count: counts.requests, accentColor: 'text-purple-400' },
    { id: 'my-uploads', label: 'My Contributions', icon: Upload, count: counts.uploads, accentColor: 'text-prevu-accent' },
  ]

  return (
    <motion.aside
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="hidden lg:flex flex-col gap-4 w-[272px] xl:w-[288px] shrink-0 sticky top-20 self-start"
    >
      {/* 1. Workspace Navigation Card */}
      <div className="p-3.5 rounded-2xl bg-prevu-surface/65 border border-prevu-surface-light backdrop-blur-xl shadow-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] space-y-2.5">
        <div className="px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-prevu-text-muted">
            <LottieBadge variant="pulse-orb" size={15} />
            <span>Workspace</span>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-prevu-bg/80 text-prevu-text-muted border border-prevu-surface-light/80">
            SEM {userSem}
          </span>
        </div>

        <nav className="space-y-1" aria-label="Dashboard workspace sections">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id

            return (
              <motion.button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                whileHover={{ x: isActive ? 0 : 4 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                className={`relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'text-white'
                    : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="side-rail-active-pill"
                    transition={{ type: 'spring', stiffness: 360, damping: 28 }}
                    className="absolute inset-0 rounded-xl bg-prevu-accent/20 border border-prevu-accent/40 shadow-md shadow-prevu-accent/10"
                  />
                )}

                <span className="relative z-10 flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? item.accentColor : 'text-prevu-text-muted'}`} />
                  <span>{item.label}</span>
                </span>

                {item.count > 0 && (
                  <span
                    className={`relative z-10 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-prevu-accent text-white'
                        : 'bg-prevu-bg/80 text-prevu-text-muted border border-prevu-surface-light'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </motion.button>
            )
          })}
        </nav>
      </div>

      {/* 2. Compact Exam Countdown */}
      <ExamCountdownWidget semester={userSem} compact />

      {/* 3. Quick Academic Tools Card */}
      <div className="p-3.5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light backdrop-blur-xl shadow-lg space-y-2.5">
        <div className="px-1 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.2em] text-prevu-text-muted">
          <Sparkles className="w-3 h-3 text-prevu-accent" />
          <span>Quick Tools</span>
        </div>

        <div className="space-y-1.5">
          <Link
            href="/exam-prep"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-prevu-bg/60 hover:bg-prevu-surface-light/60 border border-prevu-surface-light/70 hover:border-cyan-500/40 text-xs font-semibold text-prevu-text transition-all group"
          >
            <span className="flex items-center gap-2">
              <Target className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Exam Prep</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-prevu-text-muted group-hover:text-cyan-300 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/subjects"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-prevu-bg/60 hover:bg-prevu-surface-light/60 border border-prevu-surface-light/70 hover:border-prevu-accent/40 text-xs font-semibold text-prevu-text transition-all group"
          >
            <span className="flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-prevu-accent group-hover:scale-110 transition-transform" />
              <span>Subject Catalog</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-prevu-text-muted group-hover:text-prevu-accent group-hover:translate-x-0.5 transition-all" />
          </Link>

          <Link
            href="/cbt"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-prevu-bg/60 hover:bg-prevu-surface-light/60 border border-prevu-surface-light/70 hover:border-amber-500/40 text-xs font-semibold text-prevu-text transition-all group"
          >
            <span className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
              <span>CBT Practice Arena</span>
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-prevu-text-muted group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all" />
          </Link>

          <AcademicCalendarModal semester={userSem} compact />
          <ExamBlueprintModal semester={userSem} compact />
        </div>
      </div>
    </motion.aside>
  )
}
