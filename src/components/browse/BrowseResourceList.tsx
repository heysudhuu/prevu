'use client'

import { useState, useEffect } from 'react'
import { LayoutGrid, List, Sparkles } from 'lucide-react'
import { ResourceCard } from '@/components/ResourceCard'
import ResourceTableView from './ResourceTableView'

interface BrowseResourceListProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any[]
  bookmarkIds: string[]
  userUpvotedIds: string[]
  upvoteCounts: Record<string, number>
}

export default function BrowseResourceList({
  resources,
  bookmarkIds,
  userUpvotedIds,
  upvoteCounts,
}: BrowseResourceListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('prevu_browse_view_mode')
      if (stored === 'table' || stored === 'grid') {
        setViewMode(stored)
      }
    } catch {
      // ignore
    }
  }, [])

  const handleToggleView = (mode: 'grid' | 'table') => {
    setViewMode(mode)
    try {
      localStorage.setItem('prevu_browse_view_mode', mode)
    } catch {
      // ignore
    }
  }

  if (resources.length === 0) {
    return (
      <div className="py-16 text-center rounded-2xl border border-prevu-surface-light bg-prevu-surface/40 p-8">
        <Sparkles className="w-10 h-10 text-prevu-accent mx-auto mb-3 opacity-60" />
        <h3 className="text-lg font-bold text-white mb-1">No study materials found</h3>
        <p className="text-xs text-prevu-text-muted max-w-sm mx-auto">
          Try clearing your filters or search keywords, or contribute the first paper for this subject!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Controls Bar: Count + Grid/Table Toggle */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-mono text-prevu-text-muted">
          Found <strong className="text-white">{resources.length}</strong> items
        </span>

        {/* View Switcher Toggle */}
        <div className="flex items-center p-0.5 rounded-xl bg-prevu-surface border border-prevu-surface-light">
          <button
            onClick={() => handleToggleView('grid')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'grid'
                ? 'bg-prevu-accent text-white shadow-sm'
                : 'text-prevu-text-muted hover:text-white'
            }`}
            title="Card Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-semibold">Grid</span>
          </button>
          <button
            onClick={() => handleToggleView('table')}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === 'table'
                ? 'bg-prevu-accent text-white shadow-sm'
                : 'text-prevu-text-muted hover:text-white'
            }`}
            title="Compact Table View"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-semibold">Table</span>
          </button>
        </div>
      </div>

      {/* Render selected view */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-fade-in">
          {resources.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isBookmarked={bookmarkIds.includes(resource.id)}
              initialUpvoted={userUpvotedIds.includes(resource.id)}
              upvoteCount={upvoteCounts[resource.id] || 0}
            />
          ))}
        </div>
      ) : (
        <div className="animate-fade-in">
          <ResourceTableView
            resources={resources}
            bookmarkIds={bookmarkIds}
            userUpvotedIds={userUpvotedIds}
            upvoteCounts={upvoteCounts}
          />
        </div>
      )}
    </div>
  )
}
