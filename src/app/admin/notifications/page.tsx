import { getNotificationsList } from '../actions'
import NotificationsClient from './NotificationsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Broadcast Notifications | Prevu Studio',
  description: 'Create and dispatch announcements to students across semesters.'
}

export default async function AdminNotificationsPage() {
  const notifications = await getNotificationsList()
  return <NotificationsClient initialNotifications={notifications} />
}
