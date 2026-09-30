'use client'

import { useState, useEffect } from 'react'

import { 
  GraduationCap, 
  ShieldCheck, 
  CheckCircle2, 
  FileCheck, 
  BookOpen, 
  Upload, 
  Sparkles, 
  Award, 
  Search, 
  Building2,
  ExternalLink,
  MessageSquare,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface FacultyEndorsement {
  paperId: string
  professorName: string
  department: string
  notes: string
  endorsedAt: string
}

interface FacultyPortalClientProps {
  initialDepartment?: string
}

const DEPARTMENTS = [
  'Computer Science & Engineering (BE-CSE)',
  'Information Technology (BE-IT)',
  'Artificial Intelligence & Data Science (AI-DS)',
  'Electronics & Computer Engineering'
]

const SAMPLE_FACULTY_PAPERS = [
  {
    id: 'fac-1',
    subjectName: 'Operating Systems',
    subjectCode: '21CSH-202',
    semester: 4,
    examType: 'MST1',
    examYear: 2024,
    doubtsCount: 4,
    downloads: 1240,
    hasOfficialAnswerKey: true
  },
  {
    id: 'fac-2',
    subjectName: 'Database Management Systems',
    subjectCode: '21CSH-203',
    semester: 4,
    examType: 'MST1',
    examYear: 2024,
    doubtsCount: 6,
    downloads: 1580,
    hasOfficialAnswerKey: false
  },
  {
    id: 'fac-3',
    subjectName: 'Computer Networks',
    subjectCode: '21CSH-205',
    semester: 4,
    examType: 'EST',
    examYear: 2023,
    doubtsCount: 3,
    downloads: 980,
    hasOfficialAnswerKey: true
  },
  {
    id: 'fac-4',
    subjectName: 'Theory of Computation',
    subjectCode: '21CSH-301',
    semester: 5,
    examType: 'MST2',
    examYear: 2024,
    doubtsCount: 8,
    downloads: 870,
    hasOfficialAnswerKey: false
  }
]

export default function FacultyPortalClient({
  initialDepartment = 'Computer Science & Engineering (BE-CSE)'
}: FacultyPortalClientProps) {
  const [selectedDept, setSelectedDept] = useState(initialDepartment)
  const [profName, setProfName] = useState('Dr. S. K. Sharma')
  const [endorsements, setEndorsements] = useState<Record<string, FacultyEndorsement>>({})
  const [activeEndorsePaperId, setActiveEndorsePaperId] = useState<string | null>(null)
  const [endorseNote, setEndorseNote] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Load endorsements from storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prevu_faculty_endorsements')
      if (saved) setEndorsements(JSON.parse(saved))
    } catch {}
  }, [])

  const handleEndorse = (paperId: string) => {
    const updated = {
      ...endorsements,
      [paperId]: {
        paperId,
        professorName: profName,
        department: selectedDept,
        notes: endorseNote || 'Officially verified and aligned with the Chandigarh University examination scheme.',
        endorsedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    }
    setEndorsements(updated)
    try {
      localStorage.setItem('prevu_faculty_endorsements', JSON.stringify(updated))
    } catch {}
    setActiveEndorsePaperId(null)
    setEndorseNote('')
  }

  const filteredPapers = SAMPLE_FACULTY_PAPERS.filter(p => {
    const term = searchQuery.toLowerCase().trim()
    return !term || p.subjectName.toLowerCase().includes(term) || p.subjectCode.toLowerCase().includes(term)
  })

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 py-10 px-4">
        <div className="container mx-auto max-w-6xl space-y-8">
          
          {/* Top Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-prevu-surface to-indigo-950/30 border border-emerald-500/30 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Chandigarh University Academic Portal</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Faculty Collaboration & Verification Portal
                </h1>

                <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
                  Welcome, esteemed faculty members and department coordinators. Review examination papers, certify syllabus alignment, and share official answer keys to guide students.
                </p>
              </div>

              {/* Professor Profile Badge */}
              <div className="p-4 rounded-2xl bg-prevu-bg/80 border border-prevu-surface-light flex items-center gap-3 shrink-0 shadow-lg">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">{profName}</span>
                    <span className="text-emerald-400 text-xs">✓</span>
                  </div>
                  <p className="text-[11px] text-prevu-text-muted mt-0.5">Faculty Coordinator</p>
                  <span className="text-[10px] font-mono text-emerald-400">Chandigarh University</span>
                </div>
              </div>
            </div>
          </div>

          {/* Department Selector & Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 p-4 rounded-2xl bg-prevu-surface border border-prevu-surface-light flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-prevu-text-muted shrink-0 uppercase font-mono">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Department:</span>
              </div>
              <select
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                className="flex-1 px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {DEPARTMENTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Filter department subjects or codes..."
                className="w-full h-full pl-9 pr-3 py-2 bg-prevu-surface border border-prevu-surface-light rounded-2xl text-xs text-white placeholder-prevu-text-muted focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Department Question Papers List for Endorsement */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  Course Examination Papers ({selectedDept.split('(')[0]})
                </h2>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  Verify authenticity, attach answer keys, or endorse papers to display official verification gold badges.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPapers.map(paper => {
                const endorsement = endorsements[paper.id]
                const isEndorsing = activeEndorsePaperId === paper.id

                return (
                  <div
                    key={paper.id}
                    className="p-5 rounded-3xl bg-prevu-surface border border-prevu-surface-light hover:border-emerald-500/40 transition-all shadow-xl space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            {paper.examType}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono text-white bg-prevu-bg border border-prevu-surface-light">
                            {paper.examYear}
                          </span>
                          <span className="text-xs font-mono text-prevu-text-muted">
                            Sem {paper.semester}
                          </span>
                        </div>

                        {endorsement ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                            <Award className="w-3 h-3 text-amber-400" /> Faculty Certified
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-prevu-text-muted">
                            Pending Endorsement
                          </span>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-bold text-white">
                          {paper.subjectName}
                        </h3>
                        <p className="text-xs font-mono text-prevu-text-muted mt-0.5">
                          Course Code: {paper.subjectCode} • {paper.downloads} Student Downloads
                        </p>
                      </div>

                      {/* Faculty note if endorsed */}
                      {endorsement && (
                        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                            <span>Endorsed by {endorsement.professorName}</span>
                            <span className="text-[10px] font-mono text-prevu-text-muted">{endorsement.endorsedAt}</span>
                          </div>
                          <p className="text-xs text-prevu-text-muted italic">
                            &ldquo;{endorsement.notes}&rdquo;
                          </p>
                        </div>
                      )}

                      {/* Active Endorse Input */}
                      {isEndorsing && (
                        <div className="p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-2.5 animate-fade-in">
                          <label className="block text-[11px] font-bold text-emerald-300">
                            Faculty Endorsement Note / Syllabus Guidance
                          </label>
                          <textarea
                            value={endorseNote}
                            onChange={e => setEndorseNote(e.target.value)}
                            placeholder="e.g. Question 3 & 4 strictly adhere to 2024 revised Bloom's taxonomy. Highly recommended for MST-1 practice."
                            rows={2}
                            className="w-full p-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder-prevu-text-muted focus:outline-none focus:border-emerald-500"
                          />
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => setActiveEndorsePaperId(null)} className="text-xs h-7">
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleEndorse(paper.id)} className="text-xs h-7 font-bold bg-emerald-600 hover:bg-emerald-500 text-white">
                              Confirm Endorsement
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-prevu-surface-light/60 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {!endorsement && !isEndorsing && (
                          <Button
                            size="sm"
                            onClick={() => setActiveEndorsePaperId(paper.id)}
                            className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Endorse Paper
                          </Button>
                        )}
                        {endorsement && (
                          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Seal Active
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <Link
                          href={`/browse?q=${encodeURIComponent(paper.subjectCode)}`}
                          className="text-prevu-text-muted hover:text-white inline-flex items-center gap-1 font-mono text-[11px]"
                        >
                          View In Vault <ExternalLink className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Faculty Benefits Card */}
          <div className="p-6 rounded-3xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Award className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Official Syllabus Verification</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Prevents students from memorizing outdated or non-prescribed topics by certifying syllabus alignment.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Resolve Class Doubts at Scale</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Provide hints and formulas once so all 500+ enrolled students get verified answers before exam morning.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Upload className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Instant Model Solutions</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Upload verified solution keys directly to reduce repetitive post-MST query sessions during office hours.
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
