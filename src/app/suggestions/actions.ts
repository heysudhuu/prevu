'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'

export async function submitStudentSuggestion(formData: FormData) {
  const title = (formData.get('title') as string)?.trim()
  const message = (formData.get('message') as string)?.trim()
  const category = (formData.get('category') as string)?.trim() || 'idea'
  const customName = (formData.get('name') as string)?.trim()
  const customEmail = (formData.get('email') as string)?.trim()

  if (!title || !message) {
    return { error: 'Please provide both a title and a description for your idea.' }
  }

  // Check if logged in
  let userId: string | null = null
  let fallbackName = customName || 'Anonymous Student'
  let fallbackEmail = customEmail || null

  const token = (await cookies()).get('firebase-token')?.value
  if (token) {
    try {
      const decoded = await authAdmin.verifyIdToken(token)
      userId = decoded.uid
      if (!customName && decoded.name) fallbackName = decoded.name
      if (!customEmail && decoded.email) fallbackEmail = decoded.email
    } catch {
      // Allow guest submission
    }
  }

  const supabase = getSupabaseAdmin()
  const { error } = await supabase
    .from('suggestions')
    .insert({
      user_id: userId,
      name: fallbackName,
      email: fallbackEmail,
      category: category,
      title: title,
      message: message,
      status: 'new'
    })

  if (error) {
    console.error("Suggestion submission error:", error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/admin')
  return { success: true }
}

export async function getStudentSuggestions() {
  const supabase = getSupabaseAdmin()
  const { data, error } = await supabase
    .from('suggestions')
    .select(`
      *,
      users ( username, cu_verified )
    `)
    .order('created_at', { ascending: false })

  if (error) return []
  return data || []
}
