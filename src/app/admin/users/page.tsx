import { getAllUsers, getAdminSession } from '../actions'
import UsersClient from './UsersClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'User Management | Prevu Studio',
  description: 'Directory of student, faculty, and administrative accounts with role assignment and account controls.'
}

export default async function AdminUsersPage() {
  const [users, session] = await Promise.all([
    getAllUsers(),
    getAdminSession()
  ])

  return (
    <UsersClient
      initialUsers={users}
      isSuperAdmin={session?.isSuperAdmin || false}
      currentAdminId={session?.uid || ''}
    />
  )
}
