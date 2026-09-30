import Header from '@/components/Header'
import OfflineVaultView from '@/components/vault/OfflineVaultView'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Offline Vault | Prevu',
  description: 'Access your saved Chandigarh University BE-CSE previous year question papers offline without internet.',
}

export default function VaultPage() {
  return (
    <div className="min-h-screen flex flex-col bg-prevu-bg">
      <Header />
      <main className="flex-1">
        <OfflineVaultView />
      </main>
    </div>
  )
}
