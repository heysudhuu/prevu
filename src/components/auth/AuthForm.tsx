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
  checkUsernameAvailable 
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
  ShieldCheck
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
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

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
        
        // 4. Sync to Supabase Database
        const idToken = await userCredential.user.getIdToken(true)
        await syncUserToServer(idToken, name.trim(), cleanUsername)

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

        // Resolve username/UID to registered email
        if (!authEmail.includes('@')) {
          const resolution = await resolveEmailFromIdentifier(authEmail)
          if (resolution.error || !resolution.email) {
            setError(resolution.error || `No account found with username "${authEmail}".`)
            setLoading(false)
            return
          }
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
      if (!resetEmail.includes('@')) {
        const resolution = await resolveEmailFromIdentifier(resetEmail)
        if (resolution.error || !resolution.email) {
          setError(resolution.error || `No account found with username "${resetEmail}".`)
          setLoading(false)
          return
        }
        resetEmail = resolution.email
      }

      await sendPasswordResetEmail(auth, resetEmail)
      setSuccessMessage(`Password reset link sent to ${resetEmail}. Please check your inbox or spam folder.`)
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
                router.push(redirectTo)
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
    <div className="w-full max-w-md">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2 font-sans text-3xl font-extrabold tracking-tighter text-prevu-text hover:text-prevu-accent transition-colors">
          <Sparkles className="w-6 h-6 text-prevu-accent" />
          Prevu
        </Link>
        <p className="text-sm text-prevu-text-muted mt-2">
          {mode === 'login' && 'Sign in with your username, student UID, or email.'}
          {mode === 'signup' && 'Create your account to access and contribute resources.'}
          {mode === 'forgot-password' && 'Reset your password to regain access.'}
        </p>
      </div>

      {/* Main Card */}
      <div className="backdrop-blur-xl bg-prevu-surface/90 border border-prevu-surface-light rounded-2xl shadow-2xl p-6 sm:p-8">
        
        {/* Segmented Mode Switcher */}
        {mode !== 'forgot-password' ? (
          <div className="flex bg-prevu-bg/80 p-1 rounded-xl border border-prevu-surface-light mb-6">
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
        ) : (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            
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

            {/* SIGN UP: Name, Username, and Email Fields */}
            {mode === 'signup' && (
              <>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
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
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="username">
                      Username or Student UID
                    </label>
                    <span className="text-[11px] text-prevu-text-muted/70">Unique login handle</span>
                  </div>
                  <div className="relative">
                    <AtSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                    <input
                      type="text"
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                      placeholder="e.g. 21BCS10145 or alex_cse"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors font-mono text-[13px]"
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-1.5"
                >
                  <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="email">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/50 focus:outline-none focus:border-prevu-accent transition-colors"
                    />
                  </div>
                </motion.div>
              </>
            )}

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-prevu-text-muted" htmlFor="password">
                  Password
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('forgot-password')}
                    className="text-xs text-prevu-accent hover:underline"
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

            {/* Confirm Password Field (Sign Up only) */}
            {mode === 'signup' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
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

            {/* Submit Button */}
            <Button type="submit" className="w-full py-2.5 mt-2" disabled={loading}>
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
        {mode !== 'forgot-password' && (
          <>
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-prevu-surface-light" />
              <span className="text-[11px] uppercase tracking-wider text-prevu-text-muted font-medium">
                Or continue with
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
              <span>Continue with Google</span>
            </Button>
          </>
        )}

      </div>

      {/* Footer Helper Note */}
      <p className="text-center text-xs text-prevu-text-muted mt-6">
        Student-run initiative for BE-CSE • Chandigarh University
      </p>
    </div>
  )
}
