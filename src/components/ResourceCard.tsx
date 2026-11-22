import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck, CheckCircle, Download, FileText, FolderOpen, ExternalLink, Play } from 'lucide-react'
import BookmarkButton from '@/components/BookmarkButton'
import PreviewButton from '@/components/PreviewButton'
import SharePaperButton from '@/components/SharePaperButton'
import ResourceUpvoteButton from '@/components/ResourceUpvoteButton'
import DownloadButtonWithProgress from '@/components/ui/DownloadButtonWithProgress'
import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function ResourceCard({ resource, isBookmarked = false, initialUpvoted = false, upvoteCount = 0 }: { resource: any; isBookmarked?: boolean; initialUpvoted?: boolean; upvoteCount?: number }) {
  const isVerified = resource.users?.cu_verified
  const isAdmin = resource.users?.role === 'admin'
  const examName = resource.exam_types?.name || 'MST'
  const normalizedType = (examName || '').toLowerCase().replace(/[\s_-]/g, '')

  // External link / format detection
  const isGDrive = 
    resource.resource_format === 'gdrive' || 
    resource.file_type === 'link/gdrive' || 
    resource.file_path?.includes('drive.google.com')

  const isYouTube = 
    resource.resource_format === 'youtube' || 
    resource.file_type === 'link/youtube' || 
    resource.file_path?.includes('youtube.com') || 
    resource.file_path?.includes('youtu.be')

  const externalUrl = resource.external_url || (resource.file_path?.startsWith('http') ? resource.file_path : null)

  const examBadgeVariant = 
    examName === 'MST1' ? 'mst1' : 
    examName === 'MST2' ? 'mst2' : 
    examName === 'EST' ? 'est' : 
    normalizedType.includes('note') ? 'notes' :
    normalizedType.includes('syllab') ? 'syllabus' :
    normalizedType.includes('assign') ? 'assignment' :
    normalizedType.includes('lab') ? 'lab-manual' :
    normalizedType.includes('question') ? 'question-bank' :
    normalizedType.includes('book') ? 'book' :
    normalizedType.includes('cheat') ? 'cheatsheet' :
    normalizedType.includes('material') ? 'study-material' : 'stamp'
  
  const subjectCode = resource.subjects?.code || resource.subject_id
  const subjectUrl = `/subject/${encodeURIComponent(subjectCode)}`
  const isSeniorRecommended = upvoteCount >= 3 || (isVerified && normalizedType.includes('note'))

  const isNotes = normalizedType.includes('note') || normalizedType.includes('syllab') || normalizedType.includes('material')

  return (
    <Card className={`w-full flex flex-col h-full group transition-all duration-300 card-hover-lift bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-accent/50 ${
      isAdmin 
        ? 'hover:shadow-xl hover:shadow-purple-500/15' 
        : 'hover:shadow-xl hover:shadow-prevu-accent/10'
    }`}>
      <CardHeader className="flex-none p-4 pb-2 border-b-0">
        {/* Top Header: Badges & Quick Action Icons */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Badge variant={examBadgeVariant}>
              {examName}
            </Badge>

            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted">
              {resource.exam_year}
            </span>

            {isGDrive && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <FolderOpen className="w-3 h-3 text-emerald-400" /> Drive
              </span>
            )}

            {isYouTube && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-300 border border-red-500/30">
                <Play className="w-3 h-3 text-red-400" /> YouTube
              </span>
            )}

            {!isGDrive && !isYouTube && isNotes && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                Notes
              </span>
            )}

            {isAdmin && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                <ShieldCheck className="w-3 h-3" /> Official
              </span>
            )}
          </div>

          {/* Quick Actions (Upvote, Share, Bookmark) */}
          <div className="flex items-center gap-1">
            <ResourceUpvoteButton resourceId={resource.id} initialUpvoted={initialUpvoted} initialCount={upvoteCount} />
            <SharePaperButton resource={resource} />
            <BookmarkButton resourceId={resource.id} initialBookmarked={isBookmarked} />
          </div>
        </div>

        {/* Course Title */}
        <CardTitle className="text-sm sm:text-base font-bold line-clamp-2 text-white group-hover:text-prevu-accent transition-colors leading-snug">
          {externalUrl ? (
            <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-1.5">
              <span>{resource.original_filename || resource.subjects?.name}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 opacity-70" />
            </a>
          ) : (
            <Link href={`/paper/${resource.id}`} className="hover:underline">
              {resource.subjects?.name}
            </Link>
          )}
        </CardTitle>

        {/* Code & Semester Pill */}
        <div className="flex items-center gap-2 mt-2">
          <Link 
            href={subjectUrl}
            className="text-[10px] font-mono font-bold text-prevu-accent bg-prevu-accent/10 hover:bg-prevu-accent/20 px-2 py-0.5 rounded border border-prevu-accent/25 transition-colors"
          >
            {resource.subjects?.code}
          </Link>
          <span className="text-[11px] font-mono text-prevu-text-muted">
            Sem {resource.subjects?.semester}
          </span>
          {resource.channel_name && (
            <span className="text-[10px] font-mono text-red-300 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 truncate max-w-[120px]">
              {resource.channel_name}
            </span>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-end px-4 py-2 pt-0">
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-prevu-surface-light/50 text-xs text-prevu-text-muted">
          <div className="flex items-center gap-1.5 truncate text-[11px]">
            {isAdmin ? (
              <span className="font-semibold text-purple-300 truncate">
                Prevu Team
              </span>
            ) : (
              <span className="truncate">
                By @{resource.users?.username || resource.users?.name || 'student'}
              </span>
            )}

            {isVerified && !isAdmin && (
              <span className="inline-flex items-center text-emerald-400 shrink-0" title="CU Verified Student">
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            )}

            {!isAdmin && (
              <span className="text-[9px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/25 shrink-0" title="Verified Peer Collaborator">
                ★ Contributor
              </span>
            )}
          </div>

          <span className="text-[10px] text-prevu-text-muted font-mono shrink-0 flex items-center gap-1">
            {isGDrive ? (
              <span className="text-emerald-400 font-bold">Drive Link</span>
            ) : isYouTube ? (
              <span className="text-red-400 font-bold">YouTube</span>
            ) : (
              <>
                <FileText className="w-3 h-3 text-prevu-text-muted" />
                <span>PDF</span>
              </>
            )}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex-none p-4 pt-1 border-t-0 flex gap-2">
        {isGDrive && externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <FolderOpen className="w-3.5 h-3.5" />
            <span>Open in Google Drive</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : isYouTube && externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-500/20 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Watch on YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        ) : (
          <>
            <PreviewButton 
              resource={resource} 
              variant="secondary"
              label="Preview"
              className="flex-1 text-xs font-semibold border border-prevu-surface-light hover:border-prevu-accent/50 hover:bg-prevu-surface-elevated transition-all"
            />
            <DownloadButtonWithProgress
              resourceId={resource.id}
              fileName={resource.original_filename}
              variant="outline"
              size="sm"
              className="flex-1 text-xs border-prevu-surface-light hover:border-prevu-accent/40 font-semibold"
            />
          </>
        )}
      </CardFooter>
    </Card>
  )
}
