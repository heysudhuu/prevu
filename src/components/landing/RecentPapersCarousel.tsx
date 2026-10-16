'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { FileText, Clock, ChevronLeft, ChevronRight, Eye, Sparkles } from 'lucide-react'

interface PaperItem {
  id: string
  original_filename?: string
  exam_year: number
  created_at: string
  resource_category: string
  subjects?: {
    name?: string
    code?: string
  }
  exam_types?: {
    name?: string
  }
}

interface RecentPapersCarouselProps {
  papers: PaperItem[]
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function RecentPapersCarousel({ papers }: RecentPapersCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const offset = direction === 'left' ? -280 : 280
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  if (!papers || papers.length === 0) return null

  return (
    <div className="relative group">
      {/* Scroll Left Button */}
      <button
        onClick={() => handleScroll('left')}
        aria-label="Scroll Left"
        className="hidden sm:flex absolute -left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-prevu-surface-elevated/90 hover:bg-prevu-accent border border-prevu-surface-light text-white shadow-xl items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Horizontal scroll container */}
      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide px-1 scroll-smooth"
      >
        {papers.map((paper) => {
          const isNotes = paper.resource_category === 'study_material'
          const examName = paper.exam_types?.name || 'Paper'

          return (
            <Link
              key={paper.id}
              href={`/paper/${paper.id}`}
              className="flex-shrink-0 w-60 sm:w-64 flex flex-col justify-between p-4 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-accent/50 hover:bg-prevu-surface-elevated/60 shadow-lg hover:shadow-xl transition-all duration-200 group/card"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                    isNotes 
                      ? 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30' 
                      : 'text-purple-300 bg-purple-500/15 border-purple-500/30'
                  }`}>
                    <FileText className="w-3 h-3" />
                    <span>{isNotes ? 'Notes' : 'PYQ'}</span>
                  </span>

                  <span className="text-[11px] font-mono text-prevu-accent font-semibold">
                    {paper.exam_year}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white group-hover/card:text-prevu-accent transition-colors line-clamp-2 leading-snug">
                  {paper.subjects?.name || paper.original_filename || 'Question Paper'}
                </h4>

                {paper.subjects?.code && (
                  <p className="text-[11px] font-mono text-prevu-text-muted mt-1">
                    {paper.subjects.code}
                  </p>
                )}
              </div>

              <div className="mt-4 pt-2.5 border-t border-prevu-surface-light/60 flex items-center justify-between text-[11px] text-prevu-text-muted">
                <span className="font-mono">{examName}</span>
                <span className="flex items-center gap-1 text-[10px]">
                  <Clock className="w-2.5 h-2.5" />
                  {timeAgo(paper.created_at)}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Scroll Right Button */}
      <button
        onClick={() => handleScroll('right')}
        aria-label="Scroll Right"
        className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-prevu-surface-elevated/90 hover:bg-prevu-accent border border-prevu-surface-light text-white shadow-xl items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
