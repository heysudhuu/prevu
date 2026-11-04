'use client'

import { useEffect, useRef, useState } from 'react'

export default function MatrixRainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isHacker, setIsHacker] = useState(false)

  // Track theme changes
  useEffect(() => {
    const checkTheme = () => {
      const active = document.documentElement.classList.contains('theme-hacker') ||
        localStorage.getItem('prevu-theme') === 'hacker'
      setIsHacker(active)
    }

    checkTheme()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleThemeChange = (e: any) => {
      setIsHacker(e.detail?.theme === 'hacker')
    }

    window.addEventListener('prevu-theme-change', handleThemeChange)
    return () => window.removeEventListener('prevu-theme-change', handleThemeChange)
  }, [])

  // Matrix Rain Animation Loop (Runs when Hacker Mode is active)
  useEffect(() => {
    if (!isHacker) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
      initDrops()
    }

    window.addEventListener('resize', handleResize)

    // Matrix characters: Binary, Hex, Code tokens, and Cyber symbols
    const charset = '010101010123456789ABCDEF<>/{}[];=*~#$_PREVU_ROOT_CU_EXAM'
    const fontSize = 15
    let columns = Math.floor(width / fontSize)

    // Each column has current y position and distinct speed for multi-depth rain
    interface ColumnData {
      y: number
      speed: number
      length: number
    }
    let drops: ColumnData[] = []

    const initDrops = () => {
      columns = Math.floor(width / fontSize)
      drops = []
      for (let i = 0; i < columns; i++) {
        drops[i] = {
          y: Math.floor(Math.random() * -120),
          speed: 0.8 + Math.random() * 1.4,
          length: 15 + Math.floor(Math.random() * 25)
        }
      }
    }

    initDrops()

    // Clear initial canvas to pure black
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)

    let lastTime = 0
    const fps = 35
    const interval = 1000 / fps

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw)

      const delta = currentTime - lastTime
      if (delta < interval) return
      lastTime = currentTime - (delta % interval)

      // Pure jet-black wash to produce crisp falling trail on true pitch black
      ctx.fillStyle = 'rgba(0, 0, 0, 0.075)'
      ctx.fillRect(0, 0, width, height)

      ctx.font = `${fontSize}px "IBM Plex Mono", monospace`

      for (let i = 0; i < drops.length; i++) {
        const col = drops[i]
        const x = i * fontSize
        const y = Math.floor(col.y) * fontSize

        if (y >= 0 && y <= height + fontSize) {
          const char = charset.charAt(Math.floor(Math.random() * charset.length))

          // 1. Leading drop is glowing pure white / green bloom
          ctx.fillStyle = '#ffffff'
          ctx.shadowColor = '#00ff66'
          ctx.shadowBlur = 10
          ctx.fillText(char, x, y)

          // 2. Trailing character in vivid terminal neon green
          if (col.y > 1) {
            ctx.fillStyle = '#00ff66'
            ctx.shadowBlur = 4
            const prevChar = charset.charAt(Math.floor(Math.random() * charset.length))
            ctx.fillText(prevChar, x, y - fontSize)
          }

          // 3. Deeper trail in emerald green
          if (col.y > 3) {
            ctx.fillStyle = '#059669'
            ctx.shadowBlur = 0
            const tailChar = charset.charAt(Math.floor(Math.random() * charset.length))
            ctx.fillText(tailChar, x, y - fontSize * 3)
          }
        }

        // Reset column to above top after dropping off the screen
        if (y > height + 100 && Math.random() > 0.96) {
          col.y = -Math.floor(Math.random() * 40)
          col.speed = 0.8 + Math.random() * 1.4
        }

        col.y += col.speed
      }
    }

    animationFrameId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [isHacker])

  if (!isHacker) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 bg-black opacity-100 transition-opacity duration-500"
      aria-hidden="true"
    />
  )
}
