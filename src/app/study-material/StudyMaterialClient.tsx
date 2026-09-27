'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  Upload, 
  Filter, 
  X, 
  GraduationCap, 
  Layers, 
  FileText, 
  Download, 
  Share2, 
  Bookmark, 
  CheckCircle, 
  HelpCircle,
  FolderOpen,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ResourceCard } from '@/components/ResourceCard'

// Preset popular subjects per year for quick navigation
const POPULAR_YEAR_SUBJECTS = {
  1: [
    { name: 'Biology', code: 'BIO101', sem: 1 },
    { name: 'Communication Skills', code: 'COM101', sem: 1 },
    { name: 'Engineering Chemistry', code: 'CHM101', sem: 1 },
    { name: 'Engineering Mathematics I', code: 'MTH101', sem: 1 },
    { name: 'Programming in C', code: 'CSP101', sem: 2 }
  ],
  2: [
    { name: 'Data Structures & Algorithms', code: '21CS201', sem: 3 },
    { name: 'Computer Organization & Arch', code: '21CS202', sem: 3 },
    { name: 'Discrete Mathematics', code: '21CS203', sem: 3 },
    { name: 'Object Oriented Programming (Java/C++)', code: '21CS204', sem: 4 },
    { name: 'Database Management Systems', code: '21CS205', sem: 4 }
  ],
  3: [
    { name: 'Operating Systems', code: '21CS301', sem: 5 },
    { name: 'Design & Analysis of Algorithms', code: '21CS302', sem: 5 },
    { name: 'Computer Networks', code: '21CS303', sem: 5 },
    { name: 'Theory of Computation', code: '21CS304', sem: 6 },
    { name: 'Web Technologies & Frameworks', code: '21CS305', sem: 6 }
  ],
  4: [
    { name: 'Artificial Intelligence & Machine Learning', code: '21CS401', sem: 7 },
    { name: 'Cloud Computing & DevOps', code: '21CS402', sem: 7 },
    { name: 'Cyber Security & Cryptography', code: '21CS403', sem: 7 },
    { name: 'Big Data Analytics', code: '21CS404', sem: 8 },
    { name: 'Software Testing & QA', code: '21CS405', sem: 8 }
  ]
}

const CATEGORY_CHIPS = [
  { id: 'ALL', label: 'All Materials', icon: '✨' },
  { id: 'Notes', label: 'Lecture & Notes', icon: '📝' },
  { id: 'Syllabus', label: 'Syllabus', icon: '📑' },
  { id: 'Assignment', label: 'Assignments', icon: '📋' },
  { id: 'Lab Manual', label: 'Lab Manuals', icon: '🔬' },
  { id: 'Question Bank', label: 'Question Banks', icon: '❓' },
  { id: 'Book', label: 'Books & Reference', icon: '📚' },
  { id: 'Cheatsheet', label: 'Cheatsheets', icon: '⚡' }
]

interface StudyMaterialClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialMaterials: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  allResources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subjects: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  branches: any[]
  bookmarkIds: string[]
  userUpvotedIds?: string[]
  upvoteCounts?: Record<string, number>
  initialYear?: number
  initialSem?: number
  initialCategory?: string
  initialBranch?: number
  initialSearch?: string
}

