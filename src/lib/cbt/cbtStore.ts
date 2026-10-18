import fs from 'fs'
import path from 'path'
import os from 'os'
import { CbtLeaderboardEntry } from './types'

// Bundled read-only seed data directory (packaged with Next.js build)
const BUNDLED_DATA_DIR = path.join(process.cwd(), 'src', 'lib', 'cbt', 'data')

// Global in-memory cache to guarantee instantaneous and reliable state across warm container invocations
declare global {
  // eslint-disable-next-line no-var
  var __prevu_cbt_questions: any[] | undefined
  // eslint-disable-next-line no-var
  var __prevu_cbt_subjects: any[] | undefined
  // eslint-disable-next-line no-var
  var __prevu_cbt_leaderboard: Record<string, CbtLeaderboardEntry[]> | undefined
}

const initialSeed: Record<string, CbtLeaderboardEntry[]> = {
  'FSO-307': [
    {
      userId: 'seed-user-1',
      username: 'harsh_cu',
      userName: 'Harsh Vardhan',
      cuVerified: true,
      subjectCode: 'FSO-307',
      score: 13,
      totalQuestions: 15,
      percentage: 86.7,
      timeSpentSeconds: 312,
      attemptsCount: 2,
      updatedAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      userId: 'seed-user-2',
      username: 'simran_kaur',
      userName: 'Simran Kaur',
      cuVerified: true,
      subjectCode: 'FSO-307',
      score: 11,
      totalQuestions: 15,
      percentage: 73.3,
      timeSpentSeconds: 384,
      attemptsCount: 1,
      updatedAt: new Date(Date.now() - 3600000 * 5).toISOString()
    },
    {
      userId: 'seed-user-3',
      username: 'rohit_cse',
      userName: 'Rohit Sharma',
      cuVerified: false,
      subjectCode: 'FSO-307',
      score: 9,
      totalQuestions: 15,
      percentage: 60.0,
      timeSpentSeconds: 420,
      attemptsCount: 1,
      updatedAt: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ]
}

/**
 * Determine a safe, writable directory.
 * On Vercel / AWS Lambda, process.cwd() is an immutable read-only filesystem (/var/task).
 * Attempting to write there throws `EROFS: read-only file system`.
 * We dynamically route writes to `os.tmpdir()/prevu_cbt_data`, while reading from BUNDLED_DATA_DIR as seed.
 */
function getWritableDir(): string {
  // If running in Vercel or serverless production, always use os.tmpdir() to avoid EROFS
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.NODE_ENV === 'production') {
    const tmp = path.join(os.tmpdir(), 'prevu_cbt_data')
    try {
      if (!fs.existsSync(tmp)) {
        fs.mkdirSync(tmp, { recursive: true })
      }
      return tmp
    } catch {
      return os.tmpdir()
    }
  }

  // In local development, check if BUNDLED_DATA_DIR is writable
  try {
    if (!fs.existsSync(BUNDLED_DATA_DIR)) {
      fs.mkdirSync(BUNDLED_DATA_DIR, { recursive: true })
    }
    const testFile = path.join(BUNDLED_DATA_DIR, '.write_test')
    fs.writeFileSync(testFile, '1')
    fs.unlinkSync(testFile)
    return BUNDLED_DATA_DIR
  } catch {
    const tmp = path.join(os.tmpdir(), 'prevu_cbt_data')
    try {
      if (!fs.existsSync(tmp)) {
        fs.mkdirSync(tmp, { recursive: true })
      }
      return tmp
    } catch {
      return os.tmpdir()
    }
  }
}

/**
 * Safe read helper that checks writable location first, then bundled location
 */
function readDataFile(filename: string, fallbackDefault: any): any {
  const writableDir = getWritableDir()
  const writableFile = path.join(writableDir, filename)

  // 1. Try reading from writable location (where updates are saved)
  try {
    if (fs.existsSync(writableFile)) {
      const raw = fs.readFileSync(writableFile, 'utf8')
      if (raw && raw.trim()) {
        return JSON.parse(raw)
      }
    }
  } catch (err) {
    console.warn(`Notice: Failed reading writable ${filename}:`, err)
  }

  // 2. Fall back to reading from bundled deployment assets
  try {
    const bundledFile = path.join(BUNDLED_DATA_DIR, filename)
    if (fs.existsSync(bundledFile)) {
      const raw = fs.readFileSync(bundledFile, 'utf8')
      if (raw && raw.trim()) {
        const parsed = JSON.parse(raw)
        // Seed the writable file for subsequent fast writes
        writeDataFile(filename, parsed)
        return parsed
      }
    }
  } catch (err) {
    console.warn(`Notice: Failed reading bundled ${filename}:`, err)
  }

  return fallbackDefault
}

/**
 * Safe write helper that writes to writable directory and syncs to bundled directory if available
 */
