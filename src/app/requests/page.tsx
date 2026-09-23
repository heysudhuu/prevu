import Header from '@/components/Header'
import RequestsPageClient, { CommunityRequestItem } from './RequestsPageClient'
import { getCommunityRequests } from './actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Community Paper Requests & Bounty Board | Prevu',
  description: 'Request missing university examination papers and upvote community requests for Chandigarh University courses.'
}

interface RequestsPageProps {
  searchParams?: Promise<{
    subject_name?: string
    exam_type?: string
    action?: string
    semester?: string
  }>
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const resolved = searchParams ? await searchParams : {}
  const prefillSubject = resolved.subject_name || ''
  const prefillExamType = resolved.exam_type || 'MST1'
  const openNewModal = resolved.action === 'new'
  const semesterFilter = resolved.semester ? parseInt(resolved.semester) : undefined

  // Fetch initial requests with upvote statuses
  const requests: CommunityRequestItem[] = await getCommunityRequests({
    semester: semesterFilter,
    status: 'open'
  })

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <RequestsPageClient
            initialRequests={requests}
            prefillSubject={prefillSubject}
            prefillExamType={prefillExamType}
            openNewModal={openNewModal}
          />
        </div>
      </main>
    </div>
  )
}
