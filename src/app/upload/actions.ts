'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'
import { cookies } from 'next/headers'
import { authAdmin } from '@/lib/firebase/server'
import { v4 as uuidv4 } from 'uuid'
import { revalidatePath } from 'next/cache'
import { isSuperAdminEmail } from '@/lib/auth/admin-check'

export async function checkHashExists(hash: string) {
  const supabase = getSupabaseAdmin()
  
  const { data } = await supabase
    .from('resources')
    .select(`
      id,
      original_filename,
      exam_year,
      subjects ( name, code, semester ),
      exam_types ( name )
    `)
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
  try {
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
    const isSuperAdmin = isSuperAdminEmail(email)
    
    // Ensure user exists in users table (in case user logged in before table was created)
    const { data: userData } = await supabase.from('users').select('id, cu_verified, email, role').eq('id', decoded.uid).maybeSingle()
    
    const isAdmin = isSuperAdmin || userData?.role === 'admin'

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
      if (isSuperAdmin && userData.role !== 'admin') {
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

    // Support 1 to 3 files uploaded at one time
    const filesList = formData.getAll('files') as File[]
    const singleFile = formData.get('file') as File | null
    const rawFiles = filesList && filesList.length > 0 ? filesList : (singleFile ? [singleFile] : [])
    const validFiles = rawFiles.filter(f => f && f.size > 0).slice(0, 3)

    const rawSubjectName = (formData.get('subject_name') as string)?.trim()
    const rawSubjectId = formData.get('subject_id') as string
    const subjectCode = (formData.get('subject_code') as string)?.trim() || 'CSE'
    const year = parseInt(formData.get('year') as string || '1')
    const semester = parseInt(formData.get('semester') as string || '1')
    
    const resourceCategory = (formData.get('resource_category') as string)?.trim() || 'exam_paper'
    const rawMaterialType = (formData.get('material_type') as string)?.trim()
    const rawExamType = (resourceCategory === 'study_material' && rawMaterialType)
      ? rawMaterialType
      : (formData.get('exam_type') as string)?.trim() || (formData.get('exam_type_id') as string) || rawMaterialType

    const rawExamYear = formData.get('exam_year') as string || formData.get('material_year') as string
    const examYear = parseInt(rawExamYear || String(new Date().getFullYear()))
    const fileHash = (formData.get('file_hash') as string) || `hash-${Date.now()}`
    const unit = resourceCategory === 'study_material'
      ? ((formData.get('unit') as string)?.trim() || null)
      : null

    if (validFiles.length === 0 || (!rawSubjectName && !rawSubjectId) || !rawExamType || !examYear) {
      return { 
        error: resourceCategory === 'study_material'
          ? 'Please fill in Subject Name, Material Type, Academic Year, and select at least one file (up to 3).'
          : 'All fields are required. Please fill in Subject Name, Exam Type, Year, and select at least one file (up to 3).' 
      }
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

    // 3. Resolve or Create Exam / Material Type (MST1, MST2, EST, Notes, Syllabus, etc.)
    let resolvedExamTypeId: number
    if (!isNaN(parseInt(rawExamType))) {
      resolvedExamTypeId = parseInt(rawExamType)
    } else {
      const trimmedType = rawExamType.trim()
      const cleanUpperType = trimmedType.toUpperCase().replace(/\s+/g, '')

      // Check exact / case-insensitive or stripped match
      const { data: existingET } = await supabase
        .from('exam_types')
        .select('id, name')
        .or(`name.ilike."${trimmedType}",name.ilike."${cleanUpperType}"`)
        .maybeSingle()

      if (existingET) {
        resolvedExamTypeId = existingET.id
      } else {
        const insertName = ['MST1', 'MST2', 'EST'].includes(cleanUpperType) ? cleanUpperType : trimmedType
        const { data: newET, error: etError } = await supabase
          .from('exam_types')
          .insert({ name: insertName })
          .select('id')
          .single()

        if (etError || !newET) {
          return { error: `Failed to register category/type: ${etError?.message}` }
        }
        resolvedExamTypeId = newET.id
      }
    }

    // 4. Validate file type and extension
    const allowedTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/png', 
      'image/jpg', 
      'image/webp',
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
      'application/vnd.ms-powerpoint', 
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    ]
    // 5. Ensure 'resources' storage bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some(b => b.name === 'resources')
      if (!bucketExists) {
        await supabase.storage.createBucket('resources', {
          public: true,
          fileSizeLimit: 52428800 // 50MB
        })
      }
    } catch (bucketCheckErr) {
      console.warn("Could not check/create bucket:", bucketCheckErr)
    }

    const status = isAdmin ? 'approved' : 'pending'
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
    
    // Process and upload each file (supports 1 to 3 files uploaded at one time)
    for (let i = 0; i < validFiles.length; i++) {
      const currentFile = validFiles[i]
      const extension = (currentFile.name.split('.').pop() || '').toLowerCase()

      if (!allowedExtensions.includes(extension)) {
        return { error: `Invalid format for "${currentFile.name}". Accepted: PDF, JPG, PNG, DOC/DOCX, XLS/XLSX, PPT/PPTX` }
      }

      const filePath = `${uuidv4()}.${extension}`
      const arrayBuffer = await currentFile.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const mimeType = currentFile.type || (
        extension === 'pdf' ? 'application/pdf' :
        ['jpg', 'jpeg'].includes(extension) ? 'image/jpeg' :
        extension === 'png' ? 'image/png' : 'application/octet-stream'
      )

      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, buffer, {
          contentType: mimeType,
          upsert: false
        })

      if (uploadError) {
        return { error: `Failed to upload "${currentFile.name}": ${uploadError.message}` }
      }

      const displayName = validFiles.length > 1
        ? `${currentFile.name} (Part ${i + 1} of ${validFiles.length})`
        : currentFile.name

      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          subject_id: resolvedSubjectId,
          exam_type_id: resolvedExamTypeId,
          exam_year: examYear,
          file_path: filePath,
          file_type: mimeType,
          original_filename: displayName,
          file_hash: `${fileHash}-${i}`,
          uploaded_by: decoded.uid,
          status: status,
          unit: unit
        })

      if (dbError) {
        return { error: `Database error: ${dbError.message}` }
      }
    }

    revalidatePath('/study-material')
    revalidatePath('/browse')
    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true, count: validFiles.length, isAdminUpload: isAdmin }
  } catch (err: unknown) {
    console.error('Unhandled uploadResource error:', err)
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during upload.'
    return { error: message }
  }
}

