'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  FileText,
  Users,
  AlertTriangle,
  GraduationCap,
  Calendar,
  BarChart3,
  Shield,
  Activity,
  CheckSquare,
  ArrowRight,
  X
} from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  // Optional pre-fetched search items
  papers?: Array<{ id: string; title: string; code: string; year?: number }>
  users?: Array<{ id: string; name: string; username?: string; email?: string; student_uid?: string }>
}

interface QuickAction {
  id: string
  label: string
  category: 'Navigation' | 'Action'
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'dash', label: 'Go to Dashboard', category: 'Navigation', href: '/admin/dashboard', icon: BarChart3 },
  { id: 'papers', label: 'Browse Question Papers', category: 'Navigation', href: '/admin/papers', icon: FileText },
  { id: 'mod', label: 'Moderation Queue', category: 'Navigation', href: '/admin/moderation', icon: CheckSquare },
  { id: 'users', label: 'Manage Users & Roles', category: 'Navigation', href: '/admin/users', icon: Users },
  { id: 'reports', label: 'View Problem Reports', category: 'Navigation', href: '/admin/reports', icon: AlertTriangle },
  { id: 'acad', label: 'Academic Hierarchy CMS', category: 'Navigation', href: '/admin/academic', icon: GraduationCap },
  { id: 'cal', label: 'CU Academic Calendar', category: 'Navigation', href: '/admin/calendar', icon: Calendar },
  { id: 'sec', label: 'Security Center', category: 'Navigation', href: '/admin/security', icon: Shield },
  { id: 'sys', label: 'System Diagnostics & Health', category: 'Navigation', href: '/admin/system', icon: Activity }
]

