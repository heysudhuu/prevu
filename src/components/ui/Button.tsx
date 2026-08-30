'use client'

import * as React from "react"
import { motion } from "framer-motion"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-prevu-accent disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0"
    
    let variantStyles = ""
    switch (variant) {
      case "default":
        variantStyles = "bg-prevu-accent text-prevu-bg hover:bg-prevu-accent/90"
        break
      case "destructive":
        variantStyles = "bg-prevu-pending text-white hover:bg-prevu-pending/90"
        break
      case "outline":
        variantStyles = "border border-prevu-surface-light bg-prevu-surface text-prevu-text hover:bg-prevu-surface-light hover:text-prevu-accent"
        break
      case "secondary":
        variantStyles = "bg-prevu-surface-light text-prevu-text hover:bg-prevu-surface-light/80"
        break
      case "ghost":
        variantStyles = "hover:bg-prevu-surface-light hover:text-prevu-accent"
        break
      case "link":
        variantStyles = "text-prevu-accent underline-offset-4 hover:underline"
        break
    }
    
    let sizeStyles = ""
    switch (size) {
      case "default":
        sizeStyles = "h-9 px-4 py-2"
        break
      case "sm":
        sizeStyles = "h-8 rounded-md px-3 text-xs"
        break
      case "lg":
        sizeStyles = "h-10 rounded-md px-8"
        break
      case "icon":
        sizeStyles = "h-9 w-9"
        break
    }

    return (
      <motion.button
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...props as any}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
