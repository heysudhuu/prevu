import fs from 'fs'
import path from 'path'
import { CbtLeaderboardEntry } from './types'

const DATA_DIR = path.join(process.cwd(), 'src', 'lib', 'cbt', 'data')
const ATTEMPTS_FILE = path.join(DATA_DIR, 'attempts.json')
const QUESTIONS_FILE = path.join(DATA_DIR, 'contributed_questions.json')
const SUBJECTS_FILE = path.join(DATA_DIR, 'contributed_subjects.json')

// Ensure directory and file exist
function ensureStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
  }
  if (!fs.existsSync(QUESTIONS_FILE)) {
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify([], null, 2), 'utf8')
  }
  if (!fs.existsSync(SUBJECTS_FILE)) {
    fs.writeFileSync(SUBJECTS_FILE, JSON.stringify([], null, 2), 'utf8')
  }
  if (!fs.existsSync(ATTEMPTS_FILE)) {
    // Initial seeded student entries for realistic campus competition
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
    fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(initialSeed, null, 2), 'utf8')
  }
}

/**
 * Get all leaderboard entries for a subject
 */
export function getStoredLeaderboard(subjectCode: string): CbtLeaderboardEntry[] {
  try {
    ensureStore()
    const content = fs.readFileSync(ATTEMPTS_FILE, 'utf8')
    const data = JSON.parse(content) as Record<string, CbtLeaderboardEntry[]>
    const list = data[subjectCode] || []

    // Sort by percentage DESC, then timeSpentSeconds ASC
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
    ensureStore()
    const content = fs.readFileSync(ATTEMPTS_FILE, 'utf8')
    const data = JSON.parse(content) as Record<string, CbtLeaderboardEntry[]>
    const result: Record<string, CbtLeaderboardEntry[]> = {}

    for (const [code, list] of Object.entries(data)) {
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
    ensureStore()
    const content = fs.readFileSync(ATTEMPTS_FILE, 'utf8')
    const data = JSON.parse(content) as Record<string, CbtLeaderboardEntry[]>
    const list = data[entry.subjectCode] || []

    const existingIdx = list.findIndex(i => i.userId === entry.userId || i.username.toLowerCase() === entry.username.toLowerCase())
    let attemptsCount = 1

    if (existingIdx !== -1) {
      attemptsCount = (list[existingIdx].attemptsCount || 1) + 1
      // Replace with latest attempt
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
    fs.writeFileSync(ATTEMPTS_FILE, JSON.stringify(data, null, 2), 'utf8')

    // Return newly sorted list
    return getStoredLeaderboard(entry.subjectCode)
  } catch (err) {
    console.warn('Error saving attempt to store:', err)
    return []
  }
}

/**
 * Save batch contributed questions to local fallback storage
 */
export function saveStoredBatchContributedQuestions(items: Array<any>): number {
  try {
    ensureStore()
    const content = fs.existsSync(QUESTIONS_FILE) ? fs.readFileSync(QUESTIONS_FILE, 'utf8') : '[]'
    const list = JSON.parse(content || '[]') as any[]
    
    const timestamp = new Date().toISOString()
    const newItems = items.map((item, idx) => ({
      ...item,
      id: Date.now() + idx,
      created_at: timestamp,
      updated_at: timestamp
    }))

    const combined = [...list, ...newItems]
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(combined, null, 2), 'utf8')
    return newItems.length
  } catch (err) {
    console.warn('Error saving batch questions to local fallback store:', err)
    return items.length
  }
}

/**
 * Save single contributed question to local fallback storage
 */
export function saveStoredContributedQuestion(item: any): any {
  try {
    ensureStore()
    const content = fs.existsSync(QUESTIONS_FILE) ? fs.readFileSync(QUESTIONS_FILE, 'utf8') : '[]'
    const list = JSON.parse(content || '[]') as any[]
    
    const timestamp = new Date().toISOString()
    const record = {
      ...item,
      id: Date.now(),
      created_at: timestamp,
      updated_at: timestamp
    }

    list.push(record)
    fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(list, null, 2), 'utf8')
    return record
  } catch (err) {
    console.warn('Error saving question to local fallback store:', err)
    return item
  }
}

/**
 * Retrieve all stored contributed questions
 */
export function getStoredContributedQuestions(): any[] {
  try {
    ensureStore()
    if (!fs.existsSync(QUESTIONS_FILE)) return []
    const content = fs.readFileSync(QUESTIONS_FILE, 'utf8')
    return JSON.parse(content || '[]')
  } catch (err) {
    console.warn('Error reading stored contributed questions:', err)
    return []
  }
}

/**
 * Save proposed subject to local fallback storage
 */
export function saveStoredContributedSubject(subj: any): any {
  try {
    ensureStore()
    const content = fs.existsSync(SUBJECTS_FILE) ? fs.readFileSync(SUBJECTS_FILE, 'utf8') : '[]'
    const list = JSON.parse(content || '[]') as any[]

    const timestamp = new Date().toISOString()
    const record = {
      ...subj,
      id: Date.now(),
      created_at: timestamp,
      updated_at: timestamp
    }

    list.push(record)
    fs.writeFileSync(SUBJECTS_FILE, JSON.stringify(list, null, 2), 'utf8')
    return record
  } catch (err) {
    console.warn('Error saving subject to local fallback store:', err)
    return subj
  }
}

/**
 * Retrieve all stored contributed subjects
 */
export function getStoredContributedSubjects(): any[] {
  try {
    ensureStore()
    if (!fs.existsSync(SUBJECTS_FILE)) return []
    const content = fs.readFileSync(SUBJECTS_FILE, 'utf8')
    return JSON.parse(content || '[]')
  } catch (err) {
    console.warn('Error reading stored contributed subjects:', err)
    return []
  }
}

