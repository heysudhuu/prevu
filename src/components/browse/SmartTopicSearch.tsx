'use client'

import { useState } from 'react'
import { Sparkles, Tag, TrendingUp, Search, ChevronRight } from 'lucide-react'
import { POPULAR_CU_TOPICS, TopicTag } from '@/lib/search/topicSearch'
import ExamPatternPredictorModal from '@/components/ai/ExamPatternPredictorModal'
import { useRouter } from 'next/navigation'

interface SmartTopicSearchProps {
  onSelectTopic?: (topic: TopicTag) => void
  className?: string
}

export default function SmartTopicSearch({
  onSelectTopic,
  className = ''
}: SmartTopicSearchProps) {
  const router = useRouter()
  const [isPredictorOpen, setIsPredictorOpen] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)

  const handleChipClick = (topic: TopicTag) => {
    setSelectedTopic(topic.id)
    if (onSelectTopic) {
      onSelectTopic(topic)
    } else {
      router.push(`/browse?sem=${topic.semester}&search=${encodeURIComponent(topic.name)}`)
    }
  }

  return (
    <div className={`p-4 rounded-3xl bg-prevu-surface/60 border border-prevu-surface-light shadow-lg space-y-3 ${className}`}>
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Tag className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Auto-Tagged High-Yield Topics</span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/15 px-1.5 py-0.2 rounded border border-cyan-500/20">
                AI Tagged
              </span>
            </h4>
            <div className="text-[10px] text-prevu-text-muted">
              Click any syllabus topic to filter past papers and recurring exam questions
            </div>
          </div>
        </div>

        {/* AI Exam Predictor Modal Trigger Button */}
        <button
          onClick={() => setIsPredictorOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-fuchsia-600/20 to-purple-600/20 border border-fuchsia-500/40 text-fuchsia-300 hover:text-white hover:border-fuchsia-400 text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Launch AI Exam Predictor</span>
          <ChevronRight className="w-3 h-3 ml-0.5" />
        </button>
      </div>

      {/* Topic Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {POPULAR_CU_TOPICS.map((topic) => {
          const isSelected = selectedTopic === topic.id

          return (
            <button
              key={topic.id}
              onClick={() => handleChipClick(topic)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border shrink-0 ${
                isSelected
                  ? 'bg-cyan-600 text-white border-cyan-400 shadow-md shadow-cyan-600/20 scale-[1.02]'
                  : 'bg-prevu-bg/70 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-cyan-500/40'
              }`}
              title={`Sem ${topic.semester} • ${topic.subjectName} (${topic.unit})`}
            >
              <span className="text-cyan-400 text-[10px] font-mono font-bold">Sem {topic.semester}</span>
              <span>{topic.name}</span>
            </button>
          )
        })}
      </div>

      {/* AI Exam Pattern Predictor Modal */}
      <ExamPatternPredictorModal
        isOpen={isPredictorOpen}
        onClose={() => setIsPredictorOpen(false)}
      />

    </div>
  )
}
