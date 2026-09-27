'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Calendar, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  BookOpen, 
  FileText, 
  Flame, 
  Edit3, 
  Check, 
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export interface SubjectScheduleItem {
  id: number
  code: string
  name: string
  semester: number
  examType: 'MST1' | 'MST2' | 'EST'
  examDate: string // YYYY-MM-DD
  examTime: string // e.g. "09:30 AM"
}

interface PersonalDateSheetPlannerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subjects: any[]
  defaultSemester?: number
  onOpenFlashcards?: (subjectCode: string, subjectName: string) => void
}

export default function PersonalDateSheetPlanner({
  subjects,
  defaultSemester = 3,
  onOpenFlashcards
}: PersonalDateSheetPlannerProps) {
  const [selectedSem, setSelectedSem] = useState<number>(defaultSemester)
  const [schedule, setSchedule] = useState<SubjectScheduleItem[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDate, setEditDate] = useState<string>('')
  const [now, setNow] = useState<Date>(new Date())

  // Ticking clock for real-time countdown updates
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Load or generate initial schedule for the semester
  useEffect(() => {
    const storageKey = `prevu_datesheet_sem_${selectedSem}`
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setSchedule(JSON.parse(saved))
        return
      } catch {
        // fallback
      }
    }

    // Generate intelligent default dates (upcoming MST schedule)
    const semSubjects = subjects.filter(s => s.semester === selectedSem)
    const today = new Date()

    const generated: SubjectScheduleItem[] = semSubjects.map((sub, idx) => {
      const examDay = new Date(today)
      // Stagger exams across next few days
      examDay.setDate(today.getDate() + (idx * 2) + 2)
      const dateStr = examDay.toISOString().split('T')[0]

      return {
        id: sub.id,
        code: sub.code || `SUB${sub.id}`,
        name: sub.name,
        semester: sub.semester,
        examType: 'MST1',
        examDate: dateStr,
        examTime: idx % 2 === 0 ? '09:30 AM' : '01:30 PM'
      }
    })

    setSchedule(generated)
  }, [selectedSem, subjects])

  // Save changes
  const saveSchedule = (newSchedule: SubjectScheduleItem[]) => {
    setSchedule(newSchedule)
    localStorage.setItem(`prevu_datesheet_sem_${selectedSem}`, JSON.stringify(newSchedule))
  }

  const handleUpdateDate = (id: number) => {
    if (!editDate) {
      setEditingId(null)
      return
    }
    const updated = schedule.map(item => item.id === id ? { ...item, examDate: editDate } : item)
    saveSchedule(updated)
    setEditingId(null)
    setEditDate('')
  }

  // Calculate remaining time
  const getCountdown = (dateStr: string) => {
    const examTarget = new Date(`${dateStr}T09:30:00`)
    const diffMs = examTarget.getTime() - now.getTime()

    if (diffMs <= 0) {
      return { text: 'Concluded / In Progress', status: 'done', days: 0, hours: 0 }
    }

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days === 0 && hours < 24) {
      return { text: `${hours}h left`, status: 'urgent', days, hours }
    } else if (days < 3) {
      return { text: `${days}d ${hours}h left`, status: 'warning', days, hours }
    } else {
      return { text: `${days} days left`, status: 'upcoming', days, hours }
    }
  }

  // Sorted by nearest exam date
  const sortedSchedule = [...schedule].sort((a, b) => new Date(a.examDate).getTime() - new Date(b.examDate).getTime())

  return (
    <div className="bg-prevu-surface/80 border border-prevu-surface-light rounded-3xl p-5 sm:p-7 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-prevu-surface-light">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-prevu-accent/15 border border-prevu-accent/30 flex items-center justify-center text-prevu-accent">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>Personal Exam Date Sheet & Planner</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-prevu-accent/20 text-prevu-accent uppercase">
                Live
              </span>
            </h3>
            <p className="text-xs text-prevu-text-muted">
              Track upcoming MST/EST dates, set reminders, and jump straight to relevant papers.
            </p>
          </div>
        </div>

        {/* Semester Selector */}
        <div className="flex items-center gap-1.5 bg-prevu-bg/80 border border-prevu-surface-light p-1 rounded-xl text-xs overflow-x-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              className={`px-3 py-1 rounded-lg font-mono font-bold transition-all ${
                selectedSem === sem 
                  ? 'bg-prevu-accent text-white shadow-sm' 
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>
      </div>

      {/* Date Sheet Timeline Cards */}
      {sortedSchedule.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedSchedule.map((item) => {
            const countdown = getCountdown(item.examDate)
            const isEditing = editingId === item.id

            return (
              <div 
                key={item.id}
                className={`rounded-2xl p-4 border flex flex-col justify-between transition-all duration-300 ${
                  countdown.status === 'urgent'
                    ? 'bg-gradient-to-br from-rose-950/25 via-prevu-surface to-prevu-surface border-rose-500/40 shadow-lg shadow-rose-950/20'
                    : countdown.status === 'warning'
                    ? 'bg-gradient-to-br from-amber-950/20 via-prevu-surface to-prevu-surface border-amber-500/40'
                    : 'bg-prevu-surface border-prevu-surface-light hover:border-prevu-accent/40'
                }`}
              >
                <div>
                  {/* Top Bar with Badge & Countdown */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-prevu-bg border border-prevu-surface-light text-prevu-accent">
                      {item.code}
                    </span>

                    <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      countdown.status === 'urgent'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse'
                        : countdown.status === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-prevu-bg text-prevu-text-muted border border-prevu-surface-light'
                    }`}>
                      <Clock className="w-3 h-3" />
                      {countdown.text}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-2 leading-snug line-clamp-1">
                    {item.name}
                  </h4>

                  {/* Exam Date & Time with inline edit */}
                  <div className="text-xs text-prevu-text-muted flex items-center justify-between mb-4 bg-prevu-bg/60 p-2 rounded-xl border border-prevu-surface-light/80">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5 w-full">
                        <input
                          type="date"
                          defaultValue={item.examDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="bg-prevu-surface border border-prevu-surface-light text-xs text-white p-1 rounded-lg w-full"
                        />
                        <button
                          onClick={() => handleUpdateDate(item.id)}
                          className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-mono">
                          📅 {new Date(item.examDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', weekday: 'short' })} • {item.examTime}
                        </span>
                        <button
                          onClick={() => { setEditingId(item.id); setEditDate(item.examDate); }}
                          className="text-prevu-text-muted hover:text-white p-1"
                          title="Edit Exam Date"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick Action Shortcuts */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-prevu-surface-light/60">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-[11px] h-8 px-2 border-prevu-surface-light hover:border-prevu-accent/50"
                    asChild
                  >
                    <Link href={`/subject/${encodeURIComponent(item.code)}`}>
                      <BookOpen className="w-3 h-3 mr-1 text-prevu-accent" /> Subject Hub
                    </Link>
                  </Button>

                  {onOpenFlashcards ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onOpenFlashcards(item.code, item.name)}
                      className="text-[11px] h-8 px-2 border-amber-500/30 text-amber-300 hover:bg-amber-500/10"
                    >
                      <Flame className="w-3 h-3 mr-1 text-amber-400" /> Flashcards
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[11px] h-8 px-2 border-prevu-surface-light hover:border-prevu-accent/50"
                      asChild
                    >
                      <Link href={`/browse?subject=${item.id}&type=1`}>
                        <FileText className="w-3 h-3 mr-1 text-purple-400" /> Papers
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-10 text-prevu-text-muted text-xs">
          No subjects found for Semester {selectedSem}.
        </div>
      )}
    </div>
  )
}
