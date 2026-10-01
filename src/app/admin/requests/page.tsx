import { getPaperRequestsList, getAdminCommunityHelpSubmissions } from '../actions'
import RequestsClient from './RequestsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Community Paper Requests & Batchmate Help | Prevu Studio',
  description: 'Manage missing paper requests requested by students and verify batchmate contributions.'
}

export default async function AdminRequestsPage() {
  const [requests, submissions] = await Promise.all([
    getPaperRequestsList(),
    getAdminCommunityHelpSubmissions('pending')
  ])

  return (
    <RequestsClient 
      initialRequests={requests} 
      initialSubmissions={submissions}
    />
  )
}
