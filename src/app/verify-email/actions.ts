'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { sendOtpEmail } from '@/lib/email/send-verification'

async function getAuthUser() {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) return null
  try {
    return await authAdmin.verifyIdToken(token)
  } catch {
    return null
  }
}

export async function sendVerificationOTP(formData: FormData) {
  const cuEmail = (formData.get('cu_email') as string)?.trim().toLowerCase()

  if (!cuEmail || !cuEmail.endsWith('@cuchd.in')) {
    return { error: 'Must provide a valid @cuchd.in Chandigarh University email address.' }
  }

  const user = await getAuthUser()
  if (!user) return { error: 'Please log in to verify your university email.' }

  const supabaseAdmin = getSupabaseAdmin()

  // Rate-limiting: Check if an OTP was already requested within the last 60 seconds
  const oneMinuteAgo = new Date(Date.now() - 60 * 1000).toISOString()
  const { data: recentOtp } = await supabaseAdmin
    .from('otp_verifications')
    .select('id')
    .eq('user_id', user.uid)
    .gt('created_at', oneMinuteAgo)
    .limit(1)

  if (recentOtp && recentOtp.length > 0) {
    return { error: 'Please wait at least 60 seconds before requesting a new code.' }
  }

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  const { error: insertError } = await supabaseAdmin
    .from('otp_verifications')
    .insert({
      user_id: user.uid,
      cu_email: cuEmail,
      otp: otp,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 mins
    })

  if (insertError) {
    return { error: 'Failed to generate verification code. Please try again.' }
  }

  // Send real email via Resend or simulated fallback
  const mailResult = await sendOtpEmail({ toEmail: cuEmail, otp })
  if (!mailResult.success) {
    return { error: mailResult.error || 'Failed to send verification code email.' }
  }

  return {
    success: true,
    message: mailResult.simulated 
      ? 'Verification code generated! (Running in simulation mode - check developer logs)'
      : 'Verification code sent to your @cuchd.in inbox.',
    simulatedOtp: mailResult.simulated && process.env.NODE_ENV !== 'production' ? otp : undefined
  }
}

export async function verifyOTP(formData: FormData) {
  const cuEmail = formData.get('cu_email') as string
  const otp = formData.get('otp') as string

  const user = await getAuthUser()
  if (!user) return { error: 'Not logged in.' }

  const supabaseAdmin = getSupabaseAdmin()

  // Check OTP
  const { data: verification, error } = await supabaseAdmin
    .from('otp_verifications')
    .select('*')
    .eq('user_id', user.uid)
    .eq('cu_email', cuEmail)
    .eq('otp', otp)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !verification) {
    return { error: 'Invalid or expired OTP.' }
  }

  // Update user verified status
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ cu_email: cuEmail, cu_verified: true })
    .eq('id', user.uid)

  if (updateError) {
    return { error: 'Failed to verify user.' }
  }

  revalidatePath('/')
  return { success: true }
}
