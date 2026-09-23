import { getReportsList } from '../actions'
import ReportsClient from './ReportsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Content Reports | Prevu Studio',
  description: 'Manage and resolve student reports on incorrect metadata, duplicate papers, or copyright issues.'
}

export default async function AdminReportsPage() {
  const reports = await getReportsList()
  return <ReportsClient initialReports={reports} />
}
