'use client'

import { useState, useRef } from 'react'
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Trash2, 
  Sparkles, 
  Archive,
  Layers,
  ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { checkDuplicatePaper, ExistingPaperRecord } from '@/lib/admin/duplicateDetection'

export interface ParsedBulkItem {
  id: string
  fileName: string
  fileSize: number
  subjectName: string
  subjectCode: string
  examType: 'MST1' | 'MST2' | 'EST'
  examYear: number
  semester: number
  isDuplicate: boolean
  duplicateReason?: string
  status: 'pending' | 'imported' | 'skipped'
}

interface BulkPaperImportModalProps {
  isOpen: boolean
  onClose: () => void
  existingPapers?: ExistingPaperRecord[]
  onImportComplete?: (count: number) => void
}

export default function BulkPaperImportModal({
  isOpen,
  onClose,
  existingPapers = [],
  onImportComplete
}: BulkPaperImportModalProps) {
  const [items, setItems] = useState<ParsedBulkItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!isOpen) return null

  // Filename metadata parser
  const parseFilename = (fileName: string, fileSize: number): ParsedBulkItem => {
    const cleanName = fileName.replace(/\.pdf$/i, '').replace(/\.zip$/i, '')
    
    // 1. Detect Year (2018 - 2026)
    const yearMatch = cleanName.match(/(201[8-9]|202[0-6])/)
    const examYear = yearMatch ? parseInt(yearMatch[1], 10) : 2024

    // 2. Detect Exam Type
    let examType: 'MST1' | 'MST2' | 'EST' = 'MST1'
    if (/mst[-_ ]?2/i.test(cleanName)) examType = 'MST2'
    else if (/mst[-_ ]?1/i.test(cleanName)) examType = 'MST1'
    else if (/est|end[-_ ]?sem/i.test(cleanName)) examType = 'EST'

    // 3. Detect Semester (1 - 8)
    let semester = 4
    const semMatch = cleanName.match(/sem(?:ester)?[-_ ]?([1-8])/i)
    if (semMatch) {
      semester = parseInt(semMatch[1], 10)
    } else {
      const codeMatch = cleanName.match(/[0-9]{2}[A-Z]{3}-([1-8])[0-9]{2}/i)
      if (codeMatch) semester = parseInt(codeMatch[1], 10)
    }

    // 4. Detect Subject Code / Name
    let subjectCode = ''
    let subjectName = ''
    const codeExt = cleanName.match(/([0-9]{2}[A-Z]{3,4}-[0-9]{3})/i)
    if (codeExt) {
      subjectCode = codeExt[1].toUpperCase()
      subjectName = subjectCode
    }

    if (!subjectName) {
      // Remove year, exam type, sem tokens to isolate subject name
      const stripped = cleanName
        .replace(/(201[8-9]|202[0-6])/g, '')
        .replace(/mst[-_ ]?[12]|est|end[-_ ]?sem/gi, '')
        .replace(/sem(?:ester)?[-_ ]?[1-8]/gi, '')
        .replace(/[_-]+/g, ' ')
        .trim()
      subjectName = stripped.length > 2 ? stripped : 'Computer Science Subject'
    }

    // Run Duplicate Check
    const dupCheck = checkDuplicatePaper(
      {
        subjectName,
        subjectCode,
        examType,
        examYear,
        semester,
        fileName,
        fileSize
      },
      existingPapers
    )

    return {
      id: Math.random().toString(36).substring(7),
      fileName,
      fileSize,
      subjectName,
      subjectCode,
      examType,
      examYear,
      semester,
      isDuplicate: dupCheck.isDuplicate,
      duplicateReason: dupCheck.reason,
      status: 'pending'
    }
  }

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const fileList = Array.from(e.target.files)
    const parsedList: ParsedBulkItem[] = fileList.map(f => parseFilename(f.name, f.size))
    setItems(prev => [...prev, ...parsedList])
  }

  const handleLoadSampleBatch = () => {
    const sampleFiles = [
      { name: '21CSH-202_Operating_Systems_MST1_2024.pdf', size: 1042000 },
      { name: 'Database_Management_Systems_EST_2023_Sem4.pdf', size: 1450000 },
      { name: '21CSH-205_Computer_Networks_MST2_2024.pdf', size: 980000 },
      { name: 'Cloud_Computing_MST1_2025_Sem5.pdf', size: 850000 },
      { name: '21CSH-202_Operating_Systems_MST1_2024.pdf', size: 1042000 } // Intentional duplicate
    ]
    const parsed = sampleFiles.map(s => parseFilename(s.name, s.size))
    setItems(parsed)
  }

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleUpdateItem = (id: string, updates: Partial<ParsedBulkItem>) => {
    setItems(prev => prev.map(i => (i.id === id ? { ...i, ...updates } : i)))
  }

  const handleBatchImport = async () => {
    const validItems = items.filter(i => !i.isDuplicate)
    if (validItems.length === 0) {
      alert('All items are flagged as duplicates. Please resolve or add new papers.')
      return
    }

    setIsProcessing(true)
    setImportProgress(10)

    // Progressive simulated batch ingest
    for (let p = 20; p <= 100; p += 20) {
      await new Promise(r => setTimeout(r, 200))
      setImportProgress(p)
    }

    setItems(prev =>
      prev.map(i => (!i.isDuplicate ? { ...i, status: 'imported' } : { ...i, status: 'skipped' }))
    )
    setIsProcessing(false)
    setIsCompleted(true)
    if (onImportComplete) {
      onImportComplete(validItems.length)
    }
  }

  const validCount = items.filter(i => !i.isDuplicate).length
  const duplicateCount = items.filter(i => i.isDuplicate).length

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in overflow-y-auto">
      <div 
        onClick={e => e.stopPropagation()}
        className="w-full max-w-4xl my-8 p-6 sm:p-8 rounded-3xl bg-[#11111a] border border-purple-500/40 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-prevu-surface-light pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-600/30 shrink-0">
              <Archive className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 uppercase tracking-wider mb-1">
                <span>Automated Administration Tool</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Bulk Paper Import & Duplicate Radar
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-prevu-text-muted hover:text-white rounded-xl hover:bg-prevu-surface-light transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Drop Zone & Sample Loader */}
        {items.length === 0 ? (
          <div className="p-8 sm:p-12 rounded-3xl border-2 border-dashed border-purple-500/30 bg-purple-950/10 hover:border-purple-500/60 transition-all text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 mx-auto shadow-lg">
              <UploadCloud className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                Drag & Drop ZIP Archive or Multiple PDF Papers
              </h3>
              <p className="text-xs text-prevu-text-muted max-w-md mx-auto">
                Prevu automatically parses filename patterns (e.g., <code className="text-purple-300">21CSH-202_MST1_2024.pdf</code>) to identify subject, semester, and exam format.
              </p>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFilesSelected}
              multiple
              accept=".pdf,.zip"
              className="hidden"
            />

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md shadow-purple-600/30"
              >
                <FileText className="w-4 h-4 mr-1.5" /> Select Files
              </Button>
              <Button
                variant="outline"
                onClick={handleLoadSampleBatch}
                className="border-purple-500/40 text-purple-300 hover:bg-purple-500/10 text-xs font-bold"
              >
                <Sparkles className="w-4 h-4 mr-1.5 text-amber-400" /> Load Demo Batch (5 Papers)
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Batch Status Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-white font-mono">
                  {items.length} Papers Detected
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {validCount} Unique & Ready
                </span>
                {duplicateCount > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {duplicateCount} Duplicate Flagged
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs border-prevu-surface-light"
                >
                  + Add More Files
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFilesSelected}
                  multiple
                  accept=".pdf,.zip"
                  className="hidden"
                />
              </div>
            </div>

            {/* Extracted Papers Table */}
            <div className="max-h-80 overflow-y-auto rounded-2xl border border-prevu-surface-light bg-prevu-bg/50">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-prevu-surface/95 border-b border-prevu-surface-light text-prevu-text-muted uppercase text-[10px] font-mono">
                  <tr>
                    <th className="py-2.5 px-3">File</th>
                    <th className="py-2.5 px-3">Subject</th>
                    <th className="py-2.5 px-2">Type</th>
                    <th className="py-2.5 px-2">Year</th>
                    <th className="py-2.5 px-2">Sem</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-prevu-surface-light/40">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-prevu-surface/40 transition-colors">
                      <td className="py-2 px-3 font-mono text-[11px] text-white truncate max-w-[160px]" title={item.fileName}>
                        {item.fileName}
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.subjectName}
                          onChange={e => handleUpdateItem(item.id, { subjectName: e.target.value })}
                          className="w-full px-2 py-1 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-white"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={item.examType}
                          onChange={e => handleUpdateItem(item.id, { examType: e.target.value as any })}
                          className="bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-white px-1.5 py-1"
                        >
                          <option value="MST1">MST1</option>
                          <option value="MST2">MST2</option>
                          <option value="EST">EST</option>
                        </select>
                      </td>
                      <td className="py-2 px-2">
                        <input
                          type="number"
                          value={item.examYear}
                          onChange={e => handleUpdateItem(item.id, { examYear: parseInt(e.target.value, 10) || 2024 })}
                          className="w-16 px-1.5 py-1 bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-white"
                        />
                      </td>
                      <td className="py-2 px-2">
                        <select
                          value={item.semester}
                          onChange={e => handleUpdateItem(item.id, { semester: parseInt(e.target.value, 10) })}
                          className="bg-prevu-surface border border-prevu-surface-light rounded-lg text-xs text-white px-1.5 py-1"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                            <option key={s} value={s}>S{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        {item.status === 'imported' ? (
                          <span className="text-[10px] font-bold font-mono text-emerald-400 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" /> Imported
                          </span>
                        ) : item.isDuplicate ? (
                          <span className="text-[10px] font-bold font-mono text-rose-400 flex items-center gap-1" title={item.duplicateReason}>
                            <AlertTriangle className="w-3 h-3 shrink-0" /> Duplicate
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold font-mono text-emerald-300">
                            Ready
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-2 text-right">
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-prevu-text-muted hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Progress Bar during import */}
            {isProcessing && (
              <div className="space-y-1.5 pt-2">
                <div className="flex justify-between text-xs font-mono text-prevu-text-muted">
                  <span>Importing parsed papers into vault...</span>
                  <span>{importProgress}%</span>
                </div>
                <div className="h-2 w-full bg-prevu-bg rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-600 to-emerald-400 transition-all duration-300"
                    style={{ width: `${importProgress}%` }}
                  />
                </div>
              </div>
            )}

            {isCompleted && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Bulk import completed successfully! {validCount} papers added to the live catalog.</span>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex justify-between items-center pt-3 border-t border-prevu-surface-light text-xs text-prevu-text-muted">
          <span>Intelligent duplicate radar active.</span>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="ghost" onClick={onClose} className="text-xs">
              {isCompleted ? 'Done' : 'Cancel'}
            </Button>
            {items.length > 0 && !isCompleted && (
              <Button
                size="sm"
                onClick={handleBatchImport}
                disabled={isProcessing || validCount === 0}
                className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-md shadow-purple-600/30"
              >
                <Layers className="w-3.5 h-3.5 mr-1.5" />
                Import {validCount} Unique Papers
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
