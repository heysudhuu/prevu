'use server'

import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { revalidatePath } from 'next/cache'
import { CbtLeaderboardEntry, CbtUserAnswer, CbtQuestionReport, CbtSubjectOverride, CbtQuestionOverride } from './types'
import { CBT_SUBJECTS } from './cbtRegistry'
import {
  getStoredSubjectOverrides,
  upsertStoredSubjectOverride,
  deleteStoredSubjectOverride,
  getStoredQuestionOverrides,
  upsertStoredQuestionOverride,
  deleteStoredQuestionOverride
} from './cbtOverridesStore'
import { 
  saveStoredAttempt, 
  getStoredLeaderboard, 
  getAllStoredLeaderboards,
  saveStoredBatchContributedQuestions,
  saveStoredContributedQuestion,
  getStoredContributedQuestions,
  saveStoredContributedSubject,
  getStoredContributedSubjects,
  updateStoredContributedQuestionStatus,
  updateStoredBatchContributedQuestionsStatus,
  updateStoredContributedSubjectStatus,
  updateStoredContributedQuestionDetails,
  saveStoredQuestionReport,
  getStoredQuestionReports
} from './cbtStore'
import { isSuperAdminEmail } from '@/lib/auth/admin-check'
import {
  isMissingSchemaObjectError,
  isSchemaMarkedMissing,
  markSchemaMissing,
} from '@/lib/supabase/missingSchemaCache'

const CBT_QUESTIONS_MISSING_KEY = 'table:cbt_questions_contributed'
const CBT_SUBJ_OVERRIDES_MISSING_KEY = 'table:cbt_subject_overrides'
const CBT_QUES_OVERRIDES_MISSING_KEY = 'table:cbt_question_overrides'

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

    const email = decoded.email?.toLowerCase() || user?.email?.toLowerCase() || ''
    const isWhitelisted = isSuperAdminEmail(email) || email === 'py7716496@gmail.com'
    const isAdmin = isWhitelisted || ['admin', 'super_admin', 'moderator'].includes(user?.role || '')

    return {
      uid: decoded.uid,
      email,
      name: user?.name || decoded.name || 'CU Student',
      username: user?.username || decoded.email?.split('@')[0] || 'student',
      cuVerified: Boolean(user?.cu_verified),
      role: isAdmin ? 'admin' : (user?.role || 'student')
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

  const voidedCount = (payload.answers || []).filter(a => a.isReported).length
  const effectiveTotal = Math.max(1, payload.totalQuestions - voidedCount)

  const percentage = effectiveTotal > 0 
    ? Math.round((payload.score / effectiveTotal) * 1000) / 10 
    : 0

  // 1. Always save to persistent server store (fail-safe)
  const updatedLeaderboard = saveStoredAttempt({
    userId,
    username,
    userName,
    cuVerified,
    subjectCode: payload.subjectCode,
    score: payload.score,
    totalQuestions: effectiveTotal,
    percentage,
    timeSpentSeconds: payload.timeSpentSeconds
  })

  // 2. Also attempt Supabase upsert if database table is available
  let savedToDb = false
  try {
    const supabase = getSupabaseAdmin()
    const { data: existing, error: selectErr } = await supabase
      .from('cbt_attempts')
      .select('id, attempts_count')
      .eq('user_id', userId)
      .eq('subject_code', payload.subjectCode)
      .maybeSingle()

    if (selectErr) {
      console.warn('[CBT] Supabase check existing attempt notice:', selectErr.message)
    }

    const attemptsCount = (existing?.attempts_count || 0) + 1

    const { error: upsertErr } = await supabase
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

    if (upsertErr) {
      console.error('[CBT] Supabase upsert error:', upsertErr.message)
    } else {
      savedToDb = true
    }
  } catch (err) {
    console.warn('[CBT] Database attempt save error, falling back to in-memory:', err)
  }

  revalidatePath(`/cbt/${payload.subjectCode}`)
  revalidatePath('/cbt')

  // Fetch updated real-time leaderboard (Supabase primary, local fallback)
  const latestLeaderboard = await getCbtLeaderboard(payload.subjectCode)

  return {
    success: true,
    savedToDb,
    percentage,
    leaderboard: latestLeaderboard.length > 0 ? latestLeaderboard : updatedLeaderboard,
    earnedKarma: percentage >= 80 ? 15 : 5
  }
}

