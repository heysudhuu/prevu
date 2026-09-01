'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { createPaperRequest } from '@/app/dashboard/actions'
import { 
  HelpCircle, 
  Plus, 
  UploadCloud, 
  CheckCircle2, 
  Loader2, 
  AlertCircle 
} from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

interface PaperRequestsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requests: any[]
}

export default function PaperRequestsBoard({ requests: initialRequests }: PaperRequestsProps) {
  const [requests] = useState(initialRequests || [])
  const [showModal, setShowModal] = useState(false)
  
  // Form state
  const [subjectName, setSubjectName] = useState('')
  const [examType, setExamType] = useState('MST1')
  const [examYear, setExamYear] = useState<number>(new Date().getFullYear())
  const [semester, setSemester] = useState<number>(1)
  const [note, setNote] = useState('')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('subject_name', subjectName.trim())
    formData.append('exam_type', examType)
    formData.append('exam_year', String(examYear))
    formData.append('semester', String(semester))
    formData.append('note', note.trim())

    const res = await createPaperRequest(formData)

    setIsSubmitting(false)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setShowModal(false)
        setSubjectName('')
        setNote('')
      }, 2000)
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Header with Request Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Missing Paper Requests</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
              Community Board
            </span>
          </h3>
          <p className="text-xs text-prevu-text-muted mt-0.5">
            Can’t find a past year question paper? Request it here and classmates can upload it for you.
          </p>
        </div>

        <Button 
          onClick={() => setShowModal(true)}
          className="text-xs py-2 px-4 flex items-center gap-1.5 shadow-lg shadow-prevu-accent/20 font-bold"
        >
          <Plus className="w-4 h-4" /> Request a Missing Paper
        </Button>
      </div>

      {/* Request Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg"
            >
              <Card className="border-prevu-surface-light bg-prevu-surface shadow-2xl">
                <CardHeader className="pb-3 border-b border-prevu-surface-light/60">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-prevu-accent" />
                      Request a Past Paper
                    </CardTitle>
                    <button 
                      onClick={() => setShowModal(false)}
                      className="text-xs text-prevu-text-muted hover:text-white cursor-pointer"
                    >
                      ✕ Close
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="p-5">
                  <form id="request-form" onSubmit={handleSubmit} className="space-y-4">
                    
                    <div className="space-y-1">
                      <label className="text-xs text-prevu-text-muted">Subject Name</label>
                      <input 
                        type="text"
                        value={subjectName}
                        onChange={e => setSubjectName(e.target.value)}
                        placeholder="e.g. Operating Systems"
                        required
                        className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-xs text-prevu-text-muted">Exam Type</label>
                        <select 
                          value={examType}
                          onChange={e => setExamType(e.target.value)}
                          className="w-full px-2 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text font-medium"
                        >
                          <option value="MST1">MST 1</option>
                          <option value="MST2">MST 2</option>
                          <option value="EST">EST</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-prevu-text-muted">Exam Year</label>
                        <input 
                          type="number" 
                          value={examYear}
                          onChange={e => setExamYear(Number(e.target.value))}
                          required
                          min={2018}
                          max={new Date().getFullYear()}
                          className="w-full px-2 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-prevu-text-muted">Semester</label>
                        <select 
                          value={semester}
                          onChange={e => setSemester(Number(e.target.value))}
                          className="w-full px-2 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                            <option key={s} value={s}>Sem {s}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-prevu-text-muted">Specific Requirements (Optional)</label>
                      <textarea 
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="e.g. Looking specifically for Set A or 2023 regular batch question paper"
                        rows={2}
                        className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent"
                      />
                    </div>

                    {error && (
                      <div className="p-2.5 bg-red-500/10 border border-red-500/25 rounded-lg text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    {success && (
                      <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-xs text-emerald-400 flex items-center gap-2 font-medium">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Request posted to the community board! 🎉</span>
                      </div>
                    )}

                  </form>
                </CardContent>

                <CardFooter className="p-5 border-t border-prevu-surface-light/60 flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => setShowModal(false)} className="text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" form="request-form" size="sm" disabled={isSubmitting} className="text-xs font-bold">
                    {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Post Request'}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Requests Cards List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {requests.length === 0 ? (
          <div className="col-span-full p-10 text-center border border-dashed border-prevu-surface-light rounded-3xl bg-prevu-surface/30">
            <HelpCircle className="w-8 h-8 text-prevu-text-muted/40 mx-auto mb-2" />
            <h4 className="font-bold text-sm text-white">No Open Requests</h4>
            <p className="text-xs text-prevu-text-muted mt-1">
              Have a question paper that is missing? Click above to post a request to your classmates.
            </p>
          </div>
        ) : (
          requests.map((req) => (
            <div 
              key={req.id}
              className="p-4 rounded-2xl bg-prevu-surface/85 border border-prevu-surface-light hover:border-purple-500/40 transition-all flex flex-col justify-between shadow-lg space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-purple-500/15 text-purple-300 border border-purple-500/25">
                    {req.exam_type} • {req.exam_year}
                  </span>
                  <span className="text-[10px] text-prevu-text-muted">
                    Sem {req.semester}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-white">
                  {req.subject_name}
                </h4>

                {req.note && (
                  <p className="text-xs text-prevu-text-muted mt-1.5 italic bg-prevu-bg/70 p-2 rounded-lg border border-prevu-surface-light/40">
                    &ldquo;{req.note}&rdquo;
                  </p>
                )}

                <div className="text-[11px] text-prevu-text-muted mt-2">
                  Requested by: <strong className="text-prevu-text">@{req.users?.username || 'student'}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-prevu-surface-light/60">
                <Button 
                  size="sm" 
                  className="w-full text-xs h-8 bg-prevu-accent/15 hover:bg-prevu-accent/25 text-prevu-accent border border-prevu-accent/30 flex items-center justify-center gap-1.5"
                  asChild
                >
                  <Link href={`/upload?subject=${encodeURIComponent(req.subject_name)}&type=${req.exam_type}&sem=${req.semester}&year=${Math.ceil(req.semester / 2)}`}>
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>I Have This Paper — Upload</span>
                  </Link>
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  )
}
