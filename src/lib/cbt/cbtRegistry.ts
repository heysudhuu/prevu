import { CbtSubject, CbtQuestion } from './types'
import { FSO307_QUESTIONS } from './questions/fso307'
import { APT301_QUESTIONS, LOG301_QUESTIONS } from './questions/apt301'
import { ACP101_QUESTIONS } from './questions/acp101'
import { UHV101_QUESTIONS } from './questions/uhv101'

/**
 * Registry of available CBT Mock Test subjects in Prevu
 */
export const CBT_SUBJECTS: CbtSubject[] = [
  {
    code: 'ACP-101',
    name: 'Academic Career and Pathway Planning',
    semester: 1,
    year: 1,
    category: 'core',
    categoryLabel: 'Career & Life Skills (CBT)',
    totalQuestions: ACP101_QUESTIONS.length,
    description: '160 official syllabus-based CBT practice questions across 2 complete sets. Features direct MCQs and passage case studies on self-discovery, academic ethics, career pathways, personal branding, and growth resilience.',
    topics: [
      'Self-Discovery & Academic Readiness',
      'Academic Integrity & Ethics',
      'Career Awareness & Planning',
      'Professional Brand & Communication',
      'Growth Mindset, Resilience & Wellness'
    ],
    topicsList: [
      {
        id: 'all',
        name: 'All Topics & Case Studies (Mix Practice)',
        count: ACP101_QUESTIONS.length,
        description: 'Complete 160-question CBT exam bank covering all direct MCQs and case-study passages across Set 1 & Set 2'
      },
      {
        id: 'self-discovery',
        name: 'Self-Discovery & Academic Readiness',
        count: ACP101_QUESTIONS.filter(q => q.topic === 'self-discovery').length,
        description: 'Strengths, values, learning styles, active recall, spaced repetition, study habits and academic readiness'
      },
      {
        id: 'academic-integrity',
        name: 'Academic Integrity & Ethics',
        count: ACP101_QUESTIONS.filter(q => q.topic === 'academic-integrity').length,
        description: 'Plagiarism prevention, ethical source attribution, data integrity, and responsible collaborative teamwork'
      },
      {
        id: 'career-planning',
        name: 'Career Awareness & Planning',
        count: ACP101_QUESTIONS.filter(q => q.topic === 'career-planning').length,
        description: 'Career pathway exploration, informational interviews, transferable skills, internships, and 4-year roadmaps'
      },
      {
        id: 'communication-branding',
        name: 'Professional Brand & Communication',
        count: ACP101_QUESTIONS.filter(q => q.topic === 'communication-branding').length,
        description: 'Personal branding, LinkedIn networking, resume presentation, interview skills, and active listening'
      },
      {
        id: 'growth-resilience',
        name: 'Growth Mindset, Resilience & Wellness',
        count: ACP101_QUESTIONS.filter(q => q.topic === 'growth-resilience').length,
        description: 'SMART goals, constructive response to failure, academic wellness, stress management, and mentorship'
      }
    ],
    credits: 2,
    isReady: true,
    badgeColor: 'from-emerald-600 to-teal-600'
  },
  {
    code: 'FSO-307',
    name: 'Digital Cyber Forensics & Mobile Device Security',
    semester: 7,
    year: 4,
    category: 'open-elective',
    categoryLabel: 'Open Elective',
    totalQuestions: FSO307_QUESTIONS.length,
    description: 'Complete 162-question CBT bank covering Digital Cyber Forensics, 10 Unseen Case Study Passages (50 MCQs), Application of AI in Cyber Security, and Mobile Application & Device Security.',
    topics: [
      'Digital Cyber Forensics',
      'Unseen Case Study Passages',
      'Cyber Security: Application of AI',
      'Mobile Application & Device Security',
      'Network & Memory Forensics',
      'Device Integrity & Cryptography'
    ],
    topicsList: [
      {
        id: 'all',
        name: 'All Modules (Mix Practice)',
        count: FSO307_QUESTIONS.length,
        description: 'Complete 162-question CBT bank across Digital Forensics, Unseen Case Passages, AI Security, and Mobile Device Security'
      },
      {
        id: 'digital-forensics',
        name: 'Digital Cyber Forensics',
        count: FSO307_QUESTIONS.filter(q => q.topic === 'digital-forensics').length,
        description: 'Metadata, chain of custody, hashing (SHA-256), disk imaging (dd, FTK Imager), Volatility memory forensics, and file carving'
      },
      {
        id: 'unseen-passages',
        name: 'Unseen Case Study Passages (10 Cases • 50 MCQs)',
        count: FSO307_QUESTIONS.filter(q => q.topic === 'unseen-passages').length,
        description: '10 scenario-based unseen case studies (5 sequential MCQs each) covering Digital Forensics, AI Security, and Mobile Forensics'
      },
      {
        id: 'ai-cybersecurity',
        name: 'Cyber Security: Application of AI',
        count: FSO307_QUESTIONS.filter(q => q.topic === 'ai-cybersecurity').length,
        description: 'Supervised & reinforcement learning, anomaly detection, NLP phishing defense, behavioral analytics, and AI ethics'
      },
      {
        id: 'mobile-device-security',
        name: 'Mobile Application & Device Security',
        count: FSO307_QUESTIONS.filter(q => q.topic === 'mobile-device-security').length,
        description: 'Mobile app risks, sandboxing, biometrics, integrity & code signing, TLS communications, and anti-reverse engineering'
      }
    ],
    credits: 3,
    isReady: true,
    badgeColor: 'from-purple-600 to-indigo-600'
  },
  {
    code: 'APT-301',
    name: 'Quantitative Aptitude (Placements)',
    semester: 5,
    year: 3,
    category: 'aptitude',
    categoryLabel: 'Quantitative Aptitude',
    totalQuestions: APT301_QUESTIONS.length,
    description: 'High-frequency quantitative aptitude MCQs for top tech placement drives: Percentages, Ratios, Ages, Profit/Loss, Time & Work, Speed & Distance, Geometry, and Probability.',
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
      'Data Interpretation & Successive %',
      'Vedic Math & Speed Calculations',
      'Commercial Mathematics & Sets',
      'Mixed Aptitude & Series'
    ],
    topicsList: [
      {
        id: 'all',
        name: 'All Quant Topics (Mix Practice)',
        count: APT301_QUESTIONS.length,
        description: 'Complete Quantitative Aptitude placement bank across all 19 mathematical modules'
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
        description: 'Linear age systems, mother-daughter ratios, family age differences, and forward time projections'
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
        id: 'mixed-aptitude',
        name: 'Mixed Aptitude & Series',
        count: APT301_QUESTIONS.filter(q => q.topic === 'mixed-aptitude').length,
        description: 'LCM, 9-sided polygon angle sums, ball draw probability, machine-time scaling, and round-trip speed'
      },
      {
        id: 'vedic-math',
        name: 'Vedic Math & Speed Calculations',
        count: APT301_QUESTIONS.filter(q => q.topic === 'vedic-math').length,
        description: 'Nikhilam, Ekadhikena Purvena, duplex squares, cubes, roots, digit-sum checks, and approximations'
      },
      {
        id: 'data-interpretation',
        name: 'Data Interpretation & Successive %',
        count: APT301_QUESTIONS.filter(q => q.topic === 'data-interpretation').length,
        description: 'Tabular unit sales DI, percentage growth/decline, and successive discount/increase chains'
      }
    ],
    credits: 0,
    isReady: true,
    badgeColor: 'from-emerald-600 to-teal-600'
  },
  {
    code: 'LOG-301',
    name: 'Logical Reasoning & Analytical Puzzles',
    semester: 5,
    year: 3,
    category: 'aptitude',
    categoryLabel: 'Logical Reasoning',
    totalQuestions: LOG301_QUESTIONS.length,
    description: 'Dedicated logical reasoning and spatial orientation bank for campus placements: Blood Relations, Direction Sense, Cubes & Dice, Coding-Decoding, Syllogisms, and Analytical Grids.',
    topics: [
      'Blood Relations',
      'Direction & Distance',
      'Cube Slicing & Dice Reasoning',
      'Coding & Decoding',
      'Syllogisms & Deductions',
      'Puzzles & Grid Arrangements',
      'Odd One Out & Analogy'
    ],
    topicsList: [
      {
        id: 'all',
        name: 'All Logical Topics (Mix Practice)',
        count: LOG301_QUESTIONS.length,
        description: 'Complete Logical Reasoning bank across all 7 analytical & spatial reasoning modules'
      },
      {
        id: 'blood-relations',
        name: 'Blood Relations',
        count: LOG301_QUESTIONS.filter(q => q.topic === 'blood-relations').length,
        description: 'Single-line riddles, maternal uncles, paternal grandmothers, and family tree deductions'
      },
      {
        id: 'direction-distance',
        name: 'Direction & Distance',
        count: LOG301_QUESTIONS.filter(q => q.topic === 'direction-distance').length,
        description: 'Pythagorean displacement, cardinal turns, and relative coordinate positions'
      },
      {
        id: 'cube-dice',
        name: 'Cube Slicing & Dice Reasoning',
        count: LOG301_QUESTIONS.filter(q => q.topic === 'cube-dice').length,
        description: 'Painted 4x4x4 cubes, cuboid painted faces, standard dice opposite face rules, and vertex adjacency'
      },
      {
        id: 'coding-decoding',
        name: 'Coding & Decoding',
        count: LOG301_QUESTIONS.filter(q => q.topic === 'coding-decoding').length,
        description: 'Letter shifts, reverse alphabetical rank values, shared word mapping, and custom arithmetic operators'
      },
      {
        id: 'syllogisms',
        name: 'Syllogisms & Deductions',
        count: LOG301_QUESTIONS.filter(q => q.topic === 'syllogisms').length,
        description: 'Logical deduction, universal affirmative premises, and negative transitivity rules'
      },
      {
        id: 'puzzles-arrangements',
        name: 'Puzzles & Grid Arrangements',
        count: LOG301_QUESTIONS.filter(q => q.topic === 'puzzles-arrangements').length,
        description: 'Linear seating orders, race rankings, box-color matching, and production scheduling'
      },
      {
        id: 'odd-one-out-analogy',
        name: 'Odd One Out & Analogy',
        count: LOG301_QUESTIONS.filter(q => q.topic === 'odd-one-out-analogy').length,
        description: 'Number/alphabet/word classification, verbal/non-verbal analogies, and 180-degree figure rotations'
      }
    ],
    credits: 0,
    isReady: true,
    badgeColor: 'from-amber-500 to-orange-600'
  },
  {
    code: 'UHV-101',
    name: 'Universal Human Values, Ethics and Life Skills-2',
    semester: 1,
    year: 1,
    category: 'uhv',
    categoryLabel: 'UHV (Mandatory CBT)',
    totalQuestions: UHV101_QUESTIONS.length,
    description: 'Complete 165-MCQ CBT bank aligned to Units 1–3: Personal & Professional Values, Social Values, Environmental & Existential Values, and Integrated Case Applications.',
    topics: [
      'Value Education',
      'Character Formation',
      'Power of Mind & Therapeutic Methods',
      'Positive Attitude',
      'Professional Values & Ethics',
      'Right Conduct',
      'Valuing Traditions',
      'Collaboration & Tolerance',
      'Appreciating Diversity',
      'Nurturing Peace',
      'Nature and Nurture',
      'Protection and Conservation',
      'Sustainability in Life',
      'Secured Future',
      'Youth for Climate Regulation',
      'Integrated Application & Case Studies'
    ],
    topicsList: [
      {
        id: 'all',
        name: 'All UHV Topics (Units 1–3)',
        count: UHV101_QUESTIONS.length,
        description: 'Complete 165-question CBT exam bank across all 15 syllabus topics and integrated case applications'
      },
      {
        id: 'value-education',
        name: 'Value Education',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'value-education').length,
        description: 'Holistic human competence, self-exploration, Viveka, and harmony in Self, family, society, and nature'
      },
      {
        id: 'character-formation',
        name: 'Character Formation',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'character-formation').length,
        description: 'Samskaras, integrity, Indriya Nigraha, moral courage, self-accountability, and habit reinforcement'
      },
      {
        id: 'power-of-mind',
        name: 'Power of Mind & Therapeutic Methods',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'power-of-mind').length,
        description: 'Mindfulness, Chitta Vritti Nirodha, Pranayama, cognitive reframing, Yoga Nidra, and emotional regulation'
      },
      {
        id: 'positive-attitude',
        name: 'Positive Attitude',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'positive-attitude').length,
        description: 'Growth mindset, proactivity, resilience, learned optimism, Circle of Influence, and avoiding toxic positivity'
      },
      {
        id: 'professional-ethics',
        name: 'Professional Values & Ethics',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'professional-ethics').length,
        description: 'Conflict of interest, whistleblowing, confidentiality, intellectual honesty, CSR, fiduciary duty, and work-life balance'
      },
      {
        id: 'right-conduct',
        name: 'Right Conduct',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'right-conduct').length,
        description: 'Dharma, Ahimsa, Satya, Asteya, Aparigraha, empathy, civic sense, and responsible digital citizenship'
      },
      {
        id: 'valuing-traditions',
        name: 'Valuing Traditions',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'valuing-traditions').length,
        description: 'Atithi Devo Bhava, Vasudhaiva Kutumbakam, Intangible Cultural Heritage, and reform of regressive customs'
      },
      {
        id: 'collaboration-tolerance',
        name: 'Collaboration & Tolerance',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'collaboration-tolerance').length,
        description: 'Synergy, active listening, Paradox of Tolerance, constructive disagreement, and Win-Win conflict resolution'
      },
      {
        id: 'appreciating-diversity',
        name: 'Appreciating Diversity',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'appreciating-diversity').length,
        description: 'Inclusion, equity vs equality, unconscious bias, cognitive diversity, universal design, and cultural competence'
      },
      {
        id: 'nurturing-peace',
        name: 'Nurturing Peace',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'nurturing-peace').length,
        description: 'Positive Peace, Satyagraha, Nonviolent Communication (NVC), restorative justice, and interfaith dialogue'
      },
      {
        id: 'nature-and-nurture',
        name: 'Nature and Nurture',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'nature-and-nurture').length,
        description: 'Four orders of Nature, Biophilia, Deep Ecology, Bhoomi Mata, ecosystem services, and existential responsibility'
      },
      {
        id: 'protection-conservation',
        name: 'Protection and Conservation',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'protection-conservation').length,
        description: 'Preservation vs conservation, Chipko Movement, in-situ conservation, Article 51A(g), Sacred Groves, and Ramsar wetlands'
      },
      {
        id: 'sustainability-in-life',
        name: 'Sustainability in Life',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'sustainability-in-life').length,
        description: 'Triple Bottom Line, 5Rs waste hierarchy, Circular Economy, Ecological Footprint, Mission LiFE, and greenwashing'
      },
      {
        id: 'secured-future',
        name: 'Secured Future',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'secured-future').length,
        description: 'Intergenerational justice, Precautionary Principle, UN SDGs, DRR, Planetary Boundaries, and ethical AI/biotech'
      },
      {
        id: 'youth-climate-regulation',
        name: 'Youth for Climate Regulation',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'youth-climate-regulation').length,
        description: 'Paris Agreement, Carbon Footprint, Climate Justice, green entrepreneurship, Miyawaki forests, and Net-Zero'
      },
      {
        id: 'integrated-case-applications',
        name: 'Integrated Application & Case Studies',
        count: UHV101_QUESTIONS.filter(q => q.topic === 'integrated-case-applications').length,
        description: 'Applied ethical, social, and environmental case scenarios across Units 1–3'
      }
    ],
    credits: 2,
    isReady: true,
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
 * Helper to normalize raw contributed question to CbtQuestion
 */
