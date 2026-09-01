'use client'

import { useSyncExternalStore } from 'react'
import { Button } from '@/components/ui/Button'
import { History, ExternalLink, Download } from 'lucide-react'

interface RecentPaper {
  id: string
  subjectName: string
  subjectCode?: string
  examType: string
  examYear: number
  viewedAt: number
}

const EMPTY_RECENTS: RecentPaper[] = []
let lastRawRecents: string | null = null
let cachedRecents: RecentPaper[] = EMPTY_RECENTS

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback)
  window.addEventListener('prevu-recents-updated', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('prevu-recents-updated', callback)
  }
}

function getSnapshot(): RecentPaper[] {
  if (typeof window === 'undefined') return EMPTY_RECENTS
  try {
    const raw = localStorage.getItem('prevu_recent_papers')
    if (raw === lastRawRecents) {
      return cachedRecents
    }
    lastRawRecents = raw
    if (raw) {
      const parsed = JSON.parse(raw)
      cachedRecents = Array.isArray(parsed) ? parsed : EMPTY_RECENTS
    } else {
      cachedRecents = EMPTY_RECENTS
    }
    return cachedRecents
  } catch {
    return EMPTY_RECENTS
  }
}

function getServerSnapshot(): RecentPaper[] {
  return EMPTY_RECENTS
}

export default function RecentlyViewedBar() {
  const recentPapers = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (recentPapers.length === 0) return null

  const handleClearHistory = () => {
    try {
      localStorage.removeItem('prevu_recent_papers')
      lastRawRecents = null
      cachedRecents = EMPTY_RECENTS
      window.dispatchEvent(new Event('prevu-recents-updated'))
    } catch {
      // Ignore storage errors
    }
  }

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-prevu-text-muted">
          <History className="w-3.5 h-3.5 text-prevu-accent" />
          <span>Recently Viewed Papers</span>
        </div>
        <button 
          onClick={handleClearHistory}
          className="text-[11px] text-prevu-text-muted hover:text-red-400 transition-colors cursor-pointer"
        >
          Clear History
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {recentPapers.slice(0, 4).map((paper) => (
          <div 
            key={paper.id}
            className="p-3.5 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-accent/40 transition-all flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/25">
                  {paper.examType}
                </span>
                <span className="text-[10px] font-mono text-prevu-text-muted">
                  {paper.examYear}
                </span>
              </div>
              
              <h4 className="font-semibold text-xs text-white truncate" title={paper.subjectName}>
                {paper.subjectName}
              </h4>
              {paper.subjectCode && (
                <span className="text-[10px] font-mono text-prevu-text-muted">
                  {paper.subjectCode}
                </span>
              )}
            </div>

            <div className="mt-3 pt-2.5 border-t border-prevu-surface-light/60 flex gap-2">
              <Button size="sm" variant="secondary" className="flex-1 h-7 text-[11px] font-medium" asChild>
                <a href={`/api/preview/${paper.id}`} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-3 h-3 mr-1 text-prevu-accent" /> View
                </a>
              </Button>
              <Button size="sm" variant="outline" className="h-7 px-2 text-[11px] border-prevu-surface-light" asChild>
                <a href={`/api/download/${paper.id}`}>
                  <Download className="w-3 h-3 text-prevu-text-muted" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
