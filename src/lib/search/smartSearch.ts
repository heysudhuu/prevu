/**
 * Smart Search & Course Aliases Resolver for Prevu
 * Maps student queries, abbreviations, topic names, and common typos
 * to actual canonical subjects and database records.
 */

export interface CourseAlias {
  canonical: string
  aliases: string[]
  defaultSemester?: number
  subjectCodes: string[]
}

export const COURSE_ALIASES: CourseAlias[] = [
  {
    canonical: 'Operating System',
    aliases: ['os', 'operating systems', 'operating system', 'operatingsystem', 'deadlock', 'banker', 'semaphores', 'process synchronization', 'cpu scheduling'],
    defaultSemester: 3,
    subjectCodes: ['23CSH-242', '23CST-204']
  },
  {
    canonical: 'Database Management System',
    aliases: ['dbms', 'database', 'database management systems', 'databases', 'sql', 'normalization', 'rdbms', 'er diagram', 'sql query'],
    defaultSemester: 3,
    subjectCodes: ['23CSH-243', '(25CSH-245']
  },
  {
    canonical: 'Data Structure',
    aliases: ['dsa', 'data structures', 'data structure', 'ds', 'ads', 'advance data structures', 'advanced data structures', 'trees', 'linked list'],
    defaultSemester: 3,
    subjectCodes: ['23CSH-241', '25CSH-242', '22CS201']
  },
  {
    canonical: 'Design and Analysis of Algorithms',
    aliases: ['daa', 'algorithms', 'algorithm', 'design and analysis of algorithms', 'design and analyis of algorithms', 'dijkstra', 'greedy', 'dynamic programming', 'shortest path'],
    defaultSemester: 5,
    subjectCodes: ['21CSH-311']
  },
  {
    canonical: 'Computer Organization and Architecture',
    aliases: ['coa', 'computer organization', 'computer architecture', 'computer organisation and architecture', 'computer organization and architecture', 'pipeline', 'cache'],
    defaultSemester: 3,
    subjectCodes: ['23CST-204', '24CST-201']
  },
  {
    canonical: 'Computer Network',
    aliases: ['cn', 'computer networks', 'computer network', 'networking', 'osi', 'tcp', 'ip', 'udp'],
    defaultSemester: 5,
    subjectCodes: ['23CSH-312']
  },
  {
    canonical: 'Theory Of Computation',
    aliases: ['toc', 'theory of computation', 'automata', 'dfa', 'nfa', 'cfg', 'turing machine', 'formal languages'],
    defaultSemester: 6,
    subjectCodes: ['22CST-390']
  },
  {
    canonical: 'Agile Development Methodologies',
    aliases: ['agile', 'scrum', 'agile development methodologies', 'agile development', 'sprint', 'kanban'],
    defaultSemester: 3,
    subjectCodes: ['23CST-247', '25CSH-233']
  },
  {
    canonical: 'Probability and Statistics',
    aliases: ['p&s', 'p and s', 'probability', 'statistics', 'stats', 'probability and statistics', 'curve fitting', 'central limit theorem', 'clt', 'bivariate', 'correlation', 'regression'],
    defaultSemester: 3,
    subjectCodes: ['PRACTICE-SHEET', '23CSH-233']
  },
  {
    canonical: 'Java Programming',
    aliases: ['java', 'oops', 'oop', 'java programming', 'oops java', 'java notes', 'multithreading', 'multithreading in java', 'object oriented programing using java'],
    defaultSemester: 3,
    subjectCodes: ['22CSH-201', '25CSH-238']
  },
  {
    canonical: 'Communication Skill',
    aliases: ['communication', 'communication skill', 'communication skills', 'english', 'writing skill'],
    defaultSemester: 1,
    subjectCodes: ['22PCH105']
  },
  {
    canonical: 'Mathematics 1',
    aliases: ['math', 'maths', 'mathematics', 'mathematics 1', 'calculus', 'linear algebra', 'matrices'],
    defaultSemester: 1,
    subjectCodes: ['22MTH101']
  },
  {
    canonical: 'Discrete Mathematics',
    aliases: ['discrete', 'discrete maths', 'discrete mathematics', 'graphs', 'set theory', 'relations'],
    defaultSemester: 3,
    subjectCodes: ['23CST-237']
  },
  {
    canonical: 'Engineering physic',
    aliases: ['physics', 'physic', 'engineering physics', 'engineering physic', 'semiconductor', 'semiconductor physic'],
    defaultSemester: 1,
    subjectCodes: ['25SPH-143']
  },
  {
    canonical: 'Engineering Chemistry',
    aliases: ['chemistry', 'engineering chemistry', 'chem', 'polymers'],
    defaultSemester: 3,
    subjectCodes: ['22PCH101']
  },
  {
    canonical: 'Logical Thinking & Problem Solving',
    aliases: ['ltps', 'logical thinking', 'problem solving', 'logical thinking & problem solving'],
    defaultSemester: 1,
    subjectCodes: ['25CSH-107']
  },
  {
    canonical: 'Digital Electronics',
    aliases: ['de', 'digital electronics', 'logic gates', 'boolean algebra', 'flip flops'],
    defaultSemester: 1,
    subjectCodes: []
  },
  {
    canonical: 'BIology',
    aliases: ['bio', 'biology'],
    defaultSemester: 1,
    subjectCodes: []
  },
  {
    canonical: 'Parallel and Distributed Computing',
    aliases: ['pdc', 'parallel and distributed computing', 'distributed computing', 'parallel computing', 'mpi', 'openmp'],
    defaultSemester: 7,
    subjectCodes: ['22CST-354/22ITT-354']
  },
  {
    canonical: 'Cyber Security Essentials for Forensics',
    aliases: ['cyber', 'forensics', 'cyber security', 'mobile security'],
    defaultSemester: 7,
    subjectCodes: ['FSO-307']
  }
]

