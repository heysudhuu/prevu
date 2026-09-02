'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  FileSpreadsheet, 
  Clock, 
  Award, 
  Sparkles
} from 'lucide-react'
import Link from 'next/link'

export default function ExamBlueprintWidget({ semester = 1 }: { semester?: number }) {
  const [selectedPattern, setSelectedPattern] = useState<'MST' | 'EST'>('MST')

  return (
    <Card className="border-prevu-surface-light bg-prevu-surface/90 shadow-xl overflow-hidden">
      <CardHeader className="border-b border-prevu-surface-light/60 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                OFFICIAL CU BLUEPRINT
              </span>
              <span className="text-[11px] font-mono text-prevu-text-muted">
                Session 2024–2026 Academic Pattern
              </span>
            </div>
            <CardTitle className="text-xl font-bold text-prevu-text flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-prevu-accent" />
              <span>Official Model Question Paper Pattern</span>
            </CardTitle>
            <CardDescription className="text-xs text-prevu-text-muted mt-0.5">
              Exact section-wise marks distribution, CO mapping & question structure for Chandigarh University tests.
            </CardDescription>
          </div>

          {/* Pattern Toggle */}
          <div className="flex items-center p-1 bg-prevu-bg border border-prevu-surface-light rounded-xl">
            <button
              onClick={() => setSelectedPattern('MST')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedPattern === 'MST'
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              MST 1 & 2 (20 Marks)
            </button>
            <button
              onClick={() => setSelectedPattern('EST')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedPattern === 'EST'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              EST Final (60 Marks)
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5 sm:p-6 space-y-6">
        
        {/* ============================================================ */}
        {/* MST BLUEPRINT (20 MARKS, 1 HOUR) */}
        {/* ============================================================ */}
        {selectedPattern === 'MST' && (
          <div className="space-y-5 animate-fade-in">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                <div className="text-[10px] text-prevu-text-muted font-semibold uppercase tracking-wider">Total Duration</div>
                <div className="text-base font-extrabold text-prevu-text font-mono mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-400" /> 1 Hour (60 Min)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                <div className="text-[10px] text-prevu-text-muted font-semibold uppercase tracking-wider">Maximum Marks</div>
                <div className="text-base font-extrabold text-purple-300 font-mono mt-0.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-400" /> 20 Marks
                </div>
              </div>

              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                <div className="text-[10px] text-prevu-text-muted font-semibold uppercase tracking-wider">Total Questions</div>
                <div className="text-base font-extrabold text-prevu-text font-mono mt-0.5">
                  7 Questions
                </div>
              </div>

              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                <div className="text-[10px] text-prevu-text-muted font-semibold uppercase tracking-wider">Attempt Rule</div>
                <div className="text-xs font-bold text-amber-400 mt-1">
                  Attempt All (Compulsory)
                </div>
              </div>
            </div>

            {/* Sections Breakdown Table */}
            <div className="overflow-x-auto rounded-xl border border-prevu-surface-light bg-prevu-bg/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
                  <tr>
                    <th className="p-3.5 font-semibold">Section</th>
                    <th className="p-3.5 font-semibold">Questions</th>
                    <th className="p-3.5 font-semibold">Formula / Marks</th>
                    <th className="p-3.5 font-semibold">Syllabus Scope</th>
                    <th className="p-3.5 font-semibold">Question Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-prevu-surface-light/60">
                  <tr className="hover:bg-prevu-surface-light/30 transition-colors">
                    <td className="p-3.5 font-bold text-purple-300">
                      Section A
                    </td>
                    <td className="p-3.5 font-mono text-prevu-text">
                      Q1 to Q5 (5 Questions)
                    </td>
                    <td className="p-3.5 font-mono font-bold text-prevu-accent">
                      5 × 2 = 10 Marks
                    </td>
                    <td className="p-3.5 text-prevu-text-muted">
                      UNIT-I (MST1) / UNIT-III (MST2)
                    </td>
                    <td className="p-3.5 text-prevu-text-muted">
                      Short Answer / Conceptual / Definitions
                    </td>
                  </tr>

                  <tr className="hover:bg-prevu-surface-light/30 transition-colors">
                    <td className="p-3.5 font-bold text-purple-300">
                      Section B
                    </td>
                    <td className="p-3.5 font-mono text-prevu-text">
                      Q6 & Q7 (2 Questions)
                    </td>
                    <td className="p-3.5 font-mono font-bold text-purple-400">
                      2 × 5 = 10 Marks
                    </td>
                    <td className="p-3.5 text-prevu-text-muted">
                      UNIT-I / UNIT-II (MST1) or UNIT-IV (MST2)
                    </td>
                    <td className="p-3.5 text-prevu-text-muted">
                      Descriptive / Derivations / Numerical Problems
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Practice Link */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs">
              <div className="flex items-center gap-2 text-purple-200">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
                <span>Ready to test your preparation for MST 1 & MST 2?</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" className="h-7 text-xs bg-purple-600/30 hover:bg-purple-600/50 text-purple-200" asChild>
                  <Link href={`/browse?sem=${semester}&type=1`}>Solve MST 1 Papers</Link>
                </Button>
                <Button size="sm" variant="secondary" className="h-7 text-xs bg-purple-600/30 hover:bg-purple-600/50 text-purple-200" asChild>
                  <Link href={`/browse?sem=${semester}&type=2`}>Solve MST 2 Papers</Link>
                </Button>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================ */}
        {/* EST BLUEPRINT (60 MARKS, 3 HOURS) */}
        {/* ============================================================ */}
        {selectedPattern === 'EST' && (
          <div className="space-y-5 animate-fade-in">
            
            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                <div className="text-[10px] text-prevu-text-muted font-semibold uppercase tracking-wider">Total Duration</div>
                <div className="text-base font-extrabold text-prevu-text font-mono mt-0.5 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-400" /> 3 Hours (180 Min)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                <div className="text-[10px] text-prevu-text-muted font-semibold uppercase tracking-wider">Maximum Marks</div>
                <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-400" /> 60 Marks
                </div>
              </div>

              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                <div className="text-[10px] text-prevu-text-muted font-semibold uppercase tracking-wider">Total Sections</div>
                <div className="text-base font-extrabold text-prevu-text font-mono mt-0.5">
                  3 Sections (A, B, C)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light">
                <div className="text-[10px] text-prevu-text-muted font-semibold uppercase tracking-wider">Syllabus Scope</div>
                <div className="text-xs font-bold text-emerald-400 mt-1">
                  100% Comprehensive
                </div>
              </div>
            </div>

            {/* Sections Breakdown Table */}
            <div className="overflow-x-auto rounded-xl border border-prevu-surface-light bg-prevu-bg/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
                  <tr>
                    <th className="p-3.5 font-semibold">Section</th>
                    <th className="p-3.5 font-semibold">Questions & Unit Coverage</th>
                    <th className="p-3.5 font-semibold">Formula / Marks</th>
                    <th className="p-3.5 font-semibold">Instructions & Choices</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-prevu-surface-light/60">
                  <tr className="hover:bg-prevu-surface-light/30 transition-colors">
                    <td className="p-3.5 font-bold text-emerald-400">
                      Section A
                    </td>
                    <td className="p-3.5 text-prevu-text">
                      <div className="font-mono">Q1 (Unit-I), Q2 (Unit-II), Q3-Q5 (Unit-III)</div>
                      <div className="text-[11px] text-prevu-text-muted">5 Short questions</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      5 × 2 = 10 Marks
                    </td>
                    <td className="p-3.5 text-prevu-text-muted">
                      <span className="text-emerald-400 font-semibold">Compulsory</span> • Attempt all 5
                    </td>
                  </tr>

                  <tr className="hover:bg-prevu-surface-light/30 transition-colors">
                    <td className="p-3.5 font-bold text-emerald-400">
                      Section B
                    </td>
                    <td className="p-3.5 text-prevu-text">
                      <div className="font-mono">Q6 (Unit-I), Q7 (Unit-II), Q8-Q9 (Unit-III)</div>
                      <div className="text-[11px] text-prevu-text-muted">4 Medium-length questions</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      4 × 5 = 20 Marks
                    </td>
                    <td className="p-3.5 text-prevu-text-muted">
                      <span className="text-emerald-400 font-semibold">Compulsory</span> • Attempt all 4
                    </td>
                  </tr>

                  <tr className="hover:bg-prevu-surface-light/30 transition-colors">
                    <td className="p-3.5 font-bold text-emerald-400">
                      Section C
                    </td>
                    <td className="p-3.5 text-prevu-text">
                      <div className="font-mono">Q10 (Unit-I) + Q11 (Unit-II) + [Q12 OR Q13 (Unit-III)]</div>
                      <div className="text-[11px] text-prevu-text-muted">3 Long analytical / design questions</div>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-emerald-400">
                      3 × 10 = 30 Marks
                    </td>
                    <td className="p-3.5 text-prevu-text-muted">
                      Q10 & Q11 Compulsory; <strong className="text-emerald-300">Attempt 1 from Q12 or Q13</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Quick Practice Link */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-2 text-emerald-200">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Prepare with previous year End Semester Theory papers</span>
              </div>
              <Button size="sm" className="h-7 text-xs bg-emerald-600 hover:bg-emerald-500 text-white" asChild>
                <Link href={`/browse?sem=${semester}&type=3`}>Solve EST Papers</Link>
              </Button>
            </div>

          </div>
        )}

      </CardContent>
    </Card>
  )
}
