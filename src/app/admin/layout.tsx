import { redirect } from 'next/navigation'
import { getAdminSession, getAdminStats } from './actions'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { AdminLayoutShell } from '@/components/admin/layout/AdminLayoutShell'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Prevu Admin Studio | BE-CSE Vault',
  description: 'Enterprise university resource administration platform for Prevu.'
}

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const session = await getAdminSession()
  if (!session) {
    redirect('/')
  }

  // Fetch real-time badge counts
  const stats = await getAdminStats()

  // Fetch search items for ⌘K palette (lightweight)
  const supabase = getSupabaseAdmin()
  const [{ data: papers }, { data: users }] = await Promise.all([
    supabase
      .from('resources')
      .select('id, exam_year, subjects(name, code)')
      .limit(30),
    supabase
      .from('users')
      .select('id, name, username, email, student_uid')
      .limit(30)
  ])

  const searchPapers = (papers || []).map((item: unknown) => {
    const p = item as { id: string; exam_year?: number; subjects?: { name?: string; code?: string } | Array<{ name?: string; code?: string }> | null }
    const sub = Array.isArray(p.subjects) ? p.subjects[0] : p.subjects
    return {
      id: p.id,
      title: sub?.name || 'Untitled Paper',
      code: sub?.code || 'CSE',
      year: p.exam_year
    }
  })

  const searchUsers = (users || []).map((u: { id: string; name: string; username?: string; email?: string; student_uid?: string }) => ({
    id: u.id,
    name: u.name,
    username: u.username,
    email: u.email,
    student_uid: u.student_uid
  }))

  return (
    <AdminLayoutShell
      adminEmail={session.email}
      adminRole={session.isSuperAdmin ? 'Super Admin' : session.role.toUpperCase()}
      badgeCounts={{
        pendingReview: stats?.pendingCount || 0,
        openReports: stats?.openReportsCount || 0,
        openRequests: stats?.openRequestsCount || 0
      }}
      searchPapers={searchPapers}
      searchUsers={searchUsers}
    >
      {children}
    </AdminLayoutShell>
  )
}
