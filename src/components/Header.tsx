import Link from 'next/link'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { checkAdmin } from '@/app/admin/actions'
import HeaderNav from '@/components/HeaderNav'
import { Sparkles } from 'lucide-react'

export default async function Header() {
  const token = (await cookies()).get('firebase-token')?.value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = null
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
    <header className="border-b border-prevu-surface-light/80 bg-[#09090d]/85 backdrop-blur-2xl sticky top-0 z-50 animate-slide-down shadow-xl shadow-black/40">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="group font-sans text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 hover:drop-shadow-[0_0_16px_rgba(139,92,246,0.6)] transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-prevu-accent flex items-center justify-center text-white shadow-md shadow-purple-600/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight">Prevu</span>
          </Link>

          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-prevu-accent bg-prevu-accent/15 border border-prevu-accent/30 px-2.5 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-prevu-accent animate-pulse" />
            <span>BE-CSE Vault</span>
          </span>
        </div>

        {/* Dynamic Navigation & Mobile Menu */}
        <HeaderNav user={user} isAdmin={isAdmin} />

      </div>
    </header>
  )
}
