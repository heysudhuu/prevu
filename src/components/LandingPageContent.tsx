'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { 
  ArrowRight, 
  Search, 
  Sparkles, 
  X, 
  BookOpen, 
  FileText, 
  ShieldCheck, 
  WifiOff, 
  Clock, 
  Eye, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Zap,
  GitBranch,
  GitCommit,
  Terminal,
  Check,
  Star,
  Play,
  RotateCw,
  Cpu,
  Command,
  Activity
} from 'lucide-react'
import InteractiveTerminalConsole from '@/components/terminal/InteractiveTerminalConsole'
import { RealLiveLog, RealPlatformStats, RealPeerReview } from '@/app/actions/homepage'
import { LeaderboardUser } from '@/app/leaderboard/actions'

const PDFViewerModal = dynamic(() => import('@/components/preview/PDFViewerModal'), {
  ssr: false
})

const SEMESTER_COURSES: Record<number, Array<{
  code: string
  name: string
  pyqs: number
  notes: number
  tag: string
  tagColor: string
  searchQuery?: string
  targetSem?: number
}>> = {
  1: [
    { code: '22PCH105', name: 'Communication Skill', pyqs: 9, notes: 6, tag: 'High-Yield', tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', searchQuery: 'Communication Skill', targetSem: 1 },
    { code: '22MTH101', name: 'Mathematics 1', pyqs: 3, notes: 4, tag: 'Foundation', tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30', searchQuery: 'Mathematics 1', targetSem: 1 },
    { code: '25CSH-107', name: 'Logical Thinking (LTPS)', pyqs: 5, notes: 5, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Logical Thinking', targetSem: 1 },
    { code: 'CSE', name: 'Engineering Physics', pyqs: 3, notes: 3, tag: 'Foundation', tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30', searchQuery: 'Engineering physic', targetSem: 1 }
  ],
  2: [
    { code: '22CS201', name: 'Data Structures & Algorithms', pyqs: 5, notes: 4, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Data Structure', targetSem: 2 },
    { code: '22CS101', name: 'Programming in C', pyqs: 4, notes: 6, tag: 'Practical', tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', searchQuery: 'Programming for Problem Solving' },
    { code: '22PCH101', name: 'Engineering Chemistry', pyqs: 3, notes: 5, tag: 'Foundation', tagColor: 'text-blue-400 bg-blue-500/10 border-blue-500/30', searchQuery: 'Engineering Chemistry' },
    { code: 'CSE', name: 'Digital Electronics', pyqs: 3, notes: 4, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Digital Electronics' }
  ],
  3: [
    { code: '23CSH-242', name: 'Operating System', pyqs: 4, notes: 19, tag: 'MST Hot 🔥', tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30', searchQuery: 'Operating System', targetSem: 3 },
    { code: '23CSH-243', name: 'Database Management System', pyqs: 7, notes: 16, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Database Management System', targetSem: 3 },
    { code: '23CSH-241', name: 'Data Structure & ADS', pyqs: 5, notes: 15, tag: 'Essential', tagColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30', searchQuery: 'Data Structure', targetSem: 3 },
    { code: '23CST-204', name: 'Computer Org. & Architecture', pyqs: 3, notes: 8, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Computer Organization and Architecture', targetSem: 3 },
    { code: '23CST-247', name: 'Agile Development Methodologies', pyqs: 5, notes: 10, tag: 'MST Hot 🔥', tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30', searchQuery: 'Agile Development Methodologies', targetSem: 3 },
    { code: '22CSH-201', name: 'Java Programming & OOPS', pyqs: 7, notes: 14, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Java Programming', targetSem: 3 },
    { code: 'PRACTICE-SHEET', name: 'Probability and Statistics', pyqs: 9, notes: 14, tag: 'High-Yield', tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', searchQuery: 'Probability and Statistics', targetSem: 3 },
    { code: '23CST-237', name: 'Discrete Mathematics', pyqs: 2, notes: 8, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Discrete Mathematics', targetSem: 3 }
  ],
  4: [
    { code: '23CSH-242', name: 'Operating System', pyqs: 4, notes: 19, tag: 'Cycle A/B', tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', searchQuery: 'Operating System' },
    { code: '23CSH-243', name: 'Database Management System', pyqs: 7, notes: 16, tag: 'Cycle A/B', tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', searchQuery: 'Database Management System' },
    { code: 'CSE', name: 'Design & Analysis of Algorithms', pyqs: 3, notes: 12, tag: 'High-Yield', tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', searchQuery: 'Design and Analysis of Algorithms' },
    { code: '23CSH-312', name: 'Computer Network', pyqs: 2, notes: 10, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Computer Network' }
  ],
  5: [
    { code: '23CSH-312', name: 'Computer Network', pyqs: 2, notes: 14, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Computer Network', targetSem: 5 },
    { code: 'CSE', name: 'Design & Analysis of Algorithms', pyqs: 2, notes: 15, tag: 'High-Yield', tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', searchQuery: 'Design and Analysis of Algorithms', targetSem: 5 },
    { code: 'CSE', name: 'Operating System (Adv)', pyqs: 2, notes: 10, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Operating system', targetSem: 5 },
    { code: 'CSE', name: 'Mobile Application Development', pyqs: 1, notes: 8, tag: 'Practical', tagColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30', searchQuery: 'Mobile Application Development', targetSem: 5 }
  ],
  6: [
    { code: '22CST-390', name: 'Theory Of Computation (Automata)', pyqs: 3, notes: 12, tag: 'Crucial', tagColor: 'text-rose-400 bg-rose-500/10 border-rose-500/30', searchQuery: 'Theory Of Computation', targetSem: 6 },
    { code: '21CSH-311', name: 'Design and Analysis of Algorithms', pyqs: 1, notes: 10, tag: 'High-Yield', tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', searchQuery: 'Design and Analyis of Algorithms', targetSem: 6 },
    { code: '23CST-304', name: 'Compiler Design', pyqs: 4, notes: 6, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Compiler Design' },
    { code: '23CST-305', name: 'Cloud Computing Architecture', pyqs: 6, notes: 8, tag: 'Industry', tagColor: 'text-sky-400 bg-sky-500/10 border-sky-500/30', searchQuery: 'Cloud Computing' }
  ],
  7: [
    { code: '22CST-354', name: 'Parallel and Distributed Computing', pyqs: 4, notes: 8, tag: 'Core', tagColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30', searchQuery: 'Parallel and Distributed Computing', targetSem: 7 },
    { code: 'FSO-307', name: 'Cyber Security Essentials', pyqs: 1, notes: 6, tag: 'Elective', tagColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30', searchQuery: 'Cyber Security Essentials for Forensics', targetSem: 7 },
    { code: '23CST-401', name: 'Deep Learning & Neural Networks', pyqs: 4, notes: 5, tag: 'Specialization', tagColor: 'text-pink-400 bg-pink-500/10 border-pink-500/30', searchQuery: 'Deep Learning' },
    { code: '23CST-403', name: 'Distributed Systems', pyqs: 3, notes: 4, tag: 'Advanced', tagColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30', searchQuery: 'Distributed Systems' }
  ],
  8: [
    { code: '23CST-405', name: 'Cyber Forensics & Incident Response', pyqs: 7, notes: 5, tag: 'Elective', tagColor: 'text-teal-400 bg-teal-500/10 border-teal-500/30', searchQuery: 'Cyber Forensics' },
    { code: '23CST-406', name: 'Natural Language Processing', pyqs: 9, notes: 8, tag: 'Advanced', tagColor: 'text-orange-400 bg-orange-500/10 border-orange-500/30', searchQuery: 'Natural Language Processing' },
    { code: '23CST-407', name: 'Blockchain Technologies', pyqs: 8, notes: 6, tag: 'Emerging', tagColor: 'text-green-400 bg-green-500/10 border-green-500/30', searchQuery: 'Blockchain' },
    { code: '23CAP-408', name: 'Major Capstone Project Defense', pyqs: 5, notes: 12, tag: 'Final Yr', tagColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30', searchQuery: 'Capstone' }
  ]
}

const POPULAR_SEARCHES = [
  '23CSH-242 Operating System',
  '23CSH-243 DBMS',
  '22CS201 Data Structures',
  '23CST-247 Agile Dev',
  '23CSH-312 Computer Network',
  '22CST-390 Automata',
  'Probability & Stats',
  '22CSH-201 Java OOPS'
]

// Animated Terminal CLI Outputs for the Interactive Console
const TERMINAL_COMMANDS = [
  {
    cmd: 'prevu fetch --semester=3 --verified=true',
    output: [
      '[OK] Cloned cu-academic-vault (ref: origin/main)',
      'Found 4 approved question papers for Sem 3 core',
      '✔ 23CSH-242 Operating Systems (MST-1, EST 2024)',
      '✔ 23CSH-243 Database Management Systems (Solved Key)',
      'Status: All PDFs cached locally in client PWA vault (0ms latency)'
    ]
  },
  {
    cmd: 'git log --oneline -n 3',
    output: [
      '85a87fa (HEAD -> main, origin/main) feat: add 2024 EST solved answer keys',
      '17cc3c9 fix: curriculum left-join enrichment for CSE departments',
      'd206f5f chore: synchronize CBT Arena test question bank with university syllabus'
    ]
  },
  {
    cmd: 'cbt run --exam=APT301 --simulate',
    output: [
      '[INIT] Booting isolated CBT mock environment...',
      '[SECURE] Server-side scored engine active (0% answer leakage)',
      '[TIMER] 30 questions • 45 minutes allotted',
      'Result: Test execution simulated with 100% precision score!'
    ]
  }
]

// Real-time Academic Git Stream logs (simulating live verified downloads)
const LIVE_VAULT_LOGS: RealLiveLog[] = [
  {
    id: 'act-1',
    time: '2m ago',
    hash: '8f3a9e',
    sem: 'CSE Sem 4',
    title: '23CSH-242 Operating Systems EST Solved',
    tag: 'EST Solved',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    uploaderUsername: 'yashasvee',
    uploaderName: 'Yashasvi Dabas',
    cuVerified: true
  },
  {
    id: 'act-2',
    time: '18m ago',
    hash: '4c12d0',
    sem: 'CSE Sem 5',
    title: '21CSH-311 DAA Dynamic Programming Notes',
    tag: 'Topper Notes',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    uploaderUsername: 'sudhu',
    uploaderName: 'Sudhanshu Yadav',
    cuVerified: true
  },
  {
    id: 'act-3',
    time: '1h ago',
    hash: '9e58ba',
    sem: 'CSE Sem 3',
    title: '22CS201 Data Structures AVL Tree Rotations',
    tag: 'MST-1 Solved',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    uploaderUsername: 'py77164961',
    uploaderName: '6 Sigma',
    cuVerified: true
  },
  {
    id: 'act-4',
    time: '3h ago',
    hash: '1a04fd',
    sem: 'CSE Sem 6',
    title: '22CST-390 Theory of Computation Pumping Lemma',
    tag: 'Remedial 80/20',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    uploaderUsername: 'academic_cell',
    uploaderName: 'Prevu Academic Cell',
    cuVerified: true
  }
]

// Engine Performance & Architecture Specs
const ENGINE_SPECS = [
  {
    label: 'Cache Latency',
    val: '0ms Instant',
    desc: 'Local IndexedDB offline PWA vault',
    icon: Zap,
    color: 'text-emerald-400'
  },
  {
    label: 'Leak Protection',
    val: 'Zero Leakage',
    desc: 'CBT mock server-side isolated grading',
    icon: ShieldCheck,
    color: 'text-cyan-400'
  },
  {
    label: 'Verified Answers',
    val: 'Senior Audited',
    desc: 'Handwritten steps & formula derivations',
    icon: Check,
    color: 'text-amber-400'
  },
  {
    label: 'Theme Engine',
    val: '10 Palettes',
    desc: 'Dynamic real-time developer color profiles',
    icon: Sparkles,
    color: 'text-purple-400'
  }
]

interface LandingPageContentProps {
  stats?: RealPlatformStats
  recentLogs?: RealLiveLog[]
  topContributors?: LeaderboardUser[]
  recentPeerReviews?: RealPeerReview[]
}

export default function LandingPageContent({
  stats,
  recentLogs = LIVE_VAULT_LOGS,
  topContributors = [],
  recentPeerReviews = []
}: LandingPageContentProps = {}) {
  const router = useRouter()
  const [heroSearch, setHeroSearch] = useState('')
  const [selectedSem, setSelectedSem] = useState<number>(3)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [cbtOption, setCbtOption] = useState<string | null>('B')
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null)
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number; level: number } | null>(null)
  
  // Interactive Terminal State
  const [activeTab, setActiveTab] = useState(0)
  const [terminalRunning, setTerminalRunning] = useState(false)

  // Trigger command directly in terminal
  const triggerTerminalCmd = (cmd: string) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('terminal-run-cmd', { detail: cmd }))
    }
  }

  // Interactive Mascot Eye Tracking
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [mascotBubble, setMascotBubble] = useState<string | null>(null)

  // Track cursor position for interactive mascot eyes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6
      const y = (e.clientY / window.innerHeight - 0.5) * 4
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const demoResource = {
    id: 'demo-os-cst-204',
    exam_year: 2024,
    original_filename: 'Operating_Systems_23CST204_EST_Solved.pdf',
    file_type: 'application/pdf',
    subjects: { name: 'Operating Systems', code: '23CST-204', semester: 4 },
    exam_types: { name: 'EST' },
    users: { name: 'Prevu Academic Team', username: 'prevu_official', cu_verified: true, role: 'admin' },
  }

  const allCourses = useMemo(() => 
    Object.entries(SEMESTER_COURSES).flatMap(([sem, list]) => 
      list.map(c => ({ ...c, sem: parseInt(sem) }))
    ), []
  )

  const matchingCourses = heroSearch.trim().length >= 1
    ? allCourses.filter(c => 
        c.name.toLowerCase().includes(heroSearch.trim().toLowerCase()) ||
        c.code.toLowerCase().includes(heroSearch.trim().toLowerCase())
      ).slice(0, 5)
    : []

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSearchFocused(false)
    if (heroSearch.trim()) {
      router.push(`/browse?search=${encodeURIComponent(heroSearch.trim())}`)
    } else {
      router.push('/browse')
    }
  }

  const handleQuickSearch = (term: string) => {
    setHeroSearch(term)
    setIsSearchFocused(false)
    router.push(`/browse?search=${encodeURIComponent(term)}`)
  }

  const handleSimulateCbt = () => {
    setCbtOption('B')
    setSimulatedScore(100)
    setTimeout(() => setSimulatedScore(null), 4000)
  }

  const handleRunTerminal = (idx: number) => {
    setActiveTab(idx)
    setTerminalRunning(true)
    setTimeout(() => setTerminalRunning(false), 300)
  }

  const handleMascotClick = () => {
    const bubbles = [
      '$ git commit -m "Academic Ace! 🚀"',
      'origin/main is 100% in sync! ⚡',
      'Vee recommends: Practice CBT tests early! 🎯',
      '107 papers ready in offline vault! 📦'
    ]
    const chosen = bubbles[Math.floor(Math.random() * bubbles.length)]
    setMascotBubble(chosen)
    setTimeout(() => setMascotBubble(null), 3500)
  }

  // 48 columns x 7 days Deterministic GitHub Contribution Grid (Zero Hydration Mismatch)
  const contributionGrid = useMemo(() => {
    const grid: number[][] = []
    for (let c = 0; c < 48; c++) {
      const col: number[] = []
      for (let r = 0; r < 7; r++) {
        // Deterministic pseudo-random seed based on fixed (c, r) coordinates
        const hash = Math.sin(c * 7 + r + 42) * 10000
        const rand = hash - Math.floor(hash)
        const level = rand > 0.82 ? 4 : rand > 0.62 ? 3 : rand > 0.38 ? 2 : rand > 0.18 ? 1 : 0
        col.push(level)
      }
      grid.push(col)
    }
    return grid
  }, [])

  return (
    <main className="flex-1 bg-[#010409] text-[#e6edf3] font-mono selection:bg-emerald-500/30 selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. GITHUB-STYLE MASTER HERO SECTION (TERMINAL GIT)           */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-6 pb-8 lg:pt-8 lg:pb-12 border-b border-[#30363d]/60">
        
        {/* Subtle Isometric Coordinate Grid */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />

        {/* Ambient Emerald Terminal Ambient Glow */}
        <div className="absolute left-1/2 -top-20 -translate-x-1/2 w-[750px] h-[380px] bg-emerald-500/10 blur-[140px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-7xl 2xl:max-w-[1720px] flex flex-col items-center text-center">
          
          {/* Eyebrow Badge Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#30363d] bg-[#161b22]/90 text-xs text-[#7d8590] mb-4 sm:mb-5 hover:border-[#3fb950]/50 transition-colors cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-[#238636] animate-pulse" />
            <span className="text-white font-semibold flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              terminal-git
            </span>
            <span className="text-[#30363d]">|</span>
            <span className="text-emerald-400">git::branch(main) // cu-portal v2.6.0</span>
          </motion.div>

          {/* Terminal Command Line Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-xs sm:text-sm text-[#7d8590] mb-2 sm:mb-3 flex items-center gap-2"
          >
            <span className="text-emerald-400 font-bold">student@prevu-terminal:~$</span>
            <span className="text-white">git checkout -b academic-ace</span>
          </motion.div>

          {/* Master Headline with Blinking Cursor */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-3xl sm:text-5xl lg:text-6xl 2xl:text-[68px] font-extrabold tracking-tight text-white mb-4 sm:mb-5 leading-[1.1] max-w-5xl"
          >
            Academic excellence <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              still starts with you.
            </span>
            <span className="inline-block w-2.5 sm:w-3.5 h-7 sm:h-12 bg-emerald-400 ml-2 animate-pulse align-middle" />
          </motion.h1>

          {/* Terminal Words Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xs sm:text-sm text-[#7d8590] max-w-2xl mb-5 sm:mb-6 leading-relaxed font-mono"
          >
            Open-source university repository for Chandigarh University engineering scholars. Verified question papers, zero-leakage CBT simulators, and collaborative peer git bounties.
          </motion.p>

          {/* Search CTA Box */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="w-full max-w-2xl 2xl:max-w-3xl relative mb-3 sm:mb-4"
          >
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-[#161b22] border border-[#30363d] focus-within:border-[#3fb950] focus-within:ring-2 focus-within:ring-[#3fb950]/20 shadow-2xl transition-all">
              <div className="flex items-center gap-3 px-3.5 py-2 w-full">
                <span className="text-emerald-400 font-bold">$</span>
                <input 
                  type="text"
                  value={heroSearch}
                  onChange={e => {
                    setHeroSearch(e.target.value)
                    setIsSearchFocused(true)
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="prevu search course-code (e.g. 23CSH-242, OS, DAA)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-[#7d8590] focus:outline-none font-mono"
                />
                {heroSearch && (
                  <button
                    type="button"
                    onClick={() => { setHeroSearch(''); setIsSearchFocused(false) }}
                    className="text-[#7d8590] hover:text-white p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                  className="hidden md:inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#7d8590] hover:text-white border border-[#30363d] text-[10px] font-mono shrink-0 transition-all cursor-pointer"
                  title="Open Command Palette (Ctrl+K)"
                >
                  <Command className="w-3 h-3 text-emerald-400" />
                  <span>Ctrl+K</span>
                </button>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 p-1 sm:p-0">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto px-6 h-10 text-xs font-bold rounded-xl bg-[#238636] hover:bg-[#2ea44f] text-white border border-[#2ea44f]/40 shadow-lg shadow-[#238636]/30 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                >
                  <span>Explore Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </form>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && matchingCourses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute left-0 right-0 top-full mt-2 bg-[#161b22] border border-[#30363d] rounded-2xl p-2 shadow-2xl z-40 text-left divide-y divide-[#30363d]/50"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold flex items-center justify-between">
                  <span>Matched Courses</span>
                  <span className="text-[#7d8590]">Press Enter</span>
                </div>
                {matchingCourses.map((c) => (
                  <button
                    key={c.code + c.name}
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false)
                      router.push(`/browse?course=${encodeURIComponent(c.code)}`)
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-[#21262d] flex items-center justify-between text-xs transition-all cursor-pointer text-left group"
                  >
                    <div>
                      <span className="font-bold text-white block group-hover:text-emerald-400 transition-colors font-mono">{c.name}</span>
                      <span className="text-[11px] font-mono text-[#7d8590]">{c.code}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#21262d] text-emerald-400 border border-[#30363d]">
                      Sem {c.sem}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Quick Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-5">
            <span className="font-mono text-[11px] text-[#7d8590] uppercase font-semibold mr-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" /> Hot:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickSearch(term)}
                className="px-2.5 py-1 rounded-md bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] hover:border-emerald-500/50 text-[11px] text-[#7d8590] hover:text-white transition-all font-mono"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Mobile/Tablet Live Vault Activity Strip */}
          <div className="xl:hidden w-full max-w-2xl px-3 py-1.5 rounded-xl bg-[#161b22] border border-[#30363d] text-[11px] font-mono text-[#7d8590] flex items-center justify-between gap-2 mb-6 overflow-hidden">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
              <span className="text-white font-bold shrink-0">Live:</span>
              <span className="truncate text-emerald-400">CSE Sem 4 fetched 23CSH-242 OS Solved EST (2m ago)</span>
            </div>
            <button 
              type="button" 
              onClick={() => triggerTerminalCmd('neofetch')}
              className="text-[10px] text-cyan-400 hover:underline shrink-0 font-bold"
            >
              $ neofetch &rarr;
            </button>
          </div>

          {/* ============================================================ */}
          {/* LIVE INTERACTIVE TERMINAL WORKBENCH & FLANKS                 */}
          {/* ============================================================ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="w-full max-w-6xl 2xl:max-w-[1720px] grid grid-cols-1 xl:grid-cols-12 gap-5 items-start mb-6"
          >
            {/* Left Flank: Live Vault Activity Stream (Fills the Left Red-Mark Void) */}
            <div className="hidden xl:flex xl:col-span-3 flex-col rounded-2xl bg-[#0d1117] border border-[#30363d] p-3.5 shadow-2xl text-left font-mono">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#30363d]/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">Live Vault Stream</span>
                </div>
                <span className="text-[10px] text-[#7d8590] bg-[#161b22] px-2 py-0.5 rounded border border-[#30363d]">git::live</span>
              </div>

              <div className="space-y-2.5">
                {(recentLogs || LIVE_VAULT_LOGS).slice(0, 4).map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-[#161b22] border border-[#30363d]/50 hover:border-[#30363d] transition-all text-left group">
                    <div className="flex items-center justify-between text-[10px] text-[#7d8590] mb-1">
                      <span className="text-emerald-400 font-bold">{item.sem}</span>
                      <span>{item.time}</span>
                    </div>
                    <p className="text-[11px] text-[#e6edf3] font-medium leading-snug line-clamp-2 group-hover:text-white transition-colors">
                      {item.title}
                    </p>
                    <div className="mt-1.5 flex items-center justify-between text-[9px] text-[#7d8590]">
                      <span className="font-mono text-[#7d8590] group-hover:text-emerald-400/80 transition-colors flex items-center gap-1">
                        @{item.uploaderUsername || 'cu_scholar'}
                        {item.cuVerified && <span className="text-emerald-400" title="CU Verified">✓</span>}
                      </span>
                      <span className={`px-1.5 py-0.2 rounded border font-semibold ${item.color}`}>
                        {item.tag}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Trigger Pill */}
              <div className="mt-3 pt-2.5 border-t border-[#30363d]/60 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => triggerTerminalCmd('status')}
                  className="w-full text-center py-1.5 px-2 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[10px] text-emerald-400 hover:text-emerald-300 font-bold transition-all border border-[#30363d] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Activity className="w-3 h-3" />
                  <span>Inspect Vault Status</span>
                </button>
              </div>
            </div>

            {/* Center: Interactive Terminal Console */}
            <div className="xl:col-span-6 flex justify-center w-full">
              <InteractiveTerminalConsole />
            </div>

            {/* Right Flank: Engine Telemetry & Fast-Runs */}
            <div className="hidden xl:flex xl:col-span-3 flex-col rounded-2xl bg-[#0d1117] border border-[#30363d] p-3.5 shadow-2xl text-left font-mono">
              <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#30363d]/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-[11px] font-bold text-white uppercase tracking-wider">Engine Specs</span>
                </div>
                <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">v2.6.0</span>
              </div>

              <div className="space-y-2">
                {[
                  {
                    label: 'Vault Papers',
                    val: `${stats?.totalPapers || 107}+`,
                    desc: 'Verified past year exam papers',
                    icon: FileText,
                    color: 'text-emerald-400'
                  },
                  {
                    label: 'Campus Scholars',
                    val: `${stats?.totalContributors || 28}+`,
                    desc: 'Active student contributors',
                    icon: Check,
                    color: 'text-cyan-400'
                  },
                  {
                    label: 'Vault Downloads',
                    val: `${(stats?.totalDownloads || 1450).toLocaleString()}+`,
                    desc: 'Local IndexedDB offline PWA vault',
                    icon: Zap,
                    color: 'text-amber-400'
                  },
                  {
                    label: 'Theme Engine',
                    val: '10 Palettes',
                    desc: 'Dynamic real-time developer color profiles',
                    icon: Sparkles,
                    color: 'text-purple-400'
                  }
                ].map((spec) => {
                  const Icon = spec.icon
                  return (
                    <div key={spec.label} className="p-2 rounded-xl bg-[#161b22] border border-[#30363d]/50 hover:border-[#30363d] transition-all">
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-[#7d8590] flex items-center gap-1.5">
                          <Icon className={`w-3 h-3 ${spec.color}`} />
                          {spec.label}
                        </span>
                        <span className={`font-bold ${spec.color}`}>{spec.val}</span>
                      </div>
                      <p className="text-[10px] text-[#7d8590] leading-tight pl-4">
                        {spec.desc}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Quick CLI Shortcuts */}
              <div className="mt-3 pt-2.5 border-t border-[#30363d]/60 space-y-1.5">
                <div className="text-[9px] uppercase tracking-wider text-[#7d8590] font-bold flex items-center justify-between">
                  <span>CLI Fast-Runs</span>
                  <span className="text-emerald-400 font-mono">Click to fire</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => triggerTerminalCmd('neofetch')}
                    className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[10px] text-[#7d8590] hover:text-white border border-[#30363d] transition-colors cursor-pointer text-center"
                  >
                    $ neofetch
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerTerminalCmd('cgpa 8.5')}
                    className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[10px] text-[#7d8590] hover:text-white border border-[#30363d] transition-colors cursor-pointer text-center"
                  >
                    $ cgpa 8.5
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerTerminalCmd('cbt --mock')}
                    className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[10px] text-[#7d8590] hover:text-white border border-[#30363d] transition-colors cursor-pointer text-center"
                  >
                    $ cbt mock
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerTerminalCmd('matrix')}
                    className="p-1 rounded bg-[#21262d] hover:bg-[#30363d] text-[10px] text-[#7d8590] hover:text-white border border-[#30363d] transition-colors cursor-pointer text-center"
                  >
                    $ matrix
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interactive Peeking Vee Mascot with Cursor Tracking */}
          <div className="relative pt-4 flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.15, y: -4 }}
              onClick={handleMascotClick}
              className="cursor-pointer select-none relative z-20 group"
              title="Click Vee the mascot!"
            >
              <div className="w-12 h-10 rounded-t-2xl bg-gradient-to-tr from-purple-600 to-emerald-500 p-1 flex items-center justify-center border-t-2 border-x-2 border-emerald-400/60 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0d1117] rounded-t-xl flex items-center justify-center gap-1.5 px-1.5 relative overflow-hidden">
                  {/* Eye tracking */}
                  <motion.span 
                    animate={{ x: mousePos.x, y: mousePos.y }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" 
                  />
                  <motion.span 
                    animate={{ x: mousePos.x, y: mousePos.y }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee]" 
                  />
                </div>
              </div>

              {/* Dynamic Speech Bubble */}
              {mascotBubble && (
                <motion.span 
                  initial={{ opacity: 0, y: 4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-md bg-[#238636] text-[10px] font-mono text-white whitespace-nowrap shadow-xl border border-emerald-400/40"
                >
                  {mascotBubble}
                </motion.span>
              )}
            </motion.div>
            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. GIT BRANCH CONNECTED SPINE & DUAL CODE CARDS              */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 relative border-b border-[#30363d]/60 bg-[#0d1117]">
        
        {/* Animated Git Signal Pulse Line running down the section */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[1px] bg-gradient-to-b from-emerald-500/40 via-cyan-500/30 to-transparent pointer-events-none hidden lg:block">
          <motion.div 
            animate={{ y: ['0%', '100%'] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="w-1.5 h-8 -ml-[2px] bg-gradient-to-b from-transparent via-emerald-400 to-transparent rounded-full blur-[1px]"
          />
        </div>

        <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[1720px] relative z-10">
          
          {/* Connected Git Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-xs font-mono text-[#7d8590] mb-3">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>git pull origin cu-engineering</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              An ecosystem built for <span className="text-emerald-400">academic agility.</span>
            </h2>
            <p className="text-[#7d8590] text-xs sm:text-sm mt-2 max-w-xl font-mono">
              From verified semester past papers to live CBT practice and peer bounties, everything syncs to your engineering journey.
            </p>
          </div>

          {/* Dual GitHub Showcase Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            
            {/* Showcase Card 1: Verified PYQ Explorer */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(35,134,54,0.15)] transition-all flex flex-col justify-between group">
              <div>
                {/* Code Window Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#30363d]">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="font-mono text-xs text-[#7d8590] ml-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      23CST-204 // Operating_Systems_EST_2024.pdf
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#238636]/20 text-emerald-300 border border-[#238636]/40">
                    verified_key
                  </span>
                </div>

                <div className="space-y-3 font-mono text-xs mb-6">
                  <div className="p-3.5 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#e6edf3] leading-relaxed">
                    <span className="text-emerald-400 font-bold">[MST-1 &bull; Q2.b]</span> Calculate turnaround time for SJF non-preemptive with processes P1(6), P2(8), P3(7), P4(3).
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#7d8590] flex items-center justify-between">
                    <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                      <Check className="w-3.5 h-3.5" /> Full handwritten working included
                    </span>
                    <span className="text-[11px] text-[#7d8590]">42 Upvotes</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-mono">
                  Academic Paper Vault
                </h3>
                <p className="text-xs sm:text-sm text-[#7d8590] leading-relaxed mb-6 font-mono">
                  Browse over 107+ approved question papers with solved theory solutions, numerical derivations, and senior advice.
                </p>
              </div>

              <div className="pt-4 border-t border-[#30363d] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#238636] hover:bg-[#2ea44f] text-white transition-all cursor-pointer font-mono shadow-md shadow-[#238636]/30"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Live Paper</span>
                </button>
                <Link href="/browse" className="text-xs font-mono text-emerald-400 hover:text-white flex items-center gap-1">
                  View all 8 semesters <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Showcase Card 2: Interactive CBT Arena Simulator */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all flex flex-col justify-between group">
              <div>
                {/* Window Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#30363d]">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs text-[#7d8590]">
                      cbt.simulator // APT 301 Speed Math
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> 13:13 Left
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] mb-4 font-mono">
                  <div className="text-[11px] text-[#7d8590] mb-2 flex items-center justify-between">
                    <span>Question 14 of 30</span>
                    <span className="text-cyan-400 font-bold">+1 / -0.25</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white mb-3 leading-relaxed">
                    A train 240m long passes a pole in 24 seconds. How long will it take to pass a platform 650m long?
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'A', text: '65 seconds' },
                      { id: 'B', text: '89 seconds (Correct)' },
                      { id: 'C', text: '100 seconds' },
                      { id: 'D', text: '120 seconds' }
                    ].map(opt => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setCbtOption(opt.id)}
                        className={`p-2.5 rounded-lg border text-left transition-all ${
                          cbtOption === opt.id
                            ? 'bg-[#238636]/20 border-[#2ea44f] text-emerald-300 font-bold shadow-sm'
                            : 'bg-[#161b22] border-[#30363d] text-[#7d8590] hover:text-white'
                        }`}
                      >
                        <span className="font-bold mr-1.5">{opt.id}.</span> {opt.text}
                      </button>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 font-mono">
                  CBT Arena Simulator
                </h3>
                <p className="text-xs sm:text-sm text-[#7d8590] leading-relaxed mb-6 font-mono">
                  Hardware-accelerated exam practice with instantaneous scoring, zero client leakage, and full-length tests.
                </p>
              </div>

              <div className="pt-4 border-t border-[#30363d] flex items-center justify-between">
                <Button
                  onClick={handleSimulateCbt}
                  size="sm"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/40 cursor-pointer font-mono shadow-md shadow-cyan-600/30"
                >
                  {simulatedScore ? '✓ 100% Score Verified!' : 'Simulate 100% Score'}
                </Button>
                <Link href="/cbt" className="text-xs font-mono text-cyan-400 hover:text-white flex items-center gap-1">
                  Launch CBT Arena <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. GITHUB CONTRIBUTION HEATMAP & VELOCITY METRICS            */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 border-b border-[#30363d]/60 bg-[#010409]">
        <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[1720px]">
          
          <div className="p-5 sm:p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <GitCommit className="w-4 h-4 text-emerald-400" />
                  Academic Commit Activity
                </h3>
                <p className="text-xs text-[#7d8590] font-mono mt-0.5">
                  1,450+ verified contributions in the 2025–2026 academic cycle
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#7d8590]">
                <span>Less</span>
                <span className="w-2.5 h-2.5 rounded-sm bg-[#161b22] border border-[#30363d]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#006d32]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#26a641]" />
                <span className="w-2.5 h-2.5 rounded-sm bg-[#39d353]" />
                <span>More</span>
              </div>
            </div>

            {/* Visual 48-column Heatmap */}
            <div className="overflow-x-auto pb-2 scrollbar-hide">
              <div className="flex gap-1 min-w-[700px] justify-between">
                {contributionGrid.map((col, cIdx) => (
                  <div key={cIdx} className="flex flex-col gap-1">
                    {col.map((level, rIdx) => {
                      const colorClass = 
                        level === 4 ? 'bg-[#39d353]' :
                        level === 3 ? 'bg-[#26a641]' :
                        level === 2 ? 'bg-[#006d32]' :
                        level === 1 ? 'bg-[#0e4429]' : 'bg-[#0d1117] border border-[#30363d]/40'
                      return (
                        <div 
                          key={rIdx} 
                          onMouseEnter={() => setHoveredCell({ col: cIdx, row: rIdx, level })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-3 h-3 rounded-sm ${colorClass} transition-transform hover:scale-125 cursor-pointer`}
                          title={`Day commit intensity level: ${level}`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Heatmap Footer: Academic Streak & Cell Inspection */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 pt-3 border-t border-[#30363d]/50 text-xs font-mono text-[#7d8590]">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  42-Day Academic Prep Streak
                </span>
                <span className="text-[#30363d]">•</span>
                <span>Avg 31 contributions / week</span>
              </div>
              <div className="text-xs">
                {hoveredCell ? (
                  <span className="text-white font-medium">
                    Week {hoveredCell.col + 1}, {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][hoveredCell.row]}:{' '}
                    <strong className="text-emerald-400">
                      {hoveredCell.level === 0 ? 'No uploads recorded' : `${hoveredCell.level * 3 + 2} verified paper & notes contributions`}
                    </strong>
                  </span>
                ) : (
                  <span className="text-[#7d8590] hidden sm:inline">Hover over any day square for upload details</span>
                )}
              </div>
            </div>
          </div>

          {/* 3 Real Metric Sparkline Cards with Animated Meters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/40 transition-all flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Verified Past Papers</span>
                <div className="text-3xl font-extrabold text-white mt-1 mb-2 font-mono">{stats?.totalPapers || 107}+ Papers</div>
                <p className="text-xs text-[#7d8590] leading-relaxed">
                  Authentic semester end-term (EST) and mid-term (MST-1 &amp; 2) papers with step-by-step solved student keys.
                </p>
              </div>
              <div className="h-8 mt-4 flex items-end gap-1">
                <div className="w-full h-2 bg-emerald-500/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-emerald-400 rounded-full" 
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-cyan-500/40 transition-all flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Campus Contributors</span>
                <div className="text-3xl font-extrabold text-white mt-1 mb-2 font-mono">{stats?.totalContributors || 28}+ Scholars</div>
                <p className="text-xs text-[#7d8590] leading-relaxed">
                  Active BE-CSE students and department toppers uploading papers and earning community karma.
                </p>
              </div>
              <div className="h-8 mt-4 flex items-end gap-1">
                <div className="w-full h-2 bg-cyan-500/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-cyan-400 rounded-full" 
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-purple-500/40 transition-all flex flex-col justify-between text-left">
              <div>
                <span className="text-xs font-mono uppercase text-purple-400 font-bold">Community Solved Doubts</span>
                <div className="text-3xl font-extrabold text-white mt-1 mb-2 font-mono">{stats?.totalDoubtsSolved || 86}+ Solved</div>
                <p className="text-xs text-[#7d8590] leading-relaxed">
                  Verified derivations, algorithms, and formula proofs vetted by senior scholars and toppers.
                </p>
              </div>
              <div className="h-8 mt-4 flex items-end gap-1">
                <div className="w-full h-2 bg-purple-500/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '92%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full bg-purple-400 rounded-full" 
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. REAL STUDENT DISCUSSIONS & PEER ENDORSEMENTS              */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 border-b border-[#30363d]/60 bg-[#010409]">
        <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[1720px]">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 mb-3">
              <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
              <span>Real Student Discussions &amp; Peer Endorsements</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Backed by Real <span className="text-emerald-400">CU Scholars.</span>
            </h2>
            <p className="text-[#7d8590] text-xs sm:text-sm mt-2 font-mono">
              Authentic study feedback and solved question verification from active engineering batchmates.
            </p>
          </div>

          {/* Real Peer Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            {recentPeerReviews.map((rev) => (
              <div 
                key={rev.id} 
                className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/40 transition-all flex flex-col justify-between text-left group"
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#7d8590] mb-3 pb-2 border-b border-[#30363d]/50">
                    <span className="text-emerald-400 font-bold">{rev.subjectCode}</span>
                    <span>{rev.timeAgo}</span>
                  </div>

                  <p className="text-xs text-[#e6edf3] leading-relaxed mb-4 font-sans">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-[#30363d]/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-sm">
                      {rev.authorName[0]?.toUpperCase() || 'S'}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1 font-mono">
                        <span>@{rev.authorUsername}</span>
                        {rev.cuVerified && (
                          <span className="text-emerald-400 text-[10px]" title="CU Verified Student">✓</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#7d8590] font-mono truncate max-w-[160px]">
                        {rev.role}
                      </div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                    ▲ {rev.upvotes}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Callout Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-[#238636]/20 border border-[#238636]/40 flex items-center justify-center text-[#3fb950] shrink-0">
                <Zap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-white font-bold block">Contribute your exam papers &amp; notes</span>
                <span className="text-[#7d8590] text-[11px]">Earn +25 Karma per approved upload and unlock Campus Legend badges.</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link 
                href="/upload"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#238636] hover:bg-[#2ea44f] text-white font-bold text-xs shadow-md shadow-[#238636]/30 transition-all text-center"
              >
                Upload Paper (+25 Karma)
              </Link>
              <Link 
                href="/leaderboard"
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-[#e6edf3] font-bold text-xs border border-[#30363d] transition-all text-center"
              >
                Leaderboard &rarr;
              </Link>
            </div>
          </div>

          {/* Department badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 text-xs text-[#7d8590] font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              100% Moderated Question Papers
            </span>
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-3.5 h-3.5 text-cyan-400" />
              Encrypted Offline PWA Vault
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Zero-Leakage CBT Engine
            </span>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BOTTOM GITHUB CALL TO ACTION                              */}
      {/* ============================================================ */}
      <section className="py-12 sm:py-16 bg-[#0d1117] relative">
        <div className="container mx-auto px-4 max-w-4xl 2xl:max-w-5xl text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight mb-3">
            Let&apos;s excel from here.
          </h2>
          <p className="text-xs sm:text-sm text-[#7d8590] max-w-lg mx-auto mb-6 font-mono">
            Join hundreds of Chandigarh University engineering scholars studying smarter before exams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Button size="lg" className="w-full sm:w-auto px-7 font-bold bg-[#238636] hover:bg-[#2ea44f] text-white rounded-xl shadow-lg shadow-[#238636]/30 cursor-pointer font-mono" asChild>
              <Link href="/browse" className="flex items-center justify-center gap-2">
                <span>Explore Study Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 font-bold border-[#30363d] bg-[#161b22] text-[#7d8590] hover:text-white hover:border-[#7d8590] rounded-xl cursor-pointer font-mono" asChild>
              <Link href="/cbt">
                <span>Start CBT Arena</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {previewModalOpen && (
        <PDFViewerModal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          resource={demoResource as any}
        />
      )}

    </main>
  )
}
