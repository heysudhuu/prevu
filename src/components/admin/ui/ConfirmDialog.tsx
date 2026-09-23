'use client'

import React, { useEffect } from 'react'
import { AlertTriangle, Trash2, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'warning' | 'primary'
  isLoading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return {
          icon: <Trash2 className="w-5 h-5 text-red-400" />,
          iconBg: 'bg-red-500/10 border-red-500/20',
          btnClass: 'bg-red-600 hover:bg-red-500 text-white'
        }
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
          iconBg: 'bg-amber-500/10 border-amber-500/20',
          btnClass: 'bg-amber-600 hover:bg-amber-500 text-black font-semibold'
        }
      case 'primary':
      default:
        return {
          icon: <CheckCircle2 className="w-5 h-5 text-purple-400" />,
          iconBg: 'bg-purple-500/10 border-purple-500/20',
          btnClass: 'bg-purple-600 hover:bg-purple-500 text-white'
        }
    }
  }

  const { icon, iconBg, btnClass } = getVariantStyles()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onCancel}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-2xl p-6 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onCancel}
          disabled={isLoading}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light/50 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${iconBg}`}>
            {icon}
          </div>

          <div className="flex-1 pt-0.5">
            <h3 className="text-base font-bold text-prevu-text">{title}</h3>
            <p className="mt-1.5 text-xs text-prevu-text-muted leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
            className="text-xs h-9 px-4 rounded-xl border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text bg-prevu-surface-light/30"
          >
            {cancelText}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-9 px-4 rounded-xl text-xs font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 ${btnClass}`}
          >
            {isLoading && <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
