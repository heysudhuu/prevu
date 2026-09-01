'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { toggleBookmark } from '@/app/dashboard/actions'

export default function BookmarkButton({ 
  resourceId, 
  initialBookmarked = false 
}: { 
  resourceId: string
  initialBookmarked?: boolean 
}) {
  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isLoading) return

    setIsLoading(true)
    const nextState = !isBookmarked
    setIsBookmarked(nextState)

    const res = await toggleBookmark(resourceId)
    setIsLoading(false)

    if (res.error) {
      // Revert if failed
      setIsBookmarked(!nextState)
    } else if (res.success && res.bookmarked !== undefined) {
      setIsBookmarked(res.bookmarked)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={isBookmarked ? 'Remove bookmark' : 'Save paper'}
      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
        isBookmarked 
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
          : 'bg-prevu-bg/90 text-prevu-text-muted hover:text-amber-400 hover:border-amber-500/30 border-prevu-surface-light'
      }`}
    >
      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
    </button>
  )
}
