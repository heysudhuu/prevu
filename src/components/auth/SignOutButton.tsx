'use client'

import { useState } from 'react'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase/client'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { LogOut, Loader2 } from 'lucide-react'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      setLoading(true)
      // 1. Sign out from Firebase Client
      await signOut(auth)
      
      // 2. Call server route to delete cookie
      await fetch('/auth/signout', { method: 'POST' })
      
      // 3. Refresh and redirect
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Error during sign out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      variant="secondary" 
      onClick={handleSignOut} 
      disabled={loading}
      className="flex items-center gap-1.5"
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5" />
      )}
      <span>{loading ? 'Signing Out...' : 'Sign Out'}</span>
    </Button>
  )
}
