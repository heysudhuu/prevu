import { getSupabaseAdmin } from '@/utils/supabase/admin'
import {
  isMissingSchemaObjectError,
  isSchemaMarkedMissing,
  markSchemaMissing,
} from '@/lib/supabase/missingSchemaCache'

const AUDIT_LOGS_MISSING_KEY = 'table:audit_logs'

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
  | 'REPLY_DOUBT'
  | 'UPDATE_DOUBT_STATUS'
  | 'PIN_DOUBT'
  | 'DELETE_DOUBT'

export interface AuditLogPayload {
  adminEmail: string
  adminId?: string | null
  action: AdminActionType | string
  targetType: 'paper' | 'user' | 'report' | 'request' | 'subject' | 'calendar' | 'notification' | 'system' | 'doubt'
  targetId?: string | number | null
  details?: Record<string, unknown>
}

/**
 * Safely writes an entry to the `audit_logs` table.
 * If the table does not exist yet (e.g. migration pending), fails silently to prevent breaking actions.
 */
export async function logAdminAction(payload: AuditLogPayload): Promise<void> {
  if (isSchemaMarkedMissing(AUDIT_LOGS_MISSING_KEY)) return
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('audit_logs').insert({
      admin_id: payload.adminId || null,
      admin_email: payload.adminEmail,
      action: payload.action,
      target_type: payload.targetType,
      target_id: payload.targetId ? String(payload.targetId) : null,
      details: payload.details || {}
    })
    if (error && isMissingSchemaObjectError(error)) {
      markSchemaMissing(AUDIT_LOGS_MISSING_KEY)
    }
  } catch (error) {
    console.warn('Could not record audit log entry (migration may be pending):', error)
  }
}
