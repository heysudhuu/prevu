'use client'

import React, { useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import { toggleResourceUpvote } from '@/app/dashboard/actions'

interface ResourceUpvoteButtonProps {
  resourceId: string
  initialUpvoted?: boolean
  initialCount?: number
  className?: string
  showCount?: boolean
}

export default function ResourceUpvoteButton({
  resourceId,
  initialUpvoted = false,
  initialCount = 0,
  className = '',
  showCount = true
}: ResourceUpvoteButtonProps) {
  // Sync with localStorage for guest/instant offline persistence
  const [upvoted, setUpvoted] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(`prevu_upvoted_${resourceId}`)
        if (stored !== null) return stored === 'true'
      } catch {
        // Ignore
      }
    }
    return initialUpvoted
  })

  const [count, setCount] = useState<number>(initialCount)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isUpdating) return

    const newUpvoted = !upvoted
    const delta = newUpvoted ? 1 : -1
    
    // Optimistic UI update
    setUpvoted(newUpvoted)
    setCount(prev => Math.max(0, prev + delta))

    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`prevu_upvoted_${resourceId}`, String(newUpvoted))
      }
    } catch {
      // Ignore
    }

    setIsUpdating(true)
    try {
      await toggleResourceUpvote(resourceId)
    } catch (err) {
      console.warn('Upvote sync notice:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
        upvoted
          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
          : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/60 border border-prevu-surface-light'
      } ${className}`}
      title={upvoted ? 'Remove Helpful Upvote' : 'Mark as Helpful / Upvote'}
    >
      <ThumbsUp className={`w-3.5 h-3.5 transition-transform ${upvoted ? 'fill-current scale-110' : ''}`} />
      {showCount && <span className="font-mono text-[11px]">{count > 0 ? count : ''}</span>}
    </button>
  )
}
