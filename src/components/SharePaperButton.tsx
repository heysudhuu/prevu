'use client'

import { useState, useRef, useEffect } from 'react'
import { Share2, Check, Copy, Send } from 'lucide-react'

function WhatsAppIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.18 8.18 0 0 1-5.82 2.41c-1.44 0-2.86-.38-4.11-1.11l-.3-.18-3.12.82.83-3.04-.19-.31a8.21 8.21 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.05-.1-.21-.16-.46-.28z"/>
    </svg>
  )
}

function TelegramIcon({ className = "w-3.5 h-3.5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
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
  variant?: 'icon' | 'button'
}

export default function SharePaperButton({ resource, variant = 'icon' }: SharePaperButtonProps) {
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

  const getShareUrl = () => {
    if (typeof window === 'undefined') return ''
    if (resource.id) {
      return `${window.location.origin}/paper/${resource.id}`
    }
    return `${window.location.origin}/browse?sem=${semester}&search=${encodeURIComponent(subjectCode || subjectName)}`
  }

  const shareText = `📚 *Chandigarh University Question Paper*\n*Subject:* ${subjectName} (${subjectCode})\n*Pattern:* ${examType} - ${examYear} (Sem ${semester})\n\nAccess it free on Prevu:\n`

  const handleButtonClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = getShareUrl()

    // If mobile native share sheet is available, trigger directly
    if (typeof navigator !== 'undefined' && navigator.share && /mobile|android|iphone|ipad/i.test(navigator.userAgent)) {
      try {
        await navigator.share({
          title: `${subjectName} (${subjectCode}) ${examType} ${examYear} | Prevu`,
          text: `Check out this verified ${examYear} ${examType} paper for ${subjectName} on Prevu:`,
          url: url
        })
        return
      } catch {
        // Fallback to dropdown
      }
    }

    setShowMenu(prev => !prev)
  }

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = getShareUrl()
    
    navigator.clipboard.writeText(`${shareText}${url}`)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
      setShowMenu(false)
    }, 1800)
  }

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = getShareUrl()
    const fullMessage = encodeURIComponent(`${shareText}${url}`)
    window.open(`https://api.whatsapp.com/send?text=${fullMessage}`, '_blank')
    setShowMenu(false)
  }

  const handleTelegramShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    const url = getShareUrl()
    const fullMessage = encodeURIComponent(`${shareText}`)
    window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${fullMessage}`, '_blank')
    setShowMenu(false)
  }

  return (
    <div className="relative inline-block z-30" ref={menuRef}>
      {variant === 'button' ? (
        <button
          onClick={handleButtonClick}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/80 hover:bg-prevu-surface text-prevu-text-muted hover:text-white transition-all text-xs font-semibold cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      ) : (
        <button
          onClick={handleButtonClick}
          title="Share with Classmates"
          className="p-1.5 rounded-xl border border-prevu-surface-light bg-prevu-surface/80 hover:bg-prevu-surface hover:border-purple-500/40 text-prevu-text-muted hover:text-white transition-all text-xs flex items-center justify-center cursor-pointer active:scale-95"
        >
          <Share2 className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Popover Menu */}
      {showMenu && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-prevu-surface-light bg-[#11111a]/95 backdrop-blur-2xl shadow-2xl p-2 z-50 space-y-1 animate-scale-in"
        >
          <div className="px-2 py-1 text-[10px] font-mono font-bold text-prevu-text-muted uppercase tracking-wider border-b border-prevu-surface-light/60 mb-1">
            Share Question Paper
          </div>

          <button
            onClick={handleWhatsAppShare}
            className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-white hover:bg-emerald-500/15 hover:text-emerald-300 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <WhatsAppIcon className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>WhatsApp Class Groups</span>
          </button>

          <button
            onClick={handleTelegramShare}
            className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-white hover:bg-sky-500/15 hover:text-sky-300 flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <TelegramIcon className="w-4 h-4 text-sky-400 shrink-0" />
            <span>Telegram Channel / Group</span>
          </button>

          <button
            onClick={handleCopy}
            className="w-full px-2.5 py-2 rounded-xl text-left text-xs font-semibold text-white hover:bg-purple-500/15 hover:text-purple-300 flex items-center gap-2.5 transition-colors cursor-pointer border-t border-prevu-surface-light/40 mt-1 pt-1.5"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-prevu-text-muted shrink-0" />
                <span>Copy Direct Link</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