/**
 * Helper to fetch attempts and map user profiles without relying on a PostgREST schema cache FK
 */
async function fetchAttemptsWithProfiles(subjectCode?: string): Promise<CbtLeaderboardEntry[]> {
  try {
    const supabase = getSupabaseAdmin()
    let query = supabase
      .from('cbt_attempts')
      .select('score, total_questions, percentage, time_spent_seconds, attempts_count, updated_at, subject_code, user_id')
      .order('percentage', { ascending: false })
      .order('time_spent_seconds', { ascending: true })

    if (subjectCode) {
      const clean = subjectCode.trim()
      query = query.or(`subject_code.eq.${clean},subject_code.ilike.${clean}`).limit(50)
    }

    const { data: attempts, error } = await query

    if (error) {
      console.warn('[CBT] Supabase query attempts error:', error.message)
      return []
    }

    if (!attempts || attempts.length === 0) {
      return []
    }

    // Collect unique user_ids
    const userIds = Array.from(new Set(attempts.map((a: any) => a.user_id).filter(Boolean)))
    const userMap = new Map<string, any>()

    if (userIds.length > 0) {
      try {
        const { data: profiles, error: profileErr } = await supabase
          .from('users')
          .select('id, name, username, cu_verified')
          .in('id', userIds)

        if (!profileErr && profiles) {
          for (const p of profiles) {
            userMap.set(p.id, p)
          }
        }
      } catch (profErr) {
        console.warn('[CBT] Failed fetching user profiles for attempts:', profErr)
      }
    }

    return attempts.map((row: any, index: number) => {
      const user = userMap.get(row.user_id)
      return {
        rank: index + 1,
        userId: row.user_id || '',
        username: user?.username || 'scholar',
        userName: user?.name || 'Student Candidate',
        cuVerified: Boolean(user?.cu_verified),
        subjectCode: row.subject_code,
        score: row.score,
        totalQuestions: row.total_questions,
        percentage: Number(row.percentage),
        timeSpentSeconds: row.time_spent_seconds,
        attemptsCount: row.attempts_count,
        updatedAt: row.updated_at
      }
    })
  } catch (err) {
    console.warn('[CBT] fetchAttemptsWithProfiles exception:', err)
    return []
  }
}

/**
 * Get leaderboard entries for a subject
 */
export async function getCbtLeaderboard(subjectCode: string): Promise<CbtLeaderboardEntry[]> {
  // 1. Try Supabase first (source of truth across all serverless instances)
  const dbEntries = await fetchAttemptsWithProfiles(subjectCode)
  if (dbEntries && dbEntries.length > 0) {
    return dbEntries
  }

  // 2. Fallback to local store if Supabase returned empty or had an issue
  const stored = getStoredLeaderboard(subjectCode)
  return stored || []
}

/**
 * Get all subject leaderboards grouped by subject code
 */
export async function getAllCbtLeaderboards(): Promise<Record<string, CbtLeaderboardEntry[]>> {
  // 1. Try Supabase first (source of truth across all serverless instances)
  const allEntries = await fetchAttemptsWithProfiles()
  const grouped: Record<string, CbtLeaderboardEntry[]> = {}

  if (allEntries && allEntries.length > 0) {
    for (const item of allEntries) {
      const code = (item.subjectCode || '').trim().toUpperCase()
      if (!code) continue
      if (!grouped[code]) {
        grouped[code] = []
      }
      grouped[code].push({
        ...item,
        rank: grouped[code].length + 1
      })
    }
  }

  // 2. Merge with stored seed data for subjects that don't yet have DB attempts
  const stored = getAllStoredLeaderboards() || {}
  for (const [code, list] of Object.entries(stored)) {
    const normCode = code.trim().toUpperCase()
    if (!grouped[normCode] || grouped[normCode].length === 0) {
      grouped[normCode] = list
    }
  }

  return grouped
}

export interface UserCbtHistoryItem {
  id?: number | string
  subjectCode: string
  subjectName: string
  score: number
  totalQuestions: number
  percentage: number
  timeSpentSeconds: number
  attemptsCount: number
  updatedAt: string
}

/**
 * Retrieve all CBT mock exam attempts for a specific student
 */
