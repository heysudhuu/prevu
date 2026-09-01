'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'

export async function checkHashExists(hash: string) {
  const supabase = getSupabaseAdmin()
  
  const { data } = await supabase
    .from('resources')
    .select('id, original_filename')
    .eq('file_hash', hash)
    .eq('status', 'approved')
    .limit(1)

  return data && data.length > 0 ? data[0] : null
}

export async function getFormDataOptions() {
  const supabase = getSupabaseAdmin()
  
  // Fetch branches
  const { data: branches } = await supabase.from('branches').select('*')
  
  // Fetch subjects
  const { data: subjects } = await supabase.from('subjects').select('*').order('name')
  
  // Fetch exam types
  const { data: examTypes } = await supabase.from('exam_types').select('*').order('id')
  
  return { branches, subjects, examTypes }
}

export async function uploadResource(formData: FormData) {
  const token = (await cookies()).get('firebase-token')?.value
  
  if (!token) {
    return { error: 'Please log in to upload materials.' }
  }

  let decoded
  try {
    decoded = await authAdmin.verifyIdToken(token)
  } catch {
    return { error: 'Invalid or expired authentication session. Please log in again.' }
  }

  const supabase = getSupabaseAdmin()
  const email = decoded.email?.toLowerCase() || ''
  const isSuperAdminEmail = email === 'py7716496@gmail.com'
  
  // Ensure user exists in users table (in case user logged in before table was created)
  const { data: userData } = await supabase.from('users').select('id, cu_verified, email, role').eq('id', decoded.uid).maybeSingle()
  
  const isAdmin = isSuperAdminEmail || userData?.role === 'admin'

  if (!userData) {
    const fallbackUsername = email ? email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase() : `user_${decoded.uid.slice(0, 5)}`
    await supabase.from('users').insert({
      id: decoded.uid,
      name: decoded.name || email.split('@')[0] || (isAdmin ? 'Admin' : 'Student'),
      username: fallbackUsername,
      email: decoded.email,
      cu_verified: email.endsWith('@cuchd.in') ? true : false,
      cu_email: email.endsWith('@cuchd.in') ? decoded.email : null,
      role: isAdmin ? 'admin' : 'student'
    })
  } else {
    const updates: { cu_verified?: boolean; cu_email?: string; role?: string } = {}
    if (isSuperAdminEmail && userData.role !== 'admin') {
      updates.role = 'admin'
    }
    if (!userData.cu_verified && (userData.email?.endsWith('@cuchd.in') || email.endsWith('@cuchd.in'))) {
      updates.cu_verified = true
      updates.cu_email = decoded.email
    }
    if (Object.keys(updates).length > 0) {
      await supabase.from('users').update(updates).eq('id', decoded.uid)
    }
  }

  const file = formData.get('file') as File
  const rawSubjectName = (formData.get('subject_name') as string)?.trim()
  const rawSubjectId = formData.get('subject_id') as string
  const subjectCode = (formData.get('subject_code') as string)?.trim() || 'CSE'
  const year = parseInt(formData.get('year') as string || '1')
  const semester = parseInt(formData.get('semester') as string || '1')
  
  const rawExamType = (formData.get('exam_type') as string)?.trim() || (formData.get('exam_type_id') as string)
  const examYear = parseInt(formData.get('exam_year') as string)
  const fileHash = formData.get('file_hash') as string

  if (!file || (!rawSubjectName && !rawSubjectId) || !rawExamType || !examYear || !fileHash) {
    return { error: 'All fields are required. Please fill in Subject Name, Exam Type, Year, and select a file.' }
  }

  // 1. Resolve or Create Branch
  let branchId = 1
  const { data: branchData } = await supabase.from('branches').select('id').eq('name', 'BE-CSE').maybeSingle()
  if (branchData) {
    branchId = branchData.id
  } else {
    const { data: newBranch } = await supabase.from('branches').insert({ name: 'BE-CSE' }).select('id').maybeSingle()
    if (newBranch) branchId = newBranch.id
  }

  // 2. Resolve or Create Subject
  let resolvedSubjectId: number
  if (rawSubjectId && !isNaN(parseInt(rawSubjectId))) {
    resolvedSubjectId = parseInt(rawSubjectId)
  } else {
    const subjectName = rawSubjectName
    // Check if subject already exists for this year & semester
    const { data: existingSubject } = await supabase
      .from('subjects')
      .select('id')
      .ilike('name', subjectName)
      .eq('year', year)
      .eq('semester', semester)
      .maybeSingle()

    if (existingSubject) {
      resolvedSubjectId = existingSubject.id
    } else {
      const { data: newSubject, error: subError } = await supabase
        .from('subjects')
        .insert({
          branch_id: branchId,
          year: year,
          semester: semester,
          name: subjectName,
          code: subjectCode.toUpperCase()
        })
        .select('id')
        .single()

      if (subError || !newSubject) {
        return { error: `Failed to create subject "${subjectName}": ${subError?.message}` }
      }
      resolvedSubjectId = newSubject.id
    }
  }

  // 3. Resolve or Create Exam Type (MST1, MST2, EST)
  let resolvedExamTypeId: number
  if (!isNaN(parseInt(rawExamType))) {
    resolvedExamTypeId = parseInt(rawExamType)
  } else {
    const cleanExamTypeName = rawExamType.toUpperCase().replace(/\s+/g, '') // e.g. MST1, MST2, EST
    const { data: existingET } = await supabase
      .from('exam_types')
      .select('id')
      .or(`name.ilike.${cleanExamTypeName},name.ilike.${rawExamType}`)
      .maybeSingle()

    if (existingET) {
      resolvedExamTypeId = existingET.id
    } else {
      const { data: newET, error: etError } = await supabase
        .from('exam_types')
        .insert({ name: cleanExamTypeName })
        .select('id')
        .single()

      if (etError || !newET) {
        return { error: `Failed to register exam type: ${etError?.message}` }
      }
      resolvedExamTypeId = newET.id
    }
  }

  // 4. Validate file type
  const allowedTypes = [
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'image/jpg', 
    'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
    'application/vnd.ms-excel', 
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
    'application/vnd.ms-powerpoint', 
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ]
  if (!allowedTypes.includes(file.type)) {
    return { error: 'Invalid file type. Accepted: PDF, JPG, PNG, DOC/DOCX, XLS/XLSX, PPT/PPTX' }
  }

  const extension = file.name.split('.').pop()
  const filePath = `${uuidv4()}.${extension}`

  // 5. Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('resources')
    .upload(filePath, file)

  if (uploadError) {
    return { error: `Failed to upload file to storage: ${uploadError.message}` }
  }

  // 6. If uploaded by Admin, auto-approve immediately!
  const status = isAdmin ? 'approved' : 'pending'

  const { error: dbError } = await supabase
    .from('resources')
    .insert({
      subject_id: resolvedSubjectId,
      exam_type_id: resolvedExamTypeId,
      exam_year: examYear,
      file_path: filePath,
      file_type: file.type,
      original_filename: file.name,
      file_hash: fileHash,
      uploaded_by: decoded.uid,
      status: status
    })

  if (dbError) {
    return { error: `Database error: ${dbError.message}` }
  }

  revalidatePath('/browse')
  revalidatePath('/admin')
  revalidatePath('/')

  return { success: true, isAdminUpload: isAdmin }
}
