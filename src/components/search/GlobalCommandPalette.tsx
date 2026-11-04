'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { PREVU_THEMES } from '@/lib/constants/themes'
import {
  Search,
  BookOpen,
  Sparkles,
  Palette,
  FileText,
  Upload,
  Calendar,
  Trophy,
  ArrowRight,
  Terminal,
  X,
  GraduationCap
} from 'lucide-react'

interface CommandItem {
  id: string
  title: string
  subtitle: string
  category: 'Semesters' | 'Courses' | 'Tools' | 'Themes'
  icon: React.ReactNode
  action: () => void
  badge?: string
}

export default function GlobalCommandPalette() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Global Ctrl+K / Cmd+K and custom event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    const handleCustomOpen = () => setIsOpen(true)

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('open-command-palette', handleCustomOpen)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-command-palette', handleCustomOpen)
    }
  }, [isOpen])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Build command catalogue
  const allItems: CommandItem[] = [
    // Tools
    {
      id: 'tool-cbt',
      title: 'Launch CBT Simulator',
      subtitle: 'Hardware-accelerated aptitude & elective test mock arena with live timer',
      category: 'Tools',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      action: () => { router.push('/cbt'); setIsOpen(false) },
      badge: 'Interactive'
    },
    {
      id: 'tool-browse',
      title: 'Academic Papers Vault',
      subtitle: 'Browse all verified question papers (MST-1, MST-2, EST)',
      category: 'Tools',
      icon: <FileText className="w-4 h-4 text-emerald-400" />,
      action: () => { router.push('/browse'); setIsOpen(false) }
    },
    {
      id: 'tool-upload',
      title: 'Upload Question Paper',
      subtitle: 'Contribute a solved key or question paper to earn bounty reputation',
      category: 'Tools',
      icon: <Upload className="w-4 h-4 text-purple-400" />,
      action: () => { router.push('/upload'); setIsOpen(false) }
    },
    {
      id: 'tool-leaderboard',
      title: 'Hall of Fame Leaderboard',
      subtitle: 'View top engineering scholars and git commit stars',
      category: 'Tools',
      icon: <Trophy className="w-4 h-4 text-amber-400" />,
      action: () => { router.push('/leaderboard'); setIsOpen(false) }
    },
    {
      id: 'tool-planner',
      title: 'Exam Study Planner',
      subtitle: 'Countdown ticker and personal syllabus revision breakdown',
      category: 'Tools',
      icon: <Calendar className="w-4 h-4 text-cyan-400" />,
      action: () => { router.push('/study-planner'); setIsOpen(false) }
    },

    // Semesters
    ...Array.from({ length: 8 }, (_, i) => {
      const semNum = i + 1
      return {
        id: `sem-${semNum}`,
        title: `Semester ${semNum} Repository`,
        subtitle: `Curriculum deck, core & elective question papers for Semester ${semNum}`,
        category: 'Semesters' as const,
        icon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
        action: () => { router.push(`/browse?sem=${semNum}`); setIsOpen(false) },
        badge: `Sem ${semNum}`
      }
    }),

    // Courses
    {
      id: 'course-os',
      title: '23CSH-242 Operating Systems',
      subtitle: 'Process sync, page replacement, thread scheduling MST & EST papers',
      category: 'Courses',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      action: () => { router.push('/browse?course=23CSH-242'); setIsOpen(false) }
    },
    {
      id: 'course-dbms',
      title: '23CSH-243 Database Management Systems',
      subtitle: 'ER models, relational algebra, B+ trees, ACID solved question papers',
      category: 'Courses',
      icon: <BookOpen className="w-4 h-4 text-emerald-400" />,
      action: () => { router.push('/browse?course=23CSH-243'); setIsOpen(false) }
    },
    {
      id: 'course-dsa',
      title: '22CS201 Data Structures & Algorithms',
      subtitle: 'Graphs, AVL trees, dynamic programming, sorting algorithms',
      category: 'Courses',
      icon: <BookOpen className="w-4 h-4 text-purple-400" />,
      action: () => { router.push('/browse?course=22CS201'); setIsOpen(false) }
    },
    {
      id: 'course-agile',
      title: '23CST-247 Agile Development & DevOps',
      subtitle: 'Scrum ceremonies, sprint backlog, CI/CD pipelines MST-1 & EST',
      category: 'Courses',
      icon: <BookOpen className="w-4 h-4 text-amber-400" />,
      action: () => { router.push('/browse?course=23CST-247'); setIsOpen(false) }
    },
    {
      id: 'course-automata',
      title: '22CST-390 Formal Languages & Automata',
      subtitle: 'DFA, NFA, context-free grammars, Turing machine proofs',
      category: 'Courses',
      icon: <BookOpen className="w-4 h-4 text-rose-400" />,
      action: () => { router.push('/browse?course=22CST-390'); setIsOpen(false) }
    },
    {
      id: 'course-cn',
      title: '23CSH-312 Computer Networks',
      subtitle: 'TCP/IP socket architecture, sliding window, routing algorithms',
      category: 'Courses',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      action: () => { router.push('/browse?course=23CSH-312'); setIsOpen(false) }
    },

    // Themes
    ...PREVU_THEMES.map((t) => ({
      id: `theme-${t.id}`,
      title: `Theme: ${t.name}`,
      subtitle: `${t.category} profile • ${t.description.slice(0, 70)}...`,
      category: 'Themes' as const,
      icon: <Palette className="w-4 h-4 text-pink-400" />,
      action: () => {
        try {
          const root = document.documentElement
          root.className = root.className.replace(/\btheme-\S+/g, '').trim()
          root.classList.add(`theme-${t.id}`)
          localStorage.setItem('prevu-theme', t.id)
          window.dispatchEvent(new CustomEvent('prevu-theme-change', { detail: { theme: t.id } }))
        } catch (e) {
          console.error(e)
        }
        setIsOpen(false)
      },
      badge: t.tag
    }))
  ]

  // Filter items
  const filteredItems = query.trim() === ''
    ? allItems
    : allItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev + 1) % (filteredItems.length || 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % (filteredItems.length || 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action()
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 font-mono">
          
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="w-full max-w-2xl bg-[#161b22] border border-[#30363d] rounded-2xl shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[75vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-[#30363d] bg-[#0d1117] gap-3">
              <Search className="w-4 h-4 text-emerald-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search courses, semesters, CBT tests, themes, or commands..."
                className="flex-1 bg-transparent text-white text-xs sm:text-sm focus:outline-none placeholder:text-[#7d8590] font-mono"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-[#7d8590] hover:text-white p-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-[#21262d] text-[#7d8590] border border-[#30363d]">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredItems.length === 0 ? (
                <div className="py-12 text-center text-xs text-[#7d8590]">
                  No matching academic papers or tools found for &ldquo;{query}&rdquo;.
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => item.action()}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`w-full px-3.5 py-2.5 rounded-xl text-left flex items-center justify-between gap-3 transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#21262d] border border-emerald-500/40 text-white shadow-sm' 
                          : 'hover:bg-[#21262d]/50 text-[#e6edf3] border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 rounded-lg bg-[#0d1117] border border-[#30363d] shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-xs sm:text-sm text-white truncate flex items-center gap-2">
                            <span>{item.title}</span>
                            {item.badge && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[#7d8590]">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#7d8590] truncate font-mono mt-0.5">
                            {item.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#0d1117] text-[#7d8590] border border-[#30363d]/60">
                          {item.category}
                        </span>
                        {isSelected && (
                          <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                    </button>
                  )
                })
              )}
            </div>

            {/* Modal Footer Keybinds */}
            <div className="px-4 py-2.5 bg-[#0d1117] border-t border-[#30363d] flex items-center justify-between text-[11px] text-[#7d8590]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[10px]">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[10px]">↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1.5">
                  <kbd className="px-1.5 py-0.5 rounded bg-[#21262d] border border-[#30363d] text-[10px]">↵</kbd>
                  Select
                </span>
              </div>
              <span className="text-[10px] text-emerald-400/80">
                Prevu Academic Omni-Search
              </span>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
