'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'

export async function getCommunityRequests(filters?: {
  semester?: number
  examType?: string
  status?: string
  search?: string
}) {
  const supabase = getSupabaseAdmin()

  let query = supabase
    .from('paper_requests')
    .select(`
      *,
      users:requested_by ( id, name, username, cu_verified )
    `)
    .order('created_at', { ascending: false })

  if (filters?.semester) {
    query = query.eq('semester', filters.semester)
  }
  if (filters?.status && filters.status !== 'ALL') {
    query = query.eq('status', filters.status.toLowerCase())
  }
  if (filters?.examType && filters.examType !== 'ALL') {
    query = query.eq('exam_type', filters.examType)
  }

  const { data: requests, error } = await query

  if (error || !requests) {
    return []
  }

  let result = requests

  if (filters?.search) {
    const term = filters.search.toLowerCase().trim()
    result = result.filter(r =>
      r.subject_name?.toLowerCase().includes(term) ||
      r.note?.toLowerCase().includes(term) ||
      String(r.exam_year || '').includes(term)
    )
  }

  // Get current user's upvoted request IDs
  let userUpvotedIds: number[] = []
  const token = (await cookies()).get('firebase-token')?.value
  if (token) {
    try {
      const decoded = await authAdmin.verifyIdToken(token)
      const { data: upvotes } = await supabase
        .from('request_upvotes')
        .select('request_id')
        .eq('user_id', decoded.uid)

      if (upvotes) {
        userUpvotedIds = upvotes.map(u => u.request_id)
      }
    } catch {
      userUpvotedIds = []
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.map((r: any) => ({
    ...r,
    hasUpvoted: userUpvotedIds.includes(r.id),
    upvotes: r.upvotes || 0
  }))
}

export async function toggleRequestUpvote(requestId: number) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { error: 'Please log in to upvote requests.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Session expired. Please log in again.' }
  }

  const supabase = getSupabaseAdmin()

  // 1. Check if user already upvoted this request
  try {
    const { data: existing } = await supabase
      .from('request_upvotes')
      .select('id')
      .eq('request_id', requestId)
      .eq('user_id', decoded.uid)
      .maybeSingle()

    if (existing) {
      // Remove upvote
      await supabase
        .from('request_upvotes')
        .delete()
        .eq('id', existing.id)

      // Decrement upvotes safely
      const { data: req } = await supabase
        .from('paper_requests')
        .select('upvotes')
        .eq('id', requestId)
        .single()

      const currentCount = req?.upvotes || 1
      await supabase
        .from('paper_requests')
        .update({ upvotes: Math.max(0, currentCount - 1) })
        .eq('id', requestId)

      revalidatePath('/requests')
      revalidatePath('/dashboard')
      return { success: true, upvoted: false }
    } else {
      // Insert upvote
      await supabase
        .from('request_upvotes')
        .insert({
          request_id: requestId,
          user_id: decoded.uid
        })

      // Increment upvotes
      const { data: req } = await supabase
        .from('paper_requests')
        .select('upvotes')
        .eq('id', requestId)
        .single()

      const currentCount = req?.upvotes || 0
      await supabase
        .from('paper_requests')
        .update({ upvotes: currentCount + 1 })
        .eq('id', requestId)

      revalidatePath('/requests')
      revalidatePath('/dashboard')
      return { success: true, upvoted: true }
    }
  } catch {
    // If request_upvotes table not yet migrated, fallback gracefully
    const { data: req } = await supabase
      .from('paper_requests')
      .select('upvotes')
      .eq('id', requestId)
      .single()

    const currentCount = req?.upvotes || 0
    await supabase
      .from('paper_requests')
      .update({ upvotes: currentCount + 1 })
      .eq('id', requestId)

    revalidatePath('/requests')
    return { success: true, upvoted: true }
  }
}
