'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

function WhatsAppIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.18 8.18 0 0 1-5.82 2.41c-1.44 0-2.86-.38-4.11-1.11l-.3-.18-3.12.82.83-3.04-.19-.31a8.21 8.21 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.05-.1-.21-.16-.46-.28z"/>
    </svg>
  )
}

interface SharePaperButtonProps {
  resource: {
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
}

export default function SharePaperButton({ resource }: SharePaperButtonProps) {
  const [copied, setCopied] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false)
      }
    }
    if (showMenu) {
      document.addEventListener('click', handleClickOutside)
    }
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showMenu])

  const subjectName = resource.subjects?.name || 'Question Paper'
  const subjectCode = resource.subjects?.code || ''
  const examType = resource.exam_types?.name || 'MST'
  const semester = resource.subjects?.semester || 1
  const examYear = resource.exam_year

  const shareText = `📚 *Chandigarh University Question Paper*\n*Subject:* ${subjectName} (${subjectCode})\n*Pattern:* ${examType} - ${examYear} (Sem ${semester})\n\nAccess it free on Prevu:\n`

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = typeof window !== 'undefined' 
      ? `${window.location.origin}/browse?sem=${semester}&search=${encodeURIComponent(subjectCode || subjectName)}` 
      : ''
    
    navigator.clipboard.writeText(`${shareText}${url}`)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setShowMenu(false)
    }, 2000)
  }

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = typeof window !== 'undefined' 
      ? `${window.location.origin}/browse?sem=${semester}&search=${encodeURIComponent(subjectCode || subjectName)}` 
      : ''
    
    const fullMessage = encodeURIComponent(`${shareText}${url}`)
    window.open(`https://api.whatsapp.com/send?text=${fullMessage}`, '_blank')
    setShowMenu(false)
  }

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setShowMenu(!showMenu)
        }}
        title="Share with Classmates"
        className="p-1.5 rounded-lg border border-prevu-surface-light bg-prevu-bg/90 hover:bg-prevu-surface hover:border-prevu-accent/50 text-prevu-text-muted hover:text-prevu-accent transition-all text-xs flex items-center justify-center cursor-pointer"
      >
        <Share2 className="w-3.5 h-3.5" />
      </button>

      {/* Popover Menu */}
      {showMenu && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 bottom-full mb-1.5 w-48 rounded-xl border border-prevu-surface-light bg-prevu-surface/98 backdrop-blur-2xl shadow-2xl p-1.5 z-30 space-y-1 animate-scale-in"
        >
          <button
            onClick={handleWhatsAppShare}
            className="w-full px-2.5 py-2 rounded-lg text-left text-xs font-medium text-prevu-text hover:bg-emerald-500/15 hover:text-emerald-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Share on WhatsApp</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full px-2.5 py-2 rounded-lg text-left text-xs font-medium text-prevu-text hover:bg-prevu-accent/15 hover:text-prevu-accent flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-semibold">Copied Link!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-prevu-text-muted shrink-0" />
                <span>Copy Share Link</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
