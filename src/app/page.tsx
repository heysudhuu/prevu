import { Suspense } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import Header from '@/components/Header'
import LandingPageContent from '@/components/LandingPageContent'
import CommunityRequestsSection from '@/components/landing/CommunityRequestsSection'
import AboutUsSection from '@/components/landing/AboutUsSection'
import CommunityConnect from '@/components/landing/CommunityConnect'
import StudentSuggestionBox from '@/components/landing/StudentSuggestionBox'
import LiveStatsSection from '@/components/landing/LiveStatsSection'
import RecentPapersSection from '@/components/landing/RecentPapersSection'
import KarmaAchieversSection from '@/components/landing/KarmaAchieversSection'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      {/* 1. Hero + Feature Bento + How It Works */}
      <LandingPageContent />
      {/* 2. Live real stats from DB with count-up animation */}
      <Suspense fallback={null}>
        <LiveStatsSection />
      </Suspense>
      {/* 3. Recently added papers — horizontal scroll strip */}
      <Suspense fallback={null}>
        <RecentPapersSection />
      </Suspense>
      {/* 4. Campus Karma Achievers & Hall of Fame Collaborators */}
      <Suspense fallback={null}>
        <KarmaAchieversSection />
      </Suspense>
      {/* 5. Community Requests Preview */}
      <Suspense fallback={null}>
        <CommunityRequestsSection />
      </Suspense>
      {/* 5. About Us */}
      <AboutUsSection />
      {/* 6. Instagram & WhatsApp Community */}
      <CommunityConnect />
      {/* 7. Student Suggestion Box */}
      <StudentSuggestionBox />
      {/* 8. Footer */}
      <footer className="py-16 border-t border-prevu-surface-light/60 relative overflow-hidden text-xs text-prevu-text-muted"
              style={{ background: 'linear-gradient(180deg, #09090f 0%, #07070c 100%)' }}>
        {/* Subtle top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] pointer-events-none"
             style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.3), rgba(6,182,212,0.2), rgba(139,92,246,0.3), transparent)' }} />
        
        <div className="container mx-auto px-4 max-w-6xl space-y-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand Col */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-3 font-bold text-white text-base">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-prevu-accent flex items-center justify-center text-white shadow-lg shadow-purple-600/30">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-extrabold tracking-tight">Prevu</span>
              </div>
              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Open-access engineering repository for Chandigarh University students. Designed and maintained by BE-CSE peers.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">Vault Operational</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-4">Academic Vault</div>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/browse" className="hover:text-prevu-accent transition-colors duration-200">Question Papers (PYQs)</Link></li>
                <li><Link href="/study-material" className="hover:text-prevu-accent transition-colors duration-200">Curated Study Notes</Link></li>
                <li><Link href="/exam-prep" className="hover:text-prevu-accent transition-colors duration-200">Exam Prep Workspace</Link></li>
                <li><Link href="/subjects" className="hover:text-prevu-accent transition-colors duration-200">All 8 Semesters Curriculum</Link></li>
              </ul>
            </div>

            {/* Tools & Workspace */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-4">Student Workspace</div>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/vault" className="hover:text-prevu-accent transition-colors duration-200">Offline PWA Vault</Link></li>
                <li><Link href="/study-planner" className="hover:text-prevu-accent transition-colors duration-200">Study Planner &amp; Countdown</Link></li>
                <li><Link href="/requests" className="hover:text-prevu-accent transition-colors duration-200">Peer Doubts &amp; Bounties</Link></li>
                <li><Link href="/leaderboard" className="hover:text-prevu-accent transition-colors duration-200">Hall of Fame Ranks</Link></li>
              </ul>
            </div>

            {/* Social & Connect */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-4">Community Channels</div>
              <ul className="space-y-2.5 text-xs">
                <li><a href="https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors duration-200">📸 @cu.exclusive</a></li>
                <li><a href="https://www.instagram.com/cuupdates1?igsi=MTltajU5cGM2YXBwag==" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition-colors duration-200">📢 @cuupdates1</a></li>
                <li><a href="https://chat.whatsapp.com/BpwkcISe9Cz327ud2T4IkF?s=cl&p=a&ilr=1&utm_source=ig&utm_medium=social&utm_content=link_in_bio" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors duration-200">💬 WhatsApp Community</a></li>
                <li><Link href="/upload" className="text-prevu-accent hover:text-prevu-accent-light font-semibold transition-colors duration-200">⬆️ Upload &amp; Earn Karma</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-prevu-surface-light/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
            <p className="text-prevu-text-muted/70">© 2026 Prevu. Student-run academic initiative for Chandigarh University.</p>
            <p className="text-prevu-text-muted/40">Not officially affiliated with Chandigarh University administration.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
