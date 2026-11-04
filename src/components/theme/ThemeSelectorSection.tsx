'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PREVU_THEMES, ThemeDefinition } from '@/lib/constants/themes'
import { Palette, Check, Sparkles, Terminal, Plus, ArrowRight, Shield, Flame, Laptop } from 'lucide-react'

export default function ThemeSelectorSection() {
  const [currentTheme, setCurrentTheme] = useState<string>('terminal-git')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null)

  // Sync with current theme on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prevu-theme') || 'terminal-git'
      setCurrentTheme(saved)
    } catch {
      setCurrentTheme('terminal-git')
    }
  }, [])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(PREVU_THEMES.map(t => t.category)))]
  }, [])

  const filteredThemes = useMemo(() => {
    if (selectedCategory === 'All') return PREVU_THEMES
    return PREVU_THEMES.filter(t => t.category === selectedCategory)
  }, [selectedCategory])

  const handleApplyTheme = (theme: ThemeDefinition) => {
    try {
      // 1. Update documentElement classes
      const root = document.documentElement
      // Remove any existing theme-* classes
      root.className = root.className.replace(/\btheme-\S+/g, '').trim()
      root.classList.add(`theme-${theme.id}`)

      // 2. Persist in localStorage
      localStorage.setItem('prevu-theme', theme.id)
      setCurrentTheme(theme.id)

      // 3. Audio feedback
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
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
          // Audio blocked or unsupported
        }
      }

      // 4. Notification banner
      setAppliedNotification(theme.name)
      setTimeout(() => setAppliedNotification(null), 3500)

      // 5. Dispatch event for global listeners
      window.dispatchEvent(new CustomEvent('prevu-theme-change', { detail: { theme: theme.id } }))
    } catch (e) {
      console.error('Error applying theme:', e)
    }
  }

  return (
    <section id="themes" className="py-24 border-b border-[#30363d]/60 bg-[#0d1117] relative overflow-hidden font-mono">
      
      {/* Background Subtle Isometric Grid */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 mb-4">
              <Palette className="w-3.5 h-3.5" />
              <span>Visual Theme Engine // Multi-Palette Studio</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Personalize Your <span className="text-emerald-400">Workspace.</span>
            </h2>
            
            <p className="text-xs sm:text-sm text-[#7d8590] mt-2 max-w-xl leading-relaxed">
              Choose your preferred engineering color profile. Prevu adapts typography, code palettes, cards, and accent blooms in real time.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-[#161b22] border border-[#30363d] self-start md:self-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
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

        {/* Floating Toast when theme is applied */}
        <AnimatePresence>
          {appliedNotification && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              className="fixed top-20 right-4 sm:right-8 z-50 px-4 py-3 rounded-2xl bg-[#161b22] border border-emerald-400/60 text-white shadow-2xl flex items-center gap-3 font-mono text-xs"
            >
              <div className="w-6 h-6 rounded-full bg-[#238636] flex items-center justify-center text-white shrink-0">
                <Check className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="font-bold text-emerald-400 block">Theme Applied!</span>
                <span className="text-[11px] text-[#7d8590]">Switched to &ldquo;{appliedNotification}&rdquo; palette</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredThemes.map((theme) => {
            const isActive = currentTheme === theme.id
            return (
              <motion.div
                key={theme.id}
                layout
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className={`rounded-2xl p-6 bg-[#161b22] border transition-all duration-300 flex flex-col justify-between relative group ${
                  isActive
                    ? 'border-[#3fb950] shadow-[0_0_25px_rgba(35,134,54,0.25)] ring-1 ring-[#3fb950]/50'
                    : 'border-[#30363d] hover:border-[#7d8590]'
                }`}
              >
                {/* Top Badge & Active Indicator */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#0d1117] border border-[#30363d] text-[#7d8590]">
                      {theme.category}
                    </span>
                    
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active Theme
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#7d8590]">
                        {theme.tag}
                      </span>
                    )}
                  </div>

                  {/* Theme Miniature Preview Box */}
                  <div 
                    className="p-3.5 rounded-xl border mb-4 shadow-inner"
                    style={{ 
                      backgroundColor: theme.colors.bg, 
                      borderColor: theme.colors.border 
                    }}
                  >
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/10">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-500/80" />
                        <span className="w-2 h-2 rounded-full bg-amber-500/80" />
                        <span className="w-2 h-2 rounded-full bg-emerald-500/80" />
                      </div>
                      <span className="text-[9px] font-mono opacity-60 text-white">preview.sh</span>
                    </div>

                    <div className="space-y-1.5 text-[10px] font-mono">
                      <div className="font-bold truncate" style={{ color: theme.colors.accent }}>
                        $ prevu theme --set {theme.id}
                      </div>
                      <div 
                        className="p-1.5 rounded text-[9px] truncate"
                        style={{ backgroundColor: theme.colors.surface, color: theme.colors.text }}
                      >
                        [OK] {theme.name} palette synchronized
                      </div>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-white mb-1.5 flex items-center justify-between">
                    <span>{theme.name}</span>
                    {theme.isNew && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-500/30 font-bold">
                        NEW
                      </span>
                    )}
                  </h3>
                  
                  <p className="text-xs text-[#7d8590] leading-relaxed mb-5">
                    {theme.description}
                  </p>

                  {/* 4 Color Palette Swatches */}
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-[10px] font-mono text-[#7d8590] mr-1">Palette:</span>
                    <span 
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: theme.colors.bg }}
                      title={`Background: ${theme.colors.bg}`}
                    />
                    <span 
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: theme.colors.surface }}
                      title={`Surface: ${theme.colors.surface}`}
                    />
                    <span 
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: theme.colors.accent }}
                      title={`Accent: ${theme.colors.accent}`}
                    />
                    <span 
                      className="w-5 h-5 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: theme.colors.text }}
                      title={`Text: ${theme.colors.text}`}
                    />
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  type="button"
                  onClick={() => handleApplyTheme(theme)}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#238636] text-white shadow-lg shadow-[#238636]/30'
                      : 'bg-[#0d1117] border border-[#30363d] text-white hover:bg-[#21262d] hover:border-emerald-500/40'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Applied to Prevu</span>
                    </>
                  ) : (
                    <>
                      <span>Apply {theme.name}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </motion.div>
            )
          })}

          {/* Card: Add More Themes / Community Contributor Slot */}
          <div className="rounded-2xl p-6 bg-[#161b22]/50 border border-dashed border-[#30363d] hover:border-emerald-500/50 transition-all flex flex-col justify-between group">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#0d1117] border border-[#30363d] flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Plus className="w-5 h-5" />
              </div>

              <h3 className="text-lg font-bold text-white mb-1.5">
                Add More Themes
              </h3>

              <p className="text-xs text-[#7d8590] leading-relaxed mb-4">
                Prevu is completely open source. Add custom palettes simply by registering 6 hex colors in <code className="text-emerald-400">src/lib/constants/themes.ts</code>.
              </p>

              <div className="p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-[10px] text-[#7d8590] space-y-1">
                <div className="text-emerald-400 font-bold">// Pull Request Template</div>
                <div>+ id: &apos;nord-arctic&apos;</div>
                <div>+ accent: &apos;#88c0d0&apos;</div>
                <div>+ surface: &apos;#2e3440&apos;</div>
              </div>
            </div>

            <div className="pt-6">
              <a
                href="https://github.com/heysudhuu/prevu"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl text-xs font-mono font-bold bg-[#0d1117] border border-[#30363d] text-white hover:bg-[#21262d] hover:border-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Propose Theme on GitHub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
