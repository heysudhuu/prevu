import Header from '@/components/Header'
import RequestsPageClient, { CommunityRequestItem } from './RequestsPageClient'
import { getCommunityRequests } from './actions'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Community Paper Requests, Study Material & Doubts | Prevu',
  description: 'Request missing university examination papers, study materials, or academic doubts. Batchmates share materials verified by the admin department.'
}

interface RequestsPageProps {
  searchParams?: Promise<{
    subject_name?: string
    exam_type?: string
    action?: string
    semester?: string
    type?: string
  }>
}

export default async function RequestsPage({ searchParams }: RequestsPageProps) {
  const resolved = searchParams ? await searchParams : {}
  const prefillSubject = resolved.subject_name || ''
  const prefillExamType = resolved.exam_type || 'MST1'
  const prefillRequestType = resolved.type || 'pyq'
  const openNewModal = resolved.action === 'new'
  const semesterFilter = resolved.semester ? parseInt(resolved.semester) : undefined

  // Determine authenticated user session
  let currentUser = null
  const token = (await cookies()).get('firebase-token')?.value

  if (token) {
    try {
      const decoded = await authAdmin.verifyIdToken(token)
      const supabase = getSupabaseAdmin()
      const { data: dbUser } = await supabase
        .from('users')
        .select('id, name, username, cu_verified, email, role')
        .eq('id', decoded.uid)
        .maybeSingle()

      currentUser = {
        uid: decoded.uid,
        email: decoded.email,
        name: dbUser?.name || decoded.name || decoded.email?.split('@')[0] || 'Student',
        username: dbUser?.username,
        cu_verified: dbUser?.cu_verified ?? (decoded.email?.endsWith('@cuchd.in') || false),
        role: dbUser?.role || 'student'
      }
    } catch {
      currentUser = null
    }
  }

  // Fetch initial requests with upvote statuses and responses
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const requests: any = await getCommunityRequests({
    semester: semesterFilter,
    status: 'ALL'
  })

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <RequestsPageClient
            initialRequests={requests}
            currentUser={currentUser}
            prefillSubject={prefillSubject}
            prefillExamType={prefillExamType}
            prefillRequestType={prefillRequestType}
            openNewModal={openNewModal}
          />
        </div>
      </main>
    </div>
  )
}
