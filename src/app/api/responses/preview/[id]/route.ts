import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { isUserAdmin } from '@/lib/auth/admin-check'

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const id = params.id

  const token = (await cookies()).get('firebase-token')?.value
  let decoded = null
  let isAdmin = false

  const supabase = getSupabaseAdmin()

  if (token) {
    try {
      decoded = await authAdmin.verifyIdToken(token)
      isAdmin = await isUserAdmin(decoded.email, decoded.uid)
    } catch {
      // ignore
    }
  }

  // Fetch response
  const { data: responseItem, error } = await supabase
    .from('request_responses')
    .select(`
      id,
      file_path,
      file_name,
      status,
      user_id,
      paper_requests:request_id (
        id,
        requested_by
      )
    `)
    .eq('id', id)
    .single()

  if (error || !responseItem || !responseItem.file_path) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 })
  }

  // Access check:
  // Approved: anyone can preview
  // Pending/Rejected: only admin, contributor, or requester can view
  const isApproved = responseItem.status === 'approved'
  const isContributor = decoded && decoded.uid === responseItem.user_id
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isRequester = decoded && decoded.uid === (responseItem.paper_requests as any)?.requested_by

  if (!isApproved && !isAdmin && !isContributor && !isRequester) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Support both single file string and JSON array of multiple files (up to 3)
  let targetPath = responseItem.file_path
  if (responseItem.file_path.startsWith('[')) {
    try {
      const parsed = JSON.parse(responseItem.file_path)
      const fileIndex = parseInt(request.nextUrl.searchParams.get('fileIndex') || '0')
      targetPath = parsed[fileIndex]?.path || parsed[0]?.path
    } catch {
      targetPath = responseItem.file_path
    }
  }

  // Generate signed URL from resources storage bucket
  const { data: urlData, error: urlError } = await supabase.storage
    .from('resources')
    .createSignedUrl(targetPath, 60 * 15) // 15 mins

  if (urlError || !urlData?.signedUrl) {
    // Fallback to public URL
    const { data: pubData } = supabase.storage.from('resources').getPublicUrl(targetPath)
    if (pubData?.publicUrl) {
      return NextResponse.redirect(pubData.publicUrl)
    }
    return NextResponse.json({ error: 'Could not generate download link' }, { status: 500 })
  }

  return NextResponse.redirect(urlData.signedUrl)
}
