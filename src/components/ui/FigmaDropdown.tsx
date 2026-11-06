'use client'

import React, { useState, useRef, useEffect, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'

export interface FigmaDropdownOption {
  value: string | number
  label: string
  subtitle?: string
  icon?: React.ReactNode | string
  badge?: string
}

interface FigmaDropdownProps {
  label?: string
  value: string | number
  onChange: (val: any) => void
  options: FigmaDropdownOption[]
  placeholder?: string
  icon?: React.ReactNode
  variant?: 'violet' | 'emerald' | 'amber'
  className?: string
  required?: boolean
  id?: string
}

export default function FigmaDropdown({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  icon,
  variant = 'violet',
  className = '',
  required = false,
  id: customId
}: FigmaDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const autoId = useId()
  const dropdownId = customId || autoId

  const selectedOption = options.find(o => String(o.value) === String(value))

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false)
      return
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        const idx = options.findIndex(o => String(o.value) === String(value))
        setHighlightedIndex(idx >= 0 ? idx : 0)
      } else if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        onChange(options[highlightedIndex].value)
        setIsOpen(false)
      }
      return
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(0)
      } else {
        setHighlightedIndex(prev => (prev + 1) % options.length)
      }
      return
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
        setHighlightedIndex(options.length - 1)
      } else {
        setHighlightedIndex(prev => (prev - 1 + options.length) % options.length)
      }
    }
  }

  // Accent styling based on active mode
  const accentStyles = {
    violet: {
      borderActive: 'border-purple-500/60 shadow-[0_0_20px_rgba(168,85,247,0.2)]',
      borderDefault: 'border-prevu-surface-light hover:border-purple-500/40',
      iconColor: 'text-prevu-accent',
      activeItemBg: 'bg-purple-600/20 text-purple-200 border border-purple-500/30',
      hoverItemBg: 'hover:bg-purple-600/15',
      checkColor: 'text-purple-400',
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    },
    emerald: {
      borderActive: 'border-emerald-500/60 shadow-[0_0_20px_rgba(16,185,129,0.2)]',
      borderDefault: 'border-emerald-500/30 hover:border-emerald-400/50',
      iconColor: 'text-emerald-400',
      activeItemBg: 'bg-emerald-600/20 text-emerald-200 border border-emerald-500/30',
      hoverItemBg: 'hover:bg-emerald-600/15',
      checkColor: 'text-emerald-400',
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    amber: {
      borderActive: 'border-amber-500/60 shadow-[0_0_20px_rgba(245,158,11,0.2)]',
      borderDefault: 'border-amber-500/30 hover:border-amber-400/50',
      iconColor: 'text-amber-400',
      activeItemBg: 'bg-amber-600/20 text-amber-200 border border-amber-500/30',
      hoverItemBg: 'hover:bg-amber-600/15',
      checkColor: 'text-amber-400',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    }
  }[variant]

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={dropdownRef}>
      {label && (
        <label 
          htmlFor={dropdownId} 
          className={`text-xs font-semibold flex items-center justify-between ${
            variant === 'emerald' ? 'text-emerald-400' : 'text-prevu-text-muted'
          }`}
        >
          <span>{label}</span>
          {required && <span className="text-[10px] text-red-400">*</span>}
        </label>
      )}

      {/* Main Trigger Button */}
      <button
        type="button"
        id={dropdownId}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full flex items-center justify-between pl-3.5 pr-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 bg-prevu-bg cursor-pointer border select-none ${
          isOpen ? accentStyles.borderActive : accentStyles.borderDefault
        }`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          {icon && (
            <span className={`shrink-0 ${accentStyles.iconColor}`}>
              {icon}
            </span>
          )}

          {selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              {typeof selectedOption.icon === 'string' ? (
                <span className="text-sm shrink-0">{selectedOption.icon}</span>
              ) : selectedOption.icon ? (
                <span className="shrink-0">{selectedOption.icon}</span>
              ) : null}
              <span className="text-white font-semibold truncate text-xs sm:text-sm">
                {selectedOption.label}
              </span>
              {selectedOption.badge && (
                <span className={`hidden sm:inline-flex text-[10px] font-mono px-2 py-0.5 rounded-full border ${accentStyles.badgeColor}`}>
                  {selectedOption.badge}
                </span>
              )}
            </div>
          ) : (
            <span className="text-prevu-text-muted text-xs sm:text-sm">{placeholder}</span>
          )}
        </div>

        <ChevronDown 
          className={`w-4 h-4 text-prevu-text-muted shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : ''
          }`} 
        />
      </button>

      {/* Floating Animated Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            role="listbox"
            className="absolute left-0 right-0 top-full mt-1.5 z-50 p-1.5 rounded-2xl bg-[#0e0e17]/95 border border-prevu-surface-light shadow-2xl backdrop-blur-2xl max-h-72 overflow-y-auto space-y-1 font-sans focus:outline-none scrollbar-thin scrollbar-thumb-prevu-surface-light"
          >
            {options.map((option, idx) => {
              const isSelected = String(option.value) === String(value)
              const isHighlighted = idx === highlightedIndex

              return (
                <div
                  key={String(option.value)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onChange(option.value)
                    setIsOpen(false)
                  }}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                  className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-150 select-none text-xs sm:text-sm ${
                    isSelected
                      ? accentStyles.activeItemBg
                      : isHighlighted
                        ? `${accentStyles.hoverItemBg} text-white`
                        : 'text-prevu-text-muted hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate min-w-0">
                    {typeof option.icon === 'string' ? (
                      <span className="text-base shrink-0">{option.icon}</span>
                    ) : option.icon ? (
                      <span className="shrink-0">{option.icon}</span>
                    ) : null}

                    <div className="truncate">
                      <div className="flex items-center gap-2 truncate">
                        <span className={`font-semibold truncate ${isSelected ? 'text-white' : ''}`}>
                          {option.label}
                        </span>
                        {option.badge && (
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${accentStyles.badgeColor}`}>
                            {option.badge}
                          </span>
                        )}
                      </div>
                      {option.subtitle && (
                        <p className="text-[11px] text-prevu-text-muted truncate mt-0.5 font-normal">
                          {option.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <Check className={`w-4 h-4 shrink-0 ${accentStyles.checkColor}`} />
                    </motion.div>
                  )}
                </div>
              )
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
