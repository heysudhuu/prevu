'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Layers, 
  FileText, 
  BookOpen, 
  Video, 
  CheckCircle2, 
  Lightbulb, 
  Sparkles, 
  ExternalLink,
  ArrowRight
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { ResourceCard } from '@/components/ResourceCard'
import { CoverageMatrix, CoveragePaperRecord } from '@/components/ui/CoverageMatrix'
import { getSubjectStudyKit } from '@/lib/data/subject-guides'

export interface ExamPrepSubject {
  id: number
  name: string
  code: string
  semester: number
  year: number
}

interface ExamPrepClientProps {
  subjects: ExamPrepSubject[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialPapers: any[]
  bookmarkIds: string[]
  initialSem?: number
  initialSubjectId?: number
  initialExamType?: string
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]
const EXAM_TYPES = ['MST1', 'MST2', 'EST']

export default function ExamPrepClient({
  subjects,
  initialPapers,
  bookmarkIds,
  initialSem,
  initialSubjectId,
  initialExamType = 'MST1'
}: ExamPrepClientProps) {
  const [selectedSem, setSelectedSem] = useState<number>(initialSem || subjects[0]?.semester || 1)
  
  // Available subjects for the active semester
  const semesterSubjects = useMemo(() => {
    return subjects.filter(s => s.semester === selectedSem)
  }, [subjects, selectedSem])

  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(() => {
    if (initialSubjectId && subjects.some(s => s.id === initialSubjectId && s.semester === (initialSem || 1))) {
      return initialSubjectId
    }
    return semesterSubjects[0]?.id || subjects[0]?.id || 1
  })

  const [selectedExamType, setSelectedExamType] = useState<string>(initialExamType)

  // Keep selected subject in sync when semester switches
  const activeSubject = useMemo(() => {
    return semesterSubjects.find(s => s.id === selectedSubjectId) || semesterSubjects[0] || subjects[0]
  }, [semesterSubjects, selectedSubjectId, subjects])

  // Retrieve study kit for active subject
  const studyKit = useMemo(() => {
    if (!activeSubject) return getSubjectStudyKit('DEFAULT', 'Subject')
    return getSubjectStudyKit(activeSubject.code, activeSubject.name)
  }, [activeSubject])

  // Filter papers for this active subject
  const subjectPapers = useMemo(() => {
    if (!activeSubject) return []
    return initialPapers.filter(p => p.subject_id === activeSubject.id)
  }, [initialPapers, activeSubject])

  // Filter papers for the selected exam format (MST1, MST2, EST)
  const formatPapers = useMemo(() => {
    return subjectPapers.filter(p => {
      const type = (p.exam_types?.name || '').toUpperCase().replace(/[\s-]/g, '')
      const target = selectedExamType.toUpperCase().replace(/[\s-]/g, '')
      return type === target
    })
  }, [subjectPapers, selectedExamType])

  // Coverage records for CoverageMatrix
  const coverageRecords: CoveragePaperRecord[] = useMemo(() => {
    return subjectPapers.map(p => ({
      id: p.id,
      exam_year: p.exam_year,
      examType: p.exam_types?.name || 'MST1',
      original_filename: p.original_filename
    }))
  }, [subjectPapers])

  // Check for custom syllabus units saved for this subject via useSyncExternalStore
  const customSyllabusRaw = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback)
      return () => window.removeEventListener('storage', callback)
    },
    () => {
      if (!activeSubject) return null
      try {
        return localStorage.getItem(`prevu_custom_syllabus_${activeSubject.code}`)
      } catch {
        return null
      }
    },
    () => null
  )

  const customUnits = useMemo<{ unitNumber: number; title: string; topics: string[]; weightage: string }[] | null>(() => {
    if (!customSyllabusRaw) return null
    try {
      const parsed = JSON.parse(customSyllabusRaw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {
      // Ignore
    }
    return null
  }, [customSyllabusRaw])

  // Relevant blueprint units for this exam type
  const relevantUnits = useMemo(() => {
    const units = customUnits || studyKit?.units
    if (!units) return []
    if (selectedExamType === 'MST1') {
      return units.slice(0, 2)
    } else if (selectedExamType === 'MST2') {
      return units.slice(1, 3)
    } else {
      return units
    }
  }, [customUnits, studyKit, selectedExamType])

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Exam Prep Workspace' }
        ]}
        badge={{ text: 'Exam Readiness Hub', variant: 'cyan' }}
        title="Targeted Exam Preparation"
        description="Select your semester, course, and exam format to access verified past papers, university blueprint units, and high-yield scoring advice."
      />

      {/* Selector Control Panel */}
      <div className="p-5 sm:p-6 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-xl space-y-5">
        {/* Step 1: Semester Selector */}
        <div>
          <label className="block text-xs font-mono font-semibold text-prevu-text-muted mb-2 uppercase tracking-wider">
            1. Select Semester
          </label>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {SEMESTERS.map(sem => (
              <button
                key={sem}
                onClick={() => {
                  setSelectedSem(sem)
                  const firstForSem = subjects.find(s => s.semester === sem)
                  if (firstForSem) setSelectedSubjectId(firstForSem.id)
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedSem === sem
                    ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
                    : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60'
                }`}
              >
                Semester {sem}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Subject Selector */}
        <div>
          <label className="block text-xs font-mono font-semibold text-prevu-text-muted mb-2 uppercase tracking-wider">
            2. Select Course
          </label>
          {semesterSubjects.length > 0 ? (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {semesterSubjects.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border transition-all ${
                    activeSubject?.id === sub.id
                      ? 'bg-prevu-surface-light text-white border-prevu-accent/50 shadow-sm'
                      : 'border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-surface-light'
                  }`}
                >
                  <span className="font-mono text-prevu-accent text-[11px]">{sub.code}</span>
                  <span>{sub.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-xs text-prevu-text-muted">No subjects found for Semester {selectedSem}.</p>
          )}
        </div>

        {/* Step 3: Exam Type Selector */}
        <div>
          <label className="block text-xs font-mono font-semibold text-prevu-text-muted mb-2 uppercase tracking-wider">
            3. Select Examination Format
          </label>
          <div className="flex items-center gap-2">
            {EXAM_TYPES.map(type => {
              const label = type === 'MST1' ? 'MST-1 (In-Sem 1)' : type === 'MST2' ? 'MST-2 (In-Sem 2)' : 'EST (End-Sem Theory)'
              return (
                <button
                  key={type}
                  onClick={() => setSelectedExamType(type)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedExamType === type
                      ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20 font-extrabold'
                      : 'bg-prevu-bg text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Target Focus Banner */}
      {activeSubject && (
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-950/30 via-prevu-surface to-purple-950/30 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                {selectedExamType} PREP
              </span>
              <span className="text-xs font-mono text-prevu-text-muted">
                {activeSubject.code} • Semester {activeSubject.semester}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {activeSubject.name}
            </h2>
            <p className="text-xs text-prevu-text-muted max-w-xl">
              Focusing on university syllabus units tested in {selectedExamType} examination sessions.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button size="sm" variant="outline" asChild className="border-prevu-surface-light text-xs font-semibold">
              <Link href={`/subject/${encodeURIComponent(activeSubject.code)}`}>
                Full Subject Hub <ArrowRight className="w-3 h-3 ml-1" />
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-prevu-accent text-white font-bold text-xs shadow-md shadow-prevu-accent/20">
              <Link href={`/upload?subject_name=${encodeURIComponent(activeSubject.name)}&subject_code=${encodeURIComponent(activeSubject.code)}&exam_type=${selectedExamType}`}>
                <Sparkles className="w-3.5 h-3.5 mr-1" /> Add Past Paper
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Section 1: Past Papers for this Specific Exam Format */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-prevu-accent" />
              Available {selectedExamType} Past Papers ({formatPapers.length})
            </h3>
            <p className="text-xs text-prevu-text-muted mt-0.5">
              Verified university question papers for {activeSubject?.name} matching the {selectedExamType} format.
            </p>
          </div>
        </div>

        {formatPapers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {formatPapers.map(p => (
              <ResourceCard
                key={p.id}
                resource={p}
                isBookmarked={bookmarkIds.includes(p.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light space-y-3 max-w-md mx-auto">
            <BookOpen className="w-8 h-8 text-prevu-accent mx-auto" />
            <h4 className="text-sm font-bold text-white">No {selectedExamType} papers in the vault yet</h4>
            <p className="text-xs text-prevu-text-muted">
              You can submit a past {selectedExamType} paper or request your classmates to upload it.
            </p>
            <div className="flex justify-center gap-2 pt-1">
              <Button size="sm" asChild className="text-xs bg-prevu-accent text-white font-bold">
                <Link href={`/upload?subject_name=${encodeURIComponent(activeSubject?.name || '')}&subject_code=${encodeURIComponent(activeSubject?.code || '')}&exam_type=${selectedExamType}`}>
                  Contribute Paper
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="text-xs border-prevu-surface-light">
                <Link href={`/requests?subject_name=${encodeURIComponent(activeSubject?.name || '')}&exam_type=${selectedExamType}`}>
                  Request Paper
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Section 2: Syllabus Blueprint & High-Yield Units */}
      <section className="space-y-4">
        <div className="border-b border-prevu-surface-light pb-3">
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Curriculum Blueprint for {selectedExamType}
          </h3>
          <p className="text-xs text-prevu-text-muted mt-0.5">
            Unit weightages and focus areas tested during this university exam format.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {relevantUnits.map(u => {
            const cleanTitle = u.title.replace(/^Unit\s*[0-9]+[:.\s]*/i, '')
            return (
              <div key={u.unitNumber} className="p-4 sm:p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-3 shadow-lg">
                <div className="flex items-center justify-between gap-2 border-b border-prevu-surface-light pb-2">
                  <h4 className="text-sm font-bold text-white">
                    Unit {u.unitNumber}: {cleanTitle}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 shrink-0">
                    {u.weightage}
                  </span>
                </div>

              <ul className="space-y-1.5 text-xs text-prevu-text-muted">
                {u.topics.map((t, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
        </div>

        {/* Scoring Advice */}
        {studyKit?.examTips && studyKit.examTips.length > 0 && (
          <div className="p-5 rounded-2xl bg-prevu-surface/90 border border-purple-500/30 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-purple-200">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              Faculty Examination Advice for {activeSubject?.code}
            </div>
            <ul className="space-y-1.5 text-xs text-prevu-text-muted">
              {studyKit.examTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* Section 3: Archive Coverage Matrix */}
      {activeSubject && (
        <section className="space-y-4">
          <CoverageMatrix
            subjectName={activeSubject.name}
            subjectCode={activeSubject.code}
            papers={coverageRecords}
          />
        </section>
      )}

      {/* Section 4: Recommended Video Lectures */}
      {studyKit?.videoPlaylists && studyKit.videoPlaylists.length > 0 && (
        <section className="space-y-4">
          <div className="border-b border-prevu-surface-light pb-3">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-4 h-4 text-red-500" />
              Curated Video Lectures for {activeSubject?.code}
            </h3>
            <p className="text-xs text-prevu-text-muted mt-0.5">
              High-yield video channels for rapid conceptual mastery before exam day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {studyKit.videoPlaylists.map((pl, idx) => (
              <a
                key={idx}
                href={pl.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-prevu-surface border border-prevu-surface-light hover:border-red-500/40 transition-all group block shadow-md"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-red-400 transition-colors">
                  <span className="line-clamp-1">{pl.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-prevu-text-muted shrink-0" />
                </div>
                <p className="text-[11px] font-mono text-prevu-accent mt-0.5">{pl.channel}</p>
                <p className="text-[11px] text-prevu-text-muted mt-1.5 line-clamp-2">{pl.description}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
