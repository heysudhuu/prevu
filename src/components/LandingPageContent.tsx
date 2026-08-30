'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { ArrowRight, Upload, Search, Sparkles } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedPapersIcon, AnimatedNotesIcon, AnimatedVerifiedIcon, AnimatedCommunityIcon } from './animations/AnimatedIcons'
import AboutUsSection from './landing/AboutUsSection'
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
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-36 border-b border-prevu-surface-light">
        {/* Academic grid background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[350px] w-[350px] rounded-full bg-purple-600 opacity-20 blur-[120px]" />
        
        {/* 3D Scene */}
        <Hero3DScene />

        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-prevu-surface-light bg-prevu-surface px-4 py-1.5 text-xs font-semibold text-prevu-text-muted mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Chandigarh University BE-CSE Digital Vault</span>
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-sans font-extrabold tracking-tighter text-prevu-text mb-6 max-w-4xl leading-tight">
            The Ultimate Archive for <br className="hidden sm:block" />
            <span className="text-prevu-accent">BE-CSE Papers.</span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-base sm:text-lg text-prevu-text-muted max-w-2xl mb-8 leading-relaxed">
            Stop endlessly searching WhatsApp groups. Prevu is your centralized, student-run repository for Previous Year Questions, high-quality notes, and exam-pattern references for Chandigarh University.
          </p>
          
          {/* Quick Hero Search Input */}
          <form 
            onSubmit={handleHeroSearch}
            className="w-full max-w-lg mb-8 relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
            <input 
              type="text"
              value={heroSearch}
              onChange={e => setHeroSearch(e.target.value)}
              placeholder="Search by subject or code (e.g. 23CST-201, OS, DBMS)..."
              className="w-full pl-11 pr-28 py-3.5 bg-prevu-surface/90 backdrop-blur-xl border border-prevu-surface-light hover:border-prevu-accent/50 focus:border-prevu-accent rounded-2xl text-sm text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none transition-all shadow-xl shadow-prevu-accent/5"
            />
            <Button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-4 text-xs font-bold rounded-xl"
            >
              Search
            </Button>
          </form>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mb-8">
            <Button size="lg" className="text-sm px-6 py-5 h-auto transition-transform hover:-translate-y-0.5 shadow-md shadow-prevu-accent/10 font-bold" asChild>
              <Link href="/browse">
                Browse Full Archive <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-sm px-6 py-5 h-auto transition-transform hover:-translate-y-0.5 hover:bg-prevu-surface bg-transparent border-prevu-surface-light text-prevu-text font-semibold" asChild>
              <Link href="/upload">
                <Upload className="mr-2 h-4 w-4" /> Contribute Paper
              </Link>
            </Button>
          </div>

          {/* 1-Click Semester Quick Jump Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-xl">
            <span className="text-xs text-prevu-text-muted font-medium mr-1">Quick Jump:</span>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <Link
                key={sem}
                href={`/browse?sem=${sem}`}
                className="px-2.5 py-1 rounded-lg border border-prevu-surface-light/80 bg-prevu-surface/60 hover:bg-prevu-surface hover:border-prevu-accent text-xs font-mono font-semibold text-prevu-text-muted hover:text-prevu-accent transition-colors"
              >
                Sem {sem}
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* 2. FEATURE SECTION */}
      {/* ============================================================ */}
      <section className="py-24 relative overflow-hidden bg-prevu-bg border-b border-prevu-surface-light">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-prevu-text mb-6">
              Everything you need to ace your exams.
            </h2>
            <p className="text-prevu-text-muted text-base sm:text-lg leading-relaxed">
              Built by students, for students. We understand the struggle of finding reliable study material right before exams. Prevu solves this by crowdsourcing and organizing the best resources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Past Year Papers", desc: "Access authentic PYQs to understand the exact exam pattern and frequently asked topics.", icon: <AnimatedPapersIcon /> },
              { title: "Curated Notes", desc: "High-quality, easy-to-understand notes contributed by top-performing seniors and peers.", icon: <AnimatedNotesIcon /> },
              { title: "Community Verified", desc: "Resources are reviewed and approved to ensure you only get accurate, trustworthy material.", icon: <AnimatedVerifiedIcon /> },
              { title: "Free Forever", desc: "Knowledge should be accessible. Prevu is a free, open platform for all CU BE-CSE students.", icon: <AnimatedCommunityIcon /> }
            ].map((feature, i) => (
              <div 
                key={i} 
                className="bg-prevu-surface border border-prevu-surface-light p-8 rounded-2xl transition-all duration-300 relative group overflow-hidden hover:border-prevu-accent/50 shadow-lg"
              >
                <div className="w-12 h-12 bg-prevu-bg rounded-xl flex items-center justify-center mb-6 border border-prevu-surface-light group-hover:scale-105 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-prevu-text mb-3">{feature.title}</h3>
                <p className="text-prevu-text-muted text-xs sm:text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================ */}
      {/* 3. HOW IT WORKS */}
      {/* ============================================================ */}
      <section className="py-24 bg-prevu-surface/60 border-b border-prevu-surface-light">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-center text-prevu-text mb-20">
            How it works
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative pl-8 md:pl-0">
            <div className="relative z-10 flex flex-col md:items-center text-left md:text-center group">
              <div className="absolute md:relative left-[-3.25rem] md:left-0 top-0 md:top-auto w-14 h-14 bg-prevu-surface border-2 border-prevu-surface-light group-hover:border-prevu-accent rounded-full flex items-center justify-center text-xl font-sans font-bold text-prevu-text group-hover:text-prevu-accent mb-6 shadow-sm transition-colors duration-500 z-10">
                1
              </div>
              <h3 className="text-xl font-bold text-prevu-text mb-3">Search</h3>
              <p className="text-prevu-text-muted text-xs sm:text-sm leading-relaxed">
                Use our instant search and filters to find exactly what you need by semester, subject, or exam year.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col md:items-center text-left md:text-center group">
              <div className="absolute md:relative left-[-3.25rem] md:left-0 top-0 md:top-auto w-14 h-14 bg-prevu-surface border-2 border-prevu-surface-light group-hover:border-prevu-accent rounded-full flex items-center justify-center text-xl font-sans font-bold text-prevu-text group-hover:text-prevu-accent mb-6 shadow-sm transition-colors duration-500 z-10">
                2
              </div>
              <h3 className="text-xl font-bold text-prevu-text mb-3">Solve & Prepare</h3>
              <p className="text-prevu-text-muted text-xs sm:text-sm leading-relaxed">
                Access PDFs and past papers instantly. Free preview, download, and 1-click WhatsApp study group sharing.
              </p>
            </div>
            
            <div className="relative z-10 flex flex-col md:items-center text-left md:text-center group">
              <div className="absolute md:relative left-[-3.25rem] md:left-0 top-0 md:top-auto w-14 h-14 bg-prevu-surface border-2 border-prevu-surface-light group-hover:border-prevu-accent rounded-full flex items-center justify-center text-xl font-sans font-bold text-prevu-text group-hover:text-prevu-accent mb-6 shadow-sm transition-colors duration-500 z-10">
                3
              </div>
              <h3 className="text-xl font-bold text-prevu-text mb-3">Contribute</h3>
              <p className="text-prevu-text-muted text-xs sm:text-sm leading-relaxed">
                Upload your MST and EST question papers. Give back to the community and help your juniors succeed.
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
      <footer className="py-12 border-t border-prevu-surface-light bg-prevu-surface/60 text-center text-xs text-prevu-text-muted space-y-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-prevu-text">
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
              <span>📸 Instagram: @cu.exclusive</span>
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

          <p>© 2026 Prevu. Student-run academic library.</p>
        </div>
      </footer>

    </main>
  )
}
