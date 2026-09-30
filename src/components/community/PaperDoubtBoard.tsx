'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, ThumbsUp, Send, CheckCircle2, ShieldCheck, Sparkles, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export interface DoubtAnswer {
  id: string
  author: string
  isSenior?: boolean
  text: string
  timestamp: string
  upvotes: number
}

export interface PaperDoubtItem {
  id: string
  paperId: string
  questionText: string
  author: string
  authorSemester?: number
  timestamp: string
  upvotes: number
  hasUpvoted?: boolean
  answers: DoubtAnswer[]
}

interface PaperDoubtBoardProps {
  paperId: string
  subjectName?: string
  examYear?: number
  className?: string
}

export default function PaperDoubtBoard({
  paperId,
  subjectName = 'Question Paper',
  examYear = 2025,
  className = ''
}: PaperDoubtBoardProps) {
  const [doubts, setDoubts] = useState<PaperDoubtItem[]>([])
  const [isAsking, setIsAsking] = useState(false)
  const [newQuestion, setNewQuestion] = useState('')
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const storageKey = `prevu_doubts_${paperId}`

  // Load doubts
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        setDoubts(JSON.parse(saved))
      } else {
        // High-quality subject-specific seed discussions
        const initialSeeds: PaperDoubtItem[] = [
          {
            id: `d-seed-1`,
            paperId,
            questionText: `In Question 2(b), what is the expected format for the numerical solution? Are steps awarded partial marks?`,
            author: `Rohan (Sem 4)`,
            authorSemester: 4,
            timestamp: `2 days ago`,
            upvotes: 6,
            hasUpvoted: false,
            answers: [
              {
                id: `a-seed-1`,
                author: `Priya S. (Senior Topper • Sem 6)`,
                isSenior: true,
                text: `Yes! CU faculty awards 3 marks for writing the correct formula and base assumptions even if your final numerical answer has a calculation error. Always write down the given variables first.`,
                timestamp: `1 day ago`,
                upvotes: 9
              }
            ]
          },
          {
            id: `d-seed-2`,
            paperId,
            questionText: `Is the derivation in Question 4 from Unit 2 or Unit 3? Checking against the 2024 revised CU syllabus.`,
            author: `Simran K. (Sem 4)`,
            authorSemester: 4,
            timestamp: `Yesterday`,
            upvotes: 3,
            hasUpvoted: false,
            answers: [
              {
                id: `a-seed-2`,
                author: `Faculty TA (Verified)`,
                isSenior: true,
                text: `It belongs to Unit 2 (Process Synchronization). It is a repeated MST-1 question for the last 3 years.`,
                timestamp: `18 hours ago`,
                upvotes: 5
              }
            ]
          }
        ]
        setDoubts(initialSeeds)
        localStorage.setItem(storageKey, JSON.stringify(initialSeeds))
      }
    } catch {
      // ignore
    }
  }, [paperId, storageKey])

  const saveDoubts = (updated: PaperDoubtItem[]) => {
    setDoubts(updated)
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated))
    } catch {
      // ignore
    }
  }

  const handlePostDoubt = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newQuestion.trim()) return

    const newDoubt: PaperDoubtItem = {
      id: `d-${Date.now()}`,
      paperId,
      questionText: newQuestion.trim(),
      author: 'You (CU Student)',
      authorSemester: 4,
      timestamp: 'Just now',
      upvotes: 1,
      hasUpvoted: true,
      answers: []
    }

    const updated = [newDoubt, ...doubts]
    saveDoubts(updated)
    setNewQuestion('')
    setIsAsking(false)
    setExpandedId(newDoubt.id)
  }

  const handleUpvoteDoubt = (doubtId: string) => {
    const updated = doubts.map(d => {
      if (d.id === doubtId) {
        const nextUpvoted = !d.hasUpvoted
        return {
          ...d,
          hasUpvoted: nextUpvoted,
          upvotes: nextUpvoted ? d.upvotes + 1 : Math.max(0, d.upvotes - 1)
        }
      }
      return d
    })
    saveDoubts(updated)
  }

  const handleAddAnswer = (doubtId: string) => {
    if (!replyText.trim()) return

    const newAns: DoubtAnswer = {
      id: `a-${Date.now()}`,
      author: 'You (Peer Contributor)',
      text: replyText.trim(),
      timestamp: 'Just now',
      upvotes: 1
    }

    const updated = doubts.map(d => {
      if (d.id === doubtId) {
        return {
          ...d,
          answers: [...d.answers, newAns]
        }
      }
      return d
    })

    saveDoubts(updated)
    setReplyText('')
    setActiveReplyId(null)
  }

  return (
    <div className={`p-5 sm:p-6 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light shadow-xl space-y-5 ${className}`}>
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-prevu-surface-light/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Collaborative Doubt & Solution Board</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                {doubts.length} Doubts
              </span>
            </div>
            <p className="text-xs text-prevu-text-muted mt-0.5">
              Discuss tricky questions, derivations, and exam marks distribution with peers and seniors.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={() => setIsAsking(!isAsking)}
          className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shrink-0 shadow-sm shadow-cyan-600/20"
        >
          <HelpCircle className="w-3.5 h-3.5 mr-1.5" />
          {isAsking ? 'Cancel' : 'Ask a Doubt'}
        </Button>
      </div>

      {/* Ask Question Form */}
      {isAsking && (
        <form onSubmit={handlePostDoubt} className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
          <label className="block text-xs font-bold text-cyan-200">
            What is your doubt or question about this paper?
          </label>
          <textarea
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="e.g. How is question 3(a) solved? What formula was used for calculating average turnaround time?"
            rows={3}
            className="w-full p-3 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-white placeholder-prevu-text-muted focus:outline-none focus:border-cyan-500"
          />
          <div className="flex justify-end gap-2">
            <Button size="sm" type="button" variant="ghost" onClick={() => setIsAsking(false)} className="text-xs">
              Dismiss
            </Button>
            <Button size="sm" type="submit" className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white">
              <Send className="w-3.5 h-3.5 mr-1" /> Post Doubt
            </Button>
          </div>
        </form>
      )}

      {/* List of Doubts */}
      <div className="space-y-3">
        {doubts.length === 0 ? (
          <div className="text-center py-8 text-prevu-text-muted text-xs">
            No doubts posted yet. Be the first to start the discussion for this paper!
          </div>
        ) : (
          doubts.map((doubt) => {
            const isExpanded = expandedId === doubt.id || doubt.answers.length > 0
            return (
              <div
                key={doubt.id}
                className="p-4 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light/80 space-y-3 transition-colors hover:border-prevu-surface-light"
              >
                {/* Doubt Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                      {doubt.questionText}
                    </p>
                    <div className="flex items-center gap-2 text-[11px] text-prevu-text-muted font-mono">
                      <span>{doubt.author}</span>
                      <span>•</span>
                      <span>{doubt.timestamp}</span>
                    </div>
                  </div>

                  {/* Upvote button */}
                  <button
                    onClick={() => handleUpvoteDoubt(doubt.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer ${
                      doubt.hasUpvoted
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'bg-prevu-surface text-prevu-text-muted hover:text-white border border-prevu-surface-light'
                    }`}
                  >
                    <ThumbsUp className={`w-3 h-3 ${doubt.hasUpvoted ? 'fill-current' : ''}`} />
                    <span>{doubt.upvotes}</span>
                  </button>
                </div>

                {/* Answers / Peer Replies */}
                {doubt.answers.length > 0 && (
                  <div className="pl-3 sm:pl-4 border-l-2 border-cyan-500/30 space-y-2.5 pt-1">
                    {doubt.answers.map((ans) => (
                      <div key={ans.id} className="p-3 rounded-xl bg-prevu-surface/80 border border-prevu-surface-light/60 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-white">{ans.author}</span>
                            {ans.isSenior && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                <ShieldCheck className="w-2.5 h-2.5" /> Verified
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-mono text-prevu-text-muted">{ans.timestamp}</span>
                        </div>
                        <p className="text-xs text-prevu-text-muted leading-relaxed">
                          {ans.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply action */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  {activeReplyId === doubt.id ? (
                    <div className="w-full space-y-2 mt-1">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write your explanation or step-by-step solution..."
                        className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => setActiveReplyId(null)} className="text-xs h-7">
                          Cancel
                        </Button>
                        <Button size="sm" onClick={() => handleAddAnswer(doubt.id)} className="text-xs h-7 font-bold bg-cyan-600 hover:bg-cyan-500 text-white">
                          Reply
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveReplyId(doubt.id)}
                      className="text-cyan-400 hover:text-cyan-300 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <MessageSquare className="w-3 h-3" />
                      <span>Reply with Solution or Tip</span>
                    </button>
                  )}
                </div>

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
