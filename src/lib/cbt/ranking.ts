/**
 * CBT Leaderboard Ranking Formula (Arena Score)
 *
 * Balances:
 *  1. Volume & Accuracy: score * (percentage / 100)
 *  2. Per-Question Speed Efficiency: up to +10% bonus for fast pace (sec/question < 30s)
 *
 * Retakes (attemptsCount) are intentionally excluded from the ranking formula
 * so students can freely practice and re-attempt quizzes without penalty.
 */

export interface RankableAttempt {
  score: number
  totalQuestions: number
  percentage: number
  timeSpentSeconds: number
}

export function calculateArenaScore(entry: RankableAttempt): number {
  const score = Math.max(0, Number(entry.score) || 0)
  const percentage = Math.max(0, Number(entry.percentage) || 0)
  const totalQ = Math.max(1, Number(entry.totalQuestions) || 1)
  const timeSec = Math.max(0, Number(entry.timeSpentSeconds) || 0)

  const base = score * (percentage / 100)
  const secPerQ = timeSec / totalQ
  const speedBonus = Math.max(0, Math.min(0.1, (30 - secPerQ) / 300))

  return Math.round(base * (1 + speedBonus) * 10) / 10
}

export function sortLeaderboardEntries<T extends RankableAttempt>(
  entries: T[]
): Array<T & { arenaScore: number; rank: number }> {
  const withScores = entries.map((entry) => ({
    ...entry,
    arenaScore: calculateArenaScore(entry)
  }))

  withScores.sort((a, b) => {
    if (b.arenaScore !== a.arenaScore) {
      return b.arenaScore - a.arenaScore
    }
    if (b.score !== a.score) {
      return b.score - a.score
    }
    if (b.percentage !== a.percentage) {
      return b.percentage - a.percentage
    }
    const aPace = a.timeSpentSeconds / Math.max(1, a.totalQuestions)
    const bPace = b.timeSpentSeconds / Math.max(1, b.totalQuestions)
    if (aPace !== bPace) {
      return aPace - bPace
    }
    return a.timeSpentSeconds - b.timeSpentSeconds
  })

  return withScores.map((item, idx) => ({
    ...item,
    rank: idx + 1
  }))
}
