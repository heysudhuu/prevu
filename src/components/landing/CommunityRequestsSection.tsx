import { getSupabaseAdmin } from '@/utils/supabase/admin'
import CommunityRequestsPreview from './CommunityRequestsPreview'

export default async function CommunityRequestsSection() {
  try {
    const supabase = getSupabaseAdmin()

    const { data: requests, error } = await supabase
      .from('paper_requests')
      .select(`
        id,
        subject_name,
        request_type,
        exam_type,
        exam_year,
        semester,
        note,
        status,
        created_at,
        upvotes,
        users:requested_by ( id, name, username, cu_verified )
      `)
      .order('created_at', { ascending: false })
      .limit(30)

    if (error || !requests) {
      return null
    }

    // Count pending responses per request
    const ids = requests.map(r => r.id)
    const { data: responses } = await supabase
      .from('request_responses')
      .select('request_id, status')
      .in('request_id', ids)
      .eq('status', 'pending')

    const pendingMap: Record<number, number> = {}
    if (responses) {
      for (const res of responses) {
        pendingMap[res.request_id] = (pendingMap[res.request_id] || 0) + 1
      }
    }

    const enriched = requests.map(r => ({
      ...r,
      pendingResponsesCount: pendingMap[r.id] || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      users: Array.isArray(r.users) ? r.users[0] : (r.users as any)
    }))

    return (
      <CommunityRequestsPreview
        requests={enriched}
        totalCount={enriched.length}
      />
    )
  } catch {
    // Silently fail — home page should not break if requests fetch fails
    return null
  }
}
