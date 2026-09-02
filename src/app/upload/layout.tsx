import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Header from '@/components/Header'

export default async function UploadLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const token = (await cookies()).get('firebase-token')?.value
  
  if (!token) {
    redirect('/login?redirect=/upload')
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