/**
 * Resolves any raw search term to matched canonical names, aliases, and keyword stems
 */
export function resolveSearchKeywords(query: string): {
  normalized: string
  canonicalNames: string[]
  searchPatterns: string[]
  suggestedSemester?: number
} {
  const clean = query.trim().toLowerCase().replace(/[,()]/g, '')
  if (!clean) {
    return { normalized: '', canonicalNames: [], searchPatterns: [] }
  }

  const matchedCanonicals = new Set<string>()
  const searchPatterns = new Set<string>()
  let suggestedSemester: number | undefined

  // 1. Direct stem (remove trailing s from plural queries like "Operating Systems" -> "Operating System")
  searchPatterns.add(clean)
  if (clean.endsWith('s') && clean.length > 3) {
    searchPatterns.add(clean.slice(0, -1))
  }
  if (clean.endsWith('es') && clean.length > 4) {
    searchPatterns.add(clean.slice(0, -2))
  }

  // 2. Check against alias dictionary
  for (const item of COURSE_ALIASES) {
    const isExactMatch = item.aliases.some(alias => clean === alias)
    // For short queries (<= 3 chars like 'os', 'ds', 'cn'), require exact match or word match
    const isSubstringMatch = clean.length > 3 
      ? item.aliases.some(alias => clean.includes(alias) || alias.includes(clean))
      : item.aliases.some(alias => alias === clean)

    if (isExactMatch || isSubstringMatch) {
      matchedCanonicals.add(item.canonical)
      searchPatterns.add(item.canonical.toLowerCase())
      for (const code of item.subjectCodes) {
        searchPatterns.add(code.toLowerCase())
      }
      if (!suggestedSemester && item.defaultSemester) {
        suggestedSemester = item.defaultSemester
      }
    }
  }

  // 3. Add token words for broad coverage if multi-word query
  const tokens = clean.split(/\s+/).filter(t => t.length >= 3 && !['and', 'for', 'the', 'with', 'unit'].includes(t))
  for (const token of tokens) {
    searchPatterns.add(token)
    if (token.endsWith('s')) {
      searchPatterns.add(token.slice(0, -1))
    }
  }

  return {
    normalized: clean,
    canonicalNames: Array.from(matchedCanonicals),
    searchPatterns: Array.from(searchPatterns),
    suggestedSemester
  }
}
