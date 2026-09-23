import { getPapersManagementList } from '../actions'
import PapersManagementClient from './PapersManagementClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Paper Management | Prevu Studio',
  description: 'Manage, filter, verify, edit, and organize all question papers in the Prevu vault.'
}

export default async function AdminPapersPage() {
  const papers = await getPapersManagementList()
  return <PapersManagementClient initialPapers={papers} />
}
