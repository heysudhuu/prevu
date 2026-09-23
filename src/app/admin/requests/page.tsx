import { getPaperRequestsList } from '../actions'
import RequestsClient from './RequestsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Community Paper Requests | Prevu Studio',
  description: 'Manage missing paper requests requested by students and update fulfillment status.'
}

export default async function AdminRequestsPage() {
  const requests = await getPaperRequestsList()
  return <RequestsClient initialRequests={requests} />
}
