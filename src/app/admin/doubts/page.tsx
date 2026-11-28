import { getAdminSession } from '../actions'
import { getAdminDoubtsData } from './actions'
import DoubtsManagerClient from '@/components/admin/DoubtsManagerClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Student Doubts & Discussions | Prevu Studio',
  description: 'Reply to student paper doubts, pin verified answers, and moderate discussions.'
}

export default async function AdminDoubtsPage() {
  const [session, initialData] = await Promise.all([
    getAdminSession(),
    getAdminDoubtsData()
  ])

  return (
    <DoubtsManagerClient
      initialData={initialData}
      adminEmail={session?.email || 'admin@prevu.app'}
    />
  )
}