export function normalizeContributedQuestion(q: any): CbtQuestion {
  let options: { id: string; text: string }[] = []
  if (Array.isArray(q.options_json)) {
    options = q.options_json.map((o: any, i: number) => ({
      id: String(o.id || String.fromCharCode(65 + i)),
      text: String(o.text || '')
    }))
  } else if (q.options_json && typeof q.options_json === 'object') {
    options = Object.entries(q.options_json).map(([k, v]) => ({
      id: k,
      text: String(v)
    }))
  }

  const rawTopic = (q.unit_tag || '').toLowerCase()
  let matchedTopicId = 'all'
  if (rawTopic.includes('ratio')) matchedTopicId = 'ratio-proportion'
  else if (rawTopic.includes('percent')) matchedTopicId = 'percentages'
  else if (rawTopic.includes('age')) matchedTopicId = 'problems-on-ages'
  else if (rawTopic.includes('profit') || rawTopic.includes('discount')) matchedTopicId = 'profit-loss-discount'
  else if (rawTopic.includes('variation')) matchedTopicId = 'variation'
  else if (rawTopic) matchedTopicId = rawTopic.replace(/[^a-z0-9]+/g, '-')

  return {
    id: String(q.id),
    subjectCode: q.subject_code,
    subjectName: q.subject_name,
    semester: q.semester || 1,
    category: q.category || 'aptitude',
    topic: matchedTopicId,
    topicName: q.unit_tag || 'Community Contribution',
    question: q.question,
    type: q.question_type || 'single',
    options,
    correctAnswers: q.correct_answers || ['A'],
    explanation: q.explanation || '',
    status: 'approved',
    submittedBy: q.user_name || q.username
  }
}

