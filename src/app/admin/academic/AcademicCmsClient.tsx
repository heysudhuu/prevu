'use client'

import React, { useState, useMemo } from 'react'
import {
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/admin/ui/ConfirmDialog'
import {
  createSubject,
  updateSubject,
  deleteSubject
} from '../actions'

interface BranchItem {
  id: number
  name: string
}

interface SubjectItem {
  id: number
  branch_id: number
  year: number
  semester: number
  name: string
  code: string
  paperCount?: number
  branches?: {
    name: string
  }
}

interface ExamTypeItem {
  id: number
  name: string
}

interface AcademicCmsClientProps {
  initialBranches: BranchItem[]
  initialSubjects: SubjectItem[]
  initialExamTypes: ExamTypeItem[]
}

export default function AcademicCmsClient({
  initialBranches,
  initialSubjects,
  initialExamTypes
}: AcademicCmsClientProps) {
  const [branches] = useState<BranchItem[]>(initialBranches)
  const [subjects, setSubjects] = useState<SubjectItem[]>(initialSubjects)
  const [examTypes] = useState<ExamTypeItem[]>(initialExamTypes)

  // Filters
  const [selectedSem, setSelectedSem] = useState<number>(1)
  const [searchQuery, setSearchQuery] = useState('')

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<SubjectItem | null>(null)
  const [formName, setFormName] = useState('')
  const [formCode, setFormCode] = useState('')
  const [formSem, setFormSem] = useState<number>(1)
  const [formYear, setFormYear] = useState<number>(1)
  const [formBranchId, setFormBranchId] = useState<number>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Delete state
  const [deletingSubject, setDeletingSubject] = useState<SubjectItem | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Filtered by active semester and search
  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => {
      const matchesSem = s.semester === selectedSem
      const term = searchQuery.toLowerCase().trim()
      const matchesSearch =
        !term ||
        s.name.toLowerCase().includes(term) ||
        s.code.toLowerCase().includes(term)
      return matchesSem && matchesSearch
    })
  }, [subjects, selectedSem, searchQuery])

  const handleOpenAddModal = () => {
    setEditingSubject(null)
    setFormName('')
    setFormCode('')
    setFormSem(selectedSem)
    setFormYear(Math.ceil(selectedSem / 2))
    setFormBranchId(branches[0]?.id || 1)
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (subject: SubjectItem) => {
    setEditingSubject(subject)
    setFormName(subject.name)
    setFormCode(subject.code)
    setFormSem(subject.semester)
    setFormYear(subject.year)
    setFormBranchId(subject.branch_id)
    setErrorMessage(null)
    setIsModalOpen(true)
  }

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim() || !formCode.trim()) {
      setErrorMessage('Subject name and course code are required.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    if (editingSubject) {
      const res = await updateSubject(editingSubject.id, {
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        semester: Number(formSem),
        year: Number(formYear)
      })

      if (res.success) {
        setSubjects(prev =>
          prev.map(s =>
            s.id === editingSubject.id
              ? {
                  ...s,
                  name: formName.trim(),
                  code: formCode.trim().toUpperCase(),
                  semester: Number(formSem),
                  year: Number(formYear)
                }
              : s
          )
        )
        setIsModalOpen(false)
      } else {
        setErrorMessage(res.error || 'Failed to update subject')
      }
    } else {
      const res = await createSubject({
        branch_id: Number(formBranchId),
        name: formName.trim(),
        code: formCode.trim().toUpperCase(),
        semester: Number(formSem),
        year: Number(formYear)
      })

      if (res.success && res.subject) {
        setSubjects(prev => [...prev, { ...res.subject, paperCount: 0 }])
        setIsModalOpen(false)
      } else {
        setErrorMessage(res.error || 'Failed to create subject')
      }
    }
    setIsSubmitting(false)
  }

  const handleDeleteSubject = async () => {
    if (!deletingSubject) return
    setIsDeleting(true)
    const res = await deleteSubject(deletingSubject.id)
    if (res.success) {
      setSubjects(prev => prev.filter(s => s.id !== deletingSubject.id))
      setDeletingSubject(null)
    } else {
      alert(res.error || 'Failed to delete subject')
    }
    setIsDeleting(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-prevu-text tracking-tight">
              Academic Curriculum CMS
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              BE-CSE Hierarchy
            </span>
          </div>
          <p className="text-xs text-prevu-text-muted mt-1">
            Manage university courses, official subject codes, semester mappings, and exam patterns.
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleOpenAddModal}
          className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Curriculum Subject</span>
        </Button>
      </div>

      {/* Program and Exam Pattern Overview Chips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Programs */}
        <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-2">
          <span className="text-[10px] font-semibold text-prevu-text-muted uppercase font-mono tracking-wider">
            Active Programs
          </span>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {branches.map(b => (
              <span
                key={b.id}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-prevu-bg border border-prevu-surface-light text-prevu-text flex items-center gap-1.5"
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                {b.name}
              </span>
            ))}
          </div>
        </div>

        {/* Exam Types */}
        <div className="p-4 rounded-2xl bg-prevu-surface/80 border border-prevu-surface-light space-y-2">
          <span className="text-[10px] font-semibold text-prevu-text-muted uppercase font-mono tracking-wider">
            Supported Exam Formats
          </span>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {examTypes.map(et => (
              <span
                key={et.id}
                className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20"
              >
                {et.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Semester Tab Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => {
          const count = subjects.filter(s => s.semester === sem).length
          const isActive = selectedSem === sem

          return (
            <button
              key={sem}
              onClick={() => setSelectedSem(sem)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                  : 'bg-prevu-surface border border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text'
              }`}
            >
              <span>Semester {sem}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-prevu-bg text-prevu-text-muted'
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Subject List Data Table */}
      <div className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/60 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-prevu-surface-light flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-prevu-text">
            Semester {selectedSem} Subjects ({filteredSubjects.length})
          </h3>
          <div className="w-64">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter subjects by name or code..."
              className="w-full px-3 py-1.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/60 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-prevu-bg/90 text-prevu-text-muted border-b border-prevu-surface-light">
              <tr>
                <th className="p-3.5 font-semibold">Course Code</th>
                <th className="p-3.5 font-semibold">Subject Title</th>
                <th className="p-3.5 font-semibold">Year & Sem</th>
                <th className="p-3.5 font-semibold">Vault Papers</th>
                <th className="p-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-prevu-surface-light/60 text-prevu-text">
              {filteredSubjects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-prevu-text-muted">
                    No curriculum subjects listed for Semester {selectedSem}.
                  </td>
                </tr>
              ) : (
                filteredSubjects.map(sub => (
                  <tr key={sub.id} className="hover:bg-prevu-surface-light/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-purple-400">
                      {sub.code}
                    </td>
                    <td className="p-3.5 font-semibold text-prevu-text">
                      {sub.name}
                    </td>
                    <td className="p-3.5 font-mono text-prevu-text-muted">
                      Year {sub.year} • Sem {sub.semester}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-prevu-bg border border-prevu-surface-light text-prevu-text-muted">
                        {sub.paperCount || 0} papers
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEditModal(sub)}
                        className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-purple-300 hover:bg-purple-500/10 inline-flex items-center justify-center transition-colors"
                        title="Edit Subject"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeletingSubject(sub)}
                        className="h-7 w-7 rounded-lg text-prevu-text-muted hover:text-red-400 hover:bg-red-500/10 inline-flex items-center justify-center transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Subject Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-md rounded-2xl bg-prevu-surface border border-prevu-surface-light shadow-2xl p-6 z-10 space-y-4">
            <div>
              <h3 className="text-base font-bold text-prevu-text">
                {editingSubject ? 'Edit Curriculum Subject' : 'Add New Subject'}
              </h3>
              <p className="text-xs text-prevu-text-muted mt-1">
                Configure official course nomenclature and academic mappings.
              </p>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">Subject Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  placeholder="e.g. Database Management Systems"
                  className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-prevu-text-muted font-medium mb-1">Course Code</label>
                <input
                  type="text"
                  value={formCode}
                  onChange={e => setFormCode(e.target.value)}
                  placeholder="e.g. 23CSH-243"
                  className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text font-mono focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">Semester</label>
                  <select
                    value={formSem}
                    onChange={e => {
                      const sem = Number(e.target.value)
                      setFormSem(sem)
                      setFormYear(Math.ceil(sem / 2))
                    }}
                    className="w-full px-3 py-2 bg-prevu-bg border border-prevu-surface-light rounded-xl text-prevu-text focus:outline-none focus:border-purple-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                      <option key={s} value={s}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-prevu-text-muted font-medium mb-1">Academic Year</label>
                  <input
                    type="number"
                    value={formYear}
                    readOnly
                    className="w-full px-3 py-2 bg-prevu-bg/50 border border-prevu-surface-light rounded-xl text-prevu-text-muted font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  className="border-prevu-surface-light text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold"
                >
                  {isSubmitting ? 'Saving...' : editingSubject ? 'Save Changes' : 'Create Subject'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Subject Safeguard Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingSubject}
        title="Delete Curriculum Subject?"
        description={
          deletingSubject && (deletingSubject.paperCount || 0) > 0
            ? `Warning: There are ${deletingSubject.paperCount} question papers referencing "${deletingSubject.name}". The system will safeguard and prevent deletion until those papers are deleted or reassigned.`
            : `Are you sure you want to delete "${deletingSubject?.name}" (${deletingSubject?.code})? This subject will no longer be available during paper upload.`
        }
        confirmText="Delete Subject"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteSubject}
        onCancel={() => setDeletingSubject(null)}
      />
    </div>
  )
}
