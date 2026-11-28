import PrevuLoadingIndicator from '@/components/ui/PrevuLoadingIndicator'

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-prevu-bg">
      <div className="flex flex-col items-center gap-6">
        <PrevuLoadingIndicator label="Loading your page" />
        <div className="h-1 w-48 overflow-hidden rounded-full bg-prevu-surface-light">
          <div className="h-full w-1/2 animate-[shimmer_1.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-prevu-accent to-purple-400" />
        </div>
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
