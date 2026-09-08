'use client'

import { useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { onIdTokenChanged } from 'firebase/auth'
import { refreshAuthCookie } from '@/app/login/actions'

export default function AuthListener() {
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken()
          await refreshAuthCookie(idToken)

          // Clear any existing interval
          if (intervalId) clearInterval(intervalId)

          // Proactively refresh the token every 25 minutes (Firebase tokens expire at 60 mins)
          intervalId = setInterval(async () => {
            try {
              const freshToken = await user.getIdToken(true)
              await refreshAuthCookie(freshToken)
            } catch (err) {
              console.error('Proactive token refresh error:', err)
            }
          }, 25 * 60 * 1000)
        } catch (err) {
          console.error('Failed to sync refreshed auth token:', err)
        }
      } else {
        if (intervalId) clearInterval(intervalId)
      }
    })

    return () => {
      unsubscribe()
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  return null
}
