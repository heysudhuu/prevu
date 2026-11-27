'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Clock, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import BorderBeam from '@/components/ui/kinetic/BorderBeam'
import LottieBadge from '@/components/ui/kinetic/LottieBadge'

export interface AcademicMilestone {
  id: string
  name: string
  code: 'IST1' | 'IST2' | 'EST' | 'PRACTICAL' | 'RESULT' | 'BREAK' | 'OTHER'
  badge: string
  startDate: Date
  endDate?: Date
  description: string
  color: 'amber' | 'violet' | 'emerald' | 'cyan' | 'rose' | 'orange'
  practiceExamType?: 'MST1' | 'MST2' | 'EST'
}

export const CU_CALENDAR_EVENTS: AcademicMilestone[] = [
  {
    id: 'ist-1',
    name: 'In Semester Test 1 (IST-1 / MST-1)',
    code: 'IST1',
    badge: 'MST 1 Test Week',
    startDate: new Date('2026-08-24T09:30:00'),
    endDate: new Date('2026-08-29T17:00:00'),
    description: 'Units 1 & 2 • 30 Marks Internal Assessment for All Years',
    color: 'amber',
    practiceExamType: 'MST1'
  },
  {
    id: 'practical-ist',
    name: 'Practical IST (All Years)',
    code: 'PRACTICAL',
    badge: 'Lab Evaluation',
    startDate: new Date('2026-09-28T09:30:00'),
    endDate: new Date('2026-10-03T17:00:00'),
    description: 'Lab practicals, file evaluation, and viva across all courses',
    color: 'cyan'
  },
  {
    id: 'ist-2',
    name: 'In Semester Test 2 (IST-2 / MST-2)',
    code: 'IST2',
    badge: 'MST 2 Test Week',
    startDate: new Date('2026-10-12T09:30:00'),
    endDate: new Date('2026-10-17T17:00:00'),
    description: 'Units 3 & 4 • Final internal assessment for Semester grade',
    color: 'violet',
    practiceExamType: 'MST2'
  },
  {
    id: 'diwali-break',
    name: 'Diwali Festive Break',
    code: 'BREAK',
    badge: 'Student Vacation',
    startDate: new Date('2026-11-09T00:00:00'),
    endDate: new Date('2026-11-11T23:59:59'),
    description: 'Official Diwali vacation recess for all students',
    color: 'rose'
  },
  {
    id: 'end-sem-practical',
    name: 'End Sem Practical Exams & Project Review',
    code: 'PRACTICAL',
    badge: 'Final Practicals',
    startDate: new Date('2026-11-16T09:30:00'),
    endDate: new Date('2026-11-21T17:00:00'),
    description: 'End-term practical exams, external viva & capstone project evaluation',
    color: 'cyan'
  },
  {
    id: 'end-sem-theory',
    name: 'End Sem Theory Exams (EST) Regular & Reappear',
    code: 'EST',
    badge: 'Final EST Examination',
    startDate: new Date('2026-11-23T09:30:00'),
    endDate: new Date('2026-12-19T17:00:00'),
    description: '100% Comprehensive Syllabus Final Examination for All Years',
    color: 'emerald',
    practiceExamType: 'EST'
  },
  {
    id: 'results',
    name: 'Announcement of Semester Results',
    code: 'RESULT',
    badge: 'CUIMS Result',
    startDate: new Date('2027-01-02T10:00:00'),
    description: 'Semester SGPA / CGPA result publication on CUIMS portal',
    color: 'orange'
  }
]

