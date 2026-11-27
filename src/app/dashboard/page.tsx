import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import Header from '@/components/Header'
import { getBookmarkedResources, getPaperRequests } from './actions'
import { getUserCbtAttempts } from '@/lib/cbt/actions'
import { isSuperAdminEmail } from '@/lib/auth/admin-check'
import StudentDashboardTabs from '@/components/dashboard/StudentDashboardTabs'
import WelcomeFamilyModal from '@/components/dashboard/WelcomeFamilyModal'
import DashboardWelcomeBanner from '@/components/dashboard/DashboardWelcomeBanner'
import DashboardHero from '@/components/dashboard/DashboardHero'
import DashboardDock from '@/components/dashboard/DashboardDock'
import ScrollProgressBar from '@/components/ui/kinetic/ScrollProgressBar'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'My Dashboard | Prevu',
  description: 'Manage study materials, exams, saved question papers, and requests on Prevu.',
}

export default async function StudentDashboardPage({
  searchParams
}: {
  searchParams?: Promise<{ tab?: string; action?: string; branch?: string }>
}) {
  const resolvedParams = searchParams ? await searchParams : {}
  const targetTab = resolvedParams.tab || 'browse'
  const targetAction = resolvedParams.action

  const token = (await cookies()).get('firebase-token')?.value
  if (!token) {
    const redirectUrl = resolvedParams.tab 
      ? `/dashboard?tab=${resolvedParams.tab}${targetAction ? `&action=${targetAction}` : ''}`
      : '/dashboard'
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    const redirectUrl = resolvedParams.tab 
      ? `/dashboard?tab=${resolvedParams.tab}${targetAction ? `&action=${targetAction}` : ''}`
      : '/dashboard'
    redirect(`/login?redirect=${encodeURIComponent(redirectUrl)}`)
  }

  const supabase = getSupabaseAdmin()

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', decoded.uid)
    .maybeSingle()

  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin' || isSuperAdminEmail(decoded.email)

  // Fetch resources uploaded by this student
  const { data: myResources } = await supabase
    .from('resources')
    .select(`
      *,
      subjects ( name, code, semester, year ),
      exam_types ( name )
    `)
    .eq('uploaded_by', decoded.uid)
    .order('created_at', { ascending: false })

  const approvedCount = myResources?.filter(r => r.status === 'approved').length || 0

  // Fetch bookmarks, requests, and student CBT mock attempts in parallel
  const [savedResources, paperRequests, cbtAttempts] = await Promise.all([
    getBookmarkedResources(),
    getPaperRequests(),
    getUserCbtAttempts(decoded.uid)
  ])

  // Fetch targeted recommended papers for this student's semester (capped at 12)
  const userSem = userProfile?.current_semester || 1
  const { data: recommendedPapers } = await supabase
    .from('resources')
    .select(`
      id, exam_year, file_path, status, created_at,
      subjects!inner ( name, code, semester, year ),
      exam_types ( name ),
      users ( name, cu_verified, username, role )
    `)
    .eq('status', 'approved')
    .eq('subjects.semester', userSem)
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className="min-h-screen bg-prevu-bg text-prevu-text flex flex-col pb-28">
      <ScrollProgressBar />
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl space-y-8">
        
        {/* Zone A: Hero Command Center (Welcome + Actions + Animated Stat Counters) */}
        <DashboardHero
          userProfile={userProfile}
          isAdmin={isAdmin}
          stats={{
            contributions: myResources?.length || 0,
            saved: savedResources.length,
            cbtMocks: cbtAttempts.length,
            requests: paperRequests.length,
            approved: approvedCount
          }}
        />

        {/* First-Login Welcome Popup / Card (Seen on first visit) */}
        {userProfile && <WelcomeFamilyModal userProfile={userProfile} />}

        {/* Dashboard Welcome Banner (Dismissible) */}
        {userProfile && <DashboardWelcomeBanner userProfile={userProfile} />}

        {/* Zone B & C: Two-Column Interactive Workspace + Activity Discovery Strip */}
        <StudentDashboardTabs 
          userProfile={userProfile}
          myResources={myResources || []}
          savedResources={savedResources}
          paperRequests={paperRequests}
          cbtAttempts={cbtAttempts}
          liveResources={recommendedPapers || []}
          initialTab={targetTab}
          initialAction={targetAction}
        />

        {/* macOS-style Quick-Launch Dock */}
        <DashboardDock />

      </main>
    </div>
  )
}
