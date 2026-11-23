'use client'

export interface StudentActivityItem {
  id: string
  title: string
  subjectName: string
  subjectCode?: string
  format: 'pdf' | 'gdrive' | 'youtube' | 'notes' | 'cbt'
  examType?: string
  examYear?: number
  url?: string
  score?: number
  totalQuestions?: number
  percentage?: number
  unit?: string
  channelName?: string
  timestamp: number
}

const STORAGE_KEY = 'prevu_student_activity_stream'
const LEGACY_STORAGE_KEY = 'prevu_recent_papers'
const MAX_ACTIVITIES = 12

const EMPTY_ACTIVITIES: StudentActivityItem[] = []
let lastRawData: string | null = null
let cachedActivities: StudentActivityItem[] = EMPTY_ACTIVITIES

export function subscribeToStudentActivity(callback: () => void) {
  if (typeof window === 'undefined') return () => {}
  window.addEventListener('storage', callback)
  window.addEventListener('prevu-activity-updated', callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener('prevu-activity-updated', callback)
  }
}

export function getStudentActivitySnapshot(): StudentActivityItem[] {
  if (typeof window === 'undefined') return EMPTY_ACTIVITIES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === lastRawData) {
      return cachedActivities
    }
    lastRawData = raw

    if (raw) {
      const parsed = JSON.parse(raw)
      cachedActivities = Array.isArray(parsed) ? parsed : EMPTY_ACTIVITIES
      return cachedActivities
    }

    // Migration from legacy key if new key empty
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
    if (legacyRaw) {
      try {
        const legacyParsed = JSON.parse(legacyRaw)
        if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
          const migrated: StudentActivityItem[] = legacyParsed.map((item: any) => ({
            id: item.id || `legacy-${Date.now()}`,
            title: item.subjectName || 'Study Resource',
            subjectName: item.subjectName || 'Question Paper',
            subjectCode: item.subjectCode,
            format: 'pdf',
            examType: item.examType || 'PYQ',
            examYear: item.examYear,
            timestamp: item.viewedAt || Date.now()
          }))
          localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
          cachedActivities = migrated
          return migrated
        }
      } catch {
        // ignore
      }
    }

    cachedActivities = EMPTY_ACTIVITIES
    return EMPTY_ACTIVITIES
  } catch {
    return EMPTY_ACTIVITIES
  }
}

export function getServerStudentActivitySnapshot(): StudentActivityItem[] {
  return EMPTY_ACTIVITIES
}

/**
 * Universal Activity Tracker for resources (PDF, GDrive, YouTube, Notes)
 */
export function trackStudentResourceView(resource: {
  id: string
  title?: string
  original_filename?: string
  subjects?: { name?: string; code?: string }
  subject_name?: string
  subject_code?: string
  resource_format?: string
  file_type?: string
  file_path?: string
  external_url?: string
  exam_types?: { name?: string }
  exam_type?: string
  exam_year?: number
  unit?: string
  channel_name?: string
}) {
  if (typeof window === 'undefined') return

  try {
    const isGDrive = 
      resource.resource_format === 'gdrive' || 
      resource.file_type === 'link/gdrive' || 
      resource.file_path?.includes('drive.google.com')

    const isYouTube = 
      resource.resource_format === 'youtube' || 
      resource.file_type === 'link/youtube' || 
      resource.file_path?.includes('youtube.com') || 
      resource.file_path?.includes('youtu.be')

    const examName = (resource.exam_types?.name || resource.exam_type || 'PYQ').toUpperCase()
    const isNotes = examName.includes('NOTE') || examName.includes('SYLLAB') || examName.includes('MATERIAL')

    let format: 'pdf' | 'gdrive' | 'youtube' | 'notes' = 'pdf'
    if (isGDrive) format = 'gdrive'
    else if (isYouTube) format = 'youtube'
    else if (isNotes) format = 'notes'

    const subName = resource.subjects?.name || resource.subject_name || 'Academic Material'
    const subCode = resource.subjects?.code || resource.subject_code

    let displayTitle = subName
    const orig = resource.original_filename || resource.title || ''
    if (orig && !orig.startsWith('WhatsApp') && !orig.startsWith('DOC-')) {
      displayTitle = orig.replace(/\.[^/.]+$/, '').trim()
    }

    const externalUrl = resource.external_url || (resource.file_path?.startsWith('http') ? resource.file_path : undefined)

    const newActivity: StudentActivityItem = {
      id: resource.id,
      title: displayTitle,
      subjectName: subName,
      subjectCode: subCode,
      format,
      examType: examName,
      examYear: resource.exam_year,
      url: externalUrl,
      unit: resource.unit,
      channelName: resource.channel_name,
      timestamp: Date.now()
    }

    const current = getStudentActivitySnapshot()
    const updated = [newActivity, ...current.filter(a => a.id !== resource.id)].slice(0, MAX_ACTIVITIES)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    lastRawData = JSON.stringify(updated)
    cachedActivities = updated

    window.dispatchEvent(new Event('prevu-activity-updated'))
    window.dispatchEvent(new Event('prevu-recents-updated'))
  } catch (err) {
    console.warn('Could not record student activity:', err)
  }
}

/**
 * Universal Activity Tracker for CBT tests
 */
export function trackStudentCbtActivity(cbt: {
  subjectCode: string
  subjectName: string
  score: number
  totalQuestions: number
  percentage: number
}) {
  if (typeof window === 'undefined') return

  try {
    const newActivity: StudentActivityItem = {
      id: `cbt-${cbt.subjectCode}-${Date.now()}`,
      title: `${cbt.subjectName} (${cbt.subjectCode}) Mock Test`,
      subjectName: cbt.subjectName,
      subjectCode: cbt.subjectCode,
      format: 'cbt',
      score: cbt.score,
      totalQuestions: cbt.totalQuestions,
      percentage: cbt.percentage,
      timestamp: Date.now()
    }

    const current = getStudentActivitySnapshot()
    const updated = [
      newActivity, 
      ...current.filter(a => !(a.format === 'cbt' && a.subjectCode === cbt.subjectCode))
    ].slice(0, MAX_ACTIVITIES)

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    lastRawData = JSON.stringify(updated)
    cachedActivities = updated

    window.dispatchEvent(new Event('prevu-activity-updated'))
    window.dispatchEvent(new Event('prevu-recents-updated'))
  } catch (err) {
    console.warn('Could not record CBT activity:', err)
  }
}

export function clearStudentActivityStream() {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
    lastRawData = null
    cachedActivities = EMPTY_ACTIVITIES
    window.dispatchEvent(new Event('prevu-activity-updated'))
    window.dispatchEvent(new Event('prevu-recents-updated'))
  } catch {
    // ignore
  }
}
