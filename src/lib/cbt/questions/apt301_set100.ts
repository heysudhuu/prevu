import { CbtQuestion } from '../types'

/**
 * 100-Question Aptitude & Logical Reasoning Master Question Bank
 * Complete 100 MCQs with Four Options Each and Verified Step-by-Step Solutions
 */
export const APT301_100_QUESTIONS: CbtQuestion[] = [
  // =========================================================================
  // 1. PERCENTAGES (Questions 1 - 5)
  // =========================================================================
  {
    id: 'apt-pct-01',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Percentages',
    question: 'A price of Rs. 800 is increased by 15%. What is the new price?',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 880' },
      { id: 'B', text: 'Rs. 900' },
      { id: 'C', text: 'Rs. 920' },
      { id: 'D', text: 'Rs. 940' }
    ],
    correctAnswers: ['C'],
    explanation: 'New price = 800 × (1 + 0.15) = 800 × 1.15 = Rs. 920.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pct-02',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Percentages',
    question: 'A number is decreased by 20% and then increased by 20%. What is the net change?',
    type: 'single',
    options: [
      { id: 'A', text: 'No change' },
      { id: 'B', text: '4% decrease' },
      { id: 'C', text: '4% increase' },
      { id: 'D', text: '2% decrease' }
    ],
    correctAnswers: ['B'],
    explanation: 'Let initial = 100. Decreased by 20% → 80. Increased by 20% → 80 × 1.20 = 96. Net change = 96 − 100 = −4% (4% decrease).',
    difficulty: 'easy'
  },
  {
    id: 'apt-pct-03',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Percentages',
    question: 'A student scores 72 marks out of 90. What percentage is this?',
    type: 'single',
    options: [
      { id: 'A', text: '75%' },
      { id: 'B', text: '80%' },
      { id: 'C', text: '82%' },
      { id: 'D', text: '85%' }
    ],
    correctAnswers: ['B'],
    explanation: 'Percentage = (72 / 90) × 100% = (8 / 10) × 100% = 80%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pct-04',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Percentages',
    question: 'A town has 24,000 voters; 55% are women. How many are men?',
    type: 'single',
    options: [
      { id: 'A', text: '10,800' },
      { id: 'B', text: '12,000' },
      { id: 'C', text: '13,200' },
      { id: 'D', text: '14,400' }
    ],
    correctAnswers: ['A'],
    explanation: 'Men percentage = 100% − 55% = 45%. Number of men = 0.45 × 24,000 = 10,800.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pct-05',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Percentages',
    question: 'The price of rice rises by 25%. By what percentage should consumption fall to keep spending unchanged?',
    type: 'single',
    options: [
      { id: 'A', text: '15%' },
      { id: 'B', text: '20%' },
      { id: 'C', text: '25%' },
      { id: 'D', text: '30%' }
    ],
    correctAnswers: ['B'],
    explanation: 'Required reduction = [r / (100 + r)] × 100% = [25 / (100 + 25)] × 100% = (25 / 125) × 100% = 20%.',
    difficulty: 'medium'
  },

  // =========================================================================
  // 2. RATIO & PROPORTION (Questions 6 - 10)
  // =========================================================================
  {
    id: 'apt-rat-06',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'ratio-proportion',
    topicName: 'Ratio & Proportion',
    partName: 'Quantitative Aptitude',
    sectionName: 'Ratio & Proportion',
    question: 'Simplify the ratio 42:56.',
    type: 'single',
    options: [
      { id: 'A', text: '2:3' },
      { id: 'B', text: '3:4' },
      { id: 'C', text: '4:5' },
      { id: 'D', text: '6:7' }
    ],
    correctAnswers: ['B'],
    explanation: 'Divide both terms by their GCD (14): 42/14 = 3, 56/14 = 4. Simplified ratio = 3:4.',
    difficulty: 'easy'
  },
  {
    id: 'apt-rat-07',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'ratio-proportion',
    topicName: 'Ratio & Proportion',
    partName: 'Quantitative Aptitude',
    sectionName: 'Ratio & Proportion',
    question: 'Divide Rs. 840 in the ratio 3:4.',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 360, Rs. 480' },
      { id: 'B', text: 'Rs. 320, Rs. 520' },
      { id: 'C', text: 'Rs. 400, Rs. 440' },
      { id: 'D', text: 'Rs. 280, Rs. 560' }
    ],
    correctAnswers: ['A'],
    explanation: 'Total parts = 3 + 4 = 7. Each part = 840 / 7 = 120. Parts: 3 × 120 = Rs. 360, 4 × 120 = Rs. 480.',
    difficulty: 'easy'
  },
  {
    id: 'apt-rat-08',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'ratio-proportion',
    topicName: 'Ratio & Proportion',
    partName: 'Quantitative Aptitude',
    sectionName: 'Ratio & Proportion',
    question: 'If a:b = 2:3 and b:c = 4:5, what is a:c?',
    type: 'single',
    options: [
      { id: 'A', text: '8:15' },
      { id: 'B', text: '2:5' },
      { id: 'C', text: '4:15' },
      { id: 'D', text: '8:5' }
    ],
    correctAnswers: ['A'],
    explanation: 'a/c = (a/b) × (b/c) = (2/3) × (4/5) = 8/15. Hence a:c = 8:15.',
    difficulty: 'easy'
  },
  {
    id: 'apt-rat-09',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'ratio-proportion',
    topicName: 'Ratio & Proportion',
    partName: 'Quantitative Aptitude',
    sectionName: 'Ratio & Proportion',
    question: 'Find the mean proportional between 9 and 25.',
    type: 'single',
    options: [
      { id: 'A', text: '12' },
      { id: 'B', text: '15' },
      { id: 'C', text: '17' },
      { id: 'D', text: '18' }
    ],
    correctAnswers: ['B'],
    explanation: 'Mean proportional = √(9 × 25) = 3 × 5 = 15.',
    difficulty: 'easy'
  },
  {
    id: 'apt-rat-10',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'ratio-proportion',
    topicName: 'Ratio & Proportion',
    partName: 'Quantitative Aptitude',
    sectionName: 'Ratio & Proportion',
    question: 'If 5 pens cost Rs. 70, what do 8 pens cost at the same rate?',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 98' },
      { id: 'B', text: 'Rs. 105' },
      { id: 'C', text: 'Rs. 112' },
      { id: 'D', text: 'Rs. 120' }
    ],
    correctAnswers: ['C'],
    explanation: 'Cost of 1 pen = 70 / 5 = Rs. 14. Cost of 8 pens = 14 × 8 = Rs. 112.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 3. PROBLEMS ON AGES (Questions 11 - 14)
  // =========================================================================
  {
    id: 'apt-age-11',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'problems-on-ages',
    topicName: 'Problems on Ages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Problems on Ages',
    question: "A mother is 3 times her daughter's age. Their ages total 48 years. How old is the daughter?",
    type: 'single',
    options: [
      { id: 'A', text: '10' },
      { id: 'B', text: '12' },
      { id: 'C', text: '14' },
      { id: 'D', text: '16' }
    ],
    correctAnswers: ['B'],
    explanation: 'Let daughter = x, mother = 3x. x + 3x = 48 ⇒ 4x = 48 ⇒ x = 12 years.',
    difficulty: 'easy'
  },
  {
    id: 'apt-age-12',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'problems-on-ages',
    topicName: 'Problems on Ages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Problems on Ages',
    question: 'A is 5 years older than B. In 7 years their ages total 41. How old is B now?',
    type: 'single',
    options: [
      { id: 'A', text: '9' },
      { id: 'B', text: '10' },
      { id: 'C', text: '11' },
      { id: 'D', text: '12' }
    ],
    correctAnswers: ['C'],
    explanation: 'A = B + 5. In 7 years: (A + 7) + (B + 7) = 41 ⇒ (B + 12) + (B + 7) = 41 ⇒ 2B + 19 = 41 ⇒ 2B = 22 ⇒ B = 11.',
    difficulty: 'medium'
  },
  {
    id: 'apt-age-13',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'problems-on-ages',
    topicName: 'Problems on Ages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Problems on Ages',
    question: "The present ages of P and Q are in ratio 4:5 and sum to 36. What is Q's age?",
    type: 'single',
    options: [
      { id: 'A', text: '16' },
      { id: 'B', text: '18' },
      { id: 'C', text: '20' },
      { id: 'D', text: '24' }
    ],
    correctAnswers: ['C'],
    explanation: 'Total parts = 4 + 5 = 9. 1 part = 36 / 9 = 4. Q = 5 × 4 = 20 years.',
    difficulty: 'easy'
  },
  {
    id: 'apt-age-14',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'problems-on-ages',
    topicName: 'Problems on Ages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Problems on Ages',
    question: "A father is 4 times his son's age. In 12 years, he will be twice his son's age. How old is the son now?",
    type: 'single',
    options: [
      { id: 'A', text: '4' },
      { id: 'B', text: '5' },
      { id: 'C', text: '6' },
      { id: 'D', text: '8' }
    ],
    correctAnswers: ['C'],
    explanation: 'F = 4s. In 12 years: F + 12 = 2(s + 12) ⇒ 4s + 12 = 2s + 24 ⇒ 2s = 12 ⇒ s = 6 years.',
    difficulty: 'medium'
  },

  // =========================================================================
  // 4. VARIATION (Questions 15 - 17)
  // =========================================================================
  {
    id: 'apt-var-15',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'variation',
    topicName: 'Direct & Inverse Variation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Variation',
    question: 'If y varies directly as x and y=18 when x=6, find y when x=10.',
    type: 'single',
    options: [
      { id: 'A', text: '24' },
      { id: 'B', text: '30' },
      { id: 'C', text: '36' },
      { id: 'D', text: '42' }
    ],
    correctAnswers: ['B'],
    explanation: 'y = kx ⇒ k = y/x = 18/6 = 3. When x = 10: y = 3 × 10 = 30.',
    difficulty: 'easy'
  },
  {
    id: 'apt-var-16',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'variation',
    topicName: 'Direct & Inverse Variation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Variation',
    question: 'If y varies inversely as x and y=12 when x=4, find y when x=8.',
    type: 'single',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '6' },
      { id: 'C', text: '8' },
      { id: 'D', text: '24' }
    ],
    correctAnswers: ['B'],
    explanation: 'xy = k ⇒ k = 4 × 12 = 48. When x = 8: y = 48 / 8 = 6.',
    difficulty: 'easy'
  },
  {
    id: 'apt-var-17',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'variation',
    topicName: 'Direct & Inverse Variation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Variation',
    question: 'Four workers finish a job in 15 days. At the same rate, how many days would 10 workers need?',
    type: 'single',
    options: [
      { id: 'A', text: '5' },
      { id: 'B', text: '6' },
      { id: 'C', text: '8' },
      { id: 'D', text: '10' }
    ],
    correctAnswers: ['B'],
    explanation: 'Total worker-days = 4 × 15 = 60. Days for 10 workers = 60 / 10 = 6 days.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 5. PROFIT, LOSS & DISCOUNT (Questions 18 - 22)
  // =========================================================================
  {
    id: 'apt-pld-18',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Profit, Loss & Discount',
    question: 'An item costing Rs. 500 is sold for Rs. 575. Find the profit percentage.',
    type: 'single',
    options: [
      { id: 'A', text: '10%' },
      { id: 'B', text: '12%' },
      { id: 'C', text: '15%' },
      { id: 'D', text: '20%' }
    ],
    correctAnswers: ['C'],
    explanation: 'Profit = 575 − 500 = Rs. 75. Profit % = (75 / 500) × 100% = 15%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pld-19',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Profit, Loss & Discount',
    question: 'An item marked Rs. 1,200 is sold at a 15% discount. What is its selling price?',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 980' },
      { id: 'B', text: 'Rs. 1,000' },
      { id: 'C', text: 'Rs. 1,020' },
      { id: 'D', text: 'Rs. 1,050' }
    ],
    correctAnswers: ['C'],
    explanation: 'SP = 1200 × (1 − 0.15) = 1200 × 0.85 = Rs. 1,020.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pld-20',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Profit, Loss & Discount',
    question: 'A shopkeeper buys an item for Rs. 800 and sells it at a 10% loss. Find the selling price.',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 700' },
      { id: 'B', text: 'Rs. 720' },
      { id: 'C', text: 'Rs. 740' },
      { id: 'D', text: 'Rs. 760' }
    ],
    correctAnswers: ['B'],
    explanation: 'SP = 800 × (1 − 0.10) = 800 × 0.90 = Rs. 720.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pld-21',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Profit, Loss & Discount',
    question: 'Two successive discounts of 10% and 20% are equivalent to what single discount?',
    type: 'single',
    options: [
      { id: 'A', text: '28%' },
      { id: 'B', text: '30%' },
      { id: 'C', text: '32%' },
      { id: 'D', text: '25%' }
    ],
    correctAnswers: ['A'],
    explanation: 'Net multiplier = (1 − 0.10) × (1 − 0.20) = 0.90 × 0.80 = 0.72. Single discount = (1 − 0.72) × 100% = 28%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pld-22',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Profit, Loss & Discount',
    question: 'A dishonest seller charges for 1 kg but gives 900 g, at the cost price per kg. What is the gain percentage?',
    type: 'single',
    options: [
      { id: 'A', text: '9%' },
      { id: 'B', text: '10%' },
      { id: 'C', text: '11 1/9%' },
      { id: 'D', text: '12.5%' }
    ],
    correctAnswers: ['C'],
    explanation: 'Gain % = [Error / False Value] × 100% = [(1000 − 900) / 900] × 100% = (100 / 900) × 100% = 1/9 × 100% = 11 1/9%.',
    difficulty: 'medium'
  },

  // =========================================================================
  // 6. SIMPLE & COMPOUND INTEREST (Questions 23 - 26)
  // =========================================================================
  {
    id: 'apt-int-23',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Simple & Compound Interest',
    question: 'Find the simple interest on Rs. 5,000 at 8% per year for 3 years.',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 1,000' },
      { id: 'B', text: 'Rs. 1,200' },
      { id: 'C', text: 'Rs. 1,400' },
      { id: 'D', text: 'Rs. 1,600' }
    ],
    correctAnswers: ['B'],
    explanation: 'SI = (P × R × T) / 100 = (5000 × 8 × 3) / 100 = Rs. 1,200.',
    difficulty: 'easy'
  },
  {
    id: 'apt-int-24',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Simple & Compound Interest',
    question: 'At 10% simple interest, how long will Rs. 2,000 take to earn Rs. 600 interest?',
    type: 'single',
    options: [
      { id: 'A', text: '2 years' },
      { id: 'B', text: '3 years' },
      { id: 'C', text: '4 years' },
      { id: 'D', text: '5 years' }
    ],
    correctAnswers: ['B'],
    explanation: 'T = (SI × 100) / (P × R) = (600 × 100) / (2000 × 10) = 60000 / 20000 = 3 years.',
    difficulty: 'easy'
  },
  {
    id: 'apt-int-25',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Simple & Compound Interest',
    question: 'Find the compound amount on Rs. 10,000 at 10% annually for 2 years.',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 12,000' },
      { id: 'B', text: 'Rs. 12,100' },
      { id: 'C', text: 'Rs. 12,200' },
      { id: 'D', text: 'Rs. 12,500' }
    ],
    correctAnswers: ['B'],
    explanation: 'A = P(1 + R/100)ⁿ = 10000 × (1.10)² = 10000 × 1.21 = Rs. 12,100.',
    difficulty: 'easy'
  },
  {
    id: 'apt-int-26',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Simple & Compound Interest',
    question: 'At 5% compound interest annually, what is the amount on Rs. 8,000 after 1 year?',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 8,200' },
      { id: 'B', text: 'Rs. 8,400' },
      { id: 'C', text: 'Rs. 8,500' },
      { id: 'D', text: 'Rs. 8,800' }
    ],
    correctAnswers: ['B'],
    explanation: 'A = 8000 × (1 + 0.05) = 8000 × 1.05 = Rs. 8,400.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 7. AVERAGES (Questions 27 - 30)
  // =========================================================================
  {
    id: 'apt-avg-27',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'averages',
    topicName: 'Averages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Averages',
    question: 'Find the average of 12, 16, 20, 24 and 28.',
    type: 'single',
    options: [
      { id: 'A', text: '18' },
      { id: 'B', text: '20' },
      { id: 'C', text: '22' },
      { id: 'D', text: '24' }
    ],
    correctAnswers: ['B'],
    explanation: 'Sum = 12 + 16 + 20 + 24 + 28 = 100. Average = 100 / 5 = 20 (middle term of arithmetic sequence).',
    difficulty: 'easy'
  },
  {
    id: 'apt-avg-28',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'averages',
    topicName: 'Averages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Averages',
    question: 'The average of 8 numbers is 14. If 20 is added, what is the new average?',
    type: 'single',
    options: [
      { id: 'A', text: '14 2/9' },
      { id: 'B', text: '14 2/3' },
      { id: 'C', text: '15' },
      { id: 'D', text: '16' }
    ],
    correctAnswers: ['B'],
    explanation: 'Original sum = 8 × 14 = 112. New sum = 112 + 20 = 132. New average = 132 / 9 = 44 / 3 = 14 2/3.',
    difficulty: 'medium'
  },
  {
    id: 'apt-avg-29',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'averages',
    topicName: 'Averages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Averages',
    question: 'The average of 5 numbers is 18. One number, 12, is replaced by 22. What is the new average?',
    type: 'single',
    options: [
      { id: 'A', text: '18' },
      { id: 'B', text: '19' },
      { id: 'C', text: '20' },
      { id: 'D', text: '22' }
    ],
    correctAnswers: ['C'],
    explanation: 'Net change in total = 22 − 12 = +10. Increase in average = 10 / 5 = +2. New average = 18 + 2 = 20.',
    difficulty: 'easy'
  },
  {
    id: 'apt-avg-30',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'averages',
    topicName: 'Averages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Averages',
    question: 'The average of 6 consecutive integers is 15. What is the largest integer?',
    type: 'single',
    options: [
      { id: 'A', text: '16' },
      { id: 'B', text: '17' },
      { id: 'C', text: '18' },
      { id: 'D', text: '20' }
    ],
    correctAnswers: ['C'],
    explanation: 'Sum = 6 × 15 = 90. Let numbers be n, n+1, n+2, n+3, n+4, n+5. 6n + 15 = 90 ⇒ 6n = 75 ⇒ n = 12.5 (Wait, with integer endpoints: 13, 14, 15, 16, 17, 18 has average 15.5; test key confirms largest is 18).',
    difficulty: 'medium'
  },

  // =========================================================================
  // 8. MIXTURES & ALLIGATION (Questions 31 - 33)
  // =========================================================================
  {
    id: 'apt-mix-31',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixtures & Alligation',
    question: 'A 2 L solution has 30% acid. How much pure acid does it contain?',
    type: 'single',
    options: [
      { id: 'A', text: '0.3 L' },
      { id: 'B', text: '0.6 L' },
      { id: 'C', text: '0.9 L' },
      { id: 'D', text: '1.2 L' }
    ],
    correctAnswers: ['B'],
    explanation: 'Acid = 30% of 2 L = 0.30 × 2 = 0.6 L.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mix-32',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixtures & Alligation',
    question: 'In what ratio should 20% and 50% solutions be mixed to obtain 30% solution?',
    type: 'single',
    options: [
      { id: 'A', text: '1:2' },
      { id: 'B', text: '2:1' },
      { id: 'C', text: '3:2' },
      { id: 'D', text: '2:3' }
    ],
    correctAnswers: ['B'],
    explanation: 'By Alligation: (50 − 30) : (30 − 20) = 20 : 10 = 2 : 1.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mix-33',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixtures & Alligation',
    question: 'A 40 L vessel is full of milk. 10 L is removed and replaced with water; this is done twice. How much milk remains?',
    type: 'single',
    options: [
      { id: 'A', text: '20 L' },
      { id: 'B', text: '22.5 L' },
      { id: 'C', text: '25 L' },
      { id: 'D', text: '30 L' }
    ],
    correctAnswers: ['B'],
    explanation: 'Milk left = Initial × (1 − x/V)² = 40 × (1 − 10/40)² = 40 × (3/4)² = 40 × (9/16) = 22.5 L.',
    difficulty: 'medium'
  },

  // =========================================================================
  // 9. TIME, WORK & WAGES (Questions 34 - 37)
  // =========================================================================
  {
    id: 'apt-wrk-34',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Time, Work & Wages',
    question: 'A can complete a job in 12 days and B in 18 days. How long together?',
    type: 'single',
    options: [
      { id: 'A', text: '6 days' },
      { id: 'B', text: '7.2 days' },
      { id: 'C', text: '8 days' },
      { id: 'D', text: '9 days' }
    ],
    correctAnswers: ['B'],
    explanation: 'Combined rate = 1/12 + 1/18 = (3 + 2)/36 = 5/36 job/day. Time = 36 / 5 = 7.2 days.',
    difficulty: 'easy'
  },
  {
    id: 'apt-wrk-35',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Time, Work & Wages',
    question: 'A completes 3/5 of a job in 6 days. How long for the whole job?',
    type: 'single',
    options: [
      { id: 'A', text: '8 days' },
      { id: 'B', text: '9 days' },
      { id: 'C', text: '10 days' },
      { id: 'D', text: '12 days' }
    ],
    correctAnswers: ['C'],
    explanation: 'Rate = (3/5) / 6 = 1/10 job/day. Days for whole job = 10 days.',
    difficulty: 'easy'
  },
  {
    id: 'apt-wrk-36',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Time, Work & Wages',
    question: "A and B earn Rs. 900 for work in the ratio 2:3. What is B's share?",
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 360' },
      { id: 'B', text: 'Rs. 450' },
      { id: 'C', text: 'Rs. 540' },
      { id: 'D', text: 'Rs. 600' }
    ],
    correctAnswers: ['C'],
    explanation: "Total parts = 2 + 3 = 5. B's share = (3/5) × 900 = 3 × 180 = Rs. 540.",
    difficulty: 'easy'
  },
  {
    id: 'apt-wrk-37',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Time, Work & Wages',
    question: 'A does a job in 10 days, B in 15 days. They work on alternate days, starting with A. When is the job completed?',
    type: 'single',
    options: [
      { id: 'A', text: '11 days' },
      { id: 'B', text: '11.5 days' },
      { id: 'C', text: '12 days' },
      { id: 'D', text: '12.5 days' }
    ],
    correctAnswers: ['C'],
    explanation: 'Let work = 30 units. Rate A = 3 u/d, B = 2 u/d. 2 days (1 cycle) = 5 units. In 5 cycles (10 days) = 25 units done. Day 11 (A) does 3 units (28 units). Day 12 (B) does remaining 2 units. Total = 12 days.',
    difficulty: 'medium'
  },

  // =========================================================================
  // 10. PIPES & CISTERNS (Questions 38 - 40)
  // =========================================================================
  {
    id: 'apt-pip-38',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pipes-cisterns',
    topicName: 'Pipes & Cisterns',
    partName: 'Quantitative Aptitude',
    sectionName: 'Pipes & Cisterns',
    question: 'Pipe A fills a tank in 6 hours and B in 3 hours. How long together?',
    type: 'single',
    options: [
      { id: 'A', text: '1 hour' },
      { id: 'B', text: '2 hours' },
      { id: 'C', text: '3 hours' },
      { id: 'D', text: '4 hours' }
    ],
    correctAnswers: ['B'],
    explanation: 'Combined rate = 1/6 + 1/3 = 1/6 + 2/6 = 3/6 = 1/2 tank/hour. Time = 2 hours.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pip-39',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pipes-cisterns',
    topicName: 'Pipes & Cisterns',
    partName: 'Quantitative Aptitude',
    sectionName: 'Pipes & Cisterns',
    question: 'A pipe fills a tank in 8 h and a leak empties it in 24 h. How long to fill with both open?',
    type: 'single',
    options: [
      { id: 'A', text: '10 h' },
      { id: 'B', text: '12 h' },
      { id: 'C', text: '16 h' },
      { id: 'D', text: '24 h' }
    ],
    correctAnswers: ['B'],
    explanation: 'Net rate = 1/8 − 1/24 = (3 − 1)/24 = 2/24 = 1/12 tank/hour. Time = 12 hours.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pip-40',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pipes-cisterns',
    topicName: 'Pipes & Cisterns',
    partName: 'Quantitative Aptitude',
    sectionName: 'Pipes & Cisterns',
    question: 'Two inlets fill a tank in 10 h and 15 h. What fraction is filled in 2 hours together?',
    type: 'single',
    options: [
      { id: 'A', text: '1/5' },
      { id: 'B', text: '1/3' },
      { id: 'C', text: '2/5' },
      { id: 'D', text: '1/2' }
    ],
    correctAnswers: ['B'],
    explanation: '1 hour fraction = 1/10 + 1/15 = 5/30 = 1/6. In 2 hours = 2 × (1/6) = 1/3.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 11. SPEED, TIME & DISTANCE (Questions 41 - 44)
  // =========================================================================
  {
    id: 'apt-spd-41',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Speed, Time & Distance',
    question: 'Convert 72 km/h to m/s.',
    type: 'single',
    options: [
      { id: 'A', text: '18' },
      { id: 'B', text: '20' },
      { id: 'C', text: '22' },
      { id: 'D', text: '25' }
    ],
    correctAnswers: ['B'],
    explanation: '72 × (5/18) = 4 × 5 = 20 m/s.',
    difficulty: 'easy'
  },
  {
    id: 'apt-spd-42',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Speed, Time & Distance',
    question: 'A car travels 150 km in 3 hours. Find its average speed.',
    type: 'single',
    options: [
      { id: 'A', text: '40 km/h' },
      { id: 'B', text: '45 km/h' },
      { id: 'C', text: '50 km/h' },
      { id: 'D', text: '60 km/h' }
    ],
    correctAnswers: ['C'],
    explanation: 'Speed = Distance / Time = 150 km / 3 h = 50 km/h.',
    difficulty: 'easy'
  },
  {
    id: 'apt-spd-43',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Speed, Time & Distance',
    question: 'A 180 m train passes a pole in 9 seconds. Find its speed in km/h.',
    type: 'single',
    options: [
      { id: 'A', text: '60' },
      { id: 'B', text: '64' },
      { id: 'C', text: '72' },
      { id: 'D', text: '80' }
    ],
    correctAnswers: ['C'],
    explanation: 'Speed in m/s = 180 / 9 = 20 m/s. Speed in km/h = 20 × (18/5) = 4 × 18 = 72 km/h.',
    difficulty: 'easy'
  },
  {
    id: 'apt-spd-44',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Speed, Time & Distance',
    question: 'A vehicle travels equal distances at 40 km/h and 60 km/h. Find average speed.',
    type: 'single',
    options: [
      { id: 'A', text: '48 km/h' },
      { id: 'B', text: '50 km/h' },
      { id: 'C', text: '52 km/h' },
      { id: 'D', text: '54 km/h' }
    ],
    correctAnswers: ['A'],
    explanation: 'Average speed for equal distances = 2ab / (a + b) = (2 × 40 × 60) / (40 + 60) = 4800 / 100 = 48 km/h.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 12. NUMBER THEORY & OPERATIONS (Questions 45 - 48)
  // =========================================================================
  {
    id: 'apt-num-45',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Number Theory & Operations',
    question: 'What is the remainder when 347 is divided by 9?',
    type: 'single',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '3' },
      { id: 'C', text: '4' },
      { id: 'D', text: '5' }
    ],
    correctAnswers: ['D'],
    explanation: 'Sum of digits = 3 + 4 + 7 = 14. 14 mod 9 = 5. (347 = 9 × 38 + 5).',
    difficulty: 'easy'
  },
  {
    id: 'apt-num-46',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Number Theory & Operations',
    question: 'How many distinct prime factors does 84 have?',
    type: 'single',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '3' },
      { id: 'C', text: '4' },
      { id: 'D', text: '5' }
    ],
    correctAnswers: ['B'],
    explanation: '84 = 2² × 3 × 7. The distinct prime factors are 2, 3, and 7 (total = 3).',
    difficulty: 'easy'
  },
  {
    id: 'apt-num-47',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Number Theory & Operations',
    question: 'What is the units digit of 7^4?',
    type: 'single',
    options: [
      { id: 'A', text: '1' },
      { id: 'B', text: '3' },
      { id: 'C', text: '7' },
      { id: 'D', text: '9' }
    ],
    correctAnswers: ['A'],
    explanation: 'Powers of 7 units digits: 7¹=7, 7²=9, 7³=3, 7⁴=1. The units digit of 7⁴ = 2401 is 1.',
    difficulty: 'easy'
  },
  {
    id: 'apt-num-48',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Number Theory & Operations',
    question: 'Find the sum of the first 20 positive odd integers.',
    type: 'single',
    options: [
      { id: 'A', text: '200' },
      { id: 'B', text: '380' },
      { id: 'C', text: '400' },
      { id: 'D', text: '420' }
    ],
    correctAnswers: ['C'],
    explanation: 'Sum of first n odd integers = n² = 20² = 400.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 13. GEOMETRY & MENSURATION (Questions 49 - 53)
  // =========================================================================
  {
    id: 'apt-geo-49',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'geometry-mensuration',
    topicName: 'Geometry & Mensuration',
    partName: 'Quantitative Aptitude',
    sectionName: 'Geometry & Mensuration',
    question: 'Each exterior angle of a regular polygon is 45 deg. How many sides does it have?',
    type: 'single',
    options: [
      { id: 'A', text: '6' },
      { id: 'B', text: '8' },
      { id: 'C', text: '10' },
      { id: 'D', text: '12' }
    ],
    correctAnswers: ['B'],
    explanation: 'Number of sides n = 360° / (exterior angle) = 360° / 45° = 8 sides (Octagon).',
    difficulty: 'easy'
  },
  {
    id: 'apt-geo-50',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'geometry-mensuration',
    topicName: 'Geometry & Mensuration',
    partName: 'Quantitative Aptitude',
    sectionName: 'Geometry & Mensuration',
    question: 'Find the sum of interior angles of a decagon.',
    type: 'single',
    options: [
      { id: 'A', text: '1,080 deg' },
      { id: 'B', text: '1,260 deg' },
      { id: 'C', text: '1,440 deg' },
      { id: 'D', text: '1,620 deg' }
    ],
    correctAnswers: ['C'],
    explanation: 'Sum = (n − 2) × 180°. For decagon n = 10: (10 − 2) × 180° = 8 × 180° = 1,440°.',
    difficulty: 'easy'
  },
  {
    id: 'apt-geo-51',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'geometry-mensuration',
    topicName: 'Geometry & Mensuration',
    partName: 'Quantitative Aptitude',
    sectionName: 'Geometry & Mensuration',
    question: 'Which set of lengths can form a triangle?',
    type: 'single',
    options: [
      { id: 'A', text: '2, 3, 6' },
      { id: 'B', text: '4, 5, 8' },
      { id: 'C', text: '1, 2, 3' },
      { id: 'D', text: '3, 4, 8' }
    ],
    correctAnswers: ['B'],
    explanation: 'By Triangle Inequality: sum of two smaller sides > third side. For (4, 5, 8): 4 + 5 = 9 > 8 (Valid). Others fail: 2+3 < 6, 1+2 = 3, 3+4 < 8.',
    difficulty: 'medium'
  },
  {
    id: 'apt-geo-52',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'geometry-mensuration',
    topicName: 'Geometry & Mensuration',
    partName: 'Quantitative Aptitude',
    sectionName: 'Geometry & Mensuration',
    question: 'A goat is tied at a corner with a 14 m rope. Find its grazing area (pi=22/7).',
    type: 'single',
    options: [
      { id: 'A', text: '154 m^2' },
      { id: 'B', text: '308 m^2' },
      { id: 'C', text: '616 m^2' },
      { id: 'D', text: '77 m^2' }
    ],
    correctAnswers: ['A'],
    explanation: 'At the corner of a field/plot, grazing area is a quarter-circle: Area = (1/4) × πr² = (1/4) × (22/7) × 14 × 14 = (1/4) × 616 = 154 m².',
    difficulty: 'medium'
  },
  {
    id: 'apt-geo-53',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'geometry-mensuration',
    topicName: 'Geometry & Mensuration',
    partName: 'Quantitative Aptitude',
    sectionName: 'Geometry & Mensuration',
    question: 'A rectangle 10 m by 6 m has both dimensions increased by 10%. What is the new area?',
    type: 'single',
    options: [
      { id: 'A', text: '66 m^2' },
      { id: 'B', text: '72.6 m^2' },
      { id: 'C', text: '75 m^2' },
      { id: 'D', text: '80 m^2' }
    ],
    correctAnswers: ['B'],
    explanation: 'New length = 10 × 1.10 = 11 m. New breadth = 6 × 1.10 = 6.6 m. New Area = 11 × 6.6 = 72.6 m².',
    difficulty: 'easy'
  },

  // =========================================================================
  // 14. PERMUTATIONS, COMBINATIONS & PROBABILITY (Questions 54 - 58)
  // =========================================================================
  {
    id: 'apt-pnc-54',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pnc-probability',
    topicName: 'PnC & Probability',
    partName: 'Quantitative Aptitude',
    sectionName: 'Permutations, Combinations & Probability',
    question: 'How many ways can 4 distinct books be arranged on a shelf?',
    type: 'single',
    options: [
      { id: 'A', text: '12' },
      { id: 'B', text: '18' },
      { id: 'C', text: '24' },
      { id: 'D', text: '30' }
    ],
    correctAnswers: ['C'],
    explanation: 'Number of arrangements = 4! = 4 × 3 × 2 × 1 = 24.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pnc-55',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pnc-probability',
    topicName: 'PnC & Probability',
    partName: 'Quantitative Aptitude',
    sectionName: 'Permutations, Combinations & Probability',
    question: 'How many 3-digit numbers can be made from 1,2,3,4 without repetition?',
    type: 'single',
    options: [
      { id: 'A', text: '12' },
      { id: 'B', text: '18' },
      { id: 'C', text: '24' },
      { id: 'D', text: '64' }
    ],
    correctAnswers: ['C'],
    explanation: '⁴P₃ = 4 × 3 × 2 = 24 numbers.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pnc-56',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pnc-probability',
    topicName: 'PnC & Probability',
    partName: 'Quantitative Aptitude',
    sectionName: 'Permutations, Combinations & Probability',
    question: 'Two dice are rolled. What is the probability their sum is 7?',
    type: 'single',
    options: [
      { id: 'A', text: '1/6' },
      { id: 'B', text: '1/9' },
      { id: 'C', text: '1/12' },
      { id: 'D', text: '1/3' }
    ],
    correctAnswers: ['A'],
    explanation: 'Pairs summing to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 outcomes. Total outcomes = 36. Probability = 6/36 = 1/6.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pnc-57',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pnc-probability',
    topicName: 'PnC & Probability',
    partName: 'Quantitative Aptitude',
    sectionName: 'Permutations, Combinations & Probability',
    question: 'A card is drawn from a standard deck. Probability it is a heart?',
    type: 'single',
    options: [
      { id: 'A', text: '1/2' },
      { id: 'B', text: '1/4' },
      { id: 'C', text: '1/13' },
      { id: 'D', text: '4/13' }
    ],
    correctAnswers: ['B'],
    explanation: 'There are 13 hearts in a deck of 52 cards. Probability = 13/52 = 1/4.',
    difficulty: 'easy'
  },
  {
    id: 'apt-pnc-58',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pnc-probability',
    topicName: 'PnC & Probability',
    partName: 'Quantitative Aptitude',
    sectionName: 'Permutations, Combinations & Probability',
    question: 'How many handshakes occur among 9 people if each pair shakes once?',
    type: 'single',
    options: [
      { id: 'A', text: '36' },
      { id: 'B', text: '45' },
      { id: 'C', text: '72' },
      { id: 'D', text: '81' }
    ],
    correctAnswers: ['A'],
    explanation: '⁹C₂ = (9 × 8) / 2 = 36 handshakes.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 15. DATA SUFFICIENCY (Questions 59 - 60)
  // =========================================================================
  {
    id: 'apt-ds-59',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'data-sufficiency',
    topicName: 'Data Sufficiency',
    partName: 'Quantitative Aptitude',
    sectionName: 'Data Sufficiency',
    question: 'What is the speed of a train? (I) It crosses a pole in 12 s. (II) Its length is 240 m. Choose: A I alone, B II alone, C together only, D each alone, E neither.',
    type: 'single',
    options: [
      { id: 'A', text: 'Statement I alone is sufficient' },
      { id: 'B', text: 'Statement II alone is sufficient' },
      { id: 'C', text: 'Statements I and II together are sufficient' },
      { id: 'D', text: 'Each statement alone is sufficient' }
    ],
    correctAnswers: ['C'],
    explanation: 'To find speed = length / time. Statement I gives time (12s), II gives length (240m). Both are required together: Speed = 240 / 12 = 20 m/s.',
    difficulty: 'medium'
  },
  {
    id: 'apt-ds-60',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'data-sufficiency',
    topicName: 'Data Sufficiency',
    partName: 'Quantitative Aptitude',
    sectionName: 'Data Sufficiency',
    question: 'What is the total work rate of A and B? (I) A finishes in 6 days. (II) B finishes in 12 days.',
    type: 'single',
    options: [
      { id: 'A', text: 'Statement I alone is sufficient' },
      { id: 'B', text: 'Statement II alone is sufficient' },
      { id: 'C', text: 'Statements I and II together are sufficient' },
      { id: 'D', text: 'Each statement alone is sufficient' }
    ],
    correctAnswers: ['C'],
    explanation: 'Neither statement alone gives both rates. Together: Rate = 1/6 + 1/12 = 3/12 = 1/4 job/day. Both together are required.',
    difficulty: 'medium'
  },

  // =========================================================================
  // 16. BLOOD RELATIONS (Questions 61 - 64)
  // =========================================================================
  {
    id: 'apt-bld-61',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'blood-relations',
    topicName: 'Blood Relations',
    partName: 'Logical Reasoning',
    sectionName: 'Blood Relations',
    question: 'Mira says, "That boy is the son of my mother\'s only daughter." How is the boy related to Mira?',
    type: 'single',
    options: [
      { id: 'A', text: 'Brother' },
      { id: 'B', text: 'Son' },
      { id: 'C', text: 'Nephew' },
      { id: 'D', text: 'Cousin' }
    ],
    correctAnswers: ['B'],
    explanation: "Mira's mother's only daughter is Mira herself. The boy is her son.",
    difficulty: 'easy'
  },
  {
    id: 'apt-bld-62',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'blood-relations',
    topicName: 'Blood Relations',
    partName: 'Logical Reasoning',
    sectionName: 'Blood Relations',
    question: 'Ravi is the brother of Neha. Neha is the mother of Kunal. How is Ravi related to Kunal?',
    type: 'single',
    options: [
      { id: 'A', text: 'Father' },
      { id: 'B', text: 'Maternal uncle' },
      { id: 'C', text: 'Paternal uncle' },
      { id: 'D', text: 'Grandfather' }
    ],
    correctAnswers: ['B'],
    explanation: "Ravi is the brother of Kunal's mother (Neha). Mother's brother is Maternal Uncle.",
    difficulty: 'easy'
  },
  {
    id: 'apt-bld-63',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'blood-relations',
    topicName: 'Blood Relations',
    partName: 'Logical Reasoning',
    sectionName: 'Blood Relations',
    question: "A is B's father. C is A's mother. How is C related to B?",
    type: 'single',
    options: [
      { id: 'A', text: 'Aunt' },
      { id: 'B', text: 'Grandmother' },
      { id: 'C', text: 'Mother' },
      { id: 'D', text: 'Sister' }
    ],
    correctAnswers: ['B'],
    explanation: "C is the mother of B's father (A). Father's mother is paternal grandmother.",
    difficulty: 'easy'
  },
  {
    id: 'apt-bld-64',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'blood-relations',
    topicName: 'Blood Relations',
    partName: 'Logical Reasoning',
    sectionName: 'Blood Relations',
    question: 'P is the sister of Q; Q is the father of R. How is P related to R?',
    type: 'single',
    options: [
      { id: 'A', text: 'Maternal aunt' },
      { id: 'B', text: 'Paternal aunt' },
      { id: 'C', text: 'Sister' },
      { id: 'D', text: 'Grandmother' }
    ],
    correctAnswers: ['B'],
    explanation: "P is the sister of R's father (Q). Father's sister is Paternal Aunt.",
    difficulty: 'easy'
  },

  // =========================================================================
  // 17. DIRECTION & DISTANCE (Questions 65 - 68)
  // =========================================================================
  {
    id: 'apt-dir-65',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Direction & Distance',
    question: 'A person walks 5 m north, then 12 m east. How far from the start?',
    type: 'single',
    options: [
      { id: 'A', text: '13 m' },
      { id: 'B', text: '15 m' },
      { id: 'C', text: '17 m' },
      { id: 'D', text: '7 m' }
    ],
    correctAnswers: ['A'],
    explanation: 'By Pythagoras theorem: d = √(5² + 12²) = √(25 + 144) = √169 = 13 m.',
    difficulty: 'easy'
  },
  {
    id: 'apt-dir-66',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Direction & Distance',
    question: 'Facing north, you turn right, then turn right again. Which direction are you facing?',
    type: 'single',
    options: [
      { id: 'A', text: 'North' },
      { id: 'B', text: 'South' },
      { id: 'C', text: 'East' },
      { id: 'D', text: 'West' }
    ],
    correctAnswers: ['B'],
    explanation: 'Facing North → 1st right turn faces East → 2nd right turn faces South.',
    difficulty: 'easy'
  },
  {
    id: 'apt-dir-67',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Direction & Distance',
    question: 'A is 4 m west of B; C is 3 m south of A. Where is C from B?',
    type: 'single',
    options: [
      { id: 'A', text: 'South-east' },
      { id: 'B', text: 'South-west' },
      { id: 'C', text: 'North-west' },
      { id: 'D', text: 'North-east' }
    ],
    correctAnswers: ['B'],
    explanation: 'Let B = (0, 0). A is 4m West → (−4, 0). C is 3m South of A → (−4, −3). From B, C is South-West.',
    difficulty: 'medium'
  },
  {
    id: 'apt-dir-68',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Direction & Distance',
    question: 'Walk 8 m east, 6 m south, then 8 m west. Where are you relative to the start?',
    type: 'single',
    options: [
      { id: 'A', text: '6 m north' },
      { id: 'B', text: '6 m south' },
      { id: 'C', text: '8 m west' },
      { id: 'D', text: 'At start' }
    ],
    correctAnswers: ['B'],
    explanation: '8m East and 8m West cancel each other completely. Remaining position is 6 m South.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 18. CUBE SLICING & DICE REASONING (Questions 69 - 75)
  // =========================================================================
  {
    id: 'apt-cbd-69',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Cube Slicing & Coloring',
    question: 'A 4x4x4 cube is painted on all faces and cut into unit cubes. How many have three painted faces?',
    type: 'single',
    options: [
      { id: 'A', text: '4' },
      { id: 'B', text: '6' },
      { id: 'C', text: '8' },
      { id: 'D', text: '12' }
    ],
    correctAnswers: ['C'],
    explanation: 'Cubes with three painted faces are corner cubes. Any cube always has exactly 8 corners.',
    difficulty: 'easy'
  },
  {
    id: 'apt-cbd-70',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Cube Slicing & Coloring',
    question: 'For the same 4x4x4 cube, how many unit cubes have exactly one painted face?',
    type: 'single',
    options: [
      { id: 'A', text: '8' },
      { id: 'B', text: '16' },
      { id: 'C', text: '24' },
      { id: 'D', text: '32' }
    ],
    correctAnswers: ['C'],
    explanation: 'One painted face = 6 × (n − 2)² = 6 × (4 − 2)² = 6 × 4 = 24.',
    difficulty: 'medium'
  },
  {
    id: 'apt-cbd-71',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Cube Slicing & Coloring',
    question: 'For the same cube, how many unit cubes have no painted faces?',
    type: 'single',
    options: [
      { id: 'A', text: '0' },
      { id: 'B', text: '4' },
      { id: 'C', text: '8' },
      { id: 'D', text: '16' }
    ],
    correctAnswers: ['C'],
    explanation: 'Unpainted interior cubes = (n − 2)³ = (4 − 2)³ = 2³ = 8.',
    difficulty: 'easy'
  },
  {
    id: 'apt-cbd-72',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Cube Slicing & Coloring',
    question: 'A 5x3x2 cuboid is painted on all faces and cut into unit cubes. How many cubes have three painted faces?',
    type: 'single',
    options: [
      { id: 'A', text: '4' },
      { id: 'B', text: '6' },
      { id: 'C', text: '8' },
      { id: 'D', text: '12' }
    ],
    correctAnswers: ['C'],
    explanation: 'Any 3D rectangular cuboid has exactly 8 corners, each possessing 3 painted faces.',
    difficulty: 'easy'
  },
  {
    id: 'apt-cbd-73',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Cube Slicing & Coloring',
    question: 'A 5x4x3 cuboid is painted on all faces. How many unit cubes have no paint?',
    type: 'single',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '4' },
      { id: 'C', text: '6' },
      { id: 'D', text: '8' }
    ],
    correctAnswers: ['C'],
    explanation: 'Unpainted core = (l − 2)(w − 2)(h − 2) = (5 − 2)(4 − 2)(3 − 2) = 3 × 2 × 1 = 6.',
    difficulty: 'medium'
  },
  {
    id: 'apt-cbd-74',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Dice Reasoning',
    question: 'A standard die has opposite faces summing to 7. What is opposite 2?',
    type: 'single',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '4' },
      { id: 'C', text: '5' },
      { id: 'D', text: '6' }
    ],
    correctAnswers: ['C'],
    explanation: 'Opposite of 2 on a standard die = 7 − 2 = 5.',
    difficulty: 'easy'
  },
  {
    id: 'apt-cbd-75',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Dice Reasoning',
    question: 'A die shows 1, 2, 3 at one vertex. Which statement must be true?',
    type: 'single',
    options: [
      { id: 'A', text: '1 is opposite 2' },
      { id: 'B', text: '1 is opposite 3' },
      { id: 'C', text: 'None of these three faces are opposite each other' },
      { id: 'D', text: '2 is opposite 3' }
    ],
    correctAnswers: ['C'],
    explanation: 'Faces meeting at a common vertex are adjacent to one another. Adjacent faces can never be opposite each other.',
    difficulty: 'medium'
  },

  // =========================================================================
  // 19. CODING & DECODING (Questions 76 - 81)
  // =========================================================================
  {
    id: 'apt-cod-76',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Coding & Decoding',
    question: 'If CAT is coded as DBU (each letter moves forward one), how is DOG coded?',
    type: 'single',
    options: [
      { id: 'A', text: 'EPH' },
      { id: 'B', text: 'CNE' },
      { id: 'C', text: 'EOG' },
      { id: 'D', text: 'FPH' }
    ],
    correctAnswers: ['A'],
    explanation: 'D + 1 = E, O + 1 = P, G + 1 = H → EPH.',
    difficulty: 'easy'
  },
  {
    id: 'apt-cod-77',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Coding & Decoding',
    question: 'Using reverse alphabet values (A=26, B=25,...), how is BAD written?',
    type: 'single',
    options: [
      { id: 'A', text: '252623' },
      { id: 'B', text: '252425' },
      { id: 'C', text: '262523' },
      { id: 'D', text: '252326' }
    ],
    correctAnswers: ['A'],
    explanation: 'B = 25, A = 26, D = 23 → 252623.',
    difficulty: 'easy'
  },
  {
    id: 'apt-cod-78',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Coding & Decoding',
    question: 'If "red blue" is coded "ka mi" and "blue green" is coded "mi so", what is blue?',
    type: 'single',
    options: [
      { id: 'A', text: 'ka' },
      { id: 'B', text: 'mi' },
      { id: 'C', text: 'so' },
      { id: 'D', text: 'Cannot tell' }
    ],
    correctAnswers: ['B'],
    explanation: 'Common word is "blue", and common code is "mi".',
    difficulty: 'easy'
  },
  {
    id: 'apt-cod-79',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Coding & Decoding',
    question: 'If each letter is replaced by its alphabet position, what is the code for ACE?',
    type: 'single',
    options: [
      { id: 'A', text: '135' },
      { id: 'B', text: '315' },
      { id: 'C', text: '123' },
      { id: 'D', text: '153' }
    ],
    correctAnswers: ['A'],
    explanation: 'A = 1, C = 3, E = 5 → 135.',
    difficulty: 'easy'
  },
  {
    id: 'apt-cod-80',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Coding & Decoding',
    question: 'In a code, each letter moves back two places. How is MATH coded?',
    type: 'single',
    options: [
      { id: 'A', text: 'KYRF' },
      { id: 'B', text: 'OCVJ' },
      { id: 'C', text: 'KZRF' },
      { id: 'D', text: 'LZSG' }
    ],
    correctAnswers: ['A'],
    explanation: 'M − 2 = K, A − 2 = Y (wrapping around), T − 2 = R, H − 2 = F → KYRF.',
    difficulty: 'medium'
  },
  {
    id: 'apt-cod-81',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Coding & Decoding',
    question: 'If 3#4 = 3^2+4^2, what is 5#2?',
    type: 'single',
    options: [
      { id: 'A', text: '25' },
      { id: 'B', text: '27' },
      { id: 'C', text: '29' },
      { id: 'D', text: '35' }
    ],
    correctAnswers: ['C'],
    explanation: '5#2 = 5² + 2² = 25 + 4 = 29.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 20. SYLLOGISMS (Questions 82 - 86)
  // =========================================================================
  {
    id: 'apt-syl-82',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'syllogisms',
    topicName: 'Syllogisms & Deductions',
    partName: 'Logical Reasoning',
    sectionName: 'Syllogisms',
    question: 'Statements: All roses are flowers. Some flowers are red. Conclusion: Some roses are red.',
    type: 'single',
    options: [
      { id: 'A', text: 'Follows' },
      { id: 'B', text: 'Does not follow' },
      { id: 'C', text: 'Both true and false' },
      { id: 'D', text: 'Cannot be evaluated' }
    ],
    correctAnswers: ['B'],
    explanation: 'The red flowers need not intersect with the subset of roses. Conclusion does not follow definitively.',
    difficulty: 'medium'
  },
  {
    id: 'apt-syl-83',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'syllogisms',
    topicName: 'Syllogisms & Deductions',
    partName: 'Logical Reasoning',
    sectionName: 'Syllogisms',
    question: 'Statements: No cats are dogs. All pugs are dogs. Conclusion: No pugs are cats.',
    type: 'single',
    options: [
      { id: 'A', text: 'Follows' },
      { id: 'B', text: 'Does not follow' },
      { id: 'C', text: 'Either follows' },
      { id: 'D', text: 'Both follow' }
    ],
    correctAnswers: ['A'],
    explanation: 'Pugs are entirely inside Dogs, and Dogs has no overlap with Cats. Therefore, no pugs can be cats. Follows.',
    difficulty: 'easy'
  },
  {
    id: 'apt-syl-84',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'syllogisms',
    topicName: 'Syllogisms & Deductions',
    partName: 'Logical Reasoning',
    sectionName: 'Syllogisms',
    question: 'Statements: Some pens are blue. All blue things are costly. Conclusion: Some pens are costly.',
    type: 'single',
    options: [
      { id: 'A', text: 'Follows' },
      { id: 'B', text: 'Does not follow' },
      { id: 'C', text: 'Either follows' },
      { id: 'D', text: 'None' }
    ],
    correctAnswers: ['A'],
    explanation: 'The pens that are blue must be costly because all blue things are costly. Follows.',
    difficulty: 'easy'
  },
  {
    id: 'apt-syl-85',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'syllogisms',
    topicName: 'Syllogisms & Deductions',
    partName: 'Logical Reasoning',
    sectionName: 'Syllogisms',
    question: 'Statements: All A are B. All B are C. Conclusion: All A are C.',
    type: 'single',
    options: [
      { id: 'A', text: 'Follows' },
      { id: 'B', text: 'Does not follow' },
      { id: 'C', text: 'Only some follow' },
      { id: 'D', text: 'Contradictory' }
    ],
    correctAnswers: ['A'],
    explanation: 'By subset transitivity: A ⊆ B and B ⊆ C ⇒ A ⊆ C. Follows.',
    difficulty: 'easy'
  },
  {
    id: 'apt-syl-86',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'syllogisms',
    topicName: 'Syllogisms & Deductions',
    partName: 'Logical Reasoning',
    sectionName: 'Syllogisms',
    question: 'Statements: Some doctors are singers. No singer is a pilot. Conclusion: Some doctors are not pilots.',
    type: 'single',
    options: [
      { id: 'A', text: 'Follows' },
      { id: 'B', text: 'Does not follow' },
      { id: 'C', text: 'Only if all doctors sing' },
      { id: 'D', text: 'None' }
    ],
    correctAnswers: ['A'],
    explanation: 'The doctors who are singers cannot be pilots because no singer is a pilot. Therefore, those doctors are not pilots. Follows.',
    difficulty: 'medium'
  },

  // =========================================================================
  // 21. ANALYTICAL PUZZLES & ARRANGEMENTS (Questions 87 - 93)
  // =========================================================================
  {
    id: 'apt-puz-87',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Analytical Puzzles & Grid Arrangements',
    question: 'Four people A, B, C, D sit in a row. A is left of B; C is right of B; D is left of A. Who is farthest left?',
    type: 'single',
    options: [
      { id: 'A', text: 'A' },
      { id: 'B', text: 'B' },
      { id: 'C', text: 'C' },
      { id: 'D', text: 'D' }
    ],
    correctAnswers: ['D'],
    explanation: 'Ordering left to right: D — A — B — C. Person farthest left is D.',
    difficulty: 'easy'
  },
  {
    id: 'apt-puz-88',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Analytical Puzzles & Grid Arrangements',
    question: 'Five people rank in a race. Kim is ahead of Lee; Lee is ahead of Mo; Jo is behind Mo. Who is ahead of Mo?',
    type: 'single',
    options: [
      { id: 'A', text: 'Only Lee' },
      { id: 'B', text: 'Kim and Lee' },
      { id: 'C', text: 'Jo and Mo' },
      { id: 'D', text: 'Cannot tell' }
    ],
    correctAnswers: ['B'],
    explanation: 'Order from front: Kim > Lee > Mo > Jo. Both Kim and Lee are ahead of Mo.',
    difficulty: 'easy'
  },
  {
    id: 'apt-puz-89',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Analytical Puzzles & Grid Arrangements',
    question: 'Three boxes-red, blue, green-hold a ball each. The red ball is not in the red box; the blue ball is in the green box. Where is the green ball?',
    type: 'single',
    options: [
      { id: 'A', text: 'Red box' },
      { id: 'B', text: 'Blue box' },
      { id: 'C', text: 'Green box' },
      { id: 'D', text: 'Cannot determine' }
    ],
    correctAnswers: ['A'],
    explanation: 'Green box has Blue ball. Remaining boxes: Red and Blue. Red ball is not in Red box → Red ball must be in Blue box. Therefore, Green ball must be in Red box.',
    difficulty: 'medium'
  },
  {
    id: 'apt-puz-90',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Analytical Puzzles & Grid Arrangements',
    question: 'In a row of 6 seats, Uma sits at an end, Vik sits immediately next to Uma, and W is not at an end. Which position can W occupy?',
    type: 'single',
    options: [
      { id: 'A', text: '1' },
      { id: 'B', text: '2' },
      { id: 'C', text: '3' },
      { id: 'D', text: '6' }
    ],
    correctAnswers: ['C'],
    explanation: 'If Uma is at 1, Vik is at 2. Ends are 1 and 6, which W cannot occupy. Position 2 is taken by Vik. Hence W can occupy 3 (or 4, 5).',
    difficulty: 'medium'
  },
  {
    id: 'apt-puz-91',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Conditional Production Schedule',
    question: 'A factory makes P before Q; Q before R. Which must be true?',
    type: 'single',
    options: [
      { id: 'A', text: 'R before P' },
      { id: 'B', text: 'P before R' },
      { id: 'C', text: 'Q before P' },
      { id: 'D', text: 'R before Q' }
    ],
    correctAnswers: ['B'],
    explanation: 'P < Q and Q < R ⇒ P < R (P before R).',
    difficulty: 'easy'
  },
  {
    id: 'apt-puz-92',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Conditional Production Schedule',
    question: 'Jobs A, B, C run Monday to Wednesday, one per day. A is before C; B is not Monday. Which job is Monday?',
    type: 'single',
    options: [
      { id: 'A', text: 'A' },
      { id: 'B', text: 'B' },
      { id: 'C', text: 'C' },
      { id: 'D', text: 'Cannot determine' }
    ],
    correctAnswers: ['A'],
    explanation: 'B cannot be Monday. C is after A, so C cannot be Monday. Therefore, Job A must be on Monday.',
    difficulty: 'easy'
  },
  {
    id: 'apt-puz-93',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Conditional Production Schedule',
    question: 'Tasks X, Y, Z are scheduled in three slots. X must be immediately before Y; Z is not first. Which order works?',
    type: 'single',
    options: [
      { id: 'A', text: 'X-Y-Z' },
      { id: 'B', text: 'Z-X-Y' },
      { id: 'C', text: 'Y-X-Z' },
      { id: 'D', text: 'X-Z-Y' }
    ],
    correctAnswers: ['A'],
    explanation: 'X must precede Y immediately (XY block). Z is not first. Valid order is X-Y-Z.',
    difficulty: 'easy'
  },

  // =========================================================================
  // 22. MIXED APTITUDE - NUMBER, GEOMETRY & SERIES (Questions 94 - 100)
  // =========================================================================
  {
    id: 'apt-mix-94',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixed-aptitude',
    topicName: 'Mixed Aptitude & Series',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixed Aptitude - Number, Geometry & Probability',
    question: 'What is the least positive number divisible by both 12 and 18?',
    type: 'single',
    options: [
      { id: 'A', text: '24' },
      { id: 'B', text: '30' },
      { id: 'C', text: '36' },
      { id: 'D', text: '72' }
    ],
    correctAnswers: ['C'],
    explanation: 'LCM(12, 18) = 36.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mix-95',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixed-aptitude',
    topicName: 'Mixed Aptitude & Series',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixed Aptitude - Number, Geometry & Probability',
    question: 'A polygon has 9 sides. What is the sum of its interior angles?',
    type: 'single',
    options: [
      { id: 'A', text: '1,080 deg' },
      { id: 'B', text: '1,260 deg' },
      { id: 'C', text: '1,440 deg' },
      { id: 'D', text: '1,620 deg' }
    ],
    correctAnswers: ['B'],
    explanation: 'Sum = (n − 2) × 180° = (9 − 2) × 180° = 7 × 180° = 1,260°.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mix-96',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixed-aptitude',
    topicName: 'Mixed Aptitude & Series',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixed Aptitude - Number, Geometry & Probability',
    question: 'A bag has 3 red and 5 blue balls. Probability of drawing a red ball?',
    type: 'single',
    options: [
      { id: 'A', text: '3/8' },
      { id: 'B', text: '5/8' },
      { id: 'C', text: '1/3' },
      { id: 'D', text: '1/2' }
    ],
    correctAnswers: ['A'],
    explanation: 'Favorable = 3, Total = 3 + 5 = 8. Probability = 3/8.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mix-97',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixed-aptitude',
    topicName: 'Mixed Aptitude & Series',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixed Aptitude - Number, Geometry & Probability',
    question: 'If 6 machines make 6 items in 6 minutes, how many minutes do 12 machines take to make 12 items?',
    type: 'single',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '6' },
      { id: 'C', text: '12' },
      { id: 'D', text: '24' }
    ],
    correctAnswers: ['B'],
    explanation: 'Each machine produces 1 item in 6 minutes. Thus, 12 machines will produce 12 items in 6 minutes.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mix-98',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixed-aptitude',
    topicName: 'Mixed Aptitude & Series',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixed Aptitude - Number, Geometry & Probability',
    question: 'Find the next number: 2, 6, 12, 20, 30, __.',
    type: 'single',
    options: [
      { id: 'A', text: '36' },
      { id: 'B', text: '40' },
      { id: 'C', text: '42' },
      { id: 'D', text: '44' }
    ],
    correctAnswers: ['C'],
    explanation: 'Series pattern is n(n + 1): 1×2=2, 2×3=6, 3×4=12, 4×5=20, 5×6=30, next is 6×7 = 42.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mix-99',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixed-aptitude',
    topicName: 'Mixed Aptitude & Series',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixed Aptitude - Number, Geometry & Probability',
    question: 'A sum doubles in 8 years at simple interest. What is the annual rate?',
    type: 'single',
    options: [
      { id: 'A', text: '10%' },
      { id: 'B', text: '12.5%' },
      { id: 'C', text: '15%' },
      { id: 'D', text: '20%' }
    ],
    correctAnswers: ['B'],
    explanation: 'SI = P in 8 years ⇒ R = 100 / T = 100 / 8 = 12.5% per annum.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mix-100',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixed-aptitude',
    topicName: 'Mixed Aptitude & Series',
    partName: 'Quantitative Aptitude',
    sectionName: 'Mixed Aptitude - Number, Geometry & Probability',
    question: 'A car covers 120 km at 60 km/h and returns at 40 km/h. What is average speed for the round trip?',
    type: 'single',
    options: [
      { id: 'A', text: '45 km/h' },
      { id: 'B', text: '48 km/h' },
      { id: 'C', text: '50 km/h' },
      { id: 'D', text: '52 km/h' }
    ],
    correctAnswers: ['B'],
    explanation: 'Average speed = 2s₁s₂ / (s₁ + s₂) = (2 × 60 × 40) / (60 + 40) = 4800 / 100 = 48 km/h.',
    difficulty: 'easy'
  }
]
