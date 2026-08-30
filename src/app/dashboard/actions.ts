'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

/**
 * Toggles a bookmark for a specific resource
 */
export async function toggleBookmark(resourceId: string) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { error: 'Please log in to save papers.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Authentication expired. Please log in again.' }
  }

  const supabase = getSupabaseAdmin()

  // Check if already bookmarked
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('id')
    .eq('user_id', decoded.uid)
    .eq('resource_id', resourceId)
    .maybeSingle()

  if (existing) {
    // Remove bookmark
    await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', decoded.uid)
      .eq('resource_id', resourceId)

    revalidatePath('/dashboard')
    revalidatePath('/browse')
    return { success: true, bookmarked: false }
  } else {
    // Add bookmark
    const { error } = await supabase
      .from('bookmarks')
      .insert({
        user_id: decoded.uid,
        resource_id: resourceId
      })

    if (error) {
      console.warn("Bookmark insert error:", error)
      return { error: error.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/browse')
    return { success: true, bookmarked: true }
  }
}

/**
 * Retrieves all bookmarked resources for the current user
 */
export async function getBookmarkedResources() {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) return []

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return []
  }

  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('bookmarks')
    .select(`
      id,
      created_at,
      resources (
        id,
        exam_year,
        file_path,
        file_type,
        original_filename,
        subjects ( name, code, semester, year ),
        exam_types ( name ),
        users ( name, username, role, cu_verified )
      )
    `)
    .eq('user_id', decoded.uid)
    .order('created_at', { ascending: false })

  if (error || !data) {
    return []
  }

  // Flatten
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((b: any) => b.resources).filter(Boolean)
}

/**
 * Retrieves list of user's bookmark resource IDs for instant UI state
 */
export async function getUserBookmarkIds(): Promise<string[]> {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) return []

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return []
  }

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('bookmarks')
    .select('resource_id')
    .eq('user_id', decoded.uid)

  return data ? data.map(d => d.resource_id) : []
}

/**
 * Fetches all community paper requests
 */
export async function getPaperRequests() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('paper_requests')
    .select(`
      *,
      users ( name, username, cu_verified )
    `)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    return []
  }

  return data || []
}

/**
 * Submits a new paper request
 */
export async function createPaperRequest(formData: FormData) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { error: 'Please log in to submit a paper request.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Authentication expired.' }
  }

  const subjectName = (formData.get('subject_name') as string)?.trim()
  const examType = (formData.get('exam_type') as string)?.trim() || 'MST1'
  const examYear = parseInt(formData.get('exam_year') as string)
  const semester = parseInt(formData.get('semester') as string || '1')
  const note = (formData.get('note') as string)?.trim()

  if (!subjectName || !examType || isNaN(examYear)) {
    return { error: 'Please specify the subject name, exam type, and year.' }
  }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('paper_requests')
    .insert({
      requested_by: decoded.uid,
      subject_name: subjectName,
      exam_type: examType,
      exam_year: examYear,
      semester: semester,
      note: note || null,
      status: 'open'
    })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

/**
 * Marks a paper request as fulfilled
 */
export async function fulfillPaperRequest(requestId: number) {
  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('paper_requests')
    .update({ status: 'fulfilled' })
    .eq('id', requestId)

  if (error) return { error: error.message }

  revalidatePath('/dashboard')
  return { success: true }
}
