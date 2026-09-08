import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import { ResourceCard } from '@/components/ResourceCard'
import { Button } from '@/components/ui/Button'
import { getUserBookmarkIds } from '@/app/dashboard/actions'
import { getSubjectStudyKit } from '@/lib/data/subject-guides'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  BookOpen, 
  FileText, 
  Sparkles, 
  Video, 
  BookMarked, 
  CheckCircle2, 
  GraduationCap, 
  ArrowLeft, 
  Layers, 
  Lightbulb,
  ExternalLink
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SubjectPageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: SubjectPageProps) {
  const { code } = await params
  const cleanCode = decodeURIComponent(code).toUpperCase()
  return {
    title: `${cleanCode} Study Kit & Question Papers | Prevu`,
    description: `Complete academic study kit, Previous Year Question papers (MST-1, MST-2, EST), syllabus outline, and recommended video lectures for ${cleanCode} at Chandigarh University.`
  }
}

export default async function SubjectHubPage({ params }: SubjectPageProps) {
  const { code } = await params
  const cleanCode = decodeURIComponent(code).trim().toUpperCase()
  const supabase = await createClient()
  const bookmarkIds = await getUserBookmarkIds()

  // 1. Fetch Subject from DB
  const { data: subjectData } = await supabase
    .from('subjects')
    .select(`
      id,
      name,
      code,
      year,
      semester,
      branch_id,
      branches ( name )
    `)
    .ilike('code', cleanCode)
    .maybeSingle()

  // Fallback: If not found by code directly, try finding by ID or return 404
  let subject = subjectData
  if (!subject) {
    const isId = !isNaN(parseInt(cleanCode))
    if (isId) {
      const { data: byId } = await supabase
        .from('subjects')
        .select(`id, name, code, year, semester, branch_id, branches ( name )`)
        .eq('id', parseInt(cleanCode))
        .maybeSingle()
      subject = byId
    }
  }

  if (!subject) {
    notFound()
  }

  // 2. Fetch all approved papers for this subject
  const { data: resourcesData } = await supabase
    .from('resources')
    .select(`
      id,
      exam_year,
      file_path,
      file_type,
      original_filename,
      subjects ( name, code, semester, year ),
      exam_types ( name ),
      users ( name, cu_verified, username, role )
    `)
    .eq('subject_id', subject.id)
    .eq('status', 'approved')
    .order('exam_year', { ascending: false })

  const resources = resourcesData || []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const branchName = (subject.branches as any)?.name || 'BE-CSE'

  // 3. Load Curated Study Kit (Syllabus, Playlists, Books, Exam Tips)
  const studyKit = getSubjectStudyKit(subject.code, subject.name)

  const mst1Papers = resources.filter(r => (r.exam_types as { name?: string })?.name === 'MST1')
  const mst2Papers = resources.filter(r => (r.exam_types as { name?: string })?.name === 'MST2')
  const estPapers = resources.filter(r => (r.exam_types as { name?: string })?.name === 'EST')

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />

      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl space-y-10">
          
          {/* Navigation Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-prevu-text-muted">
            <Link href="/browse" className="hover:text-white flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Archive
            </Link>
            <span>/</span>
            <span className="text-prevu-accent font-mono">{subject.code}</span>
          </div>

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
                    {branchName}
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

              {/* Action Button & Quick Stats */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0 w-full sm:w-auto">
                <Button size="sm" asChild className="bg-prevu-accent text-white font-bold shadow-lg shadow-prevu-accent/20">
                  <Link href="/upload">
                    <Sparkles className="w-3.5 h-3.5 mr-1.5" /> Upload {subject.code} Paper
                  </Link>
                </Button>

                <div className="grid grid-cols-3 gap-2 p-2.5 rounded-2xl bg-prevu-bg/80 border border-prevu-surface-light text-center">
                  <div className="px-2">
                    <span className="text-[10px] text-prevu-text-muted uppercase font-mono block">MST-1</span>
                    <span className="text-sm font-mono font-bold text-purple-300">{mst1Papers.length}</span>
                  </div>
                  <div className="px-2 border-x border-prevu-surface-light">
                    <span className="text-[10px] text-prevu-text-muted uppercase font-mono block">MST-2</span>
                    <span className="text-sm font-mono font-bold text-purple-300">{mst2Papers.length}</span>
                  </div>
                  <div className="px-2">
                    <span className="text-[10px] text-prevu-text-muted uppercase font-mono block">EST</span>
                    <span className="text-sm font-mono font-bold text-emerald-400">{estPapers.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 1: Question Papers Vault */}
          <section className="space-y-5">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-prevu-accent" />
                  Archived Question Papers ({resources.length})
                </h2>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  Verified university examination papers for this subject across previous academic years.
                </p>
              </div>
            </div>

            {resources.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {resources.map(paper => (
                  <ResourceCard 
                    key={paper.id} 
                    resource={paper} 
                    isBookmarked={bookmarkIds.includes(paper.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light text-center space-y-3">
                <BookOpen className="w-8 h-8 text-prevu-accent mx-auto" />
                <h3 className="text-base font-bold text-white">No papers archived yet for {subject.code}</h3>
                <p className="text-xs text-prevu-text-muted max-w-md mx-auto">
                  Be the first to upload an MST or EST question paper for this subject to help your classmates and earn 25 karma points!
                </p>
                <Button size="sm" asChild className="bg-prevu-accent text-white">
                  <Link href="/upload">Contribute First Paper</Link>
                </Button>
              </div>
            )}
          </section>

          {/* Section 2: Syllabus Units & Examination Blueprint */}
          <section className="space-y-5 pt-4">
            <div className="border-b border-prevu-surface-light pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-cyan-400" />
                Syllabus Outline & Examination Blueprint
              </h2>
              <p className="text-xs text-prevu-text-muted mt-0.5">
                Unit-by-unit weightage guide corresponding to Chandigarh University MST-1, MST-2, and EST exams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {studyKit.units.map(u => (
                <div key={u.unitNumber} className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-3 shadow-lg">
                  <div className="flex items-center justify-between gap-2 border-b border-prevu-surface-light pb-2.5">
                    <h3 className="text-sm font-bold text-white">
                      {u.title}
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
              ))}
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

          {/* Section 3: Recommended YouTube Playlists & Books */}
          <section className="space-y-5 pt-4">
            <div className="border-b border-prevu-surface-light pb-4">
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
                Recommended Video Lectures & Textbooks
              </h2>
              <p className="text-xs text-prevu-text-muted mt-0.5">
                Top student-voted playlists and standard academic references for mastering this syllabus.
              </p>
            </div>

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

        </div>
      </main>
    </div>
  )
}
