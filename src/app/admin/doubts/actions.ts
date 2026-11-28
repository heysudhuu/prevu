'use server'

import { revalidatePath } from 'next/cache'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { getAdminSession } from '@/app/admin/actions'
import { logAdminAction } from '@/lib/admin/audit'
import { sendStudentNotification } from '@/lib/notifications'
import {
  isMissingSchemaObjectError,
  isSchemaMarkedMissing,
  markSchemaMissing,
} from '@/lib/supabase/missingSchemaCache'
import type { DoubtStatus } from '@/app/api/comments/actions'

const PAPER_COMMENTS_EXT_MISSING_KEY = 'col:paper_comments.status'

export interface AdminDoubtReply {
  id: string
  resource_id: string
  user_id: string
  comment: string
  parent_id: string
  created_at: string
  user: {
    id: string
    name: string
    username?: string
    email?: string
    cu_verified?: boolean
    role?: string
  }
}

export interface AdminDoubtThread {
  id: string
  resource_id: string
  user_id: string
  comment: string
  status: DoubtStatus
  is_pinned: boolean
  resolved_at?: string | null
  created_at: string
  user: {
    id: string
    name: string
    username?: string
    email?: string
    cu_verified?: boolean
    role?: string
  }
  resource: {
    id: string
    title: string
    exam_year?: number
    exam_type?: string
    subject_name?: string
    subject_code?: string
    semester?: number
  }
  replies: AdminDoubtReply[]
}

export interface AdminDoubtsPayload {
  threads: AdminDoubtThread[]
  migrationPending: boolean
  tableMissing: boolean
}

/**
 * Fetches all student doubt threads & replies across all papers for the Admin Console.
 */
