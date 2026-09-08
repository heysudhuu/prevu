'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { isSuperAdminEmail } from '@/lib/auth/admin-check'

export interface LeaderboardUser {
  id: string
  name: string
  username: string
  branch: string
  cu_verified: boolean
  role: string
  approvedUploads: number
  karma: number
  badge: {
    title: string
    color: string
    icon: string
  }
}

/**
 * Calculates contributor rankings based on approved question paper uploads and verification.
 * Excludes administrators and staff so only actual students compete on the student leaderboard.
 */
export async function getLeaderboard(): Promise<LeaderboardUser[]> {
  try {
    const supabase = getSupabaseAdmin()

    // 1. Fetch approved resources grouped by uploaded_by
    const { data: approvedResources, error: resError } = await supabase
      .from('resources')
      .select('uploaded_by')
      .eq('status', 'approved')

    if (resError || !approvedResources) {
      return []
    }

    // Tally upload counts per user ID
    const uploadCounts: Record<string, number> = {}
    approvedResources.forEach(r => {
      if (r.uploaded_by) {
        uploadCounts[r.uploaded_by] = (uploadCounts[r.uploaded_by] || 0) + 1
      }
    })

    const userIds = Object.keys(uploadCounts)
    if (userIds.length === 0) {
      return []
    }

    // 2. Fetch user details for contributors (filter out admin roles)
    const { data: usersData, error: userError } = await supabase
      .from('users')
      .select('id, name, username, email, branch, cu_verified, role')
      .in('id', userIds)
      .neq('role', 'admin')

    if (userError || !usersData) {
      return []
    }

    // 3. Double-check exclusion: remove any super-admin emails or admin roles
    const studentOnlyData = usersData.filter(u => {
      if (u.role === 'admin') return false
      if (isSuperAdminEmail(u.email)) return false
      return true
    })

    // 4. Score and rank students
    const scoredUsers: LeaderboardUser[] = studentOnlyData.map(u => {
      const uploads = uploadCounts[u.id] || 0
      // 25 karma points per approved paper, +15 bonus for CU verification
      const karma = (uploads * 25) + (u.cu_verified ? 15 : 0)

      let badge = { title: 'Contributor', color: 'text-zinc-400 bg-zinc-800/60 border-zinc-700/60', icon: '🌱' }
      if (karma >= 100) {
        badge = { title: 'Campus Legend', color: 'text-amber-300 bg-amber-500/15 border-amber-500/30', icon: '👑' }
      } else if (karma >= 50) {
        badge = { title: 'Vault Pioneer', color: 'text-purple-300 bg-purple-500/15 border-purple-500/30', icon: '⚡' }
      } else if (karma >= 25) {
        badge = { title: 'Semester Hero', color: 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30', icon: '⭐' }
      }

      return {
        id: u.id,
        name: u.name || 'Anonymous Student',
        username: u.username || 'student',
        branch: u.branch || 'BE-CSE',
        cu_verified: Boolean(u.cu_verified),
        role: u.role || 'student',
        approvedUploads: uploads,
        karma,
        badge
      }
    })

    // Sort descending by karma
    return scoredUsers.sort((a, b) => b.karma - a.karma)
  } catch (err) {
    console.error('Error fetching leaderboard:', err)
    return []
  }
}
