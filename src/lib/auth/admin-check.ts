/**
 * Checks whether an email belongs to a designated super-admin.
 * Configurable via the ADMIN_EMAILS environment variable (comma-separated).
 * 
 * IMPORTANT: Set ADMIN_EMAILS in your .env file, e.g.:
 *   ADMIN_EMAILS=admin1@example.com,admin2@example.com
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const cleanEmail = email.trim().toLowerCase()

  const configuredAdmins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)

  if (configuredAdmins.length === 0) {
    console.warn('[admin-check] ADMIN_EMAILS env var is not set. No super-admins configured.')
    return false
  }

  return configuredAdmins.includes(cleanEmail)
}

/**
 * Checks whether a user is an admin by email whitelist or DB role.
 * Can be safely called in Server Components without importing from a 'use server' file.
 */
export async function isUserAdmin(email?: string | null, uid?: string | null): Promise<boolean> {
  if (isSuperAdminEmail(email)) return true
  if (!uid) return false

  try {
    const { getSupabaseAdmin } = await import('@/utils/supabase/admin')
    const supabase = getSupabaseAdmin()
    const { data: userData } = await supabase
      .from('users')
      .select('role, status')
      .eq('id', uid)
      .maybeSingle()

    if (userData?.status === 'suspended') return false
    return ['admin', 'super_admin', 'moderator'].includes(userData?.role || '')
  } catch {
    return false
  }
}
