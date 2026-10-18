export type CbtQuestionType = 'single' | 'multiple'

export interface CbtOption {
  id: string // 'A' | 'B' | 'C' | 'D' | 'E' | 'F'
  text: string
}

export interface CbtQuestion {
  id: string
  subjectCode: string
  subjectName: string
  semester: number
  category: 'open-elective' | 'aptitude' | 'uhv' | 'core'
  topic?: string
  topicName?: string
  partName?: string
  sectionName?: string
  passage?: string
  question: string
  type: CbtQuestionType
  options: CbtOption[]
  correctAnswers: string[] // e.g. ['A', 'C', 'F']
  explanation: string
  difficulty?: 'easy' | 'medium' | 'hard'
  status?: 'approved' | 'pending'
  submittedBy?: string
}

export interface CbtSubjectTopic {
  id: string
  name: string
  count: number
  questionCount?: number
  description?: string
}

export interface CbtSubject {
  code: string
  name: string
  semester: number
  year: number
  category: 'open-elective' | 'aptitude' | 'uhv' | 'core'
  categoryLabel: string
  totalQuestions: number
  description: string
  topics: string[]
  topicsList?: CbtSubjectTopic[]
  credits?: number
  isReady: boolean
  badgeColor: string
}

export interface CbtExamConfig {
  questionCount: number
  timeLimitMinutes: number
  shuffleQuestions: boolean
  shuffleOptions: boolean
  selectedTopic?: string
}

export interface CbtUserAnswer {
  questionId: string
  selectedOptions: string[]
  isCorrect: boolean
  isMarkedForReview?: boolean
}

export interface CbtAttemptResult {
  id: string
  subjectCode: string
  subjectName: string
  userId: string
  username: string
  userName: string
  cuVerified: boolean
  score: number
  totalQuestions: number
  percentage: number
  timeSpentSeconds: number
  allottedMinutes: number
  answers: CbtUserAnswer[]
  completedAt: string
}

export interface CbtLeaderboardEntry {
  rank?: number
  userId: string
  username: string
  userName: string
  cuVerified: boolean
  subjectCode: string
  score: number
  totalQuestions: number
  percentage: number
  timeSpentSeconds: number
  attemptsCount: number
  updatedAt: string
}
