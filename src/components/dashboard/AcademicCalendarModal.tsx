'use client'

import { useState } from 'react'
import { Calendar, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import AcademicCalendarWidget from './AcademicCalendarWidget'

export default function AcademicCalendarModal({ semester = 1 }: { semester?: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-10 px-4 rounded-2xl bg-prevu-surface hover:bg-prevu-surface-light border border-prevu-surface-light hover:border-purple-500/40 text-xs font-bold text-prevu-text shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
      >
        <Calendar className="w-4 h-4 text-purple-400" />
        <span>Official Academic Calendar (2026-27)</span>
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-prevu-surface-light bg-prevu-bg shadow-2xl p-6 space-y-4"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-prevu-surface-light/80 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-prevu-text">Official Chandigarh University Academic Calendar</h2>
                  <p className="text-xs text-prevu-text-muted">Session 2026-27 [Version: 1.3] • Odd Semester (Jul-Dec 2026)</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface border border-prevu-surface-light transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Render Academic Calendar Inside Modal */}
            <div className="pt-2">
              <AcademicCalendarWidget semester={semester} />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-prevu-surface-light/60 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="border-prevu-surface-light text-xs"
              >
                Close Calendar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
