'use client'

import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { motion } from 'framer-motion'
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
    <motion.button
      whileTap={{ scale: 0.82 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      onClick={handleToggle}
      disabled={isLoading}
      title={isBookmarked ? 'Remove bookmark' : 'Save paper'}
      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
        isBookmarked 
          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm' 
          : 'bg-prevu-bg/90 text-prevu-text-muted hover:text-amber-400 hover:border-amber-500/30 border-prevu-surface-light'
      }`}
    >
      <motion.div
        animate={isBookmarked ? { scale: [1, 1.28, 1] } : { scale: 1 }}
        transition={{ duration: 0.25 }}
      >
        <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-400 text-amber-400' : ''}`} />
      </motion.div>
    </motion.button>
  )
}

