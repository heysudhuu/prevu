import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { generateAcademicDownloadText } from '@/lib/academic-preview/generateAcademicDocument'

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
    // Return generated academic solved document for download
    const textData = generateAcademicDownloadText(id)
    const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '_')
    return new NextResponse(textData, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${cleanId}_Solved_Paper.txt"`,
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }

  // Only admins can download pending/rejected, or the person who uploaded it
  if (resource.status !== 'approved') {
    if (!decoded || (!isAdmin && decoded.uid !== resource.uploaded_by)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  // Increment download count (only for approved to not skew stats with admin previews)
  if (resource.status === 'approved') {
    const {
      isMissingSchemaObjectError,
      isSchemaMarkedMissing,
      markSchemaMissing,
    } = await import('@/lib/supabase/missingSchemaCache')
    const rpcMissingKey = 'rpc:increment_download_count'

    let usedFallback = isSchemaMarkedMissing(rpcMissingKey)
    if (!usedFallback) {
      const { error: rpcError } = await supabaseAdmin.rpc('increment_download_count', { resource_id: id })
      if (rpcError) {
        if (isMissingSchemaObjectError(rpcError)) {
          markSchemaMissing(rpcMissingKey)
        }
        usedFallback = true
      }
    }

    if (usedFallback) {
      const { data: curr } = await supabaseAdmin
        .from('resources')
        .select('download_count')
        .eq('id', id)
        .maybeSingle()
      const nextCount = ((curr as { download_count?: number } | null)?.download_count || 0) + 1
      await supabaseAdmin
        .from('resources')
        .update({ download_count: nextCount })
        .eq('id', id)
    }
  }

  // Generate signed URL
  const { data: urlData, error: urlError } = await supabaseAdmin.storage
    .from('resources')
    .createSignedUrl(resource.file_path, 60)

  if (urlError || !urlData) {
    const textData = generateAcademicDownloadText(id)
    const cleanId = id.replace(/[^a-zA-Z0-9_-]/g, '_')
    return new NextResponse(textData, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${cleanId}_Solved_Paper.txt"`,
        'Cache-Control': 'public, max-age=3600'
      }
    })
  }

  return NextResponse.redirect(urlData.signedUrl)
}
