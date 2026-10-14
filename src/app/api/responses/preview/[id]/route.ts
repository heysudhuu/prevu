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

  function extractExtension(filename: string, targetPath: string = ''): string {
    const pExt = (targetPath.split('?')[0].split('.').pop() || '').trim().toLowerCase()
    if (pExt && /^[a-z0-9]{2,5}$/.test(pExt)) return pExt
    const cleanName = filename.replace(/\s*\([^)]*\)\s*$/, '').trim()
    const nExt = (cleanName.split('.').pop() || '').trim().toLowerCase()
    if (nExt && /^[a-z0-9]{2,5}$/.test(nExt)) return nExt
    return ''
  }

  const filename = responseItem.file_name || 'document.pdf'
  const ext = extractExtension(filename, targetPath)
  const isOfficeDoc = ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(ext)
  const isCloudRequested = request.nextUrl.searchParams.get('viewer') === 'cloud'

  if (isOfficeDoc || isCloudRequested) {
    const { data: urlData, error: urlError } = await supabase.storage
      .from('resources')
      .createSignedUrl(targetPath, 60 * 60)

    if (urlError || !urlData?.signedUrl) {
      return NextResponse.json({ error: 'Could not access file' }, { status: 500 })
    }

    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(urlData.signedUrl)}&embedded=true`
    return NextResponse.redirect(viewerUrl)
  }

  // Download directly from Supabase Storage so we can serve with strict "inline" disposition
  const { data: fileBlob, error: downloadError } = await supabase.storage
    .from('resources')
    .download(targetPath)

  let arrayBuffer: ArrayBuffer
  let mimeType = 'application/pdf'
  if (['jpg', 'jpeg'].includes(ext)) mimeType = 'image/jpeg'
  else if (ext === 'png') mimeType = 'image/png'
  else if (ext === 'webp') mimeType = 'image/webp'
  else if (ext === 'txt') mimeType = 'text/plain'

  if (!downloadError && fileBlob) {
    arrayBuffer = await fileBlob.arrayBuffer()
    if (fileBlob.type) mimeType = fileBlob.type
  } else {
    const { data: urlData, error: urlError } = await supabase.storage
      .from('resources')
      .createSignedUrl(targetPath, 60 * 15)

    if (urlError || !urlData?.signedUrl) {
      return NextResponse.json({ error: 'Could not access file' }, { status: 500 })
    }

    const fetchRes = await fetch(urlData.signedUrl)
    if (!fetchRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 502 })
    }
    arrayBuffer = await fetchRes.arrayBuffer()
    const contentTypeHeader = fetchRes.headers.get('content-type')
    if (contentTypeHeader) mimeType = contentTypeHeader
  }

  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_')

  return new NextResponse(arrayBuffer, {
    status: 200,
    headers: {
      'Content-Type': mimeType,
      'Content-Disposition': `inline; filename="${cleanFilename}"`,
      'Content-Length': arrayBuffer.byteLength.toString(),
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Content-Type-Options': 'nosniff',
    }
  })
}
