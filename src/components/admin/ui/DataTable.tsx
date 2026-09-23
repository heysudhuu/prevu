'use client'

import React, { useState, useMemo } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import { EmptyState } from './EmptyState'

export interface Column<T> {
  key: string
  header: React.ReactNode
  render?: (item: T) => React.ReactNode
  sortable?: boolean
  className?: string
  width?: string
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyExtractor: (item: T) => string
  isLoading?: boolean
  selectable?: boolean
  selectedIds?: string[]
  onSelectionChange?: (selectedIds: string[]) => void
  bulkActions?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  pageSize?: number
  showPagination?: boolean
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  selectable = false,
  selectedIds = [],
  onSelectionChange,
  bulkActions,
  emptyTitle = 'No records found',
  emptyDescription = 'There are no items matching the current filter criteria.',
  pageSize = 15,
  showPagination = true
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  // Handle Sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc')
      else {
        setSortKey(null)
        setSortDirection('asc')
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  // Sorted Data
  const sortedData = useMemo(() => {
    if (!sortKey) return data
    return [...data].sort((a, b) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const aVal = (a as any)[sortKey]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bVal = (b as any)[sortKey]

      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return sortDirection === 'asc' ? (aVal > bVal ? 1 : -1) : (aVal < bVal ? 1 : -1)
    })
  }, [data, sortKey, sortDirection])

  // Paginated Data
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize, showPagination])

  // Select all on current page
  const pageItemIds = useMemo(() => paginatedData.map(keyExtractor), [paginatedData, keyExtractor])
  const isAllPageSelected = pageItemIds.length > 0 && pageItemIds.every(id => selectedIds.includes(id))

  const handleSelectAll = () => {
    if (!onSelectionChange) return
    if (isAllPageSelected) {
      onSelectionChange(selectedIds.filter(id => !pageItemIds.includes(id)))
    } else {
      const merged = Array.from(new Set([...selectedIds, ...pageItemIds]))
      onSelectionChange(merged)
    }
  }

  const handleSelectRow = (id: string) => {
    if (!onSelectionChange) return
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(item => item !== id))
    } else {
      onSelectionChange([...selectedIds, id])
    }
  }

  return (
    <div className="space-y-3">
      {/* Bulk Action Bar if selection active */}
      {selectable && selectedIds.length > 0 && (
        <div className="px-4 py-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-between gap-4 animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>{selectedIds.length} item{selectedIds.length > 1 ? 's' : ''} selected</span>
          </div>

          <div className="flex items-center gap-2">
            {bulkActions}
            <button
              onClick={() => onSelectionChange && onSelectionChange([])}
              className="text-[11px] text-prevu-text-muted hover:text-prevu-text px-2 py-1 rounded transition-colors"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Table Container */}
      <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light select-none">
              <tr>
                {selectable && (
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox"
                      checked={isAllPageSelected}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-prevu-surface-light bg-prevu-surface accent-purple-600 focus:ring-0 cursor-pointer"
                    />
                  </th>
                )}
                {columns.map(col => {
                  const isSorted = sortKey === col.key
                  return (
                    <th
                      key={col.key}
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={`p-3.5 font-semibold tracking-wide ${col.className || ''} ${
                        col.sortable ? 'cursor-pointer hover:text-prevu-text transition-colors' : ''
                      }`}
                      style={{ width: col.width }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{col.header}</span>
                        {col.sortable && (
                          <span className="text-prevu-text-muted">
                            {isSorted ? (
                              sortDirection === 'asc' ? (
                                <ArrowUp className="w-3 h-3 text-purple-400" />
                              ) : (
                                <ArrowDown className="w-3 h-3 text-purple-400" />
                              )
                            ) : (
                              <ArrowUpDown className="w-3 h-3 opacity-40 hover:opacity-100" />
                            )}
                          </span>
                        )}
                      </div>
                    </th>
                  )
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-prevu-surface-light/60 text-prevu-text">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    {selectable && <td className="p-3.5 text-center"><div className="w-4 h-4 bg-prevu-surface-light rounded mx-auto" /></td>}
                    {columns.map(col => (
                      <td key={col.key} className="p-3.5">
                        <div className="h-4 bg-prevu-surface-light rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-8">
                    <EmptyState title={emptyTitle} description={emptyDescription} />
                  </td>
                </tr>
              ) : (
                paginatedData.map(item => {
                  const id = keyExtractor(item)
                  const isSelected = selectedIds.includes(id)

                  return (
                    <tr
                      key={id}
                      className={`hover:bg-prevu-surface-light/30 transition-colors ${
                        isSelected ? 'bg-purple-950/20' : ''
                      }`}
                    >
                      {selectable && (
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectRow(id)}
                            className="w-4 h-4 rounded border-prevu-surface-light bg-prevu-surface accent-purple-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                      )}
                      {columns.map(col => (
                        <td key={col.key} className={`p-3.5 ${col.className || ''}`}>
                          {col.render
                            ? col.render(item)
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            : String((item as any)[col.key] ?? '—')}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {showPagination && sortedData.length > 0 && (
          <div className="p-3.5 border-t border-prevu-surface-light bg-prevu-bg/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-prevu-text-muted">
            <div>
              Showing{' '}
              <span className="font-semibold text-prevu-text">
                {Math.min((currentPage - 1) * pageSize + 1, sortedData.length)}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-prevu-text">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{' '}
              of <span className="font-semibold text-prevu-text">{sortedData.length}</span> records
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-prevu-surface-light hover:bg-prevu-surface-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="First page"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-prevu-surface-light hover:bg-prevu-surface-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              <span className="px-3 py-1 font-mono text-prevu-text">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-prevu-surface-light hover:bg-prevu-surface-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-prevu-surface-light hover:bg-prevu-surface-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Last page"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
