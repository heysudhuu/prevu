'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'

interface DetailDrawerProps {
  isOpen: boolean
  title: string
  subtitle?: string
  children: React.ReactNode
  onClose: () => void
  width?: 'sm' | 'md' | 'lg' | 'xl'
  footer?: React.ReactNode
}

export function DetailDrawer({
  isOpen,
  title,
  subtitle,
  children,
  onClose,
  width = 'md',
  footer
}: DetailDrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const widthClass = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }[width]

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex pl-10 max-w-full">
        <div
          className={`w-screen ${widthClass} bg-prevu-surface border-l border-prevu-surface-light shadow-2xl flex flex-col animate-in slide-in-from-right duration-200`}
        >
          {/* Header */}
          <div className="p-5 border-b border-prevu-surface-light flex items-center justify-between gap-4 bg-prevu-bg/50">
            <div>
              <h2 className="text-base font-bold text-prevu-text">{title}</h2>
              {subtitle && (
                <p className="text-xs text-prevu-text-muted mt-0.5">{subtitle}</p>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="p-4 border-t border-prevu-surface-light bg-prevu-bg/50 flex items-center justify-end gap-3">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
