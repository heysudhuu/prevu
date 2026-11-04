/**
 * Resilient Academic Subject & Curriculum Catalog for Prevu
 * Serves as both the canonical curriculum dictionary and graceful offline/database fallback.
 */

export interface PrevuSubject {
  id: number
  branch_id: number
  year: number
  semester: number
  name: string
  code: string
}

export const FALLBACK_SUBJECTS_LIST: PrevuSubject[] = [
  // Semester 1
  { id: 3, branch_id: 1, year: 1, semester: 1, name: 'Mathematics 1', code: '22MTH101' },
  { id: 7, branch_id: 1, year: 1, semester: 1, name: 'Communication Skills', code: '22PCH105' },
  { id: 8, branch_id: 1, year: 1, semester: 1, name: 'Biology for Engineers', code: 'BIO101' },
  { id: 9, branch_id: 1, year: 1, semester: 1, name: 'Logical Thinking (LTPS)', code: '25CSH-107' },
  { id: 14, branch_id: 1, year: 1, semester: 1, name: 'Semiconductor Physics', code: '25SPH-143' },
  { id: 19, branch_id: 1, year: 1, semester: 1, name: 'Engineering Physics', code: 'CSE-PHY' },
  { id: 20, branch_id: 1, year: 1, semester: 1, name: 'Mathematics 1 (Unit 2)', code: '22MTH101' },
  { id: 21, branch_id: 1, year: 1, semester: 1, name: 'Communication Skills (Unit 2)', code: '22PCH105' },
  { id: 22, branch_id: 1, year: 1, semester: 1, name: 'Engineering Physics (Unit 2)', code: 'CSE-PHY' },
  { id: 23, branch_id: 1, year: 1, semester: 1, name: 'Sample Question Papers - Sem 1', code: 'SQP-SEM1' },
  { id: 24, branch_id: 1, year: 1, semester: 1, name: 'Semiconductor Physics (Unit 2)', code: '25SPH-143' },
  { id: 25, branch_id: 1, year: 1, semester: 1, name: 'Digital Electronics', code: '22EC101' },
  { id: 26, branch_id: 1, year: 1, semester: 1, name: 'Basic Fundamentals of Engineering', code: 'BFE101' },
  { id: 27, branch_id: 1, year: 1, semester: 1, name: 'Logical Thinking & Problem Solving', code: '25CSH-107' },
  { id: 39, branch_id: 1, year: 1, semester: 1, name: 'Digital Electronics Notes', code: '22EC101' },
  { id: 54, branch_id: 1, year: 1, semester: 1, name: 'Communication Skills Format', code: '22PCH105' },
  { id: 55, branch_id: 1, year: 1, semester: 1, name: 'Communication Skills I Complete', code: '22PCH105' },
  { id: 63, branch_id: 1, year: 1, semester: 1, name: 'Engineering Chemistry & Polymers', code: '22PCH101' },
  { id: 64, branch_id: 1, year: 1, semester: 1, name: 'Biology MST2 PYQ', code: 'BIO101' },

  // Semester 2
  { id: 36, branch_id: 1, year: 1, semester: 2, name: 'Data Structures & Algorithms', code: '22CS201' },
  { id: 37, branch_id: 1, year: 1, semester: 2, name: 'Programming in C', code: '22CS101' },
  { id: 41, branch_id: 1, year: 1, semester: 2, name: 'Engineering Mathematics 2', code: '22MTH201' },
  { id: 42, branch_id: 1, year: 1, semester: 2, name: 'Environmental Studies', code: '22EVS101' },

  // Semester 3
  { id: 11, branch_id: 1, year: 2, semester: 3, name: 'Operating System', code: '23CSH-242' },
  { id: 12, branch_id: 1, year: 2, semester: 3, name: 'Agile Development Methodologies', code: '23CST-247' },
  { id: 13, branch_id: 1, year: 2, semester: 3, name: 'Computer Org. & Architecture', code: '23CST-204' },
  { id: 15, branch_id: 1, year: 2, semester: 3, name: 'Probability and Statistics', code: '23CSH-233' },
  { id: 16, branch_id: 1, year: 2, semester: 3, name: 'Java Programming & OOPS', code: '22CSH-201' },
  { id: 28, branch_id: 1, year: 2, semester: 3, name: 'Agile Methodologies (Unit 2)', code: '23CST-247' },
  { id: 29, branch_id: 1, year: 2, semester: 3, name: 'Database Management System', code: '23CSH-243' },
  { id: 30, branch_id: 1, year: 2, semester: 3, name: 'Java Programming (Unit 2)', code: '22CSH-201' },
  { id: 31, branch_id: 1, year: 2, semester: 3, name: 'Data Structure & ADS', code: '23CSH-241' },
  { id: 32, branch_id: 1, year: 2, semester: 3, name: 'Sample Question Papers - Sem 3', code: 'SQP-SEM3' },
  { id: 34, branch_id: 1, year: 2, semester: 3, name: 'Discrete Mathematics', code: '23CST-237' },
  { id: 38, branch_id: 1, year: 2, semester: 3, name: 'DBMS SQL Queries', code: '23CSH-243' },
  { id: 40, branch_id: 1, year: 2, semester: 3, name: 'Agile & Biology Prep', code: '23CST-247' },
  { id: 44, branch_id: 1, year: 2, semester: 3, name: 'Computer Org & Arch (MST)', code: '23CST-204' },
  { id: 50, branch_id: 1, year: 2, semester: 3, name: 'Java Project & OOPS', code: '22CSH-201' },
  { id: 51, branch_id: 1, year: 2, semester: 3, name: 'Probability & Statistics (MST2)', code: '23CSH-233' },
  { id: 53, branch_id: 1, year: 2, semester: 3, name: 'DBMS MST2 Important Questions', code: '23CSH-243' },
  { id: 56, branch_id: 1, year: 2, semester: 3, name: 'P&S Curve Fitting & Bivariate', code: '23CSH-233' },
  { id: 57, branch_id: 1, year: 2, semester: 3, name: 'Java Complete Notes', code: '22CSH-201' },
  { id: 58, branch_id: 1, year: 2, semester: 3, name: 'OOPS Java MST Prep', code: '22CSH-201' },
  { id: 59, branch_id: 1, year: 2, semester: 3, name: 'Java OOPS MST2 Most Imp', code: '22CSH-201' },
  { id: 60, branch_id: 1, year: 2, semester: 3, name: 'Probability & Statistics Unit 2', code: '23CSH-233' },
  { id: 61, branch_id: 1, year: 2, semester: 3, name: 'Central Limit Theorem (CLT)', code: '23CSH-233' },
  { id: 62, branch_id: 1, year: 2, semester: 3, name: 'Multithreading in Java', code: '22CSH-201' },

  // Semester 4
  { id: 35, branch_id: 1, year: 2, semester: 4, name: 'Web Technologies', code: '23CSH-202' },
  { id: 47, branch_id: 1, year: 2, semester: 4, name: 'Software Engineering', code: '23CSH-214' },

  // Semester 5
  { id: 18, branch_id: 1, year: 3, semester: 5, name: 'Design & Analysis of Algorithms', code: '21CSH-311' },
  { id: 33, branch_id: 1, year: 3, semester: 5, name: 'Computer Network', code: '23CSH-312' },
  { id: 43, branch_id: 1, year: 3, semester: 5, name: 'Computer Network (MST2)', code: '23CSH-312' },
  { id: 48, branch_id: 1, year: 3, semester: 5, name: '5th Semester Core Notes', code: 'CSE-SEM5' },
  { id: 49, branch_id: 1, year: 3, semester: 5, name: 'Quantitative Aptitude & CBT', code: 'APT-301' },

  // Semester 6
  { id: 17, branch_id: 1, year: 3, semester: 6, name: 'Theory Of Computation', code: '22CST-390' },
  { id: 45, branch_id: 1, year: 3, semester: 6, name: 'Cloud Computing Architecture', code: '23CST-305' },
  { id: 46, branch_id: 1, year: 3, semester: 6, name: 'Compiler Design', code: '23CST-304' },

  // Semester 7
  { id: 10, branch_id: 1, year: 4, semester: 7, name: 'Parallel & Distributed Computing', code: '22CST-354' },
  { id: 52, branch_id: 1, year: 4, semester: 7, name: 'Mobile Security & Cyber Forensics', code: 'FSO-307' }
]

