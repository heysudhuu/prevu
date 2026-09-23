'use client'

import React, { useState, useEffect } from 'react'
import { AdminSidebar, AdminNavBadgeCounts } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'
import { AdminCommandPalette } from '../CommandPalette'

interface AdminLayoutShellProps {
  children: React.ReactNode
  adminEmail: string
  adminRole: string
  badgeCounts: AdminNavBadgeCounts
  searchPapers: Array<{ id: string; title: string; code: string; year?: number }>
  searchUsers: Array<{ id: string; name: string; username?: string; email?: string; student_uid?: string }>
}

export function AdminLayoutShell({
  children,
  adminEmail,
  adminRole,
  badgeCounts,
  searchPapers,
  searchUsers
}: AdminLayoutShellProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  // Global ⌘K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCommandPaletteOpen(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-prevu-bg text-prevu-text flex">
      {/* Persistent Sidebar */}
      <AdminSidebar
        adminEmail={adminEmail}
        adminRole={adminRole}
        badgeCounts={badgeCounts}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area with Desktop Sidebar offset */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <AdminHeader
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global ⌘K Command Center */}
      <AdminCommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        papers={searchPapers}
        users={searchUsers}
      />
    </div>
  )
}
