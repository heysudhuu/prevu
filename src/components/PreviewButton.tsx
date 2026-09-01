'use client'

import { Button } from '@/components/ui/Button'
import { ExternalLink } from 'lucide-react'

interface PreviewButtonProps {
  resource: {
    id: string
    exam_year: number
    subjects?: {
      name?: string
      code?: string
    }
    exam_types?: {
      name?: string
    }
  }
}

export default function PreviewButton({ resource }: PreviewButtonProps) {
  const handleClick = () => {
    try {
      const stored = localStorage.getItem('prevu_recent_papers')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let recents: any[] = stored ? JSON.parse(stored) : []
      
      const newEntry = {
        id: resource.id,
        subjectName: resource.subjects?.name || 'Question Paper',
        subjectCode: resource.subjects?.code,
        examType: resource.exam_types?.name || 'MST',
        examYear: resource.exam_year,
        viewedAt: Date.now()
      }

      // Filter out duplicate if existing, add to front, limit to 8
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recents = [newEntry, ...recents.filter((r: any) => r.id !== resource.id)].slice(0, 8)
      localStorage.setItem('prevu_recent_papers', JSON.stringify(recents))
    } catch {
      // Ignore storage errors
    }
  }

  return (
    <Button 
      variant="secondary" 
      size="sm" 
      className="flex-1 text-xs font-semibold hover:bg-prevu-surface-elevated" 
      asChild
      onClick={handleClick}
    >
      <a href={`/api/preview/${resource.id}`} target="_blank" rel="noopener noreferrer">
        <ExternalLink className="w-3.5 h-3.5 mr-1 text-prevu-accent" /> Preview
      </a>
    </Button>
  )
}
