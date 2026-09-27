'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { 
  X, 
  Sparkles, 
  RotateCw, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Shuffle, 
  Flame, 
  BookOpen, 
  Lightbulb,
  Award
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getFlashcardsForSubject, Flashcard } from '@/lib/data/flashcards-data'

interface ExamHallFlashcardsModalProps {
  isOpen: boolean
  onClose: () => void
  subjectCode: string
  subjectName: string
}

export default function ExamHallFlashcardsModal({
  isOpen,
  onClose,
  subjectCode,
  subjectName
}: ExamHallFlashcardsModalProps) {
  const initialCards = useMemo(() => {
    return getFlashcardsForSubject(subjectCode, subjectName)
  }, [subjectCode, subjectName])

  const [cards, setCards] = useState<Flashcard[]>(initialCards)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [masteredIds, setMasteredIds] = useState<string[]>([])
  const [selectedUnit, setSelectedUnit] = useState<number | 'all'>('all')

  // Reset when cards change
  useEffect(() => {
    setCards(initialCards)
    setCurrentIndex(0)
    setIsFlipped(false)
  }, [initialCards])

  // Filter cards by unit
  const filteredCards = useMemo(() => {
    if (selectedUnit === 'all') return cards
    return cards.filter(c => c.unit === selectedUnit)
  }, [cards, selectedUnit])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault()
        setIsFlipped(prev => !prev)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        handlePrev()
      } else if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, currentIndex, filteredCards.length])

  if (!isOpen) return null

  const currentCard = filteredCards[currentIndex] || filteredCards[0]

  const handleNext = () => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev + 1) % (filteredCards.length || 1))
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % (filteredCards.length || 1))
  }

  const toggleMastered = (id: string) => {
    setMasteredIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleShuffle = () => {
    setIsFlipped(false)
    const shuffled = [...filteredCards].sort(() => Math.random() - 0.5)
    setCards(shuffled)
    setCurrentIndex(0)
  }

  const isCurrentMastered = currentCard ? masteredIds.includes(currentCard.id) : false
  const progressPercent = filteredCards.length > 0 
    ? Math.round((masteredIds.filter(id => filteredCards.some(c => c.id === id)).length / filteredCards.length) * 100)
    : 0

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-prevu-surface border border-prevu-surface-light rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-prevu-surface-light bg-prevu-bg/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  5-Min Exam Hall Recall
                </span>
                <span className="text-[11px] font-mono text-prevu-text-muted px-2 py-0.5 rounded bg-prevu-surface border border-prevu-surface-light">
                  {subjectCode}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white leading-tight">
                {subjectName} Quick Revision
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShuffle}
              className="text-prevu-text-muted hover:text-white h-8 px-2 text-xs"
              title="Shuffle Flashcards"
            >
              <Shuffle className="w-3.5 h-3.5 mr-1" /> Shuffle
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-prevu-surface-light text-prevu-text-muted hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Unit Filter Tabs & Progress Bar */}
        <div className="px-6 py-3 border-b border-prevu-surface-light/80 bg-prevu-surface/50 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => { setSelectedUnit('all'); setCurrentIndex(0); setIsFlipped(false); }}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                selectedUnit === 'all' 
                  ? 'bg-prevu-accent text-white shadow-sm' 
                  : 'text-prevu-text-muted hover:text-white bg-prevu-bg/60 border border-prevu-surface-light'
              }`}
            >
              All Units ({cards.length})
            </button>
            {[1, 2, 3, 4].map(u => {
              const count = cards.filter(c => c.unit === u).length
              if (count === 0) return null
              return (
                <button
                  key={u}
                  onClick={() => { setSelectedUnit(u); setCurrentIndex(0); setIsFlipped(false); }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedUnit === u 
                      ? 'bg-prevu-accent text-white shadow-sm' 
                      : 'text-prevu-text-muted hover:text-white bg-prevu-bg/60 border border-prevu-surface-light'
                  }`}
                >
                  Unit {u} ({count})
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-prevu-text-muted shrink-0">
            <span>Mastery:</span>
            <div className="w-24 h-2 rounded-full bg-prevu-bg overflow-hidden border border-prevu-surface-light">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-bold text-white">{progressPercent}%</span>
          </div>
        </div>

        {/* Flashcard Area */}
        <div className="p-6 flex-1 flex flex-col justify-center items-center overflow-y-auto min-h-[320px]">
          {currentCard ? (
            <div 
              onClick={() => setIsFlipped(prev => !prev)}
              className="w-full max-w-xl min-h-[260px] cursor-pointer group perspective select-none"
            >
              <div 
                className={`relative w-full h-full rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all duration-500 shadow-xl ${
                  isFlipped 
                    ? 'bg-gradient-to-br from-emerald-950/30 via-prevu-surface to-prevu-surface border-emerald-500/40 text-emerald-100 shadow-emerald-950/20' 
                    : 'bg-gradient-to-br from-prevu-surface via-prevu-surface to-prevu-bg border-prevu-surface-light group-hover:border-prevu-accent/50 text-white'
                }`}
              >
                {/* Card Top Metadata */}
                <div className="flex items-center justify-between gap-2 border-b border-prevu-surface-light/60 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-prevu-bg border border-prevu-surface-light text-prevu-accent uppercase">
                      Unit {currentCard.unit} • {currentCard.category}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      currentCard.examYield === 'must-know' 
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}>
                      {currentCard.examYield === 'must-know' ? '🔥 Must Know' : '⭐ High Yield'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-prevu-text-muted font-mono">
                    <span>{currentIndex + 1}</span>
                    <span>/</span>
                    <span>{filteredCards.length}</span>
                  </div>
                </div>

                {/* Card Content (Front vs Back) */}
                <div className="py-6 flex flex-col justify-center">
                  {!isFlipped ? (
                    <div>
                      <span className="text-[11px] font-mono text-prevu-text-muted uppercase tracking-wider block mb-2">
                        Question / Concept Prompt:
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                        {currentCard.front}
                      </h3>
                      {currentCard.hint && (
                        <div className="mt-4 flex items-start gap-1.5 text-xs text-prevu-accent/90 bg-prevu-accent/10 p-2.5 rounded-xl border border-prevu-accent/20">
                          <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{currentCard.hint}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Direct Solution / Exam Answer:
                      </span>
                      <div className="text-sm sm:text-base text-gray-200 leading-relaxed whitespace-pre-line font-normal">
                        {currentCard.back}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Bottom Flip Indicator */}
                <div className="flex items-center justify-between pt-3 border-t border-prevu-surface-light/60 text-xs text-prevu-text-muted">
                  <span className="flex items-center gap-1.5">
                    <RotateCw className="w-3.5 h-3.5 text-prevu-accent group-hover:rotate-180 transition-transform duration-500" />
                    <span>Click anywhere or press Space to {isFlipped ? 'flip back' : 'reveal answer'}</span>
                  </span>
                  {isCurrentMastered && (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-prevu-text-muted">
              No flashcards found for this unit.
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-6 py-4 border-t border-prevu-surface-light bg-prevu-bg/90 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={filteredCards.length <= 1}
              className="text-xs border-prevu-surface-light"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={filteredCards.length <= 1}
              className="text-xs border-prevu-surface-light"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {currentCard && (
              <Button
                variant={isCurrentMastered ? 'default' : 'outline'}
                size="sm"
                onClick={() => toggleMastered(currentCard.id)}
                className={`text-xs ${
                  isCurrentMastered 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                {isCurrentMastered ? 'Mastered!' : 'Mark as Mastered'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
