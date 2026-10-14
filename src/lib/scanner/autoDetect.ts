/**
 * Intelligent client-side metadata detection from file names and PDF headers.
 * Extracts: Subject, Subject Code, Exam/Material Type, Academic Year, Semester, and Unit.
 */

export interface SubjectOption {
  id: number
  name: string
  code: string
  year: number
  semester: number
  branch_id?: number
}

export interface DetectedMetadata {
  subjectName?: string
  subjectCode?: string
  year?: number
  semester?: number
  examType?: string
  materialType?: string
  category?: 'exam_paper' | 'study_material'
  examYear?: number
  unit?: string
  confidenceScore: number // 0 to 100
  matchedSubjectId?: number
  detectedFrom: string[] // List of fields detected
}

/**
 * Extracts raw ASCII text from the first 48KB of a PDF or text file.
 */
async function extractHeaderSnippet(file: File): Promise<string> {
  try {
    const slice = file.slice(0, 48 * 1024)
    const arrayBuffer = await slice.arrayBuffer()
    const decoder = new TextDecoder('latin1')
    return decoder.decode(arrayBuffer)
  } catch {
    return ''
  }
}

/**
 * Clean & normalize a string for fuzzy token matching.
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, ' ')
}

/**
 * Analyzes the uploaded file (filename + raw header content) and attempts to auto-detect
 * subject, exam type, year, and category against the available subjects in the database.
 */
export async function detectMetadataFromFile(
  file: File,
  knownSubjects: SubjectOption[]
): Promise<DetectedMetadata | null> {
  if (!file) return null

  const fileName = file.name
  const headerContent = file.type === 'application/pdf' || file.name.endsWith('.pdf')
    ? await extractHeaderSnippet(file)
    : ''

  // Combine filename with header text for comprehensive detection
  const combinedText = `${fileName} ${headerContent}`
  const normalizedText = normalize(combinedText)
  const normalizedFileName = normalize(fileName)

  const detected: DetectedMetadata = {
    confidenceScore: 0,
    detectedFrom: []
  }

  // 1. Detect Exam Year (2018 - 2029)
  const yearMatch = fileName.match(/\b(201[8-9]|202[0-9])\b/) || combinedText.match(/\b(201[8-9]|202[0-9])\b/)
  if (yearMatch) {
    detected.examYear = parseInt(yearMatch[1], 10)
    detected.confidenceScore += 20
    detected.detectedFrom.push(`Year (${detected.examYear})`)
  }

  // 2. Detect Category & Exam/Material Type
  const lowerNorm = normalizedFileName
  let isStudy = false

  if (/\b(notes?|handwritten|lecture\s*notes?)\b/.test(lowerNorm)) {
    detected.category = 'study_material'
    detected.materialType = 'Notes'
    isStudy = true
    detected.detectedFrom.push('Material Type (Notes)')
    detected.confidenceScore += 25
  } else if (/\b(syllabus|course\s*blueprint|outline)\b/.test(lowerNorm)) {
    detected.category = 'study_material'
    detected.materialType = 'Syllabus'
    isStudy = true
    detected.detectedFrom.push('Material Type (Syllabus)')
    detected.confidenceScore += 25
  } else if (/\b(assignment|solution|tutorial)\b/.test(lowerNorm)) {
    detected.category = 'study_material'
    detected.materialType = 'Assignment'
    isStudy = true
    detected.detectedFrom.push('Material Type (Assignment)')
    detected.confidenceScore += 25
  } else if (/\b(lab|practical|manual)\b/.test(lowerNorm)) {
    detected.category = 'study_material'
    detected.materialType = 'Lab Manual'
    isStudy = true
    detected.detectedFrom.push('Material Type (Lab Manual)')
    detected.confidenceScore += 25
  } else if (/\b(cheatsheet|formula\s*sheet|summary)\b/.test(lowerNorm)) {
    detected.category = 'study_material'
    detected.materialType = 'Cheatsheet'
    isStudy = true
    detected.detectedFrom.push('Material Type (Cheatsheet)')
    detected.confidenceScore += 25
  }

  // If not study material, check for Exam Papers (MST1, MST2, EST)
  if (!isStudy) {
    if (/\b(mst\s*1|mst1|mid\s*sem\s*1|mid\s*term\s*1|sessional\s*1)\b/.test(normalizedText)) {
      detected.category = 'exam_paper'
      detected.examType = 'MST1'
      detected.detectedFrom.push('Exam Type (MST1)')
      detected.confidenceScore += 25
    } else if (/\b(mst\s*2|mst2|mid\s*sem\s*2|mid\s*term\s*2|sessional\s*2)\b/.test(normalizedText)) {
      detected.category = 'exam_paper'
      detected.examType = 'MST2'
      detected.detectedFrom.push('Exam Type (MST2)')
      detected.confidenceScore += 25
    } else if (/\b(est|end\s*sem|final\s*exam|regular\s*exam)\b/.test(normalizedText)) {
      detected.category = 'exam_paper'
      detected.examType = 'EST'
      detected.detectedFrom.push('Exam Type (EST)')
      detected.confidenceScore += 25
    }
  }

  // 3. Detect Unit / Module (e.g. Unit 1, Unit 2, Unit 3, Unit 4)
  const unitMatch = normalizedFileName.match(/\b(unit\s*([1-4])|module\s*([1-4]))\b/)
  if (unitMatch) {
    const num = unitMatch[2] || unitMatch[3]
    detected.unit = `Unit ${num}`
    detected.detectedFrom.push(detected.unit)
    detected.confidenceScore += 15
  }

  // 4. Match against Known Subjects
  if (knownSubjects && knownSubjects.length > 0) {
    let bestMatch: SubjectOption | null = null
    let highestTokenOverlap = 0

    for (const sub of knownSubjects) {
      const subNameNorm = normalize(sub.name)
      const subCodeNorm = normalize(sub.code)

      // Direct exact or code match
      if (subCodeNorm && subCodeNorm.length >= 3 && normalizedText.includes(subCodeNorm)) {
        bestMatch = sub
        highestTokenOverlap = 99
        break
      }

      // Check tokens of subject name
      const tokens = subNameNorm.split(' ').filter(t => t.length > 3)
      if (tokens.length === 0) continue

      let matchCount = 0
      for (const token of tokens) {
        if (normalizedText.includes(token)) {
          matchCount++
        }
      }

      if (matchCount > highestTokenOverlap) {
        highestTokenOverlap = matchCount
        bestMatch = sub
      }
    }

    if (bestMatch && highestTokenOverlap >= 1) {
      detected.subjectName = bestMatch.name
      detected.subjectCode = bestMatch.code
      detected.year = bestMatch.year
      detected.semester = bestMatch.semester
      detected.matchedSubjectId = bestMatch.id
      detected.detectedFrom.push(`Subject (${bestMatch.name})`)
      detected.confidenceScore += 40
    }
  }

  return detected.confidenceScore >= 20 ? detected : null
}
