'use client'

import { useState, useEffect } from 'react'
import { 
  Brain, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  BookOpen, 
  ArrowRight, 
  RotateCcw,
  Target,
  Trophy,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface StudyDay {
  dayNumber: number
  date: string
  focus: string
  tasks: { id: string; text: string; completed: boolean; pyqType: string }[]
}

interface SavedPlan {
  examName: string
  examDate: string
  semester: number
  hoursPerDay: number
  days: StudyDay[]
  createdDate: string
}

const DEFAULT_SUBJECTS = [
  'Data Structures & Algorithms (21CSH-201)',
  'Operating Systems (21CSH-202)',
  'Database Management Systems (21CSH-203)',
  'Computer Networks (21CSH-204)',
  'Discrete Mathematical Structures (21CSH-205)'
]

export default function SmartStudyPlanner() {
  const [examType, setExamType] = useState<'MST1' | 'MST2' | 'EST'>('MST1')
  const [semester, setSemester] = useState<number>(4)
  const [examDate, setExamDate] = useState<string>('2026-10-12')
  const [hoursPerDay, setHoursPerDay] = useState<number>(3)
  const [activePlan, setActivePlan] = useState<SavedPlan | null>(null)

  // Load saved plan
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prevu_study_planner_plan')
      if (saved) {
        setActivePlan(JSON.parse(saved))
      }
    } catch {
      // ignore
    }
  }, [])

  const generatePlan = () => {
    const today = new Date()
    const target = new Date(examDate)
    const diffMs = target.getTime() - today.getTime()
    const diffDays = Math.max(2, Math.min(21, Math.ceil(diffMs / (1000 * 60 * 60 * 24))))

    const generatedDays: StudyDay[] = []

    for (let i = 1; i <= diffDays; i++) {
      const dayDate = new Date(today)
      dayDate.setDate(today.getDate() + (i - 1))
      const dateStr = dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })

      let focus = ''
      const tasks = []

      if (i === 1) {
        focus = 'Syllabus Blueprint & Core Concept Refresher'
        tasks.push(
          { id: `d${i}-1`, text: `Solve Unit 1 high-yield 5-mark theory questions (${examType})`, completed: false, pyqType: 'Theory' },
          { id: `d${i}-2`, text: 'Review 2024 previous year question paper Section A', completed: false, pyqType: 'PYQ 2024' },
          { id: `d${i}-3`, text: 'Bookmark formula sheet formulas & definitions', completed: false, pyqType: 'Formulae' }
        )
      } else if (i === diffDays) {
        focus = 'Exam Eve High-Yield Cramming & Quick Flashcards'
        tasks.push(
          { id: `d${i}-1`, text: 'Revise frequently repeated 10-mark questions from 2022-2025', completed: false, pyqType: 'Repeated Qs' },
          { id: `d${i}-2`, text: 'Quick formula recap & algorithm time complexities', completed: false, pyqType: 'Formulae' },
          { id: `d${i}-3`, text: 'Review all questions marked as "Revisit" in Offline Vault', completed: false, pyqType: 'Vault Review' }
        )
      } else if (i === diffDays - 1) {
        focus = 'Full Timed Mock Exam Practice'
        tasks.push(
          { id: `d${i}-1`, text: `Complete a 90-minute timed mock test for ${examType} under exam conditions`, completed: false, pyqType: 'Mock Exam' },
          { id: `d${i}-2`, text: 'Self-evaluate answer markings against verified solutions', completed: false, pyqType: 'Evaluation' }
        )
      } else {
        const unit = (i % 3) + 1
        focus = `Unit ${unit} Deep Dive & Numerical Solving Drill`
        tasks.push(
          { id: `d${i}-1`, text: `Solve 4 numerical/coding questions from Unit ${unit} (${examType})`, completed: false, pyqType: 'Numericals' },
          { id: `d${i}-2`, text: `Attempt 2023 & 2025 question papers Section B & C`, completed: false, pyqType: 'PYQ Drill' },
          { id: `d${i}-3`, text: `Clear any doubts on discussion board or check solution hints`, completed: false, pyqType: 'Doubts' }
        )
      }

      generatedDays.push({
        dayNumber: i,
        date: dateStr,
        focus,
        tasks
      })
    }

    const newPlan: SavedPlan = {
      examName: `${examType} Final Revision`,
      examDate,
      semester,
      hoursPerDay,
      days: generatedDays,
      createdDate: new Date().toISOString()
    }

    setActivePlan(newPlan)
    try {
      localStorage.setItem('prevu_study_planner_plan', JSON.stringify(newPlan))
    } catch {
      // ignore
    }
  }

  const toggleTask = (dayNum: number, taskId: string) => {
    if (!activePlan) return
    const updated = {
      ...activePlan,
      days: activePlan.days.map(day => {
        if (day.dayNumber === dayNum) {
          return {
            ...day,
            tasks: day.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
          }
        }
        return day
      })
    }
    setActivePlan(updated)
    try {
      localStorage.setItem('prevu_study_planner_plan', JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const resetPlan = () => {
    if (window.confirm('Reset this revision plan and build a new one?')) {
      setActivePlan(null)
      localStorage.removeItem('prevu_study_planner_plan')
    }
  }

  // Calculate completion stats
  let totalTasks = 0
  let completedTasks = 0
  if (activePlan) {
    activePlan.days.forEach(d => {
      d.tasks.forEach(t => {
        totalTasks++
        if (t.completed) completedTasks++
      })
    })
  }
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8 animate-fade-in">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
          <Brain className="w-3.5 h-3.5" />
          <span>AI-Powered Revision Engine</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Smart Exam Study Planner
        </h1>

        <p className="text-sm text-prevu-text-muted leading-relaxed">
          Input your Chandigarh University exam date, and Prevu auto-generates a day-by-day revision syllabus targeting high-yield previous year questions.
        </p>
      </div>

      {!activePlan ? (
        /* Planner Configuration Form */
        <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light shadow-2xl space-y-6">
          <div className="space-y-4">
            
            {/* Exam Format */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                Exam Format
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['MST1', 'MST2', 'EST'] as const).map(fmt => (
                  <button
                    key={fmt}
                    onClick={() => setExamType(fmt)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      examType === fmt
                        ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/30'
                        : 'bg-prevu-bg/70 border-prevu-surface-light text-prevu-text-muted hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>

            {/* Semester & Target Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-prevu-text-muted mb-2">
                  Semester
                </label>
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-prevu-bg/70 border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s} (BE-CSE)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-prevu-text-muted mb-2">
                  Exam Start Date
                </label>
                <input
                  type="date"
                  value={examDate}
                  onChange={(e) => setExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-prevu-bg/70 border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Hours Per Day */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-prevu-text-muted mb-2">
                Daily Study Hours Available: <span className="text-white font-mono">{hoursPerDay} hrs/day</span>
              </label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full accent-purple-600"
              />
              <div className="flex justify-between text-[10px] text-prevu-text-muted font-mono mt-1">
                <span>1 hr (Light)</span>
                <span>4 hrs (Target 8.5+ CGPA)</span>
                <span>8 hrs (Intensive Cram)</span>
              </div>
            </div>

          </div>

          <Button
            size="lg"
            onClick={generatePlan}
            className="w-full text-sm font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-600/30"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate My Revision Schedule
          </Button>
        </div>
      ) : (
        /* Active Study Plan Dashboard */
        <div className="space-y-6">
          
          {/* Progress Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/40 via-prevu-surface to-indigo-950/40 border border-purple-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Sem {activePlan.semester} • {activePlan.examName}
                </span>
                <span className="text-xs text-prevu-text-muted">Target: {activePlan.examDate}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {completedTasks}/{totalTasks} Revision Tasks Completed ({completionPercentage}%)
              </h2>
              <p className="text-xs text-prevu-text-muted">
                {activePlan.hoursPerDay} hours daily allocated • Keep your momentum alive!
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={resetPlan}
                className="text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                Reset Plan
              </Button>

              <Button size="sm" asChild className="bg-purple-600 hover:bg-purple-500 text-xs font-bold">
                <Link href="/browse">
                  Browse Exam Papers <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Days Timeline */}
          <div className="space-y-4">
            {activePlan.days.map((day) => {
              const allDone = day.tasks.every(t => t.completed)

              return (
                <div
                  key={day.dayNumber}
                  className={`p-5 rounded-3xl border transition-all ${
                    allDone
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : 'bg-prevu-surface/80 border-prevu-surface-light hover:border-purple-500/30'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-prevu-surface-light/60 pb-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs ${
                        allDone ? 'bg-emerald-500 text-white' : 'bg-purple-500/20 text-purple-300'
                      }`}>
                        D{day.dayNumber}
                      </div>
                      <div>
                        <div className="text-xs font-mono text-prevu-text-muted">{day.date}</div>
                        <h3 className="text-sm font-bold text-white">{day.focus}</h3>
                      </div>
                    </div>

                    {allDone && (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Day Completed!
                      </span>
                    )}
                  </div>

                  {/* Tasks List */}
                  <div className="space-y-2">
                    {day.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTask(day.dayNumber, task.id)}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                          task.completed
                            ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300 line-through opacity-80'
                            : 'bg-prevu-bg/60 border-prevu-surface-light hover:border-purple-500/40 text-prevu-text'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => {}} // handled by parent onClick
                            className="w-4 h-4 rounded border-gray-600 text-purple-600 focus:ring-0 cursor-pointer accent-purple-600"
                          />
                          <span className="text-xs font-medium">{task.text}</span>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-prevu-surface-light text-prevu-text-muted shrink-0">
                          {task.pyqType}
                        </span>
                      </div>
                    ))}
                  </div>

                </div>
              )
            })}
          </div>

        </div>
      )}

    </div>
  )
}
