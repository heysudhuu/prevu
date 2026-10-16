import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import Header from '@/components/Header'
import CbtArenaHub from '@/components/cbt/CbtArenaHub'

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

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <CbtArenaHub isAuthenticated={isAuthenticated} />
        </div>
      </main>
    </div>
  )
}
