'use client'

import { useState, useEffect } from 'react'
import { Clock, Calendar, ChevronDown, ChevronUp, Sparkles, BookOpen, Flame } from 'lucide-react'
import Link from 'next/link'

interface ExamEvent {
  id: string
  name: string
  shortName: string
  date: string // ISO string or YYYY-MM-DD
  type: 'IST1' | 'PIST' | 'IST2' | 'PEST' | 'EST'
  color: string
}

// Academic Examination Calendar for Chandigarh University (Odd Sem Jul-Dec 2026) [Version: 1.3]
const UPCOMING_CU_EXAMS: ExamEvent[] = [
  {
    id: 'ist2',
    name: 'In Semester Test 2 (IST-2)',
    shortName: 'IST-2',
    date: '2026-10-12T09:30:00+05:30',
    type: 'IST2',
    color: 'from-purple-500 to-indigo-500 text-purple-300 border-purple-500/30'
  },
  {
    id: 'pest',
    name: 'End Sem. Practical Exam & Project Evaluation',
    shortName: 'Practical EST',
    date: '2026-11-16T09:30:00+05:30',
    type: 'PEST',
    color: 'from-cyan-500 to-blue-500 text-cyan-300 border-cyan-500/30'
  },
  {
    id: 'est',
    name: 'End Sem Theory Exams (EST Final)',
    shortName: 'EST Theory',
    date: '2026-11-23T09:30:00+05:30',
    type: 'EST',
    color: 'from-rose-500 to-pink-500 text-rose-300 border-rose-500/30'
  }
]

// Department of Computer Science & Engineering - Student Guidelines (Jul-Dec 2026)
const CSE_GUIDELINES = [
  { id: 1, title: 'CUIMS Timetable', text: 'Check section and timetable on CUIMS portal before classes.' },
  { id: 2, title: 'Class Blocks', text: 'Classes scheduled in 2 blocks (B3, B4: Level-9). Verify room on CUIMS.' },
  { id: 3, title: 'Main Gate Closing', text: 'Main gate closes daily sharp at 9:25 AM for all students.' },
  { id: 4, title: 'No Late Entry', text: 'No entry once class has started. Reach before commencement.' },
  { id: 5, title: 'ID Card Mandatory', text: 'Must wear university ID card at all times on campus.' },
  { id: 6, title: 'Mobile Phone Policy', text: 'Switch off or deposit mobile in front rack during class.' },
  { id: 7, title: 'No "Head Down"', text: 'No keeping head down during lecture or lab sessions.' },
  { id: 8, title: 'Wednesday Uniform', text: 'Wear official uniform every Wednesday & formals rest of week (₹200 fine).' },
  { id: 9, title: 'WhatsApp Group Rules', text: 'No loose talks in CR or class WhatsApp groups.' },
  { id: 10, title: 'Academic Coordinators', text: 'Contact Mentor/Coordinator for fee, registration or academic queries.' },
]

