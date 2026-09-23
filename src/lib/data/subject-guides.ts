export interface SubjectStudyKit {
  code: string
  name: string
  credits: number
  description: string
  units: {
    unitNumber: number
    title: string
    topics: string[]
    weightage: string
  }[]
  recommendedBooks: {
    title: string
    author: string
    edition?: string
  }[]
  videoPlaylists: {
    title: string
    channel: string
    url: string
    description: string
  }[]
  examTips: string[]
}

export const CURATED_SUBJECT_GUIDES: Record<string, SubjectStudyKit> = {
  '22CS201': {
    code: '22CS201',
    name: 'Data Structures & Algorithms',
    credits: 4,
    description: 'Fundamental course covering linear and non-linear data structures, algorithm efficiency (Big-O), search/sort algorithms, trees, and graphs.',
    units: [
      {
        unitNumber: 1,
        title: 'Introduction & Linear Data Structures',
        topics: ['Asymptotic Notations (Big-O, Omega, Theta)', 'Arrays & Multi-dimensional arrays', 'Single, Double, and Circular Linked Lists', 'Stack implementation and Applications (Infix to Postfix)'],
        weightage: '25% (MST-1 Primary Focus)'
      },
      {
        unitNumber: 2,
        title: 'Queues & Recursion',
        topics: ['Linear & Circular Queues', 'Priority Queues & Deque', 'Recursion mechanics and stack frames', 'Tower of Hanoi & Backtracking'],
        weightage: '25% (MST-1 & MST-2)'
      },
      {
        unitNumber: 3,
        title: 'Non-Linear Data Structures (Trees & Heaps)',
        topics: ['Binary Trees & Binary Search Trees (BST)', 'Tree traversals (Inorder, Preorder, Postorder)', 'AVL Trees and Rotations', 'Min/Max Heap construction & Heap Sort'],
        weightage: '25% (MST-2 Primary Focus)'
      },
      {
        unitNumber: 4,
        title: 'Graphs & Advanced Sorting/Hashing',
        topics: ['Graph representations (Adjacency Matrix & List)', 'Breadth First Search (BFS) & Depth First Search (DFS)', 'Minimum Spanning Trees (Prim & Kruskal)', 'Hash tables, Hash functions & Collision resolution'],
        weightage: '25% (EST Comprehensive)'
      }
    ],
    recommendedBooks: [
      { title: 'Introduction to Algorithms', author: 'Thomas H. Cormen (CLRS)', edition: '4th Edition' },
      { title: 'Data Structures and Algorithm Analysis in C/C++', author: 'Mark Allen Weiss' }
    ],
    videoPlaylists: [
      {
        title: 'Data Structures & Algorithms Full Course',
        channel: 'Abdul Bari',
        url: 'https://www.youtube.com/results?search_query=abdul+bari+data+structures',
        description: 'Widely considered the gold standard for mastering tree traversals and graph algorithms.'
      },
      {
        title: 'Complete Data Structures Playlist',
        channel: "Jenny's Lectures CS IT",
        url: 'https://www.youtube.com/results?search_query=jennys+lectures+data+structures',
        description: 'Clear, whiteboard-style breakdowns of C implementations and dry runs.'
      },
      {
        title: 'DSA for University Semester Exams',
        channel: 'Gate Smashers',
        url: 'https://www.youtube.com/results?search_query=gate+smashers+data+structures',
        description: 'High-yield exam questions and quick conceptual recaps for MSTs and ESTs.'
      }
    ],
    examTips: [
      'For MST-1: Always practice step-by-step pointers manipulation for linked list reversals and stack infix-to-postfix conversions.',
      'For MST-2: Draw the tree state after each insertion/deletion (especially AVL tree rotation steps).',
      'For EST: Prim and Kruskal algorithms almost always appear in section C (10/12 marks).'
    ]
  },
  '22CS101': {
    code: '22CS101',
    name: 'Programming for Problem Solving (C)',
    credits: 4,
    description: 'Introduction to procedural programming, pointers, memory allocation, arrays, strings, and file I/O using C.',
    units: [
      {
        unitNumber: 1,
        title: 'C Fundamentals & Control Structures',
        topics: ['Variables, data types, and operators', 'Conditional statements (if-else, switch-case)', 'Iterative loops (for, while, do-while)', 'Flowcharts and pseudocode'],
        weightage: '25% (MST-1 Focus)'
      },
      {
        unitNumber: 2,
        title: 'Arrays, Strings & Functions',
        topics: ['1D and 2D Array manipulation', 'String handling functions (string.h)', 'Function declarations, definitions, and parameter passing', 'Scope, storage classes, and recursion'],
        weightage: '25% (MST-1 & MST-2)'
      },
      {
        unitNumber: 3,
        title: 'Pointers & Dynamic Memory Allocation',
        topics: ['Pointer arithmetic and pointer to pointers', 'Pointers with arrays and strings', 'Dynamic memory functions (malloc, calloc, realloc, free)', 'Dangling pointers and memory leaks'],
        weightage: '25% (MST-2 Focus)'
      },
      {
        unitNumber: 4,
        title: 'Structures, Unions & File Management',
        topics: ['Structures vs Unions', 'Nested structures and array of structures', 'File operations (fopen, fclose, fread, fwrite, fprintf)', 'Command line arguments'],
        weightage: '25% (EST Focus)'
      }
    ],
    recommendedBooks: [
      { title: 'The C Programming Language', author: 'Brian Kernighan & Dennis Ritchie (K&R)' },
      { title: 'Programming in ANSI C', author: 'E. Balagurusamy' }
    ],
    videoPlaylists: [
      {
        title: 'C Programming for University Exams',
        channel: 'Neso Academy',
        url: 'https://www.youtube.com/results?search_query=neso+academy+c+programming',
        description: 'Best theoretical and pointer explanation playlist for scoring high marks.'
      },
      {
        title: 'C Language One-Shot Revision',
        channel: 'CodeWithHarry',
        url: 'https://www.youtube.com/results?search_query=codewithharry+c+language',
        description: 'Complete syllabus walkthrough with live code demonstrations.'
      }
    ],
    examTips: [
      'Write the complete boilerplate `#include <stdio.h>` and `return 0;` in handwritten exam papers to avoid deductions.',
      'Show sample input and output boxes next to your code in the answer sheet.',
      'Pointer diagram showing memory addresses and values guarantees full marks in pointer theory questions.'
    ]
  },
  '22MTH101': {
    code: '22MTH101',
    name: 'Mathematics 1',
    credits: 4,
    description: 'Calculus, Linear Algebra, Matrix operations, Eigenvalues, and Multivariable calculus for engineering students.',
    units: [
      {
        unitNumber: 1,
        title: 'Linear Algebra & Matrices',
        topics: ['Rank of a matrix & Echelon form', 'System of Linear Equations (Consistency)', 'Eigenvalues and Eigenvectors', 'Cayley-Hamilton Theorem & Inverse'],
        weightage: '25% (MST-1 Focus)'
      },
      {
        unitNumber: 2,
        title: 'Differential Calculus',
        topics: ["Rolle's Theorem & Mean Value Theorems", "Taylor's and Maclaurin's series", 'Partial differentiation & Euler’s theorem', 'Maxima and Minima of functions of two variables'],
        weightage: '25% (MST-1 & MST-2)'
      },
      {
        unitNumber: 3,
        title: 'Integral Calculus & Beta/Gamma Functions',
        topics: ['Evaluation of definite integrals', 'Beta and Gamma functions & properties', 'Applications to area and volume', 'Double and Triple integrals'],
        weightage: '25% (MST-2 Focus)'
      },
      {
        unitNumber: 4,
        title: 'Vector Calculus',
        topics: ['Gradient, Divergence and Curl', 'Directional derivatives', 'Line, Surface and Volume integrals', "Green's, Stokes' and Gauss Divergence Theorems"],
        weightage: '25% (EST Focus)'
      }
    ],
    recommendedBooks: [
      { title: 'Higher Engineering Mathematics', author: 'B.S. Grewal', edition: '44th Edition' },
      { title: 'Advanced Engineering Mathematics', author: 'Erwin Kreyszig' }
    ],
    videoPlaylists: [
      {
        title: 'Engineering Mathematics 1 Complete Series',
        channel: 'Gajendra Purohit',
        url: 'https://www.youtube.com/results?search_query=gajendra+purohit+engineering+mathematics+1',
        description: 'Targeted shortcut tricks, Cayley-Hamilton proofs, and previous university questions.'
      },
      {
        title: 'Matrices & Linear Algebra',
        channel: 'Bhagwan Singh Vishwakarma',
        url: 'https://www.youtube.com/results?search_query=bhagwan+singh+engineering+mathematics',
        description: 'Step-by-step numerical solving tailored for North Indian university examinations.'
      }
    ],
    examTips: [
      'Cayley-Hamilton theorem and Eigenvector calculation is 100% guaranteed in MST-1.',
      'State theorem statements verbatim before beginning proofs.',
      'Box all final answers with units or vector notation.'
    ]
  }
}

