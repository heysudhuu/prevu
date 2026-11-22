'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { approveResource, rejectResource, updateResourceDetails } from '@/app/admin/actions'
import { 
  CheckCircle, 
  XCircle, 
  Edit3, 
  ExternalLink, 
  User, 
  BookOpen, 
  AlertTriangle,
  Loader2,
  ShieldAlert,
  FileText,
  FolderGit2,
  GraduationCap,
  Sparkles,
  Layers
} from 'lucide-react'
import { checkDuplicatePaper } from '@/lib/admin/duplicateDetection'

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  )
}

type SectionType = 'regular_pyq' | 'study_material' | 'reappear'

function getSectionMeta(examTypeName?: string | null): {
  section: SectionType
  label: string
  badgeClass: string
} {
  const name = (examTypeName || '').toLowerCase()
  if (
    name.includes('80/20') ||
    name.includes('reappear') ||
    name.includes('backlog') ||
    name.includes('passing plan')
  ) {
    return {
      section: 'reappear',
      label: 'Reappear Hub',
      badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    }
  }
  if (
    name.includes('note') ||
    name.includes('syllabus') ||
    name.includes('reference') ||
    name.includes('assignment') ||
    name.includes('bank') ||
    name.includes('manual') ||
    name.includes('book')
  ) {
    return {
      section: 'study_material',
      label: 'Study Material',
      badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
    }
  }
  return {
    section: 'regular_pyq',
    label: 'Regular PYQ',
    badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
  }
}

function getFormatMeta(format?: string | null) {
  switch (format) {
    case 'youtube':
      return {
        label: 'YouTube',
        icon: YouTubeIcon,
        badgeClass: 'bg-red-500/15 text-red-300 border-red-500/30'
      }
    case 'gdrive':
      return {
        label: 'Google Drive',
        icon: FolderGit2,
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
      }
    default:
      return {
        label: 'File / PDF',
        icon: FileText,
        badgeClass: 'bg-zinc-700/40 text-zinc-300 border-zinc-600/40'
      }
  }
}

