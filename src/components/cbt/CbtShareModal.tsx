'use client'

import React, { useState } from 'react'
import { Share2, Check, Copy, ExternalLink, X, Flame } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { CbtSubject } from '@/lib/cbt/types'

interface CbtShareModalProps {
  isOpen: boolean
  onClose: () => void
  subject: CbtSubject
  scoreResult?: {
    score: number
    totalQuestions: number
    percentage: number
  } | null
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  )
}

export default function CbtShareModal({
  isOpen,
  onClose,
  subject,
  scoreResult
}: CbtShareModalProps) {
  const [copied, setCopied] = useState<boolean>(false)

  if (!isOpen) return null

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://prevu-psi.vercel.app'
  const shareUrl = `${origin}/cbt?subject=${encodeURIComponent(subject.code)}`

  // Compose high-converting WhatsApp viral text
  let shareText = ''
  if (scoreResult) {
    shareText = `⚡ I just scored ${scoreResult.score}/${scoreResult.totalQuestions} (${scoreResult.percentage}%) in *${subject.name} (${subject.code})* on Prevu CBT Arena!\n\nCan you beat my accuracy? Challenge me now:\n👉 ${shareUrl}`
  } else {
    shareText = `🔥 Master *${subject.name} (${subject.code})* on Prevu CBT Arena!\n\n📚 ${subject.totalQuestions} Official MCQs • Timed Simulator • Live CU Rankings\n\nStart your mock test here:\n👉 ${shareUrl}`
  }

  const handleWhatsAppShare = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
    window.open(waUrl, '_blank')
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `Prevu CBT Arena: ${subject.name}`,
          text: shareText,
          url: shareUrl
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }
    handleCopy()
  }

  const handleCopy = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-3xl bg-[#0f0f18] border border-cyan-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-20 bg-emerald-500/15 blur-2xl pointer-events-none rounded-full" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono uppercase tracking-wide">
            <Flame className="w-3.5 h-3.5" />
            <span>Challenge Peers & Study Groups</span>
          </div>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Share CBT Subject
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Invite your classmates to test their prep on <span className="text-white font-semibold">{subject.name}</span>.
          </p>
        </div>

        {/* Preview Card */}
        <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2.5 mb-6">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 font-bold">{subject.code}</span>
            <span className="text-zinc-400">{subject.totalQuestions} Questions</span>
          </div>
          <p className="text-xs text-zinc-200 font-medium line-clamp-2">
            {subject.name}
          </p>
          {scoreResult && (
            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-zinc-400">Score to beat:</span>
              <span className="font-bold font-mono text-emerald-400">
                {scoreResult.score}/{scoreResult.totalQuestions} ({scoreResult.percentage}%)
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* WhatsApp Primary Button */}
          <Button
            size="lg"
            onClick={handleWhatsAppShare}
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-black font-extrabold text-sm rounded-2xl shadow-lg shadow-[#25D366]/20 transition-all flex items-center justify-center gap-2.5 h-12"
          >
            <WhatsAppIcon className="w-5 h-5 fill-current" />
            <span>Share directly on WhatsApp</span>
          </Button>

          {/* Copy Link & Other Platforms */}
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="outline"
              onClick={handleCopy}
              className="w-full bg-white/5 hover:bg-white/10 text-zinc-200 border-white/10 hover:border-cyan-500/40 text-xs font-bold rounded-2xl h-11 flex items-center justify-center gap-2"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-zinc-400" />
                  <span>Copy Link</span>
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={handleNativeShare}
              className="w-full bg-white/5 hover:bg-white/10 text-zinc-200 border-white/10 hover:border-cyan-500/40 text-xs font-bold rounded-2xl h-11 flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4 text-cyan-400" />
              <span>More Apps</span>
            </Button>
          </div>
        </div>

        {/* Direct Link Footnote */}
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
          <p className="text-[11px] font-mono text-zinc-400 truncate">
            {shareUrl}
          </p>
        </div>
      </div>
    </div>
  )
}