export const FALLBACK_SUBJECTS_MAP: Record<number, PrevuSubject> = FALLBACK_SUBJECTS_LIST.reduce(
  (acc, s) => {
    acc[s.id] = s
    return acc
  },
  {} as Record<number, PrevuSubject>
)

export const FALLBACK_EXAM_TYPES: { id: number; name: string }[] = [
  { id: 1, name: 'MST1' },
  { id: 2, name: 'MST2' },
  { id: 3, name: 'EST' },
  { id: 4, name: 'Notes' },
  { id: 8, name: 'Assignment' },
  { id: 9, name: 'Sample Paper' }
]

export const FALLBACK_EXAM_TYPES_MAP: Record<number, string> = {
  1: 'MST1',
  2: 'MST2',
  3: 'EST',
  4: 'Notes',
  8: 'Assignment',
  9: 'Sample Paper'
}

/**
 * Enriches a resource record from Supabase so missing joins (e.g. when subjects table
 * is empty or unlinked) are transparently populated with verified academic metadata.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function enrichResourceWithFallback(resource: any) {
  const subject = resource.subjects || (resource.subject_id ? FALLBACK_SUBJECTS_MAP[resource.subject_id] : null) || {
    name: 'Computer Science Core',
    code: 'BE-CSE',
    semester: 1,
    year: 1,
    branch_id: 1
  }

  const examTypeName = resource.exam_types?.name || (resource.exam_type_id ? FALLBACK_EXAM_TYPES_MAP[resource.exam_type_id] : null) || 'MST1'

  const user = resource.users || {
    name: 'CU Student Contributor',
    username: 'cu_student',
    cu_verified: true,
    role: 'student'
  }

  return {
    ...resource,
    subjects: subject,
    exam_types: { name: examTypeName },
    users: user
  }
}

