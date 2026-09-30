import Link from 'next/link'
import { FileQuestion, Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-prevu-bg p-4">
      <div className="max-w-md w-full text-center space-y-6">
        {/* 404 visual */}
        <div className="relative">
          <h1 className="text-8xl font-black text-prevu-surface-light select-none">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-prevu-accent/10 border border-prevu-accent/20 flex items-center justify-center">
              <FileQuestion className="w-8 h-8 text-prevu-accent" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Page Not Found</h2>
          <p className="text-sm text-prevu-text-muted leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-prevu-accent text-white hover:bg-purple-600 transition-colors shadow-md shadow-prevu-accent/25"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-prevu-surface-light bg-prevu-surface/80 text-prevu-text hover:bg-prevu-surface-light transition-colors"
          >
            <Search className="w-4 h-4" />
            Browse Papers
          </Link>
        </div>
      </div>
    </div>
  )
}
