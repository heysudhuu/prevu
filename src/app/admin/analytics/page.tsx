import { getAdminStats, getApprovedResources, getAllUsers, getLiveTrafficAnalytics } from '../actions'
import AnalyticsClient from './AnalyticsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Analytics & Traffic Insights | Prevu Studio',
  description: 'Live visitors count, daily website view metrics, top visited pages, exam distribution, and student growth.'
}

export default async function AdminAnalyticsPage() {
  const [stats, resources, users, traffic] = await Promise.all([
    getAdminStats(),
    getApprovedResources(),
    getAllUsers(),
    getLiveTrafficAnalytics()
  ])

  return (
    <AnalyticsClient
      stats={stats}
      resources={resources}
      users={users}
      initialTraffic={traffic}
    />
  )
}
