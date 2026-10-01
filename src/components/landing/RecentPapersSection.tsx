import { getSupabaseAdmin } from '@/utils/supabase/admin'
import Link from 'next/link'
import { FileText, Clock, ArrowRight, Sparkles } from 'lucide-react'

export default async function RecentPapersSection() {
  try {
    const supabase = getSupabaseAdmin()
    const { data: papers } = await supabase
      .from('resources')
      .select(`
        id,
        original_filename,
        exam_year,
        created_at,
        resource_category,
        subjects ( name, code ),
        exam_types ( name )
      `)
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(10)

    if (!papers || papers.length === 0) return null

    function timeAgo(dateStr: string) {
      const diff = Date.now() - new Date(dateStr).getTime()
      const mins = Math.floor(diff / 60000)
      if (mins < 60) return `${mins}m ago`
      const hrs = Math.floor(mins / 60)
      if (hrs < 24) return `${hrs}h ago`
      return `${Math.floor(hrs / 24)}d ago`
    }

    const categoryColor: Record<string, string> = {
      exam_paper: 'text-purple-300 bg-purple-500/15 border-purple-500/30',
      study_material: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/30',
    }

    return (
      <section className="py-12 border-b border-prevu-surface-light bg-prevu-bg overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fresh Uploads</span>
              </div>
              <span className="text-xs text-prevu-text-muted font-medium hidden sm:inline">— Just added to the vault</span>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1 text-xs font-bold text-prevu-accent hover:text-white transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Horizontal scroll strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
            {papers.map((paper) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const sub = paper.subjects as any
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const examType = paper.exam_types as any
              const colorClass = categoryColor[paper.resource_category] || categoryColor.exam_paper
              return (
                <Link
                  key={paper.id}
                  href={`/paper/${paper.id}`}
                  className="group flex-shrink-0 w-52 sm:w-60 flex flex-col gap-2.5 p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light hover:border-prevu-accent/50 hover:bg-prevu-surface shadow-lg transition-all"
                >
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-bold border self-start ${colorClass}`}>
                    <FileText className="w-3 h-3" />
                    <span>{paper.resource_category === 'study_material' ? 'Notes' : 'PYQ'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white group-hover:text-prevu-accent transition-colors line-clamp-2 leading-tight">
                      {sub?.name || paper.original_filename}
                    </p>
                    {sub?.code && (
                      <p className="text-[11px] font-mono text-prevu-text-muted mt-0.5">{sub.code}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-prevu-surface-light/50">
                    <span className="text-[11px] text-prevu-text-muted font-mono">
                      {examType?.name || 'Paper'} {paper.exam_year}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] text-prevu-text-muted">
                      <Clock className="w-2.5 h-2.5" />
                      {timeAgo(paper.created_at)}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    )
  } catch {
    return null
  }
}
