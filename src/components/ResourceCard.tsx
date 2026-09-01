import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck, CheckCircle, Download, FileText } from 'lucide-react'
import BookmarkButton from '@/components/BookmarkButton'
import PreviewButton from '@/components/PreviewButton'
import SharePaperButton from '@/components/SharePaperButton'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ResourceCard({ resource, isBookmarked = false }: { resource: any; isBookmarked?: boolean }) {
  const isVerified = resource.users?.cu_verified
  const isAdmin = resource.users?.role === 'admin'
  const examName = resource.exam_types?.name || 'MST'

  const examBadgeVariant = 
    examName === 'MST1' ? 'mst1' : 
    examName === 'MST2' ? 'mst2' : 
    examName === 'EST' ? 'est' : 'stamp'
  
  return (
    <Card className={`w-full flex flex-col h-full group transition-all duration-300 ${
      isAdmin 
        ? 'border-purple-500/30 hover:border-purple-500/60 bg-gradient-to-b from-purple-950/20 via-prevu-surface to-prevu-surface shadow-lg shadow-purple-950/20 hover:-translate-y-1' 
        : 'hover:border-prevu-accent/40 hover:-translate-y-1'
    }`}>
      <CardHeader className="flex-none pb-3 border-b-0">
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={examBadgeVariant}>
              {examName}
            </Badge>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3" /> Official
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-medium text-prevu-text-muted bg-prevu-bg/90 px-2 py-0.5 rounded-md border border-prevu-surface-light">
              {resource.exam_year}
            </span>
            <SharePaperButton resource={resource} />
            <BookmarkButton resourceId={resource.id} initialBookmarked={isBookmarked} />
          </div>
        </div>

        <CardTitle className="text-base sm:text-lg font-bold line-clamp-2 text-white group-hover:text-prevu-accent transition-colors">
          {resource.subjects?.name}
        </CardTitle>

        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[11px] font-mono font-semibold text-prevu-accent bg-prevu-accent/10 px-2 py-0.5 rounded border border-prevu-accent/20">
            {resource.subjects?.code}
          </span>
          <span className="text-xs font-mono text-prevu-text-muted">
            Sem {resource.subjects?.semester} (Year {resource.subjects?.year || Math.ceil((resource.subjects?.semester || 1) / 2)})
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-end pb-3 pt-0">
        <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-prevu-surface-light/60 text-xs text-prevu-text-muted">
          <div className="flex items-center gap-1.5 truncate">
            {isAdmin ? (
              <span className="font-semibold text-purple-300 flex items-center gap-1 truncate text-xs">
                <span>By <strong className="text-purple-200">Prevu</strong></span>
              </span>
            ) : (
              <span className="truncate text-xs">
                By @{resource.users?.username || resource.users?.name || 'student'}
              </span>
            )}

            {isVerified && !isAdmin && (
              <span className="inline-flex items-center text-emerald-400 gap-0.5" title="CU Verified">
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <span className="text-[11px] text-prevu-text-muted/70 font-mono shrink-0 flex items-center gap-1">
            <FileText className="w-3 h-3 text-prevu-text-muted" />
            PDF
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex-none pt-0 border-t-0 flex gap-2">
        <PreviewButton resource={resource} />
        <Button variant="outline" size="sm" className="flex-1 text-xs border-prevu-surface-light hover:border-prevu-accent/40 font-semibold" asChild>
          <a href={`/api/download/${resource.id}`}>
            <Download className="w-3.5 h-3.5 mr-1 text-prevu-text-muted" /> Download
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
