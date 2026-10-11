'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  X, 
  BookOpen, 
  MessageSquare, 
  UserCheck, 
  ArrowRight, 
  Heart,
  CheckCircle2,
  Users
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'

interface WelcomeFamilyModalProps {
  userProfile: {
    id: string
    name?: string
    username?: string
    current_semester?: number
    branch?: string
  }
}

export default function WelcomeFamilyModal({ userProfile }: WelcomeFamilyModalProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const studentName = userProfile?.name || 'Batchmate'
  const userSem = userProfile?.current_semester || 1
  const storageKey = `prevu_welcome_modal_seen_${userProfile?.id || 'guest'}`

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Show if explicit ?welcome=true query param or if never seen before
    const urlWelcome = searchParams.get('welcome') === 'true'
    const alreadySeen = localStorage.getItem(storageKey)

    if (urlWelcome || !alreadySeen) {
      setIsOpen(true)
    }
  }, [searchParams, storageKey])

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, 'true')
    }
    setIsOpen(false)

    // Clean up query param from URL if present
    if (searchParams.get('welcome')) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('welcome')
      const newQuery = params.toString() ? `?${params.toString()}` : ''
      router.replace(`/dashboard${newQuery}`)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl rounded-3xl bg-[#0f0f17] border border-purple-500/40 p-6 sm:p-8 shadow-2xl shadow-purple-900/30 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient decorative glowing backdrops */}
          <div className="absolute -top-16 -right-16 w-52 h-52 bg-purple-600/25 blur-3xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-52 h-52 bg-emerald-500/15 blur-3xl rounded-full pointer-events-none" />

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-500/30 text-purple-300 text-xs font-bold mb-4">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            <span>Prevu Student Collective</span>
            <span className="text-prevu-surface-light">•</span>
            <span className="text-amber-300">CU Family</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 leading-tight">
            Welcome to our family! 🎓✨
          </h2>

          {/* Option A Welcome Copy */}
          <p className="text-sm text-prevu-text-muted leading-relaxed mb-6">
            Hey <span className="text-white font-semibold">{studentName}</span>! We’re thrilled to have you here. Prevu is built by students, for students at Chandigarh University. Explore past papers, share study notes, ask doubts, and let&apos;s help each other ace every MST and End-Term exam together! 🚀
          </p>

          {/* 3 Pillars of Prevu Community */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            
            <div className="p-3.5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light hover:border-purple-500/40 transition-colors space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">PYQ Vault</h3>
              <p className="text-[11px] text-prevu-text-muted leading-tight">
                Verified question papers & blueprints for Semester {userSem}.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light hover:border-cyan-500/40 transition-colors space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Peer Help</h3>
              <p className="text-[11px] text-prevu-text-muted leading-tight">
                Ask doubts, answer batchmates & earn contributor karma.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light hover:border-emerald-500/40 transition-colors space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <UserCheck className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-white">Student ID</h3>
              <p className="text-[11px] text-prevu-text-muted leading-tight">
                Custom Digital ID card & verified campus badge.
              </p>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <Button
              asChild
              className="w-full sm:flex-1 py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-prevu-accent hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-purple-600/30"
              onClick={handleClose}
            >
              <Link href={`/browse?semester=${userSem}`} className="flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>Explore Semester {userSem} PYQs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full sm:w-auto py-2.5 border-prevu-surface-light hover:border-purple-500/50 text-xs font-semibold text-prevu-text-muted hover:text-white"
              onClick={handleClose}
            >
              <Link href="/profile">
                <span>Set Up My Profile</span>
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