export default function ExamCountdownTicker() {
  const [mounted, setMounted] = useState(false)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [activeExam, setActiveExam] = useState<ExamEvent>(UPCOMING_CU_EXAMS[0])
  const [showSchedule, setShowSchedule] = useState(false)
  const [activeTab, setActiveTab] = useState<'calendar' | 'guidelines'>('calendar')

  useEffect(() => {
    setMounted(true)
    // Find next upcoming exam
    const now = new Date().getTime()
    const upcoming = UPCOMING_CU_EXAMS.find(e => new Date(e.date).getTime() > now) || UPCOMING_CU_EXAMS[UPCOMING_CU_EXAMS.length - 1]
    setActiveExam(upcoming)

    const updateCountdown = () => {
      const target = new Date(upcoming.date).getTime()
      const current = new Date().getTime()
      const diff = target - current

      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        const seconds = Math.floor((diff / 1000) % 60)
        setTimeLeft({ days, hours, minutes, seconds })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    updateCountdown()
    const timer = setInterval(updateCountdown, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) {
    return (
      <div className="h-7 w-28 rounded-xl bg-prevu-surface/60 border border-purple-500/20" />
    )
  }

  return (
    <div className="relative">
      {/* Ticker Pill */}
      <button
        onClick={() => setShowSchedule(prev => !prev)}
        className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-prevu-surface/90 border border-purple-500/30 hover:border-purple-500/60 shadow-sm transition-all duration-200 cursor-pointer text-xs group"
        title="View Chandigarh University Exam Schedule & Department Guidelines"
      >
        <div className="flex items-center gap-1.5 text-purple-300 font-bold">
          <Clock className="w-3.5 h-3.5 text-purple-400 group-hover:rotate-45 transition-transform" />
          <span className="hidden lg:inline">{activeExam.shortName} in</span>
          <span className="lg:hidden">{activeExam.shortName}:</span>
        </div>

        {/* Live Timer Counter */}
        <div className="flex items-center gap-1 font-mono font-bold text-white text-[11px]">
          <span className="bg-purple-950/70 border border-purple-500/30 px-1.5 py-0.5 rounded text-purple-200">
            {timeLeft.days}d {timeLeft.hours}h
          </span>
        </div>

        {showSchedule ? (
          <ChevronUp className="w-3 h-3 text-prevu-text-muted" />
        ) : (
          <ChevronDown className="w-3 h-3 text-prevu-text-muted" />
        )}
      </button>

      {/* Dropdown Exam Schedule & Guidelines Drawer */}
      {showSchedule && (
        <div 
          className="absolute right-0 top-full mt-2 w-88 rounded-3xl border border-purple-500/30 bg-[#11111a]/98 backdrop-blur-2xl shadow-2xl p-4 z-50 space-y-3 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-prevu-surface-light pb-2.5">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Chandigarh University
                </h4>
                <div className="text-[10px] text-prevu-text-muted">BE-CSE (Jul - Dec 2026 Session)</div>
              </div>
            </div>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded-full border border-purple-500/30">
              v1.3 Official
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-0.5 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light text-xs font-semibold">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeTab === 'calendar'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              📅 Exam Calendar
            </button>
            <button
              onClick={() => setActiveTab('guidelines')}
              className={`flex-1 py-1 rounded-lg text-center transition-all ${
                activeTab === 'guidelines'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              📋 CSE Guidelines
            </button>
          </div>

          {/* TAB 1: ACADEMIC EXAM CALENDAR */}
          {activeTab === 'calendar' ? (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {UPCOMING_CU_EXAMS.map((exam) => {
                const dateStr = new Date(exam.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
                const isCurrent = exam.id === activeExam.id

                return (
                  <div
                    key={exam.id}
                    className={`p-2.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-purple-950/40 border-purple-500/50 shadow-md shadow-purple-500/10'
                        : 'bg-prevu-surface/60 border-prevu-surface-light text-prevu-text-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-white flex items-center gap-1.5">
                        {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />}
                        {exam.name}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-purple-300">
                        {dateStr}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-prevu-text-muted">
                      <span>9:30 AM Shift</span>
                      <Link
                        href={`/browse?search=${exam.shortName}`}
                        onClick={() => setShowSchedule(false)}
                        className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        Revise Papers
                      </Link>
                    </div>
                  </div>
                )
              })}

              {/* Key Milestones */}
              <div className="p-2.5 rounded-2xl border border-prevu-surface-light bg-prevu-surface/40 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-prevu-text-muted">
                  <span>Last Teaching Day</span>
                  <span className="font-mono text-white">13-11-2026</span>
                </div>
                <div className="flex justify-between text-prevu-text-muted">
                  <span>Winter Term</span>
                  <span className="font-mono text-white">15-12-2026 to 28-12-2026</span>
                </div>
                <div className="flex justify-between text-prevu-text-muted">
                  <span>Results Announcement</span>
                  <span className="font-mono text-emerald-400 font-bold">02-01-2027</span>
                </div>
              </div>
            </div>
          ) : (
            /* TAB 2: DEPARTMENT GUIDELINES */
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              <div className="text-[11px] text-purple-300 bg-purple-500/10 border border-purple-500/20 p-2 rounded-xl">
                ⚠️ <strong>Key Reminder:</strong> Gate closes at <strong>9:25 AM</strong>. Uniform mandatory on <strong>Wednesdays</strong> (₹200 fine).
              </div>
              {CSE_GUIDELINES.map((item) => (
                <div key={item.id} className="p-2 rounded-xl bg-prevu-surface/40 border border-prevu-surface-light text-[11px]">
                  <span className="font-bold text-white mr-1.5">{item.id}. {item.title}:</span>
                  <span className="text-prevu-text-muted">{item.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2 border-t border-prevu-surface-light flex items-center justify-between">
            <span className="text-[11px] text-prevu-text-muted flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-yellow-400" />
              <span>Target 8.5+ CGPA</span>
            </span>
            <Link
              href="/exam-prep"
              onClick={() => setShowSchedule(false)}
              className="text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              Open Exam Prep Hub →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
