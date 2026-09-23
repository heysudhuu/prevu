'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Users,
  AlertTriangle,
  Inbox,
  GraduationCap,
  Calendar,
  BarChart3,
  Bell,
  Shield,
  ScrollText,
  Activity,
  LogOut,
  Compass,
  X,
  Sparkles
} from 'lucide-react'
import { auth } from '@/lib/firebase/client'
import { signOut } from 'firebase/auth'

export interface AdminNavBadgeCounts {
  pendingReview?: number
  openReports?: number
  openRequests?: number
}

interface AdminSidebarProps {
  adminEmail?: string
  adminRole?: string
  badgeCounts?: AdminNavBadgeCounts
  isOpenMobile?: boolean
  onCloseMobile?: () => void
}

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badgeKey?: keyof AdminNavBadgeCounts
  badgeColor?: string
}

const NAV_ITEMS: NavItem[] = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Papers', href: '/admin/papers', icon: FileText },
  {
    name: 'Moderation',
    href: '/admin/moderation',
    icon: CheckSquare,
    badgeKey: 'pendingReview',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  },
  { name: 'Users', href: '/admin/users', icon: Users },
  {
    name: 'Reports',
    href: '/admin/reports',
    icon: AlertTriangle,
    badgeKey: 'openReports',
    badgeColor: 'bg-red-500/20 text-red-300 border-red-500/30'
  },
  {
    name: 'Requests',
    href: '/admin/requests',
    icon: Inbox,
    badgeKey: 'openRequests',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
  },
  { name: 'Academic Data', href: '/admin/academic', icon: GraduationCap },
  { name: 'Calendar', href: '/admin/calendar', icon: Calendar },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Notifications', href: '/admin/notifications', icon: Bell },
  { name: 'Security', href: '/admin/security', icon: Shield },
  { name: 'Audit Logs', href: '/admin/audit-log', icon: ScrollText },
  { name: 'System Health', href: '/admin/system', icon: Activity }
]

export function AdminSidebar({
  adminEmail = 'admin@prevu.app',
  adminRole = 'Super Admin',
  badgeCounts = {},
  isOpenMobile = false,
  onCloseMobile
}: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      document.cookie = 'firebase-token=; path=/; max-age=0'
      router.push('/login')
    } catch (err) {
      console.error('Sign out error:', err)
      router.push('/login')
    }
  }

  const sidebarContent = (
    <div className="flex flex-col h-full bg-prevu-surface border-r border-prevu-surface-light text-prevu-text">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 border-b border-prevu-surface-light/80 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-purple-600/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-sm tracking-tight text-prevu-text">PREVU</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-prevu-text-muted">BE-CSE Vault Studio</p>
          </div>
        </Link>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold font-mono uppercase tracking-wider text-prevu-text-muted/70">
          Management
        </div>

        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
          const count = item.badgeKey ? badgeCounts[item.badgeKey] ?? 0 : 0
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-purple-600 text-white font-semibold shadow-sm shadow-purple-600/30'
                  : 'text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/60'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-white' : 'text-prevu-text-muted group-hover:text-prevu-text'
                  }`}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {count > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 border ${
                    isActive ? 'bg-white/20 text-white border-white/30' : item.badgeColor
                  }`}
                >
                  {count}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* Footer Profile & Actions */}
      <div className="p-3 border-t border-prevu-surface-light/80 space-y-2 bg-prevu-bg/40">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/50 transition-colors"
        >
          <Compass className="w-4 h-4 text-purple-400" />
          <span>Switch to Student View</span>
        </Link>

        <div className="pt-2 border-t border-prevu-surface-light/50 flex items-center justify-between gap-2 px-1">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-prevu-text truncate block">
                {adminEmail}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span className="text-[10px] font-mono text-purple-300 font-medium">
                {adminRole}
              </span>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            title="Sign out of Admin Console"
            className="p-1.5 rounded-lg text-prevu-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 flex-col fixed inset-y-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpenMobile && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-prevu-surface">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}
