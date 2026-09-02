import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { getSupabaseAdmin } from '@/utils/supabase/admin'
import Header from '@/components/Header'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { 
  Upload, 
  Search, 
  ShieldCheck, 
  CheckCircle, 
  User, 
  GraduationCap
} from 'lucide-react'
import { getBookmarkedResources, getPaperRequests } from './actions'
import StudentDashboardTabs from '@/components/dashboard/StudentDashboardTabs'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Student Dashboard | Prevu',
  description: 'Manage study materials, exams, saved question papers, and requests on Prevu.',
}

export default async function StudentDashboardPage() {
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

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', decoded.uid)
    .maybeSingle()

  const isAdmin = userProfile?.role === 'admin' || decoded.email?.toLowerCase() === 'py7716496@gmail.com'

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

  // Fetch bookmarks & requests
  const savedResources = await getBookmarkedResources()
  const paperRequests = await getPaperRequests()

  // Fetch all approved live question papers for direct in-dashboard browsing
  const { data: liveResources } = await supabase
    .from('resources')
    .select(`
      id, exam_year, file_path, status, created_at,
      subjects ( name, code, semester, year ),
      exam_types ( name ),
      users ( name, cu_verified, username, role )
    `)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-prevu-bg text-prevu-text flex flex-col pb-16">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl space-y-8">
        
        {/* Welcome Header */}
        <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-prevu-surface via-prevu-surface/90 to-prevu-surface border border-prevu-surface-light shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-prevu-accent/15 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-4">
              {/* Avatar circle */}
              <Link href="/profile" className="shrink-0 relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-prevu-accent to-purple-700 flex items-center justify-center text-white text-2xl font-bold border-2 border-white/10 shadow-xl group-hover:scale-105 transition-transform">
                  {userProfile?.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={userProfile.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{userProfile?.name ? userProfile.name.charAt(0).toUpperCase() : 'S'}</span>
                  )}
                </div>
              </Link>

              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                      <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                    </span>
                  ) : userProfile?.cu_verified ? (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle className="w-3.5 h-3.5" /> Verified CU Student
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs bg-zinc-800 text-prevu-text-muted border border-prevu-surface-light">
                      Student Member
                    </span>
                  )}
                  <span className="text-xs font-mono text-prevu-accent">@{userProfile?.username || 'student'}</span>
                  
                  {userProfile?.student_uid && (
                    <span className="text-xs font-mono text-prevu-text-muted bg-prevu-bg px-2 py-0.5 rounded border border-prevu-surface-light">
                      UID: {userProfile.student_uid}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  Welcome back, {userProfile?.name || 'Student'}! 👋
                </h1>
                
                <div className="flex flex-wrap items-center gap-3 text-xs text-prevu-text-muted mt-1.5">
                  <span className="flex items-center gap-1 text-prevu-text font-medium">
                    <GraduationCap className="w-3.5 h-3.5 text-prevu-accent" />
                    {userProfile?.branch || 'BE-CSE'}
                  </span>
                  <span>•</span>
                  <span>Semester {userProfile?.current_semester || 1}</span>
                  <span>•</span>
                  <span>Chandigarh University</span>
                </div>
              </div>
            </div>

            {/* Quick Primary Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              <Button asChild className="py-2.5 px-4 shadow-lg shadow-prevu-accent/20 font-bold">
                <Link href="/upload" className="flex items-center gap-1.5 text-xs">
                  <Upload className="w-4 h-4" /> Upload Paper
                </Link>
              </Button>
              
              <Button variant="outline" asChild className="py-2.5 px-4 border-prevu-surface-light hover:border-prevu-accent font-semibold">
                <Link href="/profile" className="flex items-center gap-1.5 text-xs">
                  <User className="w-4 h-4 text-prevu-accent" /> My Profile
                </Link>
              </Button>

              <Button variant="outline" size="sm" asChild className="py-2.5 px-3 border-prevu-surface-light font-semibold">
                <Link href="/browse" className="flex items-center gap-1.5 text-xs">
                  <Search className="w-4 h-4" /> Browse
                </Link>
              </Button>

              {isAdmin && (
                <Button variant="secondary" asChild className="py-2.5 px-4 bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 font-bold">
                  <Link href="/admin" className="flex items-center gap-1.5 text-xs">
                    <ShieldCheck className="w-4 h-4" /> Admin Portal
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl border border-prevu-surface-light bg-prevu-surface/70">
            <div className="text-xs text-prevu-text-muted mb-1">My Contributions</div>
            <div className="text-2xl font-bold font-mono text-white">{myResources?.length || 0}</div>
            <div className="text-[11px] text-prevu-accent mt-0.5">Uploaded papers</div>
          </div>

          <div className="p-4 rounded-2xl border border-prevu-surface-light bg-prevu-surface/70">
            <div className="text-xs text-prevu-text-muted mb-1">Saved Papers</div>
            <div className="text-2xl font-bold font-mono text-amber-400">{savedResources.length}</div>
            <div className="text-[11px] text-amber-400/80 mt-0.5">Quick revision hub</div>
          </div>

          <div className="p-4 rounded-2xl border border-prevu-surface-light bg-prevu-surface/70">
            <div className="text-xs text-prevu-text-muted mb-1">Community Requests</div>
            <div className="text-2xl font-bold font-mono text-purple-400">{paperRequests.length}</div>
            <div className="text-[11px] text-purple-400/80 mt-0.5">Peer study requests</div>
          </div>

          <div className="p-4 rounded-2xl border border-prevu-surface-light bg-prevu-surface/70">
            <div className="text-xs text-prevu-text-muted mb-1">Approved & Live</div>
            <div className="text-2xl font-bold font-mono text-emerald-400">{approvedCount}</div>
            <div className="text-[11px] text-emerald-400/80 mt-0.5">Helping students</div>
          </div>

        </div>

        {/* Multi-Tab Interactive Workspace */}
        <StudentDashboardTabs 
          userProfile={userProfile}
          myResources={myResources || []}
          savedResources={savedResources}
          paperRequests={paperRequests}
          liveResources={liveResources || []}
        />

      </main>
    </div>
  )
}
