import { getSupabaseAdmin } from '@/utils/supabase/admin'

export type AdminActionType =
  | 'APPROVE_PAPER'
  | 'REJECT_PAPER'
  | 'EDIT_PAPER'
  | 'ARCHIVE_PAPER'
  | 'DELETE_PAPER'
  | 'BULK_APPROVE_PAPERS'
  | 'BULK_ARCHIVE_PAPERS'
  | 'BULK_DELETE_PAPERS'
  | 'UPDATE_USER_ROLE'
  | 'SUSPEND_USER'
  | 'ACTIVATE_USER'
  | 'RESOLVE_REPORT'
  | 'DISMISS_REPORT'
  | 'UPDATE_REQUEST_STATUS'
  | 'CREATE_SUBJECT'
  | 'UPDATE_SUBJECT'
  | 'DELETE_SUBJECT'
  | 'CREATE_ACADEMIC_EVENT'
  | 'UPDATE_ACADEMIC_EVENT'
  | 'DELETE_ACADEMIC_EVENT'
  | 'CREATE_NOTIFICATION'
  | 'TOGGLE_NOTIFICATION'
  | 'DELETE_NOTIFICATION'
  | 'LOGIN_ADMIN'

export interface AuditLogPayload {
  adminEmail: string
  adminId?: string | null
  action: AdminActionType | string
  targetType: 'paper' | 'user' | 'report' | 'request' | 'subject' | 'calendar' | 'notification' | 'system'
  targetId?: string | number | null
  details?: Record<string, unknown>
}

/**
 * Safely writes an entry to the `audit_logs` table.
 * If the table does not exist yet (e.g. migration pending), fails silently to prevent breaking actions.
 */
export async function logAdminAction(payload: AuditLogPayload): Promise<void> {
  try {
    const supabase = getSupabaseAdmin()
    await supabase.from('audit_logs').insert({
      admin_id: payload.adminId || null,
      admin_email: payload.adminEmail,
      action: payload.action,
      target_type: payload.targetType,
      target_id: payload.targetId ? String(payload.targetId) : null,
      details: payload.details || {}
    })
  } catch (error) {
    console.warn('Could not record audit log entry (migration may be pending):', error)
  }
}
