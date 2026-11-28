'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { isSuperAdminEmail } from '@/lib/auth/admin-check'
import { sendStudentNotification } from '@/lib/notifications'
import {
  isMissingSchemaObjectError,
  isSchemaMarkedMissing,
  markSchemaMissing,
} from '@/lib/supabase/missingSchemaCache'
import { revalidatePath } from 'next/cache'

const PAPER_COMMENTS_EXT_MISSING_KEY = 'col:paper_comments.status'

export type DoubtStatus = 'open' | 'answered' | 'resolved' | 'hidden'

export interface CommentItem {
  id: string
  resource_id: string
  user_id: string
  comment: string
  parent_id?: string | null
  status?: DoubtStatus
  is_pinned?: boolean
  resolved_at?: string | null
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
 * Fetches all visible discussion doubts & replies for a specific paper.
 * Never returns fake/mock comments — returns empty array if none exist yet.
 */
export async function getPaperComments(resourceId: string): Promise<CommentItem[]> {
  if (!resourceId) return []

  try {
    const supabase = getSupabaseAdmin()

    if (!isSchemaMarkedMissing(PAPER_COMMENTS_EXT_MISSING_KEY)) {
      // Try extended columns (status, is_pinned, resolved_at) first
      const extendedRes = await supabase
        .from('paper_comments')
        .select(`
          id,
          resource_id,
          user_id,
          comment,
          parent_id,
          status,
          is_pinned,
          resolved_at,
          created_at,
          users!paper_comments_user_id_fkey ( name, username, avatar_url, cu_verified, role )
        `)
        .eq('resource_id', resourceId)
        .order('created_at', { ascending: true })

      if (!extendedRes.error && extendedRes.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return extendedRes.data
          // Hide admin-hidden comments from student view
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((c: any) => c.status !== 'hidden')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((c: any) => ({
            id: c.id,
            resource_id: c.resource_id,
            user_id: c.user_id,
            comment: c.comment,
            parent_id: c.parent_id,
            status: (c.status as DoubtStatus) || 'open',
            is_pinned: Boolean(c.is_pinned),
            resolved_at: c.resolved_at || null,
            created_at: c.created_at,
            user: (Array.isArray(c.users) ? c.users[0] : c.users) || {}
          }))
      }

      if (extendedRes.error && isMissingSchemaObjectError(extendedRes.error)) {
        markSchemaMissing(PAPER_COMMENTS_EXT_MISSING_KEY)
      }
    }

    // Fallback to base columns if extended columns or named FK haven't been migrated yet
    const baseRes = await supabase
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

    if (baseRes.error || !baseRes.data) {
      if (baseRes.error) {
        console.warn('Error fetching paper comments:', baseRes.error.message)
      }
      return []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return baseRes.data.map((c: any) => ({
      id: c.id,
      resource_id: c.resource_id,
      user_id: c.user_id,
      comment: c.comment,
      parent_id: c.parent_id,
      status: 'open' as DoubtStatus,
      is_pinned: false,
      created_at: c.created_at,
      user: (Array.isArray(c.users) ? c.users[0] : c.users) || {}
    }))
  } catch (err) {
    console.error('Error fetching paper comments:', err)
    return []
  }
}

/**
 * Adds a new doubt or threaded reply to a specific paper
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
    return { error: 'Please log in to ask a doubt or reply.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Session expired. Please log in again.' }
  }

  const cleanComment = comment.trim()
  if (!cleanComment || cleanComment.length < 2) {
    return { error: 'Doubt or reply must be at least 2 characters.' }
  }

  if (cleanComment.length > 2000) {
    return { error: 'Comment cannot exceed 2,000 characters.' }
  }

  const supabase = getSupabaseAdmin()
  const email = decoded.email?.toLowerCase() || ''

  // Ensure user exists in users table to prevent foreign key errors
  const { data: userRecord } = await supabase
    .from('users')
    .select('id, role, name')
    .eq('id', decoded.uid)
    .maybeSingle()

  if (!userRecord) {
    const fallbackUsername = email ? email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : `user_${decoded.uid.slice(0, 5)}`
    await supabase.from('users').insert({
      id: decoded.uid,
      name: decoded.name || email.split('@')[0] || 'Student',
      username: fallbackUsername,
      email: decoded.email,
      cu_verified: email.endsWith('@cuchd.in'),
      role: isSuperAdminEmail(email) ? 'admin' : 'student'
    })
  }

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
      users!paper_comments_user_id_fkey ( name, username, avatar_url, cu_verified, role )
    `)
    .single()

  // Fallback select if named FK differs on older Supabase schema cache
  let inserted = data
  let insertErr = error
  if (insertErr && insertErr.message?.includes('paper_comments_user_id_fkey')) {
    const retry = await supabase
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
    inserted = retry.data
    insertErr = retry.error
  }

  if (insertErr || !inserted) {
    if (insertErr?.message?.includes('paper_comments') || insertErr?.message?.includes('schema cache')) {
      return {
        error: 'Discussion table is being initialized. Please run supabase_paper_doubts_migration.sql in your Supabase SQL Editor.'
      }
    }
    return { error: `Failed to post doubt: ${insertErr?.message || 'Unknown error'}` }
  }

  // If this is a reply to an existing doubt, notify the original author (and mark answered if responder is admin)
  if (parentId) {
    try {
      const { data: parentRow } = await supabase
        .from('paper_comments')
        .select('user_id, status')
        .eq('id', parentId)
        .maybeSingle()

      const isAdminReplier =
        isSuperAdminEmail(email) ||
        ['admin', 'super_admin', 'moderator'].includes(userRecord?.role || '')

      if (isAdminReplier && parentRow && parentRow.status === 'open') {
        await supabase
          .from('paper_comments')
          .update({ status: 'answered', updated_at: new Date().toISOString() })
          .eq('id', parentId)
      }

      if (parentRow?.user_id && parentRow.user_id !== decoded.uid) {
        const senderLabel = isAdminReplier ? 'Prevu Admin' : (userRecord?.name || 'A batchmate')
        await sendStudentNotification({
          userId: parentRow.user_id,
          title: isAdminReplier ? 'Official Admin Answer to Your Doubt' : 'New Reply on Your Doubt',
          message: `${senderLabel} replied: "${cleanComment.slice(0, 110)}${cleanComment.length > 110 ? '...' : ''}"`,
          type: 'batchmate_helped',
          link: `/paper/${resourceId}`
        })
      }
    } catch {
      // Do not fail posting if status/notification step hits unmigrated columns
    }
  }

  revalidatePath('/browse')
  revalidatePath('/admin/doubts')
  return {
    success: true,
    comment: {
      ...inserted,
      status: 'open' as DoubtStatus,
      is_pinned: false,
      user: (Array.isArray(inserted.users) ? inserted.users[0] : inserted.users) || {}
    }
  }
}

/**
 * Deletes a comment/doubt (by author or verified admin/moderator)
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

  const [{ data: existing }, { data: caller }] = await Promise.all([
    supabase
      .from('paper_comments')
      .select('user_id')
      .eq('id', commentId)
      .maybeSingle(),
    supabase
      .from('users')
      .select('role')
      .eq('id', decoded.uid)
      .maybeSingle()
  ])

  if (!existing) {
    return { error: 'Comment not found.' }
  }

  const isAdmin =
    isSuperAdminEmail(decoded.email) ||
    ['admin', 'super_admin', 'moderator'].includes(caller?.role || '')

  if (existing.user_id !== decoded.uid && !isAdmin) {
    return { error: 'You can only delete your own doubts or comments.' }
  }

  const { error } = await supabase
    .from('paper_comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/browse')
  revalidatePath('/admin/doubts')
  return { success: true }
}
