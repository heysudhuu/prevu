'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Brain, X, Check, HelpCircle, Lightbulb, BookOpen, Send, Loader2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { solvePaperQuestion, generateExamAssistantInsights, QuestionSolutionResult, ExamInsightsResult } from '@/app/api/ai/actions'

interface AIPaperSolverModalProps {
  isOpen: boolean
  onClose: () => void
  subjectName: string
  subjectCode: string
  examType: string
  examYear: number
  resourceId: string
}

export default function AIPaperSolverModal({
  isOpen,
  onClose,
  subjectName,
  subjectCode,
  examType,
  examYear,
  resourceId
}: AIPaperSolverModalProps) {
  const [activeTab, setActiveTab] = useState<'solver' | 'blueprint'>('solver')
  const [questionInput, setQuestionInput] = useState('')
  const [isSolving, setIsSolving] = useState(false)
  const [solution, setSolution] = useState<QuestionSolutionResult['solution'] | null>(null)
  const [solutionError, setSolutionError] = useState<string | null>(null)

  // Insights state
  const [insights, setInsights] = useState<ExamInsightsResult['insights'] | null>(null)
  const [isLoadingInsights, setIsLoadingInsights] = useState(false)

  useEffect(() => {
    if (isOpen && !insights && !isLoadingInsights) {
      setIsLoadingInsights(true)
      generateExamAssistantInsights(resourceId)
        .then(res => {
          if (res.success && res.insights) setInsights(res.insights)
        })
        .finally(() => setIsLoadingInsights(false))
    }
  }, [isOpen, resourceId, insights, isLoadingInsights])

  const handleSolve = async (textToSolve?: string) => {
    const q = textToSolve || questionInput
    if (!q.trim()) return

    setIsSolving(true)
    setSolutionError(null)
    try {
      const res = await solvePaperQuestion(subjectName, examType, q.trim())
      if (res.success && res.solution) {
        setSolution(res.solution)
      } else {
        setSolutionError(res.error || 'Failed to solve question.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error generating solution.'
      setSolutionError(msg)
    } finally {
      setIsSolving(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-prevu-surface border border-prevu-accent/40 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-prevu-surface-light bg-prevu-bg/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-prevu-accent flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">AI Exam Cracker & Paper Solver</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 font-bold border border-purple-500/30">
                  CU Format
                </span>
              </div>
              <p className="text-xs text-prevu-text-muted">
                {subjectName} ({subjectCode}) • {examType} {examYear}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 px-5 pt-3 border-b border-prevu-surface-light/60 bg-prevu-surface">
          <button
            onClick={() => setActiveTab('solver')}
            className={`pb-2.5 text-xs font-bold transition-all relative ${
              activeTab === 'solver'
                ? 'text-prevu-accent border-b-2 border-prevu-accent'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            ⚡ Solve Any Question
          </button>

          <button
            onClick={() => setActiveTab('blueprint')}
            className={`pb-2.5 text-xs font-bold transition-all relative ${
              activeTab === 'blueprint'
                ? 'text-prevu-accent border-b-2 border-prevu-accent'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            📋 Exam Blueprint & Cheat Sheet
          </button>
        </div>

        {/* Body Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {activeTab === 'solver' ? (
            <div className="space-y-4">
              
              {/* Question Input Bar */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-prevu-text-muted block">
                  Paste or type an exam question from this paper:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={questionInput}
                    onChange={e => setQuestionInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSolve()
                    }}
                    placeholder="e.g. Explain Dijkstra algorithm with time complexity and state transitions..."
                    className="flex-1 px-4 py-3 bg-prevu-bg border border-prevu-surface-light hover:border-prevu-accent/50 focus:border-prevu-accent rounded-xl text-xs sm:text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none transition-all shadow-inner"
                  />
                  <Button
                    onClick={() => handleSolve()}
                    disabled={isSolving || !questionInput.trim()}
                    className="bg-prevu-accent hover:bg-prevu-accent-hover text-white font-bold px-4 shrink-0 shadow-lg shadow-prevu-accent/25"
                  >
                    {isSolving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Quick Preset Prompts */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-prevu-text-muted font-medium">Quick Prompts:</span>
                {[
                  `Core principles of ${subjectName}`,
                  'Differentiate primary algorithms',
                  'Draw state transition / block diagram',
                  'Derive asymptotic complexity bounds'
                ].map((sample, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setQuestionInput(sample)
                      handleSolve(sample)
                    }}
                    className="text-[10px] px-2.5 py-1 rounded-lg bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-accent/40 transition-all font-mono"
                  >
                    + {sample}
                  </button>
                ))}
              </div>

              {solutionError && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-400">
                  {solutionError}
                </div>
              )}

              {/* Model Answer Result */}
              {solution && (
                <div className="p-4 sm:p-5 rounded-2xl bg-prevu-bg/90 border border-purple-500/30 shadow-xl space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-prevu-surface-light/60 pb-3">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-prevu-accent" />
                      CU Exam Model Solution
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {solution.marksWeightage}
                    </span>
                  </div>

                  {/* Marking Tip Box */}
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-300">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                    <div>
                      <strong className="block font-bold">Examiner Evaluation Insight:</strong>
                      <span>{solution.cuMarkingTip}</span>
                    </div>
                  </div>

                  {/* Key Scoring Points */}
                  {solution.keyPoints && solution.keyPoints.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] uppercase font-bold text-prevu-text-muted tracking-wider">
                        Key Points to include:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {solution.keyPoints.map((pt, idx) => (
                          <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-prevu-surface text-xs text-prevu-text">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span className="truncate">{pt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step by step answer */}
                  <div className="prose prose-invert max-w-none text-xs sm:text-sm text-prevu-text leading-relaxed whitespace-pre-wrap font-sans bg-prevu-surface/60 p-4 rounded-xl border border-prevu-surface-light">
                    {solution.stepByStepAnswer}
                  </div>

                  {/* Diagram / Code Block */}
                  {solution.diagramCodeSnippet && (
                    <div className="space-y-1.5">
                      <span className="text-[11px] uppercase font-bold text-prevu-text-muted tracking-wider">
                        Recommended Exam Diagram / Code:
                      </span>
                      <pre className="p-3 rounded-xl bg-[#09090d] border border-prevu-surface-light text-[11px] font-mono text-cyan-300 overflow-x-auto">
                        {solution.diagramCodeSnippet}
                      </pre>
                    </div>
                  )}
                </div>
              )}

            </div>
          ) : (
            /* Blueprint Tab */
            <div className="space-y-4">
              {isLoadingInsights ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-prevu-text-muted">
                  <Loader2 className="w-6 h-6 animate-spin text-prevu-accent" />
                  <span className="text-xs">Analyzing course syllabus & question patterns...</span>
                </div>
              ) : insights ? (
                <div className="space-y-4">
                  
                  {/* Strategy */}
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs sm:text-sm text-purple-200 leading-relaxed">
                    <strong className="block font-bold text-white mb-1">🎯 High-Score Strategy for {examType}:</strong>
                    {insights.scoringStrategy}
                  </div>

                  {/* Frequent Question Patterns */}
                  <div className="p-4 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-prevu-accent flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4" /> Frequently Tested Question Patterns
                    </h4>
                    <ul className="space-y-2 text-xs text-prevu-text-muted">
                      {insights.frequentQuestions.map((q, idx) => (
                        <li key={idx} className="flex items-start gap-2 p-2 rounded-xl bg-prevu-surface/60 border border-prevu-surface-light/40">
                          <span className="font-mono text-prevu-accent font-bold">#{idx + 1}</span>
                          <span className="text-prevu-text">{q}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Formula / Concepts Sheet */}
                  <div className="p-4 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" /> 5-Minute Exam Formulae & Core Theorems
                    </h4>
                    <ul className="space-y-1.5 text-xs text-prevu-text-muted">
                      {insights.formulaeSheet.map((f, idx) => (
                        <li key={idx} className="flex items-center gap-2 font-mono text-[11px] text-cyan-200 p-2 rounded-lg bg-cyan-950/20 border border-cyan-500/20">
                          <span>⚡</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              ) : (
                <div className="text-center py-8 text-xs text-prevu-text-muted">
                  No blueprint available for this paper.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 border-t border-prevu-surface-light bg-prevu-bg/60 flex items-center justify-between text-xs text-prevu-text-muted">
          <span>Engineered for Chandigarh University Exams</span>
          <Button size="sm" variant="ghost" onClick={onClose} className="h-8 text-xs">
            Close
          </Button>
        </div>

      </div>
    </div>
  )
}
