'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, X, BookOpen, MessageSquare, GraduationCap, ArrowRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DashboardWelcomeBannerProps {
  userProfile: {
    id: string
    name?: string
    current_semester?: number
    branch?: string
  }
}

export default function DashboardWelcomeBanner({ userProfile }: DashboardWelcomeBannerProps) {
  const [dismissed, setDismissed] = useState(true)

  const studentName = userProfile?.name || 'Batchmate'
  const userSem = userProfile?.current_semester || 1
  const storageKey = `prevu_welcome_banner_dismissed_${userProfile?.id || 'guest'}`

  useEffect(() => {
    if (typeof window === 'undefined') return
    const isDismissed = localStorage.getItem(storageKey) === 'true'
    setDismissed(isDismissed)
  }, [storageKey])

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true')
    }
    setDismissed(true)
  }

  if (dismissed) return null

  return (
    <div className="relative overflow-hidden rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/40 via-prevu-surface/90 to-indigo-950/30 p-5 sm:p-6 shadow-xl backdrop-blur-xl animate-fade-in">
      {/* Background radial soft glow */}
      <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-purple-600/20 blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 h-36 w-36 rounded-full bg-emerald-500/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Content */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center text-white shrink-0 shadow-md shadow-purple-600/20">
            <Heart className="w-5 h-5 fill-white/80" />
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-1.5">
                <span>Welcome to the Prevu Family, {studentName}!</span>
                <span className="text-yellow-400">🎉</span>
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                BE-CSE • Sem {userSem}
              </span>
            </div>

            <p className="text-xs text-prevu-text-muted leading-relaxed max-w-2xl">
              Prevu is built to help batchmates support each other. Start by exploring Semester {userSem} PYQs, or complete your Digital Student ID card in your profile!
            </p>
          </div>
        </div>

        {/* Action Pills & Dismiss */}
        <div className="flex items-center gap-2 flex-wrap shrink-0 self-end md:self-center">
          <Button
            size="sm"
            asChild
            className="h-8 px-3 text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold shadow-md shadow-purple-600/20"
          >
            <Link href={`/browse?semester=${userSem}`} className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Sem {userSem} PYQs</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-3 text-xs border-prevu-surface-light hover:border-purple-500/40 text-prevu-text-muted hover:text-white"
          >
            <Link href="/requests" className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Doubts</span>
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            asChild
            className="h-8 px-3 text-xs border-prevu-surface-light hover:border-purple-500/40 text-prevu-text-muted hover:text-white"
          >
            <Link href="/profile" className="flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              <span>Profile</span>
            </Link>
          </Button>

          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light transition-colors ml-1 cursor-pointer"
            title="Dismiss banner"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
