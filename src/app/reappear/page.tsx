import { Suspense } from 'react'
import Link from 'next/link'
import { Terminal, ShieldAlert, BookOpen, FileText, Sparkles, Target, ArrowLeft } from 'lucide-react'
import Header from '@/components/Header'
import ReappearRescueSection from '@/components/landing/ReappearRescueSection'

export const metadata = {
  title: 'Reappear & Remedial Hub | Prevu',
  description: 'Specialized remedial question papers (PYQs), 80/20 crash notes, high-frequency repeated questions bank, and passing blueprints for Chandigarh University BE-CSE scholars.'
}

export default function ReappearPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#010409] text-[#e6edf3]">
      <Header />

      <main className="flex-1">
        {/* Reappear Hero Breadcrumb Bar */}
        <div className="border-b border-[#30363d]/60 bg-[#0d1117] py-4">
          <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[1720px] flex items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 text-[#7d8590]">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
              <span>/</span>
              <span className="text-amber-400 font-bold flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Reappear &amp; Remedial Hub</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] text-amber-300 font-bold hidden sm:inline">100% Remedial Pass Verified</span>
            </div>
          </div>
        </div>

        {/* Reappear Interactive Rescue Desk Section */}
        <Suspense fallback={
          <div className="min-h-[70vh] flex items-center justify-center bg-[#090d13]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-amber-300 font-bold">Loading Reappear &amp; Backlog Rescue Hub...</span>
            </div>
          </div>
        }>
          <ReappearRescueSection isStandalonePage />
        </Suspense>
      </main>

      {/* GitHub-Style Academic Footer */}
      <footer className="py-12 border-t border-[#30363d]/60 relative overflow-hidden text-xs text-[#7d8590] bg-[#010409]">
        <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[1720px] space-y-10 relative z-10">
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
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-[11px] font-mono text-amber-300 font-semibold">Remedial Portal Active</span>
              </div>
            </div>

            {/* Academic Vault Links */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-3">Academic Vault</div>
              <ul className="space-y-2 text-xs font-mono">
                <li><Link href="/browse" className="hover:text-emerald-400 transition-colors">Question Papers (PYQs)</Link></li>
                <li><Link href="/study-material" className="hover:text-cyan-400 transition-colors">Curated Study Notes</Link></li>
                <li><Link href="/reappear" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Reappear &amp; Remedial Hub</Link></li>
                <li><Link href="/subjects" className="hover:text-emerald-400 transition-colors">All 8 Semesters Curriculum</Link></li>
                <li><Link href="/vault" className="hover:text-emerald-400 transition-colors">Offline PWA Vault</Link></li>
              </ul>
            </div>

            {/* Quick Reappear Jump */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-3">Backlog Rescue Tools</div>
              <ul className="space-y-2 text-xs font-mono">
                <li><Link href="/reappear?tab=pyqs" className="hover:text-amber-400 transition-colors">Reappear PYQs &amp; Solved Papers</Link></li>
                <li><Link href="/reappear?tab=notes" className="hover:text-emerald-400 transition-colors">80/20 Reappear Crash Notes</Link></li>
                <li><Link href="/reappear?tab=questions" className="hover:text-purple-400 transition-colors">Reappear High-Yield Questions</Link></li>
                <li><Link href="/reappear?tab=syllabus" className="hover:text-rose-400 transition-colors">Passing Blueprint &amp; Syllabus</Link></li>
                <li><Link href="/upload?category=reappear" className="text-amber-400 hover:text-amber-300 font-bold transition-colors">Upload Remedial Resource</Link></li>
              </ul>
            </div>

            {/* Community & Support */}
            <div>
              <div className="font-mono text-[11px] font-bold uppercase text-white/80 tracking-widest mb-3">Community Support</div>
              <ul className="space-y-2 text-xs font-mono">
                <li><Link href="/requests" className="hover:text-white transition-colors">Post Remedial Bounty</Link></li>
                <li><Link href="/study-planner" className="hover:text-white transition-colors">Revision Schedule Planner</Link></li>
                <li><Link href="/leaderboard" className="hover:text-white transition-colors">Contributor Hall of Fame</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#30363d]/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px]">
            <div>© {new Date().getFullYear()} Prevu Open Academic Initiative. Built by students, for students.</div>
            <div className="text-amber-400/80 font-bold">⚡ Zero-Compromise Remedial Clearance</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
