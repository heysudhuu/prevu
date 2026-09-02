import Header from '@/components/Header'
import LandingPageContent from '@/components/LandingPageContent'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LandingPageContent />
    </div>
  )
}
