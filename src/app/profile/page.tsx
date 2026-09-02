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

  // Fetch full user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', decoded.uid)
    .maybeSingle()

  return (
    <div className="min-h-screen bg-prevu-bg text-prevu-text flex flex-col pb-16">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">
        
        {/* Back Link */}
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="text-xs text-prevu-text-muted hover:text-prevu-text">
            <Link href="/dashboard" className="flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </Button>
        </div>

        {/* Profile Editor */}
        <ProfileForm user={userProfile} />

      </main>
    </div>
  )
}
