'use client'

import React from 'react'
import { motion, useScroll, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Figma / Linear top hairline reading & scroll progress bar.
 */
export default function ScrollProgressBar() {
  const prefersReduced = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 240,
    damping: 32,
    restDelta: 0.001
  })

  if (prefersReduced) return null

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0%' }}
      className="fixed top-0 left-0 right-0 h-[2px] z-[60] bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 pointer-events-none shadow-[0_0_10px_rgba(56,189,248,0.6)]"
    />
  )
}
