export type TopicCategory = 'all' | 'core-cs' | 'math-stats' | 'systems' | 'foundations'

export interface TopicTag {
  id: string
  name: string
  subjectCode: string
  subjectName: string
  searchQuery: string
  semester: number
  unit: string
  category: TopicCategory
  keywords: string[]
  examTypes: ('MST1' | 'MST2' | 'EST')[]
  frequentlyAsked: boolean
}

export const POPULAR_CU_TOPICS: TopicTag[] = [
  // SEMESTER 1
  {
    id: 'math1-matrices',
    name: 'Matrices, Eigenvalues & Calculus',
    subjectCode: '22MTH101',
    subjectName: 'Mathematics 1',
    searchQuery: 'Mathematics 1',
    semester: 1,
    unit: 'Unit 1 & 2',
    category: 'math-stats',
    keywords: ['matrices', 'eigenvalues', 'eigenvectors', 'rank of matrix', 'cayley hamilton', 'calculus'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'phy-semiconductors',
    name: 'Semiconductors & Quantum Mechanics',
    subjectCode: '25SPH-143',
    subjectName: 'Engineering physic',
    searchQuery: 'Engineering physic',
    semester: 1,
    unit: 'Unit 2',
    category: 'foundations',
    keywords: ['semiconductor', 'pn junction', 'band theory', 'fermi level', 'quantum', 'wave optics'],
    examTypes: ['MST1', 'MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'c-prog-pointers',
    name: 'Pointers, Loops & Arrays in C',
    subjectCode: '22CS101',
    subjectName: 'Programming for Problem Solving (C)',
    searchQuery: 'Programming for Problem Solving (C)',
    semester: 1,
    unit: 'Unit 2',
    category: 'core-cs',
    keywords: ['pointers', 'arrays', 'functions', 'structures', 'c programming', 'dynamic memory'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'dig-elec-kmaps',
    name: 'Logic Gates, Flip-Flops & K-Maps',
    subjectCode: 'CSE',
    subjectName: 'Digital Electronics',
    searchQuery: 'Digital Electronics',
    semester: 1,
    unit: 'Unit 2',
    category: 'systems',
    keywords: ['k-map', 'boolean algebra', 'flip flops', 'counters', 'mux', 'demux', 'logic gates'],
    examTypes: ['MST1', 'MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'ltps-flowcharts',
    name: 'Flowcharts, Pseudocode & Algorithms',
    subjectCode: '25CSH-107',
    subjectName: 'Logical Thinking & Problem Solving',
    searchQuery: 'Logical Thinking & Problem Solving',
    semester: 1,
    unit: 'Unit 1 & 2',
    category: 'foundations',
    keywords: ['flowchart', 'pseudocode', 'logic', 'algorithms', 'problem solving', 'ltps'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'comm-writing',
    name: 'Technical Writing & Presentation Skills',
    subjectCode: '22PCH105',
    subjectName: 'Communication Skill',
    searchQuery: 'Communication Skill',
    semester: 1,
    unit: 'Unit 1 & 2',
    category: 'foundations',
    keywords: ['communication skills', 'technical writing', 'emails', 'grammar', 'presentation'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },

  // SEMESTER 2
  {
    id: 'dsa-linked-lists',
    name: 'Stacks, Queues & Linked Lists',
    subjectCode: '22CS201',
    subjectName: 'Data Structures & Algorithms',
    searchQuery: 'Data Structures & Algorithms',
    semester: 2,
    unit: 'Unit 1 & 2',
    category: 'core-cs',
    keywords: ['linked list', 'stack', 'queue', 'infix postfix', 'circular queue', 'doubly linked list'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },

  // SEMESTER 3
  {
    id: 'deadlock-bankers',
    name: "Deadlock & Banker's Algorithm",
    subjectCode: '23CSH-242',
    subjectName: 'Operating System',
    searchQuery: 'Operating System',
    semester: 3,
    unit: 'Unit 2',
    category: 'systems',
    keywords: ['deadlock', 'banker', 'safety algorithm', 'resource allocation graph', 'rag', 'prevention', 'avoidance'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'dbms-normalization',
    name: 'Normalization (1NF, 2NF, 3NF, BCNF)',
    subjectCode: '23CSH-243',
    subjectName: 'Database Management System',
    searchQuery: 'Database Management System',
    semester: 3,
    unit: 'Unit 2',
    category: 'core-cs',
    keywords: ['normalization', '3nf', 'bcnf', 'functional dependency', 'lossless join', 'dependency preservation'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'process-sync-mutex',
    name: 'Process Synchronization & Semaphores',
    subjectCode: '23CSH-242',
    subjectName: 'Operating System',
    searchQuery: 'Operating System',
    semester: 3,
    unit: 'Unit 2',
    category: 'systems',
    keywords: ['synchronization', 'semaphore', 'mutex', 'critical section', 'dining philosophers', 'producer consumer'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'page-replacement-lru',
    name: 'Virtual Memory & LRU Page Replacement',
    subjectCode: '23CSH-242',
    subjectName: 'Operating System',
    searchQuery: 'Operating System',
    semester: 3,
    unit: 'Unit 3',
    category: 'systems',
    keywords: ['page replacement', 'lru', 'fifo', 'optimal', 'belady anomaly', 'thrashing', 'virtual memory'],
    examTypes: ['MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'prob-stats-clt',
    name: 'Central Limit Theorem & Curve Fitting',
    subjectCode: 'PRACTICE-SHEET',
    subjectName: 'Probability and Statistics',
    searchQuery: 'Probability and Statistics',
    semester: 3,
    unit: 'Unit 2 & 3',
    category: 'math-stats',
    keywords: ['central limit theorem', 'clt', 'curve fitting', 'correlation', 'regression', 'normal distribution'],
    examTypes: ['MST1', 'MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'avl-tree-rotations',
    name: 'AVL Trees & Self-Balancing Rotations',
    subjectCode: '23CSH-241',
    subjectName: 'Data Structure',
    searchQuery: 'Data Structure',
    semester: 3,
    unit: 'Unit 2',
    category: 'core-cs',
    keywords: ['avl', 'tree', 'rotations', 'll', 'rr', 'lr', 'rl', 'balance factor', 'bst'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'b-tree-indexing',
    name: 'B-Trees & B+ Tree Indexing',
    subjectCode: '23CSH-243',
    subjectName: 'Database Management System',
    searchQuery: 'Database Management System',
    semester: 3,
    unit: 'Unit 3',
    category: 'core-cs',
    keywords: ['b-tree', 'b+ tree', 'indexing', 'sparse index', 'dense index', 'multilevel index'],
    examTypes: ['MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'coa-pipelining',
    name: 'Pipelining & Cache Memory Organization',
    subjectCode: '23CST-204',
    subjectName: 'Computer Organization and Architecture',
    searchQuery: 'Computer Organization and Architecture',
    semester: 3,
    unit: 'Unit 3',
    category: 'systems',
    keywords: ['pipeline', 'hazards', 'cache mapping', 'direct mapping', 'set associative', 'instruction cycle'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'java-threads-oops',
    name: 'Multithreading & OOP Concepts in Java',
    subjectCode: '22CSH-201',
    subjectName: 'Java Programming',
    searchQuery: 'Java Programming',
    semester: 3,
    unit: 'Unit 2 & 3',
    category: 'core-cs',
    keywords: ['multithreading', 'synchronized', 'inheritance', 'polymorphism', 'interfaces', 'exception handling'],
    examTypes: ['MST1', 'MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'agile-scrum-sprint',
    name: 'Scrum Roles, Sprints & Agile Manifesto',
    subjectCode: '23CST-247',
    subjectName: 'Agile Development Methodologies',
    searchQuery: 'Agile Development Methodologies',
    semester: 3,
    unit: 'Unit 1 & 2',
    category: 'foundations',
    keywords: ['scrum', 'sprint', 'product owner', 'scrum master', 'agile manifesto', 'user stories', 'kanban'],
    examTypes: ['MST1', 'MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'discrete-graphs',
    name: 'Graph Theory & Relations in Discrete Math',
    subjectCode: '23CST-237',
    subjectName: 'Discrete Mathematics',
    searchQuery: 'Discrete Mathematics',
    semester: 3,
    unit: 'Unit 2',
    category: 'math-stats',
    keywords: ['graphs', 'trees', 'euler path', 'hamiltonian', 'equivalence relation', 'recurrence relations'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },

  // SEMESTER 5
  {
    id: 'dijkstra-shortest-path',
    name: "Dijkstra's & Bellman-Ford Shortest Path",
    subjectCode: 'CSE',
    subjectName: 'Design and Analysis of Algorithms',
    searchQuery: 'Design and Analysis of Algorithms',
    semester: 5,
    unit: 'Unit 3',
    category: 'core-cs',
    keywords: ['dijkstra', 'shortest path', 'greedy', 'bellman ford', 'graph', 'single source'],
    examTypes: ['MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'tcp-handshake',
    name: 'TCP 3-Way Handshake & Flow Control',
    subjectCode: '23CSH-312',
    subjectName: 'Computer Network',
    searchQuery: 'Computer Network',
    semester: 5,
    unit: 'Unit 3',
    category: 'systems',
    keywords: ['tcp', 'handshake', 'syn ack', 'sliding window', 'congestion control', 'flow control'],
    examTypes: ['MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'android-lifecycle',
    name: 'Activity Lifecycle & Intents in Android',
    subjectCode: 'CSE',
    subjectName: 'Mobile Application Development',
    searchQuery: 'Mobile Application Development',
    semester: 5,
    unit: 'Unit 2',
    category: 'core-cs',
    keywords: ['activity lifecycle', 'intents', 'services', 'broadcast receiver', 'android studio'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },

  // SEMESTER 6
  {
    id: 'cfg-pda-automata',
    name: 'Context-Free Grammars & Pushdown Automata',
    subjectCode: '22CST-390',
    subjectName: 'Theory Of Computation',
    searchQuery: 'Theory Of Computation',
    semester: 6,
    unit: 'Unit 2',
    category: 'core-cs',
    keywords: ['cfg', 'pda', 'pushdown automata', 'chomsky normal form', 'cnf', 'ambiguity', 'dfa', 'nfa'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },

  // SEMESTER 7
  {
    id: 'pdc-mpi-openmp',
    name: 'MPI, OpenMP & Parallel Architectures',
    subjectCode: '22CST-354/22ITT-354',
    subjectName: 'Parallel and Distributed Computing',
    searchQuery: 'Parallel and Distributed Computing',
    semester: 7,
    unit: 'Unit 2 & 3',
    category: 'systems',
    keywords: ['mpi', 'openmp', 'shared memory', 'message passing', 'speedup', 'amdahl law'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'cyber-forensics-crypto',
    name: 'Public Key Cryptography & Forensics',
    subjectCode: 'FSO-307',
    subjectName: 'Cyber Security Essentials for Forensics: Mobile Security and Al Applications',
    searchQuery: 'Cyber Security Essentials for Forensics',
    semester: 7,
    unit: 'Unit 2',
    category: 'systems',
    keywords: ['rsa', 'aes', 'digital signature', 'forensics', 'mobile security', 'penetration testing'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  }
]

/**
 * Smart Topic Search by keyword and optional semester filter
 */
export function searchTopics(query: string, semester?: number, category?: TopicCategory): TopicTag[] {
  let list = POPULAR_CU_TOPICS

  if (semester && semester > 0) {
    list = list.filter(t => t.semester === semester)
  }

  if (category && category !== 'all') {
    list = list.filter(t => t.category === category)
  }

  if (!query || query.trim().length === 0) {
    return list
  }

  const q = query.toLowerCase().trim()
  return list.filter(topic => {
    return (
      topic.name.toLowerCase().includes(q) ||
      topic.subjectName.toLowerCase().includes(q) ||
      topic.subjectCode.toLowerCase().includes(q) ||
      topic.keywords.some(k => k.includes(q))
    )
  })
}
