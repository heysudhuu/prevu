'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ThumbsUp, ThumbsDown, Send, CheckCircle2, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitPlatformFeedback } from '@/lib/feedback/actions'

interface PostCbtFeedbackCardProps {
  subjectCode: string
  subjectName: string
}

const POSITIVE_TAGS = ['Accurate MCQs', 'Great Timer Pace', 'Helpful Explanations', 'Exam-Ready']
const IMPROVE_TAGS = ['Need More Questions', 'Wrong Answer Key', 'UI / Lag Issue', 'Too Hard / Easy']
const RATING_LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Loved It! 🔥']

export default function PostCbtFeedbackCard({ subjectCode, subjectName }: PostCbtFeedbackCardProps) {
  const [rating, setRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [liked, setLiked] = useState<boolean | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [suggestion, setSuggestion] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const activeRating = hoverRating || rating
  const activeTagsList = rating > 0 && rating <= 3 ? IMPROVE_TAGS : POSITIVE_TAGS

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleStarClick = (star: number) => {
    setRating(star)
    setLiked(star >= 4)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || isSubmitting) return

    setIsSubmitting(true)
    const res = await submitPlatformFeedback({
      contextType: 'cbt_exam',
      targetId: subjectCode,
      targetTitle: `${subjectCode} — ${subjectName}`,
      rating,
      liked: liked ?? rating >= 4,
      tags: selectedTags,
      suggestion
    })
    setIsSubmitting(false)

    if (res.success) {
      setSubmitted(true)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl bg-prevu-surface/85 border border-prevu-surface-light p-5 sm:p-6 shadow-xl backdrop-blur-xl relative overflow-hidden"
    >
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="feedback-done"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-3 py-1 text-center sm:text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Thanks for rating Prevu CBT Arena!</h4>
                <p className="text-xs text-prevu-text-muted">
                  Your {rating}★ feedback has been saved and helps us make Prevu better for every student.
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shrink-0">
              Recorded ✓
            </span>
          </motion.div>
        ) : (
          <motion.form key="feedback-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  <Sparkles className="w-3 h-3" />
                  <span>Quick 5-Second Feedback</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  How was this CBT Mock Test? Did you like it?
                </h3>
              </div>

              {/* Interactive Stars + Thumbs */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-prevu-bg/85 border border-prevu-surface-light px-3 py-1.5 rounded-2xl">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleStarClick(star)}
                      aria-label={`Rate ${star} stars`}
                      className="p-0.5 cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= activeRating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-prevu-text-muted/40'
                        }`}
                      />
                    </motion.button>
                  ))}
                  {activeRating > 0 && (
                    <span className="ml-2 text-[11px] font-mono font-bold text-amber-300">
                      {RATING_LABELS[activeRating]}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLiked(true)
                      if (rating === 0) setRating(5)
                    }}
                    className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                      liked === true
                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                        : 'bg-prevu-bg/80 border-prevu-surface-light text-prevu-text-muted hover:text-white'
                    }`}
                    title="Liked it"
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLiked(false)
                      if (rating === 0 || rating >= 4) setRating(2)
                    }}
                    className={`p-2 rounded-xl border text-xs transition-all cursor-pointer ${
                      liked === false
                        ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                        : 'bg-prevu-bg/80 border-prevu-surface-light text-prevu-text-muted hover:text-white'
                    }`}
                    title="Needs improvement"
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Expand Quick Tags & Optional Suggestion once star is chosen */}
            <AnimatePresence>
              {rating > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 pt-2 border-t border-prevu-surface-light/60 overflow-hidden"
                >
                  <div className="flex flex-wrap gap-1.5">
                    {activeTagsList.map(tag => {
                      const isPicked = selectedTags.includes(tag)
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                            isPicked
                              ? 'bg-prevu-accent/25 border-prevu-accent text-white'
                              : 'bg-prevu-bg/80 border-prevu-surface-light text-prevu-text-muted hover:text-white'
                          }`}
                        >
                          {isPicked ? '✓ ' : '+ '}
                          {tag}
                        </button>
                      )
                    })}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={suggestion}
                      onChange={(e) => setSuggestion(e.target.value)}
                      placeholder="Optional: Any suggestion to improve Prevu or this test?"
                      className="flex-1 px-3.5 py-2 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light text-xs text-white placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-prevu-accent"
                    />
                    <Button
                      type="submit"
                      size="sm"
                      disabled={isSubmitting}
                      className="h-9 px-5 text-xs font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white rounded-xl shrink-0 cursor-pointer flex items-center gap-1.5"
                    >
                      {isSubmitting ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Submit Feedback</span>
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
