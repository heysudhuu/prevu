import { NextRequest, NextResponse } from 'next/server'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const SYSTEM_PROMPT = `You are Vee, the intelligent AI Academic Tutor & Backlog Specialist for Prevu (the premier engineering portal for Chandigarh University scholars).
Your goals:
1. Help engineering students understand core syllabus concepts, solve PYQs (Previous Year Questions), and prepare for MST-1, MST-2, and EST exams.
2. For Reappear / Remedial students, provide high-yield 80/20 tips, identify must-learn units to guarantee passing (24/60 in EST), and break down derivations step-by-step.
3. Be concise, structured, friendly, and academic. Use clear markdown formatting, bullet points, and code blocks for formulas or pseudocode.
4. If a student mentions a course code like 22MAT-101, 23CSH-242, 22CS201, 22CST-390, provide specific exam tips matching Chandigarh University's curriculum.`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { messages } = body as { messages: ChatMessage[] }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 })
    }

    const openaiKey = process.env.OPENAI_API_KEY
    const geminiKey = process.env.GEMINI_API_KEY

    // 1. Try OpenAI if key is available
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...messages.slice(-8) // Send recent context
            ],
            temperature: 0.4,
            max_tokens: 1024
          })
        })

        if (response.ok) {
          const data = await response.json()
          const reply = data?.choices?.[0]?.message?.content
          if (reply) {
            return NextResponse.json({
              success: true,
              message: {
                role: 'assistant',
                content: reply
              },
              provider: 'openai'
            })
          }
        }
      } catch (err) {
        console.warn('OpenAI Chat call failed, falling back:', err)
      }
    }

    // 2. Try Gemini if OpenAI is unavailable or failed
    if (geminiKey) {
      try {
        const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content || ''
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${SYSTEM_PROMPT}\n\nUser Question: ${lastUserMessage}` }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.4,
              maxOutputTokens: 1024
            }
          })
        })

        if (response.ok) {
          const data = await response.json()
          const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text
          if (reply) {
            return NextResponse.json({
              success: true,
              message: {
                role: 'assistant',
                content: reply
              },
              provider: 'gemini'
            })
          }
        }
      } catch (err) {
        console.warn('Gemini fallback failed:', err)
      }
    }

    // 3. Heuristic Academic Fallback for Common University Inquiries
    const latestMsg = messages[messages.length - 1]?.content.toLowerCase() || ''
    let fallbackReply = `Here is the academic blueprint for your inquiry:\n\n`

    if (latestMsg.includes('banker') || latestMsg.includes('deadlock')) {
      fallbackReply += `**Banker's Algorithm Safety Procedure (OS 23CSH-242)**:\n`
      fallbackReply += `1. Calculate Need Matrix: \`Need = Max - Allocation\`.\n`
      fallbackReply += `2. Find a process whose \`Need <= Available\`.\n`
      fallbackReply += `3. Assume it finishes and release its resources: \`Available = Available + Allocation\`.\n`
      fallbackReply += `4. If all processes complete, the state is **SAFE**, preventing deadlock!`
    } else if (latestMsg.includes('cayley') || latestMsg.includes('hamilton') || latestMsg.includes('math')) {
      fallbackReply += `**Cayley-Hamilton Theorem (Math 22MAT-101)**:\n`
      fallbackReply += `1. Find characteristic polynomial: \`|A - λI| = 0\`.\n`
      fallbackReply += `2. Substitute matrix A: \`A^n + c_{n-1}A^{n-1} + ... + c_0 I = 0\`.\n`
      fallbackReply += `3. To find \`A^{-1}\`, multiply by \`A^{-1}\`: \`A^{-1} = -(1/c_0) * [A^{n-1} + ... + c_1 I]\`.`
    } else if (latestMsg.includes('reappear') || latestMsg.includes('backlog') || latestMsg.includes('pass')) {
      fallbackReply += `**72-Hour Backlog Survival Strategy**:\n`
      fallbackReply += `1. **Target EST Pass Mark**: You need **24 / 60 Marks** in theory.\n`
      fallbackReply += `2. **Pareto 80/20 Rule**: Master Unit 1 & Unit 2 completely—they account for up to 35 marks.\n`
      fallbackReply += `3. **Compulsory Section A**: Memorize all definitions from the past 3 EST papers for guaranteed 12+ marks.\n`
      fallbackReply += `4. Check our dedicated **Reappear Rescue Vault** on the homepage for solved derivations!`
    } else {
      fallbackReply += `I am Vee, your Prevu AI Academic Tutor! I can help you with:\n`
      fallbackReply += `• Step-by-step solved PYQ solutions (MST & EST)\n`
      fallbackReply += `• High-yield 80/20 formulas and derivations\n`
      fallbackReply += `• Reappear survival roadmaps & passing mark strategies\n\n`
      fallbackReply += `Try asking: *"Solve Banker's Algorithm"*, *"Explain AVL rotations"*, or *"How to clear Math-1 reappear?"*`
    }

    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: fallbackReply
      },
      provider: 'fallback'
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Failed to process academic chat request.' },
      { status: 500 }
    )
  }
}

