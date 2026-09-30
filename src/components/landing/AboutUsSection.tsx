'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShieldCheck, 
  BookOpen, 
  Heart, 
  ChevronDown, 
  ChevronUp,
  HelpCircle,
  Zap,
  Users
} from 'lucide-react'

export default function AboutUsSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const faqs = [
    {
      q: "Is Prevu officially affiliated with Chandigarh University?",
      a: "Prevu is an independent, non-profit, student-run academic project created by BE-CSE students at Chandigarh University to provide free, organized access to study materials and question papers."
    },
    {
      q: "Are all question papers and notes free to download?",
      a: "Yes! Prevu is 100% free and will always remain free. There are no paywalls, subscriptions, coin locks, or annoying popup ads."
    },
    {
      q: "How are submitted question papers verified?",
      a: "When a student or peer uploads a paper, our admin and moderator team inspects the document for legibility, accurate subject code, correct semester, and exam year before it goes live on the archive."
    },
    {
      q: "How can I contribute my exam papers and notes?",
      a: "Simply click the 'Upload' button in the navigation bar or dashboard, select your semester and subject, attach your PDF or clear images, and submit! Verified contributions help hundreds of your batchmates."
    }
  ]

  return (
    <section className="py-24 bg-prevu-bg border-t border-prevu-surface-light relative overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl space-y-20 relative z-10">
        
        {/* Story & Mission Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-prevu-accent/15 text-prevu-accent border border-prevu-accent/30 uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5" />
            <span>Our Story & Mission</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Built by CU students, <br className="hidden sm:block" />
            <span className="text-gradient-purple">for CU students.</span>
          </h2>

          <p className="text-base sm:text-lg text-prevu-text-muted leading-relaxed">
            Every exam week, thousands of students scramble across cluttered WhatsApp groups, dead Google Drive links, and messy Telegram chats just to find a single past MST question paper. We built <strong>Prevu</strong> to fix this forever.
          </p>
        </div>

        {/* 4 Core Guarantees & Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.05 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-purple-500/40 transition-colors space-y-3 shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">100% Free Forever</h3>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              No paywalls, subscriptions, or pay-to-unlock coin gates. Pure open academic knowledge for all.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-emerald-500/40 transition-colors space-y-3 shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">Verified Quality</h3>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              Every single paper and document is reviewed for clarity and correctness before going live on the archive.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.25 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-amber-500/40 transition-colors space-y-3 shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">Exact CU Blueprint</h3>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              Mapped directly to Chandigarh University’s official MST 1, MST 2, and EST question patterns.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.35 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="p-6 rounded-2xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-cyan-500/40 transition-colors space-y-3 shadow-lg group"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">Student Community</h3>
            <p className="text-xs text-prevu-text-muted leading-relaxed">
              Maintained and powered by peer contributions from every semester and engineering specialization.
            </p>
          </motion.div>

        </div>

        {/* Interactive FAQ Section */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <h3 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-5 h-5 text-prevu-accent" />
              Frequently Asked Questions
            </h3>
            <p className="text-xs text-prevu-text-muted">Everything you need to know about using and contributing to Prevu.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-prevu-surface-light bg-prevu-surface/80 overflow-hidden transition-all shadow-md"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 text-sm font-semibold text-prevu-text hover:text-prevu-accent transition-colors"
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
                      <div className="px-4 pb-4 pt-1 text-xs text-prevu-text-muted leading-relaxed border-t border-prevu-surface-light/40">
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
