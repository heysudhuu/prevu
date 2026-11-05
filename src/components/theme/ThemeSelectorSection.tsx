'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PREVU_THEMES, ThemeDefinition } from '@/lib/constants/themes'
import { Palette, Check, ArrowRight, Sliders } from 'lucide-react'

export default function ThemeSelectorSection() {
  const [currentTheme, setCurrentTheme] = useState<string>('terminal-git')
  const [previewThemeId, setPreviewThemeId] = useState<string>('terminal-git')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null)

  // Sync with current theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prevu-theme') || 'terminal-git'
      setCurrentTheme(saved)
      setPreviewThemeId(saved)
    } catch {
      setCurrentTheme('terminal-git')
      setPreviewThemeId('terminal-git')
    }
  }, [])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(PREVU_THEMES.map(t => t.category)))]
  }, [])

  const filteredThemes = useMemo(() => {
    if (selectedCategory === 'All') return PREVU_THEMES
    return PREVU_THEMES.filter(t => t.category === selectedCategory)
  }, [selectedCategory])

  const previewTheme = useMemo(() => {
    return PREVU_THEMES.find(t => t.id === previewThemeId) || PREVU_THEMES[0]
  }, [previewThemeId])

  const handleApplyTheme = (theme: ThemeDefinition) => {
    try {
      const root = document.documentElement
      root.className = root.className.replace(/\btheme-\S+/g, '').trim()
      root.classList.add(`theme-${theme.id}`)

      localStorage.setItem('prevu-theme', theme.id)
      setCurrentTheme(theme.id)
      setPreviewThemeId(theme.id)

      // Audio feedback chirp
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        try {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
          const ctx = new AudioCtx()
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = 'sine'
          osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12) // A5
          gain.gain.setValueAtTime(0.04, ctx.currentTime)
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
          osc.connect(gain)
          gain.connect(ctx.destination)
          osc.start()
          osc.stop(ctx.currentTime + 0.12)
        } catch {
          // Audio blocked
        }
      }

      setAppliedNotification(theme.name)
      setTimeout(() => setAppliedNotification(null), 3000)

      window.dispatchEvent(new CustomEvent('prevu-theme-change', { detail: { theme: theme.id } }))
    } catch (e) {
      console.error('Error applying theme:', e)
    }
  }

  return (
    <section id="themes" className="py-12 sm:py-16 border-b border-[#30363d]/60 bg-[#0d1117] relative overflow-hidden font-mono">
      
      {/* Background Subtle Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl 2xl:max-w-[1720px] relative z-10">
        
        {/* Compact Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 mb-2">
              <Palette className="w-3.5 h-3.5" />
              <span>Visual Theme Engine // Multi-Palette Studio</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Personalize Your <span className="text-emerald-400">Workspace.</span>
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#161b22] border border-[#30363d]">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#238636] text-white font-bold shadow-md shadow-[#238636]/30'
                    : 'text-[#7d8590] hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Floating Notification */}
        <AnimatePresence>
          {appliedNotification && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="fixed top-20 right-4 sm:right-8 z-50 px-4 py-2.5 rounded-2xl bg-[#161b22] border border-emerald-400/60 text-white shadow-2xl flex items-center gap-3 font-mono text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-[#238636] flex items-center justify-center text-white shrink-0">
                <Check className="w-3 h-3" />
              </div>
              <div>
                <span className="font-bold text-emerald-400 block">Theme Applied!</span>
                <span className="text-[11px] text-[#7d8590]">&ldquo;{appliedNotification}&rdquo; palette active</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compact 2-Column Split Workbench Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Quick Palette Selector List (7 Columns) */}
          <div className="lg:col-span-7 bg-[#161b22] border border-[#30363d] rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#30363d]/60 text-xs">
              <span className="text-[#7d8590] font-semibold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                Select Engineering Profile ({filteredThemes.length} available)
              </span>
              <span className="text-[10px] text-[#7d8590]">Click to preview</span>
            </div>

            {/* Grid of Palette Chips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
              {filteredThemes.map((theme) => {
                const isActive = currentTheme === theme.id
                const isPreview = previewThemeId === theme.id
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => {
                      setPreviewThemeId(theme.id)
                    }}
                    onDoubleClick={() => handleApplyTheme(theme)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                      isPreview
                        ? 'bg-[#21262d] border-emerald-500/60 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-[#0d1117]/80 hover:bg-[#21262d]/50 border-[#30363d]/60 hover:border-[#7d8590]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Swatch Trio */}
                      <div className="flex -space-x-1 shrink-0">
                        <span 
                          className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: theme.colors.bg }}
                        />
                        <span 
                          className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="font-bold text-xs text-white truncate flex items-center gap-1.5">
                          <span>{theme.name}</span>
                          {theme.isNew && (
                            <span className="text-[8px] px-1 py-0.2 rounded bg-pink-500/20 text-pink-300 font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#7d8590] truncate">
                          {theme.category}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 ml-2">
                      {isActive ? (
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" /> Active
                        </span>
                      ) : isPreview ? (
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
                          Preview
                        </span>
                      ) : null}
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="pt-3 mt-3 border-t border-[#30363d]/50 flex items-center justify-between text-[11px] text-[#7d8590]">
              <span>Tip: Double click a palette to apply instantly</span>
              <span className="text-white font-semibold">Active: {currentTheme}</span>
            </div>
          </div>

          {/* Right: Live Interactive Studio Canvas (5 Columns) */}
          <div 
            className="lg:col-span-5 rounded-2xl border p-5 flex flex-col justify-between shadow-2xl transition-all duration-300"
            style={{ 
              backgroundColor: previewTheme.colors.surface, 
              borderColor: previewTheme.colors.border 
            }}
          >
            {/* Window Header */}
            <div>
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-[10px] text-white/70 ml-1">
                    studio.prevu // {previewTheme.id}
                  </span>
                </div>
                <span 
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full border"
                  style={{ 
                    borderColor: previewTheme.colors.accent,
                    color: previewTheme.colors.accent,
                    backgroundColor: `${previewTheme.colors.accent}15`
                  }}
                >
                  {previewTheme.tag}
                </span>
              </div>

              {/* Code Snippet Box */}
              <div 
                className="p-3.5 rounded-xl border mb-4 font-mono text-xs space-y-2 shadow-inner"
                style={{ 
                  backgroundColor: previewTheme.colors.bg, 
                  borderColor: previewTheme.colors.border 
                }}
              >
                <div className="text-[11px]" style={{ color: previewTheme.colors.accent }}>
                  $ prevu theme --set {previewTheme.id}
                </div>
                <div className="text-[10px] opacity-80" style={{ color: previewTheme.colors.text }}>
                  [OK] Palette configured for Chandigarh University portal
                </div>
                <div className="flex items-center gap-2 pt-1 text-[9px] opacity-60" style={{ color: previewTheme.colors.textMuted }}>
                  <span>bg: {previewTheme.colors.bg}</span>
                  <span>&bull;</span>
                  <span>accent: {previewTheme.colors.accent}</span>
                </div>
              </div>

              {/* Theme Description */}
              <h3 className="text-base font-bold text-white mb-1">
                {previewTheme.name}
              </h3>
              <p className="text-xs leading-relaxed opacity-75 mb-4" style={{ color: previewTheme.colors.text }}>
                {previewTheme.description}
              </p>

              {/* Color Swatch Bar */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[10px] text-white/60">Swatches:</span>
                {[previewTheme.colors.bg, previewTheme.colors.surface, previewTheme.colors.accent, previewTheme.colors.text].map((color, i) => (
                  <span
                    key={i}
                    className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Apply Button */}
            <div>
              {currentTheme === previewTheme.id ? (
                <div className="w-full py-2.5 rounded-xl text-center text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Currently Active on Site</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleApplyTheme(previewTheme)}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                  style={{ 
                    backgroundColor: previewTheme.colors.accent,
                    color: previewTheme.id === 'monokai-pro' || previewTheme.id === 'matrix-cyber' ? '#000000' : '#ffffff'
                  }}
                >
                  <span>Apply {previewTheme.name} Palette</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
