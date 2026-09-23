import { getCalendarEventsList } from '../actions'
import CalendarClient from './CalendarClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Academic Calendar | Prevu Studio',
  description: 'Manage Chandigarh University official academic schedules, MST, and EST exam dates.'
}

export default async function AdminCalendarPage() {
  const events = await getCalendarEventsList()
  return <CalendarClient initialEvents={events} />
}
