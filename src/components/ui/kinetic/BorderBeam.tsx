'use client'

import React from 'react'

interface BorderBeamProps {
  className?: string
  duration?: number
  colorFrom?: string
  colorTo?: string
  borderWidth?: number
}

/**
 * 21st.dev-style animated light beam orbiting along a card's rounded border.
 * Uses CSS mask-composite so only the 1-2px perimeter ring illuminates.
 */
export default function BorderBeam({
  className = '',
  duration = 8,
  colorFrom = '#38bdf8',
  colorTo = '#238636',
  borderWidth = 1.5
}: BorderBeamProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 rounded-[inherit] ${className}`}
      style={{
        padding: `${borderWidth}px`,
        WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
        WebkitMaskComposite: 'xor',
        maskComposite: 'exclude',
        overflow: 'hidden'
      }}
    >
      <div
        className="absolute -inset-[100%] animate-border-beam opacity-80"
        style={{
          animationDuration: `${duration}s`,
          background: `conic-gradient(from 0deg, transparent 0deg 260deg, ${colorFrom} 305deg, ${colorTo} 340deg, transparent 360deg)`
        }}
      />
    </div>
  )
}
