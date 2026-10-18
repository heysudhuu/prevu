import Header from '@/components/Header'
import CbtQuestionContributor from '@/components/cbt/CbtQuestionContributor'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Contribute CBT Questions | Prevu CBT Arena',
  description: 'Submit MCQ questions for Chandigarh University Open Electives, UHV, Aptitude, or Core MSTs. Earn +5 Scholar Karma per approved question.'
}

export default async function CbtContributePage({
  searchParams
}: {
  searchParams?: Promise<{ subject?: string }>
}) {
  const resolved = searchParams ? await searchParams : {}
  const initialSubject = resolved.subject || ''

  return (
    <div className="min-h-screen flex flex-col bg-[#07070c] text-prevu-text relative overflow-hidden">
      {/* Ambient background glows */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] pointer-events-none z-0 opacity-30 blur-[130px]" 
        style={{
          background: 'radial-gradient(ellipse 60% 40% at 50% 10%, rgba(139, 92, 246, 0.25), rgba(6, 182, 212, 0.12), transparent)'
        }}
      />
      <div className="fixed inset-0 grid-pattern-sm pointer-events-none opacity-20 z-0" />

      <Header />
      <main className="flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="container mx-auto max-w-6xl">
          <CbtQuestionContributor initialSubject={initialSubject} />
        </div>
      </main>
    </div>
  )
}
