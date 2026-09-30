import { Metadata } from 'next'
import Header from '@/components/Header'
import FacultyPortalClient from '@/components/faculty/FacultyPortalClient'

export const metadata: Metadata = {
  title: 'Faculty Collaboration Portal | Prevu',
  description: 'Chandigarh University faculty and department coordinator portal for verifying question papers, certifying syllabus alignment, and sharing official answer keys.'
}

export default function FacultyPortalPage() {
  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg">
      <Header />
      <FacultyPortalClient />
    </div>
  )
}

