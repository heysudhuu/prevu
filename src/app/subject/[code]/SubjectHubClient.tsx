'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Layers, 
  GraduationCap, 
  Sparkles, 
  Video, 
  BookMarked, 
  CheckCircle2, 
  Lightbulb, 
  ExternalLink,
  Target,
  BookOpen,
  CalendarCheck,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ResourceCard } from '@/components/ResourceCard'
import { CoverageMatrix, CoveragePaperRecord } from '@/components/ui/CoverageMatrix'
import { SubjectStudyKit } from '@/lib/data/subject-guides'
import { CustomSyllabusModal, CustomUnit } from '@/components/subject/CustomSyllabusModal'

interface SubjectHubClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subject: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any[]
  bookmarkIds: string[]
  studyKit: SubjectStudyKit
}

type HubTab = 'papers' | 'coverage' | 'blueprint' | 'kit'

export default function SubjectHubClient({
  subject,
  resources,
  bookmarkIds,
  studyKit
}: SubjectHubClientProps) {
  const [activeTab, setActiveTab] = useState<HubTab>('papers')
  const [paperFilter, setPaperFilter] = useState<string>('ALL')
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false)

  // Subscribe to localStorage using React's useSyncExternalStore
  const customSyllabusRaw = React.useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback)
      return () => window.removeEventListener('storage', callback)
    },
    () => {
      try {
        return localStorage.getItem(`prevu_custom_syllabus_${subject.code}`)
      } catch {
        return null
      }
    },
    () => null
  )

  const customUnits: CustomUnit[] | null = React.useMemo(() => {
    if (!customSyllabusRaw) return null
    try {
      const parsed = JSON.parse(customSyllabusRaw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    } catch {
      // Ignore
    }
    return null
  }, [customSyllabusRaw])

  const handleSaveCustomUnits = (units: CustomUnit[]) => {
    try {
      localStorage.setItem(`prevu_custom_syllabus_${subject.code}`, JSON.stringify(units))
      window.dispatchEvent(new Event('storage'))
    } catch {
      // Ignore
    }
  }

  const handleResetCustomUnits = () => {
    try {
      localStorage.removeItem(`prevu_custom_syllabus_${subject.code}`)
      window.dispatchEvent(new Event('storage'))
    } catch {
      // Ignore
    }
  }

  const displayUnits = customUnits || studyKit.units

  // Prepare coverage records
  const coveragePapers: CoveragePaperRecord[] = resources.map(r => ({
    id: r.id,
    exam_year: r.exam_year,
    examType: r.exam_types?.name || 'MST1',
    original_filename: r.original_filename
  }))

  const filteredResources = React.useMemo(() => {
    if (paperFilter === 'ALL') return resources
    return resources.filter(r => (r.exam_types?.name || '').toUpperCase() === paperFilter)
  }, [resources, paperFilter])

  const mst1Count = resources.filter(r => (r.exam_types?.name || '').toUpperCase() === 'MST1').length
  const mst2Count = resources.filter(r => (r.exam_types?.name || '').toUpperCase() === 'MST2').length
  const estCount = resources.filter(r => (r.exam_types?.name || '').toUpperCase() === 'EST').length

  const examPrepUrl = `/exam-prep?sem=${subject.semester}&subject=${subject.id}`

  return (
    <div className="space-y-8">
      {/* Subject Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                {subject.code}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-prevu-surface-light text-prevu-text-muted border border-prevu-surface-light">
                {subject.branches?.name || 'BE-CSE'}
              </span>
              <span className="text-xs font-mono text-prevu-text-muted">
                Semester {subject.semester} • Year {subject.year}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              {subject.name}
            </h1>

            <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
              {studyKit.description}
            </p>
          </div>

          {/* Quick Actions & Exam Stats */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <Button size="sm" asChild className="flex-1 bg-prevu-accent text-white font-bold shadow-lg shadow-prevu-accent/20">
                <Link href={examPrepUrl}>
                  <Target className="w-3.5 h-3.5 mr-1.5 text-cyan-300" /> Exam Prep
                </Link>
              </Button>
              <Button size="sm" variant="outline" asChild className="border-prevu-surface-light text-xs font-semibold">
                <Link href={`/upload?subject_name=${encodeURIComponent(subject.name)}&subject_code=${encodeURIComponent(subject.code)}`}>
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-prevu-accent" /> Upload
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-prevu-bg/80 border border-prevu-surface-light text-center font-mono">
              <div className="px-2">
                <span className="text-[10px] text-prevu-text-muted uppercase block">MST-1</span>
                <span className="text-sm font-bold text-purple-300">{mst1Count}</span>
              </div>
              <div className="px-2 border-x border-prevu-surface-light">
                <span className="text-[10px] text-prevu-text-muted uppercase block">MST-2</span>
                <span className="text-sm font-bold text-purple-300">{mst2Count}</span>
              </div>
              <div className="px-2">
                <span className="text-[10px] text-prevu-text-muted uppercase block">EST</span>
                <span className="text-sm font-bold text-emerald-400">{estCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-prevu-surface-light pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('papers')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'papers'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/20'
              : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Question Papers ({resources.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('coverage')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'coverage'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/20'
              : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60'
          }`}
        >
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Archive Coverage</span>
        </button>

        <button
          onClick={() => setActiveTab('blueprint')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'blueprint'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/20'
              : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Syllabus Blueprint & Topics</span>
        </button>

        <button
          onClick={() => setActiveTab('kit')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'kit'
              ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/20'
              : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Study Kit & Playlists</span>
        </button>
      </div>

      {/* Tab 1: Question Papers */}
      {activeTab === 'papers' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              {['ALL', 'MST1', 'MST2', 'EST'].map(type => (
                <button
                  key={type}
                  onClick={() => setPaperFilter(type)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    paperFilter === type
                      ? 'bg-prevu-surface-light text-white border border-prevu-accent/40 shadow-sm'
                      : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40 border border-transparent'
                  }`}
                >
                  {type === 'ALL' ? 'All Formats' : type}
                </button>
              ))}
            </div>

            <span className="text-xs font-mono text-prevu-text-muted">
              Showing {filteredResources.length} papers
            </span>
          </div>

          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredResources.map(paper => (
                <ResourceCard 
                  key={paper.id} 
                  resource={paper} 
                  isBookmarked={bookmarkIds.includes(paper.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light text-center space-y-3 max-w-lg mx-auto">
              <BookOpen className="w-8 h-8 text-prevu-accent mx-auto" />
              <h3 className="text-base font-bold text-white">No question papers matching this filter</h3>
              <p className="text-xs text-prevu-text-muted">
                Be the first to upload an {paperFilter} question paper for {subject.code} to help your batchmates!
              </p>
              <div className="pt-2 flex justify-center gap-2">
                <Button size="sm" asChild className="bg-prevu-accent text-white font-bold">
                  <Link href={`/upload?subject_name=${encodeURIComponent(subject.name)}&subject_code=${encodeURIComponent(subject.code)}`}>
                    Contribute Paper
                  </Link>
                </Button>
                <Button size="sm" variant="outline" asChild className="border-prevu-surface-light text-xs">
                  <Link href={`/requests?subject_name=${encodeURIComponent(subject.name)}`}>
                    Request Paper
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Tab 2: Coverage Matrix */}
      {activeTab === 'coverage' && (
        <section className="space-y-6">
          <CoverageMatrix
            subjectName={subject.name}
            subjectCode={subject.code}
            papers={coveragePapers}
          />
        </section>
      )}

      {/* Tab 3: Syllabus Blueprint & Important Topics */}
      {activeTab === 'blueprint' && (
        <section className="space-y-5">
          {/* Custom Syllabus Toolbar Banner */}
          <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <span className={`w-2.5 h-2.5 rounded-full ${customUnits ? 'bg-purple-400 animate-pulse' : 'bg-emerald-400'}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">
                    {customUnits ? 'Custom Syllabus Active (Your Batch)' : 'Official University Blueprint'}
                  </span>
                  {customUnits && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Modified
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-prevu-text-muted mt-0.5">
                  {customUnits
                    ? 'Displaying your customized units and topics for this subject.'
                    : 'If your current batch syllabus differs, click to customize or upload your units.'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {customUnits && (
                <button
                  onClick={handleResetCustomUnits}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Official</span>
                </button>
              )}

              <Button
                size="sm"
                onClick={() => setIsCustomModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs h-8 px-3.5 rounded-xl shadow-sm flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{customUnits ? 'Edit Custom Syllabus' : 'Syllabus doesn\'t match? Customize Units'}</span>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {displayUnits.map(u => {
              const cleanTitle = u.title.replace(/^Unit\s*[0-9]+[:.\s]*/i, '')
              return (
                <div key={u.unitNumber} className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-3 shadow-lg">
                  <div className="flex items-center justify-between gap-2 border-b border-prevu-surface-light pb-2.5">
                    <h3 className="text-sm font-bold text-white">
                      Unit {u.unitNumber}: {cleanTitle}
                    </h3>
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

          {/* Exam Scoring Tips Card */}
          {studyKit.examTips.length > 0 && (
            <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-prevu-surface to-indigo-950/40 border border-purple-500/30 shadow-xl space-y-2.5">
              <div className="flex items-center gap-2 text-sm font-bold text-purple-200">
                <Lightbulb className="w-4 h-4 text-yellow-300" />
                Faculty Scoring Advice for {subject.code}
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
      )}

      {/* Tab 4: Study Kit, Playlists & Books */}
      {activeTab === 'kit' && (
        <section className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Playlists */}
            <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-3.5 shadow-lg">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-prevu-surface-light pb-2.5">
                <Video className="w-4 h-4 text-red-500" />
                Top Video Playlists
              </div>
              <div className="space-y-3">
                {studyKit.videoPlaylists.map((pl, i) => (
                  <a
                    key={i}
                    href={pl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl bg-prevu-bg/70 hover:bg-prevu-bg border border-prevu-surface-light/80 hover:border-red-500/40 transition-all group"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-white group-hover:text-red-400 transition-colors">
                      <span>{pl.title}</span>
                      <ExternalLink className="w-3 h-3 text-prevu-text-muted group-hover:text-red-400" />
                    </div>
                    <p className="text-[11px] font-mono text-prevu-accent mt-0.5">{pl.channel}</p>
                    <p className="text-[11px] text-prevu-text-muted mt-1 leading-relaxed">{pl.description}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Textbooks */}
            <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-3.5 shadow-lg">
              <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-prevu-surface-light pb-2.5">
                <BookMarked className="w-4 h-4 text-amber-400" />
                Recommended Reference Books
              </div>
              <div className="space-y-3">
                {studyKit.recommendedBooks.map((bk, i) => (
                  <div key={i} className="p-3 rounded-xl bg-prevu-bg/70 border border-prevu-surface-light/80">
                    <h4 className="text-xs font-semibold text-white">{bk.title}</h4>
                    <p className="text-[11px] text-prevu-text-muted mt-0.5 font-mono">By {bk.author}</p>
                    {bk.edition && (
                      <span className="inline-block text-[10px] text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 mt-1.5">
                        {bk.edition}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Custom Syllabus Modal */}
      <CustomSyllabusModal
        isOpen={isCustomModalOpen}
        subjectCode={subject.code}
        subjectName={subject.name}
        defaultUnits={studyKit.units}
        currentUnits={displayUnits}
        isCustom={!!customUnits}
        onClose={() => setIsCustomModalOpen(false)}
        onSave={handleSaveCustomUnits}
        onReset={handleResetCustomUnits}
      />
    </div>
  )
}
