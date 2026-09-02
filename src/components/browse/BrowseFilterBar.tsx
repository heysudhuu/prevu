'use client'

import { useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, Filter } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface BrowseFilterBarProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subjects: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  examTypes: any[]
  currentYear?: number
  currentSem?: number
  currentSubject?: number
  currentType?: number
  currentSearch?: string
}

export default function BrowseFilterBar({
  subjects,
  examTypes,
  currentYear,
  currentSem,
  currentSubject,
  currentType,
  currentSearch = ''
}: BrowseFilterBarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()

  const [searchTerm, setSearchTerm] = useState(currentSearch)
  const [showAdvanced, setShowAdvanced] = useState(Boolean(currentYear || currentSubject))

  const updateFilters = (updates: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams.toString())

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) {
        params.delete(key)
      } else {
        params.set(key, String(value))
      }
    })

    startTransition(() => {
      router.push(`/browse?${params.toString()}`)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchTerm.trim() || undefined })
  }

  const handleClear = () => {
    setSearchTerm('')
    startTransition(() => {
      router.push('/browse')
    })
  }

  const hasActiveFilters = Boolean(currentYear || currentSem || currentSubject || currentType || currentSearch)

  return (
    <div className="space-y-4 mb-8">
      
      {/* Top Main Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted group-focus-within:text-prevu-accent transition-colors" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by subject name, course code (e.g. 23CST-201), or topic..."
            className="w-full pl-11 pr-24 py-3 bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-accent/50 focus:border-prevu-accent rounded-2xl text-sm text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none transition-all shadow-lg"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {searchTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  updateFilters({ search: undefined })
                }}
                className="p-1 text-prevu-text-muted hover:text-prevu-text"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <Button 
              type="submit" 
              size="sm" 
              className="h-8 px-3.5 text-xs font-semibold rounded-xl"
            >
              Search
            </Button>
          </div>
        </form>

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`h-11 px-4 rounded-2xl border text-xs font-medium flex items-center gap-2 ${
            showAdvanced || currentYear || currentSubject
              ? 'border-prevu-accent/50 bg-prevu-accent/10 text-prevu-accent'
              : 'border-prevu-surface-light text-prevu-text-muted'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-prevu-accent" />
          )}
        </Button>
      </div>

      {/* Quick Exam Pattern Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-prevu-text-muted text-[11px] font-semibold uppercase tracking-wider mr-1">
            Pattern:
          </span>
          
          <button
            type="button"
            onClick={() => updateFilters({ type: undefined })}
            className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              !currentType
                ? 'bg-prevu-accent text-white border-prevu-accent shadow-md shadow-prevu-accent/20'
                : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
            }`}
          >
            All Formats
          </button>

          {examTypes.map((t) => {
            const isSelected = currentType === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => updateFilters({ type: isSelected ? undefined : t.id })}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? t.name === 'EST'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-600/20'
                    : 'bg-prevu-surface border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
                }`}
              >
                {t.name === 'MST1' && '⚡ MST 1 (20M)'}
                {t.name === 'MST2' && '⚡ MST 2 (20M)'}
                {t.name === 'EST' && '🎓 EST Final (60M)'}
                {!['MST1', 'MST2', 'EST'].includes(t.name) && t.name}
              </button>
            )
          })}
        </div>

        {/* Quick Semester Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
          <span className="text-prevu-text-muted text-[11px] font-semibold uppercase tracking-wider mr-1 shrink-0">
            Semester:
          </span>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => updateFilters({ sem: currentSem === s ? undefined : s })}
              className={`px-3 py-1 rounded-xl border text-xs font-mono font-bold transition-all shrink-0 cursor-pointer ${
                currentSem === s
                  ? 'bg-prevu-accent text-white border-prevu-accent shadow-md shadow-prevu-accent/20'
                  : 'bg-prevu-surface/80 border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text hover:border-prevu-accent/30'
              }`}
            >
              Sem {s}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Dropdowns (Collapsible) */}
      {showAdvanced && (
        <div className="p-4 rounded-2xl border border-prevu-surface-light bg-prevu-surface/95 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-3 animate-slide-down">
          
          <div className="space-y-1">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-prevu-text-muted">
              Academic Year
            </label>
            <select
              value={currentYear || ''}
              onChange={e => updateFilters({ year: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-prevu-accent cursor-pointer"
            >
              <option value="">All Academic Years</option>
              <option value="1">Year 1 (Sem 1 & 2)</option>
              <option value="2">Year 2 (Sem 3 & 4)</option>
              <option value="3">Year 3 (Sem 5 & 6)</option>
              <option value="4">Year 4 (Sem 7 & 8)</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-prevu-text-muted">
              Filter by Subject Catalog
            </label>
            <select
              value={currentSubject || ''}
              onChange={e => updateFilters({ subject: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-prevu-accent cursor-pointer"
            >
              <option value="">All Subjects in Catalog</option>
              {subjects.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code}) - Sem {s.semester}
                </option>
              ))}
            </select>
          </div>

          {hasActiveFilters && (
            <div className="sm:col-span-3 flex justify-end pt-2 border-t border-prevu-surface-light/60">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-7 text-xs text-prevu-text-muted hover:text-red-400"
              >
                Clear All Applied Filters
              </Button>
            </div>
          )}

        </div>
      )}

    </div>
  )
}
