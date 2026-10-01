'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { revalidatePath } from 'next/cache'
import { v4 as uuidv4 } from 'uuid'
import { sendStudentNotification } from '@/lib/notifications'

export interface CommunityResponseItem {
  id: string
  request_id: number
  user_id: string
  response_type: string
  message?: string
  file_path?: string
  file_name?: string
  file_type?: string
  external_link?: string
  status: 'pending' | 'approved' | 'rejected'
  admin_note?: string
  created_at: string
  users?: {
    id: string
    name: string
    username?: string
    cu_verified?: boolean
  }
}

export async function getCommunityRequests(filters?: {
  semester?: number
  examType?: string
  status?: string
  requestType?: string
  search?: string
}) {
  const supabase = getSupabaseAdmin()

  let query = supabase
    .from('paper_requests')
    .select(`
      *,
      users:requested_by ( id, name, username, cu_verified )
    `)
    .order('created_at', { ascending: false })

  if (filters?.semester) {
    query = query.eq('semester', filters.semester)
  }
  if (filters?.status && filters.status !== 'ALL') {
    query = query.eq('status', filters.status.toLowerCase())
  }
  if (filters?.examType && filters.examType !== 'ALL') {
    query = query.eq('exam_type', filters.examType)
  }
  if (filters?.requestType && filters.requestType !== 'ALL') {
    query = query.eq('request_type', filters.requestType.toLowerCase())
  }

  const { data: requests, error } = await query

  if (error || !requests) {
    return []
  }

  let result = requests

  if (filters?.search) {
    const term = filters.search.toLowerCase().trim()
    result = result.filter(r =>
      r.subject_name?.toLowerCase().includes(term) ||
      r.title?.toLowerCase().includes(term) ||
      r.note?.toLowerCase().includes(term) ||
      String(r.exam_year || '').includes(term)
    )
  }

  // Identify current user session
  let currentUserId: string | null = null
  let userUpvotedIds: number[] = []
  const token = (await cookies()).get('firebase-token')?.value
  if (token) {
    try {
      const decoded = await authAdmin.verifyIdToken(token)
      currentUserId = decoded.uid
      const { data: upvotes } = await supabase
        .from('request_upvotes')
        .select('request_id')
        .eq('user_id', decoded.uid)

      if (upvotes) {
        userUpvotedIds = upvotes.map(u => u.request_id)
      }
    } catch {
      userUpvotedIds = []
    }
  }

  // Fetch approved responses and pending responses for these requests
  const requestIds = result.map(r => r.id)
  let responsesMap: Record<number, CommunityResponseItem[]> = {}
  let pendingCountMap: Record<number, number> = {}

  if (requestIds.length > 0) {
    try {
      const { data: responses } = await supabase
        .from('request_responses')
        .select(`
          *,
          users:user_id ( id, name, username, cu_verified )
        `)
        .in('request_id', requestIds)
        .order('created_at', { ascending: true })

      if (responses) {
        responses.forEach((resp: any) => {
          if (resp.status === 'approved') {
            if (!responsesMap[resp.request_id]) responsesMap[resp.request_id] = []
            responsesMap[resp.request_id].push(resp)
          } else if (resp.status === 'pending') {
            pendingCountMap[resp.request_id] = (pendingCountMap[resp.request_id] || 0) + 1
            // If the current user submitted this pending response, include it so they see their submission status!
            if (currentUserId && resp.user_id === currentUserId) {
              if (!responsesMap[resp.request_id]) responsesMap[resp.request_id] = []
              responsesMap[resp.request_id].push(resp)
            }
          }
        })
      }
    } catch {
      // Table may not yet be migrated
      responsesMap = {}
      pendingCountMap = {}
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return result.map((r: any) => ({
    ...r,
    request_type: r.request_type || 'pyq',
    hasUpvoted: userUpvotedIds.includes(r.id),
    upvotes: r.upvotes || 0,
    approvedResponses: responsesMap[r.id] || [],
    pendingResponsesCount: pendingCountMap[r.id] || 0,
    isMyRequest: Boolean(currentUserId && r.requested_by === currentUserId)
  }))
}

/**
 * Creates a community request.
 * Requirement: User MUST be registered and logged into Prevu.
 */
export async function createCommunityRequest(formData: FormData) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { 
      error: 'Registration required: Please create a free Prevu account or log in to post a request for PYQs, study material, or doubts.' 
    }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Session expired. Please log in again to post your request.' }
  }

  const supabase = getSupabaseAdmin()

  // Ensure user profile exists in database
  const { data: userProfile } = await supabase
    .from('users')
    .select('id, name, username')
    .eq('id', decoded.uid)
    .maybeSingle()

  if (!userProfile) {
    const email = decoded.email?.toLowerCase() || ''
    const fallbackUsername = email ? email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : `user_${decoded.uid.slice(0, 5)}`
    await supabase.from('users').insert({
      id: decoded.uid,
      name: decoded.name || email.split('@')[0] || 'Student',
      username: fallbackUsername,
      email: decoded.email,
      cu_verified: email.endsWith('@cuchd.in') ? true : false,
      role: 'student'
    })
  }

  const requestType = ((formData.get('request_type') as string) || 'pyq').trim().toLowerCase()
  const subjectName = (formData.get('subject_name') as string)?.trim()
  const title = (formData.get('title') as string)?.trim()
  const examType = (formData.get('exam_type') as string)?.trim() || 'MST1'
  const examYear = parseInt(formData.get('exam_year') as string || String(new Date().getFullYear()))
  const semester = parseInt(formData.get('semester') as string || '1')
  const note = (formData.get('note') as string)?.trim()

  if (!subjectName) {
    return { error: 'Please enter the subject name for your request.' }
  }

  try {
    const { data: newReq, error } = await supabase
      .from('paper_requests')
      .insert({
        requested_by: decoded.uid,
        request_type: requestType,
        title: title || `${subjectName} (${requestType.toUpperCase()})`,
        subject_name: subjectName,
        exam_type: examType,
        exam_year: examYear,
        semester: semester,
        note: note || null,
        status: 'open'
      })
      .select('id')
      .single()

    if (error) {
      // Fallback if request_type or title columns do not exist in DB yet
      const fallbackInsert = await supabase
        .from('paper_requests')
        .insert({
          requested_by: decoded.uid,
          subject_name: subjectName,
          exam_type: examType,
          exam_year: examYear,
          semester: semester,
          note: `[Type: ${requestType.toUpperCase()}] ${note || ''}`.trim(),
          status: 'open'
        })
        .select('id')
        .single()

      if (fallbackInsert.error) {
        return { error: `Failed to create request: ${fallbackInsert.error.message}` }
      }
    }

    // Send confirmation notification to student
    await sendStudentNotification({
      userId: decoded.uid,
      title: 'Request Posted Successfully',
      message: `Your request for ${subjectName} has been shared on the Prevu Community Board! Batchmates can now see it and share materials.`,
      type: 'request_update',
      link: '/requests'
    })

    revalidatePath('/requests')
    revalidatePath('/dashboard')
    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An error occurred while creating your request.' }
  }
}

