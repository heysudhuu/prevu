import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { createClient } from '@supabase/supabase-js'
import Header from '@/components/Header'

export default async function VerifyEmailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = (await cookies()).get('firebase-token')?.value
  
  if (!token) {
    redirect('/login')
  }

  try {
    const decoded = await authAdmin.verifyIdToken(token)
    
    // Check cu_verified status using Service Role Key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const { data: userData } = await supabase
      .from('users')
      .select('cu_verified')
      .eq('id', decoded.uid)
      .single()
      
    // If already verified, no need to be here
    if (userData?.cu_verified) {
      redirect('/upload')
    }
  } catch {
    redirect('/login')
  }

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg">
      <Header />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
