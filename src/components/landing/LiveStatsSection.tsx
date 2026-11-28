import { getSupabaseAdmin } from '@/utils/supabase/admin'
import {
  isMissingSchemaObjectError,
  isSchemaMarkedMissing,
  markSchemaMissing,
} from '@/lib/supabase/missingSchemaCache'
import LiveStatsClient from './LiveStatsClient'

const RESOURCE_CATEGORY_MISSING_KEY = 'col:resources.resource_category'

export default async function LiveStatsSection() {
  const supabase = getSupabaseAdmin()

  const studyPromise = isSchemaMarkedMissing(RESOURCE_CATEGORY_MISSING_KEY)
    ? Promise.resolve({ count: 0, error: null })
    : supabase
        .from('resources')
        .select('id', { count: 'exact', head: true })
        .eq('resource_category', 'study_material')
        .eq('is_verified', true)

  const [papersRes, usersRes, requestsRes, studyRes] = await Promise.allSettled([
    supabase.from('resources').select('id', { count: 'exact', head: true }).eq('is_verified', true),
    supabase.from('users').select('id', { count: 'exact', head: true }),
    supabase.from('paper_requests').select('id', { count: 'exact', head: true }).eq('status', 'fulfilled'),
    studyPromise,
  ])

  if (studyRes.status === 'fulfilled' && studyRes.value.error && isMissingSchemaObjectError(studyRes.value.error)) {
    markSchemaMissing(RESOURCE_CATEGORY_MISSING_KEY)
  }

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
