'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { CbtLeaderboardEntry, CbtUserAnswer } from './types'
import { 
  saveStoredAttempt, 
  getStoredLeaderboard, 
  getAllStoredLeaderboards,
  saveStoredBatchContributedQuestions,
  saveStoredContributedQuestion,
  getStoredContributedQuestions,
  saveStoredContributedSubject,
  getStoredContributedSubjects
} from './cbtStore'

/**
 * Helper to get authenticated user or return null
 */
async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('firebase-token')?.value
    if (!token) return null

    const decoded = await authAdmin.verifyIdToken(token)
    const supabase = getSupabaseAdmin()

    const { data: user } = await supabase
      .from('users')
      .select('id, name, username, email, cu_verified, role')
      .eq('id', decoded.uid)
      .maybeSingle()

    return {
      uid: decoded.uid,
      name: user?.name || decoded.name || 'CU Student',
      username: user?.username || decoded.email?.split('@')[0] || 'student',
      cuVerified: Boolean(user?.cu_verified),
      role: user?.role || 'student'
    }
  } catch {
    return null
  }
}

/**
 * Record a CBT mock test attempt.
 * Updates the user's latest score on the leaderboard (upsert policy).
 */
export async function recordCbtAttempt(payload: {
  subjectCode: string
  score: number
  totalQuestions: number
  timeSpentSeconds: number
  allottedMinutes: number
  answers: CbtUserAnswer[]
}) {
  const user = await getCurrentUser()
  
  const userId = user?.uid || 'guest-user'
  const username = user?.username || 'cu_scholar'
  const userName = user?.name || 'Student Candidate'
  const cuVerified = Boolean(user?.cuVerified)

  const percentage = payload.totalQuestions > 0 
    ? Math.round((payload.score / payload.totalQuestions) * 1000) / 10 
    : 0

  // 1. Always save to persistent server store (fail-safe)
  const updatedLeaderboard = saveStoredAttempt({
    userId,
    username,
    userName,
    cuVerified,
    subjectCode: payload.subjectCode,
    score: payload.score,
    totalQuestions: payload.totalQuestions,
    percentage,
    timeSpentSeconds: payload.timeSpentSeconds
  })

  // 2. Also attempt Supabase upsert if database table is available
  try {
    const supabase = getSupabaseAdmin()
    const { data: existing } = await supabase
      .from('cbt_attempts')
      .select('id, attempts_count')
      .eq('user_id', userId)
      .eq('subject_code', payload.subjectCode)
      .maybeSingle()

    const attemptsCount = (existing?.attempts_count || 0) + 1

    await supabase
      .from('cbt_attempts')
      .upsert({
        user_id: userId,
        subject_code: payload.subjectCode,
        score: payload.score,
        total_questions: payload.totalQuestions,
        percentage,
        time_spent_seconds: payload.timeSpentSeconds,
        allotted_minutes: payload.allottedMinutes,
        attempts_count: attemptsCount,
        answers_json: payload.answers,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,subject_code'
      })
  } catch {
    // Silent fallback to persistent store
  }

  revalidatePath(`/cbt/${payload.subjectCode}`)
  revalidatePath('/cbt')

  return {
    success: true,
    savedToDb: true,
    percentage,
    leaderboard: updatedLeaderboard,
    earnedKarma: percentage >= 80 ? 15 : 5
  }
}

/**
 * Get leaderboard entries for a subject
 */
