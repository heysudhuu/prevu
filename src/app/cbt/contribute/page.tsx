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
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <CbtQuestionContributor initialSubject={initialSubject} />
        </div>
      </main>
    </div>
  )
}
