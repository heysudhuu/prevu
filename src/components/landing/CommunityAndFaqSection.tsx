'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { submitStudentSuggestion } from '@/app/suggestions/actions'
import { 
  HelpCircle, 
  ChevronDown, 
  MessageSquare, 
  Send, 
  Check, 
  Lightbulb, 
  Sparkles, 
  Users, 
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react'

export default function CommunityAndFaqSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  
  // Suggestion form state
  const [category, setCategory] = useState<'idea' | 'subject' | 'ui' | 'community' | 'bug'>('idea')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const faqs = [
    {
      q: "Is Prevu officially affiliated with Chandigarh University?",
      a: "Prevu is an independent, non-profit, student-run academic project created by BE-CSE students at Chandigarh University to provide free, organized, high-speed access to study materials and question papers."
    },
    {
      q: "Are all question papers and notes free to download?",
      a: "Yes! Prevu is 100% free and open-access. There are zero paywalls, subscriptions, coin locks, or annoying popup ads."
    },
    {
      q: "How are submitted question papers verified?",
      a: "When a student uploads a paper, our senior moderation team inspects the document for legibility, accurate course code (e.g. 23CSH-242), semester, and exam year before it is approved."
    },
    {
      q: "Can I save question papers for offline reading?",
      a: "Yes! Prevu is a certified Progressive Web App (PWA). Click 'Save Offline' on any question paper to store it in your device's local vault, readable even when campus Wi-Fi drops."
    },
    {
      q: "How can I contribute my exam papers and notes?",
      a: "Click 'Upload Paper' in the header. Select your semester and course, attach the PDF or clear scans, and submit. You'll earn Scholar Karma and help hundreds of batchmates!"
    }
  ]

  const handleSuggestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return

    setIsSubmitting(true)
    setError(null)

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('message', message.trim())
    formData.append('category', category)

    try {
      const res = await submitStudentSuggestion(formData)
      if (res?.error) {
        setError(res.error)
      } else {
        setSubmitted(true)
        setTitle('')
        setMessage('')
        setTimeout(() => setSubmitted(false), 4000)
      }
    } catch {
      setError('Failed to submit suggestion. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-12 sm:py-16 border-b border-[#30363d]/60 bg-[#010409] font-mono relative overflow-hidden">
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Support &amp; Community Channels</span>
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked <span className="text-emerald-400">Questions.</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#7d8590] mt-1.5">
            Everything you need to know about verified question papers, exam simulators, and community channels.
          </p>
        </div>

        {/* 2-Column Split: FAQs Left, Community & Feedback Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: FAQ Accordion (7 Columns) */}
          <div className="lg:col-span-7 space-y-2.5">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx
              return (
                <div 
                  key={idx}
                  className="rounded-2xl bg-[#0d1117] border border-[#30363d] overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#161b22]/50 transition-colors"
                  >
                    <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                      <span className="text-emerald-400 font-mono text-xs">0{idx + 1}.</span>
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#7d8590] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="px-4 pb-4 pt-1 text-xs text-[#7d8590] leading-relaxed border-t border-[#30363d]/40">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          {/* Right Column: Channels + Suggestion Box (5 Columns) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Community Links Card */}
            <div className="p-4 rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-lg space-y-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                Connect With Batchmates
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <a 
                  href="https://chat.whatsapp.com/BpwkcISe9Cz327ud2T4IkF?s=cl&p=a&ilr=1&utm_source=ig&utm_medium=social&utm_content=link_in_bio" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-emerald-500/40 hover:text-white text-[#7d8590] transition-all flex items-center justify-between group"
                >
                  <span className="font-semibold text-[11px]">💬 WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-emerald-400" />
                </a>

                <a 
                  href="https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw==" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#161b22] border border-[#30363d] hover:border-pink-500/40 hover:text-white text-[#7d8590] transition-all flex items-center justify-between group"
                >
                  <span className="font-semibold text-[11px]">📸 @cu.exclusive</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:text-pink-400" />
                </a>
              </div>
            </div>

            {/* Student Suggestion Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0d1117] border border-[#30363d] shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-mono">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                  Have an Idea for Prevu?
                </span>
                <span className="text-[10px] text-[#7d8590] font-mono">Student Feedback</span>
              </div>

              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs text-center font-mono">
                  <Check className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                  <span>Thank you! Your feedback has been logged for our engineering team.</span>
                </div>
              ) : (
                <form onSubmit={handleSuggestionSubmit} className="space-y-2.5 font-mono text-xs">
                  {/* Category Pills */}
                  <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                      { id: 'idea', label: '💡 Idea' },
                      { id: 'subject', label: '📚 Missing Subject' },
                      { id: 'bug', label: '🐛 Bug' }
                    ].map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id as any)}
                        className={`px-2 py-0.5 rounded-md text-[10px] border transition-all shrink-0 ${
                          category === c.id
                            ? 'bg-[#21262d] text-emerald-400 border-emerald-500/40 font-bold'
                            : 'bg-[#161b22] text-[#7d8590] border-[#30363d] hover:text-white'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Short summary (e.g. Add 2024 DAA MST-2 solved paper)"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#161b22] border border-[#30363d] text-white text-xs placeholder:text-[#484f58] focus:outline-none focus:border-emerald-500/50"
                  />

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Details or link to notes..."
                    rows={2}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-[#161b22] border border-[#30363d] text-white text-xs placeholder:text-[#484f58] focus:outline-none focus:border-emerald-500/50 resize-none"
                  />

                  {error && (
                    <div className="text-[11px] text-rose-400">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 rounded-xl bg-[#238636] hover:bg-[#2ea44f] disabled:opacity-50 text-white font-bold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-[#238636]/30"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSubmitting ? 'Submitting...' : 'Send Feedback'}</span>
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
