import Header from '@/components/Header'
import SmartStudyPlanner from '@/components/planner/SmartStudyPlanner'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Smart Study Planner | Prevu',
  description: 'Auto-generate personalized day-by-day revision schedules for Chandigarh University MST and EST examinations.',
}

export default function StudyPlannerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg">
      <Header />
      <main className="flex-1">
        <SmartStudyPlanner />
      </main>
    </div>
  )
}
