import { getPaperRequestsList, getAdminCommunityHelpSubmissions } from '../actions'
import { getAllCbtQuestionsAdmin } from '@/lib/cbt/actions'
import RequestsClient from './RequestsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Community Requests & CBT Arena MCQs | Prevu Studio',
  description: 'Manage missing paper requests, batchmate help contributions, and student-submitted CBT Arena MCQs.'
}

export default async function AdminRequestsPage() {
  const [requests, submissions, cbtQuestions] = await Promise.all([
    getPaperRequestsList(),
    getAdminCommunityHelpSubmissions('pending'),
    getAllCbtQuestionsAdmin()
  ])

  return (
    <RequestsClient 
      initialRequests={requests} 
      initialSubmissions={submissions}
      initialCbtQuestions={JSON.parse(JSON.stringify(cbtQuestions || []))}
    />
  )
}

