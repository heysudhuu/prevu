'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  AlertTriangle, 
  Trash2, 
  X, 
  Loader2, 
  CheckCircle2, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { deleteUserAccount } from '@/app/profile/actions'
import { auth } from '@/lib/firebase/client'

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  userEmail?: string
  username?: string
}

const DELETION_REASONS = [
  { id: 'graduated', label: '🎓 I graduated or completed my studies at Chandigarh University' },
  { id: 'exams_over', label: '📚 I finished my exams & found all the materials I needed' },
  { id: 'privacy', label: '🔒 Privacy, security, or personal data concerns' },
  { id: 'duplicate', label: '👥 I created another or duplicate account' },
  { id: 'notifications', label: '🔔 Too many notifications or no longer active on campus' },
  { id: 'other', label: '💬 Other reason' }
]

export default function DeleteAccountModal({
  isOpen,
  onClose,
  userEmail,
  username
}: DeleteAccountModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('')
  const [feedback, setFeedback] = useState<string>('')
  const [confirmationInput, setConfirmationInput] = useState<string>('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const isConfirmationMatched = confirmationInput.trim().toUpperCase() === 'DELETE'
  const canSubmit = selectedReason.trim().length > 0 && isConfirmationMatched && !isDeleting

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    setIsDeleting(true)
    setErrorMessage(null)

    const formData = new FormData()
    formData.append('reason', selectedReason)
    formData.append('feedback', feedback)
    formData.append('confirmation', confirmationInput.trim().toUpperCase())

    try {
      const res = await deleteUserAccount(formData)
      if (res.success) {
        // Sign out Firebase client session cleanly
        try {
          await auth.signOut()
        } catch {
          // ignore client signout errors
        }
        // Redirect to login page with departure confirmation banner
        window.location.href = '/login?deleted=true'
      } else {
        setErrorMessage(res.error || 'Failed to delete account. Please try again.')
        setIsDeleting(false)
      }
    } catch {
      setErrorMessage('Network or server error while deleting account. Please try again.')
      setIsDeleting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg rounded-3xl bg-[#11111a] border border-rose-500/40 p-6 sm:p-7 shadow-2xl shadow-rose-950/40 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Ambient red caution glow */}
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-600/20 blur-3xl rounded-full pointer-events-none" />

          {/* Modal Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0 shadow-md shadow-rose-500/10">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>Delete Prevu Account</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-bold">
                    Irreversible
                  </span>
                </h3>
                <p className="text-xs text-prevu-text-muted mt-0.5">
                  We&apos;re sorry to see you go. Tell us why you are leaving.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isDeleting}
              className="p-1.5 text-prevu-text-muted hover:text-white rounded-xl hover:bg-prevu-surface-light transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleDelete} className="space-y-4">
            
            {/* Step 1: Reason Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-white flex items-center justify-between">
                <span>1. Why do you want to delete your account? <span className="text-rose-400">*</span></span>
              </label>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {DELETION_REASONS.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                      selectedReason === r.label
                        ? 'bg-rose-500/15 border-rose-500/50 text-white font-medium shadow-sm'
                        : 'bg-prevu-surface/40 border-prevu-surface-light text-prevu-text-muted hover:text-white hover:bg-prevu-surface'
                    }`}
                  >
                    <input
                      type="radio"
                      name="deletion_reason"
                      checked={selectedReason === r.label}
                      onChange={() => setSelectedReason(r.label)}
                      className="accent-rose-500 w-3.5 h-3.5"
                    />
                    <span className="truncate">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Step 2: Feedback text (Optional) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-prevu-text-muted block">
                2. Any feedback for the Prevu team? (Optional)
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="How could we make Prevu better for Chandigarh University students?"
                rows={2}
                className="w-full p-2.5 rounded-xl bg-prevu-bg/90 border border-prevu-surface-light text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-500 transition-colors resize-none"
              />
            </div>

            {/* Step 3: Confirmation Safeguard */}
            <div className="p-3 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-2">
              <div className="flex items-start gap-2 text-rose-300 text-xs">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                <p className="leading-relaxed">
                  Deleting your account will remove your student ID card, bookmarked papers, and notifications permanently.
                </p>
              </div>

              <div className="space-y-1 pt-1">
                <label className="text-[11px] font-bold text-white block">
                  To confirm, please type <span className="font-mono text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/30">DELETE</span> below:
                </label>
                <input
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder="Type DELETE"
                  className="w-full p-2 rounded-xl bg-prevu-bg border border-rose-500/40 text-xs text-white placeholder:text-zinc-600 font-mono focus:outline-none focus:border-rose-400"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-prevu-surface-light">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onClose}
                disabled={isDeleting}
                className="text-xs text-prevu-text-muted hover:text-white cursor-pointer"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!canSubmit}
                className={`text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer ${
                  canSubmit
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
                    : 'bg-zinc-800 text-zinc-500 border border-zinc-700 cursor-not-allowed'
                }`}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting Account...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Permanently Delete</span>
                  </>
                )}
              </Button>
            </div>

          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
