'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BookOpen, FileText, Sparkles, Target, Layers } from 'lucide-react'

interface Subject {
  id: number
  name: string
  code: string
  semester?: number
  year?: number
}

interface CourseWorkspaceDeckProps {
  subjects: Subject[]
  currentSem?: number
  currentSubject?: number
  currentType?: number
}

export default function CourseWorkspaceDeck({
  subjects,
  currentSem,
  currentSubject,
}: CourseWorkspaceDeckProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  // Filter subjects matching current semester if one is selected, else show first 8
  const semesterSubjects = currentSem
    ? subjects.filter((s) => s.semester === currentSem)
    : subjects

  const handleSelectSubject = (subjectId?: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')

    if (!subjectId) {
      params.delete('subject')
    } else {
      params.set('subject', String(subjectId))
    }

    startTransition(() => {
      router.push(`/browse?${params.toString()}`)
    })
  }

  if (semesterSubjects.length === 0) return null

  return (
    <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light shadow-lg">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-prevu-accent" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            {currentSem ? `Semester ${currentSem} Course Deck` : 'Curriculum Courses'}
          </span>
          <span className="text-[10px] text-prevu-text-muted bg-prevu-bg px-2 py-0.5 rounded-full border border-prevu-surface-light">
            {semesterSubjects.length} subjects
          </span>
        </div>

        {currentSubject && (
          <button
            onClick={() => handleSelectSubject(undefined)}
            className="text-[11px] text-prevu-accent hover:underline cursor-pointer font-medium"
          >
            Show All Courses
          </button>
        )}
      </div>

      {/* Horizontal scrollable subject chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {/* All Subjects Chip */}
        <button
          onClick={() => handleSelectSubject(undefined)}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
            !currentSubject
              ? 'bg-prevu-accent text-white border-prevu-accent shadow-sm shadow-purple-600/30'
              : 'bg-prevu-bg text-prevu-text-muted hover:text-white border-prevu-surface-light hover:border-prevu-surface-light/80'
          }`}
        >
          All Subjects
        </button>

        {semesterSubjects.map((s) => {
          const isSelected = currentSubject === s.id
          return (
            <button
              key={s.id}
              onClick={() => handleSelectSubject(s.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer border flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-prevu-accent text-white font-bold border-prevu-accent shadow-sm shadow-purple-600/30'
                  : 'bg-prevu-bg text-prevu-text-muted hover:text-white border-prevu-surface-light hover:border-prevu-accent/30'
              }`}
            >
              <span className="font-mono text-[10px] opacity-75">{s.code}</span>
              <span className="font-medium truncate max-w-[150px] sm:max-w-[200px]">{s.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
