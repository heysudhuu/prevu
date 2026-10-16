import { getSupabaseAdmin } from '@/utils/supabase/admin'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'
import RecentPapersCarousel from './RecentPapersCarousel'

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
      .limit(12)

    if (!papers || papers.length === 0) return null

    // Transform into clean structure for client carousel
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const formattedPapers = papers.map((p: any) => ({
      id: p.id,
      original_filename: p.original_filename,
      exam_year: p.exam_year,
      created_at: p.created_at,
      resource_category: p.resource_category || 'exam_paper',
      subjects: Array.isArray(p.subjects) ? p.subjects[0] : p.subjects,
      exam_types: Array.isArray(p.exam_types) ? p.exam_types[0] : p.exam_types
    }))

    return (
      <section className="py-16 border-b border-prevu-surface-light bg-[#09090d] overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Fresh Vault Additions</span>
              </div>
              <span className="text-xs text-prevu-text-muted font-medium hidden sm:inline">
                Verified question papers and topper notes added this week
              </span>
            </div>
            <Link
              href="/browse"
              className="inline-flex items-center gap-1 text-xs font-bold text-prevu-accent hover:text-white transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RecentPapersCarousel papers={formattedPapers} />
        </div>
      </section>
    )
  } catch {
    return null
  }
}
