import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const id = params.id
  
  const token = (await cookies()).get('firebase-token')?.value
  let decoded = null
  let isAdmin = false

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  if (token) {
    try {
      decoded = await authAdmin.verifyIdToken(token)
      const { data: userData } = await supabaseAdmin
        .from('users')
        .select('role')
        .eq('id', decoded.uid)
        .single()
      
      isAdmin = userData?.role === 'admin'
    } catch {
      // invalid token, treat as anonymous
    }
  }

  // Fetch resource metadata
  const { data: resource, error } = await supabaseAdmin
    .from('resources')
    .select('file_path, original_filename, status, uploaded_by')
    .eq('id', id)
    .single()

  if (error || !resource) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  // Only admins can preview pending/rejected, or the person who uploaded it
  if (resource.status !== 'approved') {
    if (!decoded || (!isAdmin && decoded.uid !== resource.uploaded_by)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Generate signed URL
  const { data: urlData, error: urlError } = await supabaseAdmin.storage
    .from('resources')
    .createSignedUrl(resource.file_path, 60 * 5) // 5 minutes for preview

  if (urlError || !urlData) {
    return NextResponse.json({ error: 'Failed to generate preview link' }, { status: 500 })
  }

  return NextResponse.redirect(urlData.signedUrl)
}
