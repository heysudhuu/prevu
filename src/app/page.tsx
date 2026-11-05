import { Suspense } from 'react'
import Link from 'next/link'
import { Terminal } from 'lucide-react'
import Header from '@/components/Header'
import LandingPageContent from '@/components/LandingPageContent'
import ReappearRescueSection from '@/components/landing/ReappearRescueSection'
import ThemeSelectorSection from '@/components/theme/ThemeSelectorSection'
import RecentPapersSection from '@/components/landing/RecentPapersSection'
import CommunityAndFaqSection from '@/components/landing/CommunityAndFaqSection'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#010409] text-[#e6edf3]">
      <Header />
      
      {/* 1. Master Hero, Connected Git Spine, Contribution Calendar & Fast-Track Curriculum */}
      <LandingPageContent />

      {/* 2. Reappear & Remedial Rescue Vault (High-Yield PYQs & 80/20 Study Material) */}
      <ReappearRescueSection />

      {/* 3. Compact Visual Theme Engine Workbench (10 Palettes) */}
      <ThemeSelectorSection />

      {/* 3. Fresh Vault Additions — Recent Paper Carousels */}
      <Suspense fallback={null}>
        <RecentPapersSection />
      </Suspense>

      {/* 4. Consolidated FAQs, Community Channels & Feedback Box */}
      <CommunityAndFaqSection />

      {/* 5. GitHub-Style Academic Footer */}
      <footer className="py-12 border-t border-[#30363d]/60 relative overflow-hidden text-xs text-[#7d8590] bg-[#010409]">
        <div className="container mx-auto px-4 max-w-6xl space-y-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand Col */}
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5 font-bold text-white text-base">
                <div className="w-7 h-7 rounded-lg bg-[#238636] flex items-center justify-center text-white shadow-md shadow-[#238636]/30">
                  <Terminal className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-base font-extrabold tracking-tight font-mono">Prevu</span>
              </div>
              <p className="text-xs text-[#7d8590] leading-relaxed">
                Open-access engineering repository for Chandigarh University scholars. Designed and maintained by BE-CSE peers.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="w-2 h-2 rounded-full bg-[#238636] animate-pulse" />
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">Vault Operational</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-3">Academic Vault</div>
              <ul className="space-y-2 text-xs font-mono">
                <li><Link href="/browse" className="hover:text-emerald-400 transition-colors">Question Papers (PYQs)</Link></li>
                <li><Link href="#reappear-rescue" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Reappear &amp; Remedial Vault</Link></li>
                <li><Link href="/study-material" className="hover:text-emerald-400 transition-colors">Curated Study Notes</Link></li>
                <li><Link href="/exam-prep" className="hover:text-emerald-400 transition-colors">Exam Prep Workspace</Link></li>
                <li><Link href="/subjects" className="hover:text-emerald-400 transition-colors">All 8 Semesters Curriculum</Link></li>
              </ul>
            </div>

            {/* Tools & Workspace */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-3">Student Workspace</div>
              <ul className="space-y-2 text-xs font-mono">
                <li><Link href="/vault" className="hover:text-emerald-400 transition-colors">Offline PWA Vault</Link></li>
                <li><Link href="/study-planner" className="hover:text-emerald-400 transition-colors">Study Planner &amp; Countdown</Link></li>
                <li><Link href="/requests" className="hover:text-emerald-400 transition-colors">Peer Doubts &amp; Bounties</Link></li>
                <li><Link href="/leaderboard" className="hover:text-emerald-400 transition-colors">Hall of Fame Ranks</Link></li>
              </ul>
            </div>

            {/* Social & Connect */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-3">Community Channels</div>
              <ul className="space-y-2 text-xs font-mono">
                <li><a href="https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition-colors">📸 @cu.exclusive</a></li>
                <li><a href="https://www.instagram.com/cuupdates1?igsi=MTltajU5cGM2YXBwag==" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">📢 @cuupdates1</a></li>
                <li><a href="https://chat.whatsapp.com/BpwkcISe9Cz327ud2T4IkF?s=cl&p=a&ilr=1&utm_source=ig&utm_medium=social&utm_content=link_in_bio" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">💬 WhatsApp Community</a></li>
                <li><Link href="/upload" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">⬆️ Upload &amp; Earn Karma</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-[#30363d]/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#7d8590]">
            <p>© 2026 Prevu. Student-run academic initiative for Chandigarh University.</p>
            <p className="text-[#7d8590]/60">Not officially affiliated with Chandigarh University administration.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
