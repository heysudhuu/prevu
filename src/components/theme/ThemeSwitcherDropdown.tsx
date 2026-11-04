'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PREVU_THEMES, ThemeDefinition } from '@/lib/constants/themes'
import { Palette, ChevronDown, Check, Sparkles, Terminal } from 'lucide-react'

interface ThemeSwitcherDropdownProps {
  compact?: boolean
}

export default function ThemeSwitcherDropdown({ compact = false }: ThemeSwitcherDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentThemeId, setCurrentThemeId] = useState<string>('terminal-git')
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Sync with current theme on mount and on custom events
  useEffect(() => {
    const updateThemeState = () => {
      try {
        const saved = localStorage.getItem('prevu-theme') || 'terminal-git'
        setCurrentThemeId(saved)
      } catch {
        setCurrentThemeId('terminal-git')
      }
    }

    updateThemeState()

    const handleThemeChange = (e: any) => {
      if (e.detail?.theme) {
        setCurrentThemeId(e.detail.theme)
      }
    }

    window.addEventListener('prevu-theme-change', handleThemeChange)
    return () => window.removeEventListener('prevu-theme-change', handleThemeChange)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const activeTheme = PREVU_THEMES.find(t => t.id === currentThemeId) || PREVU_THEMES[0]

  const handleSelectTheme = (theme: ThemeDefinition) => {
    try {
      const root = document.documentElement
      // Remove all theme-* classes
      root.className = root.className.replace(/\btheme-\S+/g, '').trim()
      root.classList.add(`theme-${theme.id}`)

      localStorage.setItem('prevu-theme', theme.id)
      setCurrentThemeId(theme.id)
      setIsOpen(false)

      // Audio feedback chirp
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(587.33, ctx.currentTime)
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1)
          gain.gain.setValueAtTime(0.04, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.1)
        } catch {
          // Audio blocked or unsupported
        }
      }

      // Notify other listeners
      window.dispatchEvent(new CustomEvent('prevu-theme-change', { detail: { theme: theme.id } }))
    } catch (e) {
      console.error('Error setting theme:', e)
    }
  }

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(prev => !prev)}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] hover:border-[#3fb950]/50 text-[11px] font-mono transition-all cursor-pointer shadow-sm ${
          isOpen ? 'ring-1 ring-[#3fb950] border-[#3fb950]' : ''
        }`}
        title="Switch Visual Theme"
      >
        <span 
          className="w-2 h-2 rounded-full animate-pulse shadow-sm"
          style={{ backgroundColor: activeTheme.colors.accent }}
        />
        <span className="text-white font-medium">
          {activeTheme.id}
        </span>
        <ChevronDown className={`w-3 h-3 text-[#7d8590] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#161b22]/98 backdrop-blur-2xl border border-[#30363d] shadow-2xl z-50 overflow-hidden divide-y divide-[#30363d]/50 font-mono text-xs"
          >
            {/* Header */}
            <div className="px-4 py-3 bg-[#0d1117] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-bold text-white text-[11px]">Visual Theme Engine</span>
              </div>
              <span className="text-[10px] text-[#7d8590] px-2 py-0.5 rounded bg-[#161b22] border border-[#30363d]">
                {PREVU_THEMES.length} Palettes
              </span>
            </div>

            {/* Theme Items */}
            <div className="p-1.5 space-y-1 max-h-72 overflow-y-auto">
              {PREVU_THEMES.map((theme) => {
                const isSelected = theme.id === currentThemeId
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => handleSelectTheme(theme)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group ${
                      isSelected
                        ? 'bg-[#21262d] border border-[#30363d]'
                        : 'hover:bg-[#21262d]/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Swatch dots */}
                      <div className="flex -space-x-1 shrink-0">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: theme.colors.bg }}
                        />
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-white truncate flex items-center gap-1.5 text-xs">
                          <span>{theme.name}</span>
                          {theme.isNew && (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#7d8590] truncate">
                          {theme.category} &bull; {theme.tag}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="w-5 h-5 rounded-full bg-[#238636] flex items-center justify-center text-white shrink-0 shadow-sm">
                        <Check className="w-3 h-3" />
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#7d8590] group-hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        Apply
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Footer */}
            <div className="p-2.5 bg-[#0d1117] text-center">
              <a
                href="#themes"
                onClick={() => setIsOpen(false)}
                className="text-[11px] text-emerald-400 hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>View Full Studio &amp; Add Themes &rarr;</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}

