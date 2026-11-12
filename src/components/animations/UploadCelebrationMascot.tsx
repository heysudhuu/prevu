'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, UploadCloud, CheckCircle2, ShieldCheck, Trophy, FileText, Layers, Hash } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'

interface CelebrationProps {
  subjectName: string
  subjectCode?: string
  examType: string
  examYear: number
  fileName?: string
  isAdminUpload?: boolean
  isStudyMaterial?: boolean
  onUploadAnother: () => void
}

export default function UploadCelebrationMascot({
  subjectName,
  subjectCode,
  examType,
  examYear,
  fileName,
  isAdminUpload,
  isStudyMaterial = false,
  onUploadAnother
}: CelebrationProps) {
  const [karmaCounter, setKarmaCounter] = useState(0)

  // Animated Karma counter effect
  useEffect(() => {
    let current = 0
    const target = isAdminUpload ? 50 : 25
    const timer = setInterval(() => {
      current += 1
      setKarmaCounter(current)
      if (current >= target) {
        clearInterval(timer)
      }
    }, 40)
    return () => clearInterval(timer)
  }, [isAdminUpload])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: 'spring', damping: 24, stiffness: 300 }}
      className="w-full max-w-xl mx-auto text-center"
    >
      <div className="relative backdrop-blur-3xl bg-[#0b0c14]/95 border border-purple-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_50px_rgba(139,92,246,0.18)] overflow-hidden">

        {/* Ambient Top Glow & Conic Radial Aura */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-purple-600/30 via-cyan-500/20 to-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Animated Scanning Grid Lines in Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {/* ============================================================ */}
        {/* 1. HOLOGRAPHIC DOCUMENT VACUUM & LASER BEAM ANIMATION */}
        {/* ============================================================ */}
        <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">

          {/* Concentric Rotating Hologram Energy Rings */}
          <motion.div
            className="absolute inset-0 rounded-full border border-purple-500/30 border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-3 rounded-full border border-cyan-400/30 border-t-transparent border-b-transparent"
            animate={{ rotate: -360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          />
          <motion.div
            className="absolute inset-6 rounded-full bg-gradient-to-tr from-purple-600/15 via-cyan-500/15 to-emerald-500/20 blur-md"
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.9, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Futuristic Mascot Vee Celebrating in Center */}
          <motion.div
            className="relative z-20 flex flex-col items-center"
            initial={{ scale: 0.8, y: 15 }}
            animate={{ scale: 1, y: [0, -6, 0] }}
            transition={{
              scale: { duration: 0.5 },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
            }}
          >
            {/* Robot Head with Pulsing Antenna */}
            <div className="relative">
              {/* Antenna with Hologram Signal Rings */}
              <div className="flex flex-col items-center absolute -top-5 left-1/2 -translate-x-1/2 z-10">
                <motion.div
                  className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_#22d3ee]"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="w-0.5 h-3 bg-gradient-to-b from-cyan-400 to-purple-500" />
              </div>

              {/* Robot Head Helmet */}
              <div className="w-20 h-16 rounded-2xl bg-gradient-to-b from-[#1f1d36] to-[#121124] border-2 border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.35)] flex items-center justify-center relative overflow-hidden">
                {/* Visor Glare & Curved Glass */}
                <div className="absolute inset-1.5 rounded-xl bg-black/90 border border-purple-500/40 flex items-center justify-center px-2">
                  {/* Glowing Cyan/Violet Eyes */}
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                      animate={{ scaleY: [1, 1, 0.1, 1] }}
                      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.92, 0.95, 1] }}
                    />
                    <motion.div
                      className="w-3.5 h-3.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                      animate={{ scaleY: [1, 1, 0.1, 1] }}
                      transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.92, 0.95, 1] }}
                    />
                  </div>
                  {/* Digital scanline inside visor */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent pointer-events-none animate-scanline" />
                </div>
              </div>

              {/* Cheerful Robot Hands with Holographic Thumbs Up */}
              <motion.div
                className="absolute -left-4 top-8 px-2 py-1 rounded-lg bg-purple-900/80 border border-purple-500/50 shadow-md text-[10px] font-bold text-white flex items-center gap-1"
                animate={{ rotate: [-8, 8, -8] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                👍
              </motion.div>
              <motion.div
                className="absolute -right-4 top-8 px-2 py-1 rounded-lg bg-emerald-900/80 border border-emerald-500/50 shadow-md text-[10px] font-bold text-emerald-300 flex items-center gap-1"
                animate={{ rotate: [8, -8, 8] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              >
                ✨
              </motion.div>
            </div>
          </motion.div>

          {/* Holographic Laser Scanner Sweep at Base */}
          <motion.div
            className="absolute bottom-1 w-32 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee]"
            animate={{ opacity: [0.3, 1, 0.3], scaleX: [0.7, 1.1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* ============================================================ */}
        {/* 2. DYNAMIC KARMA AWARD BADGE & STATUS */}
        {/* ============================================================ */}
        <div className="space-y-2 mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-lg shadow-amber-500/10">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>+{karmaCounter} KARMA CREDITED</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Vault Indexing Complete! 🚀
          </h2>

          <p className="text-xs sm:text-sm text-prevu-text-muted max-w-md mx-auto leading-relaxed">
            Your document was verified and synchronized into the <strong className="text-white">Prevu Academic Vault</strong> for Chandigarh University scholars.
          </p>
        </div>

        {/* ============================================================ */}
        {/* 3. HOLOGRAPHIC DOCUMENT RECEIPT CARD */}
        {/* ============================================================ */}
        <div className="bg-[#090912]/80 border border-prevu-surface-light rounded-2xl p-4 sm:p-5 text-left mb-6 space-y-3 shadow-inner">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-prevu-text-muted flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-prevu-accent" />
              <span>Course:</span>
            </span>
            <span className="font-bold text-white truncate max-w-[240px]">
              {subjectName} {subjectCode ? `(${subjectCode})` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="text-prevu-text-muted flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>Classification:</span>
            </span>
            <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md ${isStudyMaterial
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                : 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
              }`}>
              {examType} • {examYear}
            </span>
          </div>

          {fileName && (
            <div className="flex items-center justify-between text-xs sm:text-sm truncate">
              <span className="text-prevu-text-muted flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-amber-400" />
                <span>Uploaded File:</span>
              </span>
              <span className="font-mono text-xs text-prevu-text-muted truncate max-w-[200px]">
                {fileName}
              </span>
            </div>
          )}

          <div className="pt-2.5 border-t border-prevu-surface-light/60 flex items-center justify-between text-xs text-emerald-400 font-semibold">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verification Status:</span>
            </span>
            <span>{isAdminUpload ? '✓ Instant Live Vault Publishing' : '✓ Verified & Queued for Moderation'}</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. ACTION BUTTONS */}
        {/* ============================================================ */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={onUploadAnother}
            variant="outline"
            className="flex-1 py-3 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-[#12121f] border-prevu-surface-light text-prevu-text hover:text-white hover:border-purple-500/50 cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 text-cyan-400" />
            <span>Upload Another Document</span>
          </Button>

          <Button
            asChild
            className={`flex-1 py-3 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg cursor-pointer ${isStudyMaterial
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25'
                : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/30'
              }`}
          >
            <Link href="/leaderboard">
              <span>View Hall of Fame</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

      </div>
    </motion.div>
  )
}
