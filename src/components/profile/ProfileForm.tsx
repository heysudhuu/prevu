'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { updateUserProfile } from '@/app/profile/actions'
import { 
  User, 
  AtSign, 
  Hash, 
  GraduationCap, 
  Layers, 
  Phone, 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Save, 
  Loader2, 
  Lock,
  Camera,
  RotateCcw,
  Sparkles,
  BookOpen,
  BookmarkCheck,
  Award,
  Building2,
  Copy,
  Check,
  ArrowRight,
  ShieldAlert,
  Info,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import DeleteAccountModal from './DeleteAccountModal'

interface ProfileFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
  stats?: {
    uploads?: number
    bookmarks?: number
  }
}

// Recommended subject directory mapping per semester for BE-CSE
const SEMESTER_SUBJECTS: Record<number, string[]> = {
  1: ['Engineering Mathematics-I', 'Applied Physics', 'Basics of Electrical & Electronics', 'Python Programming'],
  2: ['Engineering Mathematics-II', 'Engineering Chemistry', 'Programming in C', 'Mechanical Sciences'],
  3: ['Data Structures & Algorithms', 'Discrete Mathematics', 'Digital Electronics', 'Computer Organization'],
  4: ['Operating Systems', 'Database Management (DBMS)', 'Design & Analysis of Algorithms', 'Theory of Computation'],
  5: ['Computer Networks', 'Software Engineering', 'Web Technologies', 'Compiler Design'],
  6: ['Machine Learning', 'Information Security', 'Cloud Computing', 'Full Stack Development'],
  7: ['Artificial Intelligence', 'Internet of Things (IoT)', 'Distributed Systems', 'Elective Track'],
  8: ['Major Industrial Internship', 'Cap-Stone Project & Viva', 'Advanced Electives']
}

