'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { sendVerificationOTP, verifyOTP } from './actions'

export default function VerifyEmailPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null) // Only for DEV/demo

  const handleSendOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await sendVerificationOTP(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      setStep(2)
      if (result.simulatedOtp) {
        setSimulatedOtp(result.simulatedOtp)
      }
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    formData.append('cu_email', email)
    const result = await verifyOTP(formData)
    
    if (result.error) {
      setError(result.error)
    } else if (result.success) {
      router.push('/upload')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Verify CU Email</CardTitle>
          <CardDescription>
            {step === 1 
              ? 'You must verify an official @cuchd.in email address to upload resources.' 
              : `We've sent a code to ${email}.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 ? (
            <form id="verify-email-form" onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="cu_email">CU Email</label>
                <input 
                  type="email" 
                  id="cu_email" 
                  name="cu_email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name.uid@cuchd.in"
                  required 
                  className="w-full px-3 py-2 bg-transparent border border-prevu-surface-light rounded-md focus:outline-none focus:ring-1 focus:ring-prevu-accent"
                />
              </div>
              {error && <p className="text-prevu-pending text-sm">{error}</p>}
            </form>
          ) : (
            <form id="verify-otp-form" onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="otp">Verification Code</label>
                <input 
                  type="text" 
                  id="otp" 
                  name="otp" 
                  required 
                  maxLength={6}
                  className="w-full px-3 py-2 bg-transparent border border-prevu-surface-light rounded-md focus:outline-none focus:ring-1 focus:ring-prevu-accent font-mono tracking-widest text-center"
                />
              </div>
              {error && <p className="text-prevu-pending text-sm">{error}</p>}
              
              {/* DEV ONLY: Show OTP to the user since there's no SMTP server */}
              {simulatedOtp && (
                <div className="mt-4 p-3 bg-prevu-surface-light border border-prevu-text-muted/20 rounded-md">
                  <p className="text-xs text-prevu-text-muted mb-1">DEV MODE - Simulated Email Content:</p>
                  <p className="text-sm">Your OTP is: <span className="font-mono font-bold text-prevu-text">{simulatedOtp}</span></p>
                </div>
              )}
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {step === 1 ? (
            <Button type="submit" form="verify-email-form" className="w-full">
              Send Code
            </Button>
          ) : (
            <>
              <Button type="submit" form="verify-otp-form" className="w-full">
                Verify
              </Button>
              <Button type="button" variant="ghost" onClick={() => setStep(1)}>
                Change Email
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
