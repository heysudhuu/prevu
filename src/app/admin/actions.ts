'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'

// List of super-admin email addresses
const ADMIN_EMAILS = [
  'py7716496@gmail.com'
]

async function getAdminDb() {
  return getSupabaseAdmin()
}

/**
 * Checks whether the current authenticated user is an Admin.
 * Automatically promotes whitelisted admin emails.
 */
export async function checkAdmin() {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) return false

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return false
  }

  const email = decoded.email?.toLowerCase() || ''
  const isWhitelisted = ADMIN_EMAILS.includes(email)

  const supabase = await getAdminDb()

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', decoded.uid)
    .maybeSingle()

  if (isWhitelisted && userData?.role !== 'admin') {
    // Auto-promote to admin
    await supabase.from('users').update({ role: 'admin' }).eq('id', decoded.uid)
    return true
  }

  return isWhitelisted || userData?.role === 'admin'
}

/**
 * Fetches overview metrics for the Admin Dashboard
 */
export async function getAdminStats() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return null

  const supabase = await getAdminDb()

  const [
    { count: pendingCount },
    { count: approvedCount },
    { count: rejectedCount },
    { count: usersCount },
    { count: subjectsCount }
  ] = await Promise.all([
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('subjects').select('*', { count: 'exact', head: true })
  ])

  return {
    pendingCount: pendingCount || 0,
    approvedCount: approvedCount || 0,
    rejectedCount: rejectedCount || 0,
    usersCount: usersCount || 0,
    subjectsCount: subjectsCount || 0
  }
}

/**
 * Fetches all pending resources with signed preview URLs
 */
export async function getPendingResources() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return []

  const supabaseAdmin = await getAdminDb()

  const { data, error } = await supabaseAdmin
    .from('resources')
    .select(`
      *,
      subjects ( id, name, code, year, semester ),
      exam_types ( id, name ),
      users ( id, name, username, email, cu_email, cu_verified )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching pending resources:", error)
    return []
  }

  // Generate signed URLs for file previews
  const resourcesWithUrls = await Promise.all(data.map(async (resource) => {
    try {
      const { data: urlData } = await supabaseAdmin.storage
        .from('resources')
        .createSignedUrl(resource.file_path, 60 * 60) // 1 hour
        
      return {
        ...resource,
        previewUrl: urlData?.signedUrl || null
      }
    } catch {
      return { ...resource, previewUrl: null }
    }
  }))

  return resourcesWithUrls
}

/**
 * Fetches all approved resources for the Live Archive tab
 */
export async function getApprovedResources() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return []

  const supabaseAdmin = await getAdminDb()

  const { data, error } = await supabaseAdmin
    .from('resources')
    .select(`
      *,
      subjects ( id, name, code, year, semester ),
      exam_types ( id, name ),
      users ( id, name, username, email, cu_verified )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching approved resources:", error)
    return []
  }

  return data || []
}

/**
 * Fetches all registered users for user management
 */
export async function getAllUsers() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return []

  const supabase = await getAdminDb()
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data || []
}

/**
 * Fetches all subjects categorized with resource counts
 */
export async function getAllSubjects() {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return []

  const supabase = await getAdminDb()
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      branches ( name )
    `)
    .order('year', { ascending: true })
    .order('semester', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error("Error fetching subjects:", error)
    return []
  }

  return data || []
}

/**
 * Approves a resource with optional edited metadata
 */
export async function approveResource(id: string, metadata?: { 
  subject_name?: string
  subject_code?: string
  exam_type?: string
  exam_year?: number
  year?: number
  semester?: number
}) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabaseAdmin = await getAdminDb()
  
  const updateData: Record<string, string | number | null> = { status: 'approved', admin_note: null }
  
  if (metadata?.exam_year) {
    updateData.exam_year = metadata.exam_year
  }

  if (metadata?.subject_name && metadata?.year && metadata?.semester) {
    // Find or create subject
    const { data: existingSub } = await supabaseAdmin
      .from('subjects')
      .select('id')
      .ilike('name', metadata.subject_name.trim())
      .eq('year', metadata.year)
      .eq('semester', metadata.semester)
      .maybeSingle()

    if (existingSub) {
      updateData.subject_id = existingSub.id
    } else {
      const { data: newSub } = await supabaseAdmin
        .from('subjects')
        .insert({
          branch_id: 1,
          year: metadata.year,
          semester: metadata.semester,
          name: metadata.subject_name.trim(),
          code: (metadata.subject_code || 'CSE').toUpperCase()
        })
        .select('id')
        .single()
      if (newSub) updateData.subject_id = newSub.id
    }
  }

  if (metadata?.exam_type) {
    const cleanET = metadata.exam_type.toUpperCase().replace(/\s+/g, '')
    const { data: existingET } = await supabaseAdmin
      .from('exam_types')
      .select('id')
      .or(`name.ilike.${cleanET},name.ilike.${metadata.exam_type}`)
      .maybeSingle()

    if (existingET) {
      updateData.exam_type_id = existingET.id
    }
  }

  const { error } = await supabaseAdmin
    .from('resources')
    .update(updateData)
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin')
  revalidatePath('/browse')
  revalidatePath('/')
  return { success: true }
}

/**
 * Rejects a resource with a reason
 */
export async function rejectResource(id: string, reason: string) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabaseAdmin = await getAdminDb()
  
  const { error } = await supabaseAdmin
    .from('resources')
    .update({ status: 'rejected', admin_note: reason })
    .eq('id', id)

  if (error) return { error: error.message }
  
  revalidatePath('/admin')
  return { success: true }
}

/**
 * Deletes a resource permanently
 */
export async function deleteResource(id: string, filePath?: string) {
  const isAdmin = await checkAdmin()
  if (!isAdmin) return { error: 'Unauthorized' }

  const supabaseAdmin = await getAdminDb()

  // 1. Delete from storage if filePath exists
  if (filePath) {
    try {
      await supabaseAdmin.storage.from('resources').remove([filePath])
    } catch (e) {
      console.warn("Could not delete file from storage:", e)
    }
  }

  // 2. Delete from DB
  const { error } = await supabaseAdmin
    .from('resources')
    .delete()
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin')
  revalidatePath('/browse')
  return { success: true }
}
