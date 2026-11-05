'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCcw, 
  ChevronDown, 
  Copy, 
  Check, 
  BookOpen, 
  GraduationCap, 
  Zap, 
  Flame,
  Maximize2,
  Minimize2
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

const QUICK_PROMPTS = [
  { label: 'Banker\'s Algorithm', prompt: 'Explain the Banker\'s Algorithm step-by-step with safety check matrix calculation for OS exam.' },
  { label: 'Cayley-Hamilton Theorem', prompt: 'State and prove Cayley-Hamilton Theorem with a 3x3 matrix example for Engineering Mathematics.' },
  { label: '72h Reappear Rescue', prompt: 'I have an EST exam in 3 days and need 24/60 to pass. Give me an 80/20 strategy for high-yield units.' },
  { label: 'Unit 1 & 2 PYQs', prompt: 'What are the top 5 most repeated 10-mark questions for MST-1 in Computer Science?' },
]

export default function GlobalAcademicChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `👋 **Hey Scholar! I'm Vee**, your Prevu AI Academic Tutor powered by **OpenAI gpt-4o-mini**.\n\nI specialize in **Chandigarh University BE-CSE curriculum**, PYQ solutions, and backlog clearance. Ask me anything from complex derivations to 72-hour exam blueprints!`,
      timestamp: 'Just now'
    }
  ])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Listen for custom trigger events from anywhere in the app (e.g. mascot or buttons)
  useEffect(() => {
    const handleOpenChat = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt?: string }>
      setIsOpen(true)
      if (customEvent.detail?.prompt) {
        handleSendPrompt(customEvent.detail.prompt)
      }
    }
    window.addEventListener('prevu:open-ai-chat', handleOpenChat)
    return () => window.removeEventListener('prevu:open-ai-chat', handleOpenChat)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen, isLoading])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200)
    }
  }, [isOpen])

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClear = () => {
    setMessages([
      {
        id: 'welcome-new',
        role: 'assistant',
        content: `Conversation reset. What topic or exam question would you like to tackle next?`,
        timestamp: 'Just now'
      }
    ])
  }

  const handleSendPrompt = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim()
    if (!messageContent || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageContent,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    if (!textToSend) setInput('')
    setIsLoading(true)

    try {
      // Build conversation payload
      const history = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history })
      })

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`)
      }

      const data = await res.json()
      const reply = data?.message?.content || 'I could not generate a response. Please check your query or try again.'

      setMessages(prev => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ])
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: `⚠️ *Network connectivity notice*: Could not reach Vee AI service. Please verify your connection or try a shorter question.`,
          timestamp: 'Just now'
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendPrompt()
    }
  }

  // Render markdown with syntax highlights
  const renderFormattedText = (content: string) => {
    // Split code blocks
    const parts = content.split(/(```[\s\S]*?```)/g)
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const lines = part.slice(3, -3).trim().split('\n')
        const firstLine = lines[0].trim()
        const isLang = /^[a-z0-9_-]+$/i.test(firstLine)
        const code = isLang ? lines.slice(1).join('\n') : lines.join('\n')

        return (
          <pre key={index} className="my-2 p-3 rounded-lg bg-[#010409] border border-[#30363d] overflow-x-auto text-[12px] font-mono text-[#58a6ff]">
            <code>{code}</code>
          </pre>
        )
      }

      // Format bold, bullet points, headers
      const lines = part.split('\n')
      return (
        <div key={index} className="space-y-1">
          {lines.map((line, lIdx) => {
            if (!line.trim()) return <div key={lIdx} className="h-1.5" />
            
            // Header
            if (line.startsWith('### ')) {
              return <h4 key={lIdx} className="font-bold text-[#58a6ff] text-sm mt-2">{line.replace('### ', '')}</h4>
            }
            if (line.startsWith('## ')) {
              return <h3 key={lIdx} className="font-bold text-[#38bdf8] text-base mt-2.5">{line.replace('## ', '')}</h3>
            }
            if (line.startsWith('# ')) {
              return <h2 key={lIdx} className="font-bold text-[#e6edf3] text-lg mt-3">{line.replace('# ', '')}</h2>
            }

            // Bullet points
            const isBullet = line.trim().startsWith('- ') || line.trim().startsWith('* ')
            const cleanLine = isBullet ? line.trim().replace(/^[-*]\s+/, '') : line

            // Parse inline bold **text** and `code`
            const renderedTokens = cleanLine.split(/(\*\*.*?\*\*|`.*?`)/g).map((token, tIdx) => {
              if (token.startsWith('**') && token.endsWith('**')) {
                return <strong key={tIdx} className="text-[#f0f6fc] font-semibold">{token.slice(2, -2)}</strong>
              }
              if (token.startsWith('`') && token.endsWith('`')) {
                return <code key={tIdx} className="px-1 py-0.5 rounded bg-[#161b22] text-[#3fb950] font-mono text-[11px] border border-[#30363d]/60">{token.slice(1, -1)}</code>
              }
              return token
            })

            if (isBullet) {
              return (
                <div key={lIdx} className="flex items-start gap-2 pl-1 text-[13px] text-[#c9d1d9]">
                  <span className="text-[#3fb950] mt-1 font-bold">•</span>
                  <div className="flex-1">{renderedTokens}</div>
                </div>
              )
            }

            return <p key={lIdx} className="text-[13px] text-[#c9d1d9] leading-relaxed">{renderedTokens}</p>
          })}
        </div>
      )
    })
  }

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-28 z-40">
        <motion.button
          onClick={() => setIsOpen(prev => !prev)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#0d1117] hover:bg-[#161b22] border-2 border-[#238636] shadow-xl shadow-[#238636]/20 text-[#e6edf3] font-mono text-xs transition-colors backdrop-blur-md group"
          title="Open Vee AI Academic Chatbot"
        >
          <div className="relative">
            <Bot className="w-4 h-4 text-[#3fb950] group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#3fb950] animate-ping" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#3fb950]" />
          </div>
          <span className="font-semibold tracking-wide flex items-center gap-1.5">
            Ask Vee AI
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/40 hidden sm:inline-block">
              gpt-4o-mini
            </span>
          </span>
        </motion.button>
      </div>

      {/* Floating Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6 flex flex-col rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-2xl shadow-black/80 overflow-hidden font-sans transition-all duration-300 ${
              isExpanded 
                ? 'w-[95vw] sm:w-[650px] h-[85vh]' 
                : 'w-[95vw] sm:w-[420px] h-[580px]'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-[#30363d]">
              <div className="flex items-center gap-3">
                <div className="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-[#238636] to-[#2ea043] flex items-center justify-center shadow-md">
                  <Bot className="w-4 h-4 text-white" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#3fb950] border-2 border-[#161b22]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-[#f0f6fc]">Vee Academic AI</h3>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#238636]/20 text-[#3fb950] border border-[#238636]/30">
                      CU Tutor
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8b949e]">Online • Powered by OpenAI</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleClear}
                  className="p-1.5 rounded-lg text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors"
                  title="Clear Conversation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="p-1.5 rounded-lg text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors hidden sm:block"
                  title={isExpanded ? 'Minimize' : 'Expand'}
                >
                  {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-[#8b949e] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Bar */}
            <div className="px-3 py-2 bg-[#0d1117] border-b border-[#30363d]/50 flex gap-1.5 overflow-x-auto scrollbar-none">
              {QUICK_PROMPTS.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(qp.prompt)}
                  disabled={isLoading}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#161b22] hover:bg-[#21262d] text-[#8b949e] hover:text-[#58a6ff] border border-[#30363d]/60 transition-colors flex items-center gap-1"
                >
                  <Sparkles className="w-2.5 h-2.5 text-[#3fb950]" />
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`relative max-w-[88%] rounded-2xl p-3.5 text-sm ${
                      msg.role === 'user'
                        ? 'bg-[#1f6feb] text-white rounded-br-none'
                        : 'bg-[#161b22] text-[#c9d1d9] border border-[#30363d]/80 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {renderFormattedText(msg.content)}

                    {/* Copy action for assistant responses */}
                    {msg.role === 'assistant' && msg.id !== 'welcome' && (
                      <div className="mt-2.5 pt-2 border-t border-[#30363d]/40 flex items-center justify-between text-[10px] text-[#8b949e]">
                        <span className="font-mono">CU Blueprint Verified</span>
                        <button
                          onClick={() => handleCopy(msg.id, msg.content)}
                          className="flex items-center gap-1 hover:text-[#58a6ff] transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-[#3fb950]" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Answer
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-[#8b949e] mt-1 px-1 font-mono">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#238636]/20 border border-[#238636]/40 flex items-center justify-center text-[#3fb950]">
                    <Bot className="w-3.5 h-3.5 animate-bounce" />
                  </div>
                  <div className="p-3 rounded-2xl rounded-bl-none bg-[#161b22] border border-[#30363d] flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse delay-100" />
                      <span className="w-1.5 h-1.5 rounded-full bg-[#3fb950] animate-pulse delay-200" />
                    </div>
                    <span className="text-[11px] text-[#8b949e] font-mono">Vee is compiling answer...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-[#161b22] border-t border-[#30363d]">
              <form
                onSubmit={e => {
                  e.preventDefault()
                  handleSendPrompt()
                }}
                className="flex items-center gap-2"
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask any CU exam question or PYQ..."
                  rows={1}
                  className="flex-1 bg-[#0d1117] border border-[#30363d] focus:border-[#238636] focus:ring-1 focus:ring-[#238636] rounded-xl px-3.5 py-2 text-sm text-[#f0f6fc] placeholder-[#8b949e] resize-none outline-none font-sans max-h-24 scrollbar-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="p-2.5 rounded-xl bg-[#238636] hover:bg-[#2ea043] disabled:opacity-40 disabled:hover:bg-[#238636] text-white transition-all shadow-md flex items-center justify-center"
                  title="Send Question"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#8b949e] font-mono px-1">
                <span>Press Enter to send, Shift+Enter for newline</span>
                <span className="text-[#3fb950] flex items-center gap-1">
                  ● OpenAI Active
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

