/**
 * URL parsing and validation utilities for Google Drive and YouTube links
 */

export interface ParsedYouTubeUrl {
  isValid: boolean
  type: 'video' | 'playlist' | 'unknown'
  isPlaylist: boolean
  id: string | null
  embedUrl: string | null
  thumbnailUrl: string | null
}

export interface ParsedGDriveUrl {
  isValid: boolean
  type: 'folder' | 'file' | 'doc' | 'unknown'
  id: string | null
  cleanUrl: string | null
}

/**
 * Parses and validates YouTube video and playlist URLs
 */
export function parseYouTubeUrl(rawUrl: string): ParsedYouTubeUrl {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, type: 'unknown', isPlaylist: false, id: null, embedUrl: null, thumbnailUrl: null }
  }

  const url = rawUrl.trim()

  // 1. Check for Playlist
  const playlistMatch = url.match(/[?&]list=([a-zA-Z0-9_-]+)/)
  if (playlistMatch && playlistMatch[1]) {
    const listId = playlistMatch[1]
    return {
      isValid: true,
      type: 'playlist',
      isPlaylist: true,
      id: listId,
      embedUrl: `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}`,
      thumbnailUrl: null // Playlists don't have a single default static thumb
    }
  }

  // 2. Check for Single Video
  // Supports youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID, youtube.com/v/ID, youtube.com/shorts/ID
  const videoRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(videoRegex)

  if (match && match[1]) {
    const videoId = match[1]
    return {
      isValid: true,
      type: 'video',
      isPlaylist: false,
      id: videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
  }

  return { isValid: false, type: 'unknown', isPlaylist: false, id: null, embedUrl: null, thumbnailUrl: null }
}

/**
 * Parses and validates Google Drive folder and file links
 */
export function parseGDriveUrl(rawUrl: string): ParsedGDriveUrl {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, type: 'unknown', id: null, cleanUrl: null }
  }

  const url = rawUrl.trim()

  // Folder: drive.google.com/drive/folders/{id} or drive.google.com/drive/u/0/folders/{id}
  const folderMatch = url.match(/drive\.google\.com\/(?:[^\/]+\/)?folders\/([a-zA-Z0-9_-]+)/)
  if (folderMatch && folderMatch[1]) {
    return {
      isValid: true,
      type: 'folder',
      id: folderMatch[1],
      cleanUrl: `https://drive.google.com/drive/folders/${folderMatch[1]}`
    }
  }

  // File: drive.google.com/file/d/{id}
  const fileMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (fileMatch && fileMatch[1]) {
    return {
      isValid: true,
      type: 'file',
      id: fileMatch[1],
      cleanUrl: `https://drive.google.com/file/d/${fileMatch[1]}/view`
    }
  }

  // Google Docs / Sheets / Slides: docs.google.com/{type}/d/{id}
  const docMatch = url.match(/docs\.google\.com\/(?:document|spreadsheets|presentation)\/d\/([a-zA-Z0-9_-]+)/)
  if (docMatch && docMatch[1]) {
    return {
      isValid: true,
      type: 'doc',
      id: docMatch[1],
      cleanUrl: url
    }
  }

  // Generic drive.google.com / docs.google.com link fallback
  if (url.startsWith('https://drive.google.com/') || url.startsWith('https://docs.google.com/')) {
    return {
      isValid: true,
      type: 'unknown',
      id: null,
      cleanUrl: url
    }
  }

  return { isValid: false, type: 'unknown', id: null, cleanUrl: null }
}
