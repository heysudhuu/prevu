import React from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  breadcrumbs?: BreadcrumbItem[]
  badge?: {
    text: string
    variant?: 'purple' | 'emerald' | 'amber' | 'cyan' | 'neutral'
  }
  title: string
  description?: string
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  breadcrumbs,
  badge,
  title,
  description,
  actions,
  className = ''
}: PageHeaderProps) {
  const badgeClasses = {
    purple: 'bg-prevu-accent/15 text-prevu-accent border-prevu-accent/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    cyan: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    neutral: 'bg-prevu-surface-light text-prevu-text-muted border-prevu-surface-light'
  }

  const selectedBadgeVariant = badge?.variant || 'purple'

  return (
    <div className={`border-b border-prevu-surface-light pb-6 mb-8 ${className}`}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-prevu-text-muted mb-3 flex-wrap">
          {breadcrumbs.map((crumb, idx) => {
            const isLast = idx === breadcrumbs.length - 1
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-prevu-text-muted/60 shrink-0" />}
                {crumb.href && !isLast ? (
                  <Link href={crumb.href} className="hover:text-white transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={isLast ? 'text-white font-medium' : ''}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            )
          })}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          {badge && (
            <div className="mb-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold border tracking-wider uppercase ${badgeClasses[selectedBadgeVariant]}`}>
                {badge.text}
              </span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-xs sm:text-sm text-prevu-text-muted mt-1.5 max-w-3xl leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}
