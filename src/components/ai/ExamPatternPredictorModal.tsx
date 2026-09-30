'use client'

import { useState, useEffect } from 'react'
import { Sparkles, X, Loader2, TrendingUp, AlertCircle, CheckCircle2, ShieldCheck, Flame, BookOpen, Layers } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { predictExamPatterns, ExamPatternPredictionResult } from '@/app/api/ai/actions'

interface ExamPatternPredictorModalProps {
  isOpen: boolean
  onClose: () => void
  initialSubjectName?: string
  initialSubjectCode?: string
}

const CU_PREDICTOR_SUBJECTS = [
  { name: 'Data Structures & Algorithms', code: '21CSH-201', sem: 3 },
  { name: 'Operating Systems', code: '21CSH-202', sem: 4 },
  { name: 'Database Management Systems', code: '21CSH-203', sem: 4 },
  { name: 'Computer Networks', code: '21CSH-204', sem: 5 },
  { name: 'Design & Analysis of Algorithms', code: '21CSH-205', sem: 4 },
  { name: 'Theory of Computation', code: '21CSH-206', sem: 5 },
  { name: 'Artificial Intelligence & Machine Learning', code: '21CSH-301', sem: 6 }
]

export default function ExamPatternPredictorModal({
  isOpen,
  onClose,
  initialSubjectName = 'Operating Systems',
  initialSubjectCode = '21CSH-202'
}: ExamPatternPredictorModalProps) {
  const [selectedSubject, setSelectedSubject] = useState(initialSubjectName)
  const [selectedCode, setSelectedCode] = useState(initialSubjectCode)
  const [examType, setExamType] = useState<'MST1' | 'MST2' | 'EST'>('MST1')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<ExamPatternPredictionResult['predictions'] | null>(null)

  const handlePredict = async (subject: string, code: string, type: 'MST1' | 'MST2' | 'EST') => {
    setLoading(true)
    try {
      const res = await predictExamPatterns(subject, code, type)
      if (res.success && res.predictions) {
        setData(res.predictions)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      handlePredict(selectedSubject, selectedCode, examType)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl my-8 p-6 sm:p-8 rounded-3xl bg-[#11111a] border border-fuchsia-500/40 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-600/15 blur-3xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-fuchsia-600/30 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 uppercase tracking-wider mb-1">
                <span>AI Exam Pattern & Question Predictor</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Recurring Question & Pattern Predictor
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-prevu-text-muted hover:text-white rounded-xl hover:bg-prevu-surface-light transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Controls: Subject & Exam Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light">
          <div>
            <label className="block text-[11px] font-bold text-prevu-text-muted uppercase mb-1.5">
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                const found = CU_PREDICTOR_SUBJECTS.find(s => s.name === e.target.value)
                const name = e.target.value
                const code = found?.code || '21CSH-201'
                setSelectedSubject(name)
                setSelectedCode(code)
                handlePredict(name, code, examType)
              }}
              className="w-full px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-fuchsia-500"
            >
              {CU_PREDICTOR_SUBJECTS.map(s => (
                <option key={s.code} value={s.name}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-prevu-text-muted uppercase mb-1.5">
              Exam Format
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['MST1', 'MST2', 'EST'] as const).map(fmt => (
                <button
                  key={fmt}
                  onClick={() => {
                    setExamType(fmt)
                    handlePredict(selectedSubject, selectedCode, fmt)
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    examType === fmt
                      ? 'bg-fuchsia-600 text-white border-fuchsia-500 shadow-md shadow-fuchsia-600/30'
                      : 'bg-prevu-bg/70 border-prevu-surface-light text-prevu-text-muted hover:text-white'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3 text-center">
            <Loader2 className="w-8 h-8 text-fuchsia-400 animate-spin" />
            <p className="text-xs text-prevu-text-muted">
              Scanning 5 years of CU {selectedSubject} papers & predicting exam patterns...
            </p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            
            {/* Examiner Advice Callout */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-fuchsia-950/40 via-prevu-surface to-purple-950/40 border border-fuchsia-500/30 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-fuchsia-400 shrink-0 mt-0.5" />
              <div className="text-xs text-prevu-text leading-relaxed">
                <strong className="text-white block mb-0.5">Senior Examiner Strategy:</strong>
                {data.examinerAdvice}
              </div>
            </div>

            {/* High Probability Predicted Questions */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span>High-Probability Predicted Questions ({data.examType})</span>
                </h3>
                <span className="text-[10px] font-mono text-fuchsia-300">
                  Based on 2021–2026 recurrence
                </span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {data.highProbabilityQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light hover:border-fuchsia-500/40 transition-all space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xs font-mono font-bold text-fuchsia-400 bg-fuchsia-500/10 px-2 py-0.5 rounded-lg border border-fuchsia-500/20 shrink-0 mt-0.5">
                          #{idx + 1}
                        </span>
                        <div className="text-xs font-semibold text-white leading-relaxed">
                          {q.question}
                        </div>
                      </div>

                      {/* Probability Meter Badge */}
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                          {q.probability}% Chance
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-prevu-text-muted pt-1 border-t border-prevu-surface-light/40">
                      <span>{q.unit} • {q.marks}</span>
                      <span className="text-fuchsia-300/80">{q.frequencyYears}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Repeated Topics Heatmap & Safe to Deprioritize */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Heatmap */}
              <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Frequently Tested Syllabus Topics</span>
                </h4>
                <div className="space-y-2">
                  {data.repeatedTopicsHeatmap.map((t, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-prevu-bg/60 border border-prevu-surface-light/60">
                      <span className="text-white font-medium truncate mr-2">{t.topic}</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 shrink-0">
                        {t.appearanceRate}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safe to Deprioritize */}
              <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Topics Safe to Deprioritize (Low Yield)</span>
                </h4>
                <div className="space-y-2">
                  {data.safeToDeprioritize.map((item, i) => (
                    <div key={i} className="text-xs p-2 rounded-xl bg-prevu-bg/60 border border-prevu-surface-light/60 text-prevu-text-muted flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        ) : null}

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-prevu-surface-light">
          <span className="text-xs text-prevu-text-muted">
            Targeting 8.5+ CGPA at Chandigarh University
          </span>
          <Button size="sm" onClick={onClose} className="text-xs">
            Close Predictor
          </Button>
        </div>

      </div>
    </div>
  )
}
