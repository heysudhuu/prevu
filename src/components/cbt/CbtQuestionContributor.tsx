'use client'

import React, { useState, useEffect } from 'react'
import { 
  Sparkles, 
  PlusCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Send, 
  HelpCircle, 
  Layers, 
  BookOpen, 
  FileUp, 
  FileText, 
  AlertCircle, 
  Trash2, 
  Check, 
  ChevronRight, 
  Plus,
  UploadCloud,
  Loader2,
  FileCheck,
  RefreshCw,
  Edit3,
  Tag,
  FolderPlus,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitCommunityCbtQuestion, batchSubmitCommunityCbtQuestions, proposeNewCbtSubject } from '@/lib/cbt/actions'
import { CBT_SUBJECTS } from '@/lib/cbt/cbtRegistry'
import { CbtSubject } from '@/lib/cbt/types'
import { parseMcqText, ParsedMcqItem } from '@/lib/cbt/pdfParser'
import Link from 'next/link'

interface CbtQuestionContributorProps {
  initialSubject?: string
}

export default function CbtQuestionContributor({ initialSubject = '' }: CbtQuestionContributorProps) {
  // Mode selection: 'auto-parser' vs 'manual'
  const [activeTab, setActiveTab] = useState<'auto-parser' | 'manual'>('auto-parser')

  // Subject List: Registered subjects + user-created subjects
  const [customSubjects, setCustomSubjects] = useState<CbtSubject[]>([])
  
  // Load custom subjects from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prevu_custom_cbt_subjects')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setCustomSubjects(parsed)
        }
      }
    } catch {
      // ignore
    }
  }, [])

  const allSubjects = [...CBT_SUBJECTS, ...customSubjects]

  // Subject Selection
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(initialSubject || 'APT-301')
  const currentSubjectObj = allSubjects.find(s => s.code === selectedSubjectCode) || allSubjects[0]

  const [subjectName, setSubjectName] = useState(
    currentSubjectObj ? currentSubjectObj.name : 'Campus Placement Aptitude & Logical Reasoning'
  )
  const [semester, setSemester] = useState<number>(currentSubjectObj ? currentSubjectObj.semester : 5)
  const [category, setCategory] = useState<string>(currentSubjectObj ? currentSubjectObj.category : 'aptitude')

  // Propose / Create New Subject Modal / Card State
  const [isCreatingSubject, setIsCreatingSubject] = useState<boolean>(false)
  const [newSubjCode, setNewSubjCode] = useState('')
  const [newSubjName, setNewSubjName] = useState('')
  const [newSubjSemester, setNewSubjSemester] = useState(5)
  const [newSubjCategory, setNewSubjCategory] = useState('aptitude')
  const [newSubjInitialTopics, setNewSubjInitialTopics] = useState('')

  // Topic Name (Prominently asked for every upload)
  const [selectedTopic, setSelectedTopic] = useState<string>('Percentages')
  const [customTopicName, setCustomTopicName] = useState<string>('')
  const [isCustomTopicMode, setIsCustomTopicMode] = useState<boolean>(false)

  // Auto-Parser State
  const [rawText, setRawText] = useState('')
  const [parsedQuestions, setParsedQuestions] = useState<ParsedMcqItem[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [isExtractingPdf, setIsExtractingPdf] = useState(false)
  const [parseNotice, setParseNotice] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadedFileInfo, setUploadedFileInfo] = useState<{
    fileName: string
    pages: number
    size: string
    count: number
  } | null>(null)
  const [showRawTextEditor, setShowRawTextEditor] = useState<boolean>(false)

  // Manual Question state
  const [manualQuestion, setManualQuestion] = useState('')
  const [manualType, setManualType] = useState<'single' | 'multiple'>('single')
  const [manualOptions, setManualOptions] = useState<string[]>(['', '', '', ''])
  const [manualCorrect, setManualCorrect] = useState<string[]>([])
  const [manualExplanation, setManualExplanation] = useState('')

  // Submission State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

  // Effective topic name helper
  const getEffectiveTopicName = () => {
    if (isCustomTopicMode) {
      return customTopicName.trim()
    }
    return selectedTopic || 'General Aptitude'
  }

  // Handle subject change from dropdown
  const handleSelectSubject = (code: string) => {
    if (code === '__new__') {
      setIsCreatingSubject(true)
      return
    }

    setIsCreatingSubject(false)
    setSelectedSubjectCode(code)
    const found = allSubjects.find(s => s.code === code)
    if (found) {
      setSubjectName(found.name)
      setSemester(found.semester)
      setCategory(found.category)
      
      // Auto-set first topic if available
      if (found.topicsList && found.topicsList.length > 0) {
        const firstTopic = found.topicsList.find(t => t.id !== 'all')?.name || found.topics[0] || ''
        setSelectedTopic(firstTopic)
        setIsCustomTopicMode(false)
      } else if (found.topics && found.topics.length > 0) {
        setSelectedTopic(found.topics[0])
        setIsCustomTopicMode(false)
      } else {
        setSelectedTopic('')
        setIsCustomTopicMode(true)
      }
    }
  }

  // Handle creating a new subject and instantly adding it to the list
  const handleCreateNewSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!newSubjCode.trim() || !newSubjName.trim()) {
      setError('Please provide both subject code and subject name.')
      return
    }

    const cleanedCode = newSubjCode.trim().toUpperCase()
    const cleanedName = newSubjName.trim()

    // Parse initial topics if provided
    const topicsArr = newSubjInitialTopics
      .split(/[,;\n]+/)
      .map(t => t.trim())
      .filter(t => t.length > 0)

    const newSubject: CbtSubject = {
      code: cleanedCode,
      name: cleanedName,
      semester: newSubjSemester,
      year: Math.ceil(newSubjSemester / 2),
      category: newSubjCategory as any,
      categoryLabel: newSubjCategory === 'aptitude' 
        ? 'Aptitude & Placements' 
        : newSubjCategory === 'open-elective' 
        ? 'Open Electives' 
        : newSubjCategory === 'uhv' 
        ? 'UHV' 
        : 'Core Technical CBT',
      totalQuestions: 0,
      description: `Community question bank for ${cleanedName}`,
      topics: topicsArr.length > 0 ? topicsArr : ['General'],
      topicsList: topicsArr.map(t => ({
        id: t.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: t,
        count: 0
      })),
      isReady: true,
      badgeColor: 'from-purple-600 to-cyan-600'
    }

    // Update state and localStorage
    const updated = [...customSubjects, newSubject]
    setCustomSubjects(updated)
    try {
      localStorage.setItem('prevu_custom_cbt_subjects', JSON.stringify(updated))
    } catch {
      // ignore
    }

    // Select the newly created subject
    setSelectedSubjectCode(cleanedCode)
    setSubjectName(cleanedName)
    setSemester(newSubjSemester)
    setCategory(newSubjCategory)
    setIsCreatingSubject(false)

    // Pre-select topic
    if (topicsArr.length > 0) {
      setSelectedTopic(topicsArr[0])
      setIsCustomTopicMode(false)
    } else {
      setSelectedTopic('')
      setIsCustomTopicMode(true)
    }

    setParseNotice(`Subject "${cleanedName} [${cleanedCode}]" created and added to your subject list! You can now upload or paste questions for it.`)

    // Submit to server action in background for admin review
    proposeNewCbtSubject({
      code: cleanedCode,
      name: cleanedName,
      semester: newSubjSemester,
      category: newSubjCategory
    }).catch(err => console.warn('Background subject proposal notice:', err))
  }

  // Handle PDF or Text File Upload & Extraction
  const processUploadedFile = async (file: File) => {
    if (!file) return

    setError(null)
    setSuccessMessage(null)

    const effectiveTopic = getEffectiveTopicName()
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

    if (isPdf) {
      setIsExtractingPdf(true)
      setParseNotice(`Uploading & extracting text from PDF "${file.name}"...`)

      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/cbt/extract-pdf', {
          method: 'POST',
          body: formData
        })

        const data = await res.json()

        if (!res.ok || data.error) {
          throw new Error(data.error || 'Failed to extract text from PDF document.')
        }

        const extracted = data.text || ''
        setRawText(extracted)

        // Convert the extracted text to structured MCQs
        const results = parseMcqText(extracted)
        
        // Auto-assign chosen topic name to all extracted questions
        const taggedResults = results.map(q => ({
          ...q,
          sectionName: effectiveTopic || q.sectionName
        }))

        setParsedQuestions(taggedResults)

        setUploadedFileInfo({
          fileName: file.name,
          pages: data.pages || 1,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          count: taggedResults.length
        })

        if (taggedResults.length === 0) {
          setParseNotice(`Extracted text from ${data.pages} page(s), but could not auto-detect standard question patterns. You can view or adjust the text below.`)
          setShowRawTextEditor(true)
        } else {
          setParseNotice(`Successfully extracted ${data.pages} page(s) and converted ${taggedResults.length} MCQs for topic "${effectiveTopic}" from "${file.name}"!`)
        }
      } catch (err: any) {
        console.error('PDF extraction error:', err)
        setError(err.message || 'Failed to process PDF document.')
      } finally {
        setIsExtractingPdf(false)
      }
    } else {
      // For text / md files
      setParseNotice(`Reading text document "${file.name}"...`)
      const reader = new FileReader()
      
      reader.onload = (event) => {
        const text = event.target?.result as string
        if (text) {
          setRawText(text)
          const results = parseMcqText(text)
          const taggedResults = results.map(q => ({
            ...q,
            sectionName: effectiveTopic || q.sectionName
          }))
          setParsedQuestions(taggedResults)
          setUploadedFileInfo({
            fileName: file.name,
            pages: 1,
            size: `${(file.size / 1024).toFixed(1)} KB`,
            count: taggedResults.length
          })
          setParseNotice(`Converted ${taggedResults.length} MCQs for topic "${effectiveTopic}" from "${file.name}"!`)
        }
      }
      reader.readAsText(file)
    }
  }

  // File input change handler
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processUploadedFile(file)
    }
    e.target.value = ''
  }

  // Convert raw text into MCQ cards
  const handleConvertText = (textToParse?: string) => {
    const text = textToParse || rawText
    if (!text.trim()) {
      setError('Please paste text or upload a document first.')
      return
    }

    const effectiveTopic = getEffectiveTopicName()

    setIsParsing(true)
    setError(null)
    setParseNotice(null)

    try {
      const results = parseMcqText(text)
      if (results.length === 0) {
        setError('Could not detect question patterns (e.g. "Q1. ...", "A. ..."). Please ensure the text contains question numbers and options.')
      } else {
        const taggedResults = results.map(q => ({
          ...q,
          sectionName: effectiveTopic || q.sectionName
        }))
        setParsedQuestions(taggedResults)
        setParseNotice(`Successfully converted ${taggedResults.length} MCQ questions for topic "${effectiveTopic}"! Review and edit each question below before submitting.`)
      }
    } catch {
      setError('Failed to parse text. Please check the document format.')
    } finally {
      setIsParsing(false)
    }
  }

  // Remove a parsed question
  const handleRemoveParsed = (id: string) => {
    setParsedQuestions(prev => prev.filter(q => q.id !== id))
  }

  // Toggle correct answer in parsed preview
  const handleToggleParsedCorrect = (qId: string, letter: string) => {
    setParsedQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q
      const has = q.correctAnswers.includes(letter)
      const next = has ? q.correctAnswers.filter(l => l !== letter) : [...q.correctAnswers, letter]
      return {
        ...q,
        correctAnswers: next.length > 0 ? next : [letter]
      }
    }))
  }

  // Submit batch of questions
  const handleSubmitBatch = async () => {
    if (parsedQuestions.length === 0) {
      setError('No parsed questions to submit.')
      return
    }

    const effectiveTopic = getEffectiveTopicName()
    if (!effectiveTopic) {
      setError('Please provide a Topic Name for this question bank.')
      return
    }

    if (!selectedSubjectCode || !subjectName) {
      setError('Please select or specify a valid subject.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const questionsWithTopic = parsedQuestions.map(q => ({
        question: q.question,
        questionType: q.type,
        options: q.options,
        correctAnswers: q.correctAnswers,
        explanation: q.explanation,
        sectionName: effectiveTopic
      }))

      const res = await batchSubmitCommunityCbtQuestions({
        subjectCode: selectedSubjectCode,
        subjectName: subjectName,
        semester: semester,
        category: category,
        questions: questionsWithTopic
      })

      if (res.error) {
        setError(res.error)
      } else {
        setSuccessMessage(`Successfully submitted ${parsedQuestions.length} questions for subject "${subjectName}" under topic "${effectiveTopic}"! They are now pending admin review. You will earn +5 Karma for each approved question.`)
        setParsedQuestions([])
        setRawText('')
        setUploadedFileInfo(null)
      }
    } catch {
      setError('Submission failed. Please check network connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // Submit manual question
  const handleSubmitManual = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const effectiveTopic = getEffectiveTopicName()

    if (!selectedSubjectCode || !subjectName) {
      setError('Please select or specify a valid subject.')
      return
    }
    if (!effectiveTopic) {
      setError('Please specify a Topic Name.')
      return
    }
    if (!manualQuestion.trim()) {
      setError('Please enter the question text.')
      return
    }

    const filledOptions = manualOptions.map((opt, i) => ({
      id: optionLetters[i],
      text: opt.trim()
    })).filter(o => o.text.length > 0)

    if (filledOptions.length < 2) {
      setError('Please provide at least 2 options.')
      return
    }
    if (manualCorrect.length === 0) {
      setError('Please mark at least one correct answer key.')
      return
    }

    setLoading(true)

    try {
      const res = await submitCommunityCbtQuestion({
        subjectCode: selectedSubjectCode,
        subjectName: subjectName,
        semester: semester,
        category: category,
        question: manualQuestion,
        questionType: manualType,
        options: filledOptions,
        correctAnswers: manualCorrect,
        explanation: manualExplanation,
        unitTag: effectiveTopic
      })

      if (res.error) {
        setError(res.error)
      } else {
        setSuccessMessage(`Question submitted successfully under topic "${effectiveTopic}"! It is now pending admin review. You will earn +5 Karma once approved.`)
        setManualQuestion('')
        setManualOptions(['', '', '', ''])
        setManualCorrect([])
        setManualExplanation('')
      }
    } catch {
      setError('Failed to submit question.')
    } finally {
      setLoading(false)
    }
  }

  // Known topics for current subject
  const currentSubjectTopics = currentSubjectObj?.topicsList?.filter(t => t.id !== 'all').map(t => t.name) 
    || currentSubjectObj?.topics 
    || []

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Top Breadcrumb */}
      <div>
        <Link
          href="/cbt"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-prevu-text-muted hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to CBT Arena</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="p-6 sm:p-8 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Header */}
        <div className="border-b border-prevu-surface-light/60 pb-4 space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/25">
            <Sparkles className="w-3 h-3" />
            <span>Community Question Builder</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Contribute CBT Questions & Mock Exams
          </h1>
          <p className="text-xs text-prevu-text-muted">
            Upload question bank PDFs, auto-convert notes into topic-wise MCQs, or add new subjects to the university list.
          </p>
        </div>

        {/* Global Feedback Messages */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between gap-3 animate-fade-in font-medium">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-rose-400 hover:text-white transition-colors cursor-pointer shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs space-y-2 animate-fade-in font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-bold text-sm text-white">Submission Recorded!</span>
            </div>
            <p className="leading-relaxed">{successMessage}</p>
            <div className="pt-1">
              <Button size="sm" asChild className="h-8 text-xs bg-prevu-accent text-white font-bold">
                <Link href="/cbt">Return to CBT Arena</Link>
              </Button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 1: SUBJECT & TOPIC CONFIGURATION */}
        {/* ========================================================================= */}
        <div className="p-5 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light space-y-4">
          
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>1. Target Subject &amp; Topic Details</span>
            </label>
            <button
              type="button"
              onClick={() => setIsCreatingSubject(!isCreatingSubject)}
              className="text-[11px] text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              {isCreatingSubject ? '← Cancel & Pick Existing Subject' : '+ Can\'t find your subject? Create New Subject'}
            </button>
          </div>

          {/* New Subject Creation Form (When user wants to create a new subject) */}
          {isCreatingSubject ? (
            <form onSubmit={handleCreateNewSubject} className="space-y-3.5 p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-300">
                  <FolderPlus className="w-4 h-4 text-purple-400" />
                  <span>Create New Subject for CBT Arena</span>
                </div>
                <span className="text-[10px] font-mono text-prevu-text-muted">
                  Instantly adds to your subject list
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-prevu-text-muted block mb-1">
                    Subject Code *
                  </label>
                  <input
                    type="text"
                    value={newSubjCode}
                    onChange={e => setNewSubjCode(e.target.value)}
                    placeholder="e.g. 23CSH-401, APT-302"
                    required
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-cyan-400 focus:outline-none font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] font-semibold text-prevu-text-muted block mb-1">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    value={newSubjName}
                    onChange={e => setNewSubjName(e.target.value)}
                    placeholder="e.g. Machine Learning &amp; AI, Network Security"
                    required
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-cyan-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-prevu-text-muted block mb-1">
                    Semester
                  </label>
                  <select
                    value={newSubjSemester}
                    onChange={e => setNewSubjSemester(parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-prevu-text-muted block mb-1">
                    Category
                  </label>
                  <select
                    value={newSubjCategory}
                    onChange={e => setNewSubjCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="aptitude">Aptitude &amp; Placements</option>
                    <option value="open-elective">Open Elective</option>
                    <option value="core">Core Technical MST</option>
                    <option value="uhv">UHV (Universal Human Values)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-prevu-text-muted block mb-1">
                  Initial Topics / Modules (Comma-separated, optional)
                </label>
                <input
                  type="text"
                  value={newSubjInitialTopics}
                  onChange={e => setNewSubjInitialTopics(e.target.value)}
                  placeholder="e.g. Neural Networks, Search Algorithms, Supervised Learning"
                  className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsCreatingSubject(false)}
                  className="h-8 text-xs border-prevu-surface-light text-prevu-text-muted"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-8 px-4 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white"
                >
                  Save &amp; Select Subject
                </Button>
              </div>
            </form>
          ) : (
            /* Standard Subject & Topic Row */
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Subject Dropdown */}
                <div>
                  <label className="text-[10px] uppercase font-mono text-prevu-text-muted block mb-1">
                    Select Subject *
                  </label>
                  <select
                    value={selectedSubjectCode}
                    onChange={e => handleSelectSubject(e.target.value)}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:border-prevu-accent focus:outline-none font-medium cursor-pointer"
                  >
                    <optgroup label="Registered Exam Subjects">
                      {allSubjects.map(s => (
                        <option key={s.code} value={s.code}>
                          [{s.code}] {s.name} (Sem {s.semester})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Actions">
                      <option value="__new__">➕ + Add / Create New Subject...</option>
                    </optgroup>
                  </select>
                </div>

                {/* Category & Semester Standing */}
                <div>
                  <label className="text-[10px] uppercase font-mono text-prevu-text-muted block mb-1">
                    Category &amp; Standing
                  </label>
                  <div className="px-3 py-2 bg-prevu-surface/40 border border-prevu-surface-light rounded-xl text-xs text-cyan-300 font-mono">
                    {category.toUpperCase()} • Sem {semester}
                  </div>
                </div>
              </div>

              {/* Topic Selector / Creator */}
              <div className="p-3.5 rounded-xl bg-prevu-surface/40 border border-prevu-surface-light space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-white flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Topic / Module Name *</span>
                  </label>
                  
                  {currentSubjectTopics.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCustomTopicMode(!isCustomTopicMode)
                        if (!isCustomTopicMode) setCustomTopicName('')
                      }}
                      className="text-[11px] text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      {isCustomTopicMode ? '← Pick from known topics' : '+ Add Custom Topic Name'}
                    </button>
                  )}
                </div>

                {/* Either Dropdown of Known Topics or Custom Input */}
                {!isCustomTopicMode && currentSubjectTopics.length > 0 ? (
                  <select
                    value={selectedTopic}
                    onChange={e => {
                      if (e.target.value === '__custom__') {
                        setIsCustomTopicMode(true)
                        setCustomTopicName('')
                      } else {
                        setSelectedTopic(e.target.value)
                      }
                    }}
                    className="w-full px-3 py-2 bg-prevu-bg border border-cyan-500/30 hover:border-cyan-400 rounded-xl text-xs text-white focus:outline-none cursor-pointer"
                  >
                    {currentSubjectTopics.map(topic => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                    <option value="__custom__">➕ + Add / Type New Topic Name...</option>
                  </select>
                ) : (
                  <div className="space-y-1">
                    <input
                      type="text"
                      value={customTopicName}
                      onChange={e => setCustomTopicName(e.target.value)}
                      placeholder="e.g. Percentages, Profit &amp; Loss, Normalization, Set Theory"
                      required
                      className="w-full px-3 py-2 bg-prevu-bg border border-cyan-500/40 rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-cyan-400 focus:outline-none font-medium"
                    />
                    <p className="text-[10px] text-prevu-text-muted">
                      Every question in this batch will be organized under this topic module.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* ========================================================================= */}
        {/* STEP 2: CONTRIBUTION METHOD TABS */}
        {/* ========================================================================= */}
        <div className="flex items-center gap-2 border-b border-prevu-surface-light pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('auto-parser')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'auto-parser'
                ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Bulk PDF &amp; Document Auto-Converter</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'manual'
                ? 'bg-prevu-accent text-white shadow-md shadow-prevu-accent/25'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Manual Single Question</span>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: BULK PDF & AUTO-CONVERTER */}
        {/* ========================================================================= */}
        {activeTab === 'auto-parser' && (
          <div className="space-y-5">
            
            {/* DEDICATED DRAG & DROP PDF UPLOAD BOX */}
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragOver(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                setIsDragOver(false)
              }}
              onDrop={(e) => {
                e.preventDefault()
                setIsDragOver(false)
                if (e.dataTransfer.files?.[0]) {
                  processUploadedFile(e.dataTransfer.files[0])
                }
              }}
              className={`relative p-6 sm:p-8 rounded-3xl border-2 border-dashed transition-all duration-200 text-center flex flex-col items-center justify-center space-y-3.5 ${
                isDragOver
                  ? 'border-cyan-400 bg-cyan-950/30 scale-[1.01]'
                  : 'border-purple-500/35 hover:border-purple-400/70 bg-purple-950/15 hover:bg-purple-950/25'
              }`}
            >
              {isExtractingPdf ? (
                <div className="space-y-3 py-4 flex flex-col items-center animate-pulse">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-400" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white">
                      Extracting Text &amp; Parsing MCQs...
                    </h3>
                    <p className="text-xs text-cyan-300 font-mono">
                      Extracting pages, options, and solutions for &quot;{getEffectiveTopicName()}&quot;...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
                    <UploadCloud className="w-7 h-7" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-white tracking-tight">
                      Upload Question Bank PDF for Bulk MCQ Conversion
                    </h3>
                    <p className="text-xs text-prevu-text-muted max-w-md">
                      Drag &amp; drop your question bank PDF here, or browse files. MCQs will be auto-categorized under <strong className="text-cyan-300">&quot;{getEffectiveTopicName()}&quot;</strong>.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-mono text-[11px]">
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-bold">
                      ⚡ .pdf (Auto-Extract)
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      📄 .txt / .md / .text
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      ✨ Auto-Detect Keys &amp; Solutions
                    </span>
                  </div>

                  <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-prevu-accent hover:bg-prevu-accent-hover text-white shadow-lg shadow-prevu-accent/25 transition-all mt-2">
                    <FileUp className="w-4 h-4" />
                    <span>Select Question Bank PDF / Document</span>
                    <input
                      type="file"
                      accept=".pdf,.txt,.md,.text,application/pdf"
                      onChange={handleFileInputChange}
                      className="sr-only"
                    />
                  </label>
                </>
              )}
            </div>

            {/* Uploaded File Meta Ribbon (If file parsed) */}
            {uploadedFileInfo && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate text-xs">
                      {uploadedFileInfo.fileName}
                    </div>
                    <div className="text-[10px] font-mono text-prevu-text-muted">
                      {uploadedFileInfo.pages} Page(s) • {uploadedFileInfo.size} • Converted {uploadedFileInfo.count} MCQs for topic &quot;{getEffectiveTopicName()}&quot;
                    </div>
                  </div>
                </div>

                <label className="cursor-pointer text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline shrink-0 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" />
                  <span>Replace File</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md,.text,application/pdf"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            )}

            {/* Collapsible Extracted Raw Text & Manual Paste Box */}
            <div className="p-4 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-prevu-accent" />
                  <span>Extracted Text / Manual Question Input</span>
                </label>

                <button
                  type="button"
                  onClick={() => setShowRawTextEditor(!showRawTextEditor)}
                  className="text-[11px] text-cyan-400 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{showRawTextEditor ? 'Collapse Text Editor' : 'View / Edit Raw Text'}</span>
                </button>
              </div>

              {showRawTextEditor && (
                <div className="space-y-3 animate-fade-in">
                  <textarea
                    rows={6}
                    value={rawText}
                    onChange={e => setRawText(e.target.value)}
                    placeholder={`Paste questions from PDF or notes here, e.g.:

Q1. Which of the following are major risks associated with mobile application security?
■ A. Weak server-side controls
■ B. Data leakage through unintended channels
■ C. Slow application performance
Correct answer: A, B

Q2. What is the value of 12% of 5000?
(A) 600
(B) 620
(C) 680
(D) 720
Answer: 600 | (12/100) * 5000 = 600.`}
                    className="w-full p-3 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/40 focus:border-prevu-accent focus:outline-none font-mono leading-relaxed"
                  />

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-prevu-text-muted">
                      Supports &quot;Q1.&quot;, &quot;• A.&quot;, &quot;(A) ... (B) ...&quot;, &quot;Answer: B&quot;, and &quot;Answer Key &amp; Explanations&quot;.
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      disabled={isParsing || !rawText.trim()}
                      onClick={() => handleConvertText()}
                      className="h-8 px-4 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isParsing ? 'Converting...' : 'Auto-Convert to MCQs'}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {parseNotice && (
              <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-cyan-400" />
                <span>{parseNotice}</span>
              </div>
            )}

            {/* Parsed MCQ Cards Preview List */}
            {parsedQuestions.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between border-b border-prevu-surface-light/60 pb-2">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <span>Extracted MCQs ({parsedQuestions.length} Questions)</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-sans normal-case">
                      Topic: {getEffectiveTopicName()}
                    </span>
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    disabled={loading}
                    onClick={handleSubmitBatch}
                    className="h-8 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting Batch...' : `Submit All ${parsedQuestions.length} Questions (+${parsedQuestions.length * 5} Karma)`}</span>
                  </Button>
                </div>

                <div className="space-y-3 max-h-[460px] overflow-y-auto scrollbar-thin pr-1">
                  {parsedQuestions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl bg-prevu-bg border border-prevu-surface-light space-y-3 relative group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-prevu-surface border border-prevu-surface-light flex items-center justify-center text-[10px] font-mono font-bold text-white">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] font-mono text-prevu-text-muted">
                            {q.type === 'multiple' ? 'Multi-Select' : 'Single Choice'}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/20">
                            {q.sectionName || getEffectiveTopicName()}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveParsed(q.id)}
                          className="text-prevu-text-muted hover:text-rose-400 p-1 cursor-pointer"
                          title="Remove question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4 className="text-xs font-semibold text-white leading-relaxed">
                        {q.question}
                      </h4>

                      {/* Options */}
                      <div className="space-y-1.5">
                        {q.options.map(opt => {
                          const isCorrect = q.correctAnswers.includes(opt.id)
                          return (
                            <div
                              key={opt.id}
                              onClick={() => handleToggleParsedCorrect(q.id, opt.id)}
                              className={`p-2 rounded-xl border text-xs flex items-center justify-between cursor-pointer transition-all ${
                                isCorrect
                                  ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200 font-semibold'
                                  : 'bg-prevu-surface/30 border-prevu-surface-light text-prevu-text-muted hover:border-emerald-500/40'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-mono font-bold ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-black/30 text-prevu-text-muted'
                                }`}>
                                  {opt.id}
                                </span>
                                <span>{opt.text}</span>
                              </div>
                              {isCorrect && (
                                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                                  ✓ Correct Key
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {q.explanation && (
                        <div className="text-[11px] text-prevu-text-muted bg-prevu-surface/40 p-2 rounded-xl border border-prevu-surface-light/40">
                          <strong className="text-cyan-400 font-mono text-[10px]">Explanation:</strong> {q.explanation}
                        </div>
                      )}

                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    disabled={loading}
                    onClick={handleSubmitBatch}
                    className="h-9 px-6 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting...' : `Submit All ${parsedQuestions.length} Questions for Admin Review`}</span>
                  </Button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: MANUAL QUESTION FORM */}
        {/* ========================================================================= */}
        {activeTab === 'manual' && (
          <form onSubmit={handleSubmitManual} className="space-y-4">
            <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/25 flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-300">
                Subject: <strong className="text-white">{subjectName} [{selectedSubjectCode}]</strong>
              </span>
              <span className="text-cyan-300">
                Topic: <strong className="text-white">{getEffectiveTopicName()}</strong>
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-prevu-text-muted">
                  Question Text *
                </label>
                <div className="flex items-center gap-3">
                  <label className="text-[11px] text-prevu-text-muted flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mType"
                      checked={manualType === 'single'}
                      onChange={() => {
                        setManualType('single')
                        if (manualCorrect.length > 1) setManualCorrect([manualCorrect[0]])
                      }}
                    />
                    <span>Single Choice</span>
                  </label>
                  <label className="text-[11px] text-prevu-text-muted flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="mType"
                      checked={manualType === 'multiple'}
                      onChange={() => setManualType('multiple')}
                    />
                    <span>Multi-Select (Select all that apply)</span>
                  </label>
                </div>
              </div>
              <textarea
                rows={3}
                value={manualQuestion}
                onChange={e => setManualQuestion(e.target.value)}
                placeholder="Type question text..."
                required
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-prevu-accent focus:outline-none"
              />
            </div>

            {/* Options */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-prevu-text-muted block">
                Options &amp; Correct Answer Key * (Click letter to toggle correct answer)
              </label>

              <div className="space-y-2">
                {manualOptions.map((opt, idx) => {
                  const letter = optionLetters[idx]
                  const isCorrect = manualCorrect.includes(letter)

                  return (
                    <div key={letter} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (manualType === 'single') {
                            setManualCorrect([letter])
                          } else {
                            setManualCorrect(prev => prev.includes(letter) ? prev.filter(l => l !== letter) : [...prev, letter])
                          }
                        }}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 cursor-pointer transition-all ${
                          isCorrect
                            ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400'
                            : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:border-emerald-500/50'
                        }`}
                      >
                        {letter}
                      </button>
                      <input
                        type="text"
                        value={opt}
                        onChange={e => {
                          const next = [...manualOptions]
                          next[idx] = e.target.value
                          setManualOptions(next)
                        }}
                        placeholder={`Option ${letter} text...`}
                        className={`flex-1 px-3 py-2 bg-prevu-bg border rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:outline-none ${
                          isCorrect ? 'border-emerald-500/50' : 'border-prevu-surface-light focus:border-prevu-accent'
                        }`}
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Explanation */}
            <div>
              <label className="text-[11px] font-semibold text-prevu-text-muted block mb-1">
                Solution &amp; Explanation
              </label>
              <textarea
                rows={2}
                value={manualExplanation}
                onChange={e => setManualExplanation(e.target.value)}
                placeholder="Why is this the correct answer..."
                className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-prevu-accent focus:outline-none"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                type="submit"
                disabled={loading}
                className="h-9 px-6 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-lg cursor-pointer"
              >
                {loading ? 'Submitting...' : 'Submit Question (+5 Karma)'}
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
