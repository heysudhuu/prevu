'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  SlidersHorizontal,
  UploadCloud,
  RotateCcw,
  Sparkles,
  Check
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface CustomUnit {
  unitNumber: number
  title: string
  topics: string[]
  weightage: string
}

interface CustomSyllabusModalProps {
  isOpen: boolean
  subjectCode: string
  subjectName?: string
  defaultUnits: CustomUnit[]
  currentUnits: CustomUnit[]
  isCustom: boolean
  onClose: () => void
  onSave: (units: CustomUnit[]) => void
  onReset: () => void
}

const DEFAULT_WEIGHTAGES = [
  '25% (MST-1 Primary Focus)',
  '25% (MST-1 & MST-2)',
  '25% (MST-2 Primary Focus)',
  '25% (EST Comprehensive)'
]

export function CustomSyllabusModal({
  isOpen,
  subjectCode,
  defaultUnits,
  currentUnits,
  isCustom,
  onClose,
  onSave,
  onReset
}: CustomSyllabusModalProps) {
  const [mode, setMode] = useState<'editor' | 'paste'>('editor')
  const [activeUnitTab, setActiveUnitTab] = useState<number>(1)
  const [units, setUnits] = useState<CustomUnit[]>(() => {
    if (currentUnits && currentUnits.length > 0) {
      return JSON.parse(JSON.stringify(currentUnits))
    }
    return JSON.parse(JSON.stringify(defaultUnits))
  })
  const [rawText, setRawText] = useState('')
  const [parseError, setParseError] = useState<string | null>(null)

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleUnitTitleChange = (unitNum: number, title: string) => {
    setUnits(prev =>
      prev.map(u => (u.unitNumber === unitNum ? { ...u, title } : u))
    )
  }

  const handleUnitWeightageChange = (unitNum: number, weightage: string) => {
    setUnits(prev =>
      prev.map(u => (u.unitNumber === unitNum ? { ...u, weightage } : u))
    )
  }

  const handleTopicsTextChange = (unitNum: number, text: string) => {
    const topics = text
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean)

    setUnits(prev =>
      prev.map(u => (u.unitNumber === unitNum ? { ...u, topics } : u))
    )
  }

  // Smart Parser for pasted syllabus text
  const handleAutoParseSyllabus = () => {
    if (!rawText.trim()) {
      setParseError('Please paste your syllabus text into the box first.')
      return
    }

    setParseError(null)
    const text = rawText

    // Try splitting by Unit / Module markers
    const unitRegex = /(?:Unit|MODULE|Section)\s*([1-4]|I{1,3}|IV)[:.\s-]*([^\n]*)/gi
    const matches = Array.from(text.matchAll(unitRegex))

    if (matches.length < 2) {
      // Fallback: split by 4 equal chunks or paragraphs
      const paragraphs = text
        .split(/\n{2,}/)
        .map(p => p.trim())
        .filter(p => p.length > 10)

      if (paragraphs.length >= 4) {
        const parsed: CustomUnit[] = [1, 2, 3, 4].map(num => ({
          unitNumber: num,
          title: `Unit ${num}: ${paragraphs[num - 1].slice(0, 45)}...`,
          weightage: DEFAULT_WEIGHTAGES[num - 1] || '25%',
          topics: paragraphs[num - 1]
            .split(/[\n,;•·-]/)
            .map(t => t.trim())
            .filter(t => t.length > 3)
        }))
        setUnits(parsed)
        setMode('editor')
        return
      }

      setParseError('Could not auto-detect 4 distinct units. Please check your text or use the manual editor.')
      return
    }

    // Parse each detected unit block
    const parsedUnits: CustomUnit[] = []
    for (let i = 0; i < matches.length && i < 4; i++) {
      const match = matches[i]
      const unitNum = i + 1
      const rawTitle = match[2]?.trim() || `Unit ${unitNum}`
      
      const startIndex = match.index! + match[0].length
      const endIndex = i + 1 < matches.length ? matches[i + 1].index! : text.length
      const body = text.substring(startIndex, endIndex).trim()

      const topics = body
        .split(/[\n;•·-]/)
        .map(t => t.replace(/^[0-9]+[.)]\s*/, '').trim())
        .filter(t => t.length > 4 && !/^(Unit|Module)/i.test(t))

      parsedUnits.push({
        unitNumber: unitNum,
        title: rawTitle.replace(/^Unit\s*[0-9]+[:.\s]*/i, '') || `Topics for Unit ${unitNum}`,
        weightage: DEFAULT_WEIGHTAGES[i] || '25%',
        topics: topics.length > 0 ? topics : ['Core theoretical concepts', 'Key principles and applications']
      })
    }

    // Ensure we have 4 units
    while (parsedUnits.length < 4) {
      const num = parsedUnits.length + 1
      parsedUnits.push({
        unitNumber: num,
        title: `Unit ${num} Syllabus`,
        weightage: DEFAULT_WEIGHTAGES[num - 1] || '25%',
        topics: ['Important topics and exam preparation']
      })
    }

    setUnits(parsedUnits)
    setMode('editor')
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      if (content) {
        setRawText(content)
      }
    }
    reader.readAsText(file)
  }

  const handleSave = () => {
    // Validate that at least one unit has content
    const sanitized = units.map(u => ({
      ...u,
      title: u.title.trim() || `Unit ${u.unitNumber}`,
      topics: u.topics.length > 0 ? u.topics : ['General syllabus concepts']
    }))

    onSave(sanitized)
    onClose()
  }

  const activeUnit = units.find(u => u.unitNumber === activeUnitTab) || units[0]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-2xl p-5 sm:p-7 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4 pb-4 border-b border-prevu-surface-light">
          <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center shrink-0">
            <SlidersHorizontal className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Customize Syllabus Blueprint
              </h2>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-purple-500/10 text-purple-400 border border-purple-500/30">
                {subjectCode}
              </span>
            </div>
            <p className="text-xs text-prevu-text-muted mt-1">
              If your current semester syllabus differs from the default university outline, update or upload your syllabus units below.
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center justify-between gap-3 mt-4">
          <div className="flex items-center bg-prevu-bg/70 p-1 rounded-xl border border-prevu-surface-light">
            <button
              onClick={() => setMode('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'editor'
                  ? 'bg-prevu-surface text-white shadow-sm'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              Unit Editor (1 to 4)
            </button>
            <button
              onClick={() => setMode('paste')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'paste'
                  ? 'bg-prevu-surface text-white shadow-sm'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              <span>Paste / Upload Text</span>
            </button>
          </div>

          {isCustom && (
            <button
              onClick={() => {
                onReset()
                onClose()
              }}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-500/10 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Default</span>
            </button>
          )}
        </div>

        {/* Mode 1: Manual Unit Editor */}
        {mode === 'editor' && (
          <div className="mt-4 space-y-4">
            {/* Unit Tabs (1, 2, 3, 4) */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setActiveUnitTab(num)}
                  className={`py-2 px-2 rounded-xl text-xs font-bold font-mono transition-all text-center border ${
                    activeUnitTab === num
                      ? 'bg-prevu-accent text-white border-prevu-accent shadow-md shadow-prevu-accent/25'
                      : 'bg-prevu-bg/60 text-prevu-text-muted border-prevu-surface-light hover:text-white hover:bg-prevu-surface-light/40'
                  }`}
                >
                  Unit {num}
                </button>
              ))}
            </div>

            {/* Active Unit Fields */}
            {activeUnit && (
              <div className="p-4 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] font-bold text-prevu-text uppercase tracking-wider">
                      Unit {activeUnit.unitNumber} Title
                    </label>
                    <input
                      type="text"
                      value={activeUnit.title}
                      onChange={e => handleUnitTitleChange(activeUnit.unitNumber, e.target.value)}
                      placeholder="e.g. Linear Data Structures & Applications"
                      className="w-full h-9 px-3 rounded-xl bg-prevu-surface border border-prevu-surface-light text-xs text-white focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-prevu-text uppercase tracking-wider">
                      Weightage / Focus
                    </label>
                    <input
                      type="text"
                      value={activeUnit.weightage}
                      onChange={e => handleUnitWeightageChange(activeUnit.unitNumber, e.target.value)}
                      placeholder="e.g. 25% (MST-1 Focus)"
                      className="w-full h-9 px-3 rounded-xl bg-prevu-surface border border-prevu-surface-light text-xs text-cyan-300 font-mono focus:outline-none focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-prevu-text uppercase tracking-wider">
                      Key Topics / Chapters
                    </label>
                    <span className="text-[10px] text-prevu-text-muted">
                      One topic per line
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={activeUnit.topics.join('\n')}
                    onChange={e => handleTopicsTextChange(activeUnit.unitNumber, e.target.value)}
                    placeholder="Enter key topics for Unit 1, one per line..."
                    className="w-full p-3 rounded-xl bg-prevu-surface border border-prevu-surface-light text-xs text-prevu-text-muted focus:text-white focus:outline-none focus:border-purple-500 transition-colors leading-relaxed"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mode 2: Paste / Upload Auto-Detect */}
        {mode === 'paste' && (
          <div className="mt-4 space-y-3.5">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-prevu-text uppercase tracking-wider">
                Paste Syllabus Text
              </label>
              <textarea
                rows={7}
                value={rawText}
                onChange={e => setRawText(e.target.value)}
                placeholder={`Paste your course syllabus handout here... For example:
Unit 1: Introduction to Web Architectures
- HTTP protocols, REST APIs, client-server models

Unit 2: React & Modern Frontend
- Component lifecycle, state management, hooks

Unit 3: Backend & Database Engineering
- PostgreSQL, indexes, query optimization

Unit 4: Security & Cloud Deployment
- Authentication, Docker, CI/CD pipelines`}
                className="w-full p-3 rounded-xl bg-prevu-bg/70 border border-prevu-surface-light text-xs text-white focus:outline-none focus:border-purple-500 transition-colors font-mono leading-relaxed"
              />
            </div>

            {parseError && (
              <p className="text-xs text-rose-400 font-semibold">{parseError}</p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-prevu-text-muted hover:text-white transition-colors">
                <UploadCloud className="w-4 h-4 text-purple-400" />
                <span>Or upload .txt file</span>
                <input
                  type="file"
                  accept=".txt,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <Button
                size="sm"
                onClick={handleAutoParseSyllabus}
                className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs px-4 rounded-xl flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Detect Units</span>
              </Button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-prevu-surface-light flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs px-4 rounded-xl border-prevu-surface-light text-prevu-text-muted hover:text-white"
          >
            Cancel
          </Button>

          <Button
            size="sm"
            onClick={handleSave}
            className="bg-prevu-accent hover:bg-prevu-accent/90 text-white font-bold text-xs px-5 rounded-xl shadow-lg shadow-prevu-accent/25 flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Custom Syllabus</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
