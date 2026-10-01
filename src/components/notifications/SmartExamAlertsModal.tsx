'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  Bell, 
  BellRing, 
  Check, 
  Sparkles, 
  X, 
  ShieldCheck, 
  Clock, 
  BookOpen, 
  AlertCircle,
  FileCheck,
  CheckCircle,
  ExternalLink,
  MessageSquare
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getMyNotifications, markNotificationAsRead } from '@/app/requests/actions'

interface SmartExamAlertsModalProps {
  isOpen: boolean
  onClose: () => void
}

interface StudentNotification {
  id: string
  title: string
  message: string
  type: string
  link?: string
  is_read: boolean
  created_at: string
}

export default function SmartExamAlertsModal({
  isOpen,
  onClose
}: SmartExamAlertsModalProps) {
  const [activeTab, setActiveTab] = useState<'activity' | 'settings'>('activity')
  const [notifications, setNotifications] = useState<StudentNotification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(false)

  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [examAlerts, setExamAlerts] = useState(true)
  const [newPaperAlerts, setNewPaperAlerts] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState(4)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setLoadingNotifications(true)
      getMyNotifications()
        .then(data => {
          setNotifications(data || [])
        })
        .finally(() => {
          setLoadingNotifications(false)
        })

      if (typeof window !== 'undefined' && 'Notification' in window) {
        setPermission(Notification.permission)
        try {
          const saved = localStorage.getItem('prevu_notification_prefs')
          if (saved) {
            const parsed = JSON.parse(saved)
            setExamAlerts(parsed.examAlerts ?? true)
            setNewPaperAlerts(parsed.newPaperAlerts ?? true)
            setSelectedSemester(parsed.selectedSemester ?? 4)
          }
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleMarkAsRead = async (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    )
    await markNotificationAsRead(id)
  }

  const handleRequestPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('Browser notifications are not supported in this browser.')
      return
    }

    try {
      const res = await Notification.requestPermission()
      setPermission(res)
      if (res === 'granted') {
        new Notification('🔔 Prevu Notifications Enabled!', {
          body: `You will receive exam countdown pings and upload updates for Semester ${selectedSemester}.`,
          icon: '/icon-512.svg'
        })
      }
    } catch (err) {
      console.error('Failed to request notification permission', err)
    }
  }

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('prevu_notification_prefs', JSON.stringify({
        examAlerts,
        newPaperAlerts,
        selectedSemester
      }))
      setSavedSuccess(true)
      setTimeout(() => {
        setSavedSuccess(false)
        onClose()
      }, 1500)
    } catch {
      // ignore
    }
  }

  const handleTestNotification = () => {
    if (permission !== 'granted') {
      handleRequestPermission()
      return
    }

    new Notification('⚡ Prevu MST-1 Alert', {
      body: 'Chandigarh University MST-1 starts in 12 days! Review your bookmarked question papers.',
      icon: '/icon-512.svg'
    })
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-6 rounded-3xl bg-[#11111a] border border-purple-500/40 shadow-2xl space-y-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/15 blur-2xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Student Notification Center</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              </h3>
              <p className="text-xs text-prevu-text-muted mt-0.5">
                Community request updates, batchmate responses & admin approvals.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-prevu-text-muted hover:text-white rounded-xl hover:bg-prevu-surface-light transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-prevu-surface border border-prevu-surface-light rounded-xl p-1 gap-1">
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Community Alerts</span>
            {unreadCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-black text-[9px] font-bold flex items-center justify-center ml-0.5">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-prevu-text-muted hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Push Settings</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: COMMUNITY ALERTS & ADMIN APPROVAL UPDATES */}
        {/* ============================================================ */}
        {activeTab === 'activity' && (
          <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
            {loadingNotifications ? (
              <div className="p-8 text-center text-xs text-prevu-text-muted animate-pulse">
                Loading notification updates...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-prevu-surface/40 border border-prevu-surface-light space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">All Caught Up!</p>
                <p className="text-[11px] text-prevu-text-muted">
                  When you request study materials or share data with batchmates, admin approval and peer response alerts will appear here.
                </p>
                <Button
                  size="sm"
                  asChild
                  className="mt-2 text-xs bg-purple-600 text-white font-bold h-7"
                >
                  <Link href="/requests" onClick={onClose}>
                    Explore Requests
                  </Link>
                </Button>
              </div>
            ) : (
              notifications.map(notif => {
                const isApproved = notif.type === 'approved'
                const isPending = notif.type === 'pending_approval'
                const isHelped = notif.type === 'batchmate_helped'

                return (
                  <div
                    key={notif.id}
                    onClick={() => handleMarkAsRead(notif.id)}
                    className={`p-3 rounded-2xl border text-xs space-y-1.5 transition-all ${
                      notif.is_read
                        ? 'bg-prevu-surface/50 border-prevu-surface-light opacity-80'
                        : 'bg-purple-950/20 border-purple-500/40 shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 font-bold text-white">
                        {isApproved ? (
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : isPending ? (
                          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : isHelped ? (
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        ) : (
                          <Bell className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        )}
                        <span>{notif.title}</span>
                      </div>
                      {!notif.is_read && (
                        <span className="w-2 h-2 rounded-full bg-purple-400 shrink-0" />
                      )}
                    </div>

                    <p className="text-[11px] text-prevu-text-muted leading-relaxed">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-prevu-text-muted">
                      <span>{new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={onClose}
                          className="text-purple-400 hover:text-purple-300 font-bold inline-flex items-center gap-0.5"
                        >
                          <span>View</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: EXAM PUSH SETTINGS */}
        {/* ============================================================ */}
        {activeTab === 'settings' && (
          <div className="space-y-4">
            {/* Browser Permission Status */}
            <div className="p-3.5 rounded-2xl bg-prevu-surface border border-prevu-surface-light flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${permission === 'granted' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                <span className="text-xs font-semibold text-white">
                  Status: {permission === 'granted' ? 'Notifications Active' : 'Permission Required'}
                </span>
              </div>

              {permission !== 'granted' && (
                <Button
                  size="sm"
                  onClick={handleRequestPermission}
                  className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white h-7"
                >
                  Enable Alerts
                </Button>
              )}
            </div>

            {/* Preferences */}
            <div className="space-y-2.5">
              <label className="p-3 rounded-2xl bg-prevu-bg/70 border border-prevu-surface-light flex items-start gap-3 cursor-pointer hover:border-purple-500/30 transition-colors">
                <input
                  type="checkbox"
                  checked={examAlerts}
                  onChange={(e) => setExamAlerts(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-purple-600 rounded"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-400" />
                    <span>CU Exam Countdown Reminders</span>
                  </div>
                  <p className="text-[11px] text-prevu-text-muted mt-0.5">
                    Pings 7 days and 24 hours before MST1, MST2, and EST exams.
                  </p>
                </div>
              </label>

              <label className="p-3 rounded-2xl bg-prevu-bg/70 border border-prevu-surface-light flex items-start gap-3 cursor-pointer hover:border-purple-500/30 transition-colors">
                <input
                  type="checkbox"
                  checked={newPaperAlerts}
                  onChange={(e) => setNewPaperAlerts(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-purple-600 rounded"
                />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Missing Papers & Requests Updates</span>
                  </div>
                  <p className="text-[11px] text-prevu-text-muted mt-0.5">
                    Instant alerts when a requested paper or note is uploaded.
                  </p>
                </div>
              </label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-white block">
                Primary Semester For Alerts
              </label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl bg-prevu-bg border border-prevu-surface-light text-white text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem} (BE-CSE)
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3 border-t border-prevu-surface-light">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleTestNotification}
                className="text-xs text-purple-400 hover:text-purple-300"
              >
                Send Test Ping
              </Button>

              <Button
                size="sm"
                onClick={handleSavePreferences}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs"
              >
                {savedSuccess ? (
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved
                  </span>
                ) : (
                  'Save Settings'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
