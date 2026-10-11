'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function getUserProfile() {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) return null

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return null
  }

  const supabase = getSupabaseAdmin()
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', decoded.uid)
    .maybeSingle()

  return user || null
}

export async function updateUserProfile(formData: FormData) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { error: 'Please log in to update your profile.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Invalid or expired session. Please log in again.' }
  }

  const supabase = getSupabaseAdmin()

  // Fetch current user record
  const { data: currentUser, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('id', decoded.uid)
    .maybeSingle()

  if (fetchError || !currentUser) {
    return { error: 'Could not load your user profile.' }
  }

  const name = (formData.get('name') as string)?.trim()
  const rawUsername = (formData.get('username') as string)?.trim().toLowerCase()
  const studentUid = (formData.get('student_uid') as string)?.trim().toUpperCase()
  const branch = (formData.get('branch') as string)?.trim() || 'BE-CSE'
  const currentSemester = parseInt(formData.get('current_semester') as string || '1')
  const phoneNumber = (formData.get('phone_number') as string)?.trim()
  const cuEmail = (formData.get('cu_email') as string)?.trim().toLowerCase()

  if (!name) {
    return { error: 'Please provide your full name.' }
  }

  const updates: Record<string, string | number | boolean | null> = {
    name,
    student_uid: studentUid || null,
    branch,
    current_semester: isNaN(currentSemester) ? 1 : currentSemester,
    phone_number: phoneNumber || null,
  }

  // Handle Avatar Image File Upload
  const avatarFile = formData.get('avatar_file') as File | null
  if (avatarFile && avatarFile.size > 0 && avatarFile.type.startsWith('image/')) {
    const ext = avatarFile.name.split('.').pop() || 'jpg'
    const avatarPath = `avatars/${decoded.uid}-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(avatarPath, avatarFile, { upsert: true })

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage
        .from('resources')
        .getPublicUrl(avatarPath)

      if (publicUrlData?.publicUrl) {
        updates.avatar_url = publicUrlData.publicUrl
      }
    } else {
      console.warn("Avatar upload error:", uploadError)
    }
  }

  // Handle University Email
  if (cuEmail) {
    if (!cuEmail.endsWith('@cuchd.in')) {
      return { error: 'Chandigarh University email must end with @cuchd.in (leave blank if you do not have one yet).' }
    }
    updates.cu_email = cuEmail
    updates.cu_verified = true
  } else {
    updates.cu_email = null
    if (!currentUser.email?.endsWith('@cuchd.in')) {
      updates.cu_verified = false
    }
  }

  // Username Change Logic (Max 3 changes)
  let usernameChanged = false
  const currentUsername = (currentUser.username || '').toLowerCase()
  const changesLeft = currentUser.username_changes_left ?? 3

  if (rawUsername && rawUsername !== currentUsername) {
    if (changesLeft <= 0) {
      return { error: 'You have reached the maximum limit of 3 username changes.' }
    }

    if (rawUsername.length < 3) {
      return { error: 'Username must be at least 3 characters long.' }
    }

    if (!/^[a-zA-Z0-9_.-]+$/.test(rawUsername)) {
      return { error: 'Username can only contain letters, numbers, underscores, dots, and hyphens.' }
    }

    // Check if new username is already taken by another user
    const { data: existingUserWithUsername } = await supabase
      .from('users')
      .select('id')
      .ilike('username', rawUsername)
      .neq('id', decoded.uid)
      .maybeSingle()

    if (existingUserWithUsername) {
      return { error: `The username "@${rawUsername}" is already taken. Please choose another.` }
    }

    updates.username = rawUsername
    updates.username_changes_left = Math.max(0, changesLeft - 1)
    usernameChanged = true
  }

  const { error: updateError } = await supabase
    .from('users')
    .update(updates)
    .eq('id', decoded.uid)

  if (updateError) {
    console.error("Profile update error:", updateError)
    return { error: `Failed to update profile: ${updateError.message}` }
  }

  revalidatePath('/dashboard')
  revalidatePath('/profile')
  revalidatePath('/browse')
  revalidatePath('/admin')

  return { 
    success: true, 
    usernameChanged,
    avatarUrl: updates.avatar_url as string | undefined,
    changesLeft: usernameChanged ? Math.max(0, changesLeft - 1) : changesLeft 
  }
}

/**
 * Permanently deletes the student account and removes all associated records.
 * Requires user confirmation and captures the reason for departure.
 */
export async function deleteUserAccount(formData: FormData) {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    return { error: 'Please log in to perform this action.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Invalid or expired session. Please log in again.' }
  }

  const reason = (formData.get('reason') as string)?.trim()
  const feedback = (formData.get('feedback') as string)?.trim()
  const confirmation = (formData.get('confirmation') as string)?.trim().toUpperCase()

  if (!reason) {
    return { error: 'Please select a reason for deleting your account.' }
  }

  if (confirmation !== 'DELETE') {
    return { error: 'Please type "DELETE" to confirm account deletion.' }
  }

  const supabase = getSupabaseAdmin()
  const uid = decoded.uid

  try {
    // 1. Log departure reason in account_deletions table (fail-safe)
    try {
      await supabase.from('account_deletions').insert({
        user_id: uid,
        email: decoded.email || null,
        reason,
        feedback: feedback || null,
        deleted_at: new Date().toISOString()
      })
    } catch {
      // Table might not exist yet; fail-safe
    }

    // 2. Remove student notifications
    try {
      await supabase.from('student_notifications').delete().eq('user_id', uid)
    } catch {
      // safe fallback
    }

    // 3. Remove bookmarks
    try {
      await supabase.from('bookmarks').delete().eq('user_id', uid)
    } catch {
      // safe fallback
    }

    // 4. Remove upvotes
    try {
      await supabase.from('resource_upvotes').delete().eq('user_id', uid)
      await supabase.from('request_upvotes').delete().eq('user_id', uid)
    } catch {
      // safe fallback
    }

    // 5. Delete user profile from database
    const { error: dbDeleteErr } = await supabase.from('users').delete().eq('id', uid)
    if (dbDeleteErr) {
      console.warn('Could not delete user record directly:', dbDeleteErr.message)
    }

    // 6. Delete user from Firebase Auth
    try {
      await authAdmin.deleteUser(uid)
    } catch (fbErr: any) {
      console.warn('Firebase deleteUser warning:', fbErr?.message)
    }

    // 7. Clear session cookie
    const cookieStore = await cookies()
    cookieStore.delete('firebase-token')

    revalidatePath('/')
    revalidatePath('/dashboard')
    revalidatePath('/profile')

    return { success: true }
  } catch (err: any) {
    return { error: err.message || 'An error occurred while deleting your account.' }
  }
}

