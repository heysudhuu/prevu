export interface Flashcard {
  id: string
  subjectCode?: string
  unit: number
  category: 'formula' | 'definition' | 'theorem' | 'shortcut'
  front: string
  back: string
  hint?: string
  examYield: 'must-know' | 'very-high' | 'high'
}

export const CURATED_FLASHCARDS: Record<string, Flashcard[]> = {
  // Data Structures & Algorithms
  '22CS201': [
    {
      id: 'dsa-1',
      unit: 1,
      category: 'formula',
      front: 'Master Theorem for Divide & Conquer T(n) = aT(n/b) + f(n)',
      back: 'Compare f(n) with n^(log_b(a)):\n• Case 1: If f(n) = O(n^(log_b(a) - ε)), then T(n) = Θ(n^(log_b(a)))\n• Case 2: If f(n) = Θ(n^(log_b(a))), then T(n) = Θ(n^(log_b(a)) * log n)\n• Case 3: If f(n) = Ω(n^(log_b(a) + ε)), then T(n) = Θ(f(n))',
      hint: 'Crucial for recursive time complexity in MST-1 & EST',
      examYield: 'must-know'
    },
    {
      id: 'dsa-2',
      unit: 1,
      category: 'shortcut',
      front: 'Array Address Calculation (Row-Major vs Column-Major in 2D Array A[M][N])',
      back: 'Base Address = BA, Element Size = W:\n• Row-Major: BA + W * [(i - LBR) * N + (j - LBC)]\n• Column-Major: BA + W * [(j - LBC) * M + (i - LBR)]',
      hint: 'Guaranteed 2-mark or 5-mark calculation in MST-1',
      examYield: 'very-high'
    },
    {
      id: 'dsa-3',
      unit: 2,
      category: 'definition',
      front: 'Circular Queue Empty & Full Conditions (Size = N)',
      back: '• Empty: front == -1 && rear == -1 (or front == rear for 0-index scheme)\n• Full: (rear + 1) % N == front\n• Enqueue: rear = (rear + 1) % N\n• Dequeue: front = (front + 1) % N',
      hint: 'Frequently tested implementation in MST-1 Part B',
      examYield: 'must-know'
    },
    {
      id: 'dsa-4',
      unit: 3,
      category: 'theorem',
      front: 'AVL Tree Balance Factor & 4 Rotation Rules',
      back: 'Balance Factor BF = Height(Left) - Height(Right) ∈ {-1, 0, 1}\n• LL Imbalance (left child left subtree) → Right Rotation at node\n• RR Imbalance (right child right subtree) → Left Rotation at node\n• LR Imbalance → Left Rotate child, then Right Rotate node\n• RL Imbalance → Right Rotate child, then Left Rotate node',
      hint: 'MST-2 must-know 10-mark question',
      examYield: 'must-know'
    },
    {
      id: 'dsa-5',
      unit: 4,
      category: 'shortcut',
      front: 'Prim’s vs Kruskal’s Algorithm for MST',
      back: '• Prim: Vertex-based, grows a single connected tree. Best for dense graphs. O(E + V log V) with Fibonacci Heap.\n• Kruskal: Edge-based, sorts all edges, uses Disjoint Set (Union-Find) to detect cycles. Best for sparse graphs. O(E log E).',
      hint: 'Direct comparison asked in EST Section C',
      examYield: 'very-high'
    }
  ],

  // Operating Systems
  '22CS301': [
    {
      id: 'os-1',
      unit: 1,
      category: 'definition',
      front: '4 Necessary & Sufficient Conditions for Deadlock (Coffman Conditions)',
      back: '1. Mutual Exclusion (non-shareable resources)\n2. Hold and Wait (process holds res while waiting for more)\n3. No Preemption (resources cannot be forcibly confiscated)\n4. Circular Wait (P0 waits for P1, P1 waits for P2... Pn waits for P0)',
      hint: 'Deadlock prevention invalidates at least one of these 4',
      examYield: 'must-know'
    },
    {
      id: 'os-2',
      unit: 2,
      category: 'formula',
      front: 'Banker’s Algorithm Safety Condition Formulas',
      back: '• Need Matrix: Need[i][j] = Max[i][j] - Allocation[i][j]\n• Safe test: Find process where Need[i] ≤ Available\n• Work update: Available = Available + Allocation[i]\n• If all processes finish, state is SAFE (no deadlock).',
      hint: 'MST-1 10-mark compulsory numerical',
      examYield: 'must-know'
    },
    {
      id: 'os-3',
      unit: 3,
      category: 'definition',
      front: 'Thrashing & Working Set Model',
      back: '• Thrashing: A condition where CPU spends more time swapping pages in/out than executing processes (Page fault rate spikes, CPU utilization drops to ~0).\n• Solution: Working Set Model (allocate min frames required by process) or Local Page Replacement.',
      hint: 'MST-2 & EST favourite short answer',
      examYield: 'very-high'
    },
    {
      id: 'os-4',
      unit: 4,
      category: 'formula',
      front: 'Effective Memory Access Time (EMAT) with TLB',
      back: 'EMAT = (Hit Ratio * (TLB_time + Mem_time)) + ((1 - Hit Ratio) * (TLB_time + 2 * Mem_time))\n*For 2-level paging, miss requires 3 * Mem_time.',
      hint: 'Numerical in MST-2 Part B',
      examYield: 'must-know'
    }
  ],

  // Database Management Systems
  '22CS302': [
    {
      id: 'dbms-1',
      unit: 1,
      category: 'definition',
      front: 'ACID Properties in Database Transactions',
      back: '• Atomicity: All operations succeed or all roll back (managed by Recovery Manager / Log).\n• Consistency: Database remains in valid state per constraints.\n• Isolation: Concurrent transactions do not interfere (managed by Concurrency Control).\n• Durability: Committed updates survive system crashes (WAL log).',
      hint: 'EST Section A compulsory question',
      examYield: 'must-know'
    },
    {
      id: 'dbms-2',
      unit: 2,
      category: 'theorem',
      front: 'Normal Forms Summary (1NF, 2NF, 3NF, BCNF)',
      back: '• 1NF: Atomic attributes only, no repeating groups.\n• 2NF: 1NF + No partial dependencies (all non-prime attrs fully depend on candidate key).\n• 3NF: 2NF + No transitive dependencies (X → Y, Y non-prime ⇒ X is superkey or Y is prime).\n• BCNF: For every FD X → Y, X MUST be a superkey.',
      hint: 'Decomposition questions in MST-2 (10 marks)',
      examYield: 'must-know'
    },
    {
      id: 'dbms-3',
      unit: 3,
      category: 'shortcut',
      front: 'Strict 2PL vs Rigorous 2PL vs Basic 2PL',
      back: '• Basic 2PL: Growing phase (acquire locks), Shrinking phase (release locks). May suffer cascading aborts.\n• Strict 2PL: Hold Exclusive (X) locks until transaction ends (COMMIT/ABORT). Prevents cascading rollback.\n• Rigorous 2PL: Hold ALL locks (Shared & Exclusive) until COMMIT/ABORT. Guarantees serializability.',
      hint: 'Concurrency control comparisons in EST',
      examYield: 'very-high'
    }
  ],

  // Computer Networks
  '22CS303': [
    {
      id: 'cn-1',
      unit: 1,
      category: 'formula',
      front: 'Stop-and-Wait & Sliding Window Protocol Efficiency',
      back: 'Efficiency η = 1 / (1 + 2a), where a = Propagation Time (Tp) / Transmission Time (Tt)\n• Tp = Distance / Propagation Speed\n• Tt = Packet Size (L) / Bandwidth (B)\n• For Go-Back-N (Window Size N): η = N / (1 + 2a)',
      hint: 'Repeated numerical in MST-1 & EST',
      examYield: 'must-know'
    },
    {
      id: 'cn-2',
      unit: 2,
      category: 'shortcut',
      front: 'IPv4 Subnet Mask & Usable Hosts Formula',
      back: 'For prefix /N:\n• Host bits (h) = 32 - N\n• Total IPs = 2^h\n• Usable Host IPs = (2^h) - 2 (subtract Network ID & Broadcast ID)\n• Subnet mask = N consecutive 1s in binary.',
      hint: 'Standard 5-mark networking question in MST-1',
      examYield: 'must-know'
    },
    {
      id: 'cn-3',
      unit: 3,
      category: 'definition',
      front: 'Count-to-Infinity Problem in Distance Vector Routing',
      back: '• Cause: Routing loops where routers continuously increment hop count when a link fails (split horizon not applied).\n• Solutions:\n  1. Split Horizon (do not advertise route back along the same interface)\n  2. Poison Reverse (advertise cost to unreachable link as ∞ = 16 hops)\n  3. Holddown Timers',
      hint: 'MST-2 Section B repeated question',
      examYield: 'very-high'
    }
  ]
}

