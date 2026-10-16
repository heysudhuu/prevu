'use client'

import React, { useState } from 'react'
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
  Plus
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitCommunityCbtQuestion, batchSubmitCommunityCbtQuestions, proposeNewCbtSubject } from '@/lib/cbt/actions'
import { CBT_SUBJECTS } from '@/lib/cbt/cbtRegistry'
import { parseMcqText, ParsedMcqItem } from '@/lib/cbt/pdfParser'
import Link from 'next/link'

interface CbtQuestionContributorProps {
  initialSubject?: string
}

export default function CbtQuestionContributor({ initialSubject = '' }: CbtQuestionContributorProps) {
  // Mode selection: 'auto-parser' vs 'manual'
  const [activeTab, setActiveTab] = useState<'auto-parser' | 'manual'>('auto-parser')

  // Subject Selection vs Propose New Subject
  const [isProposingNewSubject, setIsProposingNewSubject] = useState<boolean>(false)
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>(initialSubject || 'FSO-307')
  const [subjectName, setSubjectName] = useState(
    initialSubject === 'FSO-307' ? 'Mobile Application & Device Security' : 'Mobile Application & Device Security'
  )
  const [semester, setSemester] = useState<number>(7)
  const [category, setCategory] = useState<string>('open-elective')

  // Propose New Subject Fields
  const [newSubjCode, setNewSubjCode] = useState('')
  const [newSubjName, setNewSubjName] = useState('')
  const [newSubjSemester, setNewSubjSemester] = useState(1)
  const [newSubjCategory, setNewSubjCategory] = useState('open-elective')

  // Auto-Parser State
  const [rawText, setRawText] = useState('')
  const [parsedQuestions, setParsedQuestions] = useState<ParsedMcqItem[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [parseNotice, setParseNotice] = useState<string | null>(null)

  // Manual Question state
  const [manualQuestion, setManualQuestion] = useState('')
  const [manualType, setManualType] = useState<'single' | 'multiple'>('single')
  const [manualOptions, setManualOptions] = useState<string[]>(['', '', '', ''])
  const [manualCorrect, setManualCorrect] = useState<string[]>([])
  const [manualExplanation, setManualExplanation] = useState('')
  const [unitTag, setUnitTag] = useState('')

  // Submission State
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F']

  // Handle subject change from dropdown
  const handleSelectSubject = (code: string) => {
    setSelectedSubjectCode(code)
    const found = CBT_SUBJECTS.find(s => s.code === code)
    if (found) {
      setSubjectName(found.name)
      setSemester(found.semester)
      setCategory(found.category)
    }
  }

  // Handle PDF / Text File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setParseNotice(`Reading file "${file.name}"...`)
    const reader = new FileReader()
    
    // For text / md / transcripts
    reader.onload = (event) => {
      const text = event.target?.result as string
      if (text) {
        setRawText(text)
        handleConvertText(text)
      }
    }
    reader.readAsText(file)
  }

  // Convert raw text into MCQ cards
  const handleConvertText = (textToParse?: string) => {
    const text = textToParse || rawText
    if (!text.trim()) {
      setError('Please paste text or upload a document first.')
      return
    }

    setIsParsing(true)
    setError(null)
    setParseNotice(null)

    try {
      const results = parseMcqText(text)
      if (results.length === 0) {
        setError('Could not detect question patterns (e.g. "Q1. ...", "A. ..."). Please ensure the text contains question numbers and options.')
      } else {
        setParsedQuestions(results)
        setParseNotice(`Successfully detected and converted ${results.length} MCQ questions! You can review and edit each question below before submitting.`)
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

  // Submit batch parsed questions
  const handleSubmitBatch = async () => {
    if (parsedQuestions.length === 0) {
      setError('No parsed questions to submit.')
      return
    }

    setLoading(true)
    setError(null)

    const effectiveCode = isProposingNewSubject ? newSubjCode : selectedSubjectCode
    const effectiveName = isProposingNewSubject ? newSubjName : subjectName
    const effectiveSem = isProposingNewSubject ? newSubjSemester : semester
    const effectiveCat = isProposingNewSubject ? newSubjCategory : category

    if (!effectiveCode || !effectiveName) {
      setError('Please select or specify a valid subject code and name.')
      setLoading(false)
      return
    }

    try {
      // If student is also proposing a new subject, create the pending subject first
      if (isProposingNewSubject) {
        await proposeNewCbtSubject({
          code: newSubjCode,
          name: newSubjName,
          semester: newSubjSemester,
          category: newSubjCategory
        })
      }

      const res = await batchSubmitCommunityCbtQuestions({
        subjectCode: effectiveCode,
        subjectName: effectiveName,
        semester: effectiveSem,
        category: effectiveCat,
        questions: parsedQuestions.map(q => ({
          question: q.question,
          questionType: q.type,
          options: q.options,
          correctAnswers: q.correctAnswers,
          explanation: q.explanation,
          sectionName: q.sectionName
        }))
      })

      if (res.error) {
        setError(res.error)
      } else {
        setSuccessMessage(`Successfully submitted ${parsedQuestions.length} questions for subject "${effectiveName}"! They are now pending admin review. You will earn +5 Karma for each approved question.`)
        setParsedQuestions([])
        setRawText('')
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

    const effectiveCode = isProposingNewSubject ? newSubjCode : selectedSubjectCode
    const effectiveName = isProposingNewSubject ? newSubjName : subjectName
    const effectiveSem = isProposingNewSubject ? newSubjSemester : semester
    const effectiveCat = isProposingNewSubject ? newSubjCategory : category

    if (!effectiveCode || !effectiveName) {
      setError('Please provide subject code and name.')
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
      if (isProposingNewSubject) {
        await proposeNewCbtSubject({
          code: newSubjCode,
          name: newSubjName,
          semester: newSubjSemester,
          category: newSubjCategory
        })
      }

      const res = await submitCommunityCbtQuestion({
        subjectCode: effectiveCode,
        subjectName: effectiveName,
        semester: effectiveSem,
        category: effectiveCat,
        question: manualQuestion,
        questionType: manualType,
        options: filledOptions,
        correctAnswers: manualCorrect,
        explanation: manualExplanation,
        unitTag
      })

      if (res.error) {
        setError(res.error)
      } else {
        setSuccessMessage('Question submitted successfully! It is now pending admin review. You will earn +5 Karma once approved.')
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
            Upload question banks, convert PDF/notes into MCQs, or propose new subjects. All submissions are verified by admin to maintain high exam standards.
          </p>
        </div>

        {/* Global Feedback Messages */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in font-medium">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
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

        {/* SECTION 1: Subject Selection & "+ Propose New Subject" Toggle */}
        <div className="p-4 rounded-2xl bg-prevu-bg/50 border border-prevu-surface-light space-y-3">
          <div className="flex items-center justify-between text-xs">
            <label className="font-bold text-white flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              <span>Target Subject</span>
            </label>
            <button
              type="button"
              onClick={() => setIsProposingNewSubject(!isProposingNewSubject)}
              className="text-[11px] text-cyan-400 hover:underline font-semibold flex items-center gap-1"
            >
              {isProposingNewSubject ? '← Pick from existing subjects' : '+ Can\'t find your subject? Add New Subject'}
            </button>
          </div>

          {!isProposingNewSubject ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-prevu-text-muted block mb-1">
                  Registered Subject
                </label>
                <select
                  value={selectedSubjectCode}
                  onChange={e => handleSelectSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:border-prevu-accent focus:outline-none"
                >
                  {CBT_SUBJECTS.map(s => (
                    <option key={s.code} value={s.code}>
                      [{s.code}] {s.name} (Sem {s.semester})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-prevu-text-muted block mb-1">
                  Category & Standing
                </label>
                <div className="px-3 py-2 bg-prevu-surface/40 border border-prevu-surface-light rounded-xl text-xs text-cyan-300 font-mono">
                  {category.toUpperCase()} • Sem {semester}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 border-t border-prevu-surface-light/40">
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-200 text-xs">
                ✨ Propose a brand-new subject. It will be verified and added to the official CBT registry upon admin approval!
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
                    placeholder="e.g. 23CSH-315, UHV-102"
                    required
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-prevu-accent focus:outline-none font-mono"
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
                    placeholder="e.g. Cloud Computing & DevOps"
                    required
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/50 focus:border-prevu-accent focus:outline-none"
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
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:border-prevu-accent focus:outline-none"
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
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white focus:border-prevu-accent focus:outline-none"
                  >
                    <option value="open-elective">Open Elective</option>
                    <option value="aptitude">Aptitude & Placements</option>
                    <option value="uhv">UHV (Universal Human Values)</option>
                    <option value="core">Core Technical CBT</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: CONTRIBUTION METHOD TABS */}
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
            <span>Smart PDF & Text Auto-Converter</span>
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

        {/* TAB 1: SMART PDF & TEXT AUTO-CONVERTER */}
        {activeTab === 'auto-parser' && (
          <div className="space-y-5">
            
            <div className="p-4 rounded-2xl bg-prevu-bg/60 border border-prevu-surface-light space-y-3">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-white flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-prevu-accent" />
                  <span>Paste Question Bank Text or Upload Document</span>
                </label>
                <label className="cursor-pointer text-[11px] text-cyan-400 hover:underline font-semibold flex items-center gap-1">
                  <FileUp className="w-3 h-3" />
                  <span>Browse .txt / document file</span>
                  <input
                    type="file"
                    accept=".txt,.md,.text"
                    onChange={handleFileUpload}
                    className="sr-only"
                  />
                </label>
              </div>

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

Q2. Which protocol family is commonly used to protect communications?
■ A. FTP
■ B. Plain HTTP
■ C. TLS
Correct answer: C`}
                className="w-full p-3 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-white placeholder:text-prevu-text-muted/40 focus:border-prevu-accent focus:outline-none font-mono leading-relaxed"
              />

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-prevu-text-muted">
                  Supports "Q1.", "■ A.", "Answer: A, B", and "Answer Key & Explanations" sections.
                </span>
                <Button
                  type="button"
                  size="sm"
                  disabled={isParsing || !rawText.trim()}
                  onClick={() => handleConvertText()}
                  className="h-8 px-4 text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isParsing ? 'Converting...' : 'Auto-Convert to MCQs'}</span>
                </Button>
              </div>
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
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Extracted MCQs ({parsedQuestions.length} Questions)
                  </h3>
                  <Button
                    type="button"
                    size="sm"
                    disabled={loading}
                    onClick={handleSubmitBatch}
                    className="h-8 px-5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-1.5"
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
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveParsed(q.id)}
                          className="text-prevu-text-muted hover:text-rose-400 p-1"
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
                    className="h-9 px-6 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Submitting...' : `Submit All ${parsedQuestions.length} Questions for Admin Review`}</span>
                  </Button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: MANUAL QUESTION FORM */}
        {activeTab === 'manual' && (
          <form onSubmit={handleSubmitManual} className="space-y-4">
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
                Options & Correct Answer Key * (Click letter to toggle correct answer)
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
                Solution & Explanation
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
                className="h-9 px-6 text-xs font-bold bg-prevu-accent text-white hover:bg-prevu-accent-hover shadow-lg"
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
