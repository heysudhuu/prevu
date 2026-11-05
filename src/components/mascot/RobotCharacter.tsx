'use client'

import React from 'react'

export type RobotState = 'idle' | 'walking' | 'looking' | 'waving' | 'cheering'

interface RobotCharacterProps {
  state?: RobotState
  direction?: 'left' | 'right'
  isHovered?: boolean
  className?: string
  scale?: number
}

export default function RobotCharacter({
  state = 'idle',
  direction = 'right',
  isHovered = false,
  className = '',
  scale = 1
}: RobotCharacterProps) {
  const isWalking = state === 'walking'
  const isWaving = state === 'waving'
  const isCheering = state === 'cheering'
  const isLooking = state === 'looking'

  // Eye gaze offset
  const eyeOffsetX = isLooking ? (direction === 'right' ? 3 : -3) : 0
  const eyeOffsetY = isLooking ? -1 : 0

  return (
    <div 
      className={`relative select-none ${className}`}
      style={{
        width: `${76 * scale}px`,
        height: `${96 * scale}px`,
        transform: `scaleX(${direction === 'left' ? -1 : 1})`,
        transition: 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
      aria-hidden="true"
    >
      {/* 3D Robot Character Container */}
      <div className={`w-full h-full relative ${isWalking ? 'animate-robot-walk' : 'animate-robot-float'}`}>
        
        <svg 
          viewBox="0 0 76 96" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full robot-glow-container overflow-visible"
        >
          <defs>
            {/* Metallic White/Silver Helmet Gradient */}
            <linearGradient id="prevu-helmet-grad" x1="16" y1="12" x2="60" y2="52" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#f8fafc" />
              <stop offset="85%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Glossy Cosmic Violet Visor Gradient */}
            <linearGradient id="prevu-visor-grad" x1="18" y1="20" x2="58" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1e1136" />
              <stop offset="60%" stopColor="#120924" />
              <stop offset="100%" stopColor="#0a0514" />
            </linearGradient>

            {/* Glowing Neon Violet/Cyan LED Eye Gradient */}
            <linearGradient id="prevu-eye-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="40%" stopColor="#a78bfa" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>

            {/* Torso Cosmic Violet Chassis Gradient */}
            <linearGradient id="prevu-torso-grad" x1="22" y1="46" x2="54" y2="76" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#f1f5f9" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>

            {/* Violet Chassis Accents */}
            <linearGradient id="prevu-violet-plate" x1="26" y1="50" x2="50" y2="72" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="60%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#6d28d9" />
            </linearGradient>

            {/* Ear Disc Radial Gradient */}
            <radialGradient id="prevu-ear-grad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#c4b5fd" />
              <stop offset="50%" stopColor="#7c3aed" />
              <stop offset="100%" stopColor="#4c1d95" />
            </radialGradient>

            {/* Glow Filters for LED Eyes and Core */}
            <filter id="prevu-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            <filter id="prevu-beacon-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ========================================== */}
          {/* 1. ANTENNA & BEACON                        */}
          {/* ========================================== */}
          <path 
            d="M 38 14 L 38 4" 
            stroke="#94a3b8" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
          />
          {/* Glowing Beacon Core */}
          <circle 
            cx="38" 
            cy="3" 
            r="4" 
            fill="#a78bfa" 
            filter="url(#prevu-beacon-glow)"
            className="animate-antenna-pulse" 
          />
          <circle cx="38" cy="3" r="2" fill="#ffffff" />

          {/* ========================================== */}
          {/* 2. LEFT ARM (BEHIND BODY)                  */}
          {/* ========================================== */}
          <g transform={isWalking ? 'rotate(18 20 54)' : isCheering ? 'rotate(-30 20 54)' : 'rotate(0 20 54)'} className="transition-transform duration-300">
            {/* Shoulder Sphere */}
            <circle cx="18" cy="54" r="5" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1" />
            {/* Arm Segment */}
            <rect x="15" y="56" width="6" height="14" rx="3" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
            {/* Hand Sphere */}
            <circle cx="18" cy="72" r="3.5" fill="#8b5cf6" />
          </g>

          {/* ========================================== */}
          {/* 3. ROBOT HEAD & HELMET                     */}
          {/* ========================================== */}
          {/* Ear Disc Left */}
          <rect x="13" y="24" width="4" height="14" rx="2" fill="url(#prevu-ear-grad)" stroke="#4c1d95" strokeWidth="0.8" />

          {/* Ear Disc Right */}
          <rect x="59" y="24" width="4" height="14" rx="2" fill="url(#prevu-ear-grad)" stroke="#4c1d95" strokeWidth="0.8" />

          {/* Outer Helmet Dome */}
          <rect 
            x="16" 
            y="12" 
            width="44" 
            height="38" 
            rx="18" 
            fill="url(#prevu-helmet-grad)" 
            stroke="#94a3b8" 
            strokeWidth="1.2" 
          />

          {/* Shiny Top Bevel Highlight */}
          <path 
            d="M 22 17 C 28 14 48 14 54 17" 
            stroke="#ffffff" 
            strokeWidth="2.2" 
            strokeLinecap="round" 
            opacity="0.9" 
          />

          {/* Visor Faceplate Frame */}
          <rect 
            x="20" 
            y="19" 
            width="36" 
            height="24" 
            rx="12" 
            fill="url(#prevu-visor-grad)" 
            stroke="#7c3aed" 
            strokeWidth="1.2" 
          />

          {/* Visor Specular Glass Arc Reflection */}
          <path 
            d="M 23 23 C 30 20 46 20 53 23 C 44 23 31 24 23 23" 
            fill="#ffffff" 
            opacity="0.28" 
          />

          {/* ========================================== */}
          {/* 4. DIGITAL EXPRESSIVE EYES                 */}
          {/* ========================================== */}
          <g 
            transform={`translate(${eyeOffsetX}, ${eyeOffsetY})`} 
            className="animate-robot-blink"
          >
            {isCheering || (isWaving && isHovered) ? (
              // Happy Arc Eyes (^ ^)
              <>
                <path 
                  d="M 27 33 Q 31 27 35 33" 
                  stroke="#c4b5fd" 
                  strokeWidth="3.2" 
                  strokeLinecap="round" 
                  filter="url(#prevu-neon-glow)" 
                />
                <path 
                  d="M 41 33 Q 45 27 49 33" 
                  stroke="#c4b5fd" 
                  strokeWidth="3.2" 
                  strokeLinecap="round" 
                  filter="url(#prevu-neon-glow)" 
                />
              </>
            ) : (
              // Friendly Glowing Pill Eyes
              <>
                {/* Left Eye */}
                <ellipse 
                  cx="31" 
                  cy="30" 
                  rx="4.2" 
                  ry="5.5" 
                  fill="url(#prevu-eye-grad)" 
                  filter="url(#prevu-neon-glow)" 
                />
                <circle cx="32" cy="28.5" r="1.4" fill="#ffffff" />

                {/* Right Eye */}
                <ellipse 
                  cx="45" 
                  cy="30" 
                  rx="4.2" 
                  ry="5.5" 
                  fill="url(#prevu-eye-grad)" 
                  filter="url(#prevu-neon-glow)" 
                />
                <circle cx="46" cy="28.5" r="1.4" fill="#ffffff" />
              </>
            )}
          </g>

          {/* Cute Digital Mouth Smile */}
          <path 
            d="M 35 37 Q 38 40 41 37" 
            stroke="#a78bfa" 
            strokeWidth="1.6" 
            strokeLinecap="round" 
            opacity="0.85" 
          />

          {/* ========================================== */}
          {/* 5. TORSO & CHASSIS                         */}
          {/* ========================================== */}
          {/* Torso Base */}
          <rect 
            x="22" 
            y="49" 
            width="32" 
            height="26" 
            rx="10" 
            fill="url(#prevu-torso-grad)" 
            stroke="#cbd5e1" 
            strokeWidth="1" 
          />

          {/* Violet Center Plating Accent */}
          <rect 
            x="27" 
            y="52" 
            width="22" 
            height="18" 
            rx="6" 
            fill="url(#prevu-violet-plate)" 
            stroke="#6d28d9" 
            strokeWidth="0.8" 
          />

          {/* Prevu Arc Reactor Core (Glowing Delta / Triangle) */}
          <circle 
            cx="38" 
            cy="61" 
            r="4.5" 
            fill="#a78bfa" 
            filter="url(#prevu-neon-glow)"
            className="animate-core-pulse" 
          />
          <circle cx="38" cy="61" r="2.2" fill="#ffffff" />

          {/* Belt / Chassis Seam */}
          <line x1="24" y1="70" x2="52" y2="70" stroke="#94a3b8" strokeWidth="1" strokeLinecap="round" />

          {/* ========================================== */}
          {/* 6. RIGHT ARM (WAVING / IDLE / WALKING)     */}
          {/* ========================================== */}
          <g className={isWaving ? 'animate-robot-wave-arm' : isCheering ? 'transition-transform duration-300' : ''}>
            {/* Shoulder Sphere */}
            <circle cx="58" cy="54" r="5" fill="#7c3aed" stroke="#6d28d9" strokeWidth="1" />
            {/* Arm Segment */}
            <rect 
              x="55" 
              y={isCheering ? '40' : '56'} 
              width="6" 
              height="14" 
              rx="3" 
              fill="#e2e8f0" 
              stroke="#cbd5e1" 
              strokeWidth="0.8" 
              transform={isCheering ? 'rotate(40 58 54)' : isWalking ? 'rotate(-20 58 54)' : 'rotate(0 58 54)'}
              className="transition-transform duration-300"
            />
            {/* Hand Sphere */}
            <circle 
              cx={isCheering ? '68' : '58'} 
              cy={isCheering ? '38' : '72'} 
              r="3.5" 
              fill="#8b5cf6" 
              className="transition-all duration-300"
            />
          </g>

          {/* ========================================== */}
          {/* 7. DUAL HOVER THRUSTERS                    */}
          {/* ========================================== */}
          {/* Left Thruster Pod */}
          <rect x="26" y="74" width="9" height="7" rx="3.5" fill="#475569" stroke="#334155" strokeWidth="0.8" />
          <ellipse cx="30.5" cy="81" rx="3.5" ry="1.5" fill="#8b5cf6" filter="url(#prevu-neon-glow)" />

          {/* Right Thruster Pod */}
          <rect x="41" y="74" width="9" height="7" rx="3.5" fill="#475569" stroke="#334155" strokeWidth="0.8" />
          <ellipse cx="45.5" cy="81" rx="3.5" ry="1.5" fill="#8b5cf6" filter="url(#prevu-neon-glow)" />

          {/* Ion Particle Glow Beneath Thrusters */}
          <ellipse 
            cx="38" 
            cy="84" 
            rx="14" 
            ry="2.5" 
            fill="#a78bfa" 
            opacity="0.75" 
            filter="url(#prevu-neon-glow)" 
          />
        </svg>

        {/* Ambient Ground Shadow */}
        <div 
          className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-black/45 blur-sm rounded-full pointer-events-none ${
            isWalking ? 'animate-shadow-walk' : 'animate-shadow-pulse'
          }`}
        />
      </div>
    </div>
  )
}

