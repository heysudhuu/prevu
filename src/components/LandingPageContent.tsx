'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Upload, Search, Sparkles, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedPapersIcon, AnimatedNotesIcon, AnimatedVerifiedIcon, AnimatedCommunityIcon } from './animations/AnimatedIcons'
import AboutUsSection from './landing/AboutUsSection'
import UpcomingFeaturesRoadmap from './landing/UpcomingFeaturesRoadmap'
import CommunityConnect from './landing/CommunityConnect'
import StudentSuggestionBox from './landing/StudentSuggestionBox'

const Hero3DScene = dynamic(() => import('./animations/Hero3DScene'), { 
  ssr: false,
  loading: () => null
})

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

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center max-w-5xl">
          
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-prevu-accent/30 bg-prevu-surface/90 px-4 py-1.5 text-xs font-semibold text-prevu-text mb-6 shadow-lg shadow-prevu-accent/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-prevu-text-muted">Chandigarh University</span>
            <span className="text-prevu-surface-light">•</span>
            <span className="text-prevu-accent font-bold">BE-CSE Digital Vault</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold tracking-tight text-white mb-6 max-w-4xl leading-[1.1] animate-fade-in">
            The Ultimate Archive for <br className="hidden sm:block" />
            <span className="text-gradient-purple">BE-CSE Question Papers.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg text-prevu-text-muted max-w-2xl mb-8 leading-relaxed animate-fade-in">
            Stop endlessly searching chaotic WhatsApp groups. Prevu is your centralized, student-run vault for Previous Year Questions (MST-1, MST-2, EST), semester notes, and exam blueprints for Chandigarh University.
          </p>
          
          {/* Quick Hero Search Input */}
          <form 
            onSubmit={handleHeroSearch}
            className="w-full max-w-xl mb-6 relative group animate-fade-in"
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
                className="absolute right-24 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-prevu-text p-1"
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
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8 animate-fade-in">
            <Button size="lg" className="text-sm px-6 py-3.5 h-auto font-bold shadow-lg shadow-prevu-accent/25" asChild>
              <Link href="/browse">
                <span>Browse Full Archive</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-6 py-3.5 h-auto font-semibold border-prevu-surface-light hover:border-prevu-accent/50" asChild>
              <Link href="/upload">
                <Upload className="w-4 h-4 text-prevu-accent" />
                <span>Contribute Paper</span>
              </Link>
            </Button>
          </div>

          {/* 1-Click Semester Quick Jump Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl animate-fade-in">
            <span className="text-xs text-prevu-text-muted font-medium mr-1">Quick Jump:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <Link
                key={sem}
                href={`/browse?sem=${sem}`}
                className="px-3 py-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/70 hover:bg-prevu-surface hover:border-prevu-accent text-xs font-mono font-bold text-prevu-text-muted hover:text-prevu-accent transition-all shadow-sm hover:scale-105"
              >
                Sem {sem}
              </Link>
            ))}
          </div>

        </div>

        {/* Live Academic Feature Strip */}
        <div className="container mx-auto px-4 mt-16 max-w-5xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-4 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light shadow-xl backdrop-blur-xl text-center">
            
            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-300">8</div>
              <div className="text-xs text-prevu-text-muted font-semibold mt-0.5">Semesters Vault</div>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">100%</div>
              <div className="text-xs text-prevu-text-muted font-semibold mt-0.5">Free & Open</div>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-cyan-400">MST & EST</div>
              <div className="text-xs text-prevu-text-muted font-semibold mt-0.5">CU Exam Patterns</div>
            </div>

            <div className="p-3">
              <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">Instant</div>
              <div className="text-xs text-prevu-text-muted font-semibold mt-0.5">PDF Previews</div>
            </div>

          </div>
        </div>

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
                badge: "MST & EST"
              },
              { 
                title: "Curated Notes", 
                desc: "High-yield, easy-to-understand notes and revision cheatsheets shared by top seniors and peers.", 
                icon: <AnimatedNotesIcon />,
                badge: "High Yield"
              },
              { 
                title: "Peer Verified", 
                desc: "Every submission is checked for legibility, accurate subject code, and correct semester.", 
                icon: <AnimatedVerifiedIcon />,
                badge: "Admin Checked"
              },
              { 
                title: "Free Forever", 
                desc: "Knowledge should be open. Prevu has zero paywalls, subscriptions, coin locks, or annoying ads.", 
                icon: <AnimatedCommunityIcon />,
                badge: "No Paywalls"
              }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-prevu-surface/85 backdrop-blur-xl border border-prevu-surface-light p-6 rounded-2xl transition-all duration-300 relative group overflow-hidden hover:border-prevu-accent/50 shadow-xl hover:-translate-y-1 flex flex-col justify-between"
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
                  
                  <p className="text-prevu-text-muted text-xs sm:text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
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
            
            <div className="p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-purple-500/40 transition-all shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-lg font-mono font-bold text-purple-300 shadow-md">
                1
              </div>
              <h3 className="text-lg font-bold text-white">Search & Filter</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Filter instantly by semester, course code (e.g. 23CST-201), exam pattern (MST 1, MST 2, EST), or academic year.
              </p>
            </div>
            
            <div className="p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-cyan-500/40 transition-all shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-lg font-mono font-bold text-cyan-300 shadow-md">
                2
              </div>
              <h3 className="text-lg font-bold text-white">Preview, Solve & Share</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Open in-browser PDF previews, download with 1-click, or share directly to your WhatsApp study groups.
              </p>
            </div>
            
            <div className="p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-emerald-500/40 transition-all shadow-xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-lg font-mono font-bold text-emerald-300 shadow-md">
                3
              </div>
              <h3 className="text-lg font-bold text-white">Contribute & Help Peers</h3>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Upload your MST and EST question papers. Earn verified contributor credits and help your batchmates succeed.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 4. ABOUT US & CAMPUS STORY */}
      {/* ============================================================ */}
      <AboutUsSection />

      {/* ============================================================ */}
      {/* 5. MULTI-DEPARTMENT EXPANSION & UPCOMING ROADMAP */}
      {/* ============================================================ */}
      <UpcomingFeaturesRoadmap />

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
          <div className="flex items-center gap-3">
            <a 
              href="https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw==" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/25 hover:bg-pink-500/20 transition-colors"
            >
              <span>📸 @cu.exclusive</span>
            </a>

            <a 
              href="https://chat.whatsapp.com/BpwkcISe9Cz327ud2T4IkF?s=cl&p=a&ilr=1&utm_source=ig&utm_medium=social&utm_content=link_in_bio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors"
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