function writeDataFile(filename: string, data: any): boolean {
  let success = false
  const writableDir = getWritableDir()
  const writableFile = path.join(writableDir, filename)

  try {
    if (!fs.existsSync(writableDir)) {
      fs.mkdirSync(writableDir, { recursive: true })
    }
    fs.writeFileSync(writableFile, JSON.stringify(data, null, 2), 'utf8')
    success = true
  } catch (err) {
    console.warn(`Notice: Unable to write ${filename} to writable storage:`, err)
  }

  // In local development, also update source file so git can track updates
  if (writableDir !== BUNDLED_DATA_DIR) {
    try {
      if (fs.existsSync(BUNDLED_DATA_DIR)) {
        const bundledFile = path.join(BUNDLED_DATA_DIR, filename)
        fs.writeFileSync(bundledFile, JSON.stringify(data, null, 2), 'utf8')
      }
    } catch {
      // Expected in production (read-only filesystem)
    }
  }

  return success
}

/**
 * Get all leaderboard entries for a subject
 */
export function getStoredLeaderboard(subjectCode: string): CbtLeaderboardEntry[] {
  try {
    let data = globalThis.__prevu_cbt_leaderboard
    if (!data) {
      data = readDataFile('attempts.json', initialSeed)
      globalThis.__prevu_cbt_leaderboard = data
    }
    const list = (data && data[subjectCode]) || []

    const sorted = [...list].sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage
      }
      return a.timeSpentSeconds - b.timeSpentSeconds
    })

    return sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1
    }))
  } catch (err) {
    console.warn('Error reading stored leaderboard:', err)
    return []
  }
}

/**
 * Get all leaderboards grouped by subject code
 */
export function getAllStoredLeaderboards(): Record<string, CbtLeaderboardEntry[]> {
  try {
    let data = globalThis.__prevu_cbt_leaderboard
    if (!data) {
      data = readDataFile('attempts.json', initialSeed)
      globalThis.__prevu_cbt_leaderboard = data
    }
    const result: Record<string, CbtLeaderboardEntry[]> = {}

    for (const [code, list] of Object.entries(data || {})) {
      const sorted = [...list].sort((a, b) => {
        if (b.percentage !== a.percentage) {
          return b.percentage - a.percentage
        }
        return a.timeSpentSeconds - b.timeSpentSeconds
      })
      result[code] = sorted.map((item, idx) => ({
        ...item,
        rank: idx + 1
      }))
    }

    return result
  } catch (err) {
    console.warn('Error reading all stored leaderboards:', err)
    return {}
  }
}

/**
 * Save or update a student's attempt (upsert latest score)
 */
export function saveStoredAttempt(entry: {
  userId: string
  username: string
  userName: string
  cuVerified: boolean
  subjectCode: string
  score: number
  totalQuestions: number
  percentage: number
  timeSpentSeconds: number
}): CbtLeaderboardEntry[] {
  try {
    let data = globalThis.__prevu_cbt_leaderboard
    if (!data) {
      data = readDataFile('attempts.json', initialSeed)
    }
    data = { ...data }
    const list = [...(data[entry.subjectCode] || [])]

    const existingIdx = list.findIndex(i => i.userId === entry.userId || i.username.toLowerCase() === entry.username.toLowerCase())
    let attemptsCount = 1

    if (existingIdx !== -1) {
      attemptsCount = (list[existingIdx].attemptsCount || 1) + 1
      list[existingIdx] = {
        ...entry,
        attemptsCount,
        updatedAt: new Date().toISOString()
      }
    } else {
      list.push({
        ...entry,
        attemptsCount: 1,
        updatedAt: new Date().toISOString()
      })
    }

    data[entry.subjectCode] = list
    globalThis.__prevu_cbt_leaderboard = data
    writeDataFile('attempts.json', data)

    return getStoredLeaderboard(entry.subjectCode)
  } catch (err) {
    console.warn('Error saving attempt to store:', err)
    return []
  }
}

/**
 * Save batch contributed questions to storage
 */
export function saveStoredBatchContributedQuestions(items: Array<any>): number {
  try {
    const list = [...getStoredContributedQuestions()]
    const timestamp = new Date().toISOString()
    const newItems = items.map((item, idx) => ({
      ...item,
      id: item.id || (Date.now() + idx),
      created_at: item.created_at || timestamp,
      updated_at: timestamp
    }))

    const combined = [...list, ...newItems]
    globalThis.__prevu_cbt_questions = combined
    writeDataFile('contributed_questions.json', combined)
    return newItems.length
  } catch (err) {
    console.warn('Error saving batch questions to store:', err)
    return items.length
  }
}

/**
 * Save single contributed question to storage
 */
export function saveStoredContributedQuestion(item: any): any {
  try {
    const list = [...getStoredContributedQuestions()]
    const timestamp = new Date().toISOString()
    const record = {
      ...item,
      id: item.id || Date.now(),
      created_at: item.created_at || timestamp,
      updated_at: timestamp
    }

    list.push(record)
    globalThis.__prevu_cbt_questions = list
    writeDataFile('contributed_questions.json', list)
    return record
  } catch (err) {
    console.warn('Error saving question to store:', err)
    return item
  }
}

