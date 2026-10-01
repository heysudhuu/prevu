import { getSupabaseAdmin } from '@/utils/supabase/admin'

export interface CreateStudentNotificationParams {
  userId: string
  title: string
  message: string
  type?: 'pending_approval' | 'batchmate_helped' | 'approved' | 'rejected' | 'request_update'
  link?: string
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
 * Retrieves student notifications for the authenticated user.
 */
export async function getStudentNotifications(userId: string, limit = 15) {
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
