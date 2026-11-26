import { CbtQuestion } from '../types'
import { APT301_100_QUESTIONS } from './apt301_set100'
import { APT301_MASTER_QUESTIONS } from './apt301_master'
import { APT301_PERCENTAGES_EXTENDED } from './apt301_percentages_extended'
import { APT301_AGES_EXTENDED } from './apt301_ages_extended'
import { APT_SYLLABUS_UNIT1_2 } from './apt_syllabus_unit1_2'
import { APT_SYLLABUS_UNIT3 } from './apt_syllabus_unit3'

const LOGICAL_REASONING_TOPICS = new Set([
  'blood-relations',
  'direction-distance',
  'cube-dice',
  'coding-decoding',
  'syllogisms',
  'puzzles-arrangements',
  'odd-one-out-analogy'
])

const ALL_APTITUDE_RAW: CbtQuestion[] = [
  ...APT301_100_QUESTIONS,
  ...APT301_MASTER_QUESTIONS,
  ...APT301_PERCENTAGES_EXTENDED,
  ...APT301_AGES_EXTENDED,
  ...APT_SYLLABUS_UNIT1_2,
  ...APT_SYLLABUS_UNIT3
]

/**
 * Quantitative Aptitude (Placements) — APT-301
 * Purely Quantitative Aptitude MCQs across 17 modules
 */
export const APT301_QUESTIONS: CbtQuestion[] = ALL_APTITUDE_RAW
  .filter(q => !LOGICAL_REASONING_TOPICS.has(q.topic || ''))
  .map(q => ({
    ...q,
    subjectCode: 'APT-301',
    subjectName: 'Quantitative Aptitude (Placements)'
  }))

/**
 * Logical Reasoning & Analytical Puzzles — LOG-301
 * Purely Logical Reasoning MCQs across 6 modules
 */
export const LOG301_QUESTIONS: CbtQuestion[] = ALL_APTITUDE_RAW
  .filter(q => LOGICAL_REASONING_TOPICS.has(q.topic || ''))
  .map(q => ({
    ...q,
    subjectCode: 'LOG-301',
    subjectName: 'Logical Reasoning & Analytical Puzzles'
  }))

export { APT301_100_QUESTIONS } from './apt301_set100'
export { APT301_MASTER_QUESTIONS } from './apt301_master'
export { APT301_PERCENTAGES_EXTENDED } from './apt301_percentages_extended'
export { APT301_AGES_EXTENDED } from './apt301_ages_extended'
