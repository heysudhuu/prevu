'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  PenTool, 
  Highlighter, 
  StickyNote, 
  Eraser, 
  Trash2, 
  Undo, 
  X, 
  Check, 
  Plus, 
  Eye,
  EyeOff
} from 'lucide-react'

interface StickyNoteItem {
  id: string
  x: number
  y: number
  text: string
  color: string
}

interface PathItem {
  type: 'pen' | 'highlighter'
  points: { x: number; y: number }[]
  color: string
  width: number
}

interface PaperAnnotatorOverlayProps {
  paperId: string
  isOpen: boolean
  onClose: () => void
}

export default function PaperAnnotatorOverlay({
  paperId,
  isOpen,
  onClose
}: PaperAnnotatorOverlayProps) {
  const [activeTool, setActiveTool] = useState<'pen' | 'highlighter' | 'note' | 'eraser'>('pen')
  const [penColor, setPenColor] = useState('#a855f7') // purple
  const [paths, setPaths] = useState<PathItem[]>([])
  const [stickyNotes, setStickyNotes] = useState<StickyNoteItem[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentPath, setCurrentPath] = useState<PathItem | null>(null)
  const [isVisible, setIsVisible] = useState(true)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const storageKey = `prevu_annotations_${paperId}`

  // Load saved annotations
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.paths) setPaths(parsed.paths)
        if (parsed.stickyNotes) setStickyNotes(parsed.stickyNotes)
      }
    } catch {
      // ignore
    }
  }, [paperId, storageKey])

  // Save annotations
  useEffect(() => {
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ paths, stickyNotes })
      )
    } catch {
      // ignore
    }
  }, [paths, stickyNotes, storageKey])

  // Canvas resize and render
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Render paths
    const renderPath = (p: PathItem) => {
      if (p.points.length < 2) return
      ctx.beginPath()
      ctx.moveTo(p.points[0].x, p.points[0].y)
      for (let i = 1; i < p.points.length; i++) {
        ctx.lineTo(p.points[i].x, p.points[i].y)
      }

      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      if (p.type === 'highlighter') {
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.width || 18
        ctx.globalAlpha = 0.35
      } else {
        ctx.strokeStyle = p.color
        ctx.lineWidth = p.width || 3
        ctx.globalAlpha = 0.95
      }

      ctx.stroke()
      ctx.globalAlpha = 1.0
    }

    paths.forEach(renderPath)
    if (currentPath) {
      renderPath(currentPath)
    }
  }, [paths, currentPath, isOpen])

  if (!isOpen) return null

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool === 'note') return

    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(true)
    const newPath: PathItem = {
      type: activeTool === 'highlighter' ? 'highlighter' : 'pen',
      points: [{ x, y }],
      color: activeTool === 'highlighter' ? '#facc15' : penColor,
      width: activeTool === 'highlighter' ? 20 : 3
    }
    setCurrentPath(newPath)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentPath || activeTool === 'note') return

    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setCurrentPath(prev => prev ? { ...prev, points: [...prev.points, { x, y }] } : null)
  }

  const handleMouseUp = () => {
    if (!isDrawing || !currentPath) return
    setIsDrawing(false)
    setPaths(prev => [...prev, currentPath])
    setCurrentPath(null)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (activeTool !== 'note') return
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const newNote: StickyNoteItem = {
      id: Math.random().toString(36).substring(7),
      x: Math.min(x, rect.width - 160),
      y: Math.min(y, rect.height - 100),
      text: 'Note: ',
      color: '#fef08a' // soft yellow
    }

    setStickyNotes(prev => [...prev, newNote])
    setActiveTool('pen')
  }

  const handleUndo = () => {
    setPaths(prev => prev.slice(0, -1))
  }

  const handleClearAll = () => {
    if (window.confirm('Clear all annotations and sticky notes for this paper?')) {
      setPaths([])
      setStickyNotes([])
      localStorage.removeItem(storageKey)
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 z-40 ${isVisible ? 'pointer-events-auto' : 'pointer-events-none'}`}
      onClick={handleCanvasClick}
    >
      {/* Floating Glassmorphic Annotation Toolbar */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#11111a]/95 border border-purple-500/40 rounded-2xl shadow-2xl p-1.5 backdrop-blur-xl flex items-center gap-1.5 animate-slide-down pointer-events-auto"
      >
        <button
          onClick={() => setActiveTool('pen')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'pen'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
              : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light'
          }`}
          title="Pen (Draw)"
        >
          <PenTool className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('highlighter')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'highlighter'
              ? 'bg-yellow-500 text-black shadow-md shadow-yellow-500/30'
              : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light'
          }`}
          title="Highlighter"
        >
          <Highlighter className="w-4 h-4" />
        </button>

        <button
          onClick={() => setActiveTool('note')}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            activeTool === 'note'
              ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
              : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light'
          }`}
          title="Add Sticky Note (click anywhere on paper)"
        >
          <StickyNote className="w-4 h-4" />
        </button>

        {/* Color Palette (Pen) */}
        {activeTool === 'pen' && (
          <div className="flex items-center gap-1 pl-1 border-l border-prevu-surface-light">
            {['#a855f7', '#06b6d4', '#10b981', '#f43f5e', '#ffffff'].map(c => (
              <button
                key={c}
                onClick={() => setPenColor(c)}
                className={`w-4 h-4 rounded-full transition-transform ${penColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        )}

        <div className="h-4 w-px bg-prevu-surface-light mx-1" />

        <button
          onClick={handleUndo}
          disabled={paths.length === 0}
          className="p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light disabled:opacity-40 transition-colors cursor-pointer"
          title="Undo last stroke"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          onClick={handleClearAll}
          className="p-2 rounded-xl text-prevu-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
          title="Clear all annotations"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light transition-colors cursor-pointer"
          title={isVisible ? 'Hide Annotations' : 'Show Annotations'}
        >
          {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
        </button>

        <button
          onClick={onClose}
          className="p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light transition-colors ml-1 cursor-pointer"
          title="Close Annotator Mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawing Canvas */}
      {isVisible && (
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className={`w-full h-full ${activeTool === 'note' ? 'cursor-crosshair' : 'cursor-crosshair'}`}
        />
      )}

      {/* Sticky Notes Overlay */}
      {isVisible && stickyNotes.map((note) => (
        <div
          key={note.id}
          style={{ left: `${note.x}px`, top: `${note.y}px` }}
          onClick={(e) => e.stopPropagation()}
          className="absolute w-44 p-2.5 rounded-xl bg-yellow-100 text-gray-900 shadow-2xl border border-yellow-300 z-50 text-xs animate-scale-in"
        >
          <div className="flex items-center justify-between border-b border-yellow-200 pb-1 mb-1.5">
            <span className="font-mono text-[9px] font-bold uppercase text-yellow-800">
              Exam Note
            </span>
            <button
              onClick={() => setStickyNotes(prev => prev.filter(n => n.id !== note.id))}
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>

          <textarea
            value={note.text}
            onChange={(e) => {
              const val = e.target.value
              setStickyNotes(prev => prev.map(n => n.id === note.id ? { ...n, text: val } : n))
            }}
            placeholder="Type your notes or solution hints..."
            className="w-full bg-transparent resize-none focus:outline-none text-[11px] leading-snug font-medium text-gray-800 h-16"
          />
        </div>
      ))}

    </div>
  )
}