const SECTION_CATEGORIES: Record<SectionType, string[]> = {
  regular_pyq: ['MST1', 'MST2', 'EST'],
  study_material: [
    'Notes',
    'Syllabus',
    'Reference Book',
    'Assignment Solution',
    'Question Bank',
    'Lab Manual',
    'Handwritten Notes'
  ],
  reappear: [
    '80/20 High-Yield Notes',
    'Reappear Question Bank',
    'Syllabus & Passing Plan'
  ]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PendingResourceCard({ resource, existingPapers = [] }: { resource: any; subjects?: any[]; existingPapers?: any[] }) {
  const [isEditing, setIsEditing] = useState(false)
  
  // Intelligent Duplicate Check (#16)
  const dupCheck = useMemo(() => {
    return checkDuplicatePaper(
      {
        subjectName: resource.subjects?.name || '',
        subjectCode: resource.subjects?.code || '',
        examType: resource.exam_types?.name || 'MST1',
        examYear: resource.exam_year || 2024,
        fileName: resource.original_filename,
        fileSize: resource.file_size
      },
      existingPapers.map(e => ({
        id: e.id,
        subject_name: e.subjects?.name,
        subject_code: e.subjects?.code,
        exam_type: e.exam_types?.name,
        exam_year: e.exam_year,
        file_name: e.original_filename || e.file_path,
        file_size: e.file_size
      }))
    )
  }, [resource, existingPapers])
  
  const sec = getSectionMeta(resource.exam_types?.name)
  const fmt = getFormatMeta(resource.resource_format)
  const FormatIcon = fmt.icon

  // Editable fields
  const [editTitle, setEditTitle] = useState(resource.original_filename || '')
  const [subjectName, setSubjectName] = useState(resource.subjects?.name || '')
  const [subjectCode, setSubjectCode] = useState(resource.subjects?.code || '')
  const [targetSection, setTargetSection] = useState<SectionType>(sec.section)
  const [examType, setExamType] = useState(resource.exam_types?.name || 'MST1')
  const [examYear, setExamYear] = useState<number>(resource.exam_year || new Date().getFullYear())
  const [academicYear, setAcademicYear] = useState<number>(resource.subjects?.year || 1)
  const [semester, setSemester] = useState<number>(resource.subjects?.semester || 1)
  const [unit, setUnit] = useState<string>(resource.unit || '')
  const [format, setFormat] = useState<'file' | 'gdrive' | 'youtube'>(resource.resource_format || 'file')
  const [externalUrl, setExternalUrl] = useState(resource.external_url || '')
  const [channelName, setChannelName] = useState(resource.channel_name || '')

  const [rejectReason, setRejectReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleApprove = async () => {
    setIsLoading(true)
    if (isEditing) {
      const payload: Parameters<typeof updateResourceDetails>[0] = {
        id: resource.id,
        title: editTitle,
        subject_name: subjectName,
        subject_code: subjectCode,
        exam_type: examType,
        exam_year: examYear,
        year: academicYear,
        semester: semester,
        unit: unit ? unit : null,
        status: 'approved'
      }

      if (format !== 'file') {
        payload.resource_format = format
        if (externalUrl.trim()) payload.external_url = externalUrl.trim()
        if (format === 'youtube' && channelName.trim()) {
          payload.channel_name = channelName.trim()
        }
      }

      await updateResourceDetails(payload)
    } else {
      await approveResource(resource.id)
    }
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
  const isExternal = (resource.resource_format === 'youtube' || resource.resource_format === 'gdrive') && (resource.external_url || resource.previewUrl)

  return (
    <Card className="w-full backdrop-blur-xl bg-prevu-surface/90 border-prevu-surface-light shadow-xl overflow-hidden hover:border-prevu-accent/30 transition-all duration-300">
      
      {/* Top Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-prevu-bg/50 border-b border-prevu-surface-light/60 p-4 sm:p-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Pending Review
            </span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border ${sec.badgeClass}`}>
              {sec.label}
            </span>
            <span className={`px-2.5 py-0.5 rounded-md text-xs font-mono font-medium border flex items-center gap-1 ${fmt.badgeClass}`}>
              <FormatIcon className="w-3 h-3" />
              {fmt.label}
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
              {resource.exam_types?.name || 'MST1'}
            </span>
            {resource.unit && (
              <span className="px-2 py-0.5 rounded text-xs font-mono bg-purple-500/15 text-purple-300 border border-purple-500/30">
                {resource.unit}
              </span>
            )}
            <span className="text-xs text-prevu-text-muted font-mono">
              Exam Year: {resource.exam_year}
            </span>
          </div>

          <CardTitle className="text-xl font-bold text-prevu-text">
            {resource.original_filename || resource.subjects?.name || 'Untitled Resource'} 
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
            {resource.channel_name && (
              <span className="text-red-400 font-medium flex items-center gap-1">
                <YouTubeIcon className="w-3 h-3" /> {resource.channel_name}
              </span>
            )}
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
            {isEditing ? 'Close Editor' : 'Edit Details & Route'}
          </Button>

          {isExternal ? (
            <Button variant="ghost" size="sm" asChild>
              <a href={resource.external_url || resource.previewUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1 text-blue-400">
                <ExternalLink className="w-3.5 h-3.5" /> Open Link
              </a>
            </Button>
          ) : resource.previewUrl ? (
            <Button variant="ghost" size="sm" asChild>
              <a href={resource.previewUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1">
                <ExternalLink className="w-3.5 h-3.5" /> Open File
              </a>
            </Button>
          ) : null}
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6 space-y-4">
        {/* Intelligent Duplicate Warning Banner (#16) */}
        {dupCheck.isDuplicate && (
          <div className="p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold">
                  <span>Intelligent Duplicate Radar</span>
                  <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-rose-500/30 text-rose-200">
                    {dupCheck.confidence}% Match
                  </span>
                </div>
                <p className="text-[11px] text-rose-200/90 mt-0.5">
                  {dupCheck.reason}
                </p>
              </div>
            </div>

            {dupCheck.matchedPaperId && (
              <Button size="sm" variant="outline" asChild className="text-xs h-7 border-rose-500/40 text-rose-300 hover:bg-rose-500/20 shrink-0">
                <Link href={`/paper/${dupCheck.matchedPaperId}`} target="_blank">
                  Compare Live Paper <ExternalLink className="w-3 h-3 ml-1" />
                </Link>
              </Button>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Document Previewer / External Viewer */}
          <div className="lg:col-span-7 flex flex-col space-y-2">
            <div className="text-xs font-semibold text-prevu-text-muted flex items-center justify-between">
              <span className="truncate max-w-[300px]">
                {resource.resource_format === 'youtube'
                  ? `YouTube: ${resource.channel_name || 'Lecture'}`
                  : resource.resource_format === 'gdrive'
                  ? 'Cloud Drive Folder'
                  : `File: ${resource.original_filename}`}
              </span>
              <span className="font-mono uppercase">{resource.resource_format || resource.file_type || 'DOC'}</span>
            </div>

            <div className="w-full h-[360px] bg-zinc-950/80 rounded-xl border border-prevu-surface-light overflow-hidden flex items-center justify-center relative shadow-inner">
              {resource.resource_format === 'youtube' ? (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mx-auto">
                    <YouTubeIcon className="w-9 h-9" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-prevu-text">{resource.original_filename || 'YouTube Lecture Recommendation'}</h5>
                    <p className="text-xs text-prevu-text-muted mt-1">{resource.channel_name ? `Educator: ${resource.channel_name}` : 'Curated video resource'}</p>
                  </div>
                  <Button size="sm" className="bg-red-600 hover:bg-red-500 text-white text-xs" asChild>
                    <a href={resource.external_url || resource.previewUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Watch on YouTube
                    </a>
                  </Button>
                </div>
              ) : resource.resource_format === 'gdrive' ? (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
                    <FolderGit2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h5 className="font-bold text-sm text-prevu-text">Google Drive Material Folder</h5>
                    <p className="text-xs text-prevu-text-muted mt-1">Shared student cloud drive collection</p>
                  </div>
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-500 text-white text-xs" asChild>
                    <a href={resource.external_url || resource.previewUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3.5 h-3.5 mr-1" /> Open Drive Folder
                    </a>
                  </Button>
                </div>
              ) : resource.previewUrl ? (
                isImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img 
                    src={resource.previewUrl} 
                    alt="Resource Preview" 
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

          {/* Right Column: Metadata, Direction & Decision Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            
            {/* Metadata View / Form */}
            {isEditing ? (
              <div className="bg-prevu-bg/80 border border-prevu-surface-light rounded-xl p-4 space-y-3 text-xs max-h-[380px] overflow-y-auto">
                <h4 className="font-semibold text-prevu-text text-sm flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-prevu-accent" /> Re-route & Edit Details
                </h4>

                {/* Section Direction Switcher */}
                <div className="space-y-1">
                  <label className="text-prevu-text-muted font-bold flex items-center gap-1">
                    <Layers className="w-3 h-3 text-purple-400" /> Target Section
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTargetSection('regular_pyq')
                        if (!SECTION_CATEGORIES.regular_pyq.includes(examType)) setExamType('MST1')
                      }}
                      className={`py-1 px-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                        targetSection === 'regular_pyq'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold'
                          : 'bg-prevu-surface border-prevu-surface-light text-zinc-400'
                      }`}
                    >
                      Regular PYQ
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetSection('study_material')
                        if (!SECTION_CATEGORIES.study_material.includes(examType)) setExamType('Notes')
                      }}
                      className={`py-1 px-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                        targetSection === 'study_material'
                          ? 'bg-blue-500/20 border-blue-500 text-blue-300 font-bold'
                          : 'bg-prevu-surface border-prevu-surface-light text-zinc-400'
                      }`}
                    >
                      Study Material
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTargetSection('reappear')
                        if (!SECTION_CATEGORIES.reappear.includes(examType)) setExamType('80/20 High-Yield Notes')
                      }}
                      className={`py-1 px-1.5 rounded-lg border text-[11px] font-medium transition-colors ${
                        targetSection === 'reappear'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-prevu-surface border-prevu-surface-light text-zinc-400'
                      }`}
                    >
                      Reappear Hub
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-prevu-text-muted">Resource Title</label>
                  <input 
                    type="text" 
                    value={editTitle} 
                    onChange={e => setEditTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text focus:outline-none focus:border-prevu-accent"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-prevu-text-muted">Category / Format</label>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {SECTION_CATEGORIES[targetSection].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setExamType(cat)}
                        className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                          examType === cat
                            ? 'bg-purple-600 text-white border-purple-500'
                            : 'bg-prevu-surface border-prevu-surface-light text-zinc-400'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={examType} 
                    onChange={e => setExamType(e.target.value)}
                    className="w-full px-2.5 py-1 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text font-mono text-[11px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-prevu-text-muted">Subject Name</label>
                    <input 
                      type="text" 
                      value={subjectName} 
                      onChange={e => setSubjectName(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-prevu-text-muted">Code</label>
                    <input 
                      type="text" 
                      value={subjectCode} 
                      onChange={e => setSubjectCode(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="space-y-1">
                    <label className="text-prevu-text-muted">Semester</label>
                    <select 
                      value={semester} 
                      onChange={e => {
                        const s = Number(e.target.value)
                        setSemester(s)
                        setAcademicYear(Math.ceil(s / 2))
                      }}
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
                  <div className="space-y-1">
                    <label className="text-prevu-text-muted">Unit</label>
                    <select
                      value={unit}
                      onChange={e => setUnit(e.target.value)}
                      className="w-full px-2 py-1.5 bg-prevu-surface border border-prevu-surface-light rounded-lg text-prevu-text"
                    >
                      <option value="">None</option>
                      <option value="All Units">All Units</option>
                      <option value="Unit 1">Unit 1</option>
                      <option value="Unit 2">Unit 2</option>
                      <option value="Unit 3">Unit 3</option>
                      <option value="Unit 4">Unit 4</option>
                      <option value="Unit 5">Unit 5</option>
                    </select>
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
                  <span className="text-prevu-text-muted">Category & Session:</span>
                  <span className="text-prevu-accent font-semibold">{examType} • {examYear}</span>
                </div>
                {unit && (
                  <div className="flex justify-between">
                    <span className="text-prevu-text-muted">Unit Coverage:</span>
                    <span className="text-purple-300 font-mono">{unit}</span>
                  </div>
                )}
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
                    'Incomplete question paper',
                    'Broken external link'
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
                  <span>{isEditing ? 'Save & Approve' : 'Approve Submission'}</span>
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
        </div>

      </CardContent>
    </Card>
  )
}
