import { getPendingCbtQuestions, getPendingCbtSubjects } from '@/lib/cbt/actions'
import CbtModerationClient from '@/components/admin/CbtModerationClient'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'CBT Questions Moderation | Prevu Studio',
  description: 'Review and verify student-submitted CBT MCQ questions and proposed subjects before publishing them to the live examination simulator.'
}

export default async function AdminCbtModerationPage() {
  const [pendingQuestions, pendingSubjects] = await Promise.all([
    getPendingCbtQuestions(),
    getPendingCbtSubjects()
  ])

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-5xl">
          <CbtModerationClient 
            initialQuestions={JSON.parse(JSON.stringify(pendingQuestions || []))} 
            initialSubjects={JSON.parse(JSON.stringify(pendingSubjects || []))}
          />
        </div>
      </main>
    </div>
  )
}
