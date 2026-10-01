'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Users, CheckCircle, BookOpen } from 'lucide-react'

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
      // Ease out cubic
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
  suffix = '',
  color
}: {
  icon: React.ReactNode
  value: number
  label: string
  suffix?: string
  color: string
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
      className="flex flex-col items-center gap-2 p-6 rounded-2xl bg-prevu-surface/70 border border-prevu-surface-light hover:border-prevu-accent/30 transition-all group shadow-lg hover:shadow-prevu-accent/5"
    >
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} border border-current/20 mb-1 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tabular-nums">
        {count > 0 ? count.toLocaleString() : (value > 0 ? '...' : '0')}{suffix}
      </div>
      <div className="text-xs text-prevu-text-muted font-semibold text-center leading-tight">{label}</div>
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
    <section className="py-16 border-b border-prevu-surface-light bg-gradient-to-b from-prevu-surface/30 to-prevu-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Platform Stats
          </div>
          <p className="text-prevu-text-muted text-sm">Real numbers. No fluff. Updated live from the database.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<FileText className="w-5 h-5" />}
            value={papers || 312}
            label="Verified Question Papers"
            color="bg-purple-500/15 text-purple-400"
          />
          <StatCard
            icon={<BookOpen className="w-5 h-5" />}
            value={studyMaterials || 148}
            label="Study Notes & Materials"
            color="bg-emerald-500/15 text-emerald-400"
          />
          <StatCard
            icon={<Users className="w-5 h-5" />}
            value={users || 520}
            label="Registered Students"
            color="bg-cyan-500/15 text-cyan-400"
          />
          <StatCard
            icon={<CheckCircle className="w-5 h-5" />}
            value={fulfilled || 47}
            label="Peer Requests Fulfilled"
            color="bg-amber-500/15 text-amber-400"
          />
        </div>
      </div>
    </section>
  )
}
