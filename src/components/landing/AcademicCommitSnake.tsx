'use client'

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { GitCommit, Play, Pause, RotateCcw, Gamepad2, Sparkles, Trophy, ChevronRight, Zap } from 'lucide-react'

// 48 columns x 7 days Deterministic GitHub Contribution Grid Generator
function generateInitialGrid(): number[][] {
  const grid: number[][] = []
  for (let c = 0; c < 48; c++) {
    const col: number[] = []
    for (let r = 0; r < 7; r++) {
      const hash = Math.sin(c * 7 + r + 42) * 10000
      const rand = hash - Math.floor(hash)
      const level = rand > 0.82 ? 4 : rand > 0.62 ? 3 : rand > 0.38 ? 2 : rand > 0.18 ? 1 : 0
      col.push(level)
    }
    grid.push(col)
  }
  return grid
}

type Mode = 'idle' | 'auto' | 'play'
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
interface Point {
  x: number // 0 to 47
  y: number // 0 to 6
}

export default function AcademicCommitSnake() {
  const [mounted, setMounted] = useState(false)
  const [grid, setGrid] = useState<number[][]>(() => generateInitialGrid())
  const [mode, setMode] = useState<Mode>('idle')
  const [isPlaying, setIsPlaying] = useState(false)
  const [hoveredCell, setHoveredCell] = useState<{ col: number; row: number; level: number } | null>(null)

  // Snake State
  const [snake, setSnake] = useState<Point[]>([
    { x: 10, y: 3 },
    { x: 9, y: 3 },
    { x: 8, y: 3 },
    { x: 7, y: 3 }
  ])
  const [direction, setDirection] = useState<Direction>('RIGHT')
  const nextDirectionRef = useRef<Direction>('RIGHT')
  
  // Game stats
  const [score, setScore] = useState(0)
  const [eatenCount, setEatenCount] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)

  // Speed
  const [speed, setSpeed] = useState<number>(100) // ms per step

  // Load High Score
  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem('prevu_snake_highscore')
      if (saved) setHighScore(parseInt(saved, 10) || 0)
    } catch {
      // ignore
    }
  }, [])

  // Save High Score
  const updateHighScore = useCallback((newScore: number) => {
    if (newScore > highScore) {
      setHighScore(newScore)
      try {
        localStorage.setItem('prevu_snake_highscore', newScore.toString())
      } catch {
        // ignore
      }
    }
  }, [highScore])

  // Reset grid & snake
  const resetGame = useCallback(() => {
    setGrid(generateInitialGrid())
    setSnake([
      { x: 10, y: 3 },
      { x: 9, y: 3 },
      { x: 8, y: 3 },
      { x: 7, y: 3 }
    ])
    setDirection('RIGHT')
    nextDirectionRef.current = 'RIGHT'
    setScore(0)
    setEatenCount(0)
    setGameOver(false)
  }, [])

  // Start Auto Mode
  const startAutoMode = () => {
    if (mode === 'auto' && isPlaying) {
      setIsPlaying(false)
    } else {
      setMode('auto')
      setIsPlaying(true)
      setGameOver(false)
    }
  }

  // Start Play Mode
  const startPlayMode = () => {
    if (mode === 'play' && isPlaying) {
      setIsPlaying(false)
    } else {
      if (gameOver) resetGame()
      setMode('play')
      setIsPlaying(true)
      setGameOver(false)
    }
  }

  // Keyboard navigation for Play Mode
  useEffect(() => {
    if (mode !== 'play') return

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent scrolling when playing with arrow keys or space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault()
      }

      if (e.key === ' ' || e.code === 'Space') {
        setIsPlaying(prev => !prev)
        return
      }

      const current = nextDirectionRef.current
      if ((e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') && current !== 'DOWN') {
        nextDirectionRef.current = 'UP'
      } else if ((e.key === 'ArrowDown' || e.key.toLowerCase() === 's') && current !== 'UP') {
        nextDirectionRef.current = 'DOWN'
      } else if ((e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') && current !== 'RIGHT') {
        nextDirectionRef.current = 'LEFT'
      } else if ((e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') && current !== 'LEFT') {
        nextDirectionRef.current = 'RIGHT'
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mode])

  // Auto Mode Target Finder (Find nearest commit square)
  const findNextAutoDirection = useCallback((currentHead: Point, currentSnake: Point[], currentGrid: number[][]): Direction => {
    // 1. Collect all coordinates with commits (level > 0)
    let closestFood: Point | null = null
    let minDistance = Infinity

    for (let c = 0; c < 48; c++) {
      for (let r = 0; r < 7; r++) {
        if (currentGrid[c][r] > 0) {
          // Toroidal distance
          const dx = Math.min(Math.abs(c - currentHead.x), 48 - Math.abs(c - currentHead.x))
          const dy = Math.min(Math.abs(r - currentHead.y), 7 - Math.abs(r - currentHead.y))
          const dist = dx + dy
          if (dist < minDistance) {
            minDistance = dist
            closestFood = { x: c, y: r }
          }
        }
      }
    }

    // If no food left, respawn grid!
    if (!closestFood) {
      setGrid(generateInitialGrid())
      return nextDirectionRef.current
    }

    // 2. Determine best safe move towards food
    const moves: { dir: Direction; pt: Point }[] = [
      { dir: 'RIGHT', pt: { x: (currentHead.x + 1) % 48, y: currentHead.y } },
      { dir: 'LEFT', pt: { x: (currentHead.x - 1 + 48) % 48, y: currentHead.y } },
      { dir: 'DOWN', pt: { x: currentHead.x, y: (currentHead.y + 1) % 7 } },
      { dir: 'UP', pt: { x: currentHead.x, y: (currentHead.y - 1 + 7) % 7 } }
    ]

    // Filter out self-collision
    const bodySet = new Set(currentSnake.slice(0, -1).map(p => `${p.x},${p.y}`))
    const safeMoves = moves.filter(m => !bodySet.has(`${m.pt.x},${m.pt.y}`))

    if (safeMoves.length === 0) {
      return nextDirectionRef.current // Trapped, keep going
    }

    // Rank moves by distance to target food
    safeMoves.sort((a, b) => {
      const distA = Math.min(Math.abs(a.pt.x - closestFood.x), 48 - Math.abs(a.pt.x - closestFood.x)) +
                    Math.min(Math.abs(a.pt.y - closestFood.y), 7 - Math.abs(a.pt.y - closestFood.y))
      const distB = Math.min(Math.abs(b.pt.x - closestFood.x), 48 - Math.abs(b.pt.x - closestFood.x)) +
                    Math.min(Math.abs(b.pt.y - closestFood.y), 7 - Math.abs(b.pt.y - closestFood.y))
      return distA - distB
    })

    return safeMoves[0].dir
  }, [])

  // Game Loop Tick
  useEffect(() => {
    if (!isPlaying || mode === 'idle' || gameOver) return

    const interval = setInterval(() => {
      setSnake(prevSnake => {
        const head = prevSnake[0]
        let currentDir = nextDirectionRef.current

        // If in auto mode, calculate best direction
        if (mode === 'auto') {
          currentDir = findNextAutoDirection(head, prevSnake, grid)
          nextDirectionRef.current = currentDir
        }

        setDirection(currentDir)

        // Calculate next head coordinate with toroidal wrap-around (48 cols x 7 rows)
        let nextX = head.x
        let nextY = head.y

        if (currentDir === 'RIGHT') nextX = (head.x + 1) % 48
        if (currentDir === 'LEFT') nextX = (head.x - 1 + 48) % 48
        if (currentDir === 'DOWN') nextY = (head.y + 1) % 7
        if (currentDir === 'UP') nextY = (head.y - 1 + 7) % 7

        const newHead: Point = { x: nextX, y: nextY }

        // Self-collision detection (Only in Play mode)
        if (mode === 'play') {
          const hitSelf = prevSnake.slice(0, -1).some(segment => segment.x === nextX && segment.y === nextY)
          if (hitSelf) {
            setGameOver(true)
            setIsPlaying(false)
            return prevSnake
          }
        }

        // Check if food was eaten
        const currentLevel = grid[nextX][nextY]
        const hasFood = currentLevel > 0

        if (hasFood) {
          // Eat commit!
          const pts = currentLevel * 15
          setScore(s => {
            const updated = s + pts
            updateHighScore(updated)
            return updated
          })
          setEatenCount(c => c + 1)

          // Blank out that commit tile on the grid
          setGrid(g => {
            const next = g.map(col => [...col])
            next[nextX][nextY] = 0
            return next
          })

          // Snake grows (keep tail)
          return [newHead, ...prevSnake]
        } else {
          // Normal move (pop tail)
          return [newHead, ...prevSnake.slice(0, -1)]
        }
      })
    }, speed)

    return () => clearInterval(interval)
  }, [isPlaying, mode, gameOver, speed, grid, findNextAutoDirection, updateHighScore])

  // Coordinate lookups for rendering snake body & head
  const snakeMap = useMemo(() => {
    const map = new Map<string, { isHead: boolean; index: number }>()
    snake.forEach((pt, idx) => {
      map.set(`${pt.x},${pt.y}`, { isHead: idx === 0, index: idx })
    })
    return map
  }, [snake])

  return (
    <div className="p-5 sm:p-6 rounded-2xl bg-[#161b22] border border-[#30363d] shadow-2xl mb-8 relative overflow-hidden">
      
      {/* Background Accent Glow when Snake is Running */}
      {mode !== 'idle' && isPlaying && (
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitCommit className="w-4 h-4 text-emerald-400" />
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Academic Commit Activity
              {mode !== 'idle' && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {mode === 'auto' ? 'Auto Snake' : 'Arcade Mode'}
                </span>
              )}
            </h3>
          </div>
          <p className="text-xs text-[#7d8590] font-mono mt-0.5">
            1,450+ verified contributions in the 2025–2026 academic cycle
          </p>
        </div>

        {/* Snake Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          
          {/* Button: Auto Snake (GitHub Style) */}
          <button
            type="button"
            onClick={startAutoMode}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              mode === 'auto' && isPlaying
                ? 'bg-emerald-500 text-black border-emerald-400 shadow-emerald-500/30'
                : 'bg-[#0d1117] border-[#30363d] text-[#e6edf3] hover:border-emerald-500/50 hover:text-white'
            }`}
            title="Watch the GitHub snake automatically eat commit activity"
          >
            {mode === 'auto' && isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-black" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <span className="text-sm">🐍</span>
                <span>Run Snake</span>
              </>
            )}
          </button>

          {/* Button: Playable Arcade Mode */}
          <button
            type="button"
            onClick={startPlayMode}
            className={`px-3 py-1.5 rounded-xl border font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm ${
              mode === 'play' && isPlaying
                ? 'bg-purple-600 text-white border-purple-400 shadow-purple-600/30'
                : 'bg-[#0d1117] border-[#30363d] text-[#e6edf3] hover:border-purple-500/50 hover:text-white'
            }`}
            title="Play the snake game using Arrow keys or WASD"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
            <span>{mode === 'play' ? (isPlaying ? 'Playing...' : 'Resume') : 'Play Game'}</span>
          </button>

          {/* Reset Grid */}
          {(mode !== 'idle' || score > 0) && (
            <button
              type="button"
              onClick={resetGame}
              className="p-1.5 rounded-xl border border-[#30363d] bg-[#0d1117] text-[#7d8590] hover:text-white hover:border-[#8b949e] transition-colors cursor-pointer"
              title="Reset Commit Grid"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Speed Toggle (Normal / Turbo) */}
          {mode !== 'idle' && (
            <button
              type="button"
              onClick={() => setSpeed(s => (s === 100 ? 55 : 100))}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center gap-1 transition-colors ${
                speed === 55 
                  ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                  : 'bg-[#0d1117] border-[#30363d] text-[#7d8590] hover:text-white'
              }`}
              title="Toggle snake crawl speed"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>{speed === 55 ? 'Turbo' : 'Normal'}</span>
            </button>
          )}

          {/* Less / More Legend (Shown when snake not taking whole header) */}
          <div className="hidden xl:flex items-center gap-1.5 text-[11px] text-[#7d8590] pl-2 border-l border-[#30363d]/60">
            <span>Less</span>
            <span className="w-2.5 h-2.5 rounded-sm bg-[#161b22] border border-[#30363d]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#0e4429]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#006d32]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#26a641]" />
            <span className="w-2.5 h-2.5 rounded-sm bg-[#39d353]" />
            <span>More</span>
          </div>

        </div>
      </div>

      {/* Live Snake Score & Statistics Dashboard (Visible in Active Modes) */}
      {mode !== 'idle' && (
        <div className="mb-3 px-3 py-1.5 rounded-xl bg-[#0d1117] border border-[#30363d] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-white">
              Score: <strong className="text-emerald-400 font-bold">{score}</strong>
            </span>
            <span className="text-[#7d8590]">|</span>
            <span className="text-[#8b949e]">
              Commits Eaten: <strong className="text-cyan-400 font-bold">{eatenCount}</strong>
            </span>
            <span className="text-[#7d8590]">|</span>
            <span className="text-[#8b949e]">
              Length: <strong className="text-purple-400 font-bold">{snake.length}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[#8b949e]">High Score:</span>
            <span className="text-amber-300 font-bold">{highScore}</span>
          </div>
        </div>
      )}

      {/* Visual 48-column Heatmap / Snake Arena */}
      <div className="overflow-x-auto pb-2 scrollbar-hide relative select-none">
        
        {/* Game Over Banner Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-[#090d13]/85 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-3 rounded-xl border border-rose-500/40 p-4">
            <div className="text-center">
              <span className="text-2xl font-bold font-mono text-rose-400 block tracking-wider">GAME OVER!</span>
              <p className="text-xs text-[#8b949e] font-mono mt-1">
                You collided with your own tail! Final Score: <strong className="text-emerald-400">{score}</strong>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  resetGame()
                  setIsPlaying(true)
                }}
                className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs font-mono transition-colors cursor-pointer shadow-lg shadow-emerald-500/20"
              >
                Play Again
              </button>
              <button
                type="button"
                onClick={() => {
                  resetGame()
                  setMode('auto')
                  setIsPlaying(true)
                }}
                className="px-4 py-1.5 rounded-xl bg-[#161b22] hover:bg-[#21262d] text-white border border-[#30363d] font-bold text-xs font-mono transition-colors cursor-pointer"
              >
                Switch to Auto Snake
              </button>
            </div>
          </div>
        )}

        {/* 48-column Contribution Grid */}
        <div className="flex gap-1 min-w-[700px] justify-between">
          {grid.map((col, cIdx) => (
            <div key={cIdx} className="flex flex-col gap-1">
              {col.map((level, rIdx) => {
                const key = `${cIdx},${rIdx}`
                const snakePart = snakeMap.get(key)

                // 1. Snake Head Rendering (Glowing Cyan/Emerald with direction indicators)
                if (snakePart?.isHead) {
                  return (
                    <div
                      key={rIdx}
                      className="w-3 h-3 rounded-sm bg-gradient-to-tr from-cyan-400 to-emerald-400 shadow-md shadow-cyan-400/80 z-10 flex items-center justify-center transition-transform scale-110"
                      title="Snake Head"
                    >
                      {/* Pixel eye */}
                      <span className="w-1 h-1 rounded-full bg-black/90" />
                    </div>
                  )
                }

                // 2. Snake Body Rendering (Smooth GitHub Gradient)
                if (snakePart) {
                  const opacity = Math.max(0.45, 1 - (snakePart.index / snake.length) * 0.55)
                  return (
                    <div
                      key={rIdx}
                      style={{ opacity }}
                      className="w-3 h-3 rounded-sm bg-gradient-to-tr from-[#388bfd] to-[#58a6ff] border border-cyan-400/40 z-10 shadow-sm shadow-blue-500/30 transition-transform"
                      title={`Snake body segment ${snakePart.index}`}
                    />
                  )
                }

                // 3. Normal GitHub Commit Squares
                const colorClass =
                  level === 4 ? 'bg-[#39d353]' :
                  level === 3 ? 'bg-[#26a641]' :
                  level === 2 ? 'bg-[#006d32]' :
                  level === 1 ? 'bg-[#0e4429]' : 'bg-[#0d1117] border border-[#30363d]/40'

                return (
                  <div
                    key={rIdx}
                    onMouseEnter={() => setHoveredCell({ col: cIdx, row: rIdx, level })}
                    onMouseLeave={() => setHoveredCell(null)}
                    className={`w-3 h-3 rounded-sm ${colorClass} transition-transform hover:scale-125 cursor-pointer`}
                    title={`Day commit intensity level: ${level}`}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* On-screen D-Pad Controls for Mobile / Touch Players */}
      {mode === 'play' && isPlaying && (
        <div className="sm:hidden pt-3 flex flex-col items-center justify-center gap-1.5 border-t border-[#30363d]/40 mt-3 font-mono">
          <button
            type="button"
            onClick={() => {
              if (direction !== 'DOWN') nextDirectionRef.current = 'UP'
            }}
            className="w-10 h-9 rounded-lg bg-[#21262d] border border-[#30363d] text-white flex items-center justify-center active:bg-emerald-500 active:text-black font-bold"
          >
            ▲
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (direction !== 'RIGHT') nextDirectionRef.current = 'LEFT'
              }}
              className="w-10 h-9 rounded-lg bg-[#21262d] border border-[#30363d] text-white flex items-center justify-center active:bg-emerald-500 active:text-black font-bold"
            >
              ◀
            </button>
            <button
              type="button"
              onClick={() => {
                if (direction !== 'UP') nextDirectionRef.current = 'DOWN'
              }}
              className="w-10 h-9 rounded-lg bg-[#21262d] border border-[#30363d] text-white flex items-center justify-center active:bg-emerald-500 active:text-black font-bold"
            >
              ▼
            </button>
            <button
              type="button"
              onClick={() => {
                if (direction !== 'LEFT') nextDirectionRef.current = 'RIGHT'
              }}
              className="w-10 h-9 rounded-lg bg-[#21262d] border border-[#30363d] text-white flex items-center justify-center active:bg-emerald-500 active:text-black font-bold"
            >
              ▶
            </button>
          </div>
        </div>
      )}

      {/* Interactive Heatmap Footer: Academic Streak & Controls Guide */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 pt-3 border-t border-[#30363d]/50 text-xs font-mono text-[#7d8590]">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            42-Day Academic Prep Streak
          </span>
          <span className="text-[#30363d]">•</span>
          <span>Avg 31 contributions / week</span>
        </div>

        <div className="text-xs">
          {mode === 'play' ? (
            <span className="text-purple-300 font-medium">
              🎮 Use <kbd className="px-1.5 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[10px] text-white">Arrow Keys</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-[#0d1117] border border-[#30363d] text-[10px] text-white">WASD</kbd> to steer
            </span>
          ) : mode === 'auto' ? (
            <span className="text-emerald-300 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              Autonomous GitHub Snake eating active contribution tiles
            </span>
          ) : hoveredCell ? (
            <span className="text-white font-medium">
              Week {hoveredCell.col + 1}, {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][hoveredCell.row]}:{' '}
              <strong className="text-emerald-400">
                {hoveredCell.level === 0 ? 'No uploads recorded' : `${hoveredCell.level * 3 + 2} verified paper & notes contributions`}
              </strong>
            </span>
          ) : (
            <span className="text-[#7d8590] hidden sm:inline">
              Click <strong className="text-emerald-400 font-semibold">🐍 Run Snake</strong> or hover over any day square
            </span>
          )}
        </div>
      </div>

    </div>
  )
}
