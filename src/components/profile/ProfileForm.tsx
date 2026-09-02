'use client'

import { useState, useRef } from 'react'
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
  Camera
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProfileFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user?.name || '')
  const [username, setUsername] = useState(user?.username || '')
  const [initialUsername] = useState(user?.username || '')
  const [studentUid, setStudentUid] = useState(user?.student_uid || '')
  const [branch, setBranch] = useState(user?.branch || 'BE-CSE')
  const [currentSemester, setCurrentSemester] = useState<number>(user?.current_semester || 1)
  const [phoneNumber, setPhoneNumber] = useState(user?.phone_number || '')
  const [cuEmail, setCuEmail] = useState(user?.cu_email || user?.email || '')
  
  // Profile Photo state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.avatar_url || null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [changesLeft, setChangesLeft] = useState<number>(user?.username_changes_left ?? 3)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isUsernameLocked = changesLeft <= 0 && username === initialUsername
  const isCUVerified = user?.cu_verified || cuEmail?.endsWith('@cuchd.in')
  const isAdmin = user?.role === 'admin'

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
    setIsSaving(true)

    const formData = new FormData()
    formData.append('name', name.trim())
    formData.append('username', username.trim())
    formData.append('student_uid', studentUid.trim())
    formData.append('branch', branch)
    formData.append('current_semester', String(currentSemester))
    formData.append('phone_number', phoneNumber.trim())
    formData.append('cu_email', cuEmail.trim())

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

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      
      {/* Top Profile Hero Card */}
      <Card className="border-prevu-surface-light bg-gradient-to-r from-prevu-surface via-prevu-surface/90 to-prevu-surface shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-prevu-accent/10 blur-3xl rounded-full pointer-events-none" />
        
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 relative z-10">
          
          {/* Avatar with Click-to-Upload Camera Overlay */}
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <input 
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden bg-gradient-to-br from-prevu-accent via-purple-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-extrabold shadow-2xl shadow-prevu-accent/30 border-2 border-white/15 relative">
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

              {/* Hover Camera Icon Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[11px] font-semibold gap-1">
                <Camera className="w-6 h-6" />
                <span>Change Photo</span>
              </div>
            </div>

            {isAdmin ? (
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-purple-950 border border-purple-500/50 text-purple-300 shadow-md">
                <ShieldCheck className="w-4 h-4" />
              </div>
            ) : isCUVerified ? (
              <div className="absolute -bottom-2 -right-2 p-1.5 rounded-xl bg-emerald-950 border border-emerald-500/50 text-emerald-400 shadow-md">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            ) : null}
          </div>

          {/* User Bio Details */}
          <div className="text-center sm:text-left space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-2xl font-bold text-white">{name || 'Student Name'}</h2>
              <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-semibold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/25">
                @{username || 'username'}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-prevu-text-muted">
              <span>{branch}</span>
              <span>•</span>
              <span>Semester {currentSemester}</span>
              {studentUid && (
                <>
                  <span>•</span>
                  <span className="font-mono text-white">UID: {studentUid}</span>
                </>
              )}
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => fileInputRef.current?.click()}
                className="h-8 text-[11px] font-semibold flex items-center gap-1.5 border-prevu-surface-light hover:border-prevu-accent"
              >
                <Camera className="w-3.5 h-3.5 text-prevu-accent" />
                <span>Upload Profile Photo</span>
              </Button>

              {isAdmin && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                </span>
              )}
              {isCUVerified ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Verified CU Student
                </span>
              ) : null}
            </div>
          </div>

        </CardContent>
      </Card>

      {/* Main Profile Form */}
      <Card className="border-prevu-surface-light bg-prevu-surface/90 backdrop-blur-xl shadow-xl">
        <CardHeader className="border-b border-prevu-surface-light/60 pb-4">
          <div className="flex items-center gap-2 text-prevu-accent text-xs font-semibold uppercase tracking-wider">
            <User className="w-4 h-4" />
            <span>Profile Settings</span>
          </div>
          <CardTitle className="text-xl font-bold text-white">
            Personal & Academic Information
          </CardTitle>
          <CardDescription className="text-xs text-prevu-text-muted">
            Update your handle, branch, current semester, and contact credentials.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6">
          <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Full Name & Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-prevu-text-muted flex items-center gap-1.5" htmlFor="name">
                  <User className="w-3.5 h-3.5 text-prevu-accent" /> Full Name
                </label>
                <input 
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Your Full Name"
                  required
                  className="w-full px-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors"
                />
              </div>

              {/* Username with Change Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-prevu-text-muted flex items-center gap-1.5" htmlFor="username">
                    <AtSign className="w-3.5 h-3.5 text-prevu-accent" /> Username / Handle
                  </label>
                  
                  {/* Changes Left Badge */}
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                    changesLeft > 1 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                      : changesLeft === 1 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    {changesLeft > 0 ? `${changesLeft}/3 changes left` : 'Locked (0 left)'}
                  </span>
                </div>

                <div className="relative">
                  <input 
                    type="text"
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_.-]/g, ''))}
                    disabled={isUsernameLocked}
                    placeholder="e.g. student_handle"
                    required
                    className={`w-full px-3.5 py-2.5 bg-prevu-bg border rounded-xl text-sm font-mono text-prevu-text focus:outline-none transition-colors ${
                      isUsernameLocked 
                        ? 'border-zinc-800 text-prevu-text-muted bg-zinc-900/50 cursor-not-allowed' 
                        : 'border-prevu-surface-light focus:border-prevu-accent'
                    }`}
                  />
                  {isUsernameLocked && (
                    <Lock className="w-4 h-4 text-prevu-text-muted absolute right-3.5 top-1/2 -translate-y-1/2" />
                  )}
                </div>
                <p className="text-[11px] text-prevu-text-muted">
                  You can change your handle up to 3 times to prevent impersonation.
                </p>
              </div>

            </div>

            {/* Student UID & Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Student UID */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-prevu-text-muted flex items-center gap-1.5" htmlFor="student_uid">
                  <Hash className="w-3.5 h-3.5 text-prevu-accent" /> University UID
                </label>
                <input 
                  type="text"
                  id="student_uid"
                  value={studentUid}
                  onChange={e => setStudentUid(e.target.value.toUpperCase())}
                  placeholder="e.g. 23BCSXXXX"
                  className="w-full px-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm font-mono uppercase text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors"
                />
              </div>

              {/* Branch Selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-prevu-text-muted flex items-center gap-1.5" htmlFor="branch">
                  <GraduationCap className="w-3.5 h-3.5 text-prevu-accent" /> Branch & Track
                </label>
                <select 
                  id="branch"
                  value={branch}
                  onChange={e => setBranch(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors cursor-pointer"
                >
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.label}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Current Semester & Phone Number */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Current Semester */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-prevu-text-muted flex items-center gap-1.5" htmlFor="current_semester">
                  <Layers className="w-3.5 h-3.5 text-prevu-accent" /> Current Semester
                </label>
                <select 
                  id="current_semester"
                  value={currentSemester}
                  onChange={e => setCurrentSemester(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors font-medium cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                    <option key={s} value={s}>Semester {s} (Year {Math.ceil(s / 2)})</option>
                  ))}
                </select>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-prevu-text-muted flex items-center gap-1.5" htmlFor="phone_number">
                  <Phone className="w-3.5 h-3.5 text-prevu-accent" /> Phone Number <span className="text-prevu-text-muted/60 font-normal">(Optional)</span>
                </label>
                <input 
                  type="tel"
                  id="phone_number"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="e.g. +91 96847XXXXX"
                  className="w-full px-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm font-mono text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors"
                />
              </div>

            </div>

            {/* University Email */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-prevu-text-muted flex items-center gap-1.5" htmlFor="cu_email">
                  <Mail className="w-3.5 h-3.5 text-prevu-accent" /> Chandigarh University Email
                </label>
                {isCUVerified ? (
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Verified CU Domain
                  </span>
                ) : (
                  <span className="text-[11px] text-amber-400">Must end in @cuchd.in</span>
                )}
              </div>

              <input 
                type="email"
                id="cu_email"
                value={cuEmail}
                onChange={e => setCuEmail(e.target.value.toLowerCase())}
                placeholder="e.g. 23bcs14344@cuchd.in"
                className="w-full px-3.5 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm font-mono text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors"
              />
            </div>

            {/* Alerts */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl flex items-start gap-2.5 text-xs text-red-400"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}

              {success && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }} 
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 bg-emerald-500/10 border border-emerald-500/25 rounded-xl flex items-start gap-2.5 text-xs text-emerald-400 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>Your profile details and photo have been successfully saved! 🎉</span>
                </motion.div>
              )}
            </AnimatePresence>

          </form>
        </CardContent>

        <CardFooter className="border-t border-prevu-surface-light/60 p-6 flex justify-end">
          <Button 
            type="submit" 
            form="profile-form" 
            disabled={isSaving}
            className="w-full sm:w-auto px-6 py-2.5 text-sm flex items-center justify-center gap-2 shadow-lg shadow-prevu-accent/25 font-bold"
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
        </CardFooter>
      </Card>

    </div>
  )
}
