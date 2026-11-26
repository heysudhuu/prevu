'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, X, Send, CheckCircle2, FileCheck2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitPlatformFeedback } from '@/lib/feedback/actions'

interface DownloadDetail {
  resourceId: string
  title?: string
}

const SESSION_COOLDOWN_KEY = 'prevu_dl_feedback_handled'
const DL_TAGS = ['Clear & Readable', 'Exact Syllabus', 'Blurry / Missing Pages', 'Wrong Subject']

export function notifyResourceDownloaded(resourceId: string | number, title?: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(
    new CustomEvent('prevu:resource-downloaded', {
      detail: { resourceId: String(resourceId), title: title || 'PYQ / Study Material' }
    })
  )
}

export default function GlobalDownloadFeedbackToast() {
  const [target, setTarget] = useState<DownloadDetail | null>(null)
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [suggestion, setSuggestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null

    const handleDownloadEvent = (e: Event) => {
      try {
        if (sessionStorage.getItem(SESSION_COOLDOWN_KEY) === 'true') return
      } catch {
        // Ignore storage errors
      }

      const custom = e as CustomEvent<DownloadDetail>
      const detail = custom.detail
      if (!detail?.resourceId) return

      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        setRating(0)
        setHoverRating(0)
        setTags([])
        setSuggestion('')
        setSubmitted(false)
        setTarget(detail)
      }, 1200)
    }

    window.addEventListener('prevu:resource-downloaded', handleDownloadEvent)
    return () => {
      window.removeEventListener('prevu:resource-downloaded', handleDownloadEvent)
      if (timer) clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    try {
      sessionStorage.setItem(SESSION_COOLDOWN_KEY, 'true')
    } catch {
      // Ignore
    }
    setTarget(null)
  }

  const toggleTag = (tag: string) => {
    setTags(prev => (prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!target || rating === 0 || isSubmitting) return

    setIsSubmitting(true)
    const res = await submitPlatformFeedback({
      contextType: 'resource_download',
      targetId: target.resourceId,
      targetTitle: target.title || `Resource #${target.resourceId}`,
      rating,
      liked: rating >= 4,
      tags,
      suggestion
    })
    setIsSubmitting(false)

    if (res.success) {
      setSubmitted(true)
      try {
        sessionStorage.setItem(SESSION_COOLDOWN_KEY, 'true')
      } catch {
        // Ignore
      }
      setTimeout(() => {
        setTarget(null)
      }, 2200)
    }
  }

  const activeStar = hoverRating || rating

  return (
    <AnimatePresence>
      {target && (
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 360, damping: 28 }}
          className="fixed bottom-20 md:bottom-6 right-4 z-[90] w-[calc(100vw-2rem)] max-w-sm rounded-3xl bg-prevu-surface/95 border border-prevu-surface-light p-4 sm:p-5 shadow-2xl backdrop-blur-2xl"
        >
          {submitted ? (
            <div className="flex items-center gap-3 py-1">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Thank you for rating!</div>
                <div className="text-[11px] text-prevu-text-muted">Your feedback improves Prevu for all students.</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <FileCheck2 className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">
                      Download Complete • 5s Rating
                    </div>
                    <div className="text-xs font-bold text-white truncate">
                      {target.title || 'Was this material helpful?'}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="p-1 text-prevu-text-muted hover:text-white cursor-pointer"
                  aria-label="Close feedback prompt"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Stars Row */}
              <div className="flex items-center justify-between bg-prevu-bg/85 border border-prevu-surface-light px-3 py-2 rounded-2xl">
                <span className="text-[11px] text-prevu-text-muted">Rate quality:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-0.5 cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          star <= activeStar
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-prevu-text-muted/40'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {rating > 0 && (
                <div className="space-y-2.5">
                  <div className="flex flex-wrap gap-1">
                    {DL_TAGS.map(tag => {
                      const picked = tags.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-2 py-0.5 rounded-full text-[10px] border cursor-pointer transition-colors ${
                            picked
                              ? 'bg-prevu-accent/25 border-prevu-accent text-white'
                              : 'bg-prevu-bg border-prevu-surface-light text-prevu-text-muted hover:text-white'
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="Suggestion to improve Prevu?"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-[11px] text-white placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-prevu-accent"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="h-8 px-3 text-[11px] font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white rounded-xl shrink-0 cursor-pointer"
                    >
                      {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
              )}
            </form>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
