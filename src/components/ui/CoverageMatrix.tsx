'use client'

import React from 'react'
import Link from 'next/link'
import { Check, Plus, FileText } from 'lucide-react'

export interface CoveragePaperRecord {
  id: string
  exam_year: number
  examType: 'MST1' | 'MST2' | 'EST' | string
  original_filename?: string
}

interface CoverageMatrixProps {
  subjectName: string
  subjectCode: string
  papers: CoveragePaperRecord[]
  years?: number[]
  examTypes?: string[]
}

export function CoverageMatrix({
  subjectName,
  subjectCode,
  papers,
  years = [2026, 2025, 2024, 2023, 2022],
  examTypes = ['MST1', 'MST2', 'EST']
}: CoverageMatrixProps) {
  // Build lookup map: year -> examType -> paper
  const matrix = React.useMemo(() => {
    const map = new Map<string, CoveragePaperRecord>()
    papers.forEach(p => {
      const cleanType = (p.examType || '').toUpperCase().replace(/[\s-]/g, '')
      const key = `${p.exam_year}-${cleanType}`
      map.set(key, p)
    })
    return map
  }, [papers])

  const totalPossible = years.length * examTypes.length
  let totalAvailable = 0

  years.forEach(y => {
    examTypes.forEach(t => {
      const cleanType = t.toUpperCase().replace(/[\s-]/g, '')
      if (matrix.has(`${y}-${cleanType}`)) {
        totalAvailable++
      }
    })
  })

  const coveragePercent = totalPossible > 0 ? Math.round((totalAvailable / totalPossible) * 100) : 0

  return (
    <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface overflow-hidden shadow-xl">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-prevu-surface-light flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-prevu-bg/40">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-prevu-accent" />
              Vault Archive Coverage
            </h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 font-semibold">
              {coveragePercent}% Verified
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-0.5">
            Availability matrix across previous university test sessions for <strong className="text-white font-mono">{subjectCode}</strong>.
          </p>
        </div>

        <Link
          href={`/upload?subject_name=${encodeURIComponent(subjectName)}&subject_code=${encodeURIComponent(subjectCode)}`}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-prevu-accent/10 hover:bg-prevu-accent/20 text-prevu-accent border border-prevu-accent/30 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" /> Submit Missing Year
        </Link>
      </div>

      {/* Grid table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-prevu-surface-light/80 bg-prevu-surface-light/30">
              <th className="py-3 px-4 font-mono font-semibold text-prevu-text-muted">Exam Type</th>
              {years.map(year => (
                <th key={year} className="py-3 px-4 font-mono font-bold text-white text-center">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-prevu-surface-light/50 font-mono">
            {examTypes.map(type => {
              const cleanType = type.toUpperCase().replace(/[\s-]/g, '')
              const displayName = type === 'MST1' ? 'MST-1 (In-Sem 1)' : type === 'MST2' ? 'MST-2 (In-Sem 2)' : 'EST (End-Sem)'

              return (
                <tr key={type} className="hover:bg-prevu-surface-light/20 transition-colors">
                  <td className="py-3.5 px-4 font-sans font-semibold text-white">
                    {displayName}
                  </td>
                  {years.map(year => {
                    const paper = matrix.get(`${year}-${cleanType}`)

                    if (paper) {
                      return (
                        <td key={year} className="py-3 px-4 text-center">
                          <Link
                            href={`/paper/${paper.id}`}
                            className="inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold transition-all group"
                            title={`View ${year} ${type} paper`}
                          >
                            <Check className="w-3 h-3 stroke-[2.5]" />
                            <span className="text-[11px]">Avail</span>
                          </Link>
                        </td>
                      )
                    }

                    return (
                      <td key={year} className="py-3 px-4 text-center text-prevu-text-muted/40">
                        <span className="text-base select-none">—</span>
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer hint */}
      <div className="p-3 px-4 bg-prevu-bg/30 border-t border-prevu-surface-light/60 flex items-center justify-between text-[11px] text-prevu-text-muted">
        <span>Click any available badge to view paper metadata, preview, and download.</span>
        <span className="font-mono text-white/80">{totalAvailable} / {totalPossible} papers archived</span>
      </div>
    </div>
  )
}
