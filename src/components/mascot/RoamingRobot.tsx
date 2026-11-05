'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RobotCharacter, { RobotState } from './RobotCharacter'
import RobotAssistant from './RobotAssistant'
import './robot.css'

const SPEECH_BUBBLES = [
  'Hey! Need help studying?',
  'Ready for your next exam?',
  "Let's make progress today!",
  'Welcome to Prevu!',
  '80/20 Reappear rescue ready! ⚡',
  'Check out the solved PYQs! 📚',
  'Need a formula cheatsheet? 📐',
  'CU exam blueprints verified! 🎯'
]

export default function RoamingRobot() {
  // SSR Protection
  const [mounted, setMounted] = useState(false)
  const [isReducedMotion, setIsReducedMotion] = useState(false)

  // Position & Motion State
  // We represent position as a percentage of viewport width (5% to 80%)
  const [posX, setPosX] = useState(75) // start near bottom right
  const [direction, setDirection] = useState<'left' | 'right'>('left')
  const [robotState, setRobotState] = useState<RobotState>('idle')
  const [isHovered, setIsHovered] = useState(false)
  const [isAssistantOpen, setIsAssistantOpen] = useState(false)

  // Speech Bubble State
  const [speechBubble, setSpeechBubble] = useState<string | null>(null)

  // Timers and references
  const roamTimerRef = useRef<NodeJS.Timeout | null>(null)
  const speechTimerRef = useRef<NodeJS.Timeout | null>(null)
  const isRoamingRef = useRef(false)

  // Detect mount & reduced motion
  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches)
    }
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Schedule a speech bubble
  const triggerSpeechBubble = useCallback((text?: string) => {
    const message = text || SPEECH_BUBBLES[Math.floor(Math.random() * SPEECH_BUBBLES.length)]
    setSpeechBubble(message)

    if (speechTimerRef.current) clearTimeout(speechTimerRef.current)
    speechTimerRef.current = setTimeout(() => {
      setSpeechBubble(null)
    }, 4500)
  }, [])

  // Roaming Loop State Machine
  useEffect(() => {
    if (!mounted || isReducedMotion || isAssistantOpen || isHovered) {
      if (roamTimerRef.current) clearTimeout(roamTimerRef.current)
      return
    }

    const startRoamingCycle = () => {
      // 1. Idle / Look / Wave Phase
      const actions: RobotState[] = ['idle', 'looking', 'waving']
      const chosenAction = actions[Math.floor(Math.random() * actions.length)]
      setRobotState(chosenAction)

      // Maybe say something while waving or looking
      if (chosenAction === 'waving' && Math.random() > 0.4) {
        triggerSpeechBubble()
      }

      // Rest for 4 to 8 seconds before moving to next target
      const restDuration = Math.random() * 4000 + 3500

      roamTimerRef.current = setTimeout(() => {
        if (isAssistantOpen || isHovered) return

        // 2. Pick next target position (between 8% and 78% of viewport)
        setPosX(currentX => {
          let targetX = Math.random() * 70 + 8
          // Ensure it moves at least 15% distance
          if (Math.abs(targetX - currentX) < 15) {
            targetX = currentX > 45 ? currentX - 25 : currentX + 25
          }
          targetX = Math.max(8, Math.min(78, targetX))

          // Set direction based on movement
          const newDirection = targetX > currentX ? 'right' : 'left'
          setDirection(newDirection)
          setRobotState('walking')

          // Calculate walk time based on distance (speed ~ 5% per second)
          const distance = Math.abs(targetX - currentX)
          const walkDurationMs = Math.max(2000, distance * 220)

          // Stop walking when arrived
          setTimeout(() => {
            if (!isAssistantOpen && !isHovered) {
              setRobotState('idle')
              startRoamingCycle()
            }
          }, walkDurationMs)

          return targetX
        })
      }, restDuration)
    }

    startRoamingCycle()

    return () => {
      if (roamTimerRef.current) clearTimeout(roamTimerRef.current)
    }
  }, [mounted, isReducedMotion, isAssistantOpen, isHovered, triggerSpeechBubble])

  // Click Handler
  const handleRobotClick = () => {
    setRobotState('cheering')
    setIsAssistantOpen(prev => !prev)
    setSpeechBubble(null)
  }

  // Hover Handler
  const handleMouseEnter = () => {
    setIsHovered(true)
    if (!isAssistantOpen) {
      setRobotState('waving')
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (!isAssistantOpen) {
      setRobotState('idle')
    }
  }

  if (!mounted) return null

  // If reduced motion is requested, render stationary in a gentle fixed position
  const displayX = isReducedMotion ? 75 : posX
  const walkTransitionDuration = isReducedMotion ? 0 : 3.5

  return (
    <div 
      className="fixed bottom-20 md:bottom-6 left-0 right-0 z-40 pointer-events-none select-none overflow-hidden h-36"
      style={{ maxWidth: '100vw' }}
    >
      {/* Horizontally Roaming Container */}
      <div 
        className="absolute bottom-0 transition-all ease-in-out pointer-events-auto"
        style={{
          left: `${displayX}%`,
          transform: 'translateX(-50%)',
          transitionDuration: robotState === 'walking' ? '3.5s' : '0.4s'
        }}
      >
        <div className="relative flex flex-col items-center">
          
          {/* Speech Bubble */}
          <AnimatePresence>
            {speechBubble && !isAssistantOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 6, scale: 0.9 }}
                transition={{ duration: 0.25 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-xl bg-[#0f0f1a]/95 border border-[#8b5cf6]/50 shadow-xl shadow-purple-950/40 text-xs font-mono text-[#f0f0f8] whitespace-nowrap z-50 pointer-events-auto flex items-center gap-1.5 backdrop-blur-md"
              >
                <span>{speechBubble}</span>
                {/* Speech Bubble Arrow */}
                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0f0f1a] border-r border-b border-[#8b5cf6]/50 rotate-45 transform" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Interactive Robot Character */}
          <button
            type="button"
            onClick={handleRobotClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6] rounded-2xl transition-transform active:scale-95 group"
            aria-label="Prevu Roaming Robot Mascot Vee. Click for assistance."
            title="Click Vee for Study Hub & Exam Tips!"
          >
            <RobotCharacter 
              state={robotState}
              direction={direction}
              isHovered={isHovered}
              scale={0.92}
            />
          </button>

          {/* Assistant Popover */}
          <RobotAssistant 
            isOpen={isAssistantOpen}
            onClose={() => {
              setIsAssistantOpen(false)
              setRobotState('idle')
            }}
          />

        </div>
      </div>
    </div>
  )
}