export interface PrepareDirectUploadInput {
  subject_name: string
  subject_id?: string
  subject_code?: string
  year: number
  semester: number
  resource_category: string
  material_type?: string
  exam_type?: string
  exam_year: number
  unit?: string | null
  file_hash: string
  files: Array<{
    name: string
    size: number
    type: string
  }>
}

export interface PreparedUploadFile {
  originalFilename: string
  displayName: string
  filePath: string
  signedUrl: string
  token: string
  mimeType: string
}

export interface PrepareDirectUploadResponse {
  error?: string
  success?: boolean
  preparedFiles?: PreparedUploadFile[]
  resolvedSubjectId?: number
  resolvedExamTypeId?: number
  examYear?: number
  unit?: string | null
  fileHash?: string
  isAdmin?: boolean
}

export interface CompleteDirectUploadInput {
  resolvedSubjectId: number
  resolvedExamTypeId: number
  examYear: number
  unit?: string | null
  fileHash: string
  files: Array<{
    filePath: string
    displayName: string
    mimeType: string
  }>
}

export interface CompleteDirectUploadResponse {
  error?: string
  success?: boolean
  count?: number
  isAdminUpload?: boolean
}

/**
 * Prepares direct-to-storage upload session:
 * 1. Authenticates user
 * 2. Validates metadata and generates required branch/subject/exam records
 * 3. Creates presigned upload URLs in Supabase storage for each file
 * Bypasses Next.js Server Action body limits and serverless 6MB payload limits.
 */
