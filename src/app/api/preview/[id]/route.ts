import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'

function extractExtension(filename: string, targetPath: string = ''): string {
  // First test targetPath since storage paths are clean e.g. "uuid.docx"
  const pExt = (targetPath.split('?')[0].split('.').pop() || '').trim().toLowerCase()
  if (pExt && /^[a-z0-9]{2,5}$/.test(pExt)) return pExt
  
  // Clean filename: remove trailing "(Part X of Y)" or parenthetical notes
  const cleanName = filename.replace(/\s*\([^)]*\)\s*$/, '').trim()
  const nExt = (cleanName.split('.').pop() || '').trim().toLowerCase()
  if (nExt && /^[a-z0-9]{2,5}$/.test(nExt)) return nExt
  
  return ''
}

function getMimeType(filename: string, targetPath: string = ''): string {
  const ext = extractExtension(filename, targetPath)
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
      return 'application/vnd.spreadsheetml.sheet'
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

  const ext = extractExtension(filename, targetPath)
  const isOfficeDoc = ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(ext)
  const isCloudRequested = request.nextUrl.searchParams.get('viewer') === 'cloud'

  // If file is an Office document (DOCX, PPTX, XLSX) or cloud viewer is requested,
  // embed via Google Docs Viewer so the browser renders it on screen instead of downloading
  if (isOfficeDoc || isCloudRequested) {
    const { data: urlData, error: urlError } = await supabaseAdmin.storage
      .from('resources')
      .createSignedUrl(targetPath, 60 * 60) // 1 hour

    if (urlError || !urlData?.signedUrl) {
      return NextResponse.json({ error: 'Failed to access document preview' }, { status: 500 })
    }

    const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(urlData.signedUrl)}&embedded=true`
    return NextResponse.redirect(viewerUrl)
  }

  // Download directly from Supabase Storage so we can serve with strict "inline" disposition
  const { data: fileBlob, error: downloadError } = await supabaseAdmin.storage
    .from('resources')
    .download(targetPath)

  let arrayBuffer: ArrayBuffer
  let mimeType = getMimeType(filename, targetPath)

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
