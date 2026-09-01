'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { toggleBookmark } from '@/app/dashboard/actions'
import { ExternalLink, Download, Trash2, Star } from 'lucide-react'
import Link from 'next/link'

interface SavedPapersProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any[]
}

export default function SavedPapersList({ resources: initialResources }: SavedPapersProps) {
  const [resources, setResources] = useState(initialResources || [])
  const [removingId, setRemovingId] = useState<string | null>(null)

  const handleRemoveBookmark = async (resourceId: string) => {
    setRemovingId(resourceId)
    await toggleBookmark(resourceId)
    setResources(prev => prev.filter(r => r.id !== resourceId))
    setRemovingId(null)
  }

  if (resources.length === 0) {
    return (
      <div className="p-12 text-center border border-dashed border-prevu-surface-light rounded-3xl bg-prevu-surface/40 my-4 shadow-xl">
        <Star className="w-10 h-10 text-amber-400/50 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Saved Papers Yet</h3>
        <p className="text-xs text-prevu-text-muted mt-1 max-w-sm mx-auto">
          Click the bookmark icon on any exam paper while browsing to save it here for fast revision during exams.
        </p>
        <Button size="sm" className="mt-4 text-xs font-bold" asChild>
          <Link href="/browse">Browse Exam Archive</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-prevu-surface-light bg-prevu-surface/90 shadow-xl">
      <table className="w-full text-left text-xs">
        <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
          <tr>
            <th className="p-4 font-semibold">Subject & Code</th>
            <th className="p-4 font-semibold">Exam Type</th>
            <th className="p-4 font-semibold">Semester</th>
            <th className="p-4 font-semibold">Uploader</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-prevu-surface-light/60">
          {resources.map((resource) => (
            <tr key={resource.id} className="hover:bg-prevu-surface-light/30 transition-colors">
              <td className="p-4">
                <div className="font-semibold text-white text-sm">
                  {resource.subjects?.name}
                </div>
                <div className="font-mono text-prevu-accent text-[11px]">
                  {resource.subjects?.code}
                </div>
              </td>
              <td className="p-4">
                <span className="px-2.5 py-1 rounded-md font-mono font-bold text-xs bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                  {resource.exam_types?.name} • {resource.exam_year}
                </span>
              </td>
              <td className="p-4 text-prevu-text-muted">
                Sem {resource.subjects?.semester} (Year {resource.subjects?.year})
              </td>
              <td className="p-4 text-prevu-text-muted">
                {resource.users?.role === 'admin' ? (
                  <span className="text-purple-300 font-semibold">Prevu (Official)</span>
                ) : (
                  <span>@{resource.users?.username || resource.users?.name || 'student'}</span>
                )}
              </td>
              <td className="p-4 text-right flex items-center justify-end gap-2">
                <Button size="sm" variant="secondary" className="h-8 px-2.5 text-xs font-semibold" asChild>
                  <a href={`/api/preview/${resource.id}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-3.5 h-3.5 mr-1 text-prevu-accent" /> View
                  </a>
                </Button>
                <Button size="sm" variant="outline" className="h-8 px-2 text-xs border-prevu-surface-light" asChild>
                  <a href={`/api/download/${resource.id}`}>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                  disabled={removingId === resource.id}
                  onClick={() => handleRemoveBookmark(resource.id)}
                  title="Remove from saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
