'use client'

import { useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { onIdTokenChanged } from 'firebase/auth'
import { refreshAuthCookie } from '@/app/login/actions'

export default function AuthListener() {
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const syncFreshToken = async (forceRefresh = false) => {
      const user = auth.currentUser
      if (!user) return
      try {
        const token = await user.getIdToken(forceRefresh)
        await refreshAuthCookie(token)
      } catch (err) {
        console.error('Failed to sync refreshed auth token:', err)
      }
    }

    const checkAndRefreshIfNeeded = async () => {
      const user = auth.currentUser
      if (!user) return
      try {
        const tokenResult = await user.getIdTokenResult(false)
        const expirationTime = new Date(tokenResult.expirationTime).getTime()
        const now = Date.now()
        // If expired or expires within 10 minutes, refresh immediately
        if (expirationTime - now < 10 * 60 * 1000) {
          await syncFreshToken(true)
        }
      } catch {
        // Retry with force refresh
        await syncFreshToken(true)
      }
    }

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        await syncFreshToken(false)

        if (intervalId) clearInterval(intervalId)

        // Proactively check and refresh every 10 minutes
        intervalId = setInterval(() => {
          checkAndRefreshIfNeeded()
        }, 10 * 60 * 1000)
      } else {
        if (intervalId) clearInterval(intervalId)
      }
    })

    // Listen for tab focus and visibility changes (e.g. laptop wake, switching back to tab)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndRefreshIfNeeded()
      }
    }

    const handleWindowFocus = () => {
      checkAndRefreshIfNeeded()
    }

    // Listen for custom trigger from any API call that encounters a 401
    const handleAuthRefreshNeeded = () => {
      syncFreshToken(true)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleWindowFocus)
    window.addEventListener('auth-refresh-needed', handleAuthRefreshNeeded)

    return () => {
      unsubscribe()
      if (intervalId) clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleWindowFocus)
      window.removeEventListener('auth-refresh-needed', handleAuthRefreshNeeded)
    }
  }, [])

  return null
}
