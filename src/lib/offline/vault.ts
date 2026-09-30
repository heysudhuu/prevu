// Prevu Offline Vault Engine
// Manages caching of question papers into CacheStorage and IndexedDB/localStorage

export interface OfflinePaper {
  id: string
  subjectName: string
  subjectCode: string
  semester: number
  examType: string
  examYear: number
  fileSize?: number
  savedAt: string
}

const VAULT_CACHE_NAME = 'prevu-pdf-vault-v1'
const VAULT_STORAGE_KEY = 'prevu_offline_papers'
const VAULT_EVENT_KEY = 'prevu-offline-vault-changed'

/**
 * Check if Offline Vault is supported in current browser
 */
export function isOfflineVaultSupported(): boolean {
  return typeof window !== 'undefined' && 'caches' in window && 'localStorage' in window
}

/**
 * Get all papers currently saved in the offline vault
 */
export function getOfflineVaultPapers(): OfflinePaper[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as OfflinePaper[]
  } catch (err) {
    console.error('[Offline Vault] Failed to load offline papers', err)
    return []
  }
}

/**
 * Check if a specific paper ID is already in the offline vault
 */
export function isPaperInOfflineVault(paperId: string): boolean {
  const papers = getOfflineVaultPapers()
  return papers.some(p => p.id === paperId)
}

/**
 * Save a paper and its binary PDF into the offline vault
 */
export async function savePaperToOfflineVault(
  paper: Omit<OfflinePaper, 'savedAt' | 'fileSize'>
): Promise<{ success: boolean; error?: string; size?: number }> {
  if (!isOfflineVaultSupported()) {
    return { success: false, error: 'Offline storage not supported in this browser' }
  }

  try {
    const targetUrl = `/api/preview/${paper.id}`
    const response = await fetch(targetUrl)

    if (!response.ok) {
      throw new Error(`Failed to download paper file (${response.status})`)
    }

    const blob = await response.blob()
    const fileSize = blob.size

    // Store in CacheStorage
    const cache = await caches.open(VAULT_CACHE_NAME)
    const headers = new Headers(response.headers)
    headers.set('Content-Type', 'application/pdf')
    headers.set('Content-Length', String(fileSize))

    const cachedResponse = new Response(blob, {
      status: 200,
      statusText: 'OK',
      headers
    })

    await cache.put(targetUrl, cachedResponse)

    // Store metadata in localStorage
    const existing = getOfflineVaultPapers().filter(p => p.id !== paper.id)
    const newEntry: OfflinePaper = {
      ...paper,
      savedAt: new Date().toISOString(),
      fileSize
    }

    existing.unshift(newEntry)
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(existing))

    // Notify listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(VAULT_EVENT_KEY, { detail: { paperId: paper.id, action: 'saved' } }))
    }

    return { success: true, size: fileSize }
  } catch (err: any) {
    console.error('[Offline Vault] Failed to save paper', err)
    return { success: false, error: err.message || 'Could not save paper offline' }
  }
}

/**
 * Remove a paper from offline vault and delete its cached PDF
 */
export async function removePaperFromOfflineVault(paperId: string): Promise<boolean> {
  if (!isOfflineVaultSupported()) return false

  try {
    // Delete from CacheStorage
    const cache = await caches.open(VAULT_CACHE_NAME)
    await cache.delete(`/api/preview/${paperId}`)

    // Delete from localStorage
    const remaining = getOfflineVaultPapers().filter(p => p.id !== paperId)
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(remaining))

    // Notify listeners
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(VAULT_EVENT_KEY, { detail: { paperId, action: 'removed' } }))
    }

    return true
  } catch (err) {
    console.error('[Offline Vault] Failed to remove paper', err)
    return false
  }
}

/**
 * Clear all papers from offline vault
 */
export async function clearOfflineVault(): Promise<boolean> {
  if (!isOfflineVaultSupported()) return false

  try {
    if ('caches' in window) {
      await caches.delete(VAULT_CACHE_NAME)
    }
    localStorage.removeItem(VAULT_STORAGE_KEY)

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(VAULT_EVENT_KEY, { detail: { action: 'cleared' } }))
    }

    return true
  } catch (err) {
    console.error('[Offline Vault] Failed to clear vault', err)
    return false
  }
}

/**
 * Retrieve the offline PDF as an Object URL for offline viewing
 */
export async function getOfflinePdfBlobUrl(paperId: string): Promise<string | null> {
  if (!isOfflineVaultSupported()) return null

  try {
    const cache = await caches.open(VAULT_CACHE_NAME)
    const response = await cache.match(`/api/preview/${paperId}`)
    if (!response) return null

    const blob = await response.blob()
    return URL.createObjectURL(blob)
  } catch (err) {
    console.error('[Offline Vault] Failed to retrieve offline blob', err)
    return null
  }
}

/**
 * Calculate total offline storage usage
 */
export function getVaultStorageStats(): { count: number; bytes: number; formatted: string } {
  const papers = getOfflineVaultPapers()
  const bytes = papers.reduce((acc, p) => acc + (p.fileSize || 0), 0)

  let formatted = '0 KB'
  if (bytes > 1024 * 1024) {
    formatted = `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  } else if (bytes > 0) {
    formatted = `${Math.round(bytes / 1024)} KB`
  }

  return {
    count: papers.length,
    bytes,
    formatted
  }
}
