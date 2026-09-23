'use client'

import React, { useState } from 'react'
import {
  Plus,
  Trash2
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import {
  createBroadcastNotification,
  toggleNotificationStatus,
  deleteNotification
} from '../actions'

interface NotificationItem {
  id: string
  title: string
  message: string
  audience: string
  priority: string
  published_at: string
  expires_at?: string | null
  is_active: boolean
  created_at: string
}

interface NotificationsClientProps {
  initialNotifications: NotificationItem[]
}

export default function NotificationsClient({
  initialNotifications
}: NotificationsClientProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications)

  // Create modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [audience, setAudience] = useState('all')
  const [priority, setPriority] = useState('info')
  const [expiresAt, setExpiresAt] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete modal state
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) {
      alert('Title and message are required.')
      return
    }

    setIsSubmitting(true)
    const res = await createBroadcastNotification({
      title: title.trim(),
      message: message.trim(),
      audience,
      priority,
      expires_at: expiresAt || undefined
    })

    if (res.success) {
      setNotifications(prev => [
        {
          id: String(Date.now()),
          title: title.trim(),
          message: message.trim(),
          audience,
          priority,
          published_at: new Date().toISOString(),
          expires_at: expiresAt || null,
          is_active: true,
          created_at: new Date().toISOString()
        },
        ...prev
      ])
      setIsModalOpen(false)
      setTitle('')
      setMessage('')
      setExpiresAt('')
    } else {
      alert(res.error || 'Failed to dispatch notification')
    }
    setIsSubmitting(false)
  }

  const handleToggle = async (item: NotificationItem) => {
    const res = await toggleNotificationStatus(item.id, item.is_active)
    if (res.success) {
      setNotifications(prev =>
        prev.map(n => (n.id === item.id ? { ...n, is_active: !n.is_active } : n))
      )
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    const res = await deleteNotification(deletingId)
    if (res.success) {
      setNotifications(prev => prev.filter(n => n.id !== deletingId))
      setDeletingId(null)
    } else {
      alert(res.error || 'Failed to delete notification')
    }
    setIsDeleting(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              Broadcast Announcements
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              {notifications.length} Total
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Dispatch announcements to students with semester audience targeting and priority alerts.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Announcement</span>
        </Button>
      </div>

      {/* Announcements List */}
      <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-prevu-surface-light">
          <h3 className="text-sm font-bold text-prevu-text">Announcement History</h3>
        </div>

        {notifications.length === 0 ? (
          <div className="p-10 text-center text-xs text-prevu-text-muted">
            No broadcast announcements created yet.
          </div>
        ) : (
          <div className="divide-y divide-prevu-surface-light/60">
            {notifications.map(n => (
              <div
                key={n.id}
                className="p-5 hover:bg-prevu-surface-light/30 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={n.priority} label={n.priority.toUpperCase()} />
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                      Audience: {n.audience === 'all' ? 'All Students' : `Semester ${n.audience.replace('sem', '')}`}
                    </span>
                    <span className="text-[11px] font-mono text-prevu-text-muted">
                      {n.published_at ? new Date(n.published_at).toLocaleDateString() : '—'}
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-prevu-text">{n.title}</h4>
                  <p className="text-xs text-prevu-text-muted leading-relaxed whitespace-pre-wrap">
                    {n.message}
                  </p>

                  {n.expires_at && (
                    <div className="text-[10px] font-mono text-zinc-500">
                      Expires: {new Date(n.expires_at).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggle(n)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                      n.is_active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25 hover:bg-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700'
                    }`}
                  >
                    {n.is_active ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    onClick={() => setDeletingId(n.id)}
                    className="p-1.5 rounded-lg text-prevu-text-muted hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Announcement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-2xl p-6 z-10 space-y-4">
            <div>
              <h3 className="text-base font-bold text-prevu-text">Create Broadcast Announcement</h3>
              <p className="text-xs text-prevu-text-muted mt-1">
                Broadcast vital exam information or system maintenance alerts.
              </p>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. MST-2 Question Papers Uploaded"
                  className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">Message Content</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder="Enter the full announcement text..."
                  className="w-full p-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">Target Audience</label>
                  <select
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  >
                    <option value="all">All Students</option>
                    <option value="sem1">Semester 1</option>
                    <option value="sem2">Semester 2</option>
                    <option value="sem3">Semester 3</option>
                    <option value="sem4">Semester 4</option>
                    <option value="sem5">Semester 5</option>
                    <option value="sem6">Semester 6</option>
                    <option value="sem7">Semester 7</option>
                    <option value="sem8">Semester 8</option>
                  </select>
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value)}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  >
                    <option value="info">Info</option>
                    <option value="important">Important</option>
                    <option value="warning">Warning</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={e => setExpiresAt(e.target.value)}
                  className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                />
              </div>

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
                  {isSubmitting ? 'Publishing...' : 'Publish Announcement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        title="Delete Announcement?"
        description="Are you sure you want to permanently delete this announcement? It will be removed from all student feeds."
        confirmText="Delete Announcement"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  )
}
