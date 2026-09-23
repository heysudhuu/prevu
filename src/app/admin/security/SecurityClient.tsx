'use client'

import React from 'react'
import {
  Shield,
  ShieldCheck,
  KeyRound,
  Lock
} from 'lucide-react'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { StatCard } from '@/components/admin/ui/StatCard'

interface AdminUserRow {
  id: string
  name: string
  email: string
  role: string
  status?: string
  created_at: string
}

interface SecurityClientProps {
  overview: {
    adminUsers?: AdminUserRow[]
    recentAdminActions?: Array<Record<string, unknown>>
    currentAdmin?: { email?: string }
  } | null
}

export default function SecurityClient({ overview }: SecurityClientProps) {
  const adminUsers = overview?.adminUsers || []
  const currentAdmin = overview?.currentAdmin

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
            Security & Access Control Center
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
            RBAC Enabled
          </span>
        </div>
        <p className="text-xs text-prevu-text-muted mt-1">
          Monitor privileged accounts, role-based access privileges, and administrative security events.
        </p>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Active Privileged Roles"
          value={adminUsers.length}
          icon={ShieldCheck}
          badge={{ label: 'Enforced', variant: 'success' }}
          description="Super Admin & Admin accounts"
        />

        <StatCard
          title="Session Verification"
          value="Firebase JWT"
          icon={KeyRound}
          badge={{ label: 'Strict Expiry', variant: 'default' }}
          description="Tokens refreshed every 25 mins"
        />

        <StatCard
          title="Database Guard"
          value="RLS Enforced"
          icon={Lock}
          badge={{ label: 'Server Actions Only', variant: 'success' }}
          description="Mutations isolated to backend"
        />
      </div>

      {/* Privileged Staff Accounts Table */}
      <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-xl space-y-4">
        <div className="p-4 border-b border-prevu-surface-light flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-prevu-text">Authorized Administrative Staff</h3>
            <p className="text-xs text-prevu-text-muted mt-0.5">
              Users possessing elevated permissions to moderate, modify, or archive content.
            </p>
          </div>
          <span className="text-xs font-mono text-prevu-text-muted">
            Current session: <strong className="text-purple-300">{currentAdmin?.email}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
              <tr>
                <th className="p-3.5 font-semibold">Administrator</th>
                <th className="p-3.5 font-semibold">Assigned Role</th>
                <th className="p-3.5 font-semibold">Account Status</th>
                <th className="p-3.5 font-semibold">Registered</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-prevu-surface-light/60 text-prevu-text">
              {adminUsers.map((adm: AdminUserRow) => (
                <tr key={adm.id} className="hover:bg-prevu-surface-light/30 transition-colors">
                  <td className="p-3.5">
                    <div className="font-bold text-prevu-text">{adm.name || 'Admin User'}</div>
                    <div className="text-[11px] font-mono text-prevu-text-muted">{adm.email}</div>
                  </td>
                  <td className="p-3.5">
                    <StatusBadge status={adm.role} />
                  </td>
                  <td className="p-3.5">
                    <StatusBadge
                      status={adm.status === 'suspended' ? 'suspended' : 'active'}
                      label={adm.status === 'suspended' ? 'Suspended' : 'Active'}
                    />
                  </td>
                  <td className="p-3.5 font-mono text-prevu-text-muted">
                    {adm.created_at ? new Date(adm.created_at).toLocaleDateString() : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Policies Overview */}
      <div className="p-5 rounded-2xl bg-prevu-surface/40 border border-prevu-surface-light space-y-3">
        <h4 className="text-xs font-bold text-prevu-text flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          Active Security Policies & Guarantees
        </h4>
        <ul className="text-xs text-prevu-text-muted space-y-1.5 list-disc list-inside">
          <li>All administrative server actions verify the Firebase authentication token with Firebase Admin SDK before DB execution.</li>
          <li>Database mutations run under Supabase Service Role and reject unauthenticated client requests.</li>
          <li>Role changes are restricted strictly to designated Super Admins.</li>
          <li>Dangerous mutations on curriculum subjects with active paper references are blocked by programmatic constraints.</li>
        </ul>
      </div>
    </div>
  )
}
