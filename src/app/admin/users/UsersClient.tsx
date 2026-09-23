'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  CheckCircle2,
  Ban,
  Eye,
  Calendar,
  Mail,
  GraduationCap
} from 'lucide-react'
import { DataTable, Column } from '@/components/admin/ui/DataTable'
import { StatusBadge } from '@/components/admin/ui/StatusBadge'
import { DetailDrawer } from '@/components/admin/ui/DetailDrawer'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import {
  updateUserRole,
  toggleUserSuspension,
  getUserManagementDetails
} from '../actions'

interface UserItem {
  id: string
  name: string
  username?: string
  email?: string
  student_uid?: string
  branch?: string
  current_semester?: number
  phone_number?: string
  cu_email?: string
  cu_verified?: boolean
  role: string
  status?: string
  created_at: string
}

interface UsersClientProps {
  initialUsers: UserItem[]
  isSuperAdmin: boolean
  currentAdminId: string
}

export default function UsersClient({
  initialUsers,
  isSuperAdmin,
  currentAdminId
}: UsersClientProps) {
  const [users, setUsers] = useState<UserItem[]>(initialUsers)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Drawer state
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [userDetails, setUserDetails] = useState<any | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  // Suspension confirmation
  const [suspendingUser, setSuspendingUser] = useState<UserItem | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Filtered dataset
  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      const term = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !term ||
        u.name?.toLowerCase().includes(term) ||
        u.username?.toLowerCase().includes(term) ||
        u.email?.toLowerCase().includes(term) ||
        u.student_uid?.toLowerCase().includes(term) ||
        u.cu_email?.toLowerCase().includes(term)

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'active' && u.status !== 'suspended') ||
        (statusFilter === 'suspended' && u.status === 'suspended')

      return matchesSearch && matchesRole && matchesStatus
    })
  }, [users, searchQuery, roleFilter, statusFilter])

  // Open user drawer and load detailed contributions
  const handleOpenUserDrawer = async (user: UserItem) => {
    setSelectedUser(user)
    setIsLoadingDetails(true)
    const details = await getUserManagementDetails(user.id)
    setUserDetails(details)
    setIsLoadingDetails(false)
  }

  // Role change
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!confirm(`Change user role to ${newRole.toUpperCase()}?`)) return
    setActionLoading(true)
    const res = await updateUserRole(userId, newRole)
    if (res.success) {
      setUsers(prev => prev.map(u => (u.id === userId ? { ...u, role: newRole } : u)))
      if (selectedUser?.id === userId) {
        setSelectedUser(prev => prev ? { ...prev, role: newRole } : null)
      }
    } else {
      alert(res.error || 'Failed to update role')
    }
    setActionLoading(false)
  }

  // Toggle suspension
  const handleConfirmSuspension = async () => {
    if (!suspendingUser) return
    setActionLoading(true)
    const res = await toggleUserSuspension(suspendingUser.id, suspendingUser.status)
    if (res.success) {
      setUsers(prev =>
        prev.map(u => (u.id === suspendingUser.id ? { ...u, status: res.status } : u))
      )
      if (selectedUser?.id === suspendingUser.id) {
        setSelectedUser(prev => prev ? { ...prev, status: res.status } : null)
      }
    } else {
      alert(res.error || 'Failed to update status')
    }
    setSuspendingUser(null)
    setActionLoading(false)
  }

  const columns: Column<UserItem>[] = [
    {
      key: 'name',
      header: 'Student Name & UID',
      sortable: true,
      render: u => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-300 font-bold text-xs uppercase shrink-0">
            {u.name?.charAt(0) || 'U'}
          </div>
          <div>
            <div className="font-bold text-prevu-text">{u.name || 'Anonymous Student'}</div>
            <div className="text-[11px] font-mono text-prevu-text-muted">
              {u.student_uid ? `${u.student_uid}` : 'No UID listed'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'username',
      header: 'Handle',
      sortable: true,
      render: u => (
        <span className="font-mono text-purple-400 font-medium text-xs">
          @{u.username || 'unassigned'}
        </span>
      )
    },
    {
      key: 'email',
      header: 'Email / Verification',
      render: u => (
        <div className="space-y-0.5">
          <div className="text-xs text-prevu-text-muted font-mono">{u.email || '—'}</div>
          {u.cu_verified ? (
            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
              <CheckCircle2 className="w-3 h-3" /> CU Verified ({u.cu_email})
            </span>
          ) : (
            <span className="text-[10px] text-zinc-500">Unverified CU Email</span>
          )}
        </div>
      )
    },
    {
      key: 'branch',
      header: 'Program & Sem',
      render: u => (
        <span className="text-prevu-text-muted font-mono text-xs">
          {u.branch || 'BE-CSE'} • Sem {u.current_semester || 1}
        </span>
      )
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: u => <StatusBadge status={u.role} />
    },
    {
      key: 'status',
      header: 'Account Status',
      sortable: true,
      render: u => (
        <StatusBadge
          status={u.status === 'suspended' ? 'suspended' : 'active'}
          label={u.status === 'suspended' ? 'Suspended' : 'Active'}
        />
      )
    },
    {
      key: 'actions',
      header: <span className="text-right block">Actions</span>,
      className: 'text-right',
      render: u => (
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleOpenUserDrawer(u)}
            className="h-7 px-2 text-xs text-prevu-text-muted hover:text-prevu-text hover:bg-prevu-surface-light rounded-lg flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Details</span>
          </Button>

          {isSuperAdmin && u.id !== currentAdminId && (
            <button
              onClick={() => setSuspendingUser(u)}
              className={`h-7 px-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                u.status === 'suspended'
                  ? 'text-emerald-400 hover:bg-emerald-500/10'
                  : 'text-red-400 hover:bg-red-500/10'
              }`}
            >
              <Ban className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {u.status === 'suspended' ? 'Activate' : 'Suspend'}
              </span>
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              Student & Staff Accounts
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              {users.length} Users
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Browse registered university students, manage roles (Super Admin, Admin, Moderator, Student), and inspect contributions.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search students by name, handle (@username), UID (e.g. 23BCS), or email..."
              className="w-full pl-10 pr-4 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-purple-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="ALL">All Roles</option>
              <option value="student">Student</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-prevu-bg/90 border border-prevu-surface-light rounded-xl text-xs text-prevu-text focus:outline-none focus:border-purple-500/50 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="active">Active Accounts</option>
              <option value="suspended">Suspended Accounts</option>
            </select>
          </div>
        </div>
      </div>

      {/* DataTable */}
      <DataTable
        data={filteredUsers}
        columns={columns}
        keyExtractor={u => u.id}
        pageSize={15}
        emptyTitle="No accounts found"
        emptyDescription="No student or staff accounts match your current filter query."
      />

      {/* User Detail Slide-out Drawer */}
      <DetailDrawer
        isOpen={!!selectedUser}
        title={selectedUser?.name || 'Student Profile'}
        subtitle={`UID: ${selectedUser?.student_uid || 'Unassigned'} • @${selectedUser?.username || 'user'}`}
        onClose={() => {
          setSelectedUser(null)
          setUserDetails(null)
        }}
        width="md"
        footer={
          selectedUser && isSuperAdmin && selectedUser.id !== currentAdminId && (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs text-prevu-text-muted font-medium">Assign Role:</span>
                <select
                  value={selectedUser.role}
                  onChange={e => handleRoleChange(selectedUser.id, e.target.value)}
                  className="px-2 py-1 bg-prevu-bg border border-prevu-surface-light rounded-lg text-xs text-prevu-text"
                >
                  <option value="student">Student</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setSuspendingUser(selectedUser)}
                className={`text-xs h-8 ${
                  selectedUser.status === 'suspended'
                    ? 'text-emerald-400 border-emerald-500/30'
                    : 'text-red-400 border-red-500/30'
                }`}
              >
                {selectedUser.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
              </Button>
            </div>
          )
        }
      >
        {selectedUser && (
          <div className="space-y-6 text-xs">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-prevu-bg border border-prevu-surface-light space-y-1">
                <div className="text-[10px] text-prevu-text-muted uppercase font-mono">Upload Contributions</div>
                <div className="text-xl font-bold font-mono text-prevu-text">
                  {isLoadingDetails ? '...' : userDetails?.uploadCount ?? 0}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-prevu-bg border border-prevu-surface-light space-y-1">
                <div className="text-[10px] text-prevu-text-muted uppercase font-mono">Saved Bookmarks</div>
                <div className="text-xl font-bold font-mono text-prevu-text">
                  {isLoadingDetails ? '...' : userDetails?.bookmarkCount ?? 0}
                </div>
              </div>
            </div>

            {/* Profile Fields */}
            <div className="p-4 rounded-xl bg-prevu-bg/70 border border-prevu-surface-light space-y-3">
              <h4 className="text-[11px] font-semibold text-prevu-text-muted uppercase tracking-wider">
                Identity & Contact Information
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-prevu-text-muted flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-purple-400" /> Primary Email
                  </span>
                  <span className="font-mono text-prevu-text">{selectedUser.email || '—'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-prevu-text-muted flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> CU Institutional Email
                  </span>
                  <span className="font-mono text-prevu-text">{selectedUser.cu_email || 'Not verified'}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-prevu-text-muted flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-purple-400" /> Branch & Semester
                  </span>
                  <span className="text-prevu-text font-mono">
                    {selectedUser.branch || 'BE-CSE'} • Sem {selectedUser.current_semester || 1}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-prevu-text-muted flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-purple-400" /> Joined Platform
                  </span>
                  <span className="text-prevu-text font-mono">
                    {selectedUser.created_at
                      ? new Date(selectedUser.created_at).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })
                      : '—'}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Uploads by this user */}
            <div className="space-y-3">
              <h4 className="text-[11px] font-semibold text-prevu-text-muted uppercase tracking-wider">
                Uploaded Question Papers ({userDetails?.uploads?.length || 0})
              </h4>

              {isLoadingDetails ? (
                <div className="py-6 text-center text-prevu-text-muted">Loading contributions...</div>
              ) : userDetails?.uploads?.length === 0 ? (
                <div className="p-4 rounded-xl bg-prevu-bg/40 border border-prevu-surface-light text-center text-prevu-text-muted">
                  No question papers uploaded by this account yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {userDetails?.uploads?.map((up: { id: string; exam_year: number; status: string; subjects?: { name?: string; code?: string } | null }) => (
                    <div
                      key={up.id}
                      className="p-3 rounded-xl bg-prevu-bg border border-prevu-surface-light flex items-center justify-between gap-2"
                    >
                      <div>
                        <div className="font-semibold text-prevu-text">{up.subjects?.name || 'Untitled Paper'}</div>
                        <div className="text-[11px] font-mono text-purple-400">
                          {up.subjects?.code} • {up.exam_year}
                        </div>
                      </div>
                      <StatusBadge status={up.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Suspend / Activate Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!suspendingUser}
        title={
          suspendingUser?.status === 'suspended'
            ? 'Reactivate Student Account?'
            : 'Suspend Student Account?'
        }
        description={
          suspendingUser?.status === 'suspended'
            ? `Reactivating @${suspendingUser?.username || 'this user'} will restore their upload, download, and login capabilities.`
            : `Suspending @${suspendingUser?.username || 'this user'} will immediately prevent them from accessing administrative actions or submitting uploads.`
        }
        confirmText={suspendingUser?.status === 'suspended' ? 'Activate Account' : 'Suspend Account'}
        variant={suspendingUser?.status === 'suspended' ? 'primary' : 'danger'}
        isLoading={actionLoading}
        onConfirm={handleConfirmSuspension}
        onCancel={() => setSuspendingUser(null)}
      />
    </div>
  )
}
