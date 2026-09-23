import { runSystemDiagnostics } from '../actions'
import SystemHealthClient from './SystemHealthClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'System Health Diagnostics | Prevu Studio',
  description: 'Real-time health monitoring of PostgreSQL database, Supabase Storage, and Firebase authentication services.'
}

export default async function AdminSystemPage() {
  const diagnostics = await runSystemDiagnostics()
  return <SystemHealthClient initialDiagnostics={diagnostics} />
}
