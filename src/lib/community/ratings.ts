// Prevu Senior Vouching (#12) & Anonymous Paper Rating Engine (#14)

export interface PaperRating {
  difficulty: 'easy' | 'moderate' | 'tough'
  accuracy: number // 1 to 5
  quality: number // 1 to 5
  submittedAt: string
}

export interface PaperRatingStats {
  averageAccuracy: number
  averageQuality: number
  totalRatings: number
  difficultyVotes: { easy: number; moderate: number; tough: number }
  dominantDifficulty: 'Easy' | 'Moderate' | 'Tough'
}

const VOUCHES_STORAGE_KEY = 'prevu_senior_vouches'
const RATINGS_STORAGE_KEY = 'prevu_paper_ratings'
const COMMUNITY_EVENT = 'prevu-community-updated'

/**
 * Get all vouches
 */
export function getAllVouches(): Record<string, number> {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(VOUCHES_STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

/**
 * Check if the current user has vouched for a paper
 */
export function hasUserVouched(paperId: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const myVouches = JSON.parse(localStorage.getItem('prevu_my_vouches') || '[]')
    return myVouches.includes(paperId)
  } catch {
    return false
  }
}

/**
 * Senior student vouches for a paper
 */
export function toggleSeniorVouch(paperId: string): { vouched: boolean; total: number } {
  if (typeof window === 'undefined') return { vouched: false, total: 0 }

  const allVouches = getAllVouches()
  const currentTotal = allVouches[paperId] || 3 // Default seed for realistic social proof

  let myVouches: string[] = []
  try {
    myVouches = JSON.parse(localStorage.getItem('prevu_my_vouches') || '[]')
  } catch {
    myVouches = []
  }

  const alreadyVouched = myVouches.includes(paperId)

  if (alreadyVouched) {
    myVouches = myVouches.filter(id => id !== paperId)
    allVouches[paperId] = Math.max(0, currentTotal - 1)
  } else {
    myVouches.push(paperId)
    allVouches[paperId] = currentTotal + 1
  }

  localStorage.setItem('prevu_my_vouches', JSON.stringify(myVouches))
  localStorage.setItem(VOUCHES_STORAGE_KEY, JSON.stringify(allVouches))

  window.dispatchEvent(new CustomEvent(COMMUNITY_EVENT, { detail: { paperId, type: 'vouch' } }))

  return { vouched: !alreadyVouched, total: allVouches[paperId] }
}

export function getPaperVouches(paperId: string): number {
  const all = getAllVouches()
  return all[paperId] !== undefined ? all[paperId] : 3 // default baseline
}

/**
 * Submit paper rating (Difficulty, Accuracy, Quality)
 */
export function submitPaperRating(
  paperId: string,
  rating: { difficulty: 'easy' | 'moderate' | 'tough'; accuracy: number; quality: number }
): boolean {
  if (typeof window === 'undefined') return false

  try {
    const all = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || '{}')
    const list: PaperRating[] = all[paperId] || []

    list.push({
      ...rating,
      submittedAt: new Date().toISOString()
    })

    all[paperId] = list
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(all))

    // Track user rated
    const userRatings = JSON.parse(localStorage.getItem('prevu_user_rated_papers') || '{}')
    userRatings[paperId] = rating
    localStorage.setItem('prevu_user_rated_papers', JSON.stringify(userRatings))

    window.dispatchEvent(new CustomEvent(COMMUNITY_EVENT, { detail: { paperId, type: 'rating' } }))
    return true
  } catch {
    return false
  }
}

/**
 * Has user already rated this paper
 */
export function getUserPaperRating(paperId: string): PaperRating | null {
  if (typeof window === 'undefined') return null
  try {
    const userRatings = JSON.parse(localStorage.getItem('prevu_user_rated_papers') || '{}')
    return userRatings[paperId] || null
  } catch {
    return null
  }
}

/**
 * Get aggregated ratings stats
 */
export function getPaperRatingStats(paperId: string): PaperRatingStats {
  let list: PaperRating[] = []
  if (typeof window !== 'undefined') {
    try {
      const all = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY) || '{}')
      list = all[paperId] || []
    } catch {
      list = []
    }
  }

  // Base seed ratings for realism
  const easyVotes = 2 + list.filter(r => r.difficulty === 'easy').length
  const modVotes = 5 + list.filter(r => r.difficulty === 'moderate').length
  const toughVotes = 3 + list.filter(r => r.difficulty === 'tough').length

  let dominant: 'Easy' | 'Moderate' | 'Tough' = 'Moderate'
  if (easyVotes > modVotes && easyVotes > toughVotes) dominant = 'Easy'
  if (toughVotes > modVotes && toughVotes > easyVotes) dominant = 'Tough'

  const userAccTotal = list.reduce((acc, r) => acc + r.accuracy, 0)
  const userQualTotal = list.reduce((acc, r) => acc + r.quality, 0)

  const avgAcc = list.length > 0 ? (4.8 * 3 + userAccTotal) / (3 + list.length) : 4.8
  const avgQual = list.length > 0 ? (4.7 * 3 + userQualTotal) / (3 + list.length) : 4.7

  return {
    averageAccuracy: Number(avgAcc.toFixed(1)),
    averageQuality: Number(avgQual.toFixed(1)),
    totalRatings: 3 + list.length,
    difficultyVotes: { easy: easyVotes, moderate: modVotes, tough: toughVotes },
    dominantDifficulty: dominant
  }
}
