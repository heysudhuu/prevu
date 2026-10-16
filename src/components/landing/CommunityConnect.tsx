'use client'

import { useState } from 'react'
import { ArrowUpRight, Users, Share2, Copy, Check, Sparkles, MessageCircle, Heart } from 'lucide-react'

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
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

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
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
    const shareMessage = `📚 *Prevu - Chandigarh University Academic Vault*\nAccess verified question papers (MST-1, MST-2, EST), topper notes, and syllabus blueprints: ${siteUrl}\n\nJoin student community:\n📸 @cu.exclusive: ${instagramUrl}\n📢 @cuupdates1: ${cuUpdatesUrl}\n💬 WhatsApp Community: ${whatsappUrl}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`, '_blank')
  }

  return (
    <section className="py-24 bg-[#09090e] border-b border-prevu-surface-light relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-pink-600/10 via-purple-600/10 to-emerald-600/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 max-w-6xl relative z-10 space-y-12">
        
        {/* Live Broadcast Ticker */}
        <div className="w-full max-w-3xl mx-auto rounded-full bg-prevu-surface/80 border border-prevu-surface-light px-4 py-2 flex items-center justify-between gap-3 text-xs shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            <span className="font-mono font-bold uppercase tracking-wider text-rose-400 text-[10px]">
              Active Broadcast
            </span>
          </div>

          <div className="overflow-hidden whitespace-nowrap text-prevu-text-muted text-xs truncate flex-1 text-center sm:text-left">
            <span className="text-white font-medium">🔥 2024-2025 MST &amp; End-Term Question Papers Active in Vault</span>
            <span className="mx-2 text-white/30">•</span>
            <span>Follow <strong className="text-purple-300">@cuupdates1</strong> &amp; <strong className="text-pink-300">@cu.exclusive</strong> for alerts</span>
          </div>

          <a 
            href={cuUpdatesUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-prevu-accent hover:text-white transition-colors shrink-0"
          >
            <span>Alerts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-300 border border-pink-500/30 uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Community Channels</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Connect with the Student Community
          </h2>

          <p className="text-xs sm:text-sm text-prevu-text-muted leading-relaxed">
            Join the official Chandigarh University peer networks for instant exam circulars, question paper drops, and batchmate discussions.
          </p>
        </div>

        {/* 3 Community Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* INSTAGRAM CARD */}
          <div className="p-6 sm:p-7 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-pink-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform">
                <InstagramIcon className="w-6 h-6" />
              </div>

              <div>
                <div className="text-[10px] font-mono text-pink-400 font-bold uppercase tracking-wider">
                  Campus Social
                </div>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  @cu.exclusive
                </h3>
              </div>

              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Follow for exam notifications, semester prep advice, question paper drops, campus circulars, and student discussions.
              </p>
            </div>

            <a 
              href={instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-pink-500/15 hover:bg-pink-500/25 border border-pink-500/30 text-pink-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4 shrink-0 text-pink-400" />
              <span>Follow on Instagram</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* CU UPDATES COLLABORATION CARD */}
          <div className="p-6 sm:p-7 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-purple-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                <InstagramIcon className="w-6 h-6" />
              </div>

              <div>
                <div className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider">
                  Partner Network
                </div>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  @cuupdates1
                </h3>
              </div>

              <p className="text-xs text-prevu-text-muted leading-relaxed">
                In collaboration with CU Updates. Follow for verified university circulars, urgent administrative notifications, and datesheets.
              </p>
            </div>

            <a 
              href={cuUpdatesUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/30 text-purple-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4 shrink-0 text-purple-400" />
              <span>Follow @cuupdates1</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

          {/* WHATSAPP COMMUNITY CARD */}
          <div className="p-6 sm:p-7 rounded-3xl bg-prevu-surface/90 border border-prevu-surface-light hover:border-emerald-500/50 transition-all duration-300 shadow-xl flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <WhatsAppIcon className="w-6 h-6" />
              </div>

              <div>
                <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">
                  Student Channel
                </div>
                <h3 className="text-xl font-extrabold text-white mt-0.5">
                  CU Community Hub
                </h3>
              </div>

              <p className="text-xs text-prevu-text-muted leading-relaxed">
                Join our student WhatsApp group to request missing question papers, share notes directly, and solve doubts with batchmates.
              </p>
            </div>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-200 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Join WhatsApp Community</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
            </a>
          </div>

        </div>

        {/* Share Prevu with Classmates Bar */}
        <div className="p-4 sm:p-5 rounded-2xl bg-prevu-surface border border-prevu-surface-light flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-prevu-accent/15 border border-prevu-accent/30 flex items-center justify-center text-prevu-accent shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-white">Share Prevu with your class WhatsApp group</h4>
              <p className="text-[11px] text-prevu-text-muted">Help your batchmates find verified MST &amp; EST question papers.</p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl border border-prevu-surface-light hover:border-prevu-accent/40 bg-prevu-surface-light/60 text-xs font-semibold text-prevu-text hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link!' : 'Copy Link'}</span>
            </button>
            <button
              type="button"
              onClick={handleShareToWhatsApp}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-600/30"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Share to WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