/**
 * Batchmate submits help / shares PYQ / answers doubt for a request.
 * Requirement: Batchmate must be logged in.
 * Workflow:
 * 1. Batchmate uploads file, link, or written answer.
 * 2. Status is set to 'pending' for Admin approval.
 * 3. Batchmate is notified: "Thank you for sharing! Wait for admin approval."
 * 4. Requester is notified: "A batchmate helped! Awaiting admin verification."
 */
export async function submitBatchmateHelp(formData: FormData) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { error: 'Please log in or register on Prevu to help your batchmate.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Session expired. Please log in again.' }
  }

  const supabase = getSupabaseAdmin()

  const requestId = parseInt(formData.get('request_id') as string)
  const responseType = ((formData.get('response_type') as string) || 'pyq').trim().toLowerCase()
  const message = (formData.get('message') as string)?.trim() || ''
  const externalLink = (formData.get('external_link') as string)?.trim() || ''
  const file = formData.get('file') as File | null

  if (isNaN(requestId)) {
    return { error: 'Invalid request specified.' }
  }

  if (!file && !externalLink && !message) {
    return { error: 'Please provide either a file upload, resource link, or written explanation to help.' }
  }

  // Verify target request exists
  const { data: targetReq, error: reqErr } = await supabase
    .from('paper_requests')
    .select('id, subject_name, requested_by, status')
    .eq('id', requestId)
    .single()

  if (reqErr || !targetReq) {
    return { error: 'The requested question paper or material could not be found.' }
  }

  // Ensure user profile in users table
  const { data: userProfile } = await supabase
    .from('users')
    .select('id, name, username')
    .eq('id', decoded.uid)
    .maybeSingle()

  if (!userProfile) {
    const email = decoded.email?.toLowerCase() || ''
    const fallbackUsername = email ? email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : `user_${decoded.uid.slice(0, 5)}`
    await supabase.from('users').insert({
      id: decoded.uid,
      name: decoded.name || email.split('@')[0] || 'Student',
      username: fallbackUsername,
      email: decoded.email,
      cu_verified: email.endsWith('@cuchd.in') ? true : false,
      role: 'student'
    })
  }

  const filesList = formData.getAll('files') as File[]
  const singleFile = formData.get('file') as File | null
  const rawFiles = filesList && filesList.length > 0 ? filesList : (singleFile ? [singleFile] : [])
  const validFiles = rawFiles.filter(f => f && f.size > 0).slice(0, 3)

  let uploadedFilePath: string | null = null
  let uploadedFileName: string | null = null
  let uploadedFileType: string | null = null

  // If files are uploaded (supports 1 to 3 files at once), upload to Supabase Storage
  if (validFiles.length > 0) {
    const allowedExts = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'zip']

    // Ensure bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some(b => b.name === 'resources')
      if (!bucketExists) {
        await supabase.storage.createBucket('resources', { public: true })
      }
    } catch (bErr) {
      console.warn("Storage bucket check:", bErr)
    }

    const uploadedList: Array<{ path: string; name: string; type: string }> = []

    for (let i = 0; i < validFiles.length; i++) {
      const currentFile = validFiles[i]
      const ext = (currentFile.name.split('.').pop() || '').toLowerCase()
      if (!allowedExts.includes(ext)) {
        return { error: `Invalid format for "${currentFile.name}". Please upload PDF, JPG, PNG, DOCX, or ZIP files.` }
      }

      if (currentFile.size > 40 * 1024 * 1024) {
        return { error: `File "${currentFile.name}" exceeds 40MB limit.` }
      }

      try {
        const arrayBuffer = await currentFile.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const storagePath = `community_help/${requestId}/${uuidv4()}.${ext}`

        const { error: uploadErr } = await supabase.storage
          .from('resources')
          .upload(storagePath, buffer, {
            contentType: currentFile.type || 'application/octet-stream',
            upsert: true
          })

        if (uploadErr) {
          return { error: `Failed to upload "${currentFile.name}": ${uploadErr.message}` }
        }

        uploadedList.push({
          path: storagePath,
          name: currentFile.name,
          type: currentFile.type || ext
        })
      } catch (uploadException: any) {
        return { error: `File upload failed for "${currentFile.name}": ${uploadException.message}` }
      }
    }

    if (uploadedList.length === 1) {
      uploadedFilePath = uploadedList[0].path
      uploadedFileName = uploadedList[0].name
      uploadedFileType = uploadedList[0].type
    } else if (uploadedList.length > 1) {
      uploadedFilePath = JSON.stringify(uploadedList)
      uploadedFileName = `${uploadedList.length} files: ${uploadedList.map(f => f.name).join(', ')}`
      uploadedFileType = 'multipart/mixed'
    }
  }

  // Insert response record into request_responses table
  try {
    const { error: insertErr } = await supabase
      .from('request_responses')
      .insert({
        request_id: requestId,
        user_id: decoded.uid,
        response_type: responseType,
        message: message || null,
        file_path: uploadedFilePath,
        file_name: uploadedFileName,
        file_type: uploadedFileType,
        external_link: externalLink || null,
        status: 'pending' // Admin must review and approve!
      })

    if (insertErr) {
      console.error('Error inserting response:', insertErr)
      if (insertErr.message?.includes('schema cache') || insertErr.message?.includes('request_responses')) {
        return { error: 'Database setup pending: The "request_responses" table has not been created in Supabase yet. Please run COMMUNITY_REQUESTS_HELP_SCHEMA.sql in your Supabase SQL editor.' }
      }
      return { error: `Failed to submit help response: ${insertErr.message}` }
    }

    // 1. Notify Contributor (Batchmate who shared)
    await sendStudentNotification({
      userId: decoded.uid,
      title: 'Thank you for sharing!',
      message: `Thank you for sharing data for "${targetReq.subject_name}"! Your contribution is currently pending Admin Department approval. Once approved, it will be visible on the dashboard and community board.`,
      type: 'pending_approval',
      link: '/requests'
    })

    // 2. Notify Requester (Student who raised the query)
    if (targetReq.requested_by && targetReq.requested_by !== decoded.uid) {
      await sendStudentNotification({
        userId: targetReq.requested_by,
        title: 'A batchmate has submitted help!',
        message: `A batchmate just shared material for your request "${targetReq.subject_name}"! It is now with the Admin Department for verification before going live.`,
        type: 'batchmate_helped',
        link: '/requests'
      })
    }

    revalidatePath('/requests')
    revalidatePath('/admin/requests')
    revalidatePath('/dashboard')

    return { 
      success: true,
      message: 'Thank you for sharing the data! Please wait for admin approval. Once verified, it will be visible on the dashboard and community board.'
    }
  } catch (err: any) {
    return { error: err.message || 'An error occurred while submitting your contribution.' }
  }
}

