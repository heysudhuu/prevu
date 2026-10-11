import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import Header from '@/components/Header'
import ProfileForm from '@/components/profile/ProfileForm'
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

  // Fetch full user profile & user engagement stats in parallel
  const [userProfileRes, uploadsCountRes, bookmarksCountRes] = await Promise.all([
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
      .eq('user_id', decoded.uid)
  ])

  const userProfile = userProfileRes.data
  const stats = {
    uploads: uploadsCountRes.count ?? 0,
    bookmarks: bookmarksCountRes.count ?? 0,
  }

  return (
    <div className="min-h-screen bg-prevu-bg text-prevu-text flex flex-col pb-16">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        
        {/* Back Link */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" asChild className="text-xs text-prevu-text-muted hover:text-prevu-text">
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-prevu-text-muted">
              Student Identity Hub
            </span>
          </div>
        </div>

        {/* Profile Editor */}
        <ProfileForm user={userProfile} stats={stats} />

      </main>
    </div>
  )
}
