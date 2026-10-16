'use client'

import { useState, useMemo, useEffect } from 'react'
import { Sparkles, Tag, Search, X, Check, Flame, ChevronRight, Layers } from 'lucide-react'
import { POPULAR_CU_TOPICS, TopicTag, TopicCategory, searchTopics } from '@/lib/search/topicSearch'
import ExamPatternPredictorModal from '@/components/ai/ExamPatternPredictorModal'
import { useRouter, useSearchParams } from 'next/navigation'

interface SmartTopicSearchProps {
  onSelectTopic?: (topic: TopicTag) => void
  currentSem?: number
  currentSearch?: string
  className?: string
}

const CATEGORIES: { id: TopicCategory; label: string }[] = [
  { id: 'all', label: 'All Topics' },
  { id: 'core-cs', label: 'Core CS & Coding' },
  { id: 'math-stats', label: 'Math & Stats' },
  { id: 'systems', label: 'Systems & HW' },
  { id: 'foundations', label: 'Foundations' }
]

const SEMESTERS = [
  { value: 0, label: 'All Sems' },
  { value: 1, label: 'Sem 1' },
  { value: 2, label: 'Sem 2' },
  { value: 3, label: 'Sem 3' },
  { value: 5, label: 'Sem 5' },
  { value: 6, label: 'Sem 6' },
  { value: 7, label: 'Sem 7' }
]

