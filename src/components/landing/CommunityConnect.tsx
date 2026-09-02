'use client'

import { ArrowUpRight, Users } from 'lucide-react'

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
  const instagramUrl = "https://www.instagram.com/cu.exclusive?igsi=ZDNlZDc0MzIxNw=="
  const whatsappUrl = "https://chat.whatsapp.com/BpwkcISe9Cz327ud2T4IkF?s=cl&p=a&ilr=1&utm_source=ig&utm_medium=social&utm_content=link_in_bio"

  return (
    <section className="py-24 bg-prevu-bg border-t border-prevu-surface-light relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-emerald-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl relative z-10 space-y-12">
        
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
            Have questions, want paper notifications in real-time, or want to share notes? Join our official student channels on Instagram and WhatsApp!
          </p>
        </div>

        {/* 2 Big Community Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* INSTAGRAM CARD */}
          <div className="relative group rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-pink-950/20 via-prevu-surface to-prevu-surface border border-pink-500/30 hover:border-pink-500/60 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between space-y-6 hover:-translate-y-1">
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
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-pink-500/20 hover:shadow-pink-500/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <InstagramIcon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Follow on Instagram</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 opacity-80" />
            </a>
          </div>

          {/* WHATSAPP COMMUNITY CARD */}
          <div className="relative group rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/20 via-prevu-surface to-prevu-surface border border-emerald-500/30 hover:border-emerald-500/60 transition-all duration-300 shadow-xl overflow-hidden flex flex-col justify-between space-y-6 hover:-translate-y-1">
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
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 transition-all duration-200"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0" />
              <span className="whitespace-nowrap">Join WhatsApp Community</span>
              <ArrowUpRight className="w-4 h-4 shrink-0 opacity-80" />
            </a>
          </div>

        </div>

      </div>
    </section>
  )
}
