export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-prevu-bg">
      {/* Header skeleton */}
      <div className="h-16 border-b border-prevu-surface-light bg-prevu-surface/50" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* Page title skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-48 rounded-lg bg-prevu-surface-light animate-pulse" />
          <div className="h-4 w-72 rounded bg-prevu-surface-light/60 animate-pulse" />
        </div>
        
        {/* Tab bar skeleton */}
        <div className="flex gap-2 border-b border-prevu-surface-light pb-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-9 w-24 rounded-lg bg-prevu-surface-light animate-pulse" />
          ))}
        </div>
        
        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-prevu-surface border border-prevu-surface-light animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
