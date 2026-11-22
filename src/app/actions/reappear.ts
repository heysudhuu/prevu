'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'

export interface LiveReappearResource {
  id: string
  original_filename: string
  file_path: string
  file_type: string
  exam_year: number
  unit: string | null
  status: string
  download_count: number
  created_at: string
  subjects: {
    id: number
    name: string
    code: string
    semester: number
  } | null
  exam_types: {
    id: number
    name: string
  } | null
  users: {
    name: string | null
    username: string | null
    cu_verified: boolean | null
    role: string | null
  } | null
}

/**
 * Fetches real student-uploaded and admin-verified Reappear / Remedial resources
 * from Supabase, matching exam_types (Reappear PYQ, Reappear Question Paper,
 * Reappear Study Material, Reappear Important Questions, Reappear Assignment, Reappear Syllabus).
 */
export async function getLiveReappearResources(semester?: number): Promise<LiveReappearResource[]> {
  try {
    const supabase = getSupabaseAdmin()

    // 1. Fetch all exam_type IDs matching Reappear or Remedial
    const { data: etData, error: etError } = await supabase
      .from('exam_types')
      .select('id, name')
      .or('name.ilike.%reappear%,name.ilike.%remedial%')

    if (etError) {
      console.warn('Could not query exam_types for reappear filter:', etError.message)
    }

    // IDs 12=Reappear Syllabus, 13=Reappear PYQ, 14=Reappear Study Material, 15=Reappear Question Paper, 16=Reappear Important Questions, 17=Reappear Assignment
    const dynamicIds = (etData || []).map(t => t.id)
    const validIds = Array.from(new Set([12, 13, 14, 15, 16, 17, ...dynamicIds]))

    // 2. Query approved resources belonging to these exam_type IDs
    let query = supabase
      .from('resources')
      .select(`
        id, original_filename, file_path, file_type, exam_year, unit, status, download_count, created_at,
        subjects!inner ( id, name, code, semester ),
        exam_types!inner ( id, name ),
        users ( name, username, cu_verified, role )
      `)
      .eq('status', 'approved')
      .in('exam_type_id', validIds)
      .order('created_at', { ascending: false })

    if (semester && semester >= 1 && semester <= 8) {
      query = query.eq('subjects.semester', semester)
    }

    const { data, error } = await query

    if (error) {
      console.error('getLiveReappearResources error:', error)
      return []
    }

    return (data || []) as unknown as LiveReappearResource[]
  } catch (err) {
    console.error('Unhandled getLiveReappearResources error:', err)
    return []
  }
}
