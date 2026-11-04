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

  // Matrix Rain Animation Loop (Only runs when Hacker Mode is active)
  useEffect(() => {
    if (!isHacker) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
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

    // Matrix characters: Binary, Hex, Code tokens, and Matrix glyphs
    const characters = '010101010123456789ABCDEF<>/{}[]=+*~#$_PREVU_HACK_CU_EXAM'
    const fontSize = 14
    let columns = Math.floor(width / fontSize)
    let drops: number[] = []

    const initDrops = () => {
      columns = Math.floor(width / fontSize)
      drops = []
      for (let i = 0; i < columns; i++) {
        // Stagger drops randomly above the screen
        drops[i] = Math.floor(Math.random() * -100)
      }
    }

    initDrops()

    let lastTime = 0
    const fps = 30
    const interval = 1000 / fps

    const draw = (currentTime: number) => {
      animationFrameId = requestAnimationFrame(draw)

      const delta = currentTime - lastTime
      if (delta < interval) return
      lastTime = currentTime - (delta % interval)

      // Translucent black overlay to produce trailing fade effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.07)'
      ctx.fillRect(0, 0, width, height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = characters.charAt(Math.floor(Math.random() * characters.length))
        const x = i * fontSize
        const y = drops[i] * fontSize

        // Head of the code stream glows white-green
        ctx.fillStyle = '#ffffff'
        ctx.shadowColor = '#00ff66'
        ctx.shadowBlur = 8
        ctx.fillText(char, x, y)

        // Trailing characters in classic terminal phosphor green
        ctx.fillStyle = '#00ff66'
        ctx.shadowBlur = 3
        if (drops[i] > 1) {
          const prevChar = characters.charAt(Math.floor(Math.random() * characters.length))
          ctx.fillText(prevChar, x, (drops[i] - 1) * fontSize)
        }

        // Reset to top when off screen with random delay
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0
        }

        drops[i]++
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
      className="fixed inset-0 pointer-events-none z-0 opacity-40 md:opacity-50 transition-opacity duration-700"
      aria-hidden="true"
    />
  )
}

