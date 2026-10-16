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
  Download, 
  Eye, 
  CheckCircle2, 
  GraduationCap, 
  Layers, 
  Flame, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react'
import { 
  AnimatedPapersIcon, 
  AnimatedNotesIcon, 
  AnimatedVerifiedIcon, 
  AnimatedCommunityIcon 
} from './animations/AnimatedIcons'

const Hero3DScene = dynamic(() => import('./animations/Hero3DScene'), { 
  ssr: false,
  loading: () => null
})

const PDFViewerModal = dynamic(() => import('@/components/preview/PDFViewerModal'), {
  ssr: false
})

// Stagger container and child variants
const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04
    }
  }
}

const heroItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } 
  }
}

// Curriculum breakdown by semester for the fast-track explorer
const SEMESTER_COURSES: Record<number, Array<{ code: string; name: string; pyqs: number; notes: number; tag: string }>> = {
  1: [
    { code: '23SPH-101', name: 'Engineering Physics', pyqs: 12, notes: 8, tag: 'Foundation' },
    { code: '23SMT-101', name: 'Calculus & Linear Algebra', pyqs: 16, notes: 14, tag: 'High-Yield' },
    { code: '23EET-101', name: 'Basic Electrical Engineering', pyqs: 9, notes: 6, tag: 'Core' },
    { code: '23CST-101', name: 'Programming with C / Python', pyqs: 14, notes: 11, tag: 'Practical' }
  ],
  2: [
    { code: '23SCH-102', name: 'Engineering Chemistry', pyqs: 10, notes: 7, tag: 'Foundation' },
    { code: '23SMT-102', name: 'Differential Equations', pyqs: 14, notes: 12, tag: 'High-Yield' },
    { code: '23CST-102', name: 'Object Oriented Programming', pyqs: 18, notes: 15, tag: 'Core' },
    { code: '23ECT-102', name: 'Digital Electronics Basics', pyqs: 8, notes: 5, tag: 'Core' }
  ],
  3: [
    { code: '23CST-201', name: 'Data Structures & Algorithms', pyqs: 22, notes: 18, tag: 'Essential' },
    { code: '23CST-202', name: 'Digital Logic & Computer Design', pyqs: 14, notes: 9, tag: 'Core' },
    { code: '23SMT-201', name: 'Discrete Mathematical Structures', pyqs: 19, notes: 13, tag: 'High-Yield' },
    { code: '23CST-203', name: 'Computer Architecture & Org.', pyqs: 11, notes: 8, tag: 'Core' }
  ],
  4: [
    { code: '23CST-204', name: 'Operating Systems', pyqs: 24, notes: 19, tag: 'MST Hot' },
    { code: '23CST-205', name: 'Database Management Systems', pyqs: 20, notes: 16, tag: 'Core' },
    { code: '23CST-206', name: 'Design & Analysis of Algorithms', pyqs: 21, notes: 15, tag: 'High-Yield' },
    { code: '23CST-207', name: 'Theory of Computation (Automata)', pyqs: 17, notes: 12, tag: 'Crucial' }
  ],
  5: [
    { code: '23CST-301', name: 'Computer Networks', pyqs: 18, notes: 14, tag: 'Core' },
    { code: '23CST-302', name: 'Software Engineering & Agile', pyqs: 15, notes: 10, tag: 'MST Hot' },
    { code: '23CST-303', name: 'Full-Stack Web Development', pyqs: 13, notes: 11, tag: 'Practical' },
    { code: '23AIT-301', name: 'Artificial Intelligence & ML', pyqs: 17, notes: 16, tag: 'Specialization' }
  ],
  6: [
    { code: '23CST-304', name: 'Compiler Design', pyqs: 14, notes: 10, tag: 'High-Yield' },
    { code: '23CST-305', name: 'Cloud Computing Architecture', pyqs: 16, notes: 12, tag: 'Industry' },
    { code: '23CST-306', name: 'Information & Network Security', pyqs: 12, notes: 9, tag: 'Core' },
    { code: '23DST-301', name: 'Big Data & Data Analytics', pyqs: 15, notes: 13, tag: 'Specialization' }
  ],
  7: [
    { code: '23CST-401', name: 'Deep Learning & Neural Networks', pyqs: 11, notes: 9, tag: 'Advanced' },
    { code: '23CST-402', name: 'DevOps & Site Reliability', pyqs: 9, notes: 7, tag: 'Industry' },
    { code: '23CST-403', name: 'Distributed Systems', pyqs: 10, notes: 8, tag: 'Advanced' },
    { code: '23CST-404', name: 'Internet of Things (IoT)', pyqs: 8, notes: 6, tag: 'Elective' }
  ],
  8: [
    { code: '23CST-405', name: 'Cyber Forensics & Incident Response', pyqs: 7, notes: 5, tag: 'Elective' },
    { code: '23CST-406', name: 'Natural Language Processing', pyqs: 9, notes: 8, tag: 'Advanced' },
    { code: '23CST-407', name: 'Blockchain Technologies', pyqs: 8, notes: 6, tag: 'Emerging' },
    { code: '23CAP-408', name: 'Major Capstone Project Defense', pyqs: 5, notes: 12, tag: 'Final Yr' }
  ]
}

