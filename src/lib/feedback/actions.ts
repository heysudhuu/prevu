'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import fs from 'fs'
import path from 'path'

export type FeedbackContextType = 'cbt_exam' | 'resource_download' | 'general'

export interface PlatformFeedbackPayload {
  contextType: FeedbackContextType
  targetId: string
  targetTitle: string
  rating: number
  liked: boolean
  tags?: string[]
  suggestion?: string
}

export interface PlatformFeedbackItem {
  id: string
  userId?: string | null
  username?: string | null
  contextType: FeedbackContextType
  targetId: string
  targetTitle: string
  rating: number
  liked: boolean
  tags: string[]
  suggestion?: string | null
  createdAt: string
}

const FALLBACK_DIR = path.join(process.cwd(), 'src', 'lib', 'feedback', 'data')
const FALLBACK_FILE = path.join(FALLBACK_DIR, 'feedback.json')

function readLocalFeedback(): PlatformFeedbackItem[] {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) return []
    const raw = fs.readFileSync(FALLBACK_FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function appendLocalFeedback(item: PlatformFeedbackItem) {
  try {
    if (!fs.existsSync(FALLBACK_DIR)) {
      fs.mkdirSync(FALLBACK_DIR, { recursive: true })
    }
    const existing = readLocalFeedback()
    existing.unshift(item)
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(existing.slice(0, 500), null, 2), 'utf-8')
  } catch (err) {
    console.warn('Local feedback fallback write failed:', err)
  }
}

export async function submitPlatformFeedback(payload: PlatformFeedbackPayload): Promise<{
  success: boolean
  storedInDb?: boolean
  error?: string
}> {
  try {
    const rating = Math.min(5, Math.max(1, Math.round(Number(payload.rating) || 5)))
    const liked = typeof payload.liked === 'boolean' ? payload.liked : rating >= 4
    const tags = Array.isArray(payload.tags) ? payload.tags.slice(0, 8) : []
    const suggestion = payload.suggestion?.trim().slice(0, 1000) || null

    // Attach authenticated student identity if signed in (works for guests too)
    let userId: string | null = null
    let username: string | null = null

    try {
      const token = (await cookies()).get('firebase-token')?.value
      if (token) {
        const decoded = await authAdmin.verifyIdToken(token)
        userId = decoded.uid
        const supabase = getSupabaseAdmin()
        const { data: userRow } = await supabase
          .from('users')
          .select('username, name')
          .eq('id', decoded.uid)
          .maybeSingle()
        username = userRow?.username || userRow?.name || decoded.email?.split('@')[0] || 'student'
      }
    } catch {
      // Guest submission is allowed
    }

    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('platform_feedback').insert({
      user_id: userId,
      username: username || 'guest_student',
      context_type: payload.contextType,
      target_id: String(payload.targetId || 'unknown'),
      target_title: String(payload.targetTitle || 'Prevu Resource'),
      rating,
      liked,
      tags,
      suggestion
    })

    if (!error) {
      return { success: true, storedInDb: true }
    }

    // Fallback to local JSON store if table migration has not been executed yet
    console.warn('Supabase platform_feedback insert fallback:', error.message)
    appendLocalFeedback({
      id: `fb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      userId,
      username: username || 'guest_student',
      contextType: payload.contextType,
      targetId: String(payload.targetId || 'unknown'),
      targetTitle: String(payload.targetTitle || 'Prevu Resource'),
      rating,
      liked,
      tags,
      suggestion,
      createdAt: new Date().toISOString()
    })

    return { success: true, storedInDb: false }
  } catch (err) {
    console.error('submitPlatformFeedback error:', err)
    return { success: false, error: 'Failed to submit feedback' }
  }
}

export async function getPlatformFeedbackList(): Promise<{
  items: PlatformFeedbackItem[]
  avgRating: number
  totalCount: number
  cbtAvg: number
  downloadAvg: number
}> {
  const localItems = readLocalFeedback()
  let dbItems: PlatformFeedbackItem[] = []

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('platform_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(200)

    if (!error && data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      dbItems = data.map((row: any) => ({
        id: row.id,
        userId: row.user_id,
        username: row.username,
        contextType: row.context_type,
        targetId: row.target_id,
        targetTitle: row.target_title,
        rating: Number(row.rating),
        liked: Boolean(row.liked),
        tags: Array.isArray(row.tags) ? row.tags : [],
        suggestion: row.suggestion,
        createdAt: row.created_at
      }))
    }
  } catch {
    // Use local fallback
  }

  const items = [...dbItems, ...localItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const totalCount = items.length
  const avgRating = totalCount > 0
    ? Math.round((items.reduce((acc, i) => acc + i.rating, 0) / totalCount) * 10) / 10
    : 0

  const cbtItems = items.filter(i => i.contextType === 'cbt_exam')
  const dlItems = items.filter(i => i.contextType === 'resource_download')

  const cbtAvg = cbtItems.length > 0
    ? Math.round((cbtItems.reduce((acc, i) => acc + i.rating, 0) / cbtItems.length) * 10) / 10
    : 0

  const downloadAvg = dlItems.length > 0
    ? Math.round((dlItems.reduce((acc, i) => acc + i.rating, 0) / dlItems.length) * 10) / 10
    : 0

  return { items, avgRating, totalCount, cbtAvg, downloadAvg }
}
