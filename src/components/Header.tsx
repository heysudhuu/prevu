import Link from 'next/link'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { isUserAdmin } from '@/lib/auth/admin-check'
import HeaderNav from '@/components/HeaderNav'
import { Terminal } from 'lucide-react'
import SemesterSwitcherPill from '@/components/navigation/SemesterSwitcherPill'
import ThemeSwitcherDropdown from '@/components/theme/ThemeSwitcherDropdown'

export default async function Header() {
  const token = (await cookies()).get('firebase-token')?.value
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let user: any = null
  let isAdmin = false

  if (token) {
    try {
      const decoded = await authAdmin.verifyIdToken(token)
      user = {
        uid: decoded.uid,
        email: decoded.email || null,
        name: decoded.name || null,
        displayName: decoded.name || decoded.email?.split('@')[0] || 'Student'
      }
      isAdmin = await isUserAdmin(decoded.email, decoded.uid)
    } catch {
      user = null
    }
  }

  return (
    <header className="border-b border-[#30363d]/70 bg-[#010409]/90 backdrop-blur-2xl sticky top-0 z-50 shadow-xl shadow-black/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo, Semester Switcher & Interactive Theme Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link 
            href="/" 
            className="group font-mono text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2.5 hover:text-emerald-400 transition-colors shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-[#238636] flex items-center justify-center text-white shadow-md shadow-[#238636]/40 group-hover:scale-105 transition-transform shrink-0">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold tracking-tight">prevu</span>
          </Link>

          <SemesterSwitcherPill />

          {/* Interactive Theme Switcher Dropdown */}
          <div className="hidden sm:inline-flex items-center">
            <ThemeSwitcherDropdown />
          </div>
        </div>

        {/* Dynamic Navigation & Mobile Menu */}
        <HeaderNav user={user} isAdmin={isAdmin} />

      </div>
    </header>
  )
}