const POPULAR_SEARCHES = [
  'Operating Systems',
  '23CST-201',
  'DAA MST-1',
  'Discrete Maths',
  'DBMS EST 2024',
  'Computer Networks'
]

export default function LandingPageContent() {
  const router = useRouter()
  const [heroSearch, setHeroSearch] = useState('')
  const [selectedSem, setSelectedSem] = useState<number>(4)
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)

  // Demo resource for instant live in-browser preview
  const demoResource = {
    id: 'demo-os-cst-204',
    exam_year: 2024,
    original_filename: 'Operating_Systems_23CST204_EST_Solved.pdf',
    file_type: 'application/pdf',
    subjects: {
      name: 'Operating Systems',
      code: '23CST-204',
      semester: 4,
    },
    exam_types: {
      name: 'EST',
    },
    users: {
      name: 'Prevu Academic Team',
      username: 'prevu_official',
      cu_verified: true,
      role: 'admin',
    },
  }

  // All courses flattened for autocomplete search
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
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-24 lg:pb-32 border-b border-prevu-surface-light">
        {/* Dynamic multi-layered ambient background */}
        <div className="absolute inset-0 z-0 grid-pattern opacity-50" />
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -z-10 h-[500px] w-[750px] rounded-full bg-gradient-to-b from-purple-600/20 via-prevu-accent/10 to-transparent blur-[150px] pointer-events-none" />
        <div className="absolute right-0 top-1/4 -z-10 h-[350px] w-[350px] rounded-full bg-cyan-500/10 blur-[130px] pointer-events-none" />
        
        {/* 3D Scene */}
        <Hero3DScene />

        <motion.div 
          className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-5xl"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Top Academic Tag Pill */}
          <motion.div 
            variants={heroItemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-prevu-accent/30 bg-prevu-surface/90 px-4 py-1.5 text-xs font-semibold text-prevu-text mb-6 shadow-xl shadow-purple-950/20 backdrop-blur-xl"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-prevu-text-muted">Chandigarh University</span>
            <span className="text-prevu-surface-light">•</span>
            <span className="text-prevu-accent font-bold">BE-CSE Academic Intelligence</span>
            <span className="hidden sm:inline text-prevu-surface-light">•</span>
            <span className="hidden sm:inline text-[11px] font-mono text-purple-300">2026 Edition</span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            variants={heroItemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight text-white mb-5 max-w-4xl leading-[1.06]"
          >
            Study Smarter.{' '}
            <span className="text-gradient-purple">Score Higher.</span>
            <br />
            <span className="text-2xl sm:text-4xl lg:text-5xl text-prevu-text-muted font-bold tracking-normal">
              Verified PYQs, Notes &amp; Peer Bounties.
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={heroItemVariants}
            className="text-sm sm:text-base lg:text-lg text-prevu-text-muted max-w-2xl mb-8 leading-relaxed font-normal"
          >
            The centralized engineering repository engineered for Chandigarh University students. Access verified Previous Year Questions, high-yield topper notes, and crowdsource missing papers with batchmates.
          </motion.p>
          
          {/* Quick Hero Search Input with Autocomplete */}
          <motion.div 
            variants={heroItemVariants}
            className="w-full max-w-xl mb-3 relative group"
          >
            <form onSubmit={handleHeroSearch} className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted group-focus-within:text-prevu-accent transition-colors" />
              <input 
                type="text"
                value={heroSearch}
                onChange={e => {
                  setHeroSearch(e.target.value)
                  setIsSearchFocused(true)
                }}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Search by course code or title (e.g. 23CST-201, OS, DAA, DBMS)..."
                className="w-full pl-11 pr-28 py-3.5 bg-prevu-surface/95 backdrop-blur-2xl border border-prevu-surface-light hover:border-prevu-accent/50 focus:border-prevu-accent rounded-2xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none transition-all shadow-2xl shadow-black/60"
              />
              {heroSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setHeroSearch('')
                    setIsSearchFocused(false)
                  }}
                  className="absolute right-24 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-prevu-text p-1 transition-transform active:scale-90"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <Button 
                type="submit" 
                size="sm" 
                className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light shadow-md shadow-purple-600/30"
              >
                Search
              </Button>
            </form>

            {/* Autocomplete Predictive Dropdown */}
            {isSearchFocused && matchingCourses.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-prevu-surface/95 backdrop-blur-2xl border border-prevu-surface-light rounded-2xl p-2 shadow-2xl shadow-black/80 z-30 text-left divide-y divide-prevu-surface-light/40">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-prevu-accent font-bold flex items-center justify-between">
                  <span>Matching Courses</span>
                  <span>Semester Deck</span>
                </div>
                {matchingCourses.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => {
                      setIsSearchFocused(false)
                      router.push(`/browse?course=${encodeURIComponent(c.code)}`)
                    }}
                    className="w-full px-3 py-2.5 rounded-xl hover:bg-prevu-surface-elevated flex items-center justify-between text-xs transition-colors cursor-pointer text-left"
                  >
                    <div>
                      <span className="font-bold text-white block">{c.name}</span>
                      <span className="text-[11px] font-mono text-prevu-text-muted">{c.code}</span>
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      Sem {c.sem}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Popular Trending Search Pills */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-wrap items-center justify-center gap-1.5 max-w-2xl mb-8 text-xs text-prevu-text-muted"
          >
            <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase text-prevu-text-muted mr-1">
              <TrendingUp className="w-3 h-3 text-prevu-accent" /> Trending:
            </span>
            {POPULAR_SEARCHES.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleQuickSearch(term)}
                className="px-2.5 py-1 rounded-lg bg-prevu-surface/80 hover:bg-prevu-surface-elevated border border-prevu-surface-light hover:border-prevu-accent/40 text-[11px] text-prevu-text-muted hover:text-white transition-all cursor-pointer"
              >
                {term}
              </button>
            ))}
          </motion.div>

          {/* Primary Action Buttons */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-12"
          >
            <Button size="lg" className="text-sm px-7 py-3.5 h-auto font-bold shadow-xl shadow-purple-600/25 bg-gradient-to-r from-purple-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light hover:scale-[1.02] transition-transform" asChild>
              <Link href="/browse" className="flex items-center gap-2">
                <span>Explore Study Hub</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-6 py-3.5 h-auto font-bold border-purple-500/40 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400 hover:text-white hover:scale-[1.02] transition-all shadow-lg shadow-purple-950/20" asChild>
              <Link href="/requests" className="flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Peer Doubt &amp; Bounty Board</span>
              </Link>
            </Button>
          </motion.div>

          {/* ============================================================ */}
          {/* HERO PRODUCT PREVIEW CONSOLE (State of the Art Showcase) */}
          {/* ============================================================ */}
          <motion.div
            variants={heroItemVariants}
            className="w-full max-w-4xl relative mt-4 mx-auto"
          >
            {/* Ambient Back Glow */}
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-600/30 via-cyan-500/20 to-purple-600/30 blur-xl opacity-75 -z-10" />

            <div className="rounded-3xl border border-prevu-surface-light bg-[#0e0e15]/95 backdrop-blur-2xl shadow-2xl overflow-hidden text-left">
              {/* Window Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-prevu-surface-light/80 bg-prevu-surface/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-[11px] text-prevu-text-muted">prevu.academic.vault // BE-CSE Portal</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Offline Vault Ready
                  </span>
                </div>
              </div>

              {/* Console Dashboard Preview Content */}
              <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Live Exam Ticker Card */}
                <div className="p-4 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono uppercase text-prevu-accent font-bold">Upcoming Exam</span>
                      <Clock className="w-3.5 h-3.5 text-prevu-accent" />
                    </div>
                    <h4 className="text-sm font-bold text-white">MST-1 Assessment Cycle</h4>
                    <p className="text-xs text-prevu-text-muted mt-0.5">Syllabus: Units 1 &amp; 2</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-prevu-surface-light/60 flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">14 Days Left</span>
                    <Link href="/exam-prep" className="text-[11px] font-bold text-prevu-accent hover:underline flex items-center gap-1">
                      Prep Plan <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Column 2 & 3: Featured Paper Quick Preview Card */}
                <div className="md:col-span-2 p-4 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-accent/50 transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                          EST 2024
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          ⭐ Senior Verified
                        </span>
                      </div>
                      <span className="text-xs font-mono text-prevu-text-muted">Sem 4 • Year 2</span>
                    </div>

                    <h4 className="text-base font-bold text-white hover:text-prevu-accent transition-colors">
                      Operating Systems (23CST-204) — End Semester Theory
                    </h4>
                    <p className="text-xs text-prevu-text-muted mt-1">
                      Includes detailed handwritten answers, CPU scheduling calculations &amp; deadlocks blueprint.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-prevu-surface-light/60 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-prevu-text-muted">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>42 Upvotes • Verified Key</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => setPreviewModalOpen(true)}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-prevu-accent/20 hover:bg-prevu-accent hover:text-white text-purple-200 border border-prevu-accent/40 hover:border-prevu-accent transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> Preview Paper Live
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>
      </section>

      {/* ============================================================ */}
      {/* 2. FAST-TRACK SEMESTER CURRICULUM EXPLORER */}
      {/* ============================================================ */}
      <section className="py-20 border-b border-prevu-surface-light bg-[#0b0b12] relative overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>Instant Curriculum Access</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Explore by Semester Deck
              </h2>
              <p className="text-xs sm:text-sm text-prevu-text-muted mt-1">
                Select your current semester to view standard courses, past papers, and revision notes immediately.
              </p>
            </div>

            <Link
              href="/browse"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-prevu-accent hover:text-white transition-colors"
            >
              <span>View All 8 Semesters</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Semester Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSem(sem)}
                className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border ${
                  selectedSem === sem
                    ? 'bg-prevu-accent text-white border-prevu-accent shadow-lg shadow-purple-600/30 scale-105'
                    : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-accent/40'
                }`}
              >
                <span>Semester {sem}</span>
                <span className="block text-[10px] opacity-75 font-mono">
                  Yr {Math.ceil(sem / 2)}
                </span>
              </button>
            ))}
          </div>

          {/* Active Semester Course Cards Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedSem}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {(SEMESTER_COURSES[selectedSem] || []).map((course, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-prevu-surface/85 border border-prevu-surface-light hover:border-prevu-accent/50 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                        {course.code}
                      </span>
                      <span className="text-[10px] font-mono text-prevu-text-muted bg-prevu-bg px-2 py-0.5 rounded-md border border-prevu-surface-light">
                        {course.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-white group-hover:text-prevu-accent transition-colors line-clamp-2">
                      {course.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-3 text-xs text-prevu-text-muted font-mono">
                      <span>📄 {course.pyqs} PYQs</span>
                      <span>•</span>
                      <span>📚 {course.notes} Notes</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-prevu-surface-light/60 flex items-center justify-between">
                    <Link
                      href={`/browse?sem=${selectedSem}&search=${encodeURIComponent(course.name)}`}
                      className="text-xs font-bold text-prevu-accent hover:text-white flex items-center gap-1 transition-colors"
                    >
                      <span>Find Papers</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      href={`/study-material?sem=${selectedSem}&search=${encodeURIComponent(course.name)}`}
                      className="text-xs font-semibold text-prevu-text-muted hover:text-white transition-colors"
                    >
                      Notes
                    </Link>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. ASYMMETRICAL FEATURE BENTO GRID */}
      {/* ============================================================ */}
      <section className="py-24 relative overflow-hidden section-gradient-alt border-b border-prevu-surface-light">
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Pillars</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-white">
              Engineered for Exam Confidence.
            </h2>
            
            <p className="text-prevu-text-muted text-sm sm:text-base leading-relaxed">
              Every tool on Prevu solves a tangible challenge Chandigarh University engineering students face before assessments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Bento Card 1 (Span 2 cols): Offline-First Vault */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-cyan-500/40 transition-all shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase">
                    PWA Offline Vault
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  No Campus Wi-Fi? Study Anywhere Offline.
                </h3>
                <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed max-w-lg mb-6">
                  Hostel and classroom networks frequently drop right before exams. Prevu caches your saved PDFs directly into an encrypted client vault, letting you read question papers without internet.
                </p>
              </div>

              <div className="pt-4 border-t border-prevu-surface-light/60 flex items-center justify-between">
                <Link
                  href="/vault"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-white transition-colors"
                >
                  <span>Open Offline Vault</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-mono text-prevu-text-muted">Zero Mobile Data Required</span>
              </div>
            </motion.div>

            {/* Bento Card 2 (Span 1 col): AI Exam Blueprint */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 sm:p-8 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase">
                    AI Blueprint
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  Smart Topic Weightage
                </h3>
                <p className="text-xs text-prevu-text-muted leading-relaxed mb-4">
                  AI-analyzed recurring question patterns across past MST and EST papers so you revise high-yield units first.
                </p>
              </div>

              <div className="pt-4 border-t border-prevu-surface-light/60">
                <Link
                  href="/exam-prep"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-white transition-colors"
                >
                  <span>Targeted Prep Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Bento Card 3 (Span 1 col): Senior Verified Answers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 sm:p-8 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-emerald-500/40 transition-all shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase">
                    Admin Checked
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">
                  100% Verified Submissions
                </h3>
                <p className="text-xs text-prevu-text-muted leading-relaxed mb-4">
                  No blurry photos, corrupted files, or outdated course codes. Every PDF is audited by the Prevu moderation team.
                </p>
              </div>

              <div className="pt-4 border-t border-prevu-surface-light/60">
                <Link
                  href="/study-material"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-white transition-colors"
                >
                  <span>Browse Topper Notes</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>

            {/* Bento Card 4 (Span 2 cols): Community Peer Bounties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-purple-500/40 transition-all shadow-xl relative overflow-hidden flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase">
                    Batchmate Bounties
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  Request Missing Papers. Earn Scholar Karma.
                </h3>
                <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed max-w-lg mb-6">
                  Missing a specific MST-2 paper or tutorial sheet? Post a request. Batchmates in your semester receive alerts, upload the paper, and climb the university contributor leaderboard.
                </p>
              </div>

              <div className="pt-4 border-t border-prevu-surface-light/60 flex items-center justify-between">
                <Link
                  href="/requests"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-400 hover:text-white transition-colors"
                >
                  <span>Go to Community Board</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <span className="text-[11px] font-mono text-amber-400">🔥 +50 Karma per Upload</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. EXAM SEASON REVISION CTA STRIP */}
      {/* ============================================================ */}
      <section className="py-16 bg-gradient-to-r from-purple-950/40 via-prevu-surface to-purple-950/40 border-b border-prevu-surface-light relative">
        <div className="container mx-auto px-4 max-w-5xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Fast-Track Revision</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Cramming for Upcoming Assessments?
          </h2>

          <p className="text-xs sm:text-sm text-prevu-text-muted max-w-xl mx-auto leading-relaxed">
            Switch to the compact Table View in the Study Hub to rapidly preview and download all semester papers in minutes.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" className="text-xs font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-xl shadow-purple-600/30" asChild>
              <Link href="/browse">
                <span>Open Instant Study Hub</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-xs font-bold border-prevu-surface-light text-prevu-text-muted hover:text-white" asChild>
              <Link href="/study-planner">
                <span>Personal Study Planner</span>
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Interactive PDF Document Viewer Modal */}
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
