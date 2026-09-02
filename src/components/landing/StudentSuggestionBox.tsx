'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { submitStudentSuggestion } from '@/app/suggestions/actions'
import { 
  Lightbulb, 
  Sparkles, 
  Send, 
  AlertCircle, 
  MessageSquarePlus, 
  Loader2, 
  User, 
  Mail 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StudentSuggestionBox() {
  const [category, setCategory] = useState<'idea' | 'subject' | 'ui' | 'community' | 'bug'>('idea')
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const categories = [
    { id: 'idea', label: '💡 New Feature Idea' },
    { id: 'subject', label: '📚 Missing Subject / Papers' },
    { id: 'ui', label: '🎨 Design & UI Tweak' },
    { id: 'community', label: '🚀 Community Initiative' },
    { id: 'bug', label: '🐛 Report a Glitch' },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    const formData = new FormData()
    formData.append('title', title.trim())
    formData.append('message', message.trim())
    formData.append('category', category)
    if (name.trim()) formData.append('name', name.trim())
    if (email.trim()) formData.append('email', email.trim())

    const res = await submitStudentSuggestion(formData)

    setIsSubmitting(false)

    if (res.error) {
      setError(res.error)
    } else {
      setSubmitted(true)
      setTitle('')
      setMessage('')
    }
  }

  return (
    <section className="py-24 bg-gradient-to-b from-prevu-bg via-prevu-surface/50 to-prevu-bg border-t border-prevu-surface-light relative overflow-hidden">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-prevu-accent/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        
        {/* Section Heading */}
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-wider mb-2">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Student Idea & Feedback Box</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Have an idea to make Prevu even better?
          </h2>
          <p className="text-sm text-prevu-text-muted max-w-xl mx-auto">
            Prevu is 100% student-built. Drop your suggestions, feature requests, or missing course ideas below — we review every single submission!
          </p>
        </div>

        {/* Suggestion Card */}
        <Card className="border-prevu-surface-light bg-prevu-surface/90 backdrop-blur-xl shadow-2xl overflow-hidden">
          <CardContent className="p-6 sm:p-8">
            
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="py-12 text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto text-2xl shadow-lg shadow-emerald-500/20">
                    🎉
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white">
                    Thank you for your suggestion!
                  </h3>
                  
                  <p className="text-sm text-prevu-text-muted max-w-md mx-auto leading-relaxed">
                    Your idea has been sent directly to the student team. Together, we are making study preparation seamless for every engineer at Chandigarh University!
                  </p>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSubmitted(false)}
                    className="mt-4 border-prevu-surface-light text-xs"
                  >
                    Submit Another Idea
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Category Selector Chips */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-prevu-text-muted">
                      What is your suggestion about?
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                      {categories.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          onClick={() => setCategory(c.id as any)}
                          className={`p-3 rounded-xl border text-xs font-medium text-left transition-all flex flex-col justify-between ${
                            category === c.id
                              ? 'bg-prevu-accent text-white border-prevu-accent shadow-md shadow-prevu-accent/25'
                              : 'bg-prevu-bg border-prevu-surface-light text-prevu-text-muted hover:text-prevu-text hover:border-prevu-surface-light/80'
                          }`}
                        >
                          <span className="font-semibold text-xs">{c.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Suggestion Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-prevu-text-muted flex items-center gap-1.5" htmlFor="title">
                      <Sparkles className="w-3.5 h-3.5 text-prevu-accent" /> Idea / Feature Summary
                    </label>
                    <input 
                      type="text"
                      id="title"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="e.g. Add 1-click Semester Question Paper ZIP Bundle or AI formula sheet"
                      required
                      className="w-full px-4 py-3 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent transition-colors"
                    />
                  </div>

                  {/* Detailed Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-prevu-text-muted flex items-center gap-1.5" htmlFor="message">
                      <MessageSquarePlus className="w-3.5 h-3.5 text-prevu-accent" /> Tell us more about it
                    </label>
                    <textarea 
                      id="message"
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Explain how this feature or improvement will help you and other Chandigarh University students..."
                      rows={3}
                      required
                      className="w-full px-4 py-3 bg-prevu-bg border border-prevu-surface-light rounded-xl text-sm text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent transition-colors"
                    />
                  </div>

                  {/* Optional Name and Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-prevu-text-muted flex items-center gap-1.5" htmlFor="student-name">
                        <User className="w-3.5 h-3.5 text-prevu-accent" /> Your Name / Handle (Optional)
                      </label>
                      <input 
                        type="text"
                        id="student-name"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Student Name (@handle)"
                        className="w-full px-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent transition-colors"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-prevu-text-muted flex items-center gap-1.5" htmlFor="student-email">
                        <Mail className="w-3.5 h-3.5 text-prevu-accent" /> Email / UID (Optional)
                      </label>
                      <input 
                        type="text"
                        id="student-email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="e.g. 23bcsXXXX@cuchd.in"
                        className="w-full px-4 py-2.5 bg-prevu-bg border border-prevu-surface-light rounded-xl text-xs text-prevu-text placeholder:text-prevu-text-muted/40 focus:outline-none focus:border-prevu-accent transition-colors"
                      />
                    </div>
                  </div>

                  {/* Error display */}
                  {error && (
                    <div className="p-3.5 bg-red-500/10 border border-red-500/25 rounded-xl text-xs text-red-400 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-2.5 text-sm flex items-center justify-center gap-2 shadow-lg shadow-prevu-accent/25 font-bold"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Sending Idea...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Suggestion</span>
                        </>
                      )}
                    </Button>
                  </div>

                </form>
              )}
            </AnimatePresence>

          </CardContent>
        </Card>

      </div>
    </section>
  )
}
