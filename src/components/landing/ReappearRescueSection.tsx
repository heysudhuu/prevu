'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import {
  ShieldAlert,
  FileText,
  BookOpen,
  Calculator,
  Download,
  Eye,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Clock,
  Flame,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  Target
} from 'lucide-react'

const PDFViewerModal = dynamic(() => import('@/components/preview/PDFViewerModal'), {
  ssr: false
})

// High-Yield Reappear Question Papers (PYQs)
const REAPPEAR_PYQS = [
  {
    id: 'pyq-math1',
    code: '22MAT-101',
    name: 'Engineering Mathematics - I',
    category: 'math',
    sem: 1,
    reappearType: 'EST Remedial 2024 Solved',
    repeatScore: '94% Repeat Rate',
    papersCount: 4,
    solvedStatus: 'Full handwritten step derivations included',
    topics: ['Eigenvalues & Cayley Hamilton', 'Taylor & Maclaurin Series', 'Beta-Gamma Functions', 'Multiple Integrals'],
    sampleQuestion: '[Q3.a] Find Eigen values and verify Cayley-Hamilton theorem for matrix A=[[1,2,0],[0,2,1],[0,0,3]]',
    demoResource: {
      id: 'demo-math-reappear',
      exam_year: 2024,
      original_filename: 'Engineering_Mathematics_I_EST_Remedial_Solved.pdf',
      file_type: 'application/pdf',
      subjects: { name: 'Engineering Mathematics - I', code: '22MAT-101', semester: 1 },
      exam_types: { name: 'EST Remedial' },
      users: { name: 'Prevu Senior Academic Team', username: 'prevu_math', cu_verified: true, role: 'admin' }
    }
  },
  {
    id: 'pyq-os',
    code: '23CSH-242',
    name: 'Operating Systems',
    category: 'systems',
    sem: 4,
    reappearType: 'EST Remedial 2024 Solved',
    repeatScore: '89% Repeat Rate',
    papersCount: 3,
    solvedStatus: 'Step-by-step Gantt charts & algorithm traces',
    topics: ['Banker Algorithm Safety Check', 'SJF & Round Robin Scheduling', 'Page Replacement (FIFO/LRU)', 'Semaphores'],
    sampleQuestion: '[Q2.b] Using Banker algorithm with 5 processes and 3 resource types, determine if system is in safe state.',
    demoResource: {
      id: 'demo-os-reappear',
      exam_year: 2024,
      original_filename: 'Operating_Systems_EST_Remedial_Solved.pdf',
      file_type: 'application/pdf',
      subjects: { name: 'Operating Systems', code: '23CSH-242', semester: 4 },
      exam_types: { name: 'EST Remedial' },
      users: { name: 'Prevu Senior Academic Team', username: 'prevu_os', cu_verified: true, role: 'admin' }
    }
  },
  {
    id: 'pyq-dsa',
    code: '22CS201',
    name: 'Data Structures & Algorithms',
    category: 'algorithms',
    sem: 3,
    reappearType: 'EST Remedial 2024 Solved',
    repeatScore: '91% Repeat Rate',
    papersCount: 4,
    solvedStatus: 'Full tree rotations & graph traces diagrammed',
    topics: ['AVL Tree Rotations (LL, RR, LR, RL)', 'Dijkstra Shortest Path', 'Binary Search Tree Deletion', 'Huffman Codes'],
    sampleQuestion: '[Q4.c] Construct an AVL tree by inserting keys: 21, 26, 30, 9, 4, 14, 28, 18. Show all balance factor rotations.',
    demoResource: {
      id: 'demo-dsa-reappear',
      exam_year: 2024,
      original_filename: 'DSA_22CS201_EST_Remedial_Solved.pdf',
      file_type: 'application/pdf',
      subjects: { name: 'Data Structures & Algorithms', code: '22CS201', semester: 3 },
      exam_types: { name: 'EST Remedial' },
      users: { name: 'Prevu Senior Academic Team', username: 'prevu_dsa', cu_verified: true, role: 'admin' }
    }
  },
  {
    id: 'pyq-toc',
    code: '22CST-390',
    name: 'Theory of Computation (Automata)',
    category: 'theory',
    sem: 6,
    reappearType: 'EST Remedial 2024 Solved',
    repeatScore: '88% Repeat Rate',
    papersCount: 3,
    solvedStatus: 'Full state transition diagrams & formal 5-tuples',
    topics: ['NFA to DFA Subset Construction', 'Pumping Lemma for Regular Languages', 'Pushdown Automata (PDA)', 'Turing Machine'],
    sampleQuestion: '[Q1.b] Design a Turing Machine that accepts the language L = {0^n 1^n 2^n | n >= 1}. Write complete transition table.',
    demoResource: {
      id: 'demo-toc-reappear',
      exam_year: 2024,
      original_filename: 'Automata_TOC_22CST390_EST_Remedial_Solved.pdf',
      file_type: 'application/pdf',
      subjects: { name: 'Theory of Computation', code: '22CST-390', semester: 6 },
      exam_types: { name: 'EST Remedial' },
      users: { name: 'Prevu Senior Academic Team', username: 'prevu_automata', cu_verified: true, role: 'admin' }
    }
  },
  {
    id: 'pyq-dbms',
    code: '23CSH-243',
    name: 'Database Management Systems',
    category: 'systems',
    sem: 4,
    reappearType: 'EST Remedial 2024 Solved',
    repeatScore: '86% Repeat Rate',
    papersCount: 3,
    solvedStatus: 'Step-by-step normal form decomposition verified',
    topics: ['3NF & BCNF Decomposition', 'Serializability Precedence Graph', 'SQL Complex Group By Queries', 'ACID Transactions'],
    sampleQuestion: '[Q3.a] Given R(A,B,C,D,E) and FDs {A->BC, CD->E, B->D, E->A}. Find candidate keys and decompose into BCNF.',
    demoResource: {
      id: 'demo-dbms-reappear',
      exam_year: 2024,
      original_filename: 'DBMS_23CSH243_EST_Remedial_Solved.pdf',
      file_type: 'application/pdf',
      subjects: { name: 'Database Management Systems', code: '23CSH-243', semester: 4 },
      exam_types: { name: 'EST Remedial' },
      users: { name: 'Prevu Senior Academic Team', username: 'prevu_dbms', cu_verified: true, role: 'admin' }
    }
  },
  {
    id: 'pyq-math2',
    code: '22MAT-102',
    name: 'Engineering Mathematics - II',
    category: 'math',
    sem: 2,
    reappearType: 'EST Remedial 2024 Solved',
    repeatScore: '93% Repeat Rate',
    papersCount: 3,
    solvedStatus: 'Laplace transforms & Fourier series with step proofs',
    topics: ['Laplace Transform of Unit Step Function', 'Fourier Series Half Range Expansions', 'First Order ODEs', 'Vector Calculus'],
    sampleQuestion: '[Q2.a] Find the Laplace transform of f(t) = t * e^(-2t) * sin(3t). Show integration by parts steps.',
    demoResource: {
      id: 'demo-math2-reappear',
      exam_year: 2024,
      original_filename: 'Engineering_Mathematics_II_EST_Remedial_Solved.pdf',
      file_type: 'application/pdf',
      subjects: { name: 'Engineering Mathematics - II', code: '22MAT-102', semester: 2 },
      exam_types: { name: 'EST Remedial' },
      users: { name: 'Prevu Senior Academic Team', username: 'prevu_math2', cu_verified: true, role: 'admin' }
    }
  }
]

