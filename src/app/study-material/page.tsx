import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import { getUserBookmarkIds } from '@/app/dashboard/actions'
import StudyMaterialClient from './StudyMaterialClient'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Study Material & Notes Vault (All Years) | Prevu',
  description: 'Access curated lecture notes, syllabus blueprints, assignments, lab manuals, and revision cheat sheets for all academic years (Year 1 to Year 4) at Chandigarh University.',
}

export default async function StudyMaterialPage({
  searchParams,
}: {
  searchParams: Promise<{
    year?: string
    sem?: string
    category?: string
    branch?: string
    search?: string
  }>
}) {
  const supabase = await createClient()
  const bookmarkIds = await getUserBookmarkIds()
  const params = await searchParams

  const [
    { data: branchesData },
    { data: subjectsData },
    { data: examTypesData },
    { data: resourcesData }
  ] = await Promise.all([
    supabase.from('branches').select('*').order('name'),
    supabase.from('subjects').select('*').order('name'),
    supabase.from('exam_types').select('*').order('id'),
    supabase
      .from('resources')
      .select(`
        id, exam_year, file_path, file_type, original_filename, created_at, download_count,
        subjects!inner ( id, name, code, semester, year, branch_id ),
        exam_types!inner ( id, name ),
        users!inner ( name, cu_verified, username, role )
      `)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
  ])

  const defaultBranches = [
    { id: 1, name: 'BE-CSE' },
    { id: 2, name: 'BE-CSE (AI & ML)' },
    { id: 3, name: 'BE-CSE (Data Science)' },
    { id: 4, name: 'BCA' },
    { id: 5, name: 'MCA' }
  ]

  const branches = (branchesData && branchesData.length > 0) ? branchesData : defaultBranches
  const subjects = subjectsData || []
  const allResources = resourcesData || []

  // Filter resources to identify study materials (anything that is not strictly a PYQ like MST1, MST2, EST)
  // Or if it explicitly matches study material tags
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const studyMaterials = allResources.filter((r: any) => {
    const etName = Array.isArray(r.exam_types) ? r.exam_types[0]?.name : r.exam_types?.name
    const typeName = (etName || '').toUpperCase().replace(/[\s_-]/g, '')
    return !['MST1', 'MST2', 'EST'].includes(typeName)
  })

  // Also pass all resources so users can toggle or see related materials if desired
  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg">
      <Header />
      <main className="flex-1">
        <StudyMaterialClient
          initialMaterials={studyMaterials}
          allResources={allResources}
          subjects={subjects}
          branches={branches}
          bookmarkIds={bookmarkIds}
          initialYear={params.year ? parseInt(params.year) : undefined}
          initialSem={params.sem ? parseInt(params.sem) : undefined}
          initialCategory={params.category}
          initialBranch={params.branch ? parseInt(params.branch) : undefined}
          initialSearch={params.search || ''}
        />
      </main>
    </div>
  )
}
