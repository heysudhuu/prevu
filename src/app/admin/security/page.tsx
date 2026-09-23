import { getSecurityOverview } from '../actions'
import SecurityClient from './SecurityClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Security Center | Prevu Studio',
  description: 'Privileged role monitoring, administrative access logs, and operational security status.'
}

export default async function AdminSecurityPage() {
  const overview = await getSecurityOverview()
  return <SecurityClient overview={overview} />
}
