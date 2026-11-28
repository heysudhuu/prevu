type PrevuLoadingIndicatorProps = {
  label?: string
  className?: string
  compact?: boolean
}

export default function PrevuLoadingIndicator({
  label = 'Loading...',
  className = '',
  compact = false,
}: PrevuLoadingIndicatorProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center ${compact ? 'gap-3' : 'flex-col gap-4'} ${className}`}
    >
      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
        <span className="absolute inset-0 rounded-2xl border-2 border-prevu-accent/20 border-t-prevu-accent animate-spin" />
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-prevu-accent/15 text-lg font-black text-prevu-accent">
          P
        </span>
      </div>

      <div className={`flex ${compact ? 'items-center gap-2' : 'flex-col items-center gap-1'}`}>
        <span className="text-base font-extrabold tracking-[0.18em] text-prevu-text">PREVU</span>
        <span className="flex items-center gap-1.5 text-xs font-medium text-prevu-text-muted">
          {label}
          <span aria-hidden="true" className="flex gap-0.5">
            <span className="h-1 w-1 animate-bounce rounded-full bg-prevu-accent [animation-delay:0ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-prevu-accent [animation-delay:120ms]" />
            <span className="h-1 w-1 animate-bounce rounded-full bg-prevu-accent [animation-delay:240ms]" />
          </span>
        </span>
      </div>
    </div>
  )
}
