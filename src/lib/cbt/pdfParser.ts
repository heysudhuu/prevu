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
  const sectionHeaderRegex = /^(?:Section|Part|Set|Topic)\s*([A-Z0-9]+)?[:\s\-]+(.*)/i
  const questionStartRegex = /^(?:Q|Question|Q#)\s*(\d+)[\.:\s]+(.*)/i
  const numberedQuestionRegex = /^(\d+)[\.:\)]\s+(.*)/i
  const multiOptionLineRegex = /(?:\(([A-Fa-f])\)|(?<=\s|^)([A-Fa-f])[\.:\)])\s*([^()\n]+?)(?=(?:\s*\([A-Fa-f]\)|\s*[A-Fa-f][\.:\)])|$)/g
  const singleOptionRegex = /^[■\u25A0\u2022\-\*]?\s*(?:\(([A-Fa-f])\)|([A-Fa-f])[\.:\)])\s+(.*)/i
  const bulletOptionRegex = /^[■\u25A0\u2022\-\*]\s+(.*)/i
  const answerLineRegex = /^(?:Correct\s+answer|Answer|Ans)[\s:]+(.*)/i
  const explanationLineRegex = /^(?:Working|Explanation|Solution|Sol|Hint)[\s:]+(.*)/i

  // Pre-pass: Extract Answer Keys if there's a dedicated Answer Key section
  const answerKeySectionIdx = lines.findIndex(l => /Answer\s+Key|MASTER\s+ANSWER\s+KEY/i.test(l))
  if (answerKeySectionIdx !== -1) {
    let currentKeyQ: string | null = null
    let currentExplLines: string[] = []

    for (let i = answerKeySectionIdx; i < lines.length; i++) {
      const line = lines[i].trim()
      const keyMatch = line.match(/^(?:Q|Question|Q#)?\s*(\d+)[\.:\s]+(?:Correct\s+answer|Ans|Answer)?[\s:]*([A-F,\s]+)/i)
      
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
    if (secMatch && !currentQ) {
      currentSection = secMatch[2] ? `${secMatch[1] || ''}: ${secMatch[2].trim()}` : line
      continue
    }

    // Check for Question start: "Q1. ...", "Question 1: ...", "1. ..."
    let qNumber: string | null = null
    let qContent: string | null = null

    const qMatch = line.match(questionStartRegex)
    if (qMatch) {
      qNumber = qMatch[1]
      qContent = qMatch[2]
    } else if (!currentQ || currentQ.options.length >= 2) {
      const numMatch = line.match(numberedQuestionRegex)
      // Verify it's not an option number or table
      if (numMatch && parseInt(numMatch[1]) > 0 && parseInt(numMatch[1]) <= 1000 && !/\b(?:kg|litres|days|hours|min|m|cm|Rs)\b/i.test(numMatch[2].slice(0, 15))) {
        qNumber = numMatch[1]
        qContent = numMatch[2]
      }
    }

    if (qNumber !== null && qContent !== null) {
      flushCurrentQuestion()
      currentQ = {
        number: qNumber,
        text: qContent.replace(/QID:\s*\d+/i, '').trim(),
        options: [],
        correctAnswers: [],
        explanation: '',
        sectionName: currentSection
      }
      continue
    }

    // If active question, check for Answer lines: e.g. "Answer: 4% | Let CP = 100..." or "Answer: B - 3:2"
    if (currentQ) {
      const ansMatch = line.match(answerLineRegex)
      if (ansMatch) {
        const fullAns = ansMatch[1].trim()
        
        // Split by pipe if solution follows: "Answer: 4% | Let CP = 100..."
        const parts = fullAns.split('|')
        const ansTarget = parts[0].trim()
        if (parts[1]) {
          currentQ.explanation = parts.slice(1).join('|').trim()
        }

        // Check if explicit letter is given: "Answer: B - 3:2" or "Ans: B"
        const letterMatch = ansTarget.match(/^([A-F])\b/i)
        if (letterMatch) {
          const l = letterMatch[1].toUpperCase()
          if (!currentQ.correctAnswers.includes(l)) {
            currentQ.correctAnswers.push(l)
          }
        } else {
          // Match by text comparison to options: e.g. answer is "4%" and option B is "4%"
          const cleanTarget = ansTarget.replace(/[✓✔\s]/g, '').toLowerCase()
          for (const opt of currentQ.options) {
            const cleanOpt = opt.text.replace(/[✓✔\s]/g, '').toLowerCase()
            if (cleanOpt === cleanTarget || cleanOpt.startsWith(cleanTarget)) {
              if (!currentQ.correctAnswers.includes(opt.id)) {
                currentQ.correctAnswers.push(opt.id)
              }
              break
            }
          }
        }
        continue
      }

      // Check for Explanation / Working lines
      const explMatch = line.match(explanationLineRegex)
      if (explMatch) {
        currentQ.explanation = currentQ.explanation 
          ? `${currentQ.explanation} | ${explMatch[1].trim()}` 
          : explMatch[1].trim()
        continue
      }

      // Check for multi-option lines: e.g. "(A) 2%  (B) 4% ✓"
      const multiMatches = [...line.matchAll(multiOptionLineRegex)]
      if (multiMatches.length >= 2) {
        for (const m of multiMatches) {
          const letter = (m[1] || m[2]).toUpperCase()
          let optText = m[3].trim()
          
          // Check for checkmark
          if (/[✓✔]|\(Official Key\)/i.test(optText)) {
            if (!currentQ.correctAnswers.includes(letter)) {
              currentQ.correctAnswers.push(letter)
            }
            optText = optText.replace(/[✓✔]|\(Official Key\)/gi, '').trim()
          }

          currentQ.options.push({
            id: letter,
            text: optText
          })
        }
        continue
      }

      // Check for single option: e.g. "(A) 2%" or "A. 2%"
      const singleMatch = line.match(singleOptionRegex)
      if (singleMatch) {
        const letter = (singleMatch[1] || singleMatch[2]).toUpperCase()
        let optText = singleMatch[3].trim()

        if (/[✓✔]|\(Official Key\)/i.test(optText)) {
          if (!currentQ.correctAnswers.includes(letter)) {
            currentQ.correctAnswers.push(letter)
          }
          optText = optText.replace(/[✓✔]|\(Official Key\)/gi, '').trim()
        }

        currentQ.options.push({
          id: letter,
          text: optText
        })
        continue
      }

      // Check for bullet option: e.g. "• 10 days"
      const bulletMatch = line.match(bulletOptionRegex)
      if (bulletMatch && currentQ.options.length < 6) {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F']
        const nextLetter = letters[currentQ.options.length]
        let optText = bulletMatch[1].trim()

        if (/[✓✔]|\(Official Key\)/i.test(optText)) {
          if (!currentQ.correctAnswers.includes(nextLetter)) {
            currentQ.correctAnswers.push(nextLetter)
          }
          optText = optText.replace(/[✓✔]|\(Official Key\)/gi, '').trim()
        }

        currentQ.options.push({
          id: nextLetter,
          text: optText
        })
        continue
      }

      // Append multi-line question text or option text
      if (currentQ.options.length > 0) {
        const lastOpt = currentQ.options[currentQ.options.length - 1]
        lastOpt.text = `${lastOpt.text} ${line}`
      } else {
        currentQ.text = `${currentQ.text} ${line}`
      }
    }
  }

  flushCurrentQuestion()

  return parsedItems
}
