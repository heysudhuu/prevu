'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'

/**
 * Checks whether a given username is available or already taken.
 */
export async function checkUsernameAvailable(username: string) {
  try {
    const cleanUsername = username.trim().toLowerCase()
    if (!cleanUsername || cleanUsername.length < 3) {
      return { available: false, error: 'Username must be at least 3 characters long.' }
    }

    // Basic format: letters, numbers, underscores, dots, hyphens
    if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
      return { 
        available: false, 
        error: 'Username can only contain letters, numbers, underscores, dots, and hyphens.' 
      }
    }

    const supabase = getSupabaseAdmin()

    const { data } = await supabase
      .from('users')
      .select('id')
      .ilike('username', cleanUsername)
      .limit(1)

    return { available: !data || data.length === 0 }
  } catch (error) {
    console.error('Error checking username:', error)
    return { available: false, error: 'Could not verify username availability.' }
  }
}

/**
 * Resolves an email address from either an email or a username/UID identifier.
 */
export async function resolveEmailFromIdentifier(identifier: string): Promise<{ email?: string; error?: string }> {
  try {
    const cleanIdentifier = identifier.trim()
    if (!cleanIdentifier) {
      return { error: 'Please provide a username or email address.' }
    }

    // If identifier already has '@', it's an email
    if (cleanIdentifier.includes('@')) {
      return { email: cleanIdentifier }
    }

    const supabase = getSupabaseAdmin()

    // Lookup user by username (case-insensitive) or CU email prefix or ID
    const { data, error } = await supabase
      .from('users')
      .select('email')
      .or(`username.ilike.${cleanIdentifier},cu_email.ilike.${cleanIdentifier}@cuchd.in,cu_email.ilike.${cleanIdentifier}`)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error querying user by identifier:', error)
    }

    if (data?.email) {
      return { email: data.email }
    }

    return { 
      error: `No account found with username or ID "${cleanIdentifier}". Please check your spelling or sign in with your registered email.` 
    }
  } catch (error) {
    console.error('Error resolving identifier to email:', error)
    return { error: 'Failed to look up username. Please try again or use your email address.' }
  }
}

/**
 * Synchronizes authenticated Firebase user into Supabase `users` database table.
 */
export async function syncUserToServer(idToken: string, name?: string, username?: string) {
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken)
    const uid = decodedToken.uid
    const email = decodedToken.email

    // Store token in cookie
    const cookieStore = await cookies()
    cookieStore.set('firebase-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Sync user to Supabase Database
    const supabase = getSupabaseAdmin()

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name, username, role')
      .eq('id', uid)
      .maybeSingle()

    const resolvedName = name?.trim() || decodedToken.name || email?.split('@')[0] || 'Student'
    
    // Auto-generate fallback username for Google users if none provided
    const fallbackUsername = email ? email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : undefined
    const resolvedUsername = username?.trim().toLowerCase() || existingUser?.username || fallbackUsername

    const isSuperAdminEmail = email?.toLowerCase() === 'py7716496@gmail.com'
    const finalRole = isSuperAdminEmail ? 'admin' : (existingUser?.role || 'student')

    if (!existingUser) {
      await supabase.from('users').insert({
        id: uid,
        name: resolvedName,
        username: resolvedUsername,
        email: email,
        cu_verified: email?.endsWith('@cuchd.in') ? true : false,
        cu_email: email?.endsWith('@cuchd.in') ? email : null,
        role: finalRole
      })
    } else {
      const updates: { name?: string; username?: string; cu_verified?: boolean; cu_email?: string; role?: string } = {}
      if (isSuperAdminEmail && existingUser.role !== 'admin') {
        updates.role = 'admin'
      }
      if (name?.trim() && (!existingUser.name || existingUser.name === 'Unknown User')) {
        updates.name = resolvedName
      }
      if (username?.trim() && !existingUser.username) {
        updates.username = resolvedUsername
      }
      if (email?.endsWith('@cuchd.in')) {
        updates.cu_verified = true
        updates.cu_email = email
      }

      if (Object.keys(updates).length > 0) {
        await supabase.from('users').update(updates).eq('id', uid)
      }
    }

    return { success: true, role: finalRole }
  } catch (error: Error | unknown) {
    console.error('Error syncing user:', error)
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error(String(error))
  }
}

/**
 * Lightweight token refresher to keep cookies in sync with Firebase client.
 */
export async function refreshAuthCookie(idToken: string) {
  try {
    await authAdmin.verifyIdToken(idToken)
    const cookieStore = await cookies()
    cookieStore.set('firebase-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })
    return { success: true }
  } catch (error) {
    console.error('Error refreshing token cookie:', error)
    return { success: false }
  }
}
