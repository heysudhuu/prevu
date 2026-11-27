'use client'

import { useSyncExternalStore } from 'react'
import { motion } from 'framer-motion'
import { 
  History, 
  ExternalLink, 
  FileText, 
  FolderOpen, 
  Play, 
  BookOpen, 
  Zap, 
  Clock,
  ArrowRight
} from 'lucide-react'
import Link from 'next/link'
import { 
  subscribeToStudentActivity, 
  getStudentActivitySnapshot, 
  getServerStudentActivitySnapshot, 
  clearStudentActivityStream,
  StudentActivityItem
} from '@/lib/activity/activityTracker'

function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return 'Recently'
  const diffMs = Date.now() - timestamp
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays}d ago`
}

export default function RecentlyViewedBar() {
  const activities = useSyncExternalStore(
    subscribeToStudentActivity, 
    getStudentActivitySnapshot, 
    getServerStudentActivitySnapshot
  )

  if (!activities || activities.length === 0) return null

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-prevu-text-muted">
          <History className="w-3.5 h-3.5 text-prevu-accent" />
          <span>Recently Studied & Practiced</span>
        </div>
        <button 
          onClick={clearStudentActivityStream}
          className="text-[11px] text-prevu-text-muted hover:text-red-400 transition-colors cursor-pointer"
        >
          Clear History
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-2 scrollbar-thin lg:grid lg:grid-cols-4 lg:overflow-visible lg:snap-none lg:pb-0">
        {activities.slice(0, 4).map((item: StudentActivityItem, idx: number) => {
          const isDrive = item.format === 'gdrive'
          const isYouTube = item.format === 'youtube'
          const isCbt = item.format === 'cbt'
          const isNotes = item.format === 'notes'

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05, type: 'spring', stiffness: 320, damping: 24 }}
              whileHover={{ y: -3, transition: { type: 'spring', stiffness: 420, damping: 22 } }}
              className="p-3.5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light hover:border-prevu-accent/50 backdrop-blur-xl transition-colors flex flex-col justify-between shadow-lg hover:shadow-xl group relative overflow-hidden snap-start shrink-0 w-[280px] lg:w-auto lg:shrink"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  {/* Format Badge */}
                  {isCbt ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Zap className="w-3 h-3 text-amber-400" /> CBT Test
                    </span>
                  ) : isDrive ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <FolderOpen className="w-3 h-3 text-emerald-400" /> Drive
                    </span>
                  ) : isYouTube ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                      <Play className="w-3 h-3 text-red-400" /> YouTube
                    </span>
                  ) : isNotes ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      <BookOpen className="w-3 h-3 text-purple-400" /> Notes
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/25">
                      <FileText className="w-3 h-3" /> {item.examType || 'PYQ'}
                    </span>
                  )}

                  <span className="text-[10px] font-mono text-prevu-text-muted flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{formatRelativeTime(item.timestamp)}</span>
                  </span>
                </div>
                
                <h4 className="font-semibold text-xs text-white group-hover:text-cyan-300 transition-colors line-clamp-1" title={item.title}>
                  {item.title}
                </h4>

                <div className="flex items-center gap-2 mt-1 text-[11px] text-prevu-text-muted">
                  {item.subjectCode && (
                    <span className="font-mono text-cyan-400 font-semibold">{item.subjectCode}</span>
                  )}
                  {item.score !== undefined && item.totalQuestions !== undefined && (
                    <span className="font-mono text-emerald-400 font-bold">
                      {item.score}/{item.totalQuestions} ({item.percentage}%)
                    </span>
                  )}
                  {item.channelName && (
                    <span className="truncate max-w-[120px] text-zinc-400">by {item.channelName}</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-3 mt-2 border-t border-prevu-surface-light/40 flex items-center justify-between">
                {isCbt ? (
                  <Link
                    href={`/cbt?subject=${encodeURIComponent(item.subjectCode || 'ACP-101')}`}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 text-[11px] font-bold flex items-center justify-between border border-amber-500/30 transition-all"
                  >
                    <span>Retake Mock Exam</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : isDrive && item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-[11px] font-bold flex items-center justify-between border border-emerald-500/30 transition-all"
                  >
                    <span>Open in Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : isYouTube && item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 text-[11px] font-bold flex items-center justify-between border border-red-500/30 transition-all"
                  >
                    <span>Watch Lecture</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <Link
                    href={`/paper/${item.id}`}
                    className="w-full py-1.5 px-2.5 rounded-xl bg-prevu-bg/90 hover:bg-prevu-surface-light text-cyan-300 text-[11px] font-bold flex items-center justify-between border border-prevu-surface-light transition-all"
                  >
                    <span>Open Document</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
