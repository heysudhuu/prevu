'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  GraduationCap, 
  Search, 
  Target, 
  ArrowRight, 
  Sparkles,
  FileText
} from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { PageHeader } from '@/components/ui/PageHeader'

export interface SubjectSummary {
  id: number
  name: string
  code: string
  semester: number
  year: number
  branchName?: string
  paperCount: number
}

interface SubjectsClientProps {
  initialSubjects: SubjectSummary[]
}

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8]

export default function SubjectsClient({ initialSubjects }: SubjectsClientProps) {
  const [selectedSem, setSelectedSem] = useState<number | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSubjects = useMemo(() => {
    return initialSubjects.filter(sub => {
      const matchesSem = selectedSem === 'ALL' || sub.semester === selectedSem
      const query = searchQuery.trim().toLowerCase()
      const matchesQuery = !query || 
        sub.name.toLowerCase().includes(query) || 
        sub.code.toLowerCase().includes(query)
      return matchesSem && matchesQuery
    })
  }, [initialSubjects, selectedSem, searchQuery])

  // Group by semester for 'ALL' view
  const groupedBySemester = useMemo(() => {
    const map = new Map<number, SubjectSummary[]>()
    SEMESTERS.forEach(s => map.set(s, []))
    filteredSubjects.forEach(s => {
      const list = map.get(s.semester) || []
      list.push(s)
      map.set(s.semester, list)
    })
    return map
  }, [filteredSubjects])

  const totalPapersInView = useMemo(() => {
    return filteredSubjects.reduce((acc, curr) => acc + curr.paperCount, 0)
  }, [filteredSubjects])

  return (
    <div className="space-y-8">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Subjects Directory' }
        ]}
        badge={{ text: 'Curriculum Index', variant: 'purple' }}
        title="BE-CSE Subject Catalog & Hubs"
        description="Explore engineering curriculum subjects across Semesters 1 to 8. Access dedicated Subject Hubs, examination archives, syllabi, and faculty exam prep kits."
        actions={
          <Button size="sm" asChild className="bg-prevu-accent text-white font-bold shadow-lg shadow-prevu-accent/20">
            <Link href="/upload">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Contribute Paper
            </Link>
          </Button>
        }
      />

      {/* Control Bar: Semester Switcher & Search */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-3 rounded-2xl bg-prevu-surface border border-prevu-surface-light">
        {/* Semester tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setSelectedSem('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedSem === 'ALL'
                ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/20'
                : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60'
            }`}
          >
            All Semesters
          </button>
          {SEMESTERS.map(sem => (
            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedSem === sem
                  ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/20'
                  : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60'
              }`}
            >
              Sem {sem}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
          <Input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search code or subject..."
            className="pl-9 h-9 text-xs bg-prevu-bg/90 border-prevu-surface-light text-white"
          />
        </div>
      </div>

      {/* Active Summary */}
      <div className="flex items-center justify-between text-xs text-prevu-text-muted px-1 font-mono">
        <span>Showing {filteredSubjects.length} academic courses</span>
        <span>{totalPapersInView} archived question papers</span>
      </div>

      {/* Subjects Content */}
      {selectedSem === 'ALL' && !searchQuery ? (
        // Semester Sections
        <div className="space-y-10">
          {SEMESTERS.map(sem => {
            const list = groupedBySemester.get(sem) || []
            if (list.length === 0) return null

            return (
              <div key={sem} className="space-y-4">
                <div className="flex items-center justify-between border-b border-prevu-surface-light/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-prevu-accent" />
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Semester {sem} (Year {Math.ceil(sem / 2)})
                    </h2>
                    <span className="text-xs font-mono text-prevu-text-muted">
                      • {list.length} Subjects
                    </span>
                  </div>
                  <Link
                    href={`/browse?sem=${sem}`}
                    className="text-xs font-mono text-prevu-accent hover:underline flex items-center gap-1"
                  >
                    Browse Sem {sem} Papers <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {list.map(sub => (
                    <SubjectCard key={sub.id} subject={sub} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        // Flat Filtered Grid
        <div>
          {filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSubjects.map(sub => (
                <SubjectCard key={sub.id} subject={sub} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light space-y-3">
              <GraduationCap className="w-8 h-8 text-prevu-accent mx-auto" />
              <h3 className="text-sm font-bold text-white">No subjects found</h3>
              <p className="text-xs text-prevu-text-muted max-w-sm mx-auto">
                No university courses match your selected semester or keyword query.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSem('ALL')
                  setSearchQuery('')
                }}
                className="text-xs border-prevu-surface-light"
              >
                Reset Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function SubjectCard({ subject }: { subject: SubjectSummary }) {
  const subjectUrl = `/subject/${encodeURIComponent(subject.code)}`
  const examPrepUrl = `/exam-prep?sem=${subject.semester}&subject=${subject.id}`

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light hover:border-prevu-accent/40 transition-all group flex flex-col justify-between h-full shadow-lg">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-prevu-accent/10 text-prevu-accent border border-prevu-accent/20">
            {subject.code}
          </span>
          <span className="text-[11px] font-mono text-prevu-text-muted">
            Sem {subject.semester} • Yr {subject.year}
          </span>
        </div>

        <div>
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-prevu-accent transition-colors line-clamp-2">
            <Link href={subjectUrl}>
              {subject.name}
            </Link>
          </h3>
          <p className="text-xs text-prevu-text-muted/80 mt-1">
            {subject.branchName || 'BE-CSE Program'}
          </p>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-prevu-surface-light/60 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-mono text-prevu-text-muted">
          <FileText className="w-3.5 h-3.5 text-prevu-accent" />
          {subject.paperCount > 0 ? (
            <span className="text-white font-semibold">{subject.paperCount} Papers</span>
          ) : (
            <span className="text-prevu-text-muted/60">0 Papers</span>
          )}
        </span>

        <div className="flex items-center gap-1.5">
          <Link
            href={examPrepUrl}
            title="Open Exam Prep workspace"
            className="p-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 transition-colors"
          >
            <Target className="w-3.5 h-3.5" />
          </Link>
          <Link
            href={subjectUrl}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-prevu-surface-light hover:bg-prevu-accent hover:text-white text-prevu-text transition-all group-hover:translate-x-0.5"
          >
            <span>Hub</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  )
}
