import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import SignOutButton from '@/components/auth/SignOutButton'
import { checkAdmin } from '@/app/admin/actions'
import { ShieldCheck, LayoutDashboard } from 'lucide-react'

export default async function Header() {
  const token = (await cookies()).get('firebase-token')?.value
  let user = null
  let isAdmin = false

  if (token) {
    try {
      const decoded = await authAdmin.verifyIdToken(token)
      user = decoded
      isAdmin = await checkAdmin()
    } catch {
      user = null
    }
  }

  return (
    <header className="border-b border-prevu-surface-light/80 bg-[#09090d]/95 backdrop-blur-xl sticky top-0 z-50 animate-slide-down shadow-xl shadow-black/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="font-sans text-2xl font-bold tracking-tighter text-prevu-text flex items-center gap-2 hover:drop-shadow-[0_0_12px_rgba(139,92,246,0.5)] hover:text-prevu-accent transition-all duration-300">
            Prevu
          </Link>
          <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-prevu-accent bg-prevu-accent/10 border border-prevu-accent/20 px-2.5 py-1 rounded-full hidden sm:inline-block">BE-CSE</span>
        </div>
        <nav className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/browse">Browse</Link>
          </Button>

          {user && !isAdmin && (
            <Button variant="ghost" size="sm" asChild className="text-prevu-accent hover:text-prevu-accent hover:bg-prevu-accent/10">
              <Link href="/dashboard" className="flex items-center gap-1.5">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </Link>
            </Button>
          )}

          {isAdmin && (
            <Button variant="outline" size="sm" asChild className="border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 hover:text-white shadow-sm shadow-purple-500/20 font-bold">
              <Link href="/admin" className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-400" /> Admin Console
              </Link>
            </Button>
          )}

          {user && (
            <Button variant="ghost" size="sm" asChild className="text-prevu-text-muted hover:text-prevu-text">
              <Link href="/profile">Profile</Link>
            </Button>
          )}

          <Button variant="outline" size="sm" asChild>
            <Link href="/upload">Upload</Link>
          </Button>

          {user ? (
            <SignOutButton />
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">Log In</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  )
}