export default function ProfileForm({ user, stats }: ProfileFormProps) {
  const initialName = user?.name || ''
  const initialUsernameVal = user?.username || ''
  const initialUid = user?.student_uid || ''
  const initialBranch = user?.branch || 'BE-CSE'
  const initialSemester = user?.current_semester || 1
  const initialPhone = user?.phone_number || ''
  // Only default to user.email IF it is actually an official CU domain
  const initialEmail = user?.cu_email || (user?.email?.toLowerCase().endsWith('@cuchd.in') ? user?.email : '')
  const accountLoginEmail = user?.email || ''

  const [name, setName] = useState(initialName)
  const [username, setUsername] = useState(initialUsernameVal)
  const [initialUsername] = useState(initialUsernameVal)
  const [studentUid, setStudentUid] = useState(initialUid)
  const [branch, setBranch] = useState(initialBranch)
  const [currentSemester, setCurrentSemester] = useState<number>(initialSemester)
  const [phoneNumber, setPhoneNumber] = useState(initialPhone)
  const [cuEmail, setCuEmail] = useState(initialEmail)
  
  // Profile Photo state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [changesLeft, setChangesLeft] = useState<number>(user?.username_changes_left ?? 3)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)

  const isUsernameLocked = changesLeft <= 0 && username === initialUsername
  const isCUVerified = user?.cu_verified || cuEmail?.trim().toLowerCase().endsWith('@cuchd.in')
  const isAdmin = user?.role === 'admin'

  const trimmedCuEmail = cuEmail.trim().toLowerCase()
  const hasInvalidCuDomain = trimmedCuEmail.length > 0 && !trimmedCuEmail.endsWith('@cuchd.in')

  const branches = [
    { id: 'BE-CSE', label: 'BE-CSE (Computer Science & Engineering)' },
    { id: 'CSE-AIML', label: 'CSE - Artificial Intelligence & Machine Learning' },
    { id: 'CSE-DS', label: 'CSE - Data Science & Analytics' },
    { id: 'CSE-CLOUD', label: 'CSE - Cloud Computing & DevOps' },
    { id: 'CSE-CYBER', label: 'CSE - Cyber Security & Forensics' },
    { id: 'CSE-IOT', label: 'CSE - Internet of Things (IoT)' },
    { id: 'IT', label: 'Information Technology' },
    { id: 'OTHER', label: 'Other Engineering / Non-CSE' }
  ]

  const isDirty = 
    name !== initialName ||
    username !== initialUsernameVal ||
    studentUid !== initialUid ||
    branch !== initialBranch ||
    currentSemester !== initialSemester ||
    phoneNumber !== initialPhone ||
    cuEmail !== initialEmail ||
    avatarFile !== null

  const handleReset = () => {
    setName(initialName)
    setUsername(initialUsernameVal)
    setStudentUid(initialUid)
    setBranch(initialBranch)
    setCurrentSemester(initialSemester)
    setPhoneNumber(initialPhone)
    setCuEmail(initialEmail)
    setAvatarFile(null)
    setAvatarPreview(null)
    setError(null)
  }

  const handleCopyProfile = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = `${window.location.origin}/browse?author=${username || 'student'}`
      navigator.clipboard.writeText(shareUrl)
      setCopiedLink(true)
      setTimeout(() => setCopiedLink(false), 2000)
    }
  }

  // Handle Photo selection
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (JPG, PNG, WebP).')
        return
      }
      setAvatarFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Client-side domain safety check
    if (hasInvalidCuDomain) {
      setError('Chandigarh University email must end with @cuchd.in, or leave it blank if you do not have one yet.')
      return
    }

    setIsSaving(true)

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('username', username.trim())
    formData.append('student_uid', studentUid.trim())
    formData.append('branch', branch)
    formData.append('current_semester', String(currentSemester))
    formData.append('phone_number', phoneNumber.trim())
    formData.append('cu_email', trimmedCuEmail)

    if (avatarFile) {
      formData.append('avatar_file', avatarFile)
    }

    const res = await updateUserProfile(formData)

    setIsSaving(false)

    if (res.error) {
      setError(res.error)
    } else if (res.success) {
      if (res.changesLeft !== undefined) {
        setChangesLeft(res.changesLeft)
      }
      if (res.avatarUrl) {
        setAvatarUrl(res.avatarUrl)
      }
      setAvatarFile(null)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000)
    }
  }

  const displayAvatar = avatarPreview || avatarUrl
  const selectedBranchLabel = branches.find(b => b.id === branch)?.label || branch

  return (
    <div className="w-full">
      {/* Hidden file input for Avatar */}
      <input 
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={handlePhotoChange}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ========================================================
            LEFT COLUMN: DIGITAL STUDENT ID CARD & ENGAGEMENT STATS
            ======================================================== */}
        <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20 self-start">
          
          {/* Digital Student Card Container */}
          <div className="relative group">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-pink-600/30 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 -z-10" />

            <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-br from-zinc-900/95 via-prevu-surface to-zinc-950 p-6 shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              
              {/* Subtle ambient blur lights */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* ID Card Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-white/10 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-inner">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block leading-none">
                      PREVU IDENTITY
                    </span>
                    <span className="text-xs font-semibold text-white tracking-tight">
                      Chandigarh University
                    </span>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>ACTIVE</span>
                </div>
              </div>

              {/* ID Card Body: Avatar + Names */}
              <div className="py-6 flex flex-col sm:flex-row items-center sm:items-start gap-5 relative z-10">
                
                {/* Interactive Avatar with Camera Overlay */}
                <div 
                  className="relative group/avatar cursor-pointer shrink-0" 
                  onClick={() => fileInputRef.current?.click()}
                  title="Click to change photo"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-800 flex items-center justify-center text-white text-3xl font-extrabold shadow-xl shadow-purple-900/30 border-2 border-white/20 relative">
                    {displayAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img 
                        src={displayAvatar} 
                        alt="Profile Avatar" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{name ? name.charAt(0).toUpperCase() : 'S'}</span>
                    )}

                    {/* Camera Overlay on Hover */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-semibold gap-1">
                      <Camera className="w-6 h-6 text-purple-300" />
                      <span>Change Photo</span>
                    </div>
                  </div>

                  {/* Corner Badge */}
                  {isAdmin ? (
                    <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-purple-950 border border-purple-500 text-purple-300 shadow-md">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                  ) : isCUVerified ? (
                    <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-400 shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : null}
                </div>

                {/* Identity Information */}
                <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
                    {name || 'Student Name'}
                  </h3>
                  
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-xs font-semibold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    <AtSign className="w-3 h-3" />
                    <span>{username || 'username'}</span>
                  </div>

                  <p className="text-xs text-prevu-text-muted flex items-center justify-center sm:justify-start gap-1.5 pt-1">
                    <Building2 className="w-3.5 h-3.5 text-prevu-accent shrink-0" />
                    <span className="truncate">{selectedBranchLabel}</span>
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 items-center justify-center sm:justify-start">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-7 text-[11px] font-semibold flex items-center gap-1.5 border-prevu-surface-light hover:border-purple-500/60"
                    >
                      <Camera className="w-3 h-3 text-purple-400" />
                      <span>Update Photo</span>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCopyProfile}
                      className="h-7 text-[11px] text-prevu-text-muted hover:text-white flex items-center gap-1.5"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Share Link</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

              </div>

              {/* ID Card Academic Grid */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs relative z-10 font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-prevu-text-muted uppercase block">University UID</span>
                  <span className="text-white font-bold tracking-wider truncate block">
                    {studentUid || 'NOT SET'}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                  <span className="text-[10px] text-prevu-text-muted uppercase block">Academic Standing</span>
                  <span className="text-purple-300 font-bold truncate block">
                    Sem {currentSemester} (Year {Math.ceil(currentSemester / 2)})
                  </span>
                </div>

                <div className="col-span-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-prevu-text-muted uppercase block">Campus Verification</span>
                    {isCUVerified ? (
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-bold font-mono">
                        UNVERIFIED
                      </span>
                    )}
                  </div>
                  <span className="text-white text-xs font-mono block truncate">
                    {trimmedCuEmail || 'No official @cuchd.in linked yet'}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Student Engagement & Activity Summary */}
          <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/90 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 uppercase tracking-wider font-mono">
                <Award className="w-4 h-4 text-purple-400" /> Prevu Standing
              </span>
              <span className="text-[11px] text-prevu-text-muted font-mono">
                {isAdmin ? 'System Admin' : 'Scholar Tier'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-prevu-text-muted text-xs">
                  <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                  <span>Papers Contributed</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {stats?.uploads ?? 0}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-prevu-text-muted text-xs">
                  <BookmarkCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Vault Bookmarks</span>
                </div>
                <div className="text-xl font-bold text-white font-mono">
                  {stats?.bookmarks ?? 0}
                </div>
              </div>
            </div>

            {/* Handle Change Counter Notice */}
            <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/15 flex items-start gap-2.5 text-xs">
              <AtSign className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-prevu-text-muted leading-relaxed">
                <span className="text-white font-medium block">Handle Security Policy</span>
                <span>You have <strong className="text-purple-300 font-mono">{changesLeft}</strong> of 3 handle changes remaining. Handles must remain unique across campus.</span>
              </div>
            </div>
          </div>

        </div>

        {/* ========================================================
            RIGHT COLUMN: ENHANCED PROFILE CONFIGURATION FORM
            ======================================================== */}
        <div className="lg:col-span-7 space-y-6">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">

            {/* SECTION 1: PUBLIC IDENTITY */}
            <Card className="border-prevu-surface-light bg-prevu-surface/90 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-prevu-surface-light/60 pb-4">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider font-mono">
                  <User className="w-4 h-4" />
                  <span>Public Identity</span>
                </div>
                <CardTitle className="text-lg font-bold text-white">
                  Student Name & Handle
                </CardTitle>
                <CardDescription className="text-xs text-prevu-text-muted">
                  How your profile and community contributions appear to classmates and professors.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-prevu-text flex items-center gap-1.5" htmlFor="name">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-prevu-text-muted">
                        <User className="w-4 h-4 text-purple-400" />
                      </div>
                      <input 
                        type="text"
                        id="name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Sudhanshu Yadav"
                        required
                        className="w-full pl-10 pr-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Username / Handle */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-prevu-text flex items-center gap-1.5" htmlFor="username">
                        Username / Handle <span className="text-red-400">*</span>
                      </label>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                        changesLeft > 1 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : changesLeft === 1 
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-red-500/10 text-red-400 border-red-500/30'
                      }`}>
                        {changesLeft > 0 ? `${changesLeft}/3 left` : 'Locked'}
                      </span>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-prevu-text-muted">
                        <AtSign className="w-4 h-4 text-purple-400" />
                      </div>
                      <input 
                        type="text"
                        id="username"
                        value={username}
                        onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_.-]/g, ''))}
                        disabled={isUsernameLocked}
                        placeholder="e.g. sudhanshu"
                        required
                        className={`w-full pl-10 pr-10 py-2.5 bg-prevu-bg border rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none transition-all ${
                          isUsernameLocked 
                            ? 'border-zinc-800 text-zinc-500 bg-zinc-900/40 cursor-not-allowed' 
                            : 'border-prevu-surface-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                        }`}
                      />
                      {isUsernameLocked && (
                        <Lock className="w-4 h-4 text-zinc-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                      )}
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>

            {/* SECTION 2: ACADEMIC CREDENTIALS */}
            <Card className="border-prevu-surface-light bg-prevu-surface/90 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-prevu-surface-light/60 pb-4">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider font-mono">
                  <GraduationCap className="w-4 h-4" />
                  <span>Academic Enrollment</span>
                </div>
                <CardTitle className="text-lg font-bold text-white">
                  University & Program Details
                </CardTitle>
                <CardDescription className="text-xs text-prevu-text-muted">
                  Powers customized question papers, exam countdowns, and branch-specific study notes.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                
                {/* University UID & Branch */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  
                  {/* Student UID */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-prevu-text flex items-center gap-1.5" htmlFor="student_uid">
                      University UID
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-prevu-text-muted">
                        <Hash className="w-4 h-4 text-purple-400" />
                      </div>
                      <input 
                        type="text"
                        id="student_uid"
                        value={studentUid}
                        onChange={e => setStudentUid(e.target.value.toUpperCase())}
                        placeholder="e.g. 23BCS10890"
                        className="w-full pl-10 pr-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm font-mono uppercase text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                      />
                    </div>
                    <p className="text-[11px] text-prevu-text-muted">
                      Your official Chandigarh University student registration code.
                    </p>
                  </div>

                  {/* Branch Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-prevu-text flex items-center gap-1.5" htmlFor="branch">
                      Branch & Specialization
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-prevu-text-muted">
                        <GraduationCap className="w-4 h-4 text-purple-400" />
                      </div>
                      <select 
                        id="branch"
                        value={branch}
                        onChange={e => setBranch(e.target.value)}
                        className="w-full pl-10 pr-8 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.id} className="bg-zinc-900 text-white">{b.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                </div>

                {/* Current Semester: Interactive Pill Selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-prevu-text flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-purple-400" /> Current Semester
                    </label>
                    <span className="text-xs font-mono text-purple-300 font-semibold">
                      Semester {currentSemester} &bull; Year {Math.ceil(currentSemester / 2)}
                    </span>
                  </div>

                  {/* 8-Semester Interactive Pills */}
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
                      const isSelected = currentSemester === sem
                      return (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => setCurrentSemester(sem)}
                          className={`py-2 px-1 text-center rounded-xl border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-600/30 scale-105'
                              : 'bg-prevu-bg border-prevu-surface-light text-prevu-text-muted hover:text-white hover:border-purple-500/40'
                          }`}
                        >
                          <span className="block text-xs font-bold font-mono">Sem {sem}</span>
                          <span className={`block text-[10px] ${isSelected ? 'text-purple-200' : 'text-zinc-500'}`}>
                            Y{Math.ceil(sem / 2)}
                          </span>
                        </button>
                      )
                    })}
                  </div>

                  {/* Dynamic Curriculum Deck for selected semester */}
                  <div className="p-3.5 rounded-xl bg-purple-500/5 border border-purple-500/15 space-y-2 mt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-purple-300 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                        <span>Curriculum for Semester {currentSemester}</span>
                      </span>
                      <Link 
                        href="/subjects" 
                        className="text-[11px] text-prevu-accent hover:underline flex items-center gap-1 font-mono"
                      >
                        <span>Browse Papers</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {SEMESTER_SUBJECTS[currentSemester]?.map(subject => (
                        <span 
                          key={subject} 
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 border border-white/5 text-[11px] text-zinc-300 font-medium"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Email Credentials Split: Login Email vs CU Campus Email */}
                <div className="pt-2 border-t border-prevu-surface-light/60 space-y-4">
                  
                  {/* Account Login Identity (Read Only) */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-prevu-text flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-400" /> Primary Account Email
                      </label>
                      <span className="text-[10px] font-mono text-zinc-400 flex items-center gap-1 bg-zinc-800/80 px-2 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> Login Credential
                      </span>
                    </div>
                    <div className="px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm font-mono text-zinc-400 flex items-center justify-between">
                      <span>{accountLoginEmail || 'No login email'}</span>
                      <span className="text-[11px] text-zinc-500">Managed via Firebase Auth</span>
                    </div>
                  </div>

                  {/* Chandigarh University Campus Email (@cuchd.in) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-prevu-text flex items-center gap-1.5" htmlFor="cu_email">
                        <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Chandigarh University Email <span className="text-[11px] text-zinc-500 font-normal">(Optional)</span>
                      </label>
                      {isCUVerified ? (
                        <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Verified CU Domain
                        </span>
                      ) : hasInvalidCuDomain ? (
                        <span className="text-[11px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 flex items-center gap-1 font-mono">
                          <ShieldAlert className="w-3 h-3" /> Must end in @cuchd.in
                        </span>
                      ) : (
                        <span className="text-[11px] text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded-full border border-zinc-700/50">
                          Leave blank if no CU email
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-prevu-text-muted">
                        <Mail className="w-4 h-4 text-purple-400" />
                      </div>
                      <input 
                        type="email"
                        id="cu_email"
                        value={cuEmail}
                        onChange={e => setCuEmail(e.target.value.toLowerCase())}
                        placeholder="e.g. 23bcs10890@cuchd.in (Optional)"
                        className={`w-full pl-10 pr-3.5 py-2.5 bg-prevu-bg border rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none transition-all ${
                          hasInvalidCuDomain
                            ? 'border-amber-500/60 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/20'
                            : 'border-prevu-surface-light focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20'
                        }`}
                      />
                    </div>

                    <div className="flex items-start gap-1.5 text-[11px] text-prevu-text-muted">
                      <Info className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
                      <span>
                        Enter your official campus ID (ends in <strong>@cuchd.in</strong>) to earn the Verified Student badge. You can leave this empty if you only use your personal Google account.
                      </span>
                    </div>
                  </div>

                </div>

              </CardContent>
            </Card>

            {/* SECTION 3: CONTACT & PRIVACY */}
            <Card className="border-prevu-surface-light bg-prevu-surface/90 shadow-xl overflow-hidden">
              <CardHeader className="border-b border-prevu-surface-light/60 pb-4">
                <div className="flex items-center gap-2 text-purple-400 text-xs font-semibold uppercase tracking-wider font-mono">
                  <Phone className="w-4 h-4" />
                  <span>Contact & Communications</span>
                </div>
                <CardTitle className="text-lg font-bold text-white">
                  Phone Number
                </CardTitle>
                <CardDescription className="text-xs text-prevu-text-muted">
                  Used for urgent academic paper alerts and verification requests. Kept strictly private.
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6">
                <div className="space-y-2 max-w-md">
                  <label className="text-xs font-semibold text-prevu-text flex items-center gap-1.5" htmlFor="phone_number">
                    Phone Number <span className="text-prevu-text-muted text-[11px] font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-prevu-text-muted">
                      <Phone className="w-4 h-4 text-purple-400" />
                    </div>
                    <input 
                      type="tel"
                      id="phone_number"
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="e.g. +91 96847XXXXX"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm font-mono text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* STATUS FEEDBACK ALERTS */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-xs text-red-400 shadow-lg"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-400" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-sm">Failed to update profile</span>
                    <span>{error}</span>
                  </div>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -8 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-xs text-emerald-400 font-medium shadow-lg"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                  <div className="space-y-0.5">
                    <span className="font-bold block text-sm text-emerald-300">Profile Updated Successfully!</span>
                    <span>Your academic credentials, handle, and avatar have been synced across Prevu.</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTION BAR FOOTER */}
            <Card className="border-prevu-surface-light bg-prevu-surface/90 shadow-xl overflow-hidden">
              <CardFooter className="p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 mt-0 border-t-0">
                <div className="flex items-center gap-2 text-xs text-prevu-text-muted">
                  {isDirty ? (
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                      Unsaved changes detected
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-zinc-500 font-mono">
                      All changes saved
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  {isDirty && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleReset}
                      disabled={isSaving}
                      className="text-xs text-prevu-text-muted hover:text-white"
                    >
                      <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
                      Discard
                    </Button>
                  )}

                  <Button 
                    type="submit" 
                    form="profile-form" 
                    disabled={isSaving}
                    className="w-full sm:w-auto px-6 py-2.5 text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 font-bold rounded-xl transition-all cursor-pointer"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Profile...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </Button>
                </div>
              </CardFooter>
            </Card>

          </form>

          {/* ============================================================ */}
          {/* DANGER ZONE: ACCOUNT DELETION */}
          {/* ============================================================ */}
          <Card className="border-rose-500/25 bg-rose-950/10 backdrop-blur-md rounded-3xl overflow-hidden mt-6">
            <CardHeader className="pb-3 border-b border-rose-500/15">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-rose-400">
                  <AlertTriangle className="w-4 h-4" />
                  <CardTitle className="text-sm font-bold text-rose-300">Danger Zone</CardTitle>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 font-bold">
                  Irreversible
                </span>
              </div>
              <CardDescription className="text-xs text-prevu-text-muted mt-1">
                Permanently delete your Prevu student account and remove personal data.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-white">Delete Student Account</p>
                  <p className="text-[11px] text-prevu-text-muted leading-relaxed">
                    Your digital student ID, bookmarks, and notification inbox will be removed permanently.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteModalOpen(true)}
                  className="shrink-0 text-xs font-bold border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-600 hover:text-white transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                  <span>Delete Account</span>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>

      </div>

      {/* Interactive Account Deletion Modal */}
      <DeleteAccountModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        userEmail={user?.email}
        username={user?.username}
      />
    </div>
  )
}
