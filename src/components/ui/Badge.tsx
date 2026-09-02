import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "stamp" | "status-pending" | "status-approved" | "mst1" | "mst2" | "est" | "outline" | "cyan" | "purple"
}

function Badge({ className = "", variant = "default", children, ...props }: BadgeProps) {
  let variantStyles = ""
  
  switch (variant) {
    case "default":
      variantStyles = "bg-prevu-surface-light text-prevu-text px-2.5 py-0.5 rounded-lg text-xs font-mono border border-prevu-surface-light"
      break
    case "stamp":
      variantStyles = "font-mono font-bold text-xs uppercase tracking-wider border border-prevu-accent/50 text-prevu-accent-light px-2.5 py-0.5 rounded-lg bg-prevu-accent/15 shadow-sm inline-flex items-center gap-1"
      break
    case "mst1":
      variantStyles = "font-mono font-bold text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-lg"
      break
    case "mst2":
      variantStyles = "font-mono font-bold text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-lg"
      break
    case "est":
      variantStyles = "font-mono font-bold text-xs bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-lg"
      break
    case "cyan":
      variantStyles = "font-mono font-bold text-xs bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 px-2.5 py-0.5 rounded-lg"
      break
    case "purple":
      variantStyles = "font-mono font-bold text-xs bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2.5 py-0.5 rounded-lg"
      break
    case "outline":
      variantStyles = "border border-prevu-surface-light text-prevu-text-muted px-2.5 py-0.5 rounded-lg text-xs font-mono"
      break
    case "status-pending":
      variantStyles = "bg-amber-500/15 text-amber-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-amber-500/30 inline-flex items-center gap-1.5"
      break
    case "status-approved":
      variantStyles = "bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded-full text-xs font-medium border border-emerald-500/30 inline-flex items-center gap-1.5"
      break
  }

  return (
    <div className={`inline-flex items-center justify-center ${variantStyles} ${className}`} {...props}>
      {children}
    </div>
  )
}

export { Badge }
