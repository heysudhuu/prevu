export default function BrowseLoading() {
  return (
    <div className="min-h-screen bg-prevu-bg">
      {/* Header skeleton */}
      <div className="h-16 border-b border-prevu-surface-light bg-prevu-surface/50" />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* Title skeleton */}
        <div className="flex justify-between items-end pb-6 border-b border-prevu-surface-light">
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-prevu-accent/15 animate-pulse" />
            <div className="h-8 w-72 rounded-lg bg-prevu-surface-light animate-pulse" />
            <div className="h-3 w-96 rounded bg-prevu-surface-light/60 animate-pulse" />
          </div>
          <div className="h-8 w-32 rounded-lg bg-prevu-accent/20 animate-pulse" />
        </div>

        {/* Filter bar skeleton */}
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-9 w-28 rounded-lg bg-prevu-surface border border-prevu-surface-light animate-pulse" />
          ))}
        </div>

        {/* Cards grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="rounded-2xl bg-prevu-surface border border-prevu-surface-light animate-pulse overflow-hidden">
              <div className="p-4 space-y-3">
                <div className="flex gap-2">
                  <div className="h-5 w-14 rounded-md bg-prevu-surface-light" />
                  <div className="h-5 w-12 rounded-md bg-prevu-surface-light" />
                </div>
                <div className="h-5 w-3/4 rounded bg-prevu-surface-light" />
                <div className="h-3 w-1/2 rounded bg-prevu-surface-light/60" />
              </div>
              <div className="border-t border-prevu-surface-light p-3 flex gap-2">
                <div className="h-8 flex-1 rounded-lg bg-prevu-surface-light" />
                <div className="h-8 flex-1 rounded-lg bg-prevu-surface-light" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
