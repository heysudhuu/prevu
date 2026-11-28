'use server'

import crypto from 'crypto'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { isSuperAdminEmail } from '@/lib/auth/admin-check'
import { sendStudentNotification } from '@/lib/notifications'
import {
  isDisposableEmail,
  hashOtp,
  safeCompareHex,
  signTokenPayload,
  verifyTokenPayload,
  sendOtpEmail
} from '@/lib/auth/otp'

const OTP_COOKIE_NAME = 'prevu-signup-otp'
const VERIFIED_EMAIL_COOKIE_NAME = 'prevu-verified-email'

interface SignupOtpCookie {
  email: string
  otpHash: string
  exp: number
  sentAt: number
  attempts: number
}

interface VerifiedEmailCookie {
  email: string
  verifiedAt: number
  exp: number
}

/**
 * Step 1a: Send a 6-digit OTP verification code to the student's email before account creation.
 */
export async function sendSignupOtp(rawEmail: string): Promise<{ success?: boolean; error?: string; devMode?: boolean }> {
  try {
    const email = rawEmail.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      return { error: 'Please enter a valid email address.' }
    }

    if (isDisposableEmail(email)) {
      return { error: 'Temporary or disposable email addresses are not allowed. Please use your personal or university email.' }
    }

    const cookieStore = await cookies()
    const existingOtpRaw = cookieStore.get(OTP_COOKIE_NAME)?.value
    if (existingOtpRaw) {
      const existing = verifyTokenPayload<SignupOtpCookie>(existingOtpRaw)
      if (existing && existing.email === email && Date.now() - existing.sentAt < 60_000) {
        const waitSec = Math.ceil((60_000 - (Date.now() - existing.sentAt)) / 1000)
        return { error: `Please wait ${waitSec}s before requesting another verification code.` }
      }
    }

    // Check if email already exists in Supabase
    const supabase = getSupabaseAdmin()
    const { data: existingDbUser } = await supabase
      .from('users')
      .select('id')
      .or(`email.ilike.${email},cu_email.ilike.${email}`)
      .limit(1)
      .maybeSingle()

    if (existingDbUser) {
      return { error: 'An account with this email already exists. Please sign in instead.' }
    }

    const otp = String(crypto.randomInt(100000, 1000000))
    const now = Date.now()
    const cookiePayload: SignupOtpCookie = {
      email,
      otpHash: hashOtp(email, otp),
      exp: now + 10 * 60_000, // 10 minutes
      sentAt: now,
      attempts: 0
    }

    const emailRes = await sendOtpEmail(email, otp)

    cookieStore.set(OTP_COOKIE_NAME, signTokenPayload(cookiePayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 10 * 60
    })

    return { success: true, devMode: emailRes.devMode }
  } catch (err: unknown) {
    console.error('[Prevu OTP] sendSignupOtp error:', err)
    return {
      error: err instanceof Error ? err.message : 'Failed to send verification code. Please try again.'
    }
  }
}

/**
 * Step 1b: Verify the 6-digit OTP and issue a signed email-verified cookie for Step 2.
 */
export async function verifySignupOtp(rawEmail: string, rawOtp: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const email = rawEmail.trim().toLowerCase()
    const otp = rawOtp.trim().replace(/\s+/g, '')

    if (!email || !/^\d{6}$/.test(otp)) {
      return { error: 'Please enter the 6-digit verification code sent to your email.' }
    }

    const cookieStore = await cookies()
    const token = cookieStore.get(OTP_COOKIE_NAME)?.value
    if (!token) {
      return { error: 'Verification code expired or not found. Please request a new code.' }
    }

    const payload = verifyTokenPayload<SignupOtpCookie>(token)
    if (!payload || payload.email !== email) {
      return { error: 'Verification session mismatch. Please request a new code.' }
    }

    if (Date.now() > payload.exp) {
      cookieStore.delete(OTP_COOKIE_NAME)
      return { error: 'This verification code has expired. Please request a new code.' }
    }

    if (payload.attempts >= 5) {
      cookieStore.delete(OTP_COOKIE_NAME)
      return { error: 'Too many incorrect attempts. Please request a new verification code.' }
    }

    const expectedHash = hashOtp(email, otp)
    if (!safeCompareHex(expectedHash, payload.otpHash)) {
      const nextAttempts = payload.attempts + 1
      if (nextAttempts >= 5) {
        cookieStore.delete(OTP_COOKIE_NAME)
        return { error: 'Too many incorrect attempts. Please request a new verification code.' }
      }
      cookieStore.set(
        OTP_COOKIE_NAME,
        signTokenPayload({ ...payload, attempts: nextAttempts }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: Math.max(60, Math.floor((payload.exp - Date.now()) / 1000))
        }
      )
      return { error: `Incorrect verification code. ${5 - nextAttempts} attempt(s) remaining.` }
    }

    // OTP verified! Clear OTP cookie and set signed verified-email cookie (valid 30 mins)
    cookieStore.delete(OTP_COOKIE_NAME)
    const verifiedPayload: VerifiedEmailCookie = {
      email,
      verifiedAt: Date.now(),
      exp: Date.now() + 30 * 60_000
    }
    cookieStore.set(VERIFIED_EMAIL_COOKIE_NAME, signTokenPayload(verifiedPayload), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 60
    })

    return { success: true }
  } catch (err) {
    console.error('[Prevu OTP] verifySignupOtp error:', err)
    return { error: 'Could not verify code. Please try again.' }
  }
}

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
 * Checks for minor typos (e.g. py771649611 vs py77164961) to help students recover their accounts.
 */
