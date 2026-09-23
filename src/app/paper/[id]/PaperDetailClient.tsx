'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  Download, 
  Eye, 
  Bookmark, 
  Share2, 
  Flag, 
  ShieldCheck, 
  CheckCircle, 
  FileText, 
  GraduationCap, 
  ArrowLeft, 
  Check, 
  Clock, 
  Layers,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ResourceCard } from '@/components/ResourceCard'
import { toggleBookmark } from '@/app/dashboard/actions'
import { submitReport } from '@/app/admin/actions'

interface PaperDetailClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paper: any
  initialIsBookmarked: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sameSubjectPapers: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sameTypePapers: any[]
}

export default function PaperDetailClient({
  paper,
  initialIsBookmarked,
  sameSubjectPapers,
  sameTypePapers
}: PaperDetailClientProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isSaving, setIsSaving] = useState(false)
  const [copiedShare, setCopiedShare] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportReason, setReportReason] = useState('wrong_subject')
  const [reportNote, setReportNote] = useState('')
  const [reportStatus, setReportStatus] = useState<'idle' | 'submitting' | 'submitted' | 'error'>('idle')

  const subject = paper.subjects
  const examType = paper.exam_types?.name || 'MST'
  const uploader = paper.users
  const isAdmin = uploader?.role === 'admin'
  const isVerified = uploader?.cu_verified

  const examBadgeVariant = 
    examType === 'MST1' ? 'mst1' : 
    examType === 'MST2' ? 'mst2' : 
    examType === 'EST' ? 'est' : 'stamp'

  const formattedDate = paper.created_at
    ? new Date(paper.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Unknown Date'

  const handleToggleBookmark = async () => {
    setIsSaving(true)
    try {
      const res = await toggleBookmark(paper.id)
      if (res.success && typeof res.bookmarked === 'boolean') {
        setIsBookmarked(res.bookmarked)
      }
    } catch (err) {
      console.error('Bookmark toggle failed', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = async () => {
    if (typeof window === 'undefined') return
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${subject?.name || 'Question Paper'} - ${paper.exam_year} ${examType}`,
          text: `Check out this verified ${paper.exam_year} ${examType} question paper for ${subject?.name || 'CSE'} on Prevu.`,
          url: url
        })
        return
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(url)
    setCopiedShare(true)
    setTimeout(() => setCopiedShare(false), 2500)
  }

  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault()
    setReportStatus('submitting')
    try {
      const res = await submitReport({
        resourceId: paper.id,
        reason: reportReason,
        notes: reportNote
      })
      if (res.success) {
        setReportStatus('submitted')
      } else {
        setReportStatus('error')
      }
    } catch {
      setReportStatus('error')
    }
  }

  return (
    <div className="space-y-12">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-prevu-text-muted">
        <Link href="/browse" className="hover:text-white flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Archive
        </Link>
        <span>/</span>
        {subject?.code && (
          <>
            <Link href={`/subject/${encodeURIComponent(subject.code)}`} className="hover:text-white transition-colors">
              {subject.code}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-white font-mono font-medium truncate max-w-[200px] sm:max-w-none">
          {paper.exam_year} {examType} Paper
        </span>
      </div>

      {/* Main Metadata & Actions Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-prevu-surface border border-prevu-surface-light shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 relative z-10">
          <div className="space-y-4 max-w-3xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={examBadgeVariant}>
                {examType}
              </Badge>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-prevu-bg text-white border border-prevu-surface-light">
                {paper.exam_year}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                {subject?.code || 'CSE'}
              </span>
              <span className="text-xs font-mono text-prevu-text-muted">
                Semester {subject?.semester || 1} • Year {subject?.year || 1}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug">
              {subject?.name || 'Question Paper'}
            </h1>

            {/* Sub-meta bar */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-prevu-text-muted pt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-prevu-accent" />
                <span>Uploaded {formattedDate}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-prevu-accent" />
                <span>Format: PDF Document</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-mono text-white font-semibold">{paper.download_count || 0} downloads</span>
              </div>
            </div>

            {/* Uploader Card */}
            <div className="pt-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-prevu-bg border border-prevu-surface-light flex items-center justify-center text-prevu-accent font-bold text-sm">
                {uploader?.name ? uploader.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs">
                  <span className="text-prevu-text-muted">Contributed by</span>
                  <strong className="text-white">
                    {isAdmin ? 'Prevu Official Vault' : `@${uploader?.username || uploader?.name || 'student'}`}
                  </strong>
                  {isAdmin ? (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.2 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40 uppercase">
                      <ShieldCheck className="w-3 h-3" /> Staff
                    </span>
                  ) : isVerified ? (
                    <span className="inline-flex items-center gap-0.5 text-emerald-400" title="CU Verified Student">
                      <CheckCircle className="w-3.5 h-3.5" />
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-prevu-text-muted/70">
                  {isAdmin ? 'Curated from university examination archives' : 'Community verified submission'}
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 w-full sm:w-auto">
            <Button
              size="lg"
              onClick={() => setPreviewOpen(true)}
              className="bg-prevu-accent text-white font-bold shadow-lg shadow-prevu-accent/25 hover:bg-prevu-accent-hover"
            >
              <Eye className="w-4 h-4 mr-2" /> Preview Paper
            </Button>

            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-prevu-surface-light hover:border-prevu-accent/50 font-bold"
            >
              <a href={`/api/download/${paper.id}`} download>
                <Download className="w-4 h-4 mr-2 text-emerald-400" /> Download PDF
              </a>
            </Button>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToggleBookmark}
                disabled={isSaving}
                className={`text-xs border border-prevu-surface-light ${
                  isBookmarked ? 'bg-prevu-accent/15 text-prevu-accent border-prevu-accent/40' : 'text-prevu-text-muted hover:text-white'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Paper'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-xs border border-prevu-surface-light text-prevu-text-muted hover:text-white"
                title="Share Paper Link"
              >
                {copiedShare ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReportModalOpen(true)}
                className="text-xs border border-prevu-surface-light text-prevu-text-muted hover:text-rose-400 hover:border-rose-500/40"
                title="Report Inaccurate Paper"
              >
                <Flag className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Hub Quick Bridge */}
      {subject && (
        <div className="p-4 sm:p-5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Explore the complete {subject.code} Subject Hub
              </h3>
              <p className="text-xs text-prevu-text-muted">
                View syllabus blueprint units, coverage matrix, and recommended study kits.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="border-prevu-surface-light text-xs font-semibold">
              <Link href={`/exam-prep?sem=${subject.semester}&subject=${subject.id}`}>
                Open in Exam Prep
              </Link>
            </Button>
            <Button size="sm" asChild className="bg-prevu-accent text-white font-bold text-xs">
              <Link href={`/subject/${encodeURIComponent(subject.code)}`}>
                Subject Hub <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Related Papers from Same Subject */}
      {sameSubjectPapers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-prevu-accent" />
                More Question Papers for {subject?.name || 'this Subject'}
              </h2>
              <p className="text-xs text-prevu-text-muted mt-0.5">
                Archived examination papers across other years and test formats.
              </p>
            </div>
            {subject?.code && (
              <Link
                href={`/subject/${encodeURIComponent(subject.code)}`}
                className="text-xs font-mono text-prevu-accent hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sameSubjectPapers.map(p => (
              <ResourceCard key={p.id} resource={p} />
            ))}
          </div>
        </section>
      )}

      {/* Same Exam Type in this Semester */}
      {sameTypePapers.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-400" />
                Other Semester {subject?.semester} {examType} Papers
              </h2>
              <p className="text-xs text-prevu-text-muted mt-0.5">
                Prepare for your upcoming {examType} exam season across all subjects.
              </p>
            </div>
            <Link
              href={`/browse?sem=${subject?.semester}&type=${paper.exam_type_id}`}
              className="text-xs font-mono text-prevu-accent hover:underline flex items-center gap-1"
            >
              Browse semester papers <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sameTypePapers.map(p => (
              <ResourceCard key={p.id} resource={p} />
            ))}
          </div>
        </section>
      )}

      {/* In-Browser PDF Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="bg-prevu-surface border border-prevu-surface-light rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-prevu-surface-light flex items-center justify-between bg-prevu-bg/50">
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 px-2 py-0.5 rounded">
                  {examType} • {paper.exam_year}
                </span>
                <span className="text-sm font-bold text-white truncate">
                  {subject?.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button size="sm" variant="outline" asChild className="h-8 text-xs border-prevu-surface-light">
                  <a href={`/api/download/${paper.id}`} download>
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </a>
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setPreviewOpen(false)} className="h-8 text-xs">
                  Close
                </Button>
              </div>
            </div>

            {/* Iframe preview */}
            <div className="flex-1 bg-zinc-900 relative">
              <iframe
                src={`/api/preview/${paper.id}#toolbar=0`}
                className="w-full h-full border-none"
                title={`${subject?.name} Preview`}
              />
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-prevu-surface border border-prevu-surface-light rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-prevu-surface-light pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flag className="w-4 h-4 text-rose-400" />
                Report Question Paper Issue
              </h3>
              <button
                onClick={() => {
                  setReportModalOpen(false)
                  setReportStatus('idle')
                }}
                className="text-prevu-text-muted hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            {reportStatus === 'submitted' ? (
              <div className="text-center py-6 space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Report Submitted</h4>
                <p className="text-xs text-prevu-text-muted">
                  Thank you! Our student moderation team will inspect this paper and correct any inaccuracies.
                </p>
                <Button
                  size="sm"
                  onClick={() => {
                    setReportModalOpen(false)
                    setReportStatus('idle')
                  }}
                  className="mt-2 text-xs bg-prevu-accent"
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-xs">
                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1.5">
                    What seems to be the problem?
                  </label>
                  <select
                    value={reportReason}
                    onChange={e => setReportReason(e.target.value)}
                    className="w-full bg-prevu-bg border border-prevu-surface-light rounded-xl p-2.5 text-white focus:outline-none focus:border-prevu-accent"
                  >
                    <option value="wrong_subject">Incorrect Course or Subject Tag</option>
                    <option value="incorrect_year">Incorrect Examination Year</option>
                    <option value="duplicate">Duplicate Paper Already Exists</option>
                    <option value="illegible">Blurry / Incomplete / Illegible Scan</option>
                    <option value="watermark">Obtrusive Watermark / Spam</option>
                    <option value="copyright">Copyright Concern</option>
                    <option value="other">Other Academic Inaccuracy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1.5">
                    Additional Context (optional)
                  </label>
                  <textarea
                    value={reportNote}
                    onChange={e => setReportNote(e.target.value)}
                    placeholder="Provide any details to help moderators verify..."
                    rows={3}
                    className="w-full bg-prevu-bg border border-prevu-surface-light rounded-xl p-2.5 text-white focus:outline-none focus:border-prevu-accent"
                  />
                </div>

                {reportStatus === 'error' && (
                  <p className="text-rose-400 text-xs">
                    Failed to submit report. Please try again later.
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-prevu-surface-light">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setReportModalOpen(false)}
                    className="text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    disabled={reportStatus === 'submitting'}
                    className="text-xs bg-rose-600 hover:bg-rose-500 text-white font-bold"
                  >
                    {reportStatus === 'submitting' ? 'Submitting...' : 'Submit Report'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
