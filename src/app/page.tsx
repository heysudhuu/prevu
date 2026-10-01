import { Suspense } from 'react'
import Header from '@/components/Header'
import LandingPageContent from '@/components/LandingPageContent'
import CommunityRequestsSection from '@/components/landing/CommunityRequestsSection'
import AboutUsSection from '@/components/landing/AboutUsSection'
import CommunityConnect from '@/components/landing/CommunityConnect'
import StudentSuggestionBox from '@/components/landing/StudentSuggestionBox'
import LiveStatsSection from '@/components/landing/LiveStatsSection'
import RecentPapersSection from '@/components/landing/RecentPapersSection'

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
      {/* 4. Community Requests Preview */}
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
      <footer className="py-12 border-t border-prevu-surface-light bg-prevu-surface/80 text-xs text-prevu-text-muted">
        <div className="container mx-auto px-4 max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 font-semibold text-prevu-text">
            <div className="w-6 h-6 rounded-lg bg-prevu-accent flex items-center justify-center text-white text-xs font-bold">P</div>
            <span>Prevu</span>
            <span>•</span>
            <span className="text-prevu-accent">Chandigarh University BE-CSE Vault</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <a href="https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/25 hover:bg-pink-500/20 transition-colors text-xs font-medium">
              📸 @cu.exclusive
            </a>
            <a href="https://www.instagram.com/cuupdates1?igsi=MTltajU5cGM2YXBwag==" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 hover:bg-indigo-500/20 transition-colors text-xs font-medium">
              🤝 @cuupdates1
            </a>
            <a href="https://chat.whatsapp.com/BpwkcISe9Cz327ud2T4IkF?s=cl&p=a&ilr=1&utm_source=ig&utm_medium=social&utm_content=link_in_bio" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 hover:bg-emerald-500/20 transition-colors text-xs font-medium">
              💬 WhatsApp Community
            </a>
          </div>
          <p>© 2026 Prevu. Student-run academic archive.</p>
        </div>
      </footer>
    </div>
  )
}