export function AdminCommandPalette({
  isOpen,
  onClose,
  papers = [],
  users = []
}: CommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleClose = React.useCallback(() => {
    setQuery('')
    setSelectedIndex(0)
    onClose()
  }, [onClose, setQuery, setSelectedIndex])

  // Filter items
  const cleanQuery = query.trim().toLowerCase()

  const filteredActions = React.useMemo(() => {
    return cleanQuery
      ? QUICK_ACTIONS.filter(a => a.label.toLowerCase().includes(cleanQuery))
      : QUICK_ACTIONS
  }, [cleanQuery])

  const filteredPapers = React.useMemo(() => {
    return cleanQuery
      ? papers.filter(
          p =>
            p.title?.toLowerCase().includes(cleanQuery) ||
            p.code?.toLowerCase().includes(cleanQuery) ||
            String(p.year || '').includes(cleanQuery)
        ).slice(0, 5)
      : []
  }, [cleanQuery, papers])

  const filteredUsers = React.useMemo(() => {
    return cleanQuery
      ? users.filter(
          u =>
            u.name?.toLowerCase().includes(cleanQuery) ||
            u.username?.toLowerCase().includes(cleanQuery) ||
            u.email?.toLowerCase().includes(cleanQuery) ||
            u.student_uid?.toLowerCase().includes(cleanQuery)
        ).slice(0, 5)
      : []
  }, [cleanQuery, users])

  // Combine items for keyboard navigation
  const allResults = React.useMemo(() => [
    ...filteredActions.map(a => ({ type: 'action' as const, id: a.id, title: a.label, href: a.href, icon: a.icon })),
    ...filteredPapers.map(p => ({
      type: 'paper' as const,
      id: p.id,
      title: `${p.title} (${p.code})`,
      href: `/admin/papers?search=${encodeURIComponent(p.code || p.title)}`,
      icon: FileText
    })),
    ...filteredUsers.map(u => ({
      type: 'user' as const,
      id: u.id,
      title: `${u.name || 'User'} (@${u.username || 'unknown'})`,
      href: `/admin/users?search=${encodeURIComponent(u.username || u.email || u.name)}`,
      icon: Users
    }))
  ], [filteredActions, filteredPapers, filteredUsers])

  const handleSelect = React.useCallback((href: string) => {
    setQuery('')
    setSelectedIndex(0)
    router.push(href)
    onClose()
  }, [router, onClose, setQuery, setSelectedIndex])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % Math.max(1, allResults.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => (prev - 1 + allResults.length) % Math.max(1, allResults.length))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (allResults[selectedIndex]) {
          handleSelect(allResults[selectedIndex].href)
        }
      } else if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, allResults, handleSelect, handleClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Palette Modal */}
      <div className="relative w-full max-w-xl rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-prevu-surface-light bg-prevu-bg/50">
          <Search className="w-5 h-5 text-purple-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search papers, students, course codes (e.g. 23CST), or type a command..."
            className="w-full bg-transparent text-sm text-prevu-text placeholder:text-prevu-text-muted focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-prevu-text-muted hover:text-prevu-text"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-prevu-surface-light/40">
          {allResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-prevu-text-muted">
              No results found matching &ldquo;{query}&rdquo;
            </div>
          ) : (
            <>
              {filteredActions.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-prevu-text-muted/60">
                    Quick Navigation
                  </div>
                  {filteredActions.map((action, idx) => {
                    const isSelected = selectedIndex === idx
                    const Icon = action.icon
                    return (
                      <div
                        key={action.id}
                        onClick={() => handleSelect(action.href)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white font-semibold'
                            : 'text-prevu-text hover:bg-prevu-surface-light/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-prevu-text-muted'}`} />
                          <span>{action.label}</span>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                      </div>
                    )
                  })}
                </div>
              )}

              {filteredPapers.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-prevu-text-muted/60">
                    Question Papers
                  </div>
                  {filteredPapers.map(paper => {
                    const globalIdx = filteredActions.length + filteredPapers.indexOf(paper)
                    const isSelected = selectedIndex === globalIdx
                    return (
                      <div
                        key={paper.id}
                        onClick={() => handleSelect(`/admin/papers?search=${encodeURIComponent(paper.code || paper.title)}`)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white font-semibold'
                            : 'text-prevu-text hover:bg-prevu-surface-light/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-purple-400'}`} />
                          <span className="truncate">{paper.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                            isSelected ? 'bg-white/20 border-white/30 text-white' : 'bg-purple-500/10 border-purple-500/20 text-purple-300'
                          }`}>
                            {paper.code}
                          </span>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                      </div>
                    )
                  })}
                </div>
              )}

              {filteredUsers.length > 0 && (
                <div className="py-1.5">
                  <div className="px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-wider text-prevu-text-muted/60">
                    Students & Accounts
                  </div>
                  {filteredUsers.map(user => {
                    const globalIdx = filteredActions.length + filteredPapers.length + filteredUsers.indexOf(user)
                    const isSelected = selectedIndex === globalIdx
                    return (
                      <div
                        key={user.id}
                        onClick={() => handleSelect(`/admin/users?search=${encodeURIComponent(user.username || user.name)}`)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-purple-600 text-white font-semibold'
                            : 'text-prevu-text hover:bg-prevu-surface-light/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Users className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-cyan-400'}`} />
                          <span className="truncate font-medium">{user.name || 'Student'}</span>
                          <span className="text-[11px] font-mono opacity-70">@{user.username || 'user'}</span>
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'opacity-100' : 'opacity-30'}`} />
                      </div>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-prevu-bg/80 border-t border-prevu-surface-light flex items-center justify-between text-[11px] text-prevu-text-muted">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-prevu-surface border border-prevu-surface-light rounded font-mono">↑↓</kbd> to navigate</span>
            <span><kbd className="px-1 py-0.5 bg-prevu-surface border border-prevu-surface-light rounded font-mono">↵</kbd> to select</span>
          </div>
          <span><kbd className="px-1 py-0.5 bg-prevu-surface border border-prevu-surface-light rounded font-mono">esc</kbd> to close</span>
        </div>
      </div>
    </div>
  )
}