export async function prepareDirectUpload(
  input: PrepareDirectUploadInput
): Promise<PrepareDirectUploadResponse> {
  try {
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
    const isSuperAdmin = isSuperAdminEmail(email)

    // Ensure user exists in users table
    const { data: userData } = await supabase
      .from('users')
      .select('id, cu_verified, email, role')
      .eq('id', decoded.uid)
      .maybeSingle()

    const isAdmin = isSuperAdmin || userData?.role === 'admin'

    if (!userData) {
      const fallbackUsername = email
        ? email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').toLowerCase()
        : `user_${decoded.uid.slice(0, 5)}`
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
      if (isSuperAdmin && userData.role !== 'admin') {
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

    // Validate files list
    const incomingFiles = (input.files || []).filter(f => f && f.size > 0).slice(0, 3)
    if (incomingFiles.length === 0) {
      return { error: 'Please select at least one file (up to 3) to upload.' }
    }

    for (const f of incomingFiles) {
      if (f.size > 52428800) {
        return { error: `File "${f.name}" exceeds the 50MB size limit. Please select a smaller file.` }
      }
    }

    const rawSubjectName = input.subject_name?.trim()
    const rawSubjectId = input.subject_id
    const resourceCategory = input.resource_category || 'exam_paper'
    const rawMaterialType = input.material_type?.trim()
    const rawExamType = (resourceCategory === 'study_material' && rawMaterialType)
      ? rawMaterialType
      : (input.exam_type?.trim() || rawMaterialType || 'MST1')

    const examYear = input.exam_year || new Date().getFullYear()

    if ((!rawSubjectName && !rawSubjectId) || !rawExamType || !examYear) {
      return {
        error: resourceCategory === 'study_material'
          ? 'Please fill in Subject Name, Material Type, Academic Year, and select at least one file.'
          : 'All fields are required. Please fill in Subject Name, Exam Type, Year, and select at least one file.'
      }
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
      const { data: existingSubject } = await supabase
        .from('subjects')
        .select('id')
        .ilike('name', subjectName)
        .eq('year', input.year)
        .eq('semester', input.semester)
        .maybeSingle()

      if (existingSubject) {
        resolvedSubjectId = existingSubject.id
      } else {
        const { data: newSubject, error: subError } = await supabase
          .from('subjects')
          .insert({
            branch_id: branchId,
            year: input.year,
            semester: input.semester,
            name: subjectName,
            code: (input.subject_code || 'CSE').trim().toUpperCase()
          })
          .select('id')
          .single()

        if (subError || !newSubject) {
          return { error: `Failed to create subject "${subjectName}": ${subError?.message}` }
        }
        resolvedSubjectId = newSubject.id
      }
    }

    // 3. Resolve or Create Exam / Material Type
    let resolvedExamTypeId: number
    if (!isNaN(parseInt(rawExamType))) {
      resolvedExamTypeId = parseInt(rawExamType)
    } else {
      const trimmedType = rawExamType.trim()
      const cleanUpperType = trimmedType.toUpperCase().replace(/\s+/g, '')

      const { data: existingET } = await supabase
        .from('exam_types')
        .select('id, name')
        .or(`name.ilike."${trimmedType}",name.ilike."${cleanUpperType}"`)
        .maybeSingle()

      if (existingET) {
        resolvedExamTypeId = existingET.id
      } else {
        const insertName = ['MST1', 'MST2', 'EST'].includes(cleanUpperType) ? cleanUpperType : trimmedType
        const { data: newET, error: etError } = await supabase
          .from('exam_types')
          .insert({ name: insertName })
          .select('id')
          .single()

        if (etError || !newET) {
          return { error: `Failed to register category/type: ${etError?.message}` }
        }
        resolvedExamTypeId = newET.id
      }
    }

    // 4. Ensure bucket exists
    try {
      const { data: buckets } = await supabase.storage.listBuckets()
      const bucketExists = buckets?.some(b => b.name === 'resources')
      if (!bucketExists) {
        await supabase.storage.createBucket('resources', {
          public: true,
          fileSizeLimit: 52428800 // 50MB
        })
      }
    } catch (bucketCheckErr) {
      console.warn('Could not check/create bucket:', bucketCheckErr)
    }

    // 5. Generate signed upload URLs for each file
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx']
    const preparedFiles: PreparedUploadFile[] = []

    for (let i = 0; i < incomingFiles.length; i++) {
      const cur = incomingFiles[i]
      const extension = (cur.name.split('.').pop() || '').toLowerCase()

      if (!allowedExtensions.includes(extension)) {
        return { error: `Invalid format for "${cur.name}". Accepted: PDF, JPG, PNG, DOC/DOCX, XLS/XLSX, PPT/PPTX` }
      }

      const filePath = `${uuidv4()}.${extension}`
      const mimeType = cur.type || (
        extension === 'pdf' ? 'application/pdf' :
        ['jpg', 'jpeg'].includes(extension) ? 'image/jpeg' :
        extension === 'png' ? 'image/png' : 'application/octet-stream'
      )

      const { data: signedData, error: signError } = await supabase.storage
        .from('resources')
        .createSignedUploadUrl(filePath)

      if (signError || !signedData) {
        return { error: `Failed to initialize storage for "${cur.name}": ${signError?.message || 'Storage error'}` }
      }

      const displayName = incomingFiles.length > 1
        ? `${cur.name} (Part ${i + 1} of ${incomingFiles.length})`
        : cur.name

      preparedFiles.push({
        originalFilename: cur.name,
        displayName,
        filePath,
        signedUrl: signedData.signedUrl,
        token: signedData.token,
        mimeType
      })
    }

    return {
      success: true,
      preparedFiles,
      resolvedSubjectId,
      resolvedExamTypeId,
      examYear,
      unit: resourceCategory === 'study_material' ? (input.unit?.trim() || null) : null,
      fileHash: input.file_hash || `hash-${Date.now()}`,
      isAdmin
    }
  } catch (err: unknown) {
    console.error('Unhandled prepareDirectUpload error:', err)
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during preparation.'
    return { error: message }
  }
}

/**
 * Finalizes direct upload after the browser has uploaded files to Supabase Storage:
 * 1. Authenticates user
 * 2. Inserts resource database records with matching metadata
 * 3. Revalidates paths
 */
export async function completeDirectUpload(
  input: CompleteDirectUploadInput
): Promise<CompleteDirectUploadResponse> {
  try {
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
    const isSuperAdmin = isSuperAdminEmail(email)

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', decoded.uid)
      .maybeSingle()

    const isAdmin = isSuperAdmin || userData?.role === 'admin'
    const status = isAdmin ? 'approved' : 'pending'

    for (let i = 0; i < input.files.length; i++) {
      const f = input.files[i]
      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          subject_id: input.resolvedSubjectId,
          exam_type_id: input.resolvedExamTypeId,
          exam_year: input.examYear,
          file_path: f.filePath,
          file_type: f.mimeType,
          original_filename: f.displayName,
          file_hash: `${input.fileHash}-${i}`,
          uploaded_by: decoded.uid,
          status: status,
          unit: input.unit || null
        })

      if (dbError) {
        return { error: `Database error while saving "${f.displayName}": ${dbError.message}` }
      }
    }

    revalidatePath('/study-material')
    revalidatePath('/browse')
    revalidatePath('/admin')
    revalidatePath('/')

    return { success: true, count: input.files.length, isAdminUpload: isAdmin }
  } catch (err: unknown) {
    console.error('Unhandled completeDirectUpload error:', err)
    const message = err instanceof Error ? err.message : 'An unexpected error occurred while saving records.'
    return { error: message }
  }
}