/**
 * Returns curated flashcards for a subject code, or generates fallback high-yield cards
 */
export function getFlashcardsForSubject(subjectCode: string, subjectName: string): Flashcard[] {
  const code = (subjectCode || '').trim().toUpperCase()
  if (CURATED_FLASHCARDS[code]) {
    return CURATED_FLASHCARDS[code]
  }

  // Fallback high-yield exam cards adapted for any university subject
  return [
    {
      id: 'gen-1',
      unit: 1,
      category: 'definition',
      front: `Core Principles & Fundamental Assumptions of ${subjectName}`,
      back: `Review the foundational definitions and scope in Unit 1. Pay close attention to standard nomenclature, boundary constraints, and fundamental laws that professor cites in introductory MST-1 lectures.`,
      hint: 'High probability in MST-1 Section A (2 marks)',
      examYield: 'must-know'
    },
    {
      id: 'gen-2',
      unit: 2,
      category: 'theorem',
      front: `Key Governing Theorem & Mathematical Framework (Unit 2)`,
      back: `State statement, prerequisite assumptions, step-by-step mathematical derivation, and physical/computational interpretation. Always draw clear labelled block diagrams for max marks in 10-mark questions.`,
      hint: 'Typical 10-mark question in MST-1 & MST-2',
      examYield: 'must-know'
    },
    {
      id: 'gen-3',
      unit: 3,
      category: 'shortcut',
      front: `Comparison Table: Method A vs Method B in ${subjectName}`,
      back: `Create a clean 5-column comparison table: Parameters, Mechanism, Efficiency/Complexity, Advantages, and Practical Limitations. Evaluators award direct full marks for neat tabular comparisons.`,
      hint: 'Guaranteed 5-mark or 10-mark question in MST-2',
      examYield: 'very-high'
    },
    {
      id: 'gen-4',
      unit: 4,
      category: 'formula',
      front: `EST Master Formula & Verification Checklist (Unit 4)`,
      back: `Double check unit dimensions (SI units), signs (+/- in transfer functions/energy balances), and boundary conditions before finalizing your answer. Verify edge cases (zero/infinity).`,
      hint: 'Crucial for EST Section C numericals',
      examYield: 'high'
    }
  ]
}
