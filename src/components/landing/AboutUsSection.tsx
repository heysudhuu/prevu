'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  BookOpen, 
  Heart, 
  ChevronDown, 
  HelpCircle,
  Zap,
  Users,
  CheckCircle2,
  Sparkles
} from 'lucide-react'

export default function AboutUsSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: "Is Prevu officially affiliated with Chandigarh University?",
      a: "Prevu is an independent, non-profit, student-run academic project created by BE-CSE students at Chandigarh University to provide free, organized, high-speed access to study materials and question papers."
    },
    {
      q: "Are all question papers and notes free to download?",
      a: "Yes! Prevu is 100% free and will always remain free. There are no paywalls, subscriptions, coin locks, or annoying popup ads."
    },
    {
      q: "How are submitted question papers verified?",
      a: "When a student uploads a paper, our moderation team inspects the document for legibility, accurate course code (e.g. 23CST-204), correct semester, and exam year before it is approved on the public vault."
    },
    {
      q: "Can I save question papers for offline reading?",
      a: "Yes! Prevu is a certified Progressive Web App (PWA). Click 'Save Offline' on any question paper to store it in your device's encrypted vault. You can read it during exams even when campus Wi-Fi drops completely."
    },
    {
      q: "How can I contribute my exam papers and notes?",
      a: "Click 'Upload Paper' in the top bar or mobile bottom menu. Select your semester and course, attach the PDF or clear scans, and submit. You'll receive +50 Scholar Karma and climb the university contributor leaderboard!"
    }
  ]

  return (
    <section className="py-24 bg-prevu-bg border-b border-prevu-surface-light relative overflow-hidden">
      
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl space-y-20 relative z-10">
        
        {/* Story & Mission Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Story &amp; Mission</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Built by CU students, <br className="hidden sm:block" />
            <span className="text-gradient-purple">for CU students.</span>
          </h2>

          <p className="text-sm sm:text-base text-prevu-text-muted leading-relaxed">
            Every exam week, thousands of engineering students scramble across ephemeral WhatsApp groups, expired Google Drive links, and blurry handheld photos moments before an assessment. We engineered <strong>Prevu</strong> to permanently solve information fragmentation at Chandigarh University.
          </p>
        </div>

        {/* 4 Core Guarantees & Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Zap,
              title: "100% Free Forever",
              desc: "No subscriptions, coin systems, or pay-to-unlock gates. Pure open academic knowledge for all students.",
              color: "text-purple-400 bg-purple-500/15 border-purple-500/30"
            },
            {
              icon: ShieldCheck,
              title: "Audited Quality",
              desc: "Every PDF is reviewed for clarity, correct subject codes, and complete page sequences before going live.",
              color: "text-emerald-400 bg-emerald-500/15 border-emerald-500/30"
            },
            {
              icon: BookOpen,
              title: "Exact CU Pattern",
              desc: "Strictly aligned with Chandigarh University’s MST 1, MST 2, and EST marking schemes and course weightage.",
              color: "text-amber-400 bg-amber-500/15 border-amber-500/30"
            },
            {
              icon: Users,
              title: "Peer Community",
              desc: "Crowdsourced and validated by high-scoring seniors and active peers across all CSE specializations.",
              color: "text-cyan-400 bg-cyan-500/15 border-cyan-500/30"
            }
          ].map((item, idx) => {
            const Icon = item.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="p-5 sm:p-6 rounded-3xl bg-prevu-surface/85 border border-prevu-surface-light hover:border-prevu-accent/40 transition-all shadow-xl space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center ${item.color} mb-3`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-prevu-text-muted leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Interactive FAQ Section */}
        <div className="space-y-6 max-w-3xl mx-auto pt-6">
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-surface border border-prevu-surface-light text-prevu-accent mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-prevu-text-muted">Everything you need to know about navigating and contributing to Prevu.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/90 overflow-hidden transition-all shadow-md"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-sm font-bold text-white hover:text-prevu-accent transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-prevu-text-muted shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-prevu-accent' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-0 text-xs text-prevu-text-muted leading-relaxed border-t border-prevu-surface-light/40">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
