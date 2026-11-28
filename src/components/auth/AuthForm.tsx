'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { 
  syncUserToServer, 
  resolveEmailFromIdentifier, 
  checkUsernameAvailable,
  sendSignupOtp,
  verifySignupOtp
} from '@/app/login/actions'
import { getFriendlyAuthErrorMessage } from '@/lib/firebase/auth-errors'
import { Button } from '@/components/ui/Button'
import { 
  Mail, 
  Lock, 
  User, 
  AtSign,
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Loader2,
  PartyPopper,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Layers,
  KeyRound
} from 'lucide-react'
import Link from 'next/link'
import SignOutButton from '@/components/auth/SignOutButton'

type AuthMode = 'login' | 'signup' | 'forgot-password'

export default function AuthForm({ initialMode = 'login' }: { initialMode?: 'login' | 'signup' }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlMode = searchParams.get('mode')
  const redirectTo = searchParams.get('redirect') || '/'

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // Listen for existing client auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setCheckingAuth(false)
    })
    return () => unsubscribe()
  }, [])

  const [internalMode, setInternalMode] = useState<AuthMode | null>(null)
  const mode: AuthMode = internalMode ?? (urlMode === 'signup' || initialMode === 'signup' ? 'signup' : 'login')

  // Form Fields
  const [identifier, setIdentifier] = useState('') // Sign In: Username, UID, or Email
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [branch, setBranch] = useState('BE-CSE')
  const [currentSemester, setCurrentSemester] = useState<number>(1)

  // Step 1 -> Step 2 OTP Verification State (Sign Up)
  const [signupStep, setSignupStep] = useState<'email' | 'details'>('email')
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (resendCooldown <= 0) return
    const timer = setTimeout(() => setResendCooldown((prev) => Math.max(0, prev - 1)), 1000)
    return () => clearTimeout(timer)
  }, [resendCooldown])

  // Celebratory Success State after Signup
  const [signupSuccess, setSignupSuccess] = useState<{
    name: string
    username: string
    email: string
  } | null>(null)

  const clearMessages = () => {
    setError(null)
    setSuccessMessage(null)
  }

  const handleModeSwitch = (newMode: AuthMode) => {
    clearMessages()
    setInternalMode(newMode)
    setPassword('')
    setConfirmPassword('')
    if (newMode !== 'signup') {
      setSignupStep('email')
      setOtpSent(false)
      setOtpCode('')
    }
  }

  const handleSendOtp = async () => {
    clearMessages()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setLoading(true)
    try {
      const res = await sendSignupOtp(cleanEmail)
      if (res.error) {
        setError(res.error)
      } else {
        setEmail(cleanEmail)
        setOtpSent(true)
        setResendCooldown(60)
        setSuccessMessage(
          res.devMode
            ? `Verification code generated for ${cleanEmail} (check server terminal in dev mode).`
            : `6-digit verification code sent to ${cleanEmail}. Check your inbox or Spam folder.`
        )
      }
    } catch {
      setError('Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearMessages()
    if (!/^\d{6}$/.test(otpCode.trim())) {
      setError('Please enter the 6-digit verification code.')
      return
    }
    setLoading(true)
    try {
      const res = await verifySignupOtp(email.trim().toLowerCase(), otpCode.trim())
      if (res.error) {
        setError(res.error)
      } else {
        setSignupStep('details')
        setSuccessMessage('Email verified! Complete your profile and set your password below.')
      }
    } catch {
      setError('Could not verify the code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearMessages()

    // -------------------------------------------------------------
    // SIGN UP FLOW
    // -------------------------------------------------------------
    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your full name.')
        return
      }

      const cleanUsername = username.trim().toLowerCase()
      if (!cleanUsername) {
        setError('Please choose a username or student UID.')
        return
      }

      if (cleanUsername.length < 3) {
        setError('Username must be at least 3 characters long.')
        return
      }

      if (!/^[a-zA-Z0-9_.-]+$/.test(cleanUsername)) {
        setError('Username can only contain letters, numbers, underscores, dots, and hyphens.')
        return
      }

      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.')
        return
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters long.')
        return
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter them.')
        return
      }

      setLoading(true)

      try {
        // 1. Verify username uniqueness
        const userCheck = await checkUsernameAvailable(cleanUsername)
        if (!userCheck.available) {
          setError(userCheck.error || 'This username is already taken. Please choose another one.')
          setLoading(false)
          return
        }

        // 2. Create Firebase Account
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password)
        
        // 3. Update Firebase Profile
        await updateProfile(userCredential.user, { displayName: name.trim() })
        
        // 4. Sync to Supabase Database (includes verified email + academic details)
        const idToken = await userCredential.user.getIdToken(true)
        await syncUserToServer(idToken, name.trim(), cleanUsername, branch, currentSemester)

        // 5. Show Celebration Gesture
        setSignupSuccess({
          name: name.trim(),
          username: cleanUsername,
          email: email.trim()
        })
      } catch (err: unknown) {
        setError(getFriendlyAuthErrorMessage(err))
      } finally {
        setLoading(false)
      }
      return
    }

    // -------------------------------------------------------------
    // SIGN IN FLOW
    // -------------------------------------------------------------
    if (mode === 'login') {
      if (!identifier.trim()) {
        setError('Please enter your username, student UID, or email.')
        return
      }
      if (!password) {
        setError('Please enter your password.')
        return
      }

      setLoading(true)

      try {
        let authEmail = identifier.trim()

        // Resolve username/UID to registered email or detect typos
        const resolution = await resolveEmailFromIdentifier(authEmail)
        if (resolution.error) {
          setError(resolution.error)
          setLoading(false)
          return
        }
        if (resolution.email) {
          authEmail = resolution.email
        }

        // Sign in with Firebase
        const userCredential = await signInWithEmailAndPassword(auth, authEmail, password)
        const idToken = await userCredential.user.getIdToken()
        
        const syncRes = await syncUserToServer(idToken, userCredential.user.displayName || '')
        
        let destination = redirectTo
        if (!destination || destination === '/') {
          destination = syncRes?.role === 'admin' ? '/admin' : '/dashboard'
        }

        router.push(destination)
        router.refresh()
      } catch (err: unknown) {
        setError(getFriendlyAuthErrorMessage(err))
      } finally {
        setLoading(false)
      }
    }
  }

  // -------------------------------------------------------------
  // GOOGLE AUTH
  // -------------------------------------------------------------
  const handleGoogleAuth = async () => {
    clearMessages()
    setLoading(true)
    try {
      const provider = new GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      const userCredential = await signInWithPopup(auth, provider)
      const idToken = await userCredential.user.getIdToken()
      
      const syncRes = await syncUserToServer(idToken, userCredential.user.displayName || '')
      
      let destination = redirectTo
      if (!destination || destination === '/' || destination === '/login' || destination === '/signup') {
        destination = syncRes?.role === 'admin' ? '/admin' : '/dashboard'
      }

      if (syncRes?.isNewUser) {
        destination = `${destination}${destination.includes('?') ? '&' : '?'}welcome=true`
      }

      router.push(destination)
      router.refresh()
    } catch (err: unknown) {
      setError(getFriendlyAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------------------------------------
  // FORGOT PASSWORD
  // -------------------------------------------------------------
  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    clearMessages()

    const target = email.trim() || identifier.trim()
    if (!target) {
      setError('Please enter your registered email address or username.')
      return
    }

    setLoading(true)
    try {
      let resetEmail = target
      const resolution = await resolveEmailFromIdentifier(resetEmail)
      if (resolution.error) {
        setError(resolution.error)
        setLoading(false)
        return
      }
      if (resolution.email) {
        resetEmail = resolution.email
      }

      await sendPasswordResetEmail(auth, resetEmail)
      setSuccessMessage(`Password reset link sent to ${resetEmail}. If not found in your inbox, please check your Spam/Junk folder or Microsoft 365 Quarantine. (Note: If you registered via 'Continue with Google', you do not need a password — simply sign in with Google below).`)
    } catch (err: unknown) {
      setError(getFriendlyAuthErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  // -------------------------------------------------------------
  // ALREADY LOGGED IN VIEW (If client already has an active session)
  // -------------------------------------------------------------
  if (!checkingAuth && currentUser && !signupSuccess) {
    return (
      <div className="w-full max-w-md">
        <div className="backdrop-blur-xl bg-prevu-surface/90 border border-prevu-surface-light rounded-2xl shadow-2xl p-8 text-center">
          <div className="w-14 h-14 bg-prevu-accent/15 border border-prevu-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-5 text-prevu-accent">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-prevu-text tracking-tight mb-2">
            You are already logged in
          </h2>
          <p className="text-sm text-prevu-text-muted mb-6">
            Signed in as <span className="font-semibold text-prevu-text">{currentUser.displayName || currentUser.email}</span>
          </p>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full py-2.5">
              <Link href={redirectTo !== '/login' && redirectTo !== '/signup' ? redirectTo : '/'}>
                Continue to Prevu <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
            
            <div className="flex justify-center mt-2">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // CELEBRATORY SIGN UP SUCCESS GESTURE / MODAL
  // -------------------------------------------------------------
  if (signupSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-prevu-surface/95 border border-prevu-accent/30 rounded-2xl shadow-2xl p-8 text-center relative overflow-hidden">
          {/* Decorative celebratory top light */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-prevu-accent via-purple-400 to-prevu-accent" />
          
          <div className="w-16 h-16 bg-prevu-accent/20 border border-prevu-accent/40 rounded-2xl flex items-center justify-center mx-auto mb-5 text-prevu-accent shadow-lg shadow-prevu-accent/20">
            <PartyPopper className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-prevu-text tracking-tight mb-2">
            Account Created! 🎉
          </h2>
          
          <p className="text-sm text-prevu-text-muted mb-6">
            Welcome to the community, <span className="font-bold text-prevu-accent">@{signupSuccess.username}</span>! Your student account is fully setup and verified.
          </p>

          <div className="bg-prevu-bg/70 border border-prevu-surface-light rounded-xl p-4 mb-6 text-left space-y-2 text-xs">
            <div className="flex justify-between items-center text-prevu-text-muted">
              <span>Full Name:</span>
              <span className="text-prevu-text font-medium">{signupSuccess.name}</span>
            </div>
            <div className="flex justify-between items-center text-prevu-text-muted">
              <span>Login Handle:</span>
              <span className="font-mono text-prevu-accent font-semibold">@{signupSuccess.username}</span>
            </div>
            <div className="flex justify-between items-center text-prevu-text-muted">
              <span>Email:</span>
              <span className="text-prevu-text font-medium">{signupSuccess.email}</span>
            </div>
          </div>

          <p className="text-xs text-prevu-text-muted mb-6">
            💡 <span className="text-prevu-text font-medium">Pro-tip:</span> You can log in anytime with either your handle <span className="font-mono text-prevu-accent">@{signupSuccess.username}</span> or your email address!
          </p>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={() => {
                const target = redirectTo && redirectTo !== '/' && redirectTo !== '/login' && redirectTo !== '/signup'
                  ? `${redirectTo}${redirectTo.includes('?') ? '&' : '?'}welcome=true`
                  : '/dashboard?welcome=true'
                router.push(target)
                router.refresh()
              }}
              className="w-full py-3 text-base shadow-lg shadow-prevu-accent/25"
            >
              Continue to Prevu <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // -------------------------------------------------------------
  // REGULAR AUTH FORM VIEW
  // -------------------------------------------------------------
  return (
    <div className={`w-full transition-all duration-300 ${mode === 'signup' && signupStep === 'details' ? 'max-w-xl' : 'max-w-md'}`}>
      {/* Brand Header */}
      <div className="text-center mb-4">
        <Link href="/" className="inline-flex items-center gap-2 font-sans text-3xl font-extrabold tracking-tighter text-prevu-text hover:text-prevu-accent transition-colors">
          <Sparkles className="w-6 h-6 text-prevu-accent" />
          Prevu
        </Link>
        <p className="text-sm text-prevu-text-muted mt-1.5">
          {mode === 'login' && 'Sign in with your username, student UID, or email.'}
          {mode === 'signup' && 'Create your account to access and contribute resources.'}
          {mode === 'forgot-password' && 'Reset your password to regain access.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="backdrop-blur-xl bg-prevu-surface/90 border border-prevu-surface-light rounded-2xl shadow-2xl p-5 sm:p-6">
        
        {searchParams.get('deleted') === 'true' && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <p className="font-bold text-white">Account Successfully Deleted</p>
              <p className="text-prevu-text-muted leading-relaxed">
                Your Prevu student account and data have been completely removed. Thank you for having been part of our community.
              </p>
            </div>
          </div>
        )}

        {/* Segmented Mode Switcher */}
        {mode !== 'forgot-password' ? (
          <div className="flex bg-prevu-bg/80 p-1 rounded-xl border border-prevu-surface-light mb-4">
            <button
              type="button"
              onClick={() => handleModeSwitch('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative ${
                mode === 'login' 
                  ? 'text-prevu-text shadow-sm' 
                  : 'text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              {mode === 'login' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-prevu-surface border border-prevu-surface-light rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => handleModeSwitch('signup')}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all relative ${
                mode === 'signup' 
                  ? 'text-prevu-text shadow-sm' 
                  : 'text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              {mode === 'signup' && (
                <motion.div
                  layoutId="auth-tab-pill"
                  className="absolute inset-0 bg-prevu-surface border border-prevu-surface-light rounded-lg"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className="relative z-10">Create Account</span>
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => handleModeSwitch('login')}
            className="inline-flex items-center text-xs font-medium text-prevu-text-muted hover:text-prevu-accent transition-colors mb-6 gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Sign In
          </button>
        )}

        {/* Feedback Alert Messages */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm flex items-start gap-2.5"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Content */}
        {mode === 'forgot-password' ? (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-prevu-text-muted mb-1.5" htmlFor="forgot-email">
                Registered Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                <input
                  type="text"
                  id="forgot-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com or username"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors"
                />
              </div>
            </div>
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-xs text-prevu-text-muted space-y-1">
              <p className="font-semibold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Chandigarh University Students</span>
              </p>
              <p className="text-[11px] leading-relaxed">
                If you created your account using your university Google ID (@cuchd.in), you do not need a password. You can sign in directly with Google below.
              </p>
            </div>

            <Button type="submit" className="w-full py-2.5 mt-2" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Password Reset Link'
              )}
            </Button>
          </form>
        ) : mode === 'signup' && signupStep === 'email' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* 2-Step Progress Indicator */}
            <div className="flex items-center justify-between text-[11px] font-mono text-prevu-text-muted bg-prevu-bg/60 border border-prevu-surface-light rounded-xl px-3 py-2">
              <span className="text-prevu-accent font-bold">1. Verify Email</span>
              <span className="text-prevu-surface-light">→</span>
              <span>2. Profile &amp; Academics</span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="signup-email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                <input
                  type="email"
                  id="signup-email"
                  value={email}
                  disabled={otpSent}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com or you@cuchd.in"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors disabled:opacity-60"
                />
              </div>
              {otpSent && (
                <div className="flex items-center justify-between text-[11px] pt-0.5">
                  <span className="text-emerald-400">6-digit code sent to your email</span>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages()
                      setOtpSent(false)
                      setOtpCode('')
                    }}
                    className="text-prevu-text-muted hover:text-prevu-accent underline cursor-pointer"
                  >
                    Change email
                  </button>
                </div>
              )}
            </div>

            {!otpSent ? (
              <Button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-2.5"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Code...
                  </>
                ) : (
                  'Send Verification Code'
                )}
              </Button>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="signup-otp">
                      6-Digit Verification Code
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || resendCooldown > 0}
                      className="text-[11px] text-prevu-accent hover:text-purple-400 disabled:text-prevu-text-muted/60 cursor-pointer"
                    >
                      {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                    <input
                      type="text"
                      id="signup-otp"
                      inputMode="numeric"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="••••••"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-base font-mono font-bold tracking-[0.4em] text-center text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent transition-colors"
                    />
                  </div>
                </motion.div>

                <Button type="submit" className="w-full py-2.5" disabled={loading || otpCode.length !== 6}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Verifying Code...
                    </>
                  ) : (
                    'Verify Email & Continue'
                  )}
                </Button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-3.5">
            
            {/* SIGN IN: Username or Email Field */}
            {mode === 'login' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="identifier">
                  Username, University UID, or Email
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 21BCS1234, alex_cu, or you@mail.com"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors"
                  />
                </div>
              </div>
            )}

            {/* SIGN UP STEP 2: Verified Email Pill + 2-Column Name, Username, Dept, Year/Sem */}
            {mode === 'signup' && (
              <div className="space-y-3.5">
                {/* 2-Step Progress Indicator + Verified Email Badge */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs bg-emerald-500/10 border border-emerald-500/25 rounded-xl px-3.5 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-mono text-emerald-300 truncate">{email}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 shrink-0">
                      Verified
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      clearMessages()
                      setSignupStep('email')
                      setOtpSent(false)
                      setOtpCode('')
                    }}
                    className="text-[11px] text-prevu-text-muted hover:text-white underline shrink-0 cursor-pointer"
                  >
                    Change
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="name">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Alex Sharma"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <label className="block text-xs font-medium text-prevu-text-muted truncate" htmlFor="username">
                        Username / UID
                      </label>
                      <span className="text-[10px] text-prevu-text-muted/70 shrink-0">Unique handle</span>
                    </div>
                    <div className="relative">
                      <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                      <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                        placeholder="e.g. 21BCS10145"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors font-mono text-[13px]"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="department">
                      Department / Course
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted pointer-events-none" />
                      <select
                        id="department"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full pl-10 pr-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors"
                      >
                        <option value="BE-CSE">BE-CSE (Core)</option>
                        <option value="CSE-AIML">BE-CSE (AI &amp; ML)</option>
                        <option value="CSE-DS">BE-CSE (Data Science)</option>
                        <option value="CSE-CLOUD">BE-CSE (Cloud &amp; DevOps)</option>
                        <option value="CSE-CYBER">BE-CSE (Cyber Security)</option>
                        <option value="CSE-IOT">BE-CSE (IoT)</option>
                        <option value="IT">Information Technology (IT)</option>
                        <option value="OTHER">Other Engineering / Non-CSE</option>
                      </select>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5"
                  >
                    <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="semester">
                      Year &amp; Semester
                    </label>
                    <div className="relative">
                      <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted pointer-events-none" />
                      <select
                        id="semester"
                        value={currentSemester}
                        onChange={(e) => setCurrentSemester(Number(e.target.value))}
                        className="w-full pl-10 pr-3 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text focus:outline-none focus:border-prevu-accent transition-colors"
                      >
                        <option value={1}>1st Year • Semester 1</option>
                        <option value={2}>1st Year • Semester 2</option>
                        <option value={3}>2nd Year • Semester 3</option>
                        <option value={4}>2nd Year • Semester 4</option>
                        <option value={5}>3rd Year • Semester 5</option>
                        <option value={6}>3rd Year • Semester 6</option>
                        <option value={7}>4th Year • Semester 7</option>
                        <option value={8}>4th Year • Semester 8</option>
                      </select>
                    </div>
                  </motion.div>
                </div>
              </div>
            )}

            {/* PASSWORD & CONFIRM PASSWORD (2-Column in Signup, Single in Login) */}
            <div className={mode === 'signup' ? 'grid grid-cols-1 sm:grid-cols-2 gap-3.5' : ''}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="password">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => handleModeSwitch('forgot-password')}
                      className="text-xs text-prevu-accent hover:text-purple-400 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full pl-10 pr-10 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-prevu-text transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5"
                >
                  <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="confirm-password">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required={mode === 'signup'}
                      className="w-full pl-10 pr-10 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-prevu-text-muted hover:text-prevu-text transition-colors"
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full py-2.5 mt-1" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </Button>
          </form>
        )}

        {/* Social Login Divider */}
        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-prevu-surface-light" />
          <span className="text-[11px] uppercase tracking-wider text-prevu-text-muted font-medium">
            {mode === 'forgot-password' ? 'Or sign in directly with' : 'Or continue with'}
          </span>
          <div className="h-px flex-1 bg-prevu-surface-light" />
        </div>

        {/* Google Login Button */}
        <Button
          type="button"
          variant="outline"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2.5 flex items-center justify-center gap-3 bg-prevu-bg/50 hover:bg-prevu-surface-light border-prevu-surface-light"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
            />
            <path
              fill="#4285F4"
              d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
            />
            <path
              fill="#FBBC05"
              d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.8s.2-2.1.4-2.8L1.9 6.3C.7 8.7 0 10.8 0 12s.7 3.3 1.9 5.7l3.7-2.9z"
            />
            <path
              fill="#34A853"
              d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
            />
          </svg>
          <span>{mode === 'forgot-password' ? 'Continue with Google (@cuchd.in)' : 'Continue with Google'}</span>
        </Button>

      </div>

      {/* Footer Helper Note */}
      <p className="text-center text-xs text-prevu-text-muted mt-4">
        Student-run initiative for BE-CSE • Chandigarh University
      </p>
    </div>
  )
}
