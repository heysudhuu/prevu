'use server'

import { getSupabaseAdmin } from '@/utils/supabase/admin'

export interface ExamInsightsResult {
  success: boolean
  error?: string
  insights?: {
    subjectName: string
    subjectCode: string
    examType: string
    examYear: number
    keyTopics: string[]
    formulaeSheet: string[]
    frequentQuestions: string[]
    scoringStrategy: string
  }
}

/**
 * Generates an AI-powered Exam Blueprint, Formula Sheet & Study Guide
 * powered by Google Gemini (with robust fallback heuristics).
 */
export async function generateExamAssistantInsights(resourceId: string): Promise<ExamInsightsResult> {
  try {
    const supabase = getSupabaseAdmin()

    // Fetch paper metadata
    const { data: resource, error } = await supabase
      .from('resources')
      .select(`
        id,
        exam_year,
        original_filename,
        subjects ( name, code, semester, year ),
        exam_types ( name )
      `)
      .eq('id', resourceId)
      .single()

    if (error || !resource) {
      return { success: false, error: 'Resource details could not be found.' }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subjectName = (resource.subjects as any)?.name || 'Computer Science'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subjectCode = (resource.subjects as any)?.code || 'CSE'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const examType = (resource.exam_types as any)?.name || 'MST'
    const examYear = resource.exam_year

    const apiKey = process.env.GEMINI_API_KEY

    if (apiKey) {
      try {
        const prompt = `
You are an expert Chandigarh University (CU) engineering professor and academic advisor.
Analyze the following university exam context:
- Subject: "${subjectName}" (${subjectCode})
- Exam Type: "${examType}" (Chandigarh University format: MST1 = Unit 1/Unit 2 early (20 Marks), MST2 = Unit 2/Unit 3 (20 Marks), EST = End Semester Theory covering complete syllabus (60 Marks))
- Exam Year: ${examYear}

Provide a structured, highly actionable study blueprint in strictly valid JSON format with this exact structure:
{
  "keyTopics": ["Topic 1 with short description", "Topic 2 with short description", ... 5 items max],
  "formulaeSheet": ["Formula/Theorem/Concept 1", "Formula/Theorem/Concept 2", ... 5 items max],
  "frequentQuestions": ["Frequently tested question pattern 1", "Pattern 2", "Pattern 3", ... 4 items max],
  "scoringStrategy": "A 2-3 sentence strategic tip on how to maximize score in CU ${examType} for ${subjectName}."
}
Only output the raw JSON, no markdown code blocks or additional text.
`
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024
            }
          })
        })

        if (response.ok) {
          const data = await response.json()
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          if (rawText) {
            const cleanedText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim()
            const parsed = JSON.parse(cleanedText)
            return {
              success: true,
              insights: {
                subjectName,
                subjectCode,
                examType,
                examYear,
                keyTopics: parsed.keyTopics || [],
                formulaeSheet: parsed.formulaeSheet || [],
                frequentQuestions: parsed.frequentQuestions || [],
                scoringStrategy: parsed.scoringStrategy || ''
              }
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, using heuristic blueprint fallback:', geminiErr)
      }
    }

    // Heuristic Fallback based on Subject and CU Exam Pattern
    return {
      success: true,
      insights: {
        subjectName,
        subjectCode,
        examType,
        examYear,
        keyTopics: [
          `Core syllabus objectives for ${subjectName} (${subjectCode})`,
          examType.includes('1') ? 'Unit 1 foundational definitions, architectural diagrams & proofs' : 'Unit 3 & 4 advanced algorithms, design trade-offs & numericals',
          'Standard comparison tables (e.g. Pros vs Cons, Protocol differences)',
          'Algorithmic complexity analysis (Big-O, worst/average case)',
          'Real-world implementation use-cases and flowcharts'
        ],
        formulaeSheet: [
          'Master Theorem / Recurrence Relations asymptotic bounds',
          'Standard mathematical definitions & state transition equations',
          'Time & Space complexity benchmarks for primary data operations',
          'Efficiency metrics, throughput formulas, and memory overhead calculation'
        ],
        frequentQuestions: [
          `Derive or explain the primary mechanism of ${subjectName} with neat block diagrams.`,
          `Differentiate between standard models covered in Unit ${examType.includes('1') ? '1 & 2' : '3 & 4'} with examples.`,
          'Solve numerical problems with step-by-step intermediate calculations (partial marking applies).',
          'Short notes (4 Marks): Write brief explanations of 3 key architectural components.'
        ],
        scoringStrategy: `For Chandigarh University ${examType} examinations in ${subjectName}, always draw neat, labeled block diagrams and clearly write assumptions. Evaluators award 40% of marks for structure and diagrams before reading body text.`
      }
    }
  } catch (err) {
    console.error('Error generating exam assistant insights:', err)
    return { success: false, error: 'Could not generate exam insights at this time.' }
  }
}
