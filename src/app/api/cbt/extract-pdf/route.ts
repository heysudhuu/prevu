import { NextRequest, NextResponse } from 'next/server'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No PDF file uploaded.' }, { status: 400 })
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
    if (!isPdf) {
      return NextResponse.json({ error: 'The uploaded file is not a valid PDF document.' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const uint8 = new Uint8Array(arrayBuffer)

    const { PDFParse } = require('pdf-parse')
    const parser = new PDFParse(uint8)
    await parser.load()
    const result = await parser.getText()

    const extractedText = typeof result?.text === 'string' 
      ? result.text 
      : (result?.pages?.map((p: any) => p.text).join('\n') || '')

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileSize: file.size,
      pages: result?.total || result?.pages?.length || 1,
      text: extractedText
    })
  } catch (error: any) {
    console.error('PDF text extraction error:', error)
    return NextResponse.json(
      { error: error?.message || 'Failed to extract text from PDF document.' },
      { status: 500 }
    )
  }
}
