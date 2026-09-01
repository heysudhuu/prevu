'use client'

import { motion, useAnimation } from 'framer-motion'
import { useEffect } from 'react'

export default function PrevuMascot() {
  const eyeControls = useAnimation()
  const bodyControls = useAnimation()
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate cursor position relative to screen center
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 10
      
      eyeControls.start({
        x: x,
        y: y,
        transition: { type: 'spring', stiffness: 300, damping: 20 }
      })
    }
    
    // Idle floating animation
    bodyControls.start({
      y: [0, -10, 0],
      transition: { 
        duration: 4, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }
    })

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [eyeControls, bodyControls])

  const handleClick = () => {
    // Celebration spin on click
    bodyControls.start({
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: { duration: 0.8, ease: "easeInOut" }
    }).then(() => {
      // Resume floating
      bodyControls.start({
        y: [0, -10, 0],
        transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
      })
    })
  }

  // Hide on very small screens for performance and layout reasons
  return (
    <motion.div 
      className="fixed bottom-8 right-8 z-50 cursor-pointer hidden md:flex flex-col items-center group"
      animate={bodyControls}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
    >
      {/* Speech bubble on hover */}
      <motion.div 
        className="absolute -top-12 opacity-0 group-hover:opacity-100 bg-prevu-surface border border-prevu-surface-light px-3 py-1.5 rounded-xl text-xs font-medium text-prevu-text shadow-lg whitespace-nowrap transition-opacity pointer-events-none"
        initial={{ y: 10 }}
        whileHover={{ y: 0 }}
      >
        Need study materials?
      </motion.div>

      {/* Mascot Body */}
      <div className="relative w-16 h-16 bg-gradient-to-br from-prevu-surface to-prevu-bg border-2 border-prevu-surface-light rounded-2xl shadow-xl shadow-black/50 overflow-hidden flex items-center justify-center">
        {/* Glow effect inside */}
        <div className="absolute inset-0 bg-prevu-accent/10"></div>
        
        {/* Eyes track the cursor */}
        <motion.div className="flex gap-2" animate={eyeControls}>
          <div className="w-2.5 h-3 bg-prevu-accent rounded-full animate-pulse"></div>
          <div className="w-2.5 h-3 bg-prevu-accent rounded-full animate-pulse"></div>
        </motion.div>
        
        {/* Smile / Mouth */}
        <motion.div className="absolute bottom-3 w-4 h-1 bg-prevu-text-muted rounded-full" />
      </div>
      
      {/* Cute little floating base shadow */}
      <div className="w-10 h-1 bg-black/40 blur-sm rounded-full mt-4"></div>
    </motion.div>
  )
}
