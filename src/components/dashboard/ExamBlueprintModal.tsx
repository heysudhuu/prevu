'use client'

import { useState, useEffect } from 'react'
import { FileSpreadsheet, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import ExamBlueprintWidget from './ExamBlueprintWidget'

export default function ExamBlueprintModal({ semester = 1, compact = false }: { semester?: number; compact?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isOpen])

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-prevu-bg/60 hover:bg-prevu-surface-light/60 border border-prevu-surface-light/70 hover:border-emerald-500/40 text-xs font-semibold text-prevu-text transition-all cursor-pointer group"
        >
          <span className="flex items-center gap-2">
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Paper Blueprints</span>
          </span>
          <span className="text-[10px] font-mono text-emerald-300/80">MST/EST</span>
        </button>
      ) : (
        <Button
          type="button"
          onClick={() => setIsOpen(true)}
          className="h-10 px-4 rounded-2xl bg-prevu-surface hover:bg-prevu-surface-light border border-prevu-surface-light hover:border-emerald-500/40 text-xs font-bold text-prevu-text shadow-md flex items-center gap-2 transition-all hover:scale-[1.02]"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
          <span>Question Paper Pattern & Blueprints</span>
        </Button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 14 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ type: 'spring', stiffness: 360, damping: 28 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto scrollbar-thin rounded-3xl border border-prevu-surface-light bg-prevu-bg shadow-2xl p-6 space-y-4"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-prevu-surface-light/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-prevu-text">Official CU Model Question Paper Blueprints</h2>
                    <p className="text-xs text-prevu-text-muted">MST 1 &amp; 2 (20 Marks) • EST Final Theory (60 Marks)</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close modal"
                  className="p-2 rounded-xl text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface border border-prevu-surface-light transition-colors cursor-pointer"
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
