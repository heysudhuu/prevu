import React from 'react'
import { LucideIcon, Inbox } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  actionIcon?: LucideIcon
  className?: string
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className = ''
}: EmptyStateProps) {
  return (
    <div
      className={`text-center py-12 px-6 border border-dashed border-prevu-surface-light rounded-2xl bg-prevu-surface/30 flex flex-col items-center justify-center space-y-3 ${className}`}
    >
      <div className="w-12 h-12 rounded-2xl bg-prevu-surface-light/60 border border-prevu-surface-light flex items-center justify-center text-prevu-text-muted">
        <Icon className="w-6 h-6" />
      </div>

      <div className="max-w-sm space-y-1">
        <h4 className="text-sm font-semibold text-prevu-text">{title}</h4>
        {description && (
          <p className="text-xs text-prevu-text-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionLabel && onAction && (
        <div className="pt-2">
          <Button
            size="sm"
            onClick={onAction}
            className="h-8 px-3.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm"
          >
            {ActionIcon && <ActionIcon className="w-3.5 h-3.5 mr-1.5" />}
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
