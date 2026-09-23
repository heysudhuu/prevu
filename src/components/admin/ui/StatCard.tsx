import React from 'react'
import Link from 'next/link'
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: string
    isPositive?: boolean
    label?: string
  }
  href?: string
  badge?: {
    label: string
    variant?: 'default' | 'warning' | 'success' | 'danger'
  }
  onClick?: () => void
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  href,
  badge,
  onClick
}: StatCardProps) {
  const content = (
    <div
      onClick={onClick}
      className={`group relative p-4 sm:p-5 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-prevu-surface-light/80 transition-all duration-200 flex flex-col justify-between ${
        href || onClick ? 'cursor-pointer hover:bg-prevu-surface-elevated/40' : ''
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-3">
        <span className="text-xs font-medium text-prevu-text-muted tracking-wide">
          {title}
        </span>
        <div className="w-8 h-8 rounded-xl bg-prevu-surface-light/60 border border-prevu-surface-light flex items-center justify-center text-prevu-text-muted group-hover:text-prevu-accent transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div>
        <div className="flex items-baseline gap-2.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-prevu-text font-mono tracking-tight">
            {value}
          </span>
          {badge && (
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                badge.variant === 'warning'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : badge.variant === 'danger'
                  ? 'bg-red-500/10 text-red-400 border-red-500/20'
                  : badge.variant === 'success'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
              }`}
            >
              {badge.label}
            </span>
          )}
        </div>

        {(trend || description) && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-prevu-text-muted">
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 font-medium ${
                  trend.isPositive ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {trend.isPositive ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                {trend.value}
              </span>
            )}
            {trend?.label && <span>{trend.label}</span>}
            {description && !trend && <span>{description}</span>}
          </div>
        )}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} className="block">{content}</Link>
  }

  return content
}
