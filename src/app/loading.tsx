export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-prevu-bg">
      <div className="relative flex flex-col items-center gap-6">
        {/* Animated logo pulse */}
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-prevu-accent/20 border border-prevu-accent/30 flex items-center justify-center animate-pulse">
            <span className="text-2xl font-black text-prevu-accent">P</span>
          </div>
          <div className="absolute -inset-4 rounded-3xl bg-prevu-accent/5 blur-xl animate-pulse" />
        </div>
        
        {/* Loading bar */}
        <div className="w-48 h-1 rounded-full bg-prevu-surface-light overflow-hidden">
          <div className="h-full w-1/2 rounded-full bg-gradient-to-r from-prevu-accent to-purple-400 animate-[shimmer_1.5s_ease-in-out_infinite]" 
               style={{ animation: 'shimmer 1.5s ease-in-out infinite' }} />
        </div>

        <p className="text-sm text-prevu-text-muted font-medium animate-pulse">
          Loading...
        </p>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  )
}
