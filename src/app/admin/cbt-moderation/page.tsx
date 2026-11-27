import {
  getPendingCbtQuestions,
  getPendingCbtSubjects,
  getApprovedContributedQuestions,
  getCbtOverrides,
  getAllCbtQuestionReports
} from '@/lib/cbt/actions'
import CbtModerationClient from '@/components/admin/CbtModerationClient'
import Header from '@/components/Header'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'CBT Studio & Moderation | Prevu Studio',
  description: 'Manage live CBT subjects, edit or add MCQs, review student reports, and approve contributed questions.'
}

export default async function AdminCbtModerationPage() {
  const [pendingQuestions, pendingSubjects, approvedQuestions, overrides, questionReports] = await Promise.all([
    getPendingCbtQuestions(),
    getPendingCbtSubjects(),
    getApprovedContributedQuestions().catch(() => []),
    getCbtOverrides().catch(() => ({ subjectOverrides: [], questionOverrides: [] })),
    getAllCbtQuestionReports().catch(() => [])
  ])

  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg text-prevu-text">
      <Header />
      <main className="flex-1 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <CbtModerationClient 
            initialQuestions={JSON.parse(JSON.stringify(pendingQuestions || []))} 
            initialSubjects={JSON.parse(JSON.stringify(pendingSubjects || []))}
            approvedQuestions={JSON.parse(JSON.stringify(approvedQuestions || []))}
            initialSubjectOverrides={JSON.parse(JSON.stringify(overrides.subjectOverrides || []))}
            initialQuestionOverrides={JSON.parse(JSON.stringify(overrides.questionOverrides || []))}
            questionReports={JSON.parse(JSON.stringify(questionReports || []))}
          />
        </div>
      </main>
    </div>
  )
}
