'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Sparkles, Check, ChevronDown } from 'lucide-react'

// Web Audio API retro terminal chirp / mechanical key click
function playThemeSound(isHacker: boolean) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()

    if (isHacker) {
      // 8-bit cyber glitch chirp
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(440, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08)
    } else {
      // Soft ambient chime
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.1)
    }

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.11)
  } catch {
    // Audio fallback
  }
}

export default function HackerModeToggle({ 
  compact = false,
  className = "" 
}: { 
  compact?: boolean
  className?: string 
}) {
  const [isHacker, setIsHacker] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  // Initialize theme from document or localStorage
  useEffect(() => {
    const isAlreadyHacker = document.documentElement.classList.contains('theme-hacker') || 
      localStorage.getItem('prevu-theme') === 'hacker'
    
    if (isAlreadyHacker) {
      document.documentElement.classList.add('theme-hacker')
      setIsHacker(true)
    }

    // Keyboard shortcut: Alt + H or Ctrl + Shift + H
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'h') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h')) {
        e.preventDefault()
        setTheme(!isHacker)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isHacker])

  const setTheme = (hackerMode: boolean) => {
    if (hackerMode) {
      document.documentElement.classList.add('theme-hacker')
      localStorage.setItem('prevu-theme', 'hacker')
      setIsHacker(true)
      setToastMessage('> MATRIX RAIN ENGAGED [0x00FF00]')
      playThemeSound(true)
    } else {
      document.documentElement.classList.remove('theme-hacker')
      localStorage.setItem('prevu-theme', 'cosmic')
      setIsHacker(false)
      setToastMessage('> RESTORED COSMIC VIOLET THEME')
      playThemeSound(false)
    }

    setMenuOpen(false)
    window.dispatchEvent(new CustomEvent('prevu-theme-change', { detail: { theme: hackerMode ? 'hacker' : 'cosmic' } }))
    setTimeout(() => setToastMessage(''), 2200)
  }

  return (
    <div ref={menuRef} className={`relative inline-block ${className}`}>
      {/* Theme Trigger Pill */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        title="Change Visual Theme (Alt + H)"
        className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all select-none cursor-pointer text-xs font-mono font-bold ${
          isHacker
            ? 'bg-[#031506] border-[#00ff66] text-[#00ff66] shadow-[0_0_15px_rgba(0,255,102,0.4)]'
            : 'bg-prevu-surface/80 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-purple-500/40'
        }`}
        aria-label="Select Theme"
      >
        <span className={`w-2 h-2 rounded-full transition-colors ${
          isHacker ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66] animate-pulse' : 'bg-purple-400'
        }`} />

        {isHacker ? (
          <Terminal className="w-3.5 h-3.5 text-[#00ff66]" />
        ) : (
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
        )}

        {!compact && (
          <span className="hidden sm:inline">
            {isHacker ? '[SYS: MATRIX]' : '[SYS: COSMIC]'}
          </span>
        )}

        <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Theme Selection Dropdown Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute right-0 top-full mt-2 w-64 p-2 rounded-2xl border shadow-2xl z-50 backdrop-blur-2xl ${
              isHacker
                ? 'bg-[#020b04]/98 border-[#00ff66]/50 shadow-[0_0_25px_rgba(0,255,102,0.25)]'
                : 'bg-[#0f0f1a]/98 border-prevu-surface-light shadow-black/80'
            }`}
          >
            <div className={`px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider font-bold mb-1 ${
              isHacker ? 'text-[#00ff66]/80' : 'text-prevu-text-muted'
            }`}>
              Select Environment Theme
            </div>

            {/* Option 1: Cosmic Violet */}
            <button
              onClick={() => setTheme(false)}
              className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer ${
                !isHacker
                  ? 'bg-purple-600/20 border border-purple-500/40 text-white'
                  : 'hover:bg-white/5 text-prevu-text-muted hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Cosmic Violet</div>
                  <div className="text-[10px] text-prevu-text-muted">Standard Academic UI</div>
                </div>
              </div>
              {!isHacker && <Check className="w-4 h-4 text-purple-400" />}
            </button>

            {/* Option 2: Matrix Hacker */}
            <button
              onClick={() => setTheme(true)}
              className={`w-full mt-1.5 p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer font-mono ${
                isHacker
                  ? 'bg-[#06240d] border border-[#00ff66] text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.3)]'
                  : 'hover:bg-white/5 text-prevu-text-muted hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-black border border-[#00ff66] flex items-center justify-center text-[#00ff66] shadow-[0_0_8px_#00ff66]">
                  <Terminal className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className={`text-xs font-bold ${isHacker ? 'text-[#00ff66]' : 'text-white'}`}>
                    Matrix Hacker
                  </div>
                  <div className="text-[10px] text-emerald-400/80">Digital Code Rain & CLI</div>
                </div>
              </div>
              {isHacker && <Check className="w-4 h-4 text-[#00ff66]" />}
            </button>

            <div className={`mt-2 pt-2 border-t px-2 text-[10px] flex items-center justify-between ${
              isHacker ? 'border-[#00ff66]/20 text-[#00ff66]/60 font-mono' : 'border-white/10 text-prevu-text-muted'
            }`}>
              <span>Toggle Shortcut</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Alt + H</kbd>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Retro HUD Terminal Status Popover */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl border shadow-2xl font-mono text-xs flex items-center gap-2 backdrop-blur-xl ${
              isHacker
                ? 'bg-[#000000]/95 border-[#00ff66] text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.4)]'
                : 'bg-[#100c24]/95 border-purple-500/50 text-purple-200 shadow-purple-900/40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isHacker ? 'bg-[#00ff66] animate-ping' : 'bg-purple-400'}`} />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
