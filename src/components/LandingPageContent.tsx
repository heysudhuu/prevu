'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Upload, Search, Sparkles, X, BookOpen, Users } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { AnimatedPapersIcon, AnimatedNotesIcon, AnimatedVerifiedIcon, AnimatedCommunityIcon } from './animations/AnimatedIcons'

const Hero3DScene = dynamic(() => import('./animations/Hero3DScene'), { 
  ssr: false,
  loading: () => null
})

// Stagger container and child variants
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
  hidden: { opacity: 0, y: 18 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const } 
  }
}


export default function LandingPageContent() {
  const router = useRouter()
  const [heroSearch, setHeroSearch] = useState('')

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (heroSearch.trim()) {
      router.push(`/browse?search=${encodeURIComponent(heroSearch.trim())}`)
    } else {
      router.push('/browse')
    }
  }

  return (
    <main className="flex-1 bg-prevu-bg text-prevu-text">
      
      {/* ============================================================ */}
      {/* 1. HERO SECTION */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-28 lg:pb-32 border-b border-prevu-surface-light">
        {/* Academic grid & ambient radial glows */}
        <div className="absolute inset-0 z-0 grid-pattern opacity-60" />
        <div className="absolute left-1/2 top-10 -translate-x-1/2 -z-10 h-[450px] w-[650px] rounded-full bg-purple-600/15 blur-[140px] pointer-events-none" />
        <div className="absolute right-10 top-1/3 -z-10 h-[300px] w-[300px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />
        
        {/* 3D Scene */}
        <Hero3DScene />

        <motion.div 
          className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-5xl"
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Top Badge */}
          <motion.div 
            variants={heroItemVariants}
            className="inline-flex items-center gap-2 rounded-full border border-prevu-accent/30 bg-prevu-surface/90 px-4 py-1.5 text-xs font-semibold text-prevu-text mb-6 shadow-lg shadow-prevu-accent/10"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-prevu-text-muted">Chandigarh University</span>
            <span className="text-prevu-surface-light">•</span>
            <span className="text-prevu-accent font-bold">BE-CSE Digital Vault</span>
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            variants={heroItemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight text-white mb-5 max-w-4xl leading-[1.08]"
          >
            Study Smarter.{' '}
            <span className="text-gradient-purple">Together.</span>
            <br className="hidden sm:block" />
            <span className="text-3xl sm:text-5xl lg:text-6xl text-prevu-text-muted font-bold">PYQs, Notes &amp; Peer Help — All in One Place.</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={heroItemVariants}
            className="text-base sm:text-lg text-prevu-text-muted max-w-2xl mb-8 leading-relaxed"
          >
            The only platform where CU students find verified PYQs, request missing papers from batchmates, and share study materials — all admin-moderated, always free.
          </motion.p>
          
          {/* Quick Hero Search Input */}
          <motion.form 
            variants={heroItemVariants}
            onSubmit={handleHeroSearch}
            className="w-full max-w-xl mb-6 relative group"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted group-focus-within:text-prevu-accent transition-colors" />
            <input 
              type="text"
              value={heroSearch}
              onChange={e => setHeroSearch(e.target.value)}
              placeholder="Search by subject or code (e.g. 23CST-201, OS, DBMS)..."
              className="w-full pl-11 pr-28 py-3.5 bg-prevu-surface/95 backdrop-blur-2xl border border-prevu-surface-light hover:border-prevu-accent/50 focus:border-prevu-accent rounded-2xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none transition-all shadow-xl shadow-black/40"
            />
            {heroSearch && (
              <button
                type="button"
                onClick={() => setHeroSearch('')}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-prevu-text p-1 transition-transform active:scale-90"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <Button 
              type="submit" 
              size="sm" 
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 text-xs font-bold rounded-xl"
            >
              Search
            </Button>
          </motion.form>

          {/* Action Buttons — Primary + Secondary Row */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-6"
          >
            {/* PRIMARY */}
            <Button size="lg" className="text-sm px-7 py-3.5 h-auto font-bold shadow-xl shadow-prevu-accent/30 hover:scale-[1.02] transition-transform" asChild>
              <Link href="/browse">
                <span>Browse PYQs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-6 py-3.5 h-auto font-bold border-purple-500/50 bg-purple-500/10 text-purple-200 hover:bg-purple-500/25 hover:border-purple-400 hover:text-white hover:scale-[1.02] transition-all shadow-lg shadow-purple-500/10" asChild>
              <Link href="/requests">
                <Users className="w-4 h-4 text-purple-400" />
                <span>Community Help Board</span>
              </Link>
            </Button>
          </motion.div>

          {/* Secondary Row */}
          <motion.div
            variants={heroItemVariants}
            className="flex flex-wrap items-center justify-center gap-2 mb-7"
          >
            <Link href="/study-material" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-emerald-500/30 bg-emerald-500/8 text-emerald-300 hover:bg-emerald-500/15 text-xs font-semibold transition-all hover:scale-105">
              <BookOpen className="w-3.5 h-3.5" /> Study Notes
            </Link>
            <Link href="/upload" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-prevu-surface-light bg-prevu-surface/60 text-prevu-text-muted hover:text-white hover:border-prevu-accent/40 text-xs font-semibold transition-all hover:scale-105">
              <Upload className="w-3.5 h-3.5" /> Upload & Contribute
            </Link>
            <Link href="/exam-prep" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cyan-500/30 bg-cyan-500/8 text-cyan-300 hover:bg-cyan-500/15 text-xs font-semibold transition-all hover:scale-105">
              <Sparkles className="w-3.5 h-3.5" /> AI Exam Prep
            </Link>
          </motion.div>

          {/* 1-Click Semester Quick Jump Chips */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-wrap items-center justify-center gap-2 max-w-xl"
          >
            <span className="text-xs text-prevu-text-muted font-medium mr-1">Quick Jump:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <Link
                key={sem}
                href={`/browse?sem=${sem}`}
                className="px-3 py-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/70 hover:bg-prevu-surface hover:border-prevu-accent text-xs font-mono font-bold text-prevu-text-muted hover:text-prevu-accent transition-all shadow-sm hover:scale-105 active:scale-95"
              >
                Sem {sem}
              </Link>
            ))}
          </motion.div>

        </motion.div>

        {/* Trust badges */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
          className="container mx-auto px-4 mt-10 max-w-5xl"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {[
              { emoji: '✅', text: 'Admin-verified only', color: 'border-emerald-500/25 bg-emerald-500/8 text-emerald-300' },
              { emoji: '🔒', text: '100% Free, No Paywalls', color: 'border-cyan-500/25 bg-cyan-500/8 text-cyan-300' },
              { emoji: '🎓', text: 'CU Students Only', color: 'border-purple-500/25 bg-purple-500/8 text-purple-300' },
              { emoji: '⚡', text: 'Instant PDF Preview', color: 'border-amber-500/25 bg-amber-500/8 text-amber-300' },
              { emoji: '🤝', text: 'Peer-to-Peer Help', color: 'border-pink-500/25 bg-pink-500/8 text-pink-300' },
            ].map((b, i) => (
              <div key={i} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold ${b.color}`}>
                <span>{b.emoji}</span>
                <span>{b.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

      </section>

      {/* ============================================================ */}
      {/* 2. FEATURE BENTO GRID */}
      {/* ============================================================ */}
      <section className="py-24 relative overflow-hidden section-gradient-alt border-b border-prevu-surface-light">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.15]" style={{backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px'}} />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-prevu-accent/30 to-transparent" />
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          
          <div className="text-center mb-14 max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>What Prevu Offers</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-white">
              Everything to ace your exams.
            </h2>
            
            <p className="text-prevu-text-muted text-sm sm:text-base leading-relaxed">
              Built by CU students, for CU students. We know the panic before MSTs and ESTs — so we built the solution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { 
                title: "Past Year Papers", 
                desc: "Access verified MST 1, MST 2, and EST question papers mapped to exact CU course codes.", 
                icon: <AnimatedPapersIcon />,
                badge: "MST & EST",
                link: "/browse",
                linkText: "Browse Papers"
              },
              { 
                title: "Curated Notes", 
                desc: "High-yield, easy-to-understand notes and revision cheatsheets shared by top seniors and peers.", 
                icon: <AnimatedNotesIcon />,
                badge: "All Years",
                link: "/study-material",
                linkText: "Explore Study Material"
              },
              { 
                title: "Peer Verified", 
                desc: "Every submission is checked for legibility, accurate subject code, and correct semester.", 
                icon: <AnimatedVerifiedIcon />,
                badge: "Admin Checked",
                link: "/subjects",
                linkText: "Explore Subjects"
              },
              { 
                title: "Free Forever", 
                desc: "Knowledge should be open. Prevu has zero paywalls, subscriptions, coin locks, or annoying ads.", 
                icon: <AnimatedCommunityIcon />,
                badge: "No Paywalls",
                link: "/upload",
                linkText: "Contribute Notes"
              }
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="bg-prevu-surface/85 backdrop-blur-xl border border-prevu-surface-light p-6 rounded-2xl relative group overflow-hidden hover:border-prevu-accent/50 shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 bg-prevu-bg rounded-xl flex items-center justify-center border border-prevu-surface-light group-hover:scale-110 group-hover:border-prevu-accent/40 transition-all shadow-inner">
                      {feature.icon}
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-prevu-surface-light text-prevu-text-muted border border-prevu-surface-light">
                      {feature.badge}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-prevu-text mb-2 group-hover:text-prevu-accent transition-colors">
                    {feature.title}
                  </h3>
                  
                  <p className="text-prevu-text-muted text-xs sm:text-sm leading-relaxed mb-4">
                    {feature.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-prevu-surface-light/50">
                  <Link 
                    href={feature.link}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-prevu-accent hover:text-white transition-colors"
                  >
                    <span>{feature.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. HOW IT WORKS */}
      {/* ============================================================ */}
      <section className="py-24 bg-prevu-surface/40 border-b border-prevu-surface-light relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-surface border border-prevu-surface-light text-prevu-text-muted uppercase tracking-wider">
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-white">
              How Prevu Works
            </h2>
            <p className="text-xs sm:text-sm text-prevu-text-muted max-w-md mx-auto">
              From finding papers to helping batchmates — four simple steps.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-purple-500/40 via-cyan-500/40 to-emerald-500/40" />

            {[
              { n: '1', title: 'Search', desc: 'Filter by semester, course code, exam type (MST 1, MST 2, EST), or academic year.', color: 'bg-purple-500/15 border-purple-500/30 text-purple-300', emoji: '🔍' },
              { n: '2', title: 'Preview & Download', desc: 'Open in-browser PDF previews, download instantly, or share to WhatsApp groups.', color: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300', emoji: '📄' },
              { n: '3', title: 'Request Missing Papers', desc: 'Can\'t find what you need? Post a request — batchmates will help you.', color: 'bg-amber-500/15 border-amber-500/30 text-amber-300', emoji: '🙋' },
              { n: '4', title: 'Contribute & Earn Credit', desc: 'Upload PYQs and notes. Get verified contributor status and help your peers succeed.', color: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300', emoji: '🚀' },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className={`relative p-6 rounded-3xl border ${step.color} shadow-xl space-y-3 group text-center`}
              >
                <div className="text-2xl mb-2">{step.emoji}</div>
                <div className={`inline-flex items-center justify-center w-8 h-8 rounded-xl text-sm font-mono font-black border ${step.color} mx-auto group-hover:scale-110 transition-transform`}>
                  {step.n}
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-prevu-accent transition-colors">{step.title}</h3>
                <p className="text-xs text-prevu-text-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
