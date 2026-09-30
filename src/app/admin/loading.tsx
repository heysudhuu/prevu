export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-prevu-bg">
      {/* Admin header skeleton */}
      <div className="h-16 border-b border-prevu-surface-light bg-prevu-surface/50" />
      
      <div className="flex">
        {/* Sidebar skeleton */}
        <aside className="hidden lg:block w-64 border-r border-prevu-surface-light min-h-[calc(100vh-4rem)] p-4 space-y-2">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="h-10 rounded-lg bg-prevu-surface-light/50 animate-pulse" />
          ))}
        </aside>

        {/* Main content skeleton */}
        <main className="flex-1 p-6 space-y-6">
          <div className="h-8 w-56 rounded-lg bg-prevu-surface-light animate-pulse" />
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-prevu-surface border border-prevu-surface-light animate-pulse" />
            ))}
          </div>

          {/* Table skeleton */}
          <div className="rounded-2xl bg-prevu-surface border border-prevu-surface-light overflow-hidden">
            <div className="h-12 bg-prevu-surface-light/30 border-b border-prevu-surface-light" />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 border-b border-prevu-surface-light/30 animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
