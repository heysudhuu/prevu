import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import Header from '@/components/Header'
import CbtArenaHub from '@/components/cbt/CbtArenaHub'
import { getAllStoredLeaderboards } from '@/lib/cbt/cbtStore'
import { getApprovedContributedQuestions } from '@/lib/cbt/actions'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Prevu CBT Arena | Computer-Based Mock Testing Portal',
  description: 'Realistic exam simulator for Chandigarh University Computer Based Tests, Open Electives, UHV, and Campus Aptitudes. Set custom question counts, timers, and climb the leaderboard.'
}

export default async function CbtPage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('firebase-token')?.value
  let isAuthenticated = false

  if (token) {
    try {
      await authAdmin.verifyIdToken(token)
      isAuthenticated = true
    } catch {
      isAuthenticated = false
    }
  }

  let initialLeaderboards = {}
  try {
    initialLeaderboards = getAllStoredLeaderboards() || {}
  } catch {
    initialLeaderboards = {}
  }

  let approvedQuestions = []
  try {
    approvedQuestions = await getApprovedContributedQuestions()
  } catch {
    approvedQuestions = []
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#07070c] text-prevu-text relative overflow-hidden">
      {/* Ambient background glows */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] pointer-events-none z-0 opacity-40 blur-[140px]" 
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.12), transparent)'
        }}
      />
      <div className="fixed inset-0 grid-pattern-sm pointer-events-none opacity-20 z-0" />

      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="container mx-auto max-w-7xl">
          <CbtArenaHub 
            isAuthenticated={isAuthenticated} 
            initialLeaderboards={JSON.parse(JSON.stringify(initialLeaderboards || {}))}
            approvedQuestions={JSON.parse(JSON.stringify(approvedQuestions || []))}
          />
        </div>
      </main>
    </div>
  )
}
