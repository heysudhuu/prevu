import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import Header from '@/components/Header'
import ProfileForm from '@/components/profile/ProfileForm'
import ProfileCbtTranscript from '@/components/profile/ProfileCbtTranscript'
import RecentlyViewedBar from '@/components/dashboard/RecentlyViewedBar'
import { getUserCbtAttempts } from '@/lib/cbt/actions'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Profile | Prevu',
  description: 'Manage your student profile, academic branch, handle, and contact details on Prevu.',
}

export default async function ProfilePage() {
  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    redirect('/login')
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    redirect('/login')
  }

  const supabase = getSupabaseAdmin()

  // Fetch full user profile, engagement stats & CBT test attempts in parallel
  const [userProfileRes, uploadsCountRes, bookmarksCountRes, cbtAttempts] = await Promise.all([
    supabase
      .from('users')
      .select('*')
      .eq('id', decoded.uid)
      .maybeSingle(),
    supabase
      .from('resources')
      .select('id', { count: 'exact', head: true })
      .eq('uploaded_by', decoded.uid),
    supabase
      .from('bookmarks')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', decoded.uid),
    getUserCbtAttempts(decoded.uid)
  ])

  const userProfile = userProfileRes.data
  const stats = {
    uploads: uploadsCountRes.count ?? 0,
    bookmarks: bookmarksCountRes.count ?? 0,
  }

  return (
    <div className="min-h-screen bg-prevu-bg text-prevu-text flex flex-col pb-16">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl space-y-10 relative">
        
        {/* Top Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button variant="outline" size="sm" asChild className="h-9 px-3.5 rounded-xl text-xs bg-prevu-surface/60 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-accent/50 backdrop-blur-md transition-all">
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
            </Link>
          </Button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-prevu-surface/70 border border-prevu-surface-light backdrop-blur-md shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-mono font-semibold text-prevu-text">
              Student Identity Hub
            </span>
          </div>
        </div>

        {/* Profile Editor */}
        <ProfileForm user={userProfile} stats={stats} />

        {/* Official CBT Examination Transcript & Performance Record */}
        <div className="pt-4 border-t border-prevu-surface-light/60">
          <ProfileCbtTranscript attempts={cbtAttempts} />
        </div>

        {/* Continuous Student Study Footprint */}
        <div className="pt-2">
          <RecentlyViewedBar />
        </div>

      </main>
    </div>
  )
}
