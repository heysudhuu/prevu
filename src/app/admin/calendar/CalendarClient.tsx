'use client'

import React, { useState, useMemo } from 'react'
import {
  Calendar as CalendarIcon,
  Plus,
  Trash2,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { createCalendarEvent, deleteCalendarEvent } from '../actions'

interface CalendarEventItem {
  id: string | number
  title: string
  activity: string
  start_date: string
  end_date?: string | null
  date_display?: string
  day_display?: string
  category: string
  batch: string
  practice_type?: string | null
}

interface CalendarClientProps {
  initialEvents: CalendarEventItem[]
}

const CATEGORIES = ['ALL', 'exam', 'practical', 'academic', 'holiday', 'result']

export default function CalendarClient({ initialEvents }: CalendarClientProps) {
  const [events, setEvents] = useState<CalendarEventItem[]>(initialEvents)
  const [categoryFilter, setCategoryFilter] = useState('ALL')

  // Add event modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formActivity, setFormActivity] = useState('')
  const [formStartDate, setFormStartDate] = useState('')
  const [formEndDate, setFormEndDate] = useState('')
  const [formCategory, setFormCategory] = useState('exam')
  const [formBatch, setFormBatch] = useState('All Batches')
  const [formPracticeType, setFormPracticeType] = useState('MST1')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete event confirmation
  const [deletingId, setDeletingId] = useState<string | number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const filteredEvents = useMemo(() => {
    if (categoryFilter === 'ALL') return events
    return events.filter(e => e.category.toLowerCase() === categoryFilter.toLowerCase())
  }, [events, categoryFilter])

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formActivity.trim() || !formStartDate) {
      alert('Activity description and start date are required.')
      return
    }

    setIsSubmitting(true)
    const title = formActivity.slice(0, 45) + (formActivity.length > 45 ? '...' : '')
    const res = await createCalendarEvent({
      title,
      activity: formActivity.trim(),
      start_date: formStartDate,
      end_date: formEndDate || undefined,
      category: formCategory,
      batch: formBatch,
      practice_type: formCategory === 'exam' ? formPracticeType : undefined
    })

    if (res.success) {
      setEvents(prev => [
        ...prev,
        {
          id: String(Date.now()),
          title,
          activity: formActivity.trim(),
          start_date: formStartDate,
          end_date: formEndDate || null,
          category: formCategory,
          batch: formBatch,
          practice_type: formCategory === 'exam' ? formPracticeType : null
        }
      ])
      setIsModalOpen(false)
      setFormActivity('')
      setFormStartDate('')
      setFormEndDate('')
    } else {
      alert(res.error || 'Failed to save event')
    }
    setIsSubmitting(false)
  }

  const handleDeleteConfirmed = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    const res = await deleteCalendarEvent(deletingId)
    if (res.success) {
      setEvents(prev => prev.filter(e => e.id !== deletingId))
      setDeletingId(null)
    } else {
      alert(res.error || 'Failed to delete event')
    }
    setIsDeleting(false)
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'exam':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/25'
      case 'practical':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
      case 'result':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
      case 'holiday':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/25'
      default:
        return 'bg-zinc-800 text-zinc-300 border-zinc-700'
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              Academic Calendar & Exam Timeline
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {events.length} Events
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Maintain university deadlines, MST 1/2 exam dates, registration windows, and result release timelines.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Academic Event</span>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => {
          const isActive = categoryFilter === cat
          return (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-prevu-surface border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* Events Timeline Card */}
      <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-prevu-surface-light">
          <h3 className="text-sm font-bold text-prevu-text">
            Scheduled Academic Milestones ({filteredEvents.length})
          </h3>
        </div>

        <div className="divide-y divide-prevu-surface-light/60">
          {filteredEvents.length === 0 ? (
            <div className="p-8 text-center text-xs text-prevu-text-muted">
              No calendar events found in this category.
            </div>
          ) : (
            filteredEvents.map(evt => (
              <div
                key={evt.id}
                className="p-4 hover:bg-prevu-surface-light/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-prevu-bg border border-prevu-surface-light flex flex-col items-center justify-center shrink-0">
                    <CalendarIcon className="w-4 h-4 text-purple-400" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${getCategoryColor(
                          evt.category
                        )}`}
                      >
                        {evt.category}
                      </span>
                      {evt.practice_type && (
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300">
                          {evt.practice_type}
                        </span>
                      )}
                      <span className="text-[11px] font-mono text-prevu-text-muted">
                        Batch: {evt.batch}
                      </span>
                    </div>

                    <h4 className="font-semibold text-prevu-text text-sm mt-1">
                      {evt.activity}
                    </h4>

                    <div className="flex items-center gap-2 text-[11px] text-prevu-text-muted font-mono mt-1">
                      <Clock className="w-3 h-3 text-purple-400" />
                      <span>{evt.start_date}</span>
                      {evt.end_date && <span>to {evt.end_date}</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end">
                  <button
                    onClick={() => setDeletingId(evt.id)}
                    className="h-8 w-8 rounded-lg text-prevu-text-muted hover:text-red-400 hover:bg-red-500/10 flex items-center justify-center transition-colors"
                    title="Delete Event"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-2xl p-6 z-10 space-y-4">
            <div>
              <h3 className="text-base font-bold text-prevu-text">Add Academic Event</h3>
              <p className="text-xs text-prevu-text-muted mt-1">
                Schedule a semester examination, practical slot, or academic deadline.
              </p>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">
                  Activity / Description
                </label>
                <textarea
                  value={formActivity}
                  onChange={e => setFormActivity(e.target.value)}
                  rows={2}
                  placeholder="e.g. Mid Semester Test 1 (MST-1) for Senior Batches"
                  className="w-full p-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={e => setFormStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={e => setFormEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  >
                    <option value="exam">Examination</option>
                    <option value="practical">Practical</option>
                    <option value="academic">Academic / Registration</option>
                    <option value="holiday">Holiday / Break</option>
                    <option value="result">Result Announcement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">Target Batch</label>
                  <input
                    type="text"
                    value={formBatch}
                    onChange={e => setFormBatch(e.target.value)}
                    placeholder="All Batches / 2nd Year"
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {formCategory === 'exam' && (
                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">Exam Type</label>
                  <select
                    value={formPracticeType}
                    onChange={e => setFormPracticeType(e.target.value)}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  >
                    <option value="MST1">MST 1</option>
                    <option value="MST2">MST 2</option>
                    <option value="EST">EST</option>
                  </select>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-prevu-surface-light text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  {isSubmitting ? 'Saving...' : 'Add to Calendar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Calendar Event?"
        description="Are you sure you want to remove this event from the university academic calendar?"
        confirmText="Delete Event"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}
