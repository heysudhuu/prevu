'use client'

import React from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion
} from 'framer-motion'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
  enableTilt?: boolean
}

/**
 * 21st.dev / Linear Bento Spotlight Card with cursor-tracking radial surface glare
 * and subtle spring-damped 3D perspective tilt.
 */
export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(56, 189, 248, 0.12)',
  enableTilt = true
}: SpotlightCardProps) {
  const prefersReduced = useReducedMotion()
  const mouseX = useMotionValue(-300)
  const mouseY = useMotionValue(-300)

  const rawRotateX = useMotionValue(0)
  const rawRotateY = useMotionValue(0)
  const rotateX = useSpring(rawRotateX, { stiffness: 260, damping: 24 })
  const rotateY = useSpring(rawRotateY, { stiffness: 260, damping: 24 })

  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${mouseX}px ${mouseY}px, ${spotlightColor}, transparent 75%)`

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.set(x)
    mouseY.set(y)

    if (enableTilt && rect.width > 0 && rect.height > 0) {
      const normX = (x / rect.width - 0.5) * 2
      const normY = (y / rect.height - 0.5) * 2
      rawRotateX.set(-normY * 2.2)
      rawRotateY.set(normX * 2.2)
    }
  }

  const handleMouseLeave = () => {
    mouseX.set(-300)
    mouseY.set(-300)
    rawRotateX.set(0)
    rawRotateY.set(0)
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={
        prefersReduced || !enableTilt
          ? undefined
          : {
              rotateX,
              rotateY,
              transformPerspective: 900
            }
      }
      whileHover={prefersReduced ? undefined : { y: -3 }}
      transition={{ type: 'spring', stiffness: 380, damping: 24 }}
      className={`relative group/spotlight rounded-2xl overflow-hidden ${className}`}
    >
      {/* Top specular glass hairline (Figma / Dribbble bento detail) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent z-20"
      />

      {/* Dynamic pointer radial spotlight */}
      {!prefersReduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 group-hover/spotlight:opacity-100 transition-opacity duration-300"
          style={{ background: spotlight }}
        />
      )}

      {children}
    </motion.div>
  )
}
