'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  Search,
  Upload,
  ChevronRight,
  ShieldCheck,
  Command
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface AdminHeaderProps {
  onOpenMobileSidebar: () => void
  onOpenCommandPalette: () => void
}

const ROUTE_TITLES: Record<string, string> = {
  dashboard: 'Overview & Metrics',
  papers: 'Question Papers Repository',
  moderation: 'Paper Moderation Queue',
  users: 'Student & Staff Accounts',
  reports: 'Problem Reports',
  requests: 'Community Missing Requests',
  academic: 'Academic Hierarchy CMS',
  calendar: 'CU Academic Calendar',
  analytics: 'Analytics & Insights',
  notifications: 'Broadcast Announcements',
  security: 'Security Center',
  'audit-log': 'Audit Action Trail',
  system: 'System Health Diagnostics'
}

export function AdminHeader({
  onOpenMobileSidebar,
  onOpenCommandPalette
}: AdminHeaderProps) {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)
  const currentModule = segments[1] || 'dashboard'
  const moduleTitle = ROUTE_TITLES[currentModule] || 'Admin Console'

  return (
    <header className="sticky top-0 z-20 h-16 border-b border-prevu-surface-light bg-prevu-surface/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6">
      {/* Left: Mobile trigger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 rounded-xl text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs">
          <Link
            href="/admin/dashboard"
            className="text-prevu-text-muted hover:text-prevu-text transition-colors font-medium flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Admin</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-prevu-text-muted/60" />
          <span className="font-semibold text-prevu-text capitalize">
            {currentModule.replace('-', ' ')}
          </span>
          <span className="hidden sm:inline text-prevu-text-muted/60">•</span>
          <span className="hidden sm:inline text-prevu-text-muted text-[11px]">
            {moduleTitle}
          </span>
        </nav>
      </div>

      {/* Right: ⌘K trigger, operational indicator, actions */}
      <div className="flex items-center gap-3">
        {/* Global ⌘K Search Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light text-xs text-prevu-text-muted hover:text-prevu-text hover:border-purple-500/40 transition-all shadow-sm group"
        >
          <Search className="w-3.5 h-3.5 text-prevu-text-muted group-hover:text-purple-400 transition-colors" />
          <span className="hidden md:inline text-xs">Search vault, users, codes...</span>
          <span className="md:hidden text-xs">Search...</span>
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-prevu-surface border border-prevu-surface-light text-prevu-text-muted rounded">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Operational Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Operational</span>
        </div>

        {/* Quick Upload Button */}
        <Button
          size="sm"
          className="h-8 px-3 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
          asChild
        >
          <Link href="/upload">
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload Paper</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
