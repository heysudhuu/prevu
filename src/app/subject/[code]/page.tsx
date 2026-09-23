import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import { getUserBookmarkIds } from '@/app/dashboard/actions'
import { getSubjectStudyKit } from '@/lib/data/subject-guides'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import SubjectHubClient from './SubjectHubClient'

export const dynamic = 'force-dynamic'

interface SubjectPageProps {
  params: Promise<{ code: string }>
}

export async function generateMetadata({ params }: SubjectPageProps) {
  const { code } = await params
  const cleanCode = decodeURIComponent(code).toUpperCase()
  return {
    title: `${cleanCode} Study Kit, Coverage & Question Papers | Prevu`,
    description: `Complete academic study kit, Question Papers archive (MST-1, MST-2, EST), coverage matrix, syllabus blueprint, and recommended playlists for ${cleanCode} at Chandigarh University.`
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

  // 3. Load Curated Study Kit (Syllabus, Playlists, Books, Exam Tips)
  const studyKit = getSubjectStudyKit(subject.code, subject.name)

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl space-y-6">
          
          {/* Navigation Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-prevu-text-muted">
            <Link href="/browse" className="hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Archive
            </Link>
            <span>/</span>
            <Link href="/subjects" className="hover:text-white transition-colors">
              Subjects Directory
            </Link>
            <span>/</span>
            <span className="text-prevu-accent font-mono font-semibold">{subject.code}</span>
          </div>

          <SubjectHubClient
            subject={subject}
            resources={resources}
            bookmarkIds={bookmarkIds}
            studyKit={studyKit}
          />

        </div>
      </main>
    </div>
  )
}
