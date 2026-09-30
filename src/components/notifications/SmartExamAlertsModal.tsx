'use client'

import { useState, useEffect } from 'react'
import { Bell, BellRing, Check, Sparkles, X, ShieldCheck, Clock, BookOpen, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface SmartExamAlertsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SmartExamAlertsModal({
  isOpen,
  onClose
}: SmartExamAlertsModalProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [examAlerts, setExamAlerts] = useState(true)
  const [newPaperAlerts, setNewPaperAlerts] = useState(true)
  const [selectedSemester, setSelectedSemester] = useState(4)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
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
  }, [isOpen])

  if (!isOpen) return null

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

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md p-6 rounded-3xl bg-[#11111a] border border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/15 blur-2xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30 shrink-0">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                <span>Smart Push & Exam Alerts</span>
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              </h3>
              <p className="text-xs text-prevu-text-muted mt-0.5">
                Get notified before exam deadlines and when missing papers are uploaded.
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
              className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white"
            >
              Enable Alerts
            </Button>
          )}
        </div>

        {/* Preferences */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-purple-300">
            Alert Preferences
          </div>

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
              <div className="text-[11px] text-prevu-text-muted mt-0.5">
                Receive notifications 3 days and 24 hours before your MST and EST shifts.
              </div>
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
                <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                <span>New Paper Upload Drop Alerts</span>
              </div>
              <div className="text-[11px] text-prevu-text-muted mt-0.5">
                Instant ping whenever a verified PYQ or solution is uploaded for your semester.
              </div>
            </div>
          </label>

          {/* Enrolled Semester Selector */}
          <div className="p-3 rounded-2xl bg-prevu-bg/70 border border-prevu-surface-light flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-white">Your Enrolled Semester:</span>
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(Number(e.target.value))}
              className="px-2.5 py-1 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-2 border-t border-prevu-surface-light">
          {permission === 'granted' && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              className="text-xs border-prevu-surface-light text-prevu-text-muted hover:text-white"
            >
              Test Notification
            </Button>
          )}

          <Button
            size="sm"
            onClick={handleSavePreferences}
            className="flex-1 text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/30"
          >
            {savedSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                <span>Saved Preferences!</span>
              </>
            ) : (
              <span>Save Alert Preferences</span>
            )}
          </Button>
        </div>

      </div>
    </div>
  )
}
