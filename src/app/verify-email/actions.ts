'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'

async function getAdminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

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
  const cuEmail = formData.get('cu_email') as string

  if (!cuEmail.endsWith('@cuchd.in')) {
    return { error: 'Must use a valid @cuchd.in email address.' }
  }

  const user = await getAuthUser()
  if (!user) return { error: 'Not logged in.' }

  const supabaseAdmin = await getAdminDb()

  // Generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // In a real app we would send an email here using Resend or similar.
  // For this v1, since no SMTP is provided, we will just simulate it by returning it or logging it.
  console.log(`[DEV ONLY] OTP for ${cuEmail} is: ${otp}`)

  const { error } = await supabaseAdmin
    .from('otp_verifications')
    .insert({
      user_id: user.uid,
      cu_email: cuEmail,
      otp: otp,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString() // 15 mins
    })

  if (error) {
    return { error: 'Failed to generate OTP. Please try again.' }
  }

  return { success: true, simulatedOtp: otp } // returning simulatedOtp just for easy testing without SMTP
}

export async function verifyOTP(formData: FormData) {
  const cuEmail = formData.get('cu_email') as string
  const otp = formData.get('otp') as string

  const user = await getAuthUser()
  if (!user) return { error: 'Not logged in.' }

  const supabaseAdmin = await getAdminDb()

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
