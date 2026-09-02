import { redirect } from 'next/navigation'
import { 
  checkAdmin, 
  getAdminStats, 
  getPendingResources, 
  getApprovedResources, 
  getAllUsers, 
  getAllSubjects 
} from './actions'
import { getStudentSuggestions } from '@/app/suggestions/actions'
import AdminDashboardClient from './AdminDashboardClient'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) {
    redirect('/')
  }

  const [
    stats,
    pendingResources,
    approvedResources,
    users,
    subjects,
    suggestions
  ] = await Promise.all([
    getAdminStats(),
    getPendingResources(),
    getApprovedResources(),
    getAllUsers(),
    getAllSubjects(),
    getStudentSuggestions()
  ])

  return (
    <AdminDashboardClient
      stats={stats}
      pendingResources={pendingResources}
      approvedResources={approvedResources}
      users={users}
      subjects={subjects}
      suggestions={suggestions}
    />
  )
}
