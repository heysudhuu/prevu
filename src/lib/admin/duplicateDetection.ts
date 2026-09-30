// Intelligent Duplicate Detection System (#16)

export interface DuplicateCheckResult {
  isDuplicate: boolean
  confidence: number // 0 to 100%
  reason: string
  matchedPaperId?: string
  matchedPaperTitle?: string
}

export interface PaperMetadataCandidate {
  subjectName: string
  subjectCode?: string
  examType: string
  examYear: number
  semester?: number
  fileName?: string
  fileSize?: number
}

export interface ExistingPaperRecord {
  id: string
  subject_name?: string
  subject_code?: string
  exam_type?: string
  exam_year?: number
  file_name?: string
  file_size?: number
}

/**
 * Checks if a candidate paper has an identical or near-identical record in the database.
 */
export function checkDuplicatePaper(
  candidate: PaperMetadataCandidate,
  existingPapers: ExistingPaperRecord[]
): DuplicateCheckResult {
  if (!existingPapers || existingPapers.length === 0) {
    return { isDuplicate: false, confidence: 0, reason: 'No prior records' }
  }

  const cleanCandSubject = (candidate.subjectName || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '')
  const cleanCandCode = (candidate.subjectCode || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '')
  const cleanCandType = (candidate.examType || '').toUpperCase().trim()

  for (const existing of existingPapers) {
    const cleanExistSubject = (existing.subject_name || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '')
    const cleanExistCode = (existing.subject_code || '').toLowerCase().trim().replace(/[^a-z0-9]/g, '')
    const cleanExistType = (existing.exam_type || '').toUpperCase().trim()

    // 1. Exact Match on Subject Code + Exam Type + Year
    if (
      cleanCandCode &&
      cleanExistCode &&
      cleanCandCode === cleanExistCode &&
      cleanCandType === cleanExistType &&
      candidate.examYear === existing.exam_year
    ) {
      return {
        isDuplicate: true,
        confidence: 98,
        reason: `Exact match found for Subject Code "${existing.subject_code}" (${existing.exam_type} ${existing.exam_year})`,
        matchedPaperId: existing.id,
        matchedPaperTitle: `${existing.subject_name || existing.subject_code} - ${existing.exam_year} ${existing.exam_type}`
      }
    }

    // 2. High Similarity on Subject Name + Exam Type + Year
    const subjectMatches = 
      cleanCandSubject === cleanExistSubject ||
      (cleanCandSubject.length > 5 && cleanExistSubject.includes(cleanCandSubject)) ||
      (cleanExistSubject.length > 5 && cleanCandSubject.includes(cleanExistSubject))

    if (
      subjectMatches &&
      cleanCandType === cleanExistType &&
      candidate.examYear === existing.exam_year
    ) {
      return {
        isDuplicate: true,
        confidence: 90,
        reason: `Paper already approved in vault for ${existing.subject_name} (${existing.exam_year} ${existing.exam_type})`,
        matchedPaperId: existing.id,
        matchedPaperTitle: `${existing.subject_name} - ${existing.exam_year} ${existing.exam_type}`
      }
    }

    // 3. Exact File Size & Name match
    if (
      candidate.fileSize &&
      existing.file_size &&
      candidate.fileSize === existing.file_size &&
      candidate.fileName &&
      existing.file_name &&
      candidate.fileName.toLowerCase() === existing.file_name.toLowerCase()
    ) {
      return {
        isDuplicate: true,
        confidence: 100,
        reason: `Identical binary file size (${candidate.fileSize} bytes) and filename "${candidate.fileName}"`,
        matchedPaperId: existing.id,
        matchedPaperTitle: `${existing.subject_name || 'Existing Paper'} - ${existing.file_name}`
      }
    }
  }

  return {
    isDuplicate: false,
    confidence: 0,
    reason: 'Unique paper — no existing record detected'
  }
}
