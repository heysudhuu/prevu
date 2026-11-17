'use client'

import React, { useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimatePresence, MotionValue } from 'framer-motion'
import { BookOpen, Sparkles, Shield, Calendar, LucideIcon } from 'lucide-react'

export interface DockItemConfig {
  id: string
  label: string
  href: string
  icon: LucideIcon
  colorClass: string
  bgHoverGlow: string
  shortcut?: string
  description?: string
}

const DOCK_ITEMS: DockItemConfig[] = [
  {
    id: 'study-hub',
    label: 'Study Hub',
    href: '/browse',
    icon: BookOpen,
    colorClass: 'text-purple-400',
    bgHoverGlow: 'hover:bg-purple-500/20 hover:border-purple-500/50',
    shortcut: 'S',
    description: 'Browse question papers & notes'
  },
  {
    id: 'cbt-arena',
    label: 'CBT Arena',
    href: '/cbt',
    icon: Sparkles,
    colorClass: 'text-amber-400',
    bgHoverGlow: 'hover:bg-amber-500/20 hover:border-amber-500/50',
    shortcut: 'C',
    description: 'Practice simulated computer tests'
  },
  {
    id: 'vault',
    label: 'Vault (Offline)',
    href: '/vault',
    icon: Shield,
    colorClass: 'text-emerald-400',
    bgHoverGlow: 'hover:bg-emerald-500/20 hover:border-emerald-500/50',
    shortcut: 'V',
    description: 'Encrypted offline study storage'
  },
  {
    id: 'study-planner',
    label: 'Study Planner',
    href: '/study-planner',
    icon: Calendar,
    colorClass: 'text-cyan-400',
    bgHoverGlow: 'hover:bg-cyan-500/20 hover:border-cyan-500/50',
    shortcut: 'P',
    description: 'Targeted revision schedule'
  }
]

interface DockIconItemProps {
  item: DockItemConfig
  mouseX: MotionValue<number>
  isReducedMotion: boolean
  isActive: boolean
}

function DockIconItem({ item, mouseX, isReducedMotion, isActive }: DockIconItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Distance from cursor X to icon center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  // Smooth macOS magnification range: expands icon container from 44px up to 58px
  const widthSync = useTransform(distance, [-120, 0, 120], [44, 58, 44])
  const iconSizeSync = useTransform(distance, [-120, 0, 120], [18, 24, 18])

  // Spring physics matching unlumen dock
  const springWidth = useSpring(widthSync, { mass: 0.1, stiffness: 170, damping: 14 })
  const springIconSize = useSpring(iconSizeSync, { mass: 0.1, stiffness: 170, damping: 14 })

  const IconComponent = item.icon

  return (
    <div
      ref={ref}
      className="relative flex flex-col items-center justify-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Tooltip on Hover or Keyboard Focus */}
      <AnimatePresence>
        {(isHovered || isFocused) && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: -8, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute -top-11 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xl bg-[#0d1117]/95 border border-[#30363d] backdrop-blur-xl text-white shadow-2xl pointer-events-none whitespace-nowrap z-50 flex items-center gap-2"
          >
            <span className="text-[11px] font-semibold tracking-wide">{item.label}</span>
            {item.shortcut && (
              <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-[9px] font-mono text-zinc-400 border border-zinc-700/60">
                {item.shortcut}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Magnified Anchor Item */}
      <motion.div
        style={{
          width: isReducedMotion ? 44 : springWidth,
          height: isReducedMotion ? 44 : springWidth
        }}
        className="flex items-center justify-center"
      >
        <Link
          href={item.href}
          aria-label={item.label}
          title={item.description || item.label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full h-full rounded-2xl flex items-center justify-center transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-prevu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d1117] ${
            isActive
              ? 'bg-[#1c2128] border-2 border-prevu-accent/60 shadow-lg shadow-prevu-accent/25'
              : 'bg-[#161b22]/90 hover:bg-[#1f242c] border border-[#30363d]/80'
          } ${item.bgHoverGlow}`}
        >
          <motion.div
            style={{
              width: isReducedMotion ? 18 : springIconSize,
              height: isReducedMotion ? 18 : springIconSize
            }}
            className="flex items-center justify-center"
          >
            <IconComponent className={`w-full h-full ${item.colorClass} transition-transform duration-150`} />
          </motion.div>
        </Link>
      </motion.div>

      {/* Active Dot Indicator */}
      {isActive && (
        <span className="w-1.5 h-1.5 rounded-full bg-prevu-accent mt-1 animate-pulse" />
      )}
    </div>
  )
}

/**
 * Reusable animated macOS-style Quick-Launch Dock for Prevu's Student Dashboard.
 * Sits unobtrusively at the bottom center of the screen on desktop/tablet.
 */
export default function DashboardDock() {
  const mouseX = useMotionValue(Infinity)
  const isReducedMotion = Boolean(useReducedMotion())
  const pathname = usePathname()

  return (
    <aside
      aria-label="Quick Launch Dock"
      role="toolbar"
      className="hidden md:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-40 items-center gap-2.5 px-3.5 py-2.5 rounded-3xl bg-[#090d16]/88 backdrop-blur-2xl border border-[#30363d]/80 shadow-[0_12px_45px_rgba(0,0,0,0.7)] group/dock"
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
    >
      {/* Prevu Terminal Badge Marker */}
      <div className="flex items-center pl-1 pr-1.5 border-r border-[#30363d]/60 text-zinc-500 font-mono text-[10px] select-none tracking-tight">
        <span>PREVU</span>
      </div>

      {/* Dock Icons List */}
      <div className="flex items-center gap-2">
        {DOCK_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <DockIconItem
              key={item.id}
              item={item}
              mouseX={mouseX}
              isReducedMotion={isReducedMotion}
              isActive={isActive}
            />
          )
        })}
      </div>
    </aside>
  )
}
