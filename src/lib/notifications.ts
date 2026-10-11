import { getSupabaseAdmin } from '@/utils/supabase/admin'

export interface CreateStudentNotificationParams {
  userId: string
  title: string
  message: string
  type?: 'pending_approval' | 'batchmate_helped' | 'approved' | 'rejected' | 'request_update' | 'batchmate_query' | string
  link?: string
}

export interface NotifyBatchmatesParams {
  authorId: string
  authorName?: string
  subjectName: string
  title?: string
  semester: number
  requestType: string
  requestId?: number | string
}

/**
 * Creates an in-app student notification record.
 * Fails safely without throwing error if table has not been migrated yet.
 */
export async function sendStudentNotification({
  userId,
  title,
  message,
  type = 'request_update',
  link
}: CreateStudentNotificationParams) {
  if (!userId) return null

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('student_notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        link: link || '/requests',
        is_read: false
      })
      .select('id')
      .single()

    if (error) {
      console.warn('Could not insert student_notification (table might need migration):', error.message)
      return null
    }

    return data
  } catch (err) {
    console.warn('Error sending student notification:', err)
    return null
  }
}

/**
 * Notifies registered batchmates when a new academic query / request is posted in the community.
 * Prioritizes students enrolled in the same semester and expands to registered peers.
 */
export async function notifyBatchmatesOfQuery({
  authorId,
  authorName = 'A batchmate',
  subjectName,
  title,
  semester,
  requestType,
  requestId
}: NotifyBatchmatesParams) {
  if (!authorId) return { count: 0 }

  try {
    const supabase = getSupabaseAdmin()

    // 1. Fetch potential batchmate recipients from users table, excluding the author
    // First priority: students registered in the same semester
    let batchmates: { id: string; name?: string; current_semester?: number }[] = []

    const { data: sameSemUsers } = await supabase
      .from('users')
      .select('id, name, current_semester')
      .neq('id', authorId)
      .eq('current_semester', semester)
      .limit(60)

    if (sameSemUsers && sameSemUsers.length > 0) {
      batchmates = [...sameSemUsers]
    }

    // If few students have specified their semester, also include other registered students so queries get answered
    if (batchmates.length < 15) {
      const { data: otherUsers } = await supabase
        .from('users')
        .select('id, name, current_semester')
        .neq('id', authorId)
        .limit(60)

      if (otherUsers && otherUsers.length > 0) {
        const existingIds = new Set(batchmates.map(b => b.id))
        const remaining = otherUsers.filter(u => !existingIds.has(u.id))
        batchmates = [...batchmates, ...remaining].slice(0, 50)
      }
    }

    if (batchmates.length === 0) {
      return { count: 0 }
    }

    const typeBadge = requestType === 'doubt' ? 'Doubt' : requestType === 'study_material' ? 'Notes Request' : 'PYQ Request'
    const querySummary = title ? `"${title}"` : `in ${subjectName}`

    // 2. Prepare notifications bulk payload
    const notificationsToInsert = batchmates.map(peer => ({
      user_id: peer.id,
      title: `🔔 Batchmate ${typeBadge}: ${subjectName} (Sem ${semester})`,
      message: `${authorName} raised a query ${querySummary}. Can you help your peer out?`,
      type: 'batchmate_query',
      link: `/requests?search=${encodeURIComponent(subjectName)}`,
      is_read: false
    }))

    const { error: insertError } = await supabase
      .from('student_notifications')
      .insert(notificationsToInsert)

    if (insertError) {
      console.warn('Could not insert batch student notifications:', insertError.message)
      return { count: 0 }
    }

    return { count: notificationsToInsert.length }
  } catch (err) {
    console.warn('Error in notifyBatchmatesOfQuery:', err)
    return { count: 0 }
  }
}

/**
 * Retrieves unread notification count for a student
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!userId) return 0

  try {
    const supabase = getSupabaseAdmin()
    const { count, error } = await supabase
      .from('student_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) {
      return 0
    }

    return count || 0
  } catch {
    return 0
  }
}

/**
 * Marks all notifications as read for a student
 */
export async function markAllStudentNotificationsAsRead(userId: string) {
  if (!userId) return { success: false }

  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('student_notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) {
      return { error: error.message }
    }

    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'Failed to mark all as read' }
  }
}

/**
 * Retrieves student notifications for the authenticated user.
 */
export async function getStudentNotifications(userId: string, limit = 20) {
  if (!userId) return []

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('student_notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      return []
    }

    return data || []
  } catch {
    return []
  }
}

