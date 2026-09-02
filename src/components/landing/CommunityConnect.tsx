'use client'

import { useState } from 'react'
import { ArrowUpRight, Users, Share2, Copy, Check, Sparkles, Handshake } from 'lucide-react'

function InstagramIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function WhatsAppIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.28-2.42 5.84a8.18 8.18 0 0 1-5.82 2.41c-1.44 0-2.86-.38-4.11-1.11l-.3-.18-3.12.82.83-3.04-.19-.31a8.21 8.21 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.24-.75-.67-1.26-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.14-1.18-.05-.1-.21-.16-.46-.28z"/>
    </svg>
  )
}

export default function CommunityConnect() {
  const [copied, setCopied] = useState(false)

  const instagramUrl = "https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw=="
  const cuUpdatesUrl = "https://www.instagram.com/cuupdates1?igsi=MTltajU5cGM2YXBwag=="
  const whatsappUrl = "https://chat.whatsapp.com/BpwkcISe9Cz327ud2T4IkF?s=cl&p=a&ilr=1&utm_source=ig&utm_medium=social&utm_content=link_in_bio"

  const handleCopyLink = async () => {
    try {
      const url = typeof window !== 'undefined' ? window.location.href : 'https://prevu.in'
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
    }
  }

  const handleShareToWhatsApp = () => {
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://prevu.in'
    const shareMessage = `📚 *Prep for CU Exams with Prevu!*\nCheck out Chandigarh University's academic vault for past year MST & End-Term question papers, study notes, and circulars: ${siteUrl}\n\nJoin student channels:\n📸 @cu.exclusive: ${instagramUrl}\n📢 @cuupdates1: ${cuUpdatesUrl}\n💬 WhatsApp Community: ${whatsappUrl}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank')
  }

  return (
    <section className="py-24 bg-prevu-bg border-t border-prevu-surface-light relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-gradient-to-r from-pink-600/10 via-indigo-600/10 to-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 space-y-12">
        
        {/* Feature 5: Live Broadcast Ticker */}
        <div className="w-full max-w-3xl mx-auto rounded-full bg-gradient-to-r from-rose-500/10 via-indigo-500/10 to-emerald-500/10 border border-white/10 px-4 py-2 flex items-center justify-between gap-3 text-xs shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-mono font-bold uppercase tracking-wider text-rose-400 text-[11px]">
              Live Alert
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap text-prevu-text-muted text-xs truncate flex-1 text-center sm:text-left">
            <span className="text-white font-medium">🔥 2024-2025 MST & End-Term Question Papers Updated</span>
            <span className="mx-2 text-white/30">•</span>
            <span>Follow <strong className="text-indigo-300">@cuupdates1</strong> & <strong className="text-pink-300">@cu.exclusive</strong> for real-time alerts</span>
          </div>

          <a 
            href={cuUpdatesUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-indigo-300 hover:text-white transition-colors shrink-0"
          >
            <span>View Alerts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Official Student Channels</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect directly with the creators & CU community
          </h2>

          <p className="text-sm text-prevu-text-muted leading-relaxed">
            Have questions, want paper notifications in real-time, or want to stay updated with campus circulars? Join our official channels and collaborating partners!
          </p>
        </div>

        {/* 3 Community Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* INSTAGRAM CARD */}
          <div className="relative group rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-pink-950/20 via-prevu-surface to-prevu-surface border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between space-y-6 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-pink-500/25">
                <InstagramIcon className="w-7 h-7" />
              </div>

              <div>
                <div className="text-xs font-mono text-pink-400 font-bold uppercase tracking-wider">
                  Official Instagram
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                  <span>@cu.exclusive</span>
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
                Follow for instant exam notifications, semester prep advice, question paper drops, campus memes, and student discussions.
              </p>
            </div>

            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Follow on Instagram</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 opacity-80" />
            </a>
          </div>

          {/* CU UPDATES COLLABORATION CARD */}
          <div className="relative group rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-indigo-950/25 via-prevu-surface to-prevu-surface border border-indigo-500/30 hover:border-indigo-500/60 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between space-y-6 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
                <InstagramIcon className="w-7 h-7" />
              </div>

              <div>
                <div className="text-xs font-mono text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <span>🤝 Collaboration</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                  <span>CU Updates</span>
                </h3>
                <div className="text-xs text-indigo-300/80 font-mono mt-0.5 font-semibold">
                  @cuupdates1
                </div>
              </div>

              <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
                In collaboration with CU Updates. Follow for verified university news, urgent notifications, exam circulars, and campus announcements.
              </p>
            </div>

            <a 
              href={cuUpdatesUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#4f46e5] via-[#7c3aed] to-[#db2777] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Follow @cuupdates1</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 opacity-80" />
            </a>
          </div>

          {/* WHATSAPP COMMUNITY CARD */}
          <div className="relative group rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-emerald-950/20 via-prevu-surface to-prevu-surface border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between space-y-6 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="space-y-4 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                <WhatsAppIcon className="w-7 h-7" />
              </div>

              <div>
                <div className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  WhatsApp Student Channel
                </div>
                <h3 className="text-2xl font-extrabold text-white mt-0.5 flex items-center gap-2">
                  <span>CU Community Hub</span>
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
                Join our active student group to discuss tough exam questions, share notes directly, request missing papers, and stay connected.
              </p>
            </div>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Join WhatsApp Community</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 opacity-80" />
            </a>
          </div>

        </div>

        {/* Feature 3: One-Click Share with Class / Batchmates */}
        <div className="rounded-2xl p-4 sm:p-5 bg-prevu-surface/70 border border-prevu-surface-light backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Help your batchmates ace their exams!</h4>
              <p className="text-xs text-prevu-text-muted">Share Prevu question papers & student channels directly with your section WhatsApp group.</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
            <button
              onClick={handleShareToWhatsApp}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <WhatsAppIcon className="w-4 h-4" />
              <span>Share to WhatsApp</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-prevu-text-muted" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Feature 4: Partner & Society Outreach CTA */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-purple-950/30 via-prevu-surface to-indigo-950/30 border border-purple-500/25 shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 uppercase tracking-wider">
              <Handshake className="w-3.5 h-3.5" />
              <span>Creator & Society Network</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              Run a CU Student Page, Tech Society, or Club?
            </h3>
            <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
              Partner with Prevu & our network to co-host study resources, broadcast urgent academic circulars, and support thousands of CU engineering students.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap justify-center">
            <a
              href="https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all duration-200 hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Partner With Us</span>
              <ArrowUpRight className="w-4 h-4 opacity-80" />
            </a>
          </div>
        </div>

      </div>
    </section>
  )
}
