'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getFormDataOptions, checkHashExists, uploadResource } from './actions'
import { Upload, AlertCircle, Sparkles, BookOpen, Layers, Eye, FileText, CheckCircle2 } from 'lucide-react'
import UploadCelebrationMascot from '@/components/animations/UploadCelebrationMascot'

type Subject = { id: number, name: string, code: string, year: number, semester: number, branch_id: number }

const STUDY_MATERIAL_TYPES = [
  { value: 'Notes', label: 'Lecture & Handwritten Notes', icon: '📝' },
  { value: 'Syllabus', label: 'Syllabus & Course Blueprint', icon: '📑' },
  { value: 'Assignment', label: 'Assignment & Solutions', icon: '📋' },
  { value: 'Lab Manual', label: 'Lab Manual & Practical Guide', icon: '🔬' },
  { value: 'Question Bank', label: 'Question Bank & Important Questions', icon: '❓' },
  { value: 'Book', label: 'Reference Book / Textbook PDF', icon: '📚' },
  { value: 'Cheatsheet', label: 'Formula Sheet & Quick Cheatsheet', icon: '⚡' },
  { value: 'Study Material', label: 'General Study Material / Slides', icon: '💡' },
]

function UploadFormContent() {
  const searchParams = useSearchParams()
  const initialCategory = (searchParams.get('category') === 'study-material' || searchParams.get('type') === 'study-material')
    ? 'study_material' 
    : 'exam_paper'

  const [uploadCategory, setUploadCategory] = useState<'exam_paper' | 'study_material'>(initialCategory)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(1)
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  
  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [examType, setExamType] = useState('MST1')
  const [materialType, setMaterialType] = useState('Notes')
  const [examYear, setExamYear] = useState<number>(new Date().getFullYear())

  const [file, setFile] = useState<File | null>(null)
  const [fileHash, setFileHash] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [duplicateData, setDuplicateData] = useState<any | null>(null)
  const [duplicateAcknowledged, setDuplicateAcknowledged] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAdminUpload, setIsAdminUpload] = useState(false)

  useEffect(() => {
    async function loadOptions() {
      const data = await getFormDataOptions()
      if (data.subjects) setSubjects(data.subjects as Subject[])
    }
    loadOptions()
  }, [])

  // Sync category if query param changes
  useEffect(() => {
    const cat = searchParams.get('category') || searchParams.get('type')
    if (cat === 'study-material' || cat === 'notes') {
      setUploadCategory('study_material')
    }
  }, [searchParams])

  // Filter subjects for the selected semester/year as suggestions
  const suggestedSubjects = subjects.filter(
    s => s.year === selectedYear && s.semester === selectedSemester
  )

  // Compute SHA-256 hash using native Web Crypto API
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    setDuplicateData(null)
    setDuplicateAcknowledged(false)
    setFile(null)
    setFileHash('')
    
    if (!selected) return
    setFile(selected)
    
    try {
      const arrayBuffer = await selected.arrayBuffer()
      if (window.crypto && window.crypto.subtle) {
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
        const hashArray = Array.from(new Uint8Array(hashBuffer))
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
        
        setFileHash(hashHex)
        
        // Check for duplicates
        const duplicate = await checkHashExists(hashHex)
        if (duplicate) {
          setDuplicateData(duplicate)
          setDuplicateAcknowledged(false)
        }
      } else {
        setFileHash(`fallback-hash-${Date.now()}-${Math.random()}`)
      }
    } catch (err) {
      console.error("Hash calculation failed", err)
      setFileHash(`error-hash-${Date.now()}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    if (!subjectName.trim()) {
      setError('Please enter the subject name.')
      return
    }
    
    setError(null)
    setIsUploading(true)
    
    try {
      const formData = new FormData(e.currentTarget)
      formData.append('file', file)
      formData.append('file_hash', fileHash)
      formData.append('year', String(selectedYear))
      formData.append('semester', String(selectedSemester))
      formData.append('subject_name', subjectName.trim())
      formData.append('subject_code', subjectCode.trim())
      formData.append('resource_category', uploadCategory)

      if (uploadCategory === 'study_material') {
        formData.append('material_type', materialType)
        formData.append('exam_type', materialType)
        formData.append('material_year', String(examYear))
        formData.append('exam_year', String(examYear))
      } else {
        formData.append('exam_type', examType)
        formData.append('exam_year', String(examYear))
      }
      
      const result = await uploadResource(formData)
      
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setIsAdminUpload(!!result.isAdminUpload)
        setSuccess(true)
      }
    } catch (err: unknown) {
      console.error('Upload submission failed:', err)
      const message = err instanceof Error ? err.message : 'An unexpected error occurred during upload. Please check your network or try again.'
      setError(message)
    } finally {
      setIsUploading(false)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center p-4 py-12">
        <UploadCelebrationMascot 
          subjectName={subjectName}
          subjectCode={subjectCode}
          examType={uploadCategory === 'study_material' ? materialType : examType}
          examYear={examYear}
          fileName={file?.name}
          isAdminUpload={isAdminUpload}
          isStudyMaterial={uploadCategory === 'study_material'}
          onUploadAnother={() => {
            setSuccess(false)
            setFile(null)
            setFileHash('')
            setSubjectName('')
            setSubjectCode('')
            setDuplicateData(null)
            setDuplicateAcknowledged(false)
            setIsAdminUpload(false)
          }}
        />
      </div>
    )
  }

  const isStudy = uploadCategory === 'study_material'

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center p-4 py-10 overflow-hidden bg-prevu-bg">
      {/* Background ambient lighting */}
      <div className={`absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full blur-[150px] pointer-events-none transition-colors duration-700 ${
        isStudy ? 'bg-emerald-500/15' : 'bg-prevu-accent/15'
      }`} />
      
      <div className="relative z-10 w-full max-w-xl">
        <Card className="w-full backdrop-blur-2xl bg-prevu-surface/90 border-prevu-surface-light shadow-2xl">
          <CardHeader className="space-y-1 pb-4">
            <div className="flex items-center justify-between gap-2">
              <div className={`flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider ${
                isStudy ? 'text-emerald-400' : 'text-prevu-accent'
              }`}>
                <Sparkles className="w-4 h-4" />
                <span>Prevu Academic Vault</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-prevu-surface-light text-prevu-text-muted border border-prevu-surface-light">
                BE-CSE All Years
              </span>
            </div>

            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              {isStudy ? 'Upload Study Material & Notes' : 'Upload Past Exam Paper'}
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-prevu-text-muted">
              {isStudy 
                ? 'Share notes, syllabus guides, assignments, and revision materials for fellow students.' 
                : 'Share past exam papers (MST 1, MST 2, EST) for BE-CSE students.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5">
            {/* Category Selector Tabs */}
            <div className="p-1 bg-prevu-bg/90 rounded-2xl border border-prevu-surface-light flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => setUploadCategory('exam_paper')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  !isStudy
                    ? 'bg-prevu-accent text-white shadow-lg shadow-prevu-accent/30'
                    : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Question Paper (PYQ)</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadCategory('study_material')}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  isStudy
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25'
                    : 'text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light/40'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Study Material & Notes</span>
              </button>
            </div>

            <form id="upload-form" onSubmit={handleSubmit} className="space-y-5">
              
              {/* Year & Semester Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="year">
                    Academic Year
                  </label>
                  <select 
                    id="year" 
                    value={selectedYear}
                    onChange={(e) => {
                      const yr = Number(e.target.value)
                      setSelectedYear(yr)
                      setSelectedSemester(yr * 2 - 1)
                    }}
                    className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors cursor-pointer"
                  >
                    {[1, 2, 3, 4].map(y => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="semester">
                    Semester
                  </label>
                  <select 
                    id="semester" 
                    value={selectedSemester}
                    onChange={(e) => setSelectedSemester(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors cursor-pointer"
                  >
                    {[selectedYear * 2 - 1, selectedYear * 2].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subject Name & Subject Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="subject_name">
                      Subject Name
                    </label>
                    <span className="text-[11px] text-prevu-accent font-medium">Write or select</span>
                  </div>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                    <input 
                      type="text"
                      id="subject_name"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g. Operating Systems, DBMS, DSA..."
                      list="subjects-datalist"
                      required
                      className="w-full pl-10 pr-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent transition-colors"
                    />
                    <datalist id="subjects-datalist">
                      {suggestedSubjects.map(s => (
                        <option key={s.id} value={s.name}>{s.code}</option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="subject_code">
                    Code <span className="text-prevu-text-muted/60 font-normal">(Optional)</span>
                  </label>
                  <input 
                    type="text"
                    id="subject_code"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value.toUpperCase())}
                    placeholder="e.g. 21CS201"
                    className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent transition-colors font-mono uppercase"
                  />
                </div>
              </div>

              {/* Dynamic Row: If Study Material -> Material Type; If Exam Paper -> Exam Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {isStudy ? (
                  /* Study Material Type Selector */
                  <div className="space-y-1.5 sm:col-span-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-emerald-400" htmlFor="material_type">
                        Study Material Type
                      </label>
                      <span className="text-[10px] font-mono text-emerald-400/80">Category</span>
                    </div>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                      <select 
                        id="material_type" 
                        value={materialType}
                        onChange={(e) => setMaterialType(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-prevu-bg border border-emerald-500/30 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-400 transition-colors font-medium cursor-pointer"
                      >
                        {STUDY_MATERIAL_TYPES.map(t => (
                          <option key={t.value} value={t.value}>
                            {t.icon} {t.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ) : (
                  /* Exam Type Selector (MST1, MST2, EST) */
                  <div className="space-y-1.5 sm:col-span-1">
                    <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="exam_type">
                      Exam Type
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                      <select 
                        id="exam_type" 
                        value={examType}
                        onChange={(e) => setExamType(e.target.value)}
                        required
                        className="w-full pl-10 pr-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors font-medium cursor-pointer"
                      >
                        <option value="MST1">MST 1 (Mid Semester 1)</option>
                        <option value="MST2">MST 2 (Mid Semester 2)</option>
                        <option value="EST">EST (End Semester Test)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Academic Session / Exam Year */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="exam_year">
                    {isStudy ? 'Academic Year / Session' : 'Exam Year'}
                  </label>
                  <input 
                    type="number" 
                    id="exam_year" 
                    value={examYear}
                    onChange={(e) => setExamYear(Number(e.target.value))}
                    required
                    min={2015}
                    max={new Date().getFullYear() + 1}
                    className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors font-mono"
                  />
                </div>
              </div>

              {/* File Upload Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="file">
                    {isStudy ? 'Document / Notes File' : 'Document / Question Paper'}
                  </label>
                  <span className="text-[10px] text-prevu-text-muted font-mono">PDF, DOCX, PPT, JPG up to 50MB</span>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    id="file" 
                    accept=".pdf, .jpg, .jpeg, .png, .doc, .docx, .xls, .xlsx, .ppt, .pptx"
                    required
                    onChange={handleFileChange}
                    className="w-full text-xs text-prevu-text-muted file:mr-3 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-prevu-accent/15 file:text-prevu-accent hover:file:bg-prevu-accent/25 cursor-pointer border border-prevu-surface-light rounded-xl p-2 bg-prevu-bg"
                  />
                </div>
              </div>
              
              {/* Duplicate Detection Alert */}
              {duplicateData && !duplicateAcknowledged && (
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Possible Duplicate Resource Detected</span>
                  </div>
                  
                  <div className="text-xs text-prevu-text-muted space-y-1 bg-prevu-bg/80 p-3 rounded-xl border border-prevu-surface-light">
                    <p className="text-white font-semibold">
                      {duplicateData.subjects?.name || 'Resource'} {duplicateData.subjects?.code ? `(${duplicateData.subjects.code})` : ''} — {duplicateData.exam_year} {duplicateData.exam_types?.name || 'File'}
                    </p>
                    <p className="text-[11px] font-mono text-prevu-text-muted truncate">
                      File: {duplicateData.original_filename}
                    </p>
                  </div>

                  <p className="text-[11px] text-prevu-text-muted leading-relaxed">
                    A file with the identical fingerprint already exists in the vault. If this is a revised version, clearer scan, or additional chapter notes, click <strong>Upload Anyway</strong> to proceed.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Button size="sm" variant="outline" asChild className="h-8 text-xs border-amber-500/40 text-amber-300 hover:bg-amber-500/15">
                      <a href={`/paper/${duplicateData.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-3.5 h-3.5 mr-1" /> View Existing
                      </a>
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={() => setDuplicateAcknowledged(true)} 
                      className="h-8 text-xs bg-amber-500 text-black font-bold hover:bg-amber-400"
                    >
                      Upload Anyway
                    </Button>
                    <Button 
                      type="button" 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => {
                        setFile(null)
                        setFileHash('')
                        setDuplicateData(null)
                        setDuplicateAcknowledged(false)
                        const el = document.getElementById('file') as HTMLInputElement
                        if (el) el.value = ''
                      }} 
                      className="h-8 text-xs text-prevu-text-muted hover:text-white"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {duplicateData && duplicateAcknowledged && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-between text-xs text-amber-300">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-amber-400" />
                    <span>Duplicate acknowledged. Your upload will be submitted for moderation review.</span>
                  </span>
                </div>
              )}
              
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl flex items-start gap-2.5 text-xs text-red-400">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </form>
          </CardContent>

          <CardFooter className="pt-2">
            <Button 
              type="submit" 
              form="upload-form" 
              className={`w-full py-3 text-sm flex items-center justify-center gap-2 font-bold shadow-lg transition-all ${
                isStudy 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25' 
                  : 'shadow-prevu-accent/25'
              }`}
              disabled={isUploading || !file || !fileHash || !subjectName.trim() || (!!duplicateData && !duplicateAcknowledged)}
            >
              <Upload className="w-4 h-4" />
              {isUploading 
                ? 'Uploading & Hashing Document...' 
                : isStudy 
                  ? 'Submit Study Material' 
                  : 'Submit Question Paper'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-prevu-accent" />
      </div>
    }>
      <UploadFormContent />
    </Suspense>
  )
}
