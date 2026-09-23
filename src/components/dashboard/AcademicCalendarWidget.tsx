'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  CalendarDays, 
  ChevronRight, 
  Search
} from 'lucide-react'
import Link from 'next/link'

import { CUCalendarItem, OFFICIAL_CU_CALENDAR_2026 } from '@/lib/data/academicCalendar'
export type { CUCalendarItem }
export { OFFICIAL_CU_CALENDAR_2026 }

export default function AcademicCalendarWidget({ semester = 1 }: { semester?: number }) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'exam' | 'practical' | 'holiday' | 'academic'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = OFFICIAL_CU_CALENDAR_2026.filter(item => {
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter
    const matchesSearch = searchQuery === '' || 
      item.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.dateDisplay.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <Card className="border-prevu-surface-light bg-prevu-surface/90 shadow-xl overflow-hidden">
      
      {/* Header */}
      <CardHeader className="border-b border-prevu-surface-light/60 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                CHANDIGARH UNIVERSITY
              </span>
              <span className="text-[11px] font-mono text-prevu-text-muted">
                Session 2026-27 [Version 1.3]
              </span>
            </div>
            <CardTitle className="text-xl font-bold text-prevu-text flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-prevu-accent" />
              <span>Official Academic Calendar (Odd Semester: Jul-Dec 2026)</span>
            </CardTitle>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-prevu-text-muted bg-prevu-bg px-3 py-1 rounded-full border border-prevu-surface-light">
              Semesters 1, 3, 5, 7
            </span>
          </div>
        </div>

        {/* Filter Pills & Search */}
        <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === 'all'
                  ? 'bg-prevu-accent text-white'
                  : 'text-prevu-text-muted hover:text-prevu-text bg-prevu-bg border border-prevu-surface-light'
              }`}
            >
              All Events ({OFFICIAL_CU_CALENDAR_2026.length})
            </button>
            <button
              onClick={() => setActiveFilter('exam')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === 'exam'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-300 hover:text-purple-200 bg-purple-500/10 border border-purple-500/20'
              }`}
            >
              Tests & Theory (IST / EST)
            </button>
            <button
              onClick={() => setActiveFilter('practical')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === 'practical'
                  ? 'bg-cyan-600 text-white'
                  : 'text-cyan-300 hover:text-cyan-200 bg-cyan-500/10 border border-cyan-500/20'
              }`}
            >
              Practical & Lab IST
            </button>
            <button
              onClick={() => setActiveFilter('holiday')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                activeFilter === 'holiday'
                  ? 'bg-rose-600 text-white'
                  : 'text-rose-300 hover:text-rose-200 bg-rose-500/10 border border-rose-500/20'
              }`}
            >
              Diwali Break
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-prevu-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search date or activity..."
              className="pl-8 pr-3 py-1.5 bg-prevu-bg border border-prevu-surface-light rounded-lg text-xs text-prevu-text focus:outline-none focus:border-prevu-accent w-full sm:w-56"
            />
          </div>
        </div>
      </CardHeader>

      {/* Calendar Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
              <tr>
                <th className="p-3.5 font-semibold">Date & Day</th>
                <th className="p-3.5 font-semibold">Activity / Academic Milestone</th>
                <th className="p-3.5 font-semibold">Scope</th>
                <th className="p-3.5 font-semibold text-right">Study Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-prevu-surface-light/60">
              {filteredItems.map((item) => {
                const isExam = item.category === 'exam'
                const isPractical = item.category === 'practical'
                const isHoliday = item.category === 'holiday'

                return (
                  <tr 
                    key={item.id} 
                    className={`hover:bg-prevu-surface-light/30 transition-colors ${
                      isExam ? 'bg-purple-950/15' : isHoliday ? 'bg-rose-950/10' : ''
                    }`}
                  >
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-mono font-bold text-prevu-text text-xs">
                        {item.dateDisplay}
                      </div>
                      <div className="text-[11px] font-mono text-prevu-text-muted">
                        {item.dayDisplay}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${
                          isExam ? 'text-purple-200 font-bold' : isHoliday ? 'text-rose-300' : 'text-prevu-text'
                        }`}>
                          {item.activity}
                        </span>
                        
                        {isExam && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Major Exam
                          </span>
                        )}
                        {isPractical && (
                          <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Practical
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 whitespace-nowrap">
                      <span className="text-xs text-prevu-text-muted bg-prevu-bg px-2 py-0.5 rounded border border-prevu-surface-light">
                        {item.batch}
                      </span>
                    </td>

                    <td className="p-3.5 text-right whitespace-nowrap">
                      {item.practiceType ? (
                        <Button 
                          size="sm" 
                          className="h-7 text-xs bg-prevu-accent/20 hover:bg-prevu-accent/30 text-prevu-accent border border-prevu-accent/40"
                          asChild
                        >
                          <Link href={`/browse?sem=${semester}&type=${item.practiceType}`}>
                            <span>Solve {item.practiceType} Papers</span>
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      ) : (
                        <span className="text-[11px] text-prevu-text-muted font-mono">—</span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>

    </Card>
  )
}
