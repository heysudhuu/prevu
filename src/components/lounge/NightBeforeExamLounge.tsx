'use client'

import React, { useState } from 'react'
import { 
  Moon, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  ThumbsUp, 
  AlertCircle, 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Lightbulb, 
  Share2,
  FileQuestion,
  HelpCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

interface ExpectedTopic {
  id: string
  title: string
  unit: number
  probability: '99% Guaranteed' | 'Very High' | 'Expected'
  submittedBy: string
  upvotes: number
  hasVoted?: boolean
}

interface NightBeforeExamLoungeProps {
  subjectCode: string
  subjectName: string
  semester?: number
  onOpenFlashcards?: () => void
}

export default function NightBeforeExamLounge({
  subjectCode,
  subjectName,
  semester,
  onOpenFlashcards
}: NightBeforeExamLoungeProps) {
  // Pre-seeded high-probability topics for Chandigarh University students
  const [topics, setTopics] = useState<ExpectedTopic[]>([
    {
      id: 'nbe-1',
      title: 'Section C: Compulsory 10-mark derivation / long numerical with labelled diagram',
      unit: 2,
      probability: '99% Guaranteed',
      submittedBy: 'CU Senior CR',
      upvotes: 42
    },
    {
      id: 'nbe-2',
      title: 'Section A: Compare 2 fundamental definitions & write time complexities (2 marks each)',
      unit: 1,
      probability: 'Very High',
      submittedBy: 'Batchmate (CSE-A)',
      upvotes: 31
    },
    {
      id: 'nbe-3',
      title: 'Boundary conditions and edge case justification (favourite question of department evaluator)',
      unit: 3,
      probability: 'Expected',
      submittedBy: 'Anonymous Scholar',
      upvotes: 19
    }
  ])

  const [newTopicText, setNewTopicText] = useState('')
  const [newTopicUnit, setNewTopicUnit] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<'hot' | 'tips' | 'checklist'>('hot')

  const handleUpvote = (id: string) => {
    setTopics(prev => prev.map(t => {
      if (t.id === id) {
        const nextVoted = !t.hasVoted
        return {
          ...t,
          hasVoted: nextVoted,
          upvotes: nextVoted ? t.upvotes + 1 : t.upvotes - 1
        }
      }
      return t
    }))
  }

  const handleAddTopic = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTopicText.trim()) return

    const newTopic: ExpectedTopic = {
      id: `nbe-${Date.now()}`,
      title: newTopicText.trim(),
      unit: newTopicUnit,
      probability: 'Expected',
      submittedBy: 'You (Just now)',
      upvotes: 1,
      hasVoted: true
    }

    setTopics(prev => [newTopic, ...prev])
    setNewTopicText('')
  }

  return (
    <div className="bg-gradient-to-br from-indigo-950/25 via-prevu-surface to-prevu-surface border border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-prevu-surface-light relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-950/50">
            <Moon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">
                Night Before Exam (NBE) Lounge
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase">
                🔥 Active
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {subjectName} ({subjectCode})
            </h3>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {onOpenFlashcards && (
            <Button 
              size="sm"
              onClick={onOpenFlashcards}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs"
            >
              <Flame className="w-3.5 h-3.5 mr-1.5" /> 5-Min Flashcards
            </Button>
          )}
        </div>
      </div>

      {/* Navigation Chips */}
      <div className="flex items-center gap-2 mb-6 border-b border-prevu-surface-light pb-3 text-xs">
        <button
          onClick={() => setActiveTab('hot')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            activeTab === 'hot' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-prevu-text-muted hover:text-white bg-prevu-surface border border-prevu-surface-light'
          }`}
        >
          🔥 Hot Expected Questions ({topics.length})
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            activeTab === 'tips' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-prevu-text-muted hover:text-white bg-prevu-surface border border-prevu-surface-light'
          }`}
        >
          💡 CU Marking Scheme Secrets
        </button>
        <button
          onClick={() => setActiveTab('checklist')}
          className={`px-3 py-1.5 rounded-xl font-semibold transition-all ${
            activeTab === 'checklist' 
              ? 'bg-indigo-600 text-white shadow-md' 
              : 'text-prevu-text-muted hover:text-white bg-prevu-surface border border-prevu-surface-light'
          }`}
        >
          ✅ Exam Morning Checklist
        </button>
      </div>

      {/* TAB 1: Hot Expected Questions Board */}
      {activeTab === 'hot' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map(t => (
              <div 
                key={t.id}
                className="p-4 rounded-2xl bg-prevu-surface border border-prevu-surface-light hover:border-indigo-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-prevu-bg border border-prevu-surface-light text-prevu-accent">
                      Unit {t.unit}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      t.probability.includes('99%')
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}>
                      {t.probability}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-white mb-3 leading-relaxed">
                    {t.title}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-prevu-surface-light/60 text-xs text-prevu-text-muted">
                  <span className="text-[11px] font-mono">By {t.submittedBy}</span>

                  <button
                    onClick={() => handleUpvote(t.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                      t.hasVoted 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'bg-prevu-bg text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{t.upvotes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Post a Professor Hint or Expected Question */}
          <form onSubmit={handleAddTopic} className="mt-4 p-4 rounded-2xl bg-prevu-bg/70 border border-prevu-surface-light flex flex-col sm:flex-row items-center gap-3">
            <select
              value={newTopicUnit}
              onChange={e => setNewTopicUnit(Number(e.target.value))}
              className="bg-prevu-surface border border-prevu-surface-light text-xs text-white p-2.5 rounded-xl shrink-0"
            >
              <option value={1}>Unit 1</option>
              <option value={2}>Unit 2</option>
              <option value={3}>Unit 3</option>
              <option value={4}>Unit 4</option>
            </select>

            <input
              type="text"
              placeholder="Drop a hint your professor or senior gave for this exam..."
              value={newTopicText}
              onChange={e => setNewTopicText(e.target.value)}
              className="flex-1 bg-prevu-surface border border-prevu-surface-light text-xs text-white p-2.5 rounded-xl placeholder:text-prevu-text-muted focus:border-indigo-500 outline-none w-full"
            />

            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 w-full sm:w-auto">
              <Send className="w-3.5 h-3.5 mr-1.5" /> Post Hint
            </Button>
          </form>
        </div>
      )}

      {/* TAB 2: CU Marking Scheme Secrets */}
      {activeTab === 'tips' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-2">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" /> Section A (Short Questions)
            </h4>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              Never write long paragraphs for 2-mark questions. Evaluators scan for exact 2-3 technical keywords, formulas, and SI units. Write in 2 bullet points max to save time for Section C.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-2">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Section B & C (Long Numericals)
            </h4>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              Step marking is mandatory! Even if your final calculated number is slightly off, you get 80% marks if:
              1. Given data is written first
              2. Governing formula is boxed
              3. Block diagram is drawn neatly with pencil
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-2">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-400" /> Presentation & Time Hack
            </h4>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              Start with the question you know best (usually Section B or C). Underline key terms with black pen or pencil. Leave 2 blank lines between questions.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: Exam Morning Checklist */}
      {activeTab === 'checklist' && (
        <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light space-y-3">
          <h4 className="text-sm font-bold text-white mb-2">Chandigarh University Exam Hall Checklist:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-prevu-text-muted">
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-prevu-bg/60 border border-prevu-surface-light">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Original CU Physical Student ID Card (Mandatory for entry)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-prevu-bg/60 border border-prevu-surface-light">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Admit Card / CUIMS Hall Ticket with legible barcode</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-prevu-bg/60 border border-prevu-surface-light">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Scientific Calculator (FX-991MS / EX if allowed for your subject)</span>
            </div>
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-prevu-bg/60 border border-prevu-surface-light">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>2 Blue / Black ballpoint pens + pencil & ruler for diagrams</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