export async function resolveEmailFromIdentifier(identifier: string): Promise<{ email?: string; error?: string }> {
  try {
    const cleanIdentifier = identifier.trim()
    if (!cleanIdentifier) {
      return { error: 'Please provide a username or email address.' }
    }

    const supabase = getSupabaseAdmin()

    // If identifier already has '@', it's an email address
    if (cleanIdentifier.includes('@')) {
      const { data: userByEmail } = await supabase
        .from('users')
        .select('email, username')
        .or(`email.ilike.${cleanIdentifier},cu_email.ilike.${cleanIdentifier}`)
        .limit(1)
        .maybeSingle()

      if (userByEmail?.email) {
        return { email: userByEmail.email }
      }

      return { email: cleanIdentifier }
    }

    // Lookup user by username (case-insensitive) or CU email prefix or ID
    const { data, error } = await supabase
      .from('users')
      .select('email, username')
      .or(`username.ilike.${cleanIdentifier},cu_email.ilike.${cleanIdentifier}@cuchd.in,cu_email.ilike.${cleanIdentifier}`)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error querying user by identifier:', error)
    }

    if (data?.email) {
      return { email: data.email }
    }

    // Check if user had a minor typo in username
    if (cleanIdentifier.length >= 4) {
      const shortened = cleanIdentifier.slice(0, -1)
      const { data: similar } = await supabase
        .from('users')
        .select('email, username')
        .or(`username.ilike.%${shortened}%,email.ilike.%${shortened}%`)
        .limit(1)
        .maybeSingle()

      if (similar?.username) {
        return {
          error: `No account found with username "${cleanIdentifier}". Did you mean @${similar.username} (${similar.email})?`
        }
      }
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
export async function syncUserToServer(
  idToken: string,
  name?: string,
  username?: string,
  branch?: string,
  currentSemester?: number
) {
  try {
    const decodedToken = await authAdmin.verifyIdToken(idToken)
    const uid = decodedToken.uid
    const email = decodedToken.email?.toLowerCase()

    const cookieStore = await cookies()
    const supabase = getSupabaseAdmin()

    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, name, username, role')
      .eq('id', uid)
      .maybeSingle()

    // Enforce email verification for new email/password signups
    if (!existingUser && !decodedToken.email_verified) {
      const verifiedCookieRaw = cookieStore.get(VERIFIED_EMAIL_COOKIE_NAME)?.value
      const verifiedPayload = verifiedCookieRaw
        ? verifyTokenPayload<VerifiedEmailCookie>(verifiedCookieRaw)
        : null

      if (!verifiedPayload || !email || verifiedPayload.email !== email || Date.now() > verifiedPayload.exp) {
        throw new Error('Email verification required. Please verify your email with the OTP code first.')
      }

      // Valid OTP verification cookie confirmed — clear it so it cannot be reused
      cookieStore.delete(VERIFIED_EMAIL_COOKIE_NAME)
    }

    // Store token in cookie
    cookieStore.set('firebase-token', idToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    const resolvedName = name?.trim() || decodedToken.name || email?.split('@')[0] || 'Student'
    
    // Auto-generate fallback username for Google users if none provided
    const fallbackUsername = email ? email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : undefined
    const resolvedUsername = username?.trim().toLowerCase() || existingUser?.username || fallbackUsername

    const isSuperAdmin = isSuperAdminEmail(email)
    const finalRole = isSuperAdmin ? 'admin' : (existingUser?.role || 'student')

    const validSemester =
      typeof currentSemester === 'number' && currentSemester >= 1 && currentSemester <= 8
        ? currentSemester
        : 1

    if (!existingUser) {
      await supabase.from('users').insert({
        id: uid,
        name: resolvedName,
        username: resolvedUsername,
        email: email,
        branch: branch?.trim() || 'BE-CSE',
        current_semester: validSemester,
        cu_verified: email?.endsWith('@cuchd.in') ? true : false,
        cu_email: email?.endsWith('@cuchd.in') ? email : null,
        role: finalRole
      })

      // Send Option A Welcoming Family Notification to the new student
      await sendStudentNotification({
        userId: uid,
        title: '🎓 Welcome to the Prevu Family!',
        message: `Hey ${resolvedName}! We're thrilled to have you here. Prevu is built by students, for students at Chandigarh University. Explore past papers, share study notes, ask doubts, and let's help each other ace every MST and End-Term exam together! 🚀`,
        type: 'welcome',
        link: '/dashboard'
      })
    } else {
      const updates: { name?: string; username?: string; cu_verified?: boolean; cu_email?: string; role?: string } = {}
      if (isSuperAdmin && existingUser.role !== 'admin') {
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

    return { success: true, role: finalRole, isNewUser: !existingUser }
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