/**
 * Returns all questions for a given subject code, optionally filtered by topic
 */
export function getQuestionsForSubject(
  subjectCode: string, 
  topicId?: string,
  extraApprovedQuestions: (CbtQuestion | any)[] = []
): CbtQuestion[] {
  const code = subjectCode.trim().toUpperCase()
  let pool: CbtQuestion[] = []
  if (code === 'ACP-101' || code === 'ACP101' || code.includes('ACP')) {
    pool = [...ACP101_QUESTIONS]
  } else if (code === 'FSO-307' || code === 'FSO307') {
    pool = [...FSO307_QUESTIONS]
  } else if (code === 'APT-301' || code === 'APT301') {
    pool = [...APT301_QUESTIONS]
  } else if (code === 'LOG-301' || code === 'LOG301') {
    pool = [...LOG301_QUESTIONS]
  } else if (code === 'UHV-101' || code === 'UHV101') {
    pool = [...UHV101_QUESTIONS]
  }

  if (extraApprovedQuestions && extraApprovedQuestions.length > 0) {
    for (const raw of extraApprovedQuestions) {
      const q = raw.subjectCode ? (raw as CbtQuestion) : normalizeContributedQuestion(raw)
      const qCode = q.subjectCode?.toUpperCase() || ''
      if (qCode === code || qCode.replace(/-/g, '') === code.replace(/-/g, '')) {
        pool.push(q)
      }
    }
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
  topicId?: string,
  extraApprovedQuestions: (CbtQuestion | any)[] = []
): {
  questions: CbtQuestion[]
  totalAvailable: number
  actualCount: number
  notice?: string
} {
  const all = getQuestionsForSubject(subjectCode, topicId, extraApprovedQuestions)
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
  if (shuffle && topicId !== 'unseen-passages') {
    // Group questions sharing the same `passage` so unseen case study questions stay together in sequence
    const units: CbtQuestion[][] = []
    const passageUnitMap = new Map<string, CbtQuestion[]>()

    for (const q of all) {
      if (q.passage && q.passage.trim().length > 0) {
        const key = q.passage.trim()
        let group = passageUnitMap.get(key)
        if (!group) {
          group = []
          passageUnitMap.set(key, group)
          units.push(group)
        }
        group.push(q)
      } else {
        units.push([q])
      }
    }

    // Fisher-Yates shuffle on units (preserving internal question sequence for each passage)
    for (let i = units.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
        ;[units[i], units[j]] = [units[j], units[i]]
    }

    const flattened = units.flat()
    selected = flattened.slice(0, targetCount)
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
