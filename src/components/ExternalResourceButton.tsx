'use client'

import React from 'react'
import { FolderOpen, Play, ExternalLink } from 'lucide-react'
import { trackStudentResourceView } from '@/lib/activity/activityTracker'

interface ExternalResourceButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resource: any
  type: 'gdrive' | 'youtube'
  url: string
}

export default function ExternalResourceButton({
  resource,
  type,
  url
}: ExternalResourceButtonProps) {
  const handleClick = () => {
    trackStudentResourceView(resource)
  }

  if (type === 'gdrive') {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
      >
        <FolderOpen className="w-3.5 h-3.5" />
        <span>Open in Google Drive</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    )
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20 transition-all cursor-pointer"
    >
      <Play className="w-3.5 h-3.5" />
      <span>Watch on YouTube</span>
      <ExternalLink className="w-3 h-3" />
    </a>
  )
}
