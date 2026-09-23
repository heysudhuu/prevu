import { getSupabaseAdmin } from '@/utils/supabase/admin'
import Header from '@/components/Header'
import SubjectsClient, { SubjectSummary } from './SubjectsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Subjects Directory (Semesters 1–8) | Prevu',
  description: 'Browse all university engineering subjects across Semesters 1 to 8. Access dedicated Subject Hubs, paper archives, syllabi, and study resources.'
}

export default async function SubjectsPage() {
  const supabase = getSupabaseAdmin()

  // 1. Fetch all subjects joined with branches
  const [
    { data: subjectsData },
    { data: resourcesData }
  ] = await Promise.all([
    supabase
      .from('subjects')
      .select('id, name, code, semester, year, branch_id, branches(name)')
      .order('semester', { ascending: true })
      .order('name', { ascending: true }),
    supabase
      .from('resources')
      .select('subject_id')
      .eq('status', 'approved')
  ])

  // Count approved papers per subject
  const paperCountMap = new Map<number, number>()
  resourcesData?.forEach((r: { subject_id?: number | null }) => {
    if (r.subject_id) {
      paperCountMap.set(r.subject_id, (paperCountMap.get(r.subject_id) || 0) + 1)
    }
  })

  // Format subjects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const subjects: SubjectSummary[] = (subjectsData || []).map((sub: any) => {
    const branchName = Array.isArray(sub.branches) ? sub.branches[0]?.name : sub.branches?.name
    return {
      id: sub.id,
      name: sub.name,
      code: sub.code,
      semester: sub.semester,
      year: sub.year,
      branchName: branchName || 'BE-CSE',
      paperCount: paperCountMap.get(sub.id) || 0
    }
  })

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <SubjectsClient initialSubjects={subjects} />
        </div>
      </main>
    </div>
  )
}
