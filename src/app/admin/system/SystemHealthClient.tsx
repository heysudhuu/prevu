'use client'

import React, { useState } from 'react'
import {
  Database,
  HardDrive,
  KeyRound,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { runSystemDiagnostics, DiagnosticsData } from '../actions'

interface SystemHealthClientProps {
  initialDiagnostics: DiagnosticsData | null
}

export default function SystemHealthClient({
  initialDiagnostics
}: SystemHealthClientProps) {
  const [diagnostics, setDiagnostics] = useState<DiagnosticsData | null>(initialDiagnostics)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    const data = await runSystemDiagnostics()
    if (data) setDiagnostics(data)
    setIsRefreshing(false)
  }

  const getStatusIcon = (status: 'operational' | 'warning' | 'error') => {
    switch (status) {
      case 'operational':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400 shrink-0" />
    }
  }

  const getStatusBadge = (status: 'operational' | 'warning' | 'error') => {
    switch (status) {
      case 'operational':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
            Operational
          </span>
        )
      case 'warning':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/25">
            Degraded
          </span>
        )
      case 'error':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/25">
            Error
          </span>
        )
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              System Health & Diagnostics
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Live Ping
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Real-time latency and connectivity diagnostics for core database, storage, and authentication services.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>{isRefreshing ? 'Testing Connections...' : 'Run Diagnostics Now'}</span>
        </Button>
      </div>

      {/* Diagnostics Grid */}
      <div className="space-y-3">
        {diagnostics?.services.map(service => {
          const getServiceIcon = () => {
            if (service.name.includes('Database')) return Database
            if (service.name.includes('Storage')) return HardDrive
            if (service.name.includes('Auth')) return KeyRound
            return Server
          }
          const ServiceIcon = getServiceIcon()

          return (
            <div
              key={service.name}
              className="p-5 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-prevu-bg border border-prevu-surface-light flex items-center justify-center shrink-0">
                  <ServiceIcon className="w-5 h-5 text-purple-400" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-prevu-text">{service.name}</h3>
                    {getStatusIcon(service.status)}
                  </div>
                  <p className="text-xs text-prevu-text-muted">{service.message}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 sm:border-l sm:border-prevu-surface-light sm:pl-6">
                <div className="text-left sm:text-right">
                  <div className="text-[10px] uppercase font-mono text-prevu-text-muted">Round-trip</div>
                  <div className="text-base font-bold font-mono text-prevu-text">
                    {service.latencyMs} ms
                  </div>
                </div>

                {getStatusBadge(service.status)}
              </div>
            </div>
          )
        })}
      </div>

      {/* Diagnostic Metadata Footer */}
      <div className="p-4 rounded-2xl bg-prevu-surface/40 border border-prevu-surface-light flex items-center justify-between text-xs text-prevu-text-muted">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span>
            Last diagnostic run:{' '}
            {diagnostics?.timestamp
              ? new Date(diagnostics.timestamp).toLocaleTimeString()
              : 'Just now'}
          </span>
        </div>

        <span className="font-mono text-[11px] text-prevu-text-muted">
          Prevu Engine • Next.js 16 App Router
        </span>
      </div>
    </div>
  )
}
