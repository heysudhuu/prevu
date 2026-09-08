'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

function emptySubscribe() {
  return () => {}
}
import { 
  X, 
  Download, 
  Maximize2, 
  Minimize2, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Trash2, 
  CheckCircle, 
  Loader2,
  BookOpen,
  Lightbulb,
  FileCode2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getPaperComments, addPaperComment, deletePaperComment, CommentItem } from '@/app/api/comments/actions'
import { generateExamAssistantInsights, ExamInsightsResult } from '@/app/api/ai/actions'

interface PDFViewerModalProps {
  isOpen: boolean
  onClose: () => void
  resource: {
    id: string
    exam_year: number
    subjects?: {
      name?: string
      code?: string
      semester?: number
    }
    exam_types?: {
      name?: string
    }
    users?: {
      name?: string
      username?: string
      cu_verified?: boolean
      role?: string
    }
  }
}

type ModalTab = 'viewer' | 'ai' | 'discussion'

export default function PDFViewerModal({ isOpen, onClose, resource }: PDFViewerModalProps) {
  const [activeTab, setActiveTab] = useState<ModalTab>('viewer')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoom, setZoom] = useState<number>(100)

  // AI Assistant State
  const [aiLoading, setAiLoading] = useState(false)
  const [aiInsights, setAiInsights] = useState<ExamInsightsResult['insights'] | null>(null)

  // Discussion Comments State
  const [comments, setComments] = useState<CommentItem[]>([])
  const [commentText, setCommentText] = useState('')
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [submittingComment, setSubmittingComment] = useState(false)
  const [commentError, setCommentError] = useState<string | null>(null)

  // Portal mount check for SSR using React 19 recommended useSyncExternalStore
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false)
        } else {
          onClose()
        }
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isFullscreen, onClose])

  const handleSelectTab = (tab: ModalTab) => {
    setActiveTab(tab)

    if (tab === 'discussion' && comments.length === 0 && !commentsLoading) {
      setCommentsLoading(true)
      getPaperComments(resource.id)
        .then(data => setComments(data))
        .finally(() => setCommentsLoading(false))
    }

    if (tab === 'ai' && !aiInsights && !aiLoading) {
      setAiLoading(true)
      generateExamAssistantInsights(resource.id)
        .then(res => {
          if (res.success && res.insights) {
            setAiInsights(res.insights)
          }
        })
        .finally(() => setAiLoading(false))
    }
  }

  if (!isOpen) return null

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setSubmittingComment(true)
    setCommentError(null)

    const res = await addPaperComment({
      resourceId: resource.id,
      comment: commentText.trim()
    })

    if (res.error) {
      setCommentError(res.error)
    } else if (res.comment) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setComments(prev => [...prev, res.comment as any])
      setCommentText('')
    }
    setSubmittingComment(false)
  }

  const handleDeleteComment = async (commentId: string) => {
    const res = await deletePaperComment(commentId)
    if (res.success) {
      setComments(prev => prev.filter(c => c.id !== commentId))
    }
  }

  if (!isOpen || !isClient) return null

  const examName = resource.exam_types?.name || 'MST'

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        className={`bg-prevu-surface border border-prevu-surface-light rounded-3xl flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen 
            ? 'w-full h-full rounded-none' 
            : 'w-full max-w-6xl h-[92vh]'
        }`}
      >
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-5 py-3.5 border-b border-prevu-surface-light bg-prevu-bg/90 gap-3 shrink-0">
          <div className="flex items-center gap-2.5 truncate">
            <Badge variant={examName === 'EST' ? 'est' : 'mst1'}>
              {examName}
            </Badge>

            <div className="truncate">
              <h2 className="text-sm sm:text-base font-bold text-white truncate flex items-center gap-2">
                <span>{resource.subjects?.name || 'Question Paper'}</span>
                <span className="text-xs font-mono font-normal text-prevu-accent bg-prevu-accent/10 px-2 py-0.5 rounded border border-prevu-accent/20">
                  {resource.subjects?.code}
                </span>
              </h2>
              <p className="text-[11px] text-prevu-text-muted">
                Year {resource.exam_year} • Sem {resource.subjects?.semester || 1}
              </p>
            </div>
          </div>

          {/* Tab Selection Navigation */}
          <div className="flex items-center bg-prevu-surface border border-prevu-surface-light rounded-xl p-0.5 shrink-0 self-stretch sm:self-auto justify-between">
            <button
              onClick={() => handleSelectTab('viewer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'viewer'
                  ? 'bg-prevu-accent text-white shadow-sm'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Paper View
            </button>

            <button
              onClick={() => handleSelectTab('ai')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ai'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> AI Blueprint
            </button>

            <button
              onClick={() => handleSelectTab('discussion')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'discussion'
                  ? 'bg-prevu-accent text-white shadow-sm'
                  : 'text-prevu-text-muted hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" /> Doubts ({comments.length})
            </button>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            {activeTab === 'viewer' && (
              <div className="hidden md:flex items-center bg-prevu-surface border border-prevu-surface-light rounded-xl px-1 py-0.5 text-xs mr-1">
                <button 
                  onClick={() => setZoom(prev => Math.max(75, prev - 15))}
                  className="px-2 py-1 text-prevu-text-muted hover:text-white font-mono"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="px-1 text-[11px] font-mono text-prevu-text-muted">{zoom}%</span>
                <button 
                  onClick={() => setZoom(prev => Math.min(150, prev + 15))}
                  className="px-2 py-1 text-prevu-text-muted hover:text-white font-mono"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2.5 text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white"
              asChild
            >
              <a href={`/api/download/${resource.id}`}>
                <Download className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white hidden sm:flex"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-8 px-2 text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white"
              asChild
              title="Open in new tab"
            >
              <a href={`/api/preview/${resource.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </Button>

            <button
              onClick={onClose}
              className="p-1.5 text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light rounded-xl transition-colors ml-1 cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-hidden relative bg-prevu-bg flex flex-col">
          
          {/* TAB 1: EMBEDDED IN-APP VIEWER */}
          {activeTab === 'viewer' && (
            <div className="w-full h-full flex flex-col items-center justify-center overflow-auto p-2 bg-[#0d0d12]">
              <iframe
                src={`/api/preview/${resource.id}#toolbar=0`}
                className="w-full h-full rounded-2xl border border-prevu-surface-light bg-prevu-surface shadow-2xl transition-all"
                style={{
                  transform: zoom !== 100 ? `scale(${zoom / 100})` : undefined,
                  transformOrigin: 'top center'
                }}
                title={resource.subjects?.name || 'Question Paper Preview'}
              />
            </div>
          )}

          {/* TAB 2: AI STUDY BLUEPRINT & FORMULAE */}
          {activeTab === 'ai' && (
            <div className="w-full h-full overflow-y-auto p-6 max-w-4xl mx-auto space-y-6 animate-fade-in">
              {aiLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4 text-center">
                  <Loader2 className="w-8 h-8 text-prevu-accent animate-spin" />
                  <p className="text-sm text-prevu-text-muted">
                    Analyzing syllabus and generating exam blueprint with AI...
                  </p>
                </div>
              ) : aiInsights ? (
                <div className="space-y-6">
                  {/* Strategy Highlight */}
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-prevu-surface to-indigo-950/30 border border-purple-500/40 shadow-xl">
                    <div className="flex items-center gap-2 mb-2 text-purple-300 font-bold text-sm">
                      <Lightbulb className="w-4 h-4 text-yellow-400" />
                      Evaluator Scoring Blueprint
                    </div>
                    <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
                      {aiInsights.scoringStrategy}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Key High-Yield Topics */}
                    <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-lg space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-prevu-surface-light pb-2.5">
                        <BookOpen className="w-4 h-4 text-cyan-400" /> High-Yield Syllabus Topics
                      </div>
                      <ul className="space-y-2 text-xs text-prevu-text-muted">
                        {aiInsights.keyTopics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Formula & Theorem Sheet */}
                    <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-lg space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-prevu-surface-light pb-2.5">
                        <FileCode2 className="w-4 h-4 text-emerald-400" /> Essential Formulas & Blueprints
                      </div>
                      <ul className="space-y-2 text-xs text-prevu-text-muted">
                        {aiInsights.formulaeSheet.map((formula, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                            <span className="font-mono text-emerald-200/90">{formula}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Frequently Repeated Questions */}
                  <div className="p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-lg space-y-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-white border-b border-prevu-surface-light pb-2.5">
                      <Sparkles className="w-4 h-4 text-yellow-400" /> Frequently Repeated Questions
                    </div>
                    <div className="space-y-2.5">
                      {aiInsights.frequentQuestions.map((q, i) => (
                        <div key={i} className="p-3 rounded-xl bg-prevu-bg/70 border border-prevu-surface-light/80 text-xs text-prevu-text flex items-start gap-2.5">
                          <span className="text-[11px] font-mono font-bold text-prevu-accent bg-prevu-accent/15 px-2 py-0.5 rounded">
                            Q{i + 1}
                          </span>
                          <span className="leading-relaxed">{q}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-prevu-text-muted text-xs">
                  Could not load AI study blueprint at this time.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: DISCUSSION & DOUBTS */}
          {activeTab === 'discussion' && (
            <div className="w-full h-full flex flex-col max-w-3xl mx-auto p-4 sm:p-6 overflow-hidden">
              <div className="mb-4 pb-3 border-b border-prevu-surface-light flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-prevu-accent" /> Student Doubt & Solution Thread
                  </h3>
                  <p className="text-xs text-prevu-text-muted mt-0.5">
                    Discuss tricky questions, verify marking schemes, or share solving steps.
                  </p>
                </div>
                <span className="text-xs font-mono text-prevu-text-muted">
                  {comments.length} posts
                </span>
              </div>

              {/* Comments Feed */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4">
                {commentsLoading ? (
                  <div className="flex items-center justify-center py-16 text-prevu-text-muted text-xs">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading discussion...
                  </div>
                ) : comments.length > 0 ? (
                  comments.map(c => (
                    <div 
                      key={c.id} 
                      className="p-3.5 rounded-2xl bg-prevu-surface border border-prevu-surface-light/80 space-y-2 animate-fade-in"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            @{c.user?.username || c.user?.name || 'student'}
                          </span>
                          {c.user?.cu_verified && (
                            <span className="text-emerald-400" title="CU Verified">
                              <CheckCircle className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {c.user?.role === 'admin' && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-prevu-text-muted text-[11px] font-mono">
                          <span>{new Date(c.created_at).toLocaleDateString()}</span>
                          <button
                            onClick={() => handleDeleteComment(c.id)}
                            className="text-prevu-text-muted/60 hover:text-red-400 p-1 cursor-pointer"
                            title="Delete comment"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-prevu-text leading-relaxed whitespace-pre-wrap">
                        {c.comment}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 text-prevu-text-muted text-xs space-y-2">
                    <p>No questions or solutions shared yet for this paper.</p>
                    <p className="text-[11px] text-prevu-text-muted/70">Be the first to post a hint or question!</p>
                  </div>
                )}
              </div>

              {/* Comment Input Box */}
              <form onSubmit={handleAddComment} className="pt-2 border-t border-prevu-surface-light shrink-0">
                {commentError && (
                  <p className="text-xs text-red-400 mb-2 font-medium">{commentError}</p>
                )}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Share a solution hint, ask a doubt, or flag a question..."
                    className="flex-1 px-4 py-2.5 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-prevu-accent"
                  />
                  <Button 
                    type="submit" 
                    size="sm" 
                    disabled={submittingComment || !commentText.trim()}
                    className="px-4 text-xs font-semibold rounded-xl bg-prevu-accent text-white"
                  >
                    {submittingComment ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                  </Button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>
    </div>,
    document.body
  )
}
