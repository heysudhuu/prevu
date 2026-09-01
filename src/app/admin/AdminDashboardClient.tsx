'use client'

import { useState } from 'react'
import { PendingResourceCard } from '@/components/admin/PendingResourceCard'
import { deleteResource } from '@/app/admin/actions'
import { Button } from '@/components/ui/Button'
import { 
  Inbox, 
  Database, 
  Users, 
  Lightbulb, 
  Upload, 
  Search, 
  Trash2, 
  ShieldCheck, 
  Eye, 
  CheckCircle2,
  FileCheck,
  Compass
} from 'lucide-react'
import Link from 'next/link'

interface AdminDashboardClientProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stats: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pendingResources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  approvedResources: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  users: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  subjects: any[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  suggestions?: any[]
}

type AdminTab = 'pending' | 'archive' | 'students' | 'suggestions'

export default function AdminDashboardClient({
  stats,
  pendingResources,
  approvedResources,
  users,
  suggestions = []
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('pending')
  const [searchQuery, setSearchQuery] = useState('')
  const [examTypeFilter, setExamTypeFilter] = useState<string>('ALL')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const pendingCount = stats?.pendingCount ?? pendingResources.length
  const approvedCount = stats?.approvedCount ?? approvedResources.length
  const usersCount = stats?.usersCount ?? users.length

  const handleDeleteResource = async (id: string, filePath: string) => {
    if (!confirm('Are you sure you want to permanently delete this question paper?')) return
    setDeletingId(id)
    await deleteResource(id, filePath)
    setDeletingId(null)
  }

  // Filter approved resources
  const filteredApproved = approvedResources.filter(r => {
    const term = searchQuery.toLowerCase()
    const matchesSearch = 
      r.subjects?.name?.toLowerCase().includes(term) ||
      r.subjects?.code?.toLowerCase().includes(term) ||
      r.users?.name?.toLowerCase().includes(term) ||
      r.users?.username?.toLowerCase().includes(term) ||
      r.exam_types?.name?.toLowerCase().includes(term) ||
      String(r.exam_year || '').includes(term)

    const matchesType = examTypeFilter === 'ALL' || r.exam_types?.name === examTypeFilter
    return matchesSearch && matchesType
  })

  // Filter students
  const filteredUsers = users.filter(u => {
    const term = searchQuery.toLowerCase()
    return (
      u.name?.toLowerCase().includes(term) ||
      u.username?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.student_uid?.toLowerCase().includes(term) ||
      u.cu_email?.toLowerCase().includes(term)
    )
  })

  return (
    <div className="min-h-screen bg-prevu-bg text-prevu-text pb-24">
      
      {/* ============================================================ */}
      {/* MODERN GLASS TOP COMMAND BAR */}
      {/* ============================================================ */}
      <div className="border-b border-prevu-surface-light bg-prevu-surface/80 backdrop-blur-xl sticky top-0 z-40 shadow-xl">
        <div className="container mx-auto px-4 max-w-7xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4">
            
            {/* Brand Title & Status */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center font-bold text-white text-base shadow-lg shadow-purple-600/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-extrabold text-prevu-text tracking-tight">
                    Admin Command Studio
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase">
                    👑 Super Admin
                  </span>
                </div>
                <div className="text-xs text-prevu-text-muted font-mono flex items-center gap-2 mt-0.5">
                  <span>py7716496@gmail.com</span>
                  <span>•</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Verified Online
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Button size="sm" className="h-9 px-4 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-md shadow-purple-600/20 flex items-center gap-1.5" asChild>
                <Link href="/upload">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Paper as Prevu</span>
                </Link>
              </Button>

              <Button size="sm" variant="outline" className="h-9 px-3.5 text-xs font-semibold border-prevu-surface-light text-prevu-text hover:text-white rounded-xl flex items-center gap-1.5 bg-prevu-surface" asChild>
                <Link href="/dashboard">
                  <Compass className="w-3.5 h-3.5 text-prevu-accent" />
                  <span>Switch to Student View</span>
                </Link>
              </Button>
            </div>

          </div>

          {/* Segmented Navigation Tab Switcher */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-1">
            
            <button
              onClick={() => { setActiveTab('pending'); setSearchQuery('') }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'pending'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              <Inbox className="w-3.5 h-3.5" />
              <span>Review Queue</span>
              {pendingCount > 0 ? (
                <span className="px-2 py-0.2 rounded-full text-[10px] font-mono font-bold bg-amber-400 text-black animate-pulse">
                  {pendingCount}
                </span>
              ) : (
                <span className="text-[10px] font-mono opacity-60">0</span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('archive'); setSearchQuery('') }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'archive'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Question Papers ({approvedCount})</span>
            </button>

            <button
              onClick={() => { setActiveTab('students'); setSearchQuery('') }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'students'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              <span>Student Accounts ({usersCount})</span>
            </button>

            <button
              onClick={() => { setActiveTab('suggestions'); setSearchQuery('') }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'suggestions'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Student Ideas ({suggestions.length})</span>
            </button>

          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN STUDIO WORKSPACE */}
      {/* ============================================================ */}
      <div className="container mx-auto px-4 max-w-7xl pt-8 space-y-6">
        
        {/* ============================================================ */}
        {/* 4 EXECUTIVE KPI METRICS TILES */}
        {/* ============================================================ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div 
            onClick={() => setActiveTab('pending')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-purple-950/20 border-purple-500/50 shadow-xl shadow-purple-950/30'
                : 'bg-prevu-surface/80 border-prevu-surface-light hover:border-prevu-surface-light/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-prevu-text-muted mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Review Queue</span>
              <Inbox className={`w-4 h-4 ${pendingCount > 0 ? 'text-amber-400' : 'text-prevu-text-muted'}`} />
            </div>
            <div className="text-3xl font-extrabold font-mono text-prevu-text mt-1 flex items-baseline gap-2">
              <span>{pendingCount}</span>
              <span className={`text-[10px] font-sans font-bold px-2 py-0.5 rounded-full ${
                pendingCount > 0 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {pendingCount > 0 ? 'Action Needed' : 'All Clear'}
              </span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('archive')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'archive'
                ? 'bg-purple-950/20 border-purple-500/50 shadow-xl shadow-purple-950/30'
                : 'bg-prevu-surface/80 border-prevu-surface-light hover:border-prevu-surface-light/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-prevu-text-muted mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Live Archive</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-prevu-text mt-1 flex items-baseline gap-2">
              <span>{approvedCount}</span>
              <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                100% Live
              </span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('students')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'students'
                ? 'bg-purple-950/20 border-purple-500/50 shadow-xl shadow-purple-950/30'
                : 'bg-prevu-surface/80 border-prevu-surface-light hover:border-prevu-surface-light/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-prevu-text-muted mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Students Directory</span>
              <Users className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-prevu-text mt-1 flex items-baseline gap-2">
              <span>{usersCount}</span>
              <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300">
                BE-CSE
              </span>
            </div>
          </div>

          <div 
            onClick={() => setActiveTab('suggestions')}
            className={`p-5 rounded-2xl border transition-all cursor-pointer ${
              activeTab === 'suggestions'
                ? 'bg-purple-950/20 border-purple-500/50 shadow-xl shadow-purple-950/30'
                : 'bg-prevu-surface/80 border-prevu-surface-light hover:border-prevu-surface-light/80'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-prevu-text-muted mb-1">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Student Feedback</span>
              <Lightbulb className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold font-mono text-prevu-text mt-1 flex items-baseline gap-2">
              <span>{suggestions.length}</span>
              <span className="text-[10px] font-sans font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                Inbox
              </span>
            </div>
          </div>

        </div>

        {/* ------------------------------------------------------------ */}
        {/* TAB 1: PENDING QUEUE */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'pending' && (
          <div className="space-y-6">
            
            {pendingResources.length === 0 ? (
              <div className="space-y-6">
                
                {/* System All Clear Banner */}
                <div className="rounded-3xl border border-prevu-surface-light bg-gradient-to-r from-prevu-surface via-prevu-surface/90 to-prevu-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-2xl shrink-0">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-prevu-text">Review Queue is 100% Up to Date</h3>
                      <p className="text-xs text-prevu-text-muted mt-1 max-w-lg">
                        All student submissions have been approved and published to the live archive. New uploads will appear here in real time.
                      </p>
                    </div>
                  </div>

                  <Button size="sm" className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/25 shrink-0" asChild>
                    <Link href="/upload">
                      <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Verified Paper
                    </Link>
                  </Button>
                </div>

                {/* Recently Approved Live Papers */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-prevu-text-muted">
                    <span className="font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5 text-prevu-text">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Recently Verified Papers ({approvedResources.slice(0, 5).length})
                    </span>
                    <button 
                      onClick={() => setActiveTab('archive')} 
                      className="text-prevu-accent hover:underline font-semibold"
                    >
                      View Full Live Repository →
                    </button>
                  </div>

                  <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-lg">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
                        <tr>
                          <th className="p-3.5 font-semibold">Subject</th>
                          <th className="p-3.5 font-semibold">Pattern</th>
                          <th className="p-3.5 font-semibold">Year & Sem</th>
                          <th className="p-3.5 font-semibold">Uploaded By</th>
                          <th className="p-3.5 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-prevu-surface-light/60 text-prevu-text">
                        {approvedResources.slice(0, 5).map((r) => (
                          <tr key={r.id} className="hover:bg-prevu-surface-light/30 transition-colors">
                            <td className="p-3.5">
                              <div className="font-bold text-prevu-text">{r.subjects?.name}</div>
                              <div className="text-[11px] font-mono text-prevu-accent">{r.subjects?.code}</div>
                            </td>
                            <td className="p-3.5 font-mono">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30">
                                {r.exam_types?.name}
                              </span>
                            </td>
                            <td className="p-3.5 font-mono text-prevu-text-muted">
                              {r.exam_year} • Sem {r.subjects?.semester}
                            </td>
                            <td className="p-3.5 text-prevu-text-muted truncate max-w-[130px]">
                              @{r.users?.username || r.users?.name || 'student'}
                            </td>
                            <td className="p-3.5 text-right space-x-2">
                              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-prevu-text-muted hover:text-prevu-text" asChild>
                                <a href={`/api/preview/${r.id}`} target="_blank" rel="noopener noreferrer">
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {pendingResources.map((resource) => (
                  <PendingResourceCard key={resource.id} resource={resource} />
                ))}
              </div>
            )}

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 2: LIVE REPOSITORY */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'archive' && (
          <div className="space-y-4">
            
            {/* Search & Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Filter by subject name, course code (e.g. 23CST), uploader, or year..."
                  className="w-full pl-10 pr-4 py-2.5 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-prevu-accent"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {['ALL', 'MST1', 'MST2', 'EST'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setExamTypeFilter(type)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      examTypeFilter === type
                        ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                        : 'bg-prevu-surface border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
                    }`}
                  >
                    {type === 'ALL' ? 'All Formats' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Data Grid Table */}
            <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
                    <tr>
                      <th className="p-3.5 font-semibold">Subject & Code</th>
                      <th className="p-3.5 font-semibold">Pattern</th>
                      <th className="p-3.5 font-semibold">Year & Sem</th>
                      <th className="p-3.5 font-semibold">Uploader</th>
                      <th className="p-3.5 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-prevu-surface-light/60 text-prevu-text">
                    {filteredApproved.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-prevu-text-muted">
                          No papers found matching your query.
                        </td>
                      </tr>
                    ) : (
                      filteredApproved.map((r) => (
                        <tr key={r.id} className="hover:bg-prevu-surface-light/30 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-prevu-text">{r.subjects?.name}</div>
                            <div className="text-[11px] font-mono text-purple-400">{r.subjects?.code}</div>
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30">
                              {r.exam_types?.name}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-prevu-text-muted">
                            {r.exam_year} • Sem {r.subjects?.semester}
                          </td>
                          <td className="p-3.5 text-prevu-text-muted truncate max-w-[130px]">
                            @{r.users?.username || r.users?.name || 'student'}
                          </td>
                          <td className="p-3.5 text-right space-x-2">
                            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs text-prevu-text-muted hover:text-prevu-text" asChild>
                              <a href={`/api/preview/${r.id}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="w-3.5 h-3.5" />
                              </a>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              disabled={deletingId === r.id}
                              onClick={() => handleDeleteResource(r.id, r.file_path)}
                              className="h-7 px-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 3: STUDENTS DIRECTORY */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'students' && (
          <div className="space-y-4">
            
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-prevu-text-muted" />
              <input 
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search students by name, handle, UID (e.g. 23BCS), or email..."
                className="w-full pl-10 pr-4 py-2.5 bg-prevu-surface border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-prevu-accent"
              />
            </div>

            <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
                    <tr>
                      <th className="p-3.5 font-semibold">Student Name & Email</th>
                      <th className="p-3.5 font-semibold">Handle</th>
                      <th className="p-3.5 font-semibold">UID</th>
                      <th className="p-3.5 font-semibold">Branch & Sem</th>
                      <th className="p-3.5 font-semibold">Role / Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-prevu-surface-light/60 text-prevu-text">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center py-12 text-prevu-text-muted">
                          No student accounts found matching query.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-prevu-surface-light/30 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold text-prevu-text">{u.name || 'Student'}</div>
                            {u.email && <div className="text-[11px] font-mono text-prevu-text-muted">{u.email}</div>}
                          </td>
                          <td className="p-3.5 font-mono text-purple-400">
                            @{u.username || 'user'}
                          </td>
                          <td className="p-3.5 font-mono text-prevu-text-muted">
                            {u.student_uid || '—'}
                          </td>
                          <td className="p-3.5 text-prevu-text-muted">
                            {u.branch || 'BE-CSE'} • Sem {u.current_semester || 1}
                          </td>
                          <td className="p-3.5">
                            {u.role === 'admin' ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                                👑 Admin
                              </span>
                            ) : u.cu_verified ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                                ✓ Verified CU
                              </span>
                            ) : (
                              <span className="text-[10px] text-prevu-text-muted">
                                Active Student
                              </span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ------------------------------------------------------------ */}
        {/* TAB 4: IDEAS & FEEDBACK */}
        {/* ------------------------------------------------------------ */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            
            {suggestions.length === 0 ? (
              <div className="text-center py-16 border border-prevu-surface-light bg-prevu-surface/30 rounded-3xl p-8 space-y-3 max-w-md mx-auto shadow-xl">
                <div className="w-12 h-12 rounded-2xl bg-prevu-surface flex items-center justify-center mx-auto text-amber-400 border border-prevu-surface-light">
                  <Lightbulb className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-prevu-text">No suggestions submitted yet</h3>
                <p className="text-xs text-prevu-text-muted leading-relaxed">
                  Submissions from the welcome page idea box will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestions.map((s) => {
                  const dateFormatted = s.created_at ? new Date(s.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Recently'

                  return (
                    <div 
                      key={s.id} 
                      className="p-5 rounded-2xl border border-prevu-surface-light bg-prevu-surface/80 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-3 shadow-lg"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-amber-500/15 text-amber-300 border border-amber-500/30">
                            {s.category || 'idea'}
                          </span>
                          <span className="text-[11px] font-mono text-prevu-text-muted">
                            {dateFormatted}
                          </span>
                        </div>

                        <h3 className="text-sm font-bold text-prevu-text">
                          {s.title}
                        </h3>

                        <p className="text-xs text-prevu-text-muted leading-relaxed whitespace-pre-wrap">
                          {s.message}
                        </p>
                      </div>

                      <div className="pt-2.5 border-t border-prevu-surface-light flex items-center justify-between text-[11px] text-prevu-text-muted">
                        <span className="font-medium text-prevu-text">👤 {s.name || 'Anonymous'}</span>
                        {s.email && (
                          <span className="font-mono text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                            {s.email}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
