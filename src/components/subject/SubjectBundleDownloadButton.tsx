'use client'

import React, { useState } from 'react'
import JSZip from 'jszip'
import { Package, Download, CheckCircle, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ResourceItem {
  id: string
  original_filename: string
  exam_year: number
  exam_types?: { name?: string }
}

interface SubjectBundleDownloadButtonProps {
  subjectName: string
  subjectCode: string
  resources: ResourceItem[]
  className?: string
}

export default function SubjectBundleDownloadButton({
  subjectName,
  subjectCode,
  resources,
  className = ''
}: SubjectBundleDownloadButtonProps) {
  const [isBundling, setIsBundling] = useState(false)
  const [progress, setProgress] = useState<string>('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDownloadBundle = async () => {
    if (!resources || resources.length === 0) return
    setIsBundling(true)
    setError(null)
    setIsSuccess(false)

    try {
      const zip = new JSZip()
      const total = resources.length

      // Organize into clean folders inside ZIP
      const rootFolder = zip.folder(`${subjectCode}_${subjectName.replace(/[^a-zA-Z0-9_-]/g, '_')}_Prep_Kit`)

      for (let i = 0; i < resources.length; i++) {
        const item = resources[i]
        const typeName = (item.exam_types?.name || 'Resource').toUpperCase()
        
        setProgress(`Fetching ${i + 1}/${total}: ${item.original_filename.slice(0, 20)}...`)

        // Determine subfolder based on exam type
        let subfolder = 'Past_Papers'
        if (typeName.includes('MST1')) subfolder = 'MST1_Papers'
        else if (typeName.includes('MST2')) subfolder = 'MST2_Papers'
        else if (typeName.includes('EST')) subfolder = 'EST_Papers'
        else if (typeName.includes('NOTE')) subfolder = 'Lecture_Notes'
        else if (typeName.includes('SYLLAB')) subfolder = 'Syllabus_Guides'
        else if (typeName.includes('ASSIGN')) subfolder = 'Assignments'
        else if (typeName.includes('LAB')) subfolder = 'Lab_Manuals'

        try {
          const res = await fetch(`/api/download/${item.id}`)
          if (!res.ok) throw new Error(`Failed to fetch file: ${res.statusText}`)
          const blob = await res.blob()

          const cleanFileName = `${item.exam_year}_${typeName}_${item.original_filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`
          rootFolder?.folder(subfolder)?.file(cleanFileName, blob)
        } catch (fetchErr) {
          console.warn(`Could not download file ${item.id}, continuing bundle:`, fetchErr)
        }
      }

      setProgress('Compressing Prep Bundle...')
      const content = await zip.generateAsync({ type: 'blob' })

      // Trigger browser download
      const url = URL.createObjectURL(content)
      const link = document.createElement('a')
      link.href = url
      link.download = `Prevu_${subjectCode}_${subjectName.replace(/\s+/g, '_')}_Complete_Prep_Kit.zip`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 4000)
    } catch (err: unknown) {
      console.error('Bundle creation failed:', err)
      const msg = err instanceof Error ? err.message : 'Failed to generate prep bundle.'
      setError(msg)
    } finally {
      setIsBundling(false)
      setProgress('')
    }
  }

  if (resources.length === 0) return null

  return (
    <div className="relative inline-block">
      <Button
        onClick={handleDownloadBundle}
        disabled={isBundling}
        className={`bg-gradient-to-r from-purple-600 via-indigo-600 to-prevu-accent hover:from-purple-500 hover:to-prevu-accent-light text-white font-bold shadow-lg shadow-purple-600/30 transition-all ${className}`}
      >
        {isBundling ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-200" />
            <span className="truncate max-w-[200px] text-xs">
              {progress || 'Building ZIP...'}
            </span>
          </>
        ) : isSuccess ? (
          <>
            <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
            <span>Bundle Downloaded! 🎉</span>
          </>
        ) : (
          <>
            <Package className="w-4 h-4 mr-2 text-purple-200" />
            <span>Download All ({resources.length} Files ZIP)</span>
          </>
        )}
      </Button>

      {error && (
        <div className="absolute top-full left-0 mt-2 p-2 bg-red-950/90 border border-red-500/40 rounded-xl text-[11px] text-red-300 flex items-center gap-1.5 z-20 whitespace-nowrap shadow-xl">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
