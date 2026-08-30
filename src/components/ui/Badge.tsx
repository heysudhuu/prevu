import * as React from "react"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "stamp" | "status-pending" | "status-approved"
}

function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  let variantStyles = ""
  
  switch (variant) {
    case "default":
      variantStyles = "bg-prevu-surface-light text-prevu-text px-2 py-0.5 rounded text-xs font-mono border border-prevu-text-muted/20"
      break
    case "stamp":
      variantStyles = "font-mono font-bold text-xs uppercase tracking-wider border-2 border-prevu-accent text-prevu-accent px-2 py-0.5 rounded-sm transform -rotate-6 inline-block bg-prevu-surface/50 shadow-sm"
      break
    case "status-pending":
      variantStyles = "bg-prevu-pending/20 text-prevu-pending px-2 py-0.5 rounded-full text-xs font-medium border border-prevu-pending/30"
      break
    case "status-approved":
      variantStyles = "bg-prevu-approved/20 text-prevu-approved px-2 py-0.5 rounded-full text-xs font-medium border border-prevu-approved/30"
      break
  }

  return (
    <div className={`${variantStyles} ${className}`} {...props} />
  )
}

export { Badge }
