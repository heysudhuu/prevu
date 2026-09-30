// Prevu Auto-Tagging & Smart Topic Search Index (#11)
// Maps high-yield syllabus concepts to subjects, semesters, and question patterns

export interface TopicTag {
  id: string
  name: string
  subjectCode: string
  subjectName: string
  semester: number
  unit: string
  keywords: string[]
  examTypes: ('MST1' | 'MST2' | 'EST')[]
  frequentlyAsked: boolean
}

export const POPULAR_CU_TOPICS: TopicTag[] = [
  {
    id: 'deadlock-bankers',
    name: "Deadlock & Banker's Algorithm",
    subjectCode: '21CSH-202',
    subjectName: 'Operating Systems',
    semester: 4,
    unit: 'Unit 2',
    keywords: ['deadlock', 'banker', 'safety algorithm', 'resource allocation graph', 'rag', 'prevention', 'avoidance'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'dbms-normalization',
    name: 'Normalization (1NF, 2NF, 3NF, BCNF)',
    subjectCode: '21CSH-203',
    subjectName: 'Database Management Systems',
    semester: 4,
    unit: 'Unit 2',
    keywords: ['normalization', '3nf', 'bcnf', 'functional dependency', 'lossless join', 'dependency preservation'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'dijkstra-shortest-path',
    name: "Dijkstra's & Bellman-Ford Shortest Path",
    subjectCode: '21CSH-205',
    subjectName: 'Design & Analysis of Algorithms',
    semester: 4,
    unit: 'Unit 3',
    keywords: ['dijkstra', 'shortest path', 'greedy', 'bellman ford', 'graph', 'single source'],
    examTypes: ['MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'process-sync-mutex',
    name: 'Process Synchronization & Semaphores',
    subjectCode: '21CSH-202',
    subjectName: 'Operating Systems',
    semester: 4,
    unit: 'Unit 2',
    keywords: ['synchronization', 'semaphore', 'mutex', 'critical section', 'dining philosophers', 'producer consumer'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'page-replacement-lru',
    name: 'Virtual Memory & LRU Page Replacement',
    subjectCode: '21CSH-202',
    subjectName: 'Operating Systems',
    semester: 4,
    unit: 'Unit 3',
    keywords: ['page replacement', 'lru', 'fifo', 'optimal', 'belady anomaly', 'thrashing', 'virtual memory'],
    examTypes: ['MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'tcp-handshake',
    name: 'TCP 3-Way Handshake & Flow Control',
    subjectCode: '21CSH-204',
    subjectName: 'Computer Networks',
    semester: 5,
    unit: 'Unit 3',
    keywords: ['tcp', 'handshake', 'syn ack', 'sliding window', 'congestion control', 'flow control'],
    examTypes: ['MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'avl-tree-rotations',
    name: 'AVL Trees & Self-Balancing Rotations',
    subjectCode: '21CSH-201',
    subjectName: 'Data Structures & Algorithms',
    semester: 3,
    unit: 'Unit 2',
    keywords: ['avl', 'tree', 'rotations', 'll', 'rr', 'lr', 'rl', 'balance factor', 'bst'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'b-tree-indexing',
    name: 'B-Trees & B+ Tree Indexing',
    subjectCode: '21CSH-203',
    subjectName: 'Database Management Systems',
    semester: 4,
    unit: 'Unit 3',
    keywords: ['b-tree', 'b+ tree', 'indexing', 'sparse index', 'dense index', 'multilevel index'],
    examTypes: ['MST2', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'master-theorem-recurrence',
    name: 'Master Theorem for Recurrences',
    subjectCode: '21CSH-205',
    subjectName: 'Design & Analysis of Algorithms',
    semester: 4,
    unit: 'Unit 1',
    keywords: ['master theorem', 'recurrence', 'divide and conquer', 'asymptotic notation', 'big o'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  },
  {
    id: 'cfg-pda-automata',
    name: 'Context-Free Grammars & Pushdown Automata',
    subjectCode: '21CSH-206',
    subjectName: 'Theory of Computation',
    semester: 5,
    unit: 'Unit 2',
    keywords: ['cfg', 'pda', 'pushdown automata', 'chomsky normal form', 'cnf', 'ambiguity'],
    examTypes: ['MST1', 'EST'],
    frequentlyAsked: true
  }
]

/**
 * Smart Topic Search by keyword
 */
export function searchTopics(query: string): TopicTag[] {
  if (!query || query.trim().length === 0) {
    return POPULAR_CU_TOPICS.filter(t => t.frequentlyAsked)
  }

  const q = query.toLowerCase().trim()
  return POPULAR_CU_TOPICS.filter(topic => {
    return (
      topic.name.toLowerCase().includes(q) ||
      topic.subjectName.toLowerCase().includes(q) ||
      topic.subjectCode.toLowerCase().includes(q) ||
      topic.keywords.some(k => k.includes(q))
    )
  })
}
