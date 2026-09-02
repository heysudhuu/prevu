import { createClient } from '@supabase/supabase-js'

export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ceqhxxvaioegvqfaszgx.supabase.co'
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

  // Fallback to anon key if service role key is missing, masked, or contains non-ASCII characters
  if (!key || /[^\x00-\x7F]/.test(key) || key.includes('•')) {
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_okMJGtXAg-vuOCZgFzUTAA_TJ9Z007f'
  }

  return createClient(url, key)
}
