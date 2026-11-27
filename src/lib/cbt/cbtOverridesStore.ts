import fs from 'fs'
import path from 'path'
import os from 'os'
import { CbtQuestionOverride, CbtSubjectOverride } from './types'

const BUNDLED_OVERRIDES_DIR = path.join(process.cwd(), 'src', 'lib', 'cbt', 'data')
const TMP_OVERRIDES_DIR = path.join(os.tmpdir(), 'prevu_cbt_overrides')

declare global {
  // eslint-disable-next-line no-var
  var __prevu_cbt_subject_overrides: CbtSubjectOverride[] | undefined
  // eslint-disable-next-line no-var
  var __prevu_cbt_question_overrides: CbtQuestionOverride[] | undefined
}

function getWritableFile(filename: string): string {
  const dirs = [BUNDLED_OVERRIDES_DIR, TMP_OVERRIDES_DIR]
  for (const dir of dirs) {
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      const probe = path.join(dir, '.write_test')
      fs.writeFileSync(probe, '1', 'utf8')
      fs.unlinkSync(probe)
      return path.join(dir, filename)
    } catch {
      // Try next directory (e.g. read-only Vercel bundle -> /tmp)
    }
  }
  return path.join(TMP_OVERRIDES_DIR, filename)
}

function readJsonList<T>(filename: string): T[] {
  for (const dir of [BUNDLED_OVERRIDES_DIR, TMP_OVERRIDES_DIR]) {
    try {
      const p = path.join(dir, filename)
      if (fs.existsSync(p)) {
        const parsed = JSON.parse(fs.readFileSync(p, 'utf8'))
        if (Array.isArray(parsed)) return parsed
      }
    } catch {
      // Ignore read errors and fall through
    }
  }
  return []
}

function writeJsonList<T>(filename: string, items: T[]): void {
  try {
    const filePath = getWritableFile(filename)
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2), 'utf8')
  } catch {
    // In-memory global cache remains active
  }
}

export function getStoredSubjectOverrides(): CbtSubjectOverride[] {
  if (!globalThis.__prevu_cbt_subject_overrides) {
    globalThis.__prevu_cbt_subject_overrides = readJsonList<CbtSubjectOverride>('subject_overrides.json')
  }
  return globalThis.__prevu_cbt_subject_overrides
}

export function upsertStoredSubjectOverride(entry: CbtSubjectOverride): CbtSubjectOverride[] {
  const list = [...getStoredSubjectOverrides()]
  const code = entry.subjectCode.toUpperCase()
  const idx = list.findIndex(item => item.subjectCode.toUpperCase() === code)
  const normalized: CbtSubjectOverride = { ...entry, subjectCode: code }
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...normalized }
  } else {
    list.push(normalized)
  }
  globalThis.__prevu_cbt_subject_overrides = list
  writeJsonList('subject_overrides.json', list)
  return list
}

export function deleteStoredSubjectOverride(subjectCode: string): CbtSubjectOverride[] {
  const code = subjectCode.toUpperCase()
  const list = getStoredSubjectOverrides().filter(item => item.subjectCode.toUpperCase() !== code)
  globalThis.__prevu_cbt_subject_overrides = list
  writeJsonList('subject_overrides.json', list)
  return list
}

export function getStoredQuestionOverrides(): CbtQuestionOverride[] {
  if (!globalThis.__prevu_cbt_question_overrides) {
    globalThis.__prevu_cbt_question_overrides = readJsonList<CbtQuestionOverride>('question_overrides.json')
  }
  return globalThis.__prevu_cbt_question_overrides
}

export function upsertStoredQuestionOverride(entry: CbtQuestionOverride): CbtQuestionOverride[] {
  const list = [...getStoredQuestionOverrides()]
  const idx = list.findIndex(item => item.questionId === entry.questionId)
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...entry }
  } else {
    list.push(entry)
  }
  globalThis.__prevu_cbt_question_overrides = list
  writeJsonList('question_overrides.json', list)
  return list
}

export function deleteStoredQuestionOverride(questionId: string): CbtQuestionOverride[] {
  const list = getStoredQuestionOverrides().filter(item => item.questionId !== questionId)
  globalThis.__prevu_cbt_question_overrides = list
  writeJsonList('question_overrides.json', list)
  return list
}
