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
      y: [0, -8, 0],
      transition: { 
        duration: 3.5, 
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
        y: [0, -8, 0],
        transition: { duration: 3.5, repeat: Infinity, ease: "easeInOut" }
      })
    })
  }

  return (
    <motion.div 
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 cursor-pointer flex flex-col items-center group scale-90 sm:scale-100 select-none"
      animate={bodyControls}
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Speech bubble on hover */}
      <motion.div 
        className="absolute -top-10 opacity-0 group-hover:opacity-100 bg-prevu-surface/95 border border-prevu-surface-light px-3 py-1 rounded-xl text-[11px] font-medium text-prevu-text shadow-xl whitespace-nowrap transition-opacity pointer-events-none"
        initial={{ y: 5 }}
        whileHover={{ y: 0 }}
      >
        Need study materials?
      </motion.div>

      {/* Mascot Body */}
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-prevu-surface to-prevu-bg border-2 border-prevu-surface-light rounded-2xl shadow-2xl shadow-black/60 overflow-hidden flex items-center justify-center">
        {/* Glow effect inside */}
        <div className="absolute inset-0 bg-prevu-accent/15"></div>
        
        {/* Eyes track the cursor */}
        <motion.div className="flex gap-2" animate={eyeControls}>
          <div className="w-2.5 h-3 bg-prevu-accent rounded-full animate-pulse"></div>
          <div className="w-2.5 h-3 bg-prevu-accent rounded-full animate-pulse"></div>
        </motion.div>
        
        {/* Smile / Mouth */}
        <motion.div className="absolute bottom-2.5 sm:bottom-3 w-3.5 h-1 bg-prevu-text-muted rounded-full" />
      </div>
      
      {/* Cute little floating base shadow */}
      <div className="w-8 sm:w-10 h-1 bg-black/50 blur-sm rounded-full mt-2.5 sm:mt-3"></div>
    </motion.div>
  )
}
