import { getReportsList } from '../actions'
import { getPlatformFeedbackList } from '@/lib/feedback/actions'
import ReportsClient from './ReportsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Content Reports & Student Feedback | Prevu Studio',
  description: 'Manage student reports, star ratings, and platform improvement suggestions.'
}

export default async function AdminReportsPage() {
  const [reports, feedbackSummary] = await Promise.all([
    getReportsList(),
    getPlatformFeedbackList()
  ])
  return <ReportsClient initialReports={reports} initialFeedback={feedbackSummary} />
}
