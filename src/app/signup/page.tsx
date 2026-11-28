import { Suspense } from 'react'
import AuthForm from '@/components/auth/AuthForm'
import PrevuLoadingIndicator from '@/components/ui/PrevuLoadingIndicator'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata = {
  title: 'Create Account | Prevu',
  description: 'Join the student-run repository for BE-CSE resources.',
}

function AuthLoading() {
  return (
    <PrevuLoadingIndicator label="Loading registration portal" className="p-8" />
  )
}

export default async function SignupPage() {
  const token = (await cookies()).get('firebase-token')?.value
  if (token) {
    redirect('/dashboard')
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-prevu-bg">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-prevu-accent/15 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full flex justify-center py-8">
        <Suspense fallback={<AuthLoading />}>
          <AuthForm initialMode="signup" />
        </Suspense>
      </div>
    </div>
  )
}