export async function getUserCbtAttempts(userId: string): Promise<UserCbtHistoryItem[]> {
  if (!userId) return []

  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('cbt_attempts')
      .select('id, subject_code, score, total_questions, percentage, time_spent_seconds, attempts_count, updated_at')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) {
      console.warn('[CBT] Supabase error in getUserCbtAttempts:', error.message)
      return []
    }

    if (!data || data.length === 0) {
      return []
    }

    return data.map((row: any) => {
      const codeUpper = (row.subject_code || '').trim().toUpperCase()
      const matched = CBT_SUBJECTS.find(
        s => s.code.toUpperCase() === codeUpper || s.code.replace(/[^a-zA-Z0-9]/g, '') === codeUpper.replace(/[^a-zA-Z0-9]/g, '')
      )
      return {
        id: row.id,
        subjectCode: row.subject_code,
        subjectName: matched?.name || row.subject_code,
        score: row.score,
        totalQuestions: row.total_questions,
        percentage: Number(row.percentage),
        timeSpentSeconds: row.time_spent_seconds,
        attemptsCount: row.attempts_count,
        updatedAt: row.updated_at
      }
    })
  } catch (err) {
    console.warn('[CBT] Fatal exception in getUserCbtAttempts:', err)
    return []
  }
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
 * Admin action: Get all contributed questions with optional status filter
 */
export async function getAllCbtQuestionsAdmin(statusFilter?: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return []
  }

  // 1. Try Supabase
  if (!isSchemaMarkedMissing(CBT_QUESTIONS_MISSING_KEY)) {
    try {
      const supabase = getSupabaseAdmin()
      let query = supabase
        .from('cbt_questions_contributed')
        .select(`
          *,
          users ( id, name, username, cu_verified )
        `)
        .order('created_at', { ascending: false })

      if (statusFilter && statusFilter !== 'ALL' && statusFilter !== 'all') {
        query = query.eq('status', statusFilter.toLowerCase())
      }

      const { data, error } = await query
      if (error && isMissingSchemaObjectError(error)) {
        markSchemaMissing(CBT_QUESTIONS_MISSING_KEY)
      } else if (!error && data && data.length > 0) {
        return data
      }
    } catch {
      // fallback to stored
    }
  }

  // 2. Fallback to local store
  const stored = getStoredContributedQuestions()
  if (statusFilter && statusFilter !== 'ALL' && statusFilter !== 'all') {
    return stored.filter((q: any) => q.status === statusFilter.toLowerCase())
  }
  return stored
}

/**
 * Admin action: Get pending questions for moderation
 */
export async function getPendingCbtQuestions() {
  return getAllCbtQuestionsAdmin('pending')
}

/**
 * Retrieve all approved CBT questions for student mock exams
 */
export async function getApprovedContributedQuestions(subjectCode?: string) {
  // 1. Try Supabase
  if (!isSchemaMarkedMissing(CBT_QUESTIONS_MISSING_KEY)) {
    try {
      const supabase = getSupabaseAdmin()
      let query = supabase
        .from('cbt_questions_contributed')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (subjectCode) {
        query = query.eq('subject_code', subjectCode.toUpperCase())
      }

      const { data, error } = await query
      if (error && isMissingSchemaObjectError(error)) {
        markSchemaMissing(CBT_QUESTIONS_MISSING_KEY)
      } else if (!error && data && data.length > 0) {
        return data
      }
    } catch {
      // fallback to store
    }
  }

  // 2. Fallback to local persistent store
  const stored = getStoredContributedQuestions() || []
  let filtered = stored.filter((q: any) => q.status === 'approved')
  if (subjectCode) {
    filtered = filtered.filter((q: any) => q.subject_code?.toUpperCase() === subjectCode.toUpperCase())
  }
  return filtered
}

/**
 * Robust admin authorization checker
 */
async function verifyAdminCaller(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('firebase-token')?.value
    if (!token) return false

    // 1. Try full Firebase token verification
    try {
      const decoded = await authAdmin.verifyIdToken(token)
      const email = decoded.email?.toLowerCase() || ''
      if (isSuperAdminEmail(email) || email === 'py7716496@gmail.com') return true

      const supabase = getSupabaseAdmin()
      const { data: user } = await supabase
        .from('users')
        .select('role')
        .eq('id', decoded.uid)
        .maybeSingle()

      if (['admin', 'super_admin', 'moderator'].includes(user?.role || '')) {
        return true
      }
    } catch {
      // 2. Token payload fallback if token is temporarily expired or verifying offline
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf8'))
        const email = payload?.email?.toLowerCase() || ''
        if (isSuperAdminEmail(email) || email === 'py7716496@gmail.com') {
          return true
        }
      }
    }
  } catch (err) {
    console.warn('verifyAdminCaller error:', err)
  }
  return false
}

