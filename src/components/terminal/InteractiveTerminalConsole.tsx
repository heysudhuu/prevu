'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { PREVU_THEMES } from '@/lib/constants/themes'
import { 
  Terminal as TerminalIcon, 
  Volume2, 
  VolumeX, 
  RotateCw, 
  CornerDownLeft, 
  Sparkles,
  Command,
  HelpCircle,
  Cpu
} from 'lucide-react'

interface TerminalLog {
  id: string
  type: 'cmd' | 'ok' | 'info' | 'warn' | 'error' | 'ascii'
  text: string
  accent?: string
}

const INITIAL_LOGS: TerminalLog[] = [
  { id: '1', type: 'info', text: 'Prevu Academic Shell v2.6.0 (cu-engineering) • Type "help" or click below:' },
  { id: '2', type: 'ok', text: '✔ Verified 1,450+ question papers & CBT simulation engine ready (0ms latency)' }
]

const QUICK_COMMANDS = [
  'neofetch',
  'theme tokyo-night',
  'cgpa 8.5',
  'browse sem-3',
  'cbt start',
  'help'
]

export default function InteractiveTerminalConsole() {
  const router = useRouter()
  const [logs, setLogs] = useState<TerminalLog[]>(INITIAL_LOGS)
  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState<number>(-1)
  const [soundEnabled, setSoundEnabled] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isMatrixRain, setIsMatrixRain] = useState(false)
  
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom when logs update
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs, isMatrixRain])

  // Play mechanical key click sound
  const playKeySound = () => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime)
      gain.gain.setValueAtTime(0.015, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.03)
    } catch {
      // Audio not permitted or supported
    }
  }

  // Play command complete chirp
  const playCompleteSound = (success = true) => {
    if (!soundEnabled || typeof window === 'undefined') return
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (!AudioCtx) return
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      
      osc.type = 'sine'
      if (success) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime) // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.1) // G5
      } else {
        osc.frequency.setValueAtTime(329.63, ctx.currentTime) // E4
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.15) // A3
      }
      gain.gain.setValueAtTime(0.03, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12)
      
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.12)
    } catch {
      // Audio not permitted
    }
  }

  const handleCommandExecution = (rawCmd: string) => {
    const trimmed = rawCmd.trim()
    if (!trimmed) return

    // Add command to log
    const cmdLogId = Date.now().toString()
    setLogs(prev => [...prev, { id: cmdLogId, type: 'cmd', text: trimmed }])
    
    // Update history
    setHistory(prev => [trimmed, ...prev])
    setHistoryIndex(-1)
    setInputVal('')
    setIsProcessing(true)

    const parts = trimmed.split(' ')
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    setTimeout(() => {
      setIsProcessing(false)
      executeCommand(cmd, args, trimmed)
    }, 120)
  }

  const executeCommand = (cmd: string, args: string[], fullStr: string) => {
    const makeId = () => Math.random().toString(36).substring(2, 9)

    switch (cmd) {
      case 'help':
      case 'man': {
        playCompleteSound(true)
        setLogs(prev => [
          ...prev,
          { id: makeId(), type: 'info', text: '═══ PREVU SHELL COMMAND MANUAL ═══' },
          { id: makeId(), type: 'info', text: '  neofetch       : Display CU engineering system architecture & stats' },
          { id: makeId(), type: 'info', text: '  theme [name]   : Switch palette (e.g. "theme matrix-cyber", "theme list")' },
          { id: makeId(), type: 'info', text: '  browse [sem]   : Open question paper vault for semester (e.g. "browse 3")' },
          { id: makeId(), type: 'info', text: '  cbt [start]    : Launch hardware-accelerated CBT simulator' },
          { id: makeId(), type: 'info', text: '  cgpa [target]  : Calculate exam marks needed for target CGPA (e.g. "cgpa 8.5")' },
          { id: makeId(), type: 'info', text: '  matrix         : Execute phosphor green digital cascade rain' },
          { id: makeId(), type: 'info', text: '  vee            : Summon Prevu mascot for advice' },
          { id: makeId(), type: 'info', text: '  status         : Check PWA offline sync & edge cache latency' },
          { id: makeId(), type: 'info', text: '  clear          : Clear shell buffer' }
        ])
        break
      }

      case 'neofetch': {
        playCompleteSound(true)
        const currentThemeId = typeof window !== 'undefined' ? localStorage.getItem('prevu-theme') || 'terminal-git' : 'terminal-git'
        setLogs(prev => [
          ...prev,
          {
            id: makeId(),
            type: 'ascii',
            text: `
      /\\_/\\      OS: Prevu Academic Vault v2.6.0
     ( o.o )     Kernel: 6.8.0-prevu-x86_64
      > ^ <      Host: Chandigarh University Engineering
                 Active Branch: main (origin/cu-engineering)
                 Theme Engine: ${currentThemeId} (10 palettes active)
                 Verification: Senior Peer Reviewed // Zero Leakage
                 Cache: IndexedDB PWA Local Vault (<45ms)
                 CBT Engine: Hardware-Accelerated Web Worker
                 Pass Rate: 98.4% Assessment Readiness
            `
          }
        ])
        break
      }

      case 'theme': {
        if (!args.length || args[0] === 'list') {
          playCompleteSound(true)
          const themeNames = PREVU_THEMES.map(t => `  - ${t.id.padEnd(16)} : ${t.name} (${t.category})`).join('\n')
          setLogs(prev => [
            ...prev,
            { id: makeId(), type: 'info', text: `Available Themes (10 Palettes):\n${themeNames}` },
            { id: makeId(), type: 'info', text: 'Usage: theme <id> (e.g. "theme matrix-cyber" or "theme tokyo-night")' }
          ])
          return
        }

        const targetThemeId = args[0].toLowerCase()
        const match = PREVU_THEMES.find(t => t.id === targetThemeId || t.name.toLowerCase().includes(targetThemeId))
        
        if (match) {
          playCompleteSound(true)
          // Live apply theme
          try {
            const root = document.documentElement
            root.className = root.className.replace(/\btheme-\S+/g, '').trim()
            root.classList.add(`theme-${match.id}`)
            localStorage.setItem('prevu-theme', match.id)
            window.dispatchEvent(new CustomEvent('prevu-theme-change', { detail: { theme: match.id } }))
          } catch (e) {
            console.error(e)
          }

          setLogs(prev => [
            ...prev,
            { id: makeId(), type: 'ok', text: `✔ [SYNCHRONIZED] Switched global palette to "${match.name}" (${match.id})` }
          ])
        } else {
          playCompleteSound(false)
          setLogs(prev => [
            ...prev,
            { id: makeId(), type: 'error', text: `[ERROR] Theme "${args[0]}" not found. Run "theme list" to see all 10 palettes.` }
          ])
        }
        break
      }

      case 'browse':
      case 'vault':
      case 'papers': {
        playCompleteSound(true)
        const sem = args[0] ? args[0].replace('sem-', '').replace('sem', '') : null
        if (sem && !isNaN(Number(sem)) && Number(sem) >= 1 && Number(sem) <= 8) {
          setLogs(prev => [
            ...prev,
            { id: makeId(), type: 'ok', text: `[OK] Navigating to Semester ${sem} PYQ repository...` }
          ])
          setTimeout(() => router.push(`/browse?sem=${sem}`), 400)
        } else {
          setLogs(prev => [
            ...prev,
            { id: makeId(), type: 'ok', text: '[OK] Opening full academic papers vault...' }
          ])
          setTimeout(() => router.push('/browse'), 400)
        }
        break
      }

      case 'cbt':
      case 'test':
      case 'quiz': {
        playCompleteSound(true)
        setLogs(prev => [
          ...prev,
          { id: makeId(), type: 'ok', text: '[OK] Initializing Hardware-Accelerated CBT Simulation Arena...' }
        ])
        setTimeout(() => router.push('/cbt'), 400)
        break
      }

      case 'cgpa':
      case 'calc':
      case 'sgpa': {
        playCompleteSound(true)
        const target = parseFloat(args[0]) || 8.5
        const validTarget = Math.min(Math.max(target, 4.0), 10.0)
        
        const mstTarget = Math.round(validTarget * 2.8)
        const estTarget = Math.round(validTarget * 7.5)
        
        setLogs(prev => [
          ...prev,
          { id: makeId(), type: 'info', text: `════ TARGET CGPA ROADMAP: ${validTarget.toFixed(2)} ════` },
          { id: makeId(), type: 'ok', text: `• Required MST-1 Marks    : ≥ ${mstTarget} / 30` },
          { id: makeId(), type: 'ok', text: `• Required MST-2 Marks    : ≥ ${mstTarget} / 30` },
          { id: makeId(), type: 'ok', text: `• Required EST Final Exam : ≥ ${estTarget} / 80` },
          { id: makeId(), type: 'info', text: '💡 Tip: Solve 3 verified previous year EST papers to secure a minimum 9.0+ grade!' }
        ])
        break
      }

      case 'matrix': {
        playCompleteSound(true)
        setIsMatrixRain(true)
        setLogs(prev => [
          ...prev,
          { id: makeId(), type: 'ok', text: '[1337] Engaging phosphor digital cascade...' }
        ])
        setTimeout(() => {
          setIsMatrixRain(false)
          setLogs(prev => [
            ...prev,
            { id: makeId(), type: 'info', text: '[OK] Matrix protocol returned to normal shell.' }
          ])
        }, 2400)
        break
      }

      case 'vee':
      case 'mascot': {
        playCompleteSound(true)
        const quotes = [
          'Vee says: "Commit your code, review your PYQs, and ace that EST final!" 🚀',
          'Vee says: "Hardware acceleration enabled. No exam stress can bypass our CBT simulator!" ⚡',
          'Vee says: "MST-1 weightage is 30%. Never leave numericals unattempted!" 📘',
          'Vee says: "Chandigarh University engineers build the future. You\'ve got this!" ✨'
        ]
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
        setLogs(prev => [
          ...prev,
          { id: makeId(), type: 'ok', text: randomQuote }
        ])
        break
      }

      case 'status':
      case 'ping': {
        playCompleteSound(true)
        setLogs(prev => [
          ...prev,
          { id: makeId(), type: 'ok', text: '[STATUS: ALL SYSTEMS NOMINAL]' },
          { id: makeId(), type: 'info', text: '• Edge Gateway Latency   : 12ms' },
          { id: makeId(), type: 'info', text: '• PWA Offline Storage    : Synchronized' },
          { id: makeId(), type: 'info', text: '• Question Vault Shard   : Chandigarh University Engineering' },
          { id: makeId(), type: 'info', text: '• CBT Worker Thread      : Idle // Ready to benchmark' }
        ])
        break
      }

      case 'clear':
      case 'cls': {
        setLogs([
          { id: makeId(), type: 'info', text: 'Prevu Academic Shell v2.6.0. Type "help" for commands.' }
        ])
        break
      }

      default: {
        playCompleteSound(false)
        setLogs(prev => [
          ...prev,
          { 
            id: makeId(), 
            type: 'error', 
            text: `Command not recognized: "${fullStr}". Type "help" for available commands.` 
          }
        ])
        break
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    playKeySound()

    if (e.key === 'Enter') {
      e.preventDefault()
      handleCommandExecution(inputVal)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length > 0) {
        const nextIdx = Math.min(historyIndex + 1, history.length - 1)
        setHistoryIndex(nextIdx)
        setInputVal(history[nextIdx] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1
        setHistoryIndex(nextIdx)
        setInputVal(history[nextIdx] || '')
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setInputVal('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Autocomplete against available commands
      const commands = ['help', 'neofetch', 'theme', 'browse', 'cbt', 'cgpa', 'matrix', 'vee', 'status', 'clear']
      const match = commands.find(c => c.startsWith(inputVal.trim().toLowerCase()))
      if (match) {
        setInputVal(match + ' ')
      }
    }
  }

  return (
    <div className="w-full max-w-3xl rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-2xl overflow-hidden text-left mb-8 font-mono">
      
      {/* Terminal Titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 cursor-pointer" onClick={() => setLogs([])} title="Clear Screen" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 cursor-pointer" onClick={() => handleCommandExecution('status')} title="System Status" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 cursor-pointer" onClick={() => handleCommandExecution('neofetch')} title="Run Neofetch" />
          </div>
          <span className="text-[11px] text-[#7d8590] ml-2 flex items-center gap-1.5 font-bold">
            <TerminalIcon className="w-3.5 h-3.5 text-emerald-400" />
            cu-terminal // bash 80x24 (interactive)
          </span>
        </div>

        {/* Audio Toggle & Help shortcut */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Mute Mechanical Keystrokes' : 'Enable Mechanical Keystroke Sound'}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              soundEnabled 
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' 
                : 'bg-[#21262d] border-[#30363d] text-[#7d8590] hover:text-white'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            type="button"
            onClick={() => handleCommandExecution('help')}
            className="px-2.5 py-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[10px] text-[#7d8590] hover:text-white transition-all cursor-pointer flex items-center gap-1"
          >
            <HelpCircle className="w-3 h-3 text-cyan-400" />
            <span>help</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen Body */}
      <div 
        className="p-4 sm:p-5 text-xs text-[#e6edf3] space-y-2 max-h-52 sm:max-h-60 overflow-y-auto cursor-text select-text"
        onClick={() => inputRef.current?.focus()}
      >
        {isMatrixRain ? (
          <div className="py-4 text-emerald-400 text-xs font-mono animate-pulse tracking-widest whitespace-pre-line leading-relaxed">
            {`01010000 01110010 01100101 01110110 01110101 // MATRIX PROTOCOL ENGAGED
10110100 11001010 11110000 00101101 // BYPASSING EXAM OBSTACLES
01000011 01010101 00100000 01000101 // CHANDIGARH UNIVERSITY CORE
11100010 10000000 10100110 // ZERO LEAKAGE PYQ SYSTEM OK`}
          </div>
        ) : (
          logs.map((log) => {
            if (log.type === 'cmd') {
              return (
                <div key={log.id} className="flex items-center gap-2 text-white font-semibold">
                  <span className="text-emerald-400 font-bold">$</span>
                  <span>{log.text}</span>
                </div>
              )
            }
            if (log.type === 'ascii') {
              return (
                <pre key={log.id} className="text-cyan-400 text-[10px] sm:text-[11px] leading-tight font-mono py-1 overflow-x-auto">
                  {log.text}
                </pre>
              )
            }
            return (
              <div 
                key={log.id} 
                className={
                  log.type === 'ok' ? 'text-emerald-400' :
                  log.type === 'error' ? 'text-rose-400 font-bold' :
                  log.type === 'warn' ? 'text-amber-400' : 'text-[#7d8590]'
                }
              >
                {log.text}
              </div>
            )
          })
        )}

        {/* Live Input Line */}
        <div className="flex items-center gap-2 pt-2 border-t border-[#30363d]/40">
          <span className="text-emerald-400 font-bold select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type 'help', 'neofetch', 'theme matrix-cyber', 'cgpa 8.5'..."
            className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-[#484f58] font-mono text-xs caret-emerald-400"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          {isProcessing ? (
            <RotateCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
          ) : (
            <button 
              type="button" 
              onClick={() => handleCommandExecution(inputVal)}
              className="text-[#7d8590] hover:text-emerald-400 p-0.5 cursor-pointer"
              title="Execute Command"
            >
              <CornerDownLeft className="w-3 h-3" />
            </button>
          )}
        </div>

        <div ref={bottomRef} />
      </div>

      {/* Preset Action Pills */}
      <div className="px-4 py-2.5 bg-[#161b22] border-t border-[#30363d] flex flex-wrap items-center gap-2">
        <span className="text-[10px] text-[#7d8590] font-semibold flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400" />
          Click to run:
        </span>
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            onClick={() => handleCommandExecution(cmd)}
            className="px-2 py-0.5 rounded-md bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] hover:border-emerald-500/50 text-[10px] text-[#7d8590] hover:text-white transition-all cursor-pointer font-mono"
          >
            $ {cmd}
          </button>
        ))}
      </div>

    </div>
  )
}

