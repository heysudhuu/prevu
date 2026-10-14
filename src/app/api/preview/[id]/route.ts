import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'

function getMimeType(filename: string): string {
  const ext = (filename.split('.').pop() || '').toLowerCase()
  switch (ext) {
    case 'pdf':
      return 'application/pdf'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'webp':
      return 'image/webp'
    case 'txt':
      return 'text/plain'
    case 'doc':
      return 'application/msword'
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    case 'ppt':
      return 'application/vnd.ms-powerpoint'
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    case 'xls':
      return 'application/vnd.ms-excel'
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    default:
      return 'application/pdf'
  }
}

export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params
  const id = params.id
  
  const token = (await cookies()).get('firebase-token')?.value
  let decoded = null
  let isAdmin = false

  const supabaseAdmin = getSupabaseAdmin()

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

  // Support multiple file paths stored as JSON array
  let targetPath = resource.file_path
  let filename = resource.original_filename || 'document.pdf'
  if (targetPath.startsWith('[')) {
    try {
      const parsed = JSON.parse(targetPath)
      const fileIndex = parseInt(request.nextUrl.searchParams.get('fileIndex') || '0', 10)
      targetPath = parsed[fileIndex]?.path || parsed[0]?.path
      filename = parsed[fileIndex]?.displayName || parsed[fileIndex]?.name || filename
    } catch {
      targetPath = resource.file_path
    }
  }

  // Download directly from Supabase Storage so we can serve with strict "inline" disposition
  const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
    .from('resources')
    .download(targetPath)

  let arrayBuffer: ArrayBuffer
  let mimeType = getMimeType(filename)

  if (!downloadError && fileBlob) {
    arrayBuffer = await fileBlob.arrayBuffer()
    if (fileBlob.type) {
      mimeType = fileBlob.type
    }
  } else {
    // Fallback: create signed URL and fetch stream
    const { data: urlData, error: urlError } = await supabaseAdmin.storage
      .from('resources')
      .createSignedUrl(targetPath, 60 * 15)

    if (urlError || !urlData?.signedUrl) {
      return NextResponse.json({ error: 'Failed to access document preview' }, { status: 500 })
    }

    const fetchRes = await fetch(urlData.signedUrl)
    if (!fetchRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch document content' }, { status: 502 })
    }
    arrayBuffer = await fetchRes.arrayBuffer()
    const contentTypeHeader = fetchRes.headers.get('content-type')
    if (contentTypeHeader) {
      mimeType = contentTypeHeader
    }
  }

  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_')

  // Explicitly return as INLINE document (NEVER attachment) so the browser renders
  // it directly inside the preview iframe without triggering an automatic file download
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
