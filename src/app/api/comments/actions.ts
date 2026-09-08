'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { isSuperAdminEmail } from '@/lib/auth/admin-check'
import { revalidatePath } from 'next/cache'

export interface CommentItem {
  id: string
  resource_id: string
  user_id: string
  comment: string
  parent_id?: string | null
  created_at: string
  user?: {
    name?: string
    username?: string
    avatar_url?: string
    cu_verified?: boolean
    role?: string
  }
}

/**
 * Fetches all discussion comments for a specific paper
 */
export async function getPaperComments(resourceId: string): Promise<CommentItem[]> {
  try {
    const supabase = getSupabaseAdmin()

    const { data, error } = await supabase
      .from('paper_comments')
      .select(`
        id,
        resource_id,
        user_id,
        comment,
        parent_id,
        created_at,
        users ( name, username, avatar_url, cu_verified, role )
      `)
      .eq('resource_id', resourceId)
      .order('created_at', { ascending: true })

    if (error || !data) {
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((c: any) => ({
      id: c.id,
      resource_id: c.resource_id,
      user_id: c.user_id,
      comment: c.comment,
      parent_id: c.parent_id,
      created_at: c.created_at,
      user: c.users || {}
    }))
  } catch (err) {
    console.error('Error fetching paper comments:', err)
    return []
  }
}

/**
 * Adds a new comment or discussion point to a paper
 */
export async function addPaperComment({
  resourceId,
  comment,
  parentId
}: {
  resourceId: string
  comment: string
  parentId?: string
}) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { error: 'Please log in to join the discussion.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Session expired. Please log in again.' }
  }

  const cleanComment = comment.trim()
  if (!cleanComment || cleanComment.length < 2) {
    return { error: 'Comment must be at least 2 characters.' }
  }

  if (cleanComment.length > 2000) {
    return { error: 'Comment cannot exceed 2,000 characters.' }
  }

  const supabase = getSupabaseAdmin()

  const { data, error } = await supabase
    .from('paper_comments')
    .insert({
      resource_id: resourceId,
      user_id: decoded.uid,
      comment: cleanComment,
      parent_id: parentId || null
    })
    .select(`
      id,
      resource_id,
      user_id,
      comment,
      parent_id,
      created_at,
      users ( name, username, avatar_url, cu_verified, role )
    `)
    .single()

  if (error || !data) {
    return { error: `Failed to post comment: ${error?.message}` }
  }

  revalidatePath('/browse')
  return { success: true, comment: data }
}

/**
 * Deletes a comment (by author or admin)
 */
export async function deletePaperComment(commentId: string) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) return { error: 'Unauthorized.' }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Session expired.' }
  }

  const supabase = getSupabaseAdmin()

  // Check ownership
  const { data: existing } = await supabase
    .from('paper_comments')
    .select('user_id')
    .eq('id', commentId)
    .maybeSingle()

  if (!existing) {
    return { error: 'Comment not found.' }
  }

  const isAdmin = isSuperAdminEmail(decoded.email)
  if (existing.user_id !== decoded.uid && !isAdmin) {
    return { error: 'You can only delete your own comments.' }
  }

  const { error } = await supabase
    .from('paper_comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/browse')
  return { success: true }
}
