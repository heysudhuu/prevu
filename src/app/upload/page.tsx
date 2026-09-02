'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { getFormDataOptions, checkHashExists, uploadResource } from './actions'
import { Upload, AlertCircle, Sparkles, BookOpen, Layers } from 'lucide-react'
import UploadCelebrationMascot from '@/components/animations/UploadCelebrationMascot'

type Subject = { id: number, name: string, code: string, year: number, semester: number, branch_id: number }

export default function UploadPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedYear, setSelectedYear] = useState<number>(1)
  const [selectedSemester, setSelectedSemester] = useState<number>(1)
  
  const [subjectName, setSubjectName] = useState('')
  const [subjectCode, setSubjectCode] = useState('')
  const [examType, setExamType] = useState('MST1')
  const [examYear, setExamYear] = useState<number>(new Date().getFullYear())

  const [file, setFile] = useState<File | null>(null)
  const [fileHash, setFileHash] = useState<string>('')
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null)
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

  // Filter subjects for the selected semester/year as suggestions
  const suggestedSubjects = subjects.filter(
    s => s.year === selectedYear && s.semester === selectedSemester
  )

  // Compute SHA-256 hash using native Web Crypto API
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    setDuplicateWarning(null)
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
          setDuplicateWarning(`Notice: A similar document (${duplicate.original_filename}) already exists. Your submission will be reviewed by an admin.`)
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
    
    const formData = new FormData(e.currentTarget)
    formData.append('file', file)
    formData.append('file_hash', fileHash)
    formData.append('year', String(selectedYear))
    formData.append('semester', String(selectedSemester))
    formData.append('subject_name', subjectName.trim())
    formData.append('subject_code', subjectCode.trim())
    formData.append('exam_type', examType)
    formData.append('exam_year', String(examYear))
    
    const result = await uploadResource(formData)
    
    setIsUploading(false)
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setIsAdminUpload(!!result.isAdminUpload)
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <div className="flex min-h-[85vh] items-center justify-center p-4 py-12">
        <UploadCelebrationMascot 
          subjectName={subjectName}
          subjectCode={subjectCode}
          examType={examType}
          examYear={examYear}
          fileName={file?.name}
          isAdminUpload={isAdminUpload}
          onUploadAnother={() => {
            setSuccess(false)
            setFile(null)
            setFileHash('')
            setSubjectName('')
            setSubjectCode('')
            setDuplicateWarning(null)
            setIsAdminUpload(false)
          }}
        />
      </div>
    )
  }

  return (
    <div className="relative flex min-h-[85vh] items-center justify-center p-4 py-10 overflow-hidden bg-prevu-bg">
      {/* Background ambient lighting */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[550px] h-[550px] rounded-full bg-prevu-accent/10 blur-[150px] pointer-events-none" />
      
      <div className="relative z-10 w-full max-w-xl">
        <Card className="w-full backdrop-blur-2xl bg-prevu-surface/90 border-prevu-surface-light shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 text-prevu-accent text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Contribute to Archive</span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white">
              Upload Exam Resource
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-prevu-text-muted">
              Share past exam papers (MST 1, MST 2, EST) or notes for BE-CSE students.
            </CardDescription>
          </CardHeader>

          <CardContent>
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

              {/* Subject Name & Subject Code (User can write their own) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="subject_name">
                      Subject Name
                    </label>
                    <span className="text-[11px] text-prevu-accent font-medium">Write your own</span>
                  </div>
                  <div className="relative">
                    <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                    <input 
                      type="text"
                      id="subject_name"
                      value={subjectName}
                      onChange={(e) => setSubjectName(e.target.value)}
                      placeholder="e.g. Data Structures & Algorithms"
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

              {/* Exam Type (MST1, MST2, EST) & Exam Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
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

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="exam_year">
                    Exam Year
                  </label>
                  <input 
                    type="number" 
                    id="exam_year" 
                    value={examYear}
                    onChange={(e) => setExamYear(Number(e.target.value))}
                    required
                    min={2015}
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors font-mono"
                  />
                </div>
              </div>

              {/* File Upload Box */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-prevu-text-muted" htmlFor="file">
                  Document / Paper (PDF, JPG, PNG, DOC/DOCX)
                </label>
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
              
              {duplicateWarning && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl flex items-start gap-2.5 text-xs text-amber-300">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{duplicateWarning}</span>
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
              className="w-full py-3 text-sm flex items-center justify-center gap-2 shadow-lg shadow-prevu-accent/25 font-bold"
              disabled={isUploading || !file || !fileHash || !subjectName.trim()}
            >
              <Upload className="w-4 h-4" />
              {isUploading ? 'Uploading & Hashing Document...' : 'Submit Resource'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
