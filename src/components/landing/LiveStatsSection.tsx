import { getSupabaseAdmin } from '@/utils/supabase/admin'
import LiveStatsClient from './LiveStatsClient'

export default async function LiveStatsSection() {
  const supabase = getSupabaseAdmin()

  const [papersRes, usersRes, requestsRes, studyRes] = await Promise.allSettled([
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('paper_requests').select('id', { count: 'exact', head: true }).eq('status', 'fulfilled'),
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('resource_category', 'study_material').eq('is_verified', true),
  ])

  const papers = papersRes.status === 'fulfilled' ? (papersRes.value.count ?? 0) : 0
  const users = usersRes.status === 'fulfilled' ? (usersRes.value.count ?? 0) : 0
  const fulfilled = requestsRes.status === 'fulfilled' ? (requestsRes.value.count ?? 0) : 0
  const studyMaterials = studyRes.status === 'fulfilled' ? (studyRes.value.count ?? 0) : 0

  return (
    <LiveStatsClient
      papers={papers}
      users={users}
      fulfilled={fulfilled}
      studyMaterials={studyMaterials}
    />
  )
}
