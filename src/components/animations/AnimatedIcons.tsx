'use client'

import { motion, Variants } from 'framer-motion'

// SVG Animation Variants
const pathVariants: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 1, 
    transition: { duration: 1.5, ease: "easeInOut" }
  }
}

export function AnimatedPapersIcon({ className = "w-7 h-7 text-prevu-accent" }) {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" variants={pathVariants} />
      <motion.polyline points="14 2 14 8 20 8" variants={pathVariants} />
      <motion.line x1="16" y1="13" x2="8" y2="13" variants={pathVariants} />
      <motion.line x1="16" y1="17" x2="8" y2="17" variants={pathVariants} />
      <motion.line x1="10" y1="9" x2="8" y2="9" variants={pathVariants} />
    </motion.svg>
  )
}

export function AnimatedNotesIcon({ className = "w-7 h-7 text-prevu-accent" }) {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" variants={pathVariants} />
      <motion.path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" variants={pathVariants} />
    </motion.svg>
  )
}

export function AnimatedVerifiedIcon({ className = "w-7 h-7 text-prevu-accent" }) {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" variants={pathVariants} />
      <motion.path d="m9 12 2 2 4-4" variants={pathVariants} />
    </motion.svg>
  )
}

export function AnimatedCommunityIcon({ className = "w-7 h-7 text-prevu-accent" }) {
  return (
    <motion.svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <motion.path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" variants={pathVariants} />
      <motion.circle cx="9" cy="7" r="4" variants={pathVariants} />
      <motion.path d="M22 21v-2a4 4 0 0 0-3-3.87" variants={pathVariants} />
      <motion.path d="M16 3.13a4 4 0 0 1 0 7.75" variants={pathVariants} />
    </motion.svg>
  )
}
