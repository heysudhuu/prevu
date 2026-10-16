'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck, CheckCircle, Download, Eye, FileText, ArrowUpDown } from 'lucide-react'
import PreviewButton from '@/components/PreviewButton'
import DownloadButtonWithProgress from '@/components/ui/DownloadButtonWithProgress'
import BookmarkButton from '@/components/BookmarkButton'
import ResourceUpvoteButton from '@/components/ResourceUpvoteButton'

interface ResourceTableViewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any[]
  bookmarkIds: string[]
  userUpvotedIds: string[]
  upvoteCounts: Record<string, number>
}

export default function ResourceTableView({
  resources,
  bookmarkIds,
  userUpvotedIds,
  upvoteCounts,
}: ResourceTableViewProps) {
  if (!resources || resources.length === 0) return null

  return (
    <div className="overflow-x-auto rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 shadow-xl backdrop-blur-xl">
      <table className="w-full text-left text-xs text-prevu-text">
        <thead className="bg-prevu-surface-light/80 text-[11px] font-mono uppercase tracking-wider text-prevu-text-muted border-b border-prevu-surface-light">
          <tr>
            <th scope="col" className="px-4 py-3">Exam / Type</th>
            <th scope="col" className="px-4 py-3">Subject</th>
            <th scope="col" className="px-4 py-3">Sem</th>
            <th scope="col" className="px-4 py-3">Year</th>
            <th scope="col" className="px-4 py-3">Uploader</th>
            <th scope="col" className="px-4 py-3 text-center">Karma</th>
            <th scope="col" className="px-4 py-3 text-right">Quick Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-prevu-surface-light/60">
          {resources.map((resource) => {
            const isVerified = resource.users?.cu_verified
            const isAdmin = resource.users?.role === 'admin'
            const examName = resource.exam_types?.name || 'MST'
            const upvotes = upvoteCounts[resource.id] || 0
            const isBookmarked = bookmarkIds.includes(resource.id)
            const isUpvoted = userUpvotedIds.includes(resource.id)

            return (
              <tr 
                key={resource.id} 
                className="hover:bg-prevu-surface-elevated/60 transition-colors group"
              >
                {/* Exam Badge */}
                <td className="px-4 py-3 font-semibold whitespace-nowrap">
                  <div className="flex items-center gap-1.5">
                    <Badge variant={examName === 'MST1' ? 'mst1' : examName === 'MST2' ? 'mst2' : 'est'}>
                      {examName}
                    </Badge>
                    {isAdmin && (
                      <span className="text-[10px] text-purple-400" title="Official Prevu Paper">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                </td>

                {/* Subject Code & Name */}
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <Link
                      href={`/paper/${resource.id}`}
                      className="font-bold text-white hover:text-prevu-accent transition-colors line-clamp-1 group-hover:underline"
                    >
                      {resource.subjects?.name}
                    </Link>
                    <span className="font-mono text-[10px] text-prevu-text-muted mt-0.5">
                      {resource.subjects?.code}
                    </span>
                  </div>
                </td>

                {/* Semester */}
                <td className="px-4 py-3 font-mono text-prevu-text-muted whitespace-nowrap">
                  Sem {resource.subjects?.semester || '-'}
                </td>

                {/* Exam Year */}
                <td className="px-4 py-3 font-mono text-prevu-accent font-semibold whitespace-nowrap">
                  {resource.exam_year}
                </td>

                {/* Uploader */}
                <td className="px-4 py-3 text-prevu-text-muted whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="truncate max-w-[100px] text-[11px]">
                      {isAdmin ? 'Prevu Team' : `@${resource.users?.username || 'student'}`}
                    </span>
                    {isVerified && !isAdmin && (
                      <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                    )}
                  </div>
                </td>

                {/* Karma / Upvotes */}
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <div className="inline-flex items-center justify-center">
                    <ResourceUpvoteButton 
                      resourceId={resource.id} 
                      initialUpvoted={isUpvoted} 
                      initialCount={upvotes} 
                    />
                  </div>
                </td>

                {/* Action Buttons */}
                <td className="px-4 py-3 text-right whitespace-nowrap">
                  <div className="flex items-center justify-end gap-1.5">
                    <BookmarkButton resourceId={resource.id} initialBookmarked={isBookmarked} />
                    <PreviewButton 
                      resource={resource} 
                      size="sm"
                      label="View"
                      className="h-7 px-2.5 text-[11px]"
                    />
                    <DownloadButtonWithProgress
                      resourceId={resource.id}
                      fileName={resource.original_filename}
                      variant="outline"
                      size="sm"
                      className="h-7 px-2.5 text-[11px]"
                    />
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
