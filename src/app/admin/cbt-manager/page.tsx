import {
  getPendingCbtQuestions,
  getPendingCbtSubjects,
  getApprovedContributedQuestions,
  getCbtOverrides,
  getAllCbtQuestionReports
} from '@/lib/cbt/actions'
import CbtModerationClient from '@/components/admin/CbtModerationClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'CBT Arena Modification Studio | Prevu Admin',
  description: 'Modify live CBT subjects, edit or archive MCQs, add new questions, and resolve student reports without data loss.'
}

export default async function AdminCbtManagerPage() {
  const [pendingQuestions, pendingSubjects, approvedQuestions, overrides, questionReports] = await Promise.all([
    getPendingCbtQuestions().catch(() => []),
    getPendingCbtSubjects().catch(() => []),
    getApprovedContributedQuestions().catch(() => []),
    getCbtOverrides().catch(() => ({ subjectOverrides: [], questionOverrides: [] })),
    getAllCbtQuestionReports().catch(() => [])
  ])

  return (
    <div className="container mx-auto max-w-6xl py-2">
      <CbtModerationClient
        defaultTab="manage-subjects"
        initialQuestions={JSON.parse(JSON.stringify(pendingQuestions || []))}
        initialSubjects={JSON.parse(JSON.stringify(pendingSubjects || []))}
        approvedQuestions={JSON.parse(JSON.stringify(approvedQuestions || []))}
        initialSubjectOverrides={JSON.parse(JSON.stringify(overrides.subjectOverrides || []))}
        initialQuestionOverrides={JSON.parse(JSON.stringify(overrides.questionOverrides || []))}
        questionReports={JSON.parse(JSON.stringify(questionReports || []))}
      />
    </div>
  )
}
