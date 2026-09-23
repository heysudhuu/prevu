import React from 'react'

export type StatusVariant =
  | 'pending'
  | 'approved'
  | 'verified'
  | 'rejected'
  | 'reported'
  | 'archived'
  | 'open'
  | 'in_progress'
  | 'fulfilled'
  | 'closed'
  | 'active'
  | 'suspended'
  | 'admin'
  | 'super_admin'
  | 'moderator'
  | 'student'
  | 'info'
  | 'warning'
  | 'critical'

interface StatusBadgeProps {
  status: string
  label?: string
  className?: string
  dot?: boolean
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; border: string; dotColor: string }> = {
  // Paper & Resource Statuses
  pending: {
    label: 'Pending Review',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
    dotColor: 'bg-amber-400'
  },
  approved: {
    label: 'Verified',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    dotColor: 'bg-emerald-400'
  },
  verified: {
    label: 'Verified',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    dotColor: 'bg-emerald-400'
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/25',
    dotColor: 'bg-red-400'
  },
  archived: {
    label: 'Archived',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/25',
    dotColor: 'bg-zinc-400'
  },
  reported: {
    label: 'Reported',
    bg: 'bg-rose-500/15',
    text: 'text-rose-400',
    border: 'border-rose-500/30',
    dotColor: 'bg-rose-400'
  },

  // Request & Report Statuses
  open: {
    label: 'Open',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/25',
    dotColor: 'bg-blue-400'
  },
  under_review: {
    label: 'Under Review',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
    dotColor: 'bg-amber-400'
  },
  in_progress: {
    label: 'In Progress',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/25',
    dotColor: 'bg-cyan-400'
  },
  resolved: {
    label: 'Resolved',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    dotColor: 'bg-emerald-400'
  },
  fulfilled: {
    label: 'Fulfilled',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    dotColor: 'bg-emerald-400'
  },
  dismissed: {
    label: 'Dismissed',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/25',
    dotColor: 'bg-zinc-400'
  },
  closed: {
    label: 'Closed',
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    border: 'border-zinc-500/25',
    dotColor: 'bg-zinc-400'
  },

  // User Status & Roles
  active: {
    label: 'Active',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/25',
    dotColor: 'bg-emerald-400'
  },
  suspended: {
    label: 'Suspended',
    bg: 'bg-red-500/15',
    text: 'text-red-400',
    border: 'border-red-500/30',
    dotColor: 'bg-red-400'
  },
  super_admin: {
    label: 'Super Admin',
    bg: 'bg-purple-500/15',
    text: 'text-purple-300',
    border: 'border-purple-500/30',
    dotColor: 'bg-purple-400'
  },
  admin: {
    label: 'Admin',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/25',
    dotColor: 'bg-purple-400'
  },
  moderator: {
    label: 'Moderator',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/25',
    dotColor: 'bg-indigo-400'
  },
  student: {
    label: 'Student',
    bg: 'bg-zinc-800/60',
    text: 'text-zinc-300',
    border: 'border-zinc-700/50',
    dotColor: 'bg-zinc-400'
  },

  // Priority & Severity
  info: {
    label: 'Info',
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/25',
    dotColor: 'bg-blue-400'
  },
  important: {
    label: 'Important',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/25',
    dotColor: 'bg-amber-400'
  },
  warning: {
    label: 'Warning',
    bg: 'bg-amber-500/15',
    text: 'text-amber-400',
    border: 'border-amber-500/30',
    dotColor: 'bg-amber-400'
  },
  critical: {
    label: 'Critical',
    bg: 'bg-red-500/20',
    text: 'text-red-300',
    border: 'border-red-500/35',
    dotColor: 'bg-red-400'
  }
}

export function StatusBadge({ status, label, className = '', dot = true }: StatusBadgeProps) {
  const normalized = (status || '').toLowerCase().replace(/\s+/g, '_')
  const config = STATUS_CONFIG[normalized] || {
    label: label || status || 'Unknown',
    bg: 'bg-zinc-800',
    text: 'text-zinc-400',
    border: 'border-zinc-700',
    dotColor: 'bg-zinc-500'
  }

  const displayLabel = label || config.label

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium tracking-tight border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${config.dotColor}`} />}
      <span className="truncate">{displayLabel}</span>
    </span>
  )
}
