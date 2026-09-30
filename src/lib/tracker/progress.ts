// Prevu Subject & Question Progress Tracker Engine
// Tracks question solving state (Solved, Skipped, Revisit) per paper and computes subject mastery

export type QuestionStatus = 'solved' | 'skipped' | 'revisit' | 'unattempted'

export interface PaperProgress {
  paperId: string
  subjectCode: string
  subjectName: string
  semester: number
  totalQuestions: number
  questions: Record<number, QuestionStatus>
  updatedAt: string
}

const STORAGE_KEY = 'prevu_question_progress'
const PROGRESS_EVENT = 'prevu-progress-updated'

/**
 * Get all progress records from localStorage
 */
export function getAllProgress(): Record<string, PaperProgress> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch (err) {
    console.error('[Progress Tracker] Failed to read progress', err)
    return {}
  }
}

/**
 * Get progress for a specific paper
 */
export function getPaperProgress(paperId: string, defaultQuestionCount: number = 8): PaperProgress {
  const all = getAllProgress()
  if (all[paperId]) {
    return all[paperId]
  }

  // Return empty initialized structure
  const initialQuestions: Record<number, QuestionStatus> = {}
  for (let i = 1; i <= defaultQuestionCount; i++) {
    initialQuestions[i] = 'unattempted'
  }

  return {
    paperId,
    subjectCode: '',
    subjectName: '',
    semester: 1,
    totalQuestions: defaultQuestionCount,
    questions: initialQuestions,
    updatedAt: new Date().toISOString()
  }
}

/**
 * Update the status of a specific question on a paper
 */
export function setQuestionStatus(
  paperId: string,
  questionNumber: number,
  status: QuestionStatus,
  metadata?: { subjectCode?: string; subjectName?: string; semester?: number; totalQuestions?: number }
): PaperProgress {
  if (typeof window === 'undefined') {
    return getPaperProgress(paperId)
  }

  const all = getAllProgress()
  const current = all[paperId] || getPaperProgress(paperId, metadata?.totalQuestions || 8)

  if (metadata?.subjectCode) current.subjectCode = metadata.subjectCode
  if (metadata?.subjectName) current.subjectName = metadata.subjectName
  if (metadata?.semester) current.semester = metadata.semester
  if (metadata?.totalQuestions) current.totalQuestions = metadata.totalQuestions

  current.questions[questionNumber] = status
  current.updatedAt = new Date().toISOString()

  all[paperId] = current

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all))
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { paperId, questionNumber, status } }))
  } catch (err) {
    console.error('[Progress Tracker] Failed to save progress', err)
  }

  return current
}

/**
 * Compute aggregate statistics across all tracked subjects
 */
export function getSubjectProgressStats(): {
  totalQuestions: number
  solvedCount: number
  skippedCount: number
  revisitCount: number
  overallPercentage: number
  bySubject: Record<string, { subjectName: string; total: number; solved: number; percentage: number }>
} {
  const all = getAllProgress()
  let totalQuestions = 0
  let solvedCount = 0
  let skippedCount = 0
  let revisitCount = 0

  const bySubject: Record<string, { subjectName: string; total: number; solved: number; percentage: number }> = {}

  Object.values(all).forEach(record => {
    const subKey = record.subjectCode || record.subjectName || 'General'
    if (!bySubject[subKey]) {
      bySubject[subKey] = {
        subjectName: record.subjectName || record.subjectCode || 'General',
        total: 0,
        solved: 0,
        percentage: 0
      }
    }

    Object.values(record.questions).forEach(status => {
      totalQuestions++
      bySubject[subKey].total++

      if (status === 'solved') {
        solvedCount++
        bySubject[subKey].solved++
      } else if (status === 'skipped') {
        skippedCount++
      } else if (status === 'revisit') {
        revisitCount++
      }
    })
  })

  // Calculate percentages
  Object.keys(bySubject).forEach(k => {
    const s = bySubject[k]
    s.percentage = s.total > 0 ? Math.round((s.solved / s.total) * 100) : 0
  })

  const overallPercentage = totalQuestions > 0 ? Math.round((solvedCount / totalQuestions) * 100) : 0

  return {
    totalQuestions,
    solvedCount,
    skippedCount,
    revisitCount,
    overallPercentage,
    bySubject
  }
}