export async function toggleRequestUpvote(requestId: number) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { error: 'Please log in to upvote requests.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Session expired. Please log in again.' }
  }

  const supabase = getSupabaseAdmin()

  try {
    const { data: existing } = await supabase
      .from('request_upvotes')
      .select('id')
      .eq('request_id', requestId)
      .eq('user_id', decoded.uid)
      .maybeSingle()

    if (existing) {
      // Remove upvote
      await supabase
        .from('request_upvotes')
        .delete()
        .eq('id', existing.id)

      const { data: req } = await supabase
        .from('paper_requests')
        .select('upvotes')
        .eq('id', requestId)
        .single()

      const currentCount = req?.upvotes || 1
      await supabase
        .from('paper_requests')
        .update({ upvotes: Math.max(0, currentCount - 1) })
        .eq('id', requestId)

      revalidatePath('/requests')
      revalidatePath('/dashboard')
      return { success: true, upvoted: false }
    } else {
      // Insert upvote
      await supabase
        .from('request_upvotes')
        .insert({
          request_id: requestId,
          user_id: decoded.uid
        })

      const { data: req } = await supabase
        .from('paper_requests')
        .select('upvotes')
        .eq('id', requestId)
        .single()

      const currentCount = req?.upvotes || 0
      await supabase
        .from('paper_requests')
        .update({ upvotes: currentCount + 1 })
        .eq('id', requestId)

      revalidatePath('/requests')
      revalidatePath('/dashboard')
      return { success: true, upvoted: true }
    }
  } catch {
    // If request_upvotes table not yet migrated, fallback gracefully
    const { data: req } = await supabase
      .from('paper_requests')
      .select('upvotes')
      .eq('id', requestId)
      .single()

    const currentCount = req?.upvotes || 0
    await supabase
      .from('paper_requests')
      .update({ upvotes: currentCount + 1 })
      .eq('id', requestId)

    revalidatePath('/requests')
    return { success: true, upvoted: true }
  }
}

/**
 * Fetches personal student notifications (request updates, admin review feedback)
 */
export async function getMyNotifications() {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) return []

  try {
    const decoded = await authAdmin.verifyIdToken(token)
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('student_notifications')
      .select('*')
      .eq('user_id', decoded.uid)
      .order('created_at', { ascending: false })
      .limit(15)

    if (error) return []
    return data || []
  } catch {
    return []
  }
}

/**
 * Marks a student notification as read
 */
export async function markNotificationAsRead(notificationId: string) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) return { error: 'Unauthorized' }

  try {
    const decoded = await authAdmin.verifyIdToken(token)
    const supabase = getSupabaseAdmin()
    await supabase
      .from('student_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', decoded.uid)

    return { success: true }
  } catch {
    return { error: 'Failed to update notification' }
  }
}

