import { getAuditLogsList } from '../actions'
import AuditLogClient from './AuditLogClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Audit Logs | Prevu Studio',
  description: 'Immutable record of administrative operations, content verifications, and system modifications.'
}

export default async function AdminAuditLogPage() {
  const logs = await getAuditLogsList(100)
  return <AuditLogClient initialLogs={logs} />
}
