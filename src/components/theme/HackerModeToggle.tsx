'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Shield, Zap, Sparkles } from 'lucide-react'

// Web Audio API retro terminal keyclick / chirp
function playTerminalChirp(isEnabling: boolean) {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    if (ctx.state === 'suspended') ctx.resume()

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = isEnabling ? 'sawtooth' : 'sine'
    osc.frequency.setValueAtTime(isEnabling ? 440 : 880, ctx.currentTime)
    osc.frequency.exponentialRampToValueAtTime(isEnabling ? 880 : 330, ctx.currentTime + 0.08)

    gain.gain.setValueAtTime(0.12, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08)

    osc.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    osc.stop(ctx.currentTime + 0.09)
  } catch {
    // Audio policy fallback
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
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

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
        toggleTheme()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleTheme = () => {
    const willBeHacker = !document.documentElement.classList.contains('theme-hacker')
    
    if (willBeHacker) {
      document.documentElement.classList.add('theme-hacker')
      localStorage.setItem('prevu-theme', 'hacker')
      setIsHacker(true)
      setToastMessage('> ROOT TERMINAL ENGAGED [PHOSPHOR GREEN]')
      playTerminalChirp(true)
    } else {
      document.documentElement.classList.remove('theme-hacker')
      localStorage.setItem('prevu-theme', 'cosmic')
      setIsHacker(false)
      setToastMessage('> RESTORED COSMIC VIOLET THEME')
      playTerminalChirp(false)
    }

    // Dispatch event so 3D canvases and widgets can react
    window.dispatchEvent(new CustomEvent('prevu-theme-change', { detail: { theme: willBeHacker ? 'hacker' : 'cosmic' } }))

    setShowToast(true)
    setTimeout(() => setShowToast(false), 2200)
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleTheme}
        title={isHacker ? "Switch to Cosmic Theme (Alt + H)" : "Engage Hacker Terminal Mode (Alt + H)"}
        className={`group relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all select-none cursor-pointer text-xs font-mono font-bold ${
          isHacker
            ? 'bg-[#061e0b] border-[#00ff66]/60 text-[#00ff66] shadow-[0_0_12px_rgba(0,255,102,0.35)]'
            : 'bg-prevu-surface/80 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-purple-500/40'
        } ${className}`}
        aria-label="Toggle Hacker Mode"
      >
        {/* Pulsing indicator */}
        <span className={`w-2 h-2 rounded-full transition-colors ${
          isHacker ? 'bg-[#00ff66] shadow-[0_0_8px_#00ff66] animate-pulse' : 'bg-purple-400/60'
        }`} />

        <Terminal className={`w-3.5 h-3.5 transition-transform duration-300 ${
          isHacker ? 'text-[#00ff66] group-hover:scale-110' : 'text-cyan-400 group-hover:rotate-12'
        }`} />

        {!compact && (
          <span className="hidden sm:inline">
            {isHacker ? '[SYS: HACKER]' : '[SYS: COSMIC]'}
          </span>
        )}
      </button>

      {/* Retro HUD Terminal Status Popover */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-xl border shadow-2xl font-mono text-xs flex items-center gap-2 backdrop-blur-xl ${
              isHacker
                ? 'bg-[#041006]/95 border-[#00ff66]/70 text-[#00ff66] shadow-[0_0_20px_rgba(0,255,102,0.3)]'
                : 'bg-[#100c24]/95 border-purple-500/50 text-purple-200 shadow-purple-900/40'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isHacker ? 'bg-[#00ff66] animate-ping' : 'bg-purple-400'}`} />
            <span>{toastMessage}</span>
            <span className="text-[10px] opacity-60 ml-2">(Alt + H)</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

