import { CbtSubject, CbtQuestion } from './types'
import { FSO307_QUESTIONS } from './questions/fso307'

/**
 * Registry of available CBT Mock Test subjects in Prevu
 */
export const CBT_SUBJECTS: CbtSubject[] = [
  {
    code: 'FSO-307',
    name: 'Mobile Application & Device Security',
    semester: 7,
    year: 4,
    category: 'open-elective',
    categoryLabel: 'Open Elective',
    totalQuestions: FSO307_QUESTIONS.length,
    description: 'Complete CBT question bank covering mobile security risks, sandboxing, biometrics, TLS encryption, and malware defense.',
    topics: [
      'Mobile Application Risks',
      'Device Security & Biometrics',
      'Integrity & Code Signing',
      'Secure TLS Communications',
      'Malware Prevention & Sandboxing',
      'Anti-Reverse Engineering & AES'
    ],
    credits: 3,
    isReady: true,
    badgeColor: 'from-purple-600 to-indigo-600'
  },
  {
    code: 'UHV-101',
    name: 'Universal Human Values & Professional Ethics',
    semester: 1,
    year: 1,
    category: 'uhv',
    categoryLabel: 'UHV (Mandatory CBT)',
    totalQuestions: 0,
    description: 'Chandigarh University mandatory CBT examination on ethical human conduct, harmony in self and society.',
    topics: ['Self Exploration', 'Harmony in Self', 'Harmony in Family & Society', 'Professional Ethics'],
    credits: 2,
    isReady: false,
    badgeColor: 'from-amber-600 to-orange-600'
  },
  {
    code: 'APT-301',
    name: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    year: 3,
    category: 'aptitude',
    categoryLabel: 'Aptitude & Placements',
    totalQuestions: 0,
    description: 'High-frequency quantitative aptitude, logical reasoning, and verbal ability MCQs for top tech placement drives.',
    topics: ['Quantitative Aptitude', 'Data Interpretation', 'Logical Reasoning', 'Verbal Ability'],
    credits: 0,
    isReady: false,
    badgeColor: 'from-emerald-600 to-teal-600'
  },
  {
    code: '23CSH-242',
    name: 'Operating System (MST CBT Practice)',
    semester: 3,
    year: 2,
    category: 'core',
    categoryLabel: 'Core Technical CBT',
    totalQuestions: 0,
    description: 'Practice questions for CU MST Computer Based Testing on CPU scheduling, Deadlocks, Semaphores, and Paging.',
    topics: ['Processes & Threads', 'CPU Scheduling', 'Deadlocks & Bankers', 'Virtual Memory'],
    credits: 4,
    isReady: false,
    badgeColor: 'from-cyan-600 to-blue-600'
  },
  {
    code: '23CSH-243',
    name: 'Database Management System (MST CBT)',
    semester: 3,
    year: 2,
    category: 'core',
    categoryLabel: 'Core Technical CBT',
    totalQuestions: 0,
    description: 'High-yield MCQs for Database systems covering Normalization (1NF to BCNF), ER models, Relational Algebra, and SQL.',
    topics: ['ER Models & Relational Schema', 'SQL Queries & Joins', 'Normalization (1NF-BCNF)', 'Transactions & ACID'],
    credits: 4,
    isReady: false,
    badgeColor: 'from-fuchsia-600 to-pink-600'
  }
]

/**
 * Returns all questions for a given subject code
 */
export function getQuestionsForSubject(subjectCode: string): CbtQuestion[] {
  const code = subjectCode.trim().toUpperCase()
  if (code === 'FSO-307' || code === 'FSO307') {
    return FSO307_QUESTIONS
  }
  return []
}

/**
 * Generates a randomized sample of questions for the test
 */
export function generateTestQuestions(
  subjectCode: string,
  requestedCount: number,
  shuffle: boolean = true
): {
  questions: CbtQuestion[]
  totalAvailable: number
  actualCount: number
  notice?: string
} {
  const all = getQuestionsForSubject(subjectCode)
  const totalAvailable = all.length

  if (totalAvailable === 0) {
    return {
      questions: [],
      totalAvailable: 0,
      actualCount: 0,
      notice: `No questions currently available for subject ${subjectCode}.`
    }
  }

  let notice: string | undefined
  let targetCount = requestedCount

  if (requestedCount > totalAvailable) {
    targetCount = totalAvailable
    notice = `We currently have ${totalAvailable} verified questions for this subject. Your test is set to all ${totalAvailable} questions!`
  } else if (requestedCount <= 0) {
    targetCount = Math.min(25, totalAvailable)
  }

  let selected: CbtQuestion[]
  if (shuffle) {
    // Fisher-Yates shuffle
    const shuffled = [...all]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    selected = shuffled.slice(0, targetCount)
  } else {
    selected = all.slice(0, targetCount)
  }

  return {
    questions: selected,
    totalAvailable,
    actualCount: targetCount,
    notice
  }
}
