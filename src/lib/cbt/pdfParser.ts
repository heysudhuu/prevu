import { CbtQuestionType } from './types'

export interface ParsedMcqItem {
  id: string
  question: string
  type: CbtQuestionType
  options: { id: string; text: string }[]
  correctAnswers: string[]
  explanation: string
  sectionName?: string
}

/**
 * Intelligent parser that converts raw PDF text or question bank transcripts
 * into structured MCQ objects with options, correct answer keys, and explanations.
 */
export function parseMcqText(rawText: string): ParsedMcqItem[] {
  if (!rawText || !rawText.trim()) return []

  const cleanText = rawText.replace(/\r\n/g, '\n')
  const lines = cleanText.split('\n')

  const parsedItems: ParsedMcqItem[] = []
  let currentSection = 'General'

  // Temporary buffer for currently active question
  let currentQ: {
    number?: string
    text: string
    options: { id: string; text: string }[]
    correctAnswers: string[]
    explanation: string
    sectionName?: string
  } | null = null

  // Map to hold answer keys parsed from separate "Answer Key & Explanations" sections
  const answerKeyMap: Record<string, { correct: string[]; explanation: string }> = {}

  // Regex patterns
  const sectionHeaderRegex = /^(?:Section|Part|Set)\s+([A-Z0-9]+)[:\s]+(.*)/i
  const questionStartRegex = /^(?:Q|Question)\s*(\d+)[\.:\s]+(.*)/i
  const optionRegex = /^[■\u25A0\u2022\-\*]?\s*([A-F])[\.:\)\s]+(.*)/i
  const inlineAnswerRegex = /(?:Correct\s+answer|Answer|Ans)[\s:]+([A-F,\s]+)/i
  const quickAnswerKeyRegex = /Q(\d+)\s+([A-F,\s]+)/gi

  // Pre-pass: Extract Answer Keys if there's a dedicated Answer Key section
  const answerKeySectionIdx = lines.findIndex(l => /Answer\s+Key\s+&\s+Explanations/i.test(l))
  if (answerKeySectionIdx !== -1) {
    let currentKeyQ: string | null = null
    let currentExplLines: string[] = []

    for (let i = answerKeySectionIdx; i < lines.length; i++) {
      const line = lines[i].trim()
      const keyMatch = line.match(/^(?:Q|Question)\s*(\d+)[\.:\s]+(?:Correct\s+answer|Ans|Answer)?[\s:]*([A-F,\s]+)/i)
      
      if (keyMatch) {
        if (currentKeyQ && answerKeyMap[currentKeyQ]) {
          answerKeyMap[currentKeyQ].explanation = currentExplLines.join(' ').trim()
        }
        currentKeyQ = keyMatch[1]
        const keys = keyMatch[2]
          .split(/[,;\s]+/)
          .map(k => k.trim().toUpperCase())
          .filter(k => /^[A-F]$/.test(k))

        answerKeyMap[currentKeyQ] = {
          correct: keys,
          explanation: ''
        }
        currentExplLines = []
      } else if (currentKeyQ && line && !/Answer Key/i.test(line) && !/Quick Revision/i.test(line)) {
        currentExplLines.push(line)
      }
    }

    if (currentKeyQ && answerKeyMap[currentKeyQ]) {
      answerKeyMap[currentKeyQ].explanation = currentExplLines.join(' ').trim()
    }
  }

  // Main pass: Extract questions and options
  const flushCurrentQuestion = () => {
    if (currentQ && currentQ.text && currentQ.options.length >= 2) {
      const qNum = currentQ.number || String(parsedItems.length + 1)
      const lookup = answerKeyMap[qNum]

      const finalCorrect = currentQ.correctAnswers.length > 0 
        ? currentQ.correctAnswers 
        : lookup?.correct || ['A']

      const finalExplanation = currentQ.explanation || lookup?.explanation || ''

      const isMultiple = finalCorrect.length > 1 || 
        /select all that apply/i.test(currentQ.text) || 
        /which of the following are/i.test(currentQ.text)

      parsedItems.push({
        id: `auto-mcq-${parsedItems.length + 1}`,
        question: currentQ.text.trim(),
        type: isMultiple ? 'multiple' : 'single',
        options: currentQ.options,
        correctAnswers: finalCorrect,
        explanation: finalExplanation,
        sectionName: currentQ.sectionName || currentSection
      })
    }
    currentQ = null
  }

  const endScanIdx = answerKeySectionIdx !== -1 ? answerKeySectionIdx : lines.length

  for (let i = 0; i < endScanIdx; i++) {
    const rawLine = lines[i]
    const line = rawLine.trim()
    if (!line) continue

    // Check for Section Header
    const secMatch = line.match(sectionHeaderRegex)
    if (secMatch) {
      currentSection = `${secMatch[1]}: ${secMatch[2].trim()}`
      continue
    }

    // Check for Question start: e.g. "Q1. Which of the following..."
    const qMatch = line.match(questionStartRegex)
    if (qMatch) {
      flushCurrentQuestion()
      currentQ = {
        number: qMatch[1],
        text: qMatch[2],
        options: [],
        correctAnswers: [],
        explanation: '',
        sectionName: currentSection
      }
      continue
    }

    // Check for Options: e.g. "■ A. Weak server-side controls" or "A. ..."
    const optMatch = line.match(optionRegex)
    if (optMatch && currentQ) {
      const letter = optMatch[1].toUpperCase()
      const text = optMatch[2].trim()
      currentQ.options.push({
        id: letter,
        text
      })
      continue
    }

    // Check for Inline Answer key: e.g. "Answer: A, B"
    const ansMatch = line.match(inlineAnswerRegex)
    if (ansMatch && currentQ) {
      const keys = ansMatch[1]
        .split(/[,;\s]+/)
        .map(k => k.trim().toUpperCase())
        .filter(k => /^[A-F]$/.test(k))
      currentQ.correctAnswers = keys
      continue
    }

    // Append multi-line question text or option text
    if (currentQ) {
      if (currentQ.options.length > 0) {
        // Append to last option
        const lastOpt = currentQ.options[currentQ.options.length - 1]
        lastOpt.text = `${lastOpt.text} ${line}`
      } else {
        // Append to question text
        currentQ.text = `${currentQ.text} ${line}`
      }
    }
  }

  flushCurrentQuestion()

  return parsedItems
}
