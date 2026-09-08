import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable.')
  }

  // Use service role key if present, otherwise fallback to anon key with a warning
  const key = serviceKey && !keyIsMasked(serviceKey) ? serviceKey : anonKey

  if (!key) {
    throw new Error('Missing Supabase credentials (SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY).')
  }

  return createClient(url, key)
}

function keyIsMasked(key: string): boolean {
  return /[^\x00-\x7F]/.test(key) || key.includes('•')
}
