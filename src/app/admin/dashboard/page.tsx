import { getAdminDashboardData, runSystemDiagnostics } from '../actions'
import DashboardClient from './DashboardClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Dashboard | Prevu Studio',
  description: 'System overview, key performance indicators, recent activity, and health status.'
}

export default async function AdminDashboardPage() {
  const [data, health] = await Promise.all([
    getAdminDashboardData(),
    runSystemDiagnostics()
  ])

  return <DashboardClient initialData={data} systemHealth={health} />
}
