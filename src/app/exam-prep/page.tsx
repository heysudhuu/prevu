import { getSupabaseAdmin } from '@/utils/supabase/admin'
import Header from '@/components/Header'
import ExamPrepClient, { ExamPrepSubject } from './ExamPrepClient'
import { getUserBookmarkIds } from '@/app/dashboard/actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Exam Preparation Workspace (MST-1, MST-2, EST) | Prevu',
  description: 'Targeted university exam prep workspace. Select your semester and course to view available past papers, syllabus weightage units, and scoring advice.'
}

interface ExamPrepPageProps {
  searchParams?: Promise<{
    sem?: string
    subject?: string
    type?: string
  }>
}

export default async function ExamPrepPage({ searchParams }: ExamPrepPageProps) {
  const resolved = searchParams ? await searchParams : {}
  const semParam = resolved.sem ? parseInt(resolved.sem) : undefined
  const subjectParam = resolved.subject ? parseInt(resolved.subject) : undefined
  const typeParam = resolved.type || 'MST1'

  const supabase = getSupabaseAdmin()
  const bookmarkIds = await getUserBookmarkIds()

  // 1. Fetch all subjects
  const { data: subjectsData } = await supabase
    .from('subjects')
    .select('id, name, code, semester, year')
    .order('semester', { ascending: true })
    .order('name', { ascending: true })

  const subjects: ExamPrepSubject[] = subjectsData || []

  // 2. Fetch approved papers
  const { data: papersData } = await supabase
    .from('resources')
    .select(`
      id,
      subject_id,
      exam_year,
      file_path,
      file_type,
      original_filename,
      subjects ( name, code, semester, year ),
      exam_types ( name ),
      users ( name, cu_verified, username, role )
    `)
    .eq('status', 'approved')
    .order('exam_year', { ascending: false })

  const papers = papersData || []

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <ExamPrepClient
            subjects={subjects}
            initialPapers={papers}
            bookmarkIds={bookmarkIds}
            initialSem={semParam}
            initialSubjectId={subjectParam}
            initialExamType={typeParam}
          />
        </div>
      </main>
    </div>
  )
}
