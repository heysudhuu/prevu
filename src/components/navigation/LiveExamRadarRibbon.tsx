'use client'

import ExamCountdownTicker from '@/components/exam/ExamCountdownTicker'

export default function LiveExamRadarRibbon() {
  return (
    <div className="bg-[#090d13] border-b border-purple-500/25 px-3 sm:px-4 py-1 text-xs select-none">
      <div className="container mx-auto max-w-7xl 2xl:max-w-[1720px] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
          <span className="font-mono text-purple-300 font-bold text-[11px] uppercase tracking-wider shrink-0 hidden xs:inline">
            CU Exam Radar
          </span>
          <span className="text-[#8b949e] text-[11px] truncate hidden md:inline">
            // Odd Semester Academic Timetable Active
          </span>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <ExamCountdownTicker />
        </div>
      </div>
    </div>
  )
}
