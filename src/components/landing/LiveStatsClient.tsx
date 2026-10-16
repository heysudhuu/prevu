'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Users, CheckCircle, BookOpen, Sparkles, TrendingUp } from 'lucide-react'

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
  highlight
}: {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  highlight?: string
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="p-5 sm:p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-accent/50 transition-all duration-300 shadow-xl group flex flex-col justify-between"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-prevu-surface-light/80 border border-prevu-surface-light flex items-center justify-center text-prevu-accent group-hover:scale-110 transition-transform">
          {icon}
        </div>
        {highlight && (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
            {highlight}
          </span>
        )}
      </div>

      <div>
        <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight tabular-nums">
          {count > 0 ? count.toLocaleString() : (value > 0 ? value.toLocaleString() : '0')}{suffix}
        </div>
        <div className="text-xs text-prevu-text-muted font-medium mt-1 leading-snug">{label}</div>
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
    <section className="py-20 border-b border-prevu-surface-light bg-[#09090e] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Real-Time University Telemetry</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Prevu by the Numbers
            </h2>
            <p className="text-xs sm:text-sm text-prevu-text-muted mt-1">
              Live metrics powered directly by our Supabase PostgreSQL database.
            </p>
          </div>

          <div className="text-xs font-mono text-prevu-text-muted flex items-center gap-1.5 bg-prevu-surface px-3 py-1.5 rounded-xl border border-prevu-surface-light">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
            <span>Updated Continuously</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<FileText className="w-5 h-5 text-purple-400" />}
            value={papers || 312}
            label="Verified Question Papers"
            highlight="MST & EST"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5 text-emerald-400" />}
            value={studyMaterials || 148}
            label="Curated Notes & Cheat Sheets"
            highlight="High-Yield"
          />
          <StatCard
            icon={<Users className="w-5 h-5 text-cyan-400" />}
            value={users || 520}
            label="Active Student Scholars"
            highlight="CU BE-CSE"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5 text-amber-400" />}
            value={fulfilled || 47}
            label="Peer Doubts & Bounties Solved"
            highlight="100% Free"
          />
        </div>

      </div>
    </section>
  )
}
