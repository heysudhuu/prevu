'use client'

import * as React from "react"
import { motion, HTMLMotionProps } from "framer-motion"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "glow" | "emerald"
  size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", asChild = false, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-prevu-accent focus-visible:ring-offset-2 focus-visible:ring-offset-prevu-bg disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 select-none"
    
    let variantStyles = ""
    switch (variant) {
      case "default":
        variantStyles = "bg-prevu-accent text-white hover:bg-purple-600 shadow-md shadow-prevu-accent/25 hover:shadow-prevu-accent/40 hover:-translate-y-0.5 active:translate-y-0"
        break
      case "glow":
        variantStyles = "bg-gradient-to-r from-purple-600 via-prevu-accent to-indigo-600 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0"
        break
      case "emerald":
        variantStyles = "bg-emerald-600 text-white hover:bg-emerald-500 shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0"
        break
      case "destructive":
        variantStyles = "bg-red-600/90 text-white hover:bg-red-600 shadow-md shadow-red-600/20 hover:-translate-y-0.5 active:translate-y-0"
        break
      case "outline":
        variantStyles = "border border-prevu-surface-light bg-prevu-surface/80 text-prevu-text hover:bg-prevu-surface-light hover:border-prevu-accent/50 hover:text-white"
        break
      case "secondary":
        variantStyles = "bg-prevu-surface-light text-prevu-text hover:bg-prevu-surface-elevated hover:text-white"
        break
      case "ghost":
        variantStyles = "text-prevu-text-muted hover:bg-prevu-surface-light/60 hover:text-prevu-text"
        break
      case "link":
        variantStyles = "text-prevu-accent underline-offset-4 hover:underline hover:text-prevu-accent-light"
        break
    }
    
    let sizeStyles = ""
    switch (size) {
      case "default":
        sizeStyles = "h-10 px-4 py-2"
        break
      case "sm":
        sizeStyles = "h-8 rounded-lg px-3 text-xs"
        break
      case "lg":
        sizeStyles = "h-12 rounded-2xl px-6 text-base"
        break
      case "icon":
        sizeStyles = "h-9 w-9 p-0"
        break
    }

    const combinedClassName = `${baseStyles} ${variantStyles} ${sizeStyles} ${className}`

    if (asChild && React.isValidElement(children)) {
      // Merge className onto child element and avoid nested button tag
      const childProps = children.props as { className?: string }
      return React.cloneElement(children as React.ReactElement<{ className?: string }>, {
        className: `${combinedClassName} ${childProps.className || ""}`.trim()
      })
    }

    const motionProps = props as HTMLMotionProps<"button">

    return (
      <motion.button
        className={combinedClassName}
        ref={ref}
        whileHover={{ scale: 1.015 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        {...motionProps}
      >
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
