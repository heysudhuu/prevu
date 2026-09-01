import { createClient } from '@/utils/supabase/server'
import { ResourceCard } from '@/components/ResourceCard'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Header from '@/components/Header'
import { getUserBookmarkIds } from '@/app/dashboard/actions'
import BrowseFilterBar from '@/components/browse/BrowseFilterBar'
import { Sparkles, MessageSquarePlus, FileQuestion } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function BrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string, sem?: string, subject?: string, type?: string, search?: string }>
}) {
  const supabase = await createClient()
  const bookmarkIds = await getUserBookmarkIds()

  // Parse filters
  const params = await searchParams
  const yearFilter = params.year ? parseInt(params.year) : undefined
  const semFilter = params.sem ? parseInt(params.sem) : undefined
  const subjectFilter = params.subject ? parseInt(params.subject) : undefined
  const typeFilter = params.type ? parseInt(params.type) : undefined
  const searchFilter = params.search?.trim() || ''

  // Fetch filter options
  const { data: subjectsData } = await supabase.from('subjects').select('*').order('name')
  const { data: examTypesData } = await supabase.from('exam_types').select('*').order('id')
  const defaultExamTypes: { id: number, name: string }[] = [
    { id: 1, name: 'MST1' },
    { id: 2, name: 'MST2' },
    { id: 3, name: 'EST' }
  ]
  const resolvedExamTypes = (examTypesData && examTypesData.length > 0) ? examTypesData : defaultExamTypes
  const subjects = subjectsData || []

  // Fetch resources
  let query = supabase
    .from('resources')
    .select(`
      id, exam_year,
      subjects!inner ( name, code, semester, year ),
      exam_types!inner ( name ),
      users!inner ( name, cu_verified, username, role )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (yearFilter) query = query.eq('subjects.year', yearFilter)
  if (semFilter) query = query.eq('subjects.semester', semFilter)
  if (subjectFilter) query = query.eq('subject_id', subjectFilter)
  if (typeFilter) query = query.eq('exam_type_id', typeFilter)

  const { data: rawResources } = await query

  // Apply client-side keyword search filter if provided
  const resources = (rawResources || []).filter(r => {
    if (!searchFilter) return true
    const term = searchFilter.toLowerCase()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subName = (r.subjects as any)?.name?.toLowerCase() || ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subCode = (r.subjects as any)?.code?.toLowerCase() || ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const examType = (r.exam_types as any)?.name?.toLowerCase() || ''
    const year = String(r.exam_year || '')
    return subName.includes(term) || subCode.includes(term) || examType.includes(term) || year.includes(term)
  })

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
                  {resources.length} Question Papers
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

          {/* Branch Expansion Notice Ribbon */}
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-purple-950/30 via-prevu-surface to-indigo-950/30 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="text-base">🚀</span>
              <p className="text-prevu-text-muted">
                <strong className="text-purple-300">From another branch (ECE, Mech, Civil, Biotech, Management)?</strong> We are actively collecting question papers for your departments too!
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" asChild className="h-7 text-[11px] border-purple-500/30 text-purple-300 hover:bg-purple-500/10">
                <Link href="/dashboard?tab=requests">
                  Request Your Branch Papers
                </Link>
              </Button>
            </div>
          </div>

          {/* Interactive Filter Bar */}
          <BrowseFilterBar 
            subjects={subjects}
            examTypes={resolvedExamTypes}
            currentYear={yearFilter}
            currentSem={semFilter}
            currentSubject={subjectFilter}
            currentType={typeFilter}
            currentSearch={searchFilter}
          />

          {/* Resources Grid */}
          <section>
            {resources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
                {resources.map((resource) => (
                  <ResourceCard 
                    key={resource.id} 
                    resource={resource} 
                    isBookmarked={bookmarkIds.includes(resource.id)}
                  />
                ))}
              </div>
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
                    <Link href={`/dashboard?tab=requests`}>
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
