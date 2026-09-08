/**
 * Checks whether an email belongs to a designated super-admin.
 * Configurable via the ADMIN_EMAILS environment variable (comma-separated).
 */
export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false
  const cleanEmail = email.trim().toLowerCase()

  const configuredAdmins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(e => e.trim().toLowerCase())
    .filter(Boolean)

  // Primary fallback admin email for backward compatibility
  const adminList = new Set([
    'py7716496@gmail.com',
    ...configuredAdmins
  ])

  return adminList.has(cleanEmail)
}
