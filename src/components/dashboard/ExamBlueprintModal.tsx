'use client'

import { useState } from 'react'
import { FileSpreadsheet, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import ExamBlueprintWidget from './ExamBlueprintWidget'

export default function ExamBlueprintModal({ semester = 1 }: { semester?: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        onClick={() => setIsOpen(true)}
        className="h-10 px-4 rounded-2xl bg-prevu-surface hover:bg-prevu-surface-light border border-prevu-surface-light hover:border-emerald-500/40 text-xs font-bold text-prevu-text shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
      >
        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
        <span>Question Paper Pattern & Blueprints</span>
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
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-prevu-text">Official CU Model Question Paper Blueprints</h2>
                  <p className="text-xs text-prevu-text-muted">MST 1 & 2 (20 Marks) • EST Final Theory (60 Marks)</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface border border-prevu-surface-light transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Render Blueprint Inside Modal */}
            <div className="pt-2">
              <ExamBlueprintWidget semester={semester} />
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-prevu-surface-light/60 flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsOpen(false)}
                className="border-prevu-surface-light text-xs"
              >
                Close Blueprints
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
