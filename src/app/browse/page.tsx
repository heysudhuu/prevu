import { createClient } from '@/utils/supabase/server'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Header from '@/components/Header'
import { getUserBookmarkIds, getUserUpvotedResourceIds, getResourceUpvoteCounts } from '@/app/dashboard/actions'
import BrowseFilterBar from '@/components/browse/BrowseFilterBar'
import SmartTopicSearch from '@/components/browse/SmartTopicSearch'
import CourseWorkspaceDeck from '@/components/browse/CourseWorkspaceDeck'
import BrowseResourceList from '@/components/browse/BrowseResourceList'
import { Sparkles, MessageSquarePlus, FileQuestion, ChevronLeft, ChevronRight } from 'lucide-react'
import { resolveSearchKeywords } from '@/lib/search/smartSearch'

export const dynamic = 'force-dynamic'

const PAGE_SIZE = 12

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{
    year?: string
    sem?: string
    subject?: string
    type?: string
    branch?: string
    search?: string
    page?: string
  }>
}) {
  const supabase = await createClient()
  const [bookmarkIds, userUpvotedIds, upvoteCounts] = await Promise.all([
    getUserBookmarkIds(),
    getUserUpvotedResourceIds(),
    getResourceUpvoteCounts()
  ])

  // Parse filters
  const params = await searchParams
  const yearFilter = params.year ? parseInt(params.year) : undefined
  const semFilter = params.sem ? parseInt(params.sem) : undefined
  const subjectFilter = params.subject ? parseInt(params.subject) : undefined
  const typeFilter = params.type ? parseInt(params.type) : undefined
  const branchFilter = params.branch ? parseInt(params.branch) : undefined
  const searchFilter = params.search?.trim() || ''
  const currentPage = Math.max(1, parseInt(params.page || '1') || 1)

  // Fetch branches, subjects, and exam types
  const [
    { data: branchesData },
    { data: subjectsData },
    { data: examTypesData }
  ] = await Promise.all([
    supabase.from('branches').select('*').order('name'),
    supabase.from('subjects').select('*').order('name'),
    supabase.from('exam_types').select('*').order('id')
  ])

  const defaultBranches = [
    { id: 1, name: 'BE-CSE' },
    { id: 2, name: 'BE-CSE (AI & ML)' },
    { id: 3, name: 'BE-CSE (Data Science)' },
    { id: 4, name: 'BCA' },
    { id: 5, name: 'MCA' }
  ]
  const branches = (branchesData && branchesData.length > 0) ? branchesData : defaultBranches

  const defaultExamTypes: { id: number, name: string }[] = [
    { id: 1, name: 'MST1' },
    { id: 2, name: 'MST2' },
    { id: 3, name: 'EST' }
  ]
  const resolvedExamTypes = (examTypesData && examTypesData.length > 0) ? examTypesData : defaultExamTypes
  const subjects = subjectsData || []

  // Resolve search keywords, acronyms, and aliases
  const resolved = resolveSearchKeywords(searchFilter)
  
  // Find matching subject IDs using smart search logic across all database subjects
  let matchingSubjectIds: number[] = []
  if (resolved.normalized) {
    const matched = subjects.filter((s) => {
      const sName = s.name.toLowerCase()
      const sCode = s.code.toLowerCase()

      // Exact or partial canonical match
      if (resolved.canonicalNames.some((c) => sName.includes(c.toLowerCase()) || c.toLowerCase().includes(sName))) {
        return true
      }

      // Any pattern match
      if (resolved.searchPatterns.some((p) => sName.includes(p) || sCode.includes(p))) {
        return true
      }

      return false
    })
    matchingSubjectIds = matched.map((s) => s.id)
  }

  // Cross-semester intelligent handling:
  // If user filtered by semester (e.g. sem=4) but searched for a course in another semester (e.g. OS in Sem 3),
  // expand semester filter so user gets the actual papers instead of an empty screen.
  let effectiveSemFilter = semFilter
  let crossSemesterNotice: { searchedTerm: string; actualSemesters: number[] } | null = null

  if (semFilter && searchFilter && matchingSubjectIds.length > 0) {
    const subjectsInRequestedSem = subjects.filter(
      (s) => s.semester === semFilter && matchingSubjectIds.includes(s.id)
    )

    if (subjectsInRequestedSem.length === 0) {
      const actualSemesters = Array.from(
        new Set(
          subjects
            .filter((s) => matchingSubjectIds.includes(s.id) && s.semester)
            .map((s) => s.semester as number)
        )
      ).sort((a, b) => a - b)

      if (actualSemesters.length > 0) {
        effectiveSemFilter = undefined // Expand so user gets papers
        crossSemesterNotice = {
          searchedTerm: searchFilter,
          actualSemesters,
        }
      }
    }
  }

  // Build Query with Server-side filtering
  let query = supabase
    .from('resources')
    .select(`
      id, exam_year, file_path, file_type, original_filename,
      subjects!inner ( name, code, semester, year, branch_id ),
      exam_types!inner ( name ),
      users!inner ( name, cu_verified, username, role )
    `, { count: 'exact' })
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (branchFilter) query = query.eq('subjects.branch_id', branchFilter)
  if (yearFilter) query = query.eq('subjects.year', yearFilter)
  if (effectiveSemFilter) query = query.eq('subjects.semester', effectiveSemFilter)
  if (subjectFilter) query = query.eq('subject_id', subjectFilter)
  if (typeFilter) query = query.eq('exam_type_id', typeFilter)

  // Server-side keyword search (sanitized against PostgREST injection)
  if (searchFilter) {
    const sanitizedSearch = searchFilter.replace(/[,()]/g, '').trim()
    if (matchingSubjectIds.length > 0) {
      query = query.or(`subject_id.in.(${matchingSubjectIds.join(',')}),original_filename.ilike.%${sanitizedSearch}%`)
    } else {
      const isYear = !isNaN(parseInt(sanitizedSearch)) && parseInt(sanitizedSearch) > 2000
      if (isYear) {
        query = query.eq('exam_year', parseInt(sanitizedSearch))
      } else {
        query = query.ilike('original_filename', `%${sanitizedSearch}%`)
      }
    }
  }

  // Calculate range pagination
  const from = (currentPage - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1
  query = query.range(from, to)

  const { data: resourcesData, count } = await query
  const resources = resourcesData || []
  const totalCount = count || 0
  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1

  // Helper function to build page URLs while preserving current filters
  const buildPageUrl = (targetPage: number) => {
    const p = new URLSearchParams()
    if (params.search) p.set('search', params.search)
    if (params.branch) p.set('branch', params.branch)
    if (params.year) p.set('year', params.year)
    if (params.sem) p.set('sem', params.sem)
    if (params.subject) p.set('subject', params.subject)
    if (params.type) p.set('type', params.type)
    p.set('page', String(targetPage))
    return `/browse?${p.toString()}`
  }

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg">
      <Header />
      
      <main className="flex-1">
        {/* RESOURCE ARCHIVE SECTION */}
        <section id="resources" className="container mx-auto px-4 py-8 sm:py-10 max-w-7xl">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4 border-b border-prevu-surface-light pb-6">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 uppercase tracking-wider">
                  Verified Archive
                </span>
                <span className="text-xs font-mono text-prevu-text-muted">
                  {totalCount} Question Papers Available
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                Academic Resource Archive
              </h1>
              <p className="text-xs sm:text-sm text-prevu-text-muted mt-1">
                Browse verified Previous Year Questions (MST-1, MST-2, EST) & study materials for Chandigarh University.
              </p>
            </div>

            <Button size="sm" className="shadow-lg shadow-prevu-accent/20 text-xs font-bold" asChild>
              <Link href="/upload">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Contribute Paper
              </Link>
            </Button>
          </div>

          {/* Subject-First Course Workspace Deck */}
          <CourseWorkspaceDeck
            subjects={subjects}
            currentSem={semFilter}
            currentSubject={subjectFilter}
            currentType={typeFilter}
          />

          {/* Interactive Filter Bar */}
          <BrowseFilterBar 
            subjects={subjects}
            examTypes={resolvedExamTypes}
            branches={branches}
            currentBranch={branchFilter}
            currentYear={yearFilter}
            currentSem={semFilter}
            currentSubject={subjectFilter}
            currentType={typeFilter}
            currentSearch={searchFilter}
          />

          {/* AI Auto-Tagged Syllabus Topic Search Bar */}
          <div className="my-5">
            <SmartTopicSearch />
          </div>

          {/* Cross-Semester Discovery Notice */}
          {crossSemesterNotice && (
            <div className="my-5 p-4 rounded-2xl bg-gradient-to-r from-purple-950/70 via-prevu-surface to-purple-950/70 border border-purple-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl backdrop-blur-xl animate-fade-in">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                </div>
                <div className="text-xs sm:text-sm text-purple-100">
                  Found question papers for <strong className="text-white">&ldquo;{crossSemesterNotice.searchedTerm}&rdquo;</strong> in <strong className="text-purple-300">Semester {crossSemesterNotice.actualSemesters.join(' & ')}</strong> (none currently filed under Semester {semFilter}).
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <Button size="sm" className="h-8 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-sm" asChild>
                  <Link href={`/browse?sem=${crossSemesterNotice.actualSemesters[0]}&search=${encodeURIComponent(searchFilter)}`}>
                    Filter to Sem {crossSemesterNotice.actualSemesters[0]}
                  </Link>
                </Button>
                <Button size="sm" variant="outline" className="h-8 text-xs border-purple-500/40 text-purple-200 hover:text-white" asChild>
                  <Link href={`/browse?search=${encodeURIComponent(searchFilter)}`}>
                    View All
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {/* Unified Resources List (Supports Grid & Compact Table View) */}
          <section className="mt-6">
            {resources.length > 0 ? (
              <>
                <BrowseResourceList
                  resources={resources}
                  bookmarkIds={bookmarkIds}
                  userUpvotedIds={userUpvotedIds}
                  upvoteCounts={upvoteCounts}
                />

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-prevu-surface-light/80">
                    <div className="text-xs text-prevu-text-muted font-mono">
                      Showing <strong className="text-white">{from + 1}</strong> to <strong className="text-white">{Math.min(to + 1, totalCount)}</strong> of <strong className="text-white">{totalCount}</strong> papers
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage <= 1}
                        className="h-9 px-3 text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white disabled:opacity-40"
                        asChild={currentPage > 1}
                      >
                        {currentPage > 1 ? (
                          <Link href={buildPageUrl(currentPage - 1)}>
                            <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                          </Link>
                        ) : (
                          <span><ChevronLeft className="w-3.5 h-3.5 mr-1 inline" /> Previous</span>
                        )}
                      </Button>

                      <div className="flex items-center gap-1 px-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                          .map((page, index, array) => {
                            const isCurrent = page === currentPage
                            const prevPage = array[index - 1]
                            const showEllipsis = prevPage && page - prevPage > 1

                            return (
                              <div key={page} className="flex items-center">
                                {showEllipsis && (
                                  <span className="px-1.5 text-prevu-text-muted text-xs">...</span>
                                )}
                                <Button
                                  variant={isCurrent ? 'default' : 'ghost'}
                                  size="sm"
                                  className={`h-8 w-8 p-0 text-xs font-mono font-bold rounded-lg ${
                                    isCurrent 
                                      ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/20' 
                                      : 'text-prevu-text-muted hover:text-white'
                                  }`}
                                  asChild={!isCurrent}
                                >
                                  {isCurrent ? (
                                    <span>{page}</span>
                                  ) : (
                                    <Link href={buildPageUrl(page)}>{page}</Link>
                                  )}
                                </Button>
                              </div>
                            )
                          })}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage >= totalPages}
                        className="h-9 px-3 text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white disabled:opacity-40"
                        asChild={currentPage < totalPages}
                      >
                        {currentPage < totalPages ? (
                          <Link href={buildPageUrl(currentPage + 1)}>
                            Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                          </Link>
                        ) : (
                          <span>Next <ChevronRight className="w-3.5 h-3.5 ml-1 inline" /></span>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 border border-prevu-surface-light bg-prevu-surface/60 rounded-3xl p-8 space-y-4 max-w-xl mx-auto shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-prevu-surface border border-prevu-surface-light flex items-center justify-center mx-auto text-prevu-text-muted">
                  <FileQuestion className="w-8 h-8 text-prevu-accent" />
                </div>
                
                <h3 className="text-xl font-bold text-white">
                  No question papers found
                </h3>
                
                <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
                  {searchFilter 
                    ? `We couldn't find any uploaded papers matching "${searchFilter}". You can request batchmates to upload it!`
                    : "No approved question papers match the selected filters."
                  }
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <Button variant="outline" size="sm" asChild className="border-prevu-surface-light text-xs">
                    <Link href="/browse">Clear All Filters</Link>
                  </Button>
                  
                  <Button size="sm" className="text-xs bg-prevu-accent text-white font-bold" asChild>
                    <Link href="/dashboard?tab=requests&action=new">
                      <MessageSquarePlus className="w-3.5 h-3.5 mr-1.5" /> Request this Paper
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </section>

        </section>
      </main>
    </div>
  )
}
