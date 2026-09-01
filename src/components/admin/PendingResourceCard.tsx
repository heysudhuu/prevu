'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { approveResource, rejectResource } from '@/app/admin/actions'
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  ExternalLink, 
  User, 
  BookOpen, 
  AlertTriangle,
  Loader2
} from 'lucide-react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PendingResourceCard({ resource }: { resource: any; subjects?: any[] }) {
  const [isEditing, setIsEditing] = useState(false)
  
  // Editable fields
  const [subjectName, setSubjectName] = useState(resource.subjects?.name || '')
  const [subjectCode, setSubjectCode] = useState(resource.subjects?.code || '')
  const [examType, setExamType] = useState(resource.exam_types?.name || 'MST1')
  const [examYear, setExamYear] = useState<number>(resource.exam_year || new Date().getFullYear())
  const [academicYear, setAcademicYear] = useState<number>(resource.subjects?.year || 1)
  const [semester, setSemester] = useState<number>(resource.subjects?.semester || 1)

  const [rejectReason, setRejectReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    await approveResource(
      resource.id, 
      isEditing ? {
        subject_name: subjectName,
        subject_code: subjectCode,
        exam_type: examType,
        exam_year: examYear,
        year: academicYear,
        semester: semester
      } : undefined
    )
    setIsLoading(false)
  }

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Please provide or select a reason for rejection.")
      return
    }
    setIsLoading(true)
    await rejectResource(resource.id, rejectReason.trim())
    setIsLoading(false)
  }

  const isImage = resource.file_type?.startsWith('image/')
  const isPdf = resource.file_type === 'application/pdf'

  return (
    <Card className="w-full backdrop-blur-xl bg-prevu-surface/90 border-prevu-surface-light shadow-xl overflow-hidden hover:border-prevu-accent/30 transition-all duration-300">
      
      {/* Top Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-prevu-bg/50 border-b border-prevu-surface-light/60 p-4 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Pending Review
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
              {resource.exam_types?.name || 'MST1'}
            </span>
            <span className="text-xs text-prevu-text-muted font-mono">
              Exam Year: {resource.exam_year}
            </span>
          </div>

          <CardTitle className="text-xl font-bold text-prevu-text">
            {resource.subjects?.name || 'Untitled Subject'} 
            {resource.subjects?.code && <span className="text-prevu-text-muted text-base font-normal ml-2">({resource.subjects.code})</span>}
          </CardTitle>

          <div className="flex flex-wrap items-center gap-3 text-xs text-prevu-text-muted mt-1.5">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-prevu-accent" />
              Uploaded by: <strong className="text-prevu-text">@{resource.users?.username || resource.users?.name || 'anonymous'}</strong>
            </span>
            {resource.users?.cu_verified ? (
              <span className="text-emerald-400 font-medium">✓ CU Verified</span>
            ) : (
              <span className="text-amber-400/80">(Unverified Email)</span>
            )}
            <span>• Sem {resource.subjects?.semester || 1}, Year {resource.subjects?.year || 1}</span>
          </div>
        </div>

        {/* Action button trigger for editing */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs flex items-center gap-1.5 border-prevu-surface-light hover:border-prevu-accent"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Close Editor' : 'Edit Details'}
          </Button>
          {resource.previewUrl && (
            <Button variant="ghost" size="sm" asChild>
              <a href={resource.previewUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Open File
              </a>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Live Document Previewer */}
        <div className="lg:col-span-7 flex flex-col space-y-2">
          <div className="text-xs font-semibold text-prevu-text-muted flex items-center justify-between">
            <span className="truncate max-w-[300px]">File: {resource.original_filename}</span>
            <span className="font-mono uppercase">{resource.file_type?.split('/')[1] || 'DOC'}</span>
          </div>

          <div className="w-full h-[360px] bg-zinc-950/80 rounded-xl border border-prevu-surface-light overflow-hidden flex items-center justify-center relative shadow-inner">
            {resource.previewUrl ? (
              isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={resource.previewUrl} 
                  alt="Paper Preview" 
                  className="w-full h-full object-contain p-2"
                />
              ) : isPdf ? (
                <iframe 
                  src={`${resource.previewUrl}#toolbar=0`} 
                  className="w-full h-full border-0"
                  title="PDF Preview"
                />
              ) : (
                <div className="text-center p-6 text-prevu-text-muted">
                  <BookOpen className="w-12 h-12 mx-auto mb-2 text-prevu-accent/50" />
                  <p className="text-sm font-medium">Document Preview Available</p>
                  <Button size="sm" variant="outline" className="mt-3" asChild>
                    <a href={resource.previewUrl} target="_blank" rel="noopener noreferrer">
                      Download to View
                    </a>
                  </Button>
                </div>
              )
            ) : (
              <div className="text-center p-6 text-prevu-text-muted text-xs">
                Preview not available for this file type.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metadata & Decision Controls */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* Metadata View / Form */}
          {isEditing ? (
            <div className="bg-prevu-bg/80 border border-prevu-surface-light rounded-xl p-4 space-y-3 text-xs">
              <h4 className="font-semibold text-prevu-text text-sm flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-prevu-accent" /> Edit Submission Data
              </h4>

              <div className="space-y-1">
                <label className="text-prevu-text-muted">Subject Name</label>
                <input 
                  type="text" 
                  value={subjectName} 
                  onChange={e => setSubjectName(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text focus:outline-none focus:border-prevu-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-prevu-text-muted">Code</label>
                  <input 
                    type="text" 
                    value={subjectCode} 
                    onChange={e => setSubjectCode(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-prevu-text-muted">Exam Type</label>
                  <select 
                    value={examType} 
                    onChange={e => setExamType(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text"
                  >
                    <option value="MST1">MST 1</option>
                    <option value="MST2">MST 2</option>
                    <option value="EST">EST</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <label className="text-prevu-text-muted">Year</label>
                  <select 
                    value={academicYear} 
                    onChange={e => setAcademicYear(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text"
                  >
                    {[1, 2, 3, 4].map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-prevu-text-muted">Semester</label>
                  <select 
                    value={semester} 
                    onChange={e => setSemester(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-prevu-text-muted">Exam Year</label>
                  <input 
                    type="number" 
                    value={examYear} 
                    onChange={e => setExamYear(Number(e.target.value))}
                    className="w-full px-2 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text font-mono"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-prevu-bg/50 border border-prevu-surface-light/70 rounded-xl p-4 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-prevu-text-muted">Subject:</span>
                <span className="font-semibold text-prevu-text">{subjectName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-prevu-text-muted">Course Code:</span>
                <span className="font-mono text-prevu-text">{subjectCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-prevu-text-muted">Semester & Year:</span>
                <span className="text-prevu-text">Sem {semester} (Year {academicYear})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-prevu-text-muted">Exam & Session:</span>
                <span className="text-prevu-accent font-semibold">{examType} • {examYear}</span>
              </div>
            </div>
          )}

          {/* Rejection Input Box */}
          {isRejecting ? (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-red-400">Select or Type Reason:</label>
                <button 
                  onClick={() => setIsRejecting(false)}
                  className="text-[11px] text-prevu-text-muted hover:text-prevu-text"
                >
                  Cancel
                </button>
              </div>

              {/* Quick Reason Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  'Duplicate resource',
                  'Blurry/unreadable scan',
                  'Incorrect subject/semester',
                  'Incomplete question paper'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setRejectReason(chip)}
                    className="px-2 py-1 bg-prevu-surface text-[11px] rounded-md border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text hover:border-red-400"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              <textarea 
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Write specific feedback for the student..."
                rows={2}
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-lg text-xs text-prevu-text focus:outline-none focus:border-red-400"
              />

              <Button 
                onClick={handleReject} 
                disabled={isLoading || !rejectReason.trim()}
                className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-2"
              >
                {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Confirm Rejection'}
              </Button>
            </div>
          ) : (
            /* Approval Actions */
            <div className="flex gap-3 pt-2">
              <Button 
                onClick={handleApprove} 
                disabled={isLoading}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span>{isEditing ? 'Save & Approve' : 'Approve Paper'}</span>
              </Button>

              <Button 
                variant="outline"
                onClick={() => setIsRejecting(true)}
                disabled={isLoading}
                className="px-4 border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500"
              >
                <XCircle className="w-4 h-4 mr-1.5" />
                Reject
              </Button>
            </div>
          )}

        </div>

      </CardContent>
    </Card>
  )
}
