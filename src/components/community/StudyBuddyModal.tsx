'use client'

import { useState } from 'react'
import { Users, Sparkles, MessageCircle, X, Check, ArrowRight, UserPlus, BookOpen, Clock } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface StudyBuddyModalProps {
  isOpen: boolean
  onClose: () => void
  initialSemester?: number
  initialSubject?: string
}

interface BuddyPeer {
  id: string
  name: string
  semester: number
  subject: string
  examTarget: string
  status: string
  avatarColor: string
  contactType: 'WhatsApp' | 'Discord'
}

const SAMPLE_BUDDIES: BuddyPeer[] = [
  {
    id: 'b1',
    name: 'Aarav Sharma',
    semester: 4,
    subject: 'Operating Systems',
    examTarget: 'MST-1 (Aiming 18+/20)',
    status: 'Solving 2024 & 2025 MST PYQs right now',
    avatarColor: 'from-purple-500 to-indigo-500',
    contactType: 'WhatsApp'
  },
  {
    id: 'b2',
    name: 'Riya Kapoor',
    semester: 4,
    subject: 'Database Management Systems',
    examTarget: 'MST-1 & Normalization Drill',
    status: 'Looking for a peer to discuss 3NF/BCNF numericals',
    avatarColor: 'from-pink-500 to-rose-500',
    contactType: 'Discord'
  },
  {
    id: 'b3',
    name: 'Kabir Mehta',
    semester: 3,
    subject: 'Data Structures & Algorithms',
    examTarget: 'MST-1 (AVL Trees & Trees)',
    status: 'Doing evening mock tests together at 8 PM',
    avatarColor: 'from-cyan-500 to-teal-500',
    contactType: 'WhatsApp'
  },
  {
    id: 'b4',
    name: 'Ananya Verma',
    semester: 5,
    subject: 'Computer Networks',
    examTarget: 'EST Comprehensive Prep',
    status: 'Has handwritten topper notes for Unit 3 & 4',
    avatarColor: 'from-amber-500 to-yellow-500',
    contactType: 'Discord'
  }
]

export default function StudyBuddyModal({
  isOpen,
  onClose,
  initialSemester = 4,
  initialSubject = 'Operating Systems'
}: StudyBuddyModalProps) {
  const [semester, setSemester] = useState(initialSemester)
  const [selectedSubject, setSelectedSubject] = useState(initialSubject)
  const [buddies, setBuddies] = useState<BuddyPeer[]>(SAMPLE_BUDDIES)
  const [hasPostedRequest, setHasPostedRequest] = useState(false)
  const [studentNote, setStudentNote] = useState('')

  if (!isOpen) return null

  const handlePostRequest = (e: React.FormEvent) => {
    e.preventDefault()
    if (!studentNote.trim()) return

    const newBuddy: BuddyPeer = {
      id: Math.random().toString(36).substring(7),
      name: 'You (Active Match)',
      semester,
      subject: selectedSubject,
      examTarget: 'Upcoming MST-1',
      status: studentNote.trim(),
      avatarColor: 'from-emerald-500 to-teal-500',
      contactType: 'WhatsApp'
    }

    setBuddies(prev => [newBuddy, ...prev])
    setHasPostedRequest(true)
    setStudentNote('')
  }

  const handleConnect = (buddy: BuddyPeer) => {
    const text = encodeURIComponent(`Hi ${buddy.name}! Found your Study Buddy profile on Prevu for CU ${buddy.subject} (Sem ${buddy.semester}). Let's prepare together!`)
    if (buddy.contactType === 'WhatsApp') {
      window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank')
    } else {
      window.open('https://discord.gg', '_blank')
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl my-8 p-6 sm:p-8 rounded-3xl bg-[#11111a] border border-sky-500/40 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-sky-500/30 shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30 uppercase tracking-wider mb-1">
                <span>Community Study Circles</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Study Buddy Matchmaker
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-prevu-text-muted hover:text-white rounded-xl hover:bg-prevu-surface-light transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Semester & Subject Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light">
          <div>
            <label className="block text-[11px] font-bold text-prevu-text-muted uppercase mb-1">
              Semester
            </label>
            <select
              value={semester}
              onChange={(e) => setSemester(Number(e.target.value))}
              className="w-full px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                <option key={s} value={s}>Semester {s} (BE-CSE)</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-prevu-text-muted uppercase mb-1">
              Focus Subject
            </label>
            <input
              type="text"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              placeholder="e.g. Operating Systems"
              className="w-full px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-white focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Post Quick Study Buddy Request Form */}
        <form onSubmit={handlePostRequest} className="p-4 rounded-2xl bg-sky-950/20 border border-sky-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Looking for a Study Partner? Post an Instant Card</span>
            </span>
            {hasPostedRequest && (
              <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Card Live
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={studentNote}
              onChange={(e) => setStudentNote(e.target.value)}
              placeholder="e.g., Practicing Unit 2 numericals every night at 9 PM on Discord..."
              className="flex-1 px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-white placeholder-prevu-text-muted focus:outline-none focus:border-sky-500"
            />
            <Button size="sm" type="submit" className="text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shrink-0">
              Join Pool
            </Button>
          </div>
        </form>

        {/* Active Study Buddies Feed */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-prevu-text-muted">
              Active Peers Preparing for {selectedSubject}
            </h3>
            <span className="text-[11px] font-mono text-sky-400">
              {buddies.length} peers available
            </span>
          </div>

          <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
            {buddies.map((buddy) => (
              <div
                key={buddy.id}
                className="p-3.5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light hover:border-sky-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${buddy.avatarColor} flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-md`}>
                    {buddy.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{buddy.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-sky-500/15 text-sky-300 font-semibold border border-sky-500/25">
                        Sem {buddy.semester}
                      </span>
                    </div>
                    <div className="text-[11px] text-prevu-text-muted mt-0.5 leading-snug">
                      {buddy.status}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  onClick={() => handleConnect(buddy)}
                  className="text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white shrink-0 cursor-pointer shadow-sm shadow-sky-600/20"
                >
                  <MessageCircle className="w-3.5 h-3.5 mr-1" />
                  Connect ({buddy.contactType})
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-prevu-surface-light text-xs text-prevu-text-muted">
          <span>Keep interactions friendly and study-oriented.</span>
          <Button size="sm" variant="outline" onClick={onClose} className="text-xs">
            Done
          </Button>
        </div>

      </div>
    </div>
  )
}