export async function getAdminDoubtsData(): Promise<AdminDoubtsPayload> {
  const session = await getAdminSession()
  if (!session) {
    return { threads: [], migrationPending: false, tableMissing: false }
  }

  const supabase = getSupabaseAdmin()
  let migrationPending = false

  // 1. Try extended select with status/pinning columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rows: any[] = []
  let extRes: { data: any[] | null; error: { message?: string } | null } = {
    data: null,
    error: null,
  }

  if (!isSchemaMarkedMissing(PAPER_COMMENTS_EXT_MISSING_KEY)) {
    extRes = await supabase
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
        resources (
          id,
          original_filename,
          exam_year,
          subjects ( name, code, semester ),
          exam_types ( name )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(500)

    if (extRes.error && isMissingSchemaObjectError(extRes.error)) {
      markSchemaMissing(PAPER_COMMENTS_EXT_MISSING_KEY)
    }
  } else {
    migrationPending = true
  }

  if (!isSchemaMarkedMissing(PAPER_COMMENTS_EXT_MISSING_KEY) && !extRes.error && extRes.data) {
    rows = extRes.data
  } else {
    const msg = extRes.error?.message || ''
    if (msg.includes('relation') && msg.includes('paper_comments')) {
      return { threads: [], migrationPending: true, tableMissing: true }
    }

    // Fallback to base columns if status / is_pinned aren't migrated yet
    migrationPending = true
    const baseRes = await supabase
      .from('paper_comments')
      .select(`
        id,
        resource_id,
        user_id,
        comment,
        parent_id,
        created_at,
        resources (
          id,
          original_filename,
          exam_year,
          subjects ( name, code, semester ),
          exam_types ( name )
        )
      `)
      .order('created_at', { ascending: false })
      .limit(500)

    if (baseRes.error) {
      return { threads: [], migrationPending: true, tableMissing: true }
    }
    rows = baseRes.data || []
  }

  if (rows.length === 0) {
    return { threads: [], migrationPending, tableMissing: false }
  }

  // 2. Batch-fetch author profiles cleanly (avoids PostgREST dual-FK ambiguity)
  const userIds = Array.from(new Set(rows.map(r => r.user_id).filter(Boolean)))
  const userMap = new Map<string, AdminDoubtThread['user']>()

  if (userIds.length > 0) {
    const { data: usersData } = await supabase
      .from('users')
      .select('id, name, username, email, cu_verified, role')
      .in('id', userIds)

    for (const u of usersData || []) {
      userMap.set(u.id, {
        id: u.id,
        name: u.name || 'Student',
        username: u.username,
        email: u.email,
        cu_verified: Boolean(u.cu_verified),
        role: u.role
      })
    }
  }

  // 3. Separate parent doubts vs replies
  const replyMap = new Map<string, AdminDoubtReply[]>()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parentRows: any[] = []

  for (const row of rows) {
    if (row.parent_id) {
      const author = userMap.get(row.user_id) || { id: row.user_id, name: 'Student' }
      const reply: AdminDoubtReply = {
        id: row.id,
        resource_id: row.resource_id,
        user_id: row.user_id,
        comment: row.comment,
        parent_id: row.parent_id,
        created_at: row.created_at,
        user: author
      }
      const existing = replyMap.get(row.parent_id) || []
      existing.push(reply)
      replyMap.set(row.parent_id, existing)
    } else {
      parentRows.push(row)
    }
  }

  const threads: AdminDoubtThread[] = parentRows.map((row) => {
    const resObj = Array.isArray(row.resources) ? row.resources[0] : row.resources
    const subObj = Array.isArray(resObj?.subjects) ? resObj.subjects[0] : resObj?.subjects
    const typeObj = Array.isArray(resObj?.exam_types) ? resObj.exam_types[0] : resObj?.exam_types

    const rawReplies = (replyMap.get(row.id) || []).sort(
      (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    )

    // Derive sensible status if migration is pending and admin already replied
    let derivedStatus: DoubtStatus = (row.status as DoubtStatus) || 'open'
    if (migrationPending && rawReplies.some(r => r.user.role === 'admin' || r.user.role === 'super_admin')) {
      derivedStatus = 'answered'
    }

    return {
      id: row.id,
      resource_id: row.resource_id,
      user_id: row.user_id,
      comment: row.comment,
      status: derivedStatus,
      is_pinned: Boolean(row.is_pinned),
      resolved_at: row.resolved_at || null,
      created_at: row.created_at,
      user: userMap.get(row.user_id) || { id: row.user_id, name: 'Student' },
      resource: {
        id: resObj?.id || row.resource_id,
        title: resObj?.original_filename || subObj?.name || 'Academic Paper',
        exam_year: resObj?.exam_year,
        exam_type: typeObj?.name,
        subject_name: subObj?.name,
        subject_code: subObj?.code,
        semester: subObj?.semester
      },
      replies: rawReplies
    }
  })

  // Sort pinned first, then open/needs answer, then newest
  threads.sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return { threads, migrationPending, tableMissing: false }
}

/**
 * Posts an official Admin reply to a student doubt and optionally marks it Resolved.
 */
export async function replyToStudentDoubt({
  parentId,
  resourceId,
  replyText,
  markResolved = true
}: {
  parentId: string
  resourceId: string
  replyText: string
  markResolved?: boolean
}) {
  const session = await getAdminSession()
  if (!session) return { error: 'Unauthorized admin session.' }

  const cleanReply = replyText.trim()
  if (cleanReply.length < 2) {
    return { error: 'Reply must be at least 2 characters.' }
  }

  const supabase = getSupabaseAdmin()

  const { data: inserted, error: insertErr } = await supabase
    .from('paper_comments')
    .insert({
      resource_id: resourceId,
      user_id: session.uid,
      comment: cleanReply,
      parent_id: parentId
    })
    .select('id, resource_id, user_id, comment, parent_id, created_at')
    .single()

  if (insertErr || !inserted) {
    return { error: insertErr?.message || 'Failed to save admin reply.' }
  }

  // Update parent doubt status if migration columns exist
  const nextStatus: DoubtStatus = markResolved ? 'resolved' : 'answered'
  try {
    await supabase
      .from('paper_comments')
      .update({
        status: nextStatus,
        resolved_by: markResolved ? session.uid : null,
        resolved_at: markResolved ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', parentId)
  } catch {
    // Migration pending — reply still succeeded
  }

  // Notify original student author
  const { data: parentRow } = await supabase
    .from('paper_comments')
    .select('user_id')
    .eq('id', parentId)
    .maybeSingle()

  if (parentRow?.user_id && parentRow.user_id !== session.uid) {
    await sendStudentNotification({
      userId: parentRow.user_id,
      title: markResolved ? 'Your Academic Doubt Was Resolved' : 'Official Admin Reply on Your Doubt',
      message: `Admin answered: "${cleanReply.slice(0, 120)}${cleanReply.length > 120 ? '...' : ''}"`,
      type: 'approved',
      link: `/paper/${resourceId}`
    })
  }

  await logAdminAction({
    adminEmail: session.email,
    adminId: session.uid,
    action: 'REPLY_DOUBT',
    targetType: 'doubt',
    targetId: parentId,
    details: { resourceId, markResolved }
  })

  revalidatePath('/admin/doubts')
  revalidatePath('/browse')

  return {
    success: true,
    reply: inserted,
    status: nextStatus
  }
}

/**
 * Updates a doubt thread status ('open' | 'answered' | 'resolved' | 'hidden').
 */
export async function updateDoubtStatus({
  commentId,
  status
}: {
  commentId: string
  status: DoubtStatus
}) {
  const session = await getAdminSession()
  if (!session) return { error: 'Unauthorized admin session.' }

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('paper_comments')
    .update({
      status,
      resolved_by: status === 'resolved' ? session.uid : null,
      resolved_at: status === 'resolved' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)

  if (error) {
    if (error.message?.includes('status') || error.message?.includes('column')) {
      return { error: 'Run supabase_paper_doubts_migration.sql in Supabase SQL Editor to enable doubt statuses.' }
    }
    return { error: error.message }
  }

  await logAdminAction({
    adminEmail: session.email,
    adminId: session.uid,
    action: 'UPDATE_DOUBT_STATUS',
    targetType: 'doubt',
    targetId: commentId,
    details: { status }
  })

  revalidatePath('/admin/doubts')
  revalidatePath('/browse')
  return { success: true }
}

/**
 * Pins or unpins a doubt thread at the top of a document's discussion.
 */
export async function togglePinDoubt({
  commentId,
  isPinned
}: {
  commentId: string
  isPinned: boolean
}) {
  const session = await getAdminSession()
  if (!session) return { error: 'Unauthorized admin session.' }

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('paper_comments')
    .update({
      is_pinned: isPinned,
      updated_at: new Date().toISOString()
    })
    .eq('id', commentId)

  if (error) {
    if (error.message?.includes('is_pinned') || error.message?.includes('column')) {
      return { error: 'Run supabase_paper_doubts_migration.sql in Supabase SQL Editor to enable pinning doubts.' }
    }
    return { error: error.message }
  }

  await logAdminAction({
    adminEmail: session.email,
    adminId: session.uid,
    action: 'PIN_DOUBT',
    targetType: 'doubt',
    targetId: commentId,
    details: { isPinned }
  })

  revalidatePath('/admin/doubts')
  revalidatePath('/browse')
  return { success: true }
}

/**
 * Permanently deletes a doubt thread (cascades to child replies).
 */
export async function deleteDoubtThread(commentId: string) {
  const session = await getAdminSession()
  if (!session) return { error: 'Unauthorized admin session.' }

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('paper_comments')
    .delete()
    .eq('id', commentId)

  if (error) {
    return { error: error.message }
  }

  await logAdminAction({
    adminEmail: session.email,
    adminId: session.uid,
    action: 'DELETE_DOUBT',
    targetType: 'doubt',
    targetId: commentId
  })

  revalidatePath('/admin/doubts')
  revalidatePath('/browse')
  return { success: true }
}
