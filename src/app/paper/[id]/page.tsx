import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { notFound } from 'next/navigation'
import Header from '@/components/Header'
import PaperDetailClient from './PaperDetailClient'
import { getUserBookmarkIds } from '@/app/dashboard/actions'

export const dynamic = 'force-dynamic'

interface PaperPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PaperPageProps) {
  const { id } = await params
  const supabase = getSupabaseAdmin()

  const { data: paper } = await supabase
    .from('resources')
    .select(`
      exam_year,
      subjects ( name, code, semester ),
      exam_types ( name )
    `)
    .eq('id', id)
    .maybeSingle()

  if (!paper) {
    return { title: 'Question Paper Not Found | Prevu' }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub = Array.isArray(paper.subjects) ? paper.subjects[0] : (paper.subjects as any)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const et = Array.isArray(paper.exam_types) ? paper.exam_types[0] : (paper.exam_types as any)

  const subjectName = sub?.name || 'Question Paper'
  const code = sub?.code || 'CSE'
  const examName = et?.name || 'MST'

  return {
    title: `${subjectName} (${code}) ${paper.exam_year} ${examName} Paper | Prevu`,
    description: `Download and preview the official ${paper.exam_year} ${examName} question paper for ${subjectName} (${code}) at Chandigarh University.`
  }
}

export default async function PaperDetailPage({ params }: PaperPageProps) {
  const { id } = await params
  const supabase = getSupabaseAdmin()
  const bookmarkIds = await getUserBookmarkIds()

  // 1. Fetch Paper
  const { data: paper, error } = await supabase
    .from('resources')
    .select(`
      *,
      subjects ( id, name, code, semester, year, branch_id ),
      exam_types ( id, name ),
      users ( id, name, username, email, cu_verified, role )
    `)
    .eq('id', id)
    .maybeSingle()

  if (error || !paper) {
    notFound()
  }

  // 2. Fetch Related Papers from Same Subject
  const { data: sameSubject } = await supabase
    .from('resources')
    .select(`
      id, exam_year, file_path, file_type, original_filename,
      subjects ( name, code, semester, year ),
      exam_types ( name ),
      users ( name, cu_verified, username, role )
    `)
    .eq('subject_id', paper.subject_id)
    .eq('status', 'approved')
    .neq('id', paper.id)
    .order('exam_year', { ascending: false })
    .limit(4)

  // 3. Fetch Same Exam Type Papers in same semester
  let sameType: Array<Record<string, unknown>> = []
  if (paper.subjects?.semester) {
    const { data: typeMatches } = await supabase
      .from('resources')
      .select(`
        id, exam_year, file_path, file_type, original_filename,
        subjects!inner ( name, code, semester, year ),
        exam_types ( name ),
        users ( name, cu_verified, username, role )
      `)
      .eq('exam_type_id', paper.exam_type_id)
      .eq('subjects.semester', paper.subjects.semester)
      .eq('status', 'approved')
      .neq('id', paper.id)
      .order('created_at', { ascending: false })
      .limit(4)

    if (typeMatches) sameType = typeMatches
  }

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <PaperDetailClient
            paper={paper}
            initialIsBookmarked={bookmarkIds.includes(paper.id)}
            sameSubjectPapers={sameSubject || []}
            sameTypePapers={sameType || []}
          />
        </div>
      </main>
    </div>
  )
}
