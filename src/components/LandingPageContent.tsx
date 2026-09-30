'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Upload, Search, Sparkles, X, BookOpen } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, Variants } from 'framer-motion'
import { AnimatedPapersIcon, AnimatedNotesIcon, AnimatedVerifiedIcon, AnimatedCommunityIcon } from './animations/AnimatedIcons'
import AboutUsSection from './landing/AboutUsSection'
import CommunityConnect from './landing/CommunityConnect'
import StudentSuggestionBox from './landing/StudentSuggestionBox'

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
            className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-[1.1]"
          >
            The Ultimate Archive for <br className="hidden sm:block" />
            <span className="text-gradient-purple">BE-CSE Question Papers.</span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p 
            variants={heroItemVariants}
            className="text-base sm:text-lg text-prevu-text-muted max-w-2xl mb-8 leading-relaxed"
          >
            Stop endlessly searching chaotic WhatsApp groups. Prevu is your centralized, student-run vault for Previous Year Questions (MST-1, MST-2, EST), semester notes, and exam blueprints for Chandigarh University.
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

          {/* Action Buttons */}
          <motion.div 
            variants={heroItemVariants}
            className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8"
          >
            <Button size="lg" className="text-sm px-6 py-3.5 h-auto font-bold shadow-lg shadow-prevu-accent/25 hover:scale-[1.02] transition-transform" asChild>
              <Link href="/browse">
                <span>Browse Papers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-6 py-3.5 h-auto font-semibold border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 hover:text-white hover:scale-[1.02] transition-transform" asChild>
              <Link href="/study-material">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span>Study Material (All Years)</span>
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-6 py-3.5 h-auto font-semibold border-prevu-surface-light hover:border-prevu-accent/50 hover:scale-[1.02] transition-transform" asChild>
              <Link href="/upload">
                <Upload className="w-4 h-4 text-prevu-accent" />
                <span>Upload Resource</span>
              </Link>
            </Button>
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

        {/* Live Academic Feature Strip */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
          className="container mx-auto px-4 mt-16 max-w-5xl"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light shadow-xl backdrop-blur-xl text-center">
            
            <div className="p-3 hover:scale-105 transition-transform duration-200">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300">8</div>
              <div className="text-xs text-prevu-text-muted font-semibold mt-0.5">Semesters Vault</div>
            </div>

            <div className="p-3 hover:scale-105 transition-transform duration-200">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">100%</div>
              <div className="text-xs text-prevu-text-muted font-semibold mt-0.5">Free & Open</div>
            </div>

            <div className="p-3 hover:scale-105 transition-transform duration-200">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">MST & EST</div>
              <div className="text-xs text-prevu-text-muted font-semibold mt-0.5">CU Exam Patterns</div>
            </div>

            <div className="p-3 hover:scale-105 transition-transform duration-200">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">Instant</div>
              <div className="text-xs text-prevu-text-muted font-semibold mt-0.5">PDF Previews</div>
            </div>

          </div>
        </motion.div>

      </section>

      {/* ============================================================ */}
      {/* 2. FEATURE BENTO GRID */}
      {/* ============================================================ */}
      <section className="py-24 relative overflow-hidden bg-prevu-bg border-b border-prevu-surface-light">
        <div className="container mx-auto px-4 max-w-6xl">
          
          <div className="text-center mb-16 max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Exam Preparation</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-white">
              Everything you need to ace your exams.
            </h2>
            
            <p className="text-prevu-text-muted text-sm sm:text-base leading-relaxed">
              Built by CU students, for CU students. We understand the panic right before MSTs and ESTs. Prevu crowdsources, verifies, and categorizes study materials by subject code and semester.
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
      <section className="py-24 bg-prevu-surface/40 border-b border-prevu-surface-light relative">
        <div className="container mx-auto px-4 max-w-5xl">
          
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-white">
              How Prevu Works
            </h2>
            <p className="text-xs sm:text-sm text-prevu-text-muted max-w-md mx-auto">
              Three seamless steps from finding questions to acing your semester exams.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-purple-500/40 transition-colors shadow-xl space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-lg font-mono font-bold text-purple-300 shadow-md group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">Search & Filter</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Filter instantly by semester, course code (e.g. 23CST-201), exam pattern (MST 1, MST 2, EST), or academic year.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-cyan-500/40 transition-colors shadow-xl space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-lg font-mono font-bold text-cyan-300 shadow-md group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">Preview, Solve & Share</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Open in-browser PDF previews, download with 1-click, or share directly to your WhatsApp study groups.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-emerald-500/40 transition-colors shadow-xl space-y-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg font-mono font-bold text-emerald-300 shadow-md group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">Contribute & Help Peers</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Upload your MST and EST question papers. Earn verified contributor credits and help your batchmates succeed.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ABOUT US & CAMPUS STORY */}
      {/* ============================================================ */}
      <AboutUsSection />

      {/* ============================================================ */}
      {/* 5. OFFICIAL INSTAGRAM & WHATSAPP COMMUNITY */}
      {/* ============================================================ */}
      <CommunityConnect />

      {/* ============================================================ */}
      {/* 6. STUDENT IDEA & SUGGESTION BOX */}
      {/* ============================================================ */}
      <StudentSuggestionBox />

      {/* ============================================================ */}
      {/* 7. FOOTER */}
      {/* ============================================================ */}
      <footer className="py-12 border-t border-prevu-surface-light bg-prevu-surface/80 text-xs text-prevu-text-muted space-y-4">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-semibold text-prevu-text">
            <div className="w-6 h-6 rounded-lg bg-prevu-accent flex items-center justify-center text-white text-xs font-bold">
              P
            </div>
            <span>Prevu</span>
            <span>•</span>
            <span className="text-prevu-accent">Chandigarh University BE-CSE Vault</span>
          </div>

          {/* Social Quick Links */}
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a 
              href="https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/25 hover:bg-pink-500/20 transition-colors text-xs font-medium"
            >
              <span>📸 @cu.exclusive</span>
            </a>

            <a 
              href="https://www.instagram.com/cuupdates1?igsi=MTltajU5cGM2YXBwag==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/20 transition-colors text-xs font-medium"
            >
              <span>🤝 @cuupdates1</span>
            </a>

            <a 
              href="https://chat.whatsapp.com/BpwkcISe9Cz327ud2T4IkF?s=cl&p=a&ilr=1&utm_source=ig&utm_medium=social&utm_content=link_in_bio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors text-xs font-medium"
            >
              <span>💬 WhatsApp Community</span>
            </a>
          </div>

          <p>© 2026 Prevu. Student-run academic archive.</p>
        </div>
      </footer>

    </main>
  )
}
