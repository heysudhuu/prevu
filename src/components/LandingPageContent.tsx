'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, Variants, AnimatePresence } from 'framer-motion'
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
  Flame, 
  ChevronRight,
  TrendingUp,
  Zap
} from 'lucide-react'

const Hero3DScene = dynamic(() => import('./animations/Hero3DScene'), { 
  ssr: false,
  loading: () => null
})

const PDFViewerModal = dynamic(() => import('@/components/preview/PDFViewerModal'), {
  ssr: false
})

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
}

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } 
  }
}

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
    { code: '22PCH105', name: 'Communication Skill', pyqs: 9, notes: 6, tag: 'High-Yield', tagColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30', searchQuery: 'Communication Skill', targetSem: 1 },
    { code: '22MTH101', name: 'Mathematics 1', pyqs: 3, notes: 4, tag: 'Foundation', tagColor: 'text-blue-300 bg-blue-500/15 border-blue-500/30', searchQuery: 'Mathematics 1', targetSem: 1 },
    { code: '25CSH-107', name: 'Logical Thinking (LTPS)', pyqs: 5, notes: 5, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Logical Thinking', targetSem: 1 },
    { code: 'CSE', name: 'Engineering Physics', pyqs: 3, notes: 3, tag: 'Foundation', tagColor: 'text-blue-300 bg-blue-500/15 border-blue-500/30', searchQuery: 'Engineering physic', targetSem: 1 }
  ],
  2: [
    { code: '22CS201', name: 'Data Structures & Algorithms', pyqs: 5, notes: 4, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Data Structure', targetSem: 2 },
    { code: '22CS101', name: 'Programming in C', pyqs: 4, notes: 6, tag: 'Practical', tagColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30', searchQuery: 'Programming for Problem Solving' },
    { code: '22PCH101', name: 'Engineering Chemistry', pyqs: 3, notes: 5, tag: 'Foundation', tagColor: 'text-blue-300 bg-blue-500/15 border-blue-500/30', searchQuery: 'Engineering Chemistry' },
    { code: 'CSE', name: 'Digital Electronics', pyqs: 3, notes: 4, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Digital Electronics' }
  ],
  3: [
    { code: '23CSH-242', name: 'Operating System', pyqs: 2, notes: 19, tag: 'MST Hot 🔥', tagColor: 'text-red-300 bg-red-500/15 border-red-500/30', searchQuery: 'Operating System', targetSem: 3 },
    { code: '23CSH-243', name: 'Database Management System', pyqs: 7, notes: 16, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Database Management System', targetSem: 3 },
    { code: '23CSH-241', name: 'Data Structure & ADS', pyqs: 5, notes: 15, tag: 'Essential', tagColor: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30', searchQuery: 'Data Structure', targetSem: 3 },
    { code: '23CST-204', name: 'Computer Org. & Architecture', pyqs: 3, notes: 8, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Computer Organization and Architecture', targetSem: 3 },
    { code: '23CST-247', name: 'Agile Development Methodologies', pyqs: 5, notes: 10, tag: 'MST Hot 🔥', tagColor: 'text-red-300 bg-red-500/15 border-red-500/30', searchQuery: 'Agile Development Methodologies', targetSem: 3 },
    { code: '22CSH-201', name: 'Java Programming & OOPS', pyqs: 7, notes: 14, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Java Programming', targetSem: 3 },
    { code: 'PRACTICE-SHEET', name: 'Probability and Statistics', pyqs: 9, notes: 14, tag: 'High-Yield', tagColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30', searchQuery: 'Probability and Statistics', targetSem: 3 },
    { code: '23CST-237', name: 'Discrete Mathematics', pyqs: 2, notes: 8, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Discrete Mathematics', targetSem: 3 }
  ],
  4: [
    { code: '23CSH-242', name: 'Operating System', pyqs: 4, notes: 19, tag: 'Cycle A/B', tagColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30', searchQuery: 'Operating System' },
    { code: '23CSH-243', name: 'Database Management System', pyqs: 7, notes: 16, tag: 'Cycle A/B', tagColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30', searchQuery: 'Database Management System' },
    { code: 'CSE', name: 'Design & Analysis of Algorithms', pyqs: 3, notes: 12, tag: 'High-Yield', tagColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30', searchQuery: 'Design and Analysis of Algorithms' },
    { code: '23CSH-312', name: 'Computer Network', pyqs: 2, notes: 10, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Computer Network' }
  ],
  5: [
    { code: '23CSH-312', name: 'Computer Network', pyqs: 2, notes: 14, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Computer Network', targetSem: 5 },
    { code: 'CSE', name: 'Design & Analysis of Algorithms', pyqs: 2, notes: 15, tag: 'High-Yield', tagColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30', searchQuery: 'Design and Analysis of Algorithms', targetSem: 5 },
    { code: 'CSE', name: 'Operating System (Adv)', pyqs: 2, notes: 10, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Operating system', targetSem: 5 },
    { code: 'CSE', name: 'Mobile Application Development', pyqs: 1, notes: 8, tag: 'Practical', tagColor: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30', searchQuery: 'Mobile Application Development', targetSem: 5 }
  ],
  6: [
    { code: '22CST-390', name: 'Theory Of Computation (Automata)', pyqs: 3, notes: 12, tag: 'Crucial', tagColor: 'text-rose-300 bg-rose-500/15 border-rose-500/30', searchQuery: 'Theory Of Computation', targetSem: 6 },
    { code: '21CSH-311', name: 'Design and Analysis of Algorithms', pyqs: 1, notes: 10, tag: 'High-Yield', tagColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30', searchQuery: 'Design and Analyis of Algorithms', targetSem: 6 },
    { code: '23CST-304', name: 'Compiler Design', pyqs: 4, notes: 6, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Compiler Design' },
    { code: '23CST-305', name: 'Cloud Computing Architecture', pyqs: 6, notes: 8, tag: 'Industry', tagColor: 'text-sky-300 bg-sky-500/15 border-sky-500/30', searchQuery: 'Cloud Computing' }
  ],
  7: [
    { code: '22CST-354', name: 'Parallel and Distributed Computing', pyqs: 4, notes: 8, tag: 'Core', tagColor: 'text-purple-300 bg-purple-500/15 border-purple-500/30', searchQuery: 'Parallel and Distributed Computing', targetSem: 7 },
    { code: 'FSO-307', name: 'Cyber Security Essentials', pyqs: 1, notes: 6, tag: 'Elective', tagColor: 'text-violet-300 bg-violet-500/15 border-violet-500/30', searchQuery: 'Cyber Security Essentials for Forensics', targetSem: 7 },
    { code: '23CST-401', name: 'Deep Learning & Neural Networks', pyqs: 4, notes: 5, tag: 'Specialization', tagColor: 'text-pink-300 bg-pink-500/15 border-pink-500/30', searchQuery: 'Deep Learning' },
    { code: '23CST-403', name: 'Distributed Systems', pyqs: 3, notes: 4, tag: 'Advanced', tagColor: 'text-orange-300 bg-orange-500/15 border-orange-500/30', searchQuery: 'Distributed Systems' }
  ],
  8: [
    { code: '23CST-405', name: 'Cyber Forensics & Incident Response', pyqs: 7, notes: 5, tag: 'Elective', tagColor: 'text-violet-300 bg-violet-500/15 border-violet-500/30', searchQuery: 'Cyber Forensics' },
    { code: '23CST-406', name: 'Natural Language Processing', pyqs: 9, notes: 8, tag: 'Advanced', tagColor: 'text-orange-300 bg-orange-500/15 border-orange-500/30', searchQuery: 'Natural Language Processing' },
    { code: '23CST-407', name: 'Blockchain Technologies', pyqs: 8, notes: 6, tag: 'Emerging', tagColor: 'text-green-300 bg-green-500/15 border-green-500/30', searchQuery: 'Blockchain' },
    { code: '23CAP-408', name: 'Major Capstone Project Defense', pyqs: 5, notes: 12, tag: 'Final Yr', tagColor: 'text-amber-300 bg-amber-500/15 border-amber-500/30', searchQuery: 'Capstone' }
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
  'Communication Skills'
]

const FEATURE_CARDS = [
  {
    id: 'offline',
    span: 'md:col-span-2',
    icon: WifiOff,
    iconBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
    badge: 'PWA Offline Vault',
    badgeStyle: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    glow: 'bg-cyan-500/8',
    hoverBorder: 'hover:border-cyan-500/50',
    accentLink: 'text-cyan-400 hover:text-white',
    title: 'No Campus Wi-Fi? Study Anywhere.',
    desc: 'Hostel and classroom networks drop right before exams. Prevu caches your saved PDFs into an encrypted client vault — read question papers fully offline.',
    link: '/vault',
    linkText: 'Open Offline Vault',
    meta: 'Zero Mobile Data Required'
  },
  {
    id: 'ai',
    span: '',
    icon: Sparkles,
    iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
    badge: 'AI Blueprint',
    badgeStyle: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    glow: '',
    hoverBorder: 'hover:border-amber-500/50',
    accentLink: 'text-amber-400 hover:text-white',
    title: 'Smart Topic Weightage',
    desc: 'AI-analyzed recurring question patterns across past MST and EST papers so you revise high-yield units first.',
    link: '/exam-prep',
    linkText: 'Targeted Prep Workspace',
    meta: ''
  },
  {
    id: 'verified',
    span: '',
    icon: ShieldCheck,
    iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    badge: 'Admin Verified',
    badgeStyle: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    glow: '',
    hoverBorder: 'hover:border-emerald-500/50',
    accentLink: 'text-emerald-400 hover:text-white',
    title: '100% Verified Submissions',
    desc: 'No blurry photos, corrupted files, or outdated course codes. Every PDF is audited by the Prevu moderation team before going live.',
    link: '/study-material',
    linkText: 'Browse Topper Notes',
    meta: ''
  },
  {
    id: 'bounty',
    span: 'md:col-span-2',
    icon: Users,
    iconBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400',
    badge: 'Batchmate Bounties',
    badgeStyle: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    glow: 'bg-purple-600/8',
    hoverBorder: 'hover:border-purple-500/50',
    accentLink: 'text-purple-400 hover:text-white',
    title: 'Request Missing Papers. Earn Scholar Karma.',
    desc: 'Missing a specific MST-2 paper or tutorial sheet? Post a request. Batchmates receive alerts, upload the paper, and climb the contributor leaderboard.',
    link: '/requests',
    linkText: 'Go to Community Board',
    meta: '🔥 +50 Karma per Upload'
  }
]

export default function LandingPageContent() {
  const router = useRouter()
  const [heroSearch, setHeroSearch] = useState('')
  const [selectedSem, setSelectedSem] = useState<number>(3)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  const demoResource = {
    id: 'demo-os-cst-204',
    exam_year: 2024,
    original_filename: 'Operating_Systems_23CST204_EST_Solved.pdf',
    file_type: 'application/pdf',
    subjects: { name: 'Operating Systems', code: '23CST-204', semester: 4 },
    exam_types: { name: 'EST' },
    users: { name: 'Prevu Academic Team', username: 'prevu_official', cu_verified: true, role: 'admin' },
  }

  const allCourses = Object.entries(SEMESTER_COURSES).flatMap(([sem, list]) => 
    list.map(c => ({ ...c, sem: parseInt(sem) }))
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

  return (
    <main className="flex-1 bg-prevu-bg text-prevu-text">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION                                              */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-28 lg:pb-40 border-b border-prevu-surface-light">
        <div className="absolute inset-0 z-0 grid-pattern opacity-40" />
        
        {/* Aurora glows */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 pointer-events-none"
             style={{ width: '900px', height: '600px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.20) 0%, rgba(139,92,246,0.06) 45%, transparent 70%)' }} />
        <div className="absolute right-0 top-1/4 -z-10 pointer-events-none"
             style={{ width: '400px', height: '400px', background: 'radial-gradient(ellipse, rgba(6,182,212,0.10), transparent)' }} />
        <div className="absolute left-0 bottom-1/4 -z-10 pointer-events-none"
             style={{ width: '350px', height: '350px', background: 'radial-gradient(ellipse, rgba(168,85,247,0.08), transparent)' }} />
        
        <Hero3DScene />

        <motion.div 
          className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-5xl"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Live Badge Pill */}
          <motion.div 
            variants={heroItemVariants}
            className="inline-flex items-center gap-2.5 rounded-full border border-prevu-accent/20 bg-prevu-surface/70 px-5 py-2 text-xs font-semibold text-prevu-text mb-8 shadow-xl shadow-purple-950/30 backdrop-blur-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-prevu-text-muted">Chandigarh University</span>
            <span className="text-prevu-surface-light mx-0.5">•</span>
            <span className="text-prevu-accent-light font-bold">BE-CSE Academic Hub</span>
            <span className="hidden sm:inline text-prevu-surface-light mx-0.5">•</span>
            <span className="hidden sm:inline text-[11px] font-mono text-purple-300/80">2026 Edition</span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            variants={heroItemVariants}
            className="text-5xl sm:text-6xl lg:text-[80px] font-sans font-extrabold tracking-tight text-white mb-4 max-w-4xl leading-[1.04]"
          >
            Study Smarter.{' '}
            <span className="text-gradient-purple">Score Higher.</span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            variants={heroItemVariants}
            className="text-base sm:text-lg font-semibold text-prevu-text-muted/80 mb-4 tracking-wide"
          >
            Verified PYQs &bull; Topper Notes &bull; Peer Bounties
          </motion.p>
          
          {/* Subtitle */}
          <motion.p 
            variants={heroItemVariants}
            className="text-sm sm:text-base text-prevu-text-muted max-w-2xl mb-10 leading-relaxed"
          >
            The centralized engineering repository for Chandigarh University. Access verified Previous Year Questions, high-yield topper notes, and crowdsource missing papers with batchmates.
          </motion.p>
          
          {/* Hero Search */}
          <motion.div 
            variants={heroItemVariants}
            className="w-full max-w-2xl mb-4 relative group"
          >
            <form onSubmit={handleHeroSearch} className="relative">
              <div className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500 -z-10"
                   style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.15), transparent)', filter: 'blur(12px)' }} />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-prevu-text-muted/60 group-focus-within:text-prevu-accent transition-colors duration-200" />
              <input 
                type="text"
                value={heroSearch}
                onChange={e => {
                  setHeroSearch(e.target.value)
                  setIsSearchFocused(true)
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search course code or title (e.g. OS, DAA, DBMS, 23CST-204)..."
                className="w-full pl-14 pr-36 py-4 h-[56px] bg-prevu-surface/90 backdrop-blur-2xl border border-prevu-surface-light hover:border-prevu-accent/40 focus:border-prevu-accent rounded-2xl text-sm text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none transition-all duration-300 shadow-2xl shadow-black/50"
              />
              {heroSearch && (
                <button
                  type="button"
                  onClick={() => { setHeroSearch(''); setIsSearchFocused(false) }}
                  className="absolute right-32 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-prevu-text p-1.5 transition-all active:scale-90 hover:bg-prevu-surface-light rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2.5 top-1/2 -translate-y-1/2 h-10 px-5 text-sm font-bold rounded-xl bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                Search
              </Button>
            </form>

            {/* Autocomplete Dropdown */}
            {isSearchFocused && matchingCourses.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute left-0 right-0 top-full mt-2 bg-prevu-surface/98 backdrop-blur-2xl border border-prevu-surface-light rounded-2xl p-2 shadow-2xl shadow-black/80 z-30 text-left divide-y divide-prevu-surface-light/30"
              >
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-prevu-accent font-bold flex items-center justify-between">
                  <span>Matching Courses</span>
                  <span className="text-prevu-text-muted">Semester Deck</span>
                </div>
                {matchingCourses.map((c) => (
                  <button
                    key={c.code + c.name}
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false)
                      router.push(`/browse?course=${encodeURIComponent(c.code)}`)
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-prevu-surface-elevated flex items-center justify-between text-xs transition-all cursor-pointer text-left group/item"
                  >
                    <div>
                      <span className="font-bold text-white block group-hover/item:text-prevu-accent transition-colors">{c.name}</span>
                      <span className="text-[11px] font-mono text-prevu-text-muted">{c.code}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      Sem {c.sem}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Trending Pills */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mb-10 text-xs"
          >
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase text-prevu-text-muted mr-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-prevu-accent" /> Trending:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickSearch(term)}
                className="px-3 py-1.5 rounded-xl bg-prevu-surface/70 hover:bg-prevu-surface-elevated border border-prevu-surface-light hover:border-prevu-accent/50 text-[11px] text-prevu-text-muted hover:text-white transition-all cursor-pointer"
              >
                {term}
              </button>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto mb-16"
          >
            <Button size="lg" className="px-8 text-sm font-bold shadow-xl shadow-purple-600/30 bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light hover:scale-[1.03] hover:shadow-purple-600/50 transition-all duration-200" asChild>
              <Link href="/browse" className="flex items-center gap-2.5">
                <span>Explore Study Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-7 text-sm font-bold border-prevu-surface-light/80 bg-prevu-surface/50 text-prevu-text-muted hover:bg-prevu-surface-elevated hover:border-prevu-accent/40 hover:text-white hover:scale-[1.02] transition-all duration-200 backdrop-blur-sm" asChild>
              <Link href="/requests" className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Peer Doubt &amp; Bounty Board</span>
              </Link>
            </Button>
          </motion.div>

          {/* Hero Console Preview */}
          <motion.div
            variants={heroItemVariants}
            className="w-full max-w-4xl relative mt-2 mx-auto"
          >
            <div className="absolute -inset-2 rounded-3xl opacity-60 -z-10"
                 style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.20), rgba(6,182,212,0.10), rgba(139,92,246,0.20))', filter: 'blur(20px)' }} />

            <div className="rounded-3xl border border-prevu-surface-light/60 bg-[#0b0b17]/98 backdrop-blur-2xl shadow-2xl overflow-hidden text-left">
              {/* Window Header */}
              <div className="flex items-center justify-between px-5 py-3.5 border-b border-prevu-surface-light/60 bg-prevu-surface/50">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="ml-3 font-mono text-[11px] text-prevu-text-muted/70">prevu.academic.vault // BE-CSE Portal</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Offline Vault Ready
                </span>
              </div>

              {/* Content */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-prevu-surface/40 border border-prevu-surface-light/60 hover:border-amber-500/30 transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">Upcoming Exam</span>
                      <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1">MST-1 Assessment Cycle</h4>
                    <p className="text-xs text-prevu-text-muted">Syllabus: Units 1 &amp; 2</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-prevu-surface-light/40 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">14 Days Left</span>
                    <Link href="/exam-prep" className="text-[11px] font-bold text-prevu-accent hover:text-white flex items-center gap-1 transition-colors">
                      Prep Plan <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                <div className="md:col-span-2 p-5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light/60 hover:border-prevu-accent/40 transition-all duration-300 flex flex-col justify-between group/paper">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/35">EST 2024</span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-500/12 text-amber-300 border border-amber-500/25">⭐ Senior Verified</span>
                      </div>
                      <span className="text-xs font-mono text-prevu-text-muted/70">Sem 4 • Year 2</span>
                    </div>
                    <h4 className="text-base font-bold text-white group-hover/paper:text-prevu-accent transition-colors duration-200 mb-1.5">
                      Operating Systems (23CST-204) — End Semester Theory
                    </h4>
                    <p className="text-xs text-prevu-text-muted leading-relaxed">
                      Includes detailed handwritten answers, CPU scheduling calculations &amp; deadlocks blueprint.
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-prevu-surface-light/40 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-prevu-text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>42 Upvotes • Verified Key</span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setPreviewModalOpen(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-prevu-accent/15 hover:bg-prevu-accent hover:text-white text-purple-200 border border-prevu-accent/35 hover:border-prevu-accent transition-all duration-200 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview Live
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 2. FAST-TRACK SEMESTER CURRICULUM EXPLORER                   */}
      {/* ============================================================ */}
      <section className="py-24 border-b border-prevu-surface-light bg-[#09090f] relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern-sm opacity-25 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
             style={{ width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.07), transparent)', filter: 'blur(80px)' }} />

        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-prevu-accent/10 text-prevu-accent border border-prevu-accent/25 uppercase tracking-wider mb-3">
                <Layers className="w-3.5 h-3.5" />
                <span>Instant Curriculum Access</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Explore by{' '}
                <span className="text-gradient-purple">Semester Deck</span>
              </h2>
              <p className="text-sm text-prevu-text-muted mt-2 max-w-lg leading-relaxed">
                Select your current semester to instantly browse courses, past papers, and revision notes.
              </p>
            </div>

            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-sm font-bold text-prevu-accent hover:text-white transition-colors px-4 py-2.5 rounded-xl bg-prevu-surface border border-prevu-surface-light hover:border-prevu-accent/40 shrink-0"
            >
              <span>View All 8 Semesters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Semester Tabs */}
          <div className="flex items-center gap-2.5 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSem(sem)}
                className={`shrink-0 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer border ${
                  selectedSem === sem
                    ? 'bg-gradient-to-br from-purple-600 to-prevu-accent text-white border-transparent shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-prevu-surface/70 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-accent/30 hover:bg-prevu-surface-elevated'
                }`}
              >
                <span className="block text-[13px]">Sem {sem}</span>
                <span className="block text-[10px] opacity-70 font-mono">Yr {Math.ceil(sem / 2)}</span>
              </button>
            ))}
          </div>

          {/* Course Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSem}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {(SEMESTER_COURSES[selectedSem] || []).map((course, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04, duration: 0.3 }}
                  className="p-5 rounded-2xl bg-prevu-surface/70 border border-prevu-surface-light hover:border-prevu-accent/40 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between group card-hover-lift"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-prevu-accent/10 text-prevu-accent border border-prevu-accent/25">
                        {course.code}
                      </span>
                      <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${course.tagColor}`}>
                        {course.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white group-hover:text-prevu-accent-light transition-colors duration-200 line-clamp-2 leading-snug">
                      {course.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-3.5 text-xs text-prevu-text-muted font-mono">
                      <span className="flex items-center gap-1">
                        <FileText className="w-3 h-3 text-purple-400" />
                        {course.pyqs} PYQs
                      </span>
                      <span className="text-prevu-surface-light">•</span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        {course.notes} Notes
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-prevu-surface-light/50 flex items-center justify-between">
                    <Link
                      href={
                        course.targetSem
                          ? `/browse?sem=${course.targetSem}&search=${encodeURIComponent(course.searchQuery || course.name)}`
                          : `/browse?search=${encodeURIComponent(course.searchQuery || course.name)}`
                      }
                      className="text-xs font-bold text-prevu-accent hover:text-white flex items-center gap-1 transition-colors"
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
                      className="text-xs text-prevu-text-muted hover:text-white transition-colors font-semibold"
                    >
                      Notes →
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. FEATURE BENTO GRID                                        */}
      {/* ============================================================ */}
      <section className="py-28 relative overflow-hidden section-gradient-alt border-b border-prevu-surface-light">
        <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-prevu-accent/10 text-prevu-accent border border-prevu-accent/25 uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Pillars</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-sans font-extrabold tracking-tight text-white mb-4">
              Engineered for{' '}
              <span className="text-gradient-purple">Exam Confidence.</span>
            </h2>
            
            <p className="text-prevu-text-muted text-base leading-relaxed">
              Every tool on Prevu solves a tangible challenge Chandigarh University engineering students face before assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURE_CARDS.map((card, i) => {
              const Icon = card.icon
              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className={`${card.span} p-7 sm:p-8 rounded-3xl bg-prevu-surface/70 border border-prevu-surface-light ${card.hoverBorder} transition-all duration-300 shadow-xl relative overflow-hidden flex flex-col justify-between group card-hover-lift`}
                >
                  {card.glow && (
                    <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-50"
                         style={{ background: card.id === 'offline' ? 'rgba(6,182,212,0.12)' : 'rgba(139,92,246,0.12)' }} />
                  )}
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${card.iconBg} group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold border uppercase tracking-wider ${card.badgeStyle}`}>
                        {card.badge}
                      </span>
                    </div>

                    <h3 className={`${card.span ? 'text-xl sm:text-2xl' : 'text-xl'} font-bold text-white mb-3 leading-snug`}>
                      {card.title}
                    </h3>
                    <p className="text-sm text-prevu-text-muted leading-relaxed max-w-lg">
                      {card.desc}
                    </p>
                  </div>

                  <div className="relative z-10 mt-6 pt-5 border-t border-prevu-surface-light/50 flex items-center justify-between">
                    <Link
                      href={card.link}
                      className={`inline-flex items-center gap-1.5 text-sm font-bold ${card.accentLink} transition-colors duration-200`}
                    >
                      <span>{card.linkText}</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Link>
                    {card.meta && (
                      <span className="text-[11px] font-mono text-prevu-text-muted/80">{card.meta}</span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. FAST-TRACK REVISION CTA STRIP                             */}
      {/* ============================================================ */}
      <section className="py-20 relative overflow-hidden border-b border-prevu-surface-light">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(88,28,135,0.15), rgba(7,7,12,1) 40%, rgba(7,7,12,1) 60%, rgba(88,28,135,0.10))' }} />
        <div className="absolute inset-0 grid-pattern-sm opacity-20 pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
             style={{ width: '500px', height: '300px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.10), transparent)', filter: 'blur(80px)' }} />

        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mx-auto mb-6">
            <Flame className="w-7 h-7 text-amber-400" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25 mb-5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast-Track Revision Mode</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
            Cramming for Upcoming Assessments?
          </h2>

          <p className="text-sm sm:text-base text-prevu-text-muted max-w-xl mx-auto leading-relaxed mb-8">
            Switch to the compact Table View in the Study Hub to rapidly preview and download all semester papers in minutes, not hours.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" className="px-8 text-sm font-bold bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light text-white shadow-xl shadow-purple-600/30 hover:scale-[1.03] transition-all" asChild>
              <Link href="/browse">
                <span>Open Instant Study Hub</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="px-7 text-sm font-bold border-prevu-surface-light bg-prevu-surface/50 text-prevu-text-muted hover:text-white hover:border-prevu-accent/30 hover:bg-prevu-surface-elevated transition-all" asChild>
              <Link href="/study-planner">
                <Clock className="w-4 h-4 mr-2 text-purple-400" />
                <span>Personal Study Planner</span>
              </Link>
            </Button>
          </div>

          {/* Trust signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-prevu-text-muted/80">
            {[
              { icon: ShieldCheck, text: 'Admin Verified', color: 'text-emerald-400' },
              { icon: Zap, text: '100% Free Forever', color: 'text-purple-400' },
              { icon: WifiOff, text: 'Offline PWA Vault', color: 'text-cyan-400' },
              { icon: Users, text: '500+ Active Scholars', color: 'text-amber-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                <span>{item.text}</span>
              </div>
            ))}
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
