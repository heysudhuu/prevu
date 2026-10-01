'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Plus,
  FileText,
  BookOpen,
  HelpCircle,
  Clock,
  CheckCircle,
  Users,
  Sparkles,
  ShieldCheck,
  ThumbsUp,
  MessageCircle,
  Zap,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface PreviewRequest {
  id: number
  subject_name: string
  request_type?: string
  exam_type?: string
  exam_year?: number
  semester?: number
  note?: string
  status: string
  created_at: string
  upvotes: number
  pendingResponsesCount?: number
  users?: {
    name: string
    username?: string
    cu_verified?: boolean
  }
}

interface CommunityRequestsPreviewProps {
  requests: PreviewRequest[]
  totalCount: number
}

const REQUEST_TYPE_CONFIG: Record<string, { label: string; color: string; bg: string; border: string; icon: React.ReactNode }> = {
  pyq: {
    label: 'Question Paper',
    color: 'text-purple-300',
    bg: 'bg-purple-500/15',
    border: 'border-purple-500/30',
    icon: <FileText className="w-3.5 h-3.5 text-purple-400" />
  },
  study_material: {
    label: 'Study Notes',
    color: 'text-emerald-300',
    bg: 'bg-emerald-500/15',
    border: 'border-emerald-500/30',
    icon: <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
  },
  doubt: {
    label: 'Academic Doubt',
    color: 'text-amber-300',
    bg: 'bg-amber-500/15',
    border: 'border-amber-500/30',
    icon: <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
  }
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  open: {
    label: 'Open – Needs Help',
    color: 'text-sky-300',
    icon: <Clock className="w-3 h-3 text-sky-400" />
  },
  in_review: {
    label: 'Response Under Review',
    color: 'text-amber-300',
    icon: <ShieldCheck className="w-3 h-3 text-amber-400" />
  },
  fulfilled: {
    label: 'Fulfilled & Verified',
    color: 'text-emerald-300',
    icon: <CheckCircle className="w-3 h-3 text-emerald-400" />
  }
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function RequestCard({ req, index }: { req: PreviewRequest; index: number }) {
  const typeConf = REQUEST_TYPE_CONFIG[req.request_type || 'pyq'] || REQUEST_TYPE_CONFIG.pyq
  const statusConf = STATUS_CONFIG[req.status] || STATUS_CONFIG.open

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col gap-3 p-4 sm:p-5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light hover:border-purple-500/40 hover:bg-prevu-surface/95 transition-all duration-200 shadow-lg"
    >
      {/* Top: Type Badge + Status + Time */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold ${typeConf.bg} ${typeConf.color} ${typeConf.border} border`}>
          {typeConf.icon}
          <span>{typeConf.label}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1 text-[11px] font-medium ${statusConf.color}`}>
            {statusConf.icon}
            <span className="hidden sm:inline">{statusConf.label}</span>
          </div>
          <span className="text-[11px] text-prevu-text-muted font-mono">
            {timeAgo(req.created_at)}
          </span>
        </div>
      </div>

      {/* Subject & Details */}
      <div>
        <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-prevu-accent transition-colors leading-tight">
          {req.subject_name}
          {req.exam_type && req.exam_year && (
            <span className="text-prevu-text-muted font-normal text-xs ml-2">
              · {req.exam_type} {req.exam_year}
            </span>
          )}
          {req.semester && (
            <span className="ml-2 text-[11px] px-2 py-0.5 rounded-lg bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted font-mono">
              Sem {req.semester}
            </span>
          )}
        </h3>
        {req.note && (
          <p className="text-xs text-prevu-text-muted mt-1 line-clamp-2 leading-relaxed">
            {req.note}
          </p>
        )}
      </div>

      {/* Footer: Requester + Stats + Help CTA */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-prevu-surface-light/50">
        <div className="flex items-center gap-1.5 min-w-0">
          <div className="w-5 h-5 rounded-full bg-prevu-accent/20 border border-prevu-accent/30 flex items-center justify-center text-[10px] font-bold text-prevu-accent shrink-0">
            {(req.users?.name || 'S')[0].toUpperCase()}
          </div>
          <span className="text-[11px] text-prevu-text-muted truncate">
            {req.users?.name || 'A Student'}
            {req.users?.cu_verified && (
              <span className="ml-1 text-cyan-400">✓</span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {req.upvotes > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-prevu-text-muted">
              <ThumbsUp className="w-3 h-3" />
              <span>{req.upvotes}</span>
            </div>
          )}
          {(req.pendingResponsesCount || 0) > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-amber-400">
              <MessageCircle className="w-3 h-3" />
              <span>{req.pendingResponsesCount} pending</span>
            </div>
          )}
          <Link
            href={`/requests`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 text-[11px] font-bold border border-purple-500/30 hover:border-purple-500/60 transition-all"
          >
            Help <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

export default function CommunityRequestsPreview({
  requests,
  totalCount
}: CommunityRequestsPreviewProps) {
  const [activeTab, setActiveTab] = useState<'open' | 'all'>('open')

  const displayed = requests
    .filter(r => activeTab === 'all' || r.status === 'open')
    .slice(0, 6)

  const openCount = requests.filter(r => r.status === 'open').length
  const inReviewCount = requests.filter(r => r.status === 'in_review').length

  return (
    <section className="py-24 relative overflow-hidden bg-prevu-bg border-b border-prevu-surface-light">
      {/* Ambient glow */}
      <div className="absolute left-1/4 top-10 w-[500px] h-[500px] rounded-full bg-purple-600/8 blur-[160px] pointer-events-none" />
      <div className="absolute right-1/4 bottom-10 w-[400px] h-[400px] rounded-full bg-indigo-500/8 blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10">

        {/* Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Community Help Board</span>
              {openCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-purple-500/30 text-purple-200 text-[10px] font-mono">
                  {openCount} open
                </span>
              )}
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight text-white"
            >
              Your Batchmates Need Help.{' '}
              <span className="text-gradient-purple">Will You Step Up?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="text-sm sm:text-base text-prevu-text-muted leading-relaxed"
            >
              Students are requesting PYQs, notes, and academic help. Share what you have — admin verifies it, and it becomes available for everyone.
            </motion.p>
          </div>

          {/* Stats Strip */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="flex items-center gap-4 p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl shrink-0"
          >
            <div className="text-center px-4 border-r border-prevu-surface-light">
              <div className="text-2xl font-extrabold font-mono text-sky-400">{openCount}</div>
              <div className="text-[10px] text-prevu-text-muted font-semibold mt-0.5">Open Requests</div>
            </div>
            <div className="text-center px-4 border-r border-prevu-surface-light">
              <div className="text-2xl font-extrabold font-mono text-amber-400">{inReviewCount}</div>
              <div className="text-[10px] text-prevu-text-muted font-semibold mt-0.5">Under Review</div>
            </div>
            <div className="text-center px-4">
              <div className="text-2xl font-extrabold font-mono text-purple-400">{totalCount}</div>
              <div className="text-[10px] text-prevu-text-muted font-semibold mt-0.5">Total Requests</div>
            </div>
          </motion.div>
        </div>

        {/* How It Works — 4-step pill */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 p-4 rounded-2xl bg-gradient-to-r from-purple-950/50 via-prevu-surface to-indigo-950/50 border border-purple-500/25 shadow-lg"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-0 sm:divide-x sm:divide-prevu-surface-light">
            {[
              { icon: <Users className="w-4 h-4 text-purple-400" />, text: 'Register your ID on Prevu', color: 'text-purple-300' },
              { icon: <Plus className="w-4 h-4 text-sky-400" />, text: 'Post or view requests', color: 'text-sky-300' },
              { icon: <Sparkles className="w-4 h-4 text-emerald-400" />, text: 'Share resources to help', color: 'text-emerald-300' },
              { icon: <ShieldCheck className="w-4 h-4 text-amber-400" />, text: 'Admin verifies & it goes live', color: 'text-amber-300' }
            ].map((step, i) => (
              <div key={i} className="flex items-center gap-2.5 sm:px-5 first:pl-0 last:pr-0 text-xs font-medium">
                <span className="w-7 h-7 rounded-xl flex items-center justify-center bg-prevu-bg border border-prevu-surface-light shrink-0">
                  {step.icon}
                </span>
                <span className={step.color}>{step.text}</span>
                {i < 3 && <ArrowRight className="w-3 h-3 text-prevu-surface-light hidden sm:inline-block ml-2" />}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-prevu-surface rounded-2xl border border-prevu-surface-light">
            {[
              { id: 'open' as const, label: `Open Requests (${openCount})` },
              { id: 'all' as const, label: 'All Requests' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'text-prevu-text-muted hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs font-bold"
              asChild
            >
              <Link href="/requests?action=new">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Raise a Request
              </Link>
            </Button>
            <Button size="sm" className="text-xs font-bold shadow-md shadow-prevu-accent/25" asChild>
              <Link href="/requests">
                <Zap className="w-3.5 h-3.5 mr-1" />
                View All
              </Link>
            </Button>
          </div>
        </div>

        {/* Request Cards Grid */}
        {displayed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {displayed.map((req, i) => (
              <RequestCard key={req.id} req={req} index={i} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 rounded-3xl bg-prevu-surface/50 border border-prevu-surface-light text-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-bold">No open requests right now</p>
              <p className="text-xs text-prevu-text-muted mt-1">Be the first to request a PYQ or study material!</p>
            </div>
            <Button size="sm" asChild>
              <Link href="/requests?action=new">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Raise a Request
              </Link>
            </Button>
          </div>
        )}

        {/* Footer CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-prevu-surface/60 border border-prevu-surface-light"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-prevu-accent/15 border border-prevu-accent/30 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-prevu-accent" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Admin-verified responses only</p>
              <p className="text-xs text-prevu-text-muted">Every shared resource is reviewed before going live on the dashboard.</p>
            </div>
          </div>
          <Link
            href="/requests"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-prevu-accent hover:text-white transition-colors shrink-0"
          >
            <span>Explore Full Community Board</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