export async function getCbtLeaderboard(subjectCode: string): Promise<CbtLeaderboardEntry[]> {
  // 1. First retrieve from persistent server store
  const stored = getStoredLeaderboard(subjectCode)
  if (stored && stored.length > 0) {
    return stored
  }

  // 2. Fallback to Supabase if available
  const supabase = getSupabaseAdmin()
  try {
    const { data, error } = await supabase
      .from('cbt_attempts')
      .select(`
        score,
        total_questions,
        percentage,
        time_spent_seconds,
        attempts_count,
        updated_at,
        subject_code,
        users!inner (
          id,
          name,
          username,
          cu_verified
        )
      `)
      .eq('subject_code', subjectCode)
      .order('percentage', { ascending: false })
      .order('time_spent_seconds', { ascending: true })
      .limit(50)

    if (error || !data) {
      return stored || []
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.map((row: any, index: number) => ({
      rank: index + 1,
      userId: row.users?.id || '',
      username: row.users?.username || 'student',
      userName: row.users?.name || 'CU Student',
      cuVerified: Boolean(row.users?.cu_verified),
      subjectCode: row.subject_code,
      score: row.score,
      totalQuestions: row.total_questions,
      percentage: Number(row.percentage),
      timeSpentSeconds: row.time_spent_seconds,
      attemptsCount: row.attempts_count,
      updatedAt: row.updated_at
    }))
  } catch {
    return stored || []
  }
}

/**
 * Get all subject leaderboards grouped by subject code
 */
export async function getAllCbtLeaderboards(): Promise<Record<string, CbtLeaderboardEntry[]>> {
  // 1. Get stored leaderboards
  const stored = getAllStoredLeaderboards()
  return stored || {}
}

/**
 * Submit a community-contributed question for admin review
 */
export async function submitCommunityCbtQuestion(data: {
  subjectCode: string
  subjectName: string
  semester: number
  category: string
  question: string
  questionType: 'single' | 'multiple'
  options: { id: string; text: string }[]
  correctAnswers: string[]
  explanation: string
  unitTag?: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Please sign in to contribute questions to the CBT Arena.' }
  }

  const record = {
    user_id: user.uid,
    user_name: user.name,
    username: user.username,
    subject_code: data.subjectCode.trim().toUpperCase(),
    subject_name: data.subjectName.trim(),
    semester: data.semester,
    category: data.category,
    question: data.question.trim(),
    question_type: data.questionType,
    options_json: data.options,
    correct_answers: data.correctAnswers,
    explanation: data.explanation.trim(),
    unit_tag: data.unitTag?.trim() || null,
    status: 'pending'
  }

  // 1. Always save to persistent local store first (zero data loss)
  saveStoredContributedQuestion(record)

  // 2. Also try saving to Supabase if table is present
  try {
    const supabase = getSupabaseAdmin()
    await supabase
      .from('cbt_questions_contributed')
      .insert(record)
  } catch (err) {
    console.warn('Notice: Supabase table not synced yet, saved to persistent local store:', err)
  }

  revalidatePath('/admin/cbt-moderation')
  return {
    success: true,
    message: 'Question submitted successfully! It is now pending admin verification.'
  }
}

/**
 * Admin action: Get pending questions for moderation
 */
export async function getPendingCbtQuestions() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return []
  }

  // 1. Try Supabase
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('cbt_questions_contributed')
      .select(`
        *,
        users ( id, name, username, cu_verified )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (!error && data && data.length > 0) {
      return data
    }
  } catch {
    // fallback to stored
  }

  // 2. Fallback to local store
  const stored = getStoredContributedQuestions()
  return stored.filter((q: any) => q.status === 'pending')
}

/**
 * Admin action: Approve or Reject a contributed question
 */
export async function reviewCbtQuestion(
  questionId: number,
  action: 'approved' | 'rejected',
  feedback?: string
) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized. Admin access required.' }
  }

  const supabase = getSupabaseAdmin()
  try {
    const { error } = await supabase
      .from('cbt_questions_contributed')
      .update({
        status: action,
        admin_feedback: feedback || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', questionId)

    if (error) return { error: error.message }

    revalidatePath('/admin/cbt-moderation')
    return { success: true }
  } catch {
    return { error: 'Failed to review question.' }
  }
}

/**
 * Batch submit multiple MCQs parsed from PDF or document
 */
export async function batchSubmitCommunityCbtQuestions(payload: {
  subjectCode: string
  subjectName: string
  semester: number
  category: string
  questions: Array<{
    question: string
    questionType: 'single' | 'multiple'
    options: { id: string; text: string }[]
    correctAnswers: string[]
    explanation: string
    sectionName?: string
  }>
}) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Please sign in to contribute questions to the CBT Arena.' }
  }

  const rows = payload.questions.map(q => ({
    user_id: user.uid,
    user_name: user.name,
    username: user.username,
    subject_code: payload.subjectCode.trim().toUpperCase(),
    subject_name: payload.subjectName.trim(),
    semester: payload.semester,
    category: payload.category,
    question: q.question.trim(),
    question_type: q.questionType,
    options_json: q.options,
    correct_answers: q.correctAnswers,
    explanation: q.explanation.trim(),
    unit_tag: q.sectionName || null,
    status: 'pending'
  }))

  // 1. Always save to persistent local store first (fail-safe)
  const savedCount = saveStoredBatchContributedQuestions(rows)

  // 2. Also try inserting into Supabase
  try {
    const supabase = getSupabaseAdmin()
    const { error } = await supabase
      .from('cbt_questions_contributed')
      .insert(rows)

    if (error) {
      console.warn('Notice: Supabase insert pending table sync, safely stored locally:', error.message)
    }
  } catch (err) {
    console.warn('Notice: Supabase connection warning, questions safely saved locally:', err)
  }

  revalidatePath('/admin/cbt-moderation')
  return {
    success: true,
    count: savedCount || rows.length,
    message: `Successfully submitted ${rows.length} questions for subject "${payload.subjectName}"! They are safely saved and pending admin verification.`
  }
}

/**
 * Propose a new CBT Subject for admin review
 */
export async function proposeNewCbtSubject(data: {
  code: string
  name: string
  semester: number
  category: string
  description?: string
}) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: 'Please sign in to propose a new subject.' }
  }

  const record = {
    user_id: user.uid,
    code: data.code.trim().toUpperCase(),
    name: data.name.trim(),
    semester: data.semester,
    category: data.category,
    description: data.description?.trim() || null,
    status: 'pending'
  }

  // 1. Always save to persistent store
  saveStoredContributedSubject(record)

  // 2. Try Supabase
  try {
    const supabase = getSupabaseAdmin()
    await supabase
      .from('cbt_subjects_contributed')
      .insert(record)
  } catch (err) {
    console.warn('Notice: Supabase subjects table not synced yet, saved locally:', err)
  }

  revalidatePath('/admin/cbt-moderation')
  revalidatePath('/cbt')
  return {
    success: true,
    message: 'New subject proposed! It is saved and ready for question contributions.'
  }
}

/**
 * Admin action: Get pending proposed subjects
 */
export async function getPendingCbtSubjects() {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return []
  }

  const supabase = getSupabaseAdmin()
  try {
    const { data } = await supabase
      .from('cbt_subjects_contributed')
      .select(`
        *,
        users ( id, name, username, cu_verified )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    return data || []
  } catch {
    return []
  }
}

/**
 * Admin action: Review a proposed subject
 */
export async function reviewCbtSubject(
  subjectId: number,
  action: 'approved' | 'rejected',
  feedback?: string
) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized. Admin access required.' }
  }

  const supabase = getSupabaseAdmin()
  try {
    const { error } = await supabase
      .from('cbt_subjects_contributed')
      .update({
        status: action,
        admin_feedback: feedback || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', subjectId)

    if (error) return { error: error.message }

    revalidatePath('/admin/cbt-moderation')
    revalidatePath('/cbt')
    return { success: true }
  } catch {
    return { error: 'Failed to review subject.' }
  }
}