// Rapid 80/20 Crash Study Materials
const REAPPEAR_STUDY_MATERIALS = [
  {
    id: 'mat-math-formulas',
    title: 'Engineering Mathematics I & II: Guaranteed Derivations & Formula Cheatsheet',
    code: '22MAT-101 / 102',
    category: 'math',
    fileType: 'PDF Document',
    pages: '12 Pages',
    size: '1.8 MB',
    tag: 'One-Night Lifesaver',
    tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    description: 'The exact 8 derivations that repeat in 92% of Reappear exams. Step-by-step formula substitutions and examiner marking criteria.',
    highlights: ['Cayley-Hamilton Proof & Inverse Matrix', 'Beta-Gamma Relationship Proof', 'Laplace Transform of Dirac Delta', 'Green & Gauss Divergence Theorems']
  },
  {
    id: 'mat-os-8020',
    title: 'Operating Systems: 80/20 Passing Blueprint & Solved Numerical Workbook',
    code: '23CSH-242',
    category: 'systems',
    fileType: 'PDF Document',
    pages: '18 Pages',
    size: '2.4 MB',
    tag: 'Guaranteed 40+ Marks',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Covers the only 3 units you need to clear the reappear EST. Complete numericals on CPU Scheduling, Deadlock Banker Algorithm, and Paging.',
    highlights: ['10 Solved Gantt Chart Numericals', 'Banker Algorithm 4-Step Foolproof Method', 'Page Replacement (FIFO, LRU, Optimal)', 'Critical Section & Peterson Solution']
  },
  {
    id: 'mat-toc-patterns',
    title: 'Automata (TOC): 30 High-Probability State Diagrams & Pumping Lemma Guide',
    code: '22CST-390',
    category: 'theory',
    fileType: 'PDF Document',
    pages: '15 Pages',
    size: '2.1 MB',
    tag: 'Formula & Proofs',
    tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    description: 'Master the 5 standard languages that repeat on every remedial test. Includes crystal-clear Turing Machine transitions and CFG derivation trees.',
    highlights: ['DFA/NFA for String Ending with "010"', 'Pumping Lemma 4-Step Contradiction Blueprint', 'PDA for Balanced Parentheses Language', 'Turing Machine 0^n 1^n 2^n Step Guide']
  },
  {
    id: 'mat-dsa-rotations',
    title: 'Data Structures: Tree Rotations, Graph Traversals & Complexity Cheat Sheets',
    code: '22CS201',
    category: 'algorithms',
    fileType: 'PDF Document',
    pages: '22 Pages',
    size: '3.1 MB',
    tag: 'High-Yield Visuals',
    tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: 'Visual step-by-step illustrations of all 4 AVL rotations, Heapify reconstructs, and Dijkstra traces written to guarantee full step marks.',
    highlights: ['AVL Tree LL, RR, LR, RL Rotation Templates', 'Min/Max Heap Build & Delete Operations', 'Dijkstra Matrix Tabulation Method', 'Infix to Postfix Stack Evaluation']
  },
  {
    id: 'mat-dbms-bcnf',
    title: 'DBMS: Normalization Algorithm & SQL Group By / Subquery Master-Sheet',
    code: '23CSH-243',
    category: 'systems',
    fileType: 'PDF Document',
    pages: '14 Pages',
    size: '1.9 MB',
    tag: 'Step-by-Step Proof',
    tagColor: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    description: 'Never lose marks on candidate keys and 3NF/BCNF questions again. Includes 20 repeated university SQL exam queries with output tables.',
    highlights: ['Attribute Closure & Candidate Key Finding', 'Lossless Join & Dependency Preserving 3NF', 'BCNF Decomposition Algorithm', 'Top 15 Solved Exam SQL Queries']
  },
  {
    id: 'mat-net-subnetting',
    title: 'Computer Networks: Subnetting Numericals & OSI / TCP Layer Deep-Dive',
    code: '23CSH-312',
    category: 'systems',
    fileType: 'PDF Document',
    pages: '16 Pages',
    size: '2.2 MB',
    tag: 'High Repeatability',
    tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Fast subnet masking calculations without binary conversion headaches. Complete protocol comparisons and routing algorithm numericals.',
    highlights: ['CIDR / VLSM Subnetting 30-Second Shortcut', 'Distance Vector Routing Count to Infinity', 'Go-Back-N vs Selective Repeat Windowing', 'TCP 3-Way Handshake & Congestion Control']
  }
]

