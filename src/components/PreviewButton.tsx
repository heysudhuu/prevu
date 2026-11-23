'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Eye } from 'lucide-react'
import PDFViewerModal from '@/components/preview/PDFViewerModal'
import { trackStudentResourceView } from '@/lib/activity/activityTracker'

interface PreviewButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resource: any
  className?: string
  variant?: 'default' | 'secondary' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  label?: string
}

export default function PreviewButton({ 
  resource, 
  className = '', 
  variant = 'secondary', 
  size = 'sm',
  label = 'Preview' 
}: PreviewButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => {
    trackStudentResourceView(resource)
    setIsModalOpen(true)
  }

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={`flex-1 text-xs font-semibold hover:bg-prevu-surface-elevated cursor-pointer ${className}`} 
        onClick={handleOpen}
      >
        <Eye className="w-3.5 h-3.5 mr-1 text-prevu-accent" /> {label}
      </Button>

      {isModalOpen && (
        <PDFViewerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          resource={resource}
        />
      )}
    </>
  )
}