export default function StudyMaterialClient({
  initialMaterials,
  allResources,
  subjects,
  branches,
  bookmarkIds,
  userUpvotedIds = [],
  upvoteCounts = {},
  initialYear,
  initialSem,
  initialCategory = 'ALL',
  initialBranch,
  initialSearch = ''
}: StudyMaterialClientProps) {
  const router = useRouter()
  
  // Year filter: 0 means All Years, 1-4 for specific year
  const [selectedYear, setSelectedYear] = useState<number>(initialYear || 0)
  const [selectedSem, setSelectedSem] = useState<number | 'ALL'>(initialSem || 'ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL')
  const [selectedBranch, setSelectedBranch] = useState<number | 'ALL'>(initialBranch || 'ALL')
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch)
  const [viewMode, setViewMode] = useState<'materials_only' | 'all_vault'>('materials_only')

  // Available semesters based on chosen year
  const availableSemesters = useMemo(() => {
    if (selectedYear === 0) return [1, 2, 3, 4, 5, 6, 7, 8]
    return [selectedYear * 2 - 1, selectedYear * 2]
  }, [selectedYear])

  // Count materials per year
  const yearCounts = useMemo(() => {
    const counts: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0 }
    const source = viewMode === 'materials_only' ? initialMaterials : allResources

    source.forEach(item => {
      const yr = item.subjects?.year || Math.ceil((item.subjects?.semester || 1) / 2)
      counts[0] = (counts[0] || 0) + 1
      if (yr >= 1 && yr <= 4) {
        counts[yr] = (counts[yr] || 0) + 1
      }
    })
    return counts
  }, [initialMaterials, allResources, viewMode])

  // Filter materials based on user controls
  const filteredMaterials = useMemo(() => {
    const source = viewMode === 'materials_only' ? initialMaterials : allResources

    return source.filter(item => {
      const subYear = item.subjects?.year || Math.ceil((item.subjects?.semester || 1) / 2)
      const subSem = item.subjects?.semester
      const itemType = (item.exam_types?.name || '').trim()

      // Year filter
      if (selectedYear !== 0 && subYear !== selectedYear) {
        return false
      }

      // Semester filter
      if (selectedSem !== 'ALL' && subSem !== selectedSem) {
        return false
      }

      // Branch filter
      if (selectedBranch !== 'ALL' && item.subjects?.branch_id !== selectedBranch) {
        return false
      }

      // Category filter
      if (selectedCategory !== 'ALL') {
        const normCategory = selectedCategory.toLowerCase().replace(/[\s_-]/g, '')
        const normType = itemType.toLowerCase().replace(/[\s_-]/g, '')
        if (!normType.includes(normCategory) && !normCategory.includes(normType)) {
          return false
        }
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const subName = (item.subjects?.name || '').toLowerCase()
        const subCode = (item.subjects?.code || '').toLowerCase()
        const fileName = (item.original_filename || '').toLowerCase()
        const typeName = itemType.toLowerCase()

        if (!subName.includes(q) && !subCode.includes(q) && !fileName.includes(q) && !typeName.includes(q)) {
          return false
        }
      }

      return true
    })
  }, [initialMaterials, allResources, viewMode, selectedYear, selectedSem, selectedBranch, selectedCategory, searchQuery])

  const handleResetFilters = () => {
    setSelectedYear(0)
    setSelectedSem('ALL')
    setSelectedCategory('ALL')
    setSelectedBranch('ALL')
    setSearchQuery('')
  }

  const hasActiveFilters = selectedYear !== 0 || selectedSem !== 'ALL' || selectedCategory !== 'ALL' || selectedBranch !== 'ALL' || searchQuery.trim().length > 0

  return (
    <div className="min-h-screen bg-prevu-bg pb-24 text-prevu-text">
      
      {/* ============================================================ */}
      {/* 1. HERO BANNER WITH AMBIENT GLOW */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-20 border-b border-prevu-surface-light">
        {/* Ambient background glows */}
        <div className="absolute inset-0 z-0 grid-pattern opacity-40" />
        <div className="absolute left-1/3 top-0 -translate-x-1/2 -z-10 h-[400px] w-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute right-10 top-10 -z-10 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>Chandigarh University • All Years (1st – 4th Year)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Study Material <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Vault</span>
              </h1>

              <p className="text-sm sm:text-base text-prevu-text-muted leading-relaxed">
                Comprehensive lecture notes, syllabus blueprints, assignments, lab manuals, and revision cheat sheets shared by top students for all semesters.
              </p>
            </div>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap sm:flex-col gap-3 shrink-0">
              <Button 
                asChild
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-500/25 px-5 py-3 h-auto"
              >
                <Link href="/upload?category=study-material" className="flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  <span>Upload Study Material</span>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                asChild
                className="border-prevu-surface-light hover:border-emerald-500/40 text-xs font-semibold px-4 py-2.5 h-auto text-prevu-text-muted hover:text-white"
              >
                <Link href="/requests" className="flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Request Missing Material</span>
                </Link>
              </Button>
            </div>

          </div>

          {/* Quick Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-10 p-3 sm:p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light backdrop-blur-xl">
            <div className="text-center p-2">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">4 Years</div>
              <div className="text-[11px] text-prevu-text-muted font-medium">All Academic Batches</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">8 Semesters</div>
              <div className="text-[11px] text-prevu-text-muted font-medium">Full CSE Curriculum</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xl sm:text-2xl font-bold font-mono text-violet-400">{filteredMaterials.length} Documents</div>
              <div className="text-[11px] text-prevu-text-muted font-medium">Live & Verified</div>
            </div>
            <div className="text-center p-2">
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">100% Free</div>
              <div className="text-[11px] text-prevu-text-muted font-medium">Zero Paywalls</div>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. YEAR SELECTOR TABS (1st Year, 2nd Year, 3rd Year, 4th Year) */}
      {/* ============================================================ */}
      <section className="sticky top-16 z-40 bg-prevu-bg/95 backdrop-blur-xl border-b border-prevu-surface-light shadow-md shadow-black/20">
        <div className="container mx-auto px-4 max-w-6xl py-3">
          
          <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
            
            <div className="flex items-center gap-2">
              {[
                { yr: 0, label: 'All Years' },
                { yr: 1, label: '1st Year (Sem 1-2)' },
                { yr: 2, label: '2nd Year (Sem 3-4)' },
                { yr: 3, label: '3rd Year (Sem 5-6)' },
                { yr: 4, label: '4th Year (Sem 7-8)' }
              ].map(tab => {
                const isActive = selectedYear === tab.yr
                const count = yearCounts[tab.yr] || 0
                return (
                  <button
                    key={tab.yr}
                    onClick={() => {
                      setSelectedYear(tab.yr)
                      setSelectedSem('ALL')
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/25 scale-[1.02]'
                        : 'bg-prevu-surface hover:bg-prevu-surface-light text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      isActive 
                        ? 'bg-black/20 text-black font-extrabold' 
                        : 'bg-prevu-bg text-prevu-text-muted'
                    }`}>
                      {count}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Toggle View: Materials only vs Complete Archive */}
            <div className="hidden lg:flex items-center gap-1 bg-prevu-surface p-1 rounded-xl border border-prevu-surface-light text-xs shrink-0">
              <button
                onClick={() => setViewMode('materials_only')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'materials_only' 
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold' 
                    : 'text-prevu-text-muted hover:text-white'
                }`}
              >
                Study Materials
              </button>
              <button
                onClick={() => setViewMode('all_vault')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'all_vault' 
                    ? 'bg-prevu-accent/20 text-prevu-accent font-bold' 
                    : 'text-prevu-text-muted hover:text-white'
                }`}
              >
                All Resources
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. INTERACTIVE FILTERS & SEARCH */}
      {/* ============================================================ */}
      <section className="container mx-auto px-4 max-w-6xl mt-8">
        
        {/* Category Quick Chips */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORY_CHIPS.map(chip => {
            const isCatActive = selectedCategory === chip.id
            return (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isCatActive
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 font-bold'
                    : 'bg-prevu-surface/80 hover:bg-prevu-surface text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                }`}
              >
                <span>{chip.icon}</span>
                <span>{chip.label}</span>
              </button>
            )
          })}
        </div>

        {/* Search Bar & Secondary Dropdowns */}
        <div className="bg-prevu-surface/90 border border-prevu-surface-light rounded-2xl p-4 shadow-xl backdrop-blur-xl space-y-4">
          
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search notes by subject name, course code (e.g. 21CS201), or topic..."
                className="w-full pl-10 pr-10 py-2.5 bg-prevu-bg border border-prevu-surface-light hover:border-emerald-500/40 focus:border-emerald-400 rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Semester Dropdown */}
            <select
              value={selectedSem}
              onChange={e => setSelectedSem(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs sm:text-sm text-prevu-text focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
            >
              <option value="ALL">All Semesters</option>
              {availableSemesters.map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>

            {/* Branch Dropdown */}
            <select
              value={selectedBranch}
              onChange={e => setSelectedBranch(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              className="px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs sm:text-sm text-prevu-text focus:outline-none focus:border-emerald-400 transition-colors cursor-pointer"
            >
              <option value="ALL">All Branches</option>
              {branches.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="text-xs text-prevu-text-muted hover:text-rose-400 px-3 h-auto"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}
          </div>

        </div>

      </section>

      {/* ============================================================ */}
      {/* 4. STUDY MATERIAL CARD GRID & EMPTY STATES */}
      {/* ============================================================ */}
      <section className="container mx-auto px-4 max-w-6xl mt-8">
        
        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-emerald-400" />
              <span>
                {selectedYear === 0 ? 'All Academic Years' : `Year ${selectedYear} Material`}
              </span>
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-prevu-surface-light text-prevu-text-muted border border-prevu-surface-light">
              {filteredMaterials.length} results
            </span>
          </div>

          <Link
            href="/browse"
            className="text-xs font-semibold text-prevu-accent hover:underline flex items-center gap-1"
          >
            <span>Browse Question Papers</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* If Materials Found */}
        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredMaterials.map(resource => (
              <ResourceCard 
                key={resource.id} 
                resource={resource} 
                isBookmarked={bookmarkIds.includes(resource.id)}
                initialUpvoted={userUpvotedIds.includes(resource.id)}
                upvoteCount={upvoteCounts[resource.id] || 0}
              />
            ))}
          </div>
        ) : (
          /* Rich Empty State */
          <div className="bg-prevu-surface/60 border border-prevu-surface-light rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl space-y-6">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
              <BookOpen className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">
                No Study Materials Found for this Filter
              </h3>
              <p className="text-sm text-prevu-text-muted leading-relaxed max-w-md mx-auto">
                {selectedYear !== 0 
                  ? `Be the legend who uploads the first lecture notes or syllabus for Year ${selectedYear}!`
                  : 'Try clearing your filters or be the first student to contribute notes.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button 
                asChild
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-600/25 px-5"
              >
                <Link href={`/upload?category=study-material${selectedYear ? `&year=${selectedYear}` : ''}`}>
                  <Upload className="w-4 h-4 mr-1.5" />
                  <span>Upload Material for this Year</span>
                </Link>
              </Button>

              {hasActiveFilters && (
                <Button 
                  variant="outline" 
                  onClick={handleResetFilters}
                  className="border-prevu-surface-light text-xs hover:border-emerald-500/40"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        )}

      </section>

      {/* ============================================================ */}
      {/* 5. YEAR-WISE CURRICULUM QUICK LAUNCHPAD */}
      {/* ============================================================ */}
      <section className="container mx-auto px-4 max-w-6xl mt-16 pt-12 border-t border-prevu-surface-light">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Curriculum Launchpad</span>
          </div>
          <h3 className="text-2xl font-bold text-white">
            Explore Study Materials by Academic Year
          </h3>
          <p className="text-xs sm:text-sm text-prevu-text-muted max-w-xl mx-auto">
            Click any year below to view popular subjects and download lecture notes or exam blueprints.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(yr => {
            const yrSubjects = POPULAR_YEAR_SUBJECTS[yr as keyof typeof POPULAR_YEAR_SUBJECTS]
            const yrCount = yearCounts[yr] || 0

            return (
              <div
                key={yr}
                className="bg-prevu-surface/80 border border-prevu-surface-light hover:border-emerald-500/50 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                      Year {yr}
                    </span>
                    <span className="text-[11px] font-mono text-prevu-text-muted">
                      {yrCount} notes
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white mb-2">
                    {yr === 1 && 'First Year (Freshman)'}
                    {yr === 2 && 'Second Year (Sophomore)'}
                    {yr === 3 && 'Third Year (Junior)'}
                    {yr === 4 && 'Fourth Year (Senior)'}
                  </h4>

                  <p className="text-[11px] text-prevu-text-muted mb-4">
                    Semesters {yr * 2 - 1} & {yr * 2}
                  </p>

                  <div className="space-y-1.5 border-t border-prevu-surface-light pt-3 mb-4">
                    <span className="text-[10px] uppercase font-bold text-prevu-text-muted tracking-wider block mb-1">
                      Key Subjects:
                    </span>
                    {yrSubjects.slice(0, 3).map((sub, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedYear(yr)
                          setSearchQuery(sub.name)
                          window.scrollTo({ top: 380, behavior: 'smooth' })
                        }}
                        className="text-left w-full text-xs text-prevu-text-muted hover:text-emerald-300 truncate block transition-colors"
                      >
                        • {sub.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedYear(yr)
                    setSelectedSem('ALL')
                    window.scrollTo({ top: 350, behavior: 'smooth' })
                  }}
                  className="w-full text-xs font-semibold border-prevu-surface-light group-hover:border-emerald-500/40 text-prevu-text-muted group-hover:text-emerald-300"
                >
                  <span>Explore Year {yr} Vault</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}
