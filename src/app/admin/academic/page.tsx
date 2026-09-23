import { getAcademicTaxonomy } from '../actions'
import AcademicCmsClient from './AcademicCmsClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Academic Data CMS | Prevu Studio',
  description: 'Manage university programs, semesters, curriculum subjects, and exam format definitions.'
}

export default async function AdminAcademicPage() {
  const taxonomy = await getAcademicTaxonomy()
  return (
    <AcademicCmsClient
      initialBranches={taxonomy?.branches || []}
      initialSubjects={taxonomy?.subjects || []}
      initialExamTypes={taxonomy?.examTypes || []}
    />
  )
}
