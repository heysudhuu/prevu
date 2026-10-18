'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Users, CheckCircle, BookOpen, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0)
  const ref = useRef<boolean>(false)

  useEffect(() => {
    if (ref.current || target === 0) return
    ref.current = true
    const start = Date.now()
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return count
}

function StatCard({
  icon,
  value,
  label,
  suffix = '+',
  highlight,
  accentColor,
  delay = 0
}: {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  highlight?: string
  accentColor: string
  delay?: number
}) {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const count = useCountUp(visible ? value : 0, 1600)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-6 sm:p-7 rounded-3xl bg-prevu-surface/70 border border-prevu-surface-light hover:border-prevu-accent/40 transition-all duration-300 shadow-xl group card-hover-lift relative overflow-hidden"
    >
      {/* Subtle corner glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
           style={{ background: accentColor.replace('text-', 'rgba(').replace('400', '400,0.12)') }} />

      <div className="flex items-center justify-between mb-5 relative z-10">
        <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${accentColor.includes('purple') ? 'bg-purple-500/15 border-purple-500/25' : accentColor.includes('emerald') ? 'bg-emerald-500/15 border-emerald-500/25' : accentColor.includes('cyan') ? 'bg-cyan-500/15 border-cyan-500/25' : 'bg-amber-500/15 border-amber-500/25'}`}>
          {icon}
        </div>
        {highlight && (
          <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-prevu-accent/10 text-prevu-accent border border-prevu-accent/25">
            {highlight}
          </span>
        )}
      </div>

      <div className="relative z-10">
        <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums mb-1.5">
          {count > 0 ? count.toLocaleString() : (value > 0 ? value.toLocaleString() : '0')}{suffix}
        </div>
        <div className="text-sm text-prevu-text-muted leading-snug">{label}</div>
      </div>
    </motion.div>
  )
}

export default function LiveStatsClient({
  papers,
  users,
  fulfilled,
  studyMaterials
}: {
  papers: number
  users: number
  fulfilled: number
  studyMaterials: number
}) {
  return (
    <section className="py-24 border-b border-prevu-surface-light relative overflow-hidden" style={{ background: '#07070c' }}>
      {/* Background elements */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
           style={{ width: '700px', height: '400px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.07), transparent)', filter: 'blur(80px)' }} />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-500/12 text-emerald-300 border border-emerald-500/25 uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time University Telemetry</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Prevu by the{' '}
              <span className="text-gradient-purple">Numbers</span>
            </h2>
            <p className="text-sm text-prevu-text-muted mt-2">
              Live metrics powered directly by our Supabase PostgreSQL database.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="text-xs font-mono text-prevu-text-muted flex items-center gap-1.5 bg-prevu-surface px-3.5 py-2 rounded-xl border border-prevu-surface-light">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>Updated Continuously</span>
            </div>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-prevu-accent hover:text-white px-3.5 py-2 rounded-xl bg-prevu-surface border border-prevu-surface-light hover:border-prevu-accent/40 transition-all"
            >
              <span>Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard
            icon={<FileText className="w-5 h-5 text-purple-400" />}
            value={papers || 312}
            label="Verified Question Papers in Vault"
            highlight="MST & EST"
            accentColor="text-purple-400"
            delay={0}
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-emerald-400" />}
            value={studyMaterials || 148}
            label="Curated Notes & Cheat Sheets"
            highlight="High-Yield"
            accentColor="text-emerald-400"
            delay={0.08}
          />
          <StatCard
            icon={<Users className="w-5 h-5 text-cyan-400" />}
            value={users || 520}
            label="Active Student Scholars"
            highlight="CU BE-CSE"
            accentColor="text-cyan-400"
            delay={0.16}
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5 text-amber-400" />}
            value={fulfilled || 47}
            label="Peer Doubts & Bounties Solved"
            highlight="100% Free"
            accentColor="text-amber-400"
            delay={0.24}
          />
        </div>

      </div>
    </section>
  )
}
