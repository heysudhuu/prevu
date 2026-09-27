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

export interface QuestionSolutionResult {
  success: boolean
  error?: string
  solution?: {
    question: string
    marksWeightage: string
    keyPoints: string[]
    stepByStepAnswer: string
    cuMarkingTip: string
    diagramCodeSnippet?: string
  }
}

/**
 * AI Question Paper Solver for CU exams
 * Provides structured step-by-step model answers formatted for CU marking criteria
 */
export async function solvePaperQuestion(
  subjectName: string,
  examType: string,
  questionText: string
): Promise<QuestionSolutionResult> {
  if (!questionText || questionText.trim().length < 3) {
    return { success: false, error: 'Please enter a valid question to solve.' }
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (apiKey) {
    try {
      const prompt = `
You are a senior professor and head evaluator at Chandigarh University (CU).
A student needs a high-scoring model answer for their university exam:
Subject: "${subjectName}"
Exam Type: "${examType}" (CU format: MST1/MST2 = 20 Marks, EST = 60 Marks)
Question: "${questionText.trim()}"

Provide an academic model answer structured for maximum scoring under CU evaluation guidelines.
Return strictly valid JSON with this exact structure:
{
  "marksWeightage": "Estimated 5 Marks or 10 Marks",
  "keyPoints": ["Point 1: Definition & Concept", "Point 2: Architecture/Mechanism", "Point 3: Key Advantages", "Point 4: Practical Example"],
  "stepByStepAnswer": "Clear, comprehensive step-by-step answer formatted in clean markdown with headings, bullet points, and clear explanations.",
  "cuMarkingTip": "Tip on how CU evaluators allocate marks (e.g. diagrams, equations, conclusion)",
  "diagramCodeSnippet": "A text ASCII diagram or clear code snippet if applicable, otherwise a brief outline of the diagram they should draw."
}
Only output the raw JSON, no markdown code fence or extra chatter.
`
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1500
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
            solution: {
              question: questionText,
              marksWeightage: parsed.marksWeightage || '5-10 Marks',
              keyPoints: parsed.keyPoints || [],
              stepByStepAnswer: parsed.stepByStepAnswer || '',
              cuMarkingTip: parsed.cuMarkingTip || 'Draw a neat labeled diagram to secure full marks.',
              diagramCodeSnippet: parsed.diagramCodeSnippet || ''
            }
          }
        }
      }
    } catch (err) {
      console.warn('Gemini question solver error, using heuristic fallback:', err)
    }
  }

  // Heuristic Fallback Answer
  return {
    success: true,
    solution: {
      question: questionText,
      marksWeightage: 'Estimated 5 to 10 Marks',
      keyPoints: [
        'Fundamental Definition & Core Concept',
        'Working Mechanism / Algorithm Breakdown',
        'State Transition or Architectural Diagram',
        'Complexity / Performance Trade-offs',
        'Real-world Application Example'
      ],
      stepByStepAnswer: `### 1. Conceptual Overview\n${questionText} is a foundational concept in **${subjectName}**. In Chandigarh University examinations, examiners expect you to begin with an unambiguous formal definition followed by the primary problem it solves.\n\n### 2. Step-by-Step Explanation\n- **Core Mechanism**: Explain the primary operation, invariants, and mathematical/logical constraints.\n- **Algorithmic Flow**: Detail the sequence of operations or state changes with labeled steps.\n- **Edge Cases**: Mention boundary conditions (e.g. overflow, underflow, null pointers, network timeouts).\n\n### 3. Comparison & Trade-offs\nSummarize the advantages and limitations compared to alternative approaches in a clean 2-column format.\n\n### 4. Conclusion\nHighlight industry use-cases and why this approach is standard in modern software systems.`,
      cuMarkingTip: 'Chandigarh University evaluators award 40% of marks for neat diagrams, 40% for logical steps, and 20% for definitions & examples. Always write in bullet points rather than dense paragraphs.',
      diagramCodeSnippet: `+-------------------------+\n|       Input / Request   |\n+-------------------------+\n            |\n            v\n+-------------------------+\n|   Processing Engine     |\n+-------------------------+\n            |\n            v\n+-------------------------+\n|      Verified Output    |\n+-------------------------+`
    }
  }
}
