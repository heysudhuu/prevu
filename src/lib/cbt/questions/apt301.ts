import { CbtQuestion } from '../types'
import { APT301_100_QUESTIONS } from './apt301_set100'
import { APT301_MASTER_QUESTIONS } from './apt301_master'
import { APT301_PERCENTAGES_EXTENDED } from './apt301_percentages_extended'
import { APT301_AGES_EXTENDED } from './apt301_ages_extended'

/**
 * Campus Placement Aptitude & Logical Reasoning Master Question Pool
 * Complete 290 Verified MCQs with Step-by-Step Analytical Solutions
 * 
 * Includes:
 * 1. 100 Foundational Placement Questions across 22 Modules
 * 2. 76 Campus Placement Master Series Questions with Caselets & Detailed Derivations
 * 3. 50 Comprehensive Percentage MCQs (Standard Placement & Competitive Series)
 * 4. 64 Comprehensive Problems on Ages MCQs (Solved Examples & Placement Exam Series)
 */
export const APT301_QUESTIONS: CbtQuestion[] = [
  ...APT301_100_QUESTIONS,
  ...APT301_MASTER_QUESTIONS,
  ...APT301_PERCENTAGES_EXTENDED,
  ...APT301_AGES_EXTENDED
]

export { APT301_100_QUESTIONS } from './apt301_set100'
export { APT301_MASTER_QUESTIONS } from './apt301_master'
export { APT301_PERCENTAGES_EXTENDED } from './apt301_percentages_extended'
export { APT301_AGES_EXTENDED } from './apt301_ages_extended'
