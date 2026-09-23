import { getAdminStats, getApprovedResources, getAllUsers } from '../actions'
import AnalyticsClient from './AnalyticsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Analytics & Trends | Prevu Studio',
  description: 'Curricular statistics, exam pattern distribution, top downloaded resources, and student growth.'
}

export default async function AdminAnalyticsPage() {
  const [stats, resources, users] = await Promise.all([
    getAdminStats(),
    getApprovedResources(),
    getAllUsers()
  ])

  return (
    <AnalyticsClient
      stats={stats}
      resources={resources}
      users={users}
    />
  )
}
