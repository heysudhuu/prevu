/**
 * In-memory short-TTL cache for optional Supabase schema objects (tables, columns, RPCs).
 * Prevents hammering Supabase REST/PostgREST with repeated 400/404 requests when a migration
 * hasn't been executed in SQL Editor yet, while automatically re-probing after the TTL expires.
 */

const DEFAULT_MISSING_TTL_MS = 10 * 60 * 1000 // 10 minutes

declare global {
  // eslint-disable-next-line no-var
  var __prevu_missing_schema_until: Record<string, number> | undefined
}

function getCache(): Record<string, number> {
  if (!globalThis.__prevu_missing_schema_until) {
    globalThis.__prevu_missing_schema_until = {}
  }
  return globalThis.__prevu_missing_schema_until
}

export function isSchemaMarkedMissing(key: string): boolean {
  const cache = getCache()
  const until = cache[key]
  if (!until) return false
  if (Date.now() < until) return true
  delete cache[key]
  return false
}

export function markSchemaMissing(key: string, ttlMs = DEFAULT_MISSING_TTL_MS): void {
  const cache = getCache()
  cache[key] = Date.now() + ttlMs
}

export function clearSchemaMissing(key: string): void {
  const cache = getCache()
  delete cache[key]
}

interface SupabaseLikeError {
  code?: string | null
  message?: string | null
  details?: string | null
  hint?: string | null
  status?: number | null
}

/**
 * Returns true if a PostgREST / Postgres error indicates a missing table, view, column, or RPC function.
 */
export function isMissingSchemaObjectError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const err = error as SupabaseLikeError
  const code = String(err.code || '').toUpperCase()
  const msg = `${err.message || ''} ${err.details || ''} ${err.hint || ''}`.toLowerCase()

  if (
    code === 'PGRST205' || // table not found in schema cache
    code === 'PGRST202' || // function not found in schema cache
    code === 'PGRST204' || // column not found in schema cache
    code === '42P01' ||    // undefined_table
    code === '42703' ||    // undefined_column
    code === '42883'       // undefined_function
  ) {
    return true
  }

  return (
    msg.includes('does not exist') ||
    msg.includes('could not find the table') ||
    msg.includes('could not find the function') ||
    msg.includes('schema cache')
  )
}