/**
 * Retrieve all stored contributed questions
 */
export function getStoredContributedQuestions(): any[] {
  if (globalThis.__prevu_cbt_questions && globalThis.__prevu_cbt_questions.length > 0) {
    return globalThis.__prevu_cbt_questions
  }
  const data = readDataFile('contributed_questions.json', [])
  globalThis.__prevu_cbt_questions = Array.isArray(data) ? data : []
  return globalThis.__prevu_cbt_questions
}

/**
 * Save proposed subject to storage
 */
export function saveStoredContributedSubject(subj: any): any {
  try {
    const list = [...getStoredContributedSubjects()]
    const timestamp = new Date().toISOString()
    const record = {
      ...subj,
      id: subj.id || Date.now(),
      created_at: subj.created_at || timestamp,
      updated_at: timestamp
    }

    list.push(record)
    globalThis.__prevu_cbt_subjects = list
    writeDataFile('contributed_subjects.json', list)
    return record
  } catch (err) {
    console.warn('Error saving subject to store:', err)
    return subj
  }
}

/**
 * Retrieve all stored contributed subjects
 */
export function getStoredContributedSubjects(): any[] {
  if (globalThis.__prevu_cbt_subjects && globalThis.__prevu_cbt_subjects.length > 0) {
    return globalThis.__prevu_cbt_subjects
  }
  const data = readDataFile('contributed_subjects.json', [])
  globalThis.__prevu_cbt_subjects = Array.isArray(data) ? data : []
  return globalThis.__prevu_cbt_subjects
}

/**
 * Update the moderation status of a stored contributed question
 */
export function updateStoredContributedQuestionStatus(
  id: number | string,
  status: 'approved' | 'rejected',
  feedback?: string
): boolean {
  try {
    const list = [...getStoredContributedQuestions()]
    const idx = list.findIndex(q => String(q.id) === String(id))
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status,
        admin_feedback: feedback !== undefined ? (feedback || null) : list[idx].admin_feedback,
        updated_at: new Date().toISOString()
      }
      globalThis.__prevu_cbt_questions = list
      writeDataFile('contributed_questions.json', list)
      return true
    }
    return false
  } catch (err) {
    console.warn('Error updating stored question status:', err)
    return false
  }
}

/**
 * Batch update moderation status for multiple questions at once
 */
export function updateStoredBatchContributedQuestionsStatus(
  ids: (number | string)[],
  status: 'approved' | 'rejected',
  feedback?: string
): number {
  try {
    const list = [...getStoredContributedQuestions()]
    const idStrings = new Set(ids.map(String))
    let count = 0
    const now = new Date().toISOString()

    for (let i = 0; i < list.length; i++) {
      if (idStrings.has(String(list[i].id))) {
        list[i] = {
          ...list[i],
          status,
          admin_feedback: feedback !== undefined ? (feedback || null) : list[i].admin_feedback,
          updated_at: now
        }
        count++
      }
    }

    if (count > 0) {
      globalThis.__prevu_cbt_questions = list
      writeDataFile('contributed_questions.json', list)
    }
    return count
  } catch (err) {
    console.warn('Error batch updating stored question status:', err)
    return 0
  }
}

/**
 * Update the moderation status of a stored proposed subject
 */
export function updateStoredContributedSubjectStatus(
  code: string,
  status: 'approved' | 'rejected',
  feedback?: string
): boolean {
  try {
    const list = [...getStoredContributedSubjects()]
    const idx = list.findIndex(s => s.code?.toUpperCase() === code.toUpperCase())
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        status,
        admin_feedback: feedback !== undefined ? (feedback || null) : list[idx].admin_feedback,
        updated_at: new Date().toISOString()
      }
      globalThis.__prevu_cbt_subjects = list
      writeDataFile('contributed_subjects.json', list)
      return true
    }
    return false
  } catch (err) {
    console.warn('Error updating stored subject status:', err)
    return false
  }
}

/**
 * Update the details of a stored contributed question (text, options, answers, explanation)
 */
export function updateStoredContributedQuestionDetails(
  id: number | string,
  updates: {
    question?: string
    options_json?: any
    correct_answers?: string[]
    explanation?: string
    unit_tag?: string
    status?: 'pending' | 'approved' | 'rejected'
    admin_feedback?: string
  }
): boolean {
  try {
    const list = [...getStoredContributedQuestions()]
    const idx = list.findIndex(q => String(q.id) === String(id))
    if (idx !== -1) {
      list[idx] = {
        ...list[idx],
        ...updates,
        updated_at: new Date().toISOString()
      }
      globalThis.__prevu_cbt_questions = list
      writeDataFile('contributed_questions.json', list)
      return true
    }
    return false
  } catch (err) {
    console.warn('Error updating stored question details:', err)
    return false
  }
}
