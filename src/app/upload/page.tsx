'use client'

import { useState, useEffect, useRef, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getFormDataOptions, checkHashExists, uploadResource, prepareDirectUpload, completeDirectUpload } from './actions'
import { createClient } from '@/utils/supabase/client'
import { 
  Upload, AlertCircle, Sparkles, BookOpen, Layers, Eye, FileText, 
  CheckCircle2, CloudUpload, Clipboard, Loader2, ShieldCheck, Check, 
  Wand2, AlertTriangle, Sparkle 
} from 'lucide-react'
import UploadCelebrationMascot from '@/components/animations/UploadCelebrationMascot'
import { analyzeImageQuality, autoEnhanceDocumentScan, type QualityAnalysisResult } from '@/lib/scanner/scanQuality'
import { detectMetadataFromFile, type DetectedMetadata } from '@/lib/scanner/autoDetect'

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

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Uploads a file directly to Supabase storage signed URL with live byte-level progress reporting via XHR,
 * with automatic fallback to Supabase client / fetch in case of network variance.
 */
function uploadFileWithProgress(
  prepared: { filePath: string; token: string; signedUrl: string; mimeType: string },
  file: File,
  supabase: ReturnType<typeof createClient>,
  onProgress: (loadedBytes: number, totalBytes: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest()
      xhr.open('PUT', prepared.signedUrl, true)

      // Supabase storage signed upload URLs expect multipart FormData with file body
      const formData = new FormData()
      formData.append('cacheControl', '3600')
      formData.append('', file)

      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable && evt.total > 0) {
          onProgress(evt.loaded, evt.total)
        }
      }

      xhr.onload = async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress(file.size, file.size)
          resolve()
        } else {
          console.warn(`XHR direct upload returned HTTP ${xhr.status}, falling back to Supabase client:`, xhr.responseText)
          try {
            const { error: uploadError } = await supabase.storage
              .from('resources')
              .uploadToSignedUrl(prepared.filePath, prepared.token, file, {
                contentType: prepared.mimeType,
                upsert: false
              })

            if (uploadError) {
              const putRes = await fetch(prepared.signedUrl, {
                method: 'PUT',
                headers: { 'Content-Type': prepared.mimeType || 'application/octet-stream' },
                body: file
              })
              if (!putRes.ok) {
                throw new Error(`Upload failed with status ${putRes.status}`)
              }
            }
            onProgress(file.size, file.size)
            resolve()
          } catch (fallbackErr: any) {
            reject(new Error(fallbackErr?.message || `Failed to upload ${file.name}`))
          }
        }
      }

      xhr.onerror = async () => {
        console.warn('XHR network event error, attempting Supabase client fallback')
        try {
          const { error: uploadError } = await supabase.storage
            .from('resources')
            .uploadToSignedUrl(prepared.filePath, prepared.token, file, {
              contentType: prepared.mimeType,
              upsert: false
            })

          if (uploadError) {
            const putRes = await fetch(prepared.signedUrl, {
              method: 'PUT',
              headers: { 'Content-Type': prepared.mimeType || 'application/octet-stream' },
              body: file
            })
            if (!putRes.ok) {
              throw new Error(`Upload failed with status ${putRes.status}`)
            }
          }
          onProgress(file.size, file.size)
          resolve()
        } catch (fallbackErr: any) {
          reject(new Error(fallbackErr?.message || 'Network error during upload. Please check your connection.'))
        }
      }

      xhr.ontimeout = () => reject(new Error('Upload request timed out. Please try again.'))

      xhr.send(formData)
    } catch (err) {
      reject(err)
    }
  })
}

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
  const [unitNumber, setUnitNumber] = useState<string>('Unit 1')
  const [examYear, setExamYear] = useState<number>(new Date().getFullYear())

  const [files, setFiles] = useState<File[]>([])
  const [fileHash, setFileHash] = useState<string>('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [duplicateData, setDuplicateData] = useState<any | null>(null)
  const [duplicateAcknowledged, setDuplicateAcknowledged] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStage, setUploadStage] = useState<'idle' | 'preparing' | 'uploading' | 'finalizing' | 'complete'>('idle')
  const [totalBytesUploaded, setTotalBytesUploaded] = useState(0)
  const [totalBytesOverall, setTotalBytesOverall] = useState(0)
  const [currentFileIndex, setCurrentFileIndex] = useState(0)
  const [fileProgressMap, setFileProgressMap] = useState<Record<string, number>>({})
  const [autoDetected, setAutoDetected] = useState<DetectedMetadata | null>(null)
  const [qualityMap, setQualityMap] = useState<Record<string, QualityAnalysisResult>>({})
  const [enhancingIndex, setEnhancingIndex] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isAdminUpload, setIsAdminUpload] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgressText, setUploadProgressText] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  // Mirror of files state — lets addFiles read current value without functional updaters
  const filesRef = useRef<File[]>([])

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

  // Accepted extensions check
  const ACCEPTED_EXTS = ['pdf','jpg','jpeg','png','webp','doc','docx','xls','xlsx','ppt','pptx']
  const isAcceptedFile = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    return ACCEPTED_EXTS.includes(ext) || file.type.startsWith('image/')
  }

  // Keep filesRef in sync with files state so addFiles always has the latest snapshot
  useEffect(() => { filesRef.current = files }, [files])

  // Shared handler to process incoming files for smart auto-detection & quality inspection
  const processIncomingFiles = useCallback(async (incomingFiles: File[]) => {
    const primary = incomingFiles[0]
    if (primary && subjects.length > 0) {
      try {
        const detected = await detectMetadataFromFile(primary, subjects)
        if (detected) {
          setAutoDetected(detected)

          // Pre-fill form fields automatically
          if (detected.subjectName) setSubjectName(detected.subjectName)
          if (detected.subjectCode) setSubjectCode(detected.subjectCode)
          if (detected.year) setSelectedYear(detected.year)
          if (detected.semester) setSelectedSemester(detected.semester)
          if (detected.examYear) setExamYear(detected.examYear)
          if (detected.category) setUploadCategory(detected.category)
          if (detected.examType) setExamType(detected.examType)
          if (detected.materialType) setMaterialType(detected.materialType)
          if (detected.unit) setUnitNumber(detected.unit)
        }
      } catch (detectErr) {
        console.warn('Auto-detection error:', detectErr)
      }
    }

    // Inspect image sharpness & readability
    for (const f of incomingFiles) {
      if (f.type.startsWith('image/')) {
        try {
          const quality = await analyzeImageQuality(f)
          setQualityMap(prev => ({ ...prev, [f.name]: quality }))
        } catch (qualErr) {
          console.warn('Scan quality error:', qualErr)
        }
      }
    }
  }, [subjects])

  // One-click adaptive contrast enhancer for scans
  const handleEnhanceFile = async (index: number) => {
    const targetFile = files[index]
    if (!targetFile || !targetFile.type.startsWith('image/')) return

    setEnhancingIndex(index)
    try {
      const enhancedFile = await autoEnhanceDocumentScan(targetFile)
      
      const updatedFiles = [...files]
      updatedFiles[index] = enhancedFile
      setFiles(updatedFiles)

      const newQuality = await analyzeImageQuality(enhancedFile)
      setQualityMap(prev => {
        const next = { ...prev }
        delete next[targetFile.name]
        next[enhancedFile.name] = newQuality
        return next
      })
    } catch (enhErr) {
      console.error('Enhancement failed:', enhErr)
    } finally {
      setEnhancingIndex(null)
    }
  }

  // Shared handler to add files from any source (drag, paste, click)
  const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

  const addFiles = useCallback((incoming: File[]) => {
    const oversized = incoming.find(f => f.size > MAX_FILE_SIZE)
    if (oversized) {
      setError(`"${oversized.name}" exceeds the 50MB size limit. Please choose a smaller file.`)
      return
    }

    const valid = incoming.filter(isAcceptedFile)
    if (valid.length === 0) {
      setError('No accepted file types found. Accepted: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX, PPT, PPTX')
      return
    }
    const combined = [...filesRef.current, ...valid]
    if (combined.length > 3) {
      setError('You can upload a maximum of 3 files at one time. First 3 files have been selected.')
      setFiles(combined.slice(0, 3))
    } else {
      setError(null)
      setFiles(combined)
    }

    processIncomingFiles(valid)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processIncomingFiles])


  // Ctrl+V paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!e.clipboardData) return
      const pastedFiles = Array.from(e.clipboardData.files)
      if (pastedFiles.length > 0) {
        addFiles(pastedFiles)
      }
    }
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [addFiles])

  // Drag-and-drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Only reset if leaving the zone entirely
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    addFiles(dropped)
  }

  // Filter subjects for the selected semester/year as suggestions
  const suggestedSubjects = subjects.filter(
    s => s.year === selectedYear && s.semester === selectedSemester
  )

  // Compute SHA-256 hash using native Web Crypto API for files
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || [])
    if (incoming.length === 0) return

    const oversized = incoming.find(f => f.size > MAX_FILE_SIZE)
    if (oversized) {
      setError(`"${oversized.name}" exceeds the 50MB size limit. Please choose a smaller file.`)
      e.target.value = ''
      return
    }

    let updatedFiles: File[] = []
    const combined = [...files, ...incoming]
    if (combined.length > 3) {
      setError('You can upload a maximum of 3 files at one time. First 3 files have been selected.')
      updatedFiles = combined.slice(0, 3)
    } else {
      setError(null)
      updatedFiles = combined
    }
    setFiles(updatedFiles)

    const targetFile = incoming[0] || updatedFiles[0]
    if (targetFile) {
      try {
        const arrayBuffer = await targetFile.arrayBuffer()
        if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
          const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
          const hashArray = Array.from(new Uint8Array(hashBuffer))
          const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
          
          setFileHash(hashHex)
          
          // Check for duplicates with error boundary
          try {
            const duplicate = await checkHashExists(hashHex)
            if (duplicate) {
              setDuplicateData(duplicate)
              setDuplicateAcknowledged(false)
            }
          } catch (dupErr) {
            console.warn('Duplicate check failed:', dupErr)
          }
        } else {
          setFileHash(`fallback-hash-${Date.now()}-${Math.random()}`)
        }
      } catch (err) {
        console.error('Hash calculation failed:', err)
        setFileHash(`error-hash-${Date.now()}`)
      }
    }

    // Run smart auto-detect and quality checks
    processIncomingFiles(incoming)

    // Reset input so user can add another file
    e.target.value = ''
  }

  const handleRemoveFile = (index: number) => {
    const targetFile = files[index]
    setFiles(prev => {
      const updated = prev.filter((_, i) => i !== index)
      if (updated.length === 0) {
        setFileHash('')
        setDuplicateData(null)
        setDuplicateAcknowledged(false)
        setAutoDetected(null)
      }
      return updated
    })
    if (targetFile) {
      setQualityMap(prev => {
        const next = { ...prev }
        delete next[targetFile.name]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (files.length === 0) {
      setError('Please select at least 1 file (up to 3) to upload.')
      return
    }

    if (!subjectName.trim()) {
      setError('Please enter the subject name.')
      return
    }
    
    setError(null)
    setIsUploading(true)
    setUploadProgress(5)
    setUploadStage('preparing')
    setUploadProgressText('Verifying file details & initializing secure session...')
    
    const totalBytes = files.reduce((acc, f) => acc + (f.size || 0), 0)
    setTotalBytesOverall(totalBytes)
    setTotalBytesUploaded(0)
    setFileProgressMap({})
    setCurrentFileIndex(0)
    
    try {
      // 1. Prepare direct upload session (metadata only, fast & lightweight JSON, bypasses 6MB payload limits)
      const prepareResult = await prepareDirectUpload({
        subject_name: subjectName.trim(),
        subject_code: subjectCode.trim(),
        year: selectedYear,
        semester: selectedSemester,
        resource_category: uploadCategory,
        material_type: uploadCategory === 'study_material' ? materialType : undefined,
        exam_type: uploadCategory === 'exam_paper' ? examType : undefined,
        exam_year: examYear,
        unit: uploadCategory === 'study_material' ? unitNumber : null,
        file_hash: fileHash || `hash-${Date.now()}`,
        files: files.map(f => ({
          name: f.name,
          size: f.size,
          type: f.type
        }))
      })

      if (prepareResult.error || !prepareResult.preparedFiles) {
        setError(prepareResult.error || 'Failed to prepare upload session. Please try again.')
        return
      }

      setUploadStage('uploading')
      setUploadProgress(12)

      // 2. Direct upload each file from browser straight to Supabase Storage with real-time byte progress
      const supabase = createClient()
      let accumulatedBytesFromCompletedFiles = 0

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const prepared = prepareResult.preparedFiles[i]
        setCurrentFileIndex(i)

        setUploadProgressText(
          files.length > 1
            ? `Uploading part ${i + 1} of ${files.length}: ${file.name}...`
            : `Uploading ${file.name}...`
        )

        await uploadFileWithProgress(
          prepared,
          file,
          supabase,
          (fileLoaded, fileTotal) => {
            const currentTotalLoaded = accumulatedBytesFromCompletedFiles + fileLoaded
            setTotalBytesUploaded(currentTotalLoaded)

            // Map byte transfer to the 12% - 88% overall progress range
            const byteFraction = totalBytes > 0 ? (currentTotalLoaded / totalBytes) : (fileLoaded / fileTotal)
            const mappedPercent = Math.min(88, Math.max(12, Math.round(12 + byteFraction * 76)))
            setUploadProgress(mappedPercent)

            const singleFilePercent = Math.min(100, Math.round((fileLoaded / (fileTotal || 1)) * 100))
            setFileProgressMap(prev => ({
              ...prev,
              [file.name]: singleFilePercent
            }))
          }
        )

        accumulatedBytesFromCompletedFiles += file.size
        setTotalBytesUploaded(accumulatedBytesFromCompletedFiles)
        setFileProgressMap(prev => ({
          ...prev,
          [file.name]: 100
        }))
      }

      // 3. Complete upload by recording resource in database
      setUploadStage('finalizing')
      setUploadProgress(92)
      setUploadProgressText('Recording resource in Prevu database & indexing tags...')

      const completeResult = await completeDirectUpload({
        resolvedSubjectId: prepareResult.resolvedSubjectId!,
        resolvedExamTypeId: prepareResult.resolvedExamTypeId!,
        examYear: prepareResult.examYear!,
        unit: prepareResult.unit,
        fileHash: prepareResult.fileHash || `hash-${Date.now()}`,
        files: prepareResult.preparedFiles.map(p => ({
          filePath: p.filePath,
          displayName: p.displayName,
          mimeType: p.mimeType
        }))
      })

      if (completeResult.error) {
        setError(completeResult.error)
      } else if (completeResult.success) {
        setUploadProgress(100)
        setUploadStage('complete')
        setUploadProgressText('Upload completed successfully!')
        setIsAdminUpload(!!completeResult.isAdminUpload)

        // Short celebration transition delay
        setTimeout(() => {
          setSuccess(true)
        }, 500)
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
          fileName={files.length > 1 ? `${files.length} files: ${files.map(f => f.name).join(', ')}` : files[0]?.name}
          isAdminUpload={isAdminUpload}
          isStudyMaterial={uploadCategory === 'study_material'}
          onUploadAnother={() => {
            setSuccess(false)
            setFiles([])
            setFileHash('')
            setSubjectName('')
            setSubjectCode('')
            setDuplicateData(null)
            setDuplicateAcknowledged(false)
            setIsAdminUpload(false)
            setUploadProgress(0)
            setUploadStage('idle')
            setTotalBytesUploaded(0)
            setTotalBytesOverall(0)
            setFileProgressMap({})
            setAutoDetected(null)
            setQualityMap({})
            setEnhancingIndex(null)
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
              
              {/* Smart Auto-Detected Metadata Alert (Feature 1) */}
              {autoDetected && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-prevu-accent/10 to-prevu-bg border border-prevu-accent/35 flex items-center justify-between gap-3 shadow-lg shadow-purple-500/5 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-prevu-accent/20 text-prevu-accent flex items-center justify-center shrink-0 border border-prevu-accent/30">
                      <Wand2 className="w-4 h-4 text-prevu-accent" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          Smart Auto-Fill Applied
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-prevu-accent/20 text-prevu-accent font-semibold border border-prevu-accent/30">
                          {autoDetected.confidenceScore}% Match
                        </span>
                      </div>
                      <p className="text-[11px] text-prevu-text-muted truncate max-w-[280px] sm:max-w-md">
                        Detected from {autoDetected.detectedFrom.join(' • ')}. Fields have been automatically selected.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoDetected(null)}
                    className="text-[11px] text-prevu-text-muted hover:text-white px-2 py-1 rounded-lg hover:bg-prevu-surface transition-colors cursor-pointer shrink-0"
                  >
                    Dismiss
                  </button>
                </div>
              )}

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

              {/* Unit Selector — only for Study Material */}
              {isStudy && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-emerald-400" htmlFor="unit_number">
                      Unit
                    </label>
                    <span className="text-[10px] font-mono text-emerald-400/80">Which unit does this cover?</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {['Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5', 'All Units'].map((u) => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setUnitNumber(u)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-150 cursor-pointer ${
                          unitNumber === u
                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-prevu-bg border-prevu-surface-light text-prevu-text-muted hover:border-emerald-500/50 hover:text-emerald-300'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* File Upload Box (Supports 1 to 3 files at one time) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="file">
                      {isStudy ? 'Document / Notes Files' : 'Question Paper Files'}
                    </label>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      {files.length} / 3 Files Selected
                    </span>
                  </div>
                  <span className="text-[10px] text-prevu-text-muted font-mono">Upload 1 to 3 files (Max 50MB each)</span>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="space-y-2 p-3 rounded-2xl bg-prevu-bg/90 border border-prevu-surface-light">
                    {files.map((f, idx) => {
                      const quality = qualityMap[f.name]
                      const isImage = f.type.startsWith('image/')
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-prevu-surface/60 border border-purple-500/30 text-xs space-y-2 transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="w-6 h-6 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                                #{idx + 1}
                              </span>
                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate max-w-[220px] sm:max-w-xs">{f.name}</p>
                                <p className="text-[10px] font-mono text-prevu-text-muted">{(f.size / (1024 * 1024)).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(idx)}
                              className="p-1 rounded-lg text-prevu-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors text-xs font-bold cursor-pointer"
                              title="Remove file"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Scan Quality & Readability Indicator (Feature 5) */}
                          {isImage && quality && (
                            <div className="pt-2 border-t border-prevu-surface-light/60">
                              {!quality.isAcceptable ? (
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/25 text-amber-300">
                                  <div className="flex items-start gap-1.5 min-w-0 text-[11px]">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                                    <span>
                                      {quality.issues[0]} <span className="font-mono text-[10px] text-amber-400">({quality.score}% Score)</span>
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEnhanceFile(idx)}
                                    disabled={enhancingIndex === idx}
                                    className="h-7 text-[10px] font-bold border-amber-500/40 text-amber-300 hover:bg-amber-500/20 shrink-0"
                                  >
                                    {enhancingIndex === idx ? (
                                      <>
                                        <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                        <span>Enhancing...</span>
                                      </>
                                    ) : (
                                      <>
                                        <Sparkles className="w-3 h-3 mr-1 text-amber-400" />
                                        <span>Auto-Enhance Contrast</span>
                                      </>
                                    )}
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 px-1 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                                  <span>Scan sharpness & readability verified (Clarity: {quality.score}%)</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Drag-and-drop zone / file picker */}
                {files.length < 3 ? (
                  <div
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 select-none ${
                      isDragging
                        ? isStudy
                          ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
                          : 'border-prevu-accent bg-prevu-accent/10 scale-[1.01]'
                        : 'border-prevu-surface-light bg-prevu-bg/60 hover:border-prevu-accent/50 hover:bg-prevu-surface/30'
                    }`}
                  >
                    {/* Hidden real file input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                      isDragging
                        ? isStudy ? 'bg-emerald-500/20 text-emerald-300' : 'bg-prevu-accent/20 text-prevu-accent'
                        : 'bg-prevu-surface-light text-prevu-text-muted group-hover:text-prevu-accent group-hover:bg-prevu-accent/10'
                    }`}>
                      <CloudUpload className="w-6 h-6" />
                    </div>

                    {/* Text */}
                    <div className="text-center space-y-1 pointer-events-none">
                      <p className={`text-sm font-bold transition-colors ${
                        isDragging
                          ? isStudy ? 'text-emerald-300' : 'text-prevu-accent'
                          : 'text-prevu-text group-hover:text-white'
                      }`}>
                        {isDragging ? 'Release to add files' : 'Drag & drop files here'}
                      </p>
                      <p className="text-[11px] text-prevu-text-muted">
                        or <span className={`font-semibold ${ isStudy ? 'text-emerald-400' : 'text-prevu-accent' }`}>click to browse</span>
                      </p>
                    </div>

                    {/* Hints row */}
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-prevu-surface-light/60 text-[10px] text-prevu-text-muted font-mono">
                        <Clipboard className="w-3 h-3" /> Ctrl+V to paste
                      </span>
                      <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-prevu-surface-light/60 text-[10px] text-prevu-text-muted font-mono">
                        Max 50 MB · up to 3 files
                      </span>
                    </div>

                    {/* Accepted types */}
                    <p className="text-[10px] text-prevu-text-muted/60 font-mono">
                      PDF · JPG · PNG · DOC · XLS · PPT
                    </p>
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/30 text-center text-xs text-purple-300">
                    Maximum 3 files reached. Remove a file above to replace it.
                  </div>
                )}
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
                        setFiles([])
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
              
              {/* Active Upload Processing & Percentage Card */}
              {isUploading && (
                <div className="p-4 rounded-2xl bg-prevu-bg/95 border border-prevu-surface-light shadow-2xl space-y-3.5 backdrop-blur-xl animate-in fade-in duration-300">
                  {/* Top Status Header & Percent Badge */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        uploadProgress >= 100
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isStudy
                            ? 'bg-emerald-500/15 text-emerald-300'
                            : 'bg-prevu-accent/15 text-prevu-accent'
                      }`}>
                        {uploadProgress >= 100 ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 animate-bounce" />
                        ) : (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-white">
                            {uploadProgress >= 100 
                              ? 'Upload Complete!' 
                              : uploadStage === 'preparing'
                                ? 'Initializing Vault Session'
                                : uploadStage === 'finalizing'
                                  ? 'Cataloging Resource'
                                  : 'Transferring to Prevu Vault'}
                          </h4>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-mono font-medium bg-prevu-surface-light text-prevu-text-muted border border-prevu-surface-light/60">
                            {uploadStage === 'preparing' ? 'Step 1 of 3' : uploadStage === 'uploading' ? 'Step 2 of 3' : 'Step 3 of 3'}
                          </span>
                        </div>
                        <p className="text-[11px] text-prevu-text-muted truncate max-w-[260px] sm:max-w-md">
                          {uploadProgressText}
                        </p>
                      </div>
                    </div>

                    {/* Prominent Real-Time Percentage Display */}
                    <div className="text-right shrink-0">
                      <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${
                        uploadProgress >= 100
                          ? 'text-emerald-400'
                          : isStudy
                            ? 'text-emerald-400'
                            : 'text-prevu-accent'
                      }`}>
                        {uploadProgress}%
                      </span>
                    </div>
                  </div>

                  {/* Primary Progress Bar with Live Shimmer */}
                  <div className="space-y-1.5">
                    <div className="w-full h-3 bg-prevu-surface rounded-full overflow-hidden p-0.5 border border-prevu-surface-light relative">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden ${
                          uploadProgress >= 100
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                            : isStudy
                              ? 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400'
                              : 'bg-gradient-to-r from-purple-600 via-prevu-accent to-fuchsia-500'
                        }`}
                        style={{ width: `${Math.max(4, uploadProgress)}%` }}
                      >
                        {/* Animated striped shimmer on the progress bar */}
                        <div className="absolute inset-0 animate-progress-stripes opacity-30" />
                      </div>
                    </div>

                    {/* Real-time Byte Stats & Secure Notice */}
                    <div className="flex items-center justify-between text-[10px] font-mono text-prevu-text-muted pt-0.5">
                      <span>
                        {totalBytesOverall > 0 ? (
                          `${formatBytes(totalBytesUploaded)} of ${formatBytes(totalBytesOverall)} transferred`
                        ) : (
                          'Calculating payload size...'
                        )}
                      </span>
                      <span className="flex items-center gap-1 text-prevu-text-muted/80">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Secure SSL Stream
                      </span>
                    </div>
                  </div>

                  {/* Multi-file Progress Breakdown */}
                  {files.length > 1 && (
                    <div className="space-y-1.5 pt-1.5 border-t border-prevu-surface-light/60">
                      <div className="text-[10px] font-semibold uppercase tracking-wider text-prevu-text-muted flex items-center justify-between">
                        <span>Documents Progress</span>
                        <span>{files.length} Files Total</span>
                      </div>
                      {files.map((file, idx) => {
                        const filePercent = fileProgressMap[file.name] ?? 0
                        const isDone = filePercent >= 100
                        const isCurrent = idx === currentFileIndex && uploadStage === 'uploading'
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center justify-between text-[11px] p-2 rounded-xl transition-colors ${
                              isCurrent
                                ? 'bg-prevu-surface/80 border border-prevu-accent/40 shadow-sm'
                                : 'bg-prevu-surface/40 border border-prevu-surface-light/40'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <span className={`w-4 h-4 rounded flex items-center justify-center text-[9px] font-mono font-bold shrink-0 ${
                                isDone 
                                  ? 'bg-emerald-500/20 text-emerald-400' 
                                  : isCurrent 
                                    ? isStudy ? 'bg-emerald-500/20 text-emerald-300 animate-pulse' : 'bg-prevu-accent/20 text-prevu-accent animate-pulse' 
                                    : 'bg-prevu-surface text-prevu-text-muted'
                              }`}>
                                {isDone ? '✓' : idx + 1}
                              </span>
                              <span className="text-white truncate max-w-[200px] sm:max-w-xs">{file.name}</span>
                            </div>
                            <span className={`font-mono text-[10px] font-semibold shrink-0 ml-2 ${
                              isDone 
                                ? 'text-emerald-400' 
                                : isCurrent 
                                  ? isStudy ? 'text-emerald-300' : 'text-prevu-accent' 
                                  : 'text-prevu-text-muted'
                            }`}>
                              {isDone ? '100% ✓' : isCurrent ? `${filePercent}%` : 'Queued'}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Friendly Reassurance Note */}
                  <div className="flex items-center gap-2 text-[10px] text-prevu-text-muted/80 bg-prevu-surface/40 px-3 py-2 rounded-xl border border-prevu-surface-light/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                    <span>Please keep this window open while processing and uploading to the cloud.</span>
                  </div>
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
              disabled={isUploading || files.length === 0 || !subjectName.trim() || (!!duplicateData && !duplicateAcknowledged)}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Upload ({uploadProgress}%)...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>
                    {isStudy 
                      ? `Submit Study Material (${files.length} file${files.length === 1 ? '' : 's'})` 
                      : `Submit Question Paper (${files.length} file${files.length === 1 ? '' : 's'})`}
                  </span>
                </>
              )}
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