// Reappear Survival Strategy Roadmap & Passing Calculator
const STRATEGY_SUBJECTS = [
  {
    id: 'math1',
    code: '22MAT-101',
    name: 'Engineering Mathematics - I',
    passThreshold: '24 / 60 EST (40 / 100 Overall)',
    highYieldUnits: [
      { unit: 'Unit 1: Matrices & Eigen Values', weight: '20 Marks', effort: 'Medium', tip: 'Cayley-Hamilton theorem + Inverse Matrix verification is 100% compulsory in Section B.' },
      { unit: 'Unit 3: Differential Calculus', weight: '18 Marks', effort: 'Low', tip: 'Maclaurin and Taylor expansion formulas guarantee 8 marks with minimal algebra.' },
      { unit: 'Unit 4: Beta & Gamma Functions', weight: '16 Marks', effort: 'Low', tip: 'Memorize the 4 standard integral transformations; directly repeats from 2022 and 2023.' }
    ],
    dayPlan: [
      { day: 'Day 1 (Hours 1-8)', focus: 'Unit 1 Matrices & Cayley-Hamilton', goal: 'Lock 20 marks by mastering 5 repeated numericals' },
      { day: 'Day 2 (Hours 9-16)', focus: 'Unit 3 & 4 Derivations', goal: 'Memorize Taylor series & Beta-Gamma proofs (16 marks)' },
      { day: 'Day 3 (Hours 17-24)', focus: 'Full Reappear 2024 Solved Paper', goal: 'Simulate 3-hour exam with step-by-step layout' }
    ]
  },
  {
    id: 'os',
    code: '23CSH-242',
    name: 'Operating Systems',
    passThreshold: '24 / 60 EST (40 / 100 Overall)',
    highYieldUnits: [
      { unit: 'Unit 1: Process Management & Scheduling', weight: '22 Marks', effort: 'Low', tip: 'SJF and Round Robin scheduling numericals with Gantt chart appear on every single paper.' },
      { unit: 'Unit 2: Deadlocks & Banker Algorithm', weight: '18 Marks', effort: 'Low', tip: 'Banker algorithm safety check is a guaranteed 10-mark question in Section C.' },
      { unit: 'Unit 4: Memory Management & Paging', weight: '16 Marks', effort: 'Medium', tip: 'FIFO vs LRU page replacement numerical; free 7 marks if you show table steps clearly.' }
    ],
    dayPlan: [
      { day: 'Day 1 (Hours 1-8)', focus: 'Scheduling Gantt Charts & Banker Algorithm', goal: 'Lock 22 marks on guaranteed numericals' },
      { day: 'Day 2 (Hours 9-16)', focus: 'Memory Management (Paging & LRU/FIFO)', goal: 'Master page fault count tables (15 marks)' },
      { day: 'Day 3 (Hours 17-24)', focus: 'Critical Section, Semaphores & Mock Sprint', goal: 'Write down theory definitions & solve 2024 paper' }
    ]
  },
  {
    id: 'toc',
    code: '22CST-390',
    name: 'Theory of Computation (Automata)',
    passThreshold: '24 / 60 EST (40 / 100 Overall)',
    highYieldUnits: [
      { unit: 'Unit 1: Finite Automata & Regular Expressions', weight: '22 Marks', effort: 'Medium', tip: 'Subset construction method (NFA to DFA) and DFA state minimization always appear.' },
      { unit: 'Unit 2: Regular Grammars & Pumping Lemma', weight: '16 Marks', effort: 'Low', tip: 'Pumping lemma proof for L={0^n 1^n} is repeated in 4 out of 5 cycles.' },
      { unit: 'Unit 4: Turing Machines & Decidability', weight: '18 Marks', effort: 'Medium', tip: 'Turing machine for 0^n 1^n or palindrome language with transition table.' }
    ],
    dayPlan: [
      { day: 'Day 1 (Hours 1-8)', focus: 'DFA Design & NFA-to-DFA Subset Construction', goal: 'Build 10 state diagrams & transition tables (20 marks)' },
      { day: 'Day 2 (Hours 9-16)', focus: 'Pumping Lemma & PDA Design', goal: 'Master the 3 standard non-regular language proofs (16 marks)' },
      { day: 'Day 3 (Hours 17-24)', focus: 'Turing Machine Table & Reappear Mock Paper', goal: 'Draw clean transition diagrams for full step credit' }
    ]
  }
]