/**
 * Returns curated study kit if available, otherwise dynamically synthesizes
 * an intelligent academic kit matching Chandigarh University curriculum patterns.
 */
export function getSubjectStudyKit(code: string, fallbackName?: string): SubjectStudyKit {
  const cleanCode = code.trim().toUpperCase()
  if (CURATED_SUBJECT_GUIDES[cleanCode]) {
    return CURATED_SUBJECT_GUIDES[cleanCode]
  }

  const displayName = fallbackName || cleanCode

  return {
    code: cleanCode,
    name: displayName,
    credits: 4,
    description: `Official academic syllabus, blueprints, and study kits for ${displayName} (${cleanCode}) under Chandigarh University curriculum.`,
    units: [
      {
        unitNumber: 1,
        title: 'Foundations & Core Concepts',
        topics: ['Foundational definitions, historical evolution & scope', 'Core theoretical frameworks and architectural models', 'Fundamental equations and classification taxonomies'],
        weightage: '25% (MST-1 Primary Focus)'
      },
      {
        unitNumber: 2,
        title: 'Modeling, Processes & Design',
        topics: ['Detailed process state transitions and workflows', 'Comparative paradigms and algorithmic strategies', 'Mid-level numericals and implementation criteria'],
        weightage: '25% (MST-1 & MST-2)'
      },
      {
        unitNumber: 3,
        title: 'Advanced Architectures & Optimization',
        topics: ['Complex algorithms and system-level trade-offs', 'Resource allocation, synchronization and fault tolerance', 'Performance tuning and bottleneck mitigation'],
        weightage: '25% (MST-2 Primary Focus)'
      },
      {
        unitNumber: 4,
        title: 'Modern Trends, Protocols & Applications',
        topics: ['Industry use-cases and contemporary frameworks', 'Security, scalability, and deployment considerations', 'Comprehensive integration of Units 1-4'],
        weightage: '25% (EST Comprehensive)'
      }
    ],
    recommendedBooks: [
      { title: `Standard Reference Textbook for ${displayName}`, author: 'Standard Academic Faculty Recommended' },
      { title: 'Higher Engineering & Technical Education Series', author: 'Pearson / McGraw Hill Education' }
    ],
    videoPlaylists: [
      {
        title: `${displayName} Complete Lecture Series`,
        channel: 'Gate Smashers',
        url: `https://www.youtube.com/results?search_query=gate+smashers+${encodeURIComponent(displayName)}`,
        description: 'University exam-oriented lectures covering high-frequency semester questions.'
      },
      {
        title: `${displayName} Fundamentals`,
        channel: 'Neso Academy',
        url: `https://www.youtube.com/results?search_query=neso+academy+${encodeURIComponent(displayName)}`,
        description: 'Structured conceptual lectures with clear diagrams and derivations.'
      }
    ],
    examTips: [
      'Draw well-labeled block diagrams for all 5-mark and 10-mark questions.',
      'Differentiate topics using standard side-by-side comparison tables rather than paragraph text.',
      'Review previous 3 years MST-1 and MST-2 papers — over 60% of question concepts recur.'
    ]
  }
}