export default function ExamCountdownWidget({ semester = 1, compact = false }: { semester?: number; compact?: boolean }) {
  const [now, setNow] = useState<Date | null>(null)
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  useEffect(() => {
    setNow(new Date())
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const currentNow = now ?? new Date('2026-11-27T00:00:00')

  // Find next upcoming milestone or ongoing milestone
  const upcomingEvents = CU_CALENDAR_EVENTS.filter(e => {
    const end = e.endDate ? e.endDate.getTime() : e.startDate.getTime()
    return end >= currentNow.getTime()
  })

  const currentOrNextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : CU_CALENDAR_EVENTS[CU_CALENDAR_EVENTS.length - 1]
  const activeEvent = selectedEventId 
    ? (CU_CALENDAR_EVENTS.find(e => e.id === selectedEventId) || currentOrNextEvent)
    : currentOrNextEvent

  const activeIdx = CU_CALENDAR_EVENTS.findIndex(e => e.id === activeEvent.id)
  const stepMilestone = (dir: -1 | 1) => {
    const nextIdx = (activeIdx + dir + CU_CALENDAR_EVENTS.length) % CU_CALENDAR_EVENTS.length
    setSelectedEventId(CU_CALENDAR_EVENTS[nextIdx].id)
  }

  const isOngoing = Boolean(now && activeEvent.endDate && currentNow >= activeEvent.startDate && currentNow <= activeEvent.endDate)
  const targetTime = isOngoing && activeEvent.endDate ? activeEvent.endDate.getTime() : activeEvent.startDate.getTime()
  
  const diffMs = now ? Math.max(0, targetTime - currentNow.getTime()) : 0
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
  const seconds = Math.floor((diffMs / 1000) % 60)

  // ─── Compact Sidebar Variant ─────────────────────────────────────
  if (compact) {
    const pad = (n: number) => String(n).padStart(2, '0')
    return (
      <div className="p-4 rounded-2xl bg-prevu-surface/65 border border-prevu-surface-light backdrop-blur-xl space-y-3 shadow-lg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)] relative overflow-hidden">
        <BorderBeam duration={11} colorFrom="#238636" colorTo="#38bdf8" borderWidth={1} />
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-prevu-accent/10 blur-2xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.16em] text-prevu-accent font-bold">
            <LottieBadge variant="radar" size={16} />
            <span>Exam Radar</span>
          </div>
          <div className="flex items-center gap-1">
            {isOngoing && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse mr-1">
                ● LIVE
              </span>
            )}
            <button
              type="button"
              onClick={() => stepMilestone(-1)}
              aria-label="Previous milestone"
              className="p-1 rounded-lg bg-prevu-bg/70 hover:bg-prevu-surface-light border border-prevu-surface-light/60 text-prevu-text-muted hover:text-white transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => stepMilestone(1)}
              aria-label="Next milestone"
              className="p-1 rounded-lg bg-prevu-bg/70 hover:bg-prevu-surface-light border border-prevu-surface-light/60 text-prevu-text-muted hover:text-white transition-colors cursor-pointer"
            >
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeEvent.id}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="space-y-0.5"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/25">
                {activeEvent.code}
              </span>
              <span className="text-xs font-bold text-white line-clamp-1" title={activeEvent.name}>
                {activeEvent.name.split('(')[0].trim()}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-4 gap-1.5 text-center">
          <div className="p-2 rounded-xl bg-prevu-bg/85 border border-prevu-surface-light/70 shadow-inner">
            <div className="text-base font-black font-mono text-white leading-none">{now ? pad(days) : '--'}</div>
            <div className="text-[8px] text-prevu-text-muted uppercase mt-1 tracking-wider">Days</div>
          </div>
          <div className="p-2 rounded-xl bg-prevu-bg/85 border border-prevu-surface-light/70 shadow-inner">
            <div className="text-base font-black font-mono text-white leading-none">{now ? pad(hours) : '--'}</div>
            <div className="text-[8px] text-prevu-text-muted uppercase mt-1 tracking-wider">Hrs</div>
          </div>
          <div className="p-2 rounded-xl bg-prevu-bg/85 border border-prevu-surface-light/70 shadow-inner">
            <div className="text-base font-black font-mono text-white leading-none">{now ? pad(minutes) : '--'}</div>
            <div className="text-[8px] text-prevu-text-muted uppercase mt-1 tracking-wider">Min</div>
          </div>
          <div className="p-2 rounded-xl bg-prevu-bg/85 border border-prevu-accent/30 shadow-inner overflow-hidden">
            <motion.div
              key={now ? seconds : 'init'}
              initial={{ y: -4, opacity: 0.6 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.18 }}
              className="text-base font-black font-mono text-prevu-accent leading-none"
            >
              {now ? pad(seconds) : '--'}
            </motion.div>
            <div className="text-[8px] text-prevu-text-muted uppercase mt-1 tracking-wider">Sec</div>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-prevu-text-muted">
          <span>
            📅 {activeEvent.startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
            {activeEvent.endDate ? ` – ${activeEvent.endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}` : ''}
          </span>
          <span className="text-prevu-text-muted/70">{activeIdx + 1}/{CU_CALENDAR_EVENTS.length}</span>
        </div>

        {activeEvent.practiceExamType && (
          <Link
            href={`/browse?sem=${semester}&type=${activeEvent.practiceExamType}`}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl bg-prevu-accent/15 hover:bg-prevu-accent/25 text-prevu-accent text-xs font-bold transition-all border border-prevu-accent/25 group"
          >
            <span>Solve {activeEvent.practiceExamType} Papers</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    )
  }

  return (
    <Card className="border-prevu-surface-light bg-gradient-to-br from-prevu-surface via-prevu-surface/90 to-prevu-surface shadow-2xl relative overflow-hidden">
      {/* Dynamic Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />
      
      <CardHeader className="pb-3 border-b border-prevu-surface-light/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-prevu-accent text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4 text-prevu-accent" />
            <span>Chandigarh University Academic Schedule 2026-27</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-purple-300 bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 rounded-full font-semibold">
              Official Session 2026-27 • v1.3
            </span>
          </div>
        </div>

        <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Badge variant="stamp" className="font-mono text-xs font-bold">
                {activeEvent.badge}
              </Badge>
              {isOngoing && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                  ● Happening Now
                </span>
              )}
            </div>
            <CardTitle className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {activeEvent.name}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        
        {/* Countdown Digits Grid */}
        <div className="grid grid-cols-4 gap-2.5 sm:gap-3 text-center">
          
          <div className="p-3 sm:p-4 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light shadow-inner group">
            <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white">{days}</div>
            <div className="text-[10px] sm:text-xs text-prevu-text-muted uppercase tracking-wider font-semibold mt-1">Days</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light shadow-inner">
            <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white">{hours}</div>
            <div className="text-[10px] sm:text-xs text-prevu-text-muted uppercase tracking-wider font-semibold mt-1">Hours</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light shadow-inner">
            <div className="text-2xl sm:text-4xl font-extrabold font-mono text-white">{minutes}</div>
            <div className="text-[10px] sm:text-xs text-prevu-text-muted uppercase tracking-wider font-semibold mt-1">Mins</div>
          </div>

          <div className="p-3 sm:p-4 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light shadow-inner">
            <div className="text-2xl sm:text-4xl font-extrabold font-mono text-prevu-accent">{seconds}</div>
            <div className="text-[10px] sm:text-xs text-prevu-text-muted uppercase tracking-wider font-semibold mt-1">Secs</div>
          </div>

        </div>

        {/* Milestone Description & Action Strip */}
        <div className="p-4 rounded-2xl bg-prevu-bg/70 border border-prevu-surface-light/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-white">{activeEvent.description}</div>
            <div className="text-[11px] font-mono text-prevu-text-muted">
              📅 Date: {activeEvent.startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              {activeEvent.endDate ? ` — ${activeEvent.endDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}` : ''}
            </div>
          </div>

          {activeEvent.practiceExamType && (
            <Link 
              href={`/browse?sem=${semester}&type=${activeEvent.practiceExamType}`}
              className="shrink-0 px-4 py-2 rounded-xl bg-prevu-accent text-white hover:bg-purple-600 shadow-lg shadow-prevu-accent/25 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Solve {activeEvent.practiceExamType} Papers</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* Upcoming CU Milestones Quick Timeline Picker */}
        <div className="space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-prevu-text-muted flex items-center justify-between">
            <span>Official Semester Exam Timeline</span>
            <span className="text-[10px] text-prevu-accent font-medium">Click any milestone to inspect</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {CU_CALENDAR_EVENTS.map((event) => {
              const isEventSelected = (selectedEventId === event.id) || (!selectedEventId && currentOrNextEvent.id === event.id)
              const isPast = event.endDate ? currentNow > event.endDate : currentNow > event.startDate

              return (
                <button
                  key={event.id}
                  onClick={() => setSelectedEventId(event.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isEventSelected 
                      ? 'bg-prevu-accent/20 border-prevu-accent text-white shadow-md shadow-prevu-accent/15' 
                      : isPast
                      ? 'bg-prevu-surface/40 border-prevu-surface-light/40 text-prevu-text-muted opacity-70 hover:opacity-100'
                      : 'bg-prevu-surface/70 border-prevu-surface-light hover:border-prevu-surface-light/80 text-prevu-text'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span className="font-bold">{event.code}</span>
                    {isPast && <span className="text-emerald-400">✓ Done</span>}
                  </div>
                  <div className="text-xs font-semibold truncate" title={event.name}>
                    {event.name.split('(')[0]}
                  </div>
                  <div className="text-[10px] text-prevu-text-muted mt-0.5">
                    {event.startDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