export default function SmartTopicSearch({
  onSelectTopic,
  currentSem,
  currentSearch,
  className = ''
}: SmartTopicSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isPredictorOpen, setIsPredictorOpen] = useState(false)
  const [keywordQuery, setKeywordQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<TopicCategory>('all')

  // Resolve active semester from props or URL
  const urlSem = searchParams.get('sem') ? parseInt(searchParams.get('sem')!) : undefined
  const effectiveSem = currentSem ?? urlSem ?? 0
  const [activeSemFilter, setActiveSemFilter] = useState<number>(effectiveSem)

  useEffect(() => {
    if (currentSem !== undefined) {
      setActiveSemFilter(currentSem)
    } else if (urlSem !== undefined) {
      setActiveSemFilter(urlSem)
    }
  }, [currentSem, urlSem])

  // Resolve active search query from props or URL
  const activeSearch = (currentSearch ?? searchParams.get('search') ?? '').trim().toLowerCase()

  // Filter topics based on active semester tab, category, and local keyword search
  const filteredTopics = useMemo(() => {
    return searchTopics(
      keywordQuery,
      activeSemFilter > 0 ? activeSemFilter : undefined,
      selectedCategory
    )
  }, [keywordQuery, activeSemFilter, selectedCategory])

  // Identify currently matched topic
  const activeTopic = useMemo(() => {
    if (!activeSearch) return null
    return POPULAR_CU_TOPICS.find(t => 
      t.searchQuery.toLowerCase() === activeSearch ||
      t.name.toLowerCase() === activeSearch ||
      t.subjectName.toLowerCase() === activeSearch
    ) || null
  }, [activeSearch])

  const handleChipClick = (topic: TopicTag) => {
    if (onSelectTopic) {
      onSelectTopic(topic)
      return
    }

    // If already active, clicking toggles off the search filter
    if (activeTopic?.id === topic.id) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('search')
      router.push(`/browse?${params.toString()}`)
      return
    }

    const q = topic.searchQuery || topic.subjectName
    const params = new URLSearchParams()
    params.set('sem', String(topic.semester))
    params.set('search', q)
    router.push(`/browse?${params.toString()}`)
  }

  const handleClearActiveTopic = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`/browse?${params.toString()}`)
  }

  return (
    <div className={`p-4 sm:p-5 rounded-3xl bg-prevu-surface/70 border border-prevu-surface-light/80 shadow-2xl backdrop-blur-md space-y-4 ${className}`}>
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 shadow-inner">
            <Tag className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>High-Yield Topic Navigator</span>
              </h4>
              <span className="text-[10px] font-mono font-semibold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/25">
                AI Tagged
              </span>
            </div>
            <p className="text-xs text-prevu-text-muted mt-0.5">
              Instant one-click past papers for frequently tested exam units & questions
            </p>
          </div>
        </div>

        {/* AI Exam Predictor Modal Trigger Button */}
        <button
          type="button"
          onClick={() => setIsPredictorOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-600/30 via-fuchsia-600/30 to-purple-600/30 border border-fuchsia-500/40 text-fuchsia-200 hover:text-white hover:border-fuchsia-400 text-xs font-bold transition-all shadow-lg hover:shadow-fuchsia-500/15 cursor-pointer shrink-0 group"
        >
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400 group-hover:rotate-12 transition-transform" />
          <span>Launch AI Exam Predictor</span>
          <ChevronRight className="w-3 h-3 text-fuchsia-400/80 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Control Bar: Semester Filter & Categories */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-prevu-surface-light/40">
        
        {/* Semester Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-semibold text-prevu-text-muted uppercase tracking-wider mr-1 shrink-0 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Sem:
          </span>
          {SEMESTERS.map(s => {
            const isSelected = activeSemFilter === s.value
            return (
              <button
                key={s.value}
                type="button"
                onClick={() => setActiveSemFilter(s.value)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-prevu-accent text-white border-prevu-accent shadow-md shadow-prevu-accent/25'
                    : 'bg-prevu-bg/50 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-prevu-accent/40'
                }`}
              >
                {s.label}
              </button>
            )
          })}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-150 cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                    : 'bg-prevu-surface/40 border-prevu-surface-light/60 text-prevu-text-muted hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Inline Quick Search & Active Topic Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-prevu-text-muted" />
          <input
            type="text"
            value={keywordQuery}
            onChange={e => setKeywordQuery(e.target.value)}
            placeholder="Type keyword to filter topics (e.g. deadlock, k-map, matrix, dijkstra)..."
            className="w-full pl-9 pr-8 py-2 bg-prevu-bg/60 border border-prevu-surface-light hover:border-cyan-500/30 focus:border-cyan-500/60 rounded-xl text-xs text-white placeholder:text-prevu-text-muted/60 focus:outline-none transition-all shadow-inner"
          />
          {keywordQuery && (
            <button
              type="button"
              onClick={() => setKeywordQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Active Selected Topic Pill */}
        {activeTopic && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs shrink-0 animate-fade-in shadow-md">
            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate max-w-[200px]">
              Active: <strong>{activeTopic.name}</strong>
            </span>
            <button
              type="button"
              onClick={handleClearActiveTopic}
              className="ml-1 text-cyan-400 hover:text-white p-0.5 rounded hover:bg-cyan-500/20"
              title="Clear topic filter"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Topic Chips Container */}
      <div className="flex flex-wrap items-center gap-2 pt-1 max-h-[190px] overflow-y-auto scrollbar-thin pr-1">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => {
            const isSelected = activeTopic?.id === topic.id

            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => handleChipClick(topic)}
                className={`group px-3 py-1.5 rounded-2xl text-xs font-semibold transition-all duration-200 cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white border-cyan-400 shadow-lg shadow-cyan-600/30 scale-[1.02]'
                    : 'bg-prevu-surface/90 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-cyan-500/50 hover:bg-prevu-surface-light/40 shadow-sm'
                }`}
                title={`Sem ${topic.semester} • ${topic.subjectName} (${topic.unit})`}
              >
                {/* Semester Pill */}
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-md ${
                  isSelected 
                    ? 'bg-black/20 text-white' 
                    : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                }`}>
                  Sem {topic.semester}
                </span>

                {/* Topic Name */}
                <span className="font-medium tracking-tight">{topic.name}</span>

                {/* Frequent Badge */}
                {topic.frequentlyAsked && (
                  <span className={`flex items-center gap-0.5 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-amber-500/15 text-amber-300 border border-amber-500/25'
                  }`}>
                    <Flame className="w-2.5 h-2.5" />
                    <span>IMP</span>
                  </span>
                )}
              </button>
            )
          })
        ) : (
          <div className="w-full py-6 text-center space-y-1">
            <p className="text-xs text-prevu-text-muted">
              No high-yield topics matched your criteria.
            </p>
            <button
              type="button"
              onClick={() => {
                setKeywordQuery('')
                setActiveSemFilter(0)
                setSelectedCategory('all')
              }}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Reset filters to view all topics
            </button>
          </div>
        )}
      </div>

      {/* AI Exam Pattern Predictor Modal */}
      <ExamPatternPredictorModal
        isOpen={isPredictorOpen}
        onClose={() => setIsPredictorOpen(false)}
      />

    </div>
  )
}
