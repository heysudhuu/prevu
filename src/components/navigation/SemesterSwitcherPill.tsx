'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { GraduationCap, ChevronDown, Check, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SEMESTERS = [
  { sem: 1, year: 1, label: 'Semester 1', tag: 'Freshman' },
  { sem: 2, year: 1, label: 'Semester 2', tag: 'Freshman' },
  { sem: 3, year: 2, label: 'Semester 3', tag: 'Sophomore' },
  { sem: 4, year: 2, label: 'Semester 4', tag: 'Sophomore' },
  { sem: 5, year: 3, label: 'Semester 5', tag: 'Junior' },
  { sem: 6, year: 3, label: 'Semester 6', tag: 'Junior' },
  { sem: 7, year: 4, label: 'Semester 7', tag: 'Senior' },
  { sem: 8, year: 4, label: 'Semester 8', tag: 'Senior' },
]

export default function SemesterSwitcherPill() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [activeSem, setActiveSem] = useState<number>(3)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pillRef = useRef<HTMLDivElement>(null)

  // Initialize from URL search param or localStorage only after mount
  useEffect(() => {
    setMounted(true)
    const urlSem = searchParams.get('sem')
    if (urlSem && !isNaN(parseInt(urlSem))) {
      const parsed = parseInt(urlSem)
      setActiveSem(parsed)
      try {
        localStorage.setItem('prevu_active_semester', String(parsed))
      } catch {
        // ignore storage errors
      }
      return
    }

    try {
      const stored = localStorage.getItem('prevu_active_semester')
      if (stored && !isNaN(parseInt(stored))) {
        setActiveSem(parseInt(stored))
      }
    } catch {
      // ignore
    }
  }, [searchParams])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectSemester = (sem: number) => {
    setActiveSem(sem)
    setIsOpen(false)

    try {
      localStorage.setItem('prevu_active_semester', String(sem))
      window.dispatchEvent(new CustomEvent('prevu_semester_change', { detail: { semester: sem } }))
    } catch {
      // ignore
    }

    // If on browse page, immediately update the filter query
    if (pathname === '/browse') {
      const p = new URLSearchParams(searchParams.toString())
      p.set('sem', String(sem))
      p.delete('page')
      p.delete('subject')
      router.push(`/browse?${p.toString()}`)
    }
  }

  return (
    <div ref={pillRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-prevu-surface-light/80 hover:bg-prevu-surface-elevated text-prevu-text hover:text-white border border-prevu-surface-light hover:border-prevu-accent/50 shadow-sm transition-all cursor-pointer group"
        title="Quick-switch your active semester"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:bg-prevu-accent transition-colors animate-pulse" />
        <span className="font-mono text-prevu-accent font-bold" suppressHydrationWarning>
          Sem {mounted ? activeSem : 3}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-prevu-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180 text-white' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 w-64 p-2 rounded-2xl bg-[#11111a]/95 backdrop-blur-2xl border border-prevu-surface-light shadow-2xl shadow-black/80 z-50 text-xs"
          >
            <div className="px-3 py-1.5 flex items-center justify-between border-b border-prevu-surface-light/60 pb-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-prevu-text-muted font-bold">
                Switch Semester
              </span>
              <span className="text-[10px] text-prevu-accent font-semibold flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> BE-CSE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 py-1">
              {SEMESTERS.map((item) => {
                const isCurrent = item.sem === activeSem
                return (
                  <button
                    key={item.sem}
                    type="button"
                    onClick={() => handleSelectSemester(item.sem)}
                    className={`flex items-center justify-between p-2 rounded-xl text-left transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-prevu-accent text-white font-bold shadow-sm'
                        : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60'
                    }`}
                  >
                    <div>
                      <div className="text-xs">{item.label}</div>
                      <div className="text-[10px] opacity-75 font-mono">Yr {item.year}</div>
                    </div>
                    {isCurrent && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                )
              })}
            </div>

            <div className="mt-1 pt-2 border-t border-prevu-surface-light/60 px-2 text-[10px] text-prevu-text-muted text-center">
              Tailors subjects &amp; PYQs instantly
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
