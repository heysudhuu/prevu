'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, UploadCloud, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface CelebrationProps {
  subjectName: string
  subjectCode?: string
  examType: string
  examYear: number
  fileName?: string
  isAdminUpload?: boolean
  onUploadAnother: () => void
}

export default function UploadCelebrationMascot({
  subjectName,
  subjectCode,
  examType,
  examYear,
  fileName,
  isAdminUpload,
  onUploadAnother
}: CelebrationProps) {
  // Confetti particles
  const confettiColors = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#f43f5e', '#a855f7']

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', duration: 0.6 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      <div className="relative backdrop-blur-2xl bg-prevu-surface/95 border border-prevu-accent/30 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden">
        
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-purple-500/25 to-prevu-accent/25 rounded-full blur-3xl pointer-events-none" />
        
        {/* Floating Confetti Elements */}
        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: (i % 3 === 0 ? 10 : 6) + 'px',
              height: (i % 3 === 0 ? 10 : 6) + 'px',
              backgroundColor: confettiColors[i % confettiColors.length],
              top: `${15 + (i * 19) % 70}%`,
              left: `${5 + (i * 23) % 90}%`,
            }}
            initial={{ y: -20, opacity: 0, rotate: 0 }}
            animate={{
              y: [0, -15, 0],
              rotate: [0, 180, 360],
              opacity: [0.6, 1, 0.6],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: (i * 0.15),
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* ============================================================ */}
        {/* 3D CARTOON CELEBRATING MASCOT (Mickey / Prevu Cartoon Style) */}
        {/* ============================================================ */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          
          {/* Mascot Glow Aura */}
          <div className="absolute inset-0 bg-prevu-accent/20 rounded-full blur-xl animate-pulse" />

          {/* Animated Mascot Body Container */}
          <motion.div
            className="relative z-10 flex flex-col items-center"
            animate={{
              y: [0, -10, 0],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            {/* Cartoon Ears (Classic Mickey Silhouette Style) */}
            <div className="relative w-28 h-10 -mb-5 flex justify-between px-1 z-0">
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border-2 border-prevu-accent/40 shadow-lg shadow-black/60"
                animate={{ rotate: [-6, 6, -6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border-2 border-prevu-accent/40 shadow-lg shadow-black/60"
                animate={{ rotate: [6, -6, 6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>

            {/* Cartoon Party Hat */}
            <motion.div 
              className="absolute -top-7 z-20 flex flex-col items-center"
              animate={{ rotate: [-4, 4, -4] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-md shadow-yellow-400/80 animate-ping mb-[-2px]" />
              <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[24px] border-b-purple-500 shadow-lg" />
            </motion.div>

            {/* Cartoon Head / Face */}
            <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-950 border-2 border-prevu-accent/60 shadow-2xl flex flex-col items-center justify-center z-10 overflow-hidden">
              
              {/* Rosy Cheeks */}
              <div className="absolute bottom-5 left-2 w-3.5 h-2 bg-pink-500/40 rounded-full blur-[1px]" />
              <div className="absolute bottom-5 right-2 w-3.5 h-2 bg-pink-500/40 rounded-full blur-[1px]" />

              {/* Big Expressive Cartoon Eyes */}
              <div className="flex gap-3 mb-1 mt-1">
                <motion.div 
                  className="w-3.5 h-5 bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden"
                  animate={{ scaleY: [1, 1, 0.1, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.93, 1] }}
                >
                  <div className="w-2 h-2.5 bg-zinc-950 rounded-full absolute top-1 right-0.5">
                    <div className="w-0.5 h-0.5 bg-white rounded-full absolute top-0.5 left-0.5" />
                  </div>
                </motion.div>

                <motion.div 
                  className="w-3.5 h-5 bg-white rounded-full flex items-center justify-center shadow-inner relative overflow-hidden"
                  animate={{ scaleY: [1, 1, 0.1, 1] }}
                  transition={{ duration: 3.5, repeat: Infinity, times: [0, 0.9, 0.93, 1] }}
                >
                  <div className="w-2 h-2.5 bg-zinc-950 rounded-full absolute top-1 left-0.5">
                    <div className="w-0.5 h-0.5 bg-white rounded-full absolute top-0.5 right-0.5" />
                  </div>
                </motion.div>
              </div>

              {/* Cute Button Nose */}
              <div className="w-2 h-1.5 bg-prevu-accent rounded-full shadow-sm" />

              {/* Cheerful Cartoon Smile */}
              <div className="w-6 h-3 border-b-2 border-white rounded-full mt-0.5" />
            </div>

            {/* Celebrating Animated Gloved Hands */}
            <motion.div 
              className="absolute -left-6 top-8 w-6 h-6 rounded-full bg-white border-2 border-zinc-300 shadow-md flex items-center justify-center text-xs"
              animate={{ rotate: [-20, 20, -20], y: [-2, 2, -2] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              ✌️
            </motion.div>
            <motion.div 
              className="absolute -right-6 top-8 w-6 h-6 rounded-full bg-white border-2 border-zinc-300 shadow-md flex items-center justify-center text-xs"
              animate={{ rotate: [20, -20, 20], y: [2, -2, 2] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🎉
            </motion.div>
          </motion.div>

          {/* Floating Shadow Below */}
          <div className="absolute -bottom-2 w-16 h-2 bg-black/50 blur-md rounded-full" />
        </div>

        {/* ============================================================ */}
        {/* HEARTFELT GREETING & THANK YOU MESSAGE */}
        {/* ============================================================ */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-prevu-text tracking-tight mb-2">
          Thank You for Your Contribution! ❤️
        </h2>
        
        <p className="text-sm sm:text-base text-prevu-accent font-semibold mb-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" />
          <span>We are super thankful for your help!</span>
          <Sparkles className="w-4 h-4" />
        </p>

        <p className="text-xs sm:text-sm text-prevu-text-muted max-w-md mx-auto leading-relaxed mb-6">
          Your upload helps your fellow students and juniors at <strong className="text-prevu-text">Chandigarh University</strong> study smarter and prepare effectively for their exams.
        </p>

        {/* Upload Summary Card */}
        <div className="bg-prevu-bg/80 border border-prevu-surface-light rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-2.5 text-xs sm:text-sm shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-prevu-text-muted">Subject:</span>
            <span className="font-semibold text-prevu-text">
              {subjectName} {subjectCode ? `(${subjectCode})` : ''}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-prevu-text-muted">Exam Type:</span>
            <span className="font-mono font-bold text-prevu-accent px-2 py-0.5 bg-prevu-accent/15 rounded-md">
              {examType} • {examYear}
            </span>
          </div>
          {fileName && (
            <div className="flex items-center justify-between truncate">
              <span className="text-prevu-text-muted">Document:</span>
              <span className="text-prevu-text-muted font-mono truncate max-w-[220px]">
                {fileName}
              </span>
            </div>
          )}
          <div className="pt-2 border-t border-prevu-surface-light flex items-center justify-between text-emerald-400 font-medium">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Status:
            </span>
            <span>{isAdminUpload ? '✓ Live on Archive (Admin Verified)' : 'Submitted for Admin Review'}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={onUploadAnother}
            variant="outline"
            className="flex-1 py-3 text-sm flex items-center justify-center gap-2 bg-prevu-surface hover:bg-prevu-surface-light"
          >
            <UploadCloud className="w-4 h-4" />
            Upload Another Paper
          </Button>

          <Button 
            asChild
            className="flex-1 py-3 text-sm flex items-center justify-center gap-2 shadow-lg shadow-prevu-accent/25"
          >
            <Link href="/browse">
              Browse Archive <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

      </div>
    </motion.div>
  )
}
