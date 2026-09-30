'use client'

import { useState, useEffect } from 'react'
import { WifiOff, Check, Loader2, HardDriveDownload } from 'lucide-react'
import { 
  isPaperInOfflineVault, 
  savePaperToOfflineVault, 
  removePaperFromOfflineVault,
  OfflinePaper 
} from '@/lib/offline/vault'

interface SaveOfflineButtonProps {
  paper: {
    id: string
    exam_year: number
    subjects?: {
      name?: string
      code?: string
      semester?: number
    }
    exam_types?: {
      name?: string
    }
  }
  variant?: 'button' | 'icon' | 'badge'
  className?: string
}

export default function SaveOfflineButton({ 
  paper, 
  variant = 'button',
  className = '' 
}: SaveOfflineButtonProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null)

  useEffect(() => {
    setIsSaved(isPaperInOfflineVault(paper.id))

    const handleVaultChange = () => {
      setIsSaved(isPaperInOfflineVault(paper.id))
    }

    window.addEventListener('prevu-offline-vault-changed', handleVaultChange)
    return () => window.removeEventListener('prevu-offline-vault-changed', handleVaultChange)
  }, [paper.id])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isLoading) return
    setIsLoading(true)

    try {
      if (isSaved) {
        await removePaperFromOfflineVault(paper.id)
        setIsSaved(false)
        showFeedback('Removed from Offline Vault')
      } else {
        const res = await savePaperToOfflineVault({
          id: paper.id,
          subjectName: paper.subjects?.name || 'Question Paper',
          subjectCode: paper.subjects?.code || '',
          semester: paper.subjects?.semester || 1,
          examType: paper.exam_types?.name || 'MST',
          examYear: paper.exam_year
        })

        if (res.success) {
          setIsSaved(true)
          showFeedback('Saved for Offline! Available without internet')
        } else {
          showFeedback(res.error || 'Failed to save offline')
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const showFeedback = (msg: string) => {
    setFeedbackMsg(msg)
    setTimeout(() => setFeedbackMsg(null), 3000)
  }

  if (variant === 'icon') {
    return (
      <div className="relative inline-block">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          className={`p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
            isSaved
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
              : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-cyan-500/30'
          } ${className}`}
          title={isSaved ? 'Saved in Offline Vault (click to remove)' : 'Save for offline access in exam halls'}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
          ) : isSaved ? (
            <Check className="w-4 h-4 text-cyan-400" />
          ) : (
            <HardDriveDownload className="w-4 h-4" />
          )}
        </button>

        {feedbackMsg && (
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-2.5 py-1 text-[11px] font-semibold bg-gray-900 text-white rounded-lg shadow-xl border border-gray-700 animate-fade-in pointer-events-none">
            {feedbackMsg}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        disabled={isLoading}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
          isSaved
            ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20 hover:bg-cyan-900/50'
            : 'bg-prevu-surface/80 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-cyan-500/30'
        } ${className}`}
        title={isSaved ? 'Paper is available offline' : 'Download and save to Offline Vault'}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
        ) : isSaved ? (
          <Check className="w-3.5 h-3.5 text-cyan-400" />
        ) : (
          <HardDriveDownload className="w-3.5 h-3.5 text-cyan-400" />
        )}
        <span>{isSaved ? 'Offline Saved' : 'Save for Offline'}</span>
      </button>

      {feedbackMsg && (
        <div className="absolute top-full mt-2 left-0 z-50 whitespace-nowrap px-3 py-1.5 text-xs font-semibold bg-gray-950 text-white rounded-xl shadow-2xl border border-cyan-500/30 animate-fade-in pointer-events-none">
          {feedbackMsg}
        </div>
      )}
    </div>
  )
}
