import { CbtSubject, CbtQuestion } from './types'
import { FSO307_QUESTIONS } from './questions/fso307'
import { APT301_QUESTIONS } from './questions/apt301'

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
    code: 'APT-301',
    name: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    year: 3,
    category: 'aptitude',
    categoryLabel: 'Aptitude & Placements',
    totalQuestions: APT301_QUESTIONS.length,
    description: 'High-frequency quantitative aptitude, logical reasoning, and spatial orientation MCQs for top tech placement drives.',
    topics: [
      'Percentages',
      'Ratio & Proportion',
      'Problems on Ages',
      'Variation',
      'Profit, Loss & Discount',
      'Simple & Compound Interest',
      'Averages',
      'Mixtures & Alligation',
      'Time, Work & Wages',
      'Pipes & Cisterns',
      'Speed, Time & Distance',
      'Number Theory & Operations',
      'Geometry & Mensuration',
      'Permutations, Combinations & Probability',
      'Data Sufficiency',
      'Blood Relations',
      'Direction & Distance',
      'Cube Slicing & Dice Reasoning',
      'Coding & Decoding',
      'Syllogisms',
      'Commercial Mathematics & Sets',
      'Analytical Puzzles & Arrangements',
      'Mixed Aptitude & Series'
    ],
    topicsList: [
      {
        id: 'all',
        name: 'All Topics (Mix Practice)',
        count: APT301_QUESTIONS.length,
        description: 'Complete 290-question placement master practice across all quantitative aptitude and logical reasoning modules'
      },
      {
        id: 'percentages',
        name: 'Percentages',
        count: APT301_QUESTIONS.filter(q => q.topic === 'percentages').length,
        description: 'Conversion fractions, price/consumption balance, error percentage, successive change, voters and election ratios'
      },
      {
        id: 'ratio-proportion',
        name: 'Ratio & Proportion',
        count: APT301_QUESTIONS.filter(q => q.topic === 'ratio-proportion').length,
        description: 'Simplifying ratios, division of amounts, compound ratio a:c, and mean proportionals'
      },
      {
        id: 'problems-on-ages',
        name: 'Problems on Ages',
        count: APT301_QUESTIONS.filter(q => q.topic === 'problems-on-ages').length,
        description: 'Linear age systems, mother-daughter ratios, family age differences, and forward time projections (68 MCQs)'
      },
      {
        id: 'variation',
        name: 'Direct & Inverse Variation',
        count: APT301_QUESTIONS.filter(q => q.topic === 'variation').length,
        description: 'Direct proportionality, inverse proportionality constants, and worker-day variations'
      },
      {
        id: 'profit-loss-discount',
        name: 'Profit, Loss & Discount',
        count: APT301_QUESTIONS.filter(q => q.topic === 'profit-loss-discount').length,
        description: 'Cost price, selling price, successive discounts, and dishonest dealer fraud'
      },
      {
        id: 'commercial-math',
        name: 'Commercial Mathematics & Sets',
        count: APT301_QUESTIONS.filter(q => q.topic === 'commercial-math').length,
        description: 'Venn diagrams overlap, income expenditure savings, margin adjustments, and mark-up over CP'
      },
      {
        id: 'interest',
        name: 'Simple & Compound Interest',
        count: APT301_QUESTIONS.filter(q => q.topic === 'interest').length,
        description: 'Simple interest time and rate formulas, compound amount, and annual compounding'
      },
      {
        id: 'averages',
        name: 'Averages',
        count: APT301_QUESTIONS.filter(q => q.topic === 'averages').length,
        description: 'Arithmetic mean, replacement deviations, and consecutive integer series'
      },
      {
        id: 'mixtures-alligation',
        name: 'Mixtures & Alligation',
        count: APT301_QUESTIONS.filter(q => q.topic === 'mixtures-alligation').length,
        description: 'Acid solution percentages, alligation rule mixing, and repeated milk withdrawal dilution'
      },
      {
        id: 'time-work',
        name: 'Time, Work & Wages',
        count: APT301_QUESTIONS.filter(q => q.topic === 'time-work').length,
        description: 'Combined worker rates, fraction completion, wage distribution, and alternate day schedules'
      },
      {
        id: 'pipes-cisterns',
        name: 'Pipes & Cisterns',
        count: APT301_QUESTIONS.filter(q => q.topic === 'pipes-cisterns').length,
        description: 'Inlet filling rates, drain leaks, and combined multi-hour tank fractions'
      },
      {
        id: 'speed-distance-time',
        name: 'Speed, Time & Distance',
        count: APT301_QUESTIONS.filter(q => q.topic === 'speed-distance-time').length,
        description: 'km/h to m/s conversions, train pole crossing, and harmonic mean average speeds'
      },
      {
        id: 'number-theory',
        name: 'Number Theory & Operations',
        count: APT301_QUESTIONS.filter(q => q.topic === 'number-theory').length,
        description: 'Modulo remainders, prime factorization, cyclicity units digits, and sum of odd integers'
      },
      {
        id: 'geometry-mensuration',
        name: 'Geometry & Mensuration',
        count: APT301_QUESTIONS.filter(q => q.topic === 'geometry-mensuration').length,
        description: 'Regular polygons, interior angles of decagon, triangle inequality, and tethered goat grazing'
      },
      {
        id: 'pnc-probability',
        name: 'PnC & Probability',
        count: APT301_QUESTIONS.filter(q => q.topic === 'pnc-probability').length,
        description: 'Permutations, combinations without repetition, dice sum probabilities, and handshakes'
      },
      {
        id: 'data-sufficiency',
        name: 'Data Sufficiency',
        count: APT301_QUESTIONS.filter(q => q.topic === 'data-sufficiency').length,
        description: 'Train speeds and work rate evaluation from statements I & II'
      },
      {
        id: 'blood-relations',
        name: 'Blood Relations',
        count: APT301_QUESTIONS.filter(q => q.topic === 'blood-relations').length,
        description: 'Single-line riddles, maternal uncles, paternal grandmothers, and family aunts'
      },
      {
        id: 'direction-distance',
        name: 'Direction & Distance',
        count: APT301_QUESTIONS.filter(q => q.topic === 'direction-distance').length,
        description: 'Pythagorean displacement, cardinal turns, and relative coordinate positions'
      },
      {
        id: 'cube-dice',
        name: 'Cube Slicing & Dice Reasoning',
        count: APT301_QUESTIONS.filter(q => q.topic === 'cube-dice').length,
        description: 'Painted 4x4x4 cubes, cuboid painted faces, standard dice opposite face rules, and vertex adjacency'
      },
      {
        id: 'coding-decoding',
        name: 'Coding & Decoding',
        count: APT301_QUESTIONS.filter(q => q.topic === 'coding-decoding').length,
        description: 'Letter shifts, reverse alphabetical rank values, shared word mapping, and custom arithmetic operators'
      },
      {
        id: 'syllogisms',
        name: 'Syllogisms & Deductions',
        count: APT301_QUESTIONS.filter(q => q.topic === 'syllogisms').length,
        description: 'Logical deduction, universal affirmative premises, and negative transitivity rules'
      },
      {
        id: 'puzzles-arrangements',
        name: 'Puzzles & Grid Arrangements',
        count: APT301_QUESTIONS.filter(q => q.topic === 'puzzles-arrangements').length,
        description: 'Linear seating orders, race rankings, box-color matching, and production scheduling'
      },
      {
        id: 'mixed-aptitude',
        name: 'Mixed Aptitude & Series',
        count: APT301_QUESTIONS.filter(q => q.topic === 'mixed-aptitude').length,
        description: 'LCM, 9-sided polygon angle sums, ball draw probability, machine-time scaling, and round-trip speed'
      }
    ],
    credits: 0,
    isReady: true,
    badgeColor: 'from-emerald-600 to-teal-600'
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
 * Returns all questions for a given subject code, optionally filtered by topic
 */
export function getQuestionsForSubject(subjectCode: string, topicId?: string): CbtQuestion[] {
  const code = subjectCode.trim().toUpperCase()
  let pool: CbtQuestion[] = []
  if (code === 'FSO-307' || code === 'FSO307') {
    pool = FSO307_QUESTIONS
  } else if (code === 'APT-301' || code === 'APT301') {
    pool = APT301_QUESTIONS
  }

  if (topicId && topicId !== 'all') {
    return pool.filter(q => q.topic === topicId)
  }
  return pool
}

/**
 * Generates a randomized sample of questions for the test
 */
export function generateTestQuestions(
  subjectCode: string,
  requestedCount: number,
  shuffle: boolean = true,
  topicId?: string
): {
  questions: CbtQuestion[]
  totalAvailable: number
  actualCount: number
  notice?: string
} {
  const all = getQuestionsForSubject(subjectCode, topicId)
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
