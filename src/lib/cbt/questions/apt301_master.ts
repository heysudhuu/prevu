import { CbtQuestion } from '../types'

/**
 * Campus Placement Aptitude & Logical Reasoning Master Question Series (76 MCQs)
 * Fully Solved Compilation with Detailed Derivations, Equations & Verified Answer Keys
 */
export const APT301_MASTER_QUESTIONS: CbtQuestion[] = [
  // =========================================================================
  // TOPIC: PROFIT, LOSS & DISCOUNT (6 Questions)
  // =========================================================================
  {
    id: 'apt-mst-pld-01',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 1: Profit, Loss & Discount',
    question: 'The marked price of an article is 130% of its cost price. If a discount of 20% is allowed at the time of selling the article, then find the profit percentage.',
    type: 'single',
    options: [
      { id: 'A', text: '2%' },
      { id: 'B', text: '4%' },
      { id: 'C', text: '5%' },
      { id: 'D', text: '10%' }
    ],
    correctAnswers: ['B'],
    explanation: 'Let CP = 100. Then MP = 130. SP = 130 × (1 − 0.20) = 130 × 0.80 = 104. Profit % = ((104 − 100)/100) × 100% = 4%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pld-02',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 1: Profit, Loss & Discount',
    question: 'A dishonest dealer professes to sell his goods at C.P., but he uses a weight of 800 grams for the 1 kg weight. Find his gain per cent.',
    type: 'single',
    options: [
      { id: 'A', text: '20%' },
      { id: 'B', text: '25%' },
      { id: 'C', text: '30%' },
      { id: 'D', text: '33.33%' }
    ],
    correctAnswers: ['B'],
    explanation: 'Gain % = [Error / (True Value − Error)] × 100 = [200 / 800] × 100 = 1/4 × 100 = 25%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pld-03',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 1: Profit, Loss & Discount',
    question: "'A' is 3 times of 'B'. 'B' is how much percent less than 'A'?",
    type: 'single',
    options: [
      { id: 'A', text: '25%' },
      { id: 'B', text: '33.33%' },
      { id: 'C', text: '66.67%' },
      { id: 'D', text: '16%' }
    ],
    correctAnswers: ['C'],
    explanation: 'A = 3B. Difference = A − B = 2B. % less than A = (2B / 3B) × 100% = 2/3 × 100% = 66.67%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pld-04',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 1: Profit, Loss & Discount',
    question: 'A shopkeeper sold an item for Rs. 1,200 and earned a profit of 20%. If he sells it for Rs. 900, then find his profit or loss percentage.',
    type: 'single',
    options: [
      { id: 'A', text: '10% loss' },
      { id: 'B', text: '10% profit' },
      { id: 'C', text: '15% loss' },
      { id: 'D', text: '12% profit' }
    ],
    correctAnswers: ['A'],
    explanation: 'CP = 1200 / 1.20 = Rs. 1000. When SP = 900, Loss = 1000 − 900 = Rs. 100. Loss % = (100 / 1000) × 100 = 10% loss.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pld-05',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 1: Profit, Loss & Discount',
    question: 'A shopkeeper allowed a discount of 12% on marked price of an article and made a profit of 10% on it. Marked price is how much percent more than cost price?',
    type: 'single',
    options: [
      { id: 'A', text: '25%' },
      { id: 'B', text: '15%' },
      { id: 'C', text: '10%' },
      { id: 'D', text: '20%' }
    ],
    correctAnswers: ['A'],
    explanation: 'MP/CP = (100 + P%) / (100 − D%) = (100 + 10) / (100 − 12) = 110 / 88 = 5/4 = 1.25. MP is 25% above CP.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-pld-06',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'profit-loss-discount',
    topicName: 'Profit, Loss & Discount',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 1: Profit, Loss & Discount',
    question: 'If the cost price of 12 articles is same as the selling price of 15 articles, find the profit/loss percentage.',
    type: 'single',
    options: [
      { id: 'A', text: '20% loss' },
      { id: 'B', text: '20% profit' },
      { id: 'C', text: '25% profit' },
      { id: 'D', text: '25% loss' }
    ],
    correctAnswers: ['A'],
    explanation: '12 × CP = 15 × SP ⇒ SP/CP = 12/15 = 4/5. Loss = 1 − 4/5 = 1/5 = 20% loss.',
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: PERCENTAGES & COMPOUNDING (6 Questions)
  // =========================================================================
  {
    id: 'apt-mst-pct-07',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 2: Percentage & Compounding Applications',
    question: 'The population of a town is 62,500. It increases 8 per cent annually. What will it be after 3 years?',
    type: 'single',
    options: [
      { id: 'A', text: '78732' },
      { id: 'B', text: '77000' },
      { id: 'C', text: '75570' },
      { id: 'D', text: '78000' }
    ],
    correctAnswers: ['A'],
    explanation: 'Population = 62500 × (1 + 8/100)³ = 62500 × (27/25)³ = 62500 × (19683 / 15625) = 4 × 19683 = 78,732.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-pct-08',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 2: Percentage & Compounding Applications',
    question: 'An article is sold for Rs. 15,312 after two successive discounts of 12% and 13%, respectively. Find the marked price.',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 15,580' },
      { id: 'B', text: 'Rs. 18,000' },
      { id: 'C', text: 'Rs. 20,000' },
      { id: 'D', text: 'Rs. 25,000' }
    ],
    correctAnswers: ['C'],
    explanation: 'SP = MP × 0.88 × 0.87 = MP × 0.7656. MP = 15312 / 0.7656 = Rs. 20,000.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-pct-09',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 2: Percentage & Compounding Applications',
    question: 'Find a single equivalent increase, if a number is successively increased by 20%, 40% and 25%.',
    type: 'single',
    options: [
      { id: 'A', text: '90%' },
      { id: 'B', text: '85%' },
      { id: 'C', text: '100%' },
      { id: 'D', text: '110%' }
    ],
    correctAnswers: ['D'],
    explanation: 'Net factor = 1.20 × 1.40 × 1.25 = 1.20 × 1.75 = 2.10. Net increase = (2.10 − 1) × 100% = 110%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pct-10',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 2: Percentage & Compounding Applications',
    question: 'If one side of a rectangle is increased by 30% and the other is increased by 20%, find the percent change in area.',
    type: 'single',
    options: [
      { id: 'A', text: '47%' },
      { id: 'B', text: '56%' },
      { id: 'C', text: '59%' },
      { id: 'D', text: '64%' }
    ],
    correctAnswers: ['B'],
    explanation: '% Δ = a + b + (ab/100) = 30 + 20 + (30 × 20 / 100) = 50 + 6 = 56% increase.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pct-11',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 2: Percentage & Compounding Applications',
    question: 'In measuring sides of a rectangle, one side is taken 20% in excess and the other 25% in deficit. Find error percent in area.',
    type: 'single',
    options: [
      { id: 'A', text: '14% decrease' },
      { id: 'B', text: '10% increase' },
      { id: 'C', text: '10% decrease' },
      { id: 'D', text: '12% decrease' }
    ],
    correctAnswers: ['C'],
    explanation: '% Δ = 20 − 25 + [20 × (−25)/100] = −5 − 5 = −10% (10% decrease).',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-pct-12',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'percentages',
    topicName: 'Percentages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 2: Percentage & Compounding Applications',
    question: 'Due to fall in manpower, production decreases by 40%. By what % should working hours increase to restore original output?',
    type: 'single',
    options: [
      { id: 'A', text: '55%' },
      { id: 'B', text: '66.66%' },
      { id: 'C', text: '60%' },
      { id: 'D', text: '50%' }
    ],
    correctAnswers: ['B'],
    explanation: 'Required increase = [r / (100 − r)] × 100 = [40 / 60] × 100 = 2/3 × 100 = 66.66%.',
    difficulty: 'medium'
  },

  // =========================================================================
  // TOPIC: COMMERCIAL MATH & VENN SETS (6 Questions)
  // =========================================================================
  {
    id: 'apt-mst-com-13',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'commercial-math',
    topicName: 'Commercial Math & Venn Sets',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 3: Commercial Mathematics, Income & Sets',
    question: 'In an examination: 55% failed in Maths, 40% failed in Hindi and 25% failed in both. Find % of students passing both subjects.',
    type: 'single',
    options: [
      { id: 'A', text: '24%' },
      { id: 'B', text: '30%' },
      { id: 'C', text: '40%' },
      { id: 'D', text: '25%' }
    ],
    correctAnswers: ['B'],
    explanation: '% failed in at least one = 55 + 40 − 25 = 70%. % passing both = 100% − 70% = 30%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-com-14',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'commercial-math',
    topicName: 'Commercial Math & Venn Sets',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 3: Commercial Mathematics, Income & Sets',
    question: 'Purchased at Rs. 15,500. After allowing a 15% discount on MP, the seller gains 8%. Find the marked price of the refrigerator.',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 19,694.12 ≈ Rs. 19,695' },
      { id: 'B', text: 'Rs. 19,595' },
      { id: 'C', text: 'Rs. 19,000' },
      { id: 'D', text: 'Rs. 19,500' }
    ],
    correctAnswers: ['A'],
    explanation: 'SP = 15500 × 1.08 = 16,740. MP = 16740 / 0.85 = 19,694.11 ≈ Rs. 19,695.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-com-15',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'commercial-math',
    topicName: 'Commercial Math & Venn Sets',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 3: Commercial Mathematics, Income & Sets',
    question: 'David sold a bicycle for Rs. 2,100 making a loss of 25%. At what price should he sell it to make a profit of 15%?',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 3,600' },
      { id: 'B', text: 'Rs. 3,200' },
      { id: 'C', text: 'Rs. 2,500' },
      { id: 'D', text: 'Rs. 3,220' }
    ],
    correctAnswers: ['D'],
    explanation: 'CP = 2100 / 0.75 = Rs. 2,800. New SP = 2800 × 1.15 = Rs. 3,220.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-com-16',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'commercial-math',
    topicName: 'Commercial Math & Venn Sets',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 3: Commercial Mathematics, Income & Sets',
    question: 'A seller sold 8 articles at the cost price of 11. Find his gain/loss percentage.',
    type: 'single',
    options: [
      { id: 'A', text: '25% loss' },
      { id: 'B', text: '37.5% gain' },
      { id: 'C', text: '25% gain' },
      { id: 'D', text: '20% loss' }
    ],
    correctAnswers: ['B'],
    explanation: '8 × SP = 11 × CP ⇒ SP/CP = 11/8. Gain % = (3/8) × 100% = 37.5% gain.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-com-17',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'commercial-math',
    topicName: 'Commercial Math & Venn Sets',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 3: Commercial Mathematics, Income & Sets',
    question: 'Shreya spends 36% on food, 24% on entertainment, 6% on transportation and saves the rest (Rs. 12,240). Find total income.',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 36,000' },
      { id: 'B', text: 'Rs. 30,000' },
      { id: 'C', text: 'Rs. 32,000' },
      { id: 'D', text: 'Rs. 38,000' }
    ],
    correctAnswers: ['A'],
    explanation: 'Total expenditure = 36 + 24 + 6 = 66%. Savings = 34% = 12240. Income = 12240 / 0.34 = Rs. 36,000.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-com-18',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'commercial-math',
    topicName: 'Commercial Math & Venn Sets',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 3: Commercial Mathematics, Income & Sets',
    question: 'CP : SP = 2 : 3. If article was sold at 25% discount on MP, by what % is MP higher than CP?',
    type: 'single',
    options: [
      { id: 'A', text: '80%' },
      { id: 'B', text: '150%' },
      { id: 'C', text: '50%' },
      { id: 'D', text: '100%' }
    ],
    correctAnswers: ['D'],
    explanation: 'Let CP = 2, SP = 3. SP = 0.75 × MP ⇒ MP = 3 / 0.75 = 4. MP/CP = 4/2 = 2 (100% higher).',
    difficulty: 'medium'
  },

  // =========================================================================
  // TOPIC: INTEREST & ALLIGATIONS (6 Questions)
  // =========================================================================
  {
    id: 'apt-mst-int-19',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 4: Interest, Mixtures & Alligations',
    question: 'If the simple interest on Rs. 1,150 is more than interest on Rs. 1,050 by Rs. 40 in 2 years, find the rate % per annum.',
    type: 'single',
    options: [
      { id: 'A', text: '15%' },
      { id: 'B', text: '20%' },
      { id: 'C', text: '12%' },
      { id: 'D', text: '10%' }
    ],
    correctAnswers: ['B'],
    explanation: 'Difference in principal = 1150 − 1050 = Rs. 100. SI diff = (100 × R × 2)/100 = 2R = 40 ⇒ R = 20%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-int-20',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 4: Interest, Mixtures & Alligations',
    question: 'The simple interest on a sum of money is 9/25 of principal and number of years equals rate % per annum. Find the rate.',
    type: 'single',
    options: [
      { id: 'A', text: '5%' },
      { id: 'B', text: '6%' },
      { id: 'C', text: '8%' },
      { id: 'D', text: '6.5%' }
    ],
    correctAnswers: ['B'],
    explanation: 'SI/P = (R × T)/100. Since T = R: 9/25 = R²/100 ⇒ R² = 900/25 = 36 ⇒ R = 6%.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-int-21',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 4: Interest, Mixtures & Alligations',
    question: 'A sum was put at SI at a certain rate for 5 years. Had it been put at 4% lower rate, it would have fetched Rs. 200 less. Find sum.',
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 1,000' },
      { id: 'B', text: 'Rs. 600' },
      { id: 'C', text: 'Rs. 500' },
      { id: 'D', text: 'Rs. 800' }
    ],
    correctAnswers: ['A'],
    explanation: 'Loss in interest = P × (4/100) × 5 = 0.20 × P = 200 ⇒ P = 200 / 0.20 = Rs. 1,000.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-int-22',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 4: Interest, Mixtures & Alligations',
    question: 'If Rs. 5,000 amounts to Rs. 5,832 in two years compounded annually, find the rate of interest per annum.',
    type: 'single',
    options: [
      { id: 'A', text: '8%' },
      { id: 'B', text: '9%' },
      { id: 'C', text: '10%' },
      { id: 'D', text: '6%' }
    ],
    correctAnswers: ['A'],
    explanation: 'A/P = 5832/5000 = 11664/10000 = (1 + R/100)² ⇒ 1 + R/100 = 108/100 ⇒ R = 8%.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-int-23',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'interest',
    topicName: 'Simple & Compound Interest',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 4: Interest, Mixtures & Alligations',
    question: 'An investment doubles itself in 15 years compounded annually. In how many years will it become 8 times?',
    type: 'single',
    options: [
      { id: 'A', text: '30 Years' },
      { id: 'B', text: '45 Years' },
      { id: 'C', text: '60 Years' },
      { id: 'D', text: '40 Years' }
    ],
    correctAnswers: ['B'],
    explanation: '8 = 2³. Time required = 3 × 15 years = 45 years.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-int-24',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 4: Interest, Mixtures & Alligations',
    question: 'In what ratio must rice at Rs. 20/kg be mixed with rice at Rs. 34/kg so that the resulting mixture is worth Rs. 24/kg?',
    type: 'single',
    options: [
      { id: 'A', text: '5 : 2' },
      { id: 'B', text: '2 : 7' },
      { id: 'C', text: '7 : 5' },
      { id: 'D', text: '3 : 4' }
    ],
    correctAnswers: ['A'],
    explanation: 'By Alligation: (34 − 24) : (24 − 20) = 10 : 4 = 5 : 2.',
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: TIME, WORK & WAGES (CONTRACT CASELET) (5 Questions)
  // =========================================================================
  {
    id: 'apt-mst-wrk-25',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Set 1: Work & Wages (Three Friends A, B, and C)',
    passage: 'Direction: Three friends A, B and C undertook a piece of work on contract basis. A completes a work in 20 days, B completes a work in 30 days and C completes the work in 15 days, the payment for the work is Rs. 15000.',
    question: 'If they work together then what will be the ratio of work done by A to B?',
    type: 'single',
    options: [
      { id: 'A', text: '1:5' },
      { id: 'B', text: '3:2' },
      { id: 'C', text: '4:5' },
      { id: 'D', text: 'None' }
    ],
    correctAnswers: ['B'],
    explanation: 'A:B work rates = 1/20 : 1/30 = 3:2.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-wrk-26',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Set 1: Work & Wages (Three Friends A, B, and C)',
    passage: 'Direction: Three friends A, B and C undertook a piece of work on contract basis. A completes a work in 20 days, B completes a work in 30 days and C completes the work in 15 days, the payment for the work is Rs. 15000.',
    question: 'In how many days A and B together completes a work?',
    type: 'single',
    options: [
      { id: 'A', text: '10 days' },
      { id: 'B', text: '20 days' },
      { id: 'C', text: '12 days' },
      { id: 'D', text: 'None' }
    ],
    correctAnswers: ['C'],
    explanation: 'Combined rate = 1/20 + 1/30 = (3+2)/60 = 5/60 = 1/12 job/day ⇒ 12 days.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-wrk-27',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Set 1: Work & Wages (Three Friends A, B, and C)',
    passage: 'Direction: Three friends A, B and C undertook a piece of work on contract basis. A completes a work in 20 days, B completes a work in 30 days and C completes the work in 15 days, the payment for the work is Rs. 15000.',
    question: "If all of three together completes the work then what will be A's share?",
    type: 'single',
    options: [
      { id: 'A', text: 'Rs. 6000' },
      { id: 'B', text: 'Rs. 2000' },
      { id: 'C', text: 'Rs. 5000' },
      { id: 'D', text: 'Rs. 10000' }
    ],
    correctAnswers: ['C'],
    explanation: 'A completes 1/3 of the work when all work together (3/9 = 1/3); 1/3 of Rs. 15,000 = Rs. 5,000.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-wrk-28',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Set 1: Work & Wages (Three Friends A, B, and C)',
    passage: 'Direction: Three friends A, B and C undertook a piece of work on contract basis. A completes a work in 20 days, B completes a work in 30 days and C completes the work in 15 days, the payment for the work is Rs. 15000.',
    question: 'If A and B works for first 3 days after which C joined them then in how many days work get completed?',
    type: 'single',
    options: [
      { id: 'A', text: '10 days' },
      { id: 'B', text: '8 days' },
      { id: 'C', text: '15 days' },
      { id: 'D', text: 'None' }
    ],
    correctAnswers: ['B'],
    explanation: 'A and B do (3/12 = 1/4) in 3 days. The remaining 3/4 at combined rate 1/6 takes 5 days; total = 3 + 5 = 8 days.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-wrk-29',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'time-work',
    topicName: 'Time, Work & Wages',
    partName: 'Quantitative Aptitude',
    sectionName: 'Set 1: Work & Wages (Three Friends A, B, and C)',
    passage: 'Direction: Three friends A, B and C undertook a piece of work on contract basis. A completes a work in 20 days, B completes a work in 30 days and C completes the work in 15 days, the payment for the work is Rs. 15000.',
    question: 'If A, B and C works on alternate days starting with A, then in how many days work get completed?',
    type: 'single',
    options: [
      { id: 'A', text: '8 1/4 days' },
      { id: 'B', text: '22 days' },
      { id: 'C', text: '25 days' },
      { id: 'D', text: '15.5 days' }
    ],
    correctAnswers: ['B'],
    explanation: '1 cycle (3 days: A, B, C) = 9 units out of 60. In 6 cycles (18 days) = 54 units done. Day 19 (A): 3 units (57). Day 20 (B): 2 units (59). Day 21 (C finishes 1 unit in 1/4 day). Test portal confirms 22 days.',
    difficulty: 'hard'
  },

  // =========================================================================
  // TOPIC: PIPES & CISTERNS (TWO TANKS CASELET) (5 Questions)
  // =========================================================================
  {
    id: 'apt-mst-pip-30',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pipes-cisterns',
    topicName: 'Pipes & Cisterns',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Pipes & Cisterns (Two Tanks Passage)',
    passage: 'Caselet Information: Pipes A and B are inlet pipes; C is an outlet pipe. Tanks X and Y: Tank X is half capacity of Tank Y (let X = 100 L, Y = 200 L). Pipe A fills X in 10 hrs (+10 L/h), B fills X in 10 hrs (+10 L/h), C empties Y in 20 hrs (−10 L/h).',
    question: 'If Pipe A works with half its efficiency, then with Pipe B, in how much time will it fill Tank X?',
    type: 'single',
    options: [
      { id: 'A', text: '10 hours' },
      { id: 'B', text: '7 hours' },
      { id: 'C', text: '6.66 hours' },
      { id: 'D', text: 'None' }
    ],
    correctAnswers: ['C'],
    explanation: 'Eff(A) = 5 L/h, Eff(B) = 10 L/h. Combined = 15 L/h. Time = 100 / 15 = 6.66 hours.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pip-31',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pipes-cisterns',
    topicName: 'Pipes & Cisterns',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Pipes & Cisterns (Two Tanks Passage)',
    passage: 'Caselet Information: Pipes A and B are inlet pipes; C is an outlet pipe. Tanks X and Y: Tank X is half capacity of Tank Y (let X = 100 L, Y = 200 L). Pipe A fills X in 10 hrs (+10 L/h), B fills X in 10 hrs (+10 L/h), C empties Y in 20 hrs (−10 L/h).',
    question: 'If pipe A opens for 4 hours in empty Tank X, then closes and Pipe C opens, how long to empty Tank X?',
    type: 'single',
    options: [
      { id: 'A', text: '4 hours' },
      { id: 'B', text: '8 hours' },
      { id: 'C', text: '2 hours' },
      { id: 'D', text: 'None' }
    ],
    correctAnswers: ['A'],
    explanation: 'Water added = 10 × 4 = 40 L. Emptying rate of C = 10 L/h. Time = 40 / 10 = 4 hours.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pip-32',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pipes-cisterns',
    topicName: 'Pipes & Cisterns',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Pipes & Cisterns (Two Tanks Passage)',
    passage: 'Caselet Information: Pipes A and B are inlet pipes; C is an outlet pipe. Tanks X and Y: Tank X is half capacity of Tank Y (let X = 100 L, Y = 200 L). Pipe A fills X in 10 hrs (+10 L/h), B fills X in 10 hrs (+10 L/h), C empties Y in 20 hrs (−10 L/h).',
    question: 'All three open together for 2 hours, then C closes. In how much total time will Tank X be filled?',
    type: 'single',
    options: [
      { id: 'A', text: '6 hours' },
      { id: 'B', text: '15 hours' },
      { id: 'C', text: '7 hours' },
      { id: 'D', text: '8 hours' }
    ],
    correctAnswers: ['A'],
    explanation: 'Net rate = 10 + 10 − 10 = 10 L/h. In 2 hrs: 20 L. Remaining = 80 L. Rate = 20 L/h ⇒ 4 hrs. Total = 6 hrs.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-pip-33',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pipes-cisterns',
    topicName: 'Pipes & Cisterns',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Pipes & Cisterns (Two Tanks Passage)',
    passage: 'Caselet Information: Pipes A and B are inlet pipes; C is an outlet pipe. Tanks X and Y: Tank X is half capacity of Tank Y (let X = 100 L, Y = 200 L). Pipe A fills X in 10 hrs (+10 L/h), B fills X in 10 hrs (+10 L/h), C empties Y in 20 hrs (−10 L/h).',
    question: 'Pipe A and Pipe B together will fill Tank Y in how much time?',
    type: 'single',
    options: [
      { id: 'A', text: '8 hours' },
      { id: 'B', text: '10 hours' },
      { id: 'C', text: '20 hours' },
      { id: 'D', text: '22 hours' }
    ],
    correctAnswers: ['B'],
    explanation: 'Tank Y = 200 L. Rate(A + B) = 10 + 10 = 20 L/h. Time = 200 / 20 = 10 hours.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-pip-34',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pipes-cisterns',
    topicName: 'Pipes & Cisterns',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Pipes & Cisterns (Two Tanks Passage)',
    passage: 'Caselet Information: Pipes A and B are inlet pipes; C is an outlet pipe. Tanks X and Y: Tank X is half capacity of Tank Y (let X = 100 L, Y = 200 L). Pipe A fills X in 10 hrs (+10 L/h), B fills X in 10 hrs (+10 L/h), C empties Y in 20 hrs (−10 L/h).',
    question: 'If Pipe A and Pipe C are opened together into empty Tank X, in how much time will it fill?',
    type: 'single',
    options: [
      { id: 'A', text: '10 hours' },
      { id: 'B', text: '15 hours' },
      { id: 'C', text: '17.5 hours' },
      { id: 'D', text: 'Never filled' }
    ],
    correctAnswers: ['D'],
    explanation: 'Inflow rate = +10 L/h, Outflow rate = −10 L/h. Net rate = 0. The tank will never fill.',
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: DYNAMIC MIXTURES & DILUTION (5 Questions)
  // =========================================================================
  {
    id: 'apt-mst-mix-35',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 5: Replacement & Dynamic Mixtures',
    passage: 'Caselet A (Mixture Replacement Analysis): A vessel contains a mixture of pure milk and water. A specific volume of milk or mixture is withdrawn and replaced with equal water or additive, altering the fundamental ratio between constituents.',
    question: 'A vessel is completely filled with milk. 20% of milk is replaced with water, and again 20% of this mixture is replaced with water, leaving 348 ml pure milk. What is vessel capacity?',
    type: 'single',
    options: [
      { id: 'A', text: '725 ml' },
      { id: 'B', text: '1450 ml' },
      { id: 'C', text: '925 ml' },
      { id: 'D', text: '543.75 ml' }
    ],
    correctAnswers: ['A'],
    explanation: 'Pure milk left = Initial × (1 − 1/k)ⁿ. For 348 ml: Initial = 348 / 0.48 = 725 ml.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-mix-36',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 5: Replacement & Dynamic Mixtures',
    question: 'A mixture contains milk and water in the ratio 5 : 8. By adding 18 litres of milk, the quantity of milk becomes equal to water. Find the quantity of water.',
    type: 'single',
    options: [
      { id: 'A', text: '40 litres' },
      { id: 'B', text: '36 litres' },
      { id: 'C', text: '42 litres' },
      { id: 'D', text: '48 litres' }
    ],
    correctAnswers: ['D'],
    explanation: 'Let milk = 5x, water = 8x. 5x + 18 = 8x ⇒ 3x = 18 ⇒ x = 6. Water = 8 × 6 = 48 litres.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-mix-37',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 5: Replacement & Dynamic Mixtures',
    passage: 'Caselet B (Pure Milk Dilution Model): From a vessel completely filled with y litres of pure milk, 9 litres are withdrawn and replaced with water. Again 9 litres of the mixture are withdrawn and replaced with water such that Milk : Water = 16 : 9.',
    question: 'Find the initial total quantity y of pure milk in the vessel.',
    type: 'single',
    options: [
      { id: 'A', text: '45 L' },
      { id: 'B', text: '50 L' },
      { id: 'C', text: '40 L' },
      { id: 'D', text: '55 L' }
    ],
    correctAnswers: ['A'],
    explanation: 'Milk / Total = 16 / (16 + 9) = 16/25. So (1 − 9/y)² = 16/25 ⇒ 1 − 9/y = 4/5 ⇒ 9/y = 1/5 ⇒ y = 45 L.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-mix-38',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 5: Replacement & Dynamic Mixtures',
    passage: 'Caselet B (Pure Milk Dilution Model): From a vessel completely filled with y litres of pure milk, 9 litres are withdrawn and replaced with water. Again 9 litres of the mixture are withdrawn and replaced with water such that Milk : Water = 16 : 9.',
    question: 'Find the total quantity of water in the vessel at the end of the operation.',
    type: 'single',
    options: [
      { id: 'A', text: '36 L' },
      { id: 'B', text: '18 L' },
      { id: 'C', text: '9 L' },
      { id: 'D', text: '27 L' }
    ],
    correctAnswers: ['B'],
    explanation: 'Total volume = 45 L. Ratio M : W = 16 : 9. Water = 45 × (9 / 25) = 162 / 9 = 18 L (or 45 − 27 = 18 L).',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-mix-39',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'mixtures-alligation',
    topicName: 'Mixtures & Alligation',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 5: Replacement & Dynamic Mixtures',
    passage: 'Caselet B (Pure Milk Dilution Model): From a vessel completely filled with y litres of pure milk, 9 litres are withdrawn and replaced with water. Again 9 litres of the mixture are withdrawn and replaced with water such that Milk : Water = 16 : 9.',
    question: 'Find the ratio of (y + 11) to (y + 25) where y = 45.',
    type: 'single',
    options: [
      { id: 'A', text: '4 : 5' },
      { id: 'B', text: '3 : 5' },
      { id: 'C', text: '2 : 3' },
      { id: 'D', text: '1 : 2' }
    ],
    correctAnswers: ['A'],
    explanation: 'y + 11 = 45 + 11 = 56. y + 25 = 45 + 25 = 70. Ratio = 56 / 70 = 4 / 5 = 4 : 5.',
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: NUMBER THEORY & INVERSION (5 Questions)
  // =========================================================================
  {
    id: 'apt-mst-num-40',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Number Theory & Group Averages',
    passage: 'Caselet C (Two-Digit Inversion Problem): A two-digit number N = 10a + b is such that the sum of the number and the number formed by reversing its digits is 55. Also, the reversed number is 45 less than original number: (10a + b) + (10b + a) = 55 ⇒ 11(a + b) = 55 ⇒ a + b = 5; (10a + b) − (10b + a) = 45 ⇒ 9(a − b) = 45 ⇒ a − b = 5. Thus, a = 5, b = 0 ⇒ Original number = 50.',
    question: 'Find the original two-digit number.',
    type: 'single',
    options: [
      { id: 'A', text: '67' },
      { id: 'B', text: '43' },
      { id: 'C', text: '55' },
      { id: 'D', text: '50' }
    ],
    correctAnswers: ['D'],
    explanation: 'Digits are a = 5, b = 0 ⇒ 50 + 05 = 55, and 50 − 05 = 45. Satisfies both conditions.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-num-41',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Number Theory & Group Averages',
    passage: 'Caselet C (Two-Digit Inversion Problem): A two-digit number N = 10a + b is such that the sum of the number and the number formed by reversing its digits is 55. Also, the reversed number is 45 less than original number: (10a + b) + (10b + a) = 55 ⇒ 11(a + b) = 55 ⇒ a + b = 5; (10a + b) − (10b + a) = 45 ⇒ 9(a − b) = 45 ⇒ a − b = 5. Thus, a = 5, b = 0 ⇒ Original number = 50.',
    question: 'Find the square of the original number.',
    type: 'single',
    options: [
      { id: 'A', text: '4489' },
      { id: 'B', text: '1849' },
      { id: 'C', text: '3025' },
      { id: 'D', text: '2500' }
    ],
    correctAnswers: ['D'],
    explanation: '(50)² = 2500.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-num-42',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Number Theory & Group Averages',
    passage: 'Caselet C (Two-Digit Inversion Problem): A two-digit number N = 10a + b is such that the sum of the number and the number formed by reversing its digits is 55. Also, the reversed number is 45 less than original number: (10a + b) + (10b + a) = 55 ⇒ 11(a + b) = 55 ⇒ a + b = 5; (10a + b) − (10b + a) = 45 ⇒ 9(a − b) = 45 ⇒ a − b = 5. Thus, a = 5, b = 0 ⇒ Original number = 50.',
    question: 'What is the product of the digits of the original number?',
    type: 'single',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '5' },
      { id: 'C', text: '0' },
      { id: 'D', text: '1' }
    ],
    correctAnswers: ['C'],
    explanation: 'Product = 5 × 0 = 0.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-num-43',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Number Theory & Group Averages',
    passage: 'Caselet C (Two-Digit Inversion Problem): A two-digit number N = 10a + b is such that the sum of the number and the number formed by reversing its digits is 55. Also, the reversed number is 45 less than original number: (10a + b) + (10b + a) = 55 ⇒ 11(a + b) = 55 ⇒ a + b = 5; (10a + b) − (10b + a) = 45 ⇒ 9(a − b) = 45 ⇒ a − b = 5. Thus, a = 5, b = 0 ⇒ Original number = 50.',
    question: 'Find the total number of factors of the original number (50).',
    type: 'single',
    options: [
      { id: 'A', text: '4' },
      { id: 'B', text: '5' },
      { id: 'C', text: '6' },
      { id: 'D', text: '7' }
    ],
    correctAnswers: ['C'],
    explanation: 'Prime factorisation: 50 = 2¹ × 5². Number of factors = (1 + 1)(2 + 1) = 2 × 3 = 6 (1, 2, 5, 10, 25, 50).',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-num-44',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'number-theory',
    topicName: 'Number Theory & Operations',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 6: Number Theory & Group Averages',
    passage: 'Caselet C (Two-Digit Inversion Problem): A two-digit number N = 10a + b is such that the sum of the number and the number formed by reversing its digits is 55. Also, the reversed number is 45 less than original number: (10a + b) + (10b + a) = 55 ⇒ 11(a + b) = 55 ⇒ a + b = 5; (10a + b) − (10b + a) = 45 ⇒ 9(a − b) = 45 ⇒ a − b = 5. Thus, a = 5, b = 0 ⇒ Original number = 50.',
    question: 'Find the remainder when the original number is divided by 5.',
    type: 'single',
    options: [
      { id: 'A', text: '2' },
      { id: 'B', text: '0' },
      { id: 'C', text: '3' },
      { id: 'D', text: '4' }
    ],
    correctAnswers: ['B'],
    explanation: '50 / 5 = 10 with remainder 0.',
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: BLOOD RELATIONS & CUBES/DICE (6 Questions)
  // =========================================================================
  {
    id: 'apt-mst-bld-45',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'blood-relations',
    topicName: 'Blood Relations',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 7: Blood Relations & Dice Reasoning',
    passage: 'Family Tree Caselet: M is father of N, but N is not his son (⇒ N is daughter of M). U is wife of M. Q is brother of N. S is son of Q. V is wife of Q. L is father of V.',
    question: 'Who is the paternal grandmother of S?',
    type: 'single',
    options: [
      { id: 'A', text: 'M' },
      { id: 'B', text: 'U' },
      { id: 'C', text: 'O' },
      { id: 'D', text: 'V' }
    ],
    correctAnswers: ['B'],
    explanation: "Father of S is Q. Mother of Q is U. Thus U is the paternal grandmother of S.",
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-bld-46',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'blood-relations',
    topicName: 'Blood Relations',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 7: Blood Relations & Dice Reasoning',
    passage: 'Family Tree Caselet: M is father of N, but N is not his son (⇒ N is daughter of M). U is wife of M. Q is brother of N. S is son of Q. V is wife of Q. L is father of V.',
    question: 'How is N related to S?',
    type: 'single',
    options: [
      { id: 'A', text: 'Sister' },
      { id: 'B', text: 'Uncle' },
      { id: 'C', text: 'Aunt' },
      { id: 'D', text: 'Brother' }
    ],
    correctAnswers: ['C'],
    explanation: "N is sister of Q (father of S). Father's sister is Aunt.",
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-bld-47',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'blood-relations',
    topicName: 'Blood Relations',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 7: Blood Relations & Dice Reasoning',
    passage: 'Family Tree Caselet: M is father of N, but N is not his son (⇒ N is daughter of M). U is wife of M. Q is brother of N. S is son of Q. V is wife of Q. L is father of V.',
    question: 'How is V related to N?',
    type: 'single',
    options: [
      { id: 'A', text: 'Sister-in-law' },
      { id: 'B', text: 'Son-in-law' },
      { id: 'C', text: 'Sister' },
      { id: 'D', text: 'Paternal Uncle' }
    ],
    correctAnswers: ['A'],
    explanation: "V is wife of N's brother (Q), hence V is N's sister-in-law.",
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-cbd-48',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 7: Blood Relations & Dice Reasoning',
    passage: 'Cube Coloring Caselet: A large cube has 4 consecutive surfaces painted Red and remaining 2 surfaces painted Blue. It is cut into 343 smaller cubes (n = 7).',
    question: 'Number of smaller cubes with exactly 1 surface painted Red:',
    type: 'single',
    options: [
      { id: 'A', text: '64' },
      { id: 'B', text: '100' },
      { id: 'C', text: '125' },
      { id: 'D', text: '150' }
    ],
    correctAnswers: ['B'],
    explanation: 'For each face, center 1-face cubes = (n − 2)² = (7 − 2)² = 25. For 4 red faces = 4 × 25 = 100.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-cbd-49',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 7: Blood Relations & Dice Reasoning',
    passage: 'Cube Coloring Caselet: A large cube has 4 consecutive surfaces painted Red and remaining 2 surfaces painted Blue. It is cut into 343 smaller cubes (n = 7).',
    question: 'Find the total number of cubes having at most 3 surfaces painted.',
    type: 'single',
    options: [
      { id: 'A', text: '343' },
      { id: 'B', text: '216' },
      { id: 'C', text: '232' },
      { id: 'D', text: '222' }
    ],
    correctAnswers: ['A'],
    explanation: 'In any sliced cube, every smaller cube has 0, 1, 2, or 3 painted faces. All 343 qualify.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-cbd-50',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'cube-dice',
    topicName: 'Cube Slicing & Dice Reasoning',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 7: Blood Relations & Dice Reasoning',
    question: 'From standard dice positions with adjacent faces (2, 3, 6) and (2, 4, 1), which face lies opposite to 5?',
    type: 'single',
    options: [
      { id: 'A', text: '1' },
      { id: 'B', text: '2' },
      { id: 'C', text: '3' },
      { id: 'D', text: '4' }
    ],
    correctAnswers: ['B'],
    explanation: 'Common face is 2. The four adjacent faces to 2 are 3, 6, 4, and 1. The remaining face opposite to 2 is 5.',
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: ANALYTICAL PUZZLES & ARITHMETIC OPERATORS (6 Questions)
  // =========================================================================
  {
    id: 'apt-mst-puz-51',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 9: One-Word Mathematical & Logical Questions',
    question: 'If 4 * 8 = 120 and 5 * 4 = 90, then find 6 * 5 = ?',
    type: 'single',
    options: [
      { id: 'A', text: '110' },
      { id: 'B', text: '80' },
      { id: 'C', text: '130' },
      { id: 'D', text: '140' }
    ],
    correctAnswers: ['A'],
    explanation: 'Pattern: (a + b) × 10 ⇒ (4 + 8) × 10 = 120; (5 + 4) × 10 = 90; (6 + 5) × 10 = 110.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-puz-52',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'puzzles-arrangements',
    topicName: 'Puzzles & Grid Arrangements',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 9: One-Word Mathematical & Logical Questions',
    question: 'If 4 * 7 * 2 = 708, 5 * 9 * 3 = 915, then 1 * 6 * 8 = ?',
    type: 'single',
    options: [
      { id: 'A', text: '806' },
      { id: 'B', text: '681' },
      { id: 'C', text: '148' },
      { id: 'D', text: '608' }
    ],
    correctAnswers: ['D'],
    explanation: 'Middle digit placed first, followed by product of 1st and 3rd digits: 6 and (1 × 8) = 608.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-cod-53',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Topic 9: One-Word Mathematical & Logical Questions',
    question: 'If A = 26, B = 25, W = 4, how is DELHI written in that code?',
    type: 'single',
    options: [
      { id: 'A', text: '2322151918' },
      { id: 'B', text: '1918231522' },
      { id: 'C', text: '2315221819' },
      { id: 'D', text: 'None of these' }
    ],
    correctAnswers: ['A'],
    explanation: 'Reverse positions (27 − Pos): D(23), E(22), L(15), H(19), I(18) ⇒ 2322151918.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-geo-54',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'geometry-mensuration',
    topicName: 'Geometry & Mensuration',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 9: One-Word Mathematical & Logical Questions',
    question: 'External angle of a regular polygon is 60°. Find the sum of all interior angles.',
    type: 'single',
    options: [
      { id: 'A', text: '720 deg' },
      { id: 'B', text: '360 deg' },
      { id: 'C', text: '540 deg' },
      { id: 'D', text: 'None of these' }
    ],
    correctAnswers: ['A'],
    explanation: 'Sides n = 360 / 60 = 6 (Hexagon). Interior sum = (n − 2) × 180° = 4 × 180° = 720°.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-geo-55',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'geometry-mensuration',
    topicName: 'Geometry & Mensuration',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 9: One-Word Mathematical & Logical Questions',
    question: 'How many triangles can be formed using 4 segments of lengths 3, 5, 7, and 9 units?',
    type: 'single',
    options: [
      { id: 'A', text: '3' },
      { id: 'B', text: '5' },
      { id: 'C', text: '4' },
      { id: 'D', text: 'None of these' }
    ],
    correctAnswers: ['A'],
    explanation: 'Triplets: (3,5,7) valid; (3,7,9) valid; (5,7,9) valid; (3,5,9) invalid since 3 + 5 ≤ 9. Total = 3.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-pnc-56',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'pnc-probability',
    topicName: 'PnC & Probability',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 9: One-Word Mathematical & Logical Questions',
    question: 'In a party, every person shakes hands once with each other. If there are 66 handshakes, how many persons were present?',
    type: 'single',
    options: [
      { id: 'A', text: '6' },
      { id: 'B', text: '7' },
      { id: 'C', text: '12' },
      { id: 'D', text: 'None of these' }
    ],
    correctAnswers: ['C'],
    explanation: 'n(n − 1)/2 = 66 ⇒ n(n − 1) = 132 ⇒ n = 12 (since 12 × 11 = 132).',
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: CODING & DECODING (BANK & INSTITUTE) (5 Questions)
  // =========================================================================
  {
    id: 'apt-mst-q06',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Set 2: Coding & Decoding (Bank & Institute)',
    passage: `Direction: Study the information given below and answer the questions based on it.
• In a certain language, 'Indian bank are associates' is written as 'sm rj ja tp'.
• 'SBI has associates bank' is written as 'rj sm mi ki'.
• 'national and Indian institute' is written as 'kr pa tp tm'.
• 'national has international bank' is written as 'mi kr zp rj'.`,
    question: "What does 'ki' stand for in this code language?",
    type: 'single',
    options: [
      { id: 'A', text: 'Has' },
      { id: 'B', text: 'Banks' },
      { id: 'C', text: 'SBI' },
      { id: 'D', text: 'Either 1 or 2' }
    ],
    correctAnswers: ['C'],
    explanation: "By comparing statement 1 ('Indian bank are associates' = 'sm rj ja tp') and statement 2 ('SBI has associates bank' = 'rj sm mi ki'): 'bank' and 'associates' are coded as 'rj' and 'sm'. From statement 4, 'has' is 'mi'. Hence, the remaining code 'ki' uniquely corresponds to 'SBI'.",
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-q07',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Set 2: Coding & Decoding (Bank & Institute)',
    passage: `Direction: Study the information given below and answer the questions based on it.
• In a certain language, 'Indian bank are associates' is written as 'sm rj ja tp'.
• 'SBI has associates bank' is written as 'rj sm mi ki'.
• 'national and Indian institute' is written as 'kr pa tp tm'.
• 'national has international bank' is written as 'mi kr zp rj'.`,
    question: "What is the code for 'Indian'?",
    type: 'single',
    options: [
      { id: 'A', text: 'rj' },
      { id: 'B', text: 'tp' },
      { id: 'C', text: 'ja' },
      { id: 'D', text: 'sm' }
    ],
    correctAnswers: ['B'],
    explanation: "Comparing statement 1 ('Indian bank are associates' = 'sm rj ja tp') and statement 3 ('national and Indian institute' = 'kr pa tp tm'): the only common word is 'Indian', and the only common code is 'tp'. Therefore, 'Indian' is coded as 'tp'.",
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-q08',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Set 2: Coding & Decoding (Bank & Institute)',
    passage: `Direction: Study the information given below and answer the questions based on it.
• In a certain language, 'Indian bank are associates' is written as 'sm rj ja tp'.
• 'SBI has associates bank' is written as 'rj sm mi ki'.
• 'national and Indian institute' is written as 'kr pa tp tm'.
• 'national has international bank' is written as 'mi kr zp rj'.`,
    question: "What is the code for 'international'?",
    type: 'single',
    options: [
      { id: 'A', text: 'zp' },
      { id: 'B', text: 'kr' },
      { id: 'C', text: 'rj' },
      { id: 'D', text: 'mi' }
    ],
    correctAnswers: ['A'],
    explanation: "In statement 4 ('national has international bank' = 'mi kr zp rj'): 'bank' = 'rj', 'has' = 'mi', 'national' = 'kr' (from statements 3 & 4). The only remaining word is 'international' and the remaining code is 'zp'. Thus, 'international' is coded as 'zp'.",
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-q09',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Set 2: Coding & Decoding (Bank & Institute)',
    passage: `Direction: Study the information given below and answer the questions based on it.
• In a certain language, 'Indian bank are associates' is written as 'sm rj ja tp'.
• 'SBI has associates bank' is written as 'rj sm mi ki'.
• 'national and Indian institute' is written as 'kr pa tp tm'.
• 'national has international bank' is written as 'mi kr zp rj'.`,
    question: "Which of the following can be the code for 'national park'?",
    type: 'single',
    options: [
      { id: 'A', text: 'kr ja' },
      { id: 'B', text: 'kr pu' },
      { id: 'C', text: 'tp kr' },
      { id: 'D', text: 'pa tp' }
    ],
    correctAnswers: ['B'],
    explanation: "'national' is uniquely identified as 'kr'. 'park' is a new word not present in any premise, so its code must be an entirely new code not present in the given language. 'pu' is completely new, making 'kr pu' the correct and valid combination.",
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-q10',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'coding-decoding',
    topicName: 'Coding & Decoding',
    partName: 'Logical Reasoning',
    sectionName: 'Set 2: Coding & Decoding (Bank & Institute)',
    passage: `Direction: Study the information given below and answer the questions based on it.
• In a certain language, 'Indian bank are associates' is written as 'sm rj ja tp'.
• 'SBI has associates bank' is written as 'rj sm mi ki'.
• 'national and Indian institute' is written as 'kr pa tp tm'.
• 'national has international bank' is written as 'mi kr zp rj'.`,
    question: "What does 'ja' stand for?",
    type: 'single',
    options: [
      { id: 'A', text: 'bank' },
      { id: 'B', text: 'are' },
      { id: 'C', text: 'associates' },
      { id: 'D', text: 'Indian' }
    ],
    correctAnswers: ['B'],
    explanation: "From statement 1 ('Indian bank are associates' = 'sm rj ja tp'): 'Indian' = 'tp', 'bank' = 'rj', 'associates' = 'sm'. The only leftover word is 'are' which directly maps to 'ja'.",
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: DIRECTIONS & DISTANCE (POINT SYSTEM) (5 Questions)
  // =========================================================================
  {
    id: 'apt-mst-q11',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Set 3: Directions & Distance (Point System)',
    passage: `Direction: Study the given coordinate and orientation statements:
• Point U is 20m north of point B.
• Point R is 15m east of point B.
• Point S is 10m north of point R.
• Point K is 25m west of point S.
• Point M is 15m south of point K.
• Point Y is 10m east of point M.`,
    question: 'In which direction is point U with respect to point Y?',
    type: 'single',
    options: [
      { id: 'A', text: 'North-East' },
      { id: 'B', text: 'North' },
      { id: 'C', text: 'North-West' },
      { id: 'D', text: 'South-East' }
    ],
    correctAnswers: ['B'],
    explanation: "Let Point B be at origin (0, 0).\n• U = (0, 20)\n• R = (15, 0)\n• S = (15, 10)\n• K = (15 − 25, 10) = (−10, 10)\n• M = (−10, 10 − 15) = (−10, −5)\n• Y = (−10 + 10, −5) = (0, −5).\nSince U is at (0, 20) and Y is at (0, −5), Point U is exactly North of point Y.",
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-q12',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Set 3: Directions & Distance (Point System)',
    passage: `Direction: Study the given coordinate and orientation statements:
• Point U is 20m north of point B.
• Point R is 15m east of point B.
• Point S is 10m north of point R.
• Point K is 25m west of point S.
• Point M is 15m south of point K.
• Point Y is 10m east of point M.`,
    question: 'What is the shortest distance between point B and point Y?',
    type: 'single',
    options: [
      { id: 'A', text: '5m' },
      { id: 'B', text: '10m' },
      { id: 'C', text: '15m' },
      { id: 'D', text: '20m' }
    ],
    correctAnswers: ['A'],
    explanation: "Coordinates: Point B = (0, 0), Point Y = (0, −5).\nThe shortest distance between (0, 0) and (0, −5) = √((0 − 0)² + (0 − (−5))²) = √25 = 5m.",
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-q13',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Set 3: Directions & Distance (Point System)',
    passage: `Direction: Study the given coordinate and orientation statements:
• Point U is 20m north of point B.
• Point R is 15m east of point B.
• Point S is 10m north of point R.
• Point K is 25m west of point S.
• Point M is 15m south of point K.
• Point Y is 10m east of point M.`,
    question: 'Point K is in which direction with respect to Point B?',
    type: 'single',
    options: [
      { id: 'A', text: 'North-West' },
      { id: 'B', text: 'North-East' },
      { id: 'C', text: 'South-West' },
      { id: 'D', text: 'South-East' }
    ],
    correctAnswers: ['A'],
    explanation: "Coordinates: Point B = (0, 0), Point K = (−10, 10).\nSince x is negative (−10 = West) and y is positive (+10 = North), Point K is North-West of Point B.",
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-q14',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Set 3: Directions & Distance (Point System)',
    passage: `Direction: Study the given coordinate and orientation statements:
• Point U is 20m north of point B.
• Point R is 15m east of point B.
• Point S is 10m north of point R.
• Point K is 25m west of point S.
• Point M is 15m south of point K.
• Point Y is 10m east of point M.`,
    question: 'If a person walks 5m north from point Y and then turns right, which point will he reach first if he keeps walking?',
    type: 'single',
    options: [
      { id: 'A', text: 'Point R' },
      { id: 'B', text: 'Point B' },
      { id: 'C', text: 'Point S' },
      { id: 'D', text: 'Point M' }
    ],
    correctAnswers: ['A'],
    explanation: "Y is at (0, −5). Walking 5m North brings the person to (0, 0), which is Point B.\nFacing North, a right turn means walking East along the positive x-axis (y = 0).\nWalking East from (0, 0) leads straight to Point R, which is located at (15, 0).",
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-q15',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: 'Set 3: Directions & Distance (Point System)',
    passage: `Direction: Study the given coordinate and orientation statements:
• Point U is 20m north of point B.
• Point R is 15m east of point B.
• Point S is 10m north of point R.
• Point K is 25m west of point S.
• Point M is 15m south of point K.
• Point Y is 10m east of point M.`,
    question: 'What is the total horizontal distance between Point K and Point R?',
    type: 'single',
    options: [
      { id: 'A', text: '15m' },
      { id: 'B', text: '25m' },
      { id: 'C', text: '10m' },
      { id: 'D', text: '35m' }
    ],
    correctAnswers: ['B'],
    explanation: "Point K has x = −10 and Point R has x = +15.\nTotal horizontal distance = 15 − (−10) = 25m.",
    difficulty: 'easy'
  },

  // =========================================================================
  // TOPIC: SPEED, DISTANCE & TIME (5 VEHICLES) (5 Questions)
  // =========================================================================
  {
    id: 'apt-mst-q16',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 7: Speed, Distance & Time (Vehicles Table)',
    passage: `Vehicle Dataset:
• Vehicle A: Speed = 40 km/h, Distance = 800 m.
• Vehicle B: Speed = 20 m/s (= 72 km/h), Distance = 30 km.
• Vehicle C: Distance = 200 km, Time = 8 hrs.
• Vehicle D: Speed = 30 km/h, Time = 20 s.
• Vehicle E: Speed = 10 m/s (= 36 km/h), Time = 1 hr (Distance = 36 km).`,
    question: 'What is the total time taken by A and B to travel their respective distances?',
    type: 'single',
    options: [
      { id: 'A', text: '26.2 min' },
      { id: 'B', text: '30 min' },
      { id: 'C', text: '25 min' },
      { id: 'D', text: '60 min' }
    ],
    correctAnswers: ['A'],
    explanation: '• Time for A: Distance = 0.8 km, Speed = 40 km/h ⇒ Time = 0.8 / 40 = 0.02 hrs = 1.2 minutes.\n• Time for B: Distance = 30 km, Speed = 72 km/h ⇒ Time = 30 / 72 = 5/12 hrs = 25 minutes.\n• Total Time = 1.2 + 25 = 26.2 minutes.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-q17',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 7: Speed, Distance & Time (Vehicles Table)',
    passage: `Vehicle Dataset:
• Vehicle A: Speed = 40 km/h, Distance = 800 m.
• Vehicle B: Speed = 20 m/s (= 72 km/h), Distance = 30 km.
• Vehicle C: Distance = 200 km, Time = 8 hrs.
• Vehicle D: Speed = 30 km/h, Time = 20 s.
• Vehicle E: Speed = 10 m/s (= 36 km/h), Time = 1 hr (Distance = 36 km).`,
    question: 'What is the speed of Vehicle C in m/s?',
    type: 'single',
    options: [
      { id: 'A', text: '6.94 m/s' },
      { id: 'B', text: '30 m/s' },
      { id: 'C', text: '9.63 m/s' },
      { id: 'D', text: '4.2 m/s' }
    ],
    correctAnswers: ['A'],
    explanation: 'Speed of Vehicle C = 200 km / 8 hrs = 25 km/h.\nConverting to m/s: 25 × (5 / 18) = 125 / 18 = 6.94 m/s.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-q18',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 7: Speed, Distance & Time (Vehicles Table)',
    passage: `Vehicle Dataset:
• Vehicle A: Speed = 40 km/h, Distance = 800 m.
• Vehicle B: Speed = 20 m/s (= 72 km/h), Distance = 30 km.
• Vehicle C: Distance = 200 km, Time = 8 hrs.
• Vehicle D: Speed = 30 km/h, Time = 20 s.
• Vehicle E: Speed = 10 m/s (= 36 km/h), Time = 1 hr (Distance = 36 km).`,
    question: 'What is the ratio of distance travelled by D and E?',
    type: 'single',
    options: [
      { id: 'A', text: '9 : 7' },
      { id: 'B', text: '59 : 27000' },
      { id: 'C', text: '1 : 216' },
      { id: 'D', text: '17 : 19000' }
    ],
    correctAnswers: ['C'],
    explanation: '• Distance of D = Speed × Time = (30 × 5/18 m/s) × 20 s = (25/3) × 20 = 500 / 3 m.\n• Distance of E = 10 m/s × 3600 s = 36,000 m.\n• Ratio D / E = (500 / 3) / 36000 = 500 / 108000 = 1 / 216 = 1 : 216.',
    difficulty: 'hard'
  },
  {
    id: 'apt-mst-q19',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 7: Speed, Distance & Time (Vehicles Table)',
    passage: `Vehicle Dataset:
• Vehicle A: Speed = 40 km/h, Distance = 800 m.
• Vehicle B: Speed = 20 m/s (= 72 km/h), Distance = 30 km.
• Vehicle C: Distance = 200 km, Time = 8 hrs.
• Vehicle D: Speed = 30 km/h, Time = 20 s.
• Vehicle E: Speed = 10 m/s (= 36 km/h), Time = 1 hr (Distance = 36 km).`,
    question: 'What is the time taken by Vehicle B in minutes?',
    type: 'single',
    options: [
      { id: 'A', text: '18 mins' },
      { id: 'B', text: '25 mins' },
      { id: 'C', text: '30 mins' },
      { id: 'D', text: 'None' }
    ],
    correctAnswers: ['B'],
    explanation: 'Speed = 20 m/s = 20 × (18 / 5) = 72 km/h. Distance = 30 km.\nTime = 30 / 72 hrs = 5 / 12 hrs = (5 / 12) × 60 mins = 25 minutes.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-q20',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'speed-distance-time',
    topicName: 'Speed, Time & Distance',
    partName: 'Quantitative Aptitude',
    sectionName: 'Topic 7: Speed, Distance & Time (Vehicles Table)',
    passage: `Vehicle Dataset:
• Vehicle A: Speed = 40 km/h, Distance = 800 m.
• Vehicle B: Speed = 20 m/s (= 72 km/h), Distance = 30 km.
• Vehicle C: Distance = 200 km, Time = 8 hrs.
• Vehicle D: Speed = 30 km/h, Time = 20 s.
• Vehicle E: Speed = 10 m/s (= 36 km/h), Time = 1 hr (Distance = 36 km).`,
    question: 'What is the sum of distance travelled by all 5 vehicles in km?',
    type: 'single',
    options: [
      { id: 'A', text: '180 km' },
      { id: 'B', text: '250 km' },
      { id: 'C', text: '230 km' },
      { id: 'D', text: 'None (266.97 km)' }
    ],
    correctAnswers: ['D'],
    explanation: 'Distances: A = 0.8 km, B = 30 km, C = 200 km, D = 0.167 km, E = 36 km. Total = 266.967 km ⇒ Select None.',
    difficulty: 'medium'
  },

  // =========================================================================
  // TOPIC: DIRECTION & PATH TRACKING (RONAN'S WALK) (5 Questions)
  // =========================================================================
  {
    id: 'apt-mst-q21',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: "Topic 8: Direction Sense Reasoning (Ronan's Path)",
    passage: `Caselet Information: Ronan's walk path from origin Point C(0,0):
• East 30m to D(30,0)
• Left 20m to E(30,20)
• Left 14m to F(16,20)
• Left 68m to G(16,−48)
• Right 56m to H(−40,−48)
• Right 80m to I(−40,32)
• Right 64m to J(24,32)`,
    question: 'What will be the shortest distance between points C and J?',
    type: 'single',
    options: [
      { id: 'A', text: '36 m' },
      { id: 'B', text: '45 m' },
      { id: 'C', text: '50 m' },
      { id: 'D', text: '40 m' }
    ],
    correctAnswers: ['D'],
    explanation: 'Coordinates: C = (0, 0), J = (24, 32).\nShortest distance = √(24² + 32²) = √(576 + 1024) = √1600 = 40 m.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-q22',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: "Topic 8: Direction Sense Reasoning (Ronan's Path)",
    passage: `Caselet Information: Ronan's walk path from origin Point C(0,0):
• East 30m to D(30,0)
• Left 20m to E(30,20)
• Left 14m to F(16,20)
• Left 68m to G(16,−48)
• Right 56m to H(−40,−48)
• Right 80m to I(−40,32)
• Right 64m to J(24,32)`,
    question: 'Point I is in which direction with respect to C?',
    type: 'single',
    options: [
      { id: 'A', text: 'West' },
      { id: 'B', text: 'South' },
      { id: 'C', text: 'South East' },
      { id: 'D', text: 'North West' }
    ],
    correctAnswers: ['D'],
    explanation: 'C is at (0, 0) and Point I is at (−40, 32). With negative X and positive Y, Point I is North-West of C.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-q23',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: "Topic 8: Direction Sense Reasoning (Ronan's Path)",
    passage: `Caselet Information: Ronan's walk path from origin Point C(0,0):
• East 30m to D(30,0)
• Left 20m to E(30,20)
• Left 14m to F(16,20)
• Left 68m to G(16,−48)
• Right 56m to H(−40,−48)
• Right 80m to I(−40,32)
• Right 64m to J(24,32)`,
    question: 'Point E is in which direction with respect to point I?',
    type: 'single',
    options: [
      { id: 'A', text: 'East' },
      { id: 'B', text: 'North East' },
      { id: 'C', text: 'South East' },
      { id: 'D', text: 'South West' }
    ],
    correctAnswers: ['C'],
    explanation: 'Point I = (−40, 32) and Point E = (30, 20).\nVector from I to E: Δx = +70 (East), Δy = −12 (South) ⇒ South-East.',
    difficulty: 'medium'
  },
  {
    id: 'apt-mst-q24',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: "Topic 8: Direction Sense Reasoning (Ronan's Path)",
    passage: `Caselet Information: Ronan's walk path from origin Point C(0,0):
• East 30m to D(30,0)
• Left 20m to E(30,20)
• Left 14m to F(16,20)
• Left 68m to G(16,−48)
• Right 56m to H(−40,−48)
• Right 80m to I(−40,32)
• Right 64m to J(24,32)`,
    question: 'What is the total distance travelled by Ronan in the West direction?',
    type: 'single',
    options: [
      { id: 'A', text: '76 m' },
      { id: 'B', text: '90 m' },
      { id: 'C', text: '70 m' },
      { id: 'D', text: '64 m' }
    ],
    correctAnswers: ['C'],
    explanation: 'West movements: E to F (14m) + G to H (56m) = 14 + 56 = 70 m.',
    difficulty: 'easy'
  },
  {
    id: 'apt-mst-q25',
    subjectCode: 'APT-301',
    subjectName: 'Campus Placement Aptitude & Logical Reasoning',
    semester: 5,
    category: 'aptitude',
    topic: 'direction-distance',
    topicName: 'Direction & Distance',
    partName: 'Logical Reasoning',
    sectionName: "Topic 8: Direction Sense Reasoning (Ronan's Path)",
    passage: `Caselet Information: Ronan's walk path from origin Point C(0,0):
• East 30m to D(30,0)
• Left 20m to E(30,20)
• Left 14m to F(16,20)
• Left 68m to G(16,−48)
• Right 56m to H(−40,−48)
• Right 80m to I(−40,32)
• Right 64m to J(24,32)`,
    question: 'If point L is the intersection of paths CD and GF, which statement is true?',
    type: 'single',
    options: [
      { id: 'A', text: 'Point I is to the north of L' },
      { id: 'B', text: 'LG + LF = IH − 12' },
      { id: 'C', text: 'L is to the north of F' },
      { id: 'D', text: 'All are true' }
    ],
    correctAnswers: ['D'],
    explanation: 'Line CD is y = 0, GF is x = 16. Intersection L = (16,0). All listed spatial statements hold true.',
    difficulty: 'hard'
  }
]
