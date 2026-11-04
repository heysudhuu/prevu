'use client'

import { useState, useMemo } from 'react'
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
  Users, 
  FileText, 
  ShieldCheck, 
  WifiOff, 
  Clock, 
  Eye, 
  CheckCircle2, 
  Layers, 
  ChevronRight,
  TrendingUp,
  Zap,
  GitBranch,
  GitCommit,
  GitPullRequest,
  Terminal,
  Check,
  Star
} from 'lucide-react'

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
  'Operating System',
  'DBMS',
  'Data Structure',
  'Agile Methodologies',
  'Computer Network',
  'Theory Of Computation',
  'Probability & Statistics',
  'Java Programming'
]

export default function LandingPageContent() {
  const router = useRouter()
  const [heroSearch, setHeroSearch] = useState('')
  const [selectedSem, setSelectedSem] = useState<number>(3)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [cbtOption, setCbtOption] = useState<string | null>('B')
  const [simulatedScore, setSimulatedScore] = useState<number | null>(null)
  const [mascotWaved, setMascotWaved] = useState(false)

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

  // GitHub contribution activity blocks (52 columns x 7 days)
  const contributionGrid = useMemo(() => {
    const grid: number[][] = []
    for (let c = 0; c < 48; c++) {
      const col: number[] = []
      for (let r = 0; r < 7; r++) {
        // Density pattern mimicking realistic commit activity
        const rand = Math.random()
        const level = rand > 0.85 ? 4 : rand > 0.65 ? 3 : rand > 0.4 ? 2 : rand > 0.2 ? 1 : 0
        col.push(level)
      }
      grid.push(col)
    }
    return grid
  }, [])

  return (
    <main className="flex-1 bg-[#010409] text-[#e6edf3] font-sans selection:bg-[#238636] selection:text-white">
      
      {/* ============================================================ */}
      {/* 1. GITHUB-STYLE HERO SECTION                                 */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32 border-b border-[#30363d]/60">
        
        {/* GitHub Subtle Coordinate Grid Lines */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.07) 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px'
          }}
        />

        {/* GitHub Isometric Subtle Glow */}
        <div className="absolute left-1/2 -top-24 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 max-w-5xl flex flex-col items-center text-center">
          
          {/* Eyebrow Pill */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#30363d] bg-[#161b22]/90 text-xs font-mono text-[#7d8590] mb-8 hover:border-[#3fb950]/50 transition-colors cursor-pointer group"
          >
            <span className="w-2 h-2 rounded-full bg-[#238636] animate-pulse" />
            <span className="text-white font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Prevu 2.0
            </span>
            <span className="text-[#30363d]">|</span>
            <span className="group-hover:text-emerald-400 transition-colors">Software still starts with you</span>
          </motion.div>

          {/* Master Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-[76px] font-extrabold tracking-tight text-white mb-6 leading-[1.08] max-w-4xl"
          >
            Academic excellence <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              still starts with you.
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-[#7d8590] max-w-2xl mb-8 leading-relaxed font-normal"
          >
            The open-source repository for Chandigarh University engineering students. Verified past papers, peer notes, CBT arena simulations, and real-time community solutions.
          </motion.p>

          {/* Search CTA Box */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-2xl relative mb-4"
          >
            <form onSubmit={handleHeroSearch} className="flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl bg-[#161b22] border border-[#30363d] focus-within:border-[#3fb950] focus-within:ring-2 focus-within:ring-[#3fb950]/20 shadow-2xl transition-all">
              <div className="flex items-center gap-3 px-3.5 py-2 w-full">
                <Search className="w-4 h-4 text-[#7d8590] shrink-0" />
                <input 
                  type="text"
                  value={heroSearch}
                  onChange={e => {
                    setHeroSearch(e.target.value)
                    setIsSearchFocused(true)
                  }}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Search course code or title (e.g. 23CST-204, OS, DAA)..."
                  className="w-full bg-transparent text-sm text-white placeholder:text-[#7d8590] focus:outline-none font-mono"
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
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 p-1 sm:p-0">
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto px-6 h-10 text-sm font-bold rounded-xl bg-[#238636] hover:bg-[#2ea44f] text-white border border-[#2ea44f]/40 shadow-lg shadow-[#238636]/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Explore Vault</span>
                  <ArrowRight className="w-4 h-4" />
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
                  <span>Matching Courses</span>
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
                      <span className="font-bold text-white block group-hover:text-emerald-400 transition-colors">{c.name}</span>
                      <span className="text-[11px] font-mono text-[#7d8590]">{c.code}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-md bg-[#21262d] text-emerald-400 border border-[#30363d]">
                      Sem {c.sem}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Quick Trending Tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs mb-10">
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

          {/* Peeking Mascot perched on grid separator */}
          <div className="relative pt-6 flex flex-col items-center">
            <motion.div 
              whileHover={{ scale: 1.15, y: -4 }}
              onClick={() => setMascotWaved(prev => !prev)}
              className="cursor-pointer select-none relative z-20 group"
              title="Click Vee the mascot!"
            >
              <div className="w-12 h-10 rounded-t-2xl bg-gradient-to-tr from-purple-600 to-emerald-500 p-1 flex items-center justify-center border-t-2 border-x-2 border-emerald-400/60 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0d1117] rounded-t-xl flex items-center justify-center gap-1.5 px-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                </div>
              </div>
              {mascotWaved && (
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-[#238636] text-[10px] font-mono text-white whitespace-nowrap shadow-md">
                  Hi Scholar! 👋
                </span>
              )}
            </motion.div>
            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. GIT BRANCH CONNECTED SPINE & REPOSITORY PILLARS           */}
      {/* ============================================================ */}
      <section className="py-20 relative border-b border-[#30363d]/60 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* GitHub Connected Header */}
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161b22] border border-[#30363d] text-xs font-mono text-[#7d8590] mb-4">
              <GitBranch className="w-3.5 h-3.5 text-emerald-400" />
              <span>git pull origin cu-engineering</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              An ecosystem built for <span className="text-emerald-400">academic agility.</span>
            </h2>
            <p className="text-[#7d8590] text-sm sm:text-base mt-3 max-w-xl">
              From verified semester past papers to live CBT practice and peer bounties, everything syncs to your engineering journey.
            </p>
          </div>

          {/* Dual GitHub Showcase Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            
            {/* Showcase Card 1: Verified PYQ Explorer */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 transition-all shadow-xl flex flex-col justify-between group">
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
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#e6edf3]">
                    <span className="text-emerald-400 font-bold">[MST-1 &bull; Q2.b]</span> Calculate turnaround time for SJF non-preemptive with processes P1(6), P2(8), P3(7), P4(3).
                  </div>
                  <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[#7d8590] flex items-center justify-between">
                    <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                      <Check className="w-3.5 h-3.5" /> Full handwritten working included
                    </span>
                    <span className="text-[11px] text-[#7d8590]">42 Upvotes</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Academic Paper Vault
                </h3>
                <p className="text-sm text-[#7d8590] leading-relaxed mb-6">
                  Browse over 107+ approved question papers with solved theory solutions, numerical derivations, and senior advice.
                </p>
              </div>

              <div className="pt-4 border-t border-[#30363d] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#238636] hover:bg-[#2ea44f] text-white transition-all cursor-pointer"
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
            <div className="p-6 sm:p-8 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-cyan-500/50 transition-all shadow-xl flex flex-col justify-between group">
              <div>
                {/* Window Header */}
                <div className="flex items-center justify-between pb-4 mb-5 border-b border-[#30363d]">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="font-mono text-xs text-[#7d8590]">
                      cbt.simulator // APT 301 Speed Math
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-cyan-400" /> 13:13 Left
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#0d1117] border border-[#30363d] mb-4">
                  <div className="text-[11px] font-mono text-[#7d8590] mb-2 flex items-center justify-between">
                    <span>Question 14 of 30</span>
                    <span className="text-cyan-400 font-bold">+1 / -0.25</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-white mb-3">
                    A train 240m long passes a pole in 24 seconds. How long will it take to pass a platform 650m long?
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
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
                            ? 'bg-[#238636]/20 border-[#2ea44f] text-emerald-300 font-bold'
                            : 'bg-[#161b22] border-[#30363d] text-[#7d8590] hover:text-white'
                        }`}
                      >
                        <span className="font-bold mr-1.5">{opt.id}.</span> {opt.text}
                      </button>
                    ))}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  CBT Arena Simulator
                </h3>
                <p className="text-sm text-[#7d8590] leading-relaxed mb-6">
                  Hardware-accelerated exam practice with instantaneous scoring, zero client leakage, and full-length tests.
                </p>
              </div>

              <div className="pt-4 border-t border-[#30363d] flex items-center justify-between">
                <Button
                  onClick={handleSimulateCbt}
                  size="sm"
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white border border-cyan-400/40 cursor-pointer"
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
      <section className="py-20 border-b border-[#30363d]/60 bg-[#010409]">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="p-6 sm:p-8 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl mb-12">
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

            {/* Visual 52-column Heatmap */}
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
                          className={`w-3 h-3 rounded-sm ${colorClass} transition-transform hover:scale-125 cursor-pointer`}
                          title={`Day commit intensity level: ${level}`}
                        />
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 3 Metric Sparkline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/40 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Assessment Pass Rate</span>
                <div className="text-3xl font-extrabold text-white mt-1 mb-2 font-mono">98.4%</div>
                <p className="text-xs text-[#7d8590] leading-relaxed">
                  Students using Prevu verified question blueprints pass MST and EST exams on their first attempt.
                </p>
              </div>
              <div className="h-8 mt-4 flex items-end gap-1">
                <div className="w-full h-2 bg-emerald-500/20 rounded-full overflow-hidden">
                  <div className="w-[98%] h-full bg-emerald-400" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-cyan-500/40 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Retrieval Latency</span>
                <div className="text-3xl font-extrabold text-white mt-1 mb-2 font-mono">&lt; 45s</div>
                <p className="text-xs text-[#7d8590] leading-relaxed">
                  Average time for a student to locate, preview, and download full solved course papers.
                </p>
              </div>
              <div className="h-8 mt-4 flex items-end gap-1">
                <div className="w-full h-2 bg-cyan-500/20 rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-cyan-400" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-purple-500/40 transition-all flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono uppercase text-purple-400 font-bold">Active Community</span>
                <div className="text-3xl font-extrabold text-white mt-1 mb-2 font-mono">500+ Peers</div>
                <p className="text-xs text-[#7d8590] leading-relaxed">
                  Active BE-CSE students sharing solved questions, handwritten summaries, and exam bounties.
                </p>
              </div>
              <div className="h-8 mt-4 flex items-end gap-1">
                <div className="w-full h-2 bg-purple-500/20 rounded-full overflow-hidden">
                  <div className="w-[72%] h-full bg-purple-400" />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FAST-TRACK SEMESTER DECK CURRICULUM                       */}
      {/* ============================================================ */}
      <section className="py-20 border-b border-[#30363d]/60 bg-[#0d1117]">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>All 8 Semesters Repository</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Curriculum Deck by Semester
              </h2>
              <p className="text-xs sm:text-sm text-[#7d8590] mt-1">
                Select your current semester to explore verified core courses and exam materials.
              </p>
            </div>

            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-xs font-bold font-mono text-emerald-400 hover:text-white px-4 py-2.5 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/40 transition-all shrink-0"
            >
              <span>Explore All 8 Semesters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Semester Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSem(sem)}
                className={`shrink-0 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                  selectedSem === sem
                    ? 'bg-[#238636] text-white border-[#2ea44f] shadow-lg shadow-[#238636]/30'
                    : 'bg-[#161b22] border-[#30363d] text-[#7d8590] hover:text-white hover:border-[#7d8590]'
                }`}
              >
                <span>Sem {sem}</span>
              </button>
            ))}
          </div>

          {/* Course Repository Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSem}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {(SEMESTER_COURSES[selectedSem] || []).map((course, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/50 shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-[11px] font-bold text-emerald-400">
                        {course.code}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${course.tagColor}`}>
                        {course.tag}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors line-clamp-2 mb-3">
                      {course.name}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-[#7d8590] font-mono mb-4">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-emerald-400" />
                        {course.pyqs} PYQs
                      </span>
                      <span>&bull;</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        {course.notes} Notes
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#30363d] flex items-center justify-between">
                    <Link
                      href={
                        course.targetSem
                          ? `/browse?sem=${course.targetSem}&search=${encodeURIComponent(course.searchQuery || course.name)}`
                          : `/browse?search=${encodeURIComponent(course.searchQuery || course.name)}`
                      }
                      className="text-xs font-mono font-bold text-emerald-400 hover:text-white flex items-center gap-1"
                    >
                      <span>Find Papers</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={
                        course.targetSem
                          ? `/study-material?sem=${course.targetSem}&search=${encodeURIComponent(course.searchQuery || course.name)}`
                          : `/study-material?search=${encodeURIComponent(course.searchQuery || course.name)}`
                      }
                      className="text-xs font-mono text-[#7d8590] hover:text-white"
                    >
                      Notes &rarr;
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 5. GITHUB-STYLE STUDENT QUOTE & TRUST SIGNALS                */}
      {/* ============================================================ */}
      <section className="py-20 border-b border-[#30363d]/60 bg-[#010409]">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          
          <div className="w-12 h-12 rounded-2xl bg-[#161b22] border border-[#30363d] flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <Star className="w-6 h-6 fill-emerald-400/20 text-emerald-400" />
          </div>

          <blockquote className="text-xl sm:text-2xl font-semibold text-white leading-relaxed mb-6">
            &ldquo;Prevu is one of the essential software tools that empower our entire semester batch. We wouldn&apos;t have navigated EST prep without verified answer keys directly from seniors.&rdquo;
          </blockquote>

          <div className="flex flex-col items-center justify-center gap-1 text-sm font-mono">
            <span className="font-bold text-white">Sudhanshu Yadav</span>
            <span className="text-xs text-[#7d8590]">BE-CSE &bull; Rank #1 Campus Contributor &bull; Chandigarh University</span>
          </div>

          {/* Department badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-[#7d8590] font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              100% Moderated Question Papers
            </span>
            <span className="flex items-center gap-1.5">
              <WifiOff className="w-4 h-4 text-cyan-400" />
              Encrypted Offline PWA Vault
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              Zero-Leakage CBT Engine
            </span>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 6. BOTTOM GITHUB CALL TO ACTION                              */}
      {/* ============================================================ */}
      <section className="py-20 bg-[#0d1117] relative">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Let&apos;s excel from here.
          </h2>
          <p className="text-sm sm:text-base text-[#7d8590] max-w-lg mx-auto mb-8 font-mono">
            Join hundreds of Chandigarh University engineering scholars studying smarter before exams.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Button size="lg" className="w-full sm:w-auto px-8 font-bold bg-[#238636] hover:bg-[#2ea44f] text-white rounded-xl shadow-lg shadow-[#238636]/30 cursor-pointer" asChild>
              <Link href="/browse" className="flex items-center justify-center gap-2">
                <span>Explore Study Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto px-6 font-bold border-[#30363d] bg-[#161b22] text-[#7d8590] hover:text-white hover:border-[#7d8590] rounded-xl cursor-pointer" asChild>
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
