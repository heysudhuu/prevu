'use client'

import { useEffect } from 'react'
import { auth } from '@/lib/firebase/client'
import { onIdTokenChanged } from 'firebase/auth'
import { refreshAuthCookie } from '@/app/login/actions'

export default function AuthListener() {
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken()
          await refreshAuthCookie(idToken)
        } catch (err) {
          console.error('Failed to sync refreshed auth token:', err)
        }
      }
    })

    return () => unsubscribe()
  }, [])

  return null
}
