import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Paper Requests | Prevu',
  description: 'Community Missing Paper Requests for Chandigarh University students.',
}

export default async function RequestsPage({
  searchParams,
}: {
  searchParams?: Promise<{ action?: string; branch?: string }>
}) {
  const resolved = searchParams ? await searchParams : {}
  const actionParam = resolved.action ? `&action=${resolved.action}` : ''
  const branchParam = resolved.branch ? `&branch=${resolved.branch}` : ''
  redirect(`/dashboard?tab=requests${actionParam}${branchParam}`)
}
