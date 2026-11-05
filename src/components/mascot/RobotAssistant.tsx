'use client'

import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, 
  Sparkles, 
  BookOpen, 
  ShieldAlert, 
  Cpu, 
  Bot, 
  ArrowRight,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'

interface RobotAssistantProps {
  isOpen: boolean
  onClose: () => void
  robotPosition?: { x: number; y: number }
}

export default function RobotAssistant({
  isOpen,
  onClose
}: RobotAssistantProps) {
  const popoverRef = useRef<HTMLDivElement>(null)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen, onClose])

  const handleOpenAiChat = () => {
    onClose()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('prevu:open-ai-chat'))
    }
  }

  const handleScrollToSection = (id: string) => {
    onClose()
    if (typeof window !== 'undefined') {
      const el = document.getElementById(id)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, y: 15, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15, scale: 0.94 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          role="dialog"
          aria-modal="false"
          aria-label="Prevu Academic Assistant"
          className="absolute bottom-28 left-1/2 -translate-x-1/2 w-[320px] sm:w-[350px] rounded-2xl bg-[#0f0f1a]/95 border border-[#8b5cf6]/40 p-4 shadow-2xl shadow-purple-950/60 backdrop-blur-xl text-left font-sans z-50 pointer-events-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#30363d]/60">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  Vee Assistant
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-purple-300/80 font-mono">Prevu Academic Companion</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-[#8888a8] hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Dismiss assistant"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Welcome Greeting */}
          <div className="space-y-1.5 mb-3.5">
            <p className="text-xs text-[#e6edf3] leading-relaxed">
              👋 <strong className="text-white">Hey Scholar!</strong> How can I accelerate your study session today?
            </p>
            <p className="text-[11px] text-[#8888a8] leading-normal font-mono">
              Access verified question papers, exam blueprints, or ask our AI tutor.
            </p>
          </div>

          {/* Quick Actions List */}
          <div className="space-y-2 mb-3">
            <Link
              href="/browse"
              onClick={onClose}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-purple-950/30 hover:bg-purple-900/40 border border-purple-500/25 hover:border-purple-400/50 text-xs text-white font-medium transition-all group"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-3.5 h-3.5 text-purple-400 group-hover:scale-110 transition-transform" />
                Explore Study Hub
              </span>
              <ArrowRight className="w-3 h-3 text-purple-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={() => handleScrollToSection('reappear-rescue')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-950/20 hover:bg-amber-900/30 border border-amber-500/25 hover:border-amber-400/50 text-xs text-white font-medium transition-all group cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
                Reappear Rescue (80/20)
              </span>
              <ArrowRight className="w-3 h-3 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              href="/cbt"
              onClick={onClose}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/20 hover:bg-cyan-900/30 border border-cyan-500/25 hover:border-cyan-400/50 text-xs text-white font-medium transition-all group"
            >
              <span className="flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
                CBT Exam Simulator
              </span>
              <ArrowRight className="w-3 h-3 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              type="button"
              onClick={handleOpenAiChat}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/20 hover:bg-emerald-900/30 border border-emerald-500/25 hover:border-emerald-400/50 text-xs text-white font-medium transition-all group cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                Ask Vee AI Tutor
              </span>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                OpenAI
              </span>
            </button>
          </div>

          {/* Footer Dismiss Note */}
          <div className="pt-2 border-t border-[#30363d]/40 flex items-center justify-between text-[10px] text-[#8888a8] font-mono">
            <span>Press Esc to close</span>
            <span className="text-purple-400">Prevu v2.6</span>
          </div>

          {/* Speech Triangle Pointer towards the robot */}
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#0f0f1a] border-r border-b border-[#8b5cf6]/40 rotate-45 transform" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

