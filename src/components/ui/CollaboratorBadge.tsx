'use client'

import React from 'react'
import { Trophy, Crown, Shield, Zap, Star, CheckCircle2, Award } from 'lucide-react'

export type CollaboratorTier = 'legend' | 'guardian' | 'hunter' | 'hero' | 'contributor'

export interface CollaboratorInfo {
  karma?: number
  rank?: number
  role?: string
  isVerified?: boolean
  tier?: CollaboratorTier
}

export function getCollaboratorTier(karma: number = 0, rank?: number): {
  tier: CollaboratorTier
  title: string
  icon: string
  color: string
  ringColor: string
  glowColor: string
  bgGradient: string
} {
  if (rank === 1 || karma >= 100) {
    return {
      tier: 'legend',
      title: 'Campus Legend',
      icon: '👑',
      color: 'text-amber-300 bg-amber-500/15 border-amber-500/40 shadow-amber-500/20',
      ringColor: 'ring-2 ring-amber-400 border-amber-400',
      glowColor: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      bgGradient: 'from-amber-500 to-yellow-400'
    }
  }

  if (rank === 2 || karma >= 75) {
    return {
      tier: 'guardian',
      title: 'Vault Guardian',
      icon: '🛡️',
      color: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/40 shadow-emerald-500/20',
      ringColor: 'ring-2 ring-emerald-400 border-emerald-400',
      glowColor: 'shadow-[0_0_20px_rgba(16,185,129,0.3)]',
      bgGradient: 'from-emerald-500 to-teal-400'
    }
  }

  if (rank === 3 || karma >= 45) {
    return {
      tier: 'hunter',
      title: 'Bounty Hunter',
      icon: '⚡',
      color: 'text-purple-300 bg-purple-500/15 border-purple-500/40 shadow-purple-500/20',
      ringColor: 'ring-2 ring-purple-400 border-purple-400',
      glowColor: 'shadow-[0_0_18px_rgba(168,85,247,0.3)]',
      bgGradient: 'from-purple-500 to-prevu-accent'
    }
  }

  if (karma >= 20) {
    return {
      tier: 'hero',
      title: 'Semester Hero',
      icon: '⭐',
      color: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/40 shadow-cyan-500/20',
      ringColor: 'ring-2 ring-cyan-400 border-cyan-400',
      glowColor: 'shadow-[0_0_15px_rgba(6,182,212,0.25)]',
      bgGradient: 'from-cyan-500 to-blue-400'
    }
  }

  return {
    tier: 'contributor',
    title: 'Contributor',
    icon: '🌱',
    color: 'text-zinc-300 bg-zinc-800/80 border-zinc-700/60',
    ringColor: 'ring-1 ring-zinc-600 border-zinc-600',
    glowColor: 'shadow-none',
    bgGradient: 'from-zinc-600 to-zinc-500'
  }
}

/**
 * Visual pill badge displayed next to user names or profile cards
 */
export function CollaboratorBadge({
  karma = 0,
  rank,
  className = '',
  size = 'md',
  showKarma = true
}: {
  karma?: number
  rank?: number
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showKarma?: boolean
}) {
  const meta = getCollaboratorTier(karma, rank)

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-xs font-bold gap-2'
  }[size]

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold border backdrop-blur-md shadow-sm transition-all ${meta.color} ${sizeClasses} ${className}`}
      title={`${meta.title} (${karma} Karma points)`}
    >
      <span className="text-xs">{meta.icon}</span>
      <span>{meta.title}</span>
      {showKarma && karma > 0 && (
        <span className="font-mono opacity-80 font-normal">
          • {karma} pts
        </span>
      )}
    </span>
  )
}

/**
 * Avatar decorator ring and crown indicator for Top Collaborators
 */
export function CollaboratorAvatar({
  name,
  avatarUrl,
  karma = 0,
  rank,
  isVerified = false,
  size = 48,
  className = ''
}: {
  name?: string
  avatarUrl?: string | null
  karma?: number
  rank?: number
  isVerified?: boolean
  size?: number
  className?: string
}) {
  const meta = getCollaboratorTier(karma, rank)
  const initial = (name || 'S').charAt(0).toUpperCase()

  const isTopRanked = rank && rank <= 3
  const crownIcon = rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {/* Outer ambient glow for top collaborators */}
      {isTopRanked && (
        <div 
          className="absolute -inset-1 rounded-2xl opacity-75 blur-sm transition-all"
          style={{
            background: rank === 1 
              ? 'linear-gradient(135deg, #f59e0b, #fbbf24)' 
              : rank === 2 
              ? 'linear-gradient(135deg, #10b981, #14b8a6)' 
              : 'linear-gradient(135deg, #a855f7, #ec4899)'
          }}
        />
      )}

      {/* Main Avatar Container */}
      <div 
        className={`relative rounded-2xl overflow-hidden flex items-center justify-center font-bold text-white bg-gradient-to-br from-zinc-800 to-zinc-950 ${meta.ringColor} ${meta.glowColor}`}
        style={{ width: size, height: size }}
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={name || 'Avatar'} className="w-full h-full object-cover" />
        ) : (
          <span style={{ fontSize: size * 0.42 }} className="font-sans font-extrabold text-white">
            {initial}
          </span>
        )}
      </div>

      {/* Top Corner Crown Badge for Top 3 */}
      {crownIcon && (
        <span 
          className="absolute -top-2.5 -right-2 text-sm drop-shadow-md select-none transform hover:scale-110 transition-transform"
          title={`Rank #${rank} Collaborator`}
        >
          {crownIcon}
        </span>
      )}

      {/* Verified Student Checkmark Pill */}
      {isVerified && !crownIcon && (
        <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-black border-2 border-prevu-bg flex items-center justify-center text-[10px] font-black shadow-sm">
          ✓
        </span>
      )}
    </div>
  )
}
