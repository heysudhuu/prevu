import { getPendingResources } from '../actions'
import ModerationClient from './ModerationClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Moderation Queue | Prevu Studio',
  description: 'Review, verify, edit, and approve pending student question paper submissions.'
}

export default async function AdminModerationPage() {
  const pendingResources = await getPendingResources()
  return <ModerationClient initialResources={pendingResources} />
}