export default function ReappearRescueSection() {
  const [activeTab, setActiveTab] = useState<'pyqs' | 'materials' | 'strategy'>('pyqs')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedStrategySubject, setSelectedStrategySubject] = useState(STRATEGY_SUBJECTS[0])
  const [previewResource, setPreviewResource] = useState<any | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const filteredPyqs = categoryFilter === 'all'
    ? REAPPEAR_PYQS
    : REAPPEAR_PYQS.filter(p => p.category === categoryFilter)

  const filteredMaterials = categoryFilter === 'all'
    ? REAPPEAR_STUDY_MATERIALS
    : REAPPEAR_STUDY_MATERIALS.filter(m => m.category === categoryFilter)

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2500)
  }

  return (
    <section id="reappear-rescue" className="py-14 sm:py-20 border-b border-[#30363d]/60 bg-[#090d13] relative overflow-hidden font-mono">
      
      {/* Background Ambience Glow */}
      <div className="absolute right-0 top-1/4 w-[500px] h-[350px] bg-amber-500/5 blur-[140px] pointer-events-none" />
      <div className="absolute left-0 bottom-1/4 w-[500px] h-[350px] bg-rose-500/5 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {/* ============================================================ */}
        {/* SECTION HEADER                                               */}
        {/* ============================================================ */}
        <div className="flex flex-col items-center text-center mb-10">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 font-bold mb-4 shadow-lg shadow-amber-500/10">
            <ShieldAlert className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>REAPPEAR & BACKLOG RESCUE BLUEPRINT // HIGH-YIELD EMERGENCY VAULT</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-3">
            Clear Your Backlogs. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-300 to-emerald-400">Fast-Track Remedial Prep.</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#7d8590] max-w-2xl leading-relaxed">
            High-repeatability previous year questions (PYQs), concise 80/20 one-night revision notes, and step-by-step solved derivations engineered to help CU engineering scholars pass on the first remedial attempt.
          </p>

          {/* Master View Switcher Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 p-1.5 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-xl">
            <button
              type="button"
              onClick={() => setActiveTab('pyqs')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'pyqs'
                  ? 'bg-amber-500 text-black shadow-md shadow-amber-500/30 font-extrabold'
                  : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Reappear PYQs & Solved Papers</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === 'pyqs' ? 'bg-black/20 text-black' : 'bg-[#21262d] text-[#7d8590]'}`}>
                {REAPPEAR_PYQS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'materials'
                  ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/30 font-extrabold'
                  : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>80/20 Crash Study Material</span>
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${activeTab === 'materials' ? 'bg-black/20 text-black' : 'bg-[#21262d] text-[#7d8590]'}`}>
                {REAPPEAR_STUDY_MATERIALS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('strategy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'strategy'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30 font-extrabold'
                  : 'text-[#7d8590] hover:text-white hover:bg-[#21262d]'
              }`}
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Pass Calculator & 72h Plan</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/20 text-rose-300 font-bold">
                Survival
              </span>
            </button>
          </div>

          {/* Category Filter Pills (For PYQs and Materials) */}
          {activeTab !== 'strategy' && (
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4 text-xs">
              <span className="text-[11px] text-[#7d8590] flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-amber-400" /> Filter:
              </span>
              {[
                { id: 'all', label: 'All Remedials' },
                { id: 'math', label: 'Math & Foundations' },
                { id: 'systems', label: 'OS & Systems' },
                { id: 'algorithms', label: 'Data Structures' },
                { id: 'theory', label: 'Automata & Theory' }
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer ${
                    categoryFilter === cat.id
                      ? 'bg-[#21262d] text-white border border-amber-500/50 font-bold shadow-sm'
                      : 'bg-[#161b22] text-[#7d8590] hover:text-white border border-[#30363d]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* ============================================================ */}
        {/* TAB 1: REAPPEAR PYQs & SOLVED PAPERS                         */}
        {/* ============================================================ */}
        {activeTab === 'pyqs' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredPyqs.map(paper => (
              <div
                key={paper.id}
                className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-amber-500/50 hover:shadow-[0_0_25px_rgba(245,158,11,0.12)] transition-all flex flex-col justify-between group text-left relative"
              >
                {/* Top Badge Strip */}
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#30363d]/60">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/25 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-400" />
                      {paper.repeatScore}
                    </span>
                    <span className="text-[10px] text-[#7d8590] bg-[#0d1117] px-2 py-0.5 rounded border border-[#30363d]">
                      Sem {paper.sem} Core
                    </span>
                  </div>

                  {/* Course Title */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-300 font-bold">{paper.code}</span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(paper.code)}
                        className="text-[10px] text-[#7d8590] hover:text-white underline cursor-pointer"
                        title="Copy Course Code"
                      >
                        {copiedCode === paper.code ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5 line-clamp-1">
                      {paper.name}
                    </h3>
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 mt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="line-clamp-1">{paper.reappearType}</span>
                    </div>
                  </div>

                  {/* Sample Repeated Question Highlight */}
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/80 text-[#e6edf3] text-xs leading-relaxed mb-4">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#7d8590] mb-1 flex items-center justify-between">
                      <span>Frequent Exam Prompt</span>
                      <span className="text-amber-400">10 Marks</span>
                    </div>
                    <p className="text-[11px] text-[#c9d1d9] italic line-clamp-2">
                      &ldquo;{paper.sampleQuestion}&rdquo;
                    </p>
                  </div>

                  {/* High Yield Sub-topics */}
                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] text-[#7d8590] font-semibold uppercase tracking-wider block">
                      Guaranteed Modules:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {paper.topics.map(t => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-[#21262d] text-[#c9d1d9] border border-[#30363d]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewResource(paper.demoResource)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold transition-all cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview Solved PYQ</span>
                  </button>

                  <Link
                    href={`/browse?search=${encodeURIComponent(paper.code)}`}
                    className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>All {paper.papersCount} Papers</span>
                    <ChevronRight className="w-3 h-3 text-amber-400" />
                  </Link>
                </div>

              </div>
            ))}
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: 80/20 CRASH STUDY MATERIAL                            */}
        {/* ============================================================ */}
        {activeTab === 'materials' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredMaterials.map(mat => (
              <div
                key={mat.id}
                className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 hover:shadow-[0_0_25px_rgba(16,185,129,0.12)] transition-all flex flex-col justify-between group text-left relative"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#30363d]/60">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${mat.tagColor}`}>
                      {mat.tag}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] text-[#7d8590]">
                      <span>{mat.pages}</span>
                      <span>•</span>
                      <span>{mat.size}</span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs text-emerald-400 font-bold">{mat.code}</span>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5 leading-snug">
                      {mat.title}
                    </h3>
                    <p className="text-xs text-[#7d8590] mt-2 leading-relaxed">
                      {mat.description}
                    </p>
                  </div>

                  {/* Highlights checklist */}
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d]/80 mb-4 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#7d8590] block mb-1">
                      Included In This Crash PDF:
                    </span>
                    {mat.highlights.map(h => (
                      <div key={h} className="flex items-center gap-1.5 text-[11px] text-[#c9d1d9]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#30363d]/60 flex items-center justify-between gap-2">
                  <Link
                    href={`/study-material?search=${encodeURIComponent(mat.code)}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Open Study Sheet</span>
                  </Link>

                  <Link
                    href={`/browse?search=${encodeURIComponent(mat.code)}`}
                    className="text-xs text-[#7d8590] hover:text-white transition-colors flex items-center gap-1"
                  >
                    <span>View PYQ Pair</span>
                    <ChevronRight className="w-3 h-3 text-emerald-400" />
                  </Link>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: PASS CALCULATOR & 72-HOUR SURVIVAL ROADMAP            */}
        {/* ============================================================ */}
        {activeTab === 'strategy' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-4xl mx-auto rounded-2xl bg-[#161b22] border border-[#30363d] p-6 sm:p-8 shadow-2xl text-left"
          >
            {/* Subject Selector Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#30363d]">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-1">
                  Step 1: Choose Your Reappear Course
                </span>
                <div className="flex flex-wrap gap-2">
                  {STRATEGY_SUBJECTS.map(subj => (
                    <button
                      key={subj.id}
                      type="button"
                      onClick={() => setSelectedStrategySubject(subj)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedStrategySubject.id === subj.id
                          ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                          : 'bg-[#0d1117] text-[#7d8590] hover:text-white border border-[#30363d]'
                      }`}
                    >
                      {subj.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Pass Target Callout */}
              <div className="p-3 rounded-xl bg-[#0d1117] border border-cyan-500/40 shrink-0">
                <span className="text-[10px] text-[#7d8590] uppercase block">Minimum EST Pass Target</span>
                <span className="text-sm font-extrabold text-cyan-300 font-mono">
                  {selectedStrategySubject.passThreshold}
                </span>
              </div>
            </div>

            {/* Selected Subject Breakdown */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                <span>{selectedStrategySubject.name} ({selectedStrategySubject.code})</span>
              </h3>
              <p className="text-xs text-[#7d8590]">
                Pareto 80/20 analysis: Master these top units to secure 45+ marks with 50% less revision time.
              </p>
            </div>

            {/* High-Yield Units Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {selectedStrategySubject.highYieldUnits.map((unit, uIdx) => (
                <div key={unit.unit} className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-amber-400 font-bold font-mono">Unit Priority #{uIdx + 1}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-bold">
                        {unit.weight}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white mb-2 leading-snug">{unit.unit}</h4>
                    <p className="text-[11px] text-[#7d8590] leading-relaxed mb-3">
                      💡 {unit.tip}
                    </p>
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono font-semibold">
                    Effort: {unit.effort} • High Repeat Probability
                  </div>
                </div>
              ))}
            </div>

            {/* 72-Hour Survival Timeline */}
            <div className="p-5 rounded-xl bg-[#0d1117] border border-[#30363d]">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#30363d]/60">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-400" />
                  <span>72-Hour Reappear Emergency Execution Protocol</span>
                </span>
                <span className="text-[10px] text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30 font-bold">
                  Zero Failure Strategy
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {selectedStrategySubject.dayPlan.map((plan, pIdx) => (
                  <div key={plan.day} className="p-3.5 rounded-lg bg-[#161b22] border border-[#30363d]/60">
                    <span className="text-[10px] font-bold text-amber-400 font-mono block mb-1">
                      {plan.day}
                    </span>
                    <h5 className="text-xs font-bold text-white mb-1.5">{plan.focus}</h5>
                    <p className="text-[11px] text-emerald-400 font-mono">
                      Target: {plan.goal}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Vault Action */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#30363d]/60">
              <span className="text-xs text-[#7d8590]">
                Ready to practice? Load verified solutions for {selectedStrategySubject.code}:
              </span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20"
                  asChild
                >
                  <Link href={`/browse?search=${encodeURIComponent(selectedStrategySubject.code)}`}>
                    <span>Access {selectedStrategySubject.code} Reappear Vault</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </Button>
              </div>
            </div>

          </motion.div>
        )}

        {/* Global Footer Banner for Reappear */}
        <div className="mt-10 p-4 rounded-2xl bg-[#161b22] border border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7d8590]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-white font-bold block">Need a paper not in the Reappear Vault?</span>
              <span className="text-[11px] text-[#7d8590]">Request emergency peer solved papers with guaranteed senior verification within 24 hours.</span>
            </div>
          </div>
          <Link
            href="/requests"
            className="px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-amber-400 hover:text-amber-300 font-bold border border-amber-500/40 transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Post Backlog Bounty</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>

      {/* Live PDF Preview Modal */}
      {previewResource && (
        <PDFViewerModal
          isOpen={!!previewResource}
          onClose={() => setPreviewResource(null)}
          resource={previewResource}
        />
      )}

    </section>
  )
}
