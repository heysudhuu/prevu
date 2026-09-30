'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { 
  HardDrive, 
  WifiOff, 
  Trash2, 
  Eye, 
  Search, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  ArrowLeft,
  Moon,
  Sun,
  X,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react'
import { 
  getOfflineVaultPapers, 
  removePaperFromOfflineVault, 
  clearOfflineVault, 
  getOfflinePdfBlobUrl, 
  getVaultStorageStats,
  OfflinePaper 
} from '@/lib/offline/vault'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export default function OfflineVaultView() {
  const [papers, setPapers] = useState<OfflinePaper[]>([])
  const [stats, setStats] = useState({ count: 0, bytes: 0, formatted: '0 KB' })
  const [search, setSearch] = useState('')
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null)
  const [activePaper, setActivePaper] = useState<OfflinePaper | null>(null)
  const [pdfTheme, setPdfTheme] = useState<'default' | 'dark' | 'amoled'>('default')
  const [isOnline, setIsOnline] = useState(true)

  const loadVault = () => {
    const list = getOfflineVaultPapers()
    setPapers(list)
    setStats(getVaultStorageStats())
  }

  useEffect(() => {
    loadVault()
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine)
      const onStatus = () => setIsOnline(navigator.onLine)
      window.addEventListener('online', onStatus)
      window.addEventListener('offline', onStatus)
      window.addEventListener('prevu-offline-vault-changed', loadVault)
      return () => {
        window.removeEventListener('online', onStatus)
        window.removeEventListener('offline', onStatus)
        window.removeEventListener('prevu-offline-vault-changed', loadVault)
      }
    }
  }, [])

  const handleOpenOffline = async (paper: OfflinePaper) => {
    const blobUrl = await getOfflinePdfBlobUrl(paper.id)
    if (blobUrl) {
      setActivePdfUrl(blobUrl)
      setActivePaper(paper)
    } else {
      // Fallback to preview API if online
      setActivePdfUrl(`/api/preview/${paper.id}#toolbar=0`)
      setActivePaper(paper)
    }
  }

  const handleRemove = async (paperId: string) => {
    await removePaperFromOfflineVault(paperId)
    loadVault()
  }

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to clear all offline saved papers from your device?')) {
      await clearOfflineVault()
      loadVault()
    }
  }

  const filtered = papers.filter(p => {
    const q = search.toLowerCase()
    return (
      p.subjectName.toLowerCase().includes(q) ||
      p.subjectCode.toLowerCase().includes(q) ||
      p.examType.toLowerCase().includes(q) ||
      String(p.examYear).includes(q) ||
      `sem ${p.semester}`.includes(q)
    )
  })

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-8 animate-fade-in">
      
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-prevu-surface-light pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link href="/browse" className="text-xs text-prevu-text-muted hover:text-white flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Archive
            </Link>
            <span className="text-xs text-prevu-text-muted">/</span>
            <span className="text-xs text-cyan-400 font-semibold">Offline Vault</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <HardDrive className="w-7 h-7 text-cyan-400" />
            <span>Prevu Offline Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-prevu-text-muted max-w-xl">
            Papers saved to your device for instant offline access inside exam halls, basements, and university laboratories with zero internet connection.
          </p>
        </div>

        {/* Connectivity Status & Vault Stats Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={`px-3 py-1.5 rounded-2xl text-xs font-bold border flex items-center gap-1.5 ${
            isOnline 
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30' 
              : 'bg-amber-950/60 text-amber-300 border-amber-500/30 animate-pulse'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{isOnline ? 'Online' : 'Offline Mode'}</span>
          </div>

          <div className="px-3.5 py-1.5 rounded-2xl bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-bold">
            {stats.count} papers • {stats.formatted}
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Clear All */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-prevu-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search saved papers by subject, code, or year..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-prevu-surface/80 border border-prevu-surface-light rounded-2xl text-white placeholder-prevu-text-muted focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Clear All Action */}
        {papers.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="text-xs border-red-500/30 text-red-300 hover:bg-red-500/10 hover:border-red-500/50 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear Offline Vault
          </Button>
        )}
      </div>

      {/* Offline Papers Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((paper) => {
            const sizeStr = paper.fileSize 
              ? `${(paper.fileSize / (1024 * 1024)).toFixed(1)} MB` 
              : 'Cached'

            return (
              <div
                key={paper.id}
                className="p-5 rounded-3xl bg-gradient-to-b from-prevu-surface to-prevu-surface/90 border border-prevu-surface-light hover:border-cyan-500/40 transition-all duration-200 shadow-xl flex flex-col justify-between group space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 uppercase">
                      Sem {paper.semester} • {paper.examType}
                    </span>

                    <span className="text-[11px] font-mono text-prevu-text-muted">
                      {paper.examYear}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {paper.subjectName}
                    </h3>
                    <div className="text-xs font-mono text-prevu-text-muted mt-0.5">
                      {paper.subjectCode}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-prevu-surface-light flex items-center justify-between gap-2">
                  <span className="text-[11px] font-mono text-prevu-text-muted">
                    {sizeStr}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Button
                      size="sm"
                      onClick={() => handleOpenOffline(paper)}
                      className="text-xs font-bold bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/20 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1" />
                      Open Paper
                    </Button>

                    <button
                      onClick={() => handleRemove(paper.id)}
                      className="p-2 text-prevu-text-muted hover:text-red-400 rounded-xl hover:bg-red-500/10 transition-colors cursor-pointer"
                      title="Remove from offline vault"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-prevu-surface/30 rounded-3xl border border-prevu-surface-light space-y-4 max-w-xl mx-auto p-6">
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mx-auto">
            <WifiOff className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-bold text-white">Your Offline Vault is Empty</h3>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              When viewing question papers online, click the <strong className="text-cyan-300">&quot;Save for Offline&quot;</strong> button. The paper will be downloaded and stored locally on your device so you can study anytime, even without internet.
            </p>
          </div>

          <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-500">
            <Link href="/browse">
              Browse Question Papers Archive
            </Link>
          </Button>
        </div>
      )}

      {/* Embedded Offline PDF Reader Modal with Dark / AMOLED Mode */}
      {activePdfUrl && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex flex-col p-2 sm:p-4 animate-fade-in">
          
          {/* Reader Topbar */}
          <div className="h-14 px-4 rounded-2xl bg-[#11111a] border border-prevu-surface-light flex items-center justify-between gap-3 shrink-0 mb-2">
            <div className="flex items-center gap-2.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-sm font-bold text-white truncate">
                {activePaper?.subjectName} — {activePaper?.examType} {activePaper?.examYear}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hidden sm:inline-block">
                OFFLINE VAULT
              </span>
            </div>

            {/* Reading Modes (Default / Dark / AMOLED) */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-prevu-surface border border-prevu-surface-light rounded-xl p-0.5 text-xs">
                <button
                  onClick={() => setPdfTheme('default')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    pdfTheme === 'default' ? 'bg-purple-600 text-white shadow' : 'text-prevu-text-muted hover:text-white'
                  }`}
                  title="Default white paper view"
                >
                  <Sun className="w-3.5 h-3.5 inline mr-1" />
                  <span className="hidden sm:inline">Normal</span>
                </button>

                <button
                  onClick={() => setPdfTheme('dark')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    pdfTheme === 'dark' ? 'bg-purple-600 text-white shadow' : 'text-prevu-text-muted hover:text-white'
                  }`}
                  title="Inverted dark reading mode"
                >
                  <Moon className="w-3.5 h-3.5 inline mr-1" />
                  <span className="hidden sm:inline">Dark</span>
                </button>

                <button
                  onClick={() => setPdfTheme('amoled')}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                    pdfTheme === 'amoled' ? 'bg-black text-cyan-400 border border-cyan-500/40 shadow' : 'text-prevu-text-muted hover:text-white'
                  }`}
                  title="Pitch black AMOLED high contrast"
                >
                  <span className="font-mono text-[10px] font-bold">AMOLED</span>
                </button>
              </div>

              <button
                onClick={() => {
                  if (activePdfUrl.startsWith('blob:')) {
                    URL.revokeObjectURL(activePdfUrl)
                  }
                  setActivePdfUrl(null)
                  setActivePaper(null)
                }}
                className="p-2 text-prevu-text-muted hover:text-white hover:bg-prevu-surface-light rounded-xl transition-colors cursor-pointer"
                title="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Iframe Reader Body */}
          <div className={`flex-1 rounded-2xl border border-prevu-surface-light overflow-hidden transition-colors ${
            pdfTheme === 'amoled' ? 'bg-black' : pdfTheme === 'dark' ? 'bg-[#121218]' : 'bg-[#1e1e26]'
          }`}>
            <iframe
              src={activePdfUrl}
              className="w-full h-full border-none transition-all duration-300"
              style={{
                filter: 
                  pdfTheme === 'amoled' 
                    ? 'invert(0.95) hue-rotate(180deg) contrast(1.2) brightness(0.95)' 
                    : pdfTheme === 'dark' 
                    ? 'invert(0.92) hue-rotate(180deg) contrast(1.1)' 
                    : 'none'
              }}
              title={activePaper?.subjectName || 'Offline Paper'}
            />
          </div>

        </div>
      )}

    </div>
  )
}
