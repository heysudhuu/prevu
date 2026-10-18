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
    <section className="py-28 border-b border-prevu-surface-light relative overflow-hidden" style={{ background: '#07070c' }}>
      
      {/* Background */}
      <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 pointer-events-none"
           style={{ width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(139,92,246,0.10), transparent)', filter: 'blur(100px)' }} />

      <div className="container mx-auto px-4 max-w-5xl space-y-20 relative z-10">
        
        {/* Story & Mission Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-prevu-accent/10 text-prevu-accent border border-prevu-accent/25 uppercase tracking-wider mb-4">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Story &amp; Mission</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
            Built by CU students,{' '}
            <span className="text-gradient-purple">for CU students.</span>
          </h2>

          <p className="text-sm sm:text-base text-prevu-text-muted leading-relaxed">
            Every exam week, thousands of engineering students scramble across ephemeral WhatsApp groups, expired Google Drive links, and blurry handheld photos moments before an assessment. We engineered <strong className="text-white/90">Prevu</strong> to permanently solve information fragmentation at Chandigarh University.
          </p>
        </div>

        {/* 4 Core Guarantees & Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: Zap,
              title: "100% Free Forever",
              desc: "No subscriptions, coin systems, or pay-to-unlock gates. Pure open academic knowledge for all students.",
              iconBg: "bg-purple-500/15 border-purple-500/25",
              iconColor: "text-purple-400"
            },
            {
              icon: ShieldCheck,
              title: "Audited Quality",
              desc: "Every PDF is reviewed for clarity, correct subject codes, and complete page sequences before going live.",
              iconBg: "bg-emerald-500/15 border-emerald-500/25",
              iconColor: "text-emerald-400"
            },
            {
              icon: BookOpen,
              title: "Exact CU Pattern",
              desc: "Strictly aligned with Chandigarh University's MST 1, MST 2, and EST marking schemes and course weightage.",
              iconBg: "bg-amber-500/15 border-amber-500/25",
              iconColor: "text-amber-400"
            },
            {
              icon: Users,
              title: "Peer Community",
              desc: "Crowdsourced and validated by high-scoring seniors and active peers across all CSE specializations.",
              iconBg: "bg-cyan-500/15 border-cyan-500/25",
              iconColor: "text-cyan-400"
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
                className="p-5 sm:p-6 rounded-3xl bg-prevu-surface/70 border border-prevu-surface-light hover:border-prevu-accent/40 transition-all duration-300 shadow-xl flex flex-col gap-3 card-hover-lift"
              >
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${item.iconBg} ${item.iconColor} mb-1`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-prevu-text-muted leading-relaxed">{item.desc}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Interactive FAQ Section */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-prevu-surface border border-prevu-surface-light text-prevu-accent mb-4">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Got Questions?</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mb-2">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-prevu-text-muted">Everything you need to know about navigating and contributing to Prevu.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl border transition-all duration-300 shadow-md overflow-hidden ${
                  openFaq === idx
                    ? 'border-prevu-accent/30 bg-prevu-surface/90'
                    : 'border-prevu-surface-light bg-prevu-surface/60 hover:border-prevu-surface-elevated'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-sm font-bold text-white hover:text-prevu-accent transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-300 ${openFaq === idx ? 'rotate-180 text-prevu-accent' : 'text-prevu-text-muted'}`} />
                </button>

                <AnimatePresence initial={false}>
                  {openFaq === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-0 text-sm text-prevu-text-muted leading-relaxed border-t border-prevu-surface-light/30">
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
