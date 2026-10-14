'use client'

import React, { useState } from 'react'
import { Download, Loader2, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface DownloadButtonWithProgressProps {
  resourceId: string | number
  fileName?: string
  className?: string
  variant?: 'default' | 'outline' | 'ghost' | 'secondary'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  children?: React.ReactNode
}

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return '0 B'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export default function DownloadButtonWithProgress({
  resourceId,
  fileName,
  className = '',
  variant = 'default',
  size = 'default',
  children
}: DownloadButtonWithProgressProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadedBytes, setDownloadedBytes] = useState(0)
  const [totalBytes, setTotalBytes] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isDownloading) return

    setIsDownloading(true)
    setProgress(0)
    setDownloadedBytes(0)
    setTotalBytes(0)
    setError(null)
    setIsDone(false)

    try {
      const response = await fetch(`/api/download/${resourceId}`)
      if (!response.ok) {
        throw new Error(`Download failed with status ${response.status}`)
      }

      // Check content-length for accurate percentage
      const contentLengthHeader = response.headers.get('content-length')
      const total = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0
      setTotalBytes(total)

      // Try extract filename from Content-Disposition header if not provided
      let finalFileName = fileName
      if (!finalFileName) {
        const disposition = response.headers.get('content-disposition')
        if (disposition && disposition.includes('filename=')) {
          const match = disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
          if (match && match[1]) {
            finalFileName = match[1].replace(/['"]/g, '').trim()
          }
        }
      }
      if (!finalFileName) {
        finalFileName = `Prevu_Resource_${resourceId}.pdf`
      }

      const reader = response.body?.getReader()
      if (!reader) {
        // Fallback for environments where ReadableStream is not accessible
        const blob = await response.blob()
        triggerFileSave(blob, finalFileName)
        finishDownload()
        return
      }

      const chunks: Uint8Array[] = []
      let receivedBytes = 0

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        if (value) {
          chunks.push(value)
          receivedBytes += value.length
          setDownloadedBytes(receivedBytes)

          if (total > 0) {
            const pct = Math.min(99, Math.round((receivedBytes / total) * 100))
            setProgress(pct)
          } else {
            // Simulated increment if content-length is missing
            setProgress(prev => Math.min(95, prev + 10))
          }
        }
      }

      // Combine chunks into single Blob
      const completeBlob = new Blob(chunks as BlobPart[], {
        type: response.headers.get('content-type') || 'application/octet-stream'
      })

      triggerFileSave(completeBlob, finalFileName)
      finishDownload()
    } catch (err: unknown) {
      console.error('Stream download error:', err)
      const msg = err instanceof Error ? err.message : 'Download failed'
      setError(msg)
      setIsDownloading(false)
    }
  }

  const triggerFileSave = (blob: Blob, name: string) => {
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = objectUrl
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }

  const finishDownload = () => {
    setProgress(100)
    setIsDownloading(false)
    setIsDone(true)
    setTimeout(() => {
      setIsDone(false)
      setProgress(0)
    }, 2800)
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      variant={variant}
      size={size}
      className={`relative overflow-hidden transition-all duration-200 select-none ${
        isDone
          ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
          : isDownloading
            ? 'cursor-wait border-prevu-accent/50 text-white'
            : ''
      } ${className}`}
      title={error || (isDownloading ? `Downloading (${progress}%)` : 'Download document')}
    >
      {/* Background progress fill overlay during download */}
      {isDownloading && (
        <div
          className="absolute inset-y-0 left-0 bg-prevu-accent/25 transition-all duration-150 ease-out pointer-events-none"
          style={{ width: `${Math.max(5, progress)}%` }}
        />
      )}

      {/* Button content based on current download state */}
      <div className="relative z-10 flex items-center gap-1.5 min-w-0">
        {isDone ? (
          <>
            <Check className="w-4 h-4 text-emerald-300 animate-in zoom-in-75 shrink-0" />
            <span className="font-semibold text-emerald-100">Saved!</span>
          </>
        ) : isDownloading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin text-prevu-accent shrink-0" />
            <span className="font-mono text-xs font-bold text-white">
              {progress > 0 ? `${progress}%` : 'Starting...'}
            </span>
            {totalBytes > 0 && (
              <span className="text-[10px] font-mono text-prevu-text-muted hidden sm:inline">
                ({formatBytes(downloadedBytes)})
              </span>
            )}
          </>
        ) : error ? (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span className="text-red-300 text-xs">Retry</span>
          </>
        ) : (
          children || (
            <>
              <Download className="w-3.5 h-3.5 shrink-0" />
              <span>Download</span>
            </>
          )
        )}
      </div>
    </Button>
  )
}
