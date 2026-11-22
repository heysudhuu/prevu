import Link from 'next/link'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { isUserAdmin } from '@/lib/auth/admin-check'
import HeaderNav from '@/components/HeaderNav'
import { Terminal } from 'lucide-react'
import SemesterSwitcherPill from '@/components/navigation/SemesterSwitcherPill'
import LiveExamRadarRibbon from '@/components/navigation/LiveExamRadarRibbon'
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
    <>
      {/* 1. TOP LIVE ACADEMIC RADAR RIBBON (High-Attention, Zero Header Bloat) */}
      <LiveExamRadarRibbon />

      {/* 2. MASTER COMPACT HEADER */}
      <header className="border-b border-[#30363d]/70 bg-[#010409]/92 backdrop-blur-2xl sticky top-0 z-50 shadow-xl shadow-black/60">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl 2xl:max-w-[1720px] h-14 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Compact Semester Compound: [prevu / Sem 1 ▾] */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <Link 
              href="/" 
              className="group font-mono text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2 hover:text-emerald-400 transition-colors shrink-0"
              title="Prevu Academic Repository"
            >
              <div className="w-7 h-7 rounded-lg bg-[#238636] flex items-center justify-center text-white shadow-md shadow-[#238636]/40 group-hover:scale-105 transition-transform shrink-0">
                <Terminal className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-extrabold tracking-tight">prevu</span>
            </Link>

            <span className="text-[#30363d] font-mono text-xs select-none">/</span>

            {/* Compact Semester Selector: Sem 1, Sem 2... */}
            <SemesterSwitcherPill compact />

            {/* Terminal Theme Switcher on widescreen (accessible inside More menu on compact viewports) */}
            <div className="hidden xl:inline-flex items-center ml-1">
              <ThemeSwitcherDropdown />
            </div>
          </div>

          {/* Dynamic Compact Capsule Navigation & Actions */}
          <HeaderNav user={user} isAdmin={isAdmin} />

        </div>
      </header>
    </>
  )
}
