'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createPaperRequest } from '@/app/dashboard/actions'
import { 
  HelpCircle, 
  X, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface RequestPaperModalProps {
  isOpen: boolean
  onClose: () => void
  initialBranch?: string | null
  initialSubject?: string
}

const PREVU_BRANCHES = [
  { id: 'BE-CSE', label: 'BE Computer Science (BE-CSE)' },
  { id: 'ECE', label: 'Electronics & Comm. (ECE)' },
  { id: 'ME', label: 'Mechanical Engineering (ME)' },
  { id: 'CIVIL', label: 'Civil Engineering (CE)' },
  { id: 'BIOTECH', label: 'Biotechnology (BT)' },
  { id: 'BCA_MCA', label: 'BCA / MCA Computer Apps' },
  { id: 'MGMT', label: 'USB - MBA & BBA Management' },
  { id: 'PHARMACY', label: 'UIPS - Pharmacy & Pharma' },
  { id: 'LAW_AHS', label: 'UILS - Law & Allied Health' },
  { id: 'OTHER', label: 'Other Department / Open Elective' }
]

export default function RequestPaperModal({
  isOpen,
  onClose,
  initialBranch,
  initialSubject = ''
}: RequestPaperModalProps) {
  const [branch, setBranch] = useState(initialBranch || 'BE-CSE')
  const [subjectName, setSubjectName] = useState(initialSubject)
  const [examType, setExamType] = useState('MST1')
  const [examYear, setExamYear] = useState<number>(new Date().getFullYear())
  const [semester, setSemester] = useState<number>(1)
  const [note, setNote] = useState('')
  const [studentName, setStudentName] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null
  if (typeof document === 'undefined') return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('subject_name', subjectName.trim())
    formData.append('branch', branch)
    formData.append('exam_type', examType)
    formData.append('exam_year', String(examYear))
    formData.append('semester', String(semester))
    formData.append('note', note.trim())
    if (studentName.trim()) {
      formData.append('student_name', studentName.trim())
    }

    const res = await createPaperRequest(formData)
    setIsSubmitting(false)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
        setSubjectName('')
        setNote('')
      }, 2500)
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          className="w-full max-w-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="border border-purple-500/30 bg-prevu-surface/95 shadow-2xl shadow-purple-950/40 rounded-3xl overflow-hidden backdrop-blur-xl">
            
            {/* Header */}
            <CardHeader className="p-5 sm:p-6 border-b border-prevu-surface-light bg-gradient-to-r from-purple-950/40 to-prevu-surface">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>Peer Study Network</span>
                  </div>
                  <CardTitle className="text-xl font-extrabold text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-prevu-accent" />
                    <span>Request Missing Paper</span>
                  </CardTitle>
                  <p className="text-xs text-prevu-text-muted leading-relaxed">
                    Can&apos;t find an exam paper? Post your request and student peers or digitizers will find and upload it!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </CardHeader>

            {/* Form Body */}
            <CardContent className="p-5 sm:p-6 space-y-4">
              {success ? (
                <div className="py-8 px-4 text-center space-y-4">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-lg font-bold text-white">Paper Request Posted! 🎉</h4>
                    <p className="text-xs text-prevu-text-muted max-w-sm mx-auto leading-relaxed">
                      We have added your request to the Prevu Community Board. Volunteers and classmates can now see it and upload the paper.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button 
                      asChild 
                      variant="outline" 
                      size="sm" 
                      className="text-xs border-purple-500/30 text-purple-300 hover:text-white"
                      onClick={onClose}
                    >
                      <Link href="/dashboard?tab=requests">
                        <span>View Community Requests Board</span>
                        <ExternalLink className="w-3 h-3 ml-1.5" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <form id="paper-request-form" onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* Branch & Semester Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-prevu-text flex items-center justify-between">
                        <span>Branch / Department</span>
                        <span className="text-[10px] text-prevu-accent font-mono">Any branch</span>
                      </label>
                      <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text font-medium focus:outline-none focus:border-prevu-accent cursor-pointer"
                      >
                        {PREVU_BRANCHES.map((b) => (
                          <option key={b.id} value={b.id} className="bg-prevu-surface text-white">
                            {b.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-prevu-text">
                        Semester
                      </label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text font-medium focus:outline-none focus:border-prevu-accent cursor-pointer"
                      >
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                          <option key={s} value={s} className="bg-prevu-surface text-white">
                            Semester {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Subject Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-prevu-text flex items-center justify-between">
                      <span>Subject Name or Course Code</span>
                      <span className="text-[10px] text-red-400">*Required</span>
                    </label>
                    <input
                      type="text"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g. Digital Signal Processing / CST-201 / Operating Systems"
                      required
                      className="w-full px-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent focus:ring-1 focus:ring-prevu-accent"
                    />
                  </div>

                  {/* Exam Type & Year */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-prevu-text">Exam Pattern</label>
                      <select
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text font-medium focus:outline-none focus:border-prevu-accent cursor-pointer"
                      >
                        <option value="MST1" className="bg-prevu-surface text-white">MST 1</option>
                        <option value="MST2" className="bg-prevu-surface text-white">MST 2</option>
                        <option value="EST" className="bg-prevu-surface text-white">EST (End Semester)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-prevu-text">Exam Year</label>
                      <input
                        type="number"
                        value={examYear}
                        onChange={(e) => setExamYear(Number(e.target.value))}
                        required
                        min={2018}
                        max={new Date().getFullYear() + 1}
                        className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white font-mono focus:outline-none focus:border-prevu-accent"
                      />
                    </div>
                  </div>

                  {/* Notes / Special Details */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-prevu-text flex items-center justify-between">
                      <span>Specific Notes (Optional)</span>
                      <span className="text-[10px] text-prevu-text-muted">Set A/B, syllabus unit, etc.</span>
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Need the 2024 regular paper Set A, or unit 3 & 4 numerical questions..."
                      rows={2}
                      className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent resize-none"
                    />
                  </div>

                  {/* Optional Requester Name/Contact for guests */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-prevu-text flex items-center justify-between">
                      <span>Your Name or Student UID (Optional)</span>
                      <span className="text-[10px] text-prevu-text-muted">For peer attribution</span>
                    </label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="e.g. Rahul Sharma (21BCS...)"
                      className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent"
                    />
                  </div>

                  {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                </form>
              )}
            </CardContent>

            {/* Footer */}
            {!success && (
              <CardFooter className="p-5 sm:p-6 border-t border-prevu-surface-light flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-prevu-surface/60">
                <Link
                  href="/dashboard?tab=requests"
                  onClick={onClose}
                  className="text-xs text-purple-300 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Open Full Requests Board</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                    className="text-xs border-prevu-surface-light hover:border-prevu-accent cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    form="paper-request-form"
                    size="sm"
                    disabled={isSubmitting}
                    className="text-xs font-bold shadow-lg shadow-purple-500/25 bg-prevu-accent hover:bg-prevu-accent/90 cursor-pointer min-w-[110px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-1.5">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Posting...</span>
                      </span>
                    ) : (
                      <span>Submit Request</span>
                    )}
                  </Button>
                </div>
              </CardFooter>
            )}

          </Card>
        </motion.div>
      </AnimatePresence>
    </div>,
    document.body
  )
}