/**
 * Admin action: Approve or Reject a contributed question
 */
export async function reviewCbtQuestion(
  questionId: number | string,
  action: 'approved' | 'rejected',
  feedback?: string
) {
  const isAdmin = await verifyAdminCaller()
  if (!isAdmin) {
    return { error: 'Unauthorized. Admin access required.' }
  }

  // 1. Always update local store (guaranteed immediate update)
  updateStoredContributedQuestionStatus(questionId, action, feedback)

  // 2. Also update Supabase if table exists
  try {
    const supabase = getSupabaseAdmin()
    await supabase
      .from('cbt_questions_contributed')
      .update({
        status: action,
        admin_feedback: feedback || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', questionId)
  } catch (err) {
    console.warn('Notice: Supabase table not synced yet, updated in local store:', err)
  }

  revalidatePath('/admin/requests')
  revalidatePath('/admin/cbt-moderation')
  revalidatePath('/cbt')
  return { success: true }
}

/**
 * Admin action: Batch approve multiple CBT questions at once
 */
export async function batchApproveCbtQuestionsAdmin(questionIds: (number | string)[]) {
  const isAdmin = await verifyAdminCaller()
  if (!isAdmin) {
    return { error: 'Unauthorized. Admin access required.' }
  }

  // 1. Batch update local store (instant single-write, safe on serverless)
  const updatedCount = updateStoredBatchContributedQuestionsStatus(questionIds, 'approved')

  // 2. Also batch update Supabase if table exists
  try {
    const supabase = getSupabaseAdmin()
    await supabase
      .from('cbt_questions_contributed')
      .update({
        status: 'approved',
        updated_at: new Date().toISOString()
      })
      .in('id', questionIds)
  } catch (err) {
    console.warn('Notice: Supabase batch update table not synced yet:', err)
  }

  revalidatePath('/admin/requests')
  revalidatePath('/admin/cbt-moderation')
  revalidatePath('/cbt')
  return { success: true, count: updatedCount || questionIds.length }
}

/**
 * Admin action: Update details of a contributed question
 */
export async function updateCbtQuestionDetailsAdmin(
  questionId: number | string,
  updates: {
    question?: string
    options_json?: any
    correct_answers?: string[]
    explanation?: string
    unit_tag?: string
    status?: 'pending' | 'approved' | 'rejected'
    admin_feedback?: string
  }
) {
  const isAdmin = await verifyAdminCaller()
  if (!isAdmin) {
    return { error: 'Unauthorized. Admin access required.' }
  }

  updateStoredContributedQuestionDetails(questionId, updates)

  try {
    const supabase = getSupabaseAdmin()
    await supabase
      .from('cbt_questions_contributed')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', questionId)
  } catch (err) {
    console.warn('Notice: Supabase update not synced yet, updated in local store:', err)
  }

  revalidatePath('/admin/requests')
  revalidatePath('/admin/cbt-moderation')
  revalidatePath('/cbt')
  return { success: true }
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

/**
 * Report a flawed or mismatched question during a CBT mock exam
 */
export async function reportCbtQuestion(data: {
  questionId: string
  questionText: string
  subjectCode: string
  subjectName?: string
  reason: 'wrong_key' | 'typo' | 'mismatched_options' | 'passage_missing' | 'other'
  details?: string
}) {
  const user = await getCurrentUser()
  const report: CbtQuestionReport = {
    id: `rep-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    questionId: data.questionId,
    questionText: data.questionText,
    subjectCode: data.subjectCode,
    subjectName: data.subjectName || data.subjectCode,
    reason: data.reason,
    details: data.details?.trim() || undefined,
    userId: user?.uid || 'guest-student',
    username: user?.username || 'anonymous_peer',
    reportedAt: new Date().toISOString()
  }

  saveStoredQuestionReport(report)

  // Also gracefully log to Supabase reports if table exists
  try {
    const supabase = getSupabaseAdmin()
    await supabase.from('reports').insert({
      reason: `CBT Question Flagged: ${data.reason.replace(/_/g, ' ').toUpperCase()}`,
      details: `[CBT ${data.subjectCode} - Q: ${data.questionId}]\nQuestion: ${data.questionText.slice(0, 150)}...\nUser Note: ${data.details || 'None'}`,
      status: 'open',
      reporter_id: user?.uid || null
    })
  } catch {
    // Non-blocking: cbtStore already saved it
  }

  return { success: true, reportId: report.id }
}

/**
 * Get all reported CBT questions for moderation
 */
export async function getAllCbtQuestionReports(): Promise<CbtQuestionReport[]> {
  return getStoredQuestionReports()
}

/**
 * Fetch non-destructive admin overrides for CBT subjects and questions.
 * Merges Supabase overrides (when table exists) with fail-safe local store.
 */
export async function getCbtOverrides(): Promise<{
  subjectOverrides: CbtSubjectOverride[]
  questionOverrides: CbtQuestionOverride[]
}> {
  const localSubjects = getStoredSubjectOverrides()
  const localQuestions = getStoredQuestionOverrides()

  if (
    isSchemaMarkedMissing(CBT_SUBJ_OVERRIDES_MISSING_KEY) &&
    isSchemaMarkedMissing(CBT_QUES_OVERRIDES_MISSING_KEY)
  ) {
    return {
      subjectOverrides: localSubjects,
      questionOverrides: localQuestions,
    }
  }

  try {
    const supabase = getSupabaseAdmin()
    const [subjRes, quesRes] = await Promise.all([
      isSchemaMarkedMissing(CBT_SUBJ_OVERRIDES_MISSING_KEY)
        ? Promise.resolve({ data: null, error: null })
        : supabase.from('cbt_subject_overrides').select('*'),
      isSchemaMarkedMissing(CBT_QUES_OVERRIDES_MISSING_KEY)
        ? Promise.resolve({ data: null, error: null })
        : supabase.from('cbt_question_overrides').select('*')
    ])

    if (subjRes.error && isMissingSchemaObjectError(subjRes.error)) {
      markSchemaMissing(CBT_SUBJ_OVERRIDES_MISSING_KEY)
    }
    if (quesRes.error && isMissingSchemaObjectError(quesRes.error)) {
      markSchemaMissing(CBT_QUES_OVERRIDES_MISSING_KEY)
    }

    const subjMap = new Map<string, CbtSubjectOverride>()
    for (const s of localSubjects) subjMap.set(s.subjectCode.toUpperCase(), s)
    if (!subjRes.error && Array.isArray(subjRes.data)) {
      for (const row of subjRes.data) {
        const code = String(row.subject_code || '').toUpperCase()
        if (!code) continue
        subjMap.set(code, {
          subjectCode: code,
          name: row.name ?? undefined,
          description: row.description ?? undefined,
          semester: row.semester ?? undefined,
          year: row.year ?? undefined,
          category: row.category ?? undefined,
          categoryLabel: row.category_label ?? undefined,
          credits: row.credits ?? undefined,
          isReady: row.is_ready ?? undefined,
          badgeColor: row.badge_color ?? undefined,
          isCustom: Boolean(row.is_custom),
          isArchived: Boolean(row.is_archived),
          updatedBy: row.updated_by ?? undefined,
          updatedAt: row.updated_at ?? undefined
        })
      }
    }

    const qMap = new Map<string, CbtQuestionOverride>()
    for (const q of localQuestions) qMap.set(q.questionId, q)
    if (!quesRes.error && Array.isArray(quesRes.data)) {
      for (const row of quesRes.data) {
        const qId = String(row.question_id || '')
        if (!qId) continue
        qMap.set(qId, {
          questionId: qId,
          subjectCode: String(row.subject_code || ''),
          subjectName: row.subject_name ?? undefined,
          semester: row.semester ?? undefined,
          category: row.category ?? undefined,
          topic: row.topic ?? undefined,
          topicName: row.topic_name ?? undefined,
          partName: row.part_name ?? undefined,
          sectionName: row.section_name ?? undefined,
          passage: row.passage === null ? null : (row.passage ?? undefined),
          question: row.question ?? undefined,
          type: row.type ?? undefined,
          options: Array.isArray(row.options_json) ? row.options_json : undefined,
          correctAnswers: Array.isArray(row.correct_answers_json) ? row.correct_answers_json : undefined,
          explanation: row.explanation ?? undefined,
          difficulty: row.difficulty ?? undefined,
          isCustom: Boolean(row.is_custom),
          isArchived: Boolean(row.is_archived),
          updatedBy: row.updated_by ?? undefined,
          updatedAt: row.updated_at ?? undefined
        })
      }
    }

    return {
      subjectOverrides: Array.from(subjMap.values()),
      questionOverrides: Array.from(qMap.values())
    }
  } catch {
    return {
      subjectOverrides: localSubjects,
      questionOverrides: localQuestions
    }
  }
}

export async function saveAdminSubjectOverride(payload: CbtSubjectOverride) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required.' }
  }

  const entry: CbtSubjectOverride = {
    ...payload,
    subjectCode: payload.subjectCode.trim().toUpperCase(),
    updatedBy: user.email || user.name,
    updatedAt: new Date().toISOString()
  }

  upsertStoredSubjectOverride(entry)

  try {
    const supabase = getSupabaseAdmin()
    await supabase.from('cbt_subject_overrides').upsert({
      subject_code: entry.subjectCode,
      name: entry.name ?? null,
      description: entry.description ?? null,
      semester: entry.semester ?? null,
      year: entry.year ?? null,
      category: entry.category ?? null,
      category_label: entry.categoryLabel ?? null,
      credits: entry.credits ?? null,
      is_ready: entry.isReady ?? null,
      badge_color: entry.badgeColor ?? null,
      is_custom: Boolean(entry.isCustom),
      is_archived: Boolean(entry.isArchived),
      updated_by: entry.updatedBy,
      updated_at: entry.updatedAt
    }, { onConflict: 'subject_code' })
  } catch {
    // Fail-safe local store already persisted
  }

  revalidatePath('/cbt')
  revalidatePath('/admin/cbt-moderation')
  return { success: true, override: entry }
}

export async function resetAdminSubjectOverride(subjectCode: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required.' }
  }

  const code = subjectCode.trim().toUpperCase()
  deleteStoredSubjectOverride(code)

  try {
    const supabase = getSupabaseAdmin()
    await supabase.from('cbt_subject_overrides').delete().eq('subject_code', code)
  } catch {
    // Non-blocking
  }

  revalidatePath('/cbt')
  revalidatePath('/admin/cbt-moderation')
  return { success: true }
}

export async function saveAdminQuestionOverride(payload: CbtQuestionOverride) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required.' }
  }

  const entry: CbtQuestionOverride = {
    ...payload,
    subjectCode: payload.subjectCode.trim().toUpperCase(),
    updatedBy: user.email || user.name,
    updatedAt: new Date().toISOString()
  }

  upsertStoredQuestionOverride(entry)

  try {
    const supabase = getSupabaseAdmin()
    await supabase.from('cbt_question_overrides').upsert({
      question_id: entry.questionId,
      subject_code: entry.subjectCode,
      subject_name: entry.subjectName ?? null,
      semester: entry.semester ?? null,
      category: entry.category ?? null,
      topic: entry.topic ?? null,
      topic_name: entry.topicName ?? null,
      part_name: entry.partName ?? null,
      section_name: entry.sectionName ?? null,
      passage: entry.passage === undefined ? null : entry.passage,
      question: entry.question ?? null,
      type: entry.type ?? 'single',
      options_json: entry.options ?? null,
      correct_answers_json: entry.correctAnswers ?? null,
      explanation: entry.explanation ?? null,
      difficulty: entry.difficulty ?? 'easy',
      is_custom: Boolean(entry.isCustom),
      is_archived: Boolean(entry.isArchived),
      updated_by: entry.updatedBy,
      updated_at: entry.updatedAt
    }, { onConflict: 'question_id' })
  } catch {
    // Fail-safe local store already persisted
  }

  revalidatePath('/cbt')
  revalidatePath('/admin/cbt-moderation')
  return { success: true, override: entry }
}

export async function resetAdminQuestionOverride(questionId: string) {
  const user = await getCurrentUser()
  if (!user || user.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required.' }
  }

  deleteStoredQuestionOverride(questionId)

  try {
    const supabase = getSupabaseAdmin()
    await supabase.from('cbt_question_overrides').delete().eq('question_id', questionId)
  } catch {
    // Non-blocking
  }

  revalidatePath('/cbt')
  revalidatePath('/admin/cbt-moderation')
  return { success: true }
}


